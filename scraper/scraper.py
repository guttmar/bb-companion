import json
import re
import time
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE = "https://bloodbowlbase.ru"
TEAM_INDEX = f"{BASE}/bb2025/core_rules/the_teams/"

DELAY = 1

session = requests.Session()


def soup(url):
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
        cols = [c.get_text(strip=True) for c in row.find_all("td")]

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

def discover_teams():
    print(TEAM_INDEX)
    s = soup(TEAM_INDEX)
    links = []
    # print(s)
    for a in s.find_all("a", href=True):
        href = a["href"]
        print("Found link:", href)
        if "/teams/" in href:
            url = urljoin(BASE, href.replace("../..", "bb2025"))
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


def main():
    teams = []
    team_links = discover_teams()
    print("Found", len(team_links), "teams")

    for name, url in team_links:
        print("Scraping team:", name)

        try:
            team = parse_team(url)
            teams.append(team)
        except Exception as e:
            print("Error:", e)
        time.sleep(DELAY)
    data = {
        "teams": teams
    }

    with open("teams.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("Saved teams.json")

if __name__ == "__main__":
    # _test_split_list()
    main()