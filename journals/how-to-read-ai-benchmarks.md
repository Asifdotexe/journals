---
layout: post
title: How to read AI benchmarks
author: Asif Sayyed
excerpt: This journal is a guide to how one can read, understand and prevent being mislead by these model benchmarks.
tags:
  - learning
---
## What is this journal about?
If you are reading this blog, then you probably already are aware of what AI benchmarks are, regardless of whether you understand them or not. is that a fair assumption? {% sidenote "benchmark" %} If you are one of the few people that stumbled upon this journal while not knowing what they are, here is a good small definition: [What are AI Benchmarks?](https://hai.stanford.edu/ai-definitions/what-is-ai-benchmarks) {% endsidenote %}

In a nutshell, you can think of AI's marksheet but that would still be a very loose analogy

Nonetheless, I will try to explain how to read these benchmarks and how to have the intuition for spotting manipulated, cherrypicked or gamed benchmark results. {% sidenote "clarification" %} When launch website says the model scored 82.7% on a coding benchmark, the number does look objective and it not necessarily false but it is never self explanatory {% endsidenote %}

## What is the anatomy of a benchmark?

I will leave you with the following formula, just take a look and form some thoughts about it

```python
dataset + model version + prompt + tools/scaffold + sampling + retry budget + judge + exclusions + reporting choice = headline score
```

Before I nerd out and try to explain what each of these things mean in terms of definition, I would to show you how far you can push the score without actually increasing the underlying "intelligence" try this playground to see for yourself: [Benchmark inflation simulator](https://asifdotexe.github.io/benchmark-inflation-simulator/) {%sidenote "rough" %} Disclaimer: This is a simplified mathematical model for basic understanding. LLM retries are not perfectly independent events, and true `pass@k` scaling may vary based on model temperature, reasoning paths, and dataset characteristics. {% endsidenote%}

So hopefully this gives you enough understanding how of these testing harness can loosen up, or optimize it in order to force push the number up.

## What are the different benchmarks?
I complete understand that these benchmarks just throw a bunch of acronyms like MMLU, GPQA, SWE-bench and expects you to know what they are

I'll try to break them down and explain to you what each of them are, but before we even get into that detail. I would want to caution you not fall for the trap of believing the name of the test instead of looking at the actual format of the test.

so here is my best explanation for what a tests vs what it actually measures

### 1. MMLU
this stands for massive multitask language understanding
#### What does it claim to measure?
General "intelligence" {% sidenote "intelligence-justification" %} using the term "intelligence" loosely here and you'd understand why in the subsequent section. {% endsidenote %} and knowledge across 57 tasks across various academic subjects like elementary mathematics, US history, computer science, law, and more. {% sidenote "mmlu-paper" %} If you are someone that is interested in diving deeper in this, I recommend reading [MMLU Arxiv Paper | Pg. no. 15 (Table 2: Summary of all 57 tasks)](https://arxiv.org/pdf/2009.03300) {% endsidenote %}

#### What does it actually measure?
Rote memorization {% sidenote "translation" %} In order words it would mean *cramming* or *ratta maarna* in Hindi, learning repeatedly for quick recall. {% endsidenote %} and multiple-choice test-taking

#### So, what is the catch here for MMLU?
Since it is basically thousands of MCQs scraped from the internet, the model often just memorizes the answers during training.  {% sidenote "rote" %} My fellow JEE / NEET aspirants would understand this. {% endsidenote%} and also picking one of the four options is nothing like doing the "actual" task where information is often incomplete. {% sidenote "mmlu-pro" %} There is also MMLU-Pro which is the harder version because it gives 10 choices instead of 4 which makes guessing harder, but still at the end of the day it's still just an MCQ test {% endsidenote %}

### 2. GPQA
This stands for Google Proof Q&A
#### What does it claims to measure?
Expert PhD-level scientific reasoning
#### What is actually measures?
The ability to answer very difficult, highly specific multiple-choice science questions.
#### So, what is the catch here for GPQA?
Honestly, this is a better test of reasoning than MMLU, but the caution here is passing MCQs for chemistry test does *not* mean AI can actually conduct reliable research, look up valid citations or even recognise where the user's inital premise is flawed.

### SWE-bench
This stands for software engineering benchmark

#### What does it claim to measure?
Real-world coding and software engineering capability
#### What does it actually measure?
How well a specific agent harness {% sidenote "harness"%} Agent harness = the model + the tools you give it + how many retries it gets {% endsidenote %} understands and resolve historical GitHub issues.
#### So, what is the catch here for SWE-bench
Now test is much better than a MCQ, but once again is flawed in another sense 