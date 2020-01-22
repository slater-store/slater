const getFileKey = require("./getFileKey.js");

module.exports = function isShopifyFile(file, root) {
  return Boolean(getFileKey(file, root));
}
