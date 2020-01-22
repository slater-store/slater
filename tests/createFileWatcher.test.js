const test = require('ava');
const fs = require('fs-extra');
const path = require('path');
const onExit = require('exit-hook');

const createFileWatcher = require('../lib/createFileWatcher.js');

const cwd = process.cwd();

onExit(() => {
  fs.removeSync('./tests/watcher');
});

test.cb('works', t =>  {
  fs.ensureDirSync('./tests/watcher');

  createFileWatcher(path.join(cwd, './tests/watcher'))
    .then(async watcher => {
      watcher.on('delete', file => {
        t.end();
        watcher.stop();
      });

      watcher.on('update', file => {
        t.pass();
        fs.removeSync(file);
      });

      await fs.ensureFile('./tests/watcher/assets/foo.js');
    });
});

test.cb('ignore', t =>  {
  fs.ensureDirSync('./tests/watcher');

  t.plan(1);

  createFileWatcher(path.join(cwd, './tests/watcher'), [ 'foo.js' ])
    .then(async watcher => {
      // will only fire once
      watcher.on('update', file => {
        t.truthy(/bar/.test(file));
        t.end();
        watcher.stop();
      });

      await fs.ensureFile('./tests/watcher/assets/foo.js');
      await fs.ensureFile('./tests/watcher/assets/bar.js');
    });
});
