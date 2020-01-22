const test = require('ava');
const fs = require('fs-extra');
const path = require('path');

const findAllFiles = require('../lib/findAllFiles.js');

const cwd = process.cwd();

test.after(t => {
  fs.removeSync('./tests/find');
});

test('works', async t =>  {
  fs.ensureFileSync('./tests/find/snippets/header.liquid');
  fs.ensureFileSync('./tests/find/snippets/foo.liquid');
  fs.ensureFileSync('./tests/find/layouts/another.liquid');

  const files = await findAllFiles('./tests/find', [], path.join(cwd, '/tests/find/'));

  t.is(files.length, 3);
});

test('ignores', async t =>  {
  fs.ensureFileSync('./tests/find/snippets/header.liquid');
  fs.ensureFileSync('./tests/find/snippets/foo.liquid');
  fs.ensureFileSync('./tests/find/layouts/another.liquid');

  const files = await findAllFiles('./tests/find', [ 'header.liquid' ], path.join(cwd, '/tests/find/'));

  t.is(files.length, 2);
});

test(`won't break`, async t =>  {
  const files = await findAllFiles('./tests/noexist', [], '');

  t.is(files.length, 0);
});
