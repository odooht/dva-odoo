"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _vob_res = _interopRequireDefault(require("./vob_res"));

// TBD: Mix all models in each addons
var allCreators = (0, _objectSpread2.default)({}, _vob_res.default);

var _default = function _default(options) {
  var inherit = options.inherit;
  var creator = allCreators[inherit];
  return creator ? creator(options) : options;
};

exports.default = _default;