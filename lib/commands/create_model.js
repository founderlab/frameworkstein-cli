'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = createModel;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// eslint-disable-line

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _queueAsync = require('queue-async');

var _queueAsync2 = _interopRequireDefault(_queueAsync);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

var _templatesServerModel = require('../templates/server/model');

var _templatesServerModel2 = _interopRequireDefault(_templatesServerModel);

var _templatesServerController = require('../templates/server/controller');

var _templatesServerController2 = _interopRequireDefault(_templatesServerController);

var _templatesSharedModel = require('../templates/shared/model');

var _templatesSharedModel2 = _interopRequireDefault(_templatesSharedModel);

var _templatesSharedSchema = require('../templates/shared/schema');

var _templatesSharedSchema2 = _interopRequireDefault(_templatesSharedSchema);

function createModel(_options, callback) {
  var options = _extends({
    plural: _inflection2['default'].pluralize(_options.name),
    class_name: _inflection2['default'].classify(_options.name)
  }, _options);
  options.class_plural = _inflection2['default'].pluralize(options.class_name);

  var output = {
    server_model: {
      path: _path2['default'].join(options.root, 'server/models/' + options.class_name + '.js'),
      content: (0, _templatesServerModel2['default'])(options)
    },
    server_controller: {
      path: _path2['default'].join(options.root, 'server/api/controllers/' + options.class_plural + '.js'),
      content: (0, _templatesServerController2['default'])(options)
    },
    shared_model: {
      path: _path2['default'].join(options.root, 'shared/models/' + options.class_name + '.js'),
      content: (0, _templatesSharedModel2['default'])(options)
    },
    shared_schema: {
      path: _path2['default'].join(options.root, 'shared/models/schemas/' + options.name + '.js'),
      content: (0, _templatesSharedSchema2['default'])(options)
    }
  };

  var queue = new _queueAsync2['default']();

  _lodash2['default'].forEach(output, function (out) {
    if (!options.force && _fs2['default'].existsSync(out.path)) {
      return callback(new Error('File already exists at ' + out.path + '. Use --force to overwrite'));
    }
    queue.defer(function (callback) {
      (0, _mkdirp2['default'])(_path2['default'].dirname(out.path), function (err) {
        if (err) return callback(err);
        if (options.verbose) {
          console.log('writing:', out.path, out.content);
          console.log('---------------------');
        }
        _fs2['default'].writeFile(out.path, out.content, callback);
      });
    });
  });

  queue.await(callback);
}

module.exports = exports['default'];