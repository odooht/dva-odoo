'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/toConsumableArray')
);

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread')
);

//import baseModel from './baseModel';
var my_records = {
  1: {
    id: 1,
    name: 'n1',
  },
  2: {
    id: 2,
    name: 'n2',
  },
  3: {
    id: 3,
    name: 'n3',
  },
};

var partner = function partner(_ref) {
  var records = _ref.records;

  var rename = function rename(id, name) {
    if (Object.keys(records).indexOf(id)) {
      records[id] = (0, _objectSpread2.default)({}, records[id], {
        name: name,
      });
      return 1;
    }

    return 0;
  };

  return {
    rename: rename,
  };
};

var _default = function _default(options) {
  var records = options.records,
    _options$extend = options.extend,
    extend = _options$extend === void 0 ? [] : _options$extend;
  return {
    records: records ? records : my_records,
    inherit: 'res.partner',
    extend: [partner].concat((0, _toConsumableArray2.default)(extend)),
  };
};

exports.default = _default;
