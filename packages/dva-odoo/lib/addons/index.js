"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _base = _interopRequireDefault(require("./base"));

// import all model
// TBD: Mix all models in each addons, same model must call modelExtend
var creatorMixin = (0, _objectSpread2.default)({}, _base.default);

var _default = (0, _objectSpread2.default)({}, creatorMixin);

exports.default = _default;