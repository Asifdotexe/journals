const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const texmath = require("markdown-it-texmath");
const katex = require("katex");

module.exports = function(eleventyConfig) {
  const markdownLib = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  }).use(texmath, {
    engine: katex,
    delimiters: "dollars",
    katexOptions: {
      throwOnError: false
    }
  });
  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addPlugin(syntaxHighlight);

  // Add shortcode for sidenote
  const pageSidenotes = new Map();

  eleventyConfig.on("eleventy.before", () => {
    pageSidenotes.clear();
  });

  eleventyConfig.addPairedShortcode("sidenote", function(content, id) {
    const pageKey = this.page?.inputPath || this.page?.url || "default";
    if (!pageSidenotes.has(pageKey)) {
      pageSidenotes.set(pageKey, { counter: 0, notes: new Map() });
    }
    const state = pageSidenotes.get(pageKey);
    const cleanContent = content.trim();

    // Check if this sidenote ID has already been registered on this page
    if (state.notes.has(id)) {
      const existing = state.notes.get(id);
      if (existing.content === cleanContent) {
        // Identical tag: reuse same number and refer back without duplicate margin note
        const safeTitle = existing.content
          .replace(/"/g, '&quot;')
          .replace(/<[^>]*>/g, '')
          .trim();

        return `<a href="#sidenote-${id}" class="sidenote-number sidenote-ref" data-number="${existing.number}" title="${safeTitle}"></a>`;
      }
      // Same ID but different content: keep distinct and prevent DOM ID collision
      id = `${id}-${state.counter + 1}`;
    }

    state.counter += 1;
    const num = state.counter;
    state.notes.set(id, { number: num, content: cleanContent });

    return `<label for="${id}" class="margin-toggle sidenote-number" data-number="${num}"></label>
<input type="checkbox" id="${id}" class="margin-toggle">
<span class="sidenote" id="sidenote-${id}" data-number="${num}">${content}</span>`;
  });
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");

  // Add layout aliases
  eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.html');

  // Create a collection for journals
  eleventyConfig.addCollection("journals", function(collectionApi) {
    return collectionApi.getFilteredByGlob("journals/*.md").sort(function(a, b) {
      return b.date - a.date; // Sort by date descending
    });
  });

  const isGithubActions = process.env.GITHUB_ACTIONS || false;

  return {
    pathPrefix: isGithubActions ? "/journals/" : "/",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    // Use liquid for html processing
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid"
  };
};
