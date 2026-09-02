---
layout: post
title: Guide to journaling
author: Asif Sayyed
excerpt: This journal contains all the little things about making / maintaining journals on this website
tags:
  - help
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
## Why does this exist?

Good question, I created this journal website to act as a storage for my raw thoughts, while ideating and updating the project, it can also be used for journaling some best practices, how-to's so and so forth. {% sidenote "prasad" %} Credits to my friend [Prasad Raju](https://iamprasadraju.github.io/) for giving me the idea for this journal! {% endsidenote %}

More of less the idea is to be pretty informal, not a very formal structure, thinking out loud and penning it down type of routine? I hope this doesn't get exhausting and can result in some good material for myself or someone else to go back and read.

## How to run this project?

Of course, starting by cloning the repository, having obsidian set up and I like to open the obsidian directly opened up in the `/journals` folder because I prefer writing directly into obsidian instead of updating markdown files

```bash
npm run build
```

I am using eleventy personally because I found it easier than Jekyll 

## How to add side notes? {% sidenote "sidenote" %} Hey, this is how a sidenote looks like. {% endsidenote %}

When writing in your Markdown files (inside `journals/*.md`), you can now use a clean `{% raw %}{% sidenote %}{% endraw %}` tag like this: {% sidenote "inspiration" %} I have yoinked this sidenote structure from [Ginger bill's website]( https://www.gingerbill.org/article/2025/09/08/package-managers-are-evil/) when I read about it after talking to my colleague at work! {% endsidenote %}

```markdown
Package managers (for programming languages) are evil {% raw %}{% sidenote "hyperbole" %}The term “evil” is being used partially hyperbolic to
  make a point.{% endsidenote %}{% endraw %}.
``` 

Important Details:
1. Notice the "hyperbole" part in `{% raw %}{% sidenote "hyperbole" %}{% endraw %}`. This is the unique ID for that specific sidenote. You must give each sidenote on a page a unique ID (e.g., "note1", "note2", "hyperbole") so the mobile tap-to-expand functionality knows which note to open.
2. Everything you put between `{% raw %}{% sidenote "id" %}{% endraw %}` and `{% raw %}{% endsidenote %}{% endraw %}` becomes the content of the sidenote.

## Frontmatter schema {% sidenote "author" %} I think the author field is redundant but I chose to keep it anyways. {% endsidenote %}

```markdown
---
layout: post
title: Guide to journaling
author: Asif Sayyed
excerpt: This journal contains all the little things about making / maintaining journals on this website
tags:
  - help
---
```

## Code syntax highlighting

I tend to use a specific type of syntax highlighting for my journal code snippet, this isn't a default behavior yet, ideally it should be. but I believe taste can change and hence I haven't fixed it yet. so I like to paste this snippet below at the top of every obsidian file

```css
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
```

And for now, that is it!