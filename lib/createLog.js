const log = require("log-update");
const c = require("ansi-colors");
const format = require("date-fns/format");

const pkg = require("../package.json");

function addTimestamp(message) {
  const [msg, keyword] = [].concat(message);

  return [
    msg + ' ' + c.gray(format(new Date(), 'hh:mm:ss')),
    keyword,
  ];
}

function createLine(config = { color: "grey" }) {
  return function toString(message) {
    const [msg, keyword] = [].concat(message);

    return keyword
      ? c[config.color](keyword) + " " + msg
      : c[config.color](msg);
  };
}

function createGroup(lines, config) {
  return lines && lines.length
    ? lines.map(createLine(config)).join("\n  ")
    : "";
}

function createLogger({ watch, debug, meta = {} } = {}) {
  const headers = {
    slater: `v${pkg.version}`,
    ...meta
  };

  let messagesCache = [];
  let warningsCache = [];
  let errorsCache = [];
  let assetsCache = [];

  const banner = `${Object.keys(headers)
    .map(key => `${c.gray(c.bold(key))} ${headers[key]}`)
    .join("\n")}`;

  return function logger({
    messages = [],
    warnings = [],
    errors = [],
    assets = [],
  } = {}) {
    messagesCache = messagesCache
      .concat(messages.map(addTimestamp))
      .reverse()
      .slice(0, 10)
      .reverse();
    warningsCache = warningsCache
      .concat(warnings.map(addTimestamp))
      .reverse()
      .slice(0, 10)
      .reverse();
    errorsCache = errorsCache
      .concat(errors.map(addTimestamp))
      .reverse()
      .slice(0, 10)
      .reverse();
    assetsCache = assetsCache
      .concat(assets.map(addTimestamp))
      .reverse()
      .slice(0, 10)
      .reverse();

    const lines = [
      createGroup(messagesCache, { color: "cyan" }),
      createGroup(assetsCache, { color: "green" }),
      createGroup(warningsCache, { color: "yellow" }),
      createGroup(errorsCache, { color: "magenta" })
    ].filter(Boolean);

    (debug ? console.log : log)(
      `${banner}${lines.length ? "\n\n  " + lines.join("\n\n  ") : ""}
`
    );
  };
}

module.exports = createLogger;
