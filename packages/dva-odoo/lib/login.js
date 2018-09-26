"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

/*
  TBD:  after login,
   1 how to save data,
   2 how to send msg to page
   3 call userinfo?
*/
var jsonrpc = function jsonrpc(params) {
  return {
    method: 'POST',
    body: {
      jsonrpc: 2.0,
      id: 1,
      method: 'call',
      params: params
    }
  };
};

var _default = function _default(options) {
  var _options$namespace = options.namespace,
      namespace = _options$namespace === void 0 ? 'login' : _options$namespace,
      service = options.service;
  return {
    namespace: namespace,
    state: {
      sid: '',
      uid: 0
    },
    effects: {
      login:
      /*#__PURE__*/
      _regenerator.default.mark(function login(_ref, _ref2) {
        var payload, callback, success, error, call, put, select, response, result, errormsg, data, id, payload2;
        return _regenerator.default.wrap(function login$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                payload = _ref.payload, callback = _ref.callback, success = _ref.success, error = _ref.error;
                call = _ref2.call, put = _ref2.put, select = _ref2.select;
                _context.next = 4;
                return service(jsonrpc(payload));

              case 4:
                response = _context.sent;
                result = response.result, errormsg = response.error; // response.error,  error code is always 200, send by odoo.
                // error msg is odoo exception

                data = result;

                if (!(data.status === 'ok')) {
                  _context.next = 20;
                  break;
                }

                _context.next = 10;
                return put({
                  type: 'save',
                  payload: (0, _objectSpread2.default)({}, data)
                });

              case 10:
                id = data.uid;
                payload2 = {
                  model: 'res.users',
                  id: id,
                  fields: ['name'],
                  namespace: 'user',
                  mock: 'read'
                };
                _context.next = 14;
                return put({
                  type: 'odooData/read',
                  payload: payload2
                });

              case 14:
                _context.next = 16;
                return put({
                  type: 'login_success',
                  payload: data
                });

              case 16:
                if (callback) {
                  callback(data);
                }

                if (success) {
                  success(data);
                }

                _context.next = 24;
                break;

              case 20:
                _context.next = 22;
                return put({
                  type: 'login_error',
                  payload: data
                });

              case 22:
                if (callback) {
                  callback(data);
                }

                if (error) {
                  error(data);
                }

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, login, this);
      }),
      login_success:
      /*#__PURE__*/
      _regenerator.default.mark(function login_success(_ref3, _ref4) {
        var payload, call, put, select;
        return _regenerator.default.wrap(function login_success$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                payload = _ref3.payload;
                call = _ref4.call, put = _ref4.put, select = _ref4.select;

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, login_success, this);
      }),
      login_error:
      /*#__PURE__*/
      _regenerator.default.mark(function login_error(_ref5, _ref6) {
        var payload, call, put, select;
        return _regenerator.default.wrap(function login_error$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                payload = _ref5.payload;
                call = _ref6.call, put = _ref6.put, select = _ref6.select;

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, login_error, this);
      })
    },
    reducers: {
      save: function save(state, _ref7) {
        var payload = _ref7.payload;
        return (0, _objectSpread2.default)({}, state, payload);
      }
    }
  };
};

exports.default = _default;