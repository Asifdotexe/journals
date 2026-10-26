---
layout: post
title: "Saving the sinking ship: Project Theseus"
author: Asif Sayyed
date: 2026-10-26
excerpt: Journalling the mistakes made during the v1.0.0 of Theseus and how we fixed them in v2.0.0
tags:
  - project
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

## What is this blog about? TL;DR

This blog talks about one of my project called Theseus, it is the example of how poor system design scales and hence I had to do a lot of code patches, which led to a monolith like [changelog](https://github.com/Asifdotexe/Theseus/releases/tag/v1.0.0) and to add insult to the injury. the project isn't even working anymore.

This journal will be documenting the mistakes and bad decisions taken in Theseus and how I eventually fix it to make the project better in terms of system design.

So if this sounds interesting to you, then hop on board and let's save the sinking ship.

## WTH is this project supposed to do?

Let's break the understanding in two parts, part one is the underlying theme and then the second part is the underlying technology
### Underlying theme

At heart, Theseus is philosophical x archaeological visualization engine for codebases, taken from the ancient Greek paradox of Ship of Theseus
> If every original wooden plank is replaced over time, is it still the same ship?

We can similarly think about how codebases change, not one plank at a time but one line at a time.
### Underlying technology

The core functionalities of Theseus at the time of writing can be consolidated in 5 simple workflows and here a flow diagram of how it goes and processes each repository

```
                      ┌──────────────────────────────────────┐
                      │    Target Git Repository (Remote)    │
                      └──────────────────┬───────────────────┘
                                         │ Clone / Fetch
                                         ▼
                      ┌──────────────────────────────────────┐
                      │            THESEUS ENGINE            │
                      │  • Walk Commit History (Quarterly/M) │
                      │  • Diff Git Tree to Tree             │
                      │  • Parallel Line-Porcelain Blame     │
                      │  • Track Fossil Identifiers          │
                      └──────────────────┬───────────────────┘
                                         │ Generates
                                         ▼
                      ┌──────────────────────────────────────┐
                      │        DATA PERSISTENCE LAYER        │
                      │  1. History Time-Series (Snapshots)  │
                      │  2. Fossils (Genesis + Living)       │
                      │  3. Milestones (Historical Context)  │
                      └──────────────────┬───────────────────┘
                                         │ Static Fetch (JSON)
                                         ▼
                      ┌──────────────────────────────────────┐
                      │        OBSERVATORY FRONTEND          │
                      │  • D3.js Stacked Area Graph          │
                      │  • Chronological vs Identity Modes   │
                      │  • Time Scrubber & Entropy Metrics   │
                      │  • Deep-linked Fossil Cards          │
                      └──────────────────────────────────────┘
```

1. Sampling: Extracting historical commits across a repository's lifespan, This is done quarterly (pre-2025) i.e. months `03`, `06`, `09`, `12`. and monthly 2025+ i.e., `01` through `12`
2. Attributing authoring and bucketing the code-lines: 
	1. We run [porcelain blame](https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---porcelain) on all the tracked files at each snapshot, so that every line is tracked at commit $C_t$ is mapped to it's original `author-time` {% sidenote "git-author-time" %} In Git, the author-time is the timestamp when the work in a commit was originally created by the author, typically set when the author first ran git commit. {% endsidenote %} timestamp bucketed by the calendar year.
	2. Generates a composition map like `{"2013": 45000, "2017": 12000, "2024": 85000}`

3. Fossil {% sidenote "what-is-fossil" %} Fossil represents old code snippets {% endsidenote %} discovery: Fossils are of two types:
	1. Genesis fossil, these can also be called historical fossils as they show us the single oldest line ever authored in the repository's history (pinned to [root commits](https://adamj.eu/tech/2023/09/30/git-show-initial-root-commit/))
	2. Survivor fossil, these can also be called living fossils as they show us the oldest line of code that is still alive at [HEAD](https://stackoverflow.com/questions/2304087/what-is-head-in-git?__cf_chl_tk=Y6LzoIrRshnck18VEk6D7P1SbRYYpigOEj3jeRlGUr8-1792310036-1.0.1.1-xaiUGeu0UMU6exfIAZnQmDjpU1.EKMk5kDaKFiQlQZw) {% sidenote "git-head" %} HEAD in Git is a pointer that indicates the current branch or commit you are working on. {% endsidenote %} today
4. Metrics calculation: Finally we calculate a few metrics namely
	1. Birth year: shows the founding year of the codebase
	2. Oldest living year: the earliest year bucket with $>0$ surviving lines at HEAD. {% sidenote "git-head" %} HEAD in Git is a pointer that indicates the current branch or commit you are working on. {% endsidenote %}
	3. Foundation retention rate: this shows the percentage of lines from the founding year surviving at HEAD: {% sidenote "git-head" %} HEAD in Git is a pointer that indicates the current branch or commit you are working on. {% endsidenote %} $\frac{\text{Lines}_{\text{birth}}}{\text{Lines}_{\text{total}}} \times 100$.
	4. Mean code age: Line-weighted average age of the codebase: $\frac{\sum (\text{Lines}_y \times (\text{Year}_{\text{current}} - y))}{\text{Lines}_{\text{total}}}$.
	5. Peak preservation year: historical year contributing the largest surviving block of code
	6. Greatest transformation: Month of the single largest historical drop in original code lines (identifying major rewrites like React 16 Fiber or Numpy 2.0)
5. Two-faceted view: I like to show two views, the changes piled based on yearly cadence and second being the philosophical view where we have original vs refactored {% sidenote "original-defination" %} Original is defined as the code written in the foundational year of the software, so if a library was written in 2016, the original code will be everything that belongs to that specific year and anything that is updated in the subsequent year become the refactored code {% endsidenote %}
	1. In simpler terms, original code is code written in year 0
	2. refactored code has all subsequent years i.e., (year 1 ... year N)

Now this is just me describing the features, but if you'd want to try it out for yourself and you are in the year of 2026 then you can directly click on the following link to check it out
- Theseus Dashboard: [https://theseus.asifdotexe.workers.dev/](https://theseus.asifdotexe.workers.dev/)

Optimistically speaking, if you are reading this blog after 2026, this is most likely fixed so if you want to understand how the codebase looked at the time of writing it, then you can use git to traverse back to the following commit 
- `a5181b3067ce4d6abf90087572eddb1d132804c2` using the following repository: [https://github.com/Asifdotexe/Theseus](https://github.com/Asifdotexe/Theseus)

(PS: The implementation is done)
### Now, what went wrong?

A lot, and I believe the best way to explain that would be a timeline. ready for the scare?
1. Phase 1 is where I built the python prototype of this project, it was basic Python + Vanilla JS, worked for the project at that scale.
2. Phase 2 is when I hit a wall, a very firm, very tall performance wall. so basically I was running python [subprocesses](https://docs.python.org/3/library/subprocess.html) for [git blame](https://git-scm.com/docs/git-blame) across 60 snapshots {% sidenote "snapshot-math" %} Remember how in the previous section we did quarterly snapshots prior to 2025 and monthly post 2025, this would make sense now hopefully? {% endsidenote %} on large codebases like react, numpy {% sidenote "numpy-size" %} Numpy in itself was a huge task, as even with the quarterly before 2025 rule. numpy has 89 snapshots till the end of 2024 since it dates back to Dec 2001. and post that 2025 had 12 snapshots and 2026 also had 6 snapshots making the total to 107 snapshots for numpy alone... bruh {% endsidenote %}, langchain this took me 20+ hour {% sidenote "additional-painpoint" %} Not to mention, I work on a 8GB RAM DDR4 potato {% endsidenote %} due to [Python's GIL and process creation overhead](https://stackoverflow.com/questions/7404904/python-global-interpreter-lock-gil-problem)
3. Phase 3 is where I begin implementing some patches, I saw that the JSONs that were generated were very hard to review, hence I turned them into [JSONL](https://jsonltools.com/jsonl-vs-json) to ensure they are append only *(referring to [`*_history.jsonl`](https://github.com/Asifdotexe/Theseus/tree/ed7bbbd0543164547ed9b3560045ef0b1b69ed5f/data/raw))* and split states into [`*_state.json`](https://github.com/Asifdotexe/Theseus/tree/ed7bbbd0543164547ed9b3560045ef0b1b69ed5f/data/state)
4. Phase 4 is where I bit off more than I could chew, to preface this you need to know that I was starting to learn rust and hence I felt like I could just try to make sense of stuff and vibe code an engine, now this migration to rust can honestly be called half baked or incomplete because it was. What did I do? I rewrote the snapshot blame engine in rust (see, [`engine/src/main.rs`](https://github.com/Asifdotexe/Theseus/blob/ed7bbbd0543164547ed9b3560045ef0b1b69ed5f/engine/src/main.rs)) using `git2` and `rayon`. Now honestly the speed improved by 100x, but instead of replacing the pipeline, Rust was just grafted on as a subprocess called via Windows batch files (see, [`run_engine.bat`](https://github.com/Asifdotexe/Theseus/blob/ed7bbbd0543164547ed9b3560045ef0b1b69ed5f/run_engine.bat))
5. Phase 5, when you think things couldn't get worse they do. after all the things we did it left the project with two run times i.e., (Python 3.12 via Poetry + Rust 2024 via Cargo), beyond that ~350 lines of dead python code, duplicate repository cloning, silent deserialization failures, and 58 MB of uncompressed raw blame data committed into Git. Oh, and the cherry on top? Cloudflare Workers was configured to serve the entire repository root directory, meaning anyone with a browser could curl `/engine/src/main.rs` and read my raw data caches over the public internet. LMAOOOO, isn't this absolute cinema?

Now as brutal as it was to read, it was harder to write as owning your own bad mistakes is hard, but this is important.

So let's break down all the major flaws subsystem by subsystem:

### 1. Oh dude, git lost. (git traversal and subprocess shitsoup)
Initially in my lamely written pythons script, to calculate blame {% sidenote "blaming-myself" %} Blame is the git command that shows the author and revision (commit) information for each line in a file, helping you ensure you BLAME the right person for contributing towards the code smell (in this case, me) {% endsidenote %} for a snapshot commit, I literally spawned an OS subprocess running `git blame --line-porcelain` for every single tracked file. On a repository like NumPy or React with thousands of files across 60 to 100 snapshots, that meant spawning hundreds of thousands of shortlived operating system processes which doesn't translate to effective working pipeline in short. why? read sidenote. {% sidenote "gil-agony" %} Layman translation: Imagine you have 100 workers, but your company policy only allows one person to speak at a time while everyone else waits in total silence. That was Python's GIL trying to juggle thousands of external git subprocesses on an 8GB laptop. {% endsidenote %}

The Python Global Interpreter Lock (GIL) choked my pipelines. Process creation overhead on Windows made it crawl as if it got shot in it's foot. My laptop fans sounded like a [Boeing 747](https://youtu.be/kdrAVxTbOsI?t=80) that could taking off any moment now, and the pipeline ran for 20+ hours just to crash near the end ;-; (I cried btw)

### 2. Data storage (how the serde cache was murdered silently)
I am to blame for this because when I hastily built the Rust engine in Phase 4, Python wrote the state cache file formatted like this:
```json
{
  "commit_hash": "a1b2c3d4...",
  "file_compositions": {
    "src/index.js": { "2018": 120, "2019": 45 }
  }
}
```
Meanwhile, over in Rust (`engine/src/main.rs`), my deserializer was expecting a flat dictionary like this:
```rust
let state: HashMap<String, HashMap<String, u32>> = serde_json::from_reader(file)?;
```
Because the outer JSON object had `commit_hash` and wrapped the map inside `file_compositions`, serde could not deserialize it into a flat hash map. 

Naturally you'd ask did Rust crash or throw an error right??? <br>
ME: Ummmm...  <br>
Any rational person: It threw an error right???  <br>
ME: Nopeeeeeee it didn't ;-; <br>

So what happened instead?
My code had a very innocent `if let Ok(state) = ...` guard. because serde quietly returned an `Err`, Rust shrugged, defaulted `file_compositions` to completely empty, and silently threw away the entire cached history (i.e., undoing everything done previously) hence we arrive at the comedic result where every single time the engine ran, it re-blamed the entire repository from scratch without me realizing it. {% sidenote "silent-cache-murder" %} Layman translation: Rust was looking for a banana. Python handed it a banana, an apple and a few lichees. Now since Rust was only looking for a banana instead of complaining, It quietly yeeted everything away and walked to the farm to plant banana seeds from scratch. Every. Single. Run. {% endsidenote %}

### 3. Fossil extraction problem (I did everything twice here)

If you haven't recovered from what you read above, here is more trauma dumping (Thank you Big 2026)

To find the "living fossil" (the oldest surviving line of code alive at HEAD today), my Python pipeline was written in a truly unhinged manner: it cloned the target repository a *second* time into a separate directory, iterated over every file, and executed another complete `git blame` pass from scratch! 

We were already blaming every single line in every single file during the snapshot generation pass. and since the fossil module was implemented separately when I built it I didn't think to utilize the results from the initial blaming and hence was not supported for any new repository as well hence what happened is even for the newer repositories we threw that data away and re-blamed the entire repository a second time just to find a single timestamp!

### 4. CI/CD: Committing ~~(a crime)~~ 58 MB of raw text to git

Now that wouldn't sound like much to a lot of you folks, but here is why it matters.
Because we saved granular line compositions for every file across every historical snapshot, our `data/raw/*_history.jsonl` files ballooned to **58 MB of uncompressed JSON**. And because the pipeline committed these files back into the git repository automatically, the git history swelled with tens of thousands of duplicate line counts. 

Clone times in CI skyrocketed, and GitHub Actions runners started running out of disk space and memory.

### 5. Frontend & Security: The Exposed Root
In `wrangler.jsonc`, the configuration that tells Cloudflare Workers which folder to serve to the web, the asset directory was set to `.`:
```jsonc
{
  "assets": {
    "directory": "." // Wait... the ENTIRE repository root?!
  }
}
```
Now, to be clear: Theseus is an open-source public repository on GitHub, so exposing `engine/src/main.rs` wasn't leaking corporate proprietary trade secrets. But from an architectural and web hygiene standpoint, it was horrible. Your public web server is not your local file system! If I had ever accidentally created an `.env` file, a temporary token, or an uncompiled test script in that directory, anyone could have [curld](https://curl.se/docs/manpage.html) it directly off Cloudflare's edge CDN.

### 6. A lot of clutter at the root
Look at what was living in the root directory: Windows `.bat` files (`run_engine.bat`, `build_engine.bat`), Python modules, Rust manifests (`Cargo.toml` nested inside an `engine/` subfolder), `Taskfile.yml`, `Makefile`, and temporary data caches. Two complete runtime ecosystems fighting for dominance in the same project.

---

## Now that's enough bad news.
The good news? The core problem is fundamentally small. With 4 targeted architectural decisions, the goliath can be reduced to a lean, combatively-fast engine feeding a reasonably cleanly decoupled static frontend.

---

## So, how did I figure out the solution?

Late one night instead of saving the Gotham city, I pulled out [Scott Chacon and Ben Straub's *Pro Git* (specifically Chapter 10 on Git Internals)](https://www.oreilly.com/library/view/pro-git-second/9781484200766/9781484200773_Ch10.xhtml). I started re-reading how Git actually works under the hood. 

Git isn't a list of diffs. Git is a **content-addressed Merkle Directed Acyclic Graph (DAG)** of trees and blobs.

Every commit points to a root **Tree** object. That tree points to subtrees (directories) and blobs (files). Each tree has an immutable SHA-1 or SHA-256 hash calculated strictly from its contents. {% sidenote "sha1-vs-sha256" %} Why both? Historically, Git used 160-bit SHA-1 hashes (the familiar 40-character hex strings we all copy-paste). But after researchers proved SHA-1 collision attacks were practical in 2017 (the SHAttered attack), Git began transitioning to 256-bit SHA-256 (64-character strings). In simple terms: a hash is a digital fingerprint. If you change even a single comma in a file, its fingerprint changes completely. SHA-1 gives a 40-character fingerprint; SHA-256 gives a 64-character fortress. Git supports both today. {% endsidenote %}

```
       [Commit A (2023-01)]                     [Commit B (2023-04)]
         Tree OID: a1b2c3                         Tree OID: d4e5f6
          /            \                           /            \
    Subtree: src/   Subtree: docs/           Subtree: src/   Subtree: docs/
    (OID: 778899)   (OID: 112233)            (OID: 778899)   (OID: 445566)
          │                                        │                │
     [UNCHANGED!]                             [UNCHANGED!]     [MODIFIED!]
```

Look at `src/` in the diagram above. Notice how `src/` has the exact same Tree OID (`778899`) in both Commit A and Commit B?

If the tree hash is identical, **not a single file, not a single line, not a single character inside that directory changed between January and April.**

### The first epiphany: Git already computed the diff for us
In my naive Python prototype, to calculate the state at snapshot $t$, I blamed all files in snapshot $t$ from scratch. That's $O(\text{files} \times \text{snapshots})$.

In the Merkle recurrence model, snapshot state is simply:
$$S_t = S_{t-1} \oplus \Delta(T_{t-1}, T_t)$$

Where:
- $S_{t-1}$ is the line-ownership distribution we already calculated for the previous snapshot.
- $T_t$ is the Git Tree object at snapshot $t$.
- $\Delta(T_{t-1}, T_t)$ is the set of files that were added, modified, or deleted between trees.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             THE TWO APPROACHES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ NAIVE (BRUTE FORCE):                                                        │
│ Snapshot 1 (2020): Blame 5,000 files ─────────────► Takes 8 minutes         │
│ Snapshot 2 (2021): Blame 5,000 files (again!) ────► Takes 8 minutes         │
│ Snapshot 3 (2022): Blame 5,000 files (again!) ────► Takes 8 minutes         │
│                                                                             │
│ LEAN MERKLE RECURRENCE:                                                     │
│ Snapshot 1 (2020): Blame 5,000 files ─────────────► Takes 8 seconds (Rust)  │
│ Snapshot 2 (2021): Diff T1->T2: Only 12 files changed!                      │
│                    Blame 12 files, carry forward 4,988! ──► Takes 0.2 sec   │
│ Snapshot 3 (2022): Diff T2->T3: Only 8 files changed!                       │
│                    Blame 8 files, carry forward 4,992! ──► Takes 0.1 sec    │
└─────────────────────────────────────────────────────────────────────────────┘
```

Using `libgit2`'s `diff_tree_to_tree()`, Git instantly tells us which specific file blobs changed. We only blame the modified files and update our histogram. Everything else is carried forward! {% sidenote "merkle-gist" %} Layman translation: If you want to know what changed in a 500-page book from edition 1 to edition 2, you don't re-read all 500 pages from cover to cover. You look at the publisher's changelog, see that only Chapter 4 was revised, read those 10 pages, and carry forward the rest. {% endsidenote %}

---

### The second epiphany: Calculate the living fossil was literally free
Remember the double-clone problem where we spent 10 minutes re-blaming the repository just to find the oldest surviving line?

While writing the Rust engine, I had a sudden moment of clarity:
When the engine reaches the very last snapshot (HEAD), it is *already* inspecting every single line of code in the repository to build the final year composition histogram!

Every line hunk {% sidenote "hunking" %}  A hunk in Git is a block of changes in a diff, read more here: https://stackoverflow.com/questions/37620729/ddg#37620752 {% endsidenote %} in `libgit2` has an `author_timestamp`. If we just maintain a single variable during that pass:
```rust
if hunk_time < oldest_timestamp {
    oldest_timestamp = hunk_time;
    living_fossil = candidate;
}
```
The living fossil is extracted **as a zero-cost side-effect of the snapshot blame!** 
The entire secondary clone pass, the extra Python scripts, and the 10-minute subprocess runtime were completely deleted. Total time to extract living fossils came down to a staggering **0.00 seconds**.

---

### The third epiphany: Making a peace treaty between Rust and Python
To permanently fix the silent serde deserialization failure, we defined an explicit, shared contract between Rust and Python:

```rust
#[derive(Serialize, Deserialize, Debug)]
pub struct StateData {
    pub commit_hash: String,
    pub file_compositions: HashMap<String, HashMap<String, u32>>,
}
```
Now, whenever Rust loads a state file, it doesn't just deserialize cleanly; it verifies that the `commit_hash` in the state matches the commit of the baseline period. If a user runs `--reprocess 2024-06`, the engine discards subsequent state and establishes a clean baseline. No silent failures. No corrupted state. No more melting of the polar ice caps (That one is beyond my paygrade but people say that Mumbai will eventually sink by 2050, is it true chat?)

---

### The fourth epiphany: Rust and python will still be room-mates (why python wasn't evicted??)

Usually when engineers realize Rust is 100x faster, the immediate dogmatic impulse is: *"REWRITE THE ENTIRE PROJECT 100% IN RUST! DELETE ALL PYTHON!"*

And honestly I was almost there too. But then I asked myself: What is Python actually good at? And what is Rust actually good at?

- Rust is awesome at raw compute, deterministic memory management, parallel multi-threading via Rayon, zero-overhead C-bindings to `libgit2`.
- Python is awesome at quick file orchestration, parsing JSON schemas, running rich test suites with `pytest`, glue scripts, and rapid automation without a 3-minute `cargo build --release` cycle every time you change a command-line flag.

The real architectural breakthrough wasn't declaring a holy war between languages; **it was drawing a clean, uncrossable boundary between them.** So here is how I see it:

```
┌────────────────────────────────────────────────────────┐
│               PYTHON (The Control Plane)               │
│   • Clones repository once to temporary directory      │
│   • Resolves arguments and snapshot date intervals     │
│   • Spawns the Rust release binary                     │
│   • Validates output JSON schemas and test assertions  │
└───────────────────────────┬────────────────────────────┘
                            │ CLI Flags (--repo, --out)
                            ▼
┌────────────────────────────────────────────────────────┐
│                RUST (The Compute Engine)               │
│   • Fast parallel git traversal via libgit2 & Rayon    │
│   • Merkle tree diffing (T_{t-1} -> T_t)               │
│   • Single-pass Genesis & Living Fossil extraction     │
│   • Writes unified StateData and history JSONL         │
└────────────────────────────────────────────────────────┘
```

That separation turned a fragile implementation into something that I would like to call a joy to maintain (as I am the only one maintaining it right now).

---

### The fifth epiphany: not being too public (do people have these many epiphanies?)
To solve the Cloudflare asset exposure, we created a strict `public/` boundary:
```
Theseus/
├── engine/             <-- Rust engine source code (PROTECTED)
├── scripts/            <-- Python pipeline scripts (PROTECTED)
├── data/raw/           <-- Internal history & state (PROTECTED)
└── public/             <-- ONLY THIS IS SERVED TO THE WEB!
    ├── index.html
    ├── style.css
    ├── app.js
    └── data/processed/ <-- Minified public graph JSONs only
```
In `wrangler.jsonc`, we updated `assets.directory = "public"`. 
Now, Cloudflare Workers serves client assets exclusively. If a malicious bot or curious user tries to browse to `/engine/src/main.rs`, they get a clean `404 Not Found`. Internal pipelines stay internal.

---

## Questions I should have asked myself.
1. *Am I re-computing data that Git already calculated for me?* (Yes, Merkle tree diffs exist for a reason).
2. *Is this silent fallback hiding a catastrophic deserialization bug?* (`if let Ok(...)` without logging an error is a trap).
3. *Why am I spawning hundreds of OS processes when a library with C-bindings exists?* (`libgit2` via Rust beats `subprocess.Popen` in Python every single day of the week).
4. *Where does the public web root end, and where does my private pipeline begin?* (Always quarantine static assets in `public/`).

## Takeaways in short

Even if you understood nothing from this blog, at least takeaway these four system design learnings if you are working on a similar nature of project.

- **Don't fight the runtimes instead partition them:** Use compiled systems languages for heavy parallel computation, and high-level scripting languages for orchestration.
- **Silent failure is worse than a hard crash:** If your cache fails to deserialize, crash loudly with a descriptive error. Do not default to empty and burn 20 hours recomputing state.
- **Piggyback on loops you are already running:** If you are already touching every line in the file, extract your secondary metrics in the same loop. Free data is the best data.
- **Read the foundational literature:** Spending two hours reading *Pro Git* saved tens of hours of wasteful CPU cycles. Understand your tools at the data structure level.

That's all from me, the ship was saved (Checkout [version 2.0.0](https://github.com/Asifdotexe/Theseus/releases/tag/v2.0.0)), Peace out!