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

Nonetheless, I will try to explain how to read these benchmarks and how to have the intuition for spotting manipulated or gamed benchmark results.

## What is the anatomy of a benchmark?

I will leave you with the following formula, just take a look and form some thoughts about it

```python
dataset + model version + prompt + tools/scaffold + sampling + retry budget + judge + exclusions + reporting choice = headline score
```

Before I nerd out and try to explain what each of these things mean in terms of definition, I would to show you how far you can push the score without actually increasing the underlying "intelligence" try this playground to see for yourself: [Benchmark inflation simulator](https://asifdotexe.github.io/benchmark-inflation-simulator/)
