"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _dvaModelExtend = _interopRequireDefault(require("dva-model-extend"));

var _odooData = _interopRequireDefault(require("./odooData"));

var _login = _interopRequireDefault(require("./login"));

var _metaModel = _interopRequireDefault(require("./metaModel"));

var _addons = _interopRequireDefault(require("./addons"));

var getBaseOptions = function getBaseOptions(options) {
  var _options$inherit = options.inherit,
      inherit = _options$inherit === void 0 ? 'base' : _options$inherit;

  if (inherit === 'base') {
    return options;
  }

  var creator = _addons.default[inherit];

  if (creator) {
    var new_options = creator(options);
    return getBaseOptions(new_options);
  }

  return options;
};

var create_odooData = function create_odooData(options) {
  var service = options.service;
  return (0, _odooData.default)({
    service: service
  });
};

var create_login = function create_login(options) {
  var service = options.service,
      _options$extend = options.extend,
      extend = _options$extend === void 0 ? {} : _options$extend; //  const dvamodel = loginCreate({ service });

  var dvamodel = (0, _login.default)(options); //  console.log(dvamodel);

  var namespace = dvamodel.namespace;
  return (0, _dvaModelExtend.default)(dvamodel, (0, _objectSpread2.default)({}, extend, {
    namespace: namespace
  }));
};

var _default = function _default(options) {
  var _options$inherit2 = options.inherit,
      inherit = _options$inherit2 === void 0 ? 'base' : _options$inherit2;

  if (inherit == 'odooData') {
    return create_odooData(options);
  }

  if (inherit == 'login') {
    return create_login(options);
  }

  var new_options = getBaseOptions(options);
  var srcModel = (0, _metaModel.default)(new_options);
  var _new_options$extend = new_options.extend,
      extend = _new_options$extend === void 0 ? [] : _new_options$extend;
  var outModel = srcModel;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = extend[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var ext = _step.value;
      outModel = (0, _dvaModelExtend.default)(outModel, ext(options));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return outModel;
};

exports.default = _default;