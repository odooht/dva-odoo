"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _dvaModelExtend = _interopRequireDefault(require("dva-model-extend"));

var getCallAction = function getCallAction(options) {
  var method = options.method,
      args = options.args,
      _options$kwargs = options.kwargs,
      kwargs = _options$kwargs === void 0 ? {} : _options$kwargs,
      mock = options.mock,
      callback = options.callback,
      params = options.params;
  return {
    type: 'call',
    payload: {
      params: {
        method: method,
        args: args,
        kwargs: kwargs,
        mock: mock
      },
      callback: {
        type: callback ? callback : method + '_callback',
        params: params
      }
    }
  };
};

var _default = function _default(options) {
  console.log('res.partner:', options);
  var model = 'res.partner';

  var createself = function createself(options) {
    var model = options.model,
        namespace = options.namespace,
        service = options.service,
        _options$fields = options.fields,
        default_fields = _options$fields === void 0 ? ['name'] : _options$fields;
    return {
      namespace: namespace,
      state: {},
      effects: {
        findOrCreate:
        /*#__PURE__*/
        _regenerator.default.mark(function findOrCreate(_ref, _ref2) {
          var payload, call, put, select, _payload$fields, fields, email, _payload$mock, mock;

          return _regenerator.default.wrap(function findOrCreate$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  payload = _ref.payload;
                  call = _ref2.call, put = _ref2.put, select = _ref2.select;
                  _payload$fields = payload.fields, fields = _payload$fields === void 0 ? default_fields : _payload$fields, email = payload.email, _payload$mock = payload.mock, mock = _payload$mock === void 0 ? 'findOrCreate' : _payload$mock;
                  _context.next = 5;
                  return put(getCallAction({
                    method: 'find_or_create',
                    args: [email],
                    mock: mock,
                    callback: 'findOrCreate_callback',
                    params: payload
                  }));

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, findOrCreate, this);
        }),
        findOrCreate_callback:
        /*#__PURE__*/
        _regenerator.default.mark(function findOrCreate_callback(_ref3, _ref4) {
          var payload, call, put, select, fields, result;
          return _regenerator.default.wrap(function findOrCreate_callback$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  payload = _ref3.payload;
                  call = _ref4.call, put = _ref4.put, select = _ref4.select;
                  fields = payload.params.fields, result = payload.response.result;

                  if (!result) {
                    _context2.next = 8;
                    break;
                  }

                  _context2.next = 6;
                  return put({
                    type: 'read',
                    payload: {
                      id: result,
                      fields: fields
                    }
                  });

                case 6:
                  _context2.next = 8;
                  return put({
                    type: 'insert',
                    payload: {
                      id: result
                    }
                  });

                case 8:
                case "end":
                  return _context2.stop();
              }
            }
          }, findOrCreate_callback, this);
        })
      },
      reducers: {}
    };
  };

  var _options$extend = options.extend,
      extend = _options$extend === void 0 ? [] : _options$extend;
  return (0, _objectSpread2.default)({}, options, {
    model: model,
    inherit: 'base',
    extend: [createself].concat((0, _toConsumableArray2.default)(extend))
  });
};

exports.default = _default;