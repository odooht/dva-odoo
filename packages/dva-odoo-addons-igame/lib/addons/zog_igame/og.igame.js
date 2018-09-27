"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _default = function _default(options) {
  var parent = function parent(options) {
    var namespace = options.namespace;
    return {
      namespace: namespace,
      state: {},
      effects: {},
      reducers: {}
    };
  };

  var _options$extend = options.extend,
      extend = _options$extend === void 0 ? [] : _options$extend;
  return (0, _objectSpread2.default)({}, options, {
    model: 'og.igame',
    inherit: 'base',
    extend: [parent].concat((0, _toConsumableArray2.default)(extend))
  });
};

exports.default = _default;