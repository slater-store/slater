const path = require('path');
const test = require('ava');

const mergeConfig = require('../lib/mergeConfig.js');

const cwd = process.cwd();

test('works', t => {
  const config = mergeConfig({
    themes: {
      dev: {
        id: '1',
        password: '1',
        store: '1',
      }
    }
  });

  t.is(config.in, path.join(cwd, `src`));
  t.is(config.assets.in, path.join(cwd, `src/assets/compiled/index.js`));
  t.is(config.assets.out, path.join(cwd, `src/assets/`));
  t.truthy(config.themes.dev.ignore);
});

test('validates theme fields', t => {
  t.throws(() => {
    mergeConfig({
      themes: {
        dev: {
          password: '1',
          store: '1',
        }
      }
    });
  }, {
    message: 'dev theme error - the id field is required',
  });
});
