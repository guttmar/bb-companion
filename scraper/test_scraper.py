import unittest

from bs4 import BeautifulSoup

from scraper.scraper import extract_skill_entries, normalize_whitespace


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


if __name__ == "__main__":
    unittest.main()
