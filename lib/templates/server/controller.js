"use strict";

exports.__esModule = true;

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport RestController from 'fl-backbone-rest'\nimport {JSONUtils} from 'backbone-orm'\nimport {createAuthMiddleware} from 'fl-auth-server'\nimport schema from '../../../shared/models/schemas/" + options.variableName + "'\nimport " + options.className + " from '../../models/" + options.className + "'\n\nconst whitelist = [\n  'id',\n  ..._.keys(schema),\n]\n\nexport function canAccess(options, callback) {\n  const {user, req} = options\n  if (!user) return callback(null, false)\n  if (user.admin) return callback(null, true)\n  if (req.method === 'GET') return callback(null, true)\n\n  const query = JSONUtils.parseQuery(req.query)\n  if (query.$include) return callback(null, false, 'No $include')\n\n  // Check if the current user is authorised to edit this model\n  // const id = req.params.id\n\n  callback(null, false)\n}\n\nexport default class " + options.classPlural + "Controller extends RestController {\n  constructor(options) {\n    super(options.app, _.defaults({\n      model_type: " + options.className + ",\n      route: '/api/" + options.tableName + "',\n      auth: [...options.auth, createAuthMiddleware({canAccess})],\n      templates: {\n        base: require('../templates/" + options.variablePlural + "/base'),\n      },\n      default_template: 'base',\n      whitelist: {\n        create: whitelist,\n        update: whitelist,\n      },\n    }, options))\n  }\n}\n";
};

module.exports = exports["default"];