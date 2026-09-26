"""Skill icons (https://skillicons.dev) cached on disk so the profile never depends on that site at view time."""

from __future__ import annotations

import base64
import re
import urllib.request
from pathlib import Path
from typing import Iterable, Optional

ICON_URL = "https://skillicons.dev/icons?i={name}&theme={theme}"
_NAME = re.compile(r"^[a-z0-9-]+$")


class IconStore:
    """Looks icons up in each directory in order; optionally downloads misses into the last one."""

    def __init__(self, dirs: Iterable[Path], *, fetch: bool = False, timeout: float = 20.0):
        self.dirs = [Path(d) for d in dirs]
        self.fetch = fetch
        self.timeout = timeout
        self.misses: list = []

    def get(self, name: str, theme: str) -> Optional[str]:
        if not _NAME.match(name):
            return None
        filename = f"{name}-{theme}.svg"
        for d in self.dirs:
            path = d / filename
            if path.is_file():
                return path.read_text(encoding="utf-8")
        if self.fetch and self.dirs:
            svg = self._download(name, theme)
            if svg:
                cache = self.dirs[-1]
                cache.mkdir(parents=True, exist_ok=True)
                (cache / filename).write_text(svg, encoding="utf-8")
                return svg
        self.misses.append(filename)
        return None

    def data_uri(self, name: str, theme: str) -> Optional[str]:
        svg = self.get(name, theme)
        if svg is None:
            return None
        return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode("ascii")

    def _download(self, name: str, theme: str) -> Optional[str]:
        req = urllib.request.Request(
            ICON_URL.format(name=name, theme=theme), headers={"User-Agent": "profilegen"}
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                body = resp.read().decode("utf-8")
        except Exception:
            return None
        return body if body.lstrip().startswith("<svg") else None
