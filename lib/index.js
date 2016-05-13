#! /usr/bin/env babel-node
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

_commander2['default'].version('0.0.1').option('-l, --verbose', 'Show more information when the command is being excecuted').option('-d, --dry_run', 'A dry_run run which will only list the effected records/files').option('-f, --force', 'Force');

_commander2['default'].command('create_model <name>')
// .alias('create-model')
// .alias('createmodel')
// .alias('add_model')
// .alias('add-model')
// .alias('addmodel')
// .alias('model')
.alias('m').description('Create a new model in the current app').action(function (name) {
  var options = { name: name, root: process.cwd(), force: _commander2['default'].force, verbose: _commander2['default'].verbose };

  // if (
  //   !options.force && (
  //   !fs.existsSync(path.resolve(process.cwd(), 'client')) ||
  //   !fs.existsSync(path.resolve(process.cwd(), 'server')) ||
  //   !fs.existsSync(path.resolve(process.cwd(), 'shared')))) {
  //   return console.log(chalk.red(`This command should be run from the root directory of FounderLab web apps`))
  // }

  console.log('Creating model ' + _chalk2['default'].green(name) + ' with options', options);
  require('./commands/createModel')(options, function (err) {
    if (err) return console.log(_chalk2['default'].red(err.message));
    console.log(_chalk2['default'].green('done'));
  });
});

_commander2['default'].command('new <name>').description('Create a new app').option('-t, --type', 'Type').action(function (name) {

  var options = { name: name, root: process.cwd(), force: _commander2['default'].force, verbose: _commander2['default'].verbose };

  console.log('Creating new app ' + _chalk2['default'].green(name) + ' with options', options);
  require('./commands/newApp')(options, function (err) {
    if (err) return console.log(_chalk2['default'].red(err.message));
    console.log(_chalk2['default'].green('done'));
  });
});

_commander2['default'].parse(process.argv);