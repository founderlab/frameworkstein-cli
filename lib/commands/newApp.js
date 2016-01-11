'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = newApp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// eslint-disable-line

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

// eslint-disable-line

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _queueAsync = require('queue-async');

var _queueAsync2 = _interopRequireDefault(_queueAsync);

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

var _nodegit = require('nodegit');

var _nodegit2 = _interopRequireDefault(_nodegit);

var DEFAULT_NAME = 'FounderLab_replaceme';
var BASE_REPO_URL = 'git@bitbucket.org:founderlab/fl-base-webapp.git';

function replaceInFile(file_path, replacement_str, callback) {
  _fs2['default'].readFile(file_path, function (err, contents) {
    if (err) return callback(err);
    var updated_contents = contents.replace(DEFAULT_NAME, replacement_str);
    _fs2['default'].writeFile(file_path, updated_contents, callback);
  });
}

function newApp(_options, callback) {
  var options = _extends({
    plural: _inflection2['default'].pluralize(_options.name),
    safe_name: _options.name.replace('.', '_') }, _options);
  var app_path = _path2['default'].join(options.root, options.name);
  var queue = new _queueAsync2['default'](1);

  queue.defer(function (callback) {
    var clone = _nodegit2['default'].Clone.clone;
    var git_opts = {
      fetchOpts: {
        callbacks: {
          certificateCheck: function certificateCheck() {
            return 1;
          },
          credentials: function credentials(url, username) {
            return _nodegit2['default'].Cred.sshKeyFromAgent(username);
          }
        }
      }
    };
    clone(BASE_REPO_URL, app_path, git_opts).then(callback)['catch'](function (err) {
      return callback(err);
    });
  });

  queue.defer(function (callback) {
    return replaceInFile(_path2['default'].join(app_path, 'package.json'), options.name, callback);
  });
  queue.defer(function (callback) {
    return replaceInFile(_path2['default'].join(app_path, '.env'), options.safe_name, callback);
  });

  queue.await(callback);
}

module.exports = exports['default'];
// for database urls that may not like the periods (mongo)