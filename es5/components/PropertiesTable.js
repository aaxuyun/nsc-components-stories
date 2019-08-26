"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropertiesTableForEntity = exports.PropertiesTableGroup = exports["default"] = void 0;

require("antd/lib/table/style");

var _table = _interopRequireDefault(require("antd/lib/table"));

var _react = _interopRequireWildcard(require("react"));

var _lodash = require("lodash");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * props.properties   [] | {}
 * props.omit
 * props.pick
 * props.labelMapping { [key]: [label] }
 * props.pickWithLabelMapping   default as true
 * antd.Table props
 */
var PropertiesTable =
/*#__PURE__*/
function (_Component) {
  _inherits(PropertiesTable, _Component);

  function PropertiesTable() {
    _classCallCheck(this, PropertiesTable);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertiesTable).apply(this, arguments));
  }

  _createClass(PropertiesTable, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$propertie = _this$props.properties,
          properties = _this$props$propertie === void 0 ? [] : _this$props$propertie,
          omit = _this$props.omit,
          pick = _this$props.pick,
          labelMapping = _this$props.labelMapping,
          _this$props$pickWithL = _this$props.pickWithLabelMapping,
          pickWithLabelMapping = _this$props$pickWithL === void 0 ? true : _this$props$pickWithL,
          _this$props$size = _this$props.size,
          size = _this$props$size === void 0 ? 'small' : _this$props$size,
          _this$props$paginatio = _this$props.pagination,
          pagination = _this$props$paginatio === void 0 ? false : _this$props$paginatio,
          _this$props$bordered = _this$props.bordered,
          bordered = _this$props$bordered === void 0 ? true : _this$props$bordered,
          restProps = _objectWithoutProperties(_this$props, ["properties", "omit", "pick", "labelMapping", "pickWithLabelMapping", "size", "pagination", "bordered"]);

      var columns = [{
        title: '属性名',
        dataIndex: 'name',
        width: '30%'
      }, {
        title: '属性值',
        dataIndex: 'value'
      }];
      return _react["default"].createElement(_table["default"], _extends({
        rowKey: function rowKey(r) {
          return r.name;
        },
        columns: columns,
        dataSource: transformProperties(properties, pick, omit, labelMapping, pickWithLabelMapping),
        pagination: pagination,
        size: size,
        bordered: bordered
      }, restProps));
    }
  }]);

  return PropertiesTable;
}(_react.Component);

exports["default"] = PropertiesTable;

var transformProperties = function transformProperties(properties) {
  var picks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var omits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var labelMapping = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var pickWithLabelMapping = arguments.length > 4 ? arguments[4] : undefined;

  // merge picks with labelMapping
  if (pickWithLabelMapping) {
    picks = [].concat(_toConsumableArray(picks), _toConsumableArray(Object.keys(labelMapping)));
  }

  if ((0, _lodash.isArray)(properties)) {
    return properties.filter(function (p) {
      return picks.includes(p.name);
    }).filter(function (p) {
      return !omits.includes(p.name);
    });
  } else {
    // object
    // picks = [] would pick nothing
    var keys = Object.keys(properties);

    if (!picks || picks.length === 0) {
      picks = keys;
    }

    return Object.keys((0, _lodash.omit)((0, _lodash.pick)(properties, picks), omits)).map(function (key) {
      return {
        name: labelMapping[key] ? labelMapping[key] : key,
        value: properties[key]
      };
    });
  }
};
/**
 * props.propertiesGroup
 * props.titleFieldName
 * ...PropertiesTable.props
 */


var PropertiesTableGroup = function PropertiesTableGroup(props) {
  var _props$propertiesGrou = props.propertiesGroup,
      propertiesGroup = _props$propertiesGrou === void 0 ? [] : _props$propertiesGrou,
      _title = props.title,
      rest = _objectWithoutProperties(props, ["propertiesGroup", "title"]);

  return _react["default"].createElement("div", null, propertiesGroup.map(function (properties, index) {
    return _react["default"].createElement("div", {
      style: {
        marginBottom: 20
      },
      key: index
    }, _react["default"].createElement(PropertiesTable, _extends({
      properties: properties,
      title: function title() {
        return _title(properties);
      }
    }, rest)));
  }));
};
/**
 * A quick PropertiesTable for form entities
 *
 * props.entity
 * props.schema           form schema of the entity
 * props.idToNameMapping
 */


exports.PropertiesTableGroup = PropertiesTableGroup;

var PropertiesTableForEntity =
/*#__PURE__*/
function (_Component2) {
  _inherits(PropertiesTableForEntity, _Component2);

  function PropertiesTableForEntity() {
    _classCallCheck(this, PropertiesTableForEntity);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertiesTableForEntity).apply(this, arguments));
  }

  _createClass(PropertiesTableForEntity, [{
    key: "_labelMapping",
    value: function _labelMapping() {
      var _this$props2 = this.props,
          schema = _this$props2.schema,
          _this$props2$idToName = _this$props2.idToNameMapping,
          idToNameMapping = _this$props2$idToName === void 0 ? {} : _this$props2$idToName;
      var labelMapping = {};
      Object.keys(schema).forEach(function (p) {
        if (p in idToNameMapping) {
          labelMapping[idToNameMapping[p]] = schema[p].text;
        } else {
          labelMapping[p] = schema[p].text;
        }
      });
      return labelMapping;
    }
  }, {
    key: "_transform",
    value: function _transform() {
      var _this$props3 = this.props,
          schema = _this$props3.schema,
          entity = _this$props3.entity;
      var r = Object.assign({}, entity);
      /* Object.keys(r).forEach(key => {
        const field = schema[key]
        if (field && field.cvt && CVT[field.cvt]) {
          r[key] = getCVTLabel(CVT[field.cvt], entity[key])
        }
      }) */

      return r;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          entity = _this$props4.entity,
          schema = _this$props4.schema,
          idToNameMapping = _this$props4.idToNameMapping,
          rest = _objectWithoutProperties(_this$props4, ["entity", "schema", "idToNameMapping"]);

      return _react["default"].createElement(PropertiesTable, _extends({
        properties: this._transform(),
        labelMapping: this._labelMapping()
      }, rest));
    }
  }]);

  return PropertiesTableForEntity;
}(_react.Component);

exports.PropertiesTableForEntity = PropertiesTableForEntity;