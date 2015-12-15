"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport RestController from 'backbone-rest'\nimport {createAuthMiddleware} from 'fl-auth-server'\n\nfunction canAccess(options, callback) {\n  const {user, req} = options\n  callback(null, true)\n}\n\nexport default class " + options.class_plural + "Controller extends RestController {\n  constructor(options) {\n    super(options.app, _.defaults({\n      model_type: require('../../models/" + options.name + "'),\n      route: '/api/" + options.plural + "',\n      auth: [...options.auth, createAuthMiddleware({canAccess})],\n      whitelist: {\n\n      },\n    }, options))\n  }\n}\n";
};

module.exports = exports["default"];