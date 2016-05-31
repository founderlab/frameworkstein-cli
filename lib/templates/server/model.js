"use strict";

exports.__esModule = true;

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport moment from 'moment'\nimport Backbone from 'backbone'\nimport {smartSync} from 'fl-server-utils'\n\nconst dbUrl = process.env.DATABASE_URL\nif (!dbUrl) console.log('Missing process.env.DATABASE_URL')\n\nexport default class " + options.className + " extends Backbone.Model {\n  url = `${dbUrl}/" + options.tableName + "`\n\n  schema = () => _.extend({\n\n  }, require('../../shared/models/schemas/" + options.variableName + "'))\n\n  defaults() { return {created_at: moment.utc().toDate()} }\n}\n\n" + options.className + ".prototype.sync = smartSync(dbUrl, " + options.className + ")\n";
};

module.exports = exports["default"];