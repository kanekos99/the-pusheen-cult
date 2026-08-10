const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/styles");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/scripts");
  eleventyConfig.addPassthroughCopy("./src/stories/images");
  eleventyConfig.addPassthroughCopy("./src/news/images");

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_SHORT);
  });

  eleventyConfig.addFilter("excerpt", (post) => {
    const content = post.templateContent;
    if (!content) return "";

    if (content.includes("<!-- excerpt -->")) {
      return content.split("<!-- excerpt -->")[0];
    }

    return content;
  });

  eleventyConfig.addCollection("allTags", function (collectionApi) {
    let tagSet = new Set();

    collectionApi.getAll().forEach((item) => {
      if (Array.isArray(item.data.tags)) {
        item.data.tags.forEach((tag) => {
          if (tag !== "post") {
            tagSet.add(tag);
          }
        });
      }
    });

    return [...tagSet].sort();
  });

  eleventyConfig.addShortcode("imgBlock", function (src, caption) {
    const url = eleventyConfig.getFilter("url")(src);

    const prefix =
      process.env.NODE_ENV === "neocities"
        ? "https://kanekos99.github.io/"
        : "";

    const finalUrl = `${prefix}${url}`;

    return `
      <div class="post-body-img-container">
        <img src="${finalUrl}" class="post-body-img-l" 
          onclick="showImage(this);"
          data-bs-toggle="modal"
          data-bs-target="#galleryModal"
        />
        <p class="post-img-caption">${caption}</p>
      </div>
    `;
  });

  eleventyConfig.addShortcode("imgBlockSmall", function (src, caption) {
    const url = eleventyConfig.getFilter("url")(src);

    const prefix =
      process.env.NODE_ENV === "neocities"
        ? "https://kanekos99.github.io/"
        : "";

    const finalUrl = `${prefix}${url}`;

    return `
      <div class="post-body-img-container">
        <img src="${finalUrl}" class="post-body-img" 
          onclick="showImage(this);"
          data-bs-toggle="modal"
          data-bs-target="#galleryModal"
        />
        <p class="post-img-caption">${caption}</p>
      </div>
    `;
  });

  eleventyConfig.addShortcode("postSnippetThumbnail", function (src, alt) {
    const url = eleventyConfig.getFilter("url")(src);

    const prefix =
      process.env.NODE_ENV === "neocities"
        ? "https://kanekos99.github.io/"
        : "";

    const finalUrl = `${prefix}${url}`;

    return `
      <img
        src="${finalUrl}"
        alt="${alt}"
        class="post-img"
      />
    `;
  });

  eleventyConfig.addShortcode("gallery", function (...images) {
    const urlFilter = eleventyConfig.getFilter("url");

    const thumbnailsHtml = images
      .map((src) => {
        const finalUrl = urlFilter(src);
        return `
          <div class="gallery-thumbnail-container">
            <img src="${finalUrl}" 
                 class="gallery-thumbnail img-fluid gallery-img" 
                 loading="lazy"         
                 onclick="showImage(this);" 
                 data-bs-toggle="modal"
                 data-bs-target="#galleryModal"
            />
          </div>`;
      })
      .join("");

    return `
      <div class="gallery-container">
        ${thumbnailsHtml}
      </div>`;
  });

  return {
    pathPrefix: "/the-pusheen-cult/",
    dir: {
      input: "src",
      output: "public",
    },
  };
};
