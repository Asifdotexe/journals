---
layout: post
title: "Project Log: Ship of Theseus"
author: "Asif Sayyed"
excerpt: "This journal contains all the decisions I made and why I made them while developing towards updating / refactoring the Ship of Theseus project"
tags: journal
---

## 2026-07-25

### Goal: Update open graph (social preview) image
**What did I do:**
I updated the `og:image` and `twitter:image` meta tags in `index.html`. I changed the image paths from the old `theseus-og-picture.png` to the new `assets/og.webp` file.

**Why did I choose to do that:**
This ensures the new graphic appears in link previews when sharing the project on X or Facebook, replacing the old one.

### Goal: SEO optimization and domain correction
**What did I do:**
I reviewed the existing SEO setup (which already had good basics) and discovered that the absolute links were pointing to the wrong domain (`theseus.sayyedasif.com`). I replaced all instances of that old domain with the actual Cloudflare hosting domain (`theseus.asifdotexe.workers.dev`) across `index.html` (canonical, og:url, schema URL), `robots.txt`, and `sitemap.xml`.

**Why did I choose to do that:**
Having the wrong domain in canonical tags and sitemaps confuses search engines and can cause them to drop the site from indexing. Social preview images also failed to load because their absolute URLs pointed to a domain where they weren't hosted.

### Goal: Debugging 404 error on Cloudflare deployment
**What did I do:**
I investigated why visiting `assets/og.webp` and `/data/` on the live Cloudflare site returned HTTP 404 errors. I identified that `og.webp` was an untracked local file that hadn't been committed to Git or deployed yet. I also verified that visiting the root `/data/` directory fails by design, but accessing a specific file like `/data/processed/react_graph.json` works perfectly.

**Why did I choose to do that:**
To clear up confusion regarding how web servers behave. Servers (like Cloudflare Workers) disable directory listings for security reasons, so visiting a folder without an `index.html` will always 404. The server also can't serve files that haven't been pushed to the build pipeline.

### Goal: Advanced technical SEO upgrades
**What did I do:**
- Created a Web App Manifest (`manifest.json`).
- Added `<link rel="manifest">` and Apple Touch icons to `index.html`.
- Added a `<link rel="preload">` tag for `style.css`.
- Added a `<noscript>` tag block summarizing the tool.
- Expanded the existing JSON-LD script from just `WebApplication` to also include a `SoftwareSourceCode` schema.

**Why did I choose to do that:**
I added the Web App Manifest to make the site mobile-friendly and improve Lighthouse scores. Preloading the CSS improves Core Web Vitals by forcing the browser to load styles faster. The `<noscript>` tag ensures that search engine crawlers that do not execute JavaScript can still read text explaining what the site is. The `SoftwareSourceCode` schema explicitly tells Google that this is an open-source developer tool.

### Goal: Generative engine optimization (GEO)
**What did I do:**
- Added a "TL;DR" summary text to the top of the webpage.
- Added a visible "Last Updated" timestamp to the UI next to the author badge.
- Added a Frequently Asked Questions (FAQ) section at the bottom of the page.
- Injected `FAQPage` structured data into the JSON-LD script.
- Added the author's `jobTitle` ("Data Scientist") and a `dateModified` field to the schema.
- Explicitly allowed AI crawlers (`GPTBot`, `Claude-Web`, `PerplexityBot`, `OAI-SearchBot`) in the `robots.txt` file.

**Why did I choose to do that:**
GEO makes the site easier to index for AI search engines like ChatGPT and Perplexity. AI models prefer concise summaries, Q&A formats, and clear sources. Timestamps show the content is fresh. The schema provides structured context, and the robots.txt changes give AI bots clear permission to crawl the site.

### Goal: Answer engine optimization (AEO)
**What did I do:**
- Converted the generic TL;DR text into an explicit AEO Extraction blockquote starting with a direct question: "What is the Ship of Theseus Code Visualizer?".
- Expanded the FAQ section in the HTML from 2 entries to 7 entries, including definitions of 'fossils'.
- Expanded the `FAQPage` structured data in the JSON-LD script to match the 7 entries.
- Ensured all FAQ answers were strictly kept under 50 words and were self-contained.

**Why did I choose to do that:**
AEO focuses on voice search and AI answering engines. These engines look for "Position Zero" featured snippets. A direct Q&A blockquote right after the H1 gives them a clear target. AEO best practices also suggest having at least six concise FAQs to show the page provides definitive answers. I added the 'fossil' definition to clarify domain-specific terms that AI models could misinterpret.

### Impeccable layout refactoring
**Goal:** `/impeccable layout faq-section`
**What did I do:**
- Removed arbitrary inline styles from the FAQ HTML markup in `index.html`.
- Added semantic `.faq-section`, `.faq-grid`, and `.faq-item` CSS classes to `style.css`.
- Reorganized the flat list of FAQ items into a responsive CSS Grid (`repeat(auto-fit, minmax(280px, 1fr))`).
- Standardized vertical and horizontal rhythm using the project's existing spacing scale (`var(--space-xxl)`, `var(--space-xl)`).

**Why did I choose to do that:**
The impeccable layout guidelines treat space as a core design tool. The old inline-styled list lacked grid alignment. I replaced arbitrary padding with semantic tokens and used CSS Grid to organize the FAQ content. I avoided putting items in boxes to prevent 'card monotony', relying on space and typography for structure.

### Impeccable layout refactoring for AEO extraction
**Goal:** `/impeccable layout aeo-extraction`
**What did I do:**
- Removed arbitrary inline styles from the `<blockquote class="aeo-extraction">` tag in `index.html`.
- Added the `.aeo-extraction` CSS class definition to `style.css` using the existing design system tokens for spacing (`var(--space-xs)`, `var(--space-md)`) and typography (`var(--mist)`, `var(--ice)`).
- Replaced the hardcoded, bordered, boxed layout with a clean text block that relies solely on spacing, semantic hierarchy, and the `flex-direction: column` structure to separate the bolded question from its answer.

**Why did I choose to do that:**
The impeccable layout principles state that elements shouldn't be cards without a clear interaction reason. The AEO block is just an inline text summary, not an interactive component. Removing the borders and background tint lets the extraction snippet fit the page's layout naturally. It uses the standard spacing and font colors while keeping the structure needed for SEO and AEO.

### Impeccable polish for FAQ and AEO sections
**Goal:** `/impeccable polish faq-section and aeo-extraction`

**What did I do:**
- Corrected the `faq-section` heading class from `.title` (which was incorrectly applying the massive `clamp(2.5rem...)` hero display size) to `.section-title` to align with the rest of the page's section hierarchy.
- Updated `.faq-item h3` to use `var(--font-serif)` (Playfair Display) because these are narrative questions, following the DESIGN.md rule: "serif for philosophy and narrative weight, monospace for data".
- Updated `.aeo-extraction strong` to also use `var(--font-serif)` and increased the font size to `1.1rem` for better alignment with the FAQ structure.
- Adjusted the margins of the AEO block to align with the hero's flexbox rhythm, removing the arbitrary top and bottom margins so it sits beneath the subtitle.

**Why did I choose to do that:**
The `impeccable polish` command requires strict alignment with the design system. The FAQ title was previously using hero sizing in a regular section, and the typography lacked clear separation. Assigning the serif font to the narrative questions and using the parent flex container's gap for spacing brings these sections in line with the project's design rules. Adjusted the margins of the AEO block to fit the hero's flexbox layout, removing arbitrary margins so it sits properly below the subtitle.

### Goal: Comprehensive architectural and codebase audit
**What did I do:**
I conducted an architectural audit of the frontend and backend to address scaling bottlenecks, code brittleness, and the massive raw JSON datasets. I produced `architecture_audit.md` to summarize the findings. The report recommends replacing raw JSON storage with SQLite or an append-only event log (JSONL) and breaking up the 1,200-line `app.js` file.

**Why did I choose to do that:**
The user requested a review focused on KISS and SOLID principles to simplify logic and replace the bulky JSON datasets. Storing absolute snapshots of file compositions in JSON for every time period scales poorly (O(Files * Time Periods)). This resulted in 21MB files for repositories like React, threatening to break CI limits. Refactoring the data layer and frontend makes the project easier to maintain and scale.

### Goal: Establish baseline unit speed and create refactoring plan
**What did I do:**
I wrote a benchmarking script (`scripts/benchmark_pipeline.py`) and ran it on the `claude-code` repository to measure the data pipeline's parsing speed and disk storage bloat. I drafted a step-by-step `refactoring_plan.md` detailing how to decouple the data layer with append-only JSON and modularize `app.js`, including tests to prevent breaking changes. I skipped a Go or Rust rewrite because the benchmark showed Python processes 1600 to 3000 lines per second on incremental blame, which is fast enough.

**Why did I choose to do that:**
The user asked for the operation's unit speed before optimizing upstream, ensuring decisions are data driven. The benchmark showed the real bottleneck is data storage bloat, which is 44 times larger than necessary, rather than Python's parsing logic. I wrote the refactoring plan to fix these issues without breaking the current setup.

### Goal: Execute refactoring plan (data layer, frontend modularization, security)
**What did I do:**
- **Data layer optimization**: Decoupled `file_compositions` from the snapshot history into a separate `{repo}_state.json`. Cleaned legacy bloat from history files using `scripts/cleanup_data.py`.
- **Frontend modularization**: Extracted the monolithic 1200-line `app.js` into strictly scoped ES6 modules (`api.js`, `main.js`, `ui.js`, `chart.js`).
- **Security**: Implemented a Cloudflare Edge Function (`functions/api/request-repo.js`) to handle API requests and secret management securely, removing the `__WEB3FORM_ACCESS_KEY__` secret from the client-side code.
- **Pedagogical documentation**: Added Sphinx-formatted docstrings and inline comments across all python scripts and javascript modules. I kept a professional tone while explaining the architectural reasoning.

**Why did I choose to do that:**
Executing the planned refactoring resolves the core issues of data bloat and frontend brittleness following KISS and SOLID principles. The user asked for detailed docstrings so future contributors can easily understand the architecture and avoid introducing bugs.

## 2026-07-26

### Goal: Refine data layer optimization and revert frontend modularization
**What did I do:**
- **Frontend reversion**: Reverted the frontend back to the monolithic `app.js` and `index.html` structure based on the user's preference, removing the experimental `js/` folder.
- **JSONL migration**: Refactored the data layer to use append-only JSON Lines (`_history.jsonl`) instead of giant monolithic JSON files, allowing for incremental appends and reducing full-file rewriting overhead.
- **Fossil extraction**: Migrated fossil storage into dedicated `{repo}_fossils.json` files, so I don't have to repeatedly read and write large history files.
- **Data script robustness**: Rewrote `_data_io.py`, `analyse_repository.py`, and `add_fossils.py` to support the new JSONL schema, use atomic file replacements, and replaced all bare `except` blocks with specific exceptions.

**Why did I choose to do that:**
The user preferred the simpler monolithic frontend architecture (`app.js`), so I reverted the modularization to match their workflow. Storing full snapshots of file compositions in a single JSON array caused heavy I/O overhead, making the pipeline fragile. JSONL allows incremental appends, skipping the full-file rewrite on each update. Storing fossils in separate files avoids re-saving historical data. I also fixed vague error handling by specifying exceptions instead of using bare except blocks.

### Goal: High-performance Rust rewrite (data pipeline)
**What did I do:**
- **Halted Python pipeline:** Killed the Python background pipeline because even with the `JSONL` I/O optimizations, traversing and parsing massive repositories using a `subprocess.run(["git", "blame"])` loop takes over 20 hours. Python reached its execution limit.
- **Architectural shift:** Formulated a plan to rewrite the CPU-bound data pipeline as a standalone Rust CLI tool (`theseus_engine`), following the advice from `python-to-rust.md`.
- **Ecosystem swap strategy:**
  - `argparse` -> `clap` (Command-line arguments).
  - `json` -> `serde` / `serde_json` (Statically-typed JSON serialization).
  - `subprocess.run(["git", "blame"])` -> `git2` (Running git traverse and blame in-memory using C-bindings for libgit2).
  - Single-threaded Python -> `rayon` (Parallelize file-level blames across all CPU cores).
- **Migration plan:** I will build this in a new `engine/` directory, focusing on the heavy snapshot analysis first.

**Why did I choose to do that:**
Following the `python-to-rust.md` guide, I picked this as a good candidate for a Rust migration. It is a CPU-bound task that works well as a self-contained CLI tool, which avoids complex PyO3 interop. Moving from subprocess execution to in-memory native bindings drops processing time from days to minutes. I documented this to track the shift from a Python prototype to a Rust production tool.

### Goal: Rust engine scaffolding and developer experience (DX)
**What did I do:**
- **Installed Rust:** Executed `rustup-init` locally to get the `cargo` and `rustc` toolchain online.
- **Engine scaffolding:** Created a new `engine/` Cargo project and added dependencies for `serde`, `serde_json`, `clap`, `rayon`, `git2`, `log`, and `env_logger`.
- **Main skeleton:** Set up the basic `src/main.rs` to use `clap` for parsing the identical CLI arguments expected by `analyse_repository.py` (`--repo-path`, `--output`, `--reprocess`).
- **Bat scripts for DX:** Since the user isn't deeply familiar with Rust toolchains, I created two helper batch scripts in the project root:
  - `build_engine.bat`: Automates building the Rust binary in `--release` mode.
  - `run_engine.bat`: A wrapper script that lets the user execute the compiled engine exactly as they would a Python script.

**Why did I choose to do that:**
The move to Rust improves performance, but it shouldn't make the project harder to use. The `.bat` wrappers (`build_engine.bat` and `run_engine.bat`) hide the Cargo commands. This lets the user run the engine exactly like they did with Python, while still getting the speed improvements.

### Goal: Data pipeline robustness and over-engineering cleanup
**What did I do:**
- **Code review and cleanup**: Applied a ponytail review to `scripts/cleanup_data.py`, stripping out verbose docstrings, standard library explanations, and shrinking error aggregation logic to minimize the code footprint.
- **Accuracy improvements**: Updated `get_tracked_files` in `scripts/_utils.py` to accurately filter out empty files, symlinks, and binaries instead of relying solely on `git ls-files`.
- **Validation refinements**: Modified `_verify_line_count_guard` in `scripts/analyse_repository.py` to assert exact file counts rather than line counts, dropping the arbitrary 1-5% tolerance threshold.
- **Unit testing**: Replaced the outdated tests in `test_analyse_repository.py` with comprehensive unit tests for `_data_io.py` that create mock file state data structures and strictly assert the output composition exactly matches the input state.

**Why did I choose to do that:**
The user reported that `git blame` skipped non-text or empty files, breaking the `wc -l` guard and causing cache invalidation errors. Switching to an exact file-count comparison using filtered traceable files makes the pipeline more reliable. I also removed over-engineered code and verbose docstrings to keep the scripts lean, while new unit tests verify the updated JSON storage logic works.

### Comprehensive Python to Rust architecture mapping

This is a 1-to-1 breakdown mapping the old Python data pipeline (`analyse_repository.py`) to the new Rust engine (`engine/src/main.rs`). It outlines the features Rust offers over Python and how they improve performance.

#### 1. `get_snapshot_periods(repo_path)`
**Python approach:**
I previously spawned a subshell using `subprocess.run(["git", "log", "--pretty=format:%H|%cI"])`. Python would capture the string output, split it line by line, parse the dates into year-month buckets, and store the final commit hash.
**Rust approach (`get_snapshot_periods`):**
I use `git2::Repository::open()` and the `revwalk` iterator to walk the commit tree natively in memory. I sort it chronologically and group it by month on the commit objects using the `chrono` crate.
**New Rust concepts introduced:**
- **In-memory C bindings (`git2`)**: Instead of shelling out to `git.exe` and incurring OS overhead for every command, `libgit2` links directly to my binary. I read the git internal data structures from memory.
- **`Result<T, E>` and the `?` operator**: In Python, functions implicitly raise arbitrary exceptions or return None. In Rust, any function that can fail returns a `Result`. The `?` syntax (`let oid = oid_res?;`) safely propagates errors up the chain without needing try/except blocks.
- **Strongly typed iterators**: `revwalk` is a lazy iterator. I don't load the entire git log into RAM; I yield one commit at a time, making it memory efficient.

#### 2. `get_tracked_files(repo_path)`
**Python approach:**
I ran `subprocess.run(["git", "ls-files"])`, looped through them, and then used `git check-attr -a` or parsed extensions to figure out if files were binary or empty.
**Rust approach (`get_tracked_files`):**
I grab the snapshot's `Tree` object and call `tree.walk(git2::TreeWalkMode::PreOrder)`. For each file, I check `blob.is_binary()` and `blob.size() > 0`.
**New Rust concepts introduced:**
- **Pattern matching (`if let`)**: Rust forces you to handle states correctly. `if let Ok(blob) = repo.find_blob(...)` cleanly extracts the blob from the Result *only* if it succeeded, skipping missing files without throwing exceptions.
- **Enums and sum types**: The `entry.kind() == Some(ObjectType::Blob)` checks against a strict Enum. You cannot compare a Tree to a Blob by accident; the compiler prevents logic bugs.

#### 3. `get_changed_files(repo_path, prev_commit, commit)`
**Python approach:**
I used `subprocess.run(["git", "diff-tree", ...])` and parsed the file paths out of the terminal output to implement incremental cache diffing.
**Rust approach (`get_changed_files`):**
I use `repo.diff_tree_to_tree()` and iterate over the generated deltas.
**New Rust concepts introduced:**
- **Borrowing and references (`&Tree`, `&mut DiffOptions`)**: Python passes everything by reference natively but relies on the Garbage Collector to clean it up. Rust uses "lifetimes". `diff_tree_to_tree` borrows the old and new trees via `&Tree`. The memory is strictly managed by the compiler at compile-time, eliminating the need for a garbage collector and reducing memory usage.

#### 4. `_blame_full_snapshot` vs `process_blame`
**Python approach:**
I used `concurrent.futures.ThreadPoolExecutor` to run `git blame --line-porcelain` in multiple sub-processes. Spawning thousands of `git blame` processes took upwards of 20 hours for large repositories because of Python's Global Interpreter Lock (GIL) and process spawning overhead.
**Rust approach (`process_blame`):**
I use the `rayon` crate. I take a vector of file paths, call `files_to_blame.into_par_iter()`, and the workload is distributed across every core on your CPU. I open a `Repository` per thread and use `repo.blame_file()`.
**New Rust concepts introduced:**
- **Data parallelism and zero-cost abstractions (`rayon`)**: In Rust, turning a single-threaded loop into a multi-threaded parallel execution is as simple as changing `.iter()` to `.par_iter()`.
- **Thread safety (`Send` and `Sync`)**: Python's GIL exists because threading is hard to do safely. In Rust, the compiler checks if objects are thread safe (`Sync` trait). `git2::Repository` is *not* entirely thread safe, so if I tried to share one instance across all threads, the code would not compile. Rust forces me to open a `Repository` handle *inside* the thread closure, preventing race conditions.
- **Hunk walking vs string parsing**: Instead of parsing blocks of text from standard out, `repo.blame_file()` returns memory structures called "Hunks". I simply read `hunk.final_signature().when()` to get the timestamp, bypassing text parsing overhead.

#### 5. Data structuring and output
**Python approach:**
I constructed Python dictionaries (e.g., `defaultdict(int)`) on the fly, relying on duck typing.
**Rust approach:**
I define a concrete `struct SnapshotData` and use the `serde` crate with `#[derive(Serialize)]`.
**New Rust concepts introduced:**
- **Macros (`#[derive(Serialize)]`)**: This attribute tells the Rust compiler to automatically generate fast JSON serialization code for my struct at compile-time.
- **Type guarantee**: `HashMap<String, u32>` strictly enforces that years are strings and line counts are 32-bit unsigned integers (which cannot be negative). If I attempt to insert a float or None, it won't compile. Python would just let it happen and crash at runtime during the JSON dump.

### Goal: Rust engine refinement and pipeline stabilization
**What did I do:**
- **Engine concurrency fix:** Refactored the Rayon parallel iterator in `engine/src/main.rs` to use `map_init`, initializing the `git2::Repository` handle once per thread.
- **Incremental state safety:** Moved the `file_compositions` JSON state persistence inside the main processing loop to save progress after every snapshot period.
- **JSONL deduplication:** Added logic to rewrite the output JSONL file before appending when `--reprocess` is used, explicitly stripping out old lines for the reprocessed periods to prevent duplicated snapshot rows.
- **Workflow security and caching:** Hard-pinned the `Swatinem/rust-cache` action to a specific commit SHA (`e18b497796c12c097a38f9edb9d0641fb99eee32`) in both `theseus-engine.yml` and `unit-tests.yml`. Refactored the pipeline arguments using secure bash arrays (`ARGS=()`) and environment variables instead of string interpolation.
- **Binary pre-building:** Added a `cargo build --release` step to the CI workflow and updated `analyse_repository.py` to invoke the pre-built `./engine/target/release/engine` binary directly on Linux, mirroring the batch script behavior on Windows.
- **Batch script resilience:** Updated `build_engine.bat` and `run_engine.bat` to use checked directory traversal (`pushd "%~dp0engine" || exit /b 1`) and preserve the exact exit codes from Cargo.

**Why did I choose to do that:**
I identified thread-safety constraints with `libgit2` (specifically, sharing a `git2::Repository` across threads safely). `map_init` resolves this without performance penalties. Pushing state saves into the loop ensures I don't lose hours of computation if a large repository crashes midway. Deduplicating the JSONL on reprocess maintains data integrity for the downstream React frontend. Pinning GitHub Actions and sanitizing bash inputs follows strict CI security best practices. Using `pushd`/`popd` in the batch scripts prevents unpredictable path resolution bugs when scripts are invoked from arbitrary working directories.

### Goal: Legacy data migration and pipeline polish
**What did I do:**
- **Legacy data migration**: Authored and ran a one-off Python script to migrate all legacy monolithic `{repo}_data.json` files in `data/raw/` and `data/archive/` into the new JSONL format (`{repo}_history.jsonl`). Extracted the most recent commit and composition tracking data into `data/state/{repo}_state.json`.
- **Action UI and pipeline target refinement**: Renamed the GitHub Actions dropdown inputs in `theseus-engine.yml` to clearly reflect "Resume Run" vs "Complete Extraction". Updated Python docstrings and CLI help text across `run_pipeline.py` and `analyse_repository.py` to document the full `--reprocess TARGET` contract (`all`, `last`, or `YYYY-MM`).
- **Code quality (Pylint) fixes**: Fixed false-positive Pylint import errors during pre-commit checks by correctly configuring `init-hook = "import sys; sys.path.insert(0, '.')"` inside `pyproject.toml`, successfully pushing the repository score to 9.49/10.

**Why did I choose to do that:**
The user correctly identified the need for a "Resume Run" mode in case of failure or monthly increments. Rather than duplicating pipelines, I migrated the old dataset structures to match the new architecture. This allows the Rust engine's incremental saving (`_state.json`) to act as a resume system. Fixing Pylint reduces noise in the CI checks, and the docstring updates document the behavior that was already implemented in the pipeline.
