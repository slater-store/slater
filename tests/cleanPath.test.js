const path = require('path');
const test = require('ava');

const clean = require('../lib/cleanPath.js');

const cwd = process.cwd();

test('*nix', t => {
  const p = clean(`/path/to/file.js`)

  t.is(p, path.join(cwd, `/path/to/file.js`));
});

test('windows', t => {
  path.sep = '\\';

  const p = clean(`\\path\\to\\file.js`)

  t.is(p, path.join(cwd, `/path/to/file.js`));
});
