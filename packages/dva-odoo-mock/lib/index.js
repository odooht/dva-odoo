"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mockApi = _interopRequireDefault(require("./mockApi"));

var _mockModel = _interopRequireDefault(require("./mockModel"));

var dvaOdoo = {
  mockApi: _mockApi.default,
  mockModel: _mockModel.default
};
var _default = dvaOdoo;
exports.default = _default;