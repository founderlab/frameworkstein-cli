"use strict";

exports.__esModule = true;

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport moment from 'moment'\nimport Backbone from 'backbone'\nimport {smartSync} from 'fl-server-utils'\n\nconst db_url = process.env.DATABASE_URL\nif (!db_url) console.log('Missing process.env.DATABASE_URL')\n\nexport default class " + options.className + " extends Backbone.Model {\n  url = `${db_url}/" + options.plural + "`\n\n  schema = () => _.extend({\n\n  }, require('../../shared/models/schemas/" + options.name + "'))\n\n  defaults() { return {created_at: moment.utc().toDate()} }\n}\n\n" + options.className + ".prototype.sync = smartSync(db_url, " + options.className + ")\n";
};

module.exports = exports["default"];