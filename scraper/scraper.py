import json
import re
import time
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

DELAY = 1

session = requests.Session()


# default years to scrape
DEFAULT_YEARS = ["2025"]


def year_base(year: str) -> str:
    """Return the base URL for a given Blood Bowl year.

    Examples:
        2025 -> https://bloodbowlbase.ru/bb2025
        2020 -> https://bloodbowlbase.ru/bb2020
    """
    return f"https://bloodbowlbase.ru/bb{year}"


def team_index(year: str) -> str:
    """Return the team index URL for a given year."""
    return f"{year_base(year)}/core_rules/the_teams/"


def soup(url: str) -> BeautifulSoup:
    r = session.get(url)
    r.raise_for_status()
    # print(f"Fetched {url} (status: {r.status_code})")
    # print(r)
    return BeautifulSoup(r.text, "lxml")


# -----------------------------
# Utility
# -----------------------------

def cost_to_int(text):
    if not text:
        return None
    m = re.search(r"(\d+)", text)
    if not m:
        return None
    return int(m.group(1)) * 1000


def split_list(text):
    # Normalize bullet-delimited, comma-separated, or space-separated lists.
    # Examples:
    #   "•Dodge•Right Stuff•Thick Skull" -> ["Dodge","Right Stuff","Thick Skull"]
    #   "A D" -> ["A","D"]
    if not text:
        return []
    # replace bullets with comma so the next split catches them
    cleaned = text.replace("•", ",")
    # if the original text contains bullets or commas, treat them as delimiters
    if "•" in text or "," in text:
        parts = [x.strip() for x in cleaned.split(",") if x.strip()]
        return parts
    # otherwise, split on whitespace
    return [x for x in text.split() if x]


def parse_position(text):
    """
    Goblin Bruiser (Lineman, Goblin)
    ->
    name: Goblin Bruiser
    tags: [Lineman, Goblin]
    """

    m = re.match(r"(.*?)\s*\((.*?)\)", text)

    if not m:
        return text.strip(), []

    name = m.group(1).strip()
    tags = split_list(m.group(2))

    return name, tags


def normalize_whitespace(text):
    """Normalize spacing while preserving intentional line breaks from the source."""
    if not text:
        return ""

    cleaned = str(text).replace("\xa0", " ").replace("\r\n", "\n").replace("\r", "\n")
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r" *\n *", "\n", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def display_name(name):
    """Convert all-caps rule headings into display-friendly title case."""
    text = name.strip().rstrip("*")
    if not text:
        return text

    parts = []
    for chunk in re.split(r"(\s+|&|-|\()", text):
        if not chunk:
            continue
        if chunk.isspace() or chunk in {"&", "-", "("}:
            parts.append(chunk)
            continue
        if chunk.endswith(")"):
            body = chunk[:-1]
            if body:
                literal = body if body.isdigit() else body[0].upper() + body[1:].lower()
                parts.append(literal + ")")
            continue
        lowered = chunk.lower()
        if lowered in {"and", "or", "of"}:
            parts.append(lowered)
        else:
            parts.append(chunk[0].upper() + chunk[1:].lower())

    return "".join(parts).strip()


def parse_skill_heading(text):
    """Parse a heading like 'STAB (ACTIVE)' or 'ANIMOSITY (X)* (ACTIVE)'"""
    cleaned = normalize_whitespace(text)
    match = re.search(r"\((ACTIVE|PASSIVE)\)\s*$", cleaned, flags=re.IGNORECASE)
    if not match:
        return cleaned, None

    name = cleaned[:match.start()].strip().rstrip("*").strip()
    return display_name(name), match.group(1).lower()


def extract_skill_entries(doc):
    """Collect skill/trait entries from the rules page, preserving wrapped text."""
    entries = []

    for heading in doc.find_all(["h3", "h4"]):
        raw_heading = heading.get_text(" ", strip=True)
        name, skill_type = parse_skill_heading(raw_heading)

        if not skill_type or not name:
            continue

        description_parts = []
        sibling = heading.find_next_sibling()

        while sibling is not None and sibling.name not in ["h1", "h2", "h3", "h4"]:
            text = normalize_whitespace(sibling.get_text("\n", strip=True))
            if text:
                description_parts.append(text)
            sibling = sibling.find_next_sibling()

        description = "\n\n".join(part for part in description_parts if part)
        if description:
            entries.append({
                "name": name,
                "type": skill_type,
                "description": description
            })

    return entries


# -----------------------------
# Player Table
# -----------------------------

def parse_players(soup):
    table = soup.find("table")
    players = []

    if not table:
        return players

    rows = table.find_all("tr")[1:]

    for row in rows:
        cols = []
        for cell in row.find_all("td"):
            for deleted in cell.find_all("del"):
                deleted.extract()
            cols.append(cell.get_text(strip=True))

        if len(cols) < 11:
            continue

        pos, tags = parse_position(cols[1])

        players.append({
            "max_quantity": int(cols[0][2:]),
            "position": pos,
            "tags": tags,
            "MA": cols[2],
            "ST": cols[3],
            "AG": cols[4],
            "PA": cols[5],
            "AV": cols[6],
            "skills": split_list(cols[7]),
            "primary": split_list(cols[8]),
            "secondary": split_list(cols[9]),
            "cost": cost_to_int(cols[10])
        })

    return players


# -----------------------------
# Generic section parser
# -----------------------------

def parse_dash_list(start):
    """
    Parses:
    Name - Cost
    """

    items = []
    el = start.find_next_sibling()

    while el and el.name not in ["h1", "h2", "h3"]:
        txt = el.get_text(strip=True)

        if "-" in txt:
            name, cost = txt.split("-", 1)

            items.append({
                "name": name.strip(),
                "cost": cost_to_int(cost)
            })

        el = el.find_next_sibling()

    return items


def parse_staff(start):

    staff = {}

    el = start.find_next_sibling()

    while el and el.name not in ["h1", "h2", "h3"]:
        txt = el.get_text(strip=True)

        if "-" in txt:
            name, cost = txt.split("-", 1)

            key = name.lower()
            key = key.replace(" ", "_").replace("-", "_")

            staff[key] = cost_to_int(cost)

        el = el.find_next_sibling()

    return staff


# -----------------------------
# Team metadata
# -----------------------------

def find_header(soup, text):

    for h in soup.find_all(["h2", "h3", "strong", "b"]):

        if text.lower() in h.get_text().lower():
            return h

    return None


def parse_league(soup):

    txt = soup.get_text("\n")

    m = re.search(r"League\s*\n\s*(.+)", txt)

    if m:
        return m.group(1).strip()

    return None


def parse_special_rules(soup):

    txt = soup.get_text("\n")

    m = re.search(r"Special Rules\s*\n((?:.+\n)+?)\n", txt)

    if not m:
        return []

    return [r.strip() for r in m.group(1).split("\n") if r.strip()]


def parse_reroll_cost(soup):
    txt = soup.get_text("\n")
    m = re.search(r"(?:Team\s+)?Re-?rolls?\s*[-:]\s*([^\n]+)", txt, re.IGNORECASE)
    return cost_to_int(m.group(1)) if m else None


# -----------------------------
# Star player detail page
# -----------------------------

def parse_star_player_page(url):

    s = soup(url)

    title = s.find("h1")

    name = title.get_text(strip=True) if title else None

    table = s.find("table")

    stats = {}

    if table:

        rows = table.find_all("tr")

        if len(rows) > 1:

            cells = [c.get_text(strip=True) for c in rows[1].find_all("td")]

            if len(cells) >= 7:

                stats = {
                    "MA": int(cells[0]),
                    "ST": int(cells[1]),
                    "AG": cells[2],
                    "PA": cells[3],
                    "AV": cells[4],
                    "skills": split_list(cells[5]),
                    "cost": cost_to_int(cells[6])
                }

    return {
        "name": name,
        "url": url,
        "stats": stats
    }


# -----------------------------
# Team Page
# -----------------------------

def parse_team(url):

    s = soup(url)

    title = s.find("h1")
    name = title.get_text(strip=True)

    players = parse_players(s)
    reroll_cost = parse_reroll_cost(s)
    if reroll_cost is None:
        raise ValueError(f"Could not find reroll cost for {url}")

    league = parse_league(s)
    special = parse_special_rules(s)

    staff = {}
    stars = []
    inducements = []

    staff_h = find_header(s, "Staff")
    if staff_h:
        staff = parse_staff(staff_h)

    star_h = find_header(s, "Star Players")
    if star_h:
        stars = parse_dash_list(star_h)

    ind_h = find_header(s, "Inducements")
    if ind_h:
        inducements = parse_dash_list(ind_h)

    return {
        "name": name,
        "reroll_cost": reroll_cost,
        "league": league,
        "special_rules": special,
        "players": players,
        "staff": staff,
        "star_players": stars,
        "inducements": inducements
    }


# -----------------------------
# Discover teams
# -----------------------------

def discover_teams(year: str):
    url = team_index(year)
    print(url)
    s = soup(url)
    links = []
    for a in s.find_all("a", href=True):
        href = a["href"]
        print("Found link:", href)
        if "/teams/" in href:
            # fix relative paths by joining against the year-specific base
            url = urljoin(year_base(year), href.replace("../..", f"bb{year}"))
            print("Resolved URL:", url)
            name = a.get_text(strip=True)
            if name and (name, url) not in links:
                links.append((name, url))
    return links


# -----------------------------
# Main
# -----------------------------

def _test_split_list():
    # basic unit tests for split_list
    assert split_list(None) == []
    assert split_list("") == []
    assert split_list("Dodge, Pass") == ["Dodge", "Pass"]
    assert split_list("•Dodge•Right Stuff•Thick Skull") == ["Dodge", "Right Stuff", "Thick Skull"]
    assert split_list("A D") == ["A", "D"]
    assert split_list("G P S") == ["G", "P", "S"]
    print("split_list tests passed")


def scrape_year(year: str) -> list:
    """Scrape and return list of teams for the given year."""
    teams = []
    team_links = discover_teams(year)
    print("Found", len(team_links), "teams for", year)

    for name, url in team_links:
        print("Scraping team:", name)
        try:
            team = parse_team(url)
            teams.append(team)
        except Exception as e:
            print("Error:", e)
        time.sleep(DELAY)
    return teams


def scrape_skills(year: str):
    """Scrape the Skills & Traits page for the given year."""
    url = f"{year_base(year)}/core_rules/skills_and_traits/"
    page = soup(url)
    entries = extract_skill_entries(page)
    return {
        "year": year,
        "url": url,
        "skills": entries,
    }


def main(years=None):
    if years is None:
        years = DEFAULT_YEARS
    all_data = {}
    for year in years:
        teams = scrape_year(year)
        filename = f"teams_{year}.json"
        data = {"teams": teams}
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved {filename}")
        all_data[year] = teams

        skills_data = scrape_skills(year)
        skills_filename = f"skills_{year}.json"
        with open(skills_filename, "w", encoding="utf-8") as f:
            json.dump(skills_data, f, indent=2, ensure_ascii=False)
        print(f"Saved {skills_filename}")
        all_data[f"{year}_skills"] = skills_data
    return all_data


if __name__ == "__main__":
    # _test_split_list()
    # allow specifying comma-separated years via command line
    import sys
    years = None
    if len(sys.argv) > 1:
        years = sys.argv[1].split(",")
    main(years)