---
layout: post
title: "Elenchus: making of the socratic debate helper"
author: Asif Sayyed
date: 2026-10-17
excerpt: This journal all the decisions I made and why I made them while developing towards updating / refactoring the Elenchus project
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

## What is Elenchus
I'm writing this journal after implementing a basic MVP {% sidenote "mvp" %} MVP = Minimum viable product, borrowed from agile methodology {% endsidenote %} of Elenchus, {% sidenote "elenchus" %} [Elenchus](https://en.wikipedia.org/wiki/Socratic_method) is the greek term for Socratic method of argumentative dialogue {% endsidenote %}

Elenchus is a HUD {% sidenote "what-hub" %} [HUD = Heads up display](https://www.robertjamesbruce.com/lectures/cs330/cs330_lecture_week_7-heads-up_display_and_user_interface_design.pdf), is basically is a floating dialogue box on your screen that stays on top, this is prodominantly used in games {% endsidenote %} based tool that floats on your screen and you can record your statements, which will be processed and broken down into premise and conclusions

Additional nicety is that it requires no token cost and runs locally in a very lightweight manner. {% sidenote "learn-rust-please" %} Please pray that I am able to pull through on my promise of [learning Rust](https://asifdotexe.github.io/journals/getting-rusty-journal/), as this would make the software even faster {% endsidenote %}

![Anatomy of a statement](..\assets\notes_assets\fallacy-classifier\anatomy_of_statement.png)

And provides you with an evalution that gives you two things
- Whether any fallacy {% sidenote "fallacy" %} A statement or an argument based on a false or invalid inference. {% endsidenote %} 
 was committed
- If the statement is fallicious then provide you with rationale on why it is fallcious.

This is the userflow in the nutshell {% sidenote "more-to-user-flow" %} I want to add an ability to record debates and analyse them post hoc {% endsidenote %}

## Why does this exists?

For the love of the game, I honestly enjoy debates but there is a difference between a heated argument and a well structured and well executed debates and it is to do with how well someone puts out their statement

In debates people can sometimes be disingenuous sometimes on purpose, sometimes by mistake.

So having a good understanding of whether a given statement is fallcious or not is a good starting step to weed out poor arguments and debates with no ends.

This is to ensure that both parties have a easier time as you will gain the ability to detect and breakdown logical fallcies leading to the following benefits.

- You are able to make sounder and robust statements / arguments
- You are able to smell unsound or half-baked statements / arguments

Currently the way elenchus works is by recording you on adhoc basis and giving you rationale / rebuttals, so you can think of it as a sparring partner for you. I had attached a screenshot of how it looks below

![Elenchus HUD](..\assets\notes_assets\fallacy-classifier\elenchus-hood.png)

You can check out the UI evolution in the following issue to check the trail: [https://github.com/Asifdotexe/Elenchus/issues/3](https://github.com/Asifdotexe/Elenchus/issues/3)

## What is under the HUD (Pun intended)?

- Uses laptop/desktop's microphone or audio loopback to generate the input
- Uses [faster-whisper](https://github.com/SYSTRAN/faster-whisper) (CPU, INT8 quantized model) -> This perform with the latency of under 350 ms)
- Uses [Ollama](https://ollama.com/) [qwen2.5-coder:3b (base.en)](https://huggingface.co/Qwen/Qwen2.5-Coder-3B) {% sidenote "qwen-coder" %} The rationale behind choosing the code model over the base instruct model is that it would give me consice responses as we want the rationale to have brevity and the task of classification is simple enough for the coder model to pick up, but that said, I will try the base instruct model to see if there are performance gains {% endsidenote %} (GPU, Q4_K_M) -> This perform with the latency of under 250 ms
- Everything is displayed on the [PyQt6](https://www.riverbankcomputing.com/static/Docs/PyQt6/) Obsidian HUD

Now if I were to talk about the resource footprint of the root as I write this journal, here are the stats:

- Speech to text that utilises faster-whisper uses around 500-MB to 1GB RAM (NO VRAM used here)
- Qwen model for reasoning uses around ~2.2GB or VRAM
- Audio capture and voice activity detection relies on [sounddevice](https://pypi.org/project/sounddevice/) and uses less than 40 MB RAM (only CPU)
- Last but not the least, UI takes less than 80 MB of RAM and uses the GPU or compositor

## How do I distribute?
I want this to be easy to set up, so as the time of writing this I had some setup scripts that worked on powershell but that isn't very user friendly, planning to make an executable because the philosophy that I want to follow here is simplicity and ease of use. 

- For developer: Github repository setup
- For technical users: Quick start commands
- For lay users: Downloadable executable file with icon to start it up and configurable panel

Scroll to the bottom to check the distribution section:
[https://asifdotexe.github.io/Elenchus/](https://asifdotexe.github.io/Elenchus/)

## Things I want to add in Elenchus
- [ ] Ability to take up to 30 minutes of debate recordings and transcribe it and give a per statement analysis
- [ ] Ability to listen to debates on platforms like discord or any other place, essentially giving it ability to listen to the opponent. {% sidenote "concerns" %} This is something that I am kinda on the fence of, as the aim of the tool is to learn and having an assist of this sort can lead to people offloading their cognitive ability? {% endsidenote %}
- [ ] Leverage MacOS's in built [voice to text model](https://developer.apple.com/documentation/speech) to make it leaner for Mac users, here are some additional documents: {% sidenote "thanks-prasad" %} Thanks a lot [Prasad Raju](https://github.com/iamprasadraju) for this suggestion. {% endsidenote %}

Relevant links:
- Elenchus GitHub repository: [https://github.com/Asifdotexe/elenchus](https://github.com/Asifdotexe/elenchus)
- Elenchus releases: [https://github.com/Asifdotexe/Elenchus/releases](https://github.com/Asifdotexe/Elenchus/releases)
- Elenchus issues: [https://github.com/Asifdotexe/Elenchus/issues](https://github.com/Asifdotexe/Elenchus/issues)
- Elenchus website: [https://asifdotexe.github.io/Elenchus/](https://asifdotexe.github.io/Elenchus/)
- Elenchus documentation: [https://asifdotexe.github.io/Elenchus/docs](https://asifdotexe.github.io/Elenchus/docs)
