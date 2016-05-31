"use strict";

exports.__esModule = true;

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport moment from 'moment'\nimport Backbone from 'backbone'\n\nexport default class " + options.className + " extends Backbone.Model {\n  schema = () => _.extend({\n\n  }, require('./schemas/" + options.variableName + "'))\n\n  defaults() { return {created_at: moment.utc().toDate()} }\n}\n\n" + options.className + ".prototype.urlRoot = '/api/" + options.plural + "'\n" + options.className + ".prototype.sync = require('backbone-http').sync(" + options.className + ")\n";
};

module.exports = exports["default"];