"use strict";

exports.__esModule = true;

exports["default"] = function (options) {
  return "import _ from 'lodash' // eslint-disable-line\nimport schema from '../../../../shared/models/schemas/" + options.variableName + "'\n\nexport default {\n  $select: [\n    'id',\n    ..._.keys(schema)\n  ],\n}\n";
};

module.exports = exports["default"];