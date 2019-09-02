"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventModel = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// represent a event in dva model
var uid = 0;

var EventModel =
/*#__PURE__*/
function () {
  function EventModel(value) {
    _classCallCheck(this, EventModel);

    this.id = uid++;
    this.value = value;
  }

  _createClass(EventModel, [{
    key: "equalsTo",
    value: function equalsTo(em) {
      return EventModel.equalsTo(this, em);
    }
  }]);

  return EventModel;
}();

exports.EventModel = EventModel;

EventModel.equalsTo = function (e1, e2) {
  return !!e2 ? e1.id === e2.id && e1.value === e2.value : false;
};