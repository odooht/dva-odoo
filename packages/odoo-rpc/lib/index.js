"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _models = _interopRequireDefault(require("../src/models"));

var _rpc = _interopRequireDefault(require("../src/rpc"));

var create_env = function create_env(models, rpc) {
  var env = {};

  for (var mdl in models) {
    var fields = models[mdl];
    env[mdl] = (0, _models.default)({
      model: mdl,
      fields: fields,
      rpc: rpc,
      env: env
    });
  }

  return env;
};

var Odoo =
/*#__PURE__*/
function () {
  function Odoo(options) {
    (0, _classCallCheck2.default)(this, Odoo);
    var host = options.host,
        db = options.db,
        models = options.models;
    var rpc = new _rpc.default({
      host: host,
      db: db
    });
    this._rpc = rpc;
    this._models = models;
    this._env = null;
  }

  (0, _createClass2.default)(Odoo, [{
    key: "login",
    value: function () {
      var _login = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(params) {
        var data;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._rpc.login(params);

              case 2:
                data = _context.sent;

                if (!this._env) {
                  this._env = create_env(this._models, this._rpc);
                }

                return _context.abrupt("return", data);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function login(_x) {
        return _login.apply(this, arguments);
      };
    }()
  }, {
    key: "logout",
    value: function () {
      var _logout = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this._rpc.logout());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function logout() {
        return _logout.apply(this, arguments);
      };
    }()
  }, {
    key: "env",
    value: function () {
      var _env = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(relation) {
        var ref_cls;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._env[relation];

              case 2:
                ref_cls = _context3.sent;

                if (ref_cls) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 6;
                return (0, _models.default)({
                  model: relation,
                  rpc: this._rpc,
                  env: this._env
                });

              case 6:
                ref_cls = _context3.sent;
                this._env[relation] = ref_cls;

              case 8:
                return _context3.abrupt("return", ref_cls);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function env(_x2) {
        return _env.apply(this, arguments);
      };
    }()
  }]);
  return Odoo;
}();

var _default = Odoo;
exports.default = _default;