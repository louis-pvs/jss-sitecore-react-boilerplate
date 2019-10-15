// styleguide.config.js
const path = require("path");

module.exports = {
  styleguideComponents: {
    Wrapper: path.join(__dirname, "src/StyleguideWrapper")
  },
  exampleMode: "expand",
  usageMode: "expand"
};
