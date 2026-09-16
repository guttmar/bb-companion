import unittest

from bs4 import BeautifulSoup

from scraper.scraper import (
    extract_rule_sections,
    extract_skill_entries,
    normalize_whitespace,
    parse_dash_list,
    parse_star_player_page,
)


class SkillScraperTests(unittest.TestCase):
    def test_normalize_whitespace_preserves_line_breaks(self):
        raw = (
            "When this player is activated,\n"
            "they can declare a Stab Special Action; there is no limit to the number of\n"
            "players that can declare this Special Action each Turn."
        )

        self.assertEqual(
            normalize_whitespace(raw),
            "When this player is activated,\nthey can declare a Stab Special Action; there is no limit to the number of\nplayers that can declare this Special Action each Turn.",
        )

    def test_extract_skill_entries_keeps_full_description(self):
        html = """
        <html><body>
        <h3>TRAITS</h3>
        <h4>STAB (ACTIVE)</h4>
        <p>When this player is activated, they can declare a Stab Special Action; there is no limit to the number of players that can declare this Special Action each Turn.</p>
        <p>When this player performs a Stab Special Action, select a Standing opposition player adjacent to this player and make an Armour Roll for the selected player.</p>
        <h4>SWOOP (ACTIVE)</h4>
        <p>When this player is thrown by a Throw Team-mate Action, they may choose not to Scatter before landing as normal.</p>
        </body></html>
        """

        entries = extract_skill_entries(BeautifulSoup(html, "lxml"))

        self.assertEqual(entries[0]["name"], "Stab")
        self.assertEqual(entries[0]["type"], "active")
        self.assertIn(
            "When this player is activated, they can declare a Stab Special Action; there is no limit to the number of players that can declare this Special Action each Turn.",
            entries[0]["description"],
        )
        self.assertIn(
            "When this player performs a Stab Special Action, select a Standing opposition player adjacent to this player and make an Armour Roll for the selected player.",
            entries[0]["description"],
        )

    def test_parse_dash_list_stops_at_strong_section_headers(self):
        html = """
        <html><body>
        <strong>Star Players</strong>
        <p>Akhorne the Squirrel - 80k</p>
        <strong>Inducements</strong>
        <p>Bloodweiser Kegs - 50k</p>
        </body></html>
        """
        doc = BeautifulSoup(html, "lxml")

        self.assertEqual(
            parse_dash_list(doc.find("strong")),
            [{"id": "akhorne-the-squirrel", "name": "Akhorne the Squirrel", "cost": 80000}],
        )

    def test_star_profile_keeps_special_skill_description(self):
        html = """
        <html><body>
        <h1>Test Star</h1>
        <p><strong>80K</strong></p>
        <table><tr><th>MA</th><th>ST</th><th>AG</th><th>PA</th><th>AV</th></tr><tr><td>6</td><td>3</td><td>3+</td><td>4+</td><td>9+</td></tr></table>
        <ul><li><a href="#dodge">Dodge</a></li><li><strong>Special Rule</strong></li></ul>
        <p>Special rule explanation.</p>
        <h3>Plays For</h3><ul><li>Any team</li></ul>
        </body></html>
        """
        from unittest.mock import patch

        with patch("scraper.scraper.soup", return_value=BeautifulSoup(html, "lxml")):
            result = parse_star_player_page("https://example.test/star")

        self.assertEqual(result["profiles"][0]["skills"], ["Dodge"])
        self.assertEqual(
            result["profiles"][0]["specialSkills"],
            [{"name": "Special Rule", "description": "Special rule explanation."}],
        )


class RuleScraperTests(unittest.TestCase):
    def test_extract_rule_sections_preserves_hierarchy_and_structured_blocks(self):
        html = """
        <html><body><article class="md-content__inner md-typeset">
          <h1>Rules and Regulations</h1>
          <h2 id="general-principles">GENERAL PRINCIPLES!</h2>
          <p>Shared rule text.</p>
          <h3 id="rolling-dice">ROLLING DICE</h3>
          <p>Roll dice to resolve an action.</p>
          <ul><li>Roll a D6.</li><li>Apply the result.</li></ul>
          <table><tr><th>Roll</th><th>Result</th></tr><tr><td>1</td><td>Fail</td></tr></table>
          <p><img src="../../media/core_rules/dice.jpg" alt="Dice diagram" /></p>
          <h2>Additional Links</h2><ul><li>Should not be extracted.</li></ul>
        </article></body></html>
        """
        chapter = {
            "id": "core-rules-and-regulations",
            "title": "Rules and Regulations",
            "slug": "rules-and-regulations",
            "family": "core-rules",
        }

        sections = extract_rule_sections(
            BeautifulSoup(html, "lxml"),
            chapter,
            "https://bloodbowlbase.ru/bb2025/core_rules/rules_and_regulations/",
            "2026-09-16",
        )

        self.assertEqual([section["title"] for section in sections], ["GENERAL PRINCIPLES!", "ROLLING DICE"])
        self.assertEqual(sections[1]["parentSectionId"], sections[0]["id"])
        self.assertEqual(sections[1]["path"], ["GENERAL PRINCIPLES!", "ROLLING DICE"])
        self.assertEqual([block["type"] for block in sections[1]["body"]], ["paragraph", "list", "table", "figure"])
        self.assertEqual(sections[1]["body"][-1]["value"]["mediaRef"], "https://bloodbowlbase.ru/bb2025/media/core_rules/dice.jpg")
        self.assertEqual(len(sections[1]["source"]["contentHash"]), 64)


if __name__ == "__main__":
    unittest.main()
