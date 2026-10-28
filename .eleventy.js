const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const texmath = require("markdown-it-texmath");
const katex = require("katex");
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  const isGithubActions = !!process.env.GITHUB_ACTIONS;
  const pathPrefix = isGithubActions ? "/journals/" : "/";

  // Helper to resolve an asset path against assets/
  function resolveAssetSrc(rawSrc, fileSlug) {
    if (!rawSrc) return rawSrc;
    // Normalize Windows backslashes
    let src = rawSrc.replace(/\\/g, "/");

    // Don't modify external URLs or data URIs
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//") || src.startsWith("data:")) {
      return src;
    }

    // If it points to assets (e.g. "../assets/...", "/assets/...", "assets/...", "..\assets\...")
    if (src.includes("assets/")) {
      const assetSubpath = src.slice(src.indexOf("assets/"));
      return `${pathPrefix}${assetSubpath}`.replace(/\/+/g, "/");
    }

    // If a simple filename was given (e.g. "under-tech.png" or "./under-tech.png")
    const cleanName = src.replace(/^\.\//, "");
    if (fileSlug) {
      const perPostCandidate = path.join(__dirname, "assets", "notes_assets", fileSlug, cleanName);
      if (fs.existsSync(perPostCandidate)) {
        return `${pathPrefix}assets/notes_assets/${fileSlug}/${cleanName}`.replace(/\/+/g, "/");
      }
    }

    const directCandidate = path.join(__dirname, "assets", cleanName);
    if (fs.existsSync(directCandidate)) {
      return `${pathPrefix}assets/${cleanName}`.replace(/\/+/g, "/");
    }

    // Check notes_assets subdirectories generally as a fallback
    const notesAssetsDir = path.join(__dirname, "assets", "notes_assets");
    if (fs.existsSync(notesAssetsDir)) {
      try {
        const subdirs = fs.readdirSync(notesAssetsDir);
        for (const subdir of subdirs) {
          if (fs.existsSync(path.join(notesAssetsDir, subdir, cleanName))) {
            return `${pathPrefix}assets/notes_assets/${subdir}/${cleanName}`.replace(/\/+/g, "/");
          }
        }
      } catch (e) {
        // ignore
      }
    }

    return src;
  }

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

  // Custom image renderer rule: normalizes relative/asset paths for both local and GitHub Pages
  const defaultImageRender = markdownLib.renderer.rules.image || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLib.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex("src");
    if (srcIndex >= 0) {
      const rawSrc = token.attrs[srcIndex][1] || "";
      const fileSlug = env?.page?.fileSlug;
      token.attrs[srcIndex][1] = resolveAssetSrc(rawSrc, fileSlug);
    }
    return defaultImageRender(tokens, idx, options, env, self);
  };

  // Custom link renderer rule: open non-anchor links in a new tab
  const defaultLinkRender = markdownLib.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLib.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex("href");
    if (hrefIndex >= 0) {
      const href = token.attrs[hrefIndex][1] || "";
      if (!href.startsWith("#")) {
        token.attrSet("target", "_blank");
        token.attrSet("rel", "noopener noreferrer");
      }
    }
    return defaultLinkRender(tokens, idx, options, env, self);
  };

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

  return {
    pathPrefix: pathPrefix,
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
