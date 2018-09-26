"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _baseModel = _interopRequireDefault(require("./baseModel"));

var partner = function partner(records) {
  return {
    findOrCreate: function findOrCreate(email) {
      var ids = Object.keys(records);
      var id = Math.max.apply(Math, (0, _toConsumableArray2.default)(ids)) + 1;
      records[id] = {
        id: id,
        name: email
      };
      return id;
    }
  };
};

var _default = function _default(records) {
  return (0, _objectSpread2.default)({}, (0, _baseModel.default)(records), partner(records));
};

exports.default = _default;