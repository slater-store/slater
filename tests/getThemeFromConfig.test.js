const path = require('path');
const test = require('ava');

const getThemeFromConfig = require('../lib/getThemeFromConfig.js');

const cwd = process.cwd();

const config = {
  themes: {
    dev: {
      id: 123,
      password: 'abc',
      store: 'shopify',
    },
    prod: {
      password: 'abc',
      store: 'shopify',
    },
  }
}

test('defaults', t => {
  const theme = getThemeFromConfig(config)

  t.is(theme.id, 123);
});

test('will throw', t => {
  t.throws(() => getThemeFromConfig(config, 'prod'));
});
