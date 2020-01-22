#! /usr/bin/env node
"use strict";

const fs = require("fs-extra");
const path = require("path");

const createStoreConnection = require("./lib/sync.js");
const getThemeFromConfig = require("./lib/getThemeFromConfig.js");
const createFileWatcher = require("./lib/createFileWatcher.js");
const createLog = require("./lib/createLog.js");
const mergeConfig = require("./lib/mergeConfig.js");
const debug = require("./lib/debug.js");
const pkg = require("./package.json");

const cwd = process.cwd();

const prog = require("commander")
  .version(pkg.version)
  .option(
    "-c, --config <path>",
    "specify the path to your config file",
    "slater.config.js"
  )
  .option("-d, --debug", "output some debugging logs", false)
  .option(
    "-t, --theme <name>",
    "specify a named theme from your config file",
    "dev"
  );

function createCallback(label, log) {
  return function syncCallback({ error, asset }) {
    debug(label);
    debug({ error, asset });

    if (error) {
      log({
        errors: [[error]]
      });
    } else {
      log({
        assets: [[asset.key, label]]
      });
    }
  };
}

function getConfig() {
  const config = mergeConfig(require(path.join(cwd, prog.config)));
  const theme = getThemeFromConfig(config, prog.theme);

  debug('config');
  debug(config);
  debug('theme');
  debug(theme);

  return {
    config,
    theme,
  };
}

prog.command("watch").action(async () => {
  const log = createLog({
    watch: true,
    debug: prog.debug,
    meta: {
      theme: prog.theme,
      watch: ""
    }
  });

  log();

  try {
    const { config, theme } = getConfig();

    log({
      messages: [[`\u200Bhttps://${theme.store}/?fts=0&preview_theme_id=${theme.id}\u200B`, 'url']]
    });

    const store = createStoreConnection(config, theme);
    const watcher = await createFileWatcher(config.in, theme.ignore);

    watcher.on("update", async file =>
      store.sync(file, createCallback("sync", log))
    );
    watcher.on("delete", async file =>
      store.unsync(file, createCallback("unsync", log))
    );
  } catch (e) {
    log({
      errors: [e.message || e]
    });
  }
});

prog.command("sync [paths...]").action(p => {
  const log = createLog({
    debug: prog.debug,
    meta: {
      theme: prog.theme,
      sync: ""
    }
  });

  log();

  try {
    const { config, theme } = getConfig();

    log({
      messages: [[`\u200Bhttps://${theme.store}/?fts=0&preview_theme_id=${theme.id}\u200B`, 'url']]
    });

    const store = createStoreConnection(config, theme);

    store.sync(p && p.length ? p : config.in, createCallback("sync", log));
  } catch (e) {
    log({
      errors: [e.message || e]
    });
  }
});

prog.command("unsync [paths...]").action(p => {
  const log = createLog({
    debug: prog.debug,
    meta: {
      theme: prog.theme,
      unsync: ""
    }
  });

  log();

  try {
    const { config, theme } = getConfig();

    log({
      messages: [[`\u200Bhttps://${theme.store}/?fts=0&preview_theme_id=${theme.id}\u200B`, 'url']]
    });

    const store = createStoreConnection(config, theme);

    if (!p || !p.length) {
      log({
        warnings: [["please specify at least one filepath", "unsync"]]
      });

      return;
    }

    store.unsync(p && p.length ? p : config.in, createCallback("unsync", log));
  } catch (e) {
    log({
      errors: [e.message || e]
    });
  }
});

if (!process.argv.slice(2).length) {
  prog.outputHelp(txt => {
    console.log(txt);
    return txt;
  });
} else {
  console.clear()
  prog.parse(process.argv);

  if (prog.debug) {
    process.env.DEBUG = true;
  } else {
  }
}
