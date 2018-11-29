"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fetch2 = _interopRequireDefault(require("dva/fetch"));

var _fetch = function _fetch(url, options, timeout) {
  return Promise.race([(0, _fetch2.default)(url, options), new Promise(function (resolve, reject) {
    setTimeout(function () {
      return reject(new Error('request timeout'));
    }, timeout);
  })]);
};

var checkStatus = function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  var error = new Error(response.statusText);
  error.name = response.status;
  error.data = response;
  throw error;
  return null;
};

var checkJsonrpc =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(response, oid, options) {
    var data, id, jsonrpc, error;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return response.json();

          case 2:
            data = _context.sent;
            id = data.id, jsonrpc = data.jsonrpc;

            if (!(id === oid && jsonrpc === '2.0')) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", data);

          case 6:
            error = new Error('Error jsonrpc');
            error.name = 'Jsonrpc';
            error.data = {
              id: oid,
              options: options,
              data: data
            };
            throw error;

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function checkJsonrpc(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var checkOdooError = function checkOdooError(data) {
  var result = data.result,
      error0 = data.error;

  if (!error0) {
    return result;
  }

  var code = error0.code,
      message = error0.message,
      data2 = error0.data;
  var error = new Error(message);
  error.name = code;
  error.data = data2;
  throw error;
  return null;
};

var jsonrpc = function jsonrpc(url, params) {
  //console.log('jsonrpc=',url, params)
  var id = Math.round(Math.random() * 1000000000);
  var options = {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: 2.0,
      id: id,
      method: 'call',
      params: params
    }),
    //headers: new Headers({ 'Content-Type': 'application/json' })
    headers: {
      'content-type': 'application/json'
    }
  };
  return _fetch(url, options, 10000).then(function (res) {
    //  console.log('1st',res)
    return checkStatus(res);
  }).then(
  /*#__PURE__*/
  function () {
    var _ref2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(res) {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", checkJsonrpc(res, id, options));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x4) {
      return _ref2.apply(this, arguments);
    };
  }()).then(function (data) {
    // console.log( 'after jsonrpc', data)
    return checkOdooError(data);
  }).then(function (result) {
    // console.log( 'result ok', result)
    return {
      code: 0,
      result: result
    };
  }).catch(function (error) {
    return {
      code: 1,
      error: error
    };
  });
};

var RPC =
/*#__PURE__*/
function () {
  function RPC(options) {
    (0, _classCallCheck2.default)(this, RPC);
    var _options$host = options.host,
        host = _options$host === void 0 ? '/api' : _options$host,
        db = options.db,
        sid = options.sid,
        uid = options.uid;
    this.host = host;
    this.db = db;
    this.sid = null;
    this.uid = null;
  }

  (0, _createClass2.default)(RPC, [{
    key: "login",
    value: function () {
      var _login = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(params) {
        var db, login, password, url, data, code, _data$result, sid, uid;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                db = params.db, login = params.login, password = params.password;
                url = "".concat(this.host, "/json/user/login");

                if (db) {
                  this.db = db;
                }

                _context3.next = 5;
                return jsonrpc(url, {
                  login: login,
                  password: password,
                  db: this.db,
                  type: 'account'
                });

              case 5:
                data = _context3.sent;
                code = data.code;

                if (!code) {
                  _data$result = data.result, sid = _data$result.sid, uid = _data$result.uid;
                  this.sid = sid;
                  this.uid = uid;
                } else {}

                return _context3.abrupt("return", data);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function login(_x5) {
        return _login.apply(this, arguments);
      };
    }()
  }, {
    key: "logout",
    value: function () {
      var _logout = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4() {
        var url, data, code, result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.sid) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", {
                  code: 1,
                  error: {}
                });

              case 2:
                url = "".concat(this.host, "/web/session/destroy?session_id=").concat(this.sid);
                _context4.next = 5;
                return jsonrpc(url, {});

              case 5:
                data = _context4.sent;
                code = data.code;

                if (!code) {
                  result = data.result; // TBD

                  this.sid = null;
                  this.uid = null;
                }

                this.sid = null;
                this.uid = null;
                return _context4.abrupt("return", data);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function logout() {
        return _logout.apply(this, arguments);
      };
    }()
  }, {
    key: "call",
    value: function () {
      var _call = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee5(params) {
        var model, method, _params$args, args, _params$kwargs, kwargs, url, data, code, result;

        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.sid) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return", {
                  code: 1,
                  error: {
                    message: 'no sid'
                  }
                });

              case 2:
                model = params.model, method = params.method, _params$args = params.args, args = _params$args === void 0 ? [] : _params$args, _params$kwargs = params.kwargs, kwargs = _params$kwargs === void 0 ? {} : _params$kwargs;
                url = "".concat(this.host, "/json/api?session_id=").concat(this.sid);
                _context5.next = 6;
                return jsonrpc(url, {
                  model: model,
                  method: method,
                  args: args,
                  kwargs: kwargs
                });

              case 6:
                data = _context5.sent;
                code = data.code;

                if (!code) {
                  result = data.result;
                }

                return _context5.abrupt("return", data);

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function call(_x6) {
        return _call.apply(this, arguments);
      };
    }()
  }]);
  return RPC;
}();

var _default = RPC;
exports.default = _default;