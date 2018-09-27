"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
*/
function dot2line(model) {
  return model.replace('.', '_');
}

var _default = function _default(options) {
  //const { service } = options;
  return {
    namespace: 'odooData',
    state: {//      res_partner: {1:{id:1,name:'n1'}},
      //      og_igame:    {1:{id:1,name:'n1'}},
    },
    effects: {
      update:
      /*#__PURE__*/
      _regenerator.default.mark(function update(_ref, _ref2) {
        var payload, call, put, select, model, data;
        return _regenerator.default.wrap(function update$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                payload = _ref.payload;
                call = _ref2.call, put = _ref2.put, select = _ref2.select;
                model = payload.model, data = payload.data;
                _context.next = 5;
                return put({
                  type: 'save',
                  payload: (0, _defineProperty2.default)({}, dot2line(model), data)
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, update, this);
      })
    },
    reducers: {
      remove: function remove(state, _ref3) {
        var payload = _ref3.payload;
        var model = payload.model,
            id = payload.id;
        var model2 = dot2line(model);
        var data = (0, _objectSpread3.default)({}, state[model2]);
        delete data[id];
        return (0, _objectSpread3.default)({}, state, (0, _defineProperty2.default)({}, model2, data));
      },
      save: function save(state, _ref4) {
        var payload = _ref4.payload;
        //        console.log( payload )
        //          console.log('model=',model)
        //          console.log('old_records=',old_records)
        //            console.log('id=',id)
        //            console.log('rec=',rec)
        //            console.log('old_rec=',old_rec)
        //            console.log('old_rec=',old_rec)
        //        console.log( new_state.res_partner )
        var new_state = {};

        for (var model in payload) {
          var new_records = {};
          var old_records = state[model] ? state[model] : {};
          var records = payload[model];

          for (var id in records) {
            var rec = records[id];
            var old_rec = old_records[id] ? old_records[id] : {};
            var new_rec = (0, _objectSpread3.default)({}, old_rec, rec);
            new_records[id] = new_rec;
          }

          new_state[model] = (0, _objectSpread3.default)({}, old_records, new_records);
        }

        return (0, _objectSpread3.default)({}, state, new_state);
      }
    }
  };
};

exports.default = _default;