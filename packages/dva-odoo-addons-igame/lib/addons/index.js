"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _dob_base = _interopRequireDefault(require("./dob_base"));

var _zog_igame = _interopRequireDefault(require("./zog_igame"));

// TBD: Mix all models in each addons, same model must call modelExtend
var creatorMixin = (0, _objectSpread2.default)({}, _dob_base.default, _zog_igame.default);

var _default = (0, _objectSpread2.default)({}, creatorMixin);

exports.default = _default;