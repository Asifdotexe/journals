const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
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
