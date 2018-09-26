"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _baseModel = _interopRequireDefault(require("./models/baseModel"));

var _resPartner = _interopRequireDefault(require("./models/resPartner"));

var modelCreators = {
  'base': _baseModel.default,
  'res.users': _baseModel.default,
  'res.partner': _resPartner.default
};

var mockModel = function mockModel(options) {
  var records = options.records,
      _options$model = options.model,
      model = _options$model === void 0 ? 'base' : _options$model,
      _options$extend = options.extend,
      extend = _options$extend === void 0 ? {} : _options$extend;
  var creator = modelCreators[model] ? modelCreators[model] : _baseModel.default;
  var methods = creator(records);
  return (0, _objectSpread2.default)({}, methods, extend);
};

var _default = mockModel;
exports.default = _default;