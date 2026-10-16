---
layout: post
title: "Finally decided to clean the crap on my laptop"
author: Asif Sayyed
date: 2026-09-25
excerpt: "A raw log of how I reclaimed over 60 GB of disk space, merged my C: and D: partitions back together without breaking Windows, and set up a simple two-level folder structure."
tags:
  - productivity
  - tech
  - workflow
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

## Why does this note exist?

When I bought this laptop back in 2022 {% sidenote "purchased" %} A 512 GB SSD machine. {% endsidenote %}, a friend {% sidenote "hey-meeth "%} Hey Meeth, if you are reading this! {% endsidenote %} gave me some classic advice: *"Partition your drive into C: and D:. That way, if Windows goes down, your projects on D: stay safe."*

It made total sense to me at the time. I carved out roughly 280 GB for `C:` and about 195 GB for `D:`.

A few days ago, Windows started screaming about low storage on `C:`. I had less than 45 GB free, while `D:` just sat there completely untouched with 185 GB doing nothing. Windows dumps almost everything into `C:` by default: temp files, updates, pip caches, node modules. I was doing the exact same thing with my own downloads, and then constantly fiddling with custom installation paths just to scrape together a few hundred megabytes.

The friction got annoying enough that I decided to fix it properly. I merged `C:` and `D:` back into one ~476 GB drive, cleared out roughly 60 GB of stale dev caches and leftover installers, and flattened my home directory into a simple two-level setup.

This note is the log of what I did, what broke along the way, and the rules I follow now so I do not end up in the exact same spot six months from now.

---

## 1. Part one, part-ition (pun intended)

Before touching any partition tables, I had to stop and ask why I even had a `D:` drive in the first place.
{% sidenote "partition-myth" %}
Partitioning a single SSD is basically putting a cardboard divider inside a cardboard box. If the left side gets messy, the right side stays clean. But if the box catches fire, you lose everything on both sides anyway. 
{% endsidenote %}

Here is the reality of the two scenarios:
- If Windows gets stuck in a blue-screen loop or a bad update forces a clean reinstall, keeping projects on `D:` means you can format `C:` without touching your personal files. {% sidenote "soft-failure" %} Soft failure: your Windows installation is busted, but the hardware is fine. {% endsidenote %}
- If the SSD itself dies, partitioning does nothing to save your data. Both `C:` and `D:` live on the exact same physical chip and controller. If that silicon goes bad, both drives disappear at the same second. {% sidenote "hard-failure" %} Hard failure: the actual physical drive dies. {% endsidenote %}

If I actually care about backup safety, that belongs in the cloud or on an external hard drive, not in arbitrary drive letters on the same physical stick of storage. Managing two cramped partitions on a 512 GB drive was just pure overhead for zero extra safety. Merging them back together was the obvious call.

---

## 2. Merging the drives without losing files

The basic plan was simple: copy all my project files {% sidenote "just-projects" %} That was basically all I had on `D:` anyway, just old projects. {% endsidenote %} from `D:\` over to `C:\`, delete the empty `D:` partition, and stretch `C:` across the rest of the disk. Doing that in modern Windows with BitLocker turned on had a small catch, but the copy came first.

### 2.1. Moving stuff with Robocopy
I had over 150,000 files on `D:`, mostly git repos and virtual environments. Dragging and dropping that in File Explorer is asking for Windows to freeze halfway through or mess up modified timestamps. I used `robocopy` in PowerShell instead: {% sidenote "robocopy-notes" %}
If you run this in PowerShell, escape `$RECYCLE.BIN` with a backtick like `` `$RECYCLE.BIN ``. Otherwise PowerShell assumes `$RECYCLE` is an empty variable and throws an invalid parameter error.
{% endsidenote %}

```powershell
robocopy D:\ C:\Users\<username>\dev\active /E /COPY:DAT /DCOPY:DAT /XF pagefile.sys hiberfil.sys dumpstack.log /XD "`$RECYCLE.BIN" "System Volume Information" /R:1 /W:1 /V /NP /LOG:"C:\Users\<username>\copy_log.txt" /TEE
```

A few flags that saved me real headaches:
- `/E`: Recursively grabs all subdirectories, including empty ones.
- `/COPY:DAT` and `/DCOPY:DAT`: Preserves data, attributes, and original timestamps so every file does not suddenly look like it was created today.
- `/XD` and `/XF`: Skips locked system folders like `$RECYCLE.BIN` and `System Volume Information`.
- `/R:1 /W:1`: If a file is locked, wait one second and retry once, then move on. By default robocopy retries one million times, which hangs your terminal indefinitely.

Once the summary printed `Failed: 0`, all 158,000+ files were sitting safely on `C:`.

### 2.2. The sandwiched recovery partition
Once the files were moved, I opened Disk Management (`diskmgmt.msc`) to delete `D:` and expand `C:`. But when I right-clicked `C:`, "Extend Volume" was greyed out.

I looked at the partition bar at the bottom:
```text
[EFI 260MB] | [Windows (C:)] | [883 MB Recovery Partition] | [New Volume (D:)]
```

Windows can only extend a partition into unallocated space that sits directly next to it on the right. Sitting right between `C:` and `D:` was an 883 MB Windows Recovery Environment (WinRE) partition.

To fix this with built-in tools:
1. Turn off the recovery tool temporarily:
   ```cmd
   reagentc /disable
   ```
2. Open `diskpart`, select the disk, delete the `D:` volume, and delete the middle recovery slice using the override flag:
   ```cmd
   diskpart
   select disk 0
   select volume D
   delete volume override
   select partition 4
   delete partition override
   exit
   ```
3. Go back to Disk Management and extend `C:` across the newly freed unallocated space.
4. Carve out a clean 1 GB slice at the very end of the drive for WinRE, format it, and turn recovery back on: {% sidenote "bitlocker" %}
If you have BitLocker enabled, `reagentc /enable` will refuse to work directly on `C:` because the recovery tools cannot live on an encrypted volume without an unencrypted slice. Creating that small 1 GB partition at the end fixes it immediately.
{% endsidenote %}
   ```cmd
   diskpart
   select disk 0
   select volume C
   shrink desired=1024
   create partition primary
   format quick fs=ntfs label="Recovery"
   set id="de94bba4-06d1-4d40-a16a-bfd50179d6ac"
   gpt attributes=0x8000000000000001
   exit

   reagentc /enable
   ```

After that, the laptop was back on a single unified drive with around 250 GB of free space.

---

## 3. Finding where all the space went (WizTree audit)

Once the drive was merged, I downloaded WizTree to see what was actually eating up storage. I had nearly 60 GB of clutter sitting in folders I had completely forgotten about.

### 3.1. Developer tool caches (~40 GB)
If you build things with Python, Node, or Rust, package managers silently hoard gigabytes of cached wheels, tarballs, and old virtual environments in `AppData`.

Poetry was the biggest offender: `AppData\Local\pypoetry\Cache` held 20 GB of downloaded wheels, and `virtualenvs` had another 15.6 GB from abandoned projects:
```bash
poetry cache clear --all pypi
```

npm was sitting on 11 GB of cache:
```bash
npm cache clean --force
```

uv had about 6 GB:
```bash
uv cache clean
```

And pip:
```bash
pip cache purge
```

Running those four commands took about two minutes and reclaimed over 40 GB right away.

### 3.2. Old recordings and setup installers (~15 GB)
In `Videos\Screen Recordings`, I found several raw `.mp4` and `.gif` files from past demos. One 20-minute recording alone took up 2.5 GB.

In `Downloads`, I had accumulated 2.3 GB of CUDA setup files (`cuda_*.exe`), random ISOs, and `.exe` installers for software I had already installed months ago. Once an app is installed, the installer is just dead weight.

### 3.3. The 23 GB file: `pagefile.sys`
Right in the middle of the WizTree scan sat a 23 GB file called `pagefile.sys`.

I initially wondered if I should cap it at 4 GB or 8 GB to save space. {% sidenote "pagefile-learning" %}
Windows expands `pagefile.sys` when you run heavy memory workloads like large datasets or model evaluations. The catch is that Windows rarely shrinks it back down until you reboot.
{% endsidenote %}

In the end, I decided to leave it on System Managed:
- Now that the drive is unified and I have over 250 GB free, giving up 15 or 20 GB to virtual memory is not a big deal.
- Data pipelines and local agent workflows have spiky memory usage. If you cap the pagefile to 8 GB and your code spikes past RAM, Windows will just kill the process with a `MemoryError`.
- Leaving it managed provides an emergency cushion so heavy jobs do not crash halfway through.

---

## 4. Setting up a 2-level folder structure

Cleaning up your disk only helps if you do not immediately start dumping files back onto your Desktop.

My old setup had folders nested four or five layers deep (`Documents/Work/2026/Projects/...`). That led to long path errors in npm and Python, made terminal navigation slow, and made finding files tedious.

### Group by purpose, not file type
Instead of sorting by file format (putting all PDFs in one spot and all spreadsheets in another), I organized around what I am actually doing when I open them.

I put everything directly inside my user root (`C:\Users\<username>\`) with a hard rule of keeping it two levels deep: {% sidenote "why-no-wrapper" %}
I considered wrapping all four folders inside a parent folder like `workspace\`, but that adds friction. When you open PowerShell or Git Bash, you land right at `C:\Users\<username>\`. Having `dev` and `work` right there means you only ever type `cd dev/active`.
{% endsidenote %}

```text
C:\Users\<username>\
├── dev\                          # Active coding and technical projects
│   ├── active\                   # Current repos and scripts
│   ├── archive\                  # Finished or dormant projects
│   ├── assets\                   # Prompts, templates, agent context
│   └── data\                     # Local databases, raw CSVs, datasets
│
├── life\                         # Personal administration
│   ├── finance\                  # Payslips, tax documents, bank records
│   ├── id\                       # Passports, identity documents
│   └── notes\                    # Obsidian vault, markdown notes
│
├── work\                         # Career and reference material
│   ├── talks\                    # Slides, presentation decks, recordings
│   ├── library\                  # Reference books, papers, reports
│   └── career\                   # CVs, resumes, certificates
│
├── media\                        # Visual assets
│   ├── photos\                   # Personal and professional photos
│   └── captures\                 # Screenshots, screen recordings
│
└── Downloads\                    # Landing inbox, cleared out weekly
```

### Keeping the terminal clean
The downside of putting project folders directly in `C:\Users\<username>\` is that running `ls` in PowerShell lists dozens of tool configuration directories (`.cargo`, `.claude`, `.config`, `.ssh`, `.gemini`).

Instead of moving them, I set their Windows attribute to Hidden:

```powershell
Set-Location $env:USERPROFILE
Get-ChildItem -Directory -Filter ".*" -Force | ForEach-Object {
    $_.Attributes = 'Hidden'
}
```

Now `ls` only shows the main work folders and standard Windows shortcuts:
```text
Mode                Name
----                ----
d-----              dev
d-----              Documents
dar---              Downloads
d-----              life
d-----              media
d-----              work
```

---

## 5. Rules to keep it clean

To keep this setup from decaying back into clutter:

1. Keep the Desktop empty. No loose PDFs, screenshots, or random shortcuts. Everything launches through the Windows search bar or taskbar pins.
2. Treat Downloads as an inbox, not storage. Files land there temporarily. Once a week, they either get moved into their proper folder (`work/library`, `life/finance`, `dev/data`) or deleted.
3. Turn on Storage Sense. Let Windows clear out temporary files and the Recycle Bin every 30 days.
4. Purge package caches when space tightens. Running cache clean commands for Poetry and uv takes seconds and reclaims dozens of gigabytes.

---

## 6. Periodic maintenance checklist (note to future self)

To past and future Asif: you know how you work. You build things fast, try new libraries, pull down datasets, and before you know it, you are wondering where 50 GB went.

Do not wait for Windows to throw low-space warnings before cleaning up. Here is the realistic schedule to follow:

### Weekly (Friday wrap-up)
- Clear Downloads: If an installer `.exe` or `.zip` was already extracted or installed, delete it immediately. Move papers or books to `work/library` and datasets to `dev/data`.
- Clear the Desktop: If there is a stray notebook or screenshot on the screen, move it to `dev/active` or `media/captures`. Do not leave it sitting over the weekend.
- Empty the Recycle Bin so deleted files actually free up disk space.

### Monthly (First weekend of the month)
- Purge dev package caches using this one-liner: {% sidenote "monthly-purge" %}
  This takes 30 seconds and consistently recovers between 5 GB and 20 GB of cached wheels and tarballs.
  {% endsidenote %}
  ```powershell
  poetry cache clear --all pypi; uv cache clean; npm cache clean --force; pip cache purge
  ```
- Run a quick WizTree scan on `C:` to catch rogue screen recordings in `Videos/Screen Recordings` or runaway log files.
- Prune `dev/active`: If you finished a prototype or have not touched a repo in a month, move it into `dev/archive`.

### Quarterly
- Wipe old virtual environments: Delete `.venv` and `node_modules` folders inside `dev/archive`. You can always reinstall them if you pick a project back up later. There is no reason to hoard 4 GB of dependencies for dormant work.
- Check recovery status: Run `reagentc /info` in an admin prompt to make sure major Windows updates did not unregister the recovery partition.
- External backup sync: Copy the contents of `life/` and `work/` to an external drive or cloud backup. Remember the cardboard box analogy: the laptop SSD can still fail at any time.

### Update: 16th October 2026
- Created a script to [clean up](https://github.com/Asifdotexe/backpocket/blob/main/src/backpocket/commands/cleanup.py) for running this we need to run the following command
  ```
  backpocket cleanup
  ```
