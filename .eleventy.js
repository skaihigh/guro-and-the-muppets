module.exports = function(eleventyConfig) {
  // Base URL - empty for custom domain, subdirectory for github.io
  const pathPrefix = '';

  // Add global data for path prefix
  eleventyConfig.addGlobalData("baseUrl", pathPrefix);

  // Copy static assets
  eleventyConfig.addPassthroughCopy("site/css");
  eleventyConfig.addPassthroughCopy("site/js");
  eleventyConfig.addPassthroughCopy("site/midi");
  eleventyConfig.addPassthroughCopy("site/downloads");
  eleventyConfig.addPassthroughCopy("site/CNAME");

  // Add markdown filter for rendering markdown in templates
  const markdownIt = require("markdown-it");
  const md = markdownIt({ html: true });
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content || "");
  });

  // Add slug filter
  eleventyConfig.addFilter("slug", (str) => {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  });

  // Collection for songs
  eleventyConfig.addCollection("songs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("site/songs/*/index.md");
  });

  // Collection for knowledge articles
  eleventyConfig.addCollection("knowledge", function(collectionApi) {
    return collectionApi.getFilteredByGlob("site/knowledge/*.md");
  });

  // Collection for agents
  eleventyConfig.addCollection("agents", function(collectionApi) {
    return collectionApi.getFilteredByGlob("site/agents/*.md");
  });

  // Collection for skills
  eleventyConfig.addCollection("skills", function(collectionApi) {
    return collectionApi.getFilteredByGlob("site/skills/*.md");
  });

  return {
    dir: {
      input: "site",
      output: "docs",
      includes: "_includes",
      data: "_data"
    },
    pathPrefix: pathPrefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
