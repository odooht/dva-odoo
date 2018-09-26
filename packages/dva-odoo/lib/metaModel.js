"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _dvaModelExtend = _interopRequireDefault(require("dva-model-extend"));

/*
  metaModel creator, contain 5 effect method:
    read, search, create, write, unlink.

  TBD: check and rewrite reducer method.
*/
function _odooCallParams(params0) {
  var model = params0.model,
      method = params0.method,
      _params0$args = params0.args,
      args = _params0$args === void 0 ? [] : _params0$args,
      _params0$kwargs = params0.kwargs,
      kwargs = _params0$kwargs === void 0 ? {} : _params0$kwargs,
      _params0$namespace = params0.namespace,
      namespace = _params0$namespace === void 0 ? '' : _params0$namespace,
      _params0$mock = params0.mock,
      mock = _params0$mock === void 0 ? '' : _params0$mock;
  var _kwargs$context = kwargs.context,
      context = _kwargs$context === void 0 ? {} : _kwargs$context;
  var mock_react_api = namespace + '/' + mock;
  var kw2 = mock ? (0, _objectSpread2.default)({}, kwargs, {
    context: (0, _objectSpread2.default)({}, context, {
      mock_react_api: mock_react_api
    })
  }) : kwargs;
  var params = {
    model: model,
    method: method,
    args: args,
    kwargs: kw2
  };
  return params;
}

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
  var model = options.model,
      namespace = options.namespace,
      service = options.service,
      _options$fields = options.fields,
      default_fields = _options$fields === void 0 ? ['name'] : _options$fields;
  var baseModel = {
    namespace: namespace,
    state: {
      ids: [],
      id: 0
    },
    effects: {
      call:
      /*#__PURE__*/
      _regenerator.default.mark(function call(_ref, _ref2) {
        var payload, _call, put, select, callback, response, token, params0, params1, params, response0, result, error;

        return _regenerator.default.wrap(function call$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                payload = _ref.payload;
                _call = _ref2.call, put = _ref2.put, select = _ref2.select;
                callback = payload.callback;
                response = {};
                _context.next = 6;
                return select(function (state) {
                  return state.login.sid;
                });

              case 6:
                token = _context.sent;

                if (token) {
                  _context.next = 11;
                  break;
                }

                response = {
                  result: 0,
                  error: {
                    code: 1,
                    msg: 'no login'
                  }
                };
                _context.next = 19;
                break;

              case 11:
                params0 = payload.params;
                params1 = (0, _objectSpread2.default)({}, params0, {
                  model: model,
                  namespace: namespace
                });
                params = jsonrpc(_odooCallParams(params1));
                _context.next = 16;
                return service(token, params);

              case 16:
                response0 = _context.sent;
                result = response0.result, error = response0.error;
                response = {
                  result: result
                };

              case 19:
                _context.next = 21;
                return put({
                  type: callback.type,
                  payload: {
                    params: callback.params,
                    response: response
                  }
                });

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, call, this);
      })
    },
    reducers: {
      view: function view(state, _ref3) {
        var payload = _ref3.payload;
        var pid = payload.id;
        var oid = state.id,
            oids = state.ids;
        var id = pid && pid in oids ? pid : oid;
        return (0, _objectSpread2.default)({}, state, {
          id: id
        });
      },
      insert: function insert(state, _ref4) {
        var payload = _ref4.payload;
        var ids = state.ids;
        var id = payload.id;
        return (0, _objectSpread2.default)({}, state, {
          ids: [id].concat((0, _toConsumableArray2.default)(ids)),
          id: id
        });
      },
      remove: function remove(state, _ref5) {
        var payload = _ref5.payload;
        var oids = state.ids,
            oid = state.id;
        var pid = payload.id;
        var ids = oids.filter(function (i) {
          return i != pid;
        });
        var id = oid != pid ? oid : 0;
        return (0, _objectSpread2.default)({}, state, {
          ids: ids,
          id: id
        });
      },
      save: function save(state, _ref6) {
        var payload = _ref6.payload;
        return (0, _objectSpread2.default)({}, state, payload);
      }
    }
  };
  var extendModel = {
    effects: {
      read:
      /*#__PURE__*/
      _regenerator.default.mark(function read(_ref7, _ref8) {
        var payload, call, put, select, id, _payload$fields, fields, _payload$mock, mock;

        return _regenerator.default.wrap(function read$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                payload = _ref7.payload;
                call = _ref8.call, put = _ref8.put, select = _ref8.select;
                id = payload.id, _payload$fields = payload.fields, fields = _payload$fields === void 0 ? default_fields : _payload$fields, _payload$mock = payload.mock, mock = _payload$mock === void 0 ? 'read' : _payload$mock;
                _context2.next = 5;
                return put(getCallAction({
                  method: 'read',
                  args: [id, fields],
                  mock: mock,
                  params: payload
                }));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, read, this);
      }),
      read_callback:
      /*#__PURE__*/
      _regenerator.default.mark(function read_callback(_ref9, _ref10) {
        var payload, call, put, select, result, res1, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, r;

        return _regenerator.default.wrap(function read_callback$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                payload = _ref9.payload;
                call = _ref10.call, put = _ref10.put, select = _ref10.select;
                result = payload.response.result;
                res1 = {};
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 7;

                for (_iterator = result[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  r = _step.value;
                  res1[r.id] = r;
                }

                _context3.next = 15;
                break;

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](7);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 15:
                _context3.prev = 15;
                _context3.prev = 16;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 18:
                _context3.prev = 18;

                if (!_didIteratorError) {
                  _context3.next = 21;
                  break;
                }

                throw _iteratorError;

              case 21:
                return _context3.finish(18);

              case 22:
                return _context3.finish(15);

              case 23:
                _context3.next = 25;
                return put({
                  type: 'odooData/update',
                  payload: {
                    model: model,
                    data: res1
                  }
                });

              case 25:
              case "end":
                return _context3.stop();
            }
          }
        }, read_callback, this, [[7, 11, 15, 23], [16,, 18, 22]]);
      }),
      write:
      /*#__PURE__*/
      _regenerator.default.mark(function write(_ref11, _ref12) {
        var payload, call, put, select, id, vals, _payload$mock2, mock;

        return _regenerator.default.wrap(function write$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                payload = _ref11.payload;
                call = _ref12.call, put = _ref12.put, select = _ref12.select;
                id = payload.id, vals = payload.vals, _payload$mock2 = payload.mock, mock = _payload$mock2 === void 0 ? 'write' : _payload$mock2;
                _context4.next = 5;
                return put(getCallAction({
                  method: 'write',
                  args: [id, vals],
                  mock: mock,
                  params: payload
                }));

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, write, this);
      }),
      write_callback:
      /*#__PURE__*/
      _regenerator.default.mark(function write_callback(_ref13, _ref14) {
        var payload, call, put, select, _payload$params, id, vals, result;

        return _regenerator.default.wrap(function write_callback$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                payload = _ref13.payload;
                call = _ref14.call, put = _ref14.put, select = _ref14.select;
                _payload$params = payload.params, id = _payload$params.id, vals = _payload$params.vals, result = payload.response.result;

                if (!result) {
                  _context5.next = 6;
                  break;
                }

                _context5.next = 6;
                return put({
                  type: 'odooData/update',
                  payload: {
                    model: model,
                    data: (0, _defineProperty2.default)({}, id, vals)
                  }
                });

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, write_callback, this);
      }),
      _search:
      /*#__PURE__*/
      _regenerator.default.mark(function _search(_ref15, _ref16) {
        var payload, call, put, select, domain, _payload$mock3, mock;

        return _regenerator.default.wrap(function _search$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                payload = _ref15.payload;
                call = _ref16.call, put = _ref16.put, select = _ref16.select;
                domain = payload.domain, _payload$mock3 = payload.mock, mock = _payload$mock3 === void 0 ? 'search' : _payload$mock3;
                _context6.next = 5;
                return put(getCallAction({
                  method: 'search',
                  args: [domain],
                  mock: mock,
                  callback: '_search_callback',
                  params: payload
                }));

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _search, this);
      }),
      _search_callback:
      /*#__PURE__*/
      _regenerator.default.mark(function _search_callback(_ref17, _ref18) {
        var payload, call, put, select, fields, result;
        return _regenerator.default.wrap(function _search_callback$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                payload = _ref17.payload;
                call = _ref18.call, put = _ref18.put, select = _ref18.select;
                fields = payload.params.fields, result = payload.response.result;

                if (!result) {
                  _context7.next = 8;
                  break;
                }

                _context7.next = 6;
                return put({
                  type: 'read',
                  payload: {
                    id: result,
                    fields: fields,
                    mock: 'multiRead'
                  }
                });

              case 6:
                _context7.next = 8;
                return put({
                  type: 'save',
                  payload: {
                    ids: result
                  }
                });

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _search_callback, this);
      }),
      search:
      /*#__PURE__*/
      _regenerator.default.mark(function search(_ref19, _ref20) {
        var payload, call, put, select;
        return _regenerator.default.wrap(function search$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                payload = _ref19.payload;
                call = _ref20.call, put = _ref20.put, select = _ref20.select;
                _context8.next = 4;
                return put({
                  type: '_search',
                  payload: payload
                });

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, search, this);
      }),
      nameCreate:
      /*#__PURE__*/
      _regenerator.default.mark(function nameCreate(_ref21, _ref22) {
        var payload, call, put, select, _payload$fields2, fields, name, _payload$mock4, mock;

        return _regenerator.default.wrap(function nameCreate$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                payload = _ref21.payload;
                call = _ref22.call, put = _ref22.put, select = _ref22.select;
                _payload$fields2 = payload.fields, fields = _payload$fields2 === void 0 ? default_fields : _payload$fields2, name = payload.name, _payload$mock4 = payload.mock, mock = _payload$mock4 === void 0 ? 'nameCreate' : _payload$mock4;
                _context9.next = 5;
                return put(getCallAction({
                  method: 'name_create',
                  args: [name],
                  mock: mock,
                  callback: 'nameCreate_callback',
                  params: payload
                }));

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, nameCreate, this);
      }),
      nameCreate_callback:
      /*#__PURE__*/
      _regenerator.default.mark(function nameCreate_callback(_ref23, _ref24) {
        var payload, call, put, select, fields, result;
        return _regenerator.default.wrap(function nameCreate_callback$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                payload = _ref23.payload;
                call = _ref24.call, put = _ref24.put, select = _ref24.select;
                fields = payload.params.fields, result = payload.response.result;

                if (!result) {
                  _context10.next = 8;
                  break;
                }

                _context10.next = 6;
                return put({
                  type: 'read',
                  payload: {
                    id: result[0],
                    fields: fields
                  }
                });

              case 6:
                _context10.next = 8;
                return put({
                  type: 'insert',
                  payload: {
                    id: result[0]
                  }
                });

              case 8:
              case "end":
                return _context10.stop();
            }
          }
        }, nameCreate_callback, this);
      }),
      create:
      /*#__PURE__*/
      _regenerator.default.mark(function create(_ref25, _ref26) {
        var payload, call, put, select, _payload$fields3, fields, vals, _payload$mock5, mock;

        return _regenerator.default.wrap(function create$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                payload = _ref25.payload;
                call = _ref26.call, put = _ref26.put, select = _ref26.select;
                _payload$fields3 = payload.fields, fields = _payload$fields3 === void 0 ? default_fields : _payload$fields3, vals = payload.vals, _payload$mock5 = payload.mock, mock = _payload$mock5 === void 0 ? 'create' : _payload$mock5;
                _context11.next = 5;
                return put(getCallAction({
                  method: 'create',
                  args: [vals],
                  mock: mock,
                  params: payload
                }));

              case 5:
              case "end":
                return _context11.stop();
            }
          }
        }, create, this);
      }),
      create_callback:
      /*#__PURE__*/
      _regenerator.default.mark(function create_callback(_ref27, _ref28) {
        var payload, call, put, select, fields, result;
        return _regenerator.default.wrap(function create_callback$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                payload = _ref27.payload;
                call = _ref28.call, put = _ref28.put, select = _ref28.select;
                fields = payload.params.fields, result = payload.response.result;

                if (!result) {
                  _context12.next = 8;
                  break;
                }

                _context12.next = 6;
                return put({
                  type: 'read',
                  payload: {
                    id: result,
                    fields: fields
                  }
                });

              case 6:
                _context12.next = 8;
                return put({
                  type: 'insert',
                  payload: {
                    id: result
                  }
                });

              case 8:
              case "end":
                return _context12.stop();
            }
          }
        }, create_callback, this);
      }),
      unlink:
      /*#__PURE__*/
      _regenerator.default.mark(function unlink(_ref29, _ref30) {
        var payload, call, put, select, id, _payload$mock6, mock;

        return _regenerator.default.wrap(function unlink$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                payload = _ref29.payload;
                call = _ref30.call, put = _ref30.put, select = _ref30.select;
                id = payload.id, _payload$mock6 = payload.mock, mock = _payload$mock6 === void 0 ? 'unlink' : _payload$mock6;
                _context13.next = 5;
                return put(getCallAction({
                  method: 'unlink',
                  args: [id],
                  mock: mock,
                  params: payload
                }));

              case 5:
              case "end":
                return _context13.stop();
            }
          }
        }, unlink, this);
      }),
      unlink_callback:
      /*#__PURE__*/
      _regenerator.default.mark(function unlink_callback(_ref31, _ref32) {
        var payload, call, put, select, id, result;
        return _regenerator.default.wrap(function unlink_callback$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                payload = _ref31.payload;
                call = _ref32.call, put = _ref32.put, select = _ref32.select;
                id = payload.params.id, result = payload.response.result;

                if (!result) {
                  _context14.next = 8;
                  break;
                }

                _context14.next = 6;
                return put({
                  type: 'odooData/remove',
                  payload: {
                    model: model,
                    id: id
                  }
                });

              case 6:
                _context14.next = 8;
                return put({
                  type: 'remove',
                  payload: {
                    id: id
                  }
                });

              case 8:
              case "end":
                return _context14.stop();
            }
          }
        }, unlink_callback, this);
      })
    }
  };
  return (0, _dvaModelExtend.default)(baseModel, (0, _objectSpread2.default)({}, extendModel, {
    namespace: baseModel.namespace
  }));
};

exports.default = _default;