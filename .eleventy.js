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
  eleventyConfig.addPassthroughCopy("notation/out");

  // Add markdown filter for rendering markdown in templates
  const markdownIt = require("markdown-it");
  const md = markdownIt({ html: true });
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content || "");
  });

  // Embed rendered LilyPond SVGs by name (matching files in notation/out/svg/{name}.svg)
  eleventyConfig.addShortcode("notationSvg", (name, caption = "") => {
    if (!name) return "";
    const src = `${pathPrefix}/notation/out/svg/${name}.svg`;
    const safeCaption = caption ? `<figcaption>${md.renderInline(caption)}</figcaption>` : "";
    return `<figure class="notation-figure"><img src="${src}" alt="${caption || name}" loading="lazy">${safeCaption}</figure>`;
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
