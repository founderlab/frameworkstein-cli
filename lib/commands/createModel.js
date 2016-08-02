'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = createModel;

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

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

var _templatesServerModel = require('../templates/server/model');

var _templatesServerModel2 = _interopRequireDefault(_templatesServerModel);

var _templatesServerController = require('../templates/server/controller');

var _templatesServerController2 = _interopRequireDefault(_templatesServerController);

var _templatesServerTemplate = require('../templates/server/template');

var _templatesServerTemplate2 = _interopRequireDefault(_templatesServerTemplate);

var _templatesSharedModel = require('../templates/shared/model');

var _templatesSharedModel2 = _interopRequireDefault(_templatesSharedModel);

var _templatesSharedSchema = require('../templates/shared/schema');

var _templatesSharedSchema2 = _interopRequireDefault(_templatesSharedSchema);

function createModel(_options, callback) {
  var options = _extends({
    className: _inflection2['default'].classify(_options.name),
    tableName: _inflection2['default'].tableize(_options.name),
    variableName: _inflection2['default'].camelize(_options.name, true)
  }, _options);
  options.variablePlural = _inflection2['default'].pluralize(options.variableName);
  options.classPlural = _inflection2['default'].pluralize(options.className);

  var output = {
    serverModel: {
      path: _path2['default'].join(options.root, 'server/models/' + options.className + '.js'),
      content: _templatesServerModel2['default'](options)
    },
    serverController: {
      path: _path2['default'].join(options.root, 'server/api/controllers/' + options.classPlural + '.js'),
      content: _templatesServerController2['default'](options)
    },
    serverTemplate: {
      path: _path2['default'].join(options.root, 'server/api/templates/' + options.variablePlural + '/base.js'),
      content: _templatesServerTemplate2['default'](options)
    },
    sharedModel: {
      path: _path2['default'].join(options.root, 'shared/models/' + options.className + '.js'),
      content: _templatesSharedModel2['default'](options)
    },
    sharedSchema: {
      path: _path2['default'].join(options.root, 'shared/models/schemas/' + options.variableName + '.js'),
      content: _templatesSharedSchema2['default'](options)
    }
  };

  var queue = new _queueAsync2['default']();

  _lodash2['default'].forEach(output, function (out) {
    if (!options.force && _fs2['default'].existsSync(out.path)) {
      return callback(new Error('File already exists at ' + out.path + '. Use --force to overwrite'));
    }
    queue.defer(function (callback) {
      _mkdirp2['default'](_path2['default'].dirname(out.path), function (err) {
        if (err) return callback(err);
        console.log(' ', _chalk2['default'].green('Creating file:'), out.path);
        if (options.verbose) {
          console.log('---------------------');
          console.log(_chalk2['default'].yellow(out.content));
          console.log('---------------------');
        }
        _fs2['default'].writeFile(out.path, out.content, callback);
      });
    });
  });

  queue.await(callback);
}

module.exports = exports['default'];