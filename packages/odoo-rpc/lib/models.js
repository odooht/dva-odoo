"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/*

TBD:  2018-11-29
attr(). m2m no flash

*/
var fields_get =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(rpc, model, allfields, attributes) {
    var method, data, code, result;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            method = 'fields_get';
            _context.next = 3;
            return rpc.call({
              model: model,
              method: method,
              args: [allfields, attributes]
            });

          case 3:
            data = _context.sent;
            code = data.code;

            if (code) {
              _context.next = 10;
              break;
            }

            result = data.result;
            return _context.abrupt("return", result);

          case 10:
            return _context.abrupt("return", {});

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fields_get(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var modelCreator =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee12(options) {
    var model, fs0, rpc, env, fs, get_fields, fields, cls;
    return _regenerator.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            model = options.model, fs0 = options.fields, rpc = options.rpc, env = options.env;
            fs = fs0 ? fs0 : ['id', 'name'];

            get_fields =
            /*#__PURE__*/
            function () {
              var _ref3 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee2() {
                var fields0;
                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return fields_get(rpc, model, fs, ['type', 'relation']);

                      case 2:
                        fields0 = _context2.sent;
                        return _context2.abrupt("return", Object.keys(fields0).reduce(function (acc, cur) {
                          if (fs.indexOf(cur) >= 0) {
                            acc[cur] = fields0[cur];
                          }

                          return acc;
                        }, {}));

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function get_fields() {
                return _ref3.apply(this, arguments);
              };
            }();

            _context12.next = 5;
            return get_fields();

          case 5:
            fields = _context12.sent;

            cls =
            /*#__PURE__*/
            function () {
              //        static _name = model
              //        static _rpc = rpc
              //        static _env = env
              //        static _fields = fields
              //        static _records = {}
              //        static _instances = {}
              function cls(ids, vals) {
                (0, _classCallCheck2.default)(this, cls);

                if ((0, _typeof2.default)(ids) === 'object') {
                  this._ids = ids;
                  this._instances = ids.reduce(function (acc, cur) {
                    acc[cur] = new cls(cur);
                    return acc;
                  }, {});
                } else {
                  this._id = ids;

                  if (vals) {
                    var old = cls._records[ids] || {};
                    cls._records[ids] = (0, _objectSpread2.default)({}, old, vals);
                  }

                  cls._instances[ids] = this;
                }
              } // only for multi


              (0, _createClass2.default)(cls, [{
                key: "list",
                value: function list() {
                  // only for multi
                  return Object.values(this._instances);
                } // only for multi

              }, {
                key: "byid",
                value: function byid(id) {
                  // only for multi
                  return this._instances[id];
                }
              }, {
                key: "attr",
                // only for single
                value: function attr(_attr) {
                  var flash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                  // only for single
                  var raw = (cls._records[this._id] || {})[_attr];

                  var _ref4 = cls._fields[_attr] || {},
                      type = _ref4.type,
                      relation = _ref4.relation;

                  if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
                    return raw;
                  }

                  return cls.env(relation).then(function (ref_cls) {
                    if (type === 'many2one') {
                      if (flash) {
                        return ref_cls.read(raw[0]);
                      }

                      var _raw = (0, _slicedToArray2.default)(raw, 2),
                          id = _raw[0],
                          name = _raw[1];

                      var vals = {
                        id: id,
                        name: name,
                        display_name: name
                      };
                      var ref_ins = new ref_cls(raw[0], vals);
                      return ref_ins;
                    } else {
                      //  TBD flash=1
                      return ref_cls.read(raw);
                    }
                  });
                }
              }, {
                key: "write",
                value: function () {
                  var _write = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee3(vals) {
                    return _regenerator.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            return _context3.abrupt("return", cls.write(this._id, vals));

                          case 1:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, this);
                  }));

                  return function write(_x6) {
                    return _write.apply(this, arguments);
                  };
                }()
              }, {
                key: "unlink",
                value: function () {
                  var _unlink = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee4(vals) {
                    return _regenerator.default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            return _context4.abrupt("return", cls.unlink(this._id, vals));

                          case 1:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4, this);
                  }));

                  return function unlink(_x7) {
                    return _unlink.apply(this, arguments);
                  };
                }()
              }], [{
                key: "env",
                value: function () {
                  var _env = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee5(relation) {
                    var ref_cls;
                    return _regenerator.default.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return this._env[relation];

                          case 2:
                            ref_cls = _context5.sent;

                            if (ref_cls) {
                              _context5.next = 8;
                              break;
                            }

                            _context5.next = 6;
                            return modelCreator({
                              model: relation,
                              rpc: cls._rpc,
                              env: cls._env
                            });

                          case 6:
                            ref_cls = _context5.sent;
                            this._env[relation] = ref_cls;

                          case 8:
                            return _context5.abrupt("return", ref_cls);

                          case 9:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5, this);
                  }));

                  return function env(_x8) {
                    return _env.apply(this, arguments);
                  };
                }()
              }, {
                key: "call",
                value: function () {
                  var _call = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee6(method) {
                    var args,
                        kwargs,
                        params,
                        data,
                        code,
                        result,
                        _args6 = arguments;
                    return _regenerator.default.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            args = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : [];
                            kwargs = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
                            params = {
                              model: this._name,
                              method: method,
                              args: args,
                              kwargs: kwargs
                            };
                            _context6.next = 5;
                            return this._rpc.call(params);

                          case 5:
                            data = _context6.sent;
                            code = data.code;

                            if (code) {
                              _context6.next = 10;
                              break;
                            }

                            result = data.result;
                            return _context6.abrupt("return", result);

                          case 10:
                            return _context6.abrupt("return", null);

                          case 11:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6, this);
                  }));

                  return function call(_x9) {
                    return _call.apply(this, arguments);
                  };
                }()
              }, {
                key: "list2instance",
                value: function list2instance(result) {
                  var _this = this;

                  var res = result.reduce(function (acc, cur) {
                    acc[cur.id] = new _this(cur.id, cur);
                    return acc;
                  }, {});
                  var ids = Object.keys(res);
                  var instance = new this(ids);
                  return instance;
                }
              }, {
                key: "search",
                value: function () {
                  var _search = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee7(domain) {
                    var fields, data;
                    return _regenerator.default.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            fields = Object.keys(cls._fields);
                            _context7.next = 3;
                            return cls.call('search_read', [domain, fields]);

                          case 3:
                            data = _context7.sent;
                            return _context7.abrupt("return", this.list2instance(data ? data : []));

                          case 5:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7, this);
                  }));

                  return function search(_x10) {
                    return _search.apply(this, arguments);
                  };
                }()
              }, {
                key: "read",
                value: function () {
                  var _read = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee8(ids) {
                    var fields, data0, data, vals;
                    return _regenerator.default.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            fields = Object.keys(cls._fields);
                            _context8.next = 3;
                            return cls.call('read', [ids, fields]);

                          case 3:
                            data0 = _context8.sent;
                            data = data0 ? data0 : [];

                            if (!((0, _typeof2.default)(ids) === 'object')) {
                              _context8.next = 9;
                              break;
                            }

                            return _context8.abrupt("return", this.list2instance(data));

                          case 9:
                            vals = data.length ? data[0] : {};
                            return _context8.abrupt("return", new cls(ids, vals));

                          case 11:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8, this);
                  }));

                  return function read(_x11) {
                    return _read.apply(this, arguments);
                  };
                }()
              }, {
                key: "create",
                value: function () {
                  var _create = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee9(vals) {
                    var data;
                    return _regenerator.default.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            _context9.next = 2;
                            return cls.call('create', [vals]);

                          case 2:
                            data = _context9.sent;

                            if (!data) {
                              _context9.next = 5;
                              break;
                            }

                            return _context9.abrupt("return", cls.read(data));

                          case 5:
                            return _context9.abrupt("return", data);

                          case 6:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9, this);
                  }));

                  return function create(_x12) {
                    return _create.apply(this, arguments);
                  };
                }()
              }, {
                key: "write",
                value: function () {
                  var _write2 = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee10(id, vals) {
                    var data;
                    return _regenerator.default.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            _context10.next = 2;
                            return cls.call('write', [id, vals]);

                          case 2:
                            data = _context10.sent;

                            if (!data) {
                              _context10.next = 5;
                              break;
                            }

                            return _context10.abrupt("return", cls.read(id));

                          case 5:
                            return _context10.abrupt("return", data);

                          case 6:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10, this);
                  }));

                  return function write(_x13, _x14) {
                    return _write2.apply(this, arguments);
                  };
                }()
              }, {
                key: "unlink",
                value: function () {
                  var _unlink2 = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee11(id) {
                    var data;
                    return _regenerator.default.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            _context11.next = 2;
                            return cls.call('unlink', [id]);

                          case 2:
                            data = _context11.sent;

                            if (!data) {
                              _context11.next = 5;
                              break;
                            }

                            return _context11.abrupt("return", data);

                          case 5:
                            return _context11.abrupt("return", data);

                          case 6:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11, this);
                  }));

                  return function unlink(_x15) {
                    return _unlink2.apply(this, arguments);
                  };
                }()
              }]);
              return cls;
            }();

            cls._name = model;
            cls._rpc = rpc;
            cls._env = env;
            cls._fields = fields;
            cls._records = {};
            cls._instances = {};
            Object.defineProperty(cls, 'name', {
              value: model,
              configurable: true
            });
            return _context12.abrupt("return", cls);

          case 15:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function modelCreator(_x5) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = modelCreator;
exports.default = _default;