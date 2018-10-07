'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread')
);

var _addons = _interopRequireDefault(require('./addons'));

var _default = function _default(options) {
  var _options$inherit = options.inherit,
    inherit = _options$inherit === void 0 ? 'base' : _options$inherit,
    extend = options.extend;
  var create = _addons.default[inherit];

  if (!create) {
    return (0, _objectSpread2.default)({}, options, {
      inherit: inherit,
    });
  }

  return create(options);
};

exports.default = _default;
