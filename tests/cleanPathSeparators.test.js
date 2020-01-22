const path = require('path');
const test = require('ava');

const clean = require('../lib/cleanPathSeparators.js');

test('*nix', t => {
  const p = clean(`/path/to/file.js`);

  t.is(p, `/path/to/file.js`);
});

test('windows', t => {
  path.sep = '\\';

  const p = clean(`\\path\\to\\file.js`);

  t.is(p, `/path/to/file.js`);
});
