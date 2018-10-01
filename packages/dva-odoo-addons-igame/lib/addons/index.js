'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread')
);

var _vob_res = _interopRequireDefault(require('./vob_res'));

var _zog_igame = _interopRequireDefault(require('./zog_igame'));

// TBD: Mix all models in each addons, same model must call modelExtend
var creatorMixin = (0, _objectSpread2.default)(
  {},
  _vob_res.default,
  _zog_igame.default
);

var _default = (0, _objectSpread2.default)({}, creatorMixin);

exports.default = _default;
