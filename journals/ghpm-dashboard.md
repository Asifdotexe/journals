---
layout: post
title: "ghpm: GitHub project management"
author: Asif Sayyed
excerpt: This journal all the decisions I made and why I made them while developing towards updating / refactoring the GHPM project
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

## What is GHPM?
GHPM stands for GitHub Project Management {% sidenote "note" %} note that the name doesn't contain verbiage like "tool" or "dashboard", partly the reason for that is because I plan to expand this but I am uncertain about how. {% endsidenote %} and the simple goal is to provide me a birds-eye view over my GitHub projects and the amount of open issues

## Why do I need this?
I am someone that loves to work on project and hence I tend to dig myself a really large pit that I sometimes struggle to get out of.
Some problems that I commonly encounter are:
- Scope creeping, basically I promise myself that I will do XYZ in the given pull request but then I find 10 different things that I feel are wrong and hence I tend to boil the ocean and that's where I end up spending a lot of my time working but not getting any closer to the end.
- Over ambitious mind, I know that there could be a lot of things to be done in a project and then when we bring more projects in the conversation, that just increases the amount of tasks that can be done and that is where it can feel discouraging because too many open issues and not a lot of direction of what is to be done first, and it makes it very hard to imagine what does done even look like? {% sidenote "done" %} I have thought a lot about what does done look like, I have some solution for it as of right now, but I believe it is still nascent. (Refer section x.x.x) {% endsidenote %}

## How will it help?
In very rough language, to know how to get out of shit, you need to know how much shit you are in. 

This dashboard right now, helps with specifically that, basically a way to show me how many issues that I have open across my github profile. Basically a consolidated view as I have a lot of shit on my github that I don't want to update or do want to update but not actively right now. I aim to retire this dashboard eventually and have a more asynchronous way of tracking (via Kanhan boards) but this is still a crucial scaffolding for thing as it stands. this is there so that I can have a weekly / monthly review  {% sidenote "review-cycle" %}I believe the review cycle should be weekly, as of right now. I have set it to monthly as it is year end for me and hence focusing on professional priorities is more important of me.{% endsidenote %} of this pipeline to see if I am getting any free-er or am I always creating more work without getting any closer to completion.

## Answering what does done look like?
This was a tough nut to crack, but I think I have a interim solution {% sidenote "interim" %} Here, I am saying interim loosely as I am not actively seeking better method, but I will adopt it if something comes up {% endsidenote %}

The workflow should look something like this

NOTE: Things that are written in *italics* are things already implemented across project but the normally formatted bullets below are new additions
1. Come up with a version plan, the scope of the wider development you are planning to do. break those plans into small actionable issues
2. *Create an issue*
3. Be very specific about the aim of the issue, anything that isn't directly a part of it should be it's own issuer
4. *Create a pull request*
5. Repeat until all the action items from the bullet 1 have depleted 
6. Make any supporting/polishing changes {% sidenote "supporting" %}by supporting I mean changes that don't intend to change any code functionality, but rather security, seo, documentation {% endsidenote %}
7. Tag the branch with a version {% sidenote "preferance" %} I follow semantic versioning {% endsidenote %}
8. Publish a release with handwritten developer note {% sidenote "handwritten" %} Handwritten for 2 reasons: 1. being intentional, 2. shy away from overcomplicating the release since we are writing stuff manually {% endsidenote %} explaining all the major changes

## Potential ways gaps to fill even after making this tool?
- This tool doesn't help with prioritization, ideally the major problem for me specifically.
- This doesn't help me in scoping of projects
- This doesn't help me in managing the timeline