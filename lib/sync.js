const fs = require("fs-extra");
const fetch = require("node-fetch");

const getFileKey = require('./getFileKey.js');
const findAllFiles = require('./findAllFiles.js');
const cleanPath = require("./cleanPath.js");
const enqueue = require("./enqueue.js");
const debug = require("./debug.js");

function encodeFile(file) {
  return Buffer.from(fs.readFileSync(file), "utf-8").toString("base64");
}

function createStoreConnection(theme) {
  return function storeAPI(method, asset) {
    return fetch(
      `https://${theme.store}/admin/themes/${theme.id}/assets.json`,
      {
        method,
        headers: {
          "X-Shopify-Access-Token": theme.password,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ asset })
      }
    );
  };
}

async function handleResponse(raw, fileAsset) {
  try {
    const res = raw.clone();
    const data = await res.json();
    const { errors, asset } = data;

    debug('handleResponse success');
    debug(data || fileAsset);

    let error;

    if (errors) {
      if (errors === "Not Found") {
        error = `Store URL was invalid. Please double check your theme.`;
      } else if (errors.asset) {
        error = `error syncing ${fileAsset.key} - ${errors.asset}`;
      } else {
        error = errors; // for file error
      }
    }

    return {
      error,
      asset: asset || fileAsset,
    };
  } catch (e) {
    const res = raw.clone();

    debug('handleResponse error');
    debug(e);

    let error;

    if (res.status === 404) {
      error = `Theme ID was invalid. Please double check your theme.`;
    } else if (res.status === 401) {
      error = `Theme password was invalid. Please double check your theme.`;
    }

    return {
      error,
      asset: fileAsset,
    };
  }
}

// requires valid config and theme objects
module.exports = function create(config, theme) {
  const store = createStoreConnection(theme);

  async function upload(fileAsset) {
    const raw = await store("PUT", fileAsset);
    return handleResponse(raw, fileAsset);
  }

  async function remove(fileAsset) {
    const raw = await store("DELETE", fileAsset);
    return handleResponse(raw, fileAsset);
  }

  async function getFiles(paths) {
    const files = await findAllFiles(paths, theme.ignore, config.in);

    if (!files.length) {
      throw `No files were found.`;
    }

    return files;
  }

  async function sync(paths, cb) {
    return Promise.all(
      (await getFiles(paths))
        .map(file => {
          try {
            return {
              asset: {
                key: getFileKey(file, config.in),
                attachment: encodeFile(file),
              },
            };
          } catch (e) {
            return {
              error: e.message,
            };
          }
        })
        .filter(data => Boolean(data.asset.key))
        .map(data => {
          debug('sync');
          debug(data);

          if (data.error) {
            cb(data);
            return;
          }

          return enqueue(async () => {
            const res = await upload(data.asset);
            cb(res);
            return res;
          })
        })
    );
  }

  async function unsync(paths, cb) {
    return Promise.all(
      ([].concat(paths))
        .map(cleanPath)
        .map(file => {
          try {
            return {
              asset: {
                key: getFileKey(file, config.in),
              },
            };
          } catch (e) {
            return {
              error: e.message,
            };
          }
        })
        .filter(data => Boolean(data.asset.key))
        .map(data => {
          debug('unsync');
          debug(data);

          if (data.error) {
            cb(data);
            return;
          }

          return enqueue(async () => {
            const res = await remove(data.asset);
            cb(res);
            return res;
          })
        })
    );
  }

  return {
    sync,
    unsync,
  };
};
