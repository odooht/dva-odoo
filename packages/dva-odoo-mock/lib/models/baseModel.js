"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var my_records = {
  1: {
    id: 1,
    name: 'n1'
  },
  2: {
    id: 2,
    name: 'n2'
  },
  3: {
    id: 3,
    name: 'n3'
  }
};

var str2int = function str2int(ids) {
  var res = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var id = _step.value;
      res.push(parseInt(id));
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

  return res;
};

var _default = function _default(records0) {
  var records = records0 ? records0 : my_records;
  return {
    searchAll: function searchAll(domain, kwargs) {
      var ids = Object.keys(records);
      return str2int(ids);
    },
    read: function read(id, fields) {
      return [records[id]];
    },
    multiRead: function multiRead(id, fields) {
      var res = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = id[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var ii = _step2.value;
          res.push(records[ii]);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return res;
    },
    nameCreate: function nameCreate(name) {
      var ids1 = Object.keys(records).map(function (i) {
        return parseInt(i);
      });
      var ids = ids1.length ? ids1 : [0];
      var id = Math.max.apply(Math, (0, _toConsumableArray2.default)(ids)) + 1;
      records[id] = {
        id: id,
        name: name
      };
      return [id, name];
    },
    create: function create(vals) {
      var name = vals.name;
      var ids1 = Object.keys(records).map(function (i) {
        return parseInt(i);
      });
      var ids = ids1.length ? ids1 : [0];
      var id = Math.max.apply(Math, (0, _toConsumableArray2.default)(ids)) + 1;
      records[id] = {
        id: id,
        name: name
      };
      return id;
    },
    write: function write(id, vals) {
      return 1;
    },
    unlink: function unlink(id) {
      if (id) {
        delete records[id];
        return 1;
      } else {
        return 0;
      }
    }
  };
};

exports.default = _default;