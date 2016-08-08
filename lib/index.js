#! /usr/bin/env babel-node
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

_commander2['default'].version('0.0.1').option('-l, --verbose', 'Show more information when the command is being excecuted').option('-d, --dry_run', 'A dry_run run which will only list the effected records/files').option('-f, --force', 'Force');

_commander2['default'].command('add-model <name>').alias('m').description('Create a new model in the current app').action(function (name) {
  var options = { name: name, root: process.cwd(), force: _commander2['default'].force, verbose: _commander2['default'].verbose };

  if (!options.force && (!_fs2['default'].existsSync(_path2['default'].resolve(process.cwd(), 'client')) || !_fs2['default'].existsSync(_path2['default'].resolve(process.cwd(), 'server')) || !_fs2['default'].existsSync(_path2['default'].resolve(process.cwd(), 'shared')))) {
    return console.log(_chalk2['default'].red('This command should be run from the root directory of FounderLab web apps'));
  }

  console.log('Creating model ' + _chalk2['default'].blue(name) + ' with options', options);
  require('./commands/createModel')(options, function (err) {
    if (err) return console.log(_chalk2['default'].red(err.message));
    console.log(_chalk2['default'].green('done'));
  });
});

_commander2['default'].command('new-web <name>').alias('new').description('Create a new web app').option('-t, --type', 'Type').action(function (name) {
  var options = { name: name, type: 'web', root: process.cwd(), force: _commander2['default'].force, verbose: _commander2['default'].verbose };

  console.log('Creating new web app ' + _chalk2['default'].green(name) + ' with options', options);

  require('./commands/new')(options, function (err) {
    if (err) return console.log(_chalk2['default'].red(err.message));
    console.log(_chalk2['default'].green('done'));
  });
});

_commander2['default'].command('new-mobile <name>').description('Create a new mobile app').option('-t, --type', 'Type').action(function (name) {
  var options = { name: name, type: 'mobile', root: process.cwd(), force: _commander2['default'].force, verbose: _commander2['default'].verbose };

  console.log('Creating new mobile app ' + _chalk2['default'].green(name) + ' with options', options);

  require('./commands/new')(options, function (err) {
    if (err) return console.log(_chalk2['default'].red(err.message));
    console.log(_chalk2['default'].green('done'));
  });
});

_commander2['default'].parse(process.argv);