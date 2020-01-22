const fs = require("fs-extra");
const readdir = require("recursive-readdir");
const mm = require("micromatch");

const cleanPath = require("./cleanPath.js");
const isShopifyFile = require("./isShopifyFile.js");

module.exports = async function findAllFiles(paths = ".", ignore = [], root = '') {
  let flatFiles = [];

  for (const file of [].concat(paths || []).map(cleanPath)) {
    if (!fs.existsSync(file)) continue;

    try {
      let isDir = false;

      try {
        // allows for unsyncing files from remote that are not present locally
        isDir = fs.lstatSync(file).isDirectory();
      } catch (e) {}

      if (isDir) {
        try {
          const files = await readdir(file, ignore);
          flatFiles = flatFiles.concat(files);
        } catch (e) {
          // TODO
        }
      } else {
        flatFiles = flatFiles.concat(file);
      }
    } catch (e) {
      // TODO
    }
  }

  return flatFiles
    .filter(file => !mm.contains(file, ignore))
    .filter(file => isShopifyFile(file, root));
};
