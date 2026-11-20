#!/usr/bin/env python3
"""Dependency-free sanity checks for the public static website."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "hakemzehn.ir"
issues = []


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = 0
        self.h1 = 0
        self.canonical = []
        self.links = []
        self.jsonld = []
        self._script = False
        self._script_data = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.title += 1
        elif tag == "h1":
            self.h1 += 1
        elif tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href", ""))
        if tag in ("a", "img", "script", "link"):
            value = attrs.get("href") or attrs.get("src")
            if value:
                self.links.append(value)
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._script = True
            self._script_data = []

    def handle_data(self, data):
        if self._script:
            self._script_data.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._script:
            self.jsonld.append("".join(self._script_data))
            self._script = False


def report(condition, message):
    if not condition:
        issues.append(message)


def check_link(page, link):
    if link.startswith(("#", "data:", "mailto:", "tel:", "javascript:", "//")):
        return
    parsed = urlparse(link)
    if parsed.scheme:
        return
    local = unquote(parsed.path)
    if not local:
        return
    destination = (ROOT / local.lstrip("/")) if local.startswith("/") else page.parent / local
    if local.endswith("/"):
        destination /= "index.html"
    report(destination.is_file(), f"{page.name}: missing local target {link}")


def main():
    files = [p for p in sorted(ROOT.glob("*.html")) if not p.name.startswith("google") or not p.name.endswith(".html")]
    report(bool(files), "No HTML files found")
    sitemap = {}
    try:
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        tree = ET.parse(ROOT / "sitemap.xml")
        sitemap = {n.text for n in tree.findall(".//s:url/s:loc", ns) if n.text}
    except (ET.ParseError, OSError) as exc:
        issues.append(f"Invalid sitemap: {exc}")

    all_canonicals = set()
    for page in files:
        parsed = Page()
        try:
            parsed.feed(page.read_text(encoding="utf-8"))
        except (OSError, UnicodeError) as exc:
            issues.append(f"{page.name}: cannot parse UTF-8: {exc}")
            continue
        is_error_page = page.name == "404.html"
        report(parsed.title == 1, f"{page.name}: expected exactly one <title>, got {parsed.title}")
        report(parsed.h1 == 1, f"{page.name}: expected exactly one <h1>, got {parsed.h1}")
        if not is_error_page:
            report(len(parsed.canonical) == 1, f"{page.name}: expected exactly one canonical")
            for url in parsed.canonical:
                target = urlparse(url)
                report(target.scheme == "https" and target.netloc == DOMAIN,
                       f"{page.name}: canonical outside official HTTPS domain: {url}")
                all_canonicals.add(url)
        for link in parsed.links:
            check_link(page, link)
        for raw in parsed.jsonld:
            try:
                json.loads(raw)
            except json.JSONDecodeError as exc:
                issues.append(f"{page.name}: invalid JSON-LD: {exc}")

    # Canonicals can intentionally exclude pages from sitemap; sitemap entries must resolve.
    for url in sitemap:
        parsed = urlparse(url)
        report(parsed.scheme == "https" and parsed.netloc == DOMAIN, f"Sitemap wrong host: {url}")
        target = ROOT / (parsed.path.lstrip("/") or "index.html")
        report(target.is_file(), f"Sitemap URL without HTML file: {url}")
        if target.is_file() and (target.suffix == ".html" or parsed.path == "/"):
            report(url in all_canonicals, f"Sitemap URL not declared as canonical: {url}")

    if issues:
        print("\n".join("ERROR: " + x for x in issues))
        print(f"FAILED: {len(issues)} issue(s) found")
        return 1
    print(f"OK: {len(files)} HTML pages checked; {len(sitemap)} sitemap URLs")
    return 0


if __name__ == "__main__":
    sys.exit(main())
