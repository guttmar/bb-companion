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

def star_id(name):
    """Return the stable catalog ID used for a star-player name."""
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", name.lower()))


def parse_dash_list(start, base_url=None):
    """
    Parses:
    Name - Cost
    """

    items = []
    el = start.find_next_sibling()

    while el and el.name not in ["h1", "h2", "h3", "strong", "b"]:
        entries = el.find_all("li") if el.name in ["ul", "ol"] else [el]
        for entry in entries:
            text = entry.get_text(" ", strip=True)
            match = re.match(r"^(.*?)\s+-\s+(\d[\d,]*)\s*[Kk]?\s*$", text)
            if not match:
                continue

            name = match.group(1).strip()
            item = {
                "id": star_id(name),
                "name": name,
                "cost": cost_to_int(match.group(2))
            }
            link = entry.find("a", href=True)
            if link and base_url:
                item["url"] = urljoin(base_url, link["href"])
            items.append(item)

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

    def stat_value(value):
        match = re.search(r"\d+", value)
        return int(match.group(0)) if match else None

    tables = s.find_all("table")
    if not tables:
        raise ValueError(f"Missing stats table for star player at {url}")

    cost = None
    profiles = []
    for table in tables:
        headers = [cell.get_text(" ", strip=True).lower() for cell in table.find_all("th")]
        rows = table.find_all("tr")
        if len(rows) < 2:
            continue
        cells = [c.get_text(" ", strip=True) for c in rows[1].find_all("td")]
        if len(cells) < 5:
            continue

        has_cost = headers and headers[0] == "cost"
        if has_cost:
            cost = cost_to_int(cells[0])
            stat_cells = cells[1:]
        else:
            stat_cells = cells

        profile_heading = table.find_previous(["h3", "h4"])
        profile_name = profile_heading.get_text(" ", strip=True) if profile_heading else name
        skill_list = table.find_next("ul")
        skills = [li.get_text(" ", strip=True) for li in skill_list.find_all("li")] if skill_list else []
        profiles.append({
            "name": profile_name,
            "ma": stat_value(stat_cells[0]),
            "st": stat_value(stat_cells[1]),
            "ag": stat_value(stat_cells[2]),
            "pa": stat_value(stat_cells[3]),
            "av": stat_value(stat_cells[4]),
            "displayStats": {
                "ma": stat_cells[0],
                "st": stat_cells[1],
                "ag": stat_cells[2],
                "pa": stat_cells[3],
                "av": stat_cells[4]
            },
            "skills": skills
        })

    if cost is None:
        first_table = tables[0]
        cost_text = first_table.find_previous("p")
        cost = cost_to_int(cost_text.get_text(" ", strip=True)) if cost_text else None
    if cost is None or not profiles:
        raise ValueError(f"Incomplete stats for star player at {url}")

    return {
        "name": name,
        "url": url,
        "cost": cost,
        "profiles": profiles
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
        stars = parse_dash_list(star_h, url)

    ind_h = find_header(s, "Inducements")
    if ind_h:
        inducements = parse_dash_list(ind_h, url)

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


def scrape_year(year: str) -> dict:
    """Scrape teams and one canonical star-player record per edition."""
    teams = []
    star_links = {}
    team_links = discover_teams(year)
    print("Found", len(team_links), "teams for", year)

    for name, url in team_links:
        print("Scraping team:", name)
        try:
            team = parse_team(url)
            teams.append(team)
            for star in team["star_players"]:
                if star.get("url"):
                    star_links[star["id"]] = star
        except Exception as e:
            print("Error:", e)
        time.sleep(DELAY)
    stars = []
    for star in star_links.values():
        print("Scraping star player:", star["name"])
        detail = parse_star_player_page(star["url"])
        stars.append({"id": star["id"], **detail, "url": star["url"]})
        time.sleep(DELAY)

    for team in teams:
        team["star_players"] = [star["id"] for star in team["star_players"]]

    return {"teams": teams, "star_players": stars}


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
        scraped = scrape_year(year)
        teams = scraped["teams"]
        filename = f"teams_{year}.json"
        data = {"teams": teams}
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved {filename}")
        all_data[year] = teams

        stars_filename = f"star_players_{year}.json"
        with open(stars_filename, "w", encoding="utf-8") as f:
            json.dump({"star_players": scraped["star_players"]}, f, indent=2, ensure_ascii=False)
        print(f"Saved {stars_filename}")
        all_data[f"{year}_star_players"] = scraped["star_players"]

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