"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport moment from 'moment'\nimport Backbone from 'backbone'\n\nexport default class " + options.class_name + " extends Backbone.Model {\n  schema = () => _.extend({\n\n  }, require('./schemas/" + options.name + "'))\n\n  defaults() { return {created_at: moment.utc().toDate()} }\n}\n\n" + options.class_name + ".prototype.urlRoot = '/api/" + options.plural + "'\n" + options.class_name + ".prototype.sync = require('backbone-http').sync(" + options.class_name + ")\n";
};

module.exports = exports["default"];