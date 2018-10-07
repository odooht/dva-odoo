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

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator')
);

var _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator')
);

var dvaModel = function dvaModel(_ref) {
  var namespace = _ref.namespace,
    model = _ref.model,
    api = _ref.api;
  return {
    namespace: namespace,
    state: {},
    effects: {
      rename:
        /*#__PURE__*/
        _regenerator.default.mark(function rename(_ref2, _ref3) {
          var payload,
            call,
            put,
            select,
            token,
            response,
            result,
            error,
            id,
            name;
          return _regenerator.default.wrap(
            function rename$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    payload = _ref2.payload;
                    (call = _ref3.call),
                      (put = _ref3.put),
                      (select = _ref3.select);
                    _context.next = 4;
                    return select(function(state) {
                      return state.login.sid;
                    });

                  case 4:
                    token = _context.sent;
                    _context.next = 7;
                    return api.rename(token, payload);

                  case 7:
                    response = _context.sent;
                    (result = response.result), (error = response.error);

                    if (!result) {
                      _context.next = 13;
                      break;
                    }

                    (id = payload.id), (name = payload.name);
                    _context.next = 13;
                    return put({
                      type: 'odooData/update',
                      payload: {
                        model: model,
                        data: [
                          {
                            id: id,
                            name: name,
                          },
                        ],
                      },
                    });

                  case 13:
                  case 'end':
                    return _context.stop();
                }
              }
            },
            rename,
            this
          );
        }),
    },
    reducers: {},
  };
};

var odooApi = function odooApi(options) {
  var model = options.model,
    namespace = options.namespace,
    _options$fields = options.fields,
    default_fields = _options$fields === void 0 ? ['name'] : _options$fields,
    odooCall = options.odooCall,
    api = options.api;

  var searchRead =
    /*#__PURE__*/
    (function() {
      var _ref4 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(token, params) {
          var _params$domain, domain, dm1;

          return _regenerator.default.wrap(
            function _callee$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    (_params$domain = params.domain),
                      (domain =
                        _params$domain === void 0 ? [] : _params$domain);
                    dm1 = [['type', '=', 'contact']];
                    return _context2.abrupt(
                      'return',
                      api.searchRead(
                        token,
                        (0, _objectSpread2.default)({}, params, {
                          domain: (0, _toConsumableArray2.default)(
                            domain
                          ).concat(dm1),
                        })
                      )
                    );

                  case 3:
                  case 'end':
                    return _context2.stop();
                }
              }
            },
            _callee,
            this
          );
        })
      );

      return function searchRead(_x, _x2) {
        return _ref4.apply(this, arguments);
      };
    })();

  var rename =
    /*#__PURE__*/
    (function() {
      var _ref5 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee2(token, params) {
          var id, name, response, result, error;
          return _regenerator.default.wrap(
            function _callee2$(_context3) {
              while (1) {
                switch ((_context3.prev = _context3.next)) {
                  case 0:
                    (id = params.id), (name = params.name);
                    _context3.next = 3;
                    return api.write(token, {
                      model: model,
                      id: id,
                      vals: {
                        name: name,
                      },
                      context: {
                        mock: 'rename',
                      },
                    });

                  case 3:
                    response = _context3.sent;
                    (result = response.result), (error = response.error);
                    return _context3.abrupt('return', {
                      result: result,
                      error: error,
                    });

                  case 6:
                  case 'end':
                    return _context3.stop();
                }
              }
            },
            _callee2,
            this
          );
        })
      );

      return function rename(_x3, _x4) {
        return _ref5.apply(this, arguments);
      };
    })();

  var rename2 =
    /*#__PURE__*/
    (function() {
      var _ref6 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee3(token, params) {
          var id, name, response, result, error;
          return _regenerator.default.wrap(
            function _callee3$(_context4) {
              while (1) {
                switch ((_context4.prev = _context4.next)) {
                  case 0:
                    (id = params.id), (name = params.name);
                    _context4.next = 3;
                    return api.write(token, {
                      model: model,
                      id: id,
                      vals: {
                        name: name,
                      }, // context: {mock:'rename'}
                    });

                  case 3:
                    response = _context4.sent;
                    (result = response.result), (error = response.error);
                    return _context4.abrupt('return', {
                      result: result,
                      error: error,
                    });

                  case 6:
                  case 'end':
                    return _context4.stop();
                }
              }
            },
            _callee3,
            this
          );
        })
      );

      return function rename2(_x5, _x6) {
        return _ref6.apply(this, arguments);
      };
    })();

  return {
    rename: rename,
    searchRead: searchRead,
  };
};

var _default = function _default(child) {
  var _child$apis = child.apis,
    apis = _child$apis === void 0 ? [] : _child$apis,
    _child$extend = child.extend,
    extend = _child$extend === void 0 ? [] : _child$extend;
  return (0, _objectSpread2.default)({}, child, {
    inherit: 'res.partner',
    apis: [odooApi].concat((0, _toConsumableArray2.default)(apis)),
    extend: [dvaModel].concat((0, _toConsumableArray2.default)(extend)),
  });
};

exports.default = _default;
