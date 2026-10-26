---
layout: post
title: "Saving the sinking ship: Project Theseus"
author: Asif Sayyed
date: 2026-10-18
excerpt: Journalling the mistakes made during the v1.0.0 of Theseus
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

### Now, what went wrong?

A lot, and I believe the best way to explain that would be a timeline. ready for the scare?
1. Phase 1 is where I built the python prototype of this project, it was basic Python + Vanilla JS, worked for the project at that scale.
2. Phase 2 is when I hit a wall, a very firm, very tall performance wall. so basically I was running python [subprocesses](https://docs.python.org/3/library/subprocess.html) for [git blame](https://git-scm.com/docs/git-blame) across 60 snapshots {% sidenote "snapshot-math" %} Remember how in the previous section we did quarterly snapshots prior to 2025 and monthly post 2025, this would make sense now hopefully? {% endsidenote %} on large codebases like react, numpy {% sidenote "numpy-size" %} Numpy in itself was a huge task, as even with the quarterly before 2025 rule. numpy has 89 snapshots till the end of 2024 since it dates back to Dec 2001. and post that 2025 had 12 snapshots and 2026 also had 6 snapshots making the total to 107 snapshots for numpy alone... bruh {% endsidenote %}, langchain this took me 20+ hour {% sidenote "additional-painpoint" %} Not to mention, I work on a 8GB RAM DDR4 potato {% endsidenote %} due to [Python's GIL and process creation overhead](https://stackoverflow.com/questions/7404904/python-global-interpreter-lock-gil-problem)
3. Phase 3 is where I begin implementing some patches, I saw that the JSONs that were generated were very hard to review, hence I turned them into [JSONL](https://jsonltools.com/jsonl-vs-json) to ensure they are append only *(referring to [`*_history.jsonl`](https://github.com/Asifdotexe/Theseus/tree/ed7bbbd0543164547ed9b3560045ef0b1b69ed5f/data/raw))* and split states into [`*_state.json`](https://github.com/Asifdotexe/Theseus/tree/ed7bbbd0543164547ed9b3560045ef0b1b69ed5f/data/state)
4. Phase 4 is where I bit off more than I could chew, to preface this you need to know that I was starting to learn rust and hence I felt like I could just try to make sense of stuff and vibe code an engine, now this migration to rust can honestly be called half baked or incomplete because it was. What did I do? I rewrote the snapshot blame engine in rust (see, [`engine/src/main.rs`](https://github.com/Asifdotexe/Theseus/blob/ed7bbbd0543164547ed9b3560045ef0b1b69ed5f/engine/src/main.rs)) using `git2` and `rayon`. Now honestly the speed improved by 100x, but instead of replacing the pipeline, Rust was just grafted on as a subprocess called via Windows batch files (see, [`run_engine.bat`](https://github.com/Asifdotexe/Theseus/blob/ed7bbbd0543164547ed9b3560045ef0b1b69ed5f/run_engine.bat))
5. Phase 5, when you think things couldn't get worse they do. after all the things we did it left the project with two run times i.e., (Python 3.12 via Poetry + Rust 2024 via Cargo), beyond that ~350 lines of dead python code, duplicate repository cloning, silent deserialization failures and 58 MB of uncompressed raw blame data committed into Git. LMAOOOO, isn't this absolute cinema?

Now as brutal as it was to read, it was harder to write as owning your own bad mistakes is hard, but this is important.

So if we go by each section namely and point out all the flaw then it will point a clearer picture on what it does, if you are not a big fan of granular details then you can jump straight to section (xxx):
- Engine and git traversal
- Data storage and schema design
- Fossil extraction
- CI/CD pipeline
- Frontend
- Overall repository structure

(add notes here)


## Now that's enough bad news.
The good new? The core problem is fundamentally small, with 4 of 5 targeted architectural decisions, the goliath can be reduced to lean, and really fast single binary engine that would feed a neatly decoupled static frontend.



## How to make recursion lean?
Git is content-addressed Merkle DAG, DAG stands for direction acyclic graph of trees, each tree points to subtrees and blobs, so in an incremental pipleline, snaptshot state is recurrence relation $$S_t = S_{t-1} \oplus \Delta(T_{t-1}, T_t)$$ Where, 
$S_t$ is the line-ownership distribution at snapshot $t$.
$T_t$ is the root Git Tree OID at snapshot $t$.
$\Delta(T_{t-1}, T_t)$ is the set of files that were added, modified, or deleted between trees.

#### So there are some recursive optimizations to get, but why does the current pipeline miss them?
Currently, the engine does a shallow flat file diff:
1. It compares tree $T_{t-1}$ to $T_t$ to get changed file paths.
2. For every changed file path, it re-blames the entire file from scratch, parsing every line.
3. If a 10,000-line file has 1 line edited, it blames all 10,000 lines.
4. It ignores tree-level Merkle hashes. If an entire directory (e.g. src/components/) was untouched between 2021 and 2023, its subtree OID is identical.

#### So what can we do to make it leaner?

For specific decisions to be taken: 
- DECISION 1: Consolidate engine into 100% Rust binary
	- Eliminate Python, Poetry, pyproject.toml, and .bat wrappers from the data pipeline.
	- Rust handles: git clone -> snapshot traversal -> blame -> fossils -> minified graph JSON.

- DECISION 2: Single-Pass Combined Blame & Fossil Discovery
	- During the snapshot loop, the final snapshot at HEAD is blamed.
	- The engine captures:
	    a) Composition histogram: {year -> count}
	    b) Survivor fossil: min(author_timestamp) across all blamed hunks
	    The living fossil is produced as a free zero-cost side-effect of the snapshot blame!
	    Fossil stage runtime drops from 10 minutes to 0.00 seconds.

- DECISION 3: Purge Legacy File Compositions (58 MB -> 75 KB)
	- Strip the dead 'file_compositions' key from all history files.
	- Save state strictly as a compact binary or single-file state cache.
	- Git repository shrinks by tens of megabytes; network transfers become instantaneous.

- DECISION 4: Isolate Frontend Assets in a Clean 'public/' or 'dist/' Directory
	- Move index.html, style.css, app.js, and assets/ into a dedicated web root.
	- Cloudflare Workers only serves public distribution assets.
	- Zero risk of data leakage; clean project root.

## Questions to self to make better decisions? 
Add Q and A to figure out better decisions to make
## Design decisions to make?
Shortlist what needs to be done in terms of change.

#### Ease of copying

{% sidenote "" %} {% endsidenote %}
