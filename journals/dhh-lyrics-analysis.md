---
layout: post
title: "Project Log: DHH Lyrics Analysis"
author: Asif Sayyed
excerpt: This journal contains all the decisions I made and why I made them while developing towards updating / refactoring the DHH Lyrics Analysis project
tags: journal
---

## 2026-08-02

### Brainstorming
#### Core pain point
Currently there are arguments about "who is the most lyrical artists in Desi hip-hop" and we tend to rely on subjective opinions, twitter/X debates and reaction videos. there is no objective data-driven way for fans to compare lyrical complexity of their favorite artists and there is no centralized tool for industry professionals to understand how an artist's subject matter or linguistic style (e.g., their mix of English vs Hindi) has shifted over time

#### What will the user get? (value preposition)
The dashboard will provide a quantified view of the lyrical culture in DHH, this can help people have definitive answers to settle debates or just source of truth for discussions and also can serve as a fascinating look into an artist's journey.

Some specific thing that I can implement is:
- Leaderboard: a definitive ranking of artists based on their unique vocabulary size, for example (not based on data rn): a fan can instantly see of Seedhe-maut actually uses broader vocabulary than KR$NA,, settling some debates or acting as a supplement for conversations
- Code switch index: a way to visualise the blend of languages an artist uses. so this can be used to see if an artist is pivoting more to an english-heavy commercial sound on their latest album to reach a global audience.
- Evolution timeline: this can be a chronological view of an artist's discography, so someone like an [A&R scout](https://aandrduty.com/what-does-an-ar-scout-do/) can track an artist's thematic sentiments over time, so this can act as a visual look at how some artists for example can shift from aggressive, street-base narrative to more commercial theme
### MVP?
Basically a way to provide an objective ranking of lyrical complexity
Scope of the MVP?
To make a vocabulary barometer (unique word count) for a fixed list of artists. run it locally and make a dashboard
- Pick a fixed dataset, for now I am picking KR$NA, Seedhemaut, DIVINE, MC Stan, Prabh Deep
- Pick top 10 most popular songs from Genius instead of boiling the entire ocean (the perk of this is validation will be easy)

How will we get the data?
- Python script using `bs4` to scrape lyrics from Genius of those 50 songs (5 artists top 10)
- Cleaning would be required to remove things like `[Chorus]` and `[Verse]` brackets and punctuation
- For the NLP engine, we will keep the scope limited and not build the complex LID (language identification) classifier to seperate hindi from english, instead planning to treat all words regardless of language as tokens. (apply lowercasing > count unique tokens)
- Output will be a single bar chart that shows "the count of unique words in top 10 tracks for each artist"