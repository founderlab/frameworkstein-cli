"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport moment from 'moment'\nimport Backbone from 'backbone'\n\nconst db_url = process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL\nif (!db_url) console.log('Missing process.env.DATABASE_URL')\n\nexport default class " + options.class_name + " extends Backbone.Model {\n  url = `${db_url}/" + options.plural + "`\n\n  schema = () => _.extend({\n\n  }, require('../../shared/models/schemas/" + options.name + "'))\n\n  defaults() { return {created_at: moment.utc().toDate()} }\n}\n\n" + options.class_name + ".prototype.sync = require('backbone-mongo').sync(" + options.class_name + ")\n";
};

module.exports = exports["default"];