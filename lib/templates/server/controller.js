"use strict";

exports.__esModule = true;

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport RestController from 'backbone-rest'\nimport {createAuthMiddleware} from 'fl-auth-server'\n\nfunction canAccess(options, callback) {\n  const {user, req} = options\n  if (req.method === 'GET') return callback(null, true)\n  if (!user) return callback(null, false)\n  if (user.admin || user.get('admin')) return callback(null, true)\n  callback(null, false)\n}\n\nexport default class " + options.class_plural + "Controller extends RestController {\n  constructor(options) {\n    super(options.app, _.defaults({\n      model_type: require('../../models/" + options.className + "'),\n      route: '/api/" + options.plural + "',\n      auth: [...options.auth, createAuthMiddleware({canAccess})],\n      whitelist: {\n\n      },\n    }, options))\n  }\n}\n";
};

module.exports = exports["default"];