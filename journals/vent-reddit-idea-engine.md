---
layout: post
title: "Project Log: Vent"
author: Asif Sayyed
excerpt: This journal contains all the decisions I made and why I made them while developing towards updating / refactoring the Vent project
tags:
  - ideation
---
<style>
.post-header h1 {
    font-size: 35px;
}
.post pre,
.post code {
    background-color: #EEEEFF;
    font-size: 13px; /* make code smaller for this post... */
}
</style>
## 2026-08-04

### Goal: Make vent. CLI and TUI tool. Scrape Reddit developer pain. Filter noise.

Changes:
- Init `uv` project. Add `praw`, `textual`, `python-dotenv`. (Tool set)
- Write `.env.example`, `.env`. (Hide secrets)
- Write `vent/storage.py`. Load JSON. Save JSON. Dedupe by ID. (Save data safe)
- Write `vent/harvester.py`. Connect Reddit API. Scrape keywords. (Get raw pain)
- Write `vent/tui.py`. Textual dashboard. DataTable. Press `o` open URL. (Show data nice)
- Write `vent/cli.py`. Argparse `pull` and `ui` commands. (Run app)

Why:
- `uv` is fast.
- Dedupe stop bloated JSON.
- Keywords drop junk posts.
- TUI makes it easier read than raw JSON.

Reddit API Rules (PRAW):
- **Approval Required**: Reddit locked API. Cannot get keys instantly. Must file ticket for approval. State non-commercial, personal use.
- Must use custom User-Agent. Format: `<platform>:<app ID>:<version>`. This prevents ban.
- Rate limits exist. PRAW handles sleep. Max 100 req per min mostly.
- Use "script" app for CLI. Web auth not needed.
- Need Client ID (under app name) and Client Secret.
- API limit 1000 posts per listing. Cannot scrape older without search/Pushshift.

---
## 2026-08-04

### Goal: Bypass Reddit API restrictions and capture deeper discussions safely.

Changes:
- Replaced PRAW `harvester.py` with modular JSON endpoint scraper. PRAW code commented out.
- Added recursive comment parsing. Scrapes text from all replies.
- Updated filter to check combined title, post body, and comment text.
- Added 2-second sleep between requests.
- Added `.pre-commit-config.yaml` with `black`, `isort`, and `ruff` (replaced `pylint`).

Why:
- Reddit API locked behind slow manual approval. JSON trick bypasses need for keys.
- Recursive comments capture more developer pain not seen in main post.
- Sleep prevents 429 Too Many Requests errors. Safe scraping.
- `ruff` replaces `pylint`. Written in Rust. 10-100x faster. Saves time on commit.

---

### Goal: Create a modular architecture to support multiple scrapers without dead code clutter.

Changes:
- Split harvester logic into modules: `harvester_json.py` and `harvester_praw.py`.
- Made `harvester.py` a router that delegates to specific backends.
- Commented out PRAW code with `FIXME:` note until keys are granted.
- Added `--backend` flag to `cli.py` (defaults to `json`).

Why:
- Keeps codebase clean and modular.
- Isolates dead code (PRAW) from active code (JSON trick).
- Easy to swap scrapers instantly via CLI when Reddit API approval arrives.

---

### Goal: Remove YAGNI abstractions and speculative code.

Changes:
- Reverted router pattern; `harvester_json.py` is now just `harvester.py`.
- Removed `--backend` flag from CLI.

Why:
- Codebase was over-engineered for a feature (PRAW) that wasn't approved yet.
- Keeps it lean. Can use git history if keys are ever granted.

---

### Goal: Fix all Ruff warnings and tighten code quality.

Changes:
- Fixed `black` target version for Python 3.11 in pre-commit hooks.
- Removed unused local variables and typos in `cli.py`.
- Added `ClassVar` type hint in `tui.py`.
- Removed bare `Exception` in `tui.py` and caught specific `webbrowser.Error`.
- Updated `harvester.py` to use modern `| None` type union over `Optional`.

Why:
- `ruff` enforced strict, modern Python standards.
- Specific exceptions prevent silent failures.

---

### Goal: Fix HTTP 403 errors when scraping Reddit JSON endpoints. (didn't work)

Changes:
- Replaced `www.reddit.com` with `old.reddit.com` in scraper URLs.
- Injected heavy browser headers (`Accept`, `Accept-Language`, `Sec-Fetch-*`, `Upgrade-Insecure-Requests`).

Why:
- Reddit tightened blocks on automated traffic to `.json` endpoints.
- `old.reddit.com` is often less strict.
- Full browser headers spoof real traffic better than just `User-Agent`.

---

### Goal: Fix persistent HTTP 403 blocks against Python's TLS stack. (Bypass TLS Fingerprinting, failed and didn't work)

Changes:
- Replaced Python's `requests` library with `subprocess` calls to native `curl.exe`.
- Captured `curl` standard output and parsed as JSON.

Why:
- Reddit's WAF (Cloudflare/Fastly) fingerprints Python's `ssl` ClientHello (JA3 fingerprint) and autobans it regardless of HTTP headers.
- `curl.exe` uses the system's TLS (Schannel on Windows), which bypasses the Python-specific block.

---

### Goal: Maintain basic scraping functionality despite total JSON block. (Fallback to RSS)

Changes:
- Rewrote `harvester.py` to target `.rss` endpoints instead of `.json`.
- Uses `xml.etree.ElementTree` to parse Atom feeds.
- Score is defaulted to `0` since RSS feeds do not provide upvotes.
- Removed recursive comment harvesting (RSS only gives posts).

Why:
- Reddit completely banned unauthenticated JSON scraping via IP/WAF.
- RSS endpoints are still open but provide limited metadata.
- Good enough stopgap until Reddit approves the API keys.

---

### Goal: Improve data relevance and allow manual curation of harvested pain points. (TUI & Harvesting Polish)

Changes:
- Added nuanced trigger phrases ("not working", "broken", "awful", etc.).
- Set default subreddits (webdev, devops, programming, python, reactjs, sysadmin, ProgrammerHumor).
- Made `--subreddits` argument optional in CLI.
- Moved data storage to `data/vented_ideas.json`.
- Removed useless "Score" column from TUI (RSS doesn't provide scores).
- Added `d` key binding to TUI to delete selected posts and update the JSON file.

Why:
- Better keywords catch more specific developer friction.
- Data directory keeps the root clean.
- Manual deletion in TUI allows for rapid triage of false-positive complaints.

---

### Goal: Filter out self-promotional posts that use pain keywords. (Anti-Patterns)

Changes:
- Added `ANTI_TRIGGERS` list ("we built", "i built", "we made", "i made").
- Harvester skips any post containing these phrases.

Why:
- Showoff posts ("I built this because X sucks") inflate the dataset with solved problems or product pitches, polluting the actual pain points dataset.
