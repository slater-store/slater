const path = require('path');
const test = require('ava');
const getFileKey = require('../lib/getFileKey.js');

test('root', t => {
  const key = getFileKey(`/src/snippets/foo.liquid`, 'src');
  t.is(key, `snippets/foo.liquid`);
});

test('root with slashes', t => {
  const key = getFileKey(`/src/snippets/foo.liquid`, '/src/');
  t.is(key, `snippets/foo.liquid`);
});

test('asset', t => {
  const key = getFileKey(`/src/assets/anyfilename.js`, 'src');
  t.is(key, `assets/anyfilename.js`);
});

test('absolute paths', t => {
  const key = getFileKey(
    path.join(__dirname, `/src/assets/anyfilename.js`),
    path.join(__dirname, 'src')
  );
  t.is(key, 'assets/anyfilename.js');
});

test('invalid filename', t => {
  const key = getFileKey(`/src/bar/foo.liquid`, 'src');
  t.is(key, null);
});

test('nested false positive', t => {
  const key = getFileKey(`/src/somedir/layouts/collection.css`, 'src');
  t.is(key, null);
});

test('no leading slash', t => {
  const key = getFileKey(`src/snippets/head-meta.liquid`, 'src');
  t.is(key, `snippets/head-meta.liquid`);
});
