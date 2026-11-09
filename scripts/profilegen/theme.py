"""Two strictly monochrome palettes. Every colour in every card comes from here."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple


@dataclass(frozen=True)
class Theme:
    name: str
    bg: str        # card surface
    panel: str     # raised surface (chips, tiles)
    line: str      # visible hairline
    line_soft: str  # barely-there hairline
    fg: str        # primary ink
    muted: str     # secondary ink
    dim: str       # tertiary ink (labels)
    faint: str     # decorative ink
    levels: Tuple[str, str, str, str, str]  # contribution heat 0..4

    @property
    def invert(self) -> bool:
        """Light theme = ink on paper: halftone shadows get the big dots."""
        return self.name == "light"


DARK = Theme(
    name="dark", bg="#050505", panel="#0d0d0d", line="#2b2b2b", line_soft="#171717",
    fg="#fafafa", muted="#a1a1a1", dim="#6b6b6b", faint="#3a3a3a",
    levels=("#121212", "#3b3b3b", "#737373", "#b4b4b4", "#ffffff"),
)
LIGHT = Theme(
    name="light", bg="#ffffff", panel="#f7f7f7", line="#d2d2d2", line_soft="#ececec",
    fg="#0a0a0a", muted="#5c5c5c", dim="#8c8c8c", faint="#c4c4c4",
    levels=("#efefef", "#c9c9c9", "#8f8f8f", "#4d4d4d", "#000000"),
)
THEMES = {"dark": DARK, "light": LIGHT}
