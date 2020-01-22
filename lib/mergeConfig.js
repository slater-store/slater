const path = require('path');

const cleanPath = require('./cleanPath.js');

const cwd = process.cwd();
const requiredFields = ["id", "password", "store"];

module.exports = function mergeConfig(config) {
  let {
    in: src,
    themes = {},
    assets = {},
  } = config;

  src = cleanPath(src || 'src')

  if (!Object.keys(themes).length) {
    throw new Error(`Please configure at least one theme.`);
  }

  for (const theme of Object.keys(themes)) {
    for (const field of requiredFields) {
      if (!themes[theme][field]) {
        throw new Error(`${theme} theme error - the ${field} field is required`);
      }
    }

    themes[theme] = {
      ...themes[theme],
      ignore: [].concat(themes[theme].ignore || []),
    };
  }

  let {
    in: entry,
    out,
  } = assets;

  if (!entry) {
    entry = path.join(src, '/assets/compiled/index.js');
  }

  if (!out) {
    out = path.join(src, '/assets/');
  }

  return {
    in: cleanPath(src),
    themes,
    assets: {
      ...assets,
      in: entry,
      out,
    },
  };
}
