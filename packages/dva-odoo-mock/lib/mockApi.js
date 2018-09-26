"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _baseModel = _interopRequireDefault(require("./models/baseModel"));

var jsonrpc = function jsonrpc(result) {
  return {
    jsonrpc: 2.0,
    id: 1,
    result: result
  };
};

function jsonApi(params, models) {
  var _params$params = params.params,
      args = _params$params.args,
      kwargs = _params$params.kwargs;
  var _kwargs$context = kwargs.context,
      context = _kwargs$context === void 0 ? {} : _kwargs$context;
  var mock_react_api = context.mock_react_api;

  var _mock_react_api$split = mock_react_api.split('/'),
      _mock_react_api$split2 = (0, _slicedToArray2.default)(_mock_react_api$split, 2),
      model = _mock_react_api$split2[0],
      method = _mock_react_api$split2[1];

  var mock_model0 = models[model];
  var mock_model = mock_model0 ? mock_model0 : (0, _baseModel.default)(); //    console.log('mock,', model, mock_model, method )

  var res = mock_model[method].apply(mock_model, (0, _toConsumableArray2.default)(args).concat([kwargs]));
  return jsonrpc(res);
}

function jsonUserLogin(params, loginUsers) {
  var _params$params2 = params.params,
      password = _params$params2.password,
      login = _params$params2.login,
      type = _params$params2.type;
  var user = loginUsers[login];

  if (user) {
    var psw = user.password,
        _user$sid = user.sid,
        sid = _user$sid === void 0 ? '' : _user$sid,
        _user$uid = user.uid,
        uid = _user$uid === void 0 ? 0 : _user$uid,
        _user$name = user.name,
        name = _user$name === void 0 ? '' : _user$name;

    if (password === psw) {
      return jsonrpc({
        sid: sid,
        name: name,
        uid: uid,
        status: 'ok'
      });
    }
  }

  return jsonrpc({
    status: 'error'
  });
}

var _default = {
  jsonApi: jsonApi,
  jsonUserLogin: jsonUserLogin
};
exports.default = _default;