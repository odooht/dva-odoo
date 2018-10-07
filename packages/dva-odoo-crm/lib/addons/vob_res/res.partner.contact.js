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

var _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator')
);

var _default = function _default(options) {
  var namespace = options.namespace,
    _options$extend = options.extend,
    extend = _options$extend === void 0 ? [] : _options$extend,
    _options$fields = options.fields,
    default_fields = _options$fields === void 0 ? ['name'] : _options$fields;

  var parent = function parent(_ref) {
    var namespace = _ref.namespace;
    return {
      namespace: namespace,
      state: {},
      effects: {
        rename:
          /*#__PURE__*/
          _regenerator.default.mark(function rename(_ref2, _ref3) {
            var payload, call, put, select, fn;
            return _regenerator.default.wrap(
              function rename$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      payload = _ref2.payload;
                      (call = _ref3.call),
                        (put = _ref3.put),
                        (select = _ref3.select);

                      fn = function fn(payload) {
                        var id = payload.id,
                          name = payload.name,
                          _payload$context = payload.context,
                          context =
                            _payload$context === void 0 ? {} : _payload$context;
                        var _context$mock = context.mock,
                          mock =
                            _context$mock === void 0 ? 'rename' : _context$mock;
                        var method = 'write';
                        var args = [
                          id,
                          {
                            name: name,
                          },
                        ];
                        var callback = {
                          type: 'rename_callback',
                          params: payload,
                        };
                        return {
                          method: method,
                          args: args,
                          mock: mock,
                          callback: callback,
                        };
                      };

                      _context.next = 5;
                      return put({
                        type: 'call',
                        payload: fn(payload),
                      });

                    case 5:
                    case 'end':
                      return _context.stop();
                  }
                }
              },
              rename,
              this
            );
          }),
        rename_callback:
          /*#__PURE__*/
          _regenerator.default.mark(function rename_callback(_ref4, _ref5) {
            var payload, call, put, select, _payload$params, id, name, result;

            return _regenerator.default.wrap(
              function rename_callback$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      payload = _ref4.payload;
                      (call = _ref5.call),
                        (put = _ref5.put),
                        (select = _ref5.select);
                      (_payload$params = payload.params),
                        (id = _payload$params.id),
                        (name = _payload$params.name),
                        (result = payload.data);

                      if (!result) {
                        _context2.next = 6;
                        break;
                      }

                      _context2.next = 6;
                      return put({
                        type: 'read',
                        payload: {
                          id: id,
                          fields: default_fields,
                        },
                      });

                    case 6:
                    case 'end':
                      return _context2.stop();
                  }
                }
              },
              rename_callback,
              this
            );
          }),
        search:
          /*#__PURE__*/
          _regenerator.default.mark(function search(_ref6, _ref7) {
            var payload, call, put, select, _payload$domain, domain, dm1;

            return _regenerator.default.wrap(
              function search$(_context3) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      payload = _ref6.payload;
                      (call = _ref7.call),
                        (put = _ref7.put),
                        (select = _ref7.select);
                      (_payload$domain = payload.domain),
                        (domain =
                          _payload$domain === void 0 ? [] : _payload$domain);
                      dm1 = [['type', '=', 'contact']];
                      _context3.next = 6;
                      return put({
                        type: '_search',
                        payload: (0, _objectSpread2.default)({}, payload, {
                          domain: (0, _toConsumableArray2.default)(
                            domain
                          ).concat(dm1),
                        }),
                      });

                    case 6:
                    case 'end':
                      return _context3.stop();
                  }
                }
              },
              search,
              this
            );
          }),
      },
      reducers: {},
    };
  };

  return (0, _objectSpread2.default)({}, options, {
    inherit: 'res.partner',
    extend: [parent].concat((0, _toConsumableArray2.default)(extend)),
  });
};

exports.default = _default;
