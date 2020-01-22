const path = require("path");
const fixPathSeparators = require("./cleanPathSeparators.js");
const cwd = fixPathSeparators(process.cwd());

/**
 * Ensure we're working with a valid absolute path
 */
module.exports = function cleanPaths(p) {
  return fixPathSeparators(
    path.join(cwd, fixPathSeparators(p).replace(cwd, ""))
  );
};
