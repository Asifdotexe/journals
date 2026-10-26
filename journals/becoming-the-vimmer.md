---
layout: post
title: "Learning VIM: moving from Zed to Vim"
author: Asif Sayyed
date: 2026-08-01
excerpt: This blog contains the raw journal of all the trial and errors I made while learning rust and all the nuances I wanted to keep track of
tags:
  - learning
---

### Learning the art of using VIM

Not sure why am I calling this an art but here we go anyways.

One thing that I learnt is that I can use the following command to create a new file using VIM i.e.

#### How to open a file in vim?

```
vim file_name.md
```
#### How to edit a file in vim?

This essentially creates a file and opens it. once I had opened it. it wasn't in editable mode. which meant I needed to do something

Now that "something" is just typing the letter "i" in the editor and it will put you in the insert mode, which means you can go crazy and type shit like I did right here.

#### Now how do I save the changes?

1. We press escape button to leave the insert mode.
2. Then we type `:wq` to save the changes and close the editor. (w stands for write, q stands for quit) now why do we need the colon? one may ask? I had the same question.

 it is essentially a signal to your VIM editor that we are trying to involve a command, so it is essentially just a command prefix.

#### How to find stuff in vim.

Depending upon where you are in the file, you have different commands to work with.

Firstly to be on the same page, leave the insert mode
1. type /{wordtosearch} this will bring you to the previous instance of the word relative to the cursor in the file
2. type ?{wordtosearch} this will bring you to the next instance of the word relative to the cursor in the file.

Now since you search, it will highlight itself, now the way to turn it off is

```
# No highlight search (disable the highlight until next search)
:nohlsearch
```

#### Keybinds to move around

- Want to move up a line? K
- Want to move down a line? J (trick to remember is yk how J looks like a downward hook, hence it is for moving down)
- Want to move left? H
- Want to move right? L
