function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactRouterDom = require('react-router-dom');
var reactI18next = require('react-i18next');
var reactDateRange = require('react-date-range');
var dateFns = require('date-fns');
var locale = require('date-fns/locale');
var jsApiLoader = require('@googlemaps/js-api-loader');
var isEqual = _interopDefault(require('lodash/isEqual'));
var reactTable = require('react-table');
var reactHookForm = require('react-hook-form');
var _ = _interopDefault(require('lodash'));
var yup = require('@hookform/resolvers/yup');
var jsonSchemaToYup = require('json-schema-to-yup');
var digitUiSvgComponents = require('@egovernments/digit-ui-svg-components');

var ActionBar = function ActionBar(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "action-bar-wrap " + props.className,
    style: props.style
  }, props.children);
};

var ActionLinks = function ActionLinks(props) {
  return /*#__PURE__*/React__default.createElement("span", {
    className: "action-link"
  }, props.children);
};

var AppContainer = function AppContainer(props) {
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "app-container " + (props.className ? props.className : ""),
    style: props.style
  }, props.children));
};

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure " + obj);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var ApplyFilterBar = function ApplyFilterBar(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React__default.createElement("button", {
    type: props.submit ? "submit" : "button",
    style: _extends({}, props.style),
    className: "button-clear",
    onClick: props.onClear
  }, /*#__PURE__*/React__default.createElement("header", null, props.labelLink)), /*#__PURE__*/React__default.createElement("button", {
    className: "submit-bar",
    type: props.submit ? "submit" : "button",
    style: _extends({}, props.style),
    onClick: props.onSubmit
  }, /*#__PURE__*/React__default.createElement("header", null, props.buttonLink)));
};

var CreateEstimateIcon = function CreateEstimateIcon(_ref) {
  var className = _ref.className,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style,
    _ref$fill = _ref.fill,
    fill = _ref$fill === void 0 ? "#F47738" : _ref$fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    className: className,
    style: style,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M14 8.75C14.6125 8.75 15.1987 8.86375 15.75 9.05625V5.25L10.5 0H1.75C0.77875 0 0 0.77875 0 1.75V14C0 14.9712 0.7875 15.75 1.75 15.75H9.05625C8.86375 15.1987 8.75 14.6125 8.75 14C8.75 11.1037 11.1037 8.75 14 8.75ZM9.625 1.3125L14.4375 6.125H9.625V1.3125ZM17.5 13.125V14.875H14.875V17.5H13.125V14.875H10.5V13.125H13.125V10.5H14.875V13.125H17.5Z",
    fill: fill
  }));
};
var GotoInboxIcon = function GotoInboxIcon(_ref2) {
  var className = _ref2.className,
    _ref2$style = _ref2.style,
    style = _ref2$style === void 0 ? {} : _ref2$style,
    _ref2$fill = _ref2.fill,
    fill = _ref2$fill === void 0 ? "#F47738" : _ref2$fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "15",
    height: "13",
    viewBox: "0 0 15 13",
    fill: "none",
    className: className,
    style: style,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M2.14286 6.5C2.14286 2.91056 5.02143 0 8.57143 0C12.1214 0 15 2.91056 15 6.5C15 10.0894 12.1214 13 8.57143 13C7.1 13 5.74286 12.4944 4.65714 11.6567L5.67143 10.6167C6.49286 11.2017 7.49286 11.5556 8.57143 11.5556C11.3357 11.5556 13.5714 9.295 13.5714 6.5C13.5714 3.705 11.3357 1.44444 8.57143 1.44444C5.80714 1.44444 3.57143 3.705 3.57143 6.5H5.71429L2.85714 9.38889L0 6.5H2.14286Z",
    fill: fill
  }));
};
var ArrowLeft = function ArrowLeft(_ref3) {
  var className = _ref3.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "black",
    className: className,
    width: "19px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M24 0v24H0V0h24z",
    fill: "none",
    opacity: ".87"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M14 7l-5 5 5 5V7z"
  }));
};
var ArrowLeftWhite = function ArrowLeftWhite(_ref4) {
  var className = _ref4.className,
    _ref4$fill = _ref4.fill,
    fill = _ref4$fill === void 0 ? "white" : _ref4$fill,
    _ref4$style = _ref4.style,
    style = _ref4$style === void 0 ? {} : _ref4$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: className,
    fill: "none",
    style: style,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z",
    fill: fill
  }));
};
var PrivacyMaskIcon = function PrivacyMaskIcon(_ref5) {
  var className = _ref5.className,
    _ref5$style = _ref5.style,
    style = _ref5$style === void 0 ? {} : _ref5$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "22",
    height: "15",
    viewBox: "0 0 22 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    style: style
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0ZM11 12.5C8.24 12.5 6 10.26 6 7.5C6 4.74 8.24 2.5 11 2.5C13.76 2.5 16 4.74 16 7.5C16 10.26 13.76 12.5 11 12.5ZM11 4.5C9.34 4.5 8 5.84 8 7.5C8 9.16 9.34 10.5 11 10.5C12.66 10.5 14 9.16 14 7.5C14 5.84 12.66 4.5 11 4.5Z",
    fill: "#EEEEEE"
  }));
};
var ArrowDown = function ArrowDown(_ref6) {
  var className = _ref6.className,
    onClick = _ref6.onClick,
    styles = _ref6.styles,
    disable = _ref6.disable;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: disable ? "#9E9E9E" : "black",
    className: className,
    onClick: onClick,
    width: "18px",
    height: "18px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M7 10l5 5 5-5H7z"
  }));
};
var ArrowBack = function ArrowBack(_ref7) {
  var className = _ref7.className,
    onClick = _ref7.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "black",
    className: className,
    onClick: onClick,
    width: "18px",
    height: "18px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"
  }));
};
var ArrowForward = function ArrowForward(_ref8) {
  var className = _ref8.className,
    onClick = _ref8.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "black",
    className: className,
    onClick: onClick,
    width: "18px",
    height: "18px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"
  }));
};
var ArrowToFirst = function ArrowToFirst(_ref9) {
  var className = _ref9.className,
    onClick = _ref9.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "18px",
    height: "18px",
    viewBox: "0 0 13 12",
    fill: "black",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M12.41 10.59L7.82 6L12.41 1.41L11 0L5 6L11 12L12.41 10.59ZM0 0H2V12H0V0Z",
    fill: "#505a5f"
  }));
};
var ArrowToLast = function ArrowToLast(_ref10) {
  var className = _ref10.className,
    onClick = _ref10.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "18px",
    height: "18px",
    viewBox: "0 0 13 12",
    fill: "black",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.589844 1.41L5.17984 6L0.589844 10.59L1.99984 12L7.99984 6L1.99984 0L0.589844 1.41ZM10.9998 0H12.9998V12H10.9998V0Z",
    fill: "#505a5f"
  }));
};
var DownloadPrefixIcon = function DownloadPrefixIcon(_ref11) {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"
  }));
};
var CameraSvg = function CameraSvg(_ref12) {
  var className = _ref12.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    className: className,
    viewBox: "0 0 24 24",
    fill: "black",
    width: "46px",
    height: "42px"
  }, /*#__PURE__*/React__default.createElement("rect", {
    fill: "none",
    height: "24",
    width: "24"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M3,4V1h2v3h3v2H5v3H3V6H0V4H3z M6,10V7h3V4h7l1.83,2H21c1.1,0,2,0.9,2,2v12c0,1.1-0.9,2-2,2H5c-1.1,0-2-0.9-2-2V10H6z M13,19c2.76,0,5-2.24,5-5s-2.24-5-5-5s-5,2.24-5,5S10.24,19,13,19z M9.8,14c0,1.77,1.43,3.2,3.2,3.2s3.2-1.43,3.2-3.2 s-1.43-3.2-3.2-3.2S9.8,12.23,9.8,14z"
  }));
};
var DeleteBtn = function DeleteBtn(_ref13) {
  var className = _ref13.className,
    onClick = _ref13.onClick,
    fill = _ref13.fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "white",
    className: className,
    onClick: onClick,
    width: "18px",
    height: "18px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: fill
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
  }));
};
var SuccessSvg = function SuccessSvg(_ref14) {
  var className = _ref14.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#00703C",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
  }));
};
var ErrorSvg = function ErrorSvg(_ref15) {
  var className = _ref15.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#d4351c",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "2"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M10 3h4v12h-4z"
  }));
};
var StarFilled = function StarFilled(_ref16) {
  var className = _ref16.className,
    id = _ref16.id,
    onClick = _ref16.onClick,
    styles = _ref16.styles,
    _ref16$percentage = _ref16.percentage,
    percentage = _ref16$percentage === void 0 ? 100 : _ref16$percentage;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    className: className,
    style: styles,
    onClick: onClick,
    viewBox: "0 0 24 24",
    fill: "#F47738",
    width: "48px",
    height: "48px"
  }, /*#__PURE__*/React__default.createElement("linearGradient", {
    id: id,
    x1: "0",
    x2: "1",
    y1: "0",
    y2: "0"
  }, /*#__PURE__*/React__default.createElement("stop", {
    offset: "0%",
    stopColor: "#F47738",
    stopOpacity: 1
  }), /*#__PURE__*/React__default.createElement("stop", {
    offset: percentage + "%",
    stopColor: "#F47738",
    stopOpacity: 1
  }), /*#__PURE__*/React__default.createElement("stop", {
    offset: percentage + "%",
    stopColor: "white",
    stopOpacity: 0
  })), /*#__PURE__*/React__default.createElement("g", null, /*#__PURE__*/React__default.createElement("path", {
    d: "M0,0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M0,0h24v24H0V0z",
    fill: "none"
  })), /*#__PURE__*/React__default.createElement("g", null, /*#__PURE__*/React__default.createElement("path", {
    d: "M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z",
    fill: "url(#" + id + ")",
    stroke: "#F47738",
    strokeWidth: 1
  })));
};
var StarEmpty = function StarEmpty(_ref17) {
  var className = _ref17.className,
    onClick = _ref17.onClick,
    styles = _ref17.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#F47738",
    className: className,
    style: styles,
    width: "48px",
    height: "48px",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z",
    strokeWidth: 1
  }));
};
var DownloadImgIcon = function DownloadImgIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "14",
    height: "17",
    viewBox: "0 0 14 17",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M14 6H10V0H4V6H0L7 13L14 6ZM0 15V17H14V15H0Z",
    fill: "#F47738"
  }));
};
var PrevIcon = function PrevIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "8",
    height: "12",
    viewBox: "0 0 8 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M1.99997 0L0.589966 1.41L5.16997 6L0.589966 10.59L1.99997 12L7.99997 6L1.99997 0Z",
    fill: "#0B0C0C"
  }));
};
var ViewsIcon = function ViewsIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "22",
    height: "16",
    viewBox: "0 0 22 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z",
    fill: "#F47738"
  }));
};
var DocumentIcon = function DocumentIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "100",
    height: "100",
    viewBox: "0 0 18 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM11 14H4V12H11V14ZM14 10H4V8H14V10ZM14 6H4V4H14V6Z",
    fill: "#F47738"
  }));
};
var DocumentIconSolid = function DocumentIconSolid() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 0 24 24",
    width: "24px",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"
  }));
};
var SurveyIconSolid = function SurveyIconSolid() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 0 24 24",
    width: "24px",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M11 7h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zM20.1 3H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM19 19H5V5h14v14z"
  }));
};
var PMBIcon = function PMBIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "32",
    height: "16",
    viewBox: "0 0 32 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M16 9C18.1733 9 20.0933 9.52 21.6533 10.2C23.0933 10.84 24 12.28 24 13.84V16H8V13.8533C8 12.28 8.90667 10.84 10.3467 10.2133C11.9067 9.52 13.8267 9 16 9ZM5.33333 9.33333C6.8 9.33333 8 8.13333 8 6.66667C8 5.2 6.8 4 5.33333 4C3.86667 4 2.66667 5.2 2.66667 6.66667C2.66667 8.13333 3.86667 9.33333 5.33333 9.33333ZM6.84 10.8C6.34667 10.72 5.85333 10.6667 5.33333 10.6667C4.01333 10.6667 2.76 10.9467 1.62667 11.44C0.64 11.8667 0 12.8267 0 13.9067V16H6V13.8533C6 12.7467 6.30667 11.7067 6.84 10.8ZM26.6667 9.33333C28.1333 9.33333 29.3333 8.13333 29.3333 6.66667C29.3333 5.2 28.1333 4 26.6667 4C25.2 4 24 5.2 24 6.66667C24 8.13333 25.2 9.33333 26.6667 9.33333ZM32 13.9067C32 12.8267 31.36 11.8667 30.3733 11.44C29.24 10.9467 27.9867 10.6667 26.6667 10.6667C26.1467 10.6667 25.6533 10.72 25.16 10.8C25.6933 11.7067 26 12.7467 26 13.8533V16H32V13.9067ZM16 0C18.2133 0 20 1.78667 20 4C20 6.21333 18.2133 8 16 8C13.7867 8 12 6.21333 12 4C12 1.78667 13.7867 0 16 0Z",
    fill: "#F47738"
  }));
};
var PMBIconSolid = function PMBIconSolid() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    height: "24px",
    viewBox: "0 0 24 24",
    width: "24px",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React__default.createElement("g", null, /*#__PURE__*/React__default.createElement("rect", {
    fill: "none",
    height: "24",
    width: "24"
  })), /*#__PURE__*/React__default.createElement("path", {
    d: "M18,11c0,0.67,0,1.33,0,2c1.2,0,2.76,0,4,0c0-0.67,0-1.33,0-2C20.76,11,19.2,11,18,11z"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M16,17.61c0.96,0.71,2.21,1.65,3.2,2.39c0.4-0.53,0.8-1.07,1.2-1.6c-0.99-0.74-2.24-1.68-3.2-2.4 C16.8,16.54,16.4,17.08,16,17.61z"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20.4,5.6C20,5.07,19.6,4.53,19.2,4c-0.99,0.74-2.24,1.68-3.2,2.4c0.4,0.53,0.8,1.07,1.2,1.6 C18.16,7.28,19.41,6.35,20.4,5.6z"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M4,9c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h1v4h2v-4h1l5,3V6L8,9H4z M9.03,10.71L11,9.53v4.94l-1.97-1.18L8.55,13H8H4v-2h4 h0.55L9.03,10.71z"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M15.5,12c0-1.33-0.58-2.53-1.5-3.35v6.69C14.92,14.53,15.5,13.33,15.5,12z"
  }));
};
var EventsIconSolid = function EventsIconSolid() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 0 24 24",
    width: "24px",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zm-2 5h-5v5h5v-5z"
  }));
};
var DustbinIcon = function DustbinIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "14",
    height: "18",
    viewBox: "0 0 14 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z",
    fill: "#F47738"
  }));
};
var ImageIcon = function ImageIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 0 24 24",
    width: "24px",
    fill: "#000000"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"
  }));
};
var DocumentSVG = function DocumentSVG() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "80",
    height: "80",
    viewBox: "0 0 80 80",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M46.6667 6.6665H20C16.3334 6.6665 13.3667 9.6665 13.3667 13.3332L13.3334 66.6665C13.3334 70.3332 16.3 73.3332 19.9667 73.3332H60C63.6667 73.3332 66.6667 70.3332 66.6667 66.6665V26.6665L46.6667 6.6665ZM53.3334 59.9998H26.6667V53.3332H53.3334V59.9998ZM53.3334 46.6665H26.6667V39.9998H53.3334V46.6665ZM43.3334 29.9998V11.6665L61.6667 29.9998H43.3334Z",
    fill: "#505A5F"
  }));
};
var PDFSvg = function PDFSvg(_ref18) {
  var className = _ref18.className,
    _ref18$width = _ref18.width,
    width = _ref18$width === void 0 ? 80 : _ref18$width,
    _ref18$height = _ref18.height,
    height = _ref18$height === void 0 ? 80 : _ref18$height,
    _ref18$style = _ref18.style,
    style = _ref18$style === void 0 ? {
      background: "#f6f6f6",
      padding: "8px",
      boxShadow: "0px 2px 0px #d6d5d3",
      borderRadius: "4px"
    } : _ref18$style,
    _ref18$viewBox = _ref18.viewBox,
    viewBox = _ref18$viewBox === void 0 ? "0 0 80 80" : _ref18$viewBox;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    width: width,
    height: height,
    style: style,
    viewBox: viewBox,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M46.6667 6.6665H20C16.3334 6.6665 13.3667 9.6665 13.3667 13.3332L13.3334 66.6665C13.3334 70.3332 16.3 73.3332 19.9667 73.3332H60C63.6667 73.3332 66.6667 70.3332 66.6667 66.6665V26.6665L46.6667 6.6665ZM53.3334 59.9998H26.6667V53.3332H53.3334V59.9998ZM53.3334 46.6665H26.6667V39.9998H53.3334V46.6665ZM43.3334 29.9998V11.6665L61.6667 29.9998H43.3334Z",
    fill: "#505A5F"
  }));
};
var SearchIconSvg = function SearchIconSvg(_ref19) {
  var className = _ref19.className,
    onClick = _ref19.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#f47738",
    className: className,
    width: "24px",
    height: "24px",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
  }));
};
var CheckSvg = function CheckSvg(_ref20) {
  var className = _ref20.className,
    _ref20$style = _ref20.style,
    style = _ref20$style === void 0 ? {} : _ref20$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#F47738",
    className: className,
    style: style
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
  }));
};
var RoundedCheck = function RoundedCheck(_ref21) {
  var className = _ref21.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"
  }));
};
var Calender = function Calender(_ref22) {
  var className = _ref22.className,
    onClick = _ref22.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "black",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
  }));
};
var Phone = function Phone(_ref23) {
  var className = _ref23.className,
    fillcolor = _ref23.fillcolor,
    style = _ref23.style;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: fillcolor ? fillcolor : "#f47738",
    viewBox: "0 0 24 24",
    style: style ? style : {},
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
  }));
};
var FilterSvg = function FilterSvg(_ref24) {
  var className = _ref24.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "#f47738",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
  }));
};
var SortSvg = function SortSvg(_ref25) {
  var className = _ref25.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "16",
    viewBox: "0 0 24 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8 16H24V13.3333H8V16ZM0 0V2.66667H24V0H0ZM8 9.33333H24V6.66667H8V9.33333Z",
    fill: "#505A5F"
  }));
};
var Close = function Close(_ref26) {
  var className = _ref26.className,
    style = _ref26.style;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, style),
    focusable: "false",
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    width: "24",
    height: "24",
    fill: "#9E9E9E",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
  }));
};
var GetApp = function GetApp(_ref28) {
  var className = _ref28.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "#f47738",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
  }));
};
var HamburgerIcon = function HamburgerIcon(_ref29) {
  var styles = _ref29.styles,
    _ref29$color = _ref29.color,
    color = _ref29$color === void 0 ? "#fdfdfd" : _ref29$color;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    width: "24",
    height: "24",
    focusable: "false",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    fill: color
  }));
};
var HomeIcon = function HomeIcon(_ref30) {
  var className = _ref30.className,
    styles = _ref30.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    viewBox: "0 0 24 24",
    style: _extends({}, styles)
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
  }));
};
var LanguageIcon = function LanguageIcon(_ref31) {
  var className = _ref31.className,
    styles = _ref31.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    viewBox: "0 0 24 24",
    style: _extends({}, styles)
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
  }));
};
var LogoutIcon = function LogoutIcon(_ref32) {
  var className = _ref32.className,
    styles = _ref32.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    viewBox: "0 0 24 24",
    style: _extends({}, styles)
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
  }));
};
var SortDown = function SortDown(style) {
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({
      display: "inline-block",
      height: "16px"
    }, style),
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("rect", {
    fill: "none",
    height: "24",
    width: "24"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19,15l-1.41-1.41L13,18.17V2H11v16.17l-4.59-4.59L5,15l7,7L19,15z"
  }));
};
var SortUp = function SortUp(style) {
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({
      display: "inline-block",
      height: "16px"
    }, style),
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("rect", {
    fill: "none",
    height: "24",
    width: "24"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M5,9l1.41,1.41L11,5.83V22H13V5.83l4.59,4.59L19,9l-7-7L5,9z"
  }));
};
var ArrowRightInbox = function ArrowRightInbox(_ref33) {
  var style = _ref33.style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "14",
    viewBox: "0 0 20 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: style
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13 0L11.59 1.41L16.17 6H0V8H16.17L11.58 12.59L13 14L20 7L13 0Z",
    fill: "#F47738"
  }));
};
var ShippingTruck = function ShippingTruck(_ref34) {
  var className = _ref34.className,
    styles = _ref34.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
  }));
};
function CloseSvg(_ref35) {
  var onClick = _ref35.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
  }));
}
var UpwardArrow = function UpwardArrow(_ref36) {
  var _ref36$color = _ref36.color,
    color = _ref36$color === void 0 ? "#00703C" : _ref36$color,
    _ref36$rotate = _ref36.rotate,
    rotate = _ref36$rotate === void 0 ? 0 : _ref36$rotate,
    _ref36$marginRight = _ref36.marginRight,
    marginRight = _ref36$marginRight === void 0 ? 0 : _ref36$marginRight;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: {
      display: "inline-block",
      verticalAlign: "baseline",
      transform: "rotate(" + rotate + "deg)",
      marginRight: marginRight + "px"
    },
    width: "11",
    height: "16",
    viewBox: "0 0 11 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 5.6L1.10786 6.728L4.71429 3.064V16H6.28571V3.064L9.89214 6.736L11 5.6L5.5 0L0 5.6Z",
    fill: color
  }));
};
var DownwardArrow = function DownwardArrow(props) {
  return /*#__PURE__*/React__default.createElement(UpwardArrow, _extends({}, props, {
    color: "#e54d42",
    rotate: 180
  }));
};
var DownloadIcon = function DownloadIcon(_ref37) {
  var styles = _ref37.styles,
    className = _ref37.className,
    onClick = _ref37.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    width: "19",
    height: "24",
    viewBox: "0 0 19 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M18.8337 8.5H13.5003V0.5H5.50033V8.5H0.166992L9.50033 17.8333L18.8337 8.5ZM0.166992 20.5V23.1667H18.8337V20.5H0.166992Z",
    fill: "#505A5F"
  }));
};
var GenericFileIcon = function GenericFileIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "80",
    height: "100",
    viewBox: "0 0 80 100",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M50 0H10C4.5 0 0.0500011 4.5 0.0500011 10L0 90C0 95.5 4.45 100 9.95 100H70C75.5 100 80 95.5 80 90V30L50 0ZM60 80H20V70H60V80ZM60 60H20V50H60V60ZM45 35V7.5L72.5 35H45Z",
    fill: "#505A5F"
  }));
};
var ExternalLinkIcon = function ExternalLinkIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M16 16H2V2H9V0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.1 18 18 17.1 18 16V9H16V16ZM11 0V2H14.59L4.76 11.83L6.17 13.24L16 3.41V7H18V0H11Z",
    fill: "#F47738"
  }));
};
var PrimaryDownlaodIcon = function PrimaryDownlaodIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "#f47738"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
  }));
};
var Ellipsis = function Ellipsis(_ref38) {
  var className = _ref38.className,
    onClick = _ref38.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "4",
    height: "16",
    viewBox: "0 0 4 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z",
    fill: "#B1B4B6"
  }));
};
var Poll = function Poll() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 6C0 2.68629 2.68629 0 6 0H34C37.3137 0 40 2.68629 40 6V34C40 37.3137 37.3137 40 34 40H6C2.68629 40 0 37.3137 0 34V6Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M31.6667 5H8.33333C6.5 5 5 6.5 5 8.33333V31.6667C5 33.5 6.5 35 8.33333 35H31.6667C33.5 35 35 33.5 35 31.6667V8.33333C35 6.5 33.5 5 31.6667 5ZM15 28.3333H11.6667V16.6667H15V28.3333ZM21.6667 28.3333H18.3333V11.6667H21.6667V28.3333ZM28.3333 28.3333H25V21.6667H28.3333V28.3333Z",
    fill: "#F47738"
  }));
};
var Details = function Details() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "22",
    height: "16",
    viewBox: "0 0 22 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z",
    fill: "#505A5F"
  }));
};
var FilterIcon = function FilterIcon(_ref39) {
  var onClick = _ref39.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.666904 2.48016C3.36024 5.9335 8.33357 12.3335 8.33357 12.3335V20.3335C8.33357 21.0668 8.93357 21.6668 9.6669 21.6668H12.3336C13.0669 21.6668 13.6669 21.0668 13.6669 20.3335V12.3335C13.6669 12.3335 18.6269 5.9335 21.3202 2.48016C22.0002 1.60016 21.3736 0.333496 20.2669 0.333496H1.72024C0.613571 0.333496 -0.0130959 1.60016 0.666904 2.48016Z",
    fill: "#505A5F"
  }));
};
var RefreshIcon = function RefreshIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "16",
    height: "22",
    viewBox: "0 0 16 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z",
    fill: "#0B0C0C"
  }));
};
var RefreshSVG = function RefreshSVG() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 16 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z",
    fill: "#505A5F"
  }));
};
var PrintIcon = function PrintIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "18",
    viewBox: "0 0 20 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M17 5H3C1.34 5 0 6.34 0 8V14H4V18H16V14H20V8C20 6.34 18.66 5 17 5ZM14 16H6V11H14V16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM16 0H4V4H16V0Z",
    fill: "#505A5F"
  }));
};
function PropertyHouse(_ref40) {
  var className = _ref40.className,
    styles = _ref40.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    fill: "#FFFFFF",
    style: _extends({}, styles),
    width: "24",
    height: "24",
    viewBox: "0 0 40 40",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13.6167 9.5L1.66667 17.4667V35H10V21.6667H16.6667V35H25V17.0833L13.6167 9.5Z"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M16.6667 5V7.51667L20 9.73333L22.8833 11.6667H25V13.0833L28.3333 15.3167V18.3333H31.6667V21.6667H28.3333V25H31.6667V28.3333H28.3333V35H38.3333V5H16.6667ZM31.6667 15H28.3333V11.6667H31.6667V15Z"
  }));
}
var InfoBannerIcon = function InfoBannerIcon(_ref41) {
  var _ref41$fill = _ref41.fill,
    fill = _ref41$fill === void 0 ? "#3498DB" : _ref41$fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z",
    fill: fill
  }));
};
var ShareIcon = function ShareIcon(_ref42) {
  var styles = _ref42.styles,
    className = _ref42.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    className: className,
    width: "18",
    height: "20",
    viewBox: "0 0 18 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z",
    fill: "#505A5F"
  }));
};
var RupeeIcon = function RupeeIcon(_ref43) {
  var className = _ref43.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "48",
    className: className,
    height: "48",
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("rect", {
    width: "48",
    height: "48",
    rx: "6",
    fill: "#F47738"
  }));
};
var ComplaintIcon = function ComplaintIcon(_ref44) {
  var className = _ref44.className,
    styles = _ref44.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    className: className,
    viewBox: "0 0 48 48",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M42.6667 0.666748H5.33335C2.76669 0.666748 0.69002 2.76675 0.69002 5.33342L0.666687 47.3334L10 38.0001H42.6667C45.2334 38.0001 47.3334 35.9001 47.3334 33.3334V5.33342C47.3334 2.76675 45.2334 0.666748 42.6667 0.666748ZM26.3334 21.6667H21.6667V7.66675H26.3334V21.6667ZM26.3334 31.0001H21.6667V26.3334H26.3334V31.0001Z"
  }));
};
var DropIcon = function DropIcon(_ref45) {
  var className = _ref45.className,
    styles = _ref45.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "34",
    style: _extends({}, styles),
    viewBox: "0 0 28 34",
    className: className,
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M23.4333 10.3332L14 0.916504L4.56663 10.3332C1.96663 12.9332 0.666626 16.3998 0.666626 19.7332C0.666626 23.0665 1.96663 26.5832 4.56663 29.1832C7.16663 31.7832 10.5833 33.0998 14 33.0998C17.4166 33.0998 20.8333 31.7832 23.4333 29.1832C26.0333 26.5832 27.3333 23.0665 27.3333 19.7332C27.3333 16.3998 26.0333 12.9332 23.4333 10.3332ZM3.99996 20.3332C4.01663 16.9998 5.03329 14.8832 6.93329 12.9998L14 5.78317L21.0666 13.0832C22.9666 14.9498 23.9833 16.9998 24 20.3332H3.99996Z"
  }));
};
var Person = function Person(style) {
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({
      display: "inline-block",
      fontSize: "16px"
    }, style),
    width: "24",
    height: "24",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13.6167 9.5L1.66667 17.4667V35H10V21.6667H16.6667V35H25V17.0833L13.6167 9.5Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    fill: "white"
  }));
};
var WhatsappIcon = function WhatsappIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.0566406 24L1.74364 17.837C0.702641 16.033 0.155641 13.988 0.156641 11.891C0.159641 5.335 5.49464 0 12.0496 0C15.2306 0.001 18.2166 1.24 20.4626 3.488C22.7076 5.736 23.9436 8.724 23.9426 11.902C23.9396 18.459 18.6046 23.794 12.0496 23.794C10.0596 23.793 8.09864 23.294 6.36164 22.346L0.0566406 24ZM6.65364 20.193C8.32964 21.188 9.92964 21.784 12.0456 21.785C17.4936 21.785 21.9316 17.351 21.9346 11.9C21.9366 6.438 17.5196 2.01 12.0536 2.008C6.60164 2.008 2.16664 6.442 2.16464 11.892C2.16364 14.117 2.81564 15.783 3.91064 17.526L2.91164 21.174L6.65364 20.193ZM18.0406 14.729C17.9666 14.605 17.7686 14.531 17.4706 14.382C17.1736 14.233 15.7126 13.514 15.4396 13.415C15.1676 13.316 14.9696 13.266 14.7706 13.564C14.5726 13.861 14.0026 14.531 13.8296 14.729C13.6566 14.927 13.4826 14.952 13.1856 14.803C12.8886 14.654 11.9306 14.341 10.7956 13.328C9.91264 12.54 9.31564 11.567 9.14264 11.269C8.96964 10.972 9.12464 10.811 9.27264 10.663C9.40664 10.53 9.56964 10.316 9.71864 10.142C9.86964 9.97 9.91864 9.846 10.0186 9.647C10.1176 9.449 10.0686 9.275 9.99364 9.126C9.91864 8.978 9.32464 7.515 9.07764 6.92C8.83564 6.341 8.59064 6.419 8.40864 6.41L7.83864 6.4C7.64064 6.4 7.31864 6.474 7.04664 6.772C6.77464 7.07 6.00664 7.788 6.00664 9.251C6.00664 10.714 7.07164 12.127 7.21964 12.325C7.36864 12.523 9.31464 15.525 12.2956 16.812C13.0046 17.118 13.5586 17.301 13.9896 17.438C14.7016 17.664 15.3496 17.632 15.8616 17.556C16.4326 17.471 17.6196 16.837 17.8676 16.143C18.1156 15.448 18.1156 14.853 18.0406 14.729Z",
    fill: "#F47738"
  }));
};
var EmailIcon = function EmailIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "16",
    viewBox: "0 0 20 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z",
    fill: "#F47738"
  }));
};
var CaseIcon = function CaseIcon(_ref46) {
  var className = _ref46.className,
    styles = _ref46.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    fill: "#ffffff",
    width: "24",
    height: "24",
    viewBox: "0 0 34 32",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M30.3333 6.99967H23.6667V3.66634C23.6667 1.81634 22.1833 0.333008 20.3333 0.333008H13.6667C11.8167 0.333008 10.3333 1.81634 10.3333 3.66634V6.99967H3.66667C1.81667 6.99967 0.350001 8.48301 0.350001 10.333L0.333334 28.6663C0.333334 30.5163 1.81667 31.9997 3.66667 31.9997H30.3333C32.1833 31.9997 33.6667 30.5163 33.6667 28.6663V10.333C33.6667 8.48301 32.1833 6.99967 30.3333 6.99967ZM20.3333 6.99967H13.6667V3.66634H20.3333V6.99967Z"
  }));
};
var TLIcon = function TLIcon(_ref47) {
  var className = _ref47.className,
    styles = _ref47.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    fill: "#ffffff",
    width: "24",
    height: "24",
    viewBox: "0 0 34 32",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M30.3333 6.99967H23.6667V3.66634C23.6667 1.81634 22.1833 0.333008 20.3333 0.333008H13.6667C11.8167 0.333008 10.3333 1.81634 10.3333 3.66634V6.99967H3.66667C1.81667 6.99967 0.350001 8.48301 0.350001 10.333L0.333334 28.6663C0.333334 30.5163 1.81667 31.9997 3.66667 31.9997H30.3333C32.1833 31.9997 33.6667 30.5163 33.6667 28.6663V10.333C33.6667 8.48301 32.1833 6.99967 30.3333 6.99967ZM20.3333 6.99967H13.6667V3.66634H20.3333V6.99967Z"
  }));
};
var PersonIcon = function PersonIcon(_ref48) {
  var className = _ref48.className,
    styles = _ref48.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    width: "24",
    height: "24",
    viewBox: "0 0 38 24",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M25.6667 10.3333C28.4334 10.3333 30.65 8.1 30.65 5.33333C30.65 2.56666 28.4334 0.333328 25.6667 0.333328C22.9 0.333328 20.6667 2.56666 20.6667 5.33333C20.6667 8.1 22.9 10.3333 25.6667 10.3333ZM12.3334 10.3333C15.1 10.3333 17.3167 8.1 17.3167 5.33333C17.3167 2.56666 15.1 0.333328 12.3334 0.333328C9.56669 0.333328 7.33335 2.56666 7.33335 5.33333C7.33335 8.1 9.56669 10.3333 12.3334 10.3333ZM12.3334 13.6667C8.45002 13.6667 0.666687 15.6167 0.666687 19.5V23.6667H24V19.5C24 15.6167 16.2167 13.6667 12.3334 13.6667ZM25.6667 13.6667C25.1834 13.6667 24.6334 13.7 24.05 13.75C25.9834 15.15 27.3334 17.0333 27.3334 19.5V23.6667H37.3334V19.5C37.3334 15.6167 29.55 13.6667 25.6667 13.6667Z"
  }));
};
var ReceiptIcon = function ReceiptIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z",
    fill: "white"
  }));
};
var AnnouncementIcon = function AnnouncementIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "28",
    viewBox: "0 0 28 28",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M24.6665 0.666016H3.33317C1.8665 0.666016 0.679837 1.86602 0.679837 3.33268L0.666504 27.3327L5.99984 21.9993H24.6665C26.1332 21.9993 27.3332 20.7993 27.3332 19.3327V3.33268C27.3332 1.86602 26.1332 0.666016 24.6665 0.666016ZM15.3332 12.666H12.6665V4.66602H15.3332V12.666ZM15.3332 17.9993H12.6665V15.3327H15.3332V17.9993Z",
    fill: "#F47738"
  }));
};
var PTIcon = function PTIcon(_ref49) {
  var className = _ref49.className,
    styles = _ref49.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "34",
    height: "30",
    style: _extends({}, styles),
    viewBox: "0 0 34 30",
    fill: "#ffffff",
    className: className,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M16.9999 6.66667V0H0.333252V30H33.6666V6.66667H16.9999ZM6.99992 26.6667H3.66659V23.3333H6.99992V26.6667ZM6.99992 20H3.66659V16.6667H6.99992V20ZM6.99992 13.3333H3.66659V10H6.99992V13.3333ZM6.99992 6.66667H3.66659V3.33333H6.99992V6.66667ZM13.6666 26.6667H10.3333V23.3333H13.6666V26.6667ZM13.6666 20H10.3333V16.6667H13.6666V20ZM13.6666 13.3333H10.3333V10H13.6666V13.3333ZM13.6666 6.66667H10.3333V3.33333H13.6666V6.66667ZM30.3333 26.6667H16.9999V23.3333H20.3333V20H16.9999V16.6667H20.3333V13.3333H16.9999V10H30.3333V26.6667ZM26.9999 13.3333H23.6666V16.6667H26.9999V13.3333ZM26.9999 20H23.6666V23.3333H26.9999V20Z"
  }));
};
var OBPSIcon = function OBPSIcon(_ref50) {
  var className = _ref50.className,
    styles = _ref50.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    width: "34",
    height: "30",
    viewBox: "0 0 34 30",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M30.3333 0H3.66659C1.83325 0 0.333252 1.5 0.333252 3.33333V26.6667C0.333252 28.5 1.83325 30 3.66659 30H30.3333C32.1666 30 33.6666 28.5 33.6666 26.6667V3.33333C33.6666 1.5 32.1666 0 30.3333 0ZM13.6666 23.3333H5.33325V20H13.6666V23.3333ZM13.6666 16.6667H5.33325V13.3333H13.6666V16.6667ZM13.6666 10H5.33325V6.66667H13.6666V10ZM21.6999 20L16.9999 15.2667L19.3499 12.9167L21.6999 15.2833L26.9833 10L29.3499 12.3667L21.6999 20Z"
  }));
};
var OBPSIconSolidBg = function OBPSIconSolidBg() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "34",
    height: "30",
    viewBox: "0 0 34 30",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M30.333 0H3.66634C1.83301 0 0.333008 1.5 0.333008 3.33333V26.6667C0.333008 28.5 1.83301 30 3.66634 30H30.333C32.1663 30 33.6663 28.5 33.6663 26.6667V3.33333C33.6663 1.5 32.1663 0 30.333 0ZM13.6663 23.3333H5.33301V20H13.6663V23.3333ZM13.6663 16.6667H5.33301V13.3333H13.6663V16.6667ZM13.6663 10H5.33301V6.66667H13.6663V10ZM21.6997 20L16.9997 15.2667L19.3497 12.9167L21.6997 15.2833L26.983 10L29.3497 12.3667L21.6997 20Z",
    fill: "white"
  }));
};
var CitizenTruck = function CitizenTruck(_ref51) {
  var className = _ref51.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 23 19",
    className: className,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    fill: "#F47738",
    d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
  }));
};
var FSMIcon = function FSMIcon(_ref52) {
  var className = _ref52.className,
    styles = _ref52.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 23 19",
    className: className,
    style: _extends({}, styles),
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
  }));
};
var EDCRIcon = function EDCRIcon(_ref53) {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "30",
    height: "32",
    viewBox: "0 0 30 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M20 15.3333V5.33333L15 0.333334L10 5.33333V8.66667H0V32H30V15.3333H20ZM6.66667 28.6667H3.33333V25.3333H6.66667V28.6667ZM6.66667 22H3.33333V18.6667H6.66667V22ZM6.66667 15.3333H3.33333V12H6.66667V15.3333ZM16.6667 28.6667H13.3333V25.3333H16.6667V28.6667ZM16.6667 22H13.3333V18.6667H16.6667V22ZM16.6667 15.3333H13.3333V12H16.6667V15.3333ZM16.6667 8.66667H13.3333V5.33333H16.6667V8.66667ZM26.6667 28.6667H23.3333V25.3333H26.6667V28.6667ZM26.6667 22H23.3333V18.6667H26.6667V22Z",
    fill: "#F47738"
  }));
};
var BPAIcon = function BPAIcon(_ref54) {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M23.3333 29.0333H3.33333V8.66667H15V5.33334H3.33333C1.5 5.33334 0 6.83334 0 8.66667V28.6667C0 30.5 1.5 32 3.33333 32H23.3333C25.1667 32 26.6667 30.5 26.6667 28.6667V17H23.3333V29.0333Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M26.6667 0.333336H23.3333V5.33334H18.3333C18.35 5.35 18.3333 8.66667 18.3333 8.66667H23.3333V13.65C23.35 13.6667 26.6667 13.65 26.6667 13.65V8.66667H31.6667V5.33334H26.6667V0.333336Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 12H6.66666V15.3333H20V12Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M6.66666 17V20.3333H20V17H15H6.66666Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 22H6.66666V25.3333H20V22Z",
    fill: "#F47738"
  }));
};
var BPAHomeIcon = function BPAHomeIcon(_ref55) {
  var className = _ref55.className,
    styles = _ref55.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "34",
    height: "30",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 34 30",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M30.3333 0H3.66659C1.83325 0 0.333252 1.5 0.333252 3.33333V26.6667C0.333252 28.5 1.83325 30 3.66659 30H30.3333C32.1666 30 33.6666 28.5 33.6666 26.6667V3.33333C33.6666 1.5 32.1666 0 30.3333 0ZM13.6666 23.3333H5.33325V20H13.6666V23.3333ZM13.6666 16.6667H5.33325V13.3333H13.6666V16.6667ZM13.6666 10H5.33325V6.66667H13.6666V10ZM21.6999 20L16.9999 15.2667L19.3499 12.9167L21.6999 15.2833L26.9833 10L29.3499 12.3667L21.6999 20Z",
    fill: "white"
  }));
};
var HelpIcon = function HelpIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "18",
    viewBox: "0 0 24 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M22 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H22C23.1 18 23.99 17.1 23.99 16L24 2C24 0.9 23.1 0 22 0ZM8 3C9.66 3 11 4.34 11 6C11 7.66 9.66 9 8 9C6.34 9 5 7.66 5 6C5 4.34 6.34 3 8 3ZM14 15H2V14C2 12 6 10.9 8 10.9C10 10.9 14 12 14 14V15ZM17.85 11H19.49L21 13L19.01 14.99C17.7 14.01 16.73 12.61 16.28 11C16.1 10.36 16 9.69 16 9C16 8.31 16.1 7.64 16.28 7C16.73 5.38 17.7 3.99 19.01 3.01L21 5L19.49 7H17.85C17.63 7.63 17.5 8.3 17.5 9C17.5 9.7 17.63 10.37 17.85 11Z",
    fill: "#F47738"
  }));
};
var EventCalendar = function EventCalendar() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "27",
    viewBox: "0 0 24 27",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M18.6667 15.0002H12V21.6668H18.6667V15.0002ZM17.3333 0.333496V3.00016H6.66667V0.333496H4V3.00016H2.66667C1.18667 3.00016 0.0133333 4.20016 0.0133333 5.66683L0 24.3335C0 25.8002 1.18667 27.0002 2.66667 27.0002H21.3333C22.8 27.0002 24 25.8002 24 24.3335V5.66683C24 4.20016 22.8 3.00016 21.3333 3.00016H20V0.333496H17.3333ZM21.3333 24.3335H2.66667V9.66683H21.3333V24.3335Z",
    fill: "#F47738"
  }));
};
var NotificationBell = function NotificationBell() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "16",
    height: "20",
    viewBox: "0 0 16 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8 20C9.1 20 10 19.1 10 18H6C6 19.1 6.89 20 8 20ZM14 14V9C14 5.93 12.36 3.36 9.5 2.68V2C9.5 1.17 8.83 0.5 8 0.5C7.17 0.5 6.5 1.17 6.5 2V2.68C3.63 3.36 2 5.92 2 9V14L0 16V17H16V16L14 14Z",
    fill: "white"
  }));
};
var MapMarker = function MapMarker() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "10",
    height: "14",
    viewBox: "0 0 10 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M5 0.333496C2.42 0.333496 0.333328 2.42016 0.333328 5.00016C0.333328 6.16016 0.666661 7.24683 1.27333 8.22683C1.90666 9.2535 2.73999 10.1335 3.37999 11.1602C3.69333 11.6602 3.91999 12.1268 4.15999 12.6668C4.33333 13.0335 4.47333 13.6668 5 13.6668C5.52666 13.6668 5.66666 13.0335 5.83333 12.6668C6.08 12.1268 6.29999 11.6602 6.61333 11.1602C7.25333 10.1402 8.08666 9.26016 8.72 8.22683C9.33333 7.24683 9.66666 6.16016 9.66666 5.00016C9.66666 2.42016 7.58 0.333496 5 0.333496ZM5 6.8335C4.07999 6.8335 3.33333 6.08683 3.33333 5.16683C3.33333 4.24683 4.07999 3.50016 5 3.50016C5.92 3.50016 6.66666 4.24683 6.66666 5.16683C6.66666 6.08683 5.92 6.8335 5 6.8335Z",
    fill: "#505A5F"
  }));
};
var Clock = function Clock() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M7.992 0C3.576 0 0 3.584 0 8C0 12.416 3.576 16 7.992 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 7.992 0ZM7.99994 14.4C4.46393 14.4 1.59993 11.536 1.59993 7.99999C1.59993 4.46399 4.46393 1.59999 7.99994 1.59999C11.5359 1.59999 14.3999 4.46399 14.3999 7.99999C14.3999 11.536 11.5359 14.4 7.99994 14.4ZM7.20003 4H8.40003V8.2L12 10.336L11.4 11.32L7.20003 8.8V4Z",
    fill: "#505A5F"
  }));
};
var TickMark = function TickMark(_ref56) {
  var _ref56$fillColor = _ref56.fillColor,
    fillColor = _ref56$fillColor === void 0 ? "white" : _ref56$fillColor;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: {
      display: "inline-block",
      margin: "auto"
    },
    width: "14",
    height: "11",
    viewBox: "0 0 14 11",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M4.75012 8.1275L1.62262 5L0.557617 6.0575L4.75012 10.25L13.7501 1.25L12.6926 0.192505L4.75012 8.1275Z",
    fill: fillColor
  }));
};
var EditIcon = function EditIcon(_ref57) {
  var style = _ref57.style;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: style,
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M9.126 5.125L11.063 3.188L14.81 6.935L12.873 8.873L9.126 5.125ZM17.71 2.63L15.37 0.289999C15.1826 0.103748 14.9292 -0.000793457 14.665 -0.000793457C14.4008 -0.000793457 14.1474 0.103748 13.96 0.289999L12.13 2.12L15.88 5.87L17.71 4C17.8844 3.81454 17.9815 3.56956 17.9815 3.315C17.9815 3.06044 17.8844 2.81546 17.71 2.63ZM5.63 8.63L0 14.25V18H3.75L9.38 12.38L12.873 8.873L9.126 5.125L5.63 8.63Z",
    fill: "#F47738"
  }));
};
var SearchIcon = function SearchIcon(_ref58) {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z",
    fill: "#505A5F"
  }));
};
var DeleteIcon = function DeleteIcon(_ref59) {
  var fill = _ref59.fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "14",
    height: "18",
    viewBox: "0 0 14 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z",
    fill: fill
  }));
};
var CreateLoiIcon = function CreateLoiIcon(_ref60) {
  var style = _ref60.style,
    _ref60$fill = _ref60.fill,
    fill = _ref60$fill === void 0 ? "#F47738" : _ref60$fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: style,
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M9.126 5.12506L11.063 3.18806L14.81 6.93506L12.873 8.87306L9.126 5.12506ZM17.71 2.63006L15.37 0.29006C15.1826 0.103809 14.9292 -0.000732422 14.665 -0.000732422C14.4008 -0.000732422 14.1474 0.103809 13.96 0.29006L12.13 2.12006L15.88 5.87006L17.71 4.00006C17.8844 3.8146 17.9815 3.56962 17.9815 3.31506C17.9815 3.0605 17.8844 2.81552 17.71 2.63006ZM5.63 8.63006L0 14.2501V18.0001H3.75L9.38 12.3801L12.873 8.87306L9.126 5.12506L5.63 8.63006Z",
    fill: fill
  }));
};
var WSICon = function WSICon(_ref61) {
  var className = _ref61.className,
    styles = _ref61.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "34",
    viewBox: "0 0 28 34",
    fill: "#ffffff",
    style: _extends({}, styles),
    className: className,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M23.4332 10.3337L13.9998 0.916992L4.5665 10.3337C1.9665 12.9337 0.666504 16.4003 0.666504 19.7337C0.666504 23.067 1.9665 26.5837 4.5665 29.1837C7.1665 31.7837 10.5832 33.1003 13.9998 33.1003C17.4165 33.1003 20.8332 31.7837 23.4332 29.1837C26.0332 26.5837 27.3332 23.067 27.3332 19.7337C27.3332 16.4003 26.0332 12.9337 23.4332 10.3337ZM3.99984 20.3337C4.0165 17.0003 5.03317 14.8837 6.93317 13.0003L13.9998 5.78366L21.0665 13.0837C22.9665 14.9503 23.9832 17.0003 23.9998 20.3337H3.99984Z"
  }));
};
var ArrowVectorDown = function ArrowVectorDown(_ref62) {
  var className = _ref62.className,
    styles = _ref62.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    className: className,
    viewBox: "0 0 16 11",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M16 2.33331L14.12 0.453308L8 6.55997L1.88 0.453307L-8.21774e-08 2.33331L8 10.3333L16 2.33331Z",
    fill: "#F47738"
  }));
};
var ArrowDirection = function ArrowDirection(_ref63) {
  var className = _ref63.className,
    styles = _ref63.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    className: className,
    viewBox: "0 0 16 16",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8.0013 2.66669L7.0613 3.60669L10.7813 7.33335H2.66797V8.66669H10.7813L7.0613 12.3934L8.0013 13.3334L13.3346 8.00002L8.0013 2.66669Z"
  }));
};
var CameraIcon = function CameraIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M15.0002 5L11.9502 8.33333H6.66683C4.8335 8.33333 3.3335 9.83333 3.3335 11.6667V31.6667C3.3335 33.5 4.8335 35 6.66683 35H33.3335C35.1668 35 36.6668 33.5 36.6668 31.6667V11.6667C36.6668 9.83333 35.1668 8.33333 33.3335 8.33333H28.0502L25.0002 5H15.0002ZM20.0002 30C15.4002 30 11.6668 26.2667 11.6668 21.6667C11.6668 17.0667 15.4002 13.3333 20.0002 13.3333C24.6002 13.3333 28.3335 17.0667 28.3335 21.6667C28.3335 26.2667 24.6002 30 20.0002 30Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20.0002 28.3333L22.0835 23.75L26.6668 21.6667L22.0835 19.5833L20.0002 15L17.9168 19.5833L13.3335 21.6667L17.9168 23.75L20.0002 28.3333Z",
    fill: "#F47738"
  }));
};
var RemoveIcon = function RemoveIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "30",
    viewBox: "0 0 24 30",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M2.00016 26.6667C2.00016 28.5 3.50016 30 5.3335 30H18.6668C20.5002 30 22.0002 28.5 22.0002 26.6667V6.66667H2.00016V26.6667ZM23.6668 1.66667H17.8335L16.1668 0H7.8335L6.16683 1.66667H0.333496V5H23.6668V1.66667Z",
    fill: "#F47738"
  }));
};
var GalleryIcon = function GalleryIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "40",
    height: "34",
    viewBox: "0 0 40 34",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M3.33333 7.00016H0V15.3335H0.0166667L0 30.3335C0 32.1668 1.5 33.6668 3.33333 33.6668H33.3333V30.3335H3.33333V7.00016ZM36.6667 3.66683H23.3333L20 0.333496H10C8.16667 0.333496 6.68333 1.8335 6.68333 3.66683L6.66667 23.6668C6.66667 25.5002 8.16667 27.0002 10 27.0002H36.6667C38.5 27.0002 40 25.5002 40 23.6668V7.00016C40 5.16683 38.5 3.66683 36.6667 3.66683ZM11.6667 22.0002L19.1667 12.0002L25 19.5168L29.1667 14.5002L35 22.0002H11.6667Z",
    fill: "#F47738"
  }));
};
var EditPencilIcon = function EditPencilIcon(_ref64) {
  var className = _ref64.className,
    _ref64$width = _ref64.width,
    width = _ref64$width === void 0 ? 18 : _ref64$width,
    _ref64$height = _ref64.height,
    height = _ref64$height === void 0 ? 18 : _ref64$height;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    width: width,
    height: height,
    viewBox: "0 0 18 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M9.126 5.12482L11.063 3.18782L14.81 6.93482L12.873 8.87282L9.126 5.12482ZM17.71 2.62982L15.37 0.289816C15.1826 0.103565 14.9292 -0.000976562 14.665 -0.000976562C14.4008 -0.000976563 14.1474 0.103565 13.96 0.289816L12.13 2.11982L15.88 5.86982L17.71 3.99982C17.8844 3.81436 17.9815 3.56938 17.9815 3.31482C17.9815 3.06025 17.8844 2.81528 17.71 2.62982ZM5.63 8.62982L0 14.2498V17.9998H3.75L9.38 12.3798L12.873 8.87282L9.126 5.12482L5.63 8.62982Z",
    fill: "#505A5F"
  }));
};
var AddressBookIcon = function AddressBookIcon(_ref65) {
  var styles = _ref65.styles,
    className = _ref65.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 20 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M18 0H2V2H18V0ZM2 24H18V22H2V24ZM18 4H2C0.9 4 0 4.9 0 6V18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4ZM10 6.75C11.24 6.75 12.25 7.76 12.25 9C12.25 10.24 11.24 11.25 10 11.25C8.76 11.25 7.75 10.24 7.75 9C7.75 7.76 8.76 6.75 10 6.75ZM15 17H5V15.5C5 13.83 8.33 13 10 13C11.67 13 15 13.83 15 15.5V17Z",
    fill: "#B1B4B6"
  }));
};
var LocationIcon = function LocationIcon(_ref66) {
  var styles = _ref66.styles,
    className = _ref66.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 14 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M7 0C3.13 0 0 3.13 0 7C0 8.74 0.5 10.37 1.41 11.84C2.36 13.38 3.61 14.7 4.57 16.24C5.04 16.99 5.38 17.69 5.74 18.5C6 19.05 6.21 20 7 20C7.79 20 8 19.05 8.25 18.5C8.62 17.69 8.95 16.99 9.42 16.24C10.38 14.71 11.63 13.39 12.58 11.84C13.5 10.37 14 8.74 14 7C14 3.13 10.87 0 7 0ZM7 9.75C5.62 9.75 4.5 8.63 4.5 7.25C4.5 5.87 5.62 4.75 7 4.75C8.38 4.75 9.5 5.87 9.5 7.25C9.5 8.63 8.38 9.75 7 9.75Z",
    fill: "#B1B4B6"
  }));
};
var CollectionsBookmarIcons = function CollectionsBookmarIcons(_ref67) {
  var styles = _ref67.styles,
    className = _ref67.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "22",
    height: "28",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 22 28",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M18.9999 0.666992H2.99992C1.53325 0.666992 0.333252 1.86699 0.333252 3.33366V24.667C0.333252 26.1337 1.53325 27.3337 2.99992 27.3337H18.9999C20.4666 27.3337 21.6666 26.1337 21.6666 24.667V3.33366C21.6666 1.86699 20.4666 0.666992 18.9999 0.666992ZM2.99992 3.33366H9.66658V14.0003L6.33325 12.0003L2.99992 14.0003V3.33366Z"
  }));
};
var FinanceChartIcon = function FinanceChartIcon(_ref68) {
  var styles = _ref68.styles,
    className = _ref68.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "30",
    height: "30",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 30 30",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M26.6667 0H3.33333C1.5 0 0 1.5 0 3.33333V26.6667C0 28.5 1.5 30 3.33333 30H26.6667C28.5 30 30 28.5 30 26.6667V3.33333C30 1.5 28.5 0 26.6667 0ZM10 23.3333H6.66667V11.6667H10V23.3333ZM16.6667 23.3333H13.3333V6.66667H16.6667V23.3333ZM23.3333 23.3333H20V16.6667H23.3333V23.3333Z"
  }));
};
var CollectionIcon = function CollectionIcon(_ref69) {
  var styles = _ref69.styles,
    className = _ref69.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "27",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 24 27",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M21.3333 2.99967H15.76C15.2 1.45301 13.7333 0.333008 12 0.333008C10.2667 0.333008 8.8 1.45301 8.24 2.99967H2.66667C1.2 2.99967 0 4.19967 0 5.66634V24.333C0 25.7997 1.2 26.9997 2.66667 26.9997H21.3333C22.8 26.9997 24 25.7997 24 24.333V5.66634C24 4.19967 22.8 2.99967 21.3333 2.99967ZM12 2.99967C12.7333 2.99967 13.3333 3.59967 13.3333 4.33301C13.3333 5.06634 12.7333 5.66634 12 5.66634C11.2667 5.66634 10.6667 5.06634 10.6667 4.33301C10.6667 3.59967 11.2667 2.99967 12 2.99967ZM14.6667 21.6663H5.33333V18.9997H14.6667V21.6663ZM18.6667 16.333H5.33333V13.6663H18.6667V16.333ZM18.6667 10.9997H5.33333V8.33301H18.6667V10.9997Z"
  }));
};
var BillsIcon = function BillsIcon(_ref70) {
  var styles = _ref70.styles,
    className = _ref70.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "27",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 24 27",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M21.3333 2.99967H15.76C15.2 1.45301 13.7333 0.333008 12 0.333008C10.2667 0.333008 8.8 1.45301 8.24 2.99967H2.66667C1.2 2.99967 0 4.19967 0 5.66634V24.333C0 25.7997 1.2 26.9997 2.66667 26.9997H21.3333C22.8 26.9997 24 25.7997 24 24.333V5.66634C24 4.19967 22.8 2.99967 21.3333 2.99967ZM12 2.99967C12.7333 2.99967 13.3333 3.59967 13.3333 4.33301C13.3333 5.06634 12.7333 5.66634 12 5.66634C11.2667 5.66634 10.6667 5.06634 10.6667 4.33301C10.6667 3.59967 11.2667 2.99967 12 2.99967ZM14.6667 21.6663H5.33333V18.9997H14.6667V21.6663ZM18.6667 16.333H5.33333V13.6663H18.6667V16.333ZM18.6667 10.9997H5.33333V8.33301H18.6667V10.9997Z"
  }));
};
var MCollectIcon = function MCollectIcon(_ref71) {
  var styles = _ref71.styles,
    className = _ref71.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "37",
    height: "35",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 37 35",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M34.375 28.75V30.625C34.375 32.6875 32.6875 34.375 30.625 34.375H4.375C2.29375 34.375 0.625 32.6875 0.625 30.625V4.375C0.625 2.3125 2.29375 0.625 4.375 0.625H30.625C32.6875 0.625 34.375 2.3125 34.375 4.375V6.25H17.5C15.4187 6.25 13.75 7.9375 13.75 10V25C13.75 27.0625 15.4187 28.75 17.5 28.75H34.375ZM17.5 25H36.25V10H17.5V25ZM25 20.3125C23.4438 20.3125 22.1875 19.0562 22.1875 17.5C22.1875 15.9438 23.4438 14.6875 25 14.6875C26.5562 14.6875 27.8125 15.9438 27.8125 17.5C27.8125 19.0562 26.5562 20.3125 25 20.3125Z"
  }));
};
var PGRIcon = function PGRIcon(_ref72) {
  var styles = _ref72.styles,
    className = _ref72.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "35",
    height: "39",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 35 39",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M31.168 0.75H3.83464C1.95547 0.75 0.435052 2.4375 0.435052 4.5L0.417969 38.25L7.2513 30.75H31.168C33.0471 30.75 34.5846 29.0625 34.5846 27V4.5C34.5846 2.4375 33.0471 0.75 31.168 0.75ZM19.2096 17.625H15.793V6.375H19.2096V17.625ZM19.2096 25.125H15.793V21.375H19.2096V25.125Z"
  }));
};
var FirenocIcon = function FirenocIcon(_ref73) {
  var styles = _ref73.styles,
    className = _ref73.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "35",
    height: "39",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 35 39",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M21.5142857,14.0571429 C21.12,13.5428571 20.6571429,13.0971429 20.2114286,12.6514286 C19.0971429,11.6228571 17.8114286,10.8857143 16.7314286,9.80571429 C14.2285714,7.30285714 13.7142857,3.17142857 15.2742857,0 C13.7142857,0.394285714 12.2742857,1.28571429 11.0742857,2.26285714 C6.72,5.82857143 5.00571429,12.12 7.06285714,17.52 C7.13142857,17.6914286 7.2,17.8628571 7.2,18.0857143 C7.2,18.4628571 6.94285714,18.8057143 6.6,18.9428571 C6.22285714,19.1142857 5.81142857,19.0114286 5.50285714,18.7371429 C5.4,18.6514286 5.33142857,18.5657143 5.24571429,18.4457143 C3.36,15.9942857 3.05142857,12.48 4.33714286,9.66857143 C1.52571429,12 8.60422844e-16,15.9428571 0.24,19.6628571 C0.308571429,20.52 0.411428571,21.3771429 0.702857143,22.2342857 C0.942857143,23.2628571 1.38857143,24.2914286 1.93714286,25.2 C3.72,28.1657143 6.85714286,30.2914286 10.2342857,30.72 C13.8342857,31.1828571 17.6914286,30.5142857 20.4514286,27.9771429 C23.5371429,25.1314286 24.6514286,20.5714286 23.0228571,16.6628571 L22.8,16.2171429 C22.4571429,15.4285714 21.9942857,14.7257143 21.4285714,14.0742857 L21.5142857,14.0571429 L21.5142857,14.0571429 Z M16.2,24.8571429 C15.72,25.2685714 14.9485714,25.7142857 14.3485714,25.8857143 C12.4628571,26.5714286 10.5771429,25.6114286 9.42857143,24.48 C11.4685714,24 12.6685714,22.4914286 13.0114286,20.9657143 C13.3028571,19.5942857 12.7714286,18.4628571 12.5485714,17.1428571 C12.3428571,15.8742857 12.3771429,14.7942857 12.8571429,13.6114286 C13.1485714,14.2628571 13.4914286,14.9142857 13.8857143,15.4285714 C15.1885714,17.1428571 17.2285714,17.8971429 17.6571429,20.2285714 C17.7257143,20.4685714 17.76,20.7085714 17.76,20.9657143 C17.8114286,22.3714286 17.2114286,23.9142857 16.1828571,24.8571429 L16.2,24.8571429 Z",
    id: "Shape"
  }));
};
var BirthIcon = function BirthIcon(_ref74) {
  var styles = _ref74.styles,
    className = _ref74.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "35",
    height: "39",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 35 39",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M20.7502 0.916016H3.25016C1.646 0.916016 0.333496 2.22852 0.333496 3.83268V27.166C0.333496 28.7702 1.646 30.0827 3.25016 30.0827H20.7502C22.3543 30.0827 23.6668 28.7702 23.6668 27.166V3.83268C23.6668 2.22852 22.3543 0.916016 20.7502 0.916016ZM3.25016 3.83268H10.5418V15.4994L6.896 13.3119L3.25016 15.4994V3.83268Z"
  }));
};
var DeathIcon = function DeathIcon(_ref75) {
  var styles = _ref75.styles,
    className = _ref75.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "35",
    height: "39",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 35 39",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M27.1665 0.375H3.83317C2.229 0.375 0.916504 1.6875 0.916504 3.29167V23.7083C0.916504 25.3125 2.229 26.625 3.83317 26.625H27.1665C28.7707 26.625 30.0832 25.3125 30.0832 23.7083V3.29167C30.0832 1.6875 28.7707 0.375 27.1665 0.375ZM12.5832 20.7917H5.2915V17.875H12.5832V20.7917ZM12.5832 14.9583H5.2915V12.0417H12.5832V14.9583ZM12.5832 9.125H5.2915V6.20833H12.5832V9.125ZM19.6123 17.875L15.4998 13.7333L17.5561 11.6771L19.6123 13.7479L24.2353 9.125L26.3061 11.1958L19.6123 17.875Z"
  }));
};
var ErrorIcon = function ErrorIcon(_ref76) {
  var className = _ref76.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "#FFFFFF",
    xmlns: "http://www.w3.org/2000/svg",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z",
    fill: "white"
  }));
};
var DownloadBtnCommon = function DownloadBtnCommon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "112",
    height: "32",
    viewBox: "0 0 112 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M25.3337 12H20.0003V4H12.0003V12H6.66699L16.0003 21.3333L25.3337 12ZM6.66699 24V26.6667H25.3337V24H6.66699Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M44.3984 21.5H42.0234L42.0391 20.2734H44.3984C45.2109 20.2734 45.888 20.1042 46.4297 19.7656C46.9714 19.4219 47.3776 18.9427 47.6484 18.3281C47.9245 17.7083 48.0625 16.9844 48.0625 16.1562V15.4609C48.0625 14.8099 47.9844 14.2318 47.8281 13.7266C47.6719 13.2161 47.4427 12.7865 47.1406 12.4375C46.8385 12.0833 46.4688 11.8151 46.0312 11.6328C45.599 11.4505 45.1016 11.3594 44.5391 11.3594H41.9766V10.125H44.5391C45.2839 10.125 45.9635 10.25 46.5781 10.5C47.1927 10.7448 47.7214 11.1016 48.1641 11.5703C48.612 12.0339 48.9557 12.5964 49.1953 13.2578C49.4349 13.9141 49.5547 14.6536 49.5547 15.4766V16.1562C49.5547 16.9792 49.4349 17.7214 49.1953 18.3828C48.9557 19.0391 48.6094 19.599 48.1562 20.0625C47.7083 20.526 47.1667 20.8828 46.5312 21.1328C45.901 21.3776 45.1901 21.5 44.3984 21.5ZM42.8281 10.125V21.5H41.3203V10.125H42.8281ZM51.2188 17.3672V17.1875C51.2188 16.5781 51.3073 16.013 51.4844 15.4922C51.6615 14.9661 51.9167 14.5104 52.25 14.125C52.5833 13.7344 52.987 13.4323 53.4609 13.2188C53.9349 13 54.4661 12.8906 55.0547 12.8906C55.6484 12.8906 56.1823 13 56.6562 13.2188C57.1354 13.4323 57.5417 13.7344 57.875 14.125C58.2135 14.5104 58.4714 14.9661 58.6484 15.4922C58.8255 16.013 58.9141 16.5781 58.9141 17.1875V17.3672C58.9141 17.9766 58.8255 18.5417 58.6484 19.0625C58.4714 19.5833 58.2135 20.0391 57.875 20.4297C57.5417 20.8151 57.138 21.1172 56.6641 21.3359C56.1953 21.5495 55.6641 21.6562 55.0703 21.6562C54.4766 21.6562 53.9427 21.5495 53.4688 21.3359C52.9948 21.1172 52.5885 20.8151 52.25 20.4297C51.9167 20.0391 51.6615 19.5833 51.4844 19.0625C51.3073 18.5417 51.2188 17.9766 51.2188 17.3672ZM52.6641 17.1875V17.3672C52.6641 17.7891 52.7135 18.1875 52.8125 18.5625C52.9115 18.9323 53.0599 19.2604 53.2578 19.5469C53.4609 19.8333 53.7135 20.0599 54.0156 20.2266C54.3177 20.388 54.6693 20.4688 55.0703 20.4688C55.4661 20.4688 55.8125 20.388 56.1094 20.2266C56.4115 20.0599 56.6615 19.8333 56.8594 19.5469C57.0573 19.2604 57.2057 18.9323 57.3047 18.5625C57.4089 18.1875 57.4609 17.7891 57.4609 17.3672V17.1875C57.4609 16.7708 57.4089 16.3776 57.3047 16.0078C57.2057 15.6328 57.0547 15.3021 56.8516 15.0156C56.6536 14.724 56.4036 14.4948 56.1016 14.3281C55.8047 14.1615 55.4557 14.0781 55.0547 14.0781C54.6589 14.0781 54.3099 14.1615 54.0078 14.3281C53.7109 14.4948 53.4609 14.724 53.2578 15.0156C53.0599 15.3021 52.9115 15.6328 52.8125 16.0078C52.7135 16.3776 52.6641 16.7708 52.6641 17.1875ZM62.8672 20L65.0391 13.0469H65.9922L65.8047 14.4297L63.5938 21.5H62.6641L62.8672 20ZM61.4062 13.0469L63.2578 20.0781L63.3906 21.5H62.4141L59.9609 13.0469H61.4062ZM68.0703 20.0234L69.8359 13.0469H71.2734L68.8203 21.5H67.8516L68.0703 20.0234ZM66.2031 13.0469L68.3281 19.8828L68.5703 21.5H67.6484L65.375 14.4141L65.1875 13.0469H66.2031ZM74.2031 14.8516V21.5H72.7578V13.0469H74.125L74.2031 14.8516ZM73.8594 16.9531L73.2578 16.9297C73.263 16.3516 73.349 15.8177 73.5156 15.3281C73.6823 14.8333 73.9167 14.4036 74.2188 14.0391C74.5208 13.6745 74.8802 13.3932 75.2969 13.1953C75.7188 12.9922 76.1849 12.8906 76.6953 12.8906C77.112 12.8906 77.487 12.9479 77.8203 13.0625C78.1536 13.1719 78.4375 13.349 78.6719 13.5938C78.9115 13.8385 79.0938 14.1562 79.2188 14.5469C79.3438 14.9323 79.4062 15.4036 79.4062 15.9609V21.5H77.9531V15.9453C77.9531 15.5026 77.888 15.1484 77.7578 14.8828C77.6276 14.612 77.4375 14.4167 77.1875 14.2969C76.9375 14.1719 76.6302 14.1094 76.2656 14.1094C75.9062 14.1094 75.5781 14.1849 75.2812 14.3359C74.9896 14.487 74.737 14.6953 74.5234 14.9609C74.3151 15.2266 74.151 15.5312 74.0312 15.875C73.9167 16.2135 73.8594 16.5729 73.8594 16.9531ZM83.1719 9.5V21.5H81.7188V9.5H83.1719ZM85.1094 17.3672V17.1875C85.1094 16.5781 85.1979 16.013 85.375 15.4922C85.5521 14.9661 85.8073 14.5104 86.1406 14.125C86.474 13.7344 86.8776 13.4323 87.3516 13.2188C87.8255 13 88.3568 12.8906 88.9453 12.8906C89.5391 12.8906 90.0729 13 90.5469 13.2188C91.026 13.4323 91.4323 13.7344 91.7656 14.125C92.1042 14.5104 92.362 14.9661 92.5391 15.4922C92.7161 16.013 92.8047 16.5781 92.8047 17.1875V17.3672C92.8047 17.9766 92.7161 18.5417 92.5391 19.0625C92.362 19.5833 92.1042 20.0391 91.7656 20.4297C91.4323 20.8151 91.0286 21.1172 90.5547 21.3359C90.0859 21.5495 89.5547 21.6562 88.9609 21.6562C88.3672 21.6562 87.8333 21.5495 87.3594 21.3359C86.8854 21.1172 86.4792 20.8151 86.1406 20.4297C85.8073 20.0391 85.5521 19.5833 85.375 19.0625C85.1979 18.5417 85.1094 17.9766 85.1094 17.3672ZM86.5547 17.1875V17.3672C86.5547 17.7891 86.6042 18.1875 86.7031 18.5625C86.8021 18.9323 86.9505 19.2604 87.1484 19.5469C87.3516 19.8333 87.6042 20.0599 87.9062 20.2266C88.2083 20.388 88.5599 20.4688 88.9609 20.4688C89.3568 20.4688 89.7031 20.388 90 20.2266C90.3021 20.0599 90.5521 19.8333 90.75 19.5469C90.9479 19.2604 91.0964 18.9323 91.1953 18.5625C91.2995 18.1875 91.3516 17.7891 91.3516 17.3672V17.1875C91.3516 16.7708 91.2995 16.3776 91.1953 16.0078C91.0964 15.6328 90.9453 15.3021 90.7422 15.0156C90.5443 14.724 90.2943 14.4948 89.9922 14.3281C89.6953 14.1615 89.3464 14.0781 88.9453 14.0781C88.5495 14.0781 88.2005 14.1615 87.8984 14.3281C87.6016 14.4948 87.3516 14.724 87.1484 15.0156C86.9505 15.3021 86.8021 15.6328 86.7031 16.0078C86.6042 16.3776 86.5547 16.7708 86.5547 17.1875ZM99.6016 20.0547V15.7031C99.6016 15.3698 99.5339 15.0807 99.3984 14.8359C99.2682 14.5859 99.0703 14.3932 98.8047 14.2578C98.5391 14.1224 98.2109 14.0547 97.8203 14.0547C97.4557 14.0547 97.1354 14.1172 96.8594 14.2422C96.5885 14.3672 96.375 14.5312 96.2188 14.7344C96.0677 14.9375 95.9922 15.1562 95.9922 15.3906H94.5469C94.5469 15.0885 94.625 14.7891 94.7812 14.4922C94.9375 14.1953 95.1615 13.9271 95.4531 13.6875C95.75 13.4427 96.1042 13.25 96.5156 13.1094C96.9323 12.9635 97.3958 12.8906 97.9062 12.8906C98.5208 12.8906 99.0625 12.9948 99.5312 13.2031C100.005 13.4115 100.375 13.7266 100.641 14.1484C100.911 14.5651 101.047 15.0885 101.047 15.7188V19.6562C101.047 19.9375 101.07 20.237 101.117 20.5547C101.169 20.8724 101.245 21.1458 101.344 21.375V21.5H99.8359C99.763 21.3333 99.7057 21.112 99.6641 20.8359C99.6224 20.5547 99.6016 20.2943 99.6016 20.0547ZM99.8516 16.375L99.8672 17.3906H98.4062C97.9948 17.3906 97.6276 17.4245 97.3047 17.4922C96.9818 17.5547 96.7109 17.651 96.4922 17.7812C96.2734 17.9115 96.1068 18.0755 95.9922 18.2734C95.8776 18.4661 95.8203 18.6927 95.8203 18.9531C95.8203 19.2188 95.8802 19.4609 96 19.6797C96.1198 19.8984 96.2995 20.0729 96.5391 20.2031C96.7839 20.3281 97.0833 20.3906 97.4375 20.3906C97.8802 20.3906 98.2708 20.2969 98.6094 20.1094C98.9479 19.9219 99.2161 19.6927 99.4141 19.4219C99.6172 19.151 99.7266 18.888 99.7422 18.6328L100.359 19.3281C100.323 19.5469 100.224 19.7891 100.062 20.0547C99.901 20.3203 99.6849 20.5755 99.4141 20.8203C99.1484 21.0599 98.8307 21.2604 98.4609 21.4219C98.0964 21.5781 97.6849 21.6562 97.2266 21.6562C96.6536 21.6562 96.151 21.5443 95.7188 21.3203C95.2917 21.0964 94.9583 20.7969 94.7188 20.4219C94.4844 20.0417 94.3672 19.6172 94.3672 19.1484C94.3672 18.6953 94.4557 18.2969 94.6328 17.9531C94.8099 17.6042 95.0651 17.3151 95.3984 17.0859C95.7318 16.8516 96.1328 16.6745 96.6016 16.5547C97.0703 16.4349 97.5938 16.375 98.1719 16.375H99.8516ZM108.648 19.8594V9.5H110.102V21.5H108.773L108.648 19.8594ZM102.961 17.3672V17.2031C102.961 16.5573 103.039 15.9714 103.195 15.4453C103.357 14.9141 103.583 14.4583 103.875 14.0781C104.172 13.6979 104.523 13.4062 104.93 13.2031C105.341 12.9948 105.799 12.8906 106.305 12.8906C106.836 12.8906 107.299 12.9844 107.695 13.1719C108.096 13.3542 108.435 13.6224 108.711 13.9766C108.992 14.3255 109.214 14.7474 109.375 15.2422C109.536 15.737 109.648 16.2969 109.711 16.9219V17.6406C109.654 18.2604 109.542 18.8177 109.375 19.3125C109.214 19.8073 108.992 20.2292 108.711 20.5781C108.435 20.9271 108.096 21.1953 107.695 21.3828C107.294 21.5651 106.826 21.6562 106.289 21.6562C105.794 21.6562 105.341 21.5495 104.93 21.3359C104.523 21.1224 104.172 20.8229 103.875 20.4375C103.583 20.0521 103.357 19.599 103.195 19.0781C103.039 18.5521 102.961 17.9818 102.961 17.3672ZM104.414 17.2031V17.3672C104.414 17.7891 104.456 18.1849 104.539 18.5547C104.628 18.9245 104.763 19.25 104.945 19.5312C105.128 19.8125 105.359 20.0339 105.641 20.1953C105.922 20.3516 106.258 20.4297 106.648 20.4297C107.128 20.4297 107.521 20.3281 107.828 20.125C108.141 19.9219 108.391 19.6536 108.578 19.3203C108.766 18.987 108.911 18.625 109.016 18.2344V16.3516C108.953 16.0651 108.862 15.7891 108.742 15.5234C108.628 15.2526 108.477 15.013 108.289 14.8047C108.107 14.5911 107.88 14.4219 107.609 14.2969C107.344 14.1719 107.029 14.1094 106.664 14.1094C106.268 14.1094 105.927 14.1927 105.641 14.3594C105.359 14.5208 105.128 14.7448 104.945 15.0312C104.763 15.3125 104.628 15.6406 104.539 16.0156C104.456 16.3854 104.414 16.7812 104.414 17.2031Z",
    fill: "#F47738"
  }));
};
var PrintBtnCommon = function PrintBtnCommon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "41",
    height: "41",
    viewBox: "0 0 41 41",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M32.1663 13.8333H8.83301C6.06634 13.8333 3.83301 16.0667 3.83301 18.8333V28.8333H10.4997V35.5H30.4997V28.8333H37.1663V18.8333C37.1663 16.0667 34.933 13.8333 32.1663 13.8333ZM27.1663 32.1667H13.833V23.8333H27.1663V32.1667ZM32.1663 20.5C31.2497 20.5 30.4997 19.75 30.4997 18.8333C30.4997 17.9167 31.2497 17.1667 32.1663 17.1667C33.083 17.1667 33.833 17.9167 33.833 18.8333C33.833 19.75 33.083 20.5 32.1663 20.5ZM30.4997 5.5H10.4997V12.1667H30.4997V5.5Z",
    fill: "#505A5F"
  }));
};
var WhatsappIconGreen = function WhatsappIconGreen(_ref77) {
  var className = _ref77.className,
    styles = _ref77.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.0566406 24L1.74364 17.837C0.702641 16.033 0.155641 13.988 0.156641 11.891C0.159641 5.335 5.49464 0 12.0496 0C15.2306 0.001 18.2166 1.24 20.4626 3.488C22.7076 5.736 23.9436 8.724 23.9426 11.902C23.9396 18.459 18.6046 23.794 12.0496 23.794C10.0596 23.793 8.09864 23.294 6.36164 22.346L0.0566406 24ZM6.65364 20.193C8.32964 21.188 9.92964 21.784 12.0456 21.785C17.4936 21.785 21.9316 17.351 21.9346 11.9C21.9366 6.438 17.5196 2.01 12.0536 2.008C6.60164 2.008 2.16664 6.442 2.16464 11.892C2.16364 14.117 2.81564 15.783 3.91064 17.526L2.91164 21.174L6.65364 20.193ZM18.0406 14.729C17.9666 14.605 17.7686 14.531 17.4706 14.382C17.1736 14.233 15.7126 13.514 15.4396 13.415C15.1676 13.316 14.9696 13.266 14.7706 13.564C14.5726 13.861 14.0026 14.531 13.8296 14.729C13.6566 14.927 13.4826 14.952 13.1856 14.803C12.8886 14.654 11.9306 14.341 10.7956 13.328C9.91264 12.54 9.31564 11.567 9.14264 11.269C8.96964 10.972 9.12464 10.811 9.27264 10.663C9.40664 10.53 9.56964 10.316 9.71864 10.142C9.86964 9.97 9.91864 9.846 10.0186 9.647C10.1176 9.449 10.0686 9.275 9.99364 9.126C9.91864 8.978 9.32464 7.515 9.07764 6.92C8.83564 6.341 8.59064 6.419 8.40864 6.41L7.83864 6.4C7.64064 6.4 7.31864 6.474 7.04664 6.772C6.77464 7.07 6.00664 7.788 6.00664 9.251C6.00664 10.714 7.07164 12.127 7.21964 12.325C7.36864 12.523 9.31464 15.525 12.2956 16.812C13.0046 17.118 13.5586 17.301 13.9896 17.438C14.7016 17.664 15.3496 17.632 15.8616 17.556C16.4326 17.471 17.6196 16.837 17.8676 16.143C18.1156 15.448 18.1156 14.853 18.0406 14.729Z",
    fill: "#25D366"
  }));
};
var HelpLineIcon = function HelpLineIcon(_ref78) {
  var className = _ref78.className,
    styles = _ref78.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    width: "24",
    height: "18",
    viewBox: "0 0 24 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M22 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H22C23.1 18 23.99 17.1 23.99 16L24 2C24 0.9 23.1 0 22 0ZM8 3C9.66 3 11 4.34 11 6C11 7.66 9.66 9 8 9C6.34 9 5 7.66 5 6C5 4.34 6.34 3 8 3ZM14 15H2V14C2 12 6 10.9 8 10.9C10 10.9 14 12 14 14V15ZM17.85 11H19.49L21 13L19.01 14.99C17.7 14.01 16.73 12.61 16.28 11C16.1 10.36 16 9.69 16 9C16 8.31 16.1 7.64 16.28 7C16.73 5.38 17.7 3.99 19.01 3.01L21 5L19.49 7H17.85C17.63 7.63 17.5 8.3 17.5 9C17.5 9.7 17.63 10.37 17.85 11Z",
    fill: "#0B0C0C"
  }));
};
var ServiceCenterIcon = function ServiceCenterIcon(_ref79) {
  var className = _ref79.className,
    styles = _ref79.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M7 10H4V17H7V10Z",
    fill: "#0B0C0C"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M13.5 10H10.5V17H13.5V10Z",
    fill: "#0B0C0C"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M22 19H2V22H22V19Z",
    fill: "#0B0C0C"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 10H17V17H20V10Z",
    fill: "#0B0C0C"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M12 1L2 6V8H22V6L12 1Z",
    fill: "#0B0C0C"
  }));
};
var TimerIcon = function TimerIcon(_ref80) {
  var className = _ref80.className,
    styles = _ref80.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13.0998 17.3701L14.0998 19.1101C13.1398 19.5501 12.0898 19.84 10.9998 19.9501V17.93C11.7398 17.84 12.4398 17.6501 13.0998 17.3701ZM2.0698 11H0.0498047C0.159805 12.1 0.449805 13.14 0.889805 14.1L2.6298 13.1C2.3498 12.44 2.1598 11.74 2.0698 11ZM13.0998 2.63005L14.0998 0.890049C13.1398 0.450049 12.0998 0.160049 10.9998 0.0500488V2.07005C11.7398 2.16005 12.4398 2.35005 13.0998 2.63005ZM17.9298 9.00005H19.9498C19.8398 7.90005 19.5498 6.86005 19.1098 5.90005L17.3698 6.90005C17.6498 7.56005 17.8398 8.26005 17.9298 9.00005ZM6.8998 17.3701L5.89981 19.1101C6.85981 19.5501 7.9098 19.84 8.9998 19.9501V17.93C8.2598 17.84 7.5598 17.6501 6.8998 17.3701ZM8.9998 2.07005V0.0500488C7.8998 0.160049 6.85981 0.450049 5.89981 0.890049L6.8998 2.63005C7.5598 2.35005 8.2598 2.16005 8.9998 2.07005ZM16.3598 5.17005L18.0998 4.16005C17.4698 3.29005 16.6998 2.52005 15.8298 1.89005L14.8198 3.63005C15.4098 4.08005 15.9198 4.59005 16.3598 5.17005ZM2.6298 6.90005L0.889805 5.90005C0.449805 6.86005 0.159805 7.90005 0.0498047 9.00005H2.0698C2.1598 8.26005 2.3498 7.56005 2.6298 6.90005ZM17.9298 11C17.8398 11.74 17.6498 12.44 17.3698 13.1L19.1098 14.1C19.5498 13.14 19.8398 12.09 19.9498 11H17.9298ZM14.8298 16.3601L15.8398 18.1C16.7098 17.4701 17.4798 16.7 18.1098 15.83L16.3698 14.82C15.9198 15.41 15.4098 15.9201 14.8298 16.3601ZM5.1698 3.64005L4.1698 1.89005C3.2898 2.53005 2.5298 3.29005 1.8998 4.17005L3.6398 5.18005C4.0798 4.59005 4.5898 4.08005 5.1698 3.64005ZM3.6398 14.83L1.8998 15.83C2.5298 16.7 3.2998 17.4701 4.1698 18.1L5.1798 16.3601C4.5898 15.9201 4.0798 15.41 3.6398 14.83ZM10.9998 5.00005H8.9998V10.41L13.2898 14.7L14.6998 13.29L10.9998 9.59005V5.00005Z",
    fill: "#F47738"
  }));
};
var RupeeSymbol = function RupeeSymbol(_ref81) {
  var className = _ref81.className,
    styles = _ref81.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    width: "13",
    height: "18",
    viewBox: "0 0 13 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11.5781 3.26953H9.12891C9.48828 3.83203 9.72266 4.48438 9.83203 5.22656H12.1875L11.5664 7.54688H9.82031C9.64062 8.71094 9.17578 9.63672 8.42578 10.3242C7.67578 11.0117 6.59766 11.4922 5.19141 11.7656L10.3125 17.8359V18H6.43359L0.761719 11.3555L0.75 9.29297H3.52734C4.97266 9.29297 5.87891 8.71094 6.24609 7.54688H0.46875L1.07812 5.22656H6.17578C5.79297 4.28125 4.95312 3.80078 3.65625 3.78516H0.46875L1.16016 0.9375H12.1875L11.5781 3.26953Z",
    fill: "#F47738"
  }));
};
var ValidityTimeIcon = function ValidityTimeIcon(_ref82) {
  var className = _ref82.className,
    styles = _ref82.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    style: _extends({}, styles),
    width: "21",
    height: "18",
    viewBox: "0 0 21 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M12 0C7.03 0 3 4.03 3 9H0L3.89 12.89L3.96 13.03L8 9H5C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9C19 12.87 15.87 16 12 16C10.07 16 8.32 15.21 7.06 13.94L5.64 15.36C7.27 16.99 9.51 18 12 18C16.97 18 21 13.97 21 9C21 4.03 16.97 0 12 0ZM11 5V10L15.28 12.54L16 11.33L12.5 9.25V5H11Z",
    fill: "#F47738"
  }));
};
var AddIcon = function AddIcon(_ref83) {
  var styles = _ref83.styles,
    className = _ref83.className,
    _ref83$fill = _ref83.fill,
    fill = _ref83$fill === void 0 ? "white" : _ref83$fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "14",
    height: "14",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11.7896 2.58402C9.24786 0.0490554 5.13886 0.0490554 2.59717 2.58402C0.0554699 5.11898 0.0554701 9.21709 2.59717 11.752C5.13886 14.287 9.24786 14.287 11.7896 11.752C14.3312 9.21709 14.3312 5.11898 11.7896 2.58402ZM7.84142 11.1057H6.5453V7.81438H3.24523L3.24523 6.52169H6.5453V3.23036H7.84142V6.52169H11.1415L11.1415 7.81438H7.84142V11.1057Z",
    fill: fill
  }));
};
var SubtractIcon = function SubtractIcon(_ref84) {
  var styles = _ref84.styles,
    className = _ref84.className,
    _ref84$fill = _ref84.fill,
    fill = _ref84$fill === void 0 ? "white" : _ref84$fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "12",
    height: "14",
    className: className,
    style: _extends({}, styles),
    viewBox: "0 0 12 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M9.24609 0.783203V3.45508H0.667969V0.783203H9.24609Z",
    fill: fill
  }));
};
var AddNewIcon = function AddNewIcon(_ref85) {
  var style = _ref85.style;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: style,
    width: "24",
    height: "24",
    viewBox: "0 0 30 30",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M23.3333 14.5833C24.3542 14.5833 25.3312 14.7729 26.25 15.0938V8.75L17.5 0H2.91667C1.29792 0 0 1.29792 0 2.91667V23.3333C0 24.9521 1.3125 26.25 2.91667 26.25H15.0938C14.7729 25.3312 14.5833 24.3542 14.5833 23.3333C14.5833 18.5062 18.5062 14.5833 23.3333 14.5833ZM16.0417 2.1875L24.0625 10.2083H16.0417V2.1875ZM29.1667 21.875V24.7917H24.7917V29.1667H21.875V24.7917H17.5V21.875H21.875V17.5H24.7917V21.875H29.1667Z",
    fill: "#F47738"
  }));
};
var ViewReportIcon = function ViewReportIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 30 30",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M26.6667 0H3.33333C1.5 0 0 1.5 0 3.33333V26.6667C0 28.5 1.5 30 3.33333 30H26.6667C28.5 30 30 28.5 30 26.6667V3.33333C30 1.5 28.5 0 26.6667 0ZM18.3333 23.3333H6.66667V20H18.3333V23.3333ZM23.3333 16.6667H6.66667V13.3333H23.3333V16.6667ZM23.3333 10H6.66667V6.66667H23.3333V10Z",
    fill: "#F47738"
  }));
};
var InboxIcon = function InboxIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 30 30",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M26.6667 0H3.33333C1.5 0 0 1.5 0 3.33333V15C0 16.8333 1.5 18.3333 3.33333 18.3333H26.6667C28.5 18.3333 30 16.8333 30 15V3.33333C30 1.5 28.5 0 26.6667 0ZM26.6667 10H20C20 12.7 17.7 15 15 15C12.3 15 10 12.7 10 10H3.33333V3.33333H26.6667V10ZM20 21.6667H30V26.6667C30 28.5 28.5 30 26.6667 30H3.33333C1.5 30 0 28.5 0 26.6667V21.6667H10C10 24.4333 12.2333 26.6667 15 26.6667C17.7667 26.6667 20 24.4333 20 21.6667Z",
    fill: "#F47738"
  }));
};
var AddFilled = function AddFilled(_ref86) {
  var _ref86$style = _ref86.style,
    style = _ref86$style === void 0 ? {} : _ref86$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "15",
    height: "15",
    style: style,
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M12.8828 2.98323C10.1643 0.227501 5.7393 0.19747 2.98357 2.91604C0.227848 5.63461 0.197817 10.0596 2.91639 12.8153C5.63496 15.571 10.0599 15.6011 12.8157 12.8825C15.5714 10.1639 15.6014 5.73895 12.8828 2.98323ZM8.56866 12.1557L7.17286 12.1463L7.19698 8.59243L3.64314 8.56831L3.65261 7.17251L7.20645 7.19663L7.23057 3.6428L8.62637 3.65227L8.60225 7.20611L12.1561 7.23022L12.1466 8.62602L8.59278 8.6019L8.56866 12.1557Z",
    fill: "#F47738"
  }));
};
var NoResultsFoundIcon = function NoResultsFoundIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "336",
    height: "262",
    viewBox: "0 0 336 262",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("g", {
    "clip-path": "url(#clip0_7426_33765)"
  }, /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M117.863 256.926C150.233 256.926 176.474 251.972 176.474 245.862C176.474 239.751 150.233 234.797 117.863 234.797C85.4937 234.797 59.2529 239.751 59.2529 245.862C59.2529 251.972 85.4937 256.926 117.863 256.926Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M195.218 36.9475C173.677 36.2045 153.162 29.2725 133.572 21.6904C113.982 14.1083 94.5782 5.71033 73.5537 1.69374C60.031 -0.890006 44.5647 -1.25817 33.6713 5.95908C23.184 12.9243 19.7958 24.9143 17.9753 36.0486C16.604 44.4267 15.7986 53.246 19.5529 61.0901C22.1622 66.5362 26.7885 71.1133 29.9903 76.3306C41.1299 94.4798 33.2553 116.861 21.187 134.583C15.529 142.894 8.95573 150.835 4.58574 159.674C0.215751 168.513 -1.8045 178.676 2.01966 187.717C5.80721 196.672 14.8367 203.385 24.6185 208.112C44.4848 217.714 67.8857 220.46 90.7208 222.019C141.254 225.462 192.053 223.972 242.719 222.477C261.47 221.926 280.301 221.365 298.746 218.477C308.991 216.871 319.564 214.324 327.003 208.175C336.442 200.37 338.782 187.156 332.455 177.372C321.844 160.954 292.516 156.878 285.091 139.263C281.01 129.564 285.2 118.765 291.135 109.773C303.862 90.4798 325.193 73.5544 326.314 51.5047C327.086 36.3604 316.832 21.1929 300.976 14.0254C284.358 6.51298 261.31 7.45825 249.056 19.8927C236.425 32.6821 214.239 37.6075 195.218 36.9475Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M178.101 119.976L167.907 113.127L173.049 105.499L146.123 103.359L136.448 110.815L124.336 104.049L114.235 105.26L114.115 102.607C113.99 99.8403 113.711 97.0832 113.28 94.3478C113.323 93.5186 113.353 92.5667 113.35 91.5319C113.35 87.1704 112.757 81.3893 110.155 77.5352L110.754 72.1687L105.895 66.4473C106.675 64.8982 107.565 63.4064 108.557 61.983C108.724 61.7441 108.89 61.512 109.07 61.2864C115.377 60.832 120.353 55.6645 120.353 49.3461C120.353 49.0543 120.353 48.7624 120.319 48.4738C120.319 48.3577 120.296 48.2383 120.283 48.1223C120.898 48.4539 121.521 48.7856 122.143 49.1173C122.26 49.2831 122.393 49.449 122.539 49.6446L122.569 49.6811L122.756 49.91L122.815 49.9796C122.882 50.0592 122.952 50.1355 123.022 50.2151L123.068 50.2682C123.245 50.4639 123.431 50.6629 123.631 50.8586C123.655 50.8779 123.677 50.8989 123.697 50.9216L123.947 51.1538L124.017 51.2168C124.23 51.4058 124.456 51.5883 124.683 51.7607L124.756 51.8138L125.042 52.0095L125.135 52.0692C125.245 52.1355 125.358 52.2052 125.468 52.2682L125.508 52.2914C125.638 52.3611 125.771 52.4274 125.904 52.4904L125.971 52.517C126.084 52.5656 126.195 52.612 126.303 52.6563L126.407 52.6927C126.523 52.7325 126.636 52.769 126.756 52.8022L126.829 52.8221C126.976 52.8586 127.122 52.8884 127.272 52.9116H127.289C127.43 52.9344 127.572 52.9488 127.715 52.9548H127.811C127.939 52.9614 128.066 52.9614 128.194 52.9548H128.277C128.437 52.9456 128.596 52.9268 128.753 52.8984C129.498 52.8008 130.213 52.5452 130.85 52.1488C131.012 52.0407 131.156 51.9075 131.276 51.7541C131.941 50.8851 131.209 49.9332 131.209 49.9332C130.95 49.3163 129.266 48.8818 129.266 48.8818C129.266 48.8818 123.94 46.6662 123.94 44.9017C123.94 43.1372 122.609 33.983 108.867 31.8901C108.867 31.8901 99.927 31.3893 97.4142 36.1587L97.361 36.716C96.6221 37.177 96.0097 38.1024 95.2808 38.3743C94.9659 38.4417 94.6622 38.5534 94.3788 38.706V38.643C94.2947 38.7163 94.2257 38.8053 94.1758 38.905C94.0193 39.2155 93.9254 39.5535 93.8996 39.9C93.8246 40.3233 93.6771 40.7306 93.4636 41.104C93.404 41.2101 93.3373 41.3121 93.2639 41.4092L93.2073 41.4987C93.5937 41.5287 93.9817 41.4662 94.3389 41.3163C94.2826 41.7704 94.1709 42.2159 94.0061 42.643C94.2177 42.6498 94.4268 42.5959 94.6085 42.4877C94.7902 42.3795 94.9369 42.2216 95.0312 42.0327V42.0062L95.0745 41.9465C95.1582 41.7929 95.2272 41.6319 95.2808 41.4655L95.2442 41.5053C95.3108 41.2898 95.3707 41.0708 95.4439 40.8586C95.4774 40.739 95.5327 40.6266 95.607 40.5269C95.6958 40.4377 95.8044 40.3705 95.9241 40.3307C96.0438 40.291 96.1711 40.2798 96.2959 40.298L96.1595 43.1737H96.2194C96.1392 43.3828 96.0412 43.5848 95.9265 43.7773C95.4539 44.5402 94.5952 45.0609 94.279 45.8967C94.1427 46.2998 94.0906 46.7265 94.1259 47.1504C94.1259 47.3992 94.1559 47.6513 94.1758 47.9V47.8801C94.2224 48.5435 94.2357 49.1737 93.8763 49.7077C93.63 50.0725 93.2339 50.3478 93.0975 50.7624C93.0597 50.8779 93.0428 50.9992 93.0475 51.1206C93.0743 51.4841 93.1504 51.8422 93.2739 52.1853C93.2753 52.1787 93.2753 52.1719 93.2739 52.1654C93.3569 52.4177 93.3763 52.6865 93.3305 52.9481C93.1807 53.6115 92.3719 54.1654 92.4119 54.7989C92.4096 54.8822 92.422 54.9653 92.4485 55.0443C92.6041 55.3537 92.8735 55.5914 93.2007 55.7077C93.7138 55.9985 94.3031 56.1279 94.8914 56.0791C95.1119 56.0394 95.3251 55.9668 95.5238 55.8636C95.2908 56.3975 95.0512 56.9249 94.8082 57.4257C94.7716 57.5053 94.7316 57.5849 94.6917 57.6645C94.6917 57.6645 92.6348 56.2947 91.4666 59.0874C91.1256 59.6678 90.8817 60.2996 90.7444 60.9581C90.6859 61.2215 90.6034 61.479 90.4981 61.7276C89.9795 62.6025 89.2033 63.2973 88.2748 63.7176C85.8918 64.8055 76.2665 76.769 76.0968 79.8669C76.0135 81.0761 75.8083 82.274 75.4844 83.4423C74.7267 86.1937 74.532 89.0688 74.9119 91.8967C75.0308 92.8106 75.2279 93.7128 75.501 94.5932C76.5228 97.6878 77.2051 103.462 77.2051 103.462L78.3101 113.485C78.269 114.869 78.3291 116.253 78.4898 117.628C77.3615 118.912 72.8318 124.262 74.5625 125.718C75.8938 126.865 78.2235 126.676 79.5315 126.441C78.4299 129.157 76.6959 133.88 76.4662 137.124C76.1334 141.923 77.0353 148.281 78.4632 150.723C79.891 153.164 84.6504 159.426 84.6504 159.426C84.6504 159.426 84.4274 168.016 86.1281 171.137C87.8289 174.258 88.5145 180.733 88.5145 180.733C88.5145 180.733 90.1021 186.199 89.3066 188.208C88.5111 190.218 90.781 191.89 88.398 193.227C86.015 194.563 82.9663 224.689 82.9663 224.689C82.9663 224.689 81.7382 244.434 82.9663 245.439C83.032 245.487 83.1022 245.528 83.176 245.562V252.195C83.176 252.195 82.3239 253.588 85.7886 253.87C88.1617 254.059 94.8881 254.487 98.8786 254.736L101.971 254.928C101.971 254.928 109.293 256.381 112.528 254.928C115.763 253.475 121.497 253.509 120.645 249.671C120.532 249.149 120.381 248.636 120.193 248.136C119.258 245.754 117.67 245.482 114.744 244.819C114.575 244.782 114.412 244.749 114.262 244.723C111.18 244.189 110.168 245.618 108.441 243.757C106.94 242.149 102.16 240.348 100.533 239.777C100.573 239.658 100.623 239.542 100.663 239.419C100.202 239.341 99.7731 239.133 99.4278 238.819L103.838 239.097L106.464 239.26C106.464 239.26 112.688 240.497 115.45 239.26C118.212 238.023 123.072 238.056 122.346 234.796C122.251 234.351 122.123 233.915 121.963 233.489C121.168 231.466 119.817 231.243 117.33 230.683C117.187 230.653 117.054 230.623 116.921 230.6C114.302 230.145 113.443 231.359 111.975 229.781C110.717 228.434 106.747 226.925 105.319 226.411C105.319 225.674 104.32 224.626 103.691 223.575C102.952 222.348 104.317 218.053 104.317 218.053L105.096 200.232C105.392 200.1 105.706 200.011 106.028 199.966C106.028 199.966 109.549 196.616 108.754 193.048C108.591 191.968 108.507 190.879 108.501 189.787C109.659 188.716 111.253 187.134 111.706 186.159C112.445 184.57 111.706 176.872 111.706 176.872V147.436L117.597 148.029L122.942 148.577L124.569 148.743L129.915 149.28L142.199 150.517L153.269 148.427L158.058 147.525L167.907 145.668V121.655L178.101 119.976ZM97.0215 40.4042L96.3359 40.3312C96.5622 40.3412 96.8018 40.3843 97.0215 40.4042Z",
    fill: "url(#paint0_linear_7426_33765)"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M154.207 135.571C150.879 140.318 138.914 137.803 138.914 137.803L129.642 129.157L128.394 127.986L130.487 123.555C130.487 123.555 131.153 123.737 132.294 124.062C138.288 125.797 157.016 131.581 154.207 135.571Z",
    fill: "#EFB7B9"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M132.288 124.062C131.878 125.482 130.757 127.608 129.642 129.157L128.394 127.986L130.487 123.555C130.487 123.555 131.159 123.737 132.288 124.062Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M100.486 74.0925C100.486 74.0925 91.9393 77.8703 92.3587 87.1472C92.6604 93.1239 93.3139 99.0777 94.3157 104.978C94.3157 104.978 92.5684 118.938 99.8439 122.537C107.119 126.136 113.853 129.094 113.853 129.094C113.853 129.094 125.235 130.315 126.65 130.819C128.064 131.323 132.484 123.615 131.669 122.414C130.853 121.214 120.406 118.696 119.075 116.693C117.743 114.689 114.665 113.452 114.665 113.452C114.665 113.452 111.486 111.535 111.27 109.804C111.053 108.073 111.892 106.782 112.105 106.023C112.318 105.263 112.857 97.93 112.857 97.93C112.857 97.93 116.445 71.8271 100.486 74.0925Z",
    fill: "#DCE6F2"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M106.128 104.594C106.128 104.594 94.4024 106.551 95.5373 110.64C95.5373 110.64 99.7942 106.226 106.128 104.594Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M106.218 106.25C106.218 106.25 99.7713 111.494 101.033 111.762C102.294 112.031 106.218 106.25 106.218 106.25Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M109.316 108.078C109.316 108.078 107.589 111.604 108.651 111.365C109.712 111.126 109.316 108.078 109.316 108.078Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M132.72 124.441L132.008 124.239C132.211 123.575 132.268 123.038 132.101 122.789C131.286 121.589 120.845 119.074 119.517 117.068C118.189 115.061 115.107 113.827 115.107 113.827C115.107 113.827 111.929 111.91 111.713 110.179C111.496 108.448 112.335 107.157 112.548 106.398C112.761 105.638 113.3 98.3017 113.3 98.3017C113.3 98.3017 116.878 72.2022 100.919 74.4675C100.919 74.4675 92.3721 78.2486 92.7881 87.5255C93.09 93.5023 93.7446 99.4563 94.7485 105.356C94.7485 105.356 93.0012 119.317 100.277 122.915C107.552 126.514 114.285 129.472 114.285 129.472C114.285 129.472 125.665 130.69 127.082 131.197C127.618 131.39 128.587 130.398 129.535 129.035L130.075 129.536L139.347 138.179C139.347 138.179 151.312 140.696 154.64 135.95C157.453 131.957 138.728 126.172 132.72 124.441Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M95.5671 39.2748C95.2413 39.3382 94.9292 39.4584 94.6452 39.6296C94.3123 39.9049 94.3123 40.3759 94.2291 40.7872C94.1314 41.3593 93.9037 41.9016 93.5635 42.3726C93.9422 42.4003 94.3221 42.3378 94.6718 42.1902C94.6148 42.6441 94.5031 43.0896 94.339 43.5169C94.5463 43.5221 94.7508 43.4677 94.9279 43.36C95.105 43.2524 95.2472 43.0961 95.3374 42.9099C95.5135 42.5362 95.6529 42.1463 95.7535 41.7457C95.7847 41.6259 95.839 41.5133 95.9132 41.4141C96.2194 41.0525 96.7885 41.2151 97.2612 41.2615C97.6545 41.2945 98.0495 41.2222 98.4053 41.0519C98.7611 40.8816 99.0647 40.6196 99.2847 40.293C99.7873 39.5335 99.8172 37.5898 98.6191 37.3842C97.3677 37.1786 96.5888 38.8966 95.5671 39.2748Z",
    fill: "#965D7B"
  }), /*#__PURE__*/React__default.createElement("g", {
    opacity: "0.1"
  }, /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M94.6118 40.0333C94.6417 39.8707 94.6617 39.7016 94.6983 39.5391C94.3821 39.8144 94.3655 40.282 94.2823 40.6966C94.2404 40.9358 94.1746 41.1703 94.0859 41.3964C94.348 40.9802 94.5266 40.5173 94.6118 40.0333Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M94.7183 42.772C94.884 42.3453 94.9958 41.8996 95.0511 41.4453C94.7178 41.5851 94.357 41.6475 93.996 41.6277C93.8909 41.861 93.7627 42.0832 93.6133 42.2911C93.9907 42.3202 94.3696 42.2588 94.7183 42.112C94.663 42.5663 94.5512 43.0119 94.3854 43.4387C94.5927 43.4435 94.7971 43.3889 94.9741 43.2813C95.1511 43.1737 95.2934 43.0176 95.3839 42.8317C95.4668 42.681 95.5338 42.522 95.5836 42.3574C95.4859 42.4934 95.3555 42.6027 95.2042 42.6752C95.053 42.7476 94.8858 42.7809 94.7183 42.772Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M97.6407 40.5157C97.1681 40.4693 96.5956 40.3068 96.2894 40.6683C96.2165 40.7684 96.1624 40.8807 96.1297 41C96.0997 41.0862 96.0731 41.1758 96.0498 41.2653C96.366 41.0166 96.8785 41.1492 97.3079 41.1924C97.7011 41.2243 98.0957 41.1515 98.4513 40.9813C98.8069 40.8111 99.1107 40.5497 99.3314 40.2239C99.4323 40.0628 99.5076 39.8871 99.5544 39.7031C99.3265 39.9843 99.0328 40.2054 98.6992 40.347C98.3655 40.4887 98.0021 40.5466 97.6407 40.5157Z",
    fill: "black"
  })), /*#__PURE__*/React__default.createElement("path", {
    d: "M105.585 66.6641L110.661 72.747L109.998 78.8863L103.864 69.3175L105.585 66.6641Z",
    fill: "#DCE6F2"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M110.657 72.747L110.035 78.5214L109.995 78.8863L104.46 70.2495L103.864 69.3175L104.037 69.0488L105.582 66.6641L105.924 67.0753L110.657 72.747Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M113.293 58.4308C111.576 58.9217 109.935 60.6066 108.507 62.653C107.542 64.065 106.679 65.5436 105.925 67.0776C105.455 68.0129 105.043 68.9117 104.7 69.6945L104.46 70.2517C103.881 71.6149 103.558 72.527 103.558 72.527C103.558 72.527 90.4116 62.6763 92.4917 62.0129C93.1907 61.7907 94.1092 60.2982 95.0179 58.4176L95.131 58.1788C95.7068 56.9715 96.2726 55.6249 96.7752 54.3579C97.8036 51.7542 98.5658 49.4922 98.5658 49.4922C98.5658 49.4922 118.535 56.9383 113.293 58.4308Z",
    fill: "#EFB7B9"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M121.158 48.9375C121.158 48.9375 124.194 54.4101 128.271 53.6639C132.348 52.9176 130.67 50.7252 130.67 50.7252L121.158 48.9375Z",
    fill: "#0B4B66"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M115.277 238.376C112.588 239.6 106.507 238.376 106.507 238.376L103.945 238.217C100.616 238.005 95.0449 237.647 93.0746 237.488C90.199 237.252 90.9046 236.078 90.9046 236.078V228.983L104.857 225.461C104.857 225.461 110.372 227.342 111.883 228.983C113.317 230.549 114.156 229.345 116.715 229.796C116.842 229.819 116.975 229.846 117.115 229.879C119.544 230.433 120.862 230.652 121.641 232.658C121.797 233.08 121.923 233.512 122.017 233.952C122.736 237.182 117.963 237.159 115.277 238.376Z",
    fill: "#A36468"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M121.641 232.659C121.141 232.971 120.616 233.239 120.07 233.462C118.24 234.294 116.499 235.309 114.648 236.095C112.798 236.881 110.804 237.442 108.801 237.293C107.752 237.216 106.68 236.961 105.679 237.26C105.059 237.498 104.476 237.82 103.945 238.218C100.616 238.006 95.0449 237.648 93.0746 237.488C90.199 237.253 90.9046 236.079 90.9046 236.079V235.25C91.0078 235.25 91.1243 235.22 91.2574 235.21C91.9462 235.199 92.632 235.301 93.2876 235.512C94.7321 235.903 96.1699 236.288 97.6143 236.672C97.7331 236.226 97.942 235.808 98.228 235.444C98.5141 235.08 98.8715 234.778 99.2785 234.556C100.103 234.12 101.028 233.909 101.961 233.943C104.201 233.973 106.321 235.031 108.558 235.137C109.183 235.194 109.812 235.089 110.385 234.832C110.691 234.679 110.961 234.457 111.26 234.288C111.74 234.057 112.246 233.886 112.768 233.78C114.235 233.416 115.675 232.953 117.078 232.394C117.477 232.238 117.943 231.956 117.89 231.532C117.82 230.968 116.932 230.901 116.699 230.384C116.657 230.291 116.638 230.189 116.643 230.087C116.648 229.986 116.676 229.886 116.725 229.797C116.852 229.82 116.985 229.847 117.125 229.88C119.544 230.434 120.862 230.653 121.641 232.659Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M112.435 253.896C109.273 255.335 102.118 253.896 102.118 253.896L99.1055 253.72C95.2048 253.471 88.6348 253.057 86.315 252.861C82.9302 252.583 83.7623 251.203 83.7623 251.203V242.841L100.181 238.695C100.181 238.695 106.671 240.908 108.448 242.841C110.135 244.682 111.11 243.266 114.136 243.796C114.286 243.823 114.442 243.856 114.605 243.893C117.464 244.556 119.015 244.805 119.93 247.166C120.116 247.662 120.264 248.171 120.373 248.689C121.198 252.49 115.597 252.46 112.435 253.896Z",
    fill: "#A36468"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M119.924 247.166C119.336 247.532 118.718 247.848 118.077 248.111C115.923 249.089 113.873 250.283 111.696 251.209C109.52 252.134 107.173 252.791 104.813 252.618C103.582 252.529 102.321 252.22 101.152 252.579C100.42 252.863 99.7315 253.247 99.1055 253.72C95.2048 253.471 88.6348 253.056 86.315 252.861C82.9302 252.582 83.7623 251.202 83.7623 251.202V250.227C83.9001 250.205 84.0389 250.189 84.1783 250.181C84.9891 250.166 85.7967 250.286 86.568 250.536L91.6569 251.902C91.7986 251.375 92.0468 250.882 92.3861 250.454C92.7255 250.026 93.1489 249.671 93.6305 249.411C94.6006 248.896 95.6905 248.646 96.789 248.688C99.425 248.725 101.918 249.968 104.551 250.094C105.284 250.161 106.022 250.039 106.694 249.74C107.057 249.557 107.36 249.295 107.726 249.099C108.289 248.825 108.885 248.624 109.5 248.502C111.216 248.071 112.902 247.526 114.545 246.871C115.015 246.685 115.564 246.353 115.5 245.856C115.417 245.192 114.372 245.113 114.096 244.502C114.049 244.392 114.028 244.273 114.034 244.154C114.04 244.034 114.072 243.918 114.129 243.812C114.279 243.839 114.435 243.872 114.598 243.909C117.457 244.545 119.008 244.804 119.924 247.166Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M105.279 196.523L104.39 217.363C104.39 217.363 103.059 221.618 103.781 222.835C104.503 224.052 105.721 225.266 105.279 225.986C104.836 226.706 99.5109 234.487 97.7902 231.502C96.0695 228.517 94.3721 215.581 94.3721 215.581L95.9596 199.605L105.279 196.523Z",
    fill: "#0B4B66"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M109.133 144.602L111.603 147.892V176.509C111.603 176.509 112.325 184.137 111.603 185.713C110.88 187.288 107.219 190.439 107.219 190.439L104.141 174.684L104.806 158.018L109.133 144.602Z",
    fill: "#0B4B66"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M105.279 196.523L104.39 217.363C104.39 217.363 103.059 221.618 103.781 222.835C104.503 224.052 105.721 225.266 105.279 225.986C104.836 226.706 99.5109 234.487 97.7902 231.502C96.0695 228.517 94.3721 215.581 94.3721 215.581L95.9596 199.605L105.279 196.523Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M109.133 144.602L111.603 147.892V176.509C111.603 176.509 112.325 184.137 111.603 185.713C110.88 187.288 107.219 190.439 107.219 190.439L104.141 174.684L104.806 158.018L109.133 144.602Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M111.603 132.398V147.877L108.83 159.927C108.83 159.927 107.942 189.005 108.717 192.54C109.492 196.076 106.054 199.396 106.054 199.396C106.054 199.396 104.057 199.618 104.057 201.164C104.057 202.71 100.729 207.134 100.729 207.134L100.839 215.758C100.839 215.758 102.283 231.9 100.064 234.995C97.8436 238.089 100.839 238.534 100.839 238.534C98.0666 247.598 84.7536 245.499 83.5521 244.504C82.3506 243.509 83.5521 223.94 83.5521 223.94C83.5521 223.94 86.5276 194.089 88.8573 192.763C91.1871 191.436 88.9705 189.777 89.746 187.787C90.5215 185.797 88.9705 180.381 88.9705 180.381C88.9705 180.381 88.3048 173.967 86.6407 170.872C84.9766 167.777 85.1963 159.263 85.1963 159.263C85.1963 159.263 80.5367 153.071 79.1522 150.64C77.7676 148.209 76.8756 141.907 77.2085 137.151C77.4348 133.937 79.1289 129.257 80.2039 126.564C80.7198 125.273 81.0925 124.438 81.0925 124.438L81.4087 124.52L99.5876 129.263L111.603 132.398Z",
    fill: "#0B4B66"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M113.294 58.4306C111.577 58.9215 109.936 60.6064 108.508 62.6528H108.135C106.042 62.6543 103.986 62.1052 102.174 61.061C100.363 60.0168 98.8599 58.5145 97.8175 56.7059C97.3819 55.9565 97.0314 55.1611 96.7725 54.3344C97.8009 51.7308 98.5631 49.4688 98.5631 49.4688C98.5631 49.4688 118.536 56.9381 113.294 58.4306Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M120.033 50.1397C120.036 51.9545 119.621 53.7458 118.82 55.3755C118.019 57.0053 116.853 58.43 115.412 59.5399C113.971 60.6499 112.294 61.4155 110.51 61.7777C108.725 62.14 106.881 62.0892 105.12 61.6293C103.358 61.1694 101.726 60.3127 100.349 59.1251C98.9717 57.9376 97.8865 56.4508 97.1769 54.7795C96.4673 53.1082 96.1521 51.2968 96.2556 49.4849C96.3591 47.6731 96.8786 45.9091 97.774 44.3288C98.1347 43.6867 98.5559 43.0803 99.032 42.5179C99.8169 41.586 100.739 40.7786 101.768 40.1232C103.505 39.0231 105.499 38.3908 107.555 38.2883C109.61 38.1857 111.657 38.6163 113.496 39.538C115.335 40.4597 116.902 41.841 118.045 43.5469C119.188 45.2528 119.867 47.225 120.017 49.2708C120.023 49.5626 120.033 49.8512 120.033 50.1397Z",
    fill: "#EFB7B9"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M110.035 78.5246L109.995 78.8895L104.46 70.2659C103.881 71.6291 103.558 72.5412 103.558 72.5412C103.558 72.5412 90.4116 62.6772 92.4917 62.0138C93.1907 61.7916 94.1092 60.2991 95.0179 58.4185L95.131 58.1797C96.0962 61.0454 101.704 66.7734 104.037 69.0686C104.307 69.3339 104.53 69.5528 104.703 69.712L105.059 70.0437L105.246 70.2294C106.094 71.1017 109.675 74.9492 110.035 78.5246Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M114.172 107.788L113.566 127.214L113.46 130.673C113.46 130.673 106.284 130.01 99.5875 129.28C94.1958 128.693 89.1135 128.06 88.3314 127.688C87.3329 127.22 85.1929 126.859 83.5054 126.63C82.2008 126.454 81.1757 126.361 81.1757 126.361C81.1757 126.361 80.7929 126.474 80.2038 126.58C78.9191 126.812 76.6625 127.002 75.3479 125.864C73.6671 124.408 78.0837 119.118 79.1854 117.847L79.4283 117.572L79.0123 113.741L77.9306 103.808C77.9306 103.808 77.265 98.0861 76.2665 95.0181C75.9995 94.1458 75.8069 93.2527 75.6907 92.3481C75.3197 89.546 75.5098 86.6985 76.2498 83.97C76.566 82.8107 76.7667 81.623 76.8489 80.4244C77.0153 77.3564 86.4176 65.499 88.7474 64.4211C89.7955 63.9341 90.6388 63.096 91.1305 62.0529C91.2928 61.725 91.4146 61.3786 91.4932 61.0214C92.4917 56.7097 95.0178 58.4211 95.0178 58.4211C95.6269 61.7942 105.056 70.7229 105.056 70.7229L105.242 70.9087C106.177 71.8639 110.344 76.3481 110.048 80.1757C109.989 81.6002 110.203 83.023 110.677 84.368C112.595 90.3862 113.698 96.6327 113.956 102.942L114.172 107.788Z",
    fill: "#DCE6F2"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M100.812 84.7188C100.812 84.7188 98.4824 90.3572 96.7351 91.2693C94.9877 92.1815 101.644 93.1931 100.812 84.7188Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M102.56 95.25C102.56 95.25 97.2344 95.9133 97.2344 96.9084C97.2344 97.9034 102.56 95.25 102.56 95.25Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M108.135 101.711C108.135 101.711 100.397 118.129 98.2333 118.626C96.0699 119.124 108.135 101.711 108.135 101.711Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M104.909 71.5493L98.509 74.3221L90.7842 62.6936C90.9465 62.3656 91.0683 62.0192 91.147 61.6621C92.1454 57.3503 94.6716 59.0617 94.6716 59.0617C95.2806 62.4349 104.71 71.3636 104.71 71.3636L104.909 71.5493Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M105.242 70.8852L98.842 73.658L91.1172 62.0295C91.2795 61.7015 91.4013 61.3552 91.48 60.998C92.4784 56.6862 95.0046 58.3977 95.0046 58.3977C95.6136 61.7708 105.043 70.6995 105.043 70.6995L105.242 70.8852Z",
    fill: "#DCE6F2"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M113.46 130.668C113.46 130.668 106.285 130.004 99.5882 129.275L111.603 132.409V136.057C111.077 136.532 110.621 136.777 110.325 136.651C108.941 136.071 97.6412 134.246 97.6412 134.246C97.6412 134.246 91.0779 130.93 83.9954 126.95C83.8234 126.855 83.6568 126.751 83.4961 126.638C82.6703 126.079 81.9587 125.369 81.3993 124.545C80.0913 122.658 79.4523 120.233 79.1761 117.855C79.0208 116.492 78.9629 115.12 79.003 113.749C79.0373 112.194 79.1796 110.644 79.429 109.109C78.744 103.163 78.4106 97.1828 78.4305 91.1983C78.5137 81.9114 87.2504 78.5946 87.2504 78.5946C103.309 77.185 98.3301 103.056 98.3301 103.056C98.3301 103.056 97.4015 110.353 97.1486 111.099C96.8956 111.845 95.987 113.089 96.1102 114.83C96.2333 116.571 99.302 118.654 99.302 118.654C99.302 118.654 102.297 120.054 103.532 122.127C104.431 123.656 110.269 125.729 113.567 127.208L113.46 130.668Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M118.839 42.773C118.845 43.3193 118.731 43.8604 118.506 44.3584C118.335 44.7648 118.137 45.1593 117.913 45.5392C117.563 46.2379 117.066 46.8533 116.456 47.3435C115.687 47.8907 114.715 48.0433 113.793 48.2655C112.871 48.4877 111.912 48.8426 111.387 49.6254C111.102 50.1286 110.911 50.6793 110.824 51.2506C110.736 51.8214 110.507 52.3615 110.158 52.8227C109.977 53.0479 109.725 53.2066 109.443 53.2738C109.161 53.3411 108.865 53.3131 108.601 53.1942C108.323 53.0072 108.111 52.7364 107.998 52.4214C107.619 51.569 107.523 50.6237 107.369 49.705C107.216 48.7863 107 47.841 106.434 47.1013C105.868 46.3617 104.867 45.8742 103.978 46.1627C103.681 46.2768 103.409 46.4496 103.18 46.6708C102.952 46.8919 102.77 47.1568 102.647 47.4496C102.401 48.0358 102.232 48.6511 102.144 49.2805C101.731 51.5314 101.244 53.7691 100.683 55.9936C100.666 56.0847 100.628 56.1709 100.573 56.2456C100.485 56.3335 100.365 56.3835 100.24 56.3849C99.4948 56.4844 98.7792 55.9637 98.027 56.0201C97.9495 56.0252 97.8727 56.0374 97.7974 56.0566C96.5813 53.9503 96.0443 51.5224 96.2592 49.1018C96.4741 46.6812 97.4305 44.385 98.9989 42.5242L99.0588 42.5077C99.5591 42.3306 100.014 42.0452 100.39 41.6718C100.871 41.1927 101.315 40.6795 101.721 40.1362L101.988 39.8045C102.753 38.8861 103.624 38.0611 104.584 37.3468C104.846 37.1329 105.146 36.9708 105.469 36.8692C105.745 36.8155 106.029 36.8066 106.308 36.8426C107.457 36.9802 108.616 37.0234 109.772 36.972C110.578 36.8458 111.39 36.7638 112.205 36.7266C114.312 36.7863 116.109 38.2689 117.441 39.8941C118.156 40.7266 118.795 41.6851 118.839 42.773Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M96.2201 44.6417C95.7575 45.398 94.9221 45.9121 94.6092 46.7412C94.1499 47.9452 94.9254 49.4444 94.2132 50.519C93.9769 50.8805 93.5875 51.1492 93.4543 51.5638C93.228 52.2636 93.8471 53.0099 93.6873 53.7296C93.5276 54.4494 92.5757 55.0563 92.8286 55.7595C92.9781 56.0661 93.2403 56.3037 93.5608 56.4228C94.0652 56.7111 94.6456 56.8395 95.225 56.791C96.1336 56.6417 96.8092 55.7528 97.7311 55.6865C98.48 55.6334 99.1956 56.1509 99.9411 56.0547C100.066 56.0503 100.185 55.9994 100.274 55.9121C100.33 55.8381 100.368 55.7516 100.384 55.66C100.943 53.4378 101.431 51.2001 101.848 48.9469C101.933 48.3174 102.101 47.7018 102.347 47.116C102.472 46.8238 102.654 46.5594 102.882 46.3384C103.111 46.1174 103.382 45.9442 103.679 45.8291C104.567 45.5439 105.566 46.0281 106.135 46.7678C106.704 47.5074 106.92 48.4527 107.074 49.3714C107.227 50.2902 107.323 51.2354 107.699 52.0878C107.814 52.404 108.026 52.6758 108.305 52.864C108.804 53.1525 109.477 52.9237 109.859 52.4925C110.21 52.0311 110.439 51.4894 110.525 50.917C110.612 50.3468 110.802 49.7971 111.087 49.2951C111.613 48.5124 112.575 48.1575 113.494 47.9353C114.412 47.713 115.381 47.5572 116.156 47.0099C116.766 46.5203 117.263 45.9061 117.614 45.2089C118.107 44.3532 118.566 43.4245 118.526 42.4394C118.483 41.3648 117.844 40.4062 117.161 39.5704C115.83 37.9452 114.03 36.4626 111.923 36.4062C111.108 36.4402 110.295 36.5222 109.49 36.6517C108.333 36.7035 107.174 36.6591 106.025 36.519C105.746 36.4857 105.463 36.4958 105.186 36.5489C104.863 36.6473 104.563 36.8097 104.304 37.0265C103.344 37.7396 102.471 38.5635 101.705 39.4809C101.211 40.1337 100.675 40.7542 100.101 41.3383C99.7245 41.7122 99.2699 41.9987 98.7696 42.1774C98.4367 42.2703 98.1039 42.2039 97.7877 42.3067C96.8059 42.6152 96.6761 43.8922 96.2201 44.6417Z",
    fill: "#965D7B"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M128.271 53.6606C125.608 54.1481 123.401 52.0022 122.18 50.4367C121.805 49.9612 121.463 49.4603 121.158 48.9375L130.298 50.6556L130.667 50.7252C130.667 50.7252 132.348 52.9176 128.271 53.6606Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("g", {
    opacity: "0.1"
  }, /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M93.687 52.7814C93.7242 52.3477 93.6581 51.9113 93.4939 51.5078C93.4939 51.541 93.464 51.5741 93.454 51.6073C93.3109 52.0518 93.5039 52.5128 93.6271 52.9738C93.6535 52.9119 93.6736 52.8474 93.687 52.7814Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M94.4794 47.3516C94.4451 47.8102 94.454 48.271 94.506 48.728C94.5401 48.2694 94.5312 47.8086 94.4794 47.3516Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M117.594 44.2487C117.243 44.9474 116.746 45.5628 116.136 46.053C115.367 46.6003 114.399 46.7528 113.473 46.975C112.548 47.1973 111.593 47.5522 111.067 48.3349C110.783 48.8383 110.592 49.389 110.505 49.9601C110.418 50.5323 110.189 51.0739 109.839 51.5356C109.456 51.9668 108.784 52.1989 108.285 51.907C108.005 51.7189 107.793 51.4471 107.679 51.1309C107.303 50.2785 107.203 49.3366 107.053 48.4145C106.903 47.4925 106.68 46.5505 106.115 45.8109C105.549 45.0712 104.547 44.5837 103.658 44.8722C103.361 44.9868 103.09 45.1598 102.862 45.3809C102.633 45.602 102.451 45.8666 102.327 46.1591C102.081 46.7449 101.913 47.3605 101.828 47.99C101.413 50.2431 100.925 52.4808 100.363 54.7031C100.348 54.7947 100.31 54.8812 100.254 54.9551C100.164 55.0425 100.046 55.0934 99.9207 55.0978C99.1752 55.1939 98.4596 54.6765 97.7108 54.7296C96.7889 54.7959 96.1132 55.6848 95.2046 55.8308C94.625 55.8826 94.0436 55.7539 93.5405 55.4626C93.3091 55.3634 93.1016 55.2165 92.9314 55.0314C92.8535 55.1426 92.802 55.2698 92.7807 55.4037C92.7593 55.5376 92.7688 55.6745 92.8083 55.8042C92.9549 56.113 93.2181 56.3515 93.5405 56.4676C94.0436 56.7589 94.625 56.8875 95.2046 56.8357C96.1132 56.6898 96.7889 55.8009 97.7108 55.7346C98.4596 55.6815 99.1752 56.1989 99.9207 56.1027C100.046 56.0984 100.164 56.0475 100.254 55.9601C100.31 55.8862 100.348 55.7997 100.363 55.708C100.923 53.4969 101.411 51.2592 101.828 48.9949C101.913 48.3655 102.081 47.7499 102.327 47.1641C102.451 46.8716 102.633 46.607 102.862 46.3859C103.09 46.1648 103.361 45.9918 103.658 45.8772C104.547 45.5886 105.545 46.0762 106.115 46.8158C106.684 47.5555 106.9 48.5007 107.053 49.4195C107.206 50.3382 107.303 51.2835 107.679 52.1359C107.793 52.452 108.005 52.7238 108.285 52.912C108.784 53.2006 109.456 52.9717 109.839 52.5405C110.189 52.0789 110.418 51.5373 110.505 50.9651C110.592 50.3939 110.783 49.8433 111.067 49.3399C111.593 48.5571 112.555 48.2056 113.473 47.98C114.392 47.7545 115.36 47.6052 116.136 47.058C116.746 46.5678 117.243 45.9524 117.594 45.2537C118.086 44.4012 118.546 43.4726 118.506 42.4875C118.499 42.3608 118.486 42.2346 118.466 42.1094C118.305 42.8685 118.01 43.593 117.594 44.2487Z",
    fill: "black"
  })), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M118.519 44.3493C119.372 45.8616 119.878 47.5439 120 49.2747C117.034 47.6163 114.245 45.7954 112.837 45.1619C110.384 44.0574 101.212 44.2233 97.7637 44.3261C98.1244 43.684 98.5456 43.0776 99.0217 42.5151C99.8096 41.5825 100.736 40.775 101.768 40.1204C103.134 39.2561 104.664 38.6785 106.262 38.4231C107.86 38.1677 109.494 38.2398 111.063 38.635C112.633 39.0301 114.105 39.7401 115.39 40.7215C116.674 41.7029 117.745 42.935 118.535 44.3427L118.519 44.3493Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M129.103 52.2543C127.502 52.7451 124.889 51.7965 122.18 50.4367C121.805 49.9612 121.463 49.4603 121.158 48.9375L130.298 50.6556C130.903 51.0669 131.056 51.6539 129.103 52.2543Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M108.844 32.851C108.844 32.851 100.107 32.3535 97.6509 37.0798L97.2548 41.2689L96.5892 41.1959L96.4561 44.045C96.4561 44.045 109.809 43.4646 112.848 44.8311C115.886 46.1976 125.329 53.0832 129.113 51.9223C132.897 50.7614 128.78 49.6835 128.78 49.6835C128.78 49.6835 123.571 47.4845 123.571 45.7598C123.571 44.0351 122.28 34.924 108.844 32.851Z",
    fill: "#0B4B66"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M91.9932 188.141C91.9932 188.141 97.568 193.53 99.981 193.116C99.981 193.116 93.1581 192.535 91.9932 188.141Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M90.8281 190.641C90.8281 190.641 91.3274 193.413 92.6587 193.141C93.99 192.869 90.8281 190.641 90.8281 190.641Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M99.5646 236.984C99.5646 236.984 91.65 243.12 92.9846 243.286C94.3193 243.452 99.5646 236.984 99.5646 236.984Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M110.151 115.203L135.779 111.047V135.226L111.429 133.956L110.151 115.203Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.05",
    d: "M110.151 115.203L135.779 111.047V135.226L111.429 133.956L110.151 115.203Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M135.779 111.047L166.512 113.339L164.812 134.38L135.779 135.226V111.047Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M135.779 111.047L166.512 113.339L164.812 134.38L135.779 135.226V111.047Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M145.228 103.664L135.779 111.044L166.512 113.336L171.535 105.783L145.228 103.664Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M100.873 107.143L123.944 104.344L135.78 111.047L110.152 115.203L100.873 107.143Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M141.397 117.326V150.384L129.392 149.157L124.17 148.626L122.579 148.46L117.36 147.926L110.151 147.19V115.203L135.776 116.941L141.397 117.326Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M166.512 113.336V145.575L156.89 147.416L152.211 148.311L141.397 150.381V117.323L166.512 113.336Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.05",
    d: "M166.512 113.336V145.575L156.89 147.416L152.211 148.311L141.397 150.381V117.323L166.512 113.336Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M100.873 122.162L110.152 115.203L141.398 117.326L136.798 125.047L100.873 122.162Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M100.873 122.162L110.152 115.203L141.398 117.326L136.798 125.047L100.873 122.162Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M166.512 113.336L141.397 117.323L149.572 124.62L176.474 120.122L166.512 113.336Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M166.512 113.336L141.397 117.323L149.572 124.62L176.474 120.122L166.512 113.336Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M156.89 147.415L152.211 148.31V141.421L156.594 140.32L156.89 147.415Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M129.392 144.594V149.151L124.17 148.62V144.594H129.392Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M122.579 146.031V148.456L117.36 147.922V146.031H122.579Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M138.255 142.181C134.677 146.742 122.862 143.591 122.862 143.591L114.082 134.463L112.891 133.226L115.22 128.914C115.22 128.914 115.886 129.133 116.998 129.518C122.882 131.567 141.267 138.344 138.255 142.181Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M137.922 141.517C134.344 146.077 122.529 142.927 122.529 142.927L113.749 133.799L112.558 132.562L114.887 128.25C114.887 128.25 115.553 128.469 116.665 128.854C122.549 130.903 140.934 137.68 137.922 141.517Z",
    fill: "#EFB7B9"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M116.652 128.854C116.166 130.247 114.931 132.31 113.736 133.799L112.545 132.562L114.875 128.25C114.875 128.25 115.544 128.469 116.652 128.854Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M87.5834 77.2678C87.5834 77.2678 78.8467 80.5845 78.7635 89.8714C78.7436 95.8559 79.0771 101.836 79.762 107.782C79.762 107.782 77.2658 121.629 84.3384 125.609C91.4109 129.589 97.9842 132.906 97.9842 132.906C97.9842 132.906 109.284 134.73 110.671 135.311C112.059 135.891 116.882 128.429 116.133 127.185C115.384 125.941 105.097 122.873 103.875 120.8C102.654 118.727 99.645 117.331 99.645 117.331C99.645 117.331 96.5763 115.245 96.4532 113.503C96.33 111.762 97.2353 110.518 97.4916 109.772C97.7479 109.026 98.6764 101.729 98.6764 101.729C98.6764 101.729 103.642 75.8416 87.5834 77.2678Z",
    fill: "#DCE6F2"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M91.5765 108.016C91.5765 108.016 79.7613 109.342 80.6765 113.488C80.6765 113.488 85.1663 109.306 91.5765 108.016Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M91.5771 109.672C91.5771 109.672 84.8707 114.564 86.1021 114.896C87.3336 115.227 91.5771 109.672 91.5771 109.672Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M94.5725 111.664C94.5725 111.664 92.6588 115.094 93.7404 114.914C94.8221 114.735 94.5725 111.664 94.5725 111.664Z",
    fill: "black"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M217.591 37.2741C217.591 37.2741 204.943 36.5146 206.421 45.3571C206.421 45.3571 206.125 46.9192 207.546 47.629C207.546 47.629 207.569 46.9657 208.844 47.1945C209.298 47.2707 209.759 47.2929 210.218 47.2609C210.841 47.2195 211.432 46.976 211.903 46.5677C211.903 46.5677 215.46 45.105 216.845 39.3073C216.845 39.3073 217.87 38.0403 217.843 37.7153L215.707 38.6274C215.707 38.6274 216.436 40.163 215.86 41.44C215.86 41.44 215.793 38.6838 215.381 38.7468C215.297 38.7468 214.272 39.2808 214.272 39.2808C214.272 39.2808 215.527 41.9541 214.578 43.901C214.578 43.901 214.938 40.6042 213.88 39.4731L212.375 40.3488C212.375 40.3488 213.843 43.1116 212.848 45.367C212.848 45.367 213.104 41.9076 212.059 40.561L210.694 41.6191C210.694 41.6191 212.076 44.3455 211.234 46.2161C211.234 46.2161 211.124 42.1896 210.398 41.8844C210.398 41.8844 209.207 42.9325 209.027 43.3637C209.027 43.3637 209.969 45.3537 209.383 46.3853C209.383 46.3853 209.024 43.702 208.717 43.6887C208.717 43.6887 207.529 45.4665 207.406 46.6738C207.464 45.5483 207.816 44.4574 208.428 43.5096C207.743 43.6387 207.111 43.9651 206.611 44.4483C206.611 44.4483 206.794 43.1912 208.721 43.0818C208.721 43.0818 209.719 41.7319 209.965 41.6489C209.965 41.6489 208.048 41.4897 206.887 42.0038C206.887 42.0038 207.909 40.8197 210.318 41.3405L211.65 40.2459C211.65 40.2459 209.127 39.9143 208.055 40.2824C208.055 40.2824 209.287 39.2343 212.012 39.9972L213.477 39.1249C213.477 39.1249 211.327 38.6605 210.045 38.8297C210.045 38.8297 211.397 38.1033 213.906 38.8894L214.955 38.4217C214.955 38.4217 213.377 38.1133 212.918 38.0635C212.458 38.0138 212.432 37.8877 212.432 37.8877C213.43 37.7222 214.454 37.8371 215.391 38.2194C215.391 38.2194 217.637 37.4134 217.591 37.2741Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M256.019 81.5007C256.019 81.5007 243.372 80.7412 244.85 89.5836C244.85 89.5836 244.553 91.1458 245.975 91.8556C245.975 91.8556 245.998 91.1922 247.276 91.4211C247.73 91.4972 248.191 91.5195 248.65 91.4874C249.265 91.443 249.849 91.2009 250.315 90.7976C250.315 90.7976 253.876 89.3316 255.26 83.5339C255.26 83.5339 256.282 82.2702 256.242 81.9451L254.105 82.8539C254.105 82.8539 254.834 84.3896 254.262 85.6665C254.262 85.6665 254.192 82.9103 253.783 82.9733C253.699 82.9733 252.671 83.5073 252.671 83.5073C252.671 83.5073 253.929 86.1839 252.98 88.1276C252.98 88.1276 253.34 84.8307 252.278 83.6997L250.791 84.5654C250.791 84.5654 252.258 87.3282 251.263 89.5836C251.263 89.5836 251.519 86.1243 250.474 84.7777L249.113 85.839C249.113 85.839 250.491 88.5621 249.652 90.4327C249.652 90.4327 249.542 86.4062 248.817 86.101C248.817 86.101 247.625 87.1491 247.442 87.5803C247.442 87.5803 248.388 89.5704 247.802 90.6019C247.802 90.6019 247.442 87.9186 247.136 87.9053C247.136 87.9053 245.948 89.6831 245.825 90.8904C245.884 89.7647 246.238 88.674 246.85 87.7262C246.164 87.8557 245.531 88.1819 245.029 88.6649C245.029 88.6649 245.216 87.4078 247.143 87.2984C247.143 87.2984 248.125 85.9485 248.388 85.8655C248.388 85.8655 246.47 85.7063 245.309 86.2204C245.309 86.2204 246.331 85.0364 248.737 85.5737L250.068 84.4791C250.068 84.4791 247.542 84.1475 246.474 84.5156C246.474 84.5156 247.705 83.4675 250.431 84.2304L251.895 83.3581C251.895 83.3581 249.742 82.897 248.461 83.0629C248.461 83.0629 249.815 82.3365 252.325 83.1226L253.373 82.6549C253.373 82.6549 251.796 82.3465 251.333 82.2967C250.87 82.247 250.847 82.1209 250.847 82.1209C251.846 81.9553 252.872 82.0701 253.809 82.4526C253.809 82.4526 256.059 81.64 256.019 81.5007Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M179.186 73.6538C179.186 73.6538 182.098 61.352 173.099 61.3088C173.099 61.3088 171.604 60.7516 170.662 62.0253C170.662 62.0253 171.305 62.1613 170.869 63.3752C170.718 63.8044 170.617 64.2496 170.569 64.7019C170.505 65.3184 170.644 65.9391 170.965 66.4697C170.965 66.4697 171.807 70.2176 177.289 72.5659C177.289 72.5659 178.367 73.7865 178.693 73.7997L178.161 71.5477C178.161 71.5477 176.517 72.002 175.352 71.216C175.352 71.216 178.091 71.6173 178.094 71.216C178.094 71.1331 177.761 70.0352 177.761 70.0352C177.761 70.0352 174.903 70.8113 173.139 69.5477C173.139 69.5477 176.337 70.4631 177.638 69.6173L177.039 67.9855C177.039 67.9855 174.044 68.9573 171.994 67.5941C171.994 67.5941 175.372 68.4365 176.883 67.6405L176.067 66.1215C176.067 66.1215 173.139 67.0103 171.431 65.8661C171.431 65.8661 175.425 66.4432 175.858 65.7865C175.858 65.7865 175.026 64.4365 174.63 64.1845C174.63 64.1845 172.513 64.7749 171.581 64.022C171.581 64.022 174.293 64.1248 174.357 63.8395C174.357 63.8395 172.802 62.3702 171.618 62.0385C172.722 62.2891 173.741 62.8217 174.576 63.5841C174.564 62.889 174.349 62.2125 173.957 61.6372C173.957 61.6372 175.169 62.0352 174.956 63.9589C174.956 63.9589 176.121 65.153 176.157 65.4249C176.157 65.4249 176.64 63.5709 176.33 62.3404C176.33 62.3404 177.329 63.5477 176.387 65.8196L177.239 67.3287C177.239 67.3287 178.011 64.9075 177.815 63.7931C177.815 63.7931 178.643 65.1795 177.422 67.7268L178.038 69.3155C178.038 69.3155 178.86 67.279 178.913 65.9987C178.913 65.9987 179.402 67.4515 178.194 69.7831L178.48 70.8909C178.48 70.8909 179.053 69.3951 179.179 68.9506C179.306 68.5062 179.436 68.5029 179.436 68.5029C179.431 69.5119 179.144 70.4996 178.607 71.3553C178.607 71.3553 179.043 73.6704 179.186 73.6538Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M151.489 77.8424C151.489 77.8424 141.331 70.2703 137.7 78.4726C137.7 78.4726 136.592 79.6169 137.387 80.9867C137.387 80.9867 137.766 80.4527 138.718 81.3383C139.055 81.6508 139.429 81.9225 139.83 82.1476C140.373 82.4492 141.001 82.5656 141.617 82.4792C141.617 82.4792 145.398 83.2056 149.751 79.1227C149.751 79.1227 151.306 78.6252 151.452 78.3333L149.159 77.932C149.159 77.932 148.919 79.6136 147.738 80.3665C147.738 80.3665 149.199 78.0248 148.82 77.8557C148.743 77.8192 147.598 77.6898 147.598 77.6898C147.598 77.6898 147.172 80.6152 145.308 81.7197C145.308 81.7197 147.428 79.1625 147.165 77.6368L145.425 77.5439C145.425 77.5439 145.128 80.6583 143.052 81.9983C143.052 81.9983 145.172 79.2487 145.049 77.5505L143.325 77.6898C143.325 77.6898 142.975 80.718 141.241 81.8192C141.241 81.8192 143.368 78.3963 142.932 77.7462C142.932 77.7462 141.358 77.9685 140.968 78.2272C140.968 78.2272 140.665 80.3963 139.6 80.9469C139.6 80.9469 140.782 78.5091 140.542 78.3399C140.542 78.3399 138.569 79.1724 137.793 80.121C138.464 79.2128 139.361 78.4948 140.396 78.0381C139.752 77.7714 139.044 77.6977 138.359 77.8258C138.359 77.8258 139.204 76.8772 140.875 77.8424C140.875 77.8424 142.439 77.2553 142.706 77.3283C142.706 77.3283 141.191 76.1442 139.936 75.9386C139.936 75.9386 141.447 75.5074 143.161 77.2653L144.889 77.0895C144.889 77.0895 142.968 75.4311 141.867 75.1525C141.867 75.1525 143.474 74.9502 145.328 77.0796L147.032 77.1558C147.032 77.1558 145.491 75.5903 144.33 75.0265C144.33 75.0265 145.857 75.1592 147.521 77.1923L148.656 77.3748C148.656 77.3748 147.508 76.2537 147.149 75.9618C146.789 75.6699 146.839 75.5472 146.839 75.5472C147.765 75.9558 148.559 76.6126 149.132 77.4444C149.132 77.4444 151.446 77.9784 151.489 77.8424Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M185.307 7.49233C185.307 7.49233 175.149 -0.0831323 171.518 8.12251C171.518 8.12251 170.41 9.26679 171.205 10.6366C171.205 10.6366 171.585 10.1026 172.537 10.9882C172.876 11.2992 173.25 11.5696 173.652 11.7941C174.195 12.096 174.823 12.2125 175.439 12.1258C175.439 12.1258 179.22 12.8522 183.573 8.76596C183.573 8.76596 185.127 8.27176 185.271 7.97657L182.977 7.58188C182.977 7.58188 182.741 9.26347 181.556 10.0164C181.556 10.0164 183.021 7.67475 182.641 7.50559C182.565 7.46911 181.42 7.33976 181.42 7.33976C181.42 7.33976 180.98 10.2718 179.117 11.3696C179.117 11.3696 181.233 8.81239 180.974 7.28669L179.233 7.19382C179.233 7.19382 178.934 10.3082 176.86 11.6449C176.86 11.6449 178.98 8.89531 178.857 7.19714L177.136 7.33644C177.136 7.33644 176.783 10.3679 175.049 11.4691C175.049 11.4691 177.18 8.04622 176.744 7.39614C176.744 7.39614 175.169 7.61836 174.78 7.87707C174.78 7.87707 174.477 10.0462 173.412 10.5968C173.412 10.5968 174.593 8.15899 174.354 7.98652C174.354 7.98652 172.38 8.82234 171.605 9.77093C172.275 8.86171 173.172 8.14351 174.207 7.68801C173.563 7.41938 172.853 7.34556 172.167 7.47574C172.167 7.47574 173.016 6.52715 174.687 7.49233C174.687 7.49233 176.251 6.90194 176.517 6.97823C176.517 6.97823 175.003 5.79415 173.748 5.5852C173.748 5.5852 175.256 5.15733 176.97 6.9119L178.697 6.73611C178.697 6.73611 176.78 5.07773 175.675 4.79581C175.675 4.79581 177.283 4.5968 179.14 6.72616L180.844 6.79912C180.844 6.79912 179.303 5.23362 178.138 4.67309C178.138 4.67309 179.669 4.80576 181.333 6.83893L182.465 7.02135C182.465 7.02135 181.313 5.91355 180.954 5.62831C180.594 5.34307 180.644 5.21704 180.644 5.21704C181.57 5.62519 182.364 6.28207 182.937 7.11422C182.937 7.11422 185.251 7.61836 185.307 7.49233Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M224.121 17.0849C224.121 17.0849 220.061 5.10814 212.402 9.81461C212.402 9.81461 210.838 10.1463 210.715 11.7085C210.715 11.7085 211.331 11.4829 211.603 12.7433C211.705 13.1916 211.858 13.6268 212.059 14.0402C212.335 14.5964 212.783 15.0491 213.337 15.3304C213.337 15.3304 216.04 18.0667 221.951 17.1612C221.951 17.1612 223.512 17.6322 223.798 17.4697L222.134 15.8412C222.134 15.8412 220.982 17.0916 219.578 17.0418C219.578 17.0418 222.117 15.9407 221.908 15.5858C221.864 15.5161 220.996 14.7632 220.996 14.7632C220.996 14.7632 218.979 16.929 216.816 16.7864C216.816 16.7864 220.014 15.8776 220.666 14.4647L219.288 13.4067C219.288 13.4067 217.271 15.8013 214.799 15.7284C214.799 15.7284 218.127 14.6637 218.969 13.1911L217.471 12.332C217.471 12.332 215.474 14.6305 213.404 14.5576C213.404 14.5576 217.105 12.9423 217.115 12.1596C217.115 12.1596 215.694 11.4531 215.225 11.4465C215.225 11.4465 213.74 13.0617 212.562 12.9158C212.562 12.9158 214.918 11.5725 214.819 11.2972C214.819 11.2972 212.722 10.8693 211.54 11.2143C212.609 10.8435 213.756 10.7577 214.868 10.9655C214.489 10.3814 213.946 9.92039 213.308 9.63883C213.308 9.63883 214.546 9.337 215.374 11.075C215.374 11.075 216.999 11.4763 217.172 11.6853C217.172 11.6853 216.599 9.85773 215.684 8.97548C215.684 8.97548 217.172 9.47631 217.578 11.9009L219.102 12.73C219.102 12.73 218.473 10.2723 217.714 9.41329C217.714 9.41329 219.155 10.1562 219.468 12.9589L220.833 13.9838C220.833 13.9838 220.453 11.8212 219.814 10.7002C219.814 10.7002 220.999 11.6753 221.212 14.2922L222.041 15.0816C222.041 15.0816 221.735 13.5095 221.608 13.065C221.482 12.6206 221.585 12.5907 221.585 12.5907C222.114 13.4511 222.394 14.4407 222.394 15.4498C222.394 15.4498 224.005 17.1712 224.121 17.0849Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M197.622 17.6814C197.622 17.6814 185.008 16.2818 186.049 25.2005C186.049 25.2005 185.673 26.7461 187.048 27.5222C187.048 27.5222 187.104 26.8589 188.379 27.1574C188.83 27.254 189.29 27.2996 189.75 27.2934C190.373 27.2822 190.975 27.0691 191.464 26.6864C191.464 26.6864 195.096 25.4028 196.79 19.6814C196.79 19.6814 197.875 18.4708 197.851 18.1425L195.671 18.9451C195.671 18.9451 196.337 20.5139 195.671 21.761C195.671 21.761 195.741 19.0048 195.339 19.0479C195.255 19.0479 194.204 19.5256 194.204 19.5256C194.204 19.5256 195.322 22.2619 194.277 24.169C194.277 24.169 194.803 20.8921 193.801 19.7113L192.253 20.5073C192.253 20.5073 193.585 23.3431 192.47 25.5455C192.47 25.5455 192.902 22.1027 191.927 20.7063L190.513 21.7013C190.513 21.7013 191.751 24.4907 190.815 26.3183C190.815 26.3183 190.912 22.2917 190.203 21.9501C190.203 21.9501 188.958 22.9451 188.755 23.3564C188.755 23.3564 189.597 25.3796 188.962 26.3912C188.962 26.3912 188.739 23.6947 188.446 23.6682C188.446 23.6682 187.168 25.3829 186.981 26.5935C187.097 25.4712 187.505 24.3985 188.166 23.4824C187.476 23.5775 186.828 23.8715 186.302 24.3282C186.302 24.3282 186.549 23.0844 188.479 23.0712C188.479 23.0712 189.527 21.7743 189.81 21.7047C189.81 21.7047 187.903 21.4493 186.715 21.9037C186.715 21.9037 187.797 20.7693 190.173 21.4294L191.574 20.4045C191.574 20.4045 189.042 19.8937 187.97 20.2254C187.97 20.2254 189.255 19.2304 191.937 20.1425L193.445 19.3431C193.445 19.3431 191.318 18.7727 190.03 18.8755C190.03 18.8755 191.418 18.2121 193.884 19.1309L194.956 18.7163C194.956 18.7163 193.395 18.3282 192.936 18.2552C192.476 18.1823 192.46 18.0562 192.46 18.0562C193.466 17.9412 194.484 18.1065 195.402 18.5338C195.402 18.5338 197.645 17.8207 197.622 17.6814Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M307.986 115.244C307.986 115.244 295.379 113.844 296.421 122.753C296.421 122.753 296.044 124.299 297.419 125.075C297.419 125.075 297.476 124.412 298.75 124.707C299.2 124.807 299.661 124.852 300.122 124.843C300.744 124.833 301.347 124.62 301.836 124.236C301.836 124.236 305.467 122.952 307.144 117.234C307.144 117.234 308.229 116.02 308.206 115.695L306.026 116.494C306.026 116.494 306.692 118.067 306.026 119.314C306.026 119.314 306.096 116.554 305.693 116.601C305.61 116.601 304.558 117.075 304.558 117.075C304.558 117.075 305.676 119.811 304.631 121.718C304.631 121.718 305.157 118.445 304.155 117.261L302.608 118.06C302.608 118.06 303.939 120.896 302.827 123.098C302.827 123.098 303.257 119.655 302.282 118.256L300.867 119.251C300.867 119.251 302.105 122.04 301.17 123.864C301.17 123.864 301.267 119.838 300.558 119.499C300.558 119.499 299.316 120.494 299.11 120.906C299.11 120.906 299.955 122.929 299.316 123.941C299.316 123.941 299.093 121.244 298.8 121.218C298.8 121.218 297.522 122.932 297.336 124.143C297.451 123.021 297.86 121.948 298.521 121.032C297.83 121.125 297.181 121.419 296.657 121.878C296.657 121.878 296.903 120.63 298.834 120.617C298.834 120.617 299.885 119.32 300.165 119.254C300.165 119.254 298.258 118.995 297.07 119.45C297.07 119.45 298.151 118.319 300.531 118.979L301.929 117.954C301.929 117.954 299.426 117.483 298.338 117.808C298.338 117.808 299.622 116.813 302.305 117.722L303.813 116.926C303.813 116.926 301.686 116.355 300.398 116.458C300.398 116.458 301.786 115.795 304.252 116.713L305.324 116.295C305.324 116.295 303.763 115.907 303.303 115.838C302.844 115.768 302.827 115.639 302.827 115.639C303.833 115.522 304.852 115.686 305.77 116.113C305.77 116.113 308.02 115.387 307.986 115.244Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M327.26 126.978C327.26 126.978 314.652 125.582 315.694 134.487C315.694 134.487 315.321 136.033 316.692 136.809C316.692 136.809 316.749 136.145 318.024 136.444C318.473 136.541 318.932 136.586 319.392 136.577C320.011 136.564 320.61 136.352 321.099 135.973C321.099 135.973 324.727 134.689 326.404 128.968C326.404 128.968 327.493 127.757 327.466 127.429L325.286 128.228C325.286 128.228 325.952 129.801 325.286 131.048C325.286 131.048 325.356 128.291 324.953 128.335C324.87 128.335 323.818 128.809 323.818 128.809C323.818 128.809 324.937 131.545 323.891 133.452C323.891 133.452 324.417 130.179 323.416 128.998L321.868 129.794C321.868 129.794 323.199 132.63 322.088 134.832C322.088 134.832 322.517 131.389 321.542 129.993L320.127 130.988C320.127 130.988 321.365 133.777 320.433 135.605C320.433 135.605 320.527 131.575 319.818 131.237C319.818 131.237 318.576 132.232 318.37 132.643C318.37 132.643 319.215 134.666 318.576 135.678C318.576 135.678 318.353 132.981 318.06 132.955C318.06 132.955 316.782 134.67 316.599 135.88C316.714 134.758 317.122 133.686 317.781 132.769C317.09 132.864 316.442 133.158 315.917 133.615C315.917 133.615 316.167 132.368 318.097 132.358C318.097 132.358 319.145 131.061 319.428 130.991C319.428 130.991 317.521 130.736 316.333 131.19C316.333 131.19 317.415 130.056 319.794 130.716L321.192 129.691C321.192 129.691 318.689 129.22 317.601 129.545C317.601 129.545 318.886 128.55 321.568 129.462L323.076 128.663C323.076 128.663 320.949 128.092 319.661 128.195C319.661 128.195 321.049 127.532 323.515 128.451L324.587 128.036C324.587 128.036 323.026 127.648 322.57 127.575C322.114 127.502 322.091 127.376 322.091 127.376C323.097 127.261 324.116 127.426 325.033 127.854C325.033 127.854 327.293 127.121 327.26 126.978Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M284.469 28.1393C284.469 28.1393 274.311 20.5672 270.68 28.7695C270.68 28.7695 269.572 29.9138 270.367 31.2836C270.367 31.2836 270.747 30.7496 271.699 31.6351C272.036 31.9477 272.409 32.2194 272.81 32.4444C273.354 32.7458 273.982 32.8623 274.598 32.7761C274.598 32.7761 278.379 33.5025 282.735 29.4196C282.735 29.4196 284.286 28.922 284.433 28.6302L282.146 28.2189C282.146 28.2189 281.906 29.9005 280.725 30.6534C280.725 30.6534 282.186 28.3118 281.807 28.1426C281.73 28.1061 280.588 27.9768 280.588 27.9768C280.588 27.9768 280.159 30.9021 278.295 32.0066C278.295 32.0066 280.415 29.4494 280.152 27.9237L278.412 27.8308C278.412 27.8308 278.116 30.9453 276.039 32.2852C276.039 32.2852 278.162 29.5356 278.036 27.8375L276.312 27.9768C276.312 27.9768 275.979 31.005 274.228 32.1061C274.228 32.1061 276.358 28.6832 275.919 28.0332C275.919 28.0332 274.345 28.2554 273.955 28.5141C273.955 28.5141 273.656 30.6832 272.591 31.2338C272.591 31.2338 273.769 28.796 273.529 28.6269C273.529 28.6269 271.556 29.4594 270.78 30.4079C271.451 29.4997 272.348 28.7817 273.383 28.325C272.739 28.0584 272.031 27.9846 271.346 28.1128C271.346 28.1128 272.195 27.1642 273.865 28.1293C273.865 28.1293 275.426 27.5423 275.693 27.6152C275.693 27.6152 274.178 26.4312 272.924 26.2255C272.924 26.2255 274.435 25.7944 276.149 27.5522L277.876 27.3764C277.876 27.3764 275.959 25.7181 274.854 25.4395C274.854 25.4395 276.461 25.2371 278.315 27.3665L280.023 27.4428C280.023 27.4428 278.478 25.8773 277.317 25.3134C277.317 25.3134 278.848 25.4461 280.509 27.4793L281.644 27.6617C281.644 27.6617 280.495 26.5406 280.136 26.2487C279.776 25.9569 279.83 25.8607 279.83 25.8607C280.754 26.27 281.547 26.9267 282.119 27.7579C282.119 27.7579 284.426 28.2753 284.469 28.1393Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M292.317 82.8032C292.317 82.8032 288.816 70.6539 280.941 75.0154C280.941 75.0154 279.363 75.2575 279.167 76.8297C279.167 76.8297 279.793 76.634 280.009 77.9043C280.089 78.3607 280.223 78.806 280.408 79.231C280.655 79.8026 281.083 80.2778 281.627 80.5843C281.627 80.5843 284.203 83.4367 290.147 82.7998C290.147 82.7998 291.685 83.3371 291.977 83.1912L290.403 81.4864C290.403 81.4864 289.195 82.6871 287.797 82.5743C287.797 82.5743 290.38 81.5793 290.18 81.2244C290.14 81.1514 289.308 80.3587 289.308 80.3587C289.308 80.3587 287.198 82.435 285.041 82.1929C285.041 82.1929 288.28 81.43 288.992 80.0569L287.661 78.9358C287.661 78.9358 285.537 81.2376 283.071 81.0585C283.071 81.0585 286.426 80.1398 287.351 78.7103L285.893 77.7849C285.893 77.7849 283.78 79.9905 281.73 79.8247C281.73 79.8247 285.501 78.3753 285.547 77.5959C285.547 77.5959 284.156 76.8264 283.687 76.7998C283.687 76.7998 282.132 78.3454 280.951 78.1464C280.951 78.1464 283.367 76.9093 283.281 76.6307C283.281 76.6307 281.204 76.11 280.009 76.3985C281.091 76.0787 282.238 76.0456 283.337 76.3023C282.985 75.7022 282.465 75.2179 281.84 74.9093C281.84 74.9093 283.091 74.6605 283.837 76.435C283.837 76.435 285.437 76.906 285.604 77.1249C285.604 77.1249 285.115 75.2708 284.239 74.3521C284.239 74.3521 285.704 74.9159 286 77.357L287.484 78.2559C287.484 78.2559 286.965 75.7683 286.246 74.8927C286.246 74.8927 287.651 75.6987 287.84 78.5113L289.172 79.5959C289.172 79.5959 288.889 77.4201 288.303 76.2791C288.303 76.2791 289.445 77.3073 289.538 79.9275L290.33 80.7567C290.33 80.7567 290.097 79.1713 289.997 78.7202C289.897 78.2692 289.997 78.2061 289.997 78.2061C290.49 79.0884 290.726 80.0898 290.679 81.0983C290.679 81.0983 292.197 82.8828 292.317 82.8032Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M214.295 110.182C214.295 110.182 207.496 99.5089 201.182 105.897C201.182 105.897 199.738 106.56 199.991 108.136C199.991 108.136 200.54 107.771 201.106 108.932C201.309 109.343 201.561 109.729 201.858 110.079C202.255 110.558 202.798 110.894 203.405 111.035C203.405 111.035 206.684 113.051 212.209 110.769C212.209 110.769 213.836 110.855 214.076 110.633L212.079 109.439C212.079 109.439 211.257 110.932 209.882 111.214C209.882 111.214 212.086 109.555 211.789 109.25C211.733 109.19 210.708 108.666 210.708 108.666C210.708 108.666 209.266 111.247 207.13 111.622C207.13 111.622 210.022 109.98 210.322 108.461L208.727 107.761C208.727 107.761 207.339 110.564 204.923 111.078C204.923 111.078 207.885 109.257 208.368 107.625L206.704 107.147C206.704 107.147 205.299 109.857 203.286 110.272C203.286 110.272 206.494 107.824 206.318 107.061C206.318 107.061 204.767 106.713 204.321 106.819C204.321 106.819 203.266 108.739 202.074 108.879C202.074 108.879 204.044 107.015 203.881 106.769C203.881 106.769 201.741 106.852 200.676 107.466C201.626 106.852 202.721 106.498 203.851 106.438C203.345 105.96 202.71 105.641 202.024 105.519C202.024 105.519 203.152 104.932 204.354 106.424C204.354 106.424 206.018 106.424 206.248 106.59C206.248 106.59 205.249 104.932 204.154 104.312C204.154 104.312 205.719 104.444 206.69 106.703L208.371 107.147C208.371 107.147 207.17 104.909 206.234 104.268C206.234 104.268 207.809 104.647 208.784 107.297L210.355 107.96C210.355 107.96 209.47 105.953 208.581 105.015C208.581 105.015 209.965 105.678 210.794 108.169L211.793 108.743C211.793 108.743 211.127 107.287 210.891 106.885C210.654 106.484 210.748 106.391 210.748 106.391C211.468 107.1 211.976 107.995 212.215 108.975C212.215 108.975 214.206 110.295 214.295 110.182Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M258.985 55.6458C258.985 55.6458 252.518 44.7702 246.005 50.9593C246.005 50.9593 244.54 51.5894 244.746 53.1616C244.746 53.1616 245.302 52.81 245.835 53.9875C246.025 54.406 246.265 54.8002 246.55 55.1616C246.933 55.6507 247.466 56.0005 248.068 56.1566C248.068 56.1566 251.28 58.2727 256.875 56.1566C256.875 56.1566 258.499 56.2926 258.745 56.077L256.791 54.8233C256.791 54.8233 255.926 56.286 254.542 56.5281C254.542 56.5281 256.795 54.9261 256.512 54.6243C256.452 54.5613 255.447 54.004 255.447 54.004C255.447 54.004 253.926 56.5414 251.786 56.8498C251.786 56.8498 254.728 55.2976 255.071 53.7918L253.5 53.0554C253.5 53.0554 252.025 55.8183 249.592 56.2594C249.592 56.2594 252.611 54.5314 253.144 52.9161L251.499 52.3855C251.499 52.3855 250.008 55.0389 247.985 55.4037C247.985 55.4037 251.266 53.0555 251.113 52.2893C251.113 52.2893 249.576 51.8913 249.116 51.9841C249.116 51.9841 248.002 53.8714 246.807 53.9742C246.807 53.9742 248.834 52.1765 248.68 51.9244C248.68 51.9244 246.537 51.941 245.455 52.5215C246.424 51.939 247.529 51.6189 248.66 51.5928C248.169 51.0997 247.543 50.7608 246.86 50.6176C246.86 50.6176 248.008 50.0637 249.19 51.5928C249.19 51.5928 250.854 51.6491 251.077 51.8183C251.077 51.8183 250.135 50.1599 249.057 49.4767C249.057 49.4767 250.614 49.6558 251.516 51.9443L253.18 52.4418C253.18 52.4418 252.052 50.1666 251.133 49.4966C251.133 49.4966 252.698 49.9244 253.59 52.6011L255.137 53.3208C255.137 53.3208 254.315 51.2876 253.473 50.3357C253.473 50.3357 254.834 51.0422 255.59 53.5563L256.565 54.1599C256.565 54.1599 255.939 52.684 255.72 52.276C255.5 51.868 255.593 51.7785 255.593 51.7785C256.291 52.5092 256.771 53.4186 256.981 54.4054C256.981 54.4054 258.888 55.7553 258.985 55.6458Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M218.07 78.5199C218.07 78.5199 218.403 65.8831 209.593 67.6642C209.593 67.6642 208.015 67.4221 207.35 68.8616C207.35 68.8616 208.015 68.8616 207.829 70.1385C207.768 70.5938 207.761 71.0547 207.809 71.5116C207.869 72.1314 208.132 72.7141 208.558 73.17C208.558 73.17 210.145 76.6659 216.006 77.8533C216.006 77.8533 217.308 78.8317 217.634 78.7786L216.635 76.6825C216.635 76.6825 215.121 77.4586 213.82 76.9312C213.82 76.9312 216.582 76.7687 216.506 76.3641C216.506 76.2811 215.933 75.2728 215.933 75.2728C215.933 75.2728 213.291 76.6161 211.31 75.7339C211.31 75.7339 214.639 75.9826 215.727 74.8914L214.798 73.4221C214.798 73.4221 212.076 74.9743 209.779 74.0589C209.779 74.0589 213.257 74.1982 214.575 73.1136L213.467 71.7869C213.467 71.7869 210.781 73.2529 208.877 72.4768C208.877 72.4768 212.911 72.2347 213.204 71.5017C213.204 71.5017 212.112 70.3508 211.673 70.175C211.673 70.175 209.723 71.17 208.658 70.6327C208.658 70.6327 211.32 70.1883 211.337 69.8931C211.337 69.8931 209.516 68.7687 208.288 68.6858C209.421 68.7059 210.528 69.0216 211.5 69.6012C211.348 68.9232 211.001 68.3042 210.501 67.8201C210.501 67.8201 211.77 67.9627 211.943 69.8765C211.943 69.8765 213.33 70.8118 213.42 71.0705C213.42 71.0705 213.517 69.1567 212.961 68.0158C212.961 68.0158 214.186 68.9942 213.727 71.4088L214.868 72.7156C214.868 72.7156 215.128 70.1883 214.712 69.1368C214.712 69.1368 215.803 70.3276 215.131 73.0672L216.053 74.4967C216.053 74.4967 216.446 72.3375 216.236 71.0672C216.236 71.0672 217.008 72.3939 216.303 74.9179L216.809 75.9461C216.809 75.9461 217.065 74.364 217.098 73.903C217.131 73.442 217.258 73.4121 217.258 73.4121C217.458 74.4016 217.379 75.427 217.028 76.374C217.028 76.374 217.923 78.5631 218.07 78.5199Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M232.635 239.089C237.585 239.089 241.598 238.413 241.598 237.579C241.598 236.746 237.585 236.07 232.635 236.07C227.685 236.07 223.672 236.746 223.672 237.579C223.672 238.413 227.685 239.089 232.635 239.089Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M199.961 262.003C204.911 262.003 208.924 261.327 208.924 260.493C208.924 259.66 204.911 258.984 199.961 258.984C195.011 258.984 190.998 259.66 190.998 260.493C190.998 261.327 195.011 262.003 199.961 262.003Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M30.9991 250.26C35.9492 250.26 39.9621 249.585 39.9621 248.751C39.9621 247.918 35.9492 247.242 30.9991 247.242C26.049 247.242 22.0361 247.918 22.0361 248.751C22.0361 249.585 26.049 250.26 30.9991 250.26Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.1",
    d: "M267.944 260.487C272.895 260.487 276.907 259.811 276.907 258.978C276.907 258.144 272.895 257.469 267.944 257.469C262.994 257.469 258.981 258.144 258.981 258.978C258.981 259.811 262.994 260.487 267.944 260.487Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M277.276 242.089C284.668 242.089 290.659 241.079 290.659 239.834C290.659 238.588 284.668 237.578 277.276 237.578C269.885 237.578 263.894 238.588 263.894 239.834C263.894 241.079 269.885 242.089 277.276 242.089Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M282.825 236.143C283.436 235.648 283.88 234.979 284.1 234.226C284.266 233.463 283.94 232.551 283.211 232.272C282.392 231.96 281.517 232.524 280.851 233.095C280.185 233.665 279.43 234.318 278.561 234.199C279.007 233.795 279.341 233.284 279.53 232.713C279.719 232.143 279.757 231.534 279.64 230.945C279.602 230.701 279.498 230.472 279.34 230.282C278.884 229.798 278.062 230.007 277.516 230.388C275.786 231.602 275.303 233.944 275.293 236.053C275.12 235.294 275.266 234.501 275.263 233.731C275.26 232.962 275.043 232.073 274.381 231.668C273.974 231.442 273.515 231.328 273.05 231.337C272.271 231.31 271.402 231.386 270.873 231.954C270.207 232.657 270.384 233.841 270.956 234.607C271.529 235.373 272.404 235.867 273.209 236.405C273.854 236.788 274.404 237.311 274.82 237.934C274.868 238.021 274.907 238.112 274.937 238.206H279.816C280.908 237.657 281.921 236.963 282.825 236.143Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M24.9814 241.737C24.9814 241.737 30.0903 241.581 31.6379 240.486C33.1856 239.392 39.5026 238.088 39.8854 239.843C40.2681 241.598 47.567 248.563 41.7958 248.609C36.0246 248.656 28.3862 247.714 26.8486 246.778C25.3109 245.843 24.9814 241.737 24.9814 241.737Z",
    fill: "#A8A8A8"
  }), /*#__PURE__*/React__default.createElement("path", {
    opacity: "0.2",
    d: "M41.8923 248.003C36.1211 248.049 28.4828 247.108 26.9451 246.172C25.7736 245.462 25.3076 242.912 25.1512 241.734H24.9814C24.9814 241.734 25.3143 245.844 26.8419 246.776C28.3696 247.708 36.0179 248.653 41.7891 248.607C43.4532 248.607 44.029 248.003 43.9991 247.127C43.7661 247.661 43.1304 247.993 41.8923 248.003Z",
    fill: "black"
  })), /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement("linearGradient", {
    id: "paint0_linear_7426_33765",
    x1: "74.2163",
    y1: "143.751",
    x2: "178.101",
    y2: "143.751",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React__default.createElement("stop", {
    "stop-color": "#808080",
    "stop-opacity": "0.25"
  }), /*#__PURE__*/React__default.createElement("stop", {
    offset: "0.54",
    "stop-color": "#808080",
    "stop-opacity": "0.12"
  }), /*#__PURE__*/React__default.createElement("stop", {
    offset: "1",
    "stop-color": "#808080",
    "stop-opacity": "0.1"
  })), /*#__PURE__*/React__default.createElement("clipPath", {
    id: "clip0_7426_33765"
  }, /*#__PURE__*/React__default.createElement("rect", {
    width: "336",
    height: "262",
    fill: "white"
  }))));
};
var WorksMgmtIcon = function WorksMgmtIcon(_ref87) {
  var _ref87$fill = _ref87.fill,
    fill = _ref87$fill === void 0 ? "white" : _ref87$fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "34",
    height: "36",
    viewBox: "0 0 34 36",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M33.1161 29.2786L24.2827 20.4453H22.6327L18.3994 24.6786V26.3286L27.2327 35.162C27.8827 35.812 28.9327 35.812 29.5827 35.162L33.1161 31.6286C33.7661 30.9953 33.7661 29.9286 33.1161 29.2786Z",
    fill: fill
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M25.8997 15.9807L28.2497 13.6307L31.783 17.1641C33.733 15.2141 33.733 12.0474 31.783 10.0974L25.883 4.1974L23.533 6.5474V1.8474L22.3663 0.664062L16.4663 6.56406L17.6497 7.7474H22.3663L20.0163 10.0974L21.783 11.8641L16.9663 16.6807L10.083 9.7974V7.43073L5.04967 2.3974L0.333008 7.11406L5.38301 12.1641H7.73301L14.6163 19.0474L13.1997 20.4641H9.66634L0.833008 29.2974C0.183008 29.9474 0.183008 30.9974 0.833008 31.6474L4.36634 35.1807C5.01634 35.8307 6.06634 35.8307 6.71634 35.1807L15.5497 26.3474V22.8141L24.133 14.2307L25.8997 15.9807Z",
    fill: fill
  }));
};
var BioMetricIcon = function BioMetricIcon(_ref88) {
  var _ref88$fill = _ref88.fill,
    fill = _ref88$fill === void 0 ? "#F47738" : _ref88$fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "30",
    height: "34",
    viewBox: "0 0 30 34",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M24.6886 4.11667C24.5553 4.11667 24.4219 4.08333 24.3053 4.01667C21.1053 2.36667 18.3386 1.66667 15.0219 1.66667C11.7219 1.66667 8.5886 2.45 5.7386 4.01667C5.3386 4.23333 4.8386 4.08333 4.60527 3.68333C4.3886 3.28333 4.5386 2.76667 4.9386 2.55C8.0386 0.866667 11.4386 0 15.0219 0C18.5719 0 21.6719 0.783333 25.0719 2.53333C25.4886 2.75 25.6386 3.25 25.4219 3.65C25.2719 3.95 24.9886 4.11667 24.6886 4.11667ZM0.838598 12.8667C0.671931 12.8667 0.505265 12.8167 0.355265 12.7167C-0.0280686 12.45 -0.111402 11.9333 0.155265 11.55C1.80526 9.21667 3.90527 7.38333 6.40527 6.1C11.6386 3.4 18.3386 3.38333 23.5886 6.08333C26.0886 7.36667 28.1886 9.18333 29.8386 11.5C30.1053 11.8667 30.0219 12.4 29.6386 12.6667C29.2553 12.9333 28.7386 12.85 28.4719 12.4667C26.9719 10.3667 25.0719 8.71667 22.8219 7.56667C18.0386 5.11667 11.9219 5.11667 7.15527 7.58333C4.8886 8.75 2.9886 10.4167 1.4886 12.5167C1.35526 12.75 1.10526 12.8667 0.838598 12.8667ZM11.2553 32.9833C11.0386 32.9833 10.8219 32.9 10.6719 32.7333C9.22193 31.2833 8.4386 30.35 7.32193 28.3333C6.17193 26.2833 5.57193 23.7833 5.57193 21.1C5.57193 16.15 9.80526 12.1167 15.0053 12.1167C20.2053 12.1167 24.4386 16.15 24.4386 21.1C24.4386 21.5667 24.0719 21.9333 23.6053 21.9333C23.1386 21.9333 22.7719 21.5667 22.7719 21.1C22.7719 17.0667 19.2886 13.7833 15.0053 13.7833C10.7219 13.7833 7.2386 17.0667 7.2386 21.1C7.2386 23.5 7.77193 25.7167 8.7886 27.5167C9.85527 29.4333 10.5886 30.25 11.8719 31.55C12.1886 31.8833 12.1886 32.4 11.8719 32.7333C11.6886 32.9 11.4719 32.9833 11.2553 32.9833ZM23.2053 29.9C21.2219 29.9 19.4719 29.4 18.0386 28.4167C15.5553 26.7333 14.0719 24 14.0719 21.1C14.0719 20.6333 14.4386 20.2667 14.9053 20.2667C15.3719 20.2667 15.7386 20.6333 15.7386 21.1C15.7386 23.45 16.9386 25.6667 18.9719 27.0333C20.1553 27.8333 21.5386 28.2167 23.2053 28.2167C23.6053 28.2167 24.2719 28.1667 24.9386 28.05C25.3886 27.9667 25.8219 28.2667 25.9053 28.7333C25.9886 29.1833 25.6886 29.6167 25.2219 29.7C24.2719 29.8833 23.4386 29.9 23.2053 29.9ZM19.8553 33.3333C19.7886 33.3333 19.7053 33.3167 19.6386 33.3C16.9886 32.5667 15.2553 31.5833 13.4386 29.8C11.1053 27.4833 9.82193 24.4 9.82193 21.1C9.82193 18.4 12.1219 16.2 14.9553 16.2C17.7886 16.2 20.0886 18.4 20.0886 21.1C20.0886 22.8833 21.6386 24.3333 23.5553 24.3333C25.4719 24.3333 27.0219 22.8833 27.0219 21.1C27.0219 14.8167 21.6053 9.71667 14.9386 9.71667C10.2053 9.71667 5.87193 12.35 3.92193 16.4333C3.27193 17.7833 2.9386 19.3667 2.9386 21.1C2.9386 22.4 3.05526 24.45 4.05526 27.1167C4.22193 27.55 4.00526 28.0333 3.57193 28.1833C3.1386 28.35 2.65526 28.1167 2.50526 27.7C1.6886 25.5167 1.2886 23.35 1.2886 21.1C1.2886 19.1 1.67193 17.2833 2.42193 15.7C4.6386 11.05 9.55526 8.03333 14.9386 8.03333C22.5219 8.03333 28.6886 13.8833 28.6886 21.0833C28.6886 23.7833 26.3886 25.9833 23.5553 25.9833C20.7219 25.9833 18.4219 23.7833 18.4219 21.0833C18.4219 19.3 16.8719 17.85 14.9553 17.85C13.0386 17.85 11.4886 19.3 11.4886 21.0833C11.4886 23.9333 12.5886 26.6 14.6053 28.6C16.1886 30.1667 17.7053 31.0333 20.0553 31.6833C20.5053 31.8 20.7553 32.2667 20.6386 32.7C20.5553 33.0833 20.2053 33.3333 19.8553 33.3333Z",
    fill: fill
  }));
};
var AddFileFilled = function AddFileFilled(_ref89) {
  var _ref89$className = _ref89.className,
    className = _ref89$className === void 0 ? "" : _ref89$className,
    _ref89$fill = _ref89.fill,
    fill = _ref89$fill === void 0 ? "" : _ref89$fill,
    _ref89$style = _ref89.style,
    style = _ref89$style === void 0 ? {} : _ref89$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "19",
    className: className,
    height: "18",
    style: style,
    viewBox: "0 0 19 18",
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M14.6016 8.75C15.2141 8.75 15.8003 8.86375 16.3516 9.05625V5.25L11.1016 0H2.35156C1.38031 0 0.601562 0.77875 0.601562 1.75V14C0.601562 14.9712 1.38906 15.75 2.35156 15.75H9.65781C9.46531 15.1987 9.35156 14.6125 9.35156 14C9.35156 11.1037 11.7053 8.75 14.6016 8.75ZM10.2266 1.3125L15.0391 6.125H10.2266V1.3125ZM18.1016 13.125V14.875H15.4766V17.5H13.7266V14.875H11.1016V13.125H13.7266V10.5H15.4766V13.125H18.1016Z",
    fill: "#F47738"
  }));
};
var LocateIcon = function LocateIcon(_ref90) {
  var _ref90$className = _ref90.className,
    className = _ref90$className === void 0 ? "" : _ref90$className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    className: className,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11 7C8.79 7 7 8.79 7 11C7 13.21 8.79 15 11 15C13.21 15 15 13.21 15 11C15 8.79 13.21 7 11 7ZM19.94 10C19.48 5.83 16.17 2.52 12 2.06V0H10V2.06C5.83 2.52 2.52 5.83 2.06 10H0V12H2.06C2.52 16.17 5.83 19.48 10 19.94V22H12V19.94C16.17 19.48 19.48 16.17 19.94 12H22V10H19.94ZM11 18C7.13 18 4 14.87 4 11C4 7.13 7.13 4 11 4C14.87 4 18 7.13 18 11C18 14.87 14.87 18 11 18Z",
    fill: "#505A5F"
  }));
};
var ProjectIcon = function ProjectIcon(_ref91) {
  var _ref91$className = _ref91.className,
    className = _ref91$className === void 0 ? "" : _ref91$className,
    _ref91$fill = _ref91.fill,
    fill = _ref91$fill === void 0 ? "none" : _ref91$fill,
    _ref91$style = _ref91.style,
    style = _ref91$style === void 0 ? {} : _ref91$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "22",
    viewBox: "0 0 28 22",
    className: className,
    style: style,
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11.3346 0.333984H3.33464C1.86797 0.333984 0.681302 1.53398 0.681302 3.00065L0.667969 19.0007C0.667969 20.4673 1.86797 21.6673 3.33464 21.6673H24.668C26.1346 21.6673 27.3346 20.4673 27.3346 19.0007V5.66732C27.3346 4.20065 26.1346 3.00065 24.668 3.00065H14.0013L11.3346 0.333984Z",
    fill: "white"
  }));
};
var EstimateIcon = function EstimateIcon(_ref92) {
  var _ref92$className = _ref92.className,
    className = _ref92$className === void 0 ? "" : _ref92$className,
    _ref92$fill = _ref92.fill,
    fill = _ref92$fill === void 0 ? "none" : _ref92$fill,
    _ref92$style = _ref92.style,
    style = _ref92$style === void 0 ? {} : _ref92$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "31",
    viewBox: "0 0 28 31",
    className: className,
    style: style,
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M21.3333 3.00065H15.76C15.2 1.45398 13.7333 0.333984 12 0.333984C10.2667 0.333984 8.8 1.45398 8.24 3.00065H2.66667C1.2 3.00065 0 4.20065 0 5.66732V24.334C0 25.8007 1.2 27.0007 2.66667 27.0007H21.3333C22.8 27.0007 24 25.8007 24 24.334V5.66732C24 4.20065 22.8 3.00065 21.3333 3.00065ZM12 3.00065C12.7333 3.00065 13.3333 3.60065 13.3333 4.33398C13.3333 5.06732 12.7333 5.66732 12 5.66732C11.2667 5.66732 10.6667 5.06732 10.6667 4.33398C10.6667 3.60065 11.2667 3.00065 12 3.00065ZM12.6667 21.6673H5.33333V19.0007H12.6667V21.6673ZM18.6667 16.334H5.33333V13.6673H18.6667V16.334ZM18.6667 11.0007H5.33333V8.33398H18.6667V11.0007Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("circle", {
    cx: "21",
    cy: "24",
    r: "6.5",
    fill: "#F8F8F8",
    stroke: "#0B4B66"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M23.998 22.1797L23.6992 23.3164H18.1738L18.4785 22.1797H23.998ZM21.168 28.5723L18.3438 25.2266L18.3379 24.2246H19.7148C20.0352 24.2246 20.2988 24.1621 20.5059 24.0371C20.7129 23.9121 20.8672 23.7441 20.9688 23.5332C21.0703 23.3184 21.1211 23.0801 21.1211 22.8184C21.1211 22.5449 21.0742 22.3027 20.9805 22.0918C20.8867 21.8809 20.7363 21.7168 20.5293 21.5996C20.3223 21.4785 20.0469 21.418 19.7031 21.418H18.1797L18.5254 20.041H19.7031C20.4062 20.041 20.9922 20.1465 21.4609 20.3574C21.9297 20.5684 22.2812 20.873 22.5156 21.2715C22.75 21.666 22.8672 22.1445 22.8672 22.707C22.8672 23.1992 22.7891 23.6309 22.6328 24.002C22.4766 24.373 22.2285 24.6797 21.8887 24.9219C21.5488 25.1602 21.1016 25.3281 20.5469 25.4258L23.0898 28.4902V28.5723H21.168ZM24.0098 20.041L23.7051 21.1719H19.1289L19.4336 20.041H24.0098Z",
    fill: "#0B4B66"
  }));
};
var OrganisationIcon = function OrganisationIcon(_ref93) {
  var _ref93$className = _ref93.className,
    className = _ref93$className === void 0 ? "" : _ref93$className,
    _ref93$fill = _ref93.fill,
    fill = _ref93$fill === void 0 ? "none" : _ref93$fill,
    _ref93$style = _ref93.style,
    style = _ref93$style === void 0 ? {} : _ref93$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    className: className,
    style: style,
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M29.675 21.7392H28.1712L28.1709 17.6893C28.1644 17.6289 28.1525 17.5691 28.1351 17.511C28.1525 17.4527 28.1644 17.3931 28.1709 17.3327C28.1712 17.0481 28.0583 16.775 27.8572 16.5737C27.656 16.3723 27.3832 16.2591 27.0984 16.2589H17.0752V13.5307C18.8187 13.1727 20.2694 11.9699 20.9439 10.3226C21.6183 8.67533 21.4278 6.80052 20.436 5.32254C19.4441 3.84457 17.7812 2.95801 16.0013 2.95801C14.2214 2.95801 12.5584 3.84457 11.5665 5.32254C10.5747 6.80052 10.3842 8.67533 11.0587 10.3226C11.7331 11.9699 13.1838 13.1727 14.9275 13.5307V16.2589H4.90539C4.62057 16.2587 4.3477 16.3715 4.14614 16.5726C3.94479 16.7738 3.83153 17.0468 3.83153 17.3315V17.3327C3.83804 17.3921 3.84978 17.451 3.86677 17.5083C3.84915 17.5674 3.83699 17.628 3.83028 17.6893V21.7392H2.32776C2.04295 21.739 1.77007 21.8519 1.56851 22.053C1.36716 22.2541 1.25391 22.5272 1.25391 22.8118V27.9683C1.2537 28.2529 1.36654 28.526 1.56767 28.7274C1.76881 28.9287 2.04167 29.042 2.3265 29.0422H7.48177C7.76659 29.0424 8.03947 28.9293 8.24103 28.7282C8.44237 28.5271 8.55563 28.2542 8.55563 27.9696V22.8131C8.55584 22.5283 8.443 22.2554 8.24186 22.0538C8.04073 21.8525 7.76787 21.7392 7.48304 21.7392H5.978V18.4066H14.9274L14.9276 21.7392H13.4246C13.14 21.739 12.8671 21.8519 12.6656 22.053C12.4642 22.2541 12.351 22.5272 12.3508 22.8118V27.9683C12.3508 28.2529 12.4636 28.526 12.6647 28.7274C12.8659 28.9287 13.1387 29.042 13.4236 29.0422H18.578C18.8626 29.0424 19.1357 28.9293 19.337 28.7282C19.5384 28.5271 19.6516 28.2542 19.6518 27.9696V22.8131C19.6518 22.5283 19.539 22.2554 19.3379 22.0538C19.1367 21.8525 18.8639 21.7392 18.579 21.7392H17.0752V18.4066H26.0235L26.0233 21.7392H24.5206C24.236 21.739 23.9629 21.8519 23.7615 22.053C23.5602 22.2541 23.4469 22.5272 23.4467 22.8118V27.9683C23.4467 28.2529 23.5596 28.526 23.7607 28.7274C23.9618 28.9287 24.2347 29.042 24.5195 29.0422H29.675H29.6748C29.9596 29.0424 30.2325 28.9293 30.4341 28.7282C30.6354 28.5271 30.7487 28.2542 30.7487 27.9696V22.8131C30.7489 22.5283 30.636 22.2554 30.4349 22.0538C30.2338 21.8525 29.9607 21.7392 29.6761 21.7392L29.675 21.7392ZM12.8082 8.29749C12.8086 7.45061 13.1453 6.63852 13.7443 6.03991C14.343 5.44136 15.1554 5.10514 16.0023 5.10535C16.849 5.10535 17.6611 5.44197 18.2599 6.04099C18.8586 6.63976 19.1949 7.45206 19.1949 8.29878C19.1946 9.14566 18.8582 9.95775 18.2594 10.5566C17.6605 11.1553 16.8484 11.4918 16.0016 11.4918C15.1545 11.4918 14.342 11.1552 13.7433 10.5561C13.1445 9.95694 12.8081 9.14443 12.8083 8.29754L12.8082 8.29749ZM6.40815 26.8947H3.40184V23.8871H6.40837L6.40815 26.8947ZM17.5041 26.8947H14.4986V23.8871H17.5043L17.5041 26.8947ZM28.6011 26.8947H25.5946V23.8871H28.6011V26.8947Z",
    fill: "white"
  }));
};
var WageseekerIcon = function WageseekerIcon(_ref94) {
  var _ref94$className = _ref94.className,
    className = _ref94$className === void 0 ? "" : _ref94$className,
    _ref94$fill = _ref94.fill,
    fill = _ref94$fill === void 0 ? "none" : _ref94$fill,
    _ref94$style = _ref94.style,
    style = _ref94$style === void 0 ? {} : _ref94$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "32",
    height: "26",
    className: className,
    style: style,
    viewBox: "0 0 32 26",
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M15.9997 0C18.0699 0 19.7467 1.6356 19.7467 3.65442C19.7467 5.67349 18.0702 7.30883 15.9997 7.30883C13.9298 7.30883 12.2533 5.67373 12.2533 3.65442C12.2533 1.6356 13.9298 0 15.9997 0ZM6.36438 0C8.43458 0 10.1113 1.6356 10.1113 3.65442C10.1113 5.67349 8.43483 7.30883 6.36438 7.30883C4.29444 7.30883 2.61793 5.67373 2.61793 3.65442C2.61793 1.6356 4.29444 0 6.36438 0ZM10.178 17.0607V25.9994H2.55385V15.9281H0.5V12.5096C0.5 10.151 2.47417 8.22564 4.89249 8.22564H7.83697C8.75633 8.22564 9.61452 8.50528 10.3214 8.97954C9.48153 9.92812 8.97393 11.1619 8.97393 12.5096V17.0602H10.178L10.178 17.0607ZM25.6354 0C27.7053 0 29.3818 1.6356 29.3818 3.65442C29.3818 5.67349 27.7053 7.30883 25.6354 7.30883C23.5652 7.30883 21.8884 5.67373 21.8884 3.65442C21.8884 1.6356 23.5649 0 25.6354 0ZM29.4484 15.9288V26H21.825V17.0613H23.0261V12.5107C23.0261 11.163 22.5182 9.92948 21.6786 8.98065C22.3855 8.50637 23.2437 8.22675 24.163 8.22675H27.1075C29.5258 8.22675 31.5 10.1522 31.5 12.5107V15.9293H29.4486L29.4484 15.9288ZM19.8131 15.9288V26H12.1896V15.9288H10.1352V12.5103C10.1352 10.1517 12.1094 8.22626 14.5277 8.22626H17.4722C19.8905 8.22626 21.8647 10.1517 21.8647 12.5103V15.9288H19.8131Z",
    fill: "white"
  }));
};
var ContractIcon = function ContractIcon(_ref95) {
  var _ref95$className = _ref95.className,
    className = _ref95$className === void 0 ? "" : _ref95$className,
    _ref95$fill = _ref95.fill,
    fill = _ref95$fill === void 0 ? "none" : _ref95$fill,
    _ref95$style = _ref95.style,
    style = _ref95$style === void 0 ? {} : _ref95$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "27",
    className: className,
    style: style,
    viewBox: "0 0 24 27",
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M21.3333 3.00065H15.76C15.2 1.45398 13.7333 0.333984 12 0.333984C10.2667 0.333984 8.8 1.45398 8.24 3.00065H2.66667C1.2 3.00065 0 4.20065 0 5.66732V24.334C0 25.8007 1.2 27.0007 2.66667 27.0007H21.3333C22.8 27.0007 24 25.8007 24 24.334V5.66732C24 4.20065 22.8 3.00065 21.3333 3.00065ZM12 3.00065C12.7333 3.00065 13.3333 3.60065 13.3333 4.33398C13.3333 5.06732 12.7333 5.66732 12 5.66732C11.2667 5.66732 10.6667 5.06732 10.6667 4.33398C10.6667 3.60065 11.2667 3.00065 12 3.00065Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("g", {
    "clip-path": "url(#clip0_1_3)"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M14.9269 16.7879L13.3359 18.3789L17.8331 22.8761L19.4241 21.2851L14.9269 16.7879Z",
    fill: "#0B4B66"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M16.1242 14.4996C17.5717 14.4996 18.7492 13.3221 18.7492 11.8746C18.7492 11.4396 18.6292 11.0346 18.4417 10.6746L16.4167 12.6996L15.2992 11.5821L17.3242 9.55711C16.9642 9.36961 16.5592 9.24961 16.1242 9.24961C14.6767 9.24961 13.4992 10.4271 13.4992 11.8746C13.4992 12.1821 13.5592 12.4746 13.6567 12.7446L12.2692 14.1321L10.9342 12.7971L11.4667 12.2646L10.4092 11.2071L11.9992 9.61711C11.1217 8.73961 9.69672 8.73961 8.81922 9.61711L6.16422 12.2721L7.22172 13.3296H5.10672L4.57422 13.8621L7.22922 16.5171L7.76172 15.9846V13.8621L8.81922 14.9196L9.35172 14.3871L10.6867 15.7221L5.12922 21.2796L6.71922 22.8696L15.2542 14.3421C15.5242 14.4396 15.8167 14.4996 16.1242 14.4996Z",
    fill: "#0B4B66"
  })), /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement("clipPath", {
    id: "clip0_1_3"
  }, /*#__PURE__*/React__default.createElement("rect", {
    width: "18",
    height: "18",
    fill: "white",
    transform: "translate(3 7)"
  }))));
};
var DashboardIcon = function DashboardIcon(_ref96) {
  var _ref96$className = _ref96.className,
    className = _ref96$className === void 0 ? "" : _ref96$className,
    _ref96$fill = _ref96.fill,
    fill = _ref96$fill === void 0 ? "none" : _ref96$fill,
    _ref96$style = _ref96.style,
    style = _ref96$style === void 0 ? {} : _ref96$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "24",
    className: className,
    style: style,
    viewBox: "0 0 24 24",
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 13.3333H10.6667V0H0V13.3333ZM0 24H10.6667V16H0V24ZM13.3333 24H24V10.6667H13.3333V24ZM13.3333 0V8H24V0H13.3333Z",
    fill: "white"
  }));
};
var HelperIcon = function HelperIcon(_ref97) {
  var _ref97$className = _ref97.className,
    className = _ref97$className === void 0 ? "" : _ref97$className,
    _ref97$fill = _ref97.fill,
    fill = _ref97$fill === void 0 ? "none" : _ref97$fill,
    _ref97$style = _ref97.style,
    style = _ref97$style === void 0 ? {} : _ref97$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "32",
    height: "32",
    className: className,
    style: style,
    viewBox: "0 0 32 32",
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("g", {
    "clip-path": "url(#clip0_4347_41530)"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M14.668 24.0003H17.3346V21.3337H14.668V24.0003ZM16.0013 2.66699C8.6413 2.66699 2.66797 8.64033 2.66797 16.0003C2.66797 23.3603 8.6413 29.3337 16.0013 29.3337C23.3613 29.3337 29.3346 23.3603 29.3346 16.0003C29.3346 8.64033 23.3613 2.66699 16.0013 2.66699ZM16.0013 26.667C10.1213 26.667 5.33464 21.8803 5.33464 16.0003C5.33464 10.1203 10.1213 5.33366 16.0013 5.33366C21.8813 5.33366 26.668 10.1203 26.668 16.0003C26.668 21.8803 21.8813 26.667 16.0013 26.667ZM16.0013 8.00033C13.0546 8.00033 10.668 10.387 10.668 13.3337H13.3346C13.3346 11.867 14.5346 10.667 16.0013 10.667C17.468 10.667 18.668 11.867 18.668 13.3337C18.668 16.0003 14.668 15.667 14.668 20.0003H17.3346C17.3346 17.0003 21.3346 16.667 21.3346 13.3337C21.3346 10.387 18.948 8.00033 16.0013 8.00033Z",
    fill: "white"
  })), /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement("clipPath", {
    id: "clip0_4347_41530"
  }, /*#__PURE__*/React__default.createElement("rect", {
    width: "32",
    height: "32",
    fill: "white"
  }))));
};
var AttendanceIcon = function AttendanceIcon(_ref98) {
  var _ref98$className = _ref98.className,
    className = _ref98$className === void 0 ? "" : _ref98$className,
    _ref98$fill = _ref98.fill,
    fill = _ref98$fill === void 0 ? "none" : _ref98$fill,
    _ref98$style = _ref98.style,
    style = _ref98$style === void 0 ? {} : _ref98$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    className: className,
    style: style,
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M23.9674 19.9844C21.0132 19.9844 18.5968 22.2203 18.3063 25.096C18.287 25.2879 18.2773 25.4831 18.2773 25.6798C18.2773 25.8687 18.2875 26.0542 18.3053 26.2382C18.3104 26.2924 18.3208 26.3463 18.3274 26.4004C18.6807 29.2087 21.0613 31.3745 23.9674 31.3745C26.8736 31.3745 29.258 29.2087 29.612 26.4004C29.6186 26.3463 29.6291 26.2924 29.6341 26.2382C29.6519 26.0542 29.6621 25.8687 29.6621 25.6798C29.6621 22.5289 27.1186 19.9844 23.9674 19.9844ZM26.6029 23.0278C26.7603 23.0232 26.9122 23.0839 27.0233 23.1958C27.2439 23.4177 27.2439 23.7765 27.0233 23.9984L23.804 27.2221C23.716 27.3105 23.6017 27.3675 23.4781 27.3845C23.4624 27.3868 23.4464 27.3883 23.4304 27.3891C23.2687 27.3977 23.1109 27.337 22.9967 27.2221L20.9839 25.2083C20.8769 25.1016 20.8167 24.9567 20.8167 24.8052C20.8167 24.654 20.8769 24.5091 20.9839 24.4021C21.0864 24.2986 21.2244 24.2381 21.3698 24.2331C21.5274 24.229 21.6794 24.2902 21.7902 24.4021L23.4003 26.0112L26.2203 23.1957C26.322 23.0933 26.4588 23.0333 26.6029 23.0277L26.6029 23.0278Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M5.18073 14.0079C5.73151 14.0079 6.25584 14.1431 6.76753 14.2959C6.48515 14.9735 6.31943 15.7296 6.31943 16.5666V22.2623H0.625V17.7065C0.625 16.454 1.16028 15.5837 1.99929 14.962C2.83852 14.3403 4.00518 14.0078 5.18075 14.0078L5.18073 14.0079Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M13.4337 11.5879C14.5168 11.5879 15.5471 11.898 16.4705 12.3362C15.9083 13.0822 15.5441 13.9667 15.4575 14.9739C15.4376 15.1211 15.4252 15.2721 15.4252 15.4286V23.9687H7.45703V16.5673C7.45703 16.337 7.47228 16.1179 7.49922 15.9068C7.50202 15.8831 7.50837 15.8613 7.51142 15.8379C7.60089 15.2139 7.80067 14.6674 8.08737 14.1843L8.08763 14.1845C8.10212 14.1593 8.11482 14.1334 8.12524 14.1065C8.42694 13.6238 8.81509 13.2093 9.27739 12.861C10.3835 12.0274 11.9045 11.5879 13.4341 11.5879L13.4337 11.5879Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M23.9678 10.4473C25.8723 10.4473 27.7755 10.8999 29.1495 11.7504C30.5236 12.6011 31.3735 13.7817 31.3735 15.4277V26.2465H30.7508C30.7643 26.0876 30.7859 25.9305 30.7943 25.7717C30.7994 25.7412 30.8022 25.7104 30.8022 25.6794C30.8022 25.6629 30.8001 25.6469 30.7999 25.6303V25.6306V25.626C30.7762 22.5737 28.7388 19.9906 25.9539 19.1419C25.7444 19.0781 25.5317 19.0232 25.3144 18.9795C25.3068 18.978 25.2986 18.9777 25.291 18.9762C25.0818 18.935 24.8693 18.9023 24.6538 18.8806C24.6528 18.8806 24.6515 18.8796 24.6505 18.8796C24.4261 18.857 24.1983 18.8451 23.9678 18.8451C23.7324 18.8451 23.4999 18.8573 23.2706 18.8806C19.8307 19.2314 17.1391 22.1483 17.1391 25.6795C17.1391 25.8709 17.1513 26.059 17.1668 26.2466H16.5664V24.5686V24.5688C16.5667 24.5591 16.5667 24.5495 16.5664 24.5398V15.4278C16.5664 15.2425 16.5809 15.0656 16.602 14.8918C16.6083 14.8402 16.6172 14.7898 16.6254 14.7395C16.6444 14.6198 16.6688 14.5034 16.6976 14.3893C16.7123 14.3313 16.7258 14.2734 16.7431 14.217C16.7751 14.111 16.8147 14.009 16.8554 13.9079C16.9065 13.7826 16.9642 13.6603 17.0277 13.5421C17.0519 13.4969 17.0753 13.4509 17.1012 13.4064C17.1579 13.3106 17.2186 13.2176 17.2834 13.1263C17.2982 13.1052 17.3137 13.0849 17.3289 13.064C17.4799 12.8597 17.6504 12.666 17.8403 12.4825L17.8408 12.4822C17.8553 12.4675 17.869 12.4517 17.882 12.4355C18.1504 12.1861 18.4546 11.9584 18.7904 11.7505C20.1644 10.8998 22.0633 10.4474 23.9678 10.4474L23.9678 10.4473Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M5.17963 7.46096C6.12974 7.46096 6.88537 8.21789 6.88537 9.16794C6.88537 10.118 6.12974 10.8782 5.17963 10.8782C4.22952 10.8782 3.47266 10.118 3.47266 9.16794C3.47266 9.04924 3.4846 8.93359 3.50722 8.82202C3.66506 8.04069 4.34827 7.46096 5.17963 7.46096Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M13.1504 2.90457C13.249 2.90457 13.3468 2.9094 13.4429 2.91906H13.4462C13.541 2.92872 13.6346 2.94371 13.7263 2.96252C14.6555 3.15162 15.4173 3.78985 15.777 4.64282C15.8847 4.89877 15.9559 5.17429 15.9849 5.46228C15.9945 5.5581 15.9994 5.6557 15.9994 5.75457C15.9994 5.85319 15.9945 5.95003 15.9849 6.04585C15.9559 6.33383 15.8847 6.60985 15.777 6.86531C15.4176 7.7173 14.6559 8.35372 13.7263 8.54229C13.5418 8.57965 13.3507 8.59973 13.1547 8.59998C13.0561 8.59998 12.9582 8.59414 12.8621 8.58448C11.6136 8.45892 10.6081 7.53657 10.3624 6.32951C10.3248 6.14371 10.3047 5.95207 10.3047 5.75458C10.3047 5.65596 10.3095 5.55811 10.3192 5.46203C10.3288 5.36595 10.3436 5.2714 10.3626 5.17838C10.6084 3.97034 11.6139 3.04488 12.8624 2.91878C12.9569 2.90938 13.0533 2.9043 13.1504 2.9043V2.90457Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M23.9677 0.626961C24.0861 0.626961 24.2028 0.633061 24.3179 0.644753C25.815 0.795729 27.021 1.90491 27.3158 3.35344C27.3611 3.57635 27.3847 3.80611 27.3847 4.04302C27.3847 4.27965 27.3611 4.51069 27.3158 4.73358C27.021 6.18211 25.815 7.29131 24.3179 7.44227C24.2043 7.45371 24.0889 7.45981 23.972 7.46006C23.8536 7.46006 23.7369 7.45396 23.6218 7.44227C23.5066 7.43058 23.393 7.4138 23.2814 7.39118C22.0558 7.14184 21.0732 6.24007 20.7082 5.06145C20.6086 4.74018 20.5547 4.39782 20.5547 4.04301C20.5547 3.92457 20.5608 3.8079 20.5725 3.69277C20.5956 3.46249 20.6419 3.23984 20.7082 3.02557C21.0732 1.84726 22.0555 0.945432 23.2814 0.695833C23.3927 0.673212 23.5066 0.656183 23.6218 0.644745C23.7354 0.633308 23.8508 0.626961 23.9677 0.626961Z",
    fill: "white"
  }));
};
var HRIcon = function HRIcon(_ref99) {
  var _ref99$className = _ref99.className,
    className = _ref99$className === void 0 ? "" : _ref99$className,
    _ref99$fill = _ref99.fill,
    fill = _ref99$fill === void 0 ? "none" : _ref99$fill,
    _ref99$style = _ref99.style,
    style = _ref99$style === void 0 ? {} : _ref99$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "28",
    className: className,
    style: style,
    viewBox: "0 0 28 28",
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M3.33464 6.00033H0.667969V24.667C0.667969 26.1337 1.86797 27.3337 3.33464 27.3337H22.0013V24.667H3.33464V6.00033ZM24.668 0.666992H8.66797C7.2013 0.666992 6.0013 1.86699 6.0013 3.33366V19.3337C6.0013 20.8003 7.2013 22.0003 8.66797 22.0003H24.668C26.1346 22.0003 27.3346 20.8003 27.3346 19.3337V3.33366C27.3346 1.86699 26.1346 0.666992 24.668 0.666992ZM16.668 3.33366C18.8813 3.33366 20.668 5.12033 20.668 7.33366C20.668 9.54699 18.8813 11.3337 16.668 11.3337C14.4546 11.3337 12.668 9.54699 12.668 7.33366C12.668 5.12033 14.4546 3.33366 16.668 3.33366ZM24.668 19.3337H8.66797V17.3337C8.66797 14.6803 14.0013 13.3337 16.668 13.3337C19.3346 13.3337 24.668 14.6803 24.668 17.3337V19.3337Z",
    fill: "white"
  }));
};
var MuktaHomeIcon = function MuktaHomeIcon(_ref100) {
  var _ref100$className = _ref100.className,
    className = _ref100$className === void 0 ? "" : _ref100$className,
    _ref100$fill = _ref100.fill,
    fill = _ref100$fill === void 0 ? "none" : _ref100$fill,
    _ref100$style = _ref100.style,
    style = _ref100$style === void 0 ? {} : _ref100$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "23",
    className: className,
    style: style,
    viewBox: "0 0 28 23",
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11.3346 22.6667V14.6667H16.668V22.6667H23.3346V12H27.3346L14.0013 0L0.667969 12H4.66797V22.6667H11.3346Z",
    fill: "white"
  }));
};
var DoubleTickIcon = function DoubleTickIcon(_ref101) {
  var _ref101$className = _ref101.className,
    className = _ref101$className === void 0 ? "" : _ref101$className,
    _ref101$fill = _ref101.fill,
    fill = _ref101$fill === void 0 ? "none" : _ref101$fill,
    _ref101$style = _ref101.style,
    style = _ref101$style === void 0 ? {} : _ref101$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "32",
    height: "19",
    viewBox: "0 0 32 19",
    className: className,
    style: style,
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M24.0002 2.33312L22.1202 0.453125L13.6669 8.90646L15.5469 10.7865L24.0002 2.33312ZM29.6535 0.453125L15.5469 14.5598L9.97354 8.99979L8.09354 10.8798L15.5469 18.3331L31.5469 2.33312L29.6535 0.453125ZM0.546875 10.8798L8.00021 18.3331L9.88021 16.4531L2.44021 8.99979L0.546875 10.8798Z",
    fill: "#F47738"
  }));
};
var InfoIcon = function InfoIcon(_ref102) {
  var _ref102$className = _ref102.className,
    className = _ref102$className === void 0 ? "" : _ref102$className,
    _ref102$fill = _ref102.fill,
    fill = _ref102$fill === void 0 ? "none" : _ref102$fill,
    _ref102$style = _ref102.style,
    style = _ref102$style === void 0 ? {} : _ref102$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    className: className,
    style: style,
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z",
    fill: "#505A5F"
  }));
};
var PaymentIcon = function PaymentIcon(_ref103) {
  var _ref103$className = _ref103.className,
    className = _ref103$className === void 0 ? "" : _ref103$className,
    _ref103$fill = _ref103.fill,
    fill = _ref103$fill === void 0 ? "none" : _ref103$fill,
    _ref103$style = _ref103.style,
    style = _ref103$style === void 0 ? {} : _ref103$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "34",
    height: "34",
    viewBox: "0 0 34 34",
    className: className,
    style: style,
    fill: fill,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("g", {
    "clip-path": "url(#clip0_7555_25801)"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M23.9987 2.66675H7.9987C6.53203 2.66675 5.33203 3.86675 5.33203 5.33341V26.6667C5.33203 28.1334 6.53203 29.3334 7.9987 29.3334H23.9987C25.4654 29.3334 26.6654 28.1334 26.6654 26.6667V5.33341C26.6654 3.86675 25.4654 2.66675 23.9987 2.66675ZM7.9987 5.33341H14.6654V16.0001L11.332 14.0001L7.9987 16.0001V5.33341Z",
    fill: "white"
  })), /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement("clipPath", {
    id: "clip0_7555_25801"
  }, /*#__PURE__*/React__default.createElement("rect", {
    width: "32",
    height: "32",
    fill: "white"
  }))));
};
var HistoryIcon = function HistoryIcon(_ref104) {
  var _ref104$className = _ref104.className,
    className = _ref104$className === void 0 ? "" : _ref104$className,
    _ref104$fill = _ref104.fill,
    fill = _ref104$fill === void 0 ? "none" : _ref104$fill,
    _ref104$style = _ref104.style,
    style = _ref104$style === void 0 ? {} : _ref104$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "36",
    height: "36",
    viewBox: "0 0 36 36",
    fill: fill,
    className: className,
    style: style,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M30.7437 5.30394C23.7393 -1.76798 12.3808 -1.76798 5.37636 5.30394L3.33196 7.36803V3.88935C3.33196 2.97184 2.5748 2.20731 1.66598 2.20731C0.757234 2.20731 0 2.97177 0 3.88935V11.42C0 12.3375 0.757166 13.102 1.66598 13.102H9.12473C10.0335 13.102 10.7907 12.3376 10.7907 11.42C10.7907 10.5025 10.0335 9.73794 9.12473 9.73794H5.67925L7.72365 7.67385C10.5633 4.80685 14.3116 3.35418 18.0599 3.35418C21.8083 3.35444 25.5565 4.80713 28.3961 7.67412C31.3493 10.6558 32.9017 14.7843 32.6366 18.9892C32.5988 19.9067 33.2802 20.7093 34.189 20.7858H34.3025C35.1733 20.7858 35.8927 20.0979 35.9685 19.2185C36.2714 14.0577 34.3783 8.97375 30.7435 5.304L30.7437 5.30394Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M18.2519 8.16797C17.3432 8.16797 16.5859 8.93243 16.5859 9.85001V18.1069C16.5859 18.8714 17.0782 19.5213 17.7976 19.7125L23.8176 21.4326C24.6883 21.7003 25.6349 21.1267 25.862 20.2857C26.1271 19.4066 25.5968 18.4509 24.6883 18.2216L19.9178 16.8073V9.85007C19.9178 8.93277 19.1984 8.16804 18.2519 8.16804L18.2519 8.16797Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M25.4454 31.0611C24.5746 31.5581 23.6659 31.9786 22.7194 32.2845C22.3406 32.3991 22.038 32.6668 21.8486 33.0108C21.6592 33.3548 21.6592 33.7753 21.7728 34.1577C22.038 34.9222 22.8707 35.3427 23.6281 35.1134C24.764 34.731 25.8619 34.2342 26.8842 33.6607C27.6036 33.2402 27.8307 32.3611 27.4143 31.6347C27.0733 30.9083 26.1646 30.6406 25.4454 31.0611Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M3.40851 20.1747C3.37074 19.7923 3.14335 19.4483 2.84069 19.1808C2.57553 18.9897 2.27287 18.875 1.96994 18.875H1.78058C1.40185 18.9131 1.06114 19.1427 0.796242 19.4483C0.569113 19.7541 0.455548 20.1362 0.531082 20.5567C0.682414 21.7801 0.947574 22.9651 1.36404 24.0736C1.6292 24.838 2.49996 25.2585 3.25712 24.9911C3.63585 24.8764 3.9385 24.5706 4.09008 24.2266C4.24141 23.8826 4.27944 23.4621 4.16588 23.0797C3.78715 22.1622 3.55977 21.1684 3.40844 20.1746L3.40851 20.1747Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M7.60837 28.6674C7.38124 28.4381 7.19188 28.2088 6.96476 27.9794C6.66183 27.6355 6.28338 27.4824 5.8669 27.4824C5.52621 27.4824 5.18553 27.5971 4.88257 27.8648C4.27672 28.4 4.20119 29.3556 4.769 29.9673C4.99613 30.235 5.26128 30.5025 5.52617 30.7702C6.09398 31.3435 6.73788 31.9171 7.38146 32.4138C8.02507 32.9109 8.97165 32.7578 9.42585 32.108C9.65298 31.8021 9.76655 31.42 9.72878 30.9995C9.69101 30.6172 9.46362 30.2732 9.16096 30.0057C8.63064 29.6231 8.10057 29.1645 7.6083 28.6675L7.60837 28.6674Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M33.281 24.1352C33.0538 24.0206 32.8645 23.9824 32.6374 23.9824C32.486 23.9824 32.3344 24.0206 32.1831 24.0589C31.8044 24.1736 31.5017 24.4413 31.3123 24.8234C30.8581 25.7026 30.328 26.582 29.7222 27.3464C29.2299 27.9963 29.3434 28.9138 29.9493 29.449C30.5551 29.946 31.5395 29.8313 32.0317 29.2196C32.7512 28.264 33.3948 27.2702 33.9248 26.1999C34.1142 25.8559 34.1142 25.4354 34.0006 25.053C33.8868 24.5939 33.6217 24.288 33.281 24.1352Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M17.1491 33.0137C16.1648 32.9371 15.1802 32.7844 14.2337 32.5166C14.1201 32.4785 13.9685 32.4785 13.855 32.4785C13.5898 32.4785 13.3627 32.555 13.1355 32.6697C12.7948 32.8609 12.5677 33.2049 12.4542 33.5872C12.227 34.3901 12.7193 35.1927 13.4765 35.422C14.6124 35.7279 15.7861 35.919 16.9975 35.9953H17.0733C17.8305 35.9953 18.4741 35.3836 18.5499 34.6192C18.5877 33.7784 17.9441 33.0521 17.1491 33.0137Z",
    fill: "#F47738"
  }));
};
var WarningIcon = function WarningIcon(_ref105) {
  var _ref105$className = _ref105.className,
    className = _ref105$className === void 0 ? "" : _ref105$className,
    _ref105$fill = _ref105.fill,
    fill = _ref105$fill === void 0 ? "none" : _ref105$fill,
    _ref105$style = _ref105.style,
    style = _ref105$style === void 0 ? {} : _ref105$style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: fill,
    className: className,
    style: style,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("g", {
    "clip-path": "url(#clip0_7513_43945)"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M1.66797 35.0007H38.3346L20.0013 3.33398L1.66797 35.0007ZM21.668 30.0007H18.3346V26.6673H21.668V30.0007ZM21.668 23.334H18.3346V16.6673H21.668V23.334Z",
    fill: "#F47738"
  })), /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement("clipPath", {
    id: "clip0_7513_43945"
  }, /*#__PURE__*/React__default.createElement("rect", {
    width: "40",
    height: "40",
    fill: "white"
  }))));
};
var ExpenditureIcon = BillsIcon;

var BackButton = function BackButton(_ref) {
  var history = _ref.history,
    style = _ref.style,
    isSuccessScreen = _ref.isSuccessScreen,
    isCommonPTPropertyScreen = _ref.isCommonPTPropertyScreen,
    getBackPageNumber = _ref.getBackPageNumber,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? "" : _ref$className,
    _ref$variant = _ref.variant,
    variant = _ref$variant === void 0 ? "black" : _ref$variant;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "back-btn2 " + className,
    style: style ? style : {},
    onClick: function onClick() {
      !isSuccessScreen ? !isCommonPTPropertyScreen ? (history.goBack(), window.location.href.includes("/citizen/pt/property/new-application/property-type") ? sessionStorage.setItem("docReqScreenByBack", true) : null) : history.go(getBackPageNumber()) : null;
    }
  }, variant == "black" ? /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(ArrowLeft, null), /*#__PURE__*/React__default.createElement("p", null, t("CS_COMMON_BACK"))) : /*#__PURE__*/React__default.createElement(ArrowLeftWhite, null));
};
var BackButton$1 = reactRouterDom.withRouter(BackButton);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var b = "function" === typeof Symbol && Symbol.for,
  c = b ? Symbol.for("react.element") : 60103,
  d = b ? Symbol.for("react.portal") : 60106,
  e = b ? Symbol.for("react.fragment") : 60107,
  f = b ? Symbol.for("react.strict_mode") : 60108,
  g = b ? Symbol.for("react.profiler") : 60114,
  h = b ? Symbol.for("react.provider") : 60109,
  k = b ? Symbol.for("react.context") : 60110,
  l = b ? Symbol.for("react.async_mode") : 60111,
  m = b ? Symbol.for("react.concurrent_mode") : 60111,
  n = b ? Symbol.for("react.forward_ref") : 60112,
  p = b ? Symbol.for("react.suspense") : 60113,
  q = b ? Symbol.for("react.suspense_list") : 60120,
  r = b ? Symbol.for("react.memo") : 60115,
  t = b ? Symbol.for("react.lazy") : 60116,
  v = b ? Symbol.for("react.block") : 60121,
  w = b ? Symbol.for("react.fundamental") : 60117,
  x = b ? Symbol.for("react.responder") : 60118,
  y = b ? Symbol.for("react.scope") : 60119;
function z(a) {
  if ("object" === typeof a && null !== a) {
    var u = a.$$typeof;
    switch (u) {
      case c:
        switch (a = a.type, a) {
          case l:
          case m:
          case e:
          case g:
          case f:
          case p:
            return a;
          default:
            switch (a = a && a.$$typeof, a) {
              case k:
              case n:
              case t:
              case r:
              case h:
                return a;
              default:
                return u;
            }
        }
      case d:
        return u;
    }
  }
}
function A(a) {
  return z(a) === m;
}
var AsyncMode = l;
var ConcurrentMode = m;
var ContextConsumer = k;
var ContextProvider = h;
var Element = c;
var ForwardRef = n;
var Fragment$1 = e;
var Lazy = t;
var Memo = r;
var Portal = d;
var Profiler = g;
var StrictMode = f;
var Suspense = p;
var isAsyncMode = function isAsyncMode(a) {
  return A(a) || z(a) === l;
};
var isConcurrentMode = A;
var isContextConsumer = function isContextConsumer(a) {
  return z(a) === k;
};
var isContextProvider = function isContextProvider(a) {
  return z(a) === h;
};
var isElement = function isElement(a) {
  return "object" === typeof a && null !== a && a.$$typeof === c;
};
var isForwardRef = function isForwardRef(a) {
  return z(a) === n;
};
var isFragment = function isFragment(a) {
  return z(a) === e;
};
var isLazy = function isLazy(a) {
  return z(a) === t;
};
var isMemo = function isMemo(a) {
  return z(a) === r;
};
var isPortal = function isPortal(a) {
  return z(a) === d;
};
var isProfiler = function isProfiler(a) {
  return z(a) === g;
};
var isStrictMode = function isStrictMode(a) {
  return z(a) === f;
};
var isSuspense = function isSuspense(a) {
  return z(a) === p;
};
var isValidElementType = function isValidElementType(a) {
  return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
};
var typeOf = z;
var reactIs_production_min = {
  AsyncMode: AsyncMode,
  ConcurrentMode: ConcurrentMode,
  ContextConsumer: ContextConsumer,
  ContextProvider: ContextProvider,
  Element: Element,
  ForwardRef: ForwardRef,
  Fragment: Fragment$1,
  Lazy: Lazy,
  Memo: Memo,
  Portal: Portal,
  Profiler: Profiler,
  StrictMode: StrictMode,
  Suspense: Suspense,
  isAsyncMode: isAsyncMode,
  isConcurrentMode: isConcurrentMode,
  isContextConsumer: isContextConsumer,
  isContextProvider: isContextProvider,
  isElement: isElement,
  isForwardRef: isForwardRef,
  isFragment: isFragment,
  isLazy: isLazy,
  isMemo: isMemo,
  isPortal: isPortal,
  isProfiler: isProfiler,
  isStrictMode: isStrictMode,
  isSuspense: isSuspense,
  isValidElementType: isValidElementType,
  typeOf: typeOf
};

var reactIs_development = createCommonjsModule(function (module, exports) {

  if (process.env.NODE_ENV !== "production") {
    (function () {
      var hasSymbol = typeof Symbol === 'function' && Symbol.for;
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
      var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
      var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
      var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
      var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
      var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
      function isValidElementType(type) {
        return typeof type === 'string' || typeof type === 'function' || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
      }
      function typeOf(object) {
        if (typeof object === 'object' && object !== null) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;
              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;
                default:
                  var $$typeofType = type && type.$$typeof;
                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
        return undefined;
      }
      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;
      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }
      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }
      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }
      exports.AsyncMode = AsyncMode;
      exports.ConcurrentMode = ConcurrentMode;
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Lazy = Lazy;
      exports.Memo = Memo;
      exports.Portal = Portal;
      exports.Profiler = Profiler;
      exports.StrictMode = StrictMode;
      exports.Suspense = Suspense;
      exports.isAsyncMode = isAsyncMode;
      exports.isConcurrentMode = isConcurrentMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isLazy = isLazy;
      exports.isMemo = isMemo;
      exports.isPortal = isPortal;
      exports.isProfiler = isProfiler;
      exports.isStrictMode = isStrictMode;
      exports.isSuspense = isSuspense;
      exports.isValidElementType = isValidElementType;
      exports.typeOf = typeOf;
    })();
  }
});

var reactIs = createCommonjsModule(function (module) {

  if (process.env.NODE_ENV === 'production') {
    module.exports = reactIs_production_min;
  } else {
    module.exports = reactIs_development;
  }
});

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }
    var test1 = new String('abc');
    test1[5] = 'de';
    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    }
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });
    if (order2.join('') !== '0123456789') {
      return false;
    }
    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var has = Function.call.bind(Object.prototype.hasOwnProperty);

var printWarning = function printWarning() {};
if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has$1 = has;
  printWarning = function printWarning(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      throw new Error(message);
    } catch (x) {}
  };
}
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has$1(typeSpecs, typeSpecName)) {
        var error;
        try {
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          loggedTypeFailures[error.message] = true;
          var stack = getStack ? getStack() : '';
          printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
        }
      }
    }
  }
}
checkPropTypes.resetWarningCache = function () {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};
var checkPropTypes_1 = checkPropTypes;

var printWarning$1 = function printWarning() {};
if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function printWarning(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      throw new Error(message);
    } catch (x) {}
  };
}
function emptyFunctionThatReturnsNull() {
  return null;
}
var factoryWithTypeCheckers = function factoryWithTypeCheckers(isValidElement, throwOnDirectAccess) {
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }
  var ANONYMOUS = '<<anonymous>>';
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),
    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };
  function is(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data : {};
    this.stack = '';
  }
  PropTypeError.prototype = Error.prototype;
  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;
      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          var cacheKey = componentName + ':' + propName;
          if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
            printWarning$1('You are manually calling a React.PropTypes validation ' + 'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.');
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }
    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);
    return chainedCheckType;
  }
  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        var preciseType = getPreciseType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'), {
          expectedType: expectedType
        });
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }
  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1('Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' + 'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).');
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }
      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }
  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1('Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.');
        return emptyFunctionThatReturnsNull;
      }
    }
    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = expectedTypes.length > 0 ? ', expected one of type [' + expectedTypes.join(', ') + ']' : '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }
  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError((componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + type + '`.');
  }
  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }
  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }
        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }
        return true;
      default:
        return false;
    }
  }
  function isSymbol(propType, propValue) {
    if (propType === 'symbol') {
      return true;
    }
    if (!propValue) {
      return false;
    }
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }
    return false;
  }
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }
  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;
var factoryWithThrowingShims = function factoryWithThrowingShims() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      return;
    }
    var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
    err.name = 'Invariant Violation';
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
  if (process.env.NODE_ENV !== 'production') {
    var ReactIs = reactIs;
    var throwOnDirectAccess = true;
    module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
  } else {
    module.exports = factoryWithThrowingShims();
  }
});

var Successful = function Successful(props) {
  var _props$props, _props$props2, _props$props3, _props$props4, _props$props5, _props$props6, _props$props7, _props$props8, _props$props9, _props$props10, _props$props11, _props$props12, _props$props13, _props$props14, _props$props15, _props$props16, _props$props17, _props$props18, _props$props19, _props$props20, _props$props21, _props$props22, _props$props23, _props$props24, _props$props25;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var user_type = Digit.SessionStorage.get("userType");
  return /*#__PURE__*/React__default.createElement("div", {
    className: user_type === "citizen" ? "success-wrap" : "emp-success-wrap",
    style: props !== null && props !== void 0 && (_props$props = props.props) !== null && _props$props !== void 0 && _props$props.style ? props === null || props === void 0 ? void 0 : (_props$props2 = props.props) === null || _props$props2 === void 0 ? void 0 : _props$props2.style : {}
  }, /*#__PURE__*/React__default.createElement("header", {
    style: props !== null && props !== void 0 && (_props$props3 = props.props) !== null && _props$props3 !== void 0 && _props$props3.headerStyles ? props === null || props === void 0 ? void 0 : (_props$props4 = props.props) === null || _props$props4 === void 0 ? void 0 : _props$props4.headerStyles : {}
  }, props.props.message), /*#__PURE__*/React__default.createElement("div", null, props.props.whichSvg === "tick" ? /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(TickMark, {
    fillColor: "green"
  }), /*#__PURE__*/React__default.createElement("br", null), /*#__PURE__*/React__default.createElement("br", null), " ") : (props === null || props === void 0 ? void 0 : (_props$props5 = props.props) === null || _props$props5 === void 0 ? void 0 : _props$props5.svg) || /*#__PURE__*/React__default.createElement(SuccessSvg, null), ((props === null || props === void 0 ? void 0 : (_props$props6 = props.props) === null || _props$props6 === void 0 ? void 0 : _props$props6.complaintNumber) || props.props.info) && /*#__PURE__*/React__default.createElement("h2", {
    style: props !== null && props !== void 0 && (_props$props7 = props.props) !== null && _props$props7 !== void 0 && _props$props7.infoStyles ? props === null || props === void 0 ? void 0 : (_props$props8 = props.props) === null || _props$props8 === void 0 ? void 0 : _props$props8.infoStyles : {}
  }, props !== null && props !== void 0 && (_props$props9 = props.props) !== null && _props$props9 !== void 0 && _props$props9.complaintNumber ? t("CS_PGR_COMPLAINT_NUMBER") : props.props.info), ((props === null || props === void 0 ? void 0 : (_props$props10 = props.props) === null || _props$props10 === void 0 ? void 0 : _props$props10.complaintNumber) || (props === null || props === void 0 ? void 0 : (_props$props11 = props.props) === null || _props$props11 === void 0 ? void 0 : _props$props11.applicationNumber)) && /*#__PURE__*/React__default.createElement("p", {
    style: props !== null && props !== void 0 && (_props$props12 = props.props) !== null && _props$props12 !== void 0 && _props$props12.applicationNumberStyles ? props === null || props === void 0 ? void 0 : (_props$props13 = props.props) === null || _props$props13 === void 0 ? void 0 : _props$props13.applicationNumberStyles : {}
  }, props !== null && props !== void 0 && (_props$props14 = props.props) !== null && _props$props14 !== void 0 && _props$props14.complaintNumber ? props === null || props === void 0 ? void 0 : (_props$props15 = props.props) === null || _props$props15 === void 0 ? void 0 : _props$props15.complaintNumber : props === null || props === void 0 ? void 0 : (_props$props16 = props.props) === null || _props$props16 === void 0 ? void 0 : _props$props16.applicationNumber), props !== null && props !== void 0 && (_props$props17 = props.props) !== null && _props$props17 !== void 0 && _props$props17.applicationNumberOne ? /*#__PURE__*/React__default.createElement("h2", {
    style: props !== null && props !== void 0 && (_props$props18 = props.props) !== null && _props$props18 !== void 0 && _props$props18.infoOneStyles ? props === null || props === void 0 ? void 0 : (_props$props19 = props.props) === null || _props$props19 === void 0 ? void 0 : _props$props19.infoOneStyles : {}
  }, props.props.infoOne) : null, props !== null && props !== void 0 && (_props$props20 = props.props) !== null && _props$props20 !== void 0 && _props$props20.applicationNumberOne ? /*#__PURE__*/React__default.createElement("p", {
    style: props !== null && props !== void 0 && (_props$props21 = props.props) !== null && _props$props21 !== void 0 && _props$props21.applicationNumberStyles ? props === null || props === void 0 ? void 0 : (_props$props22 = props.props) === null || _props$props22 === void 0 ? void 0 : _props$props22.applicationNumberStyles : {}
  }, props === null || props === void 0 ? void 0 : (_props$props23 = props.props) === null || _props$props23 === void 0 ? void 0 : _props$props23.applicationNumberOne) : null, (props === null || props === void 0 ? void 0 : (_props$props24 = props.props) === null || _props$props24 === void 0 ? void 0 : _props$props24.multipleResponseIDs) && /*#__PURE__*/React__default.createElement("div", {
    className: "banner-multiple-ids-wrapper"
  }, props === null || props === void 0 ? void 0 : (_props$props25 = props.props) === null || _props$props25 === void 0 ? void 0 : _props$props25.multipleResponseIDs.map(function (responseIDs) {
    return /*#__PURE__*/React__default.createElement("p", null, responseIDs);
  }))));
};
var Error$1 = function Error(props) {
  var _props$props26, _props$props27, _props$props28, _props$props29, _props$props30, _props$props31, _props$props32, _props$props33, _props$props34, _props$props35, _props$props36, _props$props37, _props$props38, _props$props39;
  var _useTranslation2 = reactI18next.useTranslation(),
    t = _useTranslation2.t;
  var user_type = Digit.SessionStorage.get("userType");
  return /*#__PURE__*/React__default.createElement("div", {
    className: user_type === "citizen" ? "error-wrap" : "emp-error-wrap",
    style: props !== null && props !== void 0 && (_props$props26 = props.props) !== null && _props$props26 !== void 0 && _props$props26.style ? props === null || props === void 0 ? void 0 : (_props$props27 = props.props) === null || _props$props27 === void 0 ? void 0 : _props$props27.style : {}
  }, /*#__PURE__*/React__default.createElement("header", {
    style: props !== null && props !== void 0 && (_props$props28 = props.props) !== null && _props$props28 !== void 0 && _props$props28.headerStyles ? props === null || props === void 0 ? void 0 : (_props$props29 = props.props) === null || _props$props29 === void 0 ? void 0 : _props$props29.headerStyles : {}
  }, props.props.message), /*#__PURE__*/React__default.createElement(ErrorSvg, null), /*#__PURE__*/React__default.createElement("h2", {
    style: props !== null && props !== void 0 && (_props$props30 = props.props) !== null && _props$props30 !== void 0 && _props$props30.infoStyles ? props === null || props === void 0 ? void 0 : (_props$props31 = props.props) === null || _props$props31 === void 0 ? void 0 : _props$props31.infoStyles : {}
  }, props !== null && props !== void 0 && (_props$props32 = props.props) !== null && _props$props32 !== void 0 && _props$props32.complaintNumber ? t("CS_PGR_COMPLAINT_NUMBER") : props.props.info), /*#__PURE__*/React__default.createElement("p", {
    style: props !== null && props !== void 0 && (_props$props33 = props.props) !== null && _props$props33 !== void 0 && _props$props33.applicationNumberStyles ? props === null || props === void 0 ? void 0 : (_props$props34 = props.props) === null || _props$props34 === void 0 ? void 0 : _props$props34.applicationNumberStyles : {}
  }, props !== null && props !== void 0 && (_props$props35 = props.props) !== null && _props$props35 !== void 0 && _props$props35.complaintNumber ? props === null || props === void 0 ? void 0 : (_props$props36 = props.props) === null || _props$props36 === void 0 ? void 0 : _props$props36.complaintNumber : props === null || props === void 0 ? void 0 : (_props$props37 = props.props) === null || _props$props37 === void 0 ? void 0 : _props$props37.applicationNumber), (props === null || props === void 0 ? void 0 : (_props$props38 = props.props) === null || _props$props38 === void 0 ? void 0 : _props$props38.multipleResponseIDs) && /*#__PURE__*/React__default.createElement("div", {
    className: "banner-multiple-ids-wrapper"
  }, props === null || props === void 0 ? void 0 : (_props$props39 = props.props) === null || _props$props39 === void 0 ? void 0 : _props$props39.multipleResponseIDs.map(function (responseIDs) {
    return /*#__PURE__*/React__default.createElement("p", null, responseIDs);
  })));
};
var Banner = function Banner(props) {
  return props.successful ? /*#__PURE__*/React__default.createElement(Successful, {
    props: props
  }) : /*#__PURE__*/React__default.createElement(Error$1, {
    props: props
  });
};
Banner.propTypes = {
  successful: propTypes.bool.isRequired,
  message: propTypes.any.isRequired,
  complaintNumber: propTypes.any
};
Banner.defaultProps = {
  successful: true
};

var Body = function Body(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "body-container"
  }, props.children);
};

var Breadcrumb = function Breadcrumb(props) {
  var _props$crumbs;
  function isLast(index) {
    return index === props.crumbs.length - 1;
  }
  return /*#__PURE__*/React__default.createElement("ol", {
    className: "bread-crumb"
  }, props === null || props === void 0 ? void 0 : (_props$crumbs = props.crumbs) === null || _props$crumbs === void 0 ? void 0 : _props$crumbs.map(function (crumb, ci) {
    if (!(crumb !== null && crumb !== void 0 && crumb.show)) return;
    if (crumb !== null && crumb !== void 0 && crumb.isBack) return /*#__PURE__*/React__default.createElement("li", {
      key: ci,
      style: _extends({}, props.style),
      className: "bread-crumb--item"
    }, /*#__PURE__*/React__default.createElement("span", {
      style: {
        cursor: "pointer"
      },
      onClick: function onClick() {
        return window.history.back();
      }
    }, crumb.content));
    return /*#__PURE__*/React__default.createElement("li", {
      key: ci,
      style: _extends({}, props.style),
      className: "bread-crumb--item"
    }, isLast(ci) || !(crumb !== null && crumb !== void 0 && crumb.path) ? /*#__PURE__*/React__default.createElement("span", {
      style: props !== null && props !== void 0 && props.spanStyle ? _extends({}, props === null || props === void 0 ? void 0 : props.spanStyle, {
        color: "#0B0C0C"
      }) : {
        color: "#0B0C0C"
      }
    }, crumb.content) : /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: {
        pathname: crumb.path,
        state: {
          count: crumb === null || crumb === void 0 ? void 0 : crumb.count
        },
        search: crumb === null || crumb === void 0 ? void 0 : crumb.query
      }
    }, crumb.content));
  }));
};
Breadcrumb.propTypes = {
  crumbs: propTypes.array
};
Breadcrumb.defaultProps = {
  successful: true
};

var BreakLine = function BreakLine(_ref) {
  var _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style;
  return /*#__PURE__*/React__default.createElement("hr", {
    color: "#d6d5d4",
    className: "break-line",
    style: style
  });
};

var ButtonSelector = function ButtonSelector(props) {
  var theme = "selector-button-primary";
  switch (props.theme) {
    case "border":
      theme = "selector-button-border";
      break;
    default:
      theme = "selector-button-primary";
      break;
  }
  return /*#__PURE__*/React__default.createElement("button", {
    className: props.isDisabled ? "selector-button-primary-disabled" : theme,
    type: props.type || "submit",
    form: props.formId,
    onClick: props.onSubmit,
    disabled: props.isDisabled,
    style: props.style ? props.style : null
  }, /*#__PURE__*/React__default.createElement("h2", {
    style: _extends({}, props === null || props === void 0 ? void 0 : props.textStyles, {
      width: "100%"
    })
  }, props.label));
};
ButtonSelector.propTypes = {
  label: propTypes.string.isRequired,
  theme: propTypes.string,
  onSubmit: propTypes.func
};
ButtonSelector.defaultProps = {
  label: "",
  theme: "",
  onSubmit: undefined
};

var Button = function Button(props) {
  var className = (props === null || props === void 0 ? void 0 : props.variation) !== "primary" ? "jk-digit-secondary-btn" : "jk-digit-primary-btn";
  return /*#__PURE__*/React__default.createElement("button", {
    className: className + " " + ((props === null || props === void 0 ? void 0 : props.className) && (props === null || props === void 0 ? void 0 : props.className) || "") + " " + ((props === null || props === void 0 ? void 0 : props.isDisabled) && "jk-digit-disabled-btn" || ""),
    type: props.type || "button",
    form: props.formId,
    onClick: props.onButtonClick,
    disabled: props === null || props === void 0 ? void 0 : props.isDisabled,
    style: props.style ? props.style : null
  }, (props === null || props === void 0 ? void 0 : props.icon) && props.icon, /*#__PURE__*/React__default.createElement("h2", {
    style: _extends({}, props === null || props === void 0 ? void 0 : props.textStyles, {
      width: "100%"
    })
  }, props.label));
};
Button.propTypes = {
  label: propTypes.string.isRequired,
  variation: propTypes.string,
  icon: propTypes.element,
  onButtonClick: propTypes.func.isRequired,
  className: propTypes.string,
  style: propTypes.object,
  textStyles: propTypes.object
};
Button.defaultProps = {
  label: "TEST",
  variation: "primary",
  onButtonClick: function onButtonClick() {}
};

var _excluded = ["onClick", "style", "children", "className", "ReactRef"];
var Card = function Card(_ref) {
  var _Digit$UserService$ge;
  var onClick = _ref.onClick,
    style = _ref.style,
    children = _ref.children,
    className = _ref.className,
    ReactRef = _ref.ReactRef,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  var _useLocation = reactRouterDom.useLocation(),
    pathname = _useLocation.pathname;
  var classname = Digit.Hooks.useRouteSubscription(pathname);
  var info = (_Digit$UserService$ge = Digit.UserService.getUser()) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.info;
  var userType = info === null || info === void 0 ? void 0 : info.type;
  var isEmployee = classname === "employee" || userType === "EMPLOYEE";
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: (props.noCardStyle ? "" : isEmployee ? "employeeCard" : "card") + " " + (className ? className : ""),
    onClick: onClick,
    style: style
  }, props, {
    ref: ReactRef
  }), children);
};

var CardCaption = function CardCaption(props) {
  return /*#__PURE__*/React__default.createElement("label", {
    style: props.style,
    className: "card-caption"
  }, props.children);
};

var CardHeader = function CardHeader(props) {
  return /*#__PURE__*/React__default.createElement("header", {
    className: "card-header",
    style: props.styles ? props.styles : {}
  }, props.children);
};

var CardLabel = function CardLabel(props) {
  return /*#__PURE__*/React__default.createElement("h2", {
    className: "card-label " + props.className,
    style: props.style
  }, props.children);
};

var CardLabelDesc = function CardLabelDesc(_ref) {
  var children = _ref.children,
    style = _ref.style,
    className = _ref.className;
  return /*#__PURE__*/React__default.createElement("h2", {
    className: "card-label-desc " + (className ? className : ""),
    style: style
  }, children);
};

var CardLabelError = function CardLabelError(props) {
  return /*#__PURE__*/React__default.createElement("h2", {
    className: "card-label-error " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: props.style
  }, props.children);
};

var CardSectionHeader = function CardSectionHeader(props) {
  return /*#__PURE__*/React__default.createElement("header", {
    id: props.id,
    className: "card-section-header",
    style: props.style
  }, props.children);
};

var CardSectionSubText = function CardSectionSubText(props) {
  return /*#__PURE__*/React__default.createElement("header", {
    id: props.id,
    className: "card-section-sub-text",
    style: props.style
  }, props.children);
};

var CardSubHeader = function CardSubHeader(props) {
  var user_type = Digit.SessionStorage.get("user_type") === "employee" ? true : false;
  return /*#__PURE__*/React__default.createElement("header", {
    className: (user_type ? "employee-card-sub-header" : "card-sub-header") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: props.style
  }, props.children);
};

var CardText = function CardText(props) {
  return /*#__PURE__*/React__default.createElement("p", {
    className: "card-text " + (props.disable && "disabled") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: props.style
  }, props.children);
};

var CardText$1 = function CardText(props) {
  return /*#__PURE__*/React__default.createElement("p", {
    className: "card-text-button"
  }, props.children);
};

var _excluded$1 = ["onChange", "label", "value", "disable", "ref", "checked", "inputRef", "pageType", "style", "index", "isLabelFirst", "customLabelMarkup"];
var CheckBox = function CheckBox(_ref) {
  var onChange = _ref.onChange,
    label = _ref.label,
    value = _ref.value,
    disable = _ref.disable,
    checked = _ref.checked,
    inputRef = _ref.inputRef,
    pageType = _ref.pageType,
    style = _ref.style,
    index = _ref.index,
    isLabelFirst = _ref.isLabelFirst,
    customLabelMarkup = _ref.customLabelMarkup,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var userType = pageType || Digit.SessionStorage.get("userType");
  var wrkflwStyle = props.styles;
  if (isLabelFirst) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "checkbox-wrap",
      style: wrkflwStyle ? wrkflwStyle : {}
    }, /*#__PURE__*/React__default.createElement("p", {
      style: style ? style : null
    }, " ", index + 1, "."), /*#__PURE__*/React__default.createElement("p", {
      className: "label",
      style: {
        maxWidth: "80%",
        marginLeft: "10px"
      }
    }, label), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", _extends({
      type: "checkbox",
      className: userType === "employee" ? "input-emp" : "",
      onChange: onChange,
      style: {
        cursor: "pointer",
        left: "90%"
      },
      value: value || label
    }, props, {
      ref: inputRef,
      disabled: disable,
      checked: checked
    })), /*#__PURE__*/React__default.createElement("p", {
      className: userType === "employee" ? "custom-checkbox-emp" : "custom-checkbox",
      style: disable ? {
        opacity: 0.5
      } : {
        left: "90%"
      }
    }, /*#__PURE__*/React__default.createElement(CheckSvg, null))));
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "checkbox-wrap",
      style: wrkflwStyle ? wrkflwStyle : {}
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", _extends({
      type: "checkbox",
      className: userType === "employee" ? "input-emp" : "",
      onChange: onChange,
      style: {
        cursor: "pointer"
      },
      value: value || label
    }, props, {
      ref: inputRef,
      disabled: disable,
      checked: checked
    })), /*#__PURE__*/React__default.createElement("p", {
      className: userType === "employee" ? "custom-checkbox-emp" : "custom-checkbox",
      style: disable ? {
        opacity: 0.5
      } : null
    }, /*#__PURE__*/React__default.createElement(CheckSvg, null))), /*#__PURE__*/React__default.createElement("p", {
      className: "label",
      style: style ? style : {}
    }, customLabelMarkup ? /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("p", null, t("COMMON_CERTIFY_ONE")), /*#__PURE__*/React__default.createElement("br", null), /*#__PURE__*/React__default.createElement("p", null, /*#__PURE__*/React__default.createElement("b", null, " ", t("ES_COMMON_NOTE")), t("COMMON_CERTIFY_TWO"))) : label));
  }
};
CheckBox.propTypes = {
  label: propTypes.string.isRequired,
  onChange: propTypes.func,
  ref: propTypes.func,
  userType: propTypes.string
};
CheckBox.defaultProps = {};

var CitizenHomeCard = function CitizenHomeCard(_ref) {
  var header = _ref.header,
    _ref$links = _ref.links,
    links = _ref$links === void 0 ? [] : _ref$links,
    Icon = _ref.Icon,
    Info = _ref.Info,
    _ref$isInfo = _ref.isInfo,
    isInfo = _ref$isInfo === void 0 ? false : _ref$isInfo,
    styles = _ref.styles;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "CitizenHomeCard",
    style: styles ? styles : {}
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React__default.createElement("h2", null, header), /*#__PURE__*/React__default.createElement(Icon, null)), /*#__PURE__*/React__default.createElement("div", {
    className: "links"
  }, links.map(function (e, i) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "linksWrapper"
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      key: i,
      to: {
        pathname: e.link,
        state: e.state
      }
    }, e.i18nKey));
  })), /*#__PURE__*/React__default.createElement("div", null, isInfo ? /*#__PURE__*/React__default.createElement(Info, null) : null));
};

var CitizenInfoLabel = function CitizenInfoLabel(props) {
  var _props, _props2, _props3, _props4, _props5, _props6, _props7, _props8, _props9, _props10, _props11, _props12;
  props = (_props = props) !== null && _props !== void 0 && _props.props ? (_props2 = props) === null || _props2 === void 0 ? void 0 : _props2.props : props;
  var showInfo = (_props3 = props) !== null && _props3 !== void 0 && _props3.showInfo ? (_props4 = props) === null || _props4 === void 0 ? void 0 : _props4.showInfo : true;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "info-banner-wrap " + ((_props5 = props) !== null && _props5 !== void 0 && _props5.className ? (_props6 = props) === null || _props6 === void 0 ? void 0 : _props6.className : ""),
    style: (_props7 = props) === null || _props7 === void 0 ? void 0 : _props7.style
  }, showInfo && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(InfoBannerIcon, {
    fill: (_props8 = props) === null || _props8 === void 0 ? void 0 : _props8.fill
  }), /*#__PURE__*/React__default.createElement("h2", {
    style: (_props9 = props) === null || _props9 === void 0 ? void 0 : _props9.textStyle
  }, (_props10 = props) === null || _props10 === void 0 ? void 0 : _props10.info)), /*#__PURE__*/React__default.createElement("p", {
    style: (_props11 = props) === null || _props11 === void 0 ? void 0 : _props11.textStyle
  }, (_props12 = props) === null || _props12 === void 0 ? void 0 : _props12.text));
};

var CheckPoint = function CheckPoint(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: props.isCompleted ? (props === null || props === void 0 ? void 0 : props.customClassName) + " checkpoint-done" : "checkpoint " + (props === null || props === void 0 ? void 0 : props.customClassName),
    key: props.keyValue
  }, /*#__PURE__*/React__default.createElement("h2", null), /*#__PURE__*/React__default.createElement("header", null, props.label, props.info ? /*#__PURE__*/React__default.createElement("p", null, props.info) : null, props.customChild ? props.customChild : null));
};
var ConnectingCheckPoints = function ConnectingCheckPoints(props) {
  if (props.children && props.children.length >= 1) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, props.children.map(function (child, index) {
      return props.children.length === ++index ? /*#__PURE__*/React__default.createElement("div", {
        key: index
      }, child) : /*#__PURE__*/React__default.createElement("div", {
        key: index,
        className: "checkpoint-connect-wrap"
      }, child, /*#__PURE__*/React__default.createElement("div", {
        className: "checkpoint-connect"
      }));
    }));
  } else {
    return null;
  }
};
CheckPoint.propTypes = {
  isCompleted: propTypes.bool,
  key: propTypes.oneOfType([propTypes.string, propTypes.number]),
  label: propTypes.string,
  info: propTypes.string
};
CheckPoint.defaultProps = {
  isCompleted: false,
  key: 0,
  label: "",
  info: ""
};

var CustomButton = function CustomButton(_ref) {
  var text = _ref.text,
    onClick = _ref.onClick,
    selected = _ref.selected;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("button", {
    tabIndex: "0",
    type: "button",
    className: selected ? "customBtn-selected" : "customBtn",
    onClick: onClick
  }, text));
};

var DatePicker = function DatePicker(props) {
  var dateInp = React.useRef();
  var selectDate = function selectDate(e) {
    var _props$onChange;
    var date = e.target.value;
    props === null || props === void 0 ? void 0 : (_props$onChange = props.onChange) === null || _props$onChange === void 0 ? void 0 : _props$onChange.call(props, date);
  };
  var addStyle = {};
  if (Digit.UserService.getType() === "citizen") {
    addStyle = {
      maxWidth: "540px"
    };
  }
  return /*#__PURE__*/React__default.createElement("div", {
    style: _extends({
      position: "relative",
      width: "100%",
      cursor: "pointer"
    }, addStyle, props !== null && props !== void 0 && props.style ? props.style : {})
  }, /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("input", {
    className: "employee-card-input " + (props.disabled ? "disabled" : ""),
    style: _extends({
      width: "calc(100%-62px)",
      paddingRight: "9px"
    }, props.style),
    value: props.date ? props.date : "",
    type: "date",
    ref: dateInp,
    disabled: props.disabled,
    onChange: selectDate,
    defaultValue: props.defaultValue,
    min: props.min,
    max: props.max,
    required: props.isRequired || false,
    onBlur: props.onBlur
  })));
};
DatePicker.propTypes = {
  disabled: propTypes.bool,
  date: propTypes.any,
  min: propTypes.any,
  max: propTypes.any,
  defaultValue: propTypes.any,
  onChange: propTypes.func
};

var _excluded$2 = ["className"];
var PopUp = function PopUp(_ref) {
  var className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$2);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "popup-wrap " + className
  }, props.children);
};

var HeaderBar = function HeaderBar(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "header-wrap",
    style: props !== null && props !== void 0 && props.style ? props.style : {}
  }, props.start ? /*#__PURE__*/React__default.createElement("div", {
    className: "header-start"
  }, props.start) : null, props.main ? /*#__PURE__*/React__default.createElement("div", {
    className: "header-content"
  }, props.main) : null, props.end ? /*#__PURE__*/React__default.createElement("div", {
    className: "header-end"
  }, props.end) : null);
};
HeaderBar.propTypes = {
  start: propTypes.any,
  main: propTypes.any,
  end: propTypes.any
};
HeaderBar.defaultProps = {
  start: "",
  main: "",
  end: ""
};

var Toast$1 = function Toast(props) {
  if (props.error) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "toast-success",
      style: _extends({
        backgroundColor: "red"
      }, props.style)
    }, /*#__PURE__*/React__default.createElement(ErrorIcon, null), /*#__PURE__*/React__default.createElement("h2", {
      style: _extends({}, props.labelstyle)
    }, props.label), props.isDleteBtn ? /*#__PURE__*/React__default.createElement(DeleteBtn, {
      fill: "none",
      className: "toast-close-btn",
      onClick: props.onClose
    }) : null);
  }
  if (props.warning) {
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
      className: "toast-success",
      style: props !== null && props !== void 0 && props.isWarningButtons ? _extends({
        backgroundColor: "#EA8A3B",
        display: "block"
      }, props.style) : _extends({
        backgroundColor: "#EA8A3B"
      }, props.style)
    }, !(props !== null && props !== void 0 && props.isWarningButtons) ? /*#__PURE__*/React__default.createElement("div", {
      className: "toast-success",
      style: _extends({
        backgroundColor: "#EA8A3B"
      }, props.style)
    }, /*#__PURE__*/React__default.createElement(ErrorIcon, null), /*#__PURE__*/React__default.createElement("h2", {
      style: {
        marginLeft: "10px"
      }
    }, props.label), props.isDleteBtn ? /*#__PURE__*/React__default.createElement(DeleteBtn, {
      fill: "none",
      className: "toast-close-btn",
      onClick: props.onClose
    }) : null) : /*#__PURE__*/React__default.createElement("div", {
      style: {
        display: "flex"
      }
    }, /*#__PURE__*/React__default.createElement(ErrorIcon, null), /*#__PURE__*/React__default.createElement("h2", {
      style: {
        marginLeft: "10px"
      }
    }, props.label), props.isDleteBtn ? /*#__PURE__*/React__default.createElement(DeleteBtn, {
      fill: "none",
      className: "toast-close-btn",
      onClick: props.onClose
    }) : null), props !== null && props !== void 0 && props.isWarningButtons ? /*#__PURE__*/React__default.createElement("div", {
      style: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end"
      }
    }, /*#__PURE__*/React__default.createElement(ButtonSelector, {
      theme: "border",
      label: "NO",
      onSubmit: props.onNo,
      style: {
        marginLeft: "10px"
      }
    }), /*#__PURE__*/React__default.createElement(ButtonSelector, {
      label: "YES",
      onSubmit: props.onYes,
      style: {
        marginLeft: "10px"
      }
    })) : null));
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "toast-success",
    style: _extends({}, props.style)
  }, /*#__PURE__*/React__default.createElement(RoundedCheck, null), /*#__PURE__*/React__default.createElement("h2", null, props.label), /*#__PURE__*/React__default.createElement(DeleteBtn, {
    fill: "none",
    className: "toast-close-btn",
    onClick: props.onClose
  }));
};
Toast$1.propTypes = {
  label: propTypes.string,
  onClose: propTypes.func,
  isDleteBtn: propTypes.bool
};
Toast$1.defaultProps = {
  label: "",
  onClose: undefined,
  isDleteBtn: false
};

var Modal = function Modal(_ref) {
  var headerBarMain = _ref.headerBarMain,
    headerBarEnd = _ref.headerBarEnd,
    popupStyles = _ref.popupStyles,
    children = _ref.children,
    actionCancelLabel = _ref.actionCancelLabel,
    actionCancelOnSubmit = _ref.actionCancelOnSubmit,
    actionSaveLabel = _ref.actionSaveLabel,
    actionSaveOnSubmit = _ref.actionSaveOnSubmit,
    error = _ref.error,
    setError = _ref.setError,
    formId = _ref.formId,
    isDisabled = _ref.isDisabled,
    hideSubmit = _ref.hideSubmit,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style,
    popupModuleMianStyles = _ref.popupModuleMianStyles,
    headerBarMainStyle = _ref.headerBarMainStyle,
    _ref$isOBPSFlow = _ref.isOBPSFlow,
    isOBPSFlow = _ref$isOBPSFlow === void 0 ? false : _ref$isOBPSFlow,
    _ref$popupModuleActio = _ref.popupModuleActionBarStyles,
    popupModuleActionBarStyles = _ref$popupModuleActio === void 0 ? {} : _ref$popupModuleActio;
  var mobileView = Digit.Utils.browser.isMobile() ? true : false;
  React.useEffect(function () {
    document.body.style.overflowY = 'hidden';
    return function () {
      document.body.style.overflowY = 'auto';
    };
  }, []);
  return /*#__PURE__*/React__default.createElement(PopUp, null, /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module",
    style: popupStyles
  }, /*#__PURE__*/React__default.createElement(HeaderBar, {
    main: headerBarMain,
    end: headerBarEnd,
    style: headerBarMainStyle ? headerBarMainStyle : {}
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module-main",
    style: popupModuleMianStyles ? popupModuleMianStyles : {}
  }, children, /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module-action-bar",
    style: isOBPSFlow ? !mobileView ? {
      marginRight: "18px"
    } : {
      position: "absolute",
      bottom: "5%",
      right: "10%",
      left: window.location.href.includes("employee") ? "0%" : "7%"
    } : popupModuleActionBarStyles
  }, actionCancelLabel ? /*#__PURE__*/React__default.createElement(ButtonSelector, {
    textStyles: {
      margin: "0px"
    },
    theme: "border",
    label: actionCancelLabel,
    onSubmit: actionCancelOnSubmit,
    style: style
  }) : null, !hideSubmit ? /*#__PURE__*/React__default.createElement(ButtonSelector, {
    textStyles: {
      margin: "0px"
    },
    label: actionSaveLabel,
    onSubmit: actionSaveOnSubmit,
    formId: formId,
    isDisabled: isDisabled,
    style: style
  }) : null))), error && /*#__PURE__*/React__default.createElement(Toast$1, {
    label: error,
    onClose: function onClose() {
      return setError(null);
    },
    error: true
  }));
};

var _excluded$3 = ["values", "onFilterChange", "t", "labelClass", "filterLabel"];
function isEndDateFocused(focusNumber) {
  return focusNumber === 1;
}
function isStartDateFocused(focusNumber) {
  return focusNumber === 0;
}
var DateRange = function DateRange(_ref) {
  var values = _ref.values,
    onFilterChange = _ref.onFilterChange,
    t = _ref.t,
    filterLabel = _ref.filterLabel,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$3);
  var _useState = React.useState(false),
    isModalOpen = _useState[0],
    setIsModalOpen = _useState[1];
  var _useState2 = React.useState([0, 0]),
    focusedRange = _useState2[0],
    setFocusedRange = _useState2[1];
  var _useState3 = React.useState(_extends({}, values, {
      startDate: values === null || values === void 0 ? void 0 : values.startDate,
      endDate: values === null || values === void 0 ? void 0 : values.endDate
    })),
    selectionRange = _useState3[0],
    setSelectionRange = _useState3[1];
  var wrapperRef = React.useRef(null);
  React.useEffect(function () {
    var handleClickOutside = function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  React.useEffect(function () {
    if (!isModalOpen && (selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate) instanceof Date && (selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate) instanceof Date) {
      var startDate = selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate;
      var endDate = selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate;
      var duration = getDuration(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate, selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate);
      var title = dateFns.format(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate, "dd-MM-yy") + " - " + dateFns.format(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate, "dd-MM-yy");
      onFilterChange({
        range: {
          startDate: startDate,
          endDate: endDate,
          duration: duration,
          title: title
        },
        requestDate: {
          startDate: startDate,
          endDate: endDate,
          duration: duration,
          title: title
        }
      });
    }
  }, [selectionRange, isModalOpen]);
  var staticRanges = React.useMemo(function () {
    return reactDateRange.createStaticRanges([{
      label: t("DSS_TODAY"),
      range: function range() {
        return {
          startDate: dateFns.startOfToday(new Date()),
          endDate: dateFns.endOfToday(new Date())
        };
      }
    }, {
      label: t("DSS_YESTERDAY"),
      range: function range() {
        return {
          startDate: dateFns.startOfYesterday(new Date()),
          endDate: dateFns.endOfYesterday(new Date())
        };
      }
    }, {
      label: t("DSS_THIS_WEEK"),
      range: function range() {
        return {
          startDate: dateFns.startOfWeek(new Date(), {
            weekStartsOn: 1
          }),
          endDate: dateFns.endOfWeek(new Date(), {
            weekStartsOn: 1
          })
        };
      }
    }, {
      label: t('DSS_THIS_MONTH'),
      range: function range() {
        return {
          startDate: dateFns.startOfMonth(new Date()),
          endDate: dateFns.endOfMonth(new Date())
        };
      }
    }, {
      label: t('DSS_THIS_QUARTER'),
      range: function range() {
        return {
          startDate: dateFns.startOfQuarter(new Date()),
          endDate: dateFns.endOfQuarter(new Date())
        };
      }
    }, {
      label: t('DSS_PREVIOUS_YEAR'),
      range: function range() {
        return {
          startDate: dateFns.subYears(dateFns.addMonths(dateFns.startOfYear(new Date()), 3), 1),
          endDate: dateFns.subYears(dateFns.addMonths(dateFns.endOfYear(new Date()), 3), 1)
        };
      }
    }, {
      label: t('DSS_THIS_YEAR'),
      range: function range() {
        return {
          startDate: dateFns.addMonths(dateFns.startOfYear(new Date()), 3),
          endDate: dateFns.addMonths(dateFns.endOfYear(new Date()), 3)
        };
      }
    }]);
  }, []);
  var getDuration = function getDuration(startDate, endDate) {
    var noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    if (noOfDays > 91) {
      return "month";
    }
    if (noOfDays < 90 && noOfDays >= 14) {
      return "week";
    }
    if (noOfDays <= 14) {
      return "day";
    }
  };
  var handleSelect = function handleSelect(ranges) {
    var selection = ranges.range1;
    var startDate = selection.startDate,
      endDate = selection.endDate,
      title = selection.title,
      duration = selection.duration;
    if (isStartDateFocused(focusedRange[1])) {
      setSelectionRange(selection);
    }
    if (isEndDateFocused(focusedRange[1])) {
      setSelectionRange({
        title: title,
        duration: duration,
        startDate: startDate,
        endDate: dateFns.addSeconds(dateFns.addMinutes(dateFns.addHours(endDate, 23), 59), 59)
      });
      setIsModalOpen(false);
    }
  };
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label"
  }, t("" + filterLabel)), /*#__PURE__*/React__default.createElement("div", {
    className: "employee-select-wrap",
    style: props.inputStyle,
    ref: wrapperRef
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "select"
  }, /*#__PURE__*/React__default.createElement("input", {
    className: "employee-select-wrap--elipses",
    type: "text",
    value: values !== null && values !== void 0 && values.title ? "" + (values === null || values === void 0 ? void 0 : values.title) : "",
    readOnly: true
  }), /*#__PURE__*/React__default.createElement(Calender, {
    className: "cursorPointer",
    onClick: function onClick() {
      return setIsModalOpen(function (prevState) {
        return !prevState;
      });
    }
  })), isModalOpen && /*#__PURE__*/React__default.createElement("div", {
    className: "options-card",
    style: {
      overflow: "visible",
      width: "unset",
      maxWidth: "unset"
    }
  }, /*#__PURE__*/React__default.createElement(reactDateRange.DateRangePicker, {
    className: "pickerShadow",
    focusedRange: focusedRange,
    ranges: [selectionRange],
    rangeColors: ["#9E9E9E"],
    onChange: handleSelect,
    onRangeFocusChange: setFocusedRange,
    retainEndDateOnFirstSelection: true,
    showSelectionPreview: true,
    staticRanges: staticRanges,
    inputRanges: [],
    locale: locale.enGB
  }))));
};

function isEndDateFocused$1(focusNumber) {
  return focusNumber === 1;
}
function isStartDateFocused$1(focusNumber) {
  return focusNumber === 0;
}
var DateRangeNew = function DateRangeNew(_ref) {
  var values = _ref.values,
    onFilterChange = _ref.onFilterChange,
    t = _ref.t,
    label = _ref.label,
    customStyles = _ref.customStyles,
    inputRef = _ref.inputRef;
  var _useState = React.useState(false),
    isModalOpen = _useState[0],
    setIsModalOpen = _useState[1];
  var _useState2 = React.useState([0, 0]),
    focusedRange = _useState2[0],
    setFocusedRange = _useState2[1];
  var _useState3 = React.useState(_extends({}, values, {
      startDate: values === null || values === void 0 ? void 0 : values.startDate,
      endDate: values === null || values === void 0 ? void 0 : values.endDate
    })),
    selectionRange = _useState3[0],
    setSelectionRange = _useState3[1];
  var wrapperRef = React.useRef(inputRef);
  React.useEffect(function () {
    var handleClickOutside = function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  React.useEffect(function () {
    if (!isModalOpen && (selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate) instanceof Date && (selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate) instanceof Date) {
      var startDate = selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate;
      var endDate = selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate;
      var duration = getDuration(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate, selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate);
      var title = dateFns.format(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate, "MMM d, yy") + " - " + dateFns.format(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate, "MMM d, yy");
      onFilterChange({
        range: {
          startDate: startDate,
          endDate: endDate,
          duration: duration,
          title: title
        },
        requestDate: {
          startDate: startDate,
          endDate: endDate,
          duration: duration,
          title: title
        }
      });
    }
  }, [selectionRange, isModalOpen]);
  var staticRanges = React.useMemo(function () {
    return reactDateRange.createStaticRanges([{
      label: t("DSS_TODAY"),
      range: function range() {
        return {
          startDate: dateFns.startOfToday(new Date()),
          endDate: dateFns.endOfToday(new Date())
        };
      }
    }, {
      label: t("DSS_YESTERDAY"),
      range: function range() {
        return {
          startDate: dateFns.startOfYesterday(new Date()),
          endDate: dateFns.endOfYesterday(new Date())
        };
      }
    }, {
      label: t("DSS_THIS_WEEK"),
      range: function range() {
        return {
          startDate: dateFns.startOfWeek(new Date()),
          endDate: dateFns.endOfWeek(new Date())
        };
      }
    }, {
      label: t('DSS_THIS_MONTH'),
      range: function range() {
        return {
          startDate: dateFns.startOfMonth(new Date()),
          endDate: dateFns.endOfMonth(new Date())
        };
      }
    }, {
      label: t('DSS_THIS_QUARTER'),
      range: function range() {
        return {
          startDate: dateFns.startOfQuarter(new Date()),
          endDate: dateFns.endOfQuarter(new Date())
        };
      }
    }, {
      label: t('DSS_PREVIOUS_YEAR'),
      range: function range() {
        return {
          startDate: dateFns.subYears(dateFns.addMonths(dateFns.startOfYear(new Date()), 3), 1),
          endDate: dateFns.subYears(dateFns.addMonths(dateFns.endOfYear(new Date()), 3), 1)
        };
      }
    }, {
      label: t('DSS_THIS_YEAR'),
      range: function range() {
        return {
          startDate: dateFns.addMonths(dateFns.startOfYear(new Date()), 3),
          endDate: dateFns.addMonths(dateFns.endOfYear(new Date()), 3)
        };
      }
    }]);
  }, []);
  var getDuration = function getDuration(startDate, endDate) {
    var noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    if (noOfDays > 91) {
      return "month";
    }
    if (noOfDays < 90 && noOfDays >= 14) {
      return "week";
    }
    if (noOfDays <= 14) {
      return "day";
    }
  };
  var handleSelect = function handleSelect(ranges) {
    var selection = ranges.range1;
    var startDate = selection.startDate,
      endDate = selection.endDate,
      title = selection.title,
      duration = selection.duration;
    if (isStartDateFocused$1(focusedRange[1])) {
      setSelectionRange(selection);
    }
    if (isEndDateFocused$1(focusedRange[1])) {
      setSelectionRange({
        title: title,
        duration: duration,
        startDate: startDate,
        endDate: dateFns.addSeconds(dateFns.addMinutes(dateFns.addHours(endDate, 23), 59), 59)
      });
      setIsModalOpen(false);
    }
  };
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label",
    style: _extends({}, customStyles)
  }, label), /*#__PURE__*/React__default.createElement("div", {
    className: "employee-select-wrap",
    ref: wrapperRef
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "select"
  }, /*#__PURE__*/React__default.createElement("input", {
    className: "employee-select-wrap--elipses",
    type: "text",
    value: values !== null && values !== void 0 && values.title ? "" + (values === null || values === void 0 ? void 0 : values.title) : "",
    readOnly: true
  }), /*#__PURE__*/React__default.createElement(Calender, {
    className: "cursorPointer",
    onClick: function onClick() {
      return setIsModalOpen(function (prevState) {
        return !prevState;
      });
    }
  })), isModalOpen && /*#__PURE__*/React__default.createElement("div", {
    className: "options-card",
    style: {
      overflow: "visible",
      width: "unset"
    }
  }, /*#__PURE__*/React__default.createElement(reactDateRange.DateRange, {
    className: "pickerShadow",
    focusedRange: focusedRange,
    ranges: [selectionRange],
    rangeColors: ["#9E9E9E"],
    onChange: handleSelect,
    onRangeFocusChange: setFocusedRange,
    retainEndDateOnFirstSelection: true,
    showSelectionPreview: true,
    staticRanges: staticRanges,
    inputRanges: [],
    weekStartsOn: 1
  }))));
};

var DateWrap = function DateWrap(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "date-wrap"
  }, /*#__PURE__*/React__default.createElement(Calender, null), /*#__PURE__*/React__default.createElement("p", null, props.date));
};
DateWrap.propTypes = {
  date: propTypes.any
};
DateWrap.defaultProps = {
  date: 0
};

var ImageOrPDFIcon = function ImageOrPDFIcon(_ref) {
  var source = _ref.source,
    index = _ref.index,
    _ref$last = _ref.last,
    last = _ref$last === void 0 ? false : _ref$last,
    _onClick = _ref.onClick;
  return Digit.Utils.getFileTypeFromFileStoreURL(source) === "pdf" ? /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignContent: "center"
    }
  }, /*#__PURE__*/React__default.createElement("a", {
    target: "_blank",
    href: source,
    style: {
      minWidth: "100px",
      marginRight: "10px",
      maxWidth: "100px",
      height: "auto"
    },
    key: index
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React__default.createElement(PDFSvg, {
    style: {
      background: "#f6f6f6",
      padding: "8px",
      width: "100px"
    },
    width: "100px",
    height: "100px",
    minWidth: "100px"
  })))) : /*#__PURE__*/React__default.createElement("img", _extends({
    key: index,
    src: source
  }, last ? {
    className: "last"
  } : {}, {
    alt: "issue thumbnail",
    onClick: function onClick() {
      return _onClick(source, index);
    }
  }));
};
var DisplayPhotos = function DisplayPhotos(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "photos-wrap",
    style: props.style
  }, props.srcs.map(function (source, index) {
    return /*#__PURE__*/React__default.createElement(ImageOrPDFIcon, _extends({
      key: index
    }, _extends({
      source: source,
      index: index
    }, props), {
      last: ++index !== props.srcs.length ? false : true
    }));
  }));
};
DisplayPhotos.propTypes = {
  srcs: propTypes.array,
  onClick: propTypes.func
};
DisplayPhotos.defaultProps = {
  srcs: []
};

var TextField = function TextField(props) {
  var _useState = React.useState(props.selectedVal ? props.selectedVal : ""),
    value = _useState[0],
    setValue = _useState[1];
  React.useEffect(function () {
    if (!props.keepNull) {
      if (props.selectedVal) setValue(props.selectedVal);else {
        setValue("");
        props.setFilter("");
      }
    } else setValue("");
  }, [props.selectedVal, props.forceSet]);
  function inputChange(e) {
    if (props.freeze) return;
    setValue(e.target.value);
    props.setFilter(e.target.value);
  }
  function broadcastToOpen() {
    if (!props.disable) {
      props.dropdownDisplay(true);
    }
  }
  function broadcastToClose() {
    props.dropdownDisplay(false);
  }
  var keyChange = function keyChange(e) {
    if (e.key == "ArrowDown") {
      props.setOptionIndex(function (state) {
        return state + 1 == props.addProps.length ? 0 : state + 1;
      });
      if (props.addProps.currentIndex + 1 == props.addProps.length) {
        var _e$target, _e$target$parentEleme, _e$target$parentEleme2, _e$target$parentEleme3, _e$target$parentEleme4, _e$target$parentEleme5;
        e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : (_e$target$parentEleme = _e$target.parentElement) === null || _e$target$parentEleme === void 0 ? void 0 : (_e$target$parentEleme2 = _e$target$parentEleme.parentElement) === null || _e$target$parentEleme2 === void 0 ? void 0 : (_e$target$parentEleme3 = _e$target$parentEleme2.children) === null || _e$target$parentEleme3 === void 0 ? void 0 : (_e$target$parentEleme4 = _e$target$parentEleme3.namedItem("jk-dropdown-unique")) === null || _e$target$parentEleme4 === void 0 ? void 0 : (_e$target$parentEleme5 = _e$target$parentEleme4.scrollTo) === null || _e$target$parentEleme5 === void 0 ? void 0 : _e$target$parentEleme5.call(_e$target$parentEleme4, 0, 0);
      } else {
        var _props$addProps, _e$target2, _e$target2$parentElem, _e$target2$parentElem2, _e$target2$parentElem3, _e$target2$parentElem4, _e$target2$parentElem5;
        (props === null || props === void 0 ? void 0 : (_props$addProps = props.addProps) === null || _props$addProps === void 0 ? void 0 : _props$addProps.currentIndex) > 2 && (e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : (_e$target2$parentElem = _e$target2.parentElement) === null || _e$target2$parentElem === void 0 ? void 0 : (_e$target2$parentElem2 = _e$target2$parentElem.parentElement) === null || _e$target2$parentElem2 === void 0 ? void 0 : (_e$target2$parentElem3 = _e$target2$parentElem2.children) === null || _e$target2$parentElem3 === void 0 ? void 0 : (_e$target2$parentElem4 = _e$target2$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target2$parentElem4 === void 0 ? void 0 : (_e$target2$parentElem5 = _e$target2$parentElem4.scrollBy) === null || _e$target2$parentElem5 === void 0 ? void 0 : _e$target2$parentElem5.call(_e$target2$parentElem4, 0, 45));
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      props.setOptionIndex(function (state) {
        return state !== 0 ? state - 1 : props.addProps.length - 1;
      });
      if (props.addProps.currentIndex == 0) {
        var _e$target3, _e$target3$parentElem, _e$target3$parentElem2, _e$target3$parentElem3, _e$target3$parentElem4, _e$target3$parentElem5;
        e === null || e === void 0 ? void 0 : (_e$target3 = e.target) === null || _e$target3 === void 0 ? void 0 : (_e$target3$parentElem = _e$target3.parentElement) === null || _e$target3$parentElem === void 0 ? void 0 : (_e$target3$parentElem2 = _e$target3$parentElem.parentElement) === null || _e$target3$parentElem2 === void 0 ? void 0 : (_e$target3$parentElem3 = _e$target3$parentElem2.children) === null || _e$target3$parentElem3 === void 0 ? void 0 : (_e$target3$parentElem4 = _e$target3$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target3$parentElem4 === void 0 ? void 0 : (_e$target3$parentElem5 = _e$target3$parentElem4.scrollTo) === null || _e$target3$parentElem5 === void 0 ? void 0 : _e$target3$parentElem5.call(_e$target3$parentElem4, 100000, 100000);
      } else {
        var _props$addProps2, _e$target4, _e$target4$parentElem, _e$target4$parentElem2, _e$target4$parentElem3, _e$target4$parentElem4, _e$target4$parentElem5;
        (props === null || props === void 0 ? void 0 : (_props$addProps2 = props.addProps) === null || _props$addProps2 === void 0 ? void 0 : _props$addProps2.currentIndex) > 2 && (e === null || e === void 0 ? void 0 : (_e$target4 = e.target) === null || _e$target4 === void 0 ? void 0 : (_e$target4$parentElem = _e$target4.parentElement) === null || _e$target4$parentElem === void 0 ? void 0 : (_e$target4$parentElem2 = _e$target4$parentElem.parentElement) === null || _e$target4$parentElem2 === void 0 ? void 0 : (_e$target4$parentElem3 = _e$target4$parentElem2.children) === null || _e$target4$parentElem3 === void 0 ? void 0 : (_e$target4$parentElem4 = _e$target4$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target4$parentElem4 === void 0 ? void 0 : (_e$target4$parentElem5 = _e$target4$parentElem4.scrollBy) === null || _e$target4$parentElem5 === void 0 ? void 0 : _e$target4$parentElem5.call(_e$target4$parentElem4, 0, -45));
      }
      e.preventDefault();
    } else if (e.key == "Enter") {
      props.addProps.selectOption(props.addProps.currentIndex);
      e.preventDefault();
    }
  };
  return /*#__PURE__*/React__default.createElement("input", {
    ref: props.inputRef,
    className: "employee-select-wrap--elipses " + (props.disable && "disabled"),
    type: "text",
    value: value,
    onChange: inputChange,
    onClick: props.onClick,
    onFocus: broadcastToOpen,
    onBlur: function onBlur(e) {
      var _props$onBlur;
      broadcastToClose();
      props === null || props === void 0 ? void 0 : (_props$onBlur = props.onBlur) === null || _props$onBlur === void 0 ? void 0 : _props$onBlur.call(props, e);
      if (props.selectedVal !== props.filterVal) {
        setTimeout(function () {
          props.setforceSet(function (val) {
            return val + 1;
          });
        }, 1000);
      }
    },
    onKeyDown: keyChange,
    readOnly: props.disable,
    autoFocus: props.autoFocus,
    placeholder: props.placeholder,
    autoComplete: "off",
    style: props.style
  });
};
var translateDummy = function translateDummy(text) {
  return text;
};
var Dropdown = function Dropdown(props) {
  var _props$option, _props$option3;
  var user_type = Digit.SessionStorage.get("userType");
  var _useState2 = React.useState(false),
    dropdownStatus = _useState2[0],
    setDropdownStatus = _useState2[1];
  var _useState3 = React.useState(props.selected ? props.selected : null),
    selectedOption = _useState3[0],
    setSelectedOption = _useState3[1];
  var _useState4 = React.useState(""),
    filterVal = _useState4[0],
    setFilterVal = _useState4[1];
  var _useState5 = React.useState(0),
    forceSet = _useState5[0],
    setforceSet = _useState5[1];
  var _useState6 = React.useState(-1),
    optionIndex = _useState6[0],
    setOptionIndex = _useState6[1];
  var optionRef = React.useRef(null);
  var hasCustomSelector = props.customSelector ? true : false;
  var t = props.t || translateDummy;
  React.useEffect(function () {
    setSelectedOption(props.selected);
  }, [props.selected]);
  function dropdownSwitch() {
    if (!props.disable) {
      var _props$onBlur2;
      var current = dropdownStatus;
      if (!current) {
        document.addEventListener("mousedown", handleClick, false);
      }
      setDropdownStatus(!current);
      props === null || props === void 0 ? void 0 : (_props$onBlur2 = props.onBlur) === null || _props$onBlur2 === void 0 ? void 0 : _props$onBlur2.call(props);
    }
  }
  function handleClick(e) {
    if (!optionRef.current || !optionRef.current.contains(e.target)) {
      document.removeEventListener("mousedown", handleClick, false);
      setDropdownStatus(false);
    }
  }
  function dropdownOn(val) {
    var waitForOptions = function waitForOptions() {
      return setTimeout(function () {
        return setDropdownStatus(val);
      }, 500);
    };
    var timerId = waitForOptions();
    return function () {
      clearTimeout(timerId);
    };
  }
  function onSelect(val) {
    if (val !== selectedOption || props.allowMultiselect) {
      props.select(val);
      setSelectedOption(val);
      setDropdownStatus(false);
    } else {
      setSelectedOption(val);
      setforceSet(forceSet + 1);
    }
  }
  function setFilter(val) {
    setFilterVal(val);
  }
  var filteredOption = props.option && ((_props$option = props.option) === null || _props$option === void 0 ? void 0 : _props$option.filter(function (option) {
    var _t, _t$toUpperCase;
    return ((_t = t(option[props.optionKey])) === null || _t === void 0 ? void 0 : (_t$toUpperCase = _t.toUpperCase()) === null || _t$toUpperCase === void 0 ? void 0 : _t$toUpperCase.indexOf(filterVal === null || filterVal === void 0 ? void 0 : filterVal.toUpperCase())) > -1;
  })) || [];
  function selectOption(ind) {
    onSelect(filteredOption[ind]);
  }
  if (props.isBPAREG && selectedOption) {
    var _props$option2, _props$option2$filter;
    var isSelectedSameAsOptions = ((_props$option2 = props.option) === null || _props$option2 === void 0 ? void 0 : (_props$option2$filter = _props$option2.filter(function (ob) {
      return (ob === null || ob === void 0 ? void 0 : ob.code) === (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.code);
    })) === null || _props$option2$filter === void 0 ? void 0 : _props$option2$filter.length) > 0;
    if (!isSelectedSameAsOptions) setSelectedOption(null);
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: (user_type === "employee" ? "employee-select-wrap" : "select-wrap") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: _extends({}, props.style)
  }, hasCustomSelector && /*#__PURE__*/React__default.createElement("div", {
    className: props.showArrow ? "cp flex-right column-gap-5" : "cp",
    onClick: dropdownSwitch
  }, props.customSelector, props.showArrow && /*#__PURE__*/React__default.createElement(ArrowDown, {
    onClick: dropdownSwitch,
    className: props.disable && "disabled"
  })), !hasCustomSelector && /*#__PURE__*/React__default.createElement("div", {
    className: (dropdownStatus ? "select-active" : "select") + " " + (props.disable && "disabled"),
    style: props.errorStyle ? _extends({
      border: "1px solid red"
    }, props.noBorder ? {
      "border": "none"
    } : {}) : _extends({}, props.noBorder ? {
      "border": "none"
    } : {})
  }, /*#__PURE__*/React__default.createElement(TextField, {
    autoComplete: props.autoComplete,
    setFilter: setFilter,
    forceSet: forceSet,
    setforceSet: setforceSet,
    setOptionIndex: setOptionIndex,
    keepNull: props.keepNull,
    selectedVal: selectedOption ? props.t ? props.isMultiSelectEmp ? selectedOption + " " + t("BPA_SELECTED_TEXT") : props.t(props.optionKey ? selectedOption[props.optionKey] : selectedOption) : props.optionKey ? selectedOption[props.optionKey] : selectedOption : null,
    filterVal: filterVal,
    addProps: {
      length: filteredOption.length,
      currentIndex: optionIndex,
      selectOption: selectOption
    },
    dropdownDisplay: dropdownOn,
    handleClick: handleClick,
    disable: props.disable,
    freeze: props.freeze ? true : false,
    autoFocus: props.autoFocus,
    placeholder: props.placeholder,
    onBlur: props === null || props === void 0 ? void 0 : props.onBlur,
    inputRef: props.ref
  }), props.showSearchIcon ? null : /*#__PURE__*/React__default.createElement(ArrowDown, {
    onClick: dropdownSwitch,
    className: "cp",
    disable: props.disable
  }), props.showSearchIcon ? /*#__PURE__*/React__default.createElement(SearchIcon, {
    onClick: dropdownSwitch,
    className: "cp",
    disable: props.disable
  }) : null), dropdownStatus ? props.optionKey ? /*#__PURE__*/React__default.createElement("div", {
    id: "jk-dropdown-unique",
    className: (hasCustomSelector ? "margin-top-10 display: table" : "") + " options-card",
    style: _extends({}, props.optionCardStyles),
    ref: optionRef
  }, filteredOption && filteredOption.map(function (option, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "cp profile-dropdown--item display: flex ",
      style: index === optionIndex ? {
        opacity: 1,
        backgroundColor: "rgba(238, 238, 238, var(--bg-opacity))"
      } : {},
      key: index,
      onClick: function onClick() {
        return onSelect(option);
      }
    }, option.icon && /*#__PURE__*/React__default.createElement("span", {
      className: "icon"
    }, " ", option.icon, " "), props.isPropertyAssess ? /*#__PURE__*/React__default.createElement("div", null, props.t ? props.t(option[props.optionKey]) : option[props.optionKey]) : /*#__PURE__*/React__default.createElement("span", null, " ", props.t ? props.t(option[props.optionKey]) : option[props.optionKey]));
  }), filteredOption && filteredOption.length === 0 && /*#__PURE__*/React__default.createElement("div", {
    className: "cp profile-dropdown--item display: flex ",
    key: "-1",
    onClick: function onClick() {}
  }, /*#__PURE__*/React__default.createElement("span", null, " ", props.t ? props.t("CMN_NOOPTION") : "CMN_NOOPTION"))) : /*#__PURE__*/React__default.createElement("div", {
    className: "options-card",
    style: _extends({}, props.optionCardStyles, {
      overflow: "scroll",
      maxHeight: "350px"
    }),
    id: "jk-dropdown-unique",
    ref: optionRef
  }, (_props$option3 = props.option) === null || _props$option3 === void 0 ? void 0 : _props$option3.filter(function (option) {
    return (option === null || option === void 0 ? void 0 : option.toUpperCase().indexOf(filterVal === null || filterVal === void 0 ? void 0 : filterVal.toUpperCase())) > -1;
  }).map(function (option, index) {
    return /*#__PURE__*/React__default.createElement("p", {
      key: index,
      style: index === optionIndex ? {
        opacity: 1,
        backgroundColor: "rgba(238, 238, 238, var(--bg-opacity))"
      } : {},
      onClick: function onClick() {
        return onSelect(option);
      }
    }, option);
  })) : null);
};
Dropdown.propTypes = {
  customSelector: propTypes.any,
  showArrow: propTypes.bool,
  selected: propTypes.any,
  style: propTypes.object,
  option: propTypes.array,
  optionKey: propTypes.any,
  select: propTypes.any,
  t: propTypes.func
};
Dropdown.defaultProps = {
  customSelector: null,
  showArrow: true
};

var TextField$1 = function TextField(props) {
  var value = props.value,
    setValue = props.setValue;
  React.useEffect(function () {
    if (!props.keepNull) {
      if (props.selectedVal) setValue(props.selectedVal);else {
        setValue("");
        props.setFilter("");
      }
    } else setValue("");
  }, [props.selectedVal, props.forceSet]);
  function inputChange(e) {
    if (props.freeze) return;
    setValue(e.target.value);
    props.setFilter(e.target.value);
  }
  function broadcastToOpen() {
    if (!props.disable) {
      props.dropdownDisplay(true);
    }
  }
  function broadcastToClose() {
    props.dropdownDisplay(false);
  }
  var keyChange = function keyChange(e) {
    if (e.key == "ArrowDown") {
      props.setOptionIndex(function (state) {
        return state + 1 == props.addProps.length ? 0 : state + 1;
      });
      if (props.addProps.currentIndex + 1 == props.addProps.length) {
        var _e$target, _e$target$parentEleme, _e$target$parentEleme2, _e$target$parentEleme3, _e$target$parentEleme4, _e$target$parentEleme5;
        e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : (_e$target$parentEleme = _e$target.parentElement) === null || _e$target$parentEleme === void 0 ? void 0 : (_e$target$parentEleme2 = _e$target$parentEleme.parentElement) === null || _e$target$parentEleme2 === void 0 ? void 0 : (_e$target$parentEleme3 = _e$target$parentEleme2.children) === null || _e$target$parentEleme3 === void 0 ? void 0 : (_e$target$parentEleme4 = _e$target$parentEleme3.namedItem("jk-dropdown-unique")) === null || _e$target$parentEleme4 === void 0 ? void 0 : (_e$target$parentEleme5 = _e$target$parentEleme4.scrollTo) === null || _e$target$parentEleme5 === void 0 ? void 0 : _e$target$parentEleme5.call(_e$target$parentEleme4, 0, 0);
      } else {
        var _props$addProps, _e$target2, _e$target2$parentElem, _e$target2$parentElem2, _e$target2$parentElem3, _e$target2$parentElem4, _e$target2$parentElem5;
        (props === null || props === void 0 ? void 0 : (_props$addProps = props.addProps) === null || _props$addProps === void 0 ? void 0 : _props$addProps.currentIndex) > 2 && (e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : (_e$target2$parentElem = _e$target2.parentElement) === null || _e$target2$parentElem === void 0 ? void 0 : (_e$target2$parentElem2 = _e$target2$parentElem.parentElement) === null || _e$target2$parentElem2 === void 0 ? void 0 : (_e$target2$parentElem3 = _e$target2$parentElem2.children) === null || _e$target2$parentElem3 === void 0 ? void 0 : (_e$target2$parentElem4 = _e$target2$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target2$parentElem4 === void 0 ? void 0 : (_e$target2$parentElem5 = _e$target2$parentElem4.scrollBy) === null || _e$target2$parentElem5 === void 0 ? void 0 : _e$target2$parentElem5.call(_e$target2$parentElem4, 0, 45));
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      props.setOptionIndex(function (state) {
        return state !== 0 ? state - 1 : props.addProps.length - 1;
      });
      if (props.addProps.currentIndex == 0) {
        var _e$target3, _e$target3$parentElem, _e$target3$parentElem2, _e$target3$parentElem3, _e$target3$parentElem4, _e$target3$parentElem5;
        e === null || e === void 0 ? void 0 : (_e$target3 = e.target) === null || _e$target3 === void 0 ? void 0 : (_e$target3$parentElem = _e$target3.parentElement) === null || _e$target3$parentElem === void 0 ? void 0 : (_e$target3$parentElem2 = _e$target3$parentElem.parentElement) === null || _e$target3$parentElem2 === void 0 ? void 0 : (_e$target3$parentElem3 = _e$target3$parentElem2.children) === null || _e$target3$parentElem3 === void 0 ? void 0 : (_e$target3$parentElem4 = _e$target3$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target3$parentElem4 === void 0 ? void 0 : (_e$target3$parentElem5 = _e$target3$parentElem4.scrollTo) === null || _e$target3$parentElem5 === void 0 ? void 0 : _e$target3$parentElem5.call(_e$target3$parentElem4, 100000, 100000);
      } else {
        var _props$addProps2, _e$target4, _e$target4$parentElem, _e$target4$parentElem2, _e$target4$parentElem3, _e$target4$parentElem4, _e$target4$parentElem5;
        (props === null || props === void 0 ? void 0 : (_props$addProps2 = props.addProps) === null || _props$addProps2 === void 0 ? void 0 : _props$addProps2.currentIndex) > 2 && (e === null || e === void 0 ? void 0 : (_e$target4 = e.target) === null || _e$target4 === void 0 ? void 0 : (_e$target4$parentElem = _e$target4.parentElement) === null || _e$target4$parentElem === void 0 ? void 0 : (_e$target4$parentElem2 = _e$target4$parentElem.parentElement) === null || _e$target4$parentElem2 === void 0 ? void 0 : (_e$target4$parentElem3 = _e$target4$parentElem2.children) === null || _e$target4$parentElem3 === void 0 ? void 0 : (_e$target4$parentElem4 = _e$target4$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target4$parentElem4 === void 0 ? void 0 : (_e$target4$parentElem5 = _e$target4$parentElem4.scrollBy) === null || _e$target4$parentElem5 === void 0 ? void 0 : _e$target4$parentElem5.call(_e$target4$parentElem4, 0, -45));
      }
      e.preventDefault();
    } else if (e.key == "Enter") {
      props.addProps.selectOption(props.addProps.currentIndex);
    }
  };
  return /*#__PURE__*/React__default.createElement("input", {
    ref: props.inputRef,
    className: "employee-select-wrap--elipses " + (props.disable && "disabled"),
    type: "text",
    value: value,
    onChange: inputChange,
    onClick: props.onClick,
    onFocus: broadcastToOpen,
    onBlur: function onBlur(e) {
      var _props$onBlur;
      broadcastToClose();
      props === null || props === void 0 ? void 0 : (_props$onBlur = props.onBlur) === null || _props$onBlur === void 0 ? void 0 : _props$onBlur.call(props, e);
      if (props.selectedVal !== props.filterVal) {
        setTimeout(function () {
          props.setforceSet(function (val) {
            return val + 1;
          });
        }, 1000);
      }
    },
    onKeyDown: keyChange,
    readOnly: props.disable,
    autoFocus: props.autoFocus,
    placeholder: props.placeholder,
    autoComplete: "off",
    style: props.style
  });
};
var translateDummy$1 = function translateDummy(text) {
  return text;
};
var Dropdown$1 = function Dropdown(props) {
  var _props$option, _props$option3;
  var setTableRow = props.setTableRow;
  var user_type = Digit.SessionStorage.get("userType");
  var _useState = React.useState(false),
    dropdownStatus = _useState[0],
    setDropdownStatus = _useState[1];
  var _useState2 = React.useState(props.selected ? props.selected : null),
    selectedOption = _useState2[0],
    setSelectedOption = _useState2[1];
  var _useState3 = React.useState(""),
    filterVal = _useState3[0],
    setFilterVal = _useState3[1];
  var _useState4 = React.useState(0),
    forceSet = _useState4[0],
    setforceSet = _useState4[1];
  var _useState5 = React.useState(-1),
    optionIndex = _useState5[0],
    setOptionIndex = _useState5[1];
  var optionRef = React.useRef(null);
  var hasCustomSelector = props.customSelector ? true : false;
  var t = props.t || translateDummy$1;
  React.useEffect(function () {
    setSelectedOption(props.selected);
  }, [props.selected]);
  function dropdownSwitch() {
    if (!props.disable) {
      var _props$onBlur2;
      var current = dropdownStatus;
      if (!current) {
        document.addEventListener("mousedown", handleClick, false);
      }
      setDropdownStatus(!current);
      props === null || props === void 0 ? void 0 : (_props$onBlur2 = props.onBlur) === null || _props$onBlur2 === void 0 ? void 0 : _props$onBlur2.call(props);
    }
  }
  function handleClick(e) {
    if (!optionRef.current || !optionRef.current.contains(e.target)) {
      document.removeEventListener("mousedown", handleClick, false);
      setDropdownStatus(false);
    }
  }
  function dropdownOn(val) {
    var waitForOptions = function waitForOptions() {
      return setTimeout(function () {
        return setDropdownStatus(val);
      }, 500);
    };
    var timerId = waitForOptions();
    return function () {
      clearTimeout(timerId);
    };
  }
  function onSelect(val) {
    if (val !== selectedOption || props.allowMultiselect) {
      props.select(val);
      setSelectedOption(val);
      setDropdownStatus(false);
      setTableRow(function (prevState) {
        var newObj = {
          "name": "Name New",
          "aadhar": val,
          "acno": "1212-1212-1212",
          "ifsc": "1313-1313-1331"
        };
        return [].concat(prevState, [newObj]);
      });
    } else {
      setSelectedOption(val);
      setforceSet(forceSet + 1);
    }
  }
  function setFilter(val) {
    setFilterVal(val);
  }
  var filteredOption = props.option && ((_props$option = props.option) === null || _props$option === void 0 ? void 0 : _props$option.filter(function (option) {
    var _t, _t$toUpperCase;
    return ((_t = t(option[props.optionKey])) === null || _t === void 0 ? void 0 : (_t$toUpperCase = _t.toUpperCase()) === null || _t$toUpperCase === void 0 ? void 0 : _t$toUpperCase.indexOf(filterVal === null || filterVal === void 0 ? void 0 : filterVal.toUpperCase())) > -1;
  })) || [];
  function selectOption(ind) {
    onSelect(filteredOption[ind]);
  }
  if (props.isBPAREG && selectedOption) {
    var _props$option2, _props$option2$filter;
    var isSelectedSameAsOptions = ((_props$option2 = props.option) === null || _props$option2 === void 0 ? void 0 : (_props$option2$filter = _props$option2.filter(function (ob) {
      return (ob === null || ob === void 0 ? void 0 : ob.code) === (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.code);
    })) === null || _props$option2$filter === void 0 ? void 0 : _props$option2$filter.length) > 0;
    if (!isSelectedSameAsOptions) setSelectedOption(null);
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: (user_type === "employee" ? "employee-select-wrap" : "") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: _extends({}, props.style)
  }, hasCustomSelector && /*#__PURE__*/React__default.createElement("div", {
    className: props.showArrow ? "cp flex-right column-gap-5" : "cp",
    onClick: dropdownSwitch
  }, props.customSelector, props.showArrow && /*#__PURE__*/React__default.createElement(ArrowDown, {
    onClick: dropdownSwitch,
    className: props.disable && "disabled"
  })), !hasCustomSelector && /*#__PURE__*/React__default.createElement("div", {
    className: (dropdownStatus ? "select-active" : "select") + " " + (props.disable && "disabled"),
    style: props.errorStyle ? _extends({
      border: "1px solid red"
    }, props.noBorder ? {
      "border": "none"
    } : {}) : _extends({}, props.noBorder ? {
      "border": "none"
    } : {})
  }, /*#__PURE__*/React__default.createElement(TextField$1, {
    autoComplete: props.autoComplete,
    setFilter: setFilter,
    forceSet: forceSet,
    setforceSet: setforceSet,
    setOptionIndex: setOptionIndex,
    keepNull: props.keepNull,
    selectedVal: selectedOption ? props.t ? props.isMultiSelectEmp ? selectedOption + " " + t("BPA_SELECTED_TEXT") : props.t(props.optionKey ? selectedOption[props.optionKey] : selectedOption) : props.optionKey ? selectedOption[props.optionKey] : selectedOption : null,
    filterVal: filterVal,
    addProps: {
      length: filteredOption.length,
      currentIndex: optionIndex,
      selectOption: selectOption
    },
    dropdownDisplay: dropdownOn,
    handleClick: handleClick,
    disable: props.disable,
    freeze: props.freeze ? true : false,
    autoFocus: props.autoFocus,
    placeholder: props.placeholder,
    onBlur: props === null || props === void 0 ? void 0 : props.onBlur,
    inputRef: props.ref,
    value: props.value,
    setValue: props.setValue
  }), props.showSearchIcon ? null : /*#__PURE__*/React__default.createElement(ArrowDown, {
    onClick: dropdownSwitch,
    className: "cp",
    disable: props.disable
  }), props.showSearchIcon ? /*#__PURE__*/React__default.createElement(SearchIcon, {
    onClick: dropdownSwitch,
    className: "cp",
    disable: props.disable
  }) : null), dropdownStatus ? props.optionKey ? /*#__PURE__*/React__default.createElement("div", {
    id: "jk-dropdown-unique",
    className: (hasCustomSelector ? "margin-top-10 display: table" : "") + " options-card",
    style: _extends({}, props.optionCardStyles),
    ref: optionRef
  }, filteredOption && filteredOption.map(function (option, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "cp profile-dropdown--item display: flex ",
      style: index === optionIndex ? {
        opacity: 1,
        backgroundColor: "rgba(238, 238, 238, var(--bg-opacity))"
      } : {},
      key: index,
      onClick: function onClick() {
        return onSelect(option);
      }
    }, option.icon && /*#__PURE__*/React__default.createElement("span", {
      className: "icon"
    }, " ", option.icon, " "), props.isPropertyAssess ? /*#__PURE__*/React__default.createElement("div", null, props.t ? props.t(option[props.optionKey]) : option[props.optionKey]) : /*#__PURE__*/React__default.createElement("span", null, " ", props.t ? props.t(option[props.optionKey]) : option[props.optionKey]));
  }), filteredOption && filteredOption.length === 0 && /*#__PURE__*/React__default.createElement("div", {
    className: "cp profile-dropdown--item display: flex ",
    key: "-1",
    onClick: function onClick() {}
  }, /*#__PURE__*/React__default.createElement("span", null, " ", props.t ? props.t("CMN_NOOPTION") : "CMN_NOOPTION"))) : /*#__PURE__*/React__default.createElement("div", {
    className: "options-card",
    style: _extends({}, props.optionCardStyles, {
      overflow: "scroll",
      maxHeight: "350px"
    }),
    id: "jk-dropdown-unique",
    ref: optionRef
  }, (_props$option3 = props.option) === null || _props$option3 === void 0 ? void 0 : _props$option3.filter(function (option) {
    return (option === null || option === void 0 ? void 0 : option.toUpperCase().indexOf(filterVal === null || filterVal === void 0 ? void 0 : filterVal.toUpperCase())) > -1;
  }).map(function (option, index) {
    return /*#__PURE__*/React__default.createElement("p", {
      key: index,
      style: index === optionIndex ? {
        opacity: 1,
        backgroundColor: "rgba(238, 238, 238, var(--bg-opacity))"
      } : {},
      onClick: function onClick() {
        return onSelect(option);
      }
    }, option);
  })) : null);
};
Dropdown$1.propTypes = {
  customSelector: propTypes.any,
  showArrow: propTypes.bool,
  selected: propTypes.any,
  style: propTypes.object,
  option: propTypes.array,
  optionKey: propTypes.any,
  select: propTypes.any,
  t: propTypes.func
};
Dropdown$1.defaultProps = {
  customSelector: null,
  showArrow: true
};

var Menu = function Menu(_ref) {
  var menu = _ref.menu,
    displayKey = _ref.displayKey,
    onSelect = _ref.onSelect;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "menu"
  }, menu.map(function (item, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "item",
      onClick: function onClick() {
        return onSelect(item);
      },
      key: index
    }, item.icon, /*#__PURE__*/React__default.createElement("span", null, item[displayKey]));
  }));
};
var EllipsisMenu = function EllipsisMenu(_ref2) {
  var menuItems = _ref2.menuItems,
    displayKey = _ref2.displayKey,
    onSelect = _ref2.onSelect;
  var menuRef = React.useRef();
  var _useState = React.useState(false),
    active = _useState[0],
    setActive = _useState[1];
  Digit.Hooks.useClickOutside(menuRef, function () {
    return setActive(false);
  }, active);
  function onItemSelect(item) {
    setActive(false);
    onSelect(item);
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "ellipsis-menu-wrap",
    ref: menuRef
  }, /*#__PURE__*/React__default.createElement(Ellipsis, {
    className: "cursorPointer",
    onClick: function onClick() {
      return setActive(true);
    }
  }), active ? /*#__PURE__*/React__default.createElement(Menu, {
    menu: menuItems,
    displayKey: displayKey,
    onSelect: onItemSelect
  }) : null);
};

var EmployeeAppContainer = function EmployeeAppContainer(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "employee-app-container"
  }, props.children);
};

var EmployeeModuleCard = function EmployeeModuleCard(_ref) {
  var Icon = _ref.Icon,
    moduleName = _ref.moduleName,
    _ref$kpis = _ref.kpis,
    kpis = _ref$kpis === void 0 ? [] : _ref$kpis,
    _ref$links = _ref.links,
    links = _ref$links === void 0 ? [] : _ref$links,
    _ref$isCitizen = _ref.isCitizen,
    isCitizen = _ref$isCitizen === void 0 ? false : _ref$isCitizen,
    className = _ref.className,
    styles = _ref.styles,
    _ref$longModuleName = _ref.longModuleName,
    longModuleName = _ref$longModuleName === void 0 ? false : _ref$longModuleName;
  var history = reactRouterDom.useHistory();
  return /*#__PURE__*/React__default.createElement("div", {
    className: className ? className : "employeeCard customEmployeeCard card-home home-action-cards",
    style: styles ? styles : {}
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "header",
    style: isCitizen ? {
      padding: "0px"
    } : longModuleName ? {
      alignItems: "flex-start"
    } : {}
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "text removeHeight"
  }, moduleName), /*#__PURE__*/React__default.createElement("span", {
    className: "logo removeBorderRadiusLogo"
  }, Icon)), /*#__PURE__*/React__default.createElement("div", {
    className: "body",
    style: {
      margin: "0px",
      padding: "0px"
    }
  }, kpis.length !== 0 && /*#__PURE__*/React__default.createElement("div", {
    className: "flex-fit",
    style: isCitizen ? {
      paddingLeft: "17px"
    } : {}
  }, kpis.map(function (_ref2, index) {
    var count = _ref2.count,
      label = _ref2.label,
      link = _ref2.link;
    return /*#__PURE__*/React__default.createElement("div", {
      className: "card-count",
      key: index
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, count || "-")), /*#__PURE__*/React__default.createElement("div", null, link ? /*#__PURE__*/React__default.createElement("span", {
      className: "link",
      onClick: function onClick() {
        return history.push("" + link, {
          count: count
        });
      }
    }, label) : null));
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "links-wrapper",
    style: {
      width: "80%"
    }
  }, links.map(function (_ref3, index) {
    var count = _ref3.count,
      label = _ref3.label,
      link = _ref3.link;
    return /*#__PURE__*/React__default.createElement("span", {
      className: "link",
      key: index
    }, link ? /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: {
        pathname: link,
        state: {
          count: count
        }
      }
    }, label) : null, count ? /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("span", {
      className: "inbox-total",
      onClick: function onClick() {
        return history.push("" + link);
      }
    }, count || "-"), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: {
        pathname: link,
        state: {
          count: count
        }
      }
    }, /*#__PURE__*/React__default.createElement(ArrowRightInbox, null))) : null);
  })))));
};
var ModuleCardFullWidth = function ModuleCardFullWidth(_ref4) {
  var moduleName = _ref4.moduleName,
    _ref4$links = _ref4.links,
    links = _ref4$links === void 0 ? [] : _ref4$links,
    _ref4$isCitizen = _ref4.isCitizen,
    isCitizen = _ref4$isCitizen === void 0 ? false : _ref4$isCitizen,
    className = _ref4.className,
    styles = _ref4.styles,
    headerStyle = _ref4.headerStyle,
    subHeader = _ref4.subHeader,
    subHeaderLink = _ref4.subHeaderLink;
  return /*#__PURE__*/React__default.createElement("div", {
    className: className ? className : "employeeCard card-home customEmployeeCard home-action-cards",
    style: styles ? styles : {}
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container",
    style: {
      padding: "10px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "header",
    style: isCitizen ? {
      padding: "0px"
    } : headerStyle
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "text removeHeight"
  }, moduleName), /*#__PURE__*/React__default.createElement("span", {
    className: "link"
  }, /*#__PURE__*/React__default.createElement("a", {
    href: subHeaderLink
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "inbox-total",
    style: {
      display: "flex",
      alignItems: "center",
      color: "#F47738",
      fontWeight: "bold"
    },
    onClick: function onClick() {
      return history.push("" + link);
    }
  }, subHeader || "-", /*#__PURE__*/React__default.createElement("span", {
    style: {
      marginLeft: "10px"
    }
  }, " ", /*#__PURE__*/React__default.createElement(ArrowRightInbox, null)))))), /*#__PURE__*/React__default.createElement("div", {
    className: "body",
    style: {
      margin: "0px",
      padding: "0px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "links-wrapper",
    style: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap"
    }
  }, links.map(function (_ref5, index) {
    var _window;
    var label = _ref5.label,
      link = _ref5.link;
    return /*#__PURE__*/React__default.createElement("span", {
      className: "link full-employee-card-link",
      key: index
    }, link ? link !== null && link !== void 0 && link.includes(((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/") ? /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link
    }, label) : /*#__PURE__*/React__default.createElement("a", {
      href: link
    }, label) : null);
  })))));
};

var GreyOutText = function GreyOutText(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "grey"
  }, props.children);
};

var Hamburger = function Hamburger(_ref) {
  var handleClick = _ref.handleClick,
    color = _ref.color;
  return /*#__PURE__*/React__default.createElement("span", {
    style: {
      marginRight: "10px"
    },
    className: "hamburger-span",
    onClick: handleClick
  }, /*#__PURE__*/React__default.createElement(HamburgerIcon, {
    className: "hamburger",
    color: color
  }));
};

var Header = function Header(props) {
  return /*#__PURE__*/React__default.createElement("header", {
    className: "h1 " + ((props === null || props === void 0 ? void 0 : props.className) || ""),
    style: props.styles
  }, props.children);
};

var HomeLink = function HomeLink(_ref) {
  var to = _ref.to,
    children = _ref.children;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "home-link"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: to
  }, children));
};
HomeLink.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.string
};
HomeLink.defaultProps = {
  to: "#",
  children: "Link"
};

var MiniUpload = function MiniUpload(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "upload-img-container"
  }, /*#__PURE__*/React__default.createElement(CameraSvg, {
    className: "upload-camera-img"
  }), /*#__PURE__*/React__default.createElement("input", {
    type: "file",
    id: "miniupload",
    accept: "image/*",
    onChange: function onChange(e) {
      return props.onUpload(e);
    }
  }));
};
var UploadImages = function UploadImages(props) {
  if (props.thumbnails && props.thumbnails.length > 0) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "multi-upload-wrap"
    }, props.thumbnails.map(function (thumbnail, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        key: index
      }, /*#__PURE__*/React__default.createElement(DeleteBtn, {
        onClick: function onClick() {
          return props.onDelete(thumbnail);
        },
        className: "delete",
        fill: "#d4351c"
      }), /*#__PURE__*/React__default.createElement("img", {
        src: thumbnail,
        alt: "uploaded thumbnail"
      }));
    }), props.thumbnails.length < 3 ? /*#__PURE__*/React__default.createElement(MiniUpload, {
      onUpload: props.onUpload
    }) : null);
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "upload-wrap",
      onClick: function onClick(e) {
        return props.onUpload(e);
      }
    }, /*#__PURE__*/React__default.createElement(CameraSvg, null), /*#__PURE__*/React__default.createElement("input", {
      type: "file",
      id: "upload",
      accept: "image/*",
      onChange: function onChange(e) {
        return props.onUpload(e);
      }
    }));
  }
};
UploadImages.propTypes = {
  thumbnail: propTypes.array,
  onUpload: propTypes.func
};
UploadImages.defaultProps = {
  thumbnail: [],
  onUpload: undefined
};

var ImageUploadHandler = function ImageUploadHandler(props) {
  var _useState = React.useState(null),
    image = _useState[0],
    setImage = _useState[1];
  var _useState2 = React.useState(null),
    uploadedImagesThumbs = _useState2[0],
    setUploadedImagesThumbs = _useState2[1];
  var _useState3 = React.useState(props.uploadedImages),
    uploadedImagesIds = _useState3[0],
    setUploadedImagesIds = _useState3[1];
  var _useState4 = React.useState(1),
    rerender = _useState4[0],
    setRerender = _useState4[1];
  var _useState5 = React.useState(null),
    imageFile = _useState5[0],
    setImageFile = _useState5[1];
  var _useState6 = React.useState(false),
    isDeleting = _useState6[0],
    setIsDeleting = _useState6[1];
  var _useState7 = React.useState(""),
    error = _useState7[0],
    setError = _useState7[1];
  React.useEffect(function () {
    if (image) {
      uploadImage();
    }
  }, [image]);
  React.useEffect(function () {
    if (!isDeleting) {
      (function () {
        try {
          var _temp = function () {
            if (uploadedImagesIds !== null) {
              return Promise.resolve(submit()).then(function () {
                setRerender(rerender + 1);
                props.onPhotoChange(uploadedImagesIds);
              });
            }
          }();
          return _temp && _temp.then ? _temp.then(function () {}) : void 0;
        } catch (e) {
          Promise.reject(e);
        }
      })();
    } else {
      setIsDeleting(false);
    }
  }, [uploadedImagesIds]);
  React.useEffect(function () {
    if (imageFile && imageFile.size > 2097152) {
      setError("File is too large");
    } else {
      setImage(imageFile);
    }
  }, [imageFile]);
  var addUploadedImageIds = React.useCallback(function (imageIdData) {
    if (uploadedImagesIds === null) {
      var arr = [];
    } else {
      arr = uploadedImagesIds;
    }
    return [].concat(arr, [imageIdData.data.files[0].fileStoreId]);
  }, [uploadedImagesIds]);
  function getImage(e) {
    setError(null);
    setImageFile(e.target.files[0]);
  }
  var uploadImage = React.useCallback(function () {
    try {
      return Promise.resolve(Digit.UploadServices.Filestorage("property-upload", image, props.tenantId)).then(function (response) {
        setUploadedImagesIds(addUploadedImageIds(response));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, [addUploadedImageIds, image]);
  function addImageThumbnails(thumbnailsData) {
    var keys = Object.keys(thumbnailsData.data);
    var index = keys.findIndex(function (key) {
      return key === "fileStoreIds";
    });
    if (index > -1) {
      keys.splice(index, 1);
    }
    var thumbnails = [];
    var newThumbnails = keys.map(function (key) {
      return {
        image: thumbnailsData.data[key].split(",")[2],
        key: key
      };
    });
    setUploadedImagesThumbs([].concat(thumbnails, newThumbnails));
  }
  var submit = React.useCallback(function () {
    try {
      var _temp2 = function () {
        if (uploadedImagesIds !== null && uploadedImagesIds.length > 0) {
          return Promise.resolve(Digit.UploadServices.Filefetch(uploadedImagesIds, props.tenantId)).then(function (res) {
            addImageThumbnails(res);
          });
        }
      }();
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [uploadedImagesIds]);
  function deleteImage(img) {
    setIsDeleting(true);
    var deleteImageKey = uploadedImagesThumbs.filter(function (o, index) {
      return o.image === img;
    });
    var uploadedthumbs = uploadedImagesThumbs;
    var newThumbsList = uploadedthumbs.filter(function (thumbs) {
      return thumbs != deleteImageKey[0];
    });
    var newUploadedImagesIds = uploadedImagesIds.filter(function (key) {
      return key !== deleteImageKey[0].key;
    });
    setUploadedImagesThumbs(newThumbsList);
    setUploadedImagesIds(newUploadedImagesIds);
    Digit.SessionStorage.set("PGR_CREATE_IMAGES", newUploadedImagesIds);
  }
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, error && /*#__PURE__*/React__default.createElement(Toast$1, {
    error: true,
    label: error,
    onClose: function onClose() {
      return setError(null);
    }
  }), /*#__PURE__*/React__default.createElement(UploadImages, {
    onUpload: getImage,
    onDelete: deleteImage,
    thumbnails: uploadedImagesThumbs ? uploadedImagesThumbs.map(function (o) {
      return o.image;
    }) : []
  }));
};

var ImageViewer = function ImageViewer(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "image-viewer-wrap"
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "white",
    width: "18px",
    height: "18px",
    onClick: props.onClose
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
  })), /*#__PURE__*/React__default.createElement("img", {
    src: props.imageSrc
  }));
};
ImageViewer.propTypes = {
  imageSrc: propTypes.string
};
ImageViewer.defaultProps = {
  imageSrc: ""
};

var InfoBanner = function InfoBanner(_ref) {
  var label = _ref.label,
    text = _ref.text;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "info-banner-wrap"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(InfoBannerIcon, null), /*#__PURE__*/React__default.createElement("h2", null, label)), /*#__PURE__*/React__default.createElement("p", null, text));
};

var KeyNote = function KeyNote(_ref) {
  var keyValue = _ref.keyValue,
    note = _ref.note,
    caption = _ref.caption,
    noteStyle = _ref.noteStyle,
    children = _ref.children,
    privacy = _ref.privacy;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "key-note-pair"
  }, /*#__PURE__*/React__default.createElement("h3", null, keyValue), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "inline-flex"
    }
  }, /*#__PURE__*/React__default.createElement("p", {
    style: noteStyle
  }, note), privacy && /*#__PURE__*/React__default.createElement("span", {
    style: {
      display: "inline-flex",
      width: "fit-content",
      marginLeft: "10px",
      marginTop: "5px"
    }
  }, /*#__PURE__*/React__default.createElement(UnMaskComponent, {
    privacy: privacy
  }))), /*#__PURE__*/React__default.createElement("p", {
    className: "caption"
  }, caption), children);
};
KeyNote.propTypes = {
  keyValue: propTypes.string,
  note: propTypes.oneOfType([propTypes.string, propTypes.number]),
  noteStyle: propTypes.any
};
KeyNote.defaultProps = {
  keyValue: "",
  note: "",
  noteStyle: {}
};

var Label = function Label(props) {
  return /*#__PURE__*/React__default.createElement("h4", {
    className: "h4"
  }, props.children);
};

var LabelFieldPair = function LabelFieldPair(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    style: _extends({}, props.style),
    className: "label-field-pair"
  }, props.children);
};

var LinkButton = function LinkButton(props) {
  return /*#__PURE__*/React__default.createElement("span", {
    className: "card-link cp " + props.className,
    onClick: props.onClick,
    style: props.style
  }, props.label);
};
LinkButton.propTypes = {
  label: propTypes.any,
  onClick: propTypes.func
};
LinkButton.defaultProps = {};

var LinkLabel = function LinkLabel(props) {
  return /*#__PURE__*/React__default.createElement("label", {
    className: "link-label",
    onClick: props.onClick,
    style: _extends({}, props.style)
  }, props.children);
};

var Loader = function Loader(_ref) {
  var _ref$page = _ref.page,
    page = _ref$page === void 0 ? false : _ref$page;
  return /*#__PURE__*/React__default.createElement("div", {
    className: (page ? "page" : "module") + "-loader"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "loadingio-spinner-rolling-faewnb8ux8"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "ldio-pjg92h09b2o"
  }, /*#__PURE__*/React__default.createElement("div", null))));
};
Loader.propTypes = {
  page: propTypes.bool
};
Loader.defaultProps = {
  page: false
};

var defaultBounds = {};
var updateDefaultBounds = function updateDefaultBounds(center) {
  if (!center.lat || !center.lng) {
    return;
  }
  defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1
  };
};
var GetPinCode = function GetPinCode(places) {
  var _places$address_compo;
  var postalCode = null;
  places === null || places === void 0 ? void 0 : (_places$address_compo = places.address_components) === null || _places$address_compo === void 0 ? void 0 : _places$address_compo.forEach(function (place) {
    var hasPostalCode = place.types.includes("postal_code");
    postalCode = hasPostalCode ? place.long_name : null;
  });
  return postalCode;
};
var getName = function getName(places) {
  var _places$address_compo2;
  var name = "";
  places === null || places === void 0 ? void 0 : (_places$address_compo2 = places.address_components) === null || _places$address_compo2 === void 0 ? void 0 : _places$address_compo2.forEach(function (place) {
    var hasName = place.types.includes("sublocality_level_2") || place.types.includes("sublocality_level_1");
    if (hasName) {
      name = hasName ? place.long_name : null;
    }
  });
  return name;
};
var loadGoogleMaps = function loadGoogleMaps(callback) {
  var _globalConfigs;
  var key = (_globalConfigs = globalConfigs) === null || _globalConfigs === void 0 ? void 0 : _globalConfigs.getConfig("GMAPS_API_KEY");
  var loader = new jsApiLoader.Loader({
    apiKey: key,
    version: "weekly",
    libraries: ["places"]
  });
  loader.load().then(function () {
    if (callback) callback();
  }).catch(function (e) {});
};
var mapStyles = [{
  elementType: "geometry",
  stylers: [{
    color: "#f5f5f5"
  }]
}, {
  elementType: "labels.icon",
  stylers: [{
    visibility: "off"
  }]
}, {
  elementType: "labels.text.fill",
  stylers: [{
    color: "#616161"
  }]
}, {
  elementType: "labels.text.stroke",
  stylers: [{
    color: "#f5f5f5"
  }]
}, {
  featureType: "administrative.land_parcel",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#bdbdbd"
  }]
}, {
  featureType: "poi",
  elementType: "geometry",
  stylers: [{
    color: "#eeeeee"
  }]
}, {
  featureType: "poi",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#757575"
  }]
}, {
  featureType: "poi.park",
  elementType: "geometry",
  stylers: [{
    color: "#e5e5e5"
  }]
}, {
  featureType: "poi.park",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#9e9e9e"
  }]
}, {
  featureType: "road",
  elementType: "geometry",
  stylers: [{
    color: "#ffffff"
  }]
}, {
  featureType: "road.arterial",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#757575"
  }]
}, {
  featureType: "road.highway",
  elementType: "geometry",
  stylers: [{
    color: "#dadada"
  }]
}, {
  featureType: "road.highway",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#616161"
  }]
}, {
  featureType: "road.local",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#9e9e9e"
  }]
}, {
  featureType: "transit.line",
  elementType: "geometry",
  stylers: [{
    color: "#e5e5e5"
  }]
}, {
  featureType: "transit.station",
  elementType: "geometry",
  stylers: [{
    color: "#eeeeee"
  }]
}, {
  featureType: "water",
  elementType: "geometry",
  stylers: [{
    color: "#c9c9c9"
  }]
}, {
  featureType: "water",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#9e9e9e"
  }]
}];
var setLocationText = function setLocationText(location, onChange, isPlaceRequired) {
  if (isPlaceRequired === void 0) {
    isPlaceRequired = false;
  }
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    location: location
  }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        var pincode = GetPinCode(results[0]);
        var infoWindowContent = document.getElementById("pac-input");
        infoWindowContent.value = getName(results[0]);
        if (onChange) {
          if (isPlaceRequired) onChange(pincode, {
            longitude: location.lng,
            latitude: location.lat
          }, infoWindowContent.value);else onChange(pincode, {
            longitude: location.lng,
            latitude: location.lat
          });
        }
      }
    }
  });
};
var onMarkerDragged = function onMarkerDragged(marker, onChange, isPlaceRequired) {
  if (isPlaceRequired === void 0) {
    isPlaceRequired = false;
  }
  if (!marker) return;
  var latLng = marker.latLng;
  var currLat = latLng.lat();
  var currLang = latLng.lng();
  var location = {
    lat: currLat,
    lng: currLang
  };
  if (isPlaceRequired) setLocationText(location, onChange, true);else setLocationText(location, onChange);
};
var initAutocomplete = function initAutocomplete(onChange, position, isPlaceRequired) {
  if (isPlaceRequired === void 0) {
    isPlaceRequired = false;
  }
  var map = new window.google.maps.Map(document.getElementById("map"), {
    center: position,
    zoom: 15,
    mapTypeId: "roadmap",
    styles: mapStyles
  });
  var input = document.getElementById("pac-input");
  updateDefaultBounds(position);
  var options = {
    bounds: defaultBounds,
    componentRestrictions: {
      country: "in"
    },
    fields: ["address_components", "geometry", "icon", "name"],
    origin: position,
    strictBounds: false,
    types: ["address"]
  };
  var searchBox = new window.google.maps.places.Autocomplete(input, options);
  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });
  var markers = [new window.google.maps.Marker({
    map: map,
    title: "a",
    position: position,
    draggable: true,
    clickable: true
  })];
  if (isPlaceRequired) setLocationText(position, onChange, true);else setLocationText(position, onChange);
  markers[0].addListener("dragend", function (marker) {
    return onMarkerDragged(marker, onChange, isPlaceRequired);
  });
  searchBox.addListener("place_changed", function () {
    var place = searchBox.getPlace();
    if (!place) {
      return;
    }
    var pincode = GetPinCode(place);
    if (pincode) {
      var geometry = place.geometry;
      var geoLocation = {
        latitude: geometry.location.lat(),
        longitude: geometry.location.lng()
      };
      if (isPlaceRequired) onChange(pincode, geoLocation, place.name);else onChange(pincode, geoLocation);
    }
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];
    var bounds = new window.google.maps.LatLngBounds();
    if (!place.geometry) {
      return;
    }
    markers.push(new window.google.maps.Marker({
      map: map,
      title: place.name,
      position: place.geometry.location,
      draggable: true,
      clickable: true
    }));
    markers[0].addListener("dragend", function (marker) {
      return onMarkerDragged(marker, onChange, isPlaceRequired);
    });
    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  });
};
var LocationSearch = function LocationSearch(props) {
  React.useEffect(function () {
    var mapScriptCall = function mapScriptCall() {
      try {
        var getLatLng = function getLatLng(position) {
          initAutocomplete(props.onChange, {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }, props.isPlaceRequired);
        };
        var getLatLngError = function getLatLngError(error) {
          var defaultLatLong = {};
          if (props !== null && props !== void 0 && props.isPTDefault) {
            var _props$PTdefaultcoord;
            defaultLatLong = (props === null || props === void 0 ? void 0 : (_props$PTdefaultcoord = props.PTdefaultcoord) === null || _props$PTdefaultcoord === void 0 ? void 0 : _props$PTdefaultcoord.defaultConfig) || {
              lat: 31.6160638,
              lng: 74.8978579
            };
          } else {
            defaultLatLong = {
              lat: 31.6160638,
              lng: 74.8978579
            };
          }
          initAutocomplete(props.onChange, defaultLatLong, props.isPlaceRequired);
        };
        var initMaps = function initMaps() {
          var _props$position, _props$position2, _navigator;
          if ((_props$position = props.position) !== null && _props$position !== void 0 && _props$position.latitude && (_props$position2 = props.position) !== null && _props$position2 !== void 0 && _props$position2.longitude) {
            getLatLng({
              coords: props.position
            });
          } else if ((_navigator = navigator) !== null && _navigator !== void 0 && _navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getLatLng, getLatLngError);
          } else {
            getLatLngError();
          }
        };
        loadGoogleMaps(initMaps);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };
    mapScriptCall();
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "map-wrap"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "map-search-bar-wrap"
  }, /*#__PURE__*/React__default.createElement(SearchIconSvg, {
    className: "map-search-bar-icon"
  }), /*#__PURE__*/React__default.createElement("input", {
    id: "pac-input",
    className: "map-search-bar",
    type: "text",
    placeholder: "Search Address"
  })), /*#__PURE__*/React__default.createElement("div", {
    id: "map",
    className: "map"
  }));
};

var Menu$1 = function Menu(props) {
  var keyPrefix = props.localeKeyPrefix || "CS_ACTION";
  return /*#__PURE__*/React__default.createElement("div", {
    className: "menu-wrap",
    style: props.style
  }, props.options.map(function (option, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      onClick: function onClick() {
        return props.onSelect(option);
      }
    }, /*#__PURE__*/React__default.createElement("p", {
      style: props === null || props === void 0 ? void 0 : props.textStyles
    }, props.t ? props.t(Digit.Utils.locale.getTransformedLocale(option.forcedName || keyPrefix + "_" + (props.optionKey ? option[props.optionKey] : option))) : option));
  }));
};
Menu$1.propTypes = {
  options: propTypes.array,
  onSelect: propTypes.func
};
Menu$1.defaultProps = {
  options: [],
  onSelect: function onSelect() {}
};

var MobileNumber = function MobileNumber(props) {
  var user_type = Digit.SessionStorage.get("userType");
  var onChange = function onChange(e) {
    var _props$onChange;
    var val = e.target.value;
    if (isNaN(val) || [" ", "e", "E"].some(function (e) {
      return val.includes(e);
    }) || val.length > (props.maxLength || 10)) {
      val = val.slice(0, -1);
    }
    props === null || props === void 0 ? void 0 : (_props$onChange = props.onChange) === null || _props$onChange === void 0 ? void 0 : _props$onChange.call(props, val);
  };
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "field-container"
  }, !props.hideSpan ? /*#__PURE__*/React__default.createElement("span", {
    style: _extends({
      maxWidth: "50px",
      marginTop: "unset",
      border: "1px solid #464646",
      borderRight: "none"
    }, props.labelStyle),
    className: "citizen-card-input citizen-card-input--front"
  }, "+91") : null, /*#__PURE__*/React__default.createElement("div", {
    className: "text-input " + (user_type === "employee" ? "" : "text-mobile-input-width") + " " + props.className
  }, /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    name: props.name,
    id: props.id,
    className: (user_type ? "employee-card-input" : "citizen-card-input") + " " + (props.disable && "disabled") + " focus-visible " + (props.errorStyle && "employee-card-input-error"),
    placeholder: props.placeholder,
    onChange: onChange,
    ref: props.inputRef,
    value: props.value,
    style: _extends({}, props.style),
    minLength: props.minlength,
    maxLength: props.maxlength,
    max: props.max,
    pattern: props.pattern,
    min: props.min,
    readOnly: props.disable,
    title: props.title,
    step: props.step,
    autoFocus: props.autoFocus,
    onBlur: props.onBlur,
    autoComplete: "off"
  }))));
};
MobileNumber.propTypes = {
  userType: propTypes.string,
  isMandatory: propTypes.bool,
  name: propTypes.string,
  placeholder: propTypes.string,
  onChange: propTypes.func,
  ref: propTypes.func,
  value: propTypes.any
};
MobileNumber.defaultProps = {
  isMandatory: false
};

var MultiLink = React.forwardRef(function (_ref, ref) {
  var className = _ref.className,
    onHeadClick = _ref.onHeadClick,
    _ref$displayOptions = _ref.displayOptions,
    displayOptions = _ref$displayOptions === void 0 ? false : _ref$displayOptions,
    options = _ref.options,
    label = _ref.label,
    icon = _ref.icon,
    showOptions = _ref.showOptions,
    downloadBtnClassName = _ref.downloadBtnClassName,
    downloadOptionsClassName = _ref.downloadOptionsClassName,
    optionsClassName = _ref.optionsClassName,
    style = _ref.style,
    optionsStyle = _ref.optionsStyle,
    reportStyles = _ref.reportStyles;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var menuRef = React.useRef();
  var handleOnClick = React.useCallback(function () {
    showOptions === null || showOptions === void 0 ? void 0 : showOptions(false);
  }, []);
  Digit.Hooks.useClickOutside(menuRef, handleOnClick, !displayOptions);
  var MenuWrapper = React__default.forwardRef(function (props, ref) {
    return /*#__PURE__*/React__default.createElement("div", {
      ref: ref,
      className: "multilink-optionWrap " + optionsClassName + " " + downloadOptionsClassName,
      style: optionsStyle
    }, options.map(function (option, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        onClick: function onClick() {
          return option.onClick();
        },
        key: index,
        className: "multilink-option"
      }, option === null || option === void 0 ? void 0 : option.icon, option.label);
    }));
  });
  return /*#__PURE__*/React__default.createElement("div", {
    className: className,
    ref: ref,
    style: reportStyles
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "multilink-labelWrap " + downloadBtnClassName,
    onClick: onHeadClick,
    style: style
  }, icon ? icon : /*#__PURE__*/React__default.createElement(PrimaryDownlaodIcon, null), /*#__PURE__*/React__default.createElement(LinkButton, {
    label: label || t("CS_COMMON_DOWNLOAD"),
    className: "multilink-link-button"
  })), displayOptions ? /*#__PURE__*/React__default.createElement(MenuWrapper, {
    ref: ref
  }) : null);
});

var RemoveableTag = function RemoveableTag(_ref) {
  var text = _ref.text,
    onClick = _ref.onClick,
    extraStyles = _ref.extraStyles,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "tag",
    style: extraStyles ? extraStyles === null || extraStyles === void 0 ? void 0 : extraStyles.tagStyles : {}
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "text",
    style: extraStyles ? extraStyles === null || extraStyles === void 0 ? void 0 : extraStyles.textStyles : {}
  }, text), /*#__PURE__*/React__default.createElement("span", {
    onClick: disabled ? null : onClick
  }, /*#__PURE__*/React__default.createElement(Close, {
    className: "close",
    style: extraStyles ? extraStyles === null || extraStyles === void 0 ? void 0 : extraStyles.closeIconStyles : {}
  })));
};

var MultiSelectDropdown = function MultiSelectDropdown(_ref) {
  var options = _ref.options,
    optionsKey = _ref.optionsKey,
    _ref$selected = _ref.selected,
    selected = _ref$selected === void 0 ? [] : _ref$selected,
    onSelect = _ref.onSelect,
    _ref$defaultLabel = _ref.defaultLabel,
    defaultLabel = _ref$defaultLabel === void 0 ? "" : _ref$defaultLabel,
    _ref$defaultUnit = _ref.defaultUnit,
    defaultUnit = _ref$defaultUnit === void 0 ? "" : _ref$defaultUnit,
    _ref$BlockNumber = _ref.BlockNumber,
    BlockNumber = _ref$BlockNumber === void 0 ? 1 : _ref$BlockNumber,
    _ref$isOBPSMultiple = _ref.isOBPSMultiple,
    isOBPSMultiple = _ref$isOBPSMultiple === void 0 ? false : _ref$isOBPSMultiple,
    _ref$props = _ref.props,
    props = _ref$props === void 0 ? {} : _ref$props,
    _ref$isPropsNeeded = _ref.isPropsNeeded,
    isPropsNeeded = _ref$isPropsNeeded === void 0 ? false : _ref$isPropsNeeded,
    _ref$ServerStyle = _ref.ServerStyle,
    ServerStyle = _ref$ServerStyle === void 0 ? {} : _ref$ServerStyle,
    config = _ref.config;
  var _useState = React.useState(false),
    active = _useState[0],
    setActive = _useState[1];
  var _useState2 = React.useState(),
    searchQuery = _useState2[0],
    setSearchQuery = _useState2[1];
  var _useState3 = React.useState(-1),
    optionIndex = _useState3[0],
    setOptionIndex = _useState3[1];
  var dropdownRef = React.useRef();
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  function reducer(state, action) {
    var _action$payload, _action$payload$, _ref2;
    switch (action.type) {
      case "ADD_TO_SELECTED_EVENT_QUEUE":
        return [].concat(state, [(_ref2 = {}, _ref2[optionsKey] = (_action$payload = action.payload) === null || _action$payload === void 0 ? void 0 : (_action$payload$ = _action$payload[1]) === null || _action$payload$ === void 0 ? void 0 : _action$payload$[optionsKey], _ref2.propsData = action.payload, _ref2)]);
      case "REMOVE_FROM_SELECTED_EVENT_QUEUE":
        var newState = state.filter(function (e) {
          var _action$payload2, _action$payload2$;
          return (e === null || e === void 0 ? void 0 : e[optionsKey]) !== ((_action$payload2 = action.payload) === null || _action$payload2 === void 0 ? void 0 : (_action$payload2$ = _action$payload2[1]) === null || _action$payload2$ === void 0 ? void 0 : _action$payload2$[optionsKey]);
        });
        onSelect(newState.map(function (e) {
          return e.propsData;
        }), props);
        return newState;
      case "REPLACE_COMPLETE_STATE":
        return action.payload;
      default:
        return state;
    }
  }
  React.useEffect(function () {
    dispatch({
      type: "REPLACE_COMPLETE_STATE",
      payload: fnToSelectOptionThroughProvidedSelection(selected)
    });
  }, [selected === null || selected === void 0 ? void 0 : selected.length]);
  function fnToSelectOptionThroughProvidedSelection(selected) {
    return selected === null || selected === void 0 ? void 0 : selected.map(function (e) {
      var _ref3;
      return _ref3 = {}, _ref3[optionsKey] = e === null || e === void 0 ? void 0 : e[optionsKey], _ref3.propsData = [null, e], _ref3;
    });
  }
  var _useReducer = React.useReducer(reducer, selected, fnToSelectOptionThroughProvidedSelection),
    alreadyQueuedSelectedState = _useReducer[0],
    dispatch = _useReducer[1];
  React.useEffect(function () {
    if (!active) {
      onSelect(alreadyQueuedSelectedState === null || alreadyQueuedSelectedState === void 0 ? void 0 : alreadyQueuedSelectedState.map(function (e) {
        return e.propsData;
      }), props);
    }
  }, [active]);
  function handleOutsideClickAndSubmitSimultaneously() {
    setActive(false);
  }
  Digit.Hooks.useClickOutside(dropdownRef, handleOutsideClickAndSubmitSimultaneously, active, {
    capture: true
  });
  var filtOptns = (searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.length) > 0 ? options.filter(function (option) {
    return t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey].toUpperCase()).toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
  }) : options;
  function onSearch(e) {
    setSearchQuery(e.target.value);
  }
  function onSelectToAddToQueue() {
    for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }
    var isChecked = arguments[0].target.checked;
    isChecked ? dispatch({
      type: "ADD_TO_SELECTED_EVENT_QUEUE",
      payload: arguments
    }) : dispatch({
      type: "REMOVE_FROM_SELECTED_EVENT_QUEUE",
      payload: arguments
    });
  }
  var keyChange = function keyChange(e) {
    if (e.key == "ArrowDown") {
      setOptionIndex(function (state) {
        return state + 1 == filtOptns.length ? 0 : state + 1;
      });
      if (optionIndex + 1 == filtOptns.length) {
        var _e$target, _e$target$parentEleme, _e$target$parentEleme2, _e$target$parentEleme3, _e$target$parentEleme4, _e$target$parentEleme5;
        e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : (_e$target$parentEleme = _e$target.parentElement) === null || _e$target$parentEleme === void 0 ? void 0 : (_e$target$parentEleme2 = _e$target$parentEleme.parentElement) === null || _e$target$parentEleme2 === void 0 ? void 0 : (_e$target$parentEleme3 = _e$target$parentEleme2.children) === null || _e$target$parentEleme3 === void 0 ? void 0 : (_e$target$parentEleme4 = _e$target$parentEleme3.namedItem("jk-dropdown-unique")) === null || _e$target$parentEleme4 === void 0 ? void 0 : (_e$target$parentEleme5 = _e$target$parentEleme4.scrollTo) === null || _e$target$parentEleme5 === void 0 ? void 0 : _e$target$parentEleme5.call(_e$target$parentEleme4, 0, 0);
      } else {
        var _e$target2, _e$target2$parentElem, _e$target2$parentElem2, _e$target2$parentElem3, _e$target2$parentElem4, _e$target2$parentElem5;
        optionIndex > 2 && (e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : (_e$target2$parentElem = _e$target2.parentElement) === null || _e$target2$parentElem === void 0 ? void 0 : (_e$target2$parentElem2 = _e$target2$parentElem.parentElement) === null || _e$target2$parentElem2 === void 0 ? void 0 : (_e$target2$parentElem3 = _e$target2$parentElem2.children) === null || _e$target2$parentElem3 === void 0 ? void 0 : (_e$target2$parentElem4 = _e$target2$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target2$parentElem4 === void 0 ? void 0 : (_e$target2$parentElem5 = _e$target2$parentElem4.scrollBy) === null || _e$target2$parentElem5 === void 0 ? void 0 : _e$target2$parentElem5.call(_e$target2$parentElem4, 0, 45));
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      setOptionIndex(function (state) {
        return state !== 0 ? state - 1 : filtOptns.length - 1;
      });
      if (optionIndex === 0) {
        var _e$target3, _e$target3$parentElem, _e$target3$parentElem2, _e$target3$parentElem3, _e$target3$parentElem4, _e$target3$parentElem5;
        e === null || e === void 0 ? void 0 : (_e$target3 = e.target) === null || _e$target3 === void 0 ? void 0 : (_e$target3$parentElem = _e$target3.parentElement) === null || _e$target3$parentElem === void 0 ? void 0 : (_e$target3$parentElem2 = _e$target3$parentElem.parentElement) === null || _e$target3$parentElem2 === void 0 ? void 0 : (_e$target3$parentElem3 = _e$target3$parentElem2.children) === null || _e$target3$parentElem3 === void 0 ? void 0 : (_e$target3$parentElem4 = _e$target3$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target3$parentElem4 === void 0 ? void 0 : (_e$target3$parentElem5 = _e$target3$parentElem4.scrollTo) === null || _e$target3$parentElem5 === void 0 ? void 0 : _e$target3$parentElem5.call(_e$target3$parentElem4, 100000, 100000);
      } else {
        var _e$target4, _e$target4$parentElem, _e$target4$parentElem2, _e$target4$parentElem3, _e$target4$parentElem4, _e$target4$parentElem5;
        optionIndex > 2 && (e === null || e === void 0 ? void 0 : (_e$target4 = e.target) === null || _e$target4 === void 0 ? void 0 : (_e$target4$parentElem = _e$target4.parentElement) === null || _e$target4$parentElem === void 0 ? void 0 : (_e$target4$parentElem2 = _e$target4$parentElem.parentElement) === null || _e$target4$parentElem2 === void 0 ? void 0 : (_e$target4$parentElem3 = _e$target4$parentElem2.children) === null || _e$target4$parentElem3 === void 0 ? void 0 : (_e$target4$parentElem4 = _e$target4$parentElem3.namedItem("jk-dropdown-unique")) === null || _e$target4$parentElem4 === void 0 ? void 0 : (_e$target4$parentElem5 = _e$target4$parentElem4.scrollBy) === null || _e$target4$parentElem5 === void 0 ? void 0 : _e$target4$parentElem5.call(_e$target4$parentElem4, 0, -45));
      }
      e.preventDefault();
    } else if (e.key == "Enter") {
      onSelectToAddToQueue(e, filtOptns[optionIndex]);
    }
  };
  var MenuItem = function MenuItem(_ref4) {
    var option = _ref4.option,
      index = _ref4.index;
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      style: isOBPSMultiple ? index % 2 !== 0 ? {
        background: "#EEEEEE"
      } : {} : {}
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      value: option[optionsKey],
      checked: alreadyQueuedSelectedState.find(function (selectedOption) {
        return selectedOption[optionsKey] === option[optionsKey];
      }) ? true : false,
      onChange: function onChange(e) {
        return isPropsNeeded ? onSelectToAddToQueue(e, option, props) : isOBPSMultiple ? onSelectToAddToQueue(e, option, BlockNumber) : onSelectToAddToQueue(e, option);
      },
      style: {
        minWidth: "24px",
        width: "100%"
      }
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "custom-checkbox"
    }, /*#__PURE__*/React__default.createElement(CheckSvg, {
      style: {
        innerWidth: "24px",
        width: "24px"
      }
    })), /*#__PURE__*/React__default.createElement("p", {
      className: "label",
      style: index === optionIndex ? {
        opacity: 1,
        backgroundColor: "rgba(238, 238, 238, var(--bg-opacity))"
      } : {}
    }, t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey])));
  };
  var Menu = function Menu() {
    var filteredOptions = (searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.length) > 0 ? options.filter(function (option) {
      return t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey].toUpperCase()).toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
    }) : options;
    return filteredOptions === null || filteredOptions === void 0 ? void 0 : filteredOptions.map(function (option, index) {
      return /*#__PURE__*/React__default.createElement(MenuItem, {
        option: option,
        key: index,
        index: index
      });
    });
  };
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "multi-select-dropdown-wrap",
    ref: dropdownRef,
    style: {
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "master" + (active ? "-active" : "")
  }, /*#__PURE__*/React__default.createElement("input", {
    className: "cursorPointer",
    style: {
      opacity: 0
    },
    type: "text",
    onKeyDown: keyChange,
    onFocus: function onFocus() {
      return setActive(true);
    },
    value: searchQuery,
    onChange: onSearch
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "label"
  }, /*#__PURE__*/React__default.createElement("p", null, alreadyQueuedSelectedState.length > 0 ? alreadyQueuedSelectedState.length + " " + defaultUnit : defaultLabel), /*#__PURE__*/React__default.createElement(ArrowDown, null))), active ? /*#__PURE__*/React__default.createElement("div", {
    className: "server",
    id: "jk-dropdown-unique",
    style: ServerStyle ? ServerStyle : {}
  }, /*#__PURE__*/React__default.createElement(Menu, null)) : null), config !== null && config !== void 0 && config.isDropdownWithChip ? /*#__PURE__*/React__default.createElement("div", {
    className: "tag-container"
  }, alreadyQueuedSelectedState.length > 0 && alreadyQueuedSelectedState.map(function (value, index) {
    return /*#__PURE__*/React__default.createElement(RemoveableTag, {
      key: index,
      text: t(value[optionsKey]).slice(0, 22) + " ...",
      onClick: isPropsNeeded ? function (e) {
        return onSelectToAddToQueue(e, value, props);
      } : function (e) {
        return onSelectToAddToQueue(e, value);
      }
    });
  })) : null);
};

var IconsObject = {
  CommonPTIcon: /*#__PURE__*/React__default.createElement(PTIcon, null),
  OBPSIcon: /*#__PURE__*/React__default.createElement(OBPSIcon, null),
  propertyIcon: /*#__PURE__*/React__default.createElement(PropertyHouse, null),
  TLIcon: /*#__PURE__*/React__default.createElement(CaseIcon, null),
  PGRIcon: /*#__PURE__*/React__default.createElement(PGRIcon, null),
  FSMIcon: /*#__PURE__*/React__default.createElement(FSMIcon, null),
  WSIcon: /*#__PURE__*/React__default.createElement(WSICon, null),
  MCollectIcon: /*#__PURE__*/React__default.createElement(MCollectIcon, null),
  BillsIcon: /*#__PURE__*/React__default.createElement(CollectionIcon, null),
  home: /*#__PURE__*/React__default.createElement(HomeIcon, null),
  announcement: /*#__PURE__*/React__default.createElement(ComplaintIcon, null),
  business: /*#__PURE__*/React__default.createElement(ComplaintIcon, null),
  store: /*#__PURE__*/React__default.createElement(PropertyHouse, null),
  assignment: /*#__PURE__*/React__default.createElement(CaseIcon, null),
  receipt: /*#__PURE__*/React__default.createElement(CollectionIcon, null),
  "business-center": /*#__PURE__*/React__default.createElement(PersonIcon, null),
  description: /*#__PURE__*/React__default.createElement(DocumentIconSolid, null),
  "water-tap": /*#__PURE__*/React__default.createElement(DropIcon, null),
  "collections-bookmark": /*#__PURE__*/React__default.createElement(CollectionsBookmarIcons, null),
  "insert-chart": /*#__PURE__*/React__default.createElement(FinanceChartIcon, null),
  edcr: /*#__PURE__*/React__default.createElement(CollectionIcon, null),
  collections: /*#__PURE__*/React__default.createElement(CollectionIcon, null)
};
var SubMenu = function SubMenu(_ref) {
  var _item$icon, _item$icon$split, _item$icon$split$call;
  var item = _ref.item,
    t = _ref.t,
    isEmployee = _ref.isEmployee;
  var _useState = React.useState(false),
    subnav = _useState[0],
    setSubnav = _useState[1];
  var location = reactRouterDom.useLocation();
  var pathname = location.pathname;
  var showSubnav = function showSubnav() {
    return setSubnav(!subnav);
  };
  var leftIconCitizenArray = item.icon;
  var leftIconCitizen = IconsObject[leftIconCitizenArray] || IconsObject.BillsIcon;
  var leftIconEmployeeItems = (item === null || item === void 0 ? void 0 : (_item$icon = item.icon) === null || _item$icon === void 0 ? void 0 : (_item$icon$split = _item$icon.split) === null || _item$icon$split === void 0 ? void 0 : (_item$icon$split$call = _item$icon$split.call(_item$icon, ":")) === null || _item$icon$split$call === void 0 ? void 0 : _item$icon$split$call[1]) || "";
  var leftIconEmployee = IconsObject[leftIconEmployeeItems] || IconsObject.collections;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "submenu-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    onClick: item.links && showSubnav,
    className: "sidebar-link " + (subnav === true ? "active" : "")
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "actions"
  }, isEmployee ? leftIconEmployee : leftIconCitizen, /*#__PURE__*/React__default.createElement("span", null, isEmployee ? item.moduleName : t(Digit.Utils.locale.getTransformedLocale("ACTION_TEST_" + item.moduleName)))), /*#__PURE__*/React__default.createElement("div", null, " ", item.links && subnav, " "))), subnav && item.links.sort(function (a, b) {
    return a.orderNumber - b.orderNumber;
  }).map(function (item, index) {
    var _window;
    if (item.navigationURL.indexOf("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath)) === -1) {
      var getOrigin = window.location.origin;
      return /*#__PURE__*/React__default.createElement("a", {
        key: index + 1,
        className: "dropdown-link " + (pathname === item.link ? "active" : ""),
        href: getOrigin + "/employee/" + item.navigationURL
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "actions"
      }, /*#__PURE__*/React__default.createElement("span", null, item.label || item.displayName)));
    }
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: item.link || item.navigationURL,
      key: index + 1,
      className: "dropdown-link " + (pathname === item.navigationURL ? "active" : "")
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "actions"
    }, /*#__PURE__*/React__default.createElement("span", null, item.label || item.displayName)));
  }));
};

var IconsObject$1 = {
  CommonPTIcon: /*#__PURE__*/React__default.createElement(PTIcon, {
    className: "icon"
  }),
  OBPSIcon: /*#__PURE__*/React__default.createElement(OBPSIcon, {
    className: "icon"
  }),
  propertyIcon: /*#__PURE__*/React__default.createElement(PropertyHouse, {
    className: "icon"
  }),
  TLIcon: /*#__PURE__*/React__default.createElement(CaseIcon, {
    className: "icon"
  }),
  PGRIcon: /*#__PURE__*/React__default.createElement(PGRIcon, {
    className: "icon"
  }),
  FSMIcon: /*#__PURE__*/React__default.createElement(FSMIcon, {
    className: "icon"
  }),
  WSIcon: /*#__PURE__*/React__default.createElement(WSICon, {
    className: "icon"
  }),
  BirthIcon: /*#__PURE__*/React__default.createElement(BirthIcon, {
    className: "icon"
  }),
  DeathIcon: /*#__PURE__*/React__default.createElement(DeathIcon, {
    className: "icon"
  }),
  FirenocIcon: /*#__PURE__*/React__default.createElement(FirenocIcon, {
    className: "icon"
  }),
  MCollectIcon: /*#__PURE__*/React__default.createElement(MCollectIcon, {
    className: "icon"
  }),
  BillsIcon: /*#__PURE__*/React__default.createElement(CollectionIcon, {
    className: "icon"
  }),
  home: /*#__PURE__*/React__default.createElement(HomeIcon, {
    className: "icon"
  }),
  announcement: /*#__PURE__*/React__default.createElement(ComplaintIcon, {
    className: "icon"
  }),
  business: /*#__PURE__*/React__default.createElement(BPAHomeIcon, {
    className: "icon"
  }),
  store: /*#__PURE__*/React__default.createElement(PropertyHouse, {
    className: "icon"
  }),
  assignment: /*#__PURE__*/React__default.createElement(CaseIcon, {
    className: "icon"
  }),
  receipt: /*#__PURE__*/React__default.createElement(CollectionIcon, {
    className: "icon"
  }),
  "business-center": /*#__PURE__*/React__default.createElement(PersonIcon, {
    className: "icon"
  }),
  description: /*#__PURE__*/React__default.createElement(CollectionIcon, {
    className: "icon"
  }),
  "water-tap": /*#__PURE__*/React__default.createElement(DropIcon, {
    className: "icon"
  }),
  "collections-bookmark": /*#__PURE__*/React__default.createElement(CollectionsBookmarIcons, {
    className: "icon"
  }),
  "insert-chart": /*#__PURE__*/React__default.createElement(FinanceChartIcon, {
    className: "icon"
  }),
  edcr: /*#__PURE__*/React__default.createElement(CollectionIcon, {
    className: "icon"
  }),
  collections: /*#__PURE__*/React__default.createElement(CollectionIcon, {
    className: "icon"
  }),
  "open-complaints": /*#__PURE__*/React__default.createElement(ComplaintIcon, {
    className: "icon"
  }),
  HomeIcon: /*#__PURE__*/React__default.createElement(HomeIcon, {
    className: "icon"
  }),
  EditPencilIcon: /*#__PURE__*/React__default.createElement(EditPencilIcon, {
    className: "icon"
  }),
  LogoutIcon: /*#__PURE__*/React__default.createElement(LogoutIcon, {
    className: "icon"
  }),
  Phone: /*#__PURE__*/React__default.createElement(Phone, {
    className: "icon"
  }),
  LanguageIcon: /*#__PURE__*/React__default.createElement(LanguageIcon, {
    className: "icon"
  })
};
var NavBar = function NavBar(_ref) {
  var open = _ref.open,
    toggleSidebar = _ref.toggleSidebar,
    profileItem = _ref.profileItem,
    menuItems = _ref.menuItems,
    onClose = _ref.onClose,
    Footer = _ref.Footer,
    isEmployee = _ref.isEmployee,
    search = _ref.search,
    setSearch = _ref.setSearch;
  var node = React.useRef();
  var location = reactRouterDom.useLocation();
  var pathname = location.pathname;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  Digit.Hooks.useClickOutside(node, open ? onClose : null, open);
  var MenuItem = function MenuItem(_ref2) {
    var _item$icon, _item$icon$type;
    var item = _ref2.item;
    var itemComponent;
    if (item.type === "component") {
      itemComponent = item.action;
    } else {
      itemComponent = item.text;
    }
    var leftIconArray = item.icon || ((_item$icon = item.icon) === null || _item$icon === void 0 ? void 0 : (_item$icon$type = _item$icon.type) === null || _item$icon$type === void 0 ? void 0 : _item$icon$type.name);
    var leftIcon = leftIconArray ? IconsObject$1[leftIconArray] : IconsObject$1.BillsIcon;
    var Item = function Item() {
      return /*#__PURE__*/React__default.createElement("span", _extends({
        className: "menu-item"
      }, item.populators), leftIcon, /*#__PURE__*/React__default.createElement("div", {
        className: "menu-label"
      }, itemComponent));
    };
    if (item.type === "external-link") {
      return /*#__PURE__*/React__default.createElement("a", {
        href: item.link
      }, /*#__PURE__*/React__default.createElement(Item, null));
    }
    if (item.type === "link") {
      var _window;
      if (item.link.indexOf("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath)) === -1 && isEmployee) {
        var getOrigin = window.location.origin;
        return /*#__PURE__*/React__default.createElement("a", {
          href: getOrigin + "/employee/" + item.link
        }, /*#__PURE__*/React__default.createElement(Item, null));
      }
      return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        to: item.link
      }, /*#__PURE__*/React__default.createElement(Item, null));
    }
    if (item.type === "dynamic") {
      if (isEmployee) {
        return /*#__PURE__*/React__default.createElement(SubMenu, {
          item: item,
          t: t,
          toggleSidebar: toggleSidebar,
          isEmployee: isEmployee
        });
      }
    }
    return /*#__PURE__*/React__default.createElement(Item, null);
  };
  var renderSearch = function renderSearch() {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "sidebar-list"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "submenu-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sidebar-link"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "actions"
    }, /*#__PURE__*/React__default.createElement(SearchIcon, {
      className: "icon"
    }), /*#__PURE__*/React__default.createElement("input", {
      className: "employee-search-input",
      type: "text",
      placeholder: t("ACTION_TEST_SEARCH"),
      name: "search",
      value: search,
      onChange: function onChange(e) {
        return setSearch(e.target.value);
      }
    })))));
  };
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "fixed",
      height: "100%",
      width: "100%",
      top: "0px",
      left: "" + (open ? "0px" : "-100%"),
      opacity: "1",
      backgroundColor: "rgba(0, 0, 0, 0.54)",
      willChange: "opacity",
      transform: "translateZ(0px)",
      transition: "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
      zIndex: "1200",
      pointerzevents: "auto"
    }
  }), /*#__PURE__*/React__default.createElement("div", {
    ref: node,
    style: {
      display: "flex",
      flexDirection: "column",
      marginTop: "56px",
      height: "calc(100vh - 56px)",
      position: "fixed",
      top: 0,
      left: 0,
      transition: "transform 0.3s ease-in-out",
      background: "#fff",
      zIndex: "1999",
      width: "280px",
      transform: "" + (open ? "translateX(0)" : "translateX(-450px)"),
      boxShadow: "rgb(0 0 0 / 16%) 8px 0px 16px"
    }
  }, profileItem, /*#__PURE__*/React__default.createElement("div", {
    className: "drawer-list"
  }, isEmployee ? renderSearch() : null, menuItems === null || menuItems === void 0 ? void 0 : menuItems.map(function (item, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "sidebar-list " + (pathname === item.link ? "active" : ""),
      key: index
    }, /*#__PURE__*/React__default.createElement(MenuItem, {
      item: item
    }));
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "sidebar-list"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "side-bar-footer"
  }, Footer))))));
};

var _excluded$4 = ["isFocus", "onChange", "onFocus", "value"];
var BACKSPACE = 8;
var SingleInput = function SingleInput(_ref) {
  var isFocus = _ref.isFocus,
    onChange = _ref.onChange,
    onFocus = _ref.onFocus,
    value = _ref.value,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$4);
  var inputRef = React.useRef();
  React.useEffect(function () {
    if (isFocus) {
      inputRef.current.focus();
    }
  }, [isFocus]);
  return /*#__PURE__*/React__default.createElement("input", _extends({
    className: "input-otp",
    maxLength: 1,
    onChange: onChange,
    onFocus: onFocus,
    ref: inputRef,
    type: "number",
    value: value ? value : ""
  }, rest));
};
var OTPInput = function OTPInput(props) {
  var _useState = React.useState(0),
    activeInput = _useState[0],
    setActiveInput = _useState[1];
  var isInputValueValid = function isInputValueValid(value) {
    return typeof value === "string" && value.trim().length === 1;
  };
  var changeCodeAtFocus = function changeCodeAtFocus(value) {
    var onChange = props.onChange;
    var otp = getOtpValue();
    otp[activeInput] = value[0];
    var otpValue = otp.join("");
    onChange(otpValue);
  };
  var focusNextInput = function focusNextInput() {
    setActiveInput(function (activeInput) {
      return Math.min(activeInput + 1, props.length - 1);
    });
  };
  var focusPrevInput = function focusPrevInput() {
    setActiveInput(function (activeInput) {
      return Math.max(activeInput - 1, 0);
    });
  };
  var getOtpValue = function getOtpValue() {
    return props.value ? props.value.toString().split("") : [];
  };
  var handleKeyDown = function handleKeyDown(event) {
    if (event.keyCode === BACKSPACE || event.key === "Backspace") {
      event.preventDefault();
      changeCodeAtFocus("");
      focusPrevInput();
    }
  };
  function inputChange(event) {
    var value = event.target.value;
    changeCodeAtFocus(value);
    if (isInputValueValid(value)) {
      focusNextInput();
    }
  }
  var OTPStack = [];
  var otp = getOtpValue();
  var _loop = function _loop(i) {
    OTPStack.push( /*#__PURE__*/React__default.createElement(SingleInput, {
      key: i,
      isFocus: activeInput === i,
      onChange: inputChange,
      onKeyDown: handleKeyDown,
      onFocus: function onFocus(e) {
        setActiveInput(i);
        e.target.select();
      },
      value: otp[i]
    }));
  };
  for (var i = 0; i < props.length; i++) {
    _loop(i);
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "input-otp-wrap"
  }, OTPStack);
};
OTPInput.propTypes = {
  length: propTypes.number
};
OTPInput.defaultProps = {
  length: 0
};

var _excluded$5 = ["component", "roles"];
var PrivateRoute = function PrivateRoute(_ref) {
  var Component = _ref.component,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$5);
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Route, _extends({}, rest, {
    render: function render(props) {
      var user = Digit.UserService.getUser();
      var userType = Digit.UserService.getType();
      function getLoginRedirectionLink() {
        if (userType === "employee") {
          var _window;
          return "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/user/language-selection";
        } else {
          var _window2;
          return "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen/login";
        }
      }
      if (!user || !user.access_token) {
        return /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
          to: {
            pathname: getLoginRedirectionLink(),
            state: {
              from: props.location.pathname + props.location.search
            }
          }
        });
      }
      return /*#__PURE__*/React__default.createElement(Component, props);
    }
  }));
};

var RadioButtons = function RadioButtons(props) {
  var _props$options;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var selected = props.selectedOption;
  function selectOption(value) {
    props.onSelect(value);
  }
  return /*#__PURE__*/React__default.createElement("div", {
    style: props.style,
    className: "radio-wrap " + (props === null || props === void 0 ? void 0 : props.additionalWrapperClass)
  }, props === null || props === void 0 ? void 0 : (_props$options = props.options) === null || _props$options === void 0 ? void 0 : _props$options.map(function (option, ind) {
    if (props !== null && props !== void 0 && props.optionsKey && !(props !== null && props !== void 0 && props.isDependent)) {
      return /*#__PURE__*/React__default.createElement("div", {
        style: props.innerStyles,
        key: ind
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-wrap"
      }, /*#__PURE__*/React__default.createElement("input", {
        className: "radio-btn",
        type: "radio",
        value: option,
        checked: props.isPTFlow && (selected === null || selected === void 0 ? void 0 : selected.code) === option.code || isEqual(selected, option) ? 1 : 0,
        onChange: function onChange() {
          return selectOption(option);
        },
        disabled: props === null || props === void 0 ? void 0 : props.disabled,
        name: props.name,
        ref: props.inputRef
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-checkmark"
      })), /*#__PURE__*/React__default.createElement("label", {
        style: props.inputStyle
      }, t(option[props.optionsKey])));
    } else if (props !== null && props !== void 0 && props.optionsKey && props !== null && props !== void 0 && props.isDependent) {
      return /*#__PURE__*/React__default.createElement("div", {
        style: props.innerStyles,
        key: ind
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-wrap"
      }, /*#__PURE__*/React__default.createElement("input", {
        className: "radio-btn",
        type: "radio",
        value: option,
        checked: (selected === null || selected === void 0 ? void 0 : selected.code) === option.code ? 1 : 0,
        onChange: function onChange() {
          return selectOption(option);
        },
        disabled: props === null || props === void 0 ? void 0 : props.disabled,
        name: props.name,
        ref: props.inputRef
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-checkmark"
      })), /*#__PURE__*/React__default.createElement("label", {
        style: props.inputStyle
      }, t(props.labelKey ? props.labelKey + "_" + option.code : option.code)));
    } else {
      return /*#__PURE__*/React__default.createElement("div", {
        style: props.innerStyles,
        key: ind
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-wrap"
      }, /*#__PURE__*/React__default.createElement("input", {
        className: "radio-btn",
        type: "radio",
        value: option,
        checked: selected === option ? 1 : 0,
        onChange: function onChange() {
          return selectOption(option);
        },
        disabled: props === null || props === void 0 ? void 0 : props.disabled,
        name: props.name,
        ref: props.inputRef
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-checkmark"
      })), /*#__PURE__*/React__default.createElement("label", {
        style: props.inputStyle
      }, t(option)));
    }
  }));
};
RadioButtons.propTypes = {
  selectedOption: propTypes.any,
  onSelect: propTypes.func,
  options: propTypes.any,
  optionsKey: propTypes.string,
  innerStyles: propTypes.any,
  style: propTypes.any
};
RadioButtons.defaultProps = {};

var Rating = function Rating(props) {
  var stars = [];
  var star = React.useRef(null);
  var _loop = function _loop() {
    if (i - props.currentRating <= 0) {
      var index = i;
      stars.push( /*#__PURE__*/React__default.createElement(StarFilled, {
        key: i,
        id: props.id + "gradient" + i,
        className: "rating-star",
        styles: props.starStyles,
        onClick: function onClick(e) {
          return props.onFeedback(e, star, index);
        }
      }));
    } else if (i - props.currentRating > 0 && i - props.currentRating < 1) {
      var _index = i;
      stars.push( /*#__PURE__*/React__default.createElement(StarFilled, {
        key: i,
        id: props.id + "gradient" + i,
        className: "rating-star",
        styles: props.starStyles,
        onClick: function onClick(e) {
          return props.onFeedback(e, star, _index);
        },
        percentage: Math.round((props.currentRating - parseInt(props.currentRating)) * 100)
      }));
    } else {
      var _index2 = i;
      stars.push( /*#__PURE__*/React__default.createElement(StarEmpty, {
        key: i,
        className: "rating-star",
        styles: props.starStyles,
        onClick: function onClick(e) {
          return props.onFeedback(e, star, _index2);
        }
      }));
    }
  };
  for (var i = 1; i <= props.maxRating; i++) {
    _loop();
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "" + (props.withText ? "rating-with-text" : "rating-star-wrap"),
    style: _extends({}, props.styles)
  }, props.text ? props.text : "", " ", stars);
};
Rating.propTypes = {
  maxRating: propTypes.number,
  currentRating: propTypes.number,
  onFeedback: propTypes.func
};
Rating.defaultProps = {
  maxRating: 5,
  id: '0',
  currentRating: 0,
  onFeedback: function onFeedback() {}
};

var UnMaskComponent = React__default.memo(function (_ref) {
  var _ref$privacy = _ref.privacy,
    privacy = _ref$privacy === void 0 ? {} : _ref$privacy,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style;
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), "DataSecurity", [{
      name: "SecurityPolicy"
    }], {
      select: function select(data) {
        var _data$DataSecurity, _data$DataSecurity$Se;
        return (data === null || data === void 0 ? void 0 : (_data$DataSecurity = data.DataSecurity) === null || _data$DataSecurity === void 0 ? void 0 : (_data$DataSecurity$Se = _data$DataSecurity.SecurityPolicy) === null || _data$DataSecurity$Se === void 0 ? void 0 : _data$DataSecurity$Se.find(function (elem) {
          return (elem === null || elem === void 0 ? void 0 : elem.model) == (privacy === null || privacy === void 0 ? void 0 : privacy.model);
        })) || {};
      }
    }),
    isLoading = _Digit$Hooks$useCusto.isLoading,
    data = _Digit$Hooks$useCusto.data;
  var _Digit$Hooks$usePriva = Digit.Hooks.usePrivacyContext(),
    updatePrivacy = _Digit$Hooks$usePriva.updatePrivacy;
  if (isLoading || privacy !== null && privacy !== void 0 && privacy.hide) {
    return null;
  }
  if (Digit.Utils.checkPrivacy(data, privacy)) {
    return /*#__PURE__*/React__default.createElement("span", {
      onClick: function onClick() {
        updatePrivacy(privacy === null || privacy === void 0 ? void 0 : privacy.uuid, privacy === null || privacy === void 0 ? void 0 : privacy.fieldName);
      }
    }, /*#__PURE__*/React__default.createElement(PrivacyMaskIcon, {
      className: "privacy-icon",
      style: style
    }));
  }
  return null;
});
UnMaskComponent.propTypes = {
  privacy: propTypes.object
};
UnMaskComponent.defaultProps = {
  privacy: {
    uuid: "",
    fieldName: "",
    model: ""
  }
};

var RoundedLabel = function RoundedLabel(_ref) {
  var count = _ref.count;
  return count ? /*#__PURE__*/React__default.createElement("div", {
    className: "roundedLabel"
  }, count) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

var TextField$2 = function TextField(props) {
  var _useState = React.useState(props.selectedVal ? props.selectedVal : ""),
    value = _useState[0],
    setValue = _useState[1];
  React.useEffect(function () {
    props.selectedVal ? setValue(props.selectedVal) : null;
  }, [props.selectedVal]);
  function inputChange(e) {
    setValue(e.target.value);
    props.setFilter(e.target.value);
  }
  return /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    value: value,
    onChange: inputChange,
    onClick: props.onClick
  });
};
var SectionalDropdown = function SectionalDropdown(props) {
  var _useState2 = React.useState(false),
    dropdownStatus = _useState2[0],
    setDropdownStatus = _useState2[1];
  var _useState3 = React.useState(props.selected ? props.selected : null),
    selectedOption = _useState3[0],
    setSelectedOption = _useState3[1];
  var _useState4 = React.useState(""),
    filterVal = _useState4[0],
    setFilterVal = _useState4[1];
  React.useEffect(function () {
    setSelectedOption(props.selected);
  }, [props.selected]);
  function dropdownSwitch() {
    var current = dropdownStatus;
    setDropdownStatus(!current);
  }
  function dropdownOn() {
    setDropdownStatus(true);
  }
  function onSelect(selectedOption) {
    props.select(selectedOption);
    setSelectedOption(selectedOption);
    setDropdownStatus(false);
  }
  function setFilter(val) {
    setFilterVal(val);
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sect-dropdown-wrap",
    style: _extends({}, props.style)
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sect-dropdown-input-wrap"
  }, /*#__PURE__*/React__default.createElement(TextField$2, {
    setFilter: setFilter,
    selectedVal: selectedOption ? props.t ? props.t(props.displayKey ? selectedOption[props.displayKey] : selectedOption) : props.displayKey ? selectedOption[props.displayKey] : selectedOption : null,
    filterVal: filterVal,
    onClick: dropdownOn
  }), /*#__PURE__*/React__default.createElement(ArrowDown, {
    onClick: dropdownSwitch
  })), dropdownStatus ? /*#__PURE__*/React__default.createElement("div", {
    className: "sect-dropdown-card"
  }, props.menuData.filter(function (subMenu) {
    return subMenu.options.filter(function (option) {
      return option[props.displayKey].toUpperCase().includes(filterVal.toUpperCase());
    });
  }).map(function (subMenu, index) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, /*#__PURE__*/React__default.createElement("h1", null, subMenu.heading), subMenu.options.map(function (option, index) {
      return /*#__PURE__*/React__default.createElement("p", {
        key: index,
        onClick: function onClick() {
          return onSelect(option);
        }
      }, props.t ? props.t(option[props.displayKey]) : option[props.displayKey]);
    }));
  })) : null);
};

var LastRow = function LastRow(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    styles: props.rowContainerStyle,
    className: "row-last"
  }, /*#__PURE__*/React__default.createElement("h2", null, props.label), /*#__PURE__*/React__default.createElement("p", null, props.text));
};
var Row = function Row(props) {
  var value = props.text;
  var valueStyle = props.textStyle || {};
  var labelStyle = props.labelStyle || {};
  if (Array.isArray(props.text)) {
    value = props.text.map(function (val, index) {
      if (val !== null && val !== void 0 && val.className) {
        return /*#__PURE__*/React__default.createElement("p", {
          className: val === null || val === void 0 ? void 0 : val.className,
          style: val === null || val === void 0 ? void 0 : val.style,
          key: index
        }, val === null || val === void 0 ? void 0 : val.value, (props === null || props === void 0 ? void 0 : props.privacy) && /*#__PURE__*/React__default.createElement("span", {
          style: {
            display: "inline-flex",
            width: "fit-content",
            marginLeft: "10px"
          }
        }, /*#__PURE__*/React__default.createElement(UnMaskComponent, {
          privacy: props === null || props === void 0 ? void 0 : props.privacy
        })));
      }
      return /*#__PURE__*/React__default.createElement("p", {
        key: index
      }, val, (props === null || props === void 0 ? void 0 : props.privacy) && /*#__PURE__*/React__default.createElement("span", {
        style: {
          display: "inline-flex",
          width: "fit-content",
          marginLeft: "10px"
        }
      }, /*#__PURE__*/React__default.createElement(UnMaskComponent, {
        privacy: props === null || props === void 0 ? void 0 : props.privacy
      })));
    });
  }
  return /*#__PURE__*/React__default.createElement("div", {
    style: props.rowContainerStyle,
    className: (props.last ? "row last" : "row") + " " + ((props === null || props === void 0 ? void 0 : props.className) || "")
  }, /*#__PURE__*/React__default.createElement("h2", {
    style: labelStyle
  }, props.label, (props === null || props === void 0 ? void 0 : props.isMandotary) && '*'), /*#__PURE__*/React__default.createElement("div", {
    className: "value",
    style: valueStyle
  }, props !== null && props !== void 0 && props.isValueLink ? /*#__PURE__*/React__default.createElement("p", {
    className: "status-value-link",
    onClick: props === null || props === void 0 ? void 0 : props.navigateLinkHandler
  }, value) : /*#__PURE__*/React__default.createElement("p", null, value), (props === null || props === void 0 ? void 0 : props.privacy) && /*#__PURE__*/React__default.createElement("span", {
    style: {
      display: "inline-flex",
      width: "fit-content",
      marginLeft: "10px"
    }
  }, /*#__PURE__*/React__default.createElement(UnMaskComponent, {
    privacy: props === null || props === void 0 ? void 0 : props.privacy
  })), props.caption && /*#__PURE__*/React__default.createElement("div", {
    className: "caption"
  }, props.caption)), props.actionButton ? /*#__PURE__*/React__default.createElement("div", {
    style: props.actionButtonStyle,
    className: "action-button"
  }, props.actionButton) : null);
};
var MediaRow = function MediaRow(props) {
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("h2", null, props.label), /*#__PURE__*/React__default.createElement("span", null, props.children));
};
var StatusTable = function StatusTable(props) {
  var employee = Digit.SessionStorage.get("user_type") === "employee" ? true : false;
  if (props.dataObject) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: employee ? "employee-data-table" : "data-table",
      style: props.style
    }, Object.keys(props.dataObject).map(function (name, index) {
      if (++index === Object.keys(props.dataObject).length) {
        return /*#__PURE__*/React__default.createElement(LastRow, {
          key: index,
          label: name,
          text: props.dataObject[name]
        });
      }
      return /*#__PURE__*/React__default.createElement(Row, {
        key: index,
        label: name,
        text: props.dataObject[name]
      });
    }));
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: employee ? "employee-data-table " + (props !== null && props !== void 0 && props.customClass ? props === null || props === void 0 ? void 0 : props.customClass : "") : "data-table",
      style: props.style
    }, props.children);
  }
};

var SubmitBar = React.forwardRef(function (props, ref) {
  return /*#__PURE__*/React__default.createElement("button", _extends({
    ref: ref,
    disabled: props.disabled ? true : false,
    className: (props.disabled ? "submit-bar-disabled" : "submit-bar") + " " + (props.className ? props.className : ""),
    type: props.submit ? "submit" : "button",
    style: _extends({}, props.style),
    onClick: props.onSubmit
  }, props.form ? {
    form: props.form
  } : {}), /*#__PURE__*/React__default.createElement("header", null, props.label));
});
SubmitBar.propTypes = {
  submit: propTypes.any,
  style: propTypes.object,
  label: propTypes.string,
  onSubmit: propTypes.func
};
SubmitBar.defaultProps = {};

var StandaloneSearchBar = function StandaloneSearchBar(_ref) {
  var placeholder = _ref.placeholder;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "StandaloneSearchBar"
  }, /*#__PURE__*/React__default.createElement(SearchIconSvg, null), /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    placeholder: placeholder
  }));
};

var ULBHomeCard = function ULBHomeCard(props) {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var state = Digit.ULBService.getStateId();
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = Digit.ULBService.getStateId();
  var history = reactRouterDom.useHistory();
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Card, {
    className: "fsm",
    style: {
      backgroundColor: "transparent",
      boxShadow: "none",
      paddingTop: "0"
    }
  }, /*#__PURE__*/React__default.createElement(CardHeader, null, " ", t(props.title), " "), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "33.3% 33.3% 33.3%",
      textAlign: "-webkit-center"
    }
  }, props.module.map(function (i) {
    return /*#__PURE__*/React__default.createElement(Card, {
      style: {
        minWidth: "100px",
        cursor: "pointer"
      },
      onClick: function onClick() {
        return i.link ? history.push(i.link) : location.assign(i.locate);
      },
      children: /*#__PURE__*/React__default.createElement(React.Fragment, null, " ", i.icon, " ", /*#__PURE__*/React__default.createElement("p", null, " ", t(i.name), " "), " ")
    });
  }))));
};

var _excluded$6 = ["cardState", "t", "createScreen"];
var ViewDetailsCard = function ViewDetailsCard(_ref) {
  var cardState = _ref.cardState,
    t = _ref.t,
    createScreen = _ref.createScreen,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$6);
  return /*#__PURE__*/React__default.createElement(Card, {
    className: createScreen ? "" : "employeeCard-override"
  }, /*#__PURE__*/React__default.createElement(StatusTable, {
    style: {
      maxWidth: "950px",
      minWidth: "280px"
    }
  }, cardState.map(function (item, index) {
    var _item$values;
    return /*#__PURE__*/React__default.createElement("div", {
      style: {
        marginBottom: "" + (index !== (cardState === null || cardState === void 0 ? void 0 : cardState.length) - 1 ? "24px" : "")
      }
    }, item !== null && item !== void 0 && item.title ? /*#__PURE__*/React__default.createElement(CardSectionHeader, {
      key: index,
      style: {
        marginBottom: "16px",
        fontSize: "24px"
      }
    }, t(item === null || item === void 0 ? void 0 : item.title)) : '', item === null || item === void 0 ? void 0 : (_item$values = item.values) === null || _item$values === void 0 ? void 0 : _item$values.map(function (item, index) {
      return /*#__PURE__*/React__default.createElement(Row, {
        className: "border-none",
        label: "" + t(item === null || item === void 0 ? void 0 : item.title),
        text: item === null || item === void 0 ? void 0 : item.value,
        textStyle: {
          whiteSpace: "pre"
        }
      });
    }));
  })));
};

var _excluded$7 = ["indeterminate"];
var noop = function noop() {};
var IndeterminateCheckbox = React.forwardRef(function (_ref, ref) {
  var indeterminate = _ref.indeterminate,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$7);
  var defaultRef = React.useRef();
  var resolvedRef = ref || defaultRef;
  React.useEffect(function () {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(CheckBox, _extends({
    inputRef: resolvedRef
  }, rest)));
});
var Table = function Table(_ref2) {
  var _Object$keys2, _Object$keys3;
  var _ref2$className = _ref2.className,
    className = _ref2$className === void 0 ? "table" : _ref2$className,
    t = _ref2.t,
    data = _ref2.data,
    columns = _ref2.columns,
    getCellProps = _ref2.getCellProps,
    _ref2$currentPage = _ref2.currentPage,
    currentPage = _ref2$currentPage === void 0 ? 0 : _ref2$currentPage,
    _ref2$pageSizeLimit = _ref2.pageSizeLimit,
    pageSizeLimit = _ref2$pageSizeLimit === void 0 ? 10 : _ref2$pageSizeLimit,
    _ref2$disableSort = _ref2.disableSort,
    disableSort = _ref2$disableSort === void 0 ? true : _ref2$disableSort,
    _ref2$autoSort = _ref2.autoSort,
    autoSort = _ref2$autoSort === void 0 ? false : _ref2$autoSort,
    _ref2$initSortId = _ref2.initSortId,
    initSortId = _ref2$initSortId === void 0 ? "" : _ref2$initSortId,
    _ref2$onSearch = _ref2.onSearch,
    onSearch = _ref2$onSearch === void 0 ? false : _ref2$onSearch,
    _ref2$manualPaginatio = _ref2.manualPagination,
    manualPagination = _ref2$manualPaginatio === void 0 ? true : _ref2$manualPaginatio,
    totalRecords = _ref2.totalRecords,
    onNextPage = _ref2.onNextPage,
    onPrevPage = _ref2.onPrevPage,
    globalSearch = _ref2.globalSearch,
    _ref2$onSort = _ref2.onSort,
    onSort = _ref2$onSort === void 0 ? noop : _ref2$onSort,
    onPageSizeChange = _ref2.onPageSizeChange,
    onLastPage = _ref2.onLastPage,
    onFirstPage = _ref2.onFirstPage,
    _ref2$isPaginationReq = _ref2.isPaginationRequired,
    isPaginationRequired = _ref2$isPaginationReq === void 0 ? true : _ref2$isPaginationReq,
    _ref2$sortParams = _ref2.sortParams,
    sortParams = _ref2$sortParams === void 0 ? [] : _ref2$sortParams,
    _ref2$showAutoSerialN = _ref2.showAutoSerialNo,
    showAutoSerialNo = _ref2$showAutoSerialN === void 0 ? false : _ref2$showAutoSerialN,
    _ref2$customTableWrap = _ref2.customTableWrapperClassName,
    customTableWrapperClassName = _ref2$customTableWrap === void 0 ? "" : _ref2$customTableWrap,
    _ref2$styles = _ref2.styles,
    styles = _ref2$styles === void 0 ? {} : _ref2$styles,
    tableTopComponent = _ref2.tableTopComponent,
    tableRef = _ref2.tableRef,
    _ref2$showCheckBox = _ref2.showCheckBox,
    showCheckBox = _ref2$showCheckBox === void 0 ? false : _ref2$showCheckBox,
    _ref2$actionLabel = _ref2.actionLabel,
    actionLabel = _ref2$actionLabel === void 0 ? 'CS_COMMON_DOWNLOAD' : _ref2$actionLabel,
    _ref2$tableSelectionH = _ref2.tableSelectionHandler,
    tableSelectionHandler = _ref2$tableSelectionH === void 0 ? function () {} : _ref2$tableSelectionH;
  var _useTable = reactTable.useTable({
      columns: columns,
      data: data,
      initialState: {
        pageIndex: currentPage,
        pageSize: pageSizeLimit,
        sortBy: autoSort ? [{
          id: initSortId,
          desc: false
        }] : sortParams
      },
      pageCount: totalRecords > 0 ? Math.ceil(totalRecords / pageSizeLimit) : -1,
      manualPagination: manualPagination,
      disableMultiSort: false,
      disableSortBy: disableSort,
      manualSortBy: autoSort ? false : true,
      autoResetPage: false,
      autoResetSortBy: false,
      disableSortRemove: true,
      disableGlobalFilter: onSearch === false ? true : false,
      globalFilter: globalSearch || "text",
      useControlledState: function useControlledState(state) {
        return React__default.useMemo(function () {
          return _extends({}, state, {
            pageIndex: manualPagination ? currentPage : state.pageIndex
          });
        });
      }
    }, reactTable.useGlobalFilter, reactTable.useSortBy, reactTable.usePagination, reactTable.useRowSelect, function (hooks) {
      if (showCheckBox) {
        hooks.visibleColumns.push(function (columns) {
          return [{
            id: 'selection',
            Header: function Header(_ref3) {
              var getToggleAllPageRowsSelectedProps = _ref3.getToggleAllPageRowsSelectedProps;
              return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(IndeterminateCheckbox, getToggleAllPageRowsSelectedProps()));
            },
            Cell: function Cell(_ref4) {
              var row = _ref4.row;
              return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(IndeterminateCheckbox, row.getToggleRowSelectedProps()));
            }
          }].concat(columns);
        });
      }
    }),
    getTableProps = _useTable.getTableProps,
    getTableBodyProps = _useTable.getTableBodyProps,
    headerGroups = _useTable.headerGroups,
    rows = _useTable.rows,
    prepareRow = _useTable.prepareRow,
    page = _useTable.page,
    canPreviousPage = _useTable.canPreviousPage,
    canNextPage = _useTable.canNextPage,
    pageCount = _useTable.pageCount,
    gotoPage = _useTable.gotoPage,
    nextPage = _useTable.nextPage,
    previousPage = _useTable.previousPage,
    setPageSize = _useTable.setPageSize,
    setGlobalFilter = _useTable.setGlobalFilter,
    _useTable$state = _useTable.state,
    pageIndex = _useTable$state.pageIndex,
    pageSize = _useTable$state.pageSize,
    sortBy = _useTable$state.sortBy,
    selectedRowIds = _useTable$state.selectedRowIds;
  var _useState = React.useState({
      show: false,
      label: "",
      error: false
    }),
    toast = _useState[0],
    setToast = _useState[1];
  React.useEffect(function () {
    onSort(sortBy);
  }, [onSort, sortBy]);
  React.useEffect(function () {
    return setGlobalFilter(onSearch);
  }, [onSearch, setGlobalFilter, data]);
  var handleSelection = function handleSelection() {
    try {
      var selectedRows = rows === null || rows === void 0 ? void 0 : rows.filter(function (ele) {
        var _Object$keys;
        return (_Object$keys = Object.keys(selectedRowIds)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.includes(ele === null || ele === void 0 ? void 0 : ele.id);
      });
      return Promise.resolve(tableSelectionHandler(selectedRows, t)).then(function (response) {
        setToast({
          show: true,
          label: t(response === null || response === void 0 ? void 0 : response.label),
          error: !(response !== null && response !== void 0 && response.isSuccess)
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var handleToastClose = function handleToastClose() {
    setToast({
      show: false,
      label: "",
      error: false
    });
  };
  React.useEffect(function () {
    if (toast !== null && toast !== void 0 && toast.show) {
      setTimeout(function () {
        handleToastClose();
      }, 3000);
    }
  }, [toast === null || toast === void 0 ? void 0 : toast.show]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("span", {
    className: customTableWrapperClassName
  }, tableTopComponent ? tableTopComponent : null, /*#__PURE__*/React__default.createElement("table", _extends({
    className: className
  }, getTableProps(), {
    style: styles,
    ref: tableRef
  }), /*#__PURE__*/React__default.createElement("thead", null, headerGroups.map(function (headerGroup) {
    return /*#__PURE__*/React__default.createElement("tr", headerGroup.getHeaderGroupProps(), showAutoSerialNo && /*#__PURE__*/React__default.createElement("th", {
      style: {
        verticalAlign: "top"
      }
    }, showAutoSerialNo && typeof showAutoSerialNo == "string" ? t(showAutoSerialNo) : t("TB_SNO")), headerGroup.headers.map(function (column) {
      return /*#__PURE__*/React__default.createElement("th", _extends({}, column.getHeaderProps(column.getSortByToggleProps()), {
        style: (column === null || column === void 0 ? void 0 : column.id) === 'selection' ? {
          minWidth: '100px'
        } : {
          verticalAlign: "top",
          textAlign: "" + (column !== null && column !== void 0 && column.headerAlign ? column === null || column === void 0 ? void 0 : column.headerAlign : "left")
        }
      }), column.render("Header"), /*#__PURE__*/React__default.createElement("span", null, column.isSorted ? column.isSortedDesc ? /*#__PURE__*/React__default.createElement(SortDown, null) : /*#__PURE__*/React__default.createElement(SortUp, null) : ""));
    }));
  })), /*#__PURE__*/React__default.createElement("tbody", getTableBodyProps(), page.map(function (row, i) {
    prepareRow(row);
    return /*#__PURE__*/React__default.createElement("tr", row.getRowProps(), showAutoSerialNo && /*#__PURE__*/React__default.createElement("td", null, i + 1), row.cells.map(function (cell) {
      return /*#__PURE__*/React__default.createElement("td", cell.getCellProps([getCellProps(cell)]), cell.attachment_link ? /*#__PURE__*/React__default.createElement("a", {
        style: {
          color: "#1D70B8"
        },
        href: cell.attachment_link
      }, cell.render("Cell")) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null, " ", cell.render("Cell"), " "));
    }));
  })))), isPaginationRequired && /*#__PURE__*/React__default.createElement("div", {
    className: "pagination dss-white-pre"
  }, t("CS_COMMON_ROWS_PER_PAGE") + " :", /*#__PURE__*/React__default.createElement("select", {
    className: "cp",
    value: manualPagination ? pageSizeLimit : pageSize,
    style: {
      marginRight: "15px"
    },
    onChange: manualPagination ? onPageSizeChange : function (e) {
      return setPageSize(Number(e.target.value));
    }
  }, [10, 20, 30, 40, 50].map(function (pageSize) {
    return /*#__PURE__*/React__default.createElement("option", {
      key: pageSize,
      value: pageSize
    }, pageSize);
  })), /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("span", null, pageIndex * pageSize + 1, "-", manualPagination ? (currentPage + 1) * pageSizeLimit > totalRecords ? totalRecords : (currentPage + 1) * pageSizeLimit : pageIndex * pageSize + (page === null || page === void 0 ? void 0 : page.length), " ", totalRecords ? "of " + (manualPagination ? totalRecords : rows.length) : ""), " "), !manualPagination && pageIndex != 0 && /*#__PURE__*/React__default.createElement(ArrowToFirst, {
    onClick: function onClick() {
      return gotoPage(0);
    },
    className: "cp"
  }), canPreviousPage && manualPagination && onFirstPage && /*#__PURE__*/React__default.createElement(ArrowToFirst, {
    onClick: function onClick() {
      return manualPagination && onFirstPage();
    },
    className: "cp"
  }), canPreviousPage && /*#__PURE__*/React__default.createElement(ArrowBack, {
    onClick: function onClick() {
      return manualPagination ? onPrevPage() : previousPage();
    },
    className: "cp"
  }), canNextPage && /*#__PURE__*/React__default.createElement(ArrowForward, {
    onClick: function onClick() {
      return manualPagination ? onNextPage() : nextPage();
    },
    className: "cp"
  }), !manualPagination && pageIndex != pageCount - 1 && /*#__PURE__*/React__default.createElement(ArrowToLast, {
    onClick: function onClick() {
      return gotoPage(pageCount - 1);
    },
    className: "cp"
  }), rows.length == pageSizeLimit && canNextPage && manualPagination && onLastPage && /*#__PURE__*/React__default.createElement(ArrowToLast, {
    onClick: function onClick() {
      return manualPagination && onLastPage();
    },
    className: "cp"
  })), ((_Object$keys2 = Object.keys(selectedRowIds)) === null || _Object$keys2 === void 0 ? void 0 : _Object$keys2.length) > 0 && /*#__PURE__*/React__default.createElement(ActionBar, {
    className: "actionBarWrapper"
  }, /*#__PURE__*/React__default.createElement("span", {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(DoubleTickIcon, {
    style: {
      marginRight: "8px"
    }
  }), /*#__PURE__*/React__default.createElement("p", {
    className: "search-instruction-header",
    style: {
      marginBottom: 0
    }
  }, ((_Object$keys3 = Object.keys(selectedRowIds)) === null || _Object$keys3 === void 0 ? void 0 : _Object$keys3.length) + " " + t("COMMON_SELECTED"))), /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(actionLabel),
    onSubmit: handleSelection
  })), (toast === null || toast === void 0 ? void 0 : toast.show) && /*#__PURE__*/React__default.createElement(Toast$1, {
    label: toast === null || toast === void 0 ? void 0 : toast.label,
    error: toast === null || toast === void 0 ? void 0 : toast.error,
    isDleteBtn: true,
    onClose: handleToastClose
  }));
};

var TelePhone = function TelePhone(_ref) {
  var mobile = _ref.mobile,
    text = _ref.text;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, text, /*#__PURE__*/React__default.createElement("div", {
    className: "telephone"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "call"
  }, /*#__PURE__*/React__default.createElement(Phone, {
    fillcolor: "FFFFFF",
    style: {
      marginLeft: "0px"
    }
  }), /*#__PURE__*/React__default.createElement("a", {
    href: "tel:" + mobile
  }, "+91", " ", mobile))));
};
TelePhone.propTypes = {
  mobile: propTypes.any,
  text: propTypes.string
};
TelePhone.defaultProps = {
  mobile: "",
  text: ""
};

var TextArea = function TextArea(props) {
  var _props$validation;
  var user_type = Digit.SessionStorage.get("userType");
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("textarea", {
    placeholder: props.placeholder,
    name: props.name,
    ref: props.inputRef,
    style: props.style,
    id: props.id,
    value: props.value,
    onChange: props.onChange,
    className: (user_type !== "citizen" ? "employee-card-textarea" : "card-textarea") + " " + (props.disable && "disabled") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    minLength: props.minlength,
    maxLength: props.maxlength,
    autoComplete: "off",
    disabled: props.disabled,
    pattern: props !== null && props !== void 0 && props.validation && props.ValidationRequired ? props === null || props === void 0 ? void 0 : (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.pattern : props.pattern
  }), /*#__PURE__*/React__default.createElement("p", {
    className: "cell-text"
  }, props.hintText));
};
TextArea.propTypes = {
  userType: propTypes.string,
  name: propTypes.string.isRequired,
  ref: propTypes.func,
  value: propTypes.string,
  onChange: propTypes.func,
  id: propTypes.string
};
TextArea.defaultProps = {
  ref: undefined,
  onChange: undefined
};

var TextInput = function TextInput(props) {
  var _props$validation, _props$validation2, _props$validation3, _props$validation4, _props$validation5, _props$validation6, _props$validation7;
  var user_type = Digit.SessionStorage.get("userType");
  var _useState = React.useState((props === null || props === void 0 ? void 0 : props.type) === "date" && (props === null || props === void 0 ? void 0 : props.value)),
    setDate = _useState[1];
  var data = props !== null && props !== void 0 && props.watch ? {
    fromDate: props === null || props === void 0 ? void 0 : props.watch("fromDate"),
    toDate: props === null || props === void 0 ? void 0 : props.watch("toDate")
  } : {};
  var handleDate = function handleDate(event) {
    var value = event.target.value;
    setDate(getDDMMYYYY(value));
  };
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "text-input " + (user_type === "employee" ? "" : "text-input-width") + " " + props.className,
    style: props !== null && props !== void 0 && props.textInputStyle ? _extends({}, props.textInputStyle) : {}
  }, props.isMandatory ? /*#__PURE__*/React__default.createElement("input", {
    type: props !== null && props !== void 0 && props.validation && props.ValidationRequired ? props === null || props === void 0 ? void 0 : (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.type : props.type || "text",
    name: props.name,
    id: props.id,
    className: (user_type ? "employee-card-input-error" : "card-input-error") + " " + (props.disable && "disabled") + " " + props.customClass,
    placeholder: props.placeholder,
    onChange: function onChange(event) {
      if ((props === null || props === void 0 ? void 0 : props.type) === "number" && props !== null && props !== void 0 && props.maxlength) {
        if (event.target.value.length > (props === null || props === void 0 ? void 0 : props.maxlength)) {
          event.target.value = event.target.value.slice(0, -1);
        }
      }
      if (props !== null && props !== void 0 && props.onChange) {
        props === null || props === void 0 ? void 0 : props.onChange(event);
      }
      if (props.type === "date") {
        handleDate(event);
      }
    },
    ref: props.inputRef,
    value: props.value,
    style: _extends({}, props.style),
    defaultValue: props.defaultValue,
    minLength: props.minlength,
    maxLength: props.maxlength,
    max: props.max,
    pattern: props !== null && props !== void 0 && props.validation && props.ValidationRequired ? props === null || props === void 0 ? void 0 : (_props$validation2 = props.validation) === null || _props$validation2 === void 0 ? void 0 : _props$validation2.pattern : props.pattern,
    min: props.min,
    readOnly: props.disable,
    title: props !== null && props !== void 0 && props.validation && props.ValidationRequired ? props === null || props === void 0 ? void 0 : (_props$validation3 = props.validation) === null || _props$validation3 === void 0 ? void 0 : _props$validation3.title : props.title,
    step: props.step,
    autoFocus: props.autoFocus,
    onBlur: props.onBlur,
    autoComplete: "off",
    disabled: props.disabled
  }) : /*#__PURE__*/React__default.createElement("input", {
    type: props !== null && props !== void 0 && props.validation && props.ValidationRequired ? props === null || props === void 0 ? void 0 : (_props$validation4 = props.validation) === null || _props$validation4 === void 0 ? void 0 : _props$validation4.type : props.type || "text",
    name: props.name,
    id: props.id,
    className: (user_type ? "employee-card-input" : "citizen-card-input") + " " + (props.disable && "disabled") + " focus-visible " + (props.errorStyle && "employee-card-input-error") + " " + props.customClass,
    placeholder: props.placeholder,
    onChange: function onChange(event) {
      if ((props === null || props === void 0 ? void 0 : props.type) === "number" && props !== null && props !== void 0 && props.maxlength) {
        if (event.target.value.length > (props === null || props === void 0 ? void 0 : props.maxlength)) {
          event.target.value = event.target.value.slice(0, -1);
        }
      }
      if (props !== null && props !== void 0 && props.onChange) {
        props === null || props === void 0 ? void 0 : props.onChange(event);
      }
      if (props.type === "date") {
        handleDate(event);
      }
    },
    ref: props.inputRef,
    value: props.value,
    style: _extends({}, props.style),
    defaultValue: props.defaultValue,
    minLength: props.minlength,
    maxLength: props.maxlength,
    max: props.max,
    required: props !== null && props !== void 0 && props.validation && props.ValidationRequired ? props === null || props === void 0 ? void 0 : (_props$validation5 = props.validation) === null || _props$validation5 === void 0 ? void 0 : _props$validation5.isRequired : props.isRequired || props.type === "date" && (props.name === "fromDate" ? data.toDate : data.fromDate),
    pattern: props !== null && props !== void 0 && props.validation && props.ValidationRequired ? props === null || props === void 0 ? void 0 : (_props$validation6 = props.validation) === null || _props$validation6 === void 0 ? void 0 : _props$validation6.pattern : props.pattern,
    min: props.min,
    readOnly: props.disable,
    title: props !== null && props !== void 0 && props.validation && props.ValidationRequired ? props === null || props === void 0 ? void 0 : (_props$validation7 = props.validation) === null || _props$validation7 === void 0 ? void 0 : _props$validation7.title : props.title,
    step: props.step,
    autoFocus: props.autoFocus,
    onBlur: props.onBlur,
    onKeyPress: props.onKeyPress,
    autoComplete: "off",
    disabled: props.disabled
  }), props.signature ? props.signatureImg : null, props.customIcon ? props.customIcon === "geolocation" ? /*#__PURE__*/React__default.createElement("span", {
    className: "cursor-pointer",
    onClick: props === null || props === void 0 ? void 0 : props.onIconSelection
  }, /*#__PURE__*/React__default.createElement(LocateIcon, {
    className: "text-input-customIcon"
  })) : null : null));
};
TextInput.propTypes = {
  userType: propTypes.string,
  isMandatory: propTypes.bool,
  name: propTypes.string,
  placeholder: propTypes.string,
  onChange: propTypes.func,
  ref: propTypes.func,
  value: propTypes.any
};
TextInput.defaultProps = {
  isMandatory: false
};
function getDDMMYYYY(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-In").split(",")[0];
}

var cleanValue = function cleanValue(_ref) {
  var value = _ref.value,
    _ref$groupSeparator = _ref.groupSeparator,
    groupSeparator = _ref$groupSeparator === void 0 ? "," : _ref$groupSeparator,
    _ref$decimalSeparator = _ref.decimalSeparator,
    decimalSeparator = _ref$decimalSeparator === void 0 ? "." : _ref$decimalSeparator,
    _ref$allowDecimals = _ref.allowDecimals,
    allowDecimals = _ref$allowDecimals === void 0 ? true : _ref$allowDecimals,
    _ref$decimalsLimit = _ref.decimalsLimit,
    decimalsLimit = _ref$decimalsLimit === void 0 ? 2 : _ref$decimalsLimit,
    _ref$allowNegativeVal = _ref.allowNegativeValue,
    allowNegativeValue = _ref$allowNegativeVal === void 0 ? true : _ref$allowNegativeVal,
    _ref$disableAbbreviat = _ref.disableAbbreviations,
    disableAbbreviations = _ref$disableAbbreviat === void 0 ? false : _ref$disableAbbreviat,
    _ref$prefix = _ref.prefix,
    prefix = _ref$prefix === void 0 ? "" : _ref$prefix,
    _ref$transformRawValu = _ref.transformRawValue,
    transformRawValue = _ref$transformRawValu === void 0 ? function (rawValue) {
      return rawValue;
    } : _ref$transformRawValu;
  var transformedValue = transformRawValue(value);
  if (transformedValue === "-") {
    return transformedValue;
  }
  var abbreviations = disableAbbreviations ? [] : ["k", "m", "b"];
  var reg = new RegExp("((^|\\D)-\\d)|(-" + escapeRegExp(prefix) + ")");
  var isNegative = reg.test(transformedValue);
  var _ref2 = RegExp("(\\d+)-?" + escapeRegExp(prefix)).exec(value) || [],
    prefixWithValue = _ref2[0],
    preValue = _ref2[1];
  var withoutPrefix = prefix ? prefixWithValue ? transformedValue.replace(prefixWithValue, "").concat(preValue) : transformedValue.replace(prefix, "") : transformedValue;
  var withoutSeparators = removeSeparators(withoutPrefix, groupSeparator);
  var withoutInvalidChars = removeInvalidChars(withoutSeparators, [groupSeparator, decimalSeparator].concat(abbreviations));
  var valueOnly = withoutInvalidChars;
  if (!disableAbbreviations) {
    if (abbreviations.some(function (letter) {
      return letter === withoutInvalidChars.toLowerCase();
    })) {
      return "";
    }
    var parsed = parseAbbrValue(withoutInvalidChars, decimalSeparator);
    if (parsed) {
      valueOnly = String(parsed);
    }
  }
  var includeNegative = isNegative && allowNegativeValue ? "-" : "";
  if (decimalSeparator && valueOnly.includes(decimalSeparator)) {
    var _withoutInvalidChars$ = withoutInvalidChars.split(decimalSeparator),
      int = _withoutInvalidChars$[0],
      decimals = _withoutInvalidChars$[1];
    var trimmedDecimals = decimalsLimit && decimals ? decimals.slice(0, decimalsLimit) : decimals;
    var includeDecimals = allowDecimals ? "" + decimalSeparator + trimmedDecimals : "";
    return "" + includeNegative + int + includeDecimals;
  }
  return "" + includeNegative + valueOnly;
};
var escapeRegExp = function escapeRegExp(stringToGoIntoTheRegex) {
  return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};
var fixedDecimalValue = function fixedDecimalValue(value, decimalSeparator, fixedDecimalLength) {
  if (fixedDecimalLength && value.length > 1) {
    if (value.includes(decimalSeparator)) {
      var _value$split = value.split(decimalSeparator),
        int = _value$split[0],
        decimals = _value$split[1];
      if (decimals.length > fixedDecimalLength) {
        return "" + int + decimalSeparator + decimals.slice(0, fixedDecimalLength);
      }
    }
    var reg = value.length > fixedDecimalLength ? new RegExp("(\\d+)(\\d{" + fixedDecimalLength + "})") : new RegExp("(\\d)(\\d+)");
    var match = value.match(reg);
    if (match) {
      var _int = match[1],
        _decimals = match[2];
      return "" + _int + decimalSeparator + _decimals;
    }
  }
  return value;
};
var formatValue = function formatValue(options) {
  var _value = options.value,
    decimalSeparator = options.decimalSeparator,
    intlConfig = options.intlConfig,
    decimalScale = options.decimalScale,
    _options$prefix = options.prefix,
    prefix = _options$prefix === void 0 ? "" : _options$prefix,
    _options$suffix = options.suffix,
    suffix = _options$suffix === void 0 ? "" : _options$suffix;
  if (_value === "" || _value === undefined) {
    return "";
  }
  if (_value === "-") {
    return "-";
  }
  var isNegative = new RegExp("^\\d?-" + (prefix ? escapeRegExp(prefix) + "?" : "") + "\\d").test(_value);
  var value = decimalSeparator !== "." ? replaceDecimalSeparator(_value, decimalSeparator, isNegative) : _value;
  var defaultNumberFormatOptions = {
    minimumFractionDigits: decimalScale || 0,
    maximumFractionDigits: 20
  };
  var numberFormatter = intlConfig ? new Intl.NumberFormat(intlConfig.locale, intlConfig.currency ? _extends({}, defaultNumberFormatOptions, {
    style: "currency",
    currency: intlConfig.currency
  }) : defaultNumberFormatOptions) : new Intl.NumberFormat(undefined, defaultNumberFormatOptions);
  var parts = numberFormatter.formatToParts(Number(value));
  var formatted = replaceParts(parts, options);
  var intlSuffix = getSuffix(formatted, _extends({}, options));
  var includeDecimalSeparator = _value.slice(-1) === decimalSeparator ? decimalSeparator : "";
  var _ref3 = value.match(RegExp("\\d+\\.(\\d+)")) || [],
    decimals = _ref3[1];
  if (decimalScale === undefined && decimals && decimalSeparator) {
    if (formatted.includes(decimalSeparator)) {
      formatted = formatted.replace(RegExp("(\\d+)(" + escapeRegExp(decimalSeparator) + ")(\\d+)", "g"), "$1$2" + decimals);
    } else {
      if (intlSuffix && !suffix) {
        formatted = formatted.replace(intlSuffix, "" + decimalSeparator + decimals + intlSuffix);
      } else {
        formatted = "" + formatted + decimalSeparator + decimals;
      }
    }
  }
  if (suffix && includeDecimalSeparator) {
    return "" + formatted + includeDecimalSeparator + suffix;
  }
  if (intlSuffix && includeDecimalSeparator) {
    return formatted.replace(intlSuffix, "" + includeDecimalSeparator + intlSuffix);
  }
  if (intlSuffix && suffix) {
    return formatted.replace(intlSuffix, "" + includeDecimalSeparator + suffix);
  }
  return [formatted, includeDecimalSeparator, suffix].join("");
};
var replaceDecimalSeparator = function replaceDecimalSeparator(value, decimalSeparator, isNegative) {
  var newValue = value;
  if (decimalSeparator && decimalSeparator !== ".") {
    newValue = newValue.replace(RegExp(escapeRegExp(decimalSeparator), "g"), ".");
    if (isNegative && decimalSeparator === "-") {
      newValue = "-" + newValue.slice(1);
    }
  }
  return newValue;
};
var replaceParts = function replaceParts(parts, _ref4) {
  var prefix = _ref4.prefix,
    groupSeparator = _ref4.groupSeparator,
    decimalSeparator = _ref4.decimalSeparator,
    decimalScale = _ref4.decimalScale,
    _ref4$disableGroupSep = _ref4.disableGroupSeparators,
    disableGroupSeparators = _ref4$disableGroupSep === void 0 ? false : _ref4$disableGroupSep;
  return parts.reduce(function (prev, _ref5, i) {
    var type = _ref5.type,
      value = _ref5.value;
    if (i === 0 && prefix) {
      if (type === "minusSign") {
        return [value, prefix];
      }
      if (type === "currency") {
        return [].concat(prev, [prefix]);
      }
      return [prefix, value];
    }
    if (type === "currency") {
      return prefix ? prev : [].concat(prev, [value]);
    }
    if (type === "group") {
      return !disableGroupSeparators ? [].concat(prev, [groupSeparator !== undefined ? groupSeparator : value]) : prev;
    }
    if (type === "decimal") {
      if (decimalScale !== undefined && decimalScale === 0) {
        return prev;
      }
      return [].concat(prev, [decimalSeparator !== undefined ? decimalSeparator : value]);
    }
    if (type === "fraction") {
      return [].concat(prev, [decimalScale !== undefined ? value.slice(0, decimalScale) : value]);
    }
    return [].concat(prev, [value]);
  }, [""]).join("");
};
var defaultConfig = {
  currencySymbol: "",
  groupSeparator: "",
  decimalSeparator: "",
  prefix: "",
  suffix: ""
};
var getLocaleConfig = function getLocaleConfig(intlConfig) {
  var _ref6 = intlConfig || {},
    locale = _ref6.locale,
    currency = _ref6.currency;
  var numberFormatter = locale ? new Intl.NumberFormat(locale, currency ? {
    currency: currency,
    style: "currency"
  } : undefined) : new Intl.NumberFormat();
  return numberFormatter.formatToParts(1000.1).reduce(function (prev, curr, i) {
    if (curr.type === "currency") {
      if (i === 0) {
        return _extends({}, prev, {
          currencySymbol: curr.value,
          prefix: curr.value
        });
      } else {
        return _extends({}, prev, {
          currencySymbol: curr.value,
          suffix: curr.value
        });
      }
    }
    if (curr.type === "group") {
      return _extends({}, prev, {
        groupSeparator: curr.value
      });
    }
    if (curr.type === "decimal") {
      return _extends({}, prev, {
        decimalSeparator: curr.value
      });
    }
    return prev;
  }, defaultConfig);
};
var getSuffix = function getSuffix(value, _ref7) {
  var _ref7$groupSeparator = _ref7.groupSeparator,
    groupSeparator = _ref7$groupSeparator === void 0 ? "," : _ref7$groupSeparator,
    _ref7$decimalSeparato = _ref7.decimalSeparator,
    decimalSeparator = _ref7$decimalSeparato === void 0 ? "." : _ref7$decimalSeparato;
  var suffixReg = new RegExp("\\d([^" + escapeRegExp(groupSeparator) + escapeRegExp(decimalSeparator) + "0-9]+)");
  var suffixMatch = value.match(suffixReg);
  return suffixMatch ? suffixMatch[1] : undefined;
};
var isNumber = function isNumber(input) {
  return RegExp(/\d/, "gi").test(input);
};
var padTrimValue = function padTrimValue(value, decimalSeparator, decimalScale) {
  if (decimalSeparator === void 0) {
    decimalSeparator = ".";
  }
  if (decimalScale === undefined || value === "" || value === undefined) {
    return value;
  }
  if (!value.match(/\d/g)) {
    return "";
  }
  var _value$split2 = value.split(decimalSeparator),
    int = _value$split2[0],
    decimals = _value$split2[1];
  if (decimalScale === 0) {
    return int;
  }
  var newValue = decimals || "";
  if (newValue.length < decimalScale) {
    while (newValue.length < decimalScale) {
      newValue += "0";
    }
  } else {
    newValue = newValue.slice(0, decimalScale);
  }
  return "" + int + decimalSeparator + newValue;
};
var abbrMap = {
  k: 1000,
  m: 1000000,
  b: 1000000000
};
var parseAbbrValue = function parseAbbrValue(value, decimalSeparator) {
  if (decimalSeparator === void 0) {
    decimalSeparator = ".";
  }
  var reg = new RegExp("(\\d+(" + escapeRegExp(decimalSeparator) + "\\d*)?)([kmb])$", "i");
  var match = value.match(reg);
  if (match) {
    var digits = match[1],
      abbr = match[3];
    var multiplier = abbrMap[abbr.toLowerCase()];
    return Number(digits.replace(decimalSeparator, ".")) * multiplier;
  }
  return undefined;
};
var removeInvalidChars = function removeInvalidChars(value, validChars) {
  var chars = escapeRegExp(validChars.join(""));
  var reg = new RegExp("[^\\d" + chars + "]", "gi");
  return value.replace(reg, "");
};
var removeSeparators = function removeSeparators(value, separator) {
  if (separator === void 0) {
    separator = ",";
  }
  var reg = new RegExp(escapeRegExp(separator), "g");
  return value.replace(reg, "");
};
var repositionCursor = function repositionCursor(_ref8) {
  var selectionStart = _ref8.selectionStart,
    value = _ref8.value,
    lastKeyStroke = _ref8.lastKeyStroke,
    stateValue = _ref8.stateValue,
    groupSeparator = _ref8.groupSeparator;
  var cursorPosition = selectionStart;
  var modifiedValue = value;
  if (stateValue && cursorPosition) {
    var splitValue = value.split("");
    if (lastKeyStroke === "Backspace" && stateValue[cursorPosition] === groupSeparator) {
      splitValue.splice(cursorPosition - 1, 1);
      cursorPosition -= 1;
    }
    if (lastKeyStroke === "Delete" && stateValue[cursorPosition] === groupSeparator) {
      splitValue.splice(cursorPosition, 1);
      cursorPosition += 1;
    }
    modifiedValue = splitValue.join("");
    return {
      modifiedValue: modifiedValue,
      cursorPosition: cursorPosition
    };
  }
  return {
    modifiedValue: modifiedValue,
    cursorPosition: selectionStart
  };
};
var getIntlConfig = function getIntlConfig(prefix) {
  if (prefix === void 0) {
    prefix = "";
  }
  var currencyMatch = Object.keys(CURRENCY_MAP).filter(function (e) {
    return prefix.includes(e);
  });
  if (currencyMatch && (currencyMatch === null || currencyMatch === void 0 ? void 0 : currencyMatch.length) > 0) {
    return CURRENCY_MAP[currencyMatch[0]];
  }
};
var CURRENCY_MAP = {
  "￥": {
    locale: "ja-JP",
    currency: "JPY"
  },
  "₹": {
    locale: "en-IN",
    currency: "INR"
  },
  "£": {
    locale: "en-GB",
    currency: "GBP"
  },
  "€": {
    locale: "de-DE",
    currency: "EUR"
  },
  $: {
    locale: "en-US",
    currency: "USD"
  }
};

var _excluded$8 = ["value", "prefix", "intlConfig", "onChange", "inputRef"],
  _excluded2 = ["allowDecimals", "allowNegativeValue", "id", "name", "className", "customInput", "decimalsLimit", "defaultValue", "disabled", "maxLength", "value", "onValueChange", "fixedDecimalLength", "placeholder", "decimalScale", "prefix", "suffix", "intlConfig", "step", "min", "max", "disableGroupSeparators", "disableAbbreviations", "decimalSeparator", "groupSeparator", "onChange", "onFocus", "onBlur", "onKeyDown", "onKeyUp", "transformRawValue", "otherProps", "inputRef"],
  _excluded3 = ["ref"];
var InputTextAmount = function InputTextAmount(_ref) {
  var value = _ref.value,
    _ref$prefix = _ref.prefix,
    prefix = _ref$prefix === void 0 ? "₹ " : _ref$prefix,
    _ref$intlConfig = _ref.intlConfig,
    intlConfig = _ref$intlConfig === void 0 ? getIntlConfig(prefix) : _ref$intlConfig,
    onChange = _ref.onChange,
    inputRef = _ref.inputRef,
    otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$8);
  return /*#__PURE__*/React__default.createElement(InputAmountWrapper, {
    ref: inputRef,
    defaultValue: value,
    intlConfig: intlConfig,
    onValueChange: onChange,
    otherProps: otherProps,
    prefix: prefix
  });
};
var CurrencyInput = React.forwardRef(function (_ref2, ref) {
  var _ref2$allowDecimals = _ref2.allowDecimals,
    allowDecimals = _ref2$allowDecimals === void 0 ? true : _ref2$allowDecimals,
    _ref2$allowNegativeVa = _ref2.allowNegativeValue,
    allowNegativeValue = _ref2$allowNegativeVa === void 0 ? true : _ref2$allowNegativeVa,
    id = _ref2.id,
    name = _ref2.name,
    className = _ref2.className,
    customInput = _ref2.customInput,
    decimalsLimit = _ref2.decimalsLimit,
    defaultValue = _ref2.defaultValue,
    _ref2$disabled = _ref2.disabled,
    disabled = _ref2$disabled === void 0 ? false : _ref2$disabled,
    userMaxLength = _ref2.maxLength,
    userValue = _ref2.value,
    onValueChange = _ref2.onValueChange,
    fixedDecimalLength = _ref2.fixedDecimalLength,
    placeholder = _ref2.placeholder,
    decimalScale = _ref2.decimalScale,
    prefix = _ref2.prefix,
    suffix = _ref2.suffix,
    intlConfig = _ref2.intlConfig,
    step = _ref2.step,
    min = _ref2.min,
    max = _ref2.max,
    _ref2$disableGroupSep = _ref2.disableGroupSeparators,
    disableGroupSeparators = _ref2$disableGroupSep === void 0 ? false : _ref2$disableGroupSep,
    _ref2$disableAbbrevia = _ref2.disableAbbreviations,
    disableAbbreviations = _ref2$disableAbbrevia === void 0 ? false : _ref2$disableAbbrevia,
    _decimalSeparator = _ref2.decimalSeparator,
    _groupSeparator = _ref2.groupSeparator,
    onChange = _ref2.onChange,
    onFocus = _ref2.onFocus,
    onBlur = _ref2.onBlur,
    onKeyDown = _ref2.onKeyDown,
    onKeyUp = _ref2.onKeyUp,
    transformRawValue = _ref2.transformRawValue,
    otherProps = _ref2.otherProps,
    inputRefFrom = _ref2.inputRef,
    props = _objectWithoutPropertiesLoose(_ref2, _excluded2);
  if (_decimalSeparator && isNumber(_decimalSeparator)) {
    throw new Error("decimalSeparator cannot be a number");
  }
  if (_groupSeparator && isNumber(_groupSeparator)) {
    throw new Error("groupSeparator cannot be a number");
  }
  var localeConfig = React.useMemo(function () {
    return getLocaleConfig(intlConfig);
  }, [intlConfig]);
  var decimalSeparator = _decimalSeparator || localeConfig.decimalSeparator || "";
  var groupSeparator = _groupSeparator || localeConfig.groupSeparator || "";
  if (decimalSeparator && groupSeparator && decimalSeparator === groupSeparator && disableGroupSeparators === false) {
    throw new Error("decimalSeparator cannot be the same as groupSeparator");
  }
  var formatValueOptions = {
    decimalSeparator: decimalSeparator,
    groupSeparator: groupSeparator,
    disableGroupSeparators: disableGroupSeparators,
    intlConfig: intlConfig,
    prefix: prefix || localeConfig.prefix,
    suffix: suffix
  };
  var cleanValueOptions = {
    decimalSeparator: decimalSeparator,
    groupSeparator: groupSeparator,
    allowDecimals: allowDecimals,
    decimalsLimit: decimalsLimit || fixedDecimalLength || 2,
    allowNegativeValue: allowNegativeValue,
    disableAbbreviations: disableAbbreviations,
    prefix: prefix || localeConfig.prefix,
    transformRawValue: transformRawValue
  };
  var formattedStateValue = defaultValue !== undefined && defaultValue !== null ? formatValue(_extends({}, formatValueOptions, {
    decimalScale: decimalScale,
    value: String(defaultValue)
  })) : userValue !== undefined && userValue !== null ? formatValue(_extends({}, formatValueOptions, {
    decimalScale: decimalScale,
    value: String(userValue)
  })) : "";
  var _useState = React.useState(formattedStateValue),
    stateValue = _useState[0],
    setStateValue = _useState[1];
  var _useState2 = React.useState(false),
    dirty = _useState2[0],
    setDirty = _useState2[1];
  var _useState3 = React.useState(0),
    cursor = _useState3[0],
    setCursor = _useState3[1];
  var _useState4 = React.useState(0),
    changeCount = _useState4[0],
    setChangeCount = _useState4[1];
  var _useState5 = React.useState(null),
    lastKeyStroke = _useState5[0],
    setLastKeyStroke = _useState5[1];
  var inputRef = React.useRef(inputRefFrom);
  React.useImperativeHandle(ref, function () {
    return inputRef.current;
  });
  var processChange = function processChange(value, selectionStart) {
    setDirty(true);
    var _repositionCursor = repositionCursor({
        selectionStart: selectionStart,
        value: value,
        lastKeyStroke: lastKeyStroke,
        stateValue: stateValue,
        groupSeparator: groupSeparator
      }),
      modifiedValue = _repositionCursor.modifiedValue,
      cursorPosition = _repositionCursor.cursorPosition;
    var stringValue = cleanValue(_extends({
      value: modifiedValue
    }, cleanValueOptions));
    if (userMaxLength && stringValue.replace(/-/g, "").length > userMaxLength) {
      return;
    }
    if (stringValue === "" || stringValue === "-" || stringValue === decimalSeparator) {
      onValueChange && onValueChange(undefined, name, {
        float: null,
        formatted: "",
        value: ""
      });
      setStateValue(stringValue);
      return;
    }
    var stringValueWithoutSeparator = decimalSeparator ? stringValue.replace(decimalSeparator, ".") : stringValue;
    var numberValue = parseFloat(stringValueWithoutSeparator);
    var formattedValue = formatValue(_extends({
      value: stringValue
    }, formatValueOptions));
    if (cursorPosition !== undefined && cursorPosition !== null) {
      var newCursor = cursorPosition + (formattedValue.length - value.length);
      newCursor = newCursor <= 0 ? prefix ? prefix.length : 0 : newCursor;
      setCursor(newCursor);
      setChangeCount(changeCount + 1);
    }
    setStateValue(formattedValue);
    if (onValueChange) {
      var values = {
        float: numberValue,
        formatted: formattedValue,
        value: stringValue
      };
      onValueChange(stringValue, name, values);
    }
  };
  var handleOnChange = function handleOnChange(event) {
    var _event$target = event.target,
      value = _event$target.value,
      selectionStart = _event$target.selectionStart;
    processChange(value, selectionStart);
    onChange && onChange(event);
  };
  var handleOnFocus = function handleOnFocus(event) {
    onFocus && onFocus(event);
    return stateValue ? stateValue.length : 0;
  };
  var handleOnBlur = function handleOnBlur(event) {
    var value = event.target.value;
    var valueOnly = cleanValue(_extends({
      value: value
    }, cleanValueOptions));
    if (valueOnly === "-" || !valueOnly) {
      setStateValue("");
      onBlur && onBlur(event);
      return;
    }
    var fixedDecimals = fixedDecimalValue(valueOnly, decimalSeparator, fixedDecimalLength);
    var newValue = padTrimValue(fixedDecimals, decimalSeparator, decimalScale !== undefined ? decimalScale : fixedDecimalLength);
    var numberValue = parseFloat(newValue.replace(decimalSeparator, "."));
    var formattedValue = formatValue(_extends({}, formatValueOptions, {
      value: newValue
    }));
    if (onValueChange) {
      onValueChange(newValue, name, {
        float: numberValue,
        formatted: formattedValue,
        value: newValue
      });
    }
    setStateValue(formattedValue);
    onBlur && onBlur(event);
  };
  var handleOnKeyDown = function handleOnKeyDown(event) {
    var key = event.key;
    setLastKeyStroke(key);
    if (step && (key === "ArrowUp" || key === "ArrowDown")) {
      event.preventDefault();
      setCursor(stateValue.length);
      var currentValue = parseFloat(userValue !== undefined && userValue !== null ? String(userValue).replace(decimalSeparator, ".") : cleanValue(_extends({
        value: stateValue
      }, cleanValueOptions))) || 0;
      var newValue = key === "ArrowUp" ? currentValue + step : currentValue - step;
      if (min !== undefined && newValue < min) {
        return;
      }
      if (max !== undefined && newValue > max) {
        return;
      }
      var fixedLength = String(step).includes(".") ? Number(String(step).split(".")[1].length) : undefined;
      processChange(String(fixedLength ? newValue.toFixed(fixedLength) : newValue).replace(".", decimalSeparator));
    }
    onKeyDown && onKeyDown(event);
  };
  var handleOnKeyUp = function handleOnKeyUp(event) {
    var key = event.key,
      selectionStart = event.currentTarget.selectionStart;
    if (key !== "ArrowUp" && key !== "ArrowDown" && stateValue !== "-") {
      var _suffix = getSuffix(stateValue, {
        groupSeparator: groupSeparator,
        decimalSeparator: decimalSeparator
      });
      if (_suffix && selectionStart && selectionStart > stateValue.length - _suffix.length) {
        if (inputRef.current) {
          var newCursor = stateValue.length - _suffix.length;
          inputRef.current.setSelectionRange(newCursor, newCursor);
        }
      }
    }
    onKeyUp && onKeyUp(event);
  };
  React.useEffect(function () {
    if (dirty && stateValue !== "-" && inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(cursor, cursor);
    }
  }, [stateValue, cursor, inputRef, dirty, changeCount]);
  var getRenderValue = function getRenderValue() {
    if (userValue !== undefined && userValue !== null && stateValue !== "-" && (!decimalSeparator || stateValue !== decimalSeparator)) {
      return formatValue(_extends({}, formatValueOptions, {
        decimalScale: dirty ? undefined : decimalScale,
        value: String(userValue)
      }));
    }
    return stateValue;
  };
  var inputProps = _extends({
    type: "text",
    inputMode: "decimal",
    id: id,
    name: name,
    className: className,
    onChange: handleOnChange,
    onBlur: handleOnBlur,
    onFocus: handleOnFocus,
    onKeyDown: handleOnKeyDown,
    onKeyUp: handleOnKeyUp,
    placeholder: placeholder,
    disabled: disabled,
    value: getRenderValue(),
    ref: inputRef
  }, props);
  if (customInput) {
    var CustomInput = customInput;
    return /*#__PURE__*/React__default.createElement(CustomInput, _extends({}, inputProps, otherProps));
  }
  return /*#__PURE__*/React__default.createElement("input", inputProps);
});
CurrencyInput.displayName = "CurrencyInput";
var InputAmountWrapper = function InputAmountWrapper(_ref3) {
  var ref = _ref3.ref,
    props = _objectWithoutPropertiesLoose(_ref3, _excluded3);
  var limit = 1000;
  var prefix = props === null || props === void 0 ? void 0 : props.prefix;
  var _useState6 = React.useState("");
  var _useState7 = React.useState(""),
    className = _useState7[0],
    setClassName = _useState7[1];
  var _useState8 = React.useState(props === null || props === void 0 ? void 0 : props.defaultValue),
    value = _useState8[0],
    setValue = _useState8[1];
  var _useState9 = React.useState(),
    setValues = _useState9[1];
  var _useState10 = React.useState(" "),
    setRawValue = _useState10[1];
  React.useEffect(function () {
    props.onValueChange(value);
  }, [value]);
  var handleOnValueChange = function handleOnValueChange(value, _, values) {
    setValues(values);
    setRawValue(value === undefined ? "undefined" : value || " ");
    if (!value) {
      setClassName("");
      setValue("");
      return;
    }
    if (Number.isNaN(Number(value))) {
      return;
    }
    if (Number(value) > limit) {
      setValue(value);
      return;
    }
    setValue(value);
  };
  return /*#__PURE__*/React__default.createElement(CurrencyInput, {
    id: "validationCustom01",
    name: "input-1",
    customInput: TextInput,
    className: "form-control " + className,
    value: props.defaultValue ? props.defaultValue : value ? value : "",
    onValueChange: handleOnValueChange,
    prefix: prefix,
    step: 1,
    otherProps: props === null || props === void 0 ? void 0 : props.otherProps,
    inputRef: ref
  });
};

var TopBar = function TopBar(_ref) {
  var img = _ref.img,
    isMobile = _ref.isMobile,
    toggleSidebar = _ref.toggleSidebar,
    notificationCount = _ref.notificationCount,
    notificationCountLoaded = _ref.notificationCountLoaded,
    cityOfCitizenShownBesideLogo = _ref.cityOfCitizenShownBesideLogo,
    onNotificationIconClick = _ref.onNotificationIconClick,
    hideNotificationIconOnSomeUrlsWhenNotLoggedIn = _ref.hideNotificationIconOnSomeUrlsWhenNotLoggedIn,
    changeLanguage = _ref.changeLanguage;
  var _useLocation = reactRouterDom.useLocation();
  return /*#__PURE__*/React__default.createElement("div", {
    className: "navbar"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "center-container back-wrapper"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "hambuger-back-wrapper"
  }, isMobile && /*#__PURE__*/React__default.createElement(Hamburger, {
    handleClick: toggleSidebar
  }), /*#__PURE__*/React__default.createElement("img", {
    className: "city",
    id: "topbar-logo",
    src: img || "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png",
    alt: "mSeva"
  }), /*#__PURE__*/React__default.createElement("h3", null, cityOfCitizenShownBesideLogo)), /*#__PURE__*/React__default.createElement("div", {
    className: "RightMostTopBarOptions"
  }, !hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? changeLanguage : null, !hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? /*#__PURE__*/React__default.createElement("div", {
    className: "EventNotificationWrapper",
    onClick: onNotificationIconClick
  }, notificationCountLoaded && notificationCount ? /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("p", null, notificationCount)) : null, /*#__PURE__*/React__default.createElement(NotificationBell, null)) : null)));
};
TopBar.propTypes = {
  img: propTypes.string
};
TopBar.defaultProps = {
  img: undefined
};

var getRandomId = function getRandomId() {
  return Math.floor((Math.random() || 1) * 139);
};
var getCitizenStyles = function getCitizenStyles(value) {
  var citizenStyles = {};
  if (value == "propertyCreate") {
    var _textStyles;
    citizenStyles = {
      textStyles: (_textStyles = {
        whiteSpace: "nowrap",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }, _textStyles["width"] = "80%", _textStyles),
      tagStyles: {
        width: "90%",
        flexWrap: "nowrap"
      },
      inputStyles: {
        width: "44%",
        minHeight: "2rem",
        maxHeight: "3rem",
        top: "20%"
      },
      buttonStyles: {
        height: "auto",
        minHeight: "2rem",
        width: "40%",
        maxHeight: "3rem"
      },
      tagContainerStyles: {
        width: "60%",
        display: "flex",
        marginTop: "0px"
      },
      closeIconStyles: {
        width: "20px"
      },
      containerStyles: {
        padding: "10px",
        marginTop: "0px"
      }
    };
  } else if (value == "IP") {
    citizenStyles = {
      textStyles: {
        whiteSpace: "nowrap",
        maxWidth: "250px",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      tagStyles: {
        marginLeft: "-30px"
      },
      inputStyles: {},
      closeIconStyles: {
        position: "absolute",
        marginTop: "-12px"
      },
      buttonStyles: {},
      tagContainerStyles: {}
    };
  } else if (value == "OBPS") {
    var _tagStyles;
    citizenStyles = {
      containerStyles: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
        margin: "0px",
        padding: "0px"
      },
      tagContainerStyles: {
        margin: "0px",
        padding: "0px"
      },
      tagStyles: (_tagStyles = {
        height: "auto",
        padding: "5px",
        margin: 0,
        width: "100%"
      }, _tagStyles["margin"] = "5px", _tagStyles),
      textStyles: {
        wordBreak: "break-all",
        height: "auto",
        lineHeight: "16px",
        overflow: "hidden",
        maxHeight: "34px",
        maxWidth: "100%"
      },
      inputStyles: {
        width: "42%",
        minHeight: "42px",
        maxHeight: "42px",
        top: "12px",
        left: "12px"
      },
      buttonStyles: {
        height: "auto",
        minHeight: "40px",
        width: "43%",
        maxHeight: "40px",
        margin: "5px",
        padding: "0px"
      },
      closeIconStyles: {
        width: "20px"
      },
      uploadFile: {
        minHeight: "50px"
      }
    };
  } else {
    citizenStyles = {
      textStyles: {},
      tagStyles: {},
      inputStyles: {},
      buttonStyles: {},
      tagContainerStyles: {}
    };
  }
  return citizenStyles;
};
var UploadFile = function UploadFile(props) {
  var _inpRef$current, _extraStyles, _extraStyles2, _extraStyles3, _extraStyles4, _props$uploadedFiles, _extraStyles6;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var inpRef = React.useRef();
  var _useState = React.useState(false),
    setHasFile = _useState[1];
  var _useState2 = React.useState(null),
    prevSate = _useState2[0],
    setprevSate = _useState2[1];
  var user_type = Digit.SessionStorage.get("userType");
  var extraStyles = {};
  var handleChange = function handleChange() {
    if (inpRef.current.files[0]) {
      setHasFile(true);
      setprevSate(inpRef.current.files[0]);
    } else setHasFile(false);
  };
  extraStyles = getCitizenStyles("OBPS");
  var handleDelete = function handleDelete() {
    inpRef.current.value = "";
    props.onDelete();
  };
  var handleEmpty = function handleEmpty() {
    if (inpRef.current.files.length <= 0 && prevSate !== null) {
      inpRef.current.value = "";
      props.onDelete();
    }
  };
  if (props.uploadMessage && inpRef.current.value) {
    handleDelete();
    setHasFile(false);
  }
  React.useEffect(function () {
    return handleEmpty();
  }, [inpRef === null || inpRef === void 0 ? void 0 : (_inpRef$current = inpRef.current) === null || _inpRef$current === void 0 ? void 0 : _inpRef$current.files]);
  React.useEffect(function () {
    return handleChange();
  }, [props.message]);
  var showHint = (props === null || props === void 0 ? void 0 : props.showHint) || false;
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, showHint && /*#__PURE__*/React__default.createElement("p", {
    className: "cell-text"
  }, t(props === null || props === void 0 ? void 0 : props.hintText)), /*#__PURE__*/React__default.createElement("div", {
    className: "upload-file " + (props === null || props === void 0 ? void 0 : props.customClass) + " " + (user_type === "employee" ? "" : "upload-file-max-width") + " " + (props.disabled ? " disabled" : ""),
    style: (_extraStyles = extraStyles) !== null && _extraStyles !== void 0 && _extraStyles.uploadFile ? _extends({}, (_extraStyles2 = extraStyles) === null || _extraStyles2 === void 0 ? void 0 : _extraStyles2.uploadFile, {
      padding: "0.5rem"
    }) : {}
  }, /*#__PURE__*/React__default.createElement("div", {
    style: extraStyles ? (_extraStyles3 = extraStyles) === null || _extraStyles3 === void 0 ? void 0 : _extraStyles3.containerStyles : null
  }, /*#__PURE__*/React__default.createElement(ButtonSelector, {
    theme: "border",
    label: t("CS_COMMON_CHOOSE_FILE"),
    style: _extends({}, extraStyles ? (_extraStyles4 = extraStyles) === null || _extraStyles4 === void 0 ? void 0 : _extraStyles4.buttonStyles : {}, !props.enableButton ? {
      opacity: 0.5
    } : {}),
    textStyles: props === null || props === void 0 ? void 0 : props.textStyles,
    type: props.buttonType
  }), props === null || props === void 0 ? void 0 : (_props$uploadedFiles = props.uploadedFiles) === null || _props$uploadedFiles === void 0 ? void 0 : _props$uploadedFiles.map(function (file, index) {
    var _extraStyles5;
    var fileDetailsData = file[1];
    return /*#__PURE__*/React__default.createElement("div", {
      className: "tag-container",
      style: extraStyles ? (_extraStyles5 = extraStyles) === null || _extraStyles5 === void 0 ? void 0 : _extraStyles5.tagContainerStyles : null
    }, /*#__PURE__*/React__default.createElement(RemoveableTag, {
      extraStyles: extraStyles,
      key: index,
      text: file[0],
      onClick: function onClick(e) {
        return props === null || props === void 0 ? void 0 : props.removeTargetedFile(fileDetailsData, e);
      }
    }));
  }), (props === null || props === void 0 ? void 0 : props.uploadedFiles.length) === 0 && /*#__PURE__*/React__default.createElement("h2", {
    className: "file-upload-status"
  }, props.message)), /*#__PURE__*/React__default.createElement("input", {
    className: props.disabled ? "disabled" : "" + "input-mirror-selector-button",
    style: _extends({}, extraStyles ? _extends({}, (_extraStyles6 = extraStyles) === null || _extraStyles6 === void 0 ? void 0 : _extraStyles6.inputStyles, props === null || props === void 0 ? void 0 : props.inputStyles) : _extends({}, props === null || props === void 0 ? void 0 : props.inputStyles), {
      cursor: 'pointer'
    }),
    ref: inpRef,
    type: "file",
    id: props.id || "document-" + getRandomId(),
    name: "file",
    multiple: props.multiple,
    accept: props.accept,
    disabled: props.disabled,
    onChange: function onChange(e) {
      return props.onUpload(e);
    },
    onClick: function onClick(event) {
      if (!(props !== null && props !== void 0 && props.enableButton)) {
        event.preventDefault();
      } else {
        var _ref = event || {},
          _ref$target = _ref.target,
          target = _ref$target === void 0 ? {} : _ref$target;
        target.value = "";
      }
    }
  })), props.iserror && /*#__PURE__*/React__default.createElement("p", {
    style: {
      color: "red"
    }
  }, props.iserror), (props === null || props === void 0 ? void 0 : props.showHintBelow) && /*#__PURE__*/React__default.createElement("p", {
    className: "cell-text",
    style: {
      paddingTop: '3px'
    }
  }, t(props === null || props === void 0 ? void 0 : props.hintText)));
};

var Option = function Option(_ref) {
  var name = _ref.name,
    Icon = _ref.Icon,
    onClick = _ref.onClick,
    className = _ref.className;
  return /*#__PURE__*/React__default.createElement("div", {
    className: className || "CardBasedOptionsMainChildOption",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "ChildOptionImageWrapper"
  }, Icon), /*#__PURE__*/React__default.createElement("p", {
    className: "ChildOptionName"
  }, name));
};
var CardBasedOptions = function CardBasedOptions(_ref2) {
  var header = _ref2.header,
    sideOption = _ref2.sideOption,
    options = _ref2.options,
    _ref2$style = _ref2.style,
    style = _ref2$style === void 0 ? {} : _ref2$style;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "CardBasedOptions",
    style: style
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "headContent"
  }, /*#__PURE__*/React__default.createElement("h2", null, header), /*#__PURE__*/React__default.createElement("p", {
    onClick: sideOption.onClick
  }, sideOption.name)), /*#__PURE__*/React__default.createElement("div", {
    className: "mainContent"
  }, options.map(function (props, index) {
    return /*#__PURE__*/React__default.createElement(Option, _extends({
      key: index
    }, props));
  })));
};

var WhatsNewCard = function WhatsNewCard(_ref) {
  var header = _ref.header,
    actions = _ref.actions,
    eventNotificationText = _ref.eventNotificationText,
    timePastAfterEventCreation = _ref.timePastAfterEventCreation,
    timeApproxiamationInUnits = _ref.timeApproxiamationInUnits;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var getTransformedLocale = function getTransformedLocale(label) {
    if (typeof label === "number") return label;
    return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: "WhatsNewCard"
  }, /*#__PURE__*/React__default.createElement("h2", null, t(header)), /*#__PURE__*/React__default.createElement("p", null, eventNotificationText), actions === null || actions === void 0 ? void 0 : actions.map(function (i) {
    return /*#__PURE__*/React__default.createElement("a", {
      href: i === null || i === void 0 ? void 0 : i.actionUrl
    }, "" + t("CS_COMMON_" + getTransformedLocale(i === null || i === void 0 ? void 0 : i.code)));
  }), /*#__PURE__*/React__default.createElement("p", null, timePastAfterEventCreation + (" " + t(timeApproxiamationInUnits))));
};

var EventCalendarView = function EventCalendarView(_ref) {
  var onGroundEventMonth = _ref.onGroundEventMonth,
    onGroundEventDate = _ref.onGroundEventDate;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "EventCalendarView"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "MonthViewInEventCalendar"
  }, /*#__PURE__*/React__default.createElement("h2", null, onGroundEventMonth)), /*#__PURE__*/React__default.createElement("div", {
    className: "DateViewInEventCalendar"
  }, /*#__PURE__*/React__default.createElement("h2", null, onGroundEventDate)));
};

var InboxLinks = function InboxLinks(_ref) {
  var logoIcon = _ref.logoIcon,
    headerText = _ref.headerText,
    links = _ref.links,
    customClass = _ref.customClass;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var GetLogo = function GetLogo() {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "logo"
    }, logoIcon), " ", /*#__PURE__*/React__default.createElement("span", {
      className: "text"
    }, t(headerText)));
  };
  return /*#__PURE__*/React__default.createElement(Card, {
    className: "employeeCard filter inboxLinks " + customClass
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container"
  }, GetLogo(), /*#__PURE__*/React__default.createElement("div", {
    className: "body"
  }, links.map(function (_ref2, index) {
    var link = _ref2.link,
      text = _ref2.text,
      _ref2$hyperlink = _ref2.hyperlink,
      hyperlink = _ref2$hyperlink === void 0 ? false : _ref2$hyperlink;
    return /*#__PURE__*/React__default.createElement("span", {
      className: "link",
      key: index
    }, hyperlink ? /*#__PURE__*/React__default.createElement("a", {
      href: link
    }, t(text)) : /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link
    }, t(text)));
  }))));
};

var PopupHeadingLabel = function PopupHeadingLabel(_ref) {
  var IconSVG = _ref.IconSVG,
    headingLabel = _ref.headingLabel,
    onResetSortForm = _ref.onResetSortForm;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "popupModalHeading"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "headingIconAndLabel"
  }, /*#__PURE__*/React__default.createElement(IconSVG, null), /*#__PURE__*/React__default.createElement("h3", null, headingLabel, ":")), /*#__PURE__*/React__default.createElement("span", {
    className: "popupResetFormButton",
    onClick: onResetSortForm
  }, /*#__PURE__*/React__default.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 16 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z",
    fill: "#505A5F"
  }))));
};

var CustomDropdown = function CustomDropdown(_ref) {
  var _config$mdmsConfig, _config$mdmsConfig2, _config$mdmsConfig4, _config$mdmsConfig5, _config$mdmsConfig6;
  var t = _ref.t,
    config = _ref.config,
    inputRef = _ref.inputRef,
    onChange = _ref.onChange,
    value = _ref.value,
    errorStyle = _ref.errorStyle,
    disable = _ref.disable,
    type = _ref.type,
    _ref$additionalWrappe = _ref.additionalWrapperClass,
    additionalWrapperClass = _ref$additionalWrappe === void 0 ? "" : _ref$additionalWrappe;
  var master = {
    name: config === null || config === void 0 ? void 0 : (_config$mdmsConfig = config.mdmsConfig) === null || _config$mdmsConfig === void 0 ? void 0 : _config$mdmsConfig.masterName
  };
  if (config !== null && config !== void 0 && (_config$mdmsConfig2 = config.mdmsConfig) !== null && _config$mdmsConfig2 !== void 0 && _config$mdmsConfig2.filter) {
    var _config$mdmsConfig3;
    master["filter"] = config === null || config === void 0 ? void 0 : (_config$mdmsConfig3 = config.mdmsConfig) === null || _config$mdmsConfig3 === void 0 ? void 0 : _config$mdmsConfig3.filter;
  }
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), config === null || config === void 0 ? void 0 : (_config$mdmsConfig4 = config.mdmsConfig) === null || _config$mdmsConfig4 === void 0 ? void 0 : _config$mdmsConfig4.moduleName, [master], {
      select: config !== null && config !== void 0 && (_config$mdmsConfig5 = config.mdmsConfig) !== null && _config$mdmsConfig5 !== void 0 && _config$mdmsConfig5.select ? Digit.Utils.createFunction(config === null || config === void 0 ? void 0 : (_config$mdmsConfig6 = config.mdmsConfig) === null || _config$mdmsConfig6 === void 0 ? void 0 : _config$mdmsConfig6.select) : function (data) {
        var _config$mdmsConfig7, _config$mdmsConfig8;
        var optionsData = _.get(data, (config === null || config === void 0 ? void 0 : (_config$mdmsConfig7 = config.mdmsConfig) === null || _config$mdmsConfig7 === void 0 ? void 0 : _config$mdmsConfig7.moduleName) + "." + (config === null || config === void 0 ? void 0 : (_config$mdmsConfig8 = config.mdmsConfig) === null || _config$mdmsConfig8 === void 0 ? void 0 : _config$mdmsConfig8.masterName), []);
        return optionsData.filter(function (opt) {
          return opt !== null && opt !== void 0 && opt.hasOwnProperty("active") ? opt.active : true;
        }).map(function (opt) {
          var _config$mdmsConfig9;
          return _extends({}, opt, {
            name: (config === null || config === void 0 ? void 0 : (_config$mdmsConfig9 = config.mdmsConfig) === null || _config$mdmsConfig9 === void 0 ? void 0 : _config$mdmsConfig9.localePrefix) + "_" + Digit.Utils.locale.getTransformedLocale(opt.code)
          });
        });
      },
      enabled: config !== null && config !== void 0 && config.mdmsConfig ? true : false
    }),
    isLoading = _Digit$Hooks$useCusto.isLoading,
    data = _Digit$Hooks$useCusto.data;
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
    key: config.name
  }, type === "radio" ? /*#__PURE__*/React__default.createElement(RadioButtons, {
    inputRef: inputRef,
    style: _extends({
      display: "flex",
      justifyContent: "flex-start",
      gap: "3rem"
    }, config.styles),
    options: data || (config === null || config === void 0 ? void 0 : config.options) || [],
    key: config.name,
    optionsKey: config === null || config === void 0 ? void 0 : config.optionsKey,
    value: value,
    onSelect: function onSelect(e) {
      onChange(e, config.name);
    },
    disable: disable,
    selectedOption: value,
    defaultValue: value,
    t: t,
    errorStyle: errorStyle,
    additionalWrapperClass: additionalWrapperClass,
    innerStyles: config === null || config === void 0 ? void 0 : config.innerStyles
  }) : /*#__PURE__*/React__default.createElement(Dropdown, {
    inputRef: inputRef,
    style: _extends({
      display: "flex",
      justifyContent: "space-between"
    }, config.styles),
    option: data || (config === null || config === void 0 ? void 0 : config.options) || [],
    key: config.name,
    optionKey: config === null || config === void 0 ? void 0 : config.optionsKey,
    value: value,
    select: function select(e) {
      onChange(e, config.name);
    },
    disable: disable,
    selected: value || config.defaultValue,
    defaultValue: value || config.defaultValue,
    t: t,
    errorStyle: errorStyle,
    optionCardStyles: config === null || config === void 0 ? void 0 : config.optionsCustomStyle
  }));
};

var _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
var _asyncIteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator";
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}

var displayError = function displayError(_ref, customErrorMsg) {
  var t = _ref.t,
    error = _ref.error,
    name = _ref.name;
  return /*#__PURE__*/React__default.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "validation-error"
  }, customErrorMsg ? t(customErrorMsg) : t(error)), /*#__PURE__*/React__default.createElement("div", {
    className: "validation-error"
  }, customErrorMsg ? '' : t('ES_COMMON_DOC_FILENAME') + " : " + name + " ..."));
};
var fileValidationStatus = function fileValidationStatus(file, regex, maxSize, t) {
  var _file$name;
  var status = {
    valid: true,
    name: file === null || file === void 0 ? void 0 : (_file$name = file.name) === null || _file$name === void 0 ? void 0 : _file$name.substring(0, 15),
    error: ''
  };
  if (!file) return;
  if (!regex.test(file.type) && file.size / 1024 / 1024 > maxSize) {
    status.valid = false;
    status.error = t("NOT_SUPPORTED_FILE_TYPE_AND_FILE_SIZE_EXCEEDED_5MB");
  }
  if (!regex.test(file.type)) {
    status.valid = false;
    status.error = t("NOT_SUPPORTED_FILE_TYPE");
  }
  if (file.size / 1024 / 1024 > maxSize) {
    status.valid = false;
    status.error = t("FILE_SIZE_EXCEEDED_5MB");
  }
  return status;
};
var checkIfAllValidFiles = function checkIfAllValidFiles(files, regex, maxSize, t, maxFilesAllowed, state) {
  var _files$, _files$$name;
  if (!files.length || !regex || !maxSize) return [{}, false];
  var uploadedFiles = state.length + 1;
  if (maxFilesAllowed && (uploadedFiles > maxFilesAllowed || files.length > maxFilesAllowed)) return [[{
    valid: false,
    name: (_files$ = files[0]) === null || _files$ === void 0 ? void 0 : (_files$$name = _files$.name) === null || _files$$name === void 0 ? void 0 : _files$$name.substring(0, 15),
    error: t("FILE_LIMIT_EXCEEDED")
  }], true];
  var messages = [];
  var isInValidGroup = false;
  for (var _iterator = _createForOfIteratorHelperLoose(files), _step; !(_step = _iterator()).done;) {
    var file = _step.value;
    var fileStatus = fileValidationStatus(file, regex, maxSize, t);
    if (!fileStatus.valid) {
      isInValidGroup = true;
    }
    messages.push(fileStatus);
  }
  return [messages, isInValidGroup];
};
var MultiUploadWrapper = function MultiUploadWrapper(_ref2) {
  var t = _ref2.t,
    _ref2$module = _ref2.module,
    module = _ref2$module === void 0 ? "PGR" : _ref2$module,
    _ref2$tenantId = _ref2.tenantId,
    tenantId = _ref2$tenantId === void 0 ? Digit.ULBService.getStateId() : _ref2$tenantId,
    getFormState = _ref2.getFormState,
    requestSpecifcFileRemoval = _ref2.requestSpecifcFileRemoval,
    _ref2$extraStyleName = _ref2.extraStyleName,
    extraStyleName = _ref2$extraStyleName === void 0 ? "" : _ref2$extraStyleName,
    _ref2$setuploadedstat = _ref2.setuploadedstate,
    setuploadedstate = _ref2$setuploadedstat === void 0 ? [] : _ref2$setuploadedstat,
    showHintBelow = _ref2.showHintBelow,
    hintText = _ref2.hintText,
    _ref2$allowedFileType = _ref2.allowedFileTypesRegex,
    allowedFileTypesRegex = _ref2$allowedFileType === void 0 ? /(.*?)(jpg|jpeg|webp|aif|png|image|pdf|msword|openxmlformats-officedocument)$/i : _ref2$allowedFileType,
    _ref2$allowedMaxSizeI = _ref2.allowedMaxSizeInMB,
    allowedMaxSizeInMB = _ref2$allowedMaxSizeI === void 0 ? 10 : _ref2$allowedMaxSizeI,
    _ref2$acceptFiles = _ref2.acceptFiles,
    acceptFiles = _ref2$acceptFiles === void 0 ? "image/*, .jpg, .jpeg, .webp, .aif, .png, .image, .pdf, .msword, .openxmlformats-officedocument, .dxf" : _ref2$acceptFiles,
    maxFilesAllowed = _ref2.maxFilesAllowed,
    _ref2$customClass = _ref2.customClass,
    customClass = _ref2$customClass === void 0 ? "" : _ref2$customClass,
    customErrorMsg = _ref2.customErrorMsg,
    containerStyles = _ref2.containerStyles;
  var FILES_UPLOADED = "FILES_UPLOADED";
  var TARGET_FILE_REMOVAL = "TARGET_FILE_REMOVAL";
  var _useState = React.useState([]),
    fileErrors = _useState[0],
    setFileErrors = _useState[1];
  var _useState2 = React.useState(true),
    enableButton = _useState2[0],
    setEnableButton = _useState2[1];
  var uploadMultipleFiles = function uploadMultipleFiles(state, payload) {
    var files = payload.files,
      fileStoreIds = payload.fileStoreIds;
    var filesData = Array.from(files);
    var newUploads = filesData === null || filesData === void 0 ? void 0 : filesData.map(function (file, index) {
      return [file.name, {
        file: file,
        fileStoreId: fileStoreIds[index]
      }];
    });
    return [].concat(state, newUploads);
  };
  var removeFile = function removeFile(state, payload) {
    var __indexOfItemToDelete = state.findIndex(function (e) {
      return e[1].fileStoreId.fileStoreId === payload.fileStoreId.fileStoreId;
    });
    var mutatedState = state.filter(function (e, index) {
      return index !== __indexOfItemToDelete;
    });
    setFileErrors([]);
    return [].concat(mutatedState);
  };
  var uploadReducer = function uploadReducer(state, action) {
    switch (action.type) {
      case FILES_UPLOADED:
        return uploadMultipleFiles(state, action.payload);
      case TARGET_FILE_REMOVAL:
        return removeFile(state, action.payload);
    }
  };
  var _useReducer = React.useReducer(uploadReducer, [].concat(setuploadedstate)),
    state = _useReducer[0],
    dispatch = _useReducer[1];
  var onUploadMultipleFiles = function onUploadMultipleFiles(e) {
    try {
      setEnableButton(false);
      setFileErrors([]);
      var files = Array.from(e.target.files);
      if (!files.length) return Promise.resolve();
      var _checkIfAllValidFiles = checkIfAllValidFiles(files, allowedFileTypesRegex, allowedMaxSizeInMB, t, maxFilesAllowed, state),
        validationMsg = _checkIfAllValidFiles[0],
        error = _checkIfAllValidFiles[1];
      return Promise.resolve(function () {
        if (!error) {
          return _catch(function () {
            return Promise.resolve(Digit.UploadServices.MultipleFilesStorage(module, e.target.files, tenantId)).then(function (_ref3) {
              var _ref3$data = _ref3.data,
                _ref3$data2 = _ref3$data === void 0 ? {} : _ref3$data,
                fileStoreIds = _ref3$data2.files;
              setEnableButton(true);
              return dispatch({
                type: FILES_UPLOADED,
                payload: {
                  files: e.target.files,
                  fileStoreIds: fileStoreIds
                }
              });
            });
          }, function () {
            setEnableButton(true);
          });
        } else {
          setFileErrors(validationMsg);
          setEnableButton(true);
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };
  React.useEffect(function () {
    return getFormState(state);
  }, [state]);
  React.useEffect(function () {
    requestSpecifcFileRemoval ? dispatch({
      type: TARGET_FILE_REMOVAL,
      payload: requestSpecifcFileRemoval
    }) : null;
  }, [requestSpecifcFileRemoval]);
  return /*#__PURE__*/React__default.createElement("div", {
    style: containerStyles
  }, /*#__PURE__*/React__default.createElement(UploadFile, {
    onUpload: function onUpload(e) {
      return onUploadMultipleFiles(e);
    },
    removeTargetedFile: function removeTargetedFile(fileDetailsData) {
      return dispatch({
        type: TARGET_FILE_REMOVAL,
        payload: fileDetailsData
      });
    },
    uploadedFiles: state,
    multiple: true,
    showHintBelow: showHintBelow,
    hintText: hintText,
    extraStyleName: extraStyleName,
    onDelete: function onDelete() {
      setFileErrors([]);
    },
    accept: acceptFiles,
    message: t("WORKS_NO_FILE_SELECTED"),
    customClass: customClass,
    enableButton: enableButton
  }), /*#__PURE__*/React__default.createElement("span", {
    style: {
      display: 'flex'
    }
  }, fileErrors.length ? fileErrors.map(function (_ref4) {
    var valid = _ref4.valid,
      name = _ref4.name,
      error = _ref4.error;
    return valid ? null : displayError({
      t: t,
      error: error,
      name: name
    }, customErrorMsg);
  }) : null));
};

var HorizontalNav = function HorizontalNav(_ref) {
  var configNavItems = _ref.configNavItems,
    activeLink = _ref.activeLink,
    setActiveLink = _ref.setActiveLink,
    _ref$showNav = _ref.showNav,
    showNav = _ref$showNav === void 0 ? false : _ref$showNav,
    children = _ref.children,
    _ref$customStyle = _ref.customStyle,
    customStyle = _ref$customStyle === void 0 ? {} : _ref$customStyle,
    _ref$customClassName = _ref.customClassName,
    customClassName = _ref$customClassName === void 0 ? "" : _ref$customClassName,
    _ref$inFormComposer = _ref.inFormComposer,
    inFormComposer = _ref$inFormComposer === void 0 ? true : _ref$inFormComposer,
    _ref$navClassName = _ref.navClassName,
    navClassName = _ref$navClassName === void 0 ? "" : _ref$navClassName,
    _ref$navStyles = _ref.navStyles,
    navStyles = _ref$navStyles === void 0 ? {} : _ref$navStyles;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var setActive = function setActive(item) {
    setActiveLink(item.name);
  };
  var MenuItem = function MenuItem(_ref2) {
    var item = _ref2.item;
    var itemComponent = item.code;
    var Item = function Item() {
      return /*#__PURE__*/React__default.createElement("span", {
        className: "menu-item"
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "menu-label"
      }, t(itemComponent)));
    };
    return /*#__PURE__*/React__default.createElement(Item, null);
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: navClassName,
    style: _extends({}, navStyles)
  }, showNav && /*#__PURE__*/React__default.createElement("div", {
    className: "horizontal-nav " + customClassName,
    style: inFormComposer ? _extends({
      marginLeft: "16px",
      marginRight: "16px"
    }, customStyle) : _extends({}, customStyle)
  }, configNavItems === null || configNavItems === void 0 ? void 0 : configNavItems.map(function (item, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "sidebar-list " + (activeLink === item.name ? "active" : ""),
      key: index,
      onClick: function onClick() {
        return setActive(item);
      }
    }, /*#__PURE__*/React__default.createElement(MenuItem, {
      item: item
    }));
  })), children);
};

var wrapperStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  border: "solid",
  borderRadius: "5px",
  padding: "10px",
  paddingTop: "20px",
  marginTop: "10px",
  borderColor: "#f3f3f3",
  background: "#FAFAFA",
  marginBottom: "20px"
};
var FormComposer = function FormComposer(props) {
  var _props$appData2, _props$horizontalNavC, _props$config2, _props$config3, _props$config4, _props$config5;
  var _useForm = reactHookForm.useForm({
      defaultValues: props.defaultValues
    }),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    setValue = _useForm.setValue,
    getValues = _useForm.getValues,
    reset = _useForm.reset,
    watch = _useForm.watch,
    control = _useForm.control,
    formState = _useForm.formState,
    errors = _useForm.errors,
    setError = _useForm.setError,
    clearErrors = _useForm.clearErrors;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var formData = watch();
  React.useEffect(function () {
    var _Object$keys, _props$appData, _props$appData$Connec, _formData$ConnectionH;
    if (props !== null && props !== void 0 && props.appData && ((_Object$keys = Object.keys(props === null || props === void 0 ? void 0 : props.appData)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.length) > 0 && (!_.isEqual(props === null || props === void 0 ? void 0 : props.appData, formData) || !_.isEqual(props === null || props === void 0 ? void 0 : (_props$appData = props.appData) === null || _props$appData === void 0 ? void 0 : (_props$appData$Connec = _props$appData.ConnectionHolderDetails) === null || _props$appData$Connec === void 0 ? void 0 : _props$appData$Connec[0], formData === null || formData === void 0 ? void 0 : (_formData$ConnectionH = formData.ConnectionHolderDetails) === null || _formData$ConnectionH === void 0 ? void 0 : _formData$ConnectionH[0]))) {
      reset(_extends({}, props === null || props === void 0 ? void 0 : props.appData));
    }
  }, [props === null || props === void 0 ? void 0 : props.appData, formData, props === null || props === void 0 ? void 0 : (_props$appData2 = props.appData) === null || _props$appData2 === void 0 ? void 0 : _props$appData2.ConnectionHolderDetails]);
  React.useEffect(function () {
    props.getFormAccessors && props.getFormAccessors({
      setValue: setValue,
      getValues: getValues
    });
  }, []);
  function onSubmit(data) {
    props.onSubmit(data);
  }
  function onSecondayActionClick(data) {
    props.onSecondayActionClick();
  }
  React.useEffect(function () {
    props.onFormValueChange && props.onFormValueChange(setValue, formData, formState, reset);
  }, [formData]);
  var fieldSelector = function fieldSelector(type, populators, isMandatory, disable, component, config, sectionFormCategory) {
    if (disable === void 0) {
      disable = false;
    }
    var disableFormValidation = false;
    if (sectionFormCategory && props !== null && props !== void 0 && props.currentFormCategory) {
      disableFormValidation = sectionFormCategory !== (props === null || props === void 0 ? void 0 : props.currentFormCategory) ? true : false;
    }
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    switch (type) {
      case "date":
      case "text":
      case "number":
      case "password":
      case "time":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "field-container"
        }, populators !== null && populators !== void 0 && populators.componentInFront ? /*#__PURE__*/React__default.createElement("span", {
          className: "component-in-front " + (disable && "disabled")
        }, populators.componentInFront) : null, /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          defaultValue: (formData === null || formData === void 0 ? void 0 : formData[populators.name]) || populators.defaultValue,
          render: function render(_ref) {
            var _populators$validatio, _populators$validatio2;
            var onChange = _ref.onChange,
              ref = _ref.ref;
            return /*#__PURE__*/React__default.createElement(TextInput, {
              value: (formData === null || formData === void 0 ? void 0 : formData[populators.name]) || populators.defaultValue,
              type: type,
              name: populators.name,
              onChange: onChange,
              inputRef: ref,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name],
              max: populators.max,
              disable: disable,
              style: type === "date" ? {
                paddingRight: "3px"
              } : "",
              maxlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio = populators.validation) === null || _populators$validatio === void 0 ? void 0 : _populators$validatio.maxlength,
              minlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio2 = populators.validation) === null || _populators$validatio2 === void 0 ? void 0 : _populators$validatio2.minlength
            });
          },
          name: populators.name,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          control: control
        }));
      case "textarea":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          render: function render(_ref2) {
            var onChange = _ref2.onChange,
              ref = _ref2.ref;
            return /*#__PURE__*/React__default.createElement(TextArea, {
              className: "field",
              value: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              type: type,
              name: populators.name,
              onChange: onChange,
              inputRef: ref,
              disable: disable,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            });
          },
          name: populators.name,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          control: control
        });
      case "mobileNumber":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(MobileNumber, _extends({
              inputRef: props.ref,
              className: "field fullWidth",
              onChange: props.onChange,
              value: props.value,
              disable: disable
            }, props, {
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            }));
          },
          defaultValue: populators.defaultValue,
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          control: control
        });
      case "custom":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return populators.component(_extends({}, props, {
              setValue: setValue
            }), populators.customProps);
          },
          defaultValue: populators.defaultValue,
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          control: control
        });
      case "multiupload":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          rules: !disableFormValidation ? {
            required: false
          } : {},
          render: function render(_ref3) {
            var onChange = _ref3.onChange,
              _ref3$value = _ref3.value,
              value = _ref3$value === void 0 ? [] : _ref3$value;
            function getFileStoreData(filesData) {
              var numberOfFiles = filesData.length;
              if (numberOfFiles > 0) {
                filesData.forEach(function (value) {
                });
              }
              onChange(numberOfFiles > 0 ? filesData : []);
            }
            return /*#__PURE__*/React__default.createElement(MultiUploadWrapper, {
              t: t,
              module: "works",
              tenantId: Digit.ULBService.getCurrentTenantId(),
              getFormState: getFileStoreData,
              showHintBelow: populators !== null && populators !== void 0 && populators.showHintBelow ? true : false,
              setuploadedstate: value,
              allowedFileTypesRegex: populators.allowedFileTypes,
              allowedMaxSizeInMB: populators.allowedMaxSizeInMB,
              hintText: populators.hintText,
              maxFilesAllowed: populators.maxFilesAllowed,
              extraStyleName: {
                padding: "0.5rem"
              },
              customClass: populators === null || populators === void 0 ? void 0 : populators.customClass
            });
          }
        });
      case "select":
      case "radio":
      case "dropdown":
      case "radioordropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(CustomDropdown, {
              t: t,
              label: config === null || config === void 0 ? void 0 : config.label,
              type: type,
              onBlur: props.onBlur,
              value: props.value,
              inputRef: props.ref,
              onChange: props.onChange,
              config: populators,
              disable: config === null || config === void 0 ? void 0 : config.disable,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            });
          },
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          name: config.key,
          control: control
        });
      case "component":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(Component, {
              userType: "employee",
              t: t,
              setValue: setValue,
              onSelect: setValue,
              config: config,
              data: formData,
              formData: formData,
              register: register,
              errors: errors,
              props: props,
              setError: setError,
              clearErrors: clearErrors,
              formState: formState,
              onBlur: props.onBlur,
              control: control,
              getValues: getValues
            });
          },
          name: config.key,
          control: control
        });
      case "form":
        return /*#__PURE__*/React__default.createElement("form", null, /*#__PURE__*/React__default.createElement(Component, {
          userType: "employee",
          t: t,
          setValue: setValue,
          onSelect: setValue,
          config: config,
          data: formData,
          formData: formData,
          register: register,
          errors: errors,
          setError: setError,
          clearErrors: clearErrors,
          formState: formState,
          control: control
        }));
      default:
        return (populators === null || populators === void 0 ? void 0 : populators.dependency) !== false ? populators : null;
    }
  };
  var getCombinedStyle = function getCombinedStyle(placementinBox) {
    switch (placementinBox) {
      case 0:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "10px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          marginBottom: "20px"
        };
      case 1:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "-30px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          borderTop: "0px",
          borderBottom: "0px"
        };
      case 2:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "-30px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          marginBottom: "20px",
          borderTop: "0px"
        };
    }
  };
  var titleStyle = {
    color: "#505A5F",
    fontWeight: "700",
    fontSize: "16px"
  };
  var getCombinedComponent = function getCombinedComponent(section) {
    if (section.head && section.subHead) {
      return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(CardSectionHeader, {
        style: props !== null && props !== void 0 && props.sectionHeadStyle ? props === null || props === void 0 ? void 0 : props.sectionHeadStyle : {
          margin: "5px 0px"
        },
        id: section.headId
      }, t(section.head)), /*#__PURE__*/React__default.createElement(CardSectionHeader, {
        style: titleStyle,
        id: section.headId + "_DES"
      }, t(section.subHead)));
    } else if (section.head) {
      return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(CardSectionHeader, {
        style: props !== null && props !== void 0 && props.sectionHeadStyle ? props === null || props === void 0 ? void 0 : props.sectionHeadStyle : {},
        id: section.headId
      }, t(section.head)));
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  };
  var formFields = React.useCallback(function (section, index, array, sectionFormCategory) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, section && getCombinedComponent(section), section.body.map(function (field, index) {
      var _field$populators, _field$populators2, _errors$field$populat, _field$populators3, _field$populators4, _field$populators5, _field$populators6, _field$populators7;
      if (props.inline) return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement("div", {
        style: field.isInsideBox ? getCombinedStyle(field === null || field === void 0 ? void 0 : field.placementinbox) : {}
      }, !field.withoutLabel && /*#__PURE__*/React__default.createElement(CardLabel, {
        style: {
          color: field.isSectionText ? "#505A5F" : "",
          marginBottom: props.inline ? "8px" : "revert"
        },
        className: field !== null && field !== void 0 && field.disable ? "disabled" : ""
      }, t(field.label), field.isMandatory ? " * " : null, field.labelChildren && field.labelChildren), errors && errors[(_field$populators = field.populators) === null || _field$populators === void 0 ? void 0 : _field$populators.name] && Object.keys(errors[(_field$populators2 = field.populators) === null || _field$populators2 === void 0 ? void 0 : _field$populators2.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, null, t(field.populators.error || ((_errors$field$populat = errors[(_field$populators3 = field.populators) === null || _field$populators3 === void 0 ? void 0 : _field$populators3.name]) === null || _errors$field$populat === void 0 ? void 0 : _errors$field$populat.message))) : null, /*#__PURE__*/React__default.createElement("div", {
        style: field.withoutLabel ? {
          width: "100%"
        } : {},
        className: "field"
      }, fieldSelector(field.type, field.populators, field.isMandatory, field === null || field === void 0 ? void 0 : field.disable, field === null || field === void 0 ? void 0 : field.component, field, sectionFormCategory), (field === null || field === void 0 ? void 0 : field.description) && /*#__PURE__*/React__default.createElement(CardLabel, {
        style: _extends({
          marginTop: "-24px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#505A5F"
        }, field === null || field === void 0 ? void 0 : field.descriptionStyles)
      }, t(field.description)))));
      return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(LabelFieldPair, {
        key: index,
        style: props !== null && props !== void 0 && props.showWrapperContainers && !field.hideContainer ? _extends({}, wrapperStyles) : {
          border: "none",
          background: "white"
        }
      }, !field.withoutLabel && /*#__PURE__*/React__default.createElement(CardLabel, {
        style: {
          color: field.isSectionText ? "#505A5F" : "",
          marginBottom: props.inline ? "8px" : "revert",
          fontWeight: props.isDescriptionBold ? "600" : null
        }
      }, t(field.label), field.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
        style: field.withoutLabel ? _extends({
          width: "100%"
        }, props === null || props === void 0 ? void 0 : props.fieldStyle) : _extends({}, props === null || props === void 0 ? void 0 : props.fieldStyle),
        className: "field"
      }, fieldSelector(field.type, field.populators, field.isMandatory, field === null || field === void 0 ? void 0 : field.disable, field === null || field === void 0 ? void 0 : field.component, field, sectionFormCategory), (field === null || field === void 0 ? void 0 : field.description) && /*#__PURE__*/React__default.createElement(CardText, {
        style: {
          fontSize: "14px",
          marginTop: "-24px"
        }
      }, t(field === null || field === void 0 ? void 0 : field.description)))), field !== null && field !== void 0 && (_field$populators4 = field.populators) !== null && _field$populators4 !== void 0 && _field$populators4.name && errors && errors[field === null || field === void 0 ? void 0 : (_field$populators5 = field.populators) === null || _field$populators5 === void 0 ? void 0 : _field$populators5.name] && Object.keys(errors[field === null || field === void 0 ? void 0 : (_field$populators6 = field.populators) === null || _field$populators6 === void 0 ? void 0 : _field$populators6.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, {
        style: {
          width: "70%",
          marginLeft: "30%",
          fontSize: "12px",
          marginTop: "-21px"
        }
      }, t(field === null || field === void 0 ? void 0 : (_field$populators7 = field.populators) === null || _field$populators7 === void 0 ? void 0 : _field$populators7.error)) : null);
    }), !props.noBreakLine && (array.length - 1 === index ? null : /*#__PURE__*/React__default.createElement(BreakLine, {
      style: props !== null && props !== void 0 && props.breaklineStyle ? props === null || props === void 0 ? void 0 : props.breaklineStyle : {}
    })));
  }, [props.config, formData]);
  var formFieldsAll = React.useMemo(function () {
    var _props$config;
    return (_props$config = props.config) === null || _props$config === void 0 ? void 0 : _props$config.map(function (section, index, array) {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, section && getCombinedComponent(section), section.body.map(function (field, index) {
        var _field$populators8, _field$populators9, _errors$field$populat2, _field$populators10, _field$populators11, _field$populators12, _field$populators13, _field$populators14;
        if (props.inline) return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
          key: index
        }, /*#__PURE__*/React__default.createElement("div", {
          style: field.isInsideBox ? getCombinedStyle(field === null || field === void 0 ? void 0 : field.placementinbox) : {}
        }, !field.withoutLabel && /*#__PURE__*/React__default.createElement(CardLabel, {
          style: {
            color: field.isSectionText ? "#505A5F" : "",
            marginBottom: props.inline ? "8px" : "revert"
          },
          className: field !== null && field !== void 0 && field.disable ? "disabled" : ""
        }, t(field.label), field.isMandatory ? " * " : null, field.labelChildren && field.labelChildren), errors && errors[(_field$populators8 = field.populators) === null || _field$populators8 === void 0 ? void 0 : _field$populators8.name] && Object.keys(errors[(_field$populators9 = field.populators) === null || _field$populators9 === void 0 ? void 0 : _field$populators9.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, null, t(field.populators.error || ((_errors$field$populat2 = errors[(_field$populators10 = field.populators) === null || _field$populators10 === void 0 ? void 0 : _field$populators10.name]) === null || _errors$field$populat2 === void 0 ? void 0 : _errors$field$populat2.message))) : null, /*#__PURE__*/React__default.createElement("div", {
          style: field.withoutLabel ? {
            width: "100%"
          } : {},
          className: "field"
        }, fieldSelector(field.type, field.populators, field.isMandatory, field === null || field === void 0 ? void 0 : field.disable, field === null || field === void 0 ? void 0 : field.component, field), (field === null || field === void 0 ? void 0 : field.description) && /*#__PURE__*/React__default.createElement(CardLabel, {
          style: _extends({
            marginTop: "-24px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#505A5F"
          }, field === null || field === void 0 ? void 0 : field.descriptionStyles)
        }, t(field.description)))));
        return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(LabelFieldPair, {
          key: index
        }, !field.withoutLabel && /*#__PURE__*/React__default.createElement(CardLabel, {
          style: _extends({
            color: field.isSectionText ? "#505A5F" : "",
            marginBottom: props.inline ? "8px" : "revert"
          }, props.fieldStyle)
        }, t(field.label), field.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
          style: field.withoutLabel ? _extends({
            width: "100%"
          }, props === null || props === void 0 ? void 0 : props.fieldStyle) : {},
          className: "field"
        }, fieldSelector(field.type, field.populators, field.isMandatory, field === null || field === void 0 ? void 0 : field.disable, field === null || field === void 0 ? void 0 : field.component, field), (field === null || field === void 0 ? void 0 : field.description) && /*#__PURE__*/React__default.createElement(CardText, {
          style: {
            fontSize: "14px",
            marginTop: "-24px"
          }
        }, t(field === null || field === void 0 ? void 0 : field.description)))), field !== null && field !== void 0 && (_field$populators11 = field.populators) !== null && _field$populators11 !== void 0 && _field$populators11.name && errors && errors[field === null || field === void 0 ? void 0 : (_field$populators12 = field.populators) === null || _field$populators12 === void 0 ? void 0 : _field$populators12.name] && Object.keys(errors[field === null || field === void 0 ? void 0 : (_field$populators13 = field.populators) === null || _field$populators13 === void 0 ? void 0 : _field$populators13.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, {
          style: {
            width: "70%",
            marginLeft: "30%",
            fontSize: "12px",
            marginTop: "-21px"
          }
        }, t(field === null || field === void 0 ? void 0 : (_field$populators14 = field.populators) === null || _field$populators14 === void 0 ? void 0 : _field$populators14.error)) : null);
      }), !props.noBreakLine && (array.length - 1 === index ? null : /*#__PURE__*/React__default.createElement(BreakLine, {
        style: props !== null && props !== void 0 && props.breaklineStyle ? props === null || props === void 0 ? void 0 : props.breaklineStyle : {}
      })));
    });
  }, [props.config, formData]);
  var getCardStyles = function getCardStyles(shouldDisplay) {
    if (shouldDisplay === void 0) {
      shouldDisplay = true;
    }
    var styles = props.cardStyle || {};
    if (props.noBoxShadow) styles = _extends({}, styles, {
      boxShadow: "none"
    });
    if (!shouldDisplay) styles = _extends({}, styles, {
      display: "none"
    });
    return styles;
  };
  var isDisabled = props.isDisabled || false;
  var checkKeyDown = function checkKeyDown(e) {
    var keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      e.preventDefault();
    }
  };
  var _useState = React.useState(props.horizontalNavConfig ? (_props$horizontalNavC = props.horizontalNavConfig) === null || _props$horizontalNavC === void 0 ? void 0 : _props$horizontalNavC[0].name : null),
    activeLink = _useState[0],
    setActiveLink = _useState[1];
  React.useEffect(function () {
    var _props$horizontalNavC2;
    setActiveLink((_props$horizontalNavC2 = props.horizontalNavConfig) === null || _props$horizontalNavC2 === void 0 ? void 0 : _props$horizontalNavC2[0].name);
  }, [props.horizontalNavConfig]);
  var renderFormFields = function renderFormFields(props, section, index, array, sectionFormCategory) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, !props.childrenAtTheBottom && props.children, props.heading && /*#__PURE__*/React__default.createElement(CardSubHeader, {
      style: _extends({}, props.headingStyle)
    }, " ", props.heading, " "), props.description && /*#__PURE__*/React__default.createElement(CardLabelDesc, {
      className: "repos"
    }, " ", props.description, " "), props.text && /*#__PURE__*/React__default.createElement(CardText, null, props.text), formFields(section, index, array, sectionFormCategory), props.childrenAtTheBottom && props.children, props.submitInForm && /*#__PURE__*/React__default.createElement(SubmitBar, {
      label: t(props.label),
      style: _extends({}, props === null || props === void 0 ? void 0 : props.buttonStyle),
      submit: "submit",
      disabled: isDisabled,
      className: "w-full"
    }), props.secondaryActionLabel && /*#__PURE__*/React__default.createElement("div", {
      className: "primary-label-btn",
      style: {
        margin: "20px auto 0 auto"
      },
      onClick: onSecondayActionClick
    }, props.secondaryActionLabel));
  };
  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    onKeyDown: function onKeyDown(e) {
      return checkKeyDown(e);
    },
    id: props.formId,
    className: props.className
  }, props !== null && props !== void 0 && props.showMultipleCardsWithoutNavs ? props === null || props === void 0 ? void 0 : (_props$config2 = props.config) === null || _props$config2 === void 0 ? void 0 : _props$config2.map(function (section, index, array) {
    return !section.navLink && /*#__PURE__*/React__default.createElement(Card, {
      style: getCardStyles(),
      noCardStyle: props.noCardStyle
    }, renderFormFields(props, section, index, array));
  }) : /*#__PURE__*/React__default.createElement(Card, {
    style: getCardStyles(),
    noCardStyle: props.noCardStyle
  }, props === null || props === void 0 ? void 0 : (_props$config3 = props.config) === null || _props$config3 === void 0 ? void 0 : _props$config3.map(function (section, index, array) {
    return !section.navLink && /*#__PURE__*/React__default.createElement(React.Fragment, null, renderFormFields(props, section, index, array));
  })), (props === null || props === void 0 ? void 0 : props.showNavs) && props.horizontalNavConfig && /*#__PURE__*/React__default.createElement(HorizontalNav, {
    configNavItems: props.horizontalNavConfig ? props.horizontalNavConfig : null,
    showNav: true,
    activeLink: activeLink,
    setActiveLink: setActiveLink
  }, props !== null && props !== void 0 && props.showMultipleCardsInNavs ? props === null || props === void 0 ? void 0 : (_props$config4 = props.config) === null || _props$config4 === void 0 ? void 0 : _props$config4.map(function (section, index, array) {
    return section.navLink ? /*#__PURE__*/React__default.createElement(Card, {
      style: section.navLink !== activeLink ? getCardStyles(false) : getCardStyles(),
      noCardStyle: props.noCardStyle
    }, renderFormFields(props, section, index, array, section === null || section === void 0 ? void 0 : section.sectionFormCategory)) : null;
  }) : /*#__PURE__*/React__default.createElement(Card, {
    style: getCardStyles(),
    noCardStyle: props.noCardStyle
  }, props === null || props === void 0 ? void 0 : (_props$config5 = props.config) === null || _props$config5 === void 0 ? void 0 : _props$config5.map(function (section, index, array) {
    return section.navLink ? /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      style: section.navLink !== activeLink ? {
        display: "none"
      } : {}
    }, renderFormFields(props, section, index, array, section === null || section === void 0 ? void 0 : section.sectionFormCategory))) : null;
  }))), !props.submitInForm && props.label && /*#__PURE__*/React__default.createElement(ActionBar, null, /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(props.label),
    submit: "submit",
    disabled: isDisabled
  }), props.onSkip && props.showSkip && /*#__PURE__*/React__default.createElement(LinkButton, {
    style: props === null || props === void 0 ? void 0 : props.skipStyle,
    label: t("CS_SKIP_CONTINUE"),
    onClick: props.onSkip
  })));
};

var UploadFileComposer = function UploadFileComposer(_ref) {
  var _data$works, _data$works$DocumentC, _docConfig$documents;
  var module = _ref.module,
    config = _ref.config,
    Controller = _ref.Controller,
    control = _ref.control,
    register = _ref.register,
    formData = _ref.formData,
    errors = _ref.errors,
    localePrefix = _ref.localePrefix,
    customClass = _ref.customClass;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var tenant = Digit.ULBService.getStateId();
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomMDMS(tenant, "works", [{
      "name": "DocumentConfig",
      "filter": "[?(@.module=='" + module + "')]"
    }]),
    data = _Digit$Hooks$useCusto.data;
  var docConfig = data === null || data === void 0 ? void 0 : (_data$works = data.works) === null || _data$works === void 0 ? void 0 : (_data$works$DocumentC = _data$works.DocumentConfig) === null || _data$works$DocumentC === void 0 ? void 0 : _data$works$DocumentC[0];
  var documentFileTypeMappings = {
    docx: "vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    png: "png",
    pdf: "pdf",
    jpeg: "jpeg",
    jpg: "jpeg",
    xls: "vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "csv"
  };
  var getRegex = function getRegex(allowedFormats) {
    if (allowedFormats !== null && allowedFormats !== void 0 && allowedFormats.length) {
      var exceptedFileTypes = [];
      allowedFormats === null || allowedFormats === void 0 ? void 0 : allowedFormats.forEach(function (allowedFormat) {
        exceptedFileTypes.push(documentFileTypeMappings[allowedFormat]);
      });
      exceptedFileTypes = exceptedFileTypes.join("|");
      return new RegExp("(.*?)(" + exceptedFileTypes + ")$");
    }
    return /(.*?)(pdf|docx|jpeg|jpg|png|msword|openxmlformats-officedocument|wordprocessingml|document|spreadsheetml|sheet)$/;
  };
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Header, {
    styles: {
      fontSize: "24px",
      marginTop: "40px"
    }
  }, t('WORKS_RELEVANT_DOCUMENTS')), /*#__PURE__*/React__default.createElement(CitizenInfoLabel, {
    info: t("ES_COMMON_INFO"),
    text: t(docConfig === null || docConfig === void 0 ? void 0 : docConfig.bannerLabel),
    className: "doc-banner"
  }), docConfig === null || docConfig === void 0 ? void 0 : (_docConfig$documents = docConfig.documents) === null || _docConfig$documents === void 0 ? void 0 : _docConfig$documents.map(function (item, index) {
    var _errors, _errors2;
    if (!(item !== null && item !== void 0 && item.active)) return;
    return /*#__PURE__*/React__default.createElement(LabelFieldPair, {
      key: index,
      style: {
        alignItems: item !== null && item !== void 0 && item.showTextInput ? "flex-start" : "center"
      }
    }, item.code && /*#__PURE__*/React__default.createElement(CardLabel, {
      className: "bolder",
      style: {
        marginTop: item !== null && item !== void 0 && item.showTextInput ? "10px" : ""
      }
    }, t(localePrefix + "_" + (item === null || item === void 0 ? void 0 : item.code)), " ", item !== null && item !== void 0 && item.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, item !== null && item !== void 0 && item.showTextInput ? /*#__PURE__*/React__default.createElement(TextInput, {
      style: {
        "marginBottom": "16px"
      },
      name: (config === null || config === void 0 ? void 0 : config.name) + "." + (item === null || item === void 0 ? void 0 : item.name) + "_name",
      placeholder: t('ES_COMMON_ENTER_NAME'),
      inputRef: register({
        minLength: 2
      })
    }) : null, /*#__PURE__*/React__default.createElement("div", {
      style: {
        marginBottom: '24px'
      }
    }, /*#__PURE__*/React__default.createElement(Controller, {
      render: function render(_ref2) {
        var _ref2$value = _ref2.value,
          value = _ref2$value === void 0 ? [] : _ref2$value,
          onChange = _ref2.onChange;
        function getFileStoreData(filesData) {
          var numberOfFiles = filesData.length;
          if (numberOfFiles > 0) {
            filesData.forEach(function (value) {
            });
          }
          onChange(numberOfFiles > 0 ? filesData : []);
        }
        return /*#__PURE__*/React__default.createElement(MultiUploadWrapper, {
          t: t,
          module: "works",
          getFormState: getFileStoreData,
          setuploadedstate: value || [],
          showHintBelow: item !== null && item !== void 0 && item.hintText ? true : false,
          hintText: item === null || item === void 0 ? void 0 : item.hintText,
          allowedFileTypesRegex: getRegex(item === null || item === void 0 ? void 0 : item.allowedFileTypes),
          allowedMaxSizeInMB: (item === null || item === void 0 ? void 0 : item.maxSizeInMB) || (docConfig === null || docConfig === void 0 ? void 0 : docConfig.maxSizeInMB) || 5,
          maxFilesAllowed: (item === null || item === void 0 ? void 0 : item.maxFilesAllowed) || 1,
          customErrorMsg: item === null || item === void 0 ? void 0 : item.customErrorMsg,
          customClass: customClass,
          tenantId: Digit.ULBService.getCurrentTenantId()
        });
      },
      rules: {
        validate: function validate(value) {
          return !(item !== null && item !== void 0 && item.isMandatory && (value === null || value === void 0 ? void 0 : value.length) === 0);
        }
      },
      defaultValue: formData === null || formData === void 0 ? void 0 : formData[item === null || item === void 0 ? void 0 : item.name],
      name: (config === null || config === void 0 ? void 0 : config.name) + "." + (item === null || item === void 0 ? void 0 : item.name),
      control: control
    }), errors && (_errors = errors["" + (config === null || config === void 0 ? void 0 : config.name)]) !== null && _errors !== void 0 && _errors["" + (item === null || item === void 0 ? void 0 : item.name)] && Object.keys((_errors2 = errors["" + (config === null || config === void 0 ? void 0 : config.name)]) === null || _errors2 === void 0 ? void 0 : _errors2["" + (item === null || item === void 0 ? void 0 : item.name)]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, {
      style: {
        fontSize: "12px"
      }
    }, t(config === null || config === void 0 ? void 0 : config.error)) : null)));
  }));
};

var Paragraph = function Paragraph(props) {
  var value = props.value,
    customClassName = props.customClassName,
    customStyle = props.customStyle,
    inputRef = props.inputRef;
  return /*#__PURE__*/React__default.createElement("p", {
    className: "fc-paragraph " + customClassName,
    style: customStyle,
    ref: inputRef
  }, value);
};

var LocationDropdownWrapper = function LocationDropdownWrapper(_ref) {
  var _props$value, _props$value2, _props$value3;
  var populators = _ref.populators,
    formData = _ref.formData,
    props = _ref.props,
    inputRef = _ref.inputRef,
    errors = _ref.errors,
    setValue = _ref.setValue;
  var _useState = React.useState([]),
    options = _useState[0],
    setOptions = _useState[1];
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _Digit$Hooks$useLocat = Digit.Hooks.useLocation(tenantId, 'Ward', {
      select: function select(data) {
        var _data$TenantBoundary$;
        var wards = [];
        var localities = {};
        data === null || data === void 0 ? void 0 : (_data$TenantBoundary$ = data.TenantBoundary[0]) === null || _data$TenantBoundary$ === void 0 ? void 0 : _data$TenantBoundary$.boundary.forEach(function (item) {
          localities[item === null || item === void 0 ? void 0 : item.code] = item === null || item === void 0 ? void 0 : item.children.map(function (item) {
            return {
              code: item.code,
              name: item.name,
              i18nKey: headerLocale + "_ADMIN_" + (item === null || item === void 0 ? void 0 : item.code),
              label: item === null || item === void 0 ? void 0 : item.label
            };
          });
          wards.push({
            code: item.code,
            name: item.name,
            i18nKey: headerLocale + "_ADMIN_" + (item === null || item === void 0 ? void 0 : item.code)
          });
        });
        return {
          wards: wards,
          localities: localities
        };
      }
    }),
    isLoading = _Digit$Hooks$useLocat.isLoading,
    wardsAndLocalities = _Digit$Hooks$useLocat.data;
  React.useEffect(function () {
    if (wardsAndLocalities) {
      if (populators.type === "ward") {
        setOptions(wardsAndLocalities === null || wardsAndLocalities === void 0 ? void 0 : wardsAndLocalities.wards);
      } else {
        var _formData$ward;
        var locs = [];
        var selectedWardsCodes = formData === null || formData === void 0 ? void 0 : (_formData$ward = formData.ward) === null || _formData$ward === void 0 ? void 0 : _formData$ward.map(function (row) {
          return row.code;
        });
        selectedWardsCodes === null || selectedWardsCodes === void 0 ? void 0 : selectedWardsCodes.forEach(function (code) {
          var _wardsAndLocalities$l;
          locs = [].concat(locs, wardsAndLocalities === null || wardsAndLocalities === void 0 ? void 0 : (_wardsAndLocalities$l = wardsAndLocalities.localities) === null || _wardsAndLocalities$l === void 0 ? void 0 : _wardsAndLocalities$l[code]);
        });
        setOptions(locs);
      }
    }
  }, [wardsAndLocalities, formData === null || formData === void 0 ? void 0 : formData.ward]);
  if (isLoading) return /*#__PURE__*/React__default.createElement(Loader, null);
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, populators.allowMultiSelect && /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "grid",
      gridAutoFlow: "row"
    }
  }, /*#__PURE__*/React__default.createElement(MultiSelectDropdown, {
    options: options,
    optionsKey: populators === null || populators === void 0 ? void 0 : populators.optionsKey,
    props: props,
    isPropsNeeded: true,
    onSelect: function onSelect(e) {
      if (populators.type === "ward") {
        setValue('locality', []);
      }
      props.onChange(e === null || e === void 0 ? void 0 : e.map(function (row) {
        return row !== null && row !== void 0 && row[1] ? row[1] : null;
      }).filter(function (e) {
        return e;
      }));
    },
    selected: props === null || props === void 0 ? void 0 : props.value,
    defaultLabel: t(populators === null || populators === void 0 ? void 0 : populators.defaultText),
    defaultUnit: t(populators === null || populators === void 0 ? void 0 : populators.selectedText),
    config: populators
  })), !populators.allowMultiSelect && /*#__PURE__*/React__default.createElement(Dropdown, {
    inputRef: inputRef,
    style: {
      display: "flex",
      justifyContent: "space-between"
    },
    option: options,
    key: populators.name,
    optionKey: populators === null || populators === void 0 ? void 0 : populators.optionsKey,
    value: (_props$value = props.value) === null || _props$value === void 0 ? void 0 : _props$value[0],
    select: function select(e) {
      props.onChange([e], populators.name);
    },
    selected: ((_props$value2 = props.value) === null || _props$value2 === void 0 ? void 0 : _props$value2[0]) || populators.defaultValue,
    defaultValue: ((_props$value3 = props.value) === null || _props$value3 === void 0 ? void 0 : _props$value3[0]) || populators.defaultValue,
    t: t,
    errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name],
    optionCardStyles: populators === null || populators === void 0 ? void 0 : populators.optionsCustomStyle
  }));
};

var ApiDropdown = function ApiDropdown(_ref) {
  var _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit$Customizations3, _props$value, _props$value2, _props$value3;
  var populators = _ref.populators,
    props = _ref.props,
    inputRef = _ref.inputRef,
    errors = _ref.errors;
  var _useState = React.useState([]),
    options = _useState[0],
    setOptions = _useState[1];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var reqCriteria = (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations[populators === null || populators === void 0 ? void 0 : populators.masterName]) === null || _Digit$Customizations2 === void 0 ? void 0 : (_Digit$Customizations3 = _Digit$Customizations2[populators === null || populators === void 0 ? void 0 : populators.moduleName]) === null || _Digit$Customizations3 === void 0 ? void 0 : _Digit$Customizations3[populators === null || populators === void 0 ? void 0 : populators.customfn]();
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomAPIHook(reqCriteria),
    isApiLoading = _Digit$Hooks$useCusto.isLoading,
    apiData = _Digit$Hooks$useCusto.data;
  React.useEffect(function () {
    setOptions(apiData);
  }, [apiData]);
  if (isApiLoading) return /*#__PURE__*/React__default.createElement(Loader, null);
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, populators.allowMultiSelect && /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "grid",
      gridAutoFlow: "row"
    }
  }, /*#__PURE__*/React__default.createElement(MultiSelectDropdown, {
    options: options,
    optionsKey: populators === null || populators === void 0 ? void 0 : populators.optionsKey,
    props: props,
    isPropsNeeded: true,
    onSelect: function onSelect(e) {
      props.onChange(e === null || e === void 0 ? void 0 : e.map(function (row) {
        return row !== null && row !== void 0 && row[1] ? row[1] : null;
      }).filter(function (e) {
        return e;
      }));
    },
    selected: props === null || props === void 0 ? void 0 : props.value,
    defaultLabel: t(populators === null || populators === void 0 ? void 0 : populators.defaultText),
    defaultUnit: t(populators === null || populators === void 0 ? void 0 : populators.selectedText),
    config: populators
  })), !populators.allowMultiSelect && /*#__PURE__*/React__default.createElement(Dropdown, {
    inputRef: inputRef,
    style: {
      display: "flex",
      justifyContent: "space-between"
    },
    option: options,
    key: populators.name,
    optionKey: populators === null || populators === void 0 ? void 0 : populators.optionsKey,
    value: (_props$value = props.value) === null || _props$value === void 0 ? void 0 : _props$value[0],
    select: function select(e) {
      props.onChange([e], populators.name);
    },
    selected: ((_props$value2 = props.value) === null || _props$value2 === void 0 ? void 0 : _props$value2[0]) || populators.defaultValue,
    defaultValue: ((_props$value3 = props.value) === null || _props$value3 === void 0 ? void 0 : _props$value3[0]) || populators.defaultValue,
    t: t,
    errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name],
    optionCardStyles: populators === null || populators === void 0 ? void 0 : populators.optionsCustomStyle
  }));
};

var buildYupConfig = function buildYupConfig(jsonConfig, t) {
  var _jsonConfig$required, _Object$keys;
  var errorConfig = {
    errMessages: {}
  };
  jsonConfig === null || jsonConfig === void 0 ? void 0 : (_jsonConfig$required = jsonConfig.required) === null || _jsonConfig$required === void 0 ? void 0 : _jsonConfig$required.map(function (code) {
    errorConfig.errMessages[code] = {
      required: "please enter the value for " + code
    };
  });
  (_Object$keys = Object.keys(jsonConfig === null || jsonConfig === void 0 ? void 0 : jsonConfig.properties)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.map(function (code) {
    if (errorConfig.errMessages[code]) {
      errorConfig.errMessages[code] = _extends({}, errorConfig.errMessages[code], {
        format: "invalid value entered for " + code
      });
    } else {
      errorConfig.errMessages[code] = {
        format: "invalid value entered for " + code,
        "typeError": "invalid type, enter a valid " + code
      };
    }
  });
  var yupSchema = jsonSchemaToYup.buildYup(jsonConfig, errorConfig);
  return yupSchema;
};

var wrapperStyles$1 = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  border: "solid",
  borderRadius: "5px",
  padding: "10px",
  paddingTop: "20px",
  marginTop: "10px",
  borderColor: "#f3f3f3",
  background: "#FAFAFA",
  marginBottom: "20px"
};
var FormComposer$1 = function FormComposer(props) {
  var _props$appData2, _props$config, _props$config2, _props$config3, _props$config4;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var inputProps = {
    defaultValues: props.defaultValues
  };
  if (props !== null && props !== void 0 && props.jsonSchema) {
    var yupSchema = (props === null || props === void 0 ? void 0 : props.jsonSchema) && buildYupConfig(props === null || props === void 0 ? void 0 : props.jsonSchema);
    inputProps["resolver"] = yup.yupResolver(yupSchema);
  }
  var _useForm = reactHookForm.useForm(inputProps),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    setValue = _useForm.setValue,
    getValues = _useForm.getValues,
    reset = _useForm.reset,
    watch = _useForm.watch,
    trigger = _useForm.trigger,
    control = _useForm.control,
    formState = _useForm.formState,
    errors = _useForm.errors,
    setError = _useForm.setError,
    clearErrors = _useForm.clearErrors,
    unregister = _useForm.unregister;
  var formData = watch();
  var selectedFormCategory = props === null || props === void 0 ? void 0 : props.currentFormCategory;
  var _useState = React.useState(false),
    showErrorToast = _useState[0],
    setShowErrorToast = _useState[1];
  var _useState2 = React.useState(false),
    customToast = _useState2[0],
    setCustomToast = _useState2[1];
  React.useEffect(function () {
    clearErrors();
  }, [selectedFormCategory]);
  React.useEffect(function () {
    if (Object.keys(formState === null || formState === void 0 ? void 0 : formState.errors).length > 0 && (formState === null || formState === void 0 ? void 0 : formState.submitCount) > 0) {
      setShowErrorToast(true);
    }
  }, [formState === null || formState === void 0 ? void 0 : formState.errors, formState === null || formState === void 0 ? void 0 : formState.submitCount]);
  React.useEffect(function () {
    var _Object$keys, _props$appData, _props$appData$Connec, _formData$ConnectionH;
    if (props !== null && props !== void 0 && props.appData && ((_Object$keys = Object.keys(props === null || props === void 0 ? void 0 : props.appData)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.length) > 0 && (!_.isEqual(props === null || props === void 0 ? void 0 : props.appData, formData) || !_.isEqual(props === null || props === void 0 ? void 0 : (_props$appData = props.appData) === null || _props$appData === void 0 ? void 0 : (_props$appData$Connec = _props$appData.ConnectionHolderDetails) === null || _props$appData$Connec === void 0 ? void 0 : _props$appData$Connec[0], formData === null || formData === void 0 ? void 0 : (_formData$ConnectionH = formData.ConnectionHolderDetails) === null || _formData$ConnectionH === void 0 ? void 0 : _formData$ConnectionH[0]))) {
      reset(_extends({}, props === null || props === void 0 ? void 0 : props.appData));
    }
  }, [props === null || props === void 0 ? void 0 : props.appData, formData, props === null || props === void 0 ? void 0 : (_props$appData2 = props.appData) === null || _props$appData2 === void 0 ? void 0 : _props$appData2.ConnectionHolderDetails]);
  React.useEffect(function () {
    props.getFormAccessors && props.getFormAccessors({
      setValue: setValue,
      getValues: getValues
    });
  }, []);
  React.useEffect(function () {
    setCustomToast(props === null || props === void 0 ? void 0 : props.customToast);
  }, [props === null || props === void 0 ? void 0 : props.customToast]);
  function onSubmit(data) {
    props.onSubmit(data);
  }
  function onSecondayActionClick(data) {
    props.onSecondayActionClick();
  }
  React.useEffect(function () {
    props.onFormValueChange && props.onFormValueChange(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues);
  }, [formData]);
  var fieldSelector = function fieldSelector(type, populators, isMandatory, disable, component, config, sectionFormCategory) {
    var _config$populators, _config$populators$va;
    if (disable === void 0) {
      disable = false;
    }
    var disableFormValidation = false;
    if (sectionFormCategory && selectedFormCategory) {
      disableFormValidation = sectionFormCategory !== selectedFormCategory ? true : false;
    }
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    var customValidation = config === null || config === void 0 ? void 0 : (_config$populators = config.populators) === null || _config$populators === void 0 ? void 0 : (_config$populators$va = _config$populators.validation) === null || _config$populators$va === void 0 ? void 0 : _config$populators$va.customValidation;
    var customRules = customValidation ? {
      validate: customValidation
    } : {};
    var customProps = config === null || config === void 0 ? void 0 : config.customProps;
    switch (type) {
      case "date":
      case "text":
      case "number":
      case "password":
      case "time":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "field-container"
        }, populators !== null && populators !== void 0 && populators.componentInFront ? /*#__PURE__*/React__default.createElement("span", {
          className: "component-in-front " + (disable && "disabled")
        }, populators.componentInFront) : null, /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          render: function render(_ref) {
            var _populators$validatio, _populators$validatio2, _populators$validatio3, _populators$validatio4;
            var onChange = _ref.onChange,
              ref = _ref.ref;
            return /*#__PURE__*/React__default.createElement(TextInput, {
              value: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              type: type,
              name: populators.name,
              onChange: onChange,
              inputRef: ref,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name],
              max: populators === null || populators === void 0 ? void 0 : (_populators$validatio = populators.validation) === null || _populators$validatio === void 0 ? void 0 : _populators$validatio.max,
              min: populators === null || populators === void 0 ? void 0 : (_populators$validatio2 = populators.validation) === null || _populators$validatio2 === void 0 ? void 0 : _populators$validatio2.min,
              disable: disable,
              style: type === "date" ? {
                paddingRight: "3px"
              } : "",
              maxlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio3 = populators.validation) === null || _populators$validatio3 === void 0 ? void 0 : _populators$validatio3.maxlength,
              minlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio4 = populators.validation) === null || _populators$validatio4 === void 0 ? void 0 : _populators$validatio4.minlength,
              customIcon: populators === null || populators === void 0 ? void 0 : populators.customIcon,
              customClass: populators === null || populators === void 0 ? void 0 : populators.customClass
            });
          },
          name: populators.name,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation, customRules) : {},
          control: control
        }));
      case "amount":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "field-container"
        }, populators !== null && populators !== void 0 && populators.componentInFront ? /*#__PURE__*/React__default.createElement("span", {
          className: "component-in-front " + (disable && "disabled")
        }, populators.componentInFront) : null, /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          render: function render(_ref2) {
            var _populators$validatio5, _populators$validatio6, _populators$validatio7, _populators$validatio8;
            var onChange = _ref2.onChange,
              ref = _ref2.ref;
            return /*#__PURE__*/React__default.createElement(InputTextAmount, {
              value: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              type: "text",
              name: populators.name,
              onChange: onChange,
              inputRef: ref,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name],
              max: populators === null || populators === void 0 ? void 0 : (_populators$validatio5 = populators.validation) === null || _populators$validatio5 === void 0 ? void 0 : _populators$validatio5.max,
              min: populators === null || populators === void 0 ? void 0 : (_populators$validatio6 = populators.validation) === null || _populators$validatio6 === void 0 ? void 0 : _populators$validatio6.min,
              disable: disable,
              style: type === "date" ? {
                paddingRight: "3px"
              } : "",
              maxlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio7 = populators.validation) === null || _populators$validatio7 === void 0 ? void 0 : _populators$validatio7.maxlength,
              minlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio8 = populators.validation) === null || _populators$validatio8 === void 0 ? void 0 : _populators$validatio8.minlength,
              customIcon: populators === null || populators === void 0 ? void 0 : populators.customIcon,
              customClass: populators === null || populators === void 0 ? void 0 : populators.customClass,
              prefix: populators === null || populators === void 0 ? void 0 : populators.prefix,
              intlConfig: populators === null || populators === void 0 ? void 0 : populators.intlConfig
            });
          },
          name: populators.name,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation, customRules) : {},
          control: control
        }));
      case "textarea":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          render: function render(_ref3) {
            var _populators$validatio9, _populators$validatio10;
            var onChange = _ref3.onChange,
              ref = _ref3.ref;
            return /*#__PURE__*/React__default.createElement(TextArea, {
              className: "field fullWidth",
              value: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              type: type,
              name: populators.name,
              onChange: onChange,
              inputRef: ref,
              disable: disable,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name],
              style: {
                marginTop: 0
              },
              maxlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio9 = populators.validation) === null || _populators$validatio9 === void 0 ? void 0 : _populators$validatio9.maxlength,
              minlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio10 = populators.validation) === null || _populators$validatio10 === void 0 ? void 0 : _populators$validatio10.minlength
            });
          },
          name: populators.name,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          control: control
        });
      case "paragraph":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "field-container"
        }, /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          render: function render(_ref4) {
            var ref = _ref4.ref;
            return /*#__PURE__*/React__default.createElement(Paragraph, {
              value: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              name: populators.name,
              inputRef: ref,
              customClass: populators === null || populators === void 0 ? void 0 : populators.customClass,
              customStyle: populators === null || populators === void 0 ? void 0 : populators.customStyle
            });
          },
          name: populators.name,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          control: control
        }));
      case "mobileNumber":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(MobileNumber, _extends({
              inputRef: props.ref,
              className: "field fullWidth",
              onChange: props.onChange,
              value: props.value,
              disable: disable
            }, props, {
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            }));
          },
          defaultValue: populators.defaultValue,
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          control: control
        });
      case "custom":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return populators.component(_extends({}, props, {
              setValue: setValue
            }), populators.customProps);
          },
          defaultValue: populators.defaultValue,
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          control: control
        });
      case "checkbox":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: {
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          },
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, /*#__PURE__*/React__default.createElement(CheckBox, {
              onChange: function onChange(e) {
                props.onChange(e.target.checked);
              },
              value: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              checked: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              label: t("" + (populators === null || populators === void 0 ? void 0 : populators.title)),
              styles: populators === null || populators === void 0 ? void 0 : populators.styles,
              style: populators === null || populators === void 0 ? void 0 : populators.labelStyles,
              customLabelMarkup: populators === null || populators === void 0 ? void 0 : populators.customLabelMarkup
            }));
          }
        });
      case "multiupload":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          rules: !disableFormValidation ? {
            required: false
          } : {},
          render: function render(_ref5) {
            var onChange = _ref5.onChange,
              _ref5$value = _ref5.value,
              value = _ref5$value === void 0 ? [] : _ref5$value;
            function getFileStoreData(filesData) {
              var numberOfFiles = filesData.length;
              if (numberOfFiles > 0) {
                filesData.forEach(function (value) {
                });
              }
              onChange(numberOfFiles > 0 ? filesData : []);
            }
            return /*#__PURE__*/React__default.createElement(MultiUploadWrapper, {
              t: t,
              module: "works",
              tenantId: Digit.ULBService.getCurrentTenantId(),
              getFormState: getFileStoreData,
              showHintBelow: populators !== null && populators !== void 0 && populators.showHintBelow ? true : false,
              setuploadedstate: value || [],
              allowedFileTypesRegex: populators.allowedFileTypes,
              allowedMaxSizeInMB: populators.allowedMaxSizeInMB,
              hintText: populators.hintText,
              maxFilesAllowed: populators.maxFilesAllowed,
              extraStyleName: {
                padding: "0.5rem"
              },
              customClass: populators === null || populators === void 0 ? void 0 : populators.customClass,
              customErrorMsg: populators === null || populators === void 0 ? void 0 : populators.errorMessage,
              containerStyles: _extends({}, populators === null || populators === void 0 ? void 0 : populators.containerStyles)
            });
          }
        });
      case "select":
      case "radio":
      case "dropdown":
      case "radioordropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(CustomDropdown, {
              t: t,
              label: config === null || config === void 0 ? void 0 : config.label,
              type: type,
              onBlur: props.onBlur,
              value: props.value,
              inputRef: props.ref,
              onChange: props.onChange,
              config: populators,
              disable: config === null || config === void 0 ? void 0 : config.disable,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            });
          },
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          name: config.key,
          control: control
        });
      case "component":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(Component, {
              userType: "employee",
              t: t,
              setValue: setValue,
              onSelect: setValue,
              config: config,
              data: formData,
              formData: formData,
              register: register,
              errors: errors,
              props: _extends({}, props, customProps),
              setError: setError,
              clearErrors: clearErrors,
              formState: formState,
              onBlur: props.onBlur,
              control: control,
              sectionFormCategory: sectionFormCategory,
              selectedFormCategory: selectedFormCategory,
              getValues: getValues,
              watch: watch,
              unregister: unregister
            });
          },
          name: config.key,
          rules: !disableFormValidation ? _extends({
            required: isMandatory
          }, populators.validation) : {},
          control: control
        });
      case "documentUpload":
        return /*#__PURE__*/React__default.createElement(UploadFileComposer, {
          module: config === null || config === void 0 ? void 0 : config.module,
          config: config,
          Controller: reactHookForm.Controller,
          register: register,
          formData: formData,
          errors: errors,
          control: control,
          customClass: config === null || config === void 0 ? void 0 : config.customClass,
          customErrorMsg: config === null || config === void 0 ? void 0 : config.error,
          localePrefix: config === null || config === void 0 ? void 0 : config.localePrefix
        });
      case "form":
        return /*#__PURE__*/React__default.createElement("form", null, /*#__PURE__*/React__default.createElement(Component, {
          userType: "employee",
          t: t,
          setValue: setValue,
          onSelect: setValue,
          config: config,
          data: formData,
          formData: formData,
          register: register,
          errors: errors,
          setError: setError,
          clearErrors: clearErrors,
          formState: formState,
          control: control
        }));
      case "object":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: _extends({
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          }, populators.validation),
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, "object");
          }
        });
      case "array":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: _extends({
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          }, populators.validation),
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, "array");
          }
        });
      case "locationdropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: _extends({
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          }, populators.validation),
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, /*#__PURE__*/React__default.createElement(LocationDropdownWrapper, {
              props: props,
              populators: populators,
              formData: formData,
              inputRef: props.ref,
              errors: errors,
              setValue: setValue
            }));
          }
        });
      case "apidropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: _extends({
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          }, populators.validation),
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, /*#__PURE__*/React__default.createElement(ApiDropdown, {
              props: props,
              populators: populators,
              formData: formData,
              inputRef: props.ref,
              errors: errors,
              t: t,
              label: config === null || config === void 0 ? void 0 : config.label,
              type: type,
              onBlur: props.onBlur,
              value: props.value,
              onChange: props.onChange,
              config: populators,
              disable: config === null || config === void 0 ? void 0 : config.disable,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            }));
          }
        });
      case "multiselectdropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: {
            required: isMandatory
          },
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, /*#__PURE__*/React__default.createElement(MultiSelectDropdown, {
              options: populators === null || populators === void 0 ? void 0 : populators.options,
              optionsKey: populators === null || populators === void 0 ? void 0 : populators.optionsKey,
              props: props,
              isPropsNeeded: true,
              onSelect: function onSelect(e) {
                props.onChange(e === null || e === void 0 ? void 0 : e.map(function (row) {
                  return row !== null && row !== void 0 && row[1] ? row[1] : null;
                }).filter(function (e) {
                  return e;
                }));
              },
              selected: (props === null || props === void 0 ? void 0 : props.value) || [],
              defaultLabel: t(populators === null || populators === void 0 ? void 0 : populators.defaultText),
              defaultUnit: t(populators === null || populators === void 0 ? void 0 : populators.selectedText),
              config: populators
            }));
          }
        });
      default:
        return (populators === null || populators === void 0 ? void 0 : populators.dependency) !== false ? populators : null;
    }
  };
  var getCombinedStyle = function getCombinedStyle(placementinBox) {
    switch (placementinBox) {
      case 0:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "10px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          marginBottom: "20px"
        };
      case 1:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "-30px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          borderTop: "0px",
          borderBottom: "0px"
        };
      case 2:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "-30px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          marginBottom: "20px",
          borderTop: "0px"
        };
    }
  };
  var titleStyle = {
    color: "#505A5F",
    fontWeight: "700",
    fontSize: "16px"
  };
  var getCombinedComponent = function getCombinedComponent(section) {
    if (section.head && section.subHead) {
      return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(CardSectionHeader, {
        style: props !== null && props !== void 0 && props.sectionHeadStyle ? props === null || props === void 0 ? void 0 : props.sectionHeadStyle : {
          margin: "5px 0px"
        },
        id: section.headId
      }, t(section.head)), /*#__PURE__*/React__default.createElement(CardSectionHeader, {
        style: titleStyle,
        id: section.headId + "_DES"
      }, t(section.subHead)));
    } else if (section.head) {
      return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(CardSectionHeader, {
        style: props !== null && props !== void 0 && props.sectionHeadStyle ? props === null || props === void 0 ? void 0 : props.sectionHeadStyle : {},
        id: section.headId
      }, t(section.head)));
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  };
  var closeToast = function closeToast() {
    setShowErrorToast(false);
    setCustomToast(false);
    (props === null || props === void 0 ? void 0 : props.updateCustomToast) && (props === null || props === void 0 ? void 0 : props.updateCustomToast(false));
  };
  React.useEffect(function () {
    if (showErrorToast) {
      setTimeout(function () {
        closeToast();
      }, 3000);
    }
  }, [showErrorToast]);
  var formFields = React.useCallback(function (section, index, array, sectionFormCategory) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, section && getCombinedComponent(section), section.body.map(function (field, index) {
      var _field$populators, _field$populators2, _field$populators3, _errors$field$populat, _field$populators4, _field$populators5, _field$populators6, _field$populators7, _field$populators8, _field$populators9, _errors$field$populat2, _field$populators10, _field$populators11;
      if (field !== null && field !== void 0 && (_field$populators = field.populators) !== null && _field$populators !== void 0 && _field$populators.hideInForm) return null;
      if (props.inline) return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement("div", {
        style: field.isInsideBox ? getCombinedStyle(field === null || field === void 0 ? void 0 : field.placementinbox) : {}
      }, !field.withoutLabel && /*#__PURE__*/React__default.createElement(CardLabel, {
        style: {
          color: field.isSectionText ? "#505A5F" : "",
          marginBottom: props.inline ? "8px" : "revert"
        },
        className: field !== null && field !== void 0 && field.disable ? "disabled " + (props !== null && props !== void 0 && props.labelBold ? 'bolder' : "") : "" + (props !== null && props !== void 0 && props.labelBold ? 'bolder' : "")
      }, t(field.label), field.isMandatory ? " * " : null, field.labelChildren && field.labelChildren), errors && errors[(_field$populators2 = field.populators) === null || _field$populators2 === void 0 ? void 0 : _field$populators2.name] && Object.keys(errors[(_field$populators3 = field.populators) === null || _field$populators3 === void 0 ? void 0 : _field$populators3.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, null, t(field.populators.error || ((_errors$field$populat = errors[(_field$populators4 = field.populators) === null || _field$populators4 === void 0 ? void 0 : _field$populators4.name]) === null || _errors$field$populat === void 0 ? void 0 : _errors$field$populat.message))) : null, /*#__PURE__*/React__default.createElement("div", {
        style: field.withoutLabel ? {
          width: "100%"
        } : {},
        className: "field"
      }, fieldSelector(field.type, field.populators, field.isMandatory, field === null || field === void 0 ? void 0 : field.disable, field === null || field === void 0 ? void 0 : field.component, field, sectionFormCategory), (field === null || field === void 0 ? void 0 : field.description) && /*#__PURE__*/React__default.createElement(CardLabel, {
        style: _extends({
          marginTop: "-24px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#505A5F"
        }, field === null || field === void 0 ? void 0 : field.descriptionStyles),
        className: "bolder"
      }, t(field.description)))));
      return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(LabelFieldPair, {
        key: index,
        style: props !== null && props !== void 0 && props.showWrapperContainers && !field.hideContainer ? _extends({}, wrapperStyles$1, field === null || field === void 0 ? void 0 : (_field$populators5 = field.populators) === null || _field$populators5 === void 0 ? void 0 : _field$populators5.customStyle) : _extends({
          border: "none",
          background: "white"
        }, field === null || field === void 0 ? void 0 : (_field$populators6 = field.populators) === null || _field$populators6 === void 0 ? void 0 : _field$populators6.customStyle)
      }, !field.withoutLabel && /*#__PURE__*/React__default.createElement(CardLabel, {
        style: {
          color: field.isSectionText ? "#505A5F" : "",
          marginBottom: props.inline ? "8px" : "revert",
          fontWeight: props.isDescriptionBold ? "600" : null
        },
        className: "bolder"
      }, t(field.label), field !== null && field !== void 0 && field.appendColon ? ' : ' : null, field.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
        style: field.withoutLabel ? _extends({
          width: "100%"
        }, props === null || props === void 0 ? void 0 : props.fieldStyle) : _extends({}, props === null || props === void 0 ? void 0 : props.fieldStyle),
        className: "field"
      }, fieldSelector(field.type, field.populators, field.isMandatory, field === null || field === void 0 ? void 0 : field.disable, field === null || field === void 0 ? void 0 : field.component, field, sectionFormCategory), (field === null || field === void 0 ? void 0 : field.description) && /*#__PURE__*/React__default.createElement(CardText, {
        style: {
          fontSize: "14px",
          marginTop: "-24px"
        }
      }, t(field === null || field === void 0 ? void 0 : field.description)))), field !== null && field !== void 0 && (_field$populators7 = field.populators) !== null && _field$populators7 !== void 0 && _field$populators7.name && errors && errors[field === null || field === void 0 ? void 0 : (_field$populators8 = field.populators) === null || _field$populators8 === void 0 ? void 0 : _field$populators8.name] && Object.keys(errors[field === null || field === void 0 ? void 0 : (_field$populators9 = field.populators) === null || _field$populators9 === void 0 ? void 0 : _field$populators9.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, {
        style: {
          width: "70%",
          marginLeft: "30%",
          fontSize: "12px",
          marginTop: "-21px"
        }
      }, t((errors === null || errors === void 0 ? void 0 : (_errors$field$populat2 = errors[field === null || field === void 0 ? void 0 : (_field$populators10 = field.populators) === null || _field$populators10 === void 0 ? void 0 : _field$populators10.name]) === null || _errors$field$populat2 === void 0 ? void 0 : _errors$field$populat2.message) || (field === null || field === void 0 ? void 0 : (_field$populators11 = field.populators) === null || _field$populators11 === void 0 ? void 0 : _field$populators11.error))) : null);
    }), !props.noBreakLine && (array.length - 1 === index ? null : /*#__PURE__*/React__default.createElement(BreakLine, {
      style: props !== null && props !== void 0 && props.breaklineStyle ? props === null || props === void 0 ? void 0 : props.breaklineStyle : {}
    })));
  }, [props.config, formData]);
  var getCardStyles = function getCardStyles(shouldDisplay) {
    if (shouldDisplay === void 0) {
      shouldDisplay = true;
    }
    var styles = props.cardStyle || {};
    if (props.noBoxShadow) styles = _extends({}, styles, {
      boxShadow: "none"
    });
    if (!shouldDisplay) styles = _extends({}, styles, {
      display: "none"
    });
    return styles;
  };
  var isDisabled = props.isDisabled || false;
  var checkKeyDown = function checkKeyDown(e) {
  };
  var setActiveNavByDefault = function setActiveNavByDefault(configNav) {
    var _configNav$;
    var setActiveByDefaultRow = null;
    configNav === null || configNav === void 0 ? void 0 : configNav.forEach(function (row) {
      if (row !== null && row !== void 0 && row.activeByDefault) {
        setActiveByDefaultRow = row;
      }
    });
    if (setActiveByDefaultRow) {
      var _setActiveByDefaultRo;
      return (_setActiveByDefaultRo = setActiveByDefaultRow) === null || _setActiveByDefaultRo === void 0 ? void 0 : _setActiveByDefaultRo.name;
    }
    return configNav === null || configNav === void 0 ? void 0 : (_configNav$ = configNav[0]) === null || _configNav$ === void 0 ? void 0 : _configNav$.name;
  };
  var _useState3 = React.useState(props.horizontalNavConfig ? setActiveNavByDefault(props.horizontalNavConfig) : null),
    activeLink = _useState3[0],
    setActiveLink = _useState3[1];
  React.useEffect(function () {
    setActiveLink(setActiveNavByDefault(props.horizontalNavConfig));
  }, [props.horizontalNavConfig]);
  var renderFormFields = function renderFormFields(props, section, index, array, sectionFormCategory) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, !props.childrenAtTheBottom && props.children, props.heading && /*#__PURE__*/React__default.createElement(CardSubHeader, {
      style: _extends({}, props.headingStyle)
    }, " ", props.heading, " "), props.description && /*#__PURE__*/React__default.createElement(CardLabelDesc, {
      className: "repos"
    }, " ", props.description, " "), props.text && /*#__PURE__*/React__default.createElement(CardText, null, props.text), formFields(section, index, array, sectionFormCategory), props.childrenAtTheBottom && props.children, props.submitInForm && /*#__PURE__*/React__default.createElement(SubmitBar, {
      label: t(props.label),
      style: _extends({}, props === null || props === void 0 ? void 0 : props.buttonStyle),
      submit: "submit",
      disabled: isDisabled,
      className: "w-full"
    }), props.secondaryActionLabel && /*#__PURE__*/React__default.createElement("div", {
      className: "primary-label-btn",
      style: {
        margin: "20px auto 0 auto"
      },
      onClick: onSecondayActionClick
    }, props.secondaryActionLabel));
  };
  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    onKeyDown: function onKeyDown(e) {
      return checkKeyDown();
    },
    id: props.formId,
    className: props.className
  }, (props === null || props === void 0 ? void 0 : props.headerLabel) && /*#__PURE__*/React__default.createElement(Header, {
    className: "digit-form-composer-header"
  }, t(props.headerLabel)), props !== null && props !== void 0 && props.showMultipleCardsWithoutNavs ? props === null || props === void 0 ? void 0 : (_props$config = props.config) === null || _props$config === void 0 ? void 0 : _props$config.map(function (section, index, array) {
    return !section.navLink && /*#__PURE__*/React__default.createElement(Card, {
      style: getCardStyles(),
      noCardStyle: props.noCardStyle,
      className: props.cardClassName
    }, renderFormFields(props, section, index, array));
  }) : /*#__PURE__*/React__default.createElement(Card, {
    style: getCardStyles(),
    noCardStyle: props.noCardStyle,
    className: props.cardClassName
  }, props === null || props === void 0 ? void 0 : (_props$config2 = props.config) === null || _props$config2 === void 0 ? void 0 : _props$config2.map(function (section, index, array) {
    return !section.navLink && /*#__PURE__*/React__default.createElement(React.Fragment, null, renderFormFields(props, section, index, array));
  })), (props === null || props === void 0 ? void 0 : props.showFormInNav) && props.horizontalNavConfig && /*#__PURE__*/React__default.createElement(HorizontalNav, {
    configNavItems: props.horizontalNavConfig ? props.horizontalNavConfig : null,
    showNav: props === null || props === void 0 ? void 0 : props.showNavs,
    activeLink: activeLink,
    setActiveLink: setActiveLink
  }, props !== null && props !== void 0 && props.showMultipleCardsInNavs ? props === null || props === void 0 ? void 0 : (_props$config3 = props.config) === null || _props$config3 === void 0 ? void 0 : _props$config3.map(function (section, index, array) {
    return section.navLink ? /*#__PURE__*/React__default.createElement(Card, {
      style: section.navLink !== activeLink ? getCardStyles(false) : getCardStyles(),
      noCardStyle: props.noCardStyle
    }, renderFormFields(props, section, index, array, section === null || section === void 0 ? void 0 : section.sectionFormCategory)) : null;
  }) : /*#__PURE__*/React__default.createElement(Card, {
    style: getCardStyles(),
    noCardStyle: props.noCardStyle
  }, props === null || props === void 0 ? void 0 : (_props$config4 = props.config) === null || _props$config4 === void 0 ? void 0 : _props$config4.map(function (section, index, array) {
    return section.navLink ? /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      style: section.navLink !== activeLink ? {
        display: "none"
      } : {}
    }, renderFormFields(props, section, index, array, section === null || section === void 0 ? void 0 : section.sectionFormCategory))) : null;
  }))), !props.submitInForm && props.label && /*#__PURE__*/React__default.createElement(ActionBar, null, /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(props.label),
    submit: "submit",
    disabled: isDisabled
  }), props.onSkip && props.showSkip && /*#__PURE__*/React__default.createElement(LinkButton, {
    style: props === null || props === void 0 ? void 0 : props.skipStyle,
    label: t("CS_SKIP_CONTINUE"),
    onClick: props.onSkip
  })), showErrorToast && /*#__PURE__*/React__default.createElement(Toast$1, {
    error: true,
    label: t("ES_COMMON_PLEASE_ENTER_ALL_MANDATORY_FIELDS"),
    isDleteBtn: true,
    onClose: closeToast
  }), customToast && /*#__PURE__*/React__default.createElement(Toast$1, {
    error: customToast === null || customToast === void 0 ? void 0 : customToast.error,
    label: t(customToast === null || customToast === void 0 ? void 0 : customToast.label),
    isDleteBtn: true,
    onClose: closeToast
  }));
};

var WorkflowStatusFilter = function WorkflowStatusFilter(_ref) {
  var props = _ref.props,
    t = _ref.t,
    populators = _ref.populators,
    formData = _ref.formData,
    inboxResponse = _ref.inboxResponse;
  var _useState = React.useState(null),
    statusMap = _useState[0],
    setStatusMap = _useState[1];
  React.useEffect(function () {
    if (inboxResponse) {
      var _inboxResponse$status;
      setStatusMap((_inboxResponse$status = inboxResponse.statusMap) === null || _inboxResponse$status === void 0 ? void 0 : _inboxResponse$status.map(function (row) {
        return {
          uuid: row.statusid,
          state: row.state || row.applicationstatus,
          businessService: row === null || row === void 0 ? void 0 : row.businessservice
        };
      }));
    }
  }, [inboxResponse]);
  if (!statusMap && !inboxResponse) return /*#__PURE__*/React__default.createElement(Loader, null);
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, statusMap && statusMap.length > 0 && (populators === null || populators === void 0 ? void 0 : populators.componentLabel) && /*#__PURE__*/React__default.createElement(CardLabel, {
    style: _extends({}, props.labelStyle, {
      marginBottom: "0.4rem"
    })
  }, t(populators === null || populators === void 0 ? void 0 : populators.componentLabel), populators !== null && populators !== void 0 && populators.isMandatory ? " * " : null), statusMap === null || statusMap === void 0 ? void 0 : statusMap.map(function (row) {
    var _formData$populators$;
    return /*#__PURE__*/React__default.createElement(CheckBox, {
      onChange: function onChange(e) {
        var _extends2;
        var obj = _extends({}, props.value, (_extends2 = {}, _extends2[e.target.value] = e.target.checked, _extends2));
        props.onChange(obj);
      },
      value: row.uuid,
      checked: formData === null || formData === void 0 ? void 0 : (_formData$populators$ = formData[populators.name]) === null || _formData$populators$ === void 0 ? void 0 : _formData$populators$[row.uuid],
      label: t(Digit.Utils.locale.getTransformedLocale("" + populators.labelPrefix + (row === null || row === void 0 ? void 0 : row.businessService) + "_STATE_" + (row === null || row === void 0 ? void 0 : row.state)))
    });
  }));
};

var _excluded$9 = ["data"];
var RenderFormFields = function RenderFormFields(_ref) {
  var data = _ref.data,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$9);
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var fields = props.fields,
    control = props.control,
    formData = props.formData,
    errors = props.errors,
    register = props.register,
    setValue = props.setValue,
    getValues = props.getValues,
    setError = props.setError,
    clearErrors = props.clearErrors,
    apiDetails = props.apiDetails;
  var fieldSelector = function fieldSelector(type, populators, isMandatory, disable, component, config) {
    var _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit$Customizations3, _config$additionalVal, _config$additionalVal2;
    if (disable === void 0) {
      disable = false;
    }
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    var customValidations = config !== null && config !== void 0 && config.additionalValidation ? (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit$Customizations2 === void 0 ? void 0 : (_Digit$Customizations3 = _Digit$Customizations2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit$Customizations3 === void 0 ? void 0 : _Digit$Customizations3.additionalValidations(config === null || config === void 0 ? void 0 : (_config$additionalVal = config.additionalValidation) === null || _config$additionalVal === void 0 ? void 0 : _config$additionalVal.type, formData, config === null || config === void 0 ? void 0 : (_config$additionalVal2 = config.additionalValidation) === null || _config$additionalVal2 === void 0 ? void 0 : _config$additionalVal2.keys) : null;
    var customRules = customValidations ? {
      validate: customValidations
    } : {};
    switch (type) {
      case "date":
      case "text":
      case "number":
      case "password":
      case "time":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          render: function render(_ref2) {
            var _populators$validatio, _populators$validatio2;
            var onChange = _ref2.onChange,
              ref = _ref2.ref;
            return /*#__PURE__*/React__default.createElement(TextInput, {
              value: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              type: type,
              name: populators.name,
              onChange: onChange,
              inputRef: ref,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name],
              max: populators.max,
              disable: disable,
              style: type === "date" ? {
                paddingRight: "3px"
              } : "",
              maxlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio = populators.validation) === null || _populators$validatio === void 0 ? void 0 : _populators$validatio.maxlength,
              minlength: populators === null || populators === void 0 ? void 0 : (_populators$validatio2 = populators.validation) === null || _populators$validatio2 === void 0 ? void 0 : _populators$validatio2.minlength
            });
          },
          name: populators.name,
          rules: _extends({
            required: isMandatory
          }, populators.validation, customRules),
          control: control
        });
      case "textarea":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          render: function render(_ref3) {
            var onChange = _ref3.onChange,
              ref = _ref3.ref;
            return /*#__PURE__*/React__default.createElement(TextArea, {
              className: "field",
              value: formData === null || formData === void 0 ? void 0 : formData[populators.name],
              type: type,
              name: populators.name,
              onChange: onChange,
              inputRef: ref,
              disable: disable,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            });
          },
          name: populators.name,
          rules: _extends({
            required: isMandatory
          }, populators.validation),
          control: control
        });
      case "mobileNumber":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(MobileNumber, _extends({
              inputRef: props.ref,
              className: "field fullWidth",
              onChange: props.onChange,
              value: props.value,
              disable: disable
            }, props, {
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            }));
          },
          defaultValue: populators.defaultValue,
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          rules: _extends({
            required: isMandatory
          }, populators.validation),
          control: control
        });
      case "multiupload":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          rules: {
            required: false
          },
          render: function render(_ref4) {
            var onChange = _ref4.onChange,
              _ref4$value = _ref4.value,
              value = _ref4$value === void 0 ? [] : _ref4$value;
            function getFileStoreData(filesData) {
              var numberOfFiles = filesData.length;
              if (numberOfFiles > 0) {
                filesData.forEach(function (value) {
                });
              }
              onChange(numberOfFiles > 0 ? filesData : []);
            }
            return /*#__PURE__*/React__default.createElement(MultiUploadWrapper, {
              t: t,
              module: "works",
              tenantId: Digit.ULBService.getCurrentTenantId(),
              getFormState: getFileStoreData,
              showHintBelow: populators !== null && populators !== void 0 && populators.showHintBelow ? true : false,
              setuploadedstate: value,
              allowedFileTypesRegex: populators.allowedFileTypes,
              allowedMaxSizeInMB: populators.allowedMaxSizeInMB,
              hintText: populators.hintText,
              maxFilesAllowed: populators.maxFilesAllowed,
              extraStyleName: {
                padding: "0.5rem"
              },
              customClass: populators === null || populators === void 0 ? void 0 : populators.customClass
            });
          }
        });
      case "custom":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return populators.component(_extends({}, props, {
              setValue: setValue
            }), populators.customProps);
          },
          defaultValue: populators.defaultValue,
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          control: control
        });
      case "radio":
      case "dropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(CustomDropdown, {
              t: t,
              label: config === null || config === void 0 ? void 0 : config.label,
              type: type,
              onBlur: props.onBlur,
              value: props.value,
              inputRef: props.ref,
              onChange: props.onChange,
              config: populators,
              disable: config === null || config === void 0 ? void 0 : config.disable,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            });
          },
          rules: _extends({
            required: isMandatory
          }, populators.validation),
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          control: control
        });
      case "multiselectdropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: {
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          },
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, /*#__PURE__*/React__default.createElement(MultiSelectDropdown, {
              options: populators === null || populators === void 0 ? void 0 : populators.options,
              optionsKey: populators === null || populators === void 0 ? void 0 : populators.optionsKey,
              props: props,
              isPropsNeeded: true,
              onSelect: function onSelect(e) {
                props.onChange(e === null || e === void 0 ? void 0 : e.map(function (row) {
                  return row !== null && row !== void 0 && row[1] ? row[1] : null;
                }).filter(function (e) {
                  return e;
                }));
              },
              selected: props === null || props === void 0 ? void 0 : props.value,
              defaultLabel: t(populators === null || populators === void 0 ? void 0 : populators.defaultText),
              defaultUnit: t(populators === null || populators === void 0 ? void 0 : populators.selectedText),
              config: populators
            }));
          }
        });
      case "locationdropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: _extends({
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          }, populators.validation),
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, /*#__PURE__*/React__default.createElement(LocationDropdownWrapper, {
              props: props,
              populators: populators,
              formData: formData,
              inputRef: props.ref,
              errors: errors,
              setValue: setValue
            }));
          }
        });
      case "apidropdown":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: _extends({
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          }, populators.validation),
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, /*#__PURE__*/React__default.createElement(ApiDropdown, {
              props: props,
              populators: populators,
              formData: formData,
              inputRef: props.ref,
              errors: errors
            }));
          }
        });
      case "workflowstatesfilter":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          name: "" + populators.name,
          control: control,
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          rules: {
            required: populators === null || populators === void 0 ? void 0 : populators.isMandatory
          },
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement("div", {
              style: {
                display: "grid",
                gridAutoFlow: "row"
              }
            }, /*#__PURE__*/React__default.createElement(WorkflowStatusFilter, {
              inboxResponse: data,
              props: props,
              populators: populators,
              t: t,
              formData: formData
            }));
          }
        });
      case "dateRange":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            var _formData$populators$;
            return /*#__PURE__*/React__default.createElement(DateRangeNew, {
              t: t,
              values: formData === null || formData === void 0 ? void 0 : (_formData$populators$ = formData[populators.name]) === null || _formData$populators$ === void 0 ? void 0 : _formData$populators$.range,
              name: populators.name,
              onFilterChange: props.onChange,
              inputRef: props.ref,
              errorStyle: errors === null || errors === void 0 ? void 0 : errors[populators.name]
            });
          },
          rules: _extends({
            required: isMandatory
          }, populators.validation),
          defaultValue: formData === null || formData === void 0 ? void 0 : formData[populators.name],
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          control: control
        });
      case "component":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(Component, {
              userType: "employee",
              t: t,
              setValue: setValue,
              onSelect: setValue,
              config: config,
              data: formData,
              formData: formData,
              register: register,
              errors: errors,
              props: props,
              setError: setError,
              clearErrors: clearErrors,
              onBlur: props.onBlur,
              control: control,
              getValues: getValues,
              responseData: data
            });
          },
          name: config === null || config === void 0 ? void 0 : config.key,
          control: control
        });
      default:
        return (populators === null || populators === void 0 ? void 0 : populators.dependency) !== false ? populators : null;
    }
  };
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, fields === null || fields === void 0 ? void 0 : fields.map(function (item, index) {
    var _item$populators, _item$populators2, _item$populators3, _item$populators4;
    return /*#__PURE__*/React__default.createElement(LabelFieldPair, {
      key: index
    }, item.label && /*#__PURE__*/React__default.createElement(CardLabel, {
      style: _extends({}, props.labelStyle, {
        marginBottom: "0.4rem"
      })
    }, t(item.label), item !== null && item !== void 0 && item.isMandatory ? " * " : null), fieldSelector(item.type, item.populators, item.isMandatory, item === null || item === void 0 ? void 0 : item.disable, item === null || item === void 0 ? void 0 : item.component, item), item !== null && item !== void 0 && (_item$populators = item.populators) !== null && _item$populators !== void 0 && _item$populators.name && errors && errors[item === null || item === void 0 ? void 0 : (_item$populators2 = item.populators) === null || _item$populators2 === void 0 ? void 0 : _item$populators2.name] && Object.keys(errors[item === null || item === void 0 ? void 0 : (_item$populators3 = item.populators) === null || _item$populators3 === void 0 ? void 0 : _item$populators3.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, {
      style: {
        fontSize: "12px",
        marginTop: "-20px"
      }
    }, t(item === null || item === void 0 ? void 0 : (_item$populators4 = item.populators) === null || _item$populators4 === void 0 ? void 0 : _item$populators4.error)) : null);
  }));
};

var ResponseComposer = function ResponseComposer(_ref) {
  var data = _ref.data,
    template = _ref.template,
    actionButtonLabel = _ref.actionButtonLabel,
    _onSubmit = _ref.onSubmit;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  return /*#__PURE__*/React__default.createElement("div", null, data.map(function (result, i) {
    return /*#__PURE__*/React__default.createElement(Card, {
      key: i,
      className: "box-shadow-none"
    }, template.map(function (field, j) {
      var _result$privacy, _result$privacy2;
      return /*#__PURE__*/React__default.createElement(KeyNote, {
        key: i + "" + j,
        keyValue: t(field.label),
        note: field.notePrefix ? field.notePrefix + result[field.key] : result[field.key],
        noteStyle: field.noteStyle,
        privacy: result !== null && result !== void 0 && (_result$privacy = result.privacy) !== null && _result$privacy !== void 0 && _result$privacy[field.key] ? result === null || result === void 0 ? void 0 : (_result$privacy2 = result.privacy) === null || _result$privacy2 === void 0 ? void 0 : _result$privacy2[field.key] : null
      });
    }), actionButtonLabel && result.status !== "INACTIVE" && /*#__PURE__*/React__default.createElement(SubmitBar, {
      submit: false,
      label: t(actionButtonLabel),
      onSubmit: function onSubmit() {
        _onSubmit(result);
      }
    }), result.status === "INACTIVE" && /*#__PURE__*/React__default.createElement(CitizenInfoLabel, {
      style: {
        margin: "0px"
      },
      info: t("CS_FILE_APPLICATION_INFO_LABEL"),
      text: t("CS_INACTIVE_PROPERTY_NOT_ELIGIBLE")
    }));
  }));
};
ResponseComposer.propTypes = {
  data: propTypes.array,
  template: propTypes.array,
  actionButtonLabel: propTypes.string,
  onSubmit: propTypes.func
};
ResponseComposer.defaultProps = {
  data: [],
  template: [],
  actionButtonLabel: "",
  onSubmit: function onSubmit() {}
};

var SearchField = function SearchField(_ref) {
  var children = _ref.children,
    className = _ref.className;
  var isMobile = window.Digit.Utils.browser.isMobile();
  var isEnabledCommonModules = window.location.href.includes("/obps/") || window.location.href.includes("/noc/") || window.location.href.includes("/ws/water/bill-amendment/inbox") || window.location.href.includes("/ws/sewerage/bill-amendment/inbox");
  var disbaleModules = window.location.href.includes("obps/search") || window.location.href.includes("noc/search");
  if (isEnabledCommonModules && !isMobile && !disbaleModules) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "input-fields",
      style: {
        marginTop: "5px"
      }
    }, children);
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "form-field " + (className || "")
  }, children);
};
var SearchForm = function SearchForm(_ref2) {
  var children = _ref2.children,
    onSubmit = _ref2.onSubmit,
    handleSubmit = _ref2.handleSubmit,
    id = _ref2.id,
    _ref2$className = _ref2.className,
    className = _ref2$className === void 0 ? "" : _ref2$className;
  var isMobile = window.Digit.Utils.browser.isMobile();
  var isEnabledCommonModules = window.location.href.includes("/obps/") || window.location.href.includes("/noc/") || window.location.href.includes("/ws/water/bill-amendment/inbox") || window.location.href.includes("/ws/sewerage/bill-amendment/inbox");
  var disbaleModules = window.location.href.includes("obps/search") || window.location.href.includes("noc/search");
  if (isEnabledCommonModules && !isMobile && !disbaleModules) {
    return /*#__PURE__*/React__default.createElement("form", {
      onSubmit: handleSubmit(onSubmit),
      id: id
    }, children);
  }
  return /*#__PURE__*/React__default.createElement("form", {
    className: "search-form-wrapper " + className,
    onSubmit: handleSubmit(onSubmit),
    id: id
  }, children);
};

var FilterFormField = function FilterFormField(_ref) {
  var children = _ref.children,
    className = _ref.className;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "filter-form-field " + className
  }, children);
};
var FilterForm = function FilterForm(_ref2) {
  var _ref2$onMobileExclusi = _ref2.onMobileExclusiveFilterPopupFormClose,
    onMobileExclusiveFilterPopupFormClose = _ref2$onMobileExclusi === void 0 ? function () {
      return null;
    } : _ref2$onMobileExclusi,
    _ref2$closeButton = _ref2.closeButton,
    closeButton = _ref2$closeButton === void 0 ? function () {
      return null;
    } : _ref2$closeButton,
    _ref2$showMobileFilte = _ref2.showMobileFilterFormPopup,
    showMobileFilterFormPopup = _ref2$showMobileFilte === void 0 ? false : _ref2$showMobileFilte,
    children = _ref2.children,
    _ref2$id = _ref2.id,
    id = _ref2$id === void 0 ? "" : _ref2$id,
    onSubmit = _ref2.onSubmit,
    handleSubmit = _ref2.handleSubmit,
    _ref2$onResetFilterFo = _ref2.onResetFilterForm,
    onResetFilterForm = _ref2$onResetFilterFo === void 0 ? function () {
      return null;
    } : _ref2$onResetFilterFo,
    _ref2$className = _ref2.className,
    className = _ref2$className === void 0 ? "" : _ref2$className;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var isMobile = window.Digit.Utils.browser.isMobile();
  var isEnabledCommonModules = window.location.href.includes("/obps/") || window.location.href.includes("/noc/") || window.location.href.includes("/ws/water/bill-amendment/inbox") || window.location.href.includes("/ws/sewerage/bill-amendment/inbox");
  return /*#__PURE__*/React__default.createElement("div", {
    className: isEnabledCommonModules && !isMobile ? "filter " + className : "filter-form " + className
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-card"
  }, closeButton(), /*#__PURE__*/React__default.createElement("div", {
    className: "heading",
    style: {
      alignItems: "center",
      gap: ".75rem",
      marginBottom: "24px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label",
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 22 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z",
    fill: "#505A5F"
  }))), /*#__PURE__*/React__default.createElement("span", {
    style: {
      marginLeft: "8px",
      fontWeight: "normal"
    }
  }, t("FILTERS_FILTER_CARD_CAPTION"), ":")), /*#__PURE__*/React__default.createElement("div", {
    className: "clearAll",
    onClick: onResetFilterForm
  }, t("ES_COMMON_CLEAR_ALL")), /*#__PURE__*/React__default.createElement("span", {
    className: "clear-search",
    onClick: onResetFilterForm,
    style: {
      border: "1px solid #e0e0e0",
      padding: "6px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React__default.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 16 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z",
    fill: "#505A5F"
  }))), showMobileFilterFormPopup ? /*#__PURE__*/React__default.createElement("span", {
    onClick: onMobileExclusiveFilterPopupFormClose,
    className: "mobile-only"
  }, /*#__PURE__*/React__default.createElement(CloseSvg, null)) : null), /*#__PURE__*/React__default.createElement("form", {
    id: id,
    onSubmit: handleSubmit(onSubmit)
  }, children), /*#__PURE__*/React__default.createElement(SubmitBar, {
    className: "w-fullwidth",
    label: t("ES_COMMON_APPLY"),
    submit: true,
    form: id
  })));
};

var SearchAction = function SearchAction(_ref) {
  var text = _ref.text,
    handleActionClick = _ref.handleActionClick;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "searchAction",
    onClick: handleActionClick
  }, /*#__PURE__*/React__default.createElement(SearchIconSvg, null), " ", /*#__PURE__*/React__default.createElement("span", {
    className: "searchText"
  }, text));
};

var _excluded$a = ["text", "handleActionClick"];
var FilterAction = function FilterAction(_ref) {
  var text = _ref.text,
    handleActionClick = _ref.handleActionClick,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$a);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "searchAction",
    onClick: handleActionClick
  }, /*#__PURE__*/React__default.createElement(RoundedLabel, {
    count: props.filterCount
  }), /*#__PURE__*/React__default.createElement(FilterSvg, null), " ", /*#__PURE__*/React__default.createElement("span", {
    className: "searchText"
  }, text));
};

var _excluded$b = ["text", "handleActionClick"];
var SortAction = function SortAction(_ref) {
  var text = _ref.text,
    handleActionClick = _ref.handleActionClick,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$b);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "searchAction svgPrimaryH16px",
    onClick: handleActionClick
  }, /*#__PURE__*/React__default.createElement(RoundedLabel, {
    count: props.filterCount
  }), /*#__PURE__*/React__default.createElement(SortSvg, null), " ", /*#__PURE__*/React__default.createElement("span", {
    className: "searchText"
  }, text));
};

var Details$1 = function Details(_ref) {
  var label = _ref.label,
    name = _ref.name,
    onClick = _ref.onClick;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "detail",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "label"
  }, /*#__PURE__*/React__default.createElement("h2", null, label)), /*#__PURE__*/React__default.createElement("span", {
    className: "name"
  }, name));
};
var DetailsCard = function DetailsCard(_ref2) {
  var data = _ref2.data,
    serviceRequestIdKey = _ref2.serviceRequestIdKey,
    linkPrefix = _ref2.linkPrefix,
    handleSelect = _ref2.handleSelect,
    selectedItems = _ref2.selectedItems,
    keyForSelected = _ref2.keyForSelected,
    handleDetailCardClick = _ref2.handleDetailCardClick,
    _ref2$isTwoDynamicPre = _ref2.isTwoDynamicPrefix,
    isTwoDynamicPrefix = _ref2$isTwoDynamicPre === void 0 ? false : _ref2$isTwoDynamicPre,
    getRedirectionLink = _ref2.getRedirectionLink,
    _ref2$handleClickEnab = _ref2.handleClickEnabled,
    handleClickEnabled = _ref2$handleClickEnab === void 0 ? true : _ref2$handleClickEnab,
    t = _ref2.t,
    _ref2$showActionBar = _ref2.showActionBar,
    showActionBar = _ref2$showActionBar === void 0 ? true : _ref2$showActionBar,
    _ref2$showCitizenInfo = _ref2.showCitizenInfoLabel,
    showCitizenInfoLabel = _ref2$showCitizenInfo === void 0 ? false : _ref2$showCitizenInfo,
    submitButtonLabel = _ref2.submitButtonLabel;
  if (linkPrefix && serviceRequestIdKey) {
    return /*#__PURE__*/React__default.createElement("div", null, data.map(function (object, itemIndex) {
      return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        key: itemIndex,
        to: isTwoDynamicPrefix ? "" + linkPrefix + (typeof serviceRequestIdKey === "function" ? serviceRequestIdKey(object) : getRedirectionLink(object["Application Type"] === "BPA_STAKEHOLDER_REGISTRATION" ? "BPAREG" : "BPA") + "/" + object[object["Application Type"] === "BPA_STAKEHOLDER_REGISTRATION" ? "applicationNo" : "Application Number"]) : "" + linkPrefix + (typeof serviceRequestIdKey === "function" ? serviceRequestIdKey(object) : object[serviceRequestIdKey])
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "details-container"
      }, Object.keys(object).map(function (name, index) {
        if (name === "applicationNo" || name === "Vehicle Log") return null;
        return /*#__PURE__*/React__default.createElement(Details$1, {
          label: name,
          name: object[name],
          key: index
        });
      })));
    }));
  }
  return /*#__PURE__*/React__default.createElement("div", null, data.map(function (object, itemIndex) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: itemIndex,
      style: {
        border: selectedItems !== null && selectedItems !== void 0 && selectedItems.includes(object[keyForSelected]) ? "2px solid #f47738" : "2px solid #fff"
      },
      className: "details-container",
      onClick: function onClick() {
        return handleClickEnabled && handleSelect(object);
      }
    }, Object.keys(object).filter(function (rowEle) {
      var _object$rowEle;
      return !(typeof object[rowEle] == "object" && ((_object$rowEle = object[rowEle]) === null || _object$rowEle === void 0 ? void 0 : _object$rowEle.hidden) == true);
    }).map(function (name, index) {
      return /*#__PURE__*/React__default.createElement(Details$1, {
        label: name,
        name: object[name],
        key: index,
        onClick: function onClick() {
          return handleClickEnabled && handleDetailCardClick(object);
        }
      });
    }), showCitizenInfoLabel ? /*#__PURE__*/React__default.createElement(CitizenInfoLabel, {
      style: {
        margin: " 2rem 0px",
        padding: "10px",
        backgroundColor: "#FFE2B5",
        borderRadius: "0.25rem"
      },
      textStyle: {
        color: "#CC7B2F"
      },
      info: t("ATM_INFO_LABEL"),
      text: t("ATM_INFO_TEXT"),
      fill: "#CC7B2F"
    }) : null, showActionBar ? /*#__PURE__*/React__default.createElement(SubmitBar, {
      onSubmit: function onSubmit() {
        return handleDetailCardClick(object);
      },
      label: submitButtonLabel
    }) : null);
  }));
};
DetailsCard.propTypes = {
  data: propTypes.array
};
DetailsCard.defaultProps = {
  data: []
};

var _excluded$c = ["setValue", "handleSubmit"];
var MobilePopUpCloseButton = function MobilePopUpCloseButton(_ref) {
  var closeMobilePopupModal = _ref.closeMobilePopupModal;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "InboxMobilePopupCloseButtonWrapper",
    onClick: closeMobilePopupModal
  }, /*#__PURE__*/React__default.createElement(CloseSvg, null));
};
var MobileComponentDirectory = {
  SearchFormComponent: function SearchFormComponent(_ref2) {
    var registerSearchFormField = _ref2.registerSearchFormField,
      searchFormState = _ref2.searchFormState,
      handleSearchFormSubmit = _ref2.handleSearchFormSubmit,
      onResetSearchForm = _ref2.onResetSearchForm,
      SearchFormFields = _ref2.SearchFormFields,
      closeMobilePopupModal = _ref2.closeMobilePopupModal,
      onSearchFormSubmit = _ref2.onSearchFormSubmit,
      t = _ref2.t;
    return /*#__PURE__*/React__default.createElement(SearchForm, {
      onSubmit: function onSubmit(_ref3) {
        var props = _extends({}, (_objectDestructuringEmpty(_ref3), _ref3));
        closeMobilePopupModal();
        onSearchFormSubmit(_extends({}, props));
      },
      handleSubmit: handleSearchFormSubmit,
      id: "search-form",
      className: "rm-mb form-field-flex-one inboxPopupMobileWrapper"
    }, /*#__PURE__*/React__default.createElement(MobilePopUpCloseButton, {
      closeMobilePopupModal: closeMobilePopupModal
    }), /*#__PURE__*/React__default.createElement(SearchFormFields, {
      registerRef: registerSearchFormField,
      searchFormState: searchFormState
    }), /*#__PURE__*/React__default.createElement(ActionBar, {
      style: {
        maxWidth: "100%"
      }
    }, /*#__PURE__*/React__default.createElement(SearchField, {
      className: "submit"
    }, /*#__PURE__*/React__default.createElement(SubmitBar, {
      label: t("ES_COMMON_SEARCH"),
      submit: true,
      form: "search-form"
    }), /*#__PURE__*/React__default.createElement("p", {
      onClick: onResetSearchForm
    }, t("ES_COMMON_CLEAR_ALL")))));
  },
  FilterFormComponent: function FilterFormComponent(_ref4) {
    var registerFilterFormField = _ref4.registerFilterFormField,
      onResetFilterForm = _ref4.onResetFilterForm,
      controlFilterForm = _ref4.controlFilterForm,
      handleFilterFormSubmit = _ref4.handleFilterFormSubmit,
      setFilterFormValue = _ref4.setFilterFormValue,
      getFilterFormValue = _ref4.getFilterFormValue,
      FilterFormFields = _ref4.FilterFormFields,
      closeMobilePopupModal = _ref4.closeMobilePopupModal,
      onFilterFormSubmit = _ref4.onFilterFormSubmit;
    return /*#__PURE__*/React__default.createElement(FilterForm, {
      onSubmit: function onSubmit(_ref5) {
        var props = _extends({}, (_objectDestructuringEmpty(_ref5), _ref5));
        closeMobilePopupModal();
        onFilterFormSubmit(_extends({}, props));
      },
      closeButton: function closeButton() {
        return /*#__PURE__*/React__default.createElement(MobilePopUpCloseButton, {
          closeMobilePopupModal: closeMobilePopupModal
        });
      },
      handleSubmit: handleFilterFormSubmit,
      id: "filter-form",
      onResetFilterForm: onResetFilterForm,
      className: "inboxPopupMobileWrapper p-unset"
    }, /*#__PURE__*/React__default.createElement(FilterFormFields, {
      registerRef: registerFilterFormField,
      controlFilterForm: controlFilterForm,
      handleFilterFormSubmit: handleFilterFormSubmit,
      setFilterFormValue: setFilterFormValue,
      getFilterFormValue: getFilterFormValue
    }));
  },
  SortFormComponent: function SortFormComponent(_ref6) {
    var _ref6$sortFormDefault = _ref6.sortFormDefaultValues,
      sortFormDefaultValues = _ref6$sortFormDefault === void 0 ? {} : _ref6$sortFormDefault,
      closeMobilePopupModal = _ref6.closeMobilePopupModal,
      MobileSortFormValues = _ref6.MobileSortFormValues,
      onMobileSortOrderData = _ref6.onMobileSortOrderData,
      onSortFormReset = _ref6.onSortFormReset,
      t = _ref6.t;
    var _useForm = reactHookForm.useForm({
        defaultValues: sortFormDefaultValues
      }),
      setSortFormValue = _useForm.setValue,
      handleSortFormSubmit = _useForm.handleSubmit,
      methods = _objectWithoutPropertiesLoose(_useForm, _excluded$c);
    function onResetSortForm() {
      closeMobilePopupModal();
      onSortFormReset(setSortFormValue);
    }
    return /*#__PURE__*/React__default.createElement(reactHookForm.FormProvider, _extends({
      setValue: setSortFormValue,
      handleSubmit: handleSortFormSubmit
    }, methods), /*#__PURE__*/React__default.createElement(SearchForm, {
      onSubmit: function onSubmit(_ref7) {
        var props = _extends({}, (_objectDestructuringEmpty(_ref7), _ref7));
        closeMobilePopupModal();
        onMobileSortOrderData(_extends({}, props));
      },
      handleSubmit: handleSortFormSubmit,
      id: "sort-form",
      className: "rm-mb form-field-flex-one inboxPopupMobileWrapper"
    }, /*#__PURE__*/React__default.createElement(MobilePopUpCloseButton, {
      closeMobilePopupModal: closeMobilePopupModal
    }), /*#__PURE__*/React__default.createElement(PopupHeadingLabel, {
      IconSVG: SortSvg,
      headingLabel: t("COMMON_TABLE_SORT"),
      onResetSortForm: onResetSortForm
    }), /*#__PURE__*/React__default.createElement(MobileSortFormValues, null), /*#__PURE__*/React__default.createElement(ActionBar, {
      style: {
        maxWidth: "100%"
      }
    }, /*#__PURE__*/React__default.createElement(SearchField, {
      className: "submit"
    }, /*#__PURE__*/React__default.createElement(SubmitBar, {
      label: t("COMMON_TABLE_SORT"),
      submit: true,
      form: "sort-form"
    }), /*#__PURE__*/React__default.createElement("p", {
      onClick: onResetSortForm
    }, t("ES_COMMON_CLEAR_ALL"))))));
  }
};

var InboxComposer = function InboxComposer(_ref) {
  var _propsForInboxTable$d3;
  var isInboxLoading = _ref.isInboxLoading,
    PropsForInboxLinks = _ref.PropsForInboxLinks,
    SearchFormFields = _ref.SearchFormFields,
    searchFormDefaultValues = _ref.searchFormDefaultValues,
    onSearchFormSubmit = _ref.onSearchFormSubmit,
    onSearchFormReset = _ref.onSearchFormReset,
    FilterFormFields = _ref.FilterFormFields,
    filterFormDefaultValues = _ref.filterFormDefaultValues,
    propsForInboxTable = _ref.propsForInboxTable,
    propsForInboxMobileCards = _ref.propsForInboxMobileCards,
    onFilterFormSubmit = _ref.onFilterFormSubmit,
    onFilterFormReset = _ref.onFilterFormReset,
    onMobileSortOrderData = _ref.onMobileSortOrderData,
    sortFormDefaultValues = _ref.sortFormDefaultValues,
    onSortFormReset = _ref.onSortFormReset,
    inboxFormState = _ref.formState,
    className = _ref.className;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  function activateModal(state, action) {
    switch (action.type) {
      case "set":
        return action.payload;
      case "remove":
        return false;
    }
  }
  var _useReducer = React.useReducer(activateModal, false),
    currentlyActiveMobileModal = _useReducer[0],
    setActiveMobileModal = _useReducer[1];
  var closeMobilePopupModal = function closeMobilePopupModal() {
    setActiveMobileModal({
      type: "remove"
    });
  };
  var _useForm = reactHookForm.useForm({
      defaultValues: _extends({}, searchFormDefaultValues)
    }),
    registerSearchFormField = _useForm.register,
    controlSearchForm = _useForm.control,
    handleSearchFormSubmit = _useForm.handleSubmit,
    setSearchFormValue = _useForm.setValue,
    resetSearchForm = _useForm.reset,
    searchFormState = _useForm.formState,
    clearSearchFormErrors = _useForm.clearErrors;
  var _useForm2 = reactHookForm.useForm({
      defaultValues: _extends({}, filterFormDefaultValues)
    }),
    registerFilterFormField = _useForm2.register,
    controlFilterForm = _useForm2.control,
    handleFilterFormSubmit = _useForm2.handleSubmit,
    setFilterFormValue = _useForm2.setValue,
    getFilterFormValue = _useForm2.getValues,
    resetFilterForm = _useForm2.reset;
  var onResetFilterForm = function onResetFilterForm() {
    onFilterFormReset(setFilterFormValue);
  };
  var onResetSearchForm = function onResetSearchForm() {
    onSearchFormReset(setSearchFormValue);
    clearSearchFormErrors();
    closeMobilePopupModal();
  };
  React.useEffect(function () {
    if (resetFilterForm && resetSearchForm && inboxFormState) {
      resetFilterForm(inboxFormState === null || inboxFormState === void 0 ? void 0 : inboxFormState.filterForm);
      resetSearchForm(inboxFormState === null || inboxFormState === void 0 ? void 0 : inboxFormState.searchForm);
    }
  }, [inboxFormState, resetSearchForm, resetFilterForm]);
  var isMobile = window.Digit.Utils.browser.isMobile();
  if (isMobile) {
    var _propsForInboxMobileC;
    var CurrentMobileModalComponent = React.useCallback(function (_ref2) {
      var props = _extends({}, (_objectDestructuringEmpty(_ref2), _ref2));
      return currentlyActiveMobileModal ? MobileComponentDirectory[currentlyActiveMobileModal](_extends({}, props)) : null;
    }, [currentlyActiveMobileModal]);
    var propsForCurrentMobileModalComponent = {
      SearchFormFields: SearchFormFields,
      FilterFormFields: FilterFormFields,
      registerSearchFormField: registerSearchFormField,
      searchFormState: searchFormState,
      handleSearchFormSubmit: handleSearchFormSubmit,
      onResetSearchForm: onResetSearchForm,
      registerFilterFormField: registerFilterFormField,
      onResetFilterForm: onResetFilterForm,
      controlFilterForm: controlFilterForm,
      handleFilterFormSubmit: handleFilterFormSubmit,
      setFilterFormValue: setFilterFormValue,
      getFilterFormValue: getFilterFormValue,
      closeMobilePopupModal: closeMobilePopupModal,
      onSearchFormSubmit: onSearchFormSubmit,
      onFilterFormSubmit: onFilterFormSubmit,
      onMobileSortOrderData: onMobileSortOrderData,
      sortFormDefaultValues: sortFormDefaultValues,
      onSortFormReset: onSortFormReset,
      MobileSortFormValues: propsForInboxMobileCards === null || propsForInboxMobileCards === void 0 ? void 0 : propsForInboxMobileCards.MobileSortFormValues,
      t: t
    };
    return /*#__PURE__*/React__default.createElement("div", {
      className: "InboxComposerWrapper"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "searchBox"
    }, /*#__PURE__*/React__default.createElement(SearchAction, {
      text: t("ES_COMMON_SEARCH"),
      handleActionClick: function handleActionClick() {
        return setActiveMobileModal({
          type: "set",
          payload: "SearchFormComponent"
        });
      }
    }), /*#__PURE__*/React__default.createElement(FilterAction, {
      text: t("ES_COMMON_FILTER"),
      handleActionClick: function handleActionClick() {
        return setActiveMobileModal({
          type: "set",
          payload: "FilterFormComponent"
        });
      }
    }), /*#__PURE__*/React__default.createElement(SortAction, {
      text: t("COMMON_TABLE_SORT"),
      handleActionClick: function handleActionClick() {
        return setActiveMobileModal({
          type: "set",
          payload: "SortFormComponent"
        });
      }
    })), currentlyActiveMobileModal ? /*#__PURE__*/React__default.createElement(PopUp, null, /*#__PURE__*/React__default.createElement(CurrentMobileModalComponent, propsForCurrentMobileModalComponent)) : null, isInboxLoading ? /*#__PURE__*/React__default.createElement(Loader, null) : /*#__PURE__*/React__default.createElement("div", null, (propsForInboxMobileCards === null || propsForInboxMobileCards === void 0 ? void 0 : (_propsForInboxMobileC = propsForInboxMobileCards.data) === null || _propsForInboxMobileC === void 0 ? void 0 : _propsForInboxMobileC.length) < 1 ? /*#__PURE__*/React__default.createElement(Card, {
      className: "margin-unset text-align-center"
    }, propsForInboxTable !== null && propsForInboxTable !== void 0 && propsForInboxTable.noResultsMessage ? t(propsForInboxTable === null || propsForInboxTable === void 0 ? void 0 : propsForInboxTable.noResultsMessage) : t("CS_MYAPPLICATIONS_NO_APPLICATION")) : /*#__PURE__*/React__default.createElement(DetailsCard, propsForInboxMobileCards)));
  }
  var isEnabledCommonModules = window.location.href.includes("/obps/") || window.location.href.includes("/noc/") || window.location.href.includes("/ws/water/bill-amendment/inbox") || window.location.href.includes("/ws/sewerage/bill-amendment/inbox");
  var isEnabledWSCommonModules = window.location.href.includes("/ws/water/inbox") || window.location.href.includes("/ws/sewerage/inbox");
  if (isEnabledCommonModules) {
    var _propsForInboxTable$d;
    return /*#__PURE__*/React__default.createElement("div", {
      className: "inbox-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filters-container"
    }, /*#__PURE__*/React__default.createElement(InboxLinks, PropsForInboxLinks), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(FilterForm, {
      onSubmit: onFilterFormSubmit,
      handleSubmit: handleFilterFormSubmit,
      id: "filter-form",
      onResetFilterForm: onResetFilterForm
    }, /*#__PURE__*/React__default.createElement(FilterFormFields, {
      registerRef: registerFilterFormField,
      controlFilterForm: controlFilterForm,
      handleFilterFormSubmit: handleFilterFormSubmit,
      setFilterFormValue: setFilterFormValue,
      getFilterFormValue: getFilterFormValue
    })))), /*#__PURE__*/React__default.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React__default.createElement(SearchForm, {
      onSubmit: onSearchFormSubmit,
      handleSubmit: handleSearchFormSubmit,
      id: "search-form",
      className: "rm-mb form-field-flex-one"
    }, /*#__PURE__*/React__default.createElement(SearchFormFields, {
      registerRef: registerSearchFormField,
      searchFormState: searchFormState,
      controlSearchForm: controlSearchForm,
      searchFieldComponents: /*#__PURE__*/React__default.createElement("div", {
        style: window.location.href.includes("/citizen/obps") ? {
          display: "flex"
        } : {}
      }, /*#__PURE__*/React__default.createElement(SubmitBar, {
        label: t("ES_COMMON_SEARCH"),
        submit: true,
        form: "search-form",
        className: "submit-bar-search"
      }), /*#__PURE__*/React__default.createElement("p", {
        onClick: onResetSearchForm,
        className: "clear-search",
        style: {
          paddingTop: "9px",
          color: " #f47738"
        }
      }, t("ES_COMMON_CLEAR_SEARCH")))
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "result",
      style: {
        marginLeft: "24px",
        flex: 1
      }
    }, isInboxLoading ? /*#__PURE__*/React__default.createElement(Loader, null) : /*#__PURE__*/React__default.createElement("div", null, (propsForInboxTable === null || propsForInboxTable === void 0 ? void 0 : (_propsForInboxTable$d = propsForInboxTable.data) === null || _propsForInboxTable$d === void 0 ? void 0 : _propsForInboxTable$d.length) < 1 ? /*#__PURE__*/React__default.createElement(Card, {
      className: "margin-unset text-align-center"
    }, propsForInboxTable.noResultsMessage ? t(propsForInboxTable.noResultsMessage) : t("CS_MYAPPLICATIONS_NO_APPLICATION")) : /*#__PURE__*/React__default.createElement(Table, _extends({
      t: t
    }, propsForInboxTable))))));
  }
  if (isEnabledWSCommonModules) {
    var _propsForInboxTable$d2;
    return /*#__PURE__*/React__default.createElement("div", {
      className: "InboxComposerWrapper " + (className || "")
    }, /*#__PURE__*/React__default.createElement(InboxLinks, PropsForInboxLinks), /*#__PURE__*/React__default.createElement(SearchForm, {
      onSubmit: onSearchFormSubmit,
      handleSubmit: handleSearchFormSubmit,
      id: "search-form",
      className: "search-complaint-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "complaint-input-container " + (className || "")
    }, /*#__PURE__*/React__default.createElement(SearchFormFields, {
      registerRef: registerSearchFormField,
      searchFormState: searchFormState,
      controlSearchForm: controlSearchForm
    }), /*#__PURE__*/React__default.createElement(SearchField, {
      className: "clear-search-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "clear-search"
    }, /*#__PURE__*/React__default.createElement("p", {
      onClick: onResetSearchForm
    }, t("ES_COMMON_CLEAR_SEARCH")))), /*#__PURE__*/React__default.createElement(SearchField, {
      className: "submit"
    }, /*#__PURE__*/React__default.createElement(SubmitBar, {
      label: t("ES_COMMON_SEARCH"),
      submit: true,
      form: "search-form"
    })))), /*#__PURE__*/React__default.createElement(FilterForm, {
      onSubmit: onFilterFormSubmit,
      handleSubmit: handleFilterFormSubmit,
      id: "filter-form",
      onResetFilterForm: onResetFilterForm
    }, /*#__PURE__*/React__default.createElement(FilterFormFields, {
      registerRef: registerFilterFormField,
      controlFilterForm: controlFilterForm,
      handleFilterFormSubmit: handleFilterFormSubmit,
      setFilterFormValue: setFilterFormValue,
      getFilterFormValue: getFilterFormValue
    })), isInboxLoading ? /*#__PURE__*/React__default.createElement(Loader, null) : /*#__PURE__*/React__default.createElement("div", null, (propsForInboxTable === null || propsForInboxTable === void 0 ? void 0 : (_propsForInboxTable$d2 = propsForInboxTable.data) === null || _propsForInboxTable$d2 === void 0 ? void 0 : _propsForInboxTable$d2.length) < 1 ? /*#__PURE__*/React__default.createElement(Card, {
      className: "margin-unset text-align-center"
    }, propsForInboxTable.noResultsMessage ? t(propsForInboxTable.noResultsMessage) : t("CS_MYAPPLICATIONS_NO_APPLICATION")) : /*#__PURE__*/React__default.createElement(Table, _extends({
      t: t
    }, propsForInboxTable))));
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "InboxComposerWrapper"
  }, /*#__PURE__*/React__default.createElement(InboxLinks, PropsForInboxLinks), /*#__PURE__*/React__default.createElement(SearchForm, {
    onSubmit: onSearchFormSubmit,
    handleSubmit: handleSearchFormSubmit,
    id: "search-form",
    className: "rm-mb form-field-flex-one"
  }, /*#__PURE__*/React__default.createElement(SearchFormFields, {
    registerRef: registerSearchFormField,
    searchFormState: searchFormState,
    controlSearchForm: controlSearchForm
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "SubmitAndClearAllContainer"
  }, /*#__PURE__*/React__default.createElement(SearchField, {
    className: "submit"
  }, /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t("ES_COMMON_SEARCH"),
    submit: true,
    form: "search-form"
  }), /*#__PURE__*/React__default.createElement("p", {
    onClick: onResetSearchForm
  }, t("ES_COMMON_CLEAR_SEARCH"))))), /*#__PURE__*/React__default.createElement(FilterForm, {
    onSubmit: onFilterFormSubmit,
    handleSubmit: handleFilterFormSubmit,
    id: "filter-form",
    onResetFilterForm: onResetFilterForm
  }, /*#__PURE__*/React__default.createElement(FilterFormFields, {
    registerRef: registerFilterFormField,
    controlFilterForm: controlFilterForm,
    handleFilterFormSubmit: handleFilterFormSubmit,
    setFilterFormValue: setFilterFormValue,
    getFilterFormValue: getFilterFormValue
  })), isInboxLoading ? /*#__PURE__*/React__default.createElement(Loader, null) : /*#__PURE__*/React__default.createElement("div", null, (propsForInboxTable === null || propsForInboxTable === void 0 ? void 0 : (_propsForInboxTable$d3 = propsForInboxTable.data) === null || _propsForInboxTable$d3 === void 0 ? void 0 : _propsForInboxTable$d3.length) < 1 ? /*#__PURE__*/React__default.createElement(Card, {
    className: "margin-unset text-align-center"
  }, propsForInboxTable.noResultsMessage ? t(propsForInboxTable.noResultsMessage) : t("CS_MYAPPLICATIONS_NO_APPLICATION")) : /*#__PURE__*/React__default.createElement(Table, _extends({
    t: t
  }, propsForInboxTable))));
};

var CityMohalla = function CityMohalla(_ref) {
  var header = _ref.header,
    subHeader = _ref.subHeader,
    cardText = _ref.cardText,
    cardLabelCity = _ref.cardLabelCity,
    cardLabelMohalla = _ref.cardLabelMohalla,
    nextText = _ref.nextText,
    selectedCity = _ref.selectedCity,
    cities = _ref.cities,
    localities = _ref.localities,
    selectCity = _ref.selectCity,
    selectLocalities = _ref.selectLocalities,
    onSave = _ref.onSave,
    selectedLocality = _ref.selectedLocality;
  return /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardSubHeader, null, subHeader), /*#__PURE__*/React__default.createElement(CardHeader, null, header), /*#__PURE__*/React__default.createElement(CardText, null, cardText), /*#__PURE__*/React__default.createElement(CardLabel, null, cardLabelCity, "* "), /*#__PURE__*/React__default.createElement(Dropdown, {
    isMandatory: true,
    selected: selectedCity,
    option: cities,
    select: selectCity
  }), /*#__PURE__*/React__default.createElement(CardLabel, null, cardLabelMohalla, " *"), /*#__PURE__*/React__default.createElement(Dropdown, {
    isMandatory: true,
    selected: selectedLocality,
    option: localities,
    select: selectLocalities
  }), /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: nextText,
    onSubmit: onSave
  }));
};
CityMohalla.propTypes = {
  header: propTypes.string,
  subHeader: propTypes.string,
  cardText: propTypes.string,
  cardLabelCity: propTypes.string,
  cardLabelMohalla: propTypes.string,
  nextText: propTypes.string,
  selectedCity: propTypes.string,
  cities: propTypes.array,
  localities: propTypes.array,
  selectCity: propTypes.string,
  selectedLocality: propTypes.string,
  selectLocalities: propTypes.func,
  onSave: propTypes.func
};
CityMohalla.defaultProps = {
  header: "",
  subHeader: "",
  cardText: "",
  cardLabelCity: "",
  cardLabelMohalla: "",
  nextText: "",
  selectedCity: "",
  cities: [],
  localities: [],
  selectCity: "",
  selectedLocality: "",
  selectLocalities: undefined,
  onSave: undefined
};

var ArrowRight = function ArrowRight(_ref) {
  var to = _ref.to;
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: to
  }, /*#__PURE__*/React__default.createElement("svg", {
    style: {
      display: "inline",
      height: "24px"
    },
    xmlns: "http://www.w3.org/2000/svg",
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M16 5.33325L14.12 7.21325L21.56 14.6666H5.33337V17.3333H21.56L14.12 24.7866L16 26.6666L26.6667 15.9999L16 5.33325Z",
    fill: "white"
  })));
};
var DashboardBox = function DashboardBox(_ref2) {
  var _ref2$t = _ref2.t,
    t = _ref2$t === void 0 ? function (val) {
      return val;
    } : _ref2$t,
    svgIcon = _ref2.svgIcon,
    header = _ref2.header,
    info = _ref2.info,
    links = _ref2.links;
  var mobileView = innerWidth <= 640;
  var employeeCardStyles = mobileView ? {
    width: "96vw",
    margin: "8px auto"
  } : {
    width: "328px"
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: "employeeCard card-home",
    style: _extends({
      padding: 0
    }, employeeCardStyles)
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "logo"
  }, svgIcon), /*#__PURE__*/React__default.createElement("span", {
    className: "text"
  }, t(header))), /*#__PURE__*/React__default.createElement("div", {
    className: "body "
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "employeeCard-info-box"
  }, Object.keys(info).map(function (key, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      className: "employeeCard-info-data"
    }, /*#__PURE__*/React__default.createElement("span", null, t(info[key])), /*#__PURE__*/React__default.createElement("span", {
      style: {
        fontWeight: "bold"
      }
    }, t(key)));
  }))), /*#__PURE__*/React__default.createElement("hr", {
    className: "underline"
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "body"
  }, links.map(function (link, index) {
    return /*#__PURE__*/React__default.createElement("span", {
      key: index,
      className: "link"
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link.pathname
    }, /*#__PURE__*/React__default.createElement("span", null, t(link.label))), !isNaN(link.total) && /*#__PURE__*/React__default.createElement("span", {
      className: "inbox-total"
    }, link.total), /*#__PURE__*/React__default.createElement(ArrowRight, {
      to: link.pathname
    }));
  }))));
};

var Heading = function Heading(props) {
  return /*#__PURE__*/React__default.createElement("h1", {
    className: "heading-m"
  }, props.label);
};
var Close$1 = function Close() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
  }));
};
var CloseBtn = function CloseBtn(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "icon-bg-secondary",
    onClick: props.onClick
  }, /*#__PURE__*/React__default.createElement(Close$1, null));
};
var WorkflowModal = function WorkflowModal(_ref) {
  var config = _ref.config,
    onSubmit = _ref.onSubmit,
    closeModal = _ref.closeModal;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  return /*#__PURE__*/React__default.createElement(Modal, {
    headerBarMain: /*#__PURE__*/React__default.createElement(Heading, {
      label: t(config.label.heading)
    }),
    headerBarEnd: /*#__PURE__*/React__default.createElement(CloseBtn, {
      onClick: closeModal
    }),
    actionCancelLabel: t(config.label.cancel),
    actionCancelOnSubmit: closeModal,
    actionSaveLabel: t(config.label.submit),
    actionSaveOnSubmit: function actionSaveOnSubmit() {},
    formId: "modal-action"
  }, /*#__PURE__*/React__default.createElement(FormComposer, {
    config: config.form,
    noBoxShadow: true,
    inline: true,
    childrenAtTheBottom: true,
    onSubmit: onSubmit,
    defaultValues: {},
    formId: "modal-action"
  }));
};

var InputCard = function InputCard(_ref) {
  var t = _ref.t,
    children = _ref.children,
    _ref$texts = _ref.texts,
    texts = _ref$texts === void 0 ? {} : _ref$texts,
    _ref$submit = _ref.submit,
    submit = _ref$submit === void 0 ? false : _ref$submit,
    onNext = _ref.onNext,
    onSkip = _ref.onSkip,
    isDisable = _ref.isDisable,
    onAdd = _ref.onAdd,
    _ref$isMultipleAllow = _ref.isMultipleAllow,
    isMultipleAllow = _ref$isMultipleAllow === void 0 ? false : _ref$isMultipleAllow,
    _ref$cardStyle = _ref.cardStyle,
    cardStyle = _ref$cardStyle === void 0 ? {} : _ref$cardStyle;
  var isMobile = window.Digit.Utils.browser.isMobile();
  return /*#__PURE__*/React__default.createElement(Card, {
    style: cardStyle
  }, texts.headerCaption && /*#__PURE__*/React__default.createElement(CardCaption, null, t(texts.headerCaption)), (texts === null || texts === void 0 ? void 0 : texts.header) && /*#__PURE__*/React__default.createElement(CardHeader, null, t(texts.header)), (texts === null || texts === void 0 ? void 0 : texts.cardText) && /*#__PURE__*/React__default.createElement(CardText, null, t(texts.cardText)), children, texts.submitBarLabel ? /*#__PURE__*/React__default.createElement(SubmitBar, {
    disabled: isDisable,
    submit: submit,
    label: t(texts.submitBarLabel),
    onSubmit: onNext
  }) : null, texts.skipLabel ? /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      marginTop: "10px",
      textAlign: isMobile ? "center" : "left"
    }
  }, " ", t(texts.skipLabel), " ") : null, texts.skipText ? /*#__PURE__*/React__default.createElement(LinkButton, {
    label: t(texts.skipText),
    onClick: onSkip
  }) : null, isMultipleAllow && texts.addMultipleText ? /*#__PURE__*/React__default.createElement(LinkButton, {
    label: t(texts.addMultipleText),
    onClick: onAdd
  }) : null);
};
InputCard.propTypes = {
  text: propTypes.object,
  submit: propTypes.bool,
  onNext: propTypes.func,
  onSkip: propTypes.func,
  onAdd: propTypes.func,
  t: propTypes.func
};
InputCard.defaultProps = {
  texts: {},
  submit: false,
  onNext: undefined,
  onSkip: undefined,
  onAdd: undefined,
  t: function t(value) {
    return value;
  }
};

var FormStep = function FormStep(_ref) {
  var _config$inputs;
  var t = _ref.t,
    children = _ref.children,
    config = _ref.config,
    onSelect = _ref.onSelect,
    onSkip = _ref.onSkip,
    value = _ref.value,
    onChange = _ref.onChange,
    isDisabled = _ref.isDisabled,
    _ref$_defaultValues = _ref._defaultValues,
    _defaultValues = _ref$_defaultValues === void 0 ? {} : _ref$_defaultValues,
    forcedError = _ref.forcedError,
    componentInFront = _ref.componentInFront,
    onAdd = _ref.onAdd,
    _ref$cardStyle = _ref.cardStyle,
    cardStyle = _ref$cardStyle === void 0 ? {} : _ref$cardStyle,
    _ref$isMultipleAllow = _ref.isMultipleAllow,
    isMultipleAllow = _ref$isMultipleAllow === void 0 ? false : _ref$isMultipleAllow,
    _ref$showErrorBelowCh = _ref.showErrorBelowChildren,
    showErrorBelowChildren = _ref$showErrorBelowCh === void 0 ? false : _ref$showErrorBelowCh,
    _ref$childrenAtTheBot = _ref.childrenAtTheBottom,
    childrenAtTheBottom = _ref$childrenAtTheBot === void 0 ? true : _ref$childrenAtTheBot,
    textInputStyle = _ref.textInputStyle;
  var _useForm = reactHookForm.useForm({
      defaultValues: _defaultValues
    }),
    register = _useForm.register,
    errors = _useForm.errors,
    handleSubmit = _useForm.handleSubmit;
  var goNext = function goNext(data) {
    onSelect(data);
  };
  var isDisable = isDisabled ? true : config.canDisable && Object.keys(errors).filter(function (i) {
    return errors[i];
  }).length;
  var inputs = (_config$inputs = config.inputs) === null || _config$inputs === void 0 ? void 0 : _config$inputs.map(function (input, index) {
    if (input.type === "text") {
      var _input$validation, _input$validation2;
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), errors[input.name] && /*#__PURE__*/React__default.createElement(CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement("div", {
        className: "field-container",
        style: {
          justifyContent: "left"
        }
      }, componentInFront ? /*#__PURE__*/React__default.createElement("span", {
        className: "citizen-card-input citizen-card-input--front"
      }, componentInFront) : null, /*#__PURE__*/React__default.createElement(TextInput, {
        key: index,
        name: input.name,
        value: value,
        onChange: onChange,
        minlength: input.validation.minlength,
        maxlength: input.validation.maxlength,
        pattern: (_input$validation = input.validation) === null || _input$validation === void 0 ? void 0 : _input$validation.pattern,
        title: (_input$validation2 = input.validation) === null || _input$validation2 === void 0 ? void 0 : _input$validation2.title,
        inputRef: register(input.validation),
        isMandatory: errors[input.name],
        disable: input.disable ? input.disable : false,
        textInputStyle: textInputStyle
      })));
    }
    if (input.type === "textarea") return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), /*#__PURE__*/React__default.createElement(TextArea, {
      key: index,
      name: input.name,
      value: value,
      onChange: onChange,
      inputRef: register(input.validation),
      maxLength: "1024"
    }));
  });
  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(goNext)
  }, /*#__PURE__*/React__default.createElement(InputCard, _extends({
    isDisable: isDisable,
    isMultipleAllow: isMultipleAllow
  }, config, {
    cardStyle: cardStyle,
    submit: true,
    onSkip: onSkip,
    onAdd: onAdd,
    t: t
  }), !childrenAtTheBottom && children, inputs, forcedError && !showErrorBelowChildren && /*#__PURE__*/React__default.createElement(CardLabelError, null, t(forcedError)), childrenAtTheBottom && children, forcedError && showErrorBelowChildren && /*#__PURE__*/React__default.createElement(CardLabelError, null, t(forcedError))));
};
FormStep.propTypes = {
  config: propTypes.shape({}),
  onSelect: propTypes.func,
  onSkip: propTypes.func,
  onAdd: propTypes.func,
  t: propTypes.func
};
FormStep.defaultProps = {
  config: {},
  onSelect: undefined,
  onSkip: undefined,
  onAdd: undefined,
  t: function t(value) {
    return value;
  }
};

var Localities = function Localities(_ref) {
  var selectLocality = _ref.selectLocality,
    tenantId = _ref.tenantId,
    boundaryType = _ref.boundaryType,
    keepNull = _ref.keepNull,
    selected = _ref.selected,
    optionCardStyles = _ref.optionCardStyles,
    style = _ref.style,
    disable = _ref.disable,
    disableLoader = _ref.disableLoader,
    sortFn = _ref.sortFn;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities(tenantId, boundaryType, {
      enabled: !disable
    }, t),
    tenantlocalties = _Digit$Hooks$useBound.data,
    isLoading = _Digit$Hooks$useBound.isLoading;
  if (isLoading && !disableLoader) {
    return /*#__PURE__*/React__default.createElement(Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(Dropdown, {
    option: sortFn ? tenantlocalties === null || tenantlocalties === void 0 ? void 0 : tenantlocalties.sort(sortFn) : tenantlocalties,
    keepNull: keepNull === false ? false : true,
    selected: selected,
    select: selectLocality,
    optionCardStyles: optionCardStyles,
    optionKey: "i18nkey",
    style: style,
    disable: !(tenantlocalties !== null && tenantlocalties !== void 0 && tenantlocalties.length) || disable
  });
};

var LocationSearchCard = function LocationSearchCard(_ref) {
  var header = _ref.header,
    cardText = _ref.cardText,
    nextText = _ref.nextText,
    t = _ref.t,
    skipAndContinueText = _ref.skipAndContinueText,
    forcedError = _ref.forcedError,
    skip = _ref.skip,
    onSave = _ref.onSave,
    onChange = _ref.onChange,
    position = _ref.position,
    disabled = _ref.disabled,
    _ref$cardBodyStyle = _ref.cardBodyStyle,
    cardBodyStyle = _ref$cardBodyStyle === void 0 ? {} : _ref$cardBodyStyle,
    isPTDefault = _ref.isPTDefault,
    PTdefaultcoord = _ref.PTdefaultcoord,
    isPlaceRequired = _ref.isPlaceRequired,
    handleRemove = _ref.handleRemove,
    _ref$Webview = _ref.Webview,
    Webview = _ref$Webview === void 0 ? false : _ref$Webview,
    _ref$isPopUp = _ref.isPopUp,
    isPopUp = _ref$isPopUp === void 0 ? false : _ref$isPopUp;
  var isDisabled =  disabled;
  var onLocationChange = function onLocationChange(val, location) {
    isDisabled = val ? false : true;
    onChange(val, location);
  };
  var onLocationChangewithPlace = function onLocationChangewithPlace(val, location, place) {
    isDisabled = val ? false : true;
    onChange(val, location, place);
  };
  return /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardHeader, null, header), /*#__PURE__*/React__default.createElement("div", {
    style: cardBodyStyle
  }, isPopUp && /*#__PURE__*/React__default.createElement(LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        float: "right",
        position: "relative",
        bottom: "32px",
        marginTop: Webview ? "-20px" : "-18px",
        marginRight: Webview ? "-280px" : "-5px",
        marginLeft: Webview ? "5px" : ""
      },
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z",
      fill: "#0B0C0C"
    })))),
    style: {
      width: "100px",
      display: "inline"
    },
    onClick: function onClick(e) {
      return handleRemove();
    }
  }), /*#__PURE__*/React__default.createElement(CardText, null, cardText), /*#__PURE__*/React__default.createElement(LocationSearch, {
    onChange: isPlaceRequired ? onLocationChangewithPlace : onLocationChange,
    position: position,
    isPTDefault: isPTDefault,
    PTdefaultcoord: PTdefaultcoord,
    isPlaceRequired: isPlaceRequired
  }), forcedError && /*#__PURE__*/React__default.createElement(CardLabelError, null, t(forcedError))), /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: nextText,
    onSubmit: onSave,
    disabled: isDisabled
  }), skip ? /*#__PURE__*/React__default.createElement(LinkButton, {
    onClick: skip,
    label: skipAndContinueText
  }) : null);
};
LocationSearchCard.propTypes = {
  header: propTypes.string,
  cardText: propTypes.string,
  nextText: propTypes.string,
  skipAndContinueText: propTypes.string,
  skip: propTypes.func,
  onSave: propTypes.func,
  onChange: propTypes.func,
  position: propTypes.any,
  isPTDefault: propTypes.any,
  PTdefaultcoord: propTypes.any,
  isPlaceRequired: propTypes.any
};
LocationSearchCard.defaultProps = {
  header: "",
  cardText: "",
  nextText: "",
  skipAndContinueText: "",
  skip: function skip() {},
  onSave: null,
  onChange: function onChange() {},
  position: undefined,
  isPTDefault: false,
  PTdefaultcoord: {},
  isPlaceRequired: false,
  handleRemove: function handleRemove() {},
  Webview: false,
  isPopUp: false
};

var DimentionInput = function DimentionInput(_ref) {
  var name = _ref.name,
    value = _ref.value,
    onChange = _ref.onChange,
    disable = _ref.disable;
  return /*#__PURE__*/React__default.createElement(TextInput, {
    type: "number",
    name: name,
    value: value,
    onChange: onChange,
    disable: disable,
    pattern: "[0-9]{1,2}",
    min: "0.1",
    max: "99.9",
    step: "0.1"
  });
};
var PitDimension = function PitDimension(_ref2) {
  var sanitationType = _ref2.sanitationType,
    t = _ref2.t,
    _ref2$size = _ref2.size,
    size = _ref2$size === void 0 ? {} : _ref2$size,
    handleChange = _ref2.handleChange,
    _ref2$disable = _ref2.disable,
    disable = _ref2$disable === void 0 ? false : _ref2$disable;
  return (sanitationType === null || sanitationType === void 0 ? void 0 : sanitationType.dimension) === "dd" ? /*#__PURE__*/React__default.createElement("div", {
    className: "inputWrapper"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "diameter",
    value: size["diameter"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_DIAMETER"))), /*#__PURE__*/React__default.createElement("span", null, "x"), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "height",
    value: size["height"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_HEIGHT")))) : /*#__PURE__*/React__default.createElement("div", {
    className: "inputWrapper"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "length",
    value: size["length"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_LENGTH"))), /*#__PURE__*/React__default.createElement("span", null, "x"), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "width",
    value: size["width"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_WIDTH"))), /*#__PURE__*/React__default.createElement("span", null, "x"), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "height",
    value: size["height"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_HEIGHT"))));
};

var RadioOrSelect = function RadioOrSelect(_ref) {
  var options = _ref.options,
    onSelect = _ref.onSelect,
    optionKey = _ref.optionKey,
    selectedOption = _ref.selectedOption,
    isMandatory = _ref.isMandatory,
    t = _ref.t,
    labelKey = _ref.labelKey,
    _ref$dropdownStyle = _ref.dropdownStyle,
    dropdownStyle = _ref$dropdownStyle === void 0 ? {} : _ref$dropdownStyle,
    _ref$isDependent = _ref.isDependent,
    isDependent = _ref$isDependent === void 0 ? false : _ref$isDependent,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    optionCardStyles = _ref.optionCardStyles,
    _ref$isPTFlow = _ref.isPTFlow,
    isPTFlow = _ref$isPTFlow === void 0 ? false : _ref$isPTFlow,
    _ref$isDropDown = _ref.isDropDown,
    isDropDown = _ref$isDropDown === void 0 ? false : _ref$isDropDown,
    _ref$innerStyles = _ref.innerStyles,
    innerStyles = _ref$innerStyles === void 0 ? {} : _ref$innerStyles,
    _ref$inputStyle = _ref.inputStyle,
    inputStyle = _ref$inputStyle === void 0 ? {} : _ref$inputStyle;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, (options === null || options === void 0 ? void 0 : options.length) < 5 && !isDropDown ? /*#__PURE__*/React__default.createElement(RadioButtons, {
    selectedOption: selectedOption,
    options: options,
    optionsKey: optionKey,
    isDependent: isDependent,
    disabled: disabled,
    onSelect: onSelect,
    labelKey: labelKey,
    isPTFlow: isPTFlow,
    t: t,
    innerStyles: innerStyles,
    inputStyle: inputStyle
  }) : /*#__PURE__*/React__default.createElement(Dropdown, {
    isMandatory: isMandatory,
    selected: selectedOption,
    style: dropdownStyle,
    optionKey: optionKey,
    option: options,
    select: onSelect,
    t: t,
    disable: disabled,
    optionCardStyles: optionCardStyles
  }));
};

var RatingCard = function RatingCard(_ref) {
  var _config$inputs;
  var config = _ref.config,
    onSelect = _ref.onSelect,
    t = _ref.t;
  var _useForm = reactHookForm.useForm(),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit;
  var _useState = React.useState(""),
    comments = _useState[0],
    setComments = _useState[1];
  var _useState2 = React.useState(0),
    rating = _useState2[0],
    setRating = _useState2[1];
  var onSubmit = function onSubmit(data) {
    data.rating = rating;
    onSelect(data);
  };
  var feedback = function feedback(e, ref, index) {
    setRating(index);
  };
  var segments = (_config$inputs = config.inputs) === null || _config$inputs === void 0 ? void 0 : _config$inputs.map(function (input, index) {
    if (input.type === "rate") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), input === null || input === void 0 ? void 0 : input.error, /*#__PURE__*/React__default.createElement(Rating, {
        currentRating: rating,
        maxRating: input.maxRating,
        onFeedback: function onFeedback(e, ref, i) {
          return feedback(e, ref, i);
        }
      }));
    }
    if (input.type === "checkbox") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), input.checkLabels && input.checkLabels.map(function (label, index) {
        return /*#__PURE__*/React__default.createElement(CheckBox, {
          style: {
            marginBottom: "16px"
          },
          key: index,
          name: input.label,
          label: t(label),
          value: label,
          inputRef: register
        });
      }));
    }
    if (input.type === "radio") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), /*#__PURE__*/React__default.createElement(RadioButtons, {
        options: input.checkLabels,
        onSelect: input.onSelect,
        selectedOption: input.selectedOption,
        t: t
      }));
    }
    if (input.type === "textarea") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), /*#__PURE__*/React__default.createElement(TextArea, {
        name: input.name,
        value: comments,
        onChange: function onChange(e) {
          return setComments(e.target.value);
        },
        inputRef: register
      }));
    }
    if (input.type === "dropDown") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), /*#__PURE__*/React__default.createElement(Dropdown, {
        option: input.checkLabels,
        optionKey: "i18nKey",
        id: "dropdown",
        selected: input.selectedOption,
        select: input.onSelect,
        t: t,
        disable: false,
        autoFocus: false
      }));
    }
  });
  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardHeader, null, t(config.texts.header)), segments, /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(config.texts.submitBarLabel),
    submit: true
  })));
};
RatingCard.propTypes = {
  config: propTypes.object,
  onSubmit: propTypes.func,
  t: propTypes.func
};
RatingCard.defaultProps = {
  config: {},
  onSubmit: undefined,
  t: function t(value) {
    return value;
  }
};

var TextInputCard = function TextInputCard(_ref) {
  var header = _ref.header,
    subHeader = _ref.subHeader,
    cardText = _ref.cardText,
    cardLabel = _ref.cardLabel,
    nextText = _ref.nextText,
    skipAndContinueText = _ref.skipAndContinueText,
    skip = _ref.skip,
    onSave = _ref.onSave,
    onSkip = _ref.onSkip,
    textInput = _ref.textInput;
  return /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardSubHeader, null, subHeader), /*#__PURE__*/React__default.createElement(CardHeader, null, header), /*#__PURE__*/React__default.createElement(CardText, null, cardText), /*#__PURE__*/React__default.createElement(CardLabel, null, cardLabel), /*#__PURE__*/React__default.createElement(TextInput, {
    onChange: textInput
  }), /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: nextText,
    onSubmit: onSave
  }), skip ? /*#__PURE__*/React__default.createElement(LinkButton, {
    label: skipAndContinueText,
    onClick: onSkip
  }) : null);
};
TextInputCard.propTypes = {
  header: propTypes.string,
  subHeader: propTypes.string,
  cardText: propTypes.string,
  cardLabel: propTypes.string,
  nextText: propTypes.string,
  skipAndContinueText: propTypes.string,
  skip: propTypes.bool,
  onSave: propTypes.func,
  onSkip: propTypes.func,
  textInput: propTypes.string
};
TextInputCard.defaultProps = {
  header: "",
  subHeader: "",
  cardText: "",
  cardLabel: "",
  nextText: "",
  skipAndContinueText: "",
  skip: true,
  onSave: undefined,
  onSkip: undefined,
  textInput: ""
};

var TypeSelectCard = function TypeSelectCard(_ref) {
  var t = _ref.t,
    headerCaption = _ref.headerCaption,
    header = _ref.header,
    cardText = _ref.cardText,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    submitBarLabel = _ref.submitBarLabel,
    selectedOption = _ref.selectedOption,
    menu = _ref.menu,
    optionsKey = _ref.optionsKey,
    selected = _ref.selected,
    onSave = _ref.onSave;
  return /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardCaption, null, t(headerCaption)), /*#__PURE__*/React__default.createElement(CardHeader, null, t(header)), /*#__PURE__*/React__default.createElement(CardText, null, t(cardText)), menu ? /*#__PURE__*/React__default.createElement(RadioButtons, {
    selectedOption: selectedOption,
    options: menu,
    optionsKey: optionsKey,
    onSelect: selected
  }) : null, /*#__PURE__*/React__default.createElement(SubmitBar, {
    disabled: disabled,
    label: t(submitBarLabel),
    onSubmit: onSave
  }));
};
TypeSelectCard.propTypes = {
  headerCaption: propTypes.string,
  header: propTypes.string,
  cardText: propTypes.string,
  submitBarLabel: propTypes.string,
  selectedOption: propTypes.any,
  menu: propTypes.any,
  optionsKey: propTypes.string,
  selected: propTypes.func,
  onSave: propTypes.func,
  t: propTypes.func
};
TypeSelectCard.defaultProps = {};

var PageBasedInput = function PageBasedInput(_ref) {
  var children = _ref.children,
    texts = _ref.texts,
    onSubmit = _ref.onSubmit;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "PageBasedInputWrapper PageBased"
  }, /*#__PURE__*/React__default.createElement(Card, null, children, /*#__PURE__*/React__default.createElement(SubmitBar, {
    className: "SubmitBarInCardInDesktopView",
    label: texts.submitBarLabel,
    onSubmit: onSubmit
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "SubmitBar"
  }, /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: texts.submitBarLabel,
    onSubmit: onSubmit
  })));
};

var SearchOnRadioButtons = function SearchOnRadioButtons(_ref) {
  var options = _ref.options,
    optionsKey = _ref.optionsKey,
    additionalWrapperClass = _ref.additionalWrapperClass,
    onSelect = _ref.onSelect,
    selectedOption = _ref.selectedOption,
    _ref$SignatureImage = _ref.SignatureImage,
    SignatureImage = _ref$SignatureImage === void 0 ? function () {
      return /*#__PURE__*/React__default.createElement(SearchIconSvg, null);
    } : _ref$SignatureImage,
    onSearchQueryChange = _ref.onSearchQueryChange,
    SearchQueryValue = _ref.SearchQueryValue,
    placeholder = _ref.placeholder;
  function optionsReducer(state, action) {
    switch (action.type) {
      case "filter":
        return action.options.filter(function (i) {
          return i[optionsKey].toUpperCase().includes(action.payload.toUpperCase());
        });
    }
  }
  var _useReducer = React.useReducer(optionsReducer, options),
    filteredOptions = _useReducer[0],
    optionsDispatch = _useReducer[1];
  function defaultSearchQueryChange(e) {
    optionsDispatch({
      type: "filter",
      payload: e.target.value,
      options: options
    });
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "SearchOnRadioButton"
  }, /*#__PURE__*/React__default.createElement(TextInput, {
    textInputStyle: {
      maxWidth: "100%"
    },
    signature: true,
    signatureImg: /*#__PURE__*/React__default.createElement(SignatureImage, null),
    onChange: onSearchQueryChange || defaultSearchQueryChange,
    value: SearchQueryValue,
    placeholder: placeholder
  }), /*#__PURE__*/React__default.createElement(RadioButtons, {
    options: filteredOptions,
    optionsKey: optionsKey,
    additionalWrapperClass: additionalWrapperClass,
    onSelect: onSelect,
    selectedOption: selectedOption
  }));
};

var OnGroundEventCard = function OnGroundEventCard(_ref) {
  var _ref$onClick = _ref.onClick,
    onClick = _ref$onClick === void 0 ? function () {
      return null;
    } : _ref$onClick,
    name = _ref.name,
    id = _ref.id,
    eventDetails = _ref.eventDetails,
    _ref$onGroundEventMon = _ref.onGroundEventMonth,
    onGroundEventMonth = _ref$onGroundEventMon === void 0 ? "MAR" : _ref$onGroundEventMon,
    _ref$onGroundEventDat = _ref.onGroundEventDate,
    onGroundEventDate = _ref$onGroundEventDat === void 0 ? "12 - 16" : _ref$onGroundEventDat,
    _ref$onGroundEventTim = _ref.onGroundEventTimeRange,
    onGroundEventTimeRange = _ref$onGroundEventTim === void 0 ? "10:00 am - 1:00 pm" : _ref$onGroundEventTim,
    eventCategory = _ref.eventCategory,
    showEventCatergory = _ref.showEventCatergory;
  var onEventCardClick = function onEventCardClick() {
    return onClick(id);
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: "OnGroundEventCard",
    onClick: onEventCardClick
  }, /*#__PURE__*/React__default.createElement(EventCalendarView, {
    onGroundEventMonth: onGroundEventMonth,
    onGroundEventDate: onGroundEventDate
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "EventDetails"
  }, /*#__PURE__*/React__default.createElement("h2", null, name), !showEventCatergory ? /*#__PURE__*/React__default.createElement("div", {
    className: "EventLocation"
  }, /*#__PURE__*/React__default.createElement(MapMarker, null), /*#__PURE__*/React__default.createElement("p", null, eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.address)) : null, !showEventCatergory ? /*#__PURE__*/React__default.createElement("div", {
    className: "EventTime"
  }, /*#__PURE__*/React__default.createElement(Clock, null), /*#__PURE__*/React__default.createElement("p", null, onGroundEventTimeRange)) : null, showEventCatergory ? /*#__PURE__*/React__default.createElement("div", {
    className: "EventCategory"
  }, /*#__PURE__*/React__default.createElement("p", null, eventCategory)) : null));
};

var OpenLinkContainer = function OpenLinkContainer(_ref) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "navbar"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "center-container"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: "city",
    id: "topbar-logo",
    crossOrigin: "anonymous",
    src: "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png",
    alt: "mSeva"
  })));
};
OpenLinkContainer.propTypes = {
  img: propTypes.string
};
OpenLinkContainer.defaultProps = {
  img: undefined
};

var UploadPitPhoto = function UploadPitPhoto(props) {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useState = React.useState(null),
    image = _useState[0],
    setImage = _useState[1];
  var _useState2 = React.useState(null),
    uploadedImagesThumbs = _useState2[0],
    setUploadedImagesThumbs = _useState2[1];
  var _useState3 = React.useState(props.uploadedImages),
    uploadedImagesIds = _useState3[0],
    setUploadedImagesIds = _useState3[1];
  var _useState4 = React.useState(1),
    rerender = _useState4[0],
    setRerender = _useState4[1];
  var _useState5 = React.useState(null),
    imageFile = _useState5[0],
    setImageFile = _useState5[1];
  var _useState6 = React.useState(false),
    setIsDeleting = _useState6[1];
  var _useState7 = React.useState(""),
    error = _useState7[0],
    setError = _useState7[1];
  React.useEffect(function () {
    if (image) {
      uploadImage();
    }
  }, [image]);
  React.useEffect(function () {
    (function () {
      try {
        var _temp = function () {
          if (uploadedImagesIds !== null) {
            return Promise.resolve(submit()).then(function () {
              setRerender(rerender + 1);
              props.onPhotoChange(uploadedImagesIds);
            });
          }
        }();
        return _temp && _temp.then ? _temp.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [uploadedImagesIds]);
  React.useEffect(function () {
    if (imageFile && imageFile.size > 2097152) {
      setError("File is too large");
    } else {
      setImage(imageFile);
    }
  }, [imageFile]);
  var addUploadedImageIds = React.useCallback(function (imageIdData) {
    if (uploadedImagesIds === null) {
      var arr = [];
    } else {
      arr = uploadedImagesIds;
    }
    return [].concat(arr, [imageIdData.data.files[0].fileStoreId]);
  }, [uploadedImagesIds]);
  function getImage(e) {
    setError(null);
    setImageFile(e.target.files[0]);
  }
  var uploadImage = React.useCallback(function () {
    try {
      var _temp2 = function () {
        if (uploadedImagesIds === null || uploadedImagesIds.length < 3) {
          return Promise.resolve(Digit.UploadServices.Filestorage("FSM", image, props.tenantId)).then(function (response) {
            setUploadedImagesIds(addUploadedImageIds(response));
          });
        }
      }();
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [addUploadedImageIds, image]);
  function addImageThumbnails(thumbnailsData) {
    var keys = Object.keys(thumbnailsData.data);
    var index = keys.findIndex(function (key) {
      return key === "fileStoreIds";
    });
    if (index > -1) {
      keys.splice(index, 1);
    }
    var thumbnails = [];
    var newThumbnails = keys.map(function (key) {
      return {
        image: thumbnailsData.data[key].split(",")[2],
        key: key
      };
    });
    setUploadedImagesThumbs([].concat(thumbnails, newThumbnails));
  }
  var submit = React.useCallback(function () {
    try {
      var _temp3 = function () {
        if (uploadedImagesIds !== null && uploadedImagesIds.length > 0) {
          return Promise.resolve(Digit.UploadServices.Filefetch(uploadedImagesIds, props.tenantId)).then(function (res) {
            addImageThumbnails(res);
          });
        }
      }();
      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [uploadedImagesIds]);
  function deleteImage(img) {
    setIsDeleting(true);
    var deleteImageKey = uploadedImagesThumbs.filter(function (o, index) {
      return o.image === img;
    });
    var uploadedthumbs = uploadedImagesThumbs;
    var newThumbsList = uploadedthumbs.filter(function (thumbs) {
      return thumbs != deleteImageKey[0];
    });
    var newUploadedImagesIds = uploadedImagesIds.filter(function (key) {
      return key !== deleteImageKey[0].key;
    });
    setUploadedImagesThumbs(newThumbsList);
    setUploadedImagesIds(newUploadedImagesIds);
    Digit.SessionStorage.set("PGR_CREATE_IMAGES", newUploadedImagesIds);
  }
  var handleUpload = function handleUpload(event) {
    if (uploadedImagesIds === null || uploadedImagesIds.length < 3) {
      hiddenFileInput.current.click();
    }
  };
  var hiddenFileInput = React__default.useRef(null);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "imageUploadWrapper",
    style: {
      display: !imageFile ? "none" : "block",
      marginTop: "8px"
    }
  }, /*#__PURE__*/React__default.createElement(UploadImages, {
    onUpload: getImage,
    onDelete: deleteImage,
    thumbnails: uploadedImagesThumbs ? uploadedImagesThumbs.map(function (o) {
      return o.image;
    }) : []
  })), /*#__PURE__*/React__default.createElement("button", {
    onClick: handleUpload,
    style: {
      width: "100%",
      backgroundColor: "#d6d5d4",
      borderStyle: "solid",
      borderBottom: "1px solid #464646",
      padding: "4px 40px",
      margin: "8px 0px",
      cursor: "pointer",
      outline: "none",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React__default.createElement("input", {
    style: {
      display: "none"
    },
    type: "file",
    ref: hiddenFileInput,
    onChange: getImage
  }), /*#__PURE__*/React__default.createElement("p", null, t("UPLOAD_PIT_PHOTO"))), error && /*#__PURE__*/React__default.createElement(Toast, {
    error: true,
    label: error,
    onClose: function onClose() {
      return setError(null);
    }
  }));
};

var _excluded$d = ["value", "onChange", "label", "name", "ref", "style", "disabled"];
var ToggleSwitch = function ToggleSwitch(_ref) {
  var value = _ref.value,
    onChange = _ref.onChange,
    name = _ref.name,
    style = _ref.style,
    disabled = _ref.disabled,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$d);
  return /*#__PURE__*/React__default.createElement("div", {
    style: style
  }, /*#__PURE__*/React__default.createElement("input", {
    checked: value,
    onChange: onChange,
    className: "react-switch-checkbox",
    id: name,
    type: "checkbox",
    readOnly: props.readonly,
    disabled: disabled
  }), /*#__PURE__*/React__default.createElement("label", {
    style: {
      background: value && '#fcefe7'
    },
    className: "react-switch-label",
    htmlFor: name
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "react-switch-button",
    style: {
      background: !value && '#bbb'
    }
  })));
};
ToggleSwitch.propTypes = {
  value: propTypes.bool,
  name: propTypes.string,
  onChange: propTypes.func,
  ref: propTypes.func
};
ToggleSwitch.defaultProps = {};

var WeekPicker = function WeekPicker() {
  var _useState = React.useState(new Date()),
    startDate = _useState[0],
    setStartDate = _useState[1];
  return /*#__PURE__*/React__default.createElement(reactDateRange.Calendar, {
    onChange: function onChange(item) {
      return setStartDate(item);
    },
    date: startDate
  });
};

var SVG = {
  Rotation3D: digitUiSvgComponents.Rotation3D,
  SixFtApart: digitUiSvgComponents.SixFtApart,
  Rotate360: digitUiSvgComponents.Rotate360,
  Accessibility: digitUiSvgComponents.Accessibility,
  AccessibilityNew: digitUiSvgComponents.AccessibilityNew,
  Accessible: digitUiSvgComponents.Accessible,
  AccessibleForward: digitUiSvgComponents.AccessibleForward,
  AccountBalance: digitUiSvgComponents.AccountBalance,
  AccountBalanceWallet: digitUiSvgComponents.AccountBalanceWallet,
  AccountBox: digitUiSvgComponents.AccountBox,
  AccountCircle: digitUiSvgComponents.AccountCircle,
  AddAlert: digitUiSvgComponents.AddAlert,
  AddBusiness: digitUiSvgComponents.AddBusiness,
  AddChart: digitUiSvgComponents.AddChart,
  AddExpense: digitUiSvgComponents.AddExpense,
  AddExpenseTwo: digitUiSvgComponents.AddExpenseTwo,
  AddIcCall: digitUiSvgComponents.AddIcCall,
  AddLocation: digitUiSvgComponents.AddLocation,
  AddLocationAlt: digitUiSvgComponents.AddLocationAlt,
  AddModerator: digitUiSvgComponents.AddModerator,
  AddRoad: digitUiSvgComponents.AddRoad,
  AddShoppingCart: digitUiSvgComponents.AddShoppingCart,
  AddTask: digitUiSvgComponents.AddTask,
  AddToDrive: digitUiSvgComponents.AddToDrive,
  AdminPanelSettings: digitUiSvgComponents.AdminPanelSettings,
  Agriculture: digitUiSvgComponents.Agriculture,
  Alarm: digitUiSvgComponents.Alarm,
  AlarmAdd: digitUiSvgComponents.AlarmAdd,
  AlarmOff: digitUiSvgComponents.AlarmOff,
  AlarmOn: digitUiSvgComponents.AlarmOn,
  AllInbox: digitUiSvgComponents.AllInbox,
  AllOut: digitUiSvgComponents.AllOut,
  AlternateEmail: digitUiSvgComponents.AlternateEmail,
  AltRoute: digitUiSvgComponents.AltRoute,
  Analytics: digitUiSvgComponents.Analytics,
  Anchor: digitUiSvgComponents.Anchor,
  Android: digitUiSvgComponents.Android,
  Announcement: digitUiSvgComponents.Announcement,
  Api: digitUiSvgComponents.Api,
  AppBlocking: digitUiSvgComponents.AppBlocking,
  AppRegistration: digitUiSvgComponents.AppRegistration,
  Approval: digitUiSvgComponents.Approval,
  Apps: digitUiSvgComponents.Apps,
  AppSettingsAlt: digitUiSvgComponents.AppSettingsAlt,
  Architecture: digitUiSvgComponents.Architecture,
  ArrowBack: digitUiSvgComponents.ArrowBack,
  ArrowBackIos: digitUiSvgComponents.ArrowBackIos,
  ArrowCircleDown: digitUiSvgComponents.ArrowCircleDown,
  ArrowCircleUp: digitUiSvgComponents.ArrowCircleUp,
  ArrowDownward: digitUiSvgComponents.ArrowDownward,
  ArrowDropDown: digitUiSvgComponents.ArrowDropDown,
  ArrowDropDownCircle: digitUiSvgComponents.ArrowDropDownCircle,
  ArrowDropUp: digitUiSvgComponents.ArrowDropUp,
  ArrowForward: digitUiSvgComponents.ArrowForward,
  ArrowForwardIos: digitUiSvgComponents.ArrowForwardIos,
  ArrowForwardIosAlt: digitUiSvgComponents.ArrowForwardIosAlt,
  ArrowLeft: digitUiSvgComponents.ArrowLeft,
  ArrowRight: digitUiSvgComponents.ArrowRight,
  ArrowRightAlt: digitUiSvgComponents.ArrowRightAlt,
  ArrowUpward: digitUiSvgComponents.ArrowUpward,
  Article: digitUiSvgComponents.Article,
  AspectRatio: digitUiSvgComponents.AspectRatio,
  Assessment: digitUiSvgComponents.Assessment,
  Assignment: digitUiSvgComponents.Assignment,
  AssignmentInd: digitUiSvgComponents.AssignmentInd,
  AssignmentLate: digitUiSvgComponents.AssignmentLate,
  AssignmentReturn: digitUiSvgComponents.AssignmentReturn,
  AssignmentReturned: digitUiSvgComponents.AssignmentReturned,
  AssignmentTurnedIn: digitUiSvgComponents.AssignmentTurnedIn,
  AssistantDirection: digitUiSvgComponents.AssistantDirection,
  AssistantNavigation: digitUiSvgComponents.AssistantNavigation,
  Atm: digitUiSvgComponents.Atm,
  AttachEmail: digitUiSvgComponents.AttachEmail,
  Attachment: digitUiSvgComponents.Attachment,
  Attractions: digitUiSvgComponents.Attractions,
  AutoDelete: digitUiSvgComponents.AutoDelete,
  AutoRenew: digitUiSvgComponents.AutoRenew,
  Backup: digitUiSvgComponents.Backup,
  BackupTable: digitUiSvgComponents.BackupTable,
  Badge: digitUiSvgComponents.Badge,
  BakeryDining: digitUiSvgComponents.BakeryDining,
  BatchPrediction: digitUiSvgComponents.BatchPrediction,
  BeenHere: digitUiSvgComponents.BeenHere,
  BikeScooter: digitUiSvgComponents.BikeScooter,
  Book: digitUiSvgComponents.Book,
  Bookmark: digitUiSvgComponents.Bookmark,
  BookmarkBorder: digitUiSvgComponents.BookmarkBorder,
  Bookmarks: digitUiSvgComponents.Bookmarks,
  BookOnline: digitUiSvgComponents.BookOnline,
  BreakfastDining: digitUiSvgComponents.BreakfastDining,
  BrunchDining: digitUiSvgComponents.BrunchDining,
  BugReport: digitUiSvgComponents.BugReport,
  Build: digitUiSvgComponents.Build,
  BuildCircle: digitUiSvgComponents.BuildCircle,
  BusAlert: digitUiSvgComponents.BusAlert,
  Business: digitUiSvgComponents.Business,
  Cached: digitUiSvgComponents.Cached,
  Cake: digitUiSvgComponents.Cake,
  CalendarToday: digitUiSvgComponents.CalendarToday,
  CalendarViewDay: digitUiSvgComponents.CalendarViewDay,
  Call: digitUiSvgComponents.Call,
  CallEnd: digitUiSvgComponents.CallEnd,
  CallMade: digitUiSvgComponents.CallMade,
  CallMerge: digitUiSvgComponents.CallMerge,
  CallMissed: digitUiSvgComponents.CallMissed,
  CallMissedOutgoing: digitUiSvgComponents.CallMissedOutgoing,
  CallReceived: digitUiSvgComponents.CallReceived,
  CallSplit: digitUiSvgComponents.CallSplit,
  CameraEnhance: digitUiSvgComponents.CameraEnhance,
  Campaign: digitUiSvgComponents.Campaign,
  Cancel: digitUiSvgComponents.Cancel,
  CancelPresentation: digitUiSvgComponents.CancelPresentation,
  CancelScheduleSend: digitUiSvgComponents.CancelScheduleSend,
  CardGiftcard: digitUiSvgComponents.CardGiftcard,
  CardMembership: digitUiSvgComponents.CardMembership,
  CardTravel: digitUiSvgComponents.CardTravel,
  CarRental: digitUiSvgComponents.CarRental,
  CarRepair: digitUiSvgComponents.CarRepair,
  Category: digitUiSvgComponents.Category,
  Celebration: digitUiSvgComponents.Celebration,
  CellWifi: digitUiSvgComponents.CellWifi,
  ChangeHistory: digitUiSvgComponents.ChangeHistory,
  Chat: digitUiSvgComponents.Chat,
  ChatBubble: digitUiSvgComponents.ChatBubble,
  ChatBubbleOutline: digitUiSvgComponents.ChatBubbleOutline,
  Check: digitUiSvgComponents.Check,
  CheckCircle: digitUiSvgComponents.CheckCircle,
  CheckCircleOutline: digitUiSvgComponents.CheckCircleOutline,
  ChevronLeft: digitUiSvgComponents.ChevronLeft,
  ChevronRight: digitUiSvgComponents.ChevronRight,
  ChromeReaderMode: digitUiSvgComponents.ChromeReaderMode,
  CircleNotifications: digitUiSvgComponents.CircleNotifications,
  Class: digitUiSvgComponents.Class,
  CleanHands: digitUiSvgComponents.CleanHands,
  CleaningServices: digitUiSvgComponents.CleaningServices,
  ClearAll: digitUiSvgComponents.ClearAll,
  Clock: digitUiSvgComponents.Clock,
  Close: digitUiSvgComponents.Close,
  CloseFullscreen: digitUiSvgComponents.CloseFullscreen,
  Cloud: digitUiSvgComponents.Cloud,
  CloudCircle: digitUiSvgComponents.CloudCircle,
  CloudDone: digitUiSvgComponents.CloudDone,
  CloudDownload: digitUiSvgComponents.CloudDownload,
  CloudOff: digitUiSvgComponents.CloudOff,
  CloudQueue: digitUiSvgComponents.CloudQueue,
  CloudUpload: digitUiSvgComponents.CloudUpload,
  Code: digitUiSvgComponents.Code,
  Comment: digitUiSvgComponents.Comment,
  CommentBank: digitUiSvgComponents.CommentBank,
  Commute: digitUiSvgComponents.Commute,
  CompareArrows: digitUiSvgComponents.CompareArrows,
  CompassCalibration: digitUiSvgComponents.CompassCalibration,
  Compress: digitUiSvgComponents.Compress,
  ConnectWithoutContact: digitUiSvgComponents.ConnectWithoutContact,
  Construction: digitUiSvgComponents.Construction,
  Contactless: digitUiSvgComponents.Contactless,
  ContactMail: digitUiSvgComponents.ContactMail,
  ContactPage: digitUiSvgComponents.ContactPage,
  ContactPhone: digitUiSvgComponents.ContactPhone,
  Contacts: digitUiSvgComponents.Contacts,
  ContactSupport: digitUiSvgComponents.ContactSupport,
  Copyright: digitUiSvgComponents.Copyright,
  Coronavirus: digitUiSvgComponents.Coronavirus,
  CreateNewFolder: digitUiSvgComponents.CreateNewFolder,
  CreditCard: digitUiSvgComponents.CreditCard,
  Cut: digitUiSvgComponents.Cut,
  Dangerous: digitUiSvgComponents.Dangerous,
  Dashboard: digitUiSvgComponents.Dashboard,
  DashboardCustomize: digitUiSvgComponents.DashboardCustomize,
  DateRange: digitUiSvgComponents.DateRange,
  Deck: digitUiSvgComponents.Deck,
  Delete: digitUiSvgComponents.Delete,
  DeleteForever: digitUiSvgComponents.DeleteForever,
  DeleteOutline: digitUiSvgComponents.DeleteOutline,
  DeliveryDining: digitUiSvgComponents.DeliveryDining,
  DepartureBoard: digitUiSvgComponents.DepartureBoard,
  Description: digitUiSvgComponents.Description,
  DesignServices: digitUiSvgComponents.DesignServices,
  DesktopAccessDisabled: digitUiSvgComponents.DesktopAccessDisabled,
  DialerSip: digitUiSvgComponents.DialerSip,
  Dialpad: digitUiSvgComponents.Dialpad,
  DinnerDining: digitUiSvgComponents.DinnerDining,
  Directions: digitUiSvgComponents.Directions,
  DirectionsBike: digitUiSvgComponents.DirectionsBike,
  DirectionsBoat: digitUiSvgComponents.DirectionsBoat,
  DirectionsBus: digitUiSvgComponents.DirectionsBus,
  DirectionsCar: digitUiSvgComponents.DirectionsCar,
  DirectionsRailway: digitUiSvgComponents.DirectionsRailway,
  DirectionsRun: digitUiSvgComponents.DirectionsRun,
  DirectionsSubway: digitUiSvgComponents.DirectionsSubway,
  DirectionsTransit: digitUiSvgComponents.DirectionsTransit,
  DirectionsWalk: digitUiSvgComponents.DirectionsWalk,
  DisabledByDefault: digitUiSvgComponents.DisabledByDefault,
  Dns: digitUiSvgComponents.Dns,
  Domain: digitUiSvgComponents.Domain,
  DomainDisabled: digitUiSvgComponents.DomainDisabled,
  DomainVerification: digitUiSvgComponents.DomainVerification,
  Done: digitUiSvgComponents.Done,
  DoneAll: digitUiSvgComponents.DoneAll,
  DoneOutline: digitUiSvgComponents.DoneOutline,
  DonutLarge: digitUiSvgComponents.DonutLarge,
  DonutSmall: digitUiSvgComponents.DonutSmall,
  DoubleArrow: digitUiSvgComponents.DoubleArrow,
  DragIndicator: digitUiSvgComponents.DragIndicator,
  DriveFileMove: digitUiSvgComponents.DriveFileMove,
  DriveFileMoveOutline: digitUiSvgComponents.DriveFileMoveOutline,
  DriveFileRenameOutline: digitUiSvgComponents.DriveFileRenameOutline,
  DriveFolderUpload: digitUiSvgComponents.DriveFolderUpload,
  DryCleaning: digitUiSvgComponents.DryCleaning,
  DSOTruck: digitUiSvgComponents.DSOTruck,
  Duo: digitUiSvgComponents.Duo,
  DynamicForm: digitUiSvgComponents.DynamicForm,
  East: digitUiSvgComponents.East,
  Eco: digitUiSvgComponents.Eco,
  Edit: digitUiSvgComponents.Edit,
  EditAttributes: digitUiSvgComponents.EditAttributes,
  EditLocation: digitUiSvgComponents.EditLocation,
  EditOff: digitUiSvgComponents.EditOff,
  EditRoad: digitUiSvgComponents.EditRoad,
  Eject: digitUiSvgComponents.Eject,
  Elderly: digitUiSvgComponents.Elderly,
  ElectricalServices: digitUiSvgComponents.ElectricalServices,
  ElectricBike: digitUiSvgComponents.ElectricBike,
  ElectricCar: digitUiSvgComponents.ElectricCar,
  ElectricMoped: digitUiSvgComponents.ElectricMoped,
  ElectricRickshaw: digitUiSvgComponents.ElectricRickshaw,
  ElectricScooter: digitUiSvgComponents.ElectricScooter,
  Email: digitUiSvgComponents.Email,
  EmojiEmotions: digitUiSvgComponents.EmojiEmotions,
  EmojiEvents: digitUiSvgComponents.EmojiEvents,
  EmojiFlags: digitUiSvgComponents.EmojiFlags,
  EmojiFoodBeverage: digitUiSvgComponents.EmojiFoodBeverage,
  EmojiNature: digitUiSvgComponents.EmojiNature,
  EmojiObjects: digitUiSvgComponents.EmojiObjects,
  EmojiPeople: digitUiSvgComponents.EmojiPeople,
  EmojiSymbols: digitUiSvgComponents.EmojiSymbols,
  EmojiTransportation: digitUiSvgComponents.EmojiTransportation,
  Engineering: digitUiSvgComponents.Engineering,
  Error: digitUiSvgComponents.Error,
  ErrorOutline: digitUiSvgComponents.ErrorOutline,
  EuroSymbol: digitUiSvgComponents.EuroSymbol,
  Event: digitUiSvgComponents.Event,
  EventSeat: digitUiSvgComponents.EventSeat,
  EvStation: digitUiSvgComponents.EvStation,
  ExitToApp: digitUiSvgComponents.ExitToApp,
  Expand: digitUiSvgComponents.Expand,
  ExpandLess: digitUiSvgComponents.ExpandLess,
  ExpandMore: digitUiSvgComponents.ExpandMore,
  Explore: digitUiSvgComponents.Explore,
  ExploreOff: digitUiSvgComponents.ExploreOff,
  Extension: digitUiSvgComponents.Extension,
  Face: digitUiSvgComponents.Face,
  Facebook: digitUiSvgComponents.Facebook,
  FactCheck: digitUiSvgComponents.FactCheck,
  Fastfood: digitUiSvgComponents.Fastfood,
  Favorite: digitUiSvgComponents.Favorite,
  FavoriteBorder: digitUiSvgComponents.FavoriteBorder,
  Feedback: digitUiSvgComponents.Feedback,
  Festival: digitUiSvgComponents.Festival,
  File: digitUiSvgComponents.File,
  FileDownload: digitUiSvgComponents.FileDownload,
  FileDownloadDone: digitUiSvgComponents.FileDownloadDone,
  FilePresent: digitUiSvgComponents.FilePresent,
  FileUpload: digitUiSvgComponents.FileUpload,
  FilterAlt: digitUiSvgComponents.FilterAlt,
  FilterListAlt: digitUiSvgComponents.FilterListAlt,
  FindInPage: digitUiSvgComponents.FindInPage,
  FindReplace: digitUiSvgComponents.FindReplace,
  Fingerprint: digitUiSvgComponents.Fingerprint,
  Fireplace: digitUiSvgComponents.Fireplace,
  FirstPageAlt: digitUiSvgComponents.FirstPageAlt,
  FirstPage: digitUiSvgComponents.FirstPage,
  FitScreen: digitUiSvgComponents.FitScreen,
  Flaky: digitUiSvgComponents.Flaky,
  Flight: digitUiSvgComponents.Flight,
  FlightLand: digitUiSvgComponents.FlightLand,
  FlightTakeoff: digitUiSvgComponents.FlightTakeoff,
  FlipToBack: digitUiSvgComponents.FlipToBack,
  FlipToFront: digitUiSvgComponents.FlipToFront,
  Folder: digitUiSvgComponents.Folder,
  FolderOpen: digitUiSvgComponents.FolderOpen,
  FolderShared: digitUiSvgComponents.FolderShared,
  FollowTheSigns: digitUiSvgComponents.FollowTheSigns,
  Forum: digitUiSvgComponents.Forum,
  ForwardToInbox: digitUiSvgComponents.ForwardToInbox,
  Fullscreen: digitUiSvgComponents.Fullscreen,
  FullscreenExit: digitUiSvgComponents.FullscreenExit,
  Gavel: digitUiSvgComponents.Gavel,
  GetApp: digitUiSvgComponents.GetApp,
  Gif: digitUiSvgComponents.Gif,
  Grade: digitUiSvgComponents.Grade,
  Grading: digitUiSvgComponents.Grading,
  GridView: digitUiSvgComponents.GridView,
  Group: digitUiSvgComponents.Group,
  GroupAdd: digitUiSvgComponents.GroupAdd,
  Groups: digitUiSvgComponents.Groups,
  GroupWork: digitUiSvgComponents.GroupWork,
  GTranslate: digitUiSvgComponents.GTranslate,
  Hail: digitUiSvgComponents.Hail,
  Handyman: digitUiSvgComponents.Handyman,
  Hardware: digitUiSvgComponents.Hardware,
  Help: digitUiSvgComponents.Help,
  HelpCenter: digitUiSvgComponents.HelpCenter,
  HelpOutline: digitUiSvgComponents.HelpOutline,
  HighlightAlt: digitUiSvgComponents.HighlightAlt,
  HighlightOff: digitUiSvgComponents.HighlightOff,
  History: digitUiSvgComponents.History,
  HistoryEdu: digitUiSvgComponents.HistoryEdu,
  HistoryToggleOff: digitUiSvgComponents.HistoryToggleOff,
  Home: digitUiSvgComponents.Home,
  HomeFilled: digitUiSvgComponents.HomeFilled,
  HomeRepairService: digitUiSvgComponents.HomeRepairService,
  HomeWork: digitUiSvgComponents.HomeWork,
  HorizontalSplit: digitUiSvgComponents.HorizontalSplit,
  Hotel: digitUiSvgComponents.Hotel,
  HourglassBottom: digitUiSvgComponents.HourglassBottom,
  HourglassDisabled: digitUiSvgComponents.HourglassDisabled,
  HourglassEmpty: digitUiSvgComponents.HourglassEmpty,
  HourglassFull: digitUiSvgComponents.HourglassFull,
  HourglassTop: digitUiSvgComponents.HourglassTop,
  Http: digitUiSvgComponents.Http,
  Https: digitUiSvgComponents.Https,
  Hvac: digitUiSvgComponents.Hvac,
  Icecream: digitUiSvgComponents.Icecream,
  IconSwerage: digitUiSvgComponents.IconSwerage,
  IconSwerageAlt: digitUiSvgComponents.IconSwerageAlt,
  ImportantDevices: digitUiSvgComponents.ImportantDevices,
  ImportContacts: digitUiSvgComponents.ImportContacts,
  ImportExport: digitUiSvgComponents.ImportExport,
  Info: digitUiSvgComponents.Info,
  InfoOutline: digitUiSvgComponents.InfoOutline,
  Input: digitUiSvgComponents.Input,
  IntegrationInstructions: digitUiSvgComponents.IntegrationInstructions,
  InvertColors: digitUiSvgComponents.InvertColors,
  InvertColorsOff: digitUiSvgComponents.InvertColorsOff,
  IosShare: digitUiSvgComponents.IosShare,
  KingBed: digitUiSvgComponents.KingBed,
  Label: digitUiSvgComponents.Label,
  LabelImportant: digitUiSvgComponents.LabelImportant,
  LabelImportantOutline: digitUiSvgComponents.LabelImportantOutline,
  LabelOff: digitUiSvgComponents.LabelOff,
  LabelOutline: digitUiSvgComponents.LabelOutline,
  TranslateLanguage: digitUiSvgComponents.TranslateLanguage,
  Language: digitUiSvgComponents.Language,
  LastPageAlt: digitUiSvgComponents.LastPageAlt,
  LastPage: digitUiSvgComponents.LastPage,
  Launch: digitUiSvgComponents.Launch,
  Layers: digitUiSvgComponents.Layers,
  LayersClear: digitUiSvgComponents.LayersClear,
  Leaderboard: digitUiSvgComponents.Leaderboard,
  LegendToggle: digitUiSvgComponents.LegendToggle,
  Lightbulb: digitUiSvgComponents.Lightbulb,
  LightbulbOutline: digitUiSvgComponents.LightbulbOutline,
  LineStyle: digitUiSvgComponents.LineStyle,
  LineWeight: digitUiSvgComponents.LineWeight,
  Liquor: digitUiSvgComponents.Liquor,
  List: digitUiSvgComponents.List,
  ListAlt: digitUiSvgComponents.ListAlt,
  LiveHelp: digitUiSvgComponents.LiveHelp,
  LocalActivity: digitUiSvgComponents.LocalActivity,
  LocalAirport: digitUiSvgComponents.LocalAirport,
  LocalAtm: digitUiSvgComponents.LocalAtm,
  LocalBar: digitUiSvgComponents.LocalBar,
  LocalCafe: digitUiSvgComponents.LocalCafe,
  LocalCarWash: digitUiSvgComponents.LocalCarWash,
  LocalConvenienceStore: digitUiSvgComponents.LocalConvenienceStore,
  LocalDining: digitUiSvgComponents.LocalDining,
  LocalDrink: digitUiSvgComponents.LocalDrink,
  LocalFireDepartment: digitUiSvgComponents.LocalFireDepartment,
  LocalFlorist: digitUiSvgComponents.LocalFlorist,
  LocalGasStation: digitUiSvgComponents.LocalGasStation,
  LocalGroceryStore: digitUiSvgComponents.LocalGroceryStore,
  LocalHospital: digitUiSvgComponents.LocalHospital,
  LocalHotel: digitUiSvgComponents.LocalHotel,
  LocalLaundryService: digitUiSvgComponents.LocalLaundryService,
  LocalLibrary: digitUiSvgComponents.LocalLibrary,
  LocalMall: digitUiSvgComponents.LocalMall,
  LocalMovies: digitUiSvgComponents.LocalMovies,
  LocalOffer: digitUiSvgComponents.LocalOffer,
  LocalParking: digitUiSvgComponents.LocalParking,
  LocalPharmacy: digitUiSvgComponents.LocalPharmacy,
  LocalPhone: digitUiSvgComponents.LocalPhone,
  LocalPizza: digitUiSvgComponents.LocalPizza,
  LocalPlay: digitUiSvgComponents.LocalPlay,
  LocalPolice: digitUiSvgComponents.LocalPolice,
  LocalPostOffice: digitUiSvgComponents.LocalPostOffice,
  LocalPrintshop: digitUiSvgComponents.LocalPrintshop,
  LocalSee: digitUiSvgComponents.LocalSee,
  LocalShipping: digitUiSvgComponents.LocalShipping,
  LocalTaxi: digitUiSvgComponents.LocalTaxi,
  LocationCity: digitUiSvgComponents.LocationCity,
  LocationOff: digitUiSvgComponents.LocationOff,
  LocationOn: digitUiSvgComponents.LocationOn,
  LocationPin: digitUiSvgComponents.LocationPin,
  Lock: digitUiSvgComponents.Lock,
  LockClock: digitUiSvgComponents.LockClock,
  LockOpen: digitUiSvgComponents.LockOpen,
  LockOutline: digitUiSvgComponents.LockOutline,
  Login: digitUiSvgComponents.Login,
  Logout: digitUiSvgComponents.Logout,
  Loyalty: digitUiSvgComponents.Loyalty,
  Luggage: digitUiSvgComponents.Luggage,
  LunchDining: digitUiSvgComponents.LunchDining,
  MailOutline: digitUiSvgComponents.MailOutline,
  Map: digitUiSvgComponents.Map,
  MapsUgc: digitUiSvgComponents.MapsUgc,
  MarkAsUnread: digitUiSvgComponents.MarkAsUnread,
  MarkChatRead: digitUiSvgComponents.MarkChatRead,
  MarkChatUnread: digitUiSvgComponents.MarkChatUnread,
  MarkEmailRead: digitUiSvgComponents.MarkEmailRead,
  MarkEmailUnread: digitUiSvgComponents.MarkEmailUnread,
  MarkunreadMailbox: digitUiSvgComponents.MarkunreadMailbox,
  Masks: digitUiSvgComponents.Masks,
  Maximize: digitUiSvgComponents.Maximize,
  Mediation: digitUiSvgComponents.Mediation,
  MedicalServices: digitUiSvgComponents.MedicalServices,
  Menu: digitUiSvgComponents.Menu,
  MenuBook: digitUiSvgComponents.MenuBook,
  MenuOpen: digitUiSvgComponents.MenuOpen,
  Message: digitUiSvgComponents.Message,
  MilitaryTech: digitUiSvgComponents.MilitaryTech,
  Minimize: digitUiSvgComponents.Minimize,
  MiscellaneousServices: digitUiSvgComponents.MiscellaneousServices,
  MobileScreenShare: digitUiSvgComponents.MobileScreenShare,
  ModelTraining: digitUiSvgComponents.ModelTraining,
  Money: digitUiSvgComponents.Money,
  Mood: digitUiSvgComponents.Mood,
  MoodBad: digitUiSvgComponents.MoodBad,
  Moped: digitUiSvgComponents.Moped,
  MoreHoriz: digitUiSvgComponents.MoreHoriz,
  MoreTime: digitUiSvgComponents.MoreTime,
  MoreVert: digitUiSvgComponents.MoreVert,
  MultipleStop: digitUiSvgComponents.MultipleStop,
  Museum: digitUiSvgComponents.Museum,
  MyLocation: digitUiSvgComponents.MyLocation,
  Nat: digitUiSvgComponents.Nat,
  Navigation: digitUiSvgComponents.Navigation,
  NearMe: digitUiSvgComponents.NearMe,
  NearMeDisabled: digitUiSvgComponents.NearMeDisabled,
  NextPlan: digitUiSvgComponents.NextPlan,
  Nightlife: digitUiSvgComponents.Nightlife,
  NightlightRound: digitUiSvgComponents.NightlightRound,
  NightsStay: digitUiSvgComponents.NightsStay,
  NoLuggage: digitUiSvgComponents.NoLuggage,
  NoMeals: digitUiSvgComponents.NoMeals,
  NoMealsOuline: digitUiSvgComponents.NoMealsOuline,
  NoResultsFoundIcon: digitUiSvgComponents.NoResultsFoundIcon,
  North: digitUiSvgComponents.North,
  NorthEast: digitUiSvgComponents.NorthEast,
  NorthWest: digitUiSvgComponents.NorthWest,
  NoSim: digitUiSvgComponents.NoSim,
  NotAccessible: digitUiSvgComponents.NotAccessible,
  NoteAdd: digitUiSvgComponents.NoteAdd,
  NotificationImportant: digitUiSvgComponents.NotificationImportant,
  Notifications: digitUiSvgComponents.Notifications,
  NotificationsActive: digitUiSvgComponents.NotificationsActive,
  NotificationsNone: digitUiSvgComponents.NotificationsNone,
  NotificationsOff: digitUiSvgComponents.NotificationsOff,
  NotificationsPaused: digitUiSvgComponents.NotificationsPaused,
  NotListedLocation: digitUiSvgComponents.NotListedLocation,
  NoTransfer: digitUiSvgComponents.NoTransfer,
  NotStarted: digitUiSvgComponents.NotStarted,
  TorchNoun: digitUiSvgComponents.TorchNoun,
  OfflineBolt: digitUiSvgComponents.OfflineBolt,
  OfflinePin: digitUiSvgComponents.OfflinePin,
  OfflineShare: digitUiSvgComponents.OfflineShare,
  OnlinePrediction: digitUiSvgComponents.OnlinePrediction,
  Opacity: digitUiSvgComponents.Opacity,
  OpenInBrowser: digitUiSvgComponents.OpenInBrowser,
  OpenInFull: digitUiSvgComponents.OpenInFull,
  OpenInNew: digitUiSvgComponents.OpenInNew,
  OpenWith: digitUiSvgComponents.OpenWith,
  Outbond: digitUiSvgComponents.Outbond,
  Outbox: digitUiSvgComponents.Outbox,
  OutdoorGrill: digitUiSvgComponents.OutdoorGrill,
  OutgoingMail: digitUiSvgComponents.OutgoingMail,
  Outlet: digitUiSvgComponents.Outlet,
  Pages: digitUiSvgComponents.Pages,
  Pageview: digitUiSvgComponents.Pageview,
  PanTool: digitUiSvgComponents.PanTool,
  Park: digitUiSvgComponents.Park,
  PartyMode: digitUiSvgComponents.PartyMode,
  PausePresentation: digitUiSvgComponents.PausePresentation,
  Payment: digitUiSvgComponents.Payment,
  Payments: digitUiSvgComponents.Payments,
  PedalBike: digitUiSvgComponents.PedalBike,
  Pending: digitUiSvgComponents.Pending,
  PendingActions: digitUiSvgComponents.PendingActions,
  People: digitUiSvgComponents.People,
  PeopleAlt: digitUiSvgComponents.PeopleAlt,
  PeopleOutline: digitUiSvgComponents.PeopleOutline,
  PermCameraMic: digitUiSvgComponents.PermCameraMic,
  PermContactCalendar: digitUiSvgComponents.PermContactCalendar,
  PermDataSetting: digitUiSvgComponents.PermDataSetting,
  PermDeviceInformation: digitUiSvgComponents.PermDeviceInformation,
  PermIdentity: digitUiSvgComponents.PermIdentity,
  PermMedia: digitUiSvgComponents.PermMedia,
  PermPhoneMsg: digitUiSvgComponents.PermPhoneMsg,
  PermScanWifi: digitUiSvgComponents.PermScanWifi,
  Person: digitUiSvgComponents.Person,
  PersonAdd: digitUiSvgComponents.PersonAdd,
  PersonAddAlt: digitUiSvgComponents.PersonAddAlt,
  PersonAddSecondary: digitUiSvgComponents.PersonAddSecondary,
  PersonAddDisabled: digitUiSvgComponents.PersonAddDisabled,
  PersonOutline: digitUiSvgComponents.PersonOutline,
  PersonPin: digitUiSvgComponents.PersonPin,
  PersonPinCircle: digitUiSvgComponents.PersonPinCircle,
  PersonRemove: digitUiSvgComponents.PersonRemove,
  PersonRemoveAlt: digitUiSvgComponents.PersonRemoveAlt,
  PersonSearch: digitUiSvgComponents.PersonSearch,
  PestControl: digitUiSvgComponents.PestControl,
  PestControlRodent: digitUiSvgComponents.PestControlRodent,
  Pets: digitUiSvgComponents.Pets,
  Phone: digitUiSvgComponents.Phone,
  PhoneDisabled: digitUiSvgComponents.PhoneDisabled,
  PhoneEnabled: digitUiSvgComponents.PhoneEnabled,
  PhonelinkErase: digitUiSvgComponents.PhonelinkErase,
  PhonelinkLock: digitUiSvgComponents.PhonelinkLock,
  PhonelinkRing: digitUiSvgComponents.PhonelinkRing,
  PhonelinkSetup: digitUiSvgComponents.PhonelinkSetup,
  PictureInPicture: digitUiSvgComponents.PictureInPicture,
  PictureInPictureAlt: digitUiSvgComponents.PictureInPictureAlt,
  PinDrop: digitUiSvgComponents.PinDrop,
  PivotTableChart: digitUiSvgComponents.PivotTableChart,
  Place: digitUiSvgComponents.Place,
  Plagiarism: digitUiSvgComponents.Plagiarism,
  PlayForWork: digitUiSvgComponents.PlayForWork,
  Plumbing: digitUiSvgComponents.Plumbing,
  PlusOne: digitUiSvgComponents.PlusOne,
  Poll: digitUiSvgComponents.Poll,
  Polymer: digitUiSvgComponents.Polymer,
  Population: digitUiSvgComponents.Population,
  PortableWifiOff: digitUiSvgComponents.PortableWifiOff,
  PowerSettingsNew: digitUiSvgComponents.PowerSettingsNew,
  PregnantWoman: digitUiSvgComponents.PregnantWoman,
  PresentToAll: digitUiSvgComponents.PresentToAll,
  Preview: digitUiSvgComponents.Preview,
  Print: digitUiSvgComponents.Print,
  PrintDisabled: digitUiSvgComponents.PrintDisabled,
  PrivacyTip: digitUiSvgComponents.PrivacyTip,
  Psychology: digitUiSvgComponents.Psychology,
  Public: digitUiSvgComponents.Public,
  PublicOff: digitUiSvgComponents.PublicOff,
  PublishedWithChanges: digitUiSvgComponents.PublishedWithChanges,
  QrCode: digitUiSvgComponents.QrCode,
  QrCodeScanner: digitUiSvgComponents.QrCodeScanner,
  QueryBuilder: digitUiSvgComponents.QueryBuilder,
  QuestionAnswer: digitUiSvgComponents.QuestionAnswer,
  Quickreply: digitUiSvgComponents.Quickreply,
  RailwayAlert: digitUiSvgComponents.RailwayAlert,
  RamenDining: digitUiSvgComponents.RamenDining,
  RateReview: digitUiSvgComponents.RateReview,
  ReadMore: digitUiSvgComponents.ReadMore,
  Receipt: digitUiSvgComponents.Receipt,
  Recommend: digitUiSvgComponents.Recommend,
  RecordVoiceOver: digitUiSvgComponents.RecordVoiceOver,
  Redeem: digitUiSvgComponents.Redeem,
  ReduceCapacity: digitUiSvgComponents.ReduceCapacity,
  Refresh: digitUiSvgComponents.Refresh,
  RemoveDone: digitUiSvgComponents.RemoveDone,
  RemoveModerator: digitUiSvgComponents.RemoveModerator,
  RemoveShoppingCart: digitUiSvgComponents.RemoveShoppingCart,
  Reorder: digitUiSvgComponents.Reorder,
  ReportProblem: digitUiSvgComponents.ReportProblem,
  RequestPage: digitUiSvgComponents.RequestPage,
  RequestQuote: digitUiSvgComponents.RequestQuote,
  Restaurant: digitUiSvgComponents.Restaurant,
  RestaurantMenu: digitUiSvgComponents.RestaurantMenu,
  Restore: digitUiSvgComponents.Restore,
  RestoreFromTrash: digitUiSvgComponents.RestoreFromTrash,
  RestorePage: digitUiSvgComponents.RestorePage,
  RingVolume: digitUiSvgComponents.RingVolume,
  Room: digitUiSvgComponents.Room,
  RoundedCorner: digitUiSvgComponents.RoundedCorner,
  Rowing: digitUiSvgComponents.Rowing,
  RssFeed: digitUiSvgComponents.RssFeed,
  Rtt: digitUiSvgComponents.Rtt,
  Rule: digitUiSvgComponents.Rule,
  RuleFolder: digitUiSvgComponents.RuleFolder,
  RunCircle: digitUiSvgComponents.RunCircle,
  Sanitizer: digitUiSvgComponents.Sanitizer,
  Satellite: digitUiSvgComponents.Satellite,
  SavedSearch: digitUiSvgComponents.SavedSearch,
  Schedule: digitUiSvgComponents.Schedule,
  ScheduleSend: digitUiSvgComponents.ScheduleSend,
  School: digitUiSvgComponents.School,
  Science: digitUiSvgComponents.Science,
  ScreenShare: digitUiSvgComponents.ScreenShare,
  Search: digitUiSvgComponents.Search,
  SearchOff: digitUiSvgComponents.SearchOff,
  Segment: digitUiSvgComponents.Segment,
  SelfImprovement: digitUiSvgComponents.SelfImprovement,
  SendAndArchive: digitUiSvgComponents.SendAndArchive,
  SentimentDissatisfied: digitUiSvgComponents.SentimentDissatisfied,
  SentimentNeutral: digitUiSvgComponents.SentimentNeutral,
  SentimentSatisfied: digitUiSvgComponents.SentimentSatisfied,
  SentimentSatisfiedAlt: digitUiSvgComponents.SentimentSatisfiedAlt,
  SentimentVeryDissatisfied: digitUiSvgComponents.SentimentVeryDissatisfied,
  SentimentVerySatisfied: digitUiSvgComponents.SentimentVerySatisfied,
  SetMeal: digitUiSvgComponents.SetMeal,
  Settings: digitUiSvgComponents.Settings,
  SettingsApplications: digitUiSvgComponents.SettingsApplications,
  SettingsBackupRestore: digitUiSvgComponents.SettingsBackupRestore,
  SettingsBluetooth: digitUiSvgComponents.SettingsBluetooth,
  SettingsBrightness: digitUiSvgComponents.SettingsBrightness,
  SettingsCell: digitUiSvgComponents.SettingsCell,
  SettingsEthernet: digitUiSvgComponents.SettingsEthernet,
  SettingsInputAntenna: digitUiSvgComponents.SettingsInputAntenna,
  SettingsInputComponent: digitUiSvgComponents.SettingsInputComponent,
  SettingsInputComposite: digitUiSvgComponents.SettingsInputComposite,
  SettingsInputHdmi: digitUiSvgComponents.SettingsInputHdmi,
  SettingsInputVideo: digitUiSvgComponents.SettingsInputVideo,
  SettingsOverscan: digitUiSvgComponents.SettingsOverscan,
  SettingsPhone: digitUiSvgComponents.SettingsPhone,
  SettingsPower: digitUiSvgComponents.SettingsPower,
  SettingsRemote: digitUiSvgComponents.SettingsRemote,
  SettingsVoice: digitUiSvgComponents.SettingsVoice,
  Share: digitUiSvgComponents.Share,
  Shop: digitUiSvgComponents.Shop,
  ShoppingBag: digitUiSvgComponents.ShoppingBag,
  ShoppingBasket: digitUiSvgComponents.ShoppingBasket,
  ShoppingCart: digitUiSvgComponents.ShoppingCart,
  ShopAlt: digitUiSvgComponents.ShopAlt,
  Sick: digitUiSvgComponents.Sick,
  SingleBed: digitUiSvgComponents.SingleBed,
  SmartButton: digitUiSvgComponents.SmartButton,
  SnippetFolder: digitUiSvgComponents.SnippetFolder,
  Source: digitUiSvgComponents.Source,
  South: digitUiSvgComponents.South,
  SouthEast: digitUiSvgComponents.SouthEast,
  SouthWest: digitUiSvgComponents.SouthWest,
  SpeakerNotes: digitUiSvgComponents.SpeakerNotes,
  SpeakerNotesOff: digitUiSvgComponents.SpeakerNotesOff,
  SpeakerPhone: digitUiSvgComponents.SpeakerPhone,
  SpellCheck: digitUiSvgComponents.SpellCheck,
  Sports: digitUiSvgComponents.Sports,
  SportsBaseball: digitUiSvgComponents.SportsBaseball,
  SportsBasketball: digitUiSvgComponents.SportsBasketball,
  SportsCricket: digitUiSvgComponents.SportsCricket,
  SportsEsports: digitUiSvgComponents.SportsEsports,
  SportsFootball: digitUiSvgComponents.SportsFootball,
  SportsGolf: digitUiSvgComponents.SportsGolf,
  SportsHandball: digitUiSvgComponents.SportsHandball,
  SportsHockey: digitUiSvgComponents.SportsHockey,
  SportsKabaddi: digitUiSvgComponents.SportsKabaddi,
  SportsMma: digitUiSvgComponents.SportsMma,
  SportsMotorsports: digitUiSvgComponents.SportsMotorsports,
  SportsRugby: digitUiSvgComponents.SportsRugby,
  SportsSoccer: digitUiSvgComponents.SportsSoccer,
  SportsTennis: digitUiSvgComponents.SportsTennis,
  SportsVolleyball: digitUiSvgComponents.SportsVolleyball,
  StarRate: digitUiSvgComponents.StarRate,
  Stars: digitUiSvgComponents.Stars,
  StayCurrentLandscape: digitUiSvgComponents.StayCurrentLandscape,
  StayCurrentPortrait: digitUiSvgComponents.StayCurrentPortrait,
  StayPrimaryLandscape: digitUiSvgComponents.StayPrimaryLandscape,
  StayPrimaryPortrait: digitUiSvgComponents.StayPrimaryPortrait,
  StickyNotesSecondary: digitUiSvgComponents.StickyNotesSecondary,
  ScreenShareStop: digitUiSvgComponents.ScreenShareStop,
  Store: digitUiSvgComponents.Store,
  StoreMallDirectory: digitUiSvgComponents.StoreMallDirectory,
  StreetView: digitUiSvgComponents.StreetView,
  SubdirectoryArrowLeft: digitUiSvgComponents.SubdirectoryArrowLeft,
  SubdirectoryArrowRight: digitUiSvgComponents.SubdirectoryArrowRight,
  Subject: digitUiSvgComponents.Subject,
  SubtitlesOff: digitUiSvgComponents.SubtitlesOff,
  Subway: digitUiSvgComponents.Subway,
  SupervisedUserCircle: digitUiSvgComponents.SupervisedUserCircle,
  SupervisorAccount: digitUiSvgComponents.SupervisorAccount,
  Support: digitUiSvgComponents.Support,
  SwapCalls: digitUiSvgComponents.SwapCalls,
  SwapHorizontal: digitUiSvgComponents.SwapHorizontal,
  SwapHorizontalCircle: digitUiSvgComponents.SwapHorizontalCircle,
  SwapVertical: digitUiSvgComponents.SwapVertical,
  SwapVerticalCircle: digitUiSvgComponents.SwapVerticalCircle,
  Swipe: digitUiSvgComponents.Swipe,
  SwitchAccount: digitUiSvgComponents.SwitchAccount,
  SwitchLeft: digitUiSvgComponents.SwitchLeft,
  SwitchRight: digitUiSvgComponents.SwitchRight,
  SyncAlt: digitUiSvgComponents.SyncAlt,
  SystemUpdateAlt: digitUiSvgComponents.SystemUpdateAlt,
  Tab: digitUiSvgComponents.Tab,
  TableView: digitUiSvgComponents.TableView,
  TabUnselected: digitUiSvgComponents.TabUnselected,
  TakeOutDining: digitUiSvgComponents.TakeOutDining,
  TaxiAlert: digitUiSvgComponents.TaxiAlert,
  Terrain: digitUiSvgComponents.Terrain,
  TextRotateUp: digitUiSvgComponents.TextRotateUp,
  TextRotateVertical: digitUiSvgComponents.TextRotateVertical,
  TextRotationAngleDown: digitUiSvgComponents.TextRotationAngleDown,
  TextRotationAngleUp: digitUiSvgComponents.TextRotationAngleUp,
  TextRotationDown: digitUiSvgComponents.TextRotationDown,
  TextRotationNone: digitUiSvgComponents.TextRotationNone,
  SMSText: digitUiSvgComponents.SMSText,
  TextSnippet: digitUiSvgComponents.TextSnippet,
  TheaterComedy: digitUiSvgComponents.TheaterComedy,
  Theaters: digitUiSvgComponents.Theaters,
  ThumbDown: digitUiSvgComponents.ThumbDown,
  ThumbDownAlt: digitUiSvgComponents.ThumbDownAlt,
  ThumbDownOffAlt: digitUiSvgComponents.ThumbDownOffAlt,
  ThumbsUpDown: digitUiSvgComponents.ThumbsUpDown,
  ThumbUp: digitUiSvgComponents.ThumbUp,
  ThumbUpAlt: digitUiSvgComponents.ThumbUpAlt,
  ThumbUpOffAlt: digitUiSvgComponents.ThumbUpOffAlt,
  Timeline: digitUiSvgComponents.Timeline,
  Toc: digitUiSvgComponents.Toc,
  Today: digitUiSvgComponents.Today,
  Toll: digitUiSvgComponents.Toll,
  Topic: digitUiSvgComponents.Topic,
  Torch: digitUiSvgComponents.Torch,
  TouchApp: digitUiSvgComponents.TouchApp,
  Tour: digitUiSvgComponents.Tour,
  TrackChanges: digitUiSvgComponents.TrackChanges,
  Traffic: digitUiSvgComponents.Traffic,
  Train: digitUiSvgComponents.Train,
  Tram: digitUiSvgComponents.Tram,
  TransferWithinStation: digitUiSvgComponents.TransferWithinStation,
  TransitEnterExit: digitUiSvgComponents.TransitEnterExit,
  Translate: digitUiSvgComponents.Translate,
  TrendingDown: digitUiSvgComponents.TrendingDown,
  TrendingFlat: digitUiSvgComponents.TrendingFlat,
  TrendingUp: digitUiSvgComponents.TrendingUp,
  TripOrigin: digitUiSvgComponents.TripOrigin,
  TurnedIn: digitUiSvgComponents.TurnedIn,
  TurnedInNot: digitUiSvgComponents.TurnedInNot,
  TwoWheeler: digitUiSvgComponents.TwoWheeler,
  UnfoldLess: digitUiSvgComponents.UnfoldLess,
  UnfoldMore: digitUiSvgComponents.UnfoldMore,
  Unpublished: digitUiSvgComponents.Unpublished,
  Unsubscribe: digitUiSvgComponents.Unsubscribe,
  Update: digitUiSvgComponents.Update,
  UpdateExpense: digitUiSvgComponents.UpdateExpense,
  UpdateExpenseSecondary: digitUiSvgComponents.UpdateExpenseSecondary,
  Upgrade: digitUiSvgComponents.Upgrade,
  UploadFile: digitUiSvgComponents.UploadFile,
  Verified: digitUiSvgComponents.Verified,
  VerifiedUser: digitUiSvgComponents.VerifiedUser,
  VerticalSplit: digitUiSvgComponents.VerticalSplit,
  ViewAgenda: digitUiSvgComponents.ViewAgenda,
  ViewArray: digitUiSvgComponents.ViewArray,
  ViewCarousel: digitUiSvgComponents.ViewCarousel,
  ViewColumn: digitUiSvgComponents.ViewColumn,
  ViewDay: digitUiSvgComponents.ViewDay,
  ViewHeadline: digitUiSvgComponents.ViewHeadline,
  ViewInAr: digitUiSvgComponents.ViewInAr,
  ViewList: digitUiSvgComponents.ViewList,
  ViewModule: digitUiSvgComponents.ViewModule,
  ViewQuilt: digitUiSvgComponents.ViewQuilt,
  ViewSidebar: digitUiSvgComponents.ViewSidebar,
  ViewStream: digitUiSvgComponents.ViewStream,
  ViewWeek: digitUiSvgComponents.ViewWeek,
  Visibility: digitUiSvgComponents.Visibility,
  VisibilityOff: digitUiSvgComponents.VisibilityOff,
  Voicemail: digitUiSvgComponents.Voicemail,
  VoiceOverOff: digitUiSvgComponents.VoiceOverOff,
  VolunteerActivism: digitUiSvgComponents.VolunteerActivism,
  VpnKey: digitUiSvgComponents.VpnKey,
  Warning: digitUiSvgComponents.Warning,
  WatchLater: digitUiSvgComponents.WatchLater,
  WaterfallChart: digitUiSvgComponents.WaterfallChart,
  West: digitUiSvgComponents.West,
  Whatsapp: digitUiSvgComponents.Whatsapp,
  Whatshot: digitUiSvgComponents.Whatshot,
  WifiCalling: digitUiSvgComponents.WifiCalling,
  WifiProtectedSetup: digitUiSvgComponents.WifiProtectedSetup,
  WineBar: digitUiSvgComponents.WineBar,
  Work: digitUiSvgComponents.Work,
  WorkOff: digitUiSvgComponents.WorkOff,
  WorkOutline: digitUiSvgComponents.WorkOutline,
  WorkspacesFilled: digitUiSvgComponents.WorkspacesFilled,
  WorkspacesOutline: digitUiSvgComponents.WorkspacesOutline,
  WrongLocation: digitUiSvgComponents.WrongLocation,
  Wysiwyg: digitUiSvgComponents.Wysiwyg,
  YoutubeSearchedFor: digitUiSvgComponents.YoutubeSearchedFor,
  ZoomIn: digitUiSvgComponents.ZoomIn,
  ZoomOut: digitUiSvgComponents.ZoomOut,
  ZoomOutMap: digitUiSvgComponents.ZoomOutMap
};

var CollapseAndExpandGroups = function CollapseAndExpandGroups(_ref) {
  var children = _ref.children,
    _ref$groupElements = _ref.groupElements,
    groupElements = _ref$groupElements === void 0 ? false : _ref$groupElements,
    _ref$groupHeader = _ref.groupHeader,
    groupHeader = _ref$groupHeader === void 0 ? "" : _ref$groupHeader,
    _ref$headerLabel = _ref.headerLabel,
    headerLabel = _ref$headerLabel === void 0 ? "" : _ref$headerLabel,
    _ref$headerValue = _ref.headerValue,
    headerValue = _ref$headerValue === void 0 ? "" : _ref$headerValue,
    _ref$customClass = _ref.customClass,
    customClass = _ref$customClass === void 0 ? "" : _ref$customClass,
    _ref$showHelper = _ref.showHelper,
    showHelper = _ref$showHelper === void 0 ? false : _ref$showHelper,
    _ref$collapseState = _ref.collapseState,
    collapseState = _ref$collapseState === void 0 ? false : _ref$collapseState;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useState = React.useState(collapseState),
    collapse = _useState[0],
    setCollapse = _useState[1];
  return /*#__PURE__*/React__default.createElement("div", {
    className: groupElements ? "digit-expand-collapse-wrapper " + customClass : "" + customClass
  }, groupHeader && /*#__PURE__*/React__default.createElement("header", {
    style: {
      marginBottom: "0px",
      fontSize: "24px"
    }
  }, t(groupHeader)), groupElements && /*#__PURE__*/React__default.createElement("div", {
    className: "digit-expand-collapse-header"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "label"
  }, headerLabel), /*#__PURE__*/React__default.createElement("span", {
    className: "value"
  }, headerValue), /*#__PURE__*/React__default.createElement("div", {
    onClick: function onClick() {
      return setCollapse(function (prev) {
        return !prev;
      });
    },
    className: "digit-icon-toggle "
  }, !collapse && /*#__PURE__*/React__default.createElement("span", null, showHelper && /*#__PURE__*/React__default.createElement("h5", null, t("COMMON_CORE_COLLAPSE")), /*#__PURE__*/React__default.createElement(SVG.ArrowUpward, null)), collapse && /*#__PURE__*/React__default.createElement("span", null, showHelper && /*#__PURE__*/React__default.createElement("h5", null, t("COMMON_CORE_EXPAND")), /*#__PURE__*/React__default.createElement(SVG.ArrowDownward, null)))), /*#__PURE__*/React__default.createElement("div", {
    className: (groupElements ? "digit-toggling-wrapper" : "") + " " + (groupElements && collapse ? "digit-collapse" : "")
  }, children));
};
CollapseAndExpandGroups.propTypes = {
  children: propTypes.node,
  style: propTypes.object,
  customClass: propTypes.string,
  groupElements: propTypes.bool,
  groupHeader: propTypes.string,
  headerLabel: propTypes.string,
  headerValue: propTypes.string
};

var NoResultsFound = function NoResultsFound() {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "no-data-found"
  }, /*#__PURE__*/React__default.createElement(NoResultsFoundIcon, null), /*#__PURE__*/React__default.createElement("span", {
    className: "error-msg"
  }, t("COMMON_NO_RESULTS_FOUND")));
};

var ViewImages = function ViewImages(props) {
  var _useState = React.useState(null),
    uploadedImagesThumbs = _useState[0],
    setUploadedImagesThumbs = _useState[1];
  var _useState2 = React.useState(props.fileStoreIds),
    uploadedImagesIds = _useState2[0],
    setUploadedImagesIds = _useState2[1];
  React.useEffect(function () {
    setUploadedImagesIds(props.fileStoreIds);
  }, [props.fileStoreIds]);
  React.useEffect(function () {
    (function () {
      try {
        var _temp = function () {
          if (uploadedImagesIds !== null) {
            return Promise.resolve(submit()).then(function () {});
          }
        }();
        return _temp && _temp.then ? _temp.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [uploadedImagesIds]);
  function addImageThumbnails(thumbnailsData) {
    var keys = Object.keys(thumbnailsData.data);
    var index = keys.findIndex(function (key) {
      return key === "fileStoreIds";
    });
    if (index > -1) {
      keys.splice(index, 1);
    }
    var thumbnails = [];
    var newThumbnails = keys.map(function (key) {
      return {
        image: thumbnailsData.data[key].split(",")[2],
        key: key,
        fullImage: Digit.Utils.getFileUrl(thumbnailsData.data[key])
      };
    });
    setUploadedImagesThumbs([].concat(thumbnails, newThumbnails));
  }
  var submit = React.useCallback(function () {
    try {
      var _temp2 = function () {
        if (uploadedImagesIds !== null && uploadedImagesIds.length > 0) {
          return Promise.resolve(Digit.UploadServices.Filefetch(uploadedImagesIds, props.tenantId)).then(function (res) {
            addImageThumbnails(res);
          });
        }
      }();
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [uploadedImagesIds]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap'
    }
  }, uploadedImagesThumbs === null || uploadedImagesThumbs === void 0 ? void 0 : uploadedImagesThumbs.map(function (thumbnail, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      style: {
        minWidth: '160px',
        marginRight: '8px',
        marginBottom: '8px',
        maxWidth: '200px'
      }
    }, /*#__PURE__*/React__default.createElement("img", {
      src: thumbnail.image,
      alt: "uploaded thumbnail",
      onClick: function onClick() {
        return props.onClick(thumbnail.fullImage, index);
      }
    }));
  })));
};

var InboxContext = React.createContext(null);

var ResultsTable = function ResultsTable(_ref) {
  var _searchResult, _searchResult2, _searchResult3, _Digit2, _Digit2$Customization, _Digit2$Customization2, _Digit2$Customization3;
  var config = _ref.config,
    data = _ref.data,
    isLoading = _ref.isLoading,
    isFetching = _ref.isFetching,
    fullConfig = _ref.fullConfig;
  var apiDetails = fullConfig.apiDetails;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var resultsKey = config.resultsJsonPath;
  var searchResult = _.get(data, resultsKey, []);
  searchResult = ((_searchResult = searchResult) === null || _searchResult === void 0 ? void 0 : _searchResult.length) > 0 ? searchResult : [];
  searchResult = searchResult.reverse();
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  var _useContext = React.useContext(InboxContext),
    dispatch = _useContext.dispatch;
  var tableColumns = React.useMemo(function () {
    var _config$columns;
    return config === null || config === void 0 ? void 0 : (_config$columns = config.columns) === null || _config$columns === void 0 ? void 0 : _config$columns.map(function (column) {
      if (column.additionalCustomization) {
        return {
          Header: t(column === null || column === void 0 ? void 0 : column.label) || t("ES_COMMON_NA"),
          accessor: column.jsonPath,
          headerAlign: column === null || column === void 0 ? void 0 : column.headerAlign,
          Cell: function Cell(_ref2) {
            var _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit$Customizations3;
            var value = _ref2.value,
              row = _ref2.row;
            return (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit$Customizations2 === void 0 ? void 0 : (_Digit$Customizations3 = _Digit$Customizations2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit$Customizations3 === void 0 ? void 0 : _Digit$Customizations3.additionalCustomizations(row.original, column === null || column === void 0 ? void 0 : column.label, column, value, t, searchResult);
          }
        };
      }
      return {
        Header: t(column === null || column === void 0 ? void 0 : column.label) || t("ES_COMMON_NA"),
        accessor: column.jsonPath,
        headerAlign: column === null || column === void 0 ? void 0 : column.headerAlign,
        Cell: function Cell(_ref3) {
          var value = _ref3.value;
          return String(value ? column.translate ? t(column.prefix ? "" + column.prefix + value : value) : value : column !== null && column !== void 0 && column.dontShowNA ? " " : t("ES_COMMON_NA"));
        }
      };
    });
  }, [config, searchResult]);
  var _useForm = reactHookForm.useForm({
      defaultValues: {
        offset: 0,
        limit: 10
      }
    }),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    setValue = _useForm.setValue,
    getValues = _useForm.getValues;
  var isMobile = window.Digit.Utils.browser.isMobile();
  var _useState = React.useState(""),
    searchQuery = _useState[0],
    onSearch = _useState[1];
  var filterValue = React.useCallback(function (rows, id, filterValue) {
    if (filterValue === void 0) {
      filterValue = "";
    }
    return rows.filter(function (row) {
      var res = Object.keys(row === null || row === void 0 ? void 0 : row.values).find(function (key) {
        var _row$values, _String$toLowerCase, _row$values5, _filterValue3, _String$toLowerCase2, _row$values6, _filterValue4;
        if (typeof (row === null || row === void 0 ? void 0 : (_row$values = row.values) === null || _row$values === void 0 ? void 0 : _row$values[key]) === "object") {
          var _row$values2;
          return Object.keys(row === null || row === void 0 ? void 0 : (_row$values2 = row.values) === null || _row$values2 === void 0 ? void 0 : _row$values2[key]).find(function (id) {
            var _String, _row$values4, _row$values4$key, _filterValue2;
            if (id === "insight") {
              var _row$values3, _row$values3$key, _filterValue;
              return String(Math.abs(row === null || row === void 0 ? void 0 : (_row$values3 = row.values) === null || _row$values3 === void 0 ? void 0 : (_row$values3$key = _row$values3[key]) === null || _row$values3$key === void 0 ? void 0 : _row$values3$key[id]) + "%").toLowerCase().startsWith((_filterValue = filterValue) === null || _filterValue === void 0 ? void 0 : _filterValue.toLowerCase());
            }
            return (_String = String(row === null || row === void 0 ? void 0 : (_row$values4 = row.values) === null || _row$values4 === void 0 ? void 0 : (_row$values4$key = _row$values4[key]) === null || _row$values4$key === void 0 ? void 0 : _row$values4$key[id])) === null || _String === void 0 ? void 0 : _String.toLowerCase().includes((_filterValue2 = filterValue) === null || _filterValue2 === void 0 ? void 0 : _filterValue2.toLowerCase());
          });
        }
        return ((_String$toLowerCase = String(row === null || row === void 0 ? void 0 : (_row$values5 = row.values) === null || _row$values5 === void 0 ? void 0 : _row$values5[key]).toLowerCase()) === null || _String$toLowerCase === void 0 ? void 0 : _String$toLowerCase.includes((_filterValue3 = filterValue) === null || _filterValue3 === void 0 ? void 0 : _filterValue3.toLowerCase())) || ((_String$toLowerCase2 = String(t(row === null || row === void 0 ? void 0 : (_row$values6 = row.values) === null || _row$values6 === void 0 ? void 0 : _row$values6[key])).toLowerCase()) === null || _String$toLowerCase2 === void 0 ? void 0 : _String$toLowerCase2.includes((_filterValue4 = filterValue) === null || _filterValue4 === void 0 ? void 0 : _filterValue4.toLowerCase()));
      });
      return res;
    });
  }, []);
  React.useEffect(function () {
    register("offset", 0);
    register("limit", 10);
  }, [register]);
  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  }
  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  }
  function previousPage() {
    var offsetValue = getValues("offset") - getValues("limit");
    setValue("offset", offsetValue > 0 ? offsetValue : 0);
    handleSubmit(onSubmit)();
  }
  var onSubmit = function onSubmit(data) {
    dispatch({
      type: "tableForm",
      state: _extends({}, data)
    });
  };
  if (isLoading || isFetching) return /*#__PURE__*/React__default.createElement(Loader, null);
  if (!data) return /*#__PURE__*/React__default.createElement(React.Fragment, null);
  if (((_searchResult2 = searchResult) === null || _searchResult2 === void 0 ? void 0 : _searchResult2.length) === 0) return /*#__PURE__*/React__default.createElement(NoResultsFound, null);
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, (config === null || config === void 0 ? void 0 : config.enableGlobalSearch) && /*#__PURE__*/React__default.createElement("div", {
    className: "card",
    style: {
      "padding": "0px",
      marginTop: "1rem"
    }
  }, /*#__PURE__*/React__default.createElement(TextInput, {
    className: "searchInput",
    onChange: function onChange(e) {
      return onSearch(e.target.value);
    },
    style: {
      border: "none",
      borderRadius: "200px"
    }
  })), (config === null || config === void 0 ? void 0 : config.showTableInstruction) && /*#__PURE__*/React__default.createElement("div", {
    className: "table-instruction-wrapper"
  }, /*#__PURE__*/React__default.createElement(InfoIcon, null), /*#__PURE__*/React__default.createElement("p", {
    className: "table-instruction-header"
  }, t(config === null || config === void 0 ? void 0 : config.showTableInstruction))), ((_searchResult3 = searchResult) === null || _searchResult3 === void 0 ? void 0 : _searchResult3.length) > 0 && /*#__PURE__*/React__default.createElement(Table, {
    className: config !== null && config !== void 0 && config.tableClassName ? config === null || config === void 0 ? void 0 : config.tableClassName : "table",
    t: t,
    customTableWrapperClassName: "dss-table-wrapper",
    disableSort: config !== null && config !== void 0 && config.enableColumnSort ? false : true,
    autoSort: config !== null && config !== void 0 && config.enableColumnSort ? true : false,
    globalSearch: config !== null && config !== void 0 && config.enableGlobalSearch ? filterValue : undefined,
    onSearch: config !== null && config !== void 0 && config.enableGlobalSearch ? searchQuery : undefined,
    data: searchResult,
    totalRecords: (data === null || data === void 0 ? void 0 : data.count) || (data === null || data === void 0 ? void 0 : data.TotalCount) || (data === null || data === void 0 ? void 0 : data.totalCount),
    columns: tableColumns,
    isPaginationRequired: true,
    onPageSizeChange: onPageSizeChange,
    currentPage: getValues("offset") / getValues("limit"),
    onNextPage: nextPage,
    onPrevPage: previousPage,
    pageSizeLimit: getValues("limit"),
    showCheckBox: config !== null && config !== void 0 && config.showCheckBox ? true : false,
    actionLabel: config === null || config === void 0 ? void 0 : config.checkBoxActionLabel,
    tableSelectionHandler: (_Digit2 = Digit) === null || _Digit2 === void 0 ? void 0 : (_Digit2$Customization = _Digit2.Customizations) === null || _Digit2$Customization === void 0 ? void 0 : (_Digit2$Customization2 = _Digit2$Customization[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit2$Customization2 === void 0 ? void 0 : (_Digit2$Customization3 = _Digit2$Customization2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit2$Customization3 === void 0 ? void 0 : _Digit2$Customization3.selectionHandler,
    manualPagination: config.manualPagination,
    getCellProps: function getCellProps(cellInfo) {
      return {
        style: {
          padding: "20px 18px",
          fontSize: "16px",
          whiteSpace: "normal"
        }
      };
    }
  }));
};

var initialInboxState = {
  searchForm: {},
  filterForm: {},
  tableForm: {
    limit: 10,
    offset: 0
  }
};
var reducer = function reducer(state, action) {
  switch (action.type) {
    case "searchForm":
      var updatedSearchStateSearchForm = action.state;
      return _extends({}, state, {
        searchForm: _extends({}, state.searchForm, updatedSearchStateSearchForm)
      });
    case "filterForm":
      var updatedSearchStateFilterForm = action.state;
      return _extends({}, state, {
        filterForm: _extends({}, state.filterForm, updatedSearchStateFilterForm)
      });
    case "tableForm":
      var updatedTableState = action.state;
      return _extends({}, state, {
        tableForm: _extends({}, state.tableForm, updatedTableState)
      });
    case "clearSearchForm":
      return _extends({}, state, {
        searchForm: action.state
      });
    case "clearFilterForm":
      return _extends({}, state, {
        filterForm: action.state
      });
    default:
      return state;
  }
};

var getIconComponent = function getIconComponent(iconName) {
  var _require;
  if (iconName === void 0) {
    iconName = "";
  }
  return (_require = require("@egovernments/digit-ui-react-components")) === null || _require === void 0 ? void 0 : _require[iconName];
};
var InboxSearchLinks = function InboxSearchLinks(_ref) {
  var headerText = _ref.headerText,
    links = _ref.links,
    _ref$customClass = _ref.customClass,
    customClass = _ref$customClass === void 0 ? "" : _ref$customClass,
    logoIcon = _ref.logoIcon;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var userRoles = Digit.UserService.getUser().info.roles;
  var _useState = React.useState([]),
    linksToShow = _useState[0],
    setLinksToShow = _useState[1];
  var IconComponent = getIconComponent(logoIcon === null || logoIcon === void 0 ? void 0 : logoIcon.component);
  React.useEffect(function () {
    var linksToShow = links.filter(function (_ref2) {
      var roles = _ref2.roles;
      return roles.some(function (role) {
        return userRoles.map(function (_ref3) {
          var code = _ref3.code;
          return code;
        }).includes(role);
      }) || !(roles !== null && roles !== void 0 && roles.length);
    });
    setLinksToShow(linksToShow);
  }, []);
  var renderHeader = function renderHeader() {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "logo"
    }, (logoIcon === null || logoIcon === void 0 ? void 0 : logoIcon.component) && IconComponent && /*#__PURE__*/React__default.createElement(IconComponent, {
      className: logoIcon === null || logoIcon === void 0 ? void 0 : logoIcon.customClass
    })), /*#__PURE__*/React__default.createElement("span", {
      className: "text"
    }, t(headerText)));
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-search-links-container " + customClass
  }, renderHeader(), /*#__PURE__*/React__default.createElement("div", {
    className: "contents"
  }, linksToShow.map(function (_ref4, index) {
    var _window, _window2;
    var url = _ref4.url,
      text = _ref4.text,
      _ref4$hyperlink = _ref4.hyperlink,
      hyperlink = _ref4$hyperlink === void 0 ? false : _ref4$hyperlink;
    return /*#__PURE__*/React__default.createElement("span", {
      className: "link",
      key: index
    }, hyperlink ? /*#__PURE__*/React__default.createElement("a", {
      href: "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + url
    }, t(text)) : /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + url
    }, t(text)));
  })));
};

var SearchComponent = function SearchComponent(_ref) {
  var uiConfig = _ref.uiConfig,
    _ref$header = _ref.header,
    header = _ref$header === void 0 ? "" : _ref$header,
    _ref$screenType = _ref.screenType,
    screenType = _ref$screenType === void 0 ? "search" : _ref$screenType,
    fullConfig = _ref.fullConfig,
    data = _ref.data;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useContext = React.useContext(InboxContext),
    dispatch = _useContext.dispatch;
  var _useState = React.useState(null),
    showToast = _useState[0],
    setShowToast = _useState[1];
  var updatedFields = [];
  var apiDetails = fullConfig.apiDetails;
  if (fullConfig !== null && fullConfig !== void 0 && fullConfig.postProcessResult) {
    var _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit$Customizations3;
    (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit$Customizations2 === void 0 ? void 0 : (_Digit$Customizations3 = _Digit$Customizations2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit$Customizations3 === void 0 ? void 0 : _Digit$Customizations3.postProcess(data, uiConfig);
  }
  var _useForm = reactHookForm.useForm({
      defaultValues: uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.defaultValues
    }),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    setValue = _useForm.setValue,
    getValues = _useForm.getValues,
    reset = _useForm.reset,
    watch = _useForm.watch,
    control = _useForm.control,
    formState = _useForm.formState,
    errors = _useForm.errors,
    setError = _useForm.setError,
    clearErrors = _useForm.clearErrors;
  var formData = watch();
  var checkKeyDown = function checkKeyDown(e) {
  };
  React.useEffect(function () {
    updatedFields = Object.values(formState === null || formState === void 0 ? void 0 : formState.dirtyFields);
  }, [formState]);
  var onSubmit = function onSubmit(data) {
    var _Digit2, _Digit2$Customization, _Digit2$Customization2, _Digit2$Customization3, _Digit3, _Digit3$Customization, _Digit3$Customization2, _Digit3$Customization3;
    var isAnyError = (_Digit2 = Digit) !== null && _Digit2 !== void 0 && (_Digit2$Customization = _Digit2.Customizations) !== null && _Digit2$Customization !== void 0 && (_Digit2$Customization2 = _Digit2$Customization[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) !== null && _Digit2$Customization2 !== void 0 && (_Digit2$Customization3 = _Digit2$Customization2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) !== null && _Digit2$Customization3 !== void 0 && _Digit2$Customization3.customValidationCheck ? (_Digit3 = Digit) === null || _Digit3 === void 0 ? void 0 : (_Digit3$Customization = _Digit3.Customizations) === null || _Digit3$Customization === void 0 ? void 0 : (_Digit3$Customization2 = _Digit3$Customization[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit3$Customization2 === void 0 ? void 0 : (_Digit3$Customization3 = _Digit3$Customization2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit3$Customization3 === void 0 ? void 0 : _Digit3$Customization3.customValidationCheck(data) : false;
    if (isAnyError) {
      setShowToast(isAnyError);
      setTimeout(closeToast, 3000);
      return;
    }
    if (updatedFields.length >= (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.minReqFields)) {
      dispatch({
        type: (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.type) === "filter" ? "filterForm" : "searchForm",
        state: _extends({}, data)
      });
    } else {
      setShowToast({
        warning: true,
        label: t("ES_COMMON_MIN_SEARCH_CRITERIA_MSG")
      });
      setTimeout(closeToast, 3000);
    }
  };
  var clearSearch = function clearSearch() {
    reset(uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.defaultValues);
    dispatch({
      type: "clearSearchForm",
      state: _extends({}, uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.defaultValues)
    });
  };
  var closeToast = function closeToast() {
    setShowToast(null);
  };
  var handleFilterRefresh = function handleFilterRefresh() {
    reset(uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.defaultValues);
    dispatch({
      type: "clearFilterForm",
      state: _extends({}, uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.defaultValues)
    });
  };
  var renderHeader = function renderHeader() {
    switch (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.type) {
      case "filter":
        {
          return /*#__PURE__*/React__default.createElement("div", {
            className: "filter-header-wrapper"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: "icon-filter"
          }, /*#__PURE__*/React__default.createElement(FilterIcon, null)), /*#__PURE__*/React__default.createElement("div", {
            className: "label"
          }, t(header)), /*#__PURE__*/React__default.createElement("div", {
            className: "icon-refresh",
            onClick: handleFilterRefresh
          }, /*#__PURE__*/React__default.createElement(RefreshIcon, null)));
        }
      default:
        {
          return /*#__PURE__*/React__default.createElement(Header, {
            styles: uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.headerStyle
          }, t(header));
        }
    }
  };
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: 'search-wrapper'
  }, header && renderHeader(), /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    onKeyDown: function onKeyDown(e) {
      return checkKeyDown();
    }
  }, /*#__PURE__*/React__default.createElement("div", null, (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.showFormInstruction) && /*#__PURE__*/React__default.createElement("p", {
    className: "search-instruction-header"
  }, t(uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.showFormInstruction)), /*#__PURE__*/React__default.createElement("div", {
    className: "search-field-wrapper " + screenType + " " + (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.type) + " " + (uiConfig !== null && uiConfig !== void 0 && uiConfig.formClassName ? uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.formClassName : "")
  }, /*#__PURE__*/React__default.createElement(RenderFormFields, {
    fields: uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.fields,
    control: control,
    formData: formData,
    errors: errors,
    register: register,
    setValue: setValue,
    getValues: getValues,
    setError: setError,
    clearErrors: clearErrors,
    labelStyle: {
      fontSize: "16px"
    },
    apiDetails: apiDetails,
    data: data
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "search-button-wrapper " + screenType + " " + (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.type)
  }, (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.secondaryLabel) && /*#__PURE__*/React__default.createElement(LinkLabel, {
    style: {
      marginBottom: 0,
      whiteSpace: 'nowrap'
    },
    onClick: clearSearch
  }, t(uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.secondaryLabel)), (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.primaryLabel) && /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.primaryLabel),
    submit: "submit",
    disabled: false
  }))))), showToast && /*#__PURE__*/React__default.createElement(Toast$1, {
    error: showToast.error,
    warning: showToast.warning,
    label: t(showToast.label),
    isDleteBtn: true,
    onClose: closeToast
  })));
};

var MobileSearchComponent = function MobileSearchComponent(_ref) {
  var uiConfig = _ref.uiConfig,
    modalType = _ref.modalType,
    _ref$screenType = _ref.screenType,
    screenType = _ref$screenType === void 0 ? "search" : _ref$screenType,
    fullConfig = _ref.fullConfig,
    data = _ref.data,
    onClose = _ref.onClose,
    defaultValues = _ref.defaultValues;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useContext = React.useContext(InboxContext),
    dispatch = _useContext.dispatch;
  var _useState = React.useState(null),
    showToast = _useState[0],
    setShowToast = _useState[1];
  var updatedFields = [];
  var apiDetails = fullConfig.apiDetails;
  if (fullConfig !== null && fullConfig !== void 0 && fullConfig.postProcessResult) {
    var _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit$Customizations3;
    (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit$Customizations2 === void 0 ? void 0 : (_Digit$Customizations3 = _Digit$Customizations2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit$Customizations3 === void 0 ? void 0 : _Digit$Customizations3.postProcess(data, uiConfig);
  }
  var mobileSearchSession = Digit.Hooks.useSessionStorage("MOBILE_SEARCH_MODAL_FORM", defaultValues);
  var sessionFormData = mobileSearchSession[0],
    setSessionFormData = mobileSearchSession[1],
    clearSessionFormData = mobileSearchSession[2];
  var _useForm = reactHookForm.useForm({
      defaultValues: sessionFormData
    }),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    setValue = _useForm.setValue,
    getValues = _useForm.getValues,
    reset = _useForm.reset,
    watch = _useForm.watch,
    control = _useForm.control,
    formState = _useForm.formState,
    errors = _useForm.errors,
    setError = _useForm.setError,
    clearErrors = _useForm.clearErrors;
  var formData = watch();
  var checkKeyDown = function checkKeyDown(e) {
    var keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      e.preventDefault();
    }
  };
  React.useEffect(function () {
    updatedFields = Object.values(formState === null || formState === void 0 ? void 0 : formState.dirtyFields);
  }, [formState]);
  React.useEffect(function () {
    if (!_.isEqual(sessionFormData, formData)) {
      var difference = _.pickBy(sessionFormData, function (v, k) {
        return !_.isEqual(formData[k], v);
      });
      setSessionFormData(_extends({}, sessionFormData, formData));
    }
  }, [formData]);
  React.useEffect(function () {
    clearSessionFormData();
  }, []);
  var onSubmit = function onSubmit(data) {
    onClose === null || onClose === void 0 ? void 0 : onClose();
    if (updatedFields.length >= (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.minReqFields)) {
      dispatch({
        type: modalType === "SEARCH" ? "searchForm" : "filterForm",
        state: _extends({}, data)
      });
    } else {
      setShowToast({
        warning: true,
        label: t("ES_COMMON_MIN_SEARCH_CRITERIA_MSG")
      });
      setTimeout(closeToast, 3000);
    }
  };
  var clearSearch = function clearSearch() {
    clearSessionFormData();
    reset(uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.defaultValues);
    dispatch({
      type: "clearSearchForm",
      state: _extends({}, uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.defaultValues)
    });
  };
  var closeToast = function closeToast() {
    setShowToast(null);
  };
  var renderHeader = function renderHeader() {
    switch (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.type) {
      case "filter":
        {
          return /*#__PURE__*/React__default.createElement("div", {
            className: "popup-label",
            style: {
              display: "flex",
              paddingBottom: "20px"
            }
          }, /*#__PURE__*/React__default.createElement("span", {
            className: "header",
            style: {
              display: "flex"
            }
          }, /*#__PURE__*/React__default.createElement("span", {
            className: "icon",
            style: {
              marginRight: "12px",
              marginTop: "5px",
              paddingBottom: "3px"
            }
          }, /*#__PURE__*/React__default.createElement(FilterIcon, null)), /*#__PURE__*/React__default.createElement("span", {
            style: {
              fontSize: "large"
            }
          }, t("ES_COMMON_FILTER_BY"), ":")), /*#__PURE__*/React__default.createElement("span", {
            className: "clear-search",
            onClick: clearSearch
          }, /*#__PURE__*/React__default.createElement(RefreshIcon, null)), /*#__PURE__*/React__default.createElement("span", {
            onClick: onClose
          }, /*#__PURE__*/React__default.createElement(CloseSvg, null)));
        }
      case "search":
        {
          return /*#__PURE__*/React__default.createElement("div", {
            className: "popup-label",
            style: {
              display: "flex",
              paddingBottom: "20px"
            }
          }, /*#__PURE__*/React__default.createElement("span", {
            className: "header",
            style: {
              display: "flex"
            }
          }, /*#__PURE__*/React__default.createElement("span", {
            className: "icon",
            style: {
              marginRight: "12px",
              marginTop: "5px"
            }
          }, /*#__PURE__*/React__default.createElement(SearchIcon, null)), /*#__PURE__*/React__default.createElement("span", {
            style: {
              fontSize: "large"
            }
          }, t("ES_COMMON_SEARCH_BY"))), /*#__PURE__*/React__default.createElement("span", {
            onClick: onClose
          }, /*#__PURE__*/React__default.createElement(CloseSvg, null)));
        }
      default:
        {
          return /*#__PURE__*/React__default.createElement("div", {
            className: "popup-label",
            style: {
              display: "flex",
              paddingBottom: "20px"
            }
          }, /*#__PURE__*/React__default.createElement("span", {
            className: "header",
            style: {
              display: "flex"
            }
          }, /*#__PURE__*/React__default.createElement("span", {
            className: "icon",
            style: {
              marginRight: "12px",
              marginTop: "5px"
            }
          }, /*#__PURE__*/React__default.createElement(SearchIcon, null)), /*#__PURE__*/React__default.createElement("span", {
            style: {
              fontSize: "large"
            }
          }, t("ES_COMMON_SEARCH_BY"))), /*#__PURE__*/React__default.createElement("span", {
            onClick: onClose
          }, /*#__PURE__*/React__default.createElement(CloseSvg, null)));
        }
    }
  };
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "search-wrapper"
  }, /*#__PURE__*/React__default.createElement("div", null, renderHeader()), /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    onKeyDown: function onKeyDown(e) {
      return checkKeyDown(e);
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "search-field-wrapper " + screenType + " " + (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.type)
  }, /*#__PURE__*/React__default.createElement(RenderFormFields, {
    fields: uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.fields,
    control: control,
    formData: formData,
    errors: errors,
    register: register,
    setValue: setValue,
    getValues: getValues,
    setError: setError,
    clearErrors: clearErrors,
    labelStyle: {
      fontSize: "16px"
    },
    apiDetails: apiDetails
  }), /*#__PURE__*/React__default.createElement(ActionBar, {
    className: "clear-search-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "search-button-wrapper " + screenType + " " + (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.type)
  }, (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.secondaryLabel) && /*#__PURE__*/React__default.createElement(LinkLabel, {
    style: {
      marginBottom: 0,
      whiteSpace: 'nowrap'
    },
    onClick: clearSearch
  }, t(uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.secondaryLabel)), (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.primaryLabel) && /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.primaryLabel),
    submit: "submit",
    disabled: false
  }))))), showToast && /*#__PURE__*/React__default.createElement(Toast$1, {
    error: showToast.error,
    warning: showToast.warning,
    label: t(showToast.label),
    isDleteBtn: true,
    onClose: closeToast
  })));
};

var MobileSearchResults = function MobileSearchResults(_ref) {
  var _searchResult;
  var config = _ref.config,
    data = _ref.data,
    isLoading = _ref.isLoading,
    isFetching = _ref.isFetching,
    fullConfig = _ref.fullConfig;
  var apiDetails = fullConfig.apiDetails;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var resultsKey = config.resultsJsonPath;
  var searchResult = _.get(data, resultsKey, []);
  searchResult = ((_searchResult = searchResult) === null || _searchResult === void 0 ? void 0 : _searchResult.length) > 0 ? searchResult : [];
  searchResult = searchResult.reverse();
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  var _useContext = React.useContext(InboxContext),
    dispatch = _useContext.dispatch;
  var _useForm = reactHookForm.useForm({
      defaultValues: {
        offset: 0,
        limit: 10
      }
    }),
    register = _useForm.register,
    handleSubmit = _useForm.handleSubmit,
    setValue = _useForm.setValue,
    getValues = _useForm.getValues;
  React.useEffect(function () {
    register("offset", 0);
    register("limit", 10);
  }, [register]);
  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  }
  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  }
  function previousPage() {
    var offsetValue = getValues("offset") - getValues("limit");
    setValue("offset", offsetValue > 0 ? offsetValue : 0);
    handleSubmit(onSubmit)();
  }
  var onSubmit = function onSubmit(data) {
    dispatch({
      type: "tableForm",
      state: _extends({}, data)
    });
  };
  var columns = [{
    Header: "",
    accessor: "_searchResults",
    id: "_searchResults"
  }];
  var propsMobileInboxCards = React.useMemo(function () {
    if (isLoading) {
      return [];
    }
    var cardData = searchResult.map(function (details) {
      var mapping = {};
      var additionalCustomization = {};
      var cols = config === null || config === void 0 ? void 0 : config.columns;
      for (var columnIndex = 0; columnIndex < (cols === null || cols === void 0 ? void 0 : cols.length); columnIndex++) {
        var _cols$columnIndex, _cols$columnIndex2, _cols$columnIndex3, _cols$columnIndex4;
        mapping[(_cols$columnIndex = cols[columnIndex]) === null || _cols$columnIndex === void 0 ? void 0 : _cols$columnIndex.label] = _.get(details, (_cols$columnIndex2 = cols[columnIndex]) === null || _cols$columnIndex2 === void 0 ? void 0 : _cols$columnIndex2.jsonPath, null);
        additionalCustomization[(_cols$columnIndex3 = cols[columnIndex]) === null || _cols$columnIndex3 === void 0 ? void 0 : _cols$columnIndex3.label] = ((_cols$columnIndex4 = cols[columnIndex]) === null || _cols$columnIndex4 === void 0 ? void 0 : _cols$columnIndex4.additionalCustomization) || false;
      }
      return {
        mapping: mapping,
        details: details,
        additionalCustomization: additionalCustomization
      };
    });
    return cardData;
  }, [data]);
  var rows = propsMobileInboxCards.map(function (row) {
    var _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit$Customizations3;
    return {
      _searchResults: /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        to: (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit$Customizations2 === void 0 ? void 0 : (_Digit$Customizations3 = _Digit$Customizations2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit$Customizations3 === void 0 ? void 0 : _Digit$Customizations3.MobileDetailsOnClick(row.mapping, tenantId)
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "details-container"
      }, Object.keys(row.mapping).map(function (key) {
        var toRender;
        if (row.additionalCustomization[key]) {
          var _Digit2, _Digit2$Customization, _Digit2$Customization2, _Digit2$Customization3;
          toRender = /*#__PURE__*/React__default.createElement(Details$1, {
            label: t(key),
            name: (_Digit2 = Digit) === null || _Digit2 === void 0 ? void 0 : (_Digit2$Customization = _Digit2.Customizations) === null || _Digit2$Customization === void 0 ? void 0 : (_Digit2$Customization2 = _Digit2$Customization[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit2$Customization2 === void 0 ? void 0 : (_Digit2$Customization3 = _Digit2$Customization2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit2$Customization3 === void 0 ? void 0 : _Digit2$Customization3.additionalCustomizations(row.details, key, {}, row.mapping[key], t, searchResult),
            onClick: function onClick() {},
            row: row.mapping
          });
        } else {
          toRender = row.mapping[key] ? /*#__PURE__*/React__default.createElement(Details$1, {
            label: t(key),
            name: row.mapping[key],
            onClick: function onClick() {},
            row: row.mapping
          }) : /*#__PURE__*/React__default.createElement(Details$1, {
            label: t(key),
            name: t("NA"),
            onClick: function onClick() {},
            row: row.mapping
          });
        }
        return toRender;
      })))
    };
  });
  function RenderResult() {
    var _searchResult2;
    if (((_searchResult2 = searchResult) === null || _searchResult2 === void 0 ? void 0 : _searchResult2.length) === 0) {
      return /*#__PURE__*/React__default.createElement(NoResultsFound, null);
    }
    if (isLoading || isFetching) return /*#__PURE__*/React__default.createElement(Loader, null);
    if (!data) return /*#__PURE__*/React__default.createElement(Fragment, null);
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Table, {
      t: t,
      data: rows,
      totalRecords: (data === null || data === void 0 ? void 0 : data.count) || (data === null || data === void 0 ? void 0 : data.TotalCount) || (data === null || data === void 0 ? void 0 : data.totalCount),
      columns: columns,
      isPaginationRequired: true,
      onPageSizeChange: onPageSizeChange,
      currentPage: getValues("offset") / getValues("limit"),
      onNextPage: nextPage,
      onPrevPage: previousPage,
      canPreviousPage: true,
      canNextPage: true,
      pageSizeLimit: getValues("limit"),
      getCellProps: function getCellProps(cellInfo) {
        return {
          style: {
            width: "200vw"
          }
        };
      },
      disableSort: config !== null && config !== void 0 && config.enableColumnSort ? false : true,
      autoSort: config !== null && config !== void 0 && config.enableColumnSort ? true : false
    }));
  }
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(RenderResult, null));
};

var reactResponsive = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module.exports = factory(React__default);
  })(commonjsGlobal, function (__WEBPACK_EXTERNAL_MODULE_react__) {
    return function () {
      var __webpack_modules__ = {
        "./node_modules/css-mediaquery/index.js": function node_modulesCssMediaqueryIndexJs(__unused_webpack_module, exports) {
          exports.match = matchQuery;
          exports.parse = parseQuery;
          var RE_MEDIA_QUERY = /(?:(only|not)?\s*([^\s\(\)]+)(?:\s*and)?\s*)?(.+)?/i,
            RE_MQ_EXPRESSION = /\(\s*([^\s\:\)]+)\s*(?:\:\s*([^\s\)]+))?\s*\)/,
            RE_MQ_FEATURE = /^(?:(min|max)-)?(.+)/,
            RE_LENGTH_UNIT = /(em|rem|px|cm|mm|in|pt|pc)?$/,
            RE_RESOLUTION_UNIT = /(dpi|dpcm|dppx)?$/;
          function matchQuery(mediaQuery, values) {
            return parseQuery(mediaQuery).some(function (query) {
              var inverse = query.inverse;
              var typeMatch = query.type === 'all' || values.type === query.type;
              if (typeMatch && inverse || !(typeMatch || inverse)) {
                return false;
              }
              var expressionsMatch = query.expressions.every(function (expression) {
                var feature = expression.feature,
                  modifier = expression.modifier,
                  expValue = expression.value,
                  value = values[feature];
                if (!value) {
                  return false;
                }
                switch (feature) {
                  case 'orientation':
                  case 'scan':
                    return value.toLowerCase() === expValue.toLowerCase();
                  case 'width':
                  case 'height':
                  case 'device-width':
                  case 'device-height':
                    expValue = toPx(expValue);
                    value = toPx(value);
                    break;
                  case 'resolution':
                    expValue = toDpi(expValue);
                    value = toDpi(value);
                    break;
                  case 'aspect-ratio':
                  case 'device-aspect-ratio':
                  case 'device-pixel-ratio':
                    expValue = toDecimal(expValue);
                    value = toDecimal(value);
                    break;
                  case 'grid':
                  case 'color':
                  case 'color-index':
                  case 'monochrome':
                    expValue = parseInt(expValue, 10) || 1;
                    value = parseInt(value, 10) || 0;
                    break;
                }
                switch (modifier) {
                  case 'min':
                    return value >= expValue;
                  case 'max':
                    return value <= expValue;
                  default:
                    return value === expValue;
                }
              });
              return expressionsMatch && !inverse || !expressionsMatch && inverse;
            });
          }
          function parseQuery(mediaQuery) {
            return mediaQuery.split(',').map(function (query) {
              query = query.trim();
              var captures = query.match(RE_MEDIA_QUERY),
                modifier = captures[1],
                type = captures[2],
                expressions = captures[3] || '',
                parsed = {};
              parsed.inverse = !!modifier && modifier.toLowerCase() === 'not';
              parsed.type = type ? type.toLowerCase() : 'all';
              expressions = expressions.match(/\([^\)]+\)/g) || [];
              parsed.expressions = expressions.map(function (expression) {
                var captures = expression.match(RE_MQ_EXPRESSION),
                  feature = captures[1].toLowerCase().match(RE_MQ_FEATURE);
                return {
                  modifier: feature[1],
                  feature: feature[2],
                  value: captures[2]
                };
              });
              return parsed;
            });
          }
          function toDecimal(ratio) {
            var decimal = Number(ratio),
              numbers;
            if (!decimal) {
              numbers = ratio.match(/^(\d+)\s*\/\s*(\d+)$/);
              decimal = numbers[1] / numbers[2];
            }
            return decimal;
          }
          function toDpi(resolution) {
            var value = parseFloat(resolution),
              units = String(resolution).match(RE_RESOLUTION_UNIT)[1];
            switch (units) {
              case 'dpcm':
                return value / 2.54;
              case 'dppx':
                return value * 96;
              default:
                return value;
            }
          }
          function toPx(length) {
            var value = parseFloat(length),
              units = String(length).match(RE_LENGTH_UNIT)[1];
            switch (units) {
              case 'em':
                return value * 16;
              case 'rem':
                return value * 16;
              case 'cm':
                return value * 96 / 2.54;
              case 'mm':
                return value * 96 / 2.54 / 10;
              case 'in':
                return value * 96;
              case 'pt':
                return value * 72;
              case 'pc':
                return value * 72 / 12;
              default:
                return value;
            }
          }
        },
        "./node_modules/hyphenate-style-name/index.js": function node_modulesHyphenateStyleNameIndexJs(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, {
            "default": function _default() {
              return __WEBPACK_DEFAULT_EXPORT__;
            }
          });
          var uppercasePattern = /[A-Z]/g;
          var msPattern = /^ms-/;
          var cache = {};
          function toHyphenLower(match) {
            return '-' + match.toLowerCase();
          }
          function hyphenateStyleName(name) {
            if (cache.hasOwnProperty(name)) {
              return cache[name];
            }
            var hName = name.replace(uppercasePattern, toHyphenLower);
            return cache[name] = msPattern.test(hName) ? '-' + hName : hName;
          }
          var __WEBPACK_DEFAULT_EXPORT__ = hyphenateStyleName;
        },
        "./node_modules/matchmediaquery/index.js": function node_modulesMatchmediaqueryIndexJs(module, __unused_webpack_exports, __webpack_require__) {

          var staticMatch = __webpack_require__("./node_modules/css-mediaquery/index.js").match;
          var dynamicMatch = typeof window !== 'undefined' ? window.matchMedia : null;
          function Mql(query, values, forceStatic) {
            var self = this;
            if (dynamicMatch && !forceStatic) {
              var mql = dynamicMatch.call(window, query);
              this.matches = mql.matches;
              this.media = mql.media;
              mql.addListener(update);
            } else {
              this.matches = staticMatch(query, values);
              this.media = query;
            }
            this.addListener = addListener;
            this.removeListener = removeListener;
            this.dispose = dispose;
            function addListener(listener) {
              if (mql) {
                mql.addListener(listener);
              }
            }
            function removeListener(listener) {
              if (mql) {
                mql.removeListener(listener);
              }
            }
            function update(evt) {
              self.matches = evt.matches;
              self.media = evt.media;
            }
            function dispose() {
              if (mql) {
                mql.removeListener(update);
              }
            }
          }
          function matchMedia(query, values, forceStatic) {
            return new Mql(query, values, forceStatic);
          }
          module.exports = matchMedia;
        },
        "./node_modules/object-assign/index.js": function node_modulesObjectAssignIndexJs(module) {
          var getOwnPropertySymbols = Object.getOwnPropertySymbols;
          var hasOwnProperty = Object.prototype.hasOwnProperty;
          var propIsEnumerable = Object.prototype.propertyIsEnumerable;
          function toObject(val) {
            if (val === null || val === undefined) {
              throw new TypeError('Object.assign cannot be called with null or undefined');
            }
            return Object(val);
          }
          function shouldUseNative() {
            try {
              if (!Object.assign) {
                return false;
              }
              var test1 = new String('abc');
              test1[5] = 'de';
              if (Object.getOwnPropertyNames(test1)[0] === '5') {
                return false;
              }
              var test2 = {};
              for (var i = 0; i < 10; i++) {
                test2['_' + String.fromCharCode(i)] = i;
              }
              var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
                return test2[n];
              });
              if (order2.join('') !== '0123456789') {
                return false;
              }
              var test3 = {};
              'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                test3[letter] = letter;
              });
              if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
                return false;
              }
              return true;
            } catch (err) {
              return false;
            }
          }
          module.exports = shouldUseNative() ? Object.assign : function (target, source) {
            var from;
            var to = toObject(target);
            var symbols;
            for (var s = 1; s < arguments.length; s++) {
              from = Object(arguments[s]);
              for (var key in from) {
                if (hasOwnProperty.call(from, key)) {
                  to[key] = from[key];
                }
              }
              if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(from);
                for (var i = 0; i < symbols.length; i++) {
                  if (propIsEnumerable.call(from, symbols[i])) {
                    to[symbols[i]] = from[symbols[i]];
                  }
                }
              }
            }
            return to;
          };
        },
        "./node_modules/prop-types/checkPropTypes.js": function node_modulesPropTypesCheckPropTypesJs(module, __unused_webpack_exports, __webpack_require__) {
          var printWarning = function printWarning() {};
          {
            var ReactPropTypesSecret = __webpack_require__("./node_modules/prop-types/lib/ReactPropTypesSecret.js");
            var loggedTypeFailures = {};
            var has = __webpack_require__("./node_modules/prop-types/lib/has.js");
            printWarning = function printWarning(text) {
              var message = 'Warning: ' + text;
              if (typeof console !== 'undefined') {
                console.error(message);
              }
              try {
                throw new Error(message);
              } catch (x) {}
            };
          }
          function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
            {
              for (var typeSpecName in typeSpecs) {
                if (has(typeSpecs, typeSpecName)) {
                  var error;
                  try {
                    if (typeof typeSpecs[typeSpecName] !== 'function') {
                      var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
                      err.name = 'Invariant Violation';
                      throw err;
                    }
                    error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
                  } catch (ex) {
                    error = ex;
                  }
                  if (error && !(error instanceof Error)) {
                    printWarning((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
                  }
                  if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                    loggedTypeFailures[error.message] = true;
                    var stack = getStack ? getStack() : '';
                    printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
                  }
                }
              }
            }
          }
          checkPropTypes.resetWarningCache = function () {
            {
              loggedTypeFailures = {};
            }
          };
          module.exports = checkPropTypes;
        },
        "./node_modules/prop-types/factoryWithTypeCheckers.js": function node_modulesPropTypesFactoryWithTypeCheckersJs(module, __unused_webpack_exports, __webpack_require__) {
          var ReactIs = __webpack_require__("./node_modules/react-is/index.js");
          var assign = __webpack_require__("./node_modules/object-assign/index.js");
          var ReactPropTypesSecret = __webpack_require__("./node_modules/prop-types/lib/ReactPropTypesSecret.js");
          var has = __webpack_require__("./node_modules/prop-types/lib/has.js");
          var checkPropTypes = __webpack_require__("./node_modules/prop-types/checkPropTypes.js");
          var printWarning = function printWarning() {};
          {
            printWarning = function printWarning(text) {
              var message = 'Warning: ' + text;
              if (typeof console !== 'undefined') {
                console.error(message);
              }
              try {
                throw new Error(message);
              } catch (x) {}
            };
          }
          function emptyFunctionThatReturnsNull() {
            return null;
          }
          module.exports = function (isValidElement, throwOnDirectAccess) {
            var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
            var FAUX_ITERATOR_SYMBOL = '@@iterator';
            function getIteratorFn(maybeIterable) {
              var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
              if (typeof iteratorFn === 'function') {
                return iteratorFn;
              }
            }
            var ANONYMOUS = '<<anonymous>>';
            var ReactPropTypes = {
              array: createPrimitiveTypeChecker('array'),
              bigint: createPrimitiveTypeChecker('bigint'),
              bool: createPrimitiveTypeChecker('boolean'),
              func: createPrimitiveTypeChecker('function'),
              number: createPrimitiveTypeChecker('number'),
              object: createPrimitiveTypeChecker('object'),
              string: createPrimitiveTypeChecker('string'),
              symbol: createPrimitiveTypeChecker('symbol'),
              any: createAnyTypeChecker(),
              arrayOf: createArrayOfTypeChecker,
              element: createElementTypeChecker(),
              elementType: createElementTypeTypeChecker(),
              instanceOf: createInstanceTypeChecker,
              node: createNodeChecker(),
              objectOf: createObjectOfTypeChecker,
              oneOf: createEnumTypeChecker,
              oneOfType: createUnionTypeChecker,
              shape: createShapeTypeChecker,
              exact: createStrictShapeTypeChecker
            };
            function is(x, y) {
              if (x === y) {
                return x !== 0 || 1 / x === 1 / y;
              } else {
                return x !== x && y !== y;
              }
            }
            function PropTypeError(message, data) {
              this.message = message;
              this.data = data && typeof data === 'object' ? data : {};
              this.stack = '';
            }
            PropTypeError.prototype = Error.prototype;
            function createChainableTypeChecker(validate) {
              {
                var manualPropTypeCallCache = {};
                var manualPropTypeWarningCount = 0;
              }
              function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
                componentName = componentName || ANONYMOUS;
                propFullName = propFullName || propName;
                if (secret !== ReactPropTypesSecret) {
                  if (throwOnDirectAccess) {
                    var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
                    err.name = 'Invariant Violation';
                    throw err;
                  } else if ( typeof console !== 'undefined') {
                    var cacheKey = componentName + ':' + propName;
                    if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
                      printWarning('You are manually calling a React.PropTypes validation ' + 'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.');
                      manualPropTypeCallCache[cacheKey] = true;
                      manualPropTypeWarningCount++;
                    }
                  }
                }
                if (props[propName] == null) {
                  if (isRequired) {
                    if (props[propName] === null) {
                      return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
                    }
                    return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
                  }
                  return null;
                } else {
                  return validate(props, propName, componentName, location, propFullName);
                }
              }
              var chainedCheckType = checkType.bind(null, false);
              chainedCheckType.isRequired = checkType.bind(null, true);
              return chainedCheckType;
            }
            function createPrimitiveTypeChecker(expectedType) {
              function validate(props, propName, componentName, location, propFullName, secret) {
                var propValue = props[propName];
                var propType = getPropType(propValue);
                if (propType !== expectedType) {
                  var preciseType = getPreciseType(propValue);
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'), {
                    expectedType: expectedType
                  });
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createAnyTypeChecker() {
              return createChainableTypeChecker(emptyFunctionThatReturnsNull);
            }
            function createArrayOfTypeChecker(typeChecker) {
              function validate(props, propName, componentName, location, propFullName) {
                if (typeof typeChecker !== 'function') {
                  return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
                }
                var propValue = props[propName];
                if (!Array.isArray(propValue)) {
                  var propType = getPropType(propValue);
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
                }
                for (var i = 0; i < propValue.length; i++) {
                  var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
                  if (error instanceof Error) {
                    return error;
                  }
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createElementTypeChecker() {
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                if (!isValidElement(propValue)) {
                  var propType = getPropType(propValue);
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createElementTypeTypeChecker() {
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                if (!ReactIs.isValidElementType(propValue)) {
                  var propType = getPropType(propValue);
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createInstanceTypeChecker(expectedClass) {
              function validate(props, propName, componentName, location, propFullName) {
                if (!(props[propName] instanceof expectedClass)) {
                  var expectedClassName = expectedClass.name || ANONYMOUS;
                  var actualClassName = getClassName(props[propName]);
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createEnumTypeChecker(expectedValues) {
              if (!Array.isArray(expectedValues)) {
                {
                  if (arguments.length > 1) {
                    printWarning('Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' + 'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).');
                  } else {
                    printWarning('Invalid argument supplied to oneOf, expected an array.');
                  }
                }
                return emptyFunctionThatReturnsNull;
              }
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                for (var i = 0; i < expectedValues.length; i++) {
                  if (is(propValue, expectedValues[i])) {
                    return null;
                  }
                }
                var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
                  var type = getPreciseType(value);
                  if (type === 'symbol') {
                    return String(value);
                  }
                  return value;
                });
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
              }
              return createChainableTypeChecker(validate);
            }
            function createObjectOfTypeChecker(typeChecker) {
              function validate(props, propName, componentName, location, propFullName) {
                if (typeof typeChecker !== 'function') {
                  return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
                }
                var propValue = props[propName];
                var propType = getPropType(propValue);
                if (propType !== 'object') {
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
                }
                for (var key in propValue) {
                  if (has(propValue, key)) {
                    var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
                    if (error instanceof Error) {
                      return error;
                    }
                  }
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createUnionTypeChecker(arrayOfTypeCheckers) {
              if (!Array.isArray(arrayOfTypeCheckers)) {
                 printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') ;
                return emptyFunctionThatReturnsNull;
              }
              for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
                var checker = arrayOfTypeCheckers[i];
                if (typeof checker !== 'function') {
                  printWarning('Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.');
                  return emptyFunctionThatReturnsNull;
                }
              }
              function validate(props, propName, componentName, location, propFullName) {
                var expectedTypes = [];
                for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
                  var checker = arrayOfTypeCheckers[i];
                  var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
                  if (checkerResult == null) {
                    return null;
                  }
                  if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
                    expectedTypes.push(checkerResult.data.expectedType);
                  }
                }
                var expectedTypesMessage = expectedTypes.length > 0 ? ', expected one of type [' + expectedTypes.join(', ') + ']' : '';
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
              }
              return createChainableTypeChecker(validate);
            }
            function createNodeChecker() {
              function validate(props, propName, componentName, location, propFullName) {
                if (!isNode(props[propName])) {
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function invalidValidatorError(componentName, location, propFullName, key, type) {
              return new PropTypeError((componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + type + '`.');
            }
            function createShapeTypeChecker(shapeTypes) {
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                var propType = getPropType(propValue);
                if (propType !== 'object') {
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
                }
                for (var key in shapeTypes) {
                  var checker = shapeTypes[key];
                  if (typeof checker !== 'function') {
                    return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
                  }
                  var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
                  if (error) {
                    return error;
                  }
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createStrictShapeTypeChecker(shapeTypes) {
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                var propType = getPropType(propValue);
                if (propType !== 'object') {
                  return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
                }
                var allKeys = assign({}, props[propName], shapeTypes);
                for (var key in allKeys) {
                  var checker = shapeTypes[key];
                  if (has(shapeTypes, key) && typeof checker !== 'function') {
                    return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
                  }
                  if (!checker) {
                    return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
                  }
                  var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
                  if (error) {
                    return error;
                  }
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function isNode(propValue) {
              switch (typeof propValue) {
                case 'number':
                case 'string':
                case 'undefined':
                  return true;
                case 'boolean':
                  return !propValue;
                case 'object':
                  if (Array.isArray(propValue)) {
                    return propValue.every(isNode);
                  }
                  if (propValue === null || isValidElement(propValue)) {
                    return true;
                  }
                  var iteratorFn = getIteratorFn(propValue);
                  if (iteratorFn) {
                    var iterator = iteratorFn.call(propValue);
                    var step;
                    if (iteratorFn !== propValue.entries) {
                      while (!(step = iterator.next()).done) {
                        if (!isNode(step.value)) {
                          return false;
                        }
                      }
                    } else {
                      while (!(step = iterator.next()).done) {
                        var entry = step.value;
                        if (entry) {
                          if (!isNode(entry[1])) {
                            return false;
                          }
                        }
                      }
                    }
                  } else {
                    return false;
                  }
                  return true;
                default:
                  return false;
              }
            }
            function isSymbol(propType, propValue) {
              if (propType === 'symbol') {
                return true;
              }
              if (!propValue) {
                return false;
              }
              if (propValue['@@toStringTag'] === 'Symbol') {
                return true;
              }
              if (typeof Symbol === 'function' && propValue instanceof Symbol) {
                return true;
              }
              return false;
            }
            function getPropType(propValue) {
              var propType = typeof propValue;
              if (Array.isArray(propValue)) {
                return 'array';
              }
              if (propValue instanceof RegExp) {
                return 'object';
              }
              if (isSymbol(propType, propValue)) {
                return 'symbol';
              }
              return propType;
            }
            function getPreciseType(propValue) {
              if (typeof propValue === 'undefined' || propValue === null) {
                return '' + propValue;
              }
              var propType = getPropType(propValue);
              if (propType === 'object') {
                if (propValue instanceof Date) {
                  return 'date';
                } else if (propValue instanceof RegExp) {
                  return 'regexp';
                }
              }
              return propType;
            }
            function getPostfixForTypeWarning(value) {
              var type = getPreciseType(value);
              switch (type) {
                case 'array':
                case 'object':
                  return 'an ' + type;
                case 'boolean':
                case 'date':
                case 'regexp':
                  return 'a ' + type;
                default:
                  return type;
              }
            }
            function getClassName(propValue) {
              if (!propValue.constructor || !propValue.constructor.name) {
                return ANONYMOUS;
              }
              return propValue.constructor.name;
            }
            ReactPropTypes.checkPropTypes = checkPropTypes;
            ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
            ReactPropTypes.PropTypes = ReactPropTypes;
            return ReactPropTypes;
          };
        },
        "./node_modules/prop-types/index.js": function node_modulesPropTypesIndexJs(module, __unused_webpack_exports, __webpack_require__) {
          {
            var ReactIs = __webpack_require__("./node_modules/react-is/index.js");
            var throwOnDirectAccess = true;
            module.exports = __webpack_require__("./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
          }
        },
        "./node_modules/prop-types/lib/ReactPropTypesSecret.js": function node_modulesPropTypesLibReactPropTypesSecretJs(module) {
          var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
          module.exports = ReactPropTypesSecret;
        },
        "./node_modules/prop-types/lib/has.js": function node_modulesPropTypesLibHasJs(module) {
          module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
        },
        "./node_modules/react-is/cjs/react-is.development.js": function node_modulesReactIsCjsReactIsDevelopmentJs(__unused_webpack_module, exports) {
          {
            (function () {
              var hasSymbol = typeof Symbol === 'function' && Symbol.for;
              var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
              var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
              var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
              var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
              var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
              var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
              var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
              var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
              var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
              var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
              var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
              var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
              var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
              var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
              var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
              var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
              var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
              var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
              function isValidElementType(type) {
                return typeof type === 'string' || typeof type === 'function' || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
              }
              function typeOf(object) {
                if (typeof object === 'object' && object !== null) {
                  var $$typeof = object.$$typeof;
                  switch ($$typeof) {
                    case REACT_ELEMENT_TYPE:
                      var type = object.type;
                      switch (type) {
                        case REACT_ASYNC_MODE_TYPE:
                        case REACT_CONCURRENT_MODE_TYPE:
                        case REACT_FRAGMENT_TYPE:
                        case REACT_PROFILER_TYPE:
                        case REACT_STRICT_MODE_TYPE:
                        case REACT_SUSPENSE_TYPE:
                          return type;
                        default:
                          var $$typeofType = type && type.$$typeof;
                          switch ($$typeofType) {
                            case REACT_CONTEXT_TYPE:
                            case REACT_FORWARD_REF_TYPE:
                            case REACT_LAZY_TYPE:
                            case REACT_MEMO_TYPE:
                            case REACT_PROVIDER_TYPE:
                              return $$typeofType;
                            default:
                              return $$typeof;
                          }
                      }
                    case REACT_PORTAL_TYPE:
                      return $$typeof;
                  }
                }
                return undefined;
              }
              var AsyncMode = REACT_ASYNC_MODE_TYPE;
              var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
              var ContextConsumer = REACT_CONTEXT_TYPE;
              var ContextProvider = REACT_PROVIDER_TYPE;
              var Element = REACT_ELEMENT_TYPE;
              var ForwardRef = REACT_FORWARD_REF_TYPE;
              var Fragment = REACT_FRAGMENT_TYPE;
              var Lazy = REACT_LAZY_TYPE;
              var Memo = REACT_MEMO_TYPE;
              var Portal = REACT_PORTAL_TYPE;
              var Profiler = REACT_PROFILER_TYPE;
              var StrictMode = REACT_STRICT_MODE_TYPE;
              var Suspense = REACT_SUSPENSE_TYPE;
              var hasWarnedAboutDeprecatedIsAsyncMode = false;
              function isAsyncMode(object) {
                {
                  if (!hasWarnedAboutDeprecatedIsAsyncMode) {
                    hasWarnedAboutDeprecatedIsAsyncMode = true;
                    console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
                  }
                }
                return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
              }
              function isConcurrentMode(object) {
                return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
              }
              function isContextConsumer(object) {
                return typeOf(object) === REACT_CONTEXT_TYPE;
              }
              function isContextProvider(object) {
                return typeOf(object) === REACT_PROVIDER_TYPE;
              }
              function isElement(object) {
                return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
              }
              function isForwardRef(object) {
                return typeOf(object) === REACT_FORWARD_REF_TYPE;
              }
              function isFragment(object) {
                return typeOf(object) === REACT_FRAGMENT_TYPE;
              }
              function isLazy(object) {
                return typeOf(object) === REACT_LAZY_TYPE;
              }
              function isMemo(object) {
                return typeOf(object) === REACT_MEMO_TYPE;
              }
              function isPortal(object) {
                return typeOf(object) === REACT_PORTAL_TYPE;
              }
              function isProfiler(object) {
                return typeOf(object) === REACT_PROFILER_TYPE;
              }
              function isStrictMode(object) {
                return typeOf(object) === REACT_STRICT_MODE_TYPE;
              }
              function isSuspense(object) {
                return typeOf(object) === REACT_SUSPENSE_TYPE;
              }
              exports.AsyncMode = AsyncMode;
              exports.ConcurrentMode = ConcurrentMode;
              exports.ContextConsumer = ContextConsumer;
              exports.ContextProvider = ContextProvider;
              exports.Element = Element;
              exports.ForwardRef = ForwardRef;
              exports.Fragment = Fragment;
              exports.Lazy = Lazy;
              exports.Memo = Memo;
              exports.Portal = Portal;
              exports.Profiler = Profiler;
              exports.StrictMode = StrictMode;
              exports.Suspense = Suspense;
              exports.isAsyncMode = isAsyncMode;
              exports.isConcurrentMode = isConcurrentMode;
              exports.isContextConsumer = isContextConsumer;
              exports.isContextProvider = isContextProvider;
              exports.isElement = isElement;
              exports.isForwardRef = isForwardRef;
              exports.isFragment = isFragment;
              exports.isLazy = isLazy;
              exports.isMemo = isMemo;
              exports.isPortal = isPortal;
              exports.isProfiler = isProfiler;
              exports.isStrictMode = isStrictMode;
              exports.isSuspense = isSuspense;
              exports.isValidElementType = isValidElementType;
              exports.typeOf = typeOf;
            })();
          }
        },
        "./node_modules/react-is/index.js": function node_modulesReactIsIndexJs(module, __unused_webpack_exports, __webpack_require__) {

          {
            module.exports = __webpack_require__("./node_modules/react-is/cjs/react-is.development.js");
          }
        },
        "./node_modules/shallow-equal/dist/index.esm.js": function node_modulesShallowEqualDistIndexEsmJs(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, {
            "shallowEqualArrays": function shallowEqualArrays() {
              return _shallowEqualArrays;
            },
            "shallowEqualObjects": function shallowEqualObjects() {
              return _shallowEqualObjects;
            }
          });
          function _shallowEqualObjects(objA, objB) {
            if (objA === objB) {
              return true;
            }
            if (!objA || !objB) {
              return false;
            }
            var aKeys = Object.keys(objA);
            var bKeys = Object.keys(objB);
            var len = aKeys.length;
            if (bKeys.length !== len) {
              return false;
            }
            for (var i = 0; i < len; i++) {
              var key = aKeys[i];
              if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
                return false;
              }
            }
            return true;
          }
          function _shallowEqualArrays(arrA, arrB) {
            if (arrA === arrB) {
              return true;
            }
            if (!arrA || !arrB) {
              return false;
            }
            var len = arrA.length;
            if (arrB.length !== len) {
              return false;
            }
            for (var i = 0; i < len; i++) {
              if (arrA[i] !== arrB[i]) {
                return false;
              }
            }
            return true;
          }
        },
        "./src/Component.ts": function srcComponentTs(__unused_webpack_module, exports, __webpack_require__) {

          var __rest = this && this.__rest || function (s, e) {
            var t = {};
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
            if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
            }
            return t;
          };
          var __importDefault = this && this.__importDefault || function (mod) {
            return mod && mod.__esModule ? mod : {
              "default": mod
            };
          };
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          var useMediaQuery_1 = __importDefault(__webpack_require__("./src/useMediaQuery.ts"));
          var MediaQuery = function MediaQuery(_a) {
            var children = _a.children,
              device = _a.device,
              onChange = _a.onChange,
              settings = __rest(_a, ["children", "device", "onChange"]);
            var matches = (0, useMediaQuery_1.default)(settings, device, onChange);
            if (typeof children === 'function') {
              return children(matches);
            }
            return matches ? children : null;
          };
          exports["default"] = MediaQuery;
        },
        "./src/Context.ts": function srcContextTs(__unused_webpack_module, exports, __webpack_require__) {

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          var react_1 = __webpack_require__("react");
          var Context = (0, react_1.createContext)(undefined);
          exports["default"] = Context;
        },
        "./src/index.ts": function srcIndexTs(__unused_webpack_module, exports, __webpack_require__) {

          var __importDefault = this && this.__importDefault || function (mod) {
            return mod && mod.__esModule ? mod : {
              "default": mod
            };
          };
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.Context = exports.toQuery = exports.useMediaQuery = exports["default"] = void 0;
          var useMediaQuery_1 = __importDefault(__webpack_require__("./src/useMediaQuery.ts"));
          exports.useMediaQuery = useMediaQuery_1.default;
          var Component_1 = __importDefault(__webpack_require__("./src/Component.ts"));
          exports["default"] = Component_1.default;
          var toQuery_1 = __importDefault(__webpack_require__("./src/toQuery.ts"));
          exports.toQuery = toQuery_1.default;
          var Context_1 = __importDefault(__webpack_require__("./src/Context.ts"));
          exports.Context = Context_1.default;
        },
        "./src/mediaQuery.ts": function srcMediaQueryTs(__unused_webpack_module, exports, __webpack_require__) {

          var __assign = this && this.__assign || function () {
            __assign = Object.assign || function (t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
              }
              return t;
            };
            return __assign.apply(this, arguments);
          };
          var __rest = this && this.__rest || function (s, e) {
            var t = {};
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
            if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
            }
            return t;
          };
          var __importDefault = this && this.__importDefault || function (mod) {
            return mod && mod.__esModule ? mod : {
              "default": mod
            };
          };
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          var prop_types_1 = __importDefault(__webpack_require__("./node_modules/prop-types/index.js"));
          var stringOrNumber = prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.number]);
          var types = {
            all: prop_types_1.default.bool,
            grid: prop_types_1.default.bool,
            aural: prop_types_1.default.bool,
            braille: prop_types_1.default.bool,
            handheld: prop_types_1.default.bool,
            print: prop_types_1.default.bool,
            projection: prop_types_1.default.bool,
            screen: prop_types_1.default.bool,
            tty: prop_types_1.default.bool,
            tv: prop_types_1.default.bool,
            embossed: prop_types_1.default.bool
          };
          var matchers = {
            orientation: prop_types_1.default.oneOf(['portrait', 'landscape']),
            scan: prop_types_1.default.oneOf(['progressive', 'interlace']),
            aspectRatio: prop_types_1.default.string,
            deviceAspectRatio: prop_types_1.default.string,
            height: stringOrNumber,
            deviceHeight: stringOrNumber,
            width: stringOrNumber,
            deviceWidth: stringOrNumber,
            color: prop_types_1.default.bool,
            colorIndex: prop_types_1.default.bool,
            monochrome: prop_types_1.default.bool,
            resolution: stringOrNumber,
            type: Object.keys(types)
          };
          var featureMatchers = __rest(matchers, ["type"]);
          var features = __assign({
            minAspectRatio: prop_types_1.default.string,
            maxAspectRatio: prop_types_1.default.string,
            minDeviceAspectRatio: prop_types_1.default.string,
            maxDeviceAspectRatio: prop_types_1.default.string,
            minHeight: stringOrNumber,
            maxHeight: stringOrNumber,
            minDeviceHeight: stringOrNumber,
            maxDeviceHeight: stringOrNumber,
            minWidth: stringOrNumber,
            maxWidth: stringOrNumber,
            minDeviceWidth: stringOrNumber,
            maxDeviceWidth: stringOrNumber,
            minColor: prop_types_1.default.number,
            maxColor: prop_types_1.default.number,
            minColorIndex: prop_types_1.default.number,
            maxColorIndex: prop_types_1.default.number,
            minMonochrome: prop_types_1.default.number,
            maxMonochrome: prop_types_1.default.number,
            minResolution: stringOrNumber,
            maxResolution: stringOrNumber
          }, featureMatchers);
          var all = __assign(__assign({}, types), features);
          exports["default"] = {
            all: all,
            types: types,
            matchers: matchers,
            features: features
          };
        },
        "./src/toQuery.ts": function srcToQueryTs(__unused_webpack_module, exports, __webpack_require__) {

          var __importDefault = this && this.__importDefault || function (mod) {
            return mod && mod.__esModule ? mod : {
              "default": mod
            };
          };
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          var hyphenate_style_name_1 = __importDefault(__webpack_require__("./node_modules/hyphenate-style-name/index.js"));
          var mediaQuery_1 = __importDefault(__webpack_require__("./src/mediaQuery.ts"));
          var negate = function negate(cond) {
            return "not ".concat(cond);
          };
          var keyVal = function keyVal(k, v) {
            var realKey = (0, hyphenate_style_name_1.default)(k);
            if (typeof v === 'number') {
              v = "".concat(v, "px");
            }
            if (v === true) {
              return realKey;
            }
            if (v === false) {
              return negate(realKey);
            }
            return "(".concat(realKey, ": ").concat(v, ")");
          };
          var join = function join(conds) {
            return conds.join(' and ');
          };
          var toQuery = function toQuery(obj) {
            var rules = [];
            Object.keys(mediaQuery_1.default.all).forEach(function (k) {
              var v = obj[k];
              if (v != null) {
                rules.push(keyVal(k, v));
              }
            });
            return join(rules);
          };
          exports["default"] = toQuery;
        },
        "./src/useMediaQuery.ts": function srcUseMediaQueryTs(__unused_webpack_module, exports, __webpack_require__) {

          var __importDefault = this && this.__importDefault || function (mod) {
            return mod && mod.__esModule ? mod : {
              "default": mod
            };
          };
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          var react_1 = __webpack_require__("react");
          var matchmediaquery_1 = __importDefault(__webpack_require__("./node_modules/matchmediaquery/index.js"));
          var hyphenate_style_name_1 = __importDefault(__webpack_require__("./node_modules/hyphenate-style-name/index.js"));
          var shallow_equal_1 = __webpack_require__("./node_modules/shallow-equal/dist/index.esm.js");
          var toQuery_1 = __importDefault(__webpack_require__("./src/toQuery.ts"));
          var Context_1 = __importDefault(__webpack_require__("./src/Context.ts"));
          var makeQuery = function makeQuery(settings) {
            return settings.query || (0, toQuery_1.default)(settings);
          };
          var hyphenateKeys = function hyphenateKeys(obj) {
            if (!obj) return undefined;
            var keys = Object.keys(obj);
            return keys.reduce(function (result, key) {
              result[(0, hyphenate_style_name_1.default)(key)] = obj[key];
              return result;
            }, {});
          };
          var useIsUpdate = function useIsUpdate() {
            var ref = (0, react_1.useRef)(false);
            (0, react_1.useEffect)(function () {
              ref.current = true;
            }, []);
            return ref.current;
          };
          var useDevice = function useDevice(deviceFromProps) {
            var deviceFromContext = (0, react_1.useContext)(Context_1.default);
            var getDevice = function getDevice() {
              return hyphenateKeys(deviceFromProps) || hyphenateKeys(deviceFromContext);
            };
            var _a = (0, react_1.useState)(getDevice),
              device = _a[0],
              setDevice = _a[1];
            (0, react_1.useEffect)(function () {
              var newDevice = getDevice();
              if (!(0, shallow_equal_1.shallowEqualObjects)(device, newDevice)) {
                setDevice(newDevice);
              }
            }, [deviceFromProps, deviceFromContext]);
            return device;
          };
          var useQuery = function useQuery(settings) {
            var getQuery = function getQuery() {
              return makeQuery(settings);
            };
            var _a = (0, react_1.useState)(getQuery),
              query = _a[0],
              setQuery = _a[1];
            (0, react_1.useEffect)(function () {
              var newQuery = getQuery();
              if (query !== newQuery) {
                setQuery(newQuery);
              }
            }, [settings]);
            return query;
          };
          var useMatchMedia = function useMatchMedia(query, device) {
            var getMatchMedia = function getMatchMedia() {
              return (0, matchmediaquery_1.default)(query, device || {}, !!device);
            };
            var _a = (0, react_1.useState)(getMatchMedia),
              mq = _a[0],
              setMq = _a[1];
            var isUpdate = useIsUpdate();
            (0, react_1.useEffect)(function () {
              if (isUpdate) {
                var newMq_1 = getMatchMedia();
                setMq(newMq_1);
                return function () {
                  if (newMq_1) {
                    newMq_1.dispose();
                  }
                };
              }
            }, [query, device]);
            return mq;
          };
          var useMatches = function useMatches(mediaQuery) {
            var _a = (0, react_1.useState)(mediaQuery.matches),
              matches = _a[0],
              setMatches = _a[1];
            (0, react_1.useEffect)(function () {
              var updateMatches = function updateMatches(ev) {
                setMatches(ev.matches);
              };
              mediaQuery.addListener(updateMatches);
              setMatches(mediaQuery.matches);
              return function () {
                mediaQuery.removeListener(updateMatches);
              };
            }, [mediaQuery]);
            return matches;
          };
          var useMediaQuery = function useMediaQuery(settings, device, onChange) {
            var deviceSettings = useDevice(device);
            var query = useQuery(settings);
            if (!query) throw new Error('Invalid or missing MediaQuery!');
            var mq = useMatchMedia(query, deviceSettings);
            var matches = useMatches(mq);
            var isUpdate = useIsUpdate();
            (0, react_1.useEffect)(function () {
              if (isUpdate && onChange) {
                onChange(matches);
              }
            }, [matches]);
            (0, react_1.useEffect)(function () {
              return function () {
                if (mq) {
                  mq.dispose();
                }
              };
            }, []);
            return matches;
          };
          exports["default"] = useMediaQuery;
        },
        "react": function react(module) {

          module.exports = __WEBPACK_EXTERNAL_MODULE_react__;
        }
      };
      var __webpack_module_cache__ = {};
      function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
          exports: {}
        };
        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
      }
      (function () {
        __webpack_require__.d = function (exports, definition) {
          for (var key in definition) {
            if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
              Object.defineProperty(exports, key, {
                enumerable: true,
                get: definition[key]
              });
            }
          }
        };
      })();
      (function () {
        __webpack_require__.o = function (obj, prop) {
          return Object.prototype.hasOwnProperty.call(obj, prop);
        };
      })();
      (function () {
        __webpack_require__.r = function (exports) {
          if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
              value: 'Module'
            });
          }
          Object.defineProperty(exports, '__esModule', {
            value: true
          });
        };
      })();
      var __webpack_exports__ = __webpack_require__("./src/index.ts");
      return __webpack_exports__;
    }();
  });
});
var MediaQuery = unwrapExports(reactResponsive);

var InboxSearchComposer = function InboxSearchComposer(_ref) {
  var _configs$apiDetails, _configs$apiDetails2, _configs$apiDetails3, _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit$Customizations3, _Digit2, _Digit2$Customization, _Digit2$Customization2, _Digit2$Customization3, _configs$sections, _configs$sections$lin, _configs$sections2, _configs$sections2$li, _configs$sections2$li2, _configs$sections3, _configs$sections3$li, _configs$sections3$li2, _configs$sections4, _configs$sections4$li, _configs$sections4$li2, _configs$sections5, _configs$sections5$se, _configs$sections6, _configs$sections6$se, _configs$sections7, _configs$sections7$se, _configs$sections8, _configs$sections8$fi, _configs$sections9, _configs$sections9$fi, _configs$sections10, _configs$sections10$f, _configs$sections11, _configs$sections11$s, _configs$sections12, _configs$sections12$s, _configs$sections13, _configs$sections13$s, _configs$sections14, _configs$sections14$f, _configs$sections15, _configs$sections15$f, _configs$sections16, _configs$sections16$f, _configs$sections17, _configs$sections17$s, _configs$sections18, _configs$sections18$f, _configs$sections19, _configs$sections19$s, _data, _data$configs$section, _configs$sections20, _configs$sections20$s, _configs$sections20$s2, _configs$sections21, _configs$sections21$s, _configs$sections22, _configs$sections22$s, _configs$sections23, _configs$sections23$f, _configs$sections24, _configs$sections24$f, _configs$sections25, _configs$sections25$f, _configs$sections25$f2, _configs$sections26, _configs$sections26$s, _configs$sections27, _configs$sections27$s, _configs$sections28, _configs$sections28$s, _configs$sections28$s2;
  var configs = _ref.configs,
    headerLabel = _ref.headerLabel;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useState = React.useState(false),
    enable = _useState[0],
    setEnable = _useState[1];
  var _useReducer = React.useReducer(reducer, initialInboxState),
    state = _useReducer[0],
    dispatch = _useReducer[1];
  var _useState2 = React.useState(""),
    type = _useState2[0],
    setType = _useState2[1];
  var _useState3 = React.useState(false),
    popup = _useState3[0],
    setPopup = _useState3[1];
  var apiDetails = configs === null || configs === void 0 ? void 0 : configs.apiDetails;
  var mobileSearchSession = Digit.Hooks.useSessionStorage("MOBILE_SEARCH_MODAL_FORM", {});
  var clearSessionFormData = mobileSearchSession[2];
  React.useEffect(function () {
    if (type) setPopup(true);
  }, [type]);
  React.useEffect(function () {
    clearSessionFormData();
  }, []);
  React.useEffect(function () {
    var _Object$keys, _Object$keys2, _Object$keys3, _Object$keys4;
    if (((_Object$keys = Object.keys(state.searchForm)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.length) >= 0) {
      var result = _extends({}, _.get(apiDetails, apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.searchFormJsonPath, {}), state.searchForm);
      Object.keys(result).forEach(function (key) {
        if (!result[key]) delete result[key];
      });
      _.set(apiDetails, apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.searchFormJsonPath, result);
    }
    if (((_Object$keys2 = Object.keys(state.filterForm)) === null || _Object$keys2 === void 0 ? void 0 : _Object$keys2.length) >= 0) {
      var _result = _extends({}, _.get(apiDetails, apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.filterFormJsonPath, {}), state.filterForm);
      Object.keys(_result).forEach(function (key) {
        var _result$key;
        if (!_result[key] || ((_result$key = _result[key]) === null || _result$key === void 0 ? void 0 : _result$key.length) === 0) delete _result[key];
      });
      _.set(apiDetails, apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.filterFormJsonPath, _result);
    }
    if (((_Object$keys3 = Object.keys(state.tableForm)) === null || _Object$keys3 === void 0 ? void 0 : _Object$keys3.length) >= 0) {
      _.set(apiDetails, apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.tableFormJsonPath, _extends({}, _.get(apiDetails, apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.tableFormJsonPath, {}), state.tableForm));
    }
    var searchFormParamCount = Object.keys(state.searchForm).reduce(function (count, key) {
      return state.searchForm[key] === "" ? count : count + 1;
    }, 0);
    var filterFormParamCount = Object.keys(state.filterForm).reduce(function (count, key) {
      return state.filterForm[key] === "" ? count : count + 1;
    }, 0);
    if (((_Object$keys4 = Object.keys(state.tableForm)) === null || _Object$keys4 === void 0 ? void 0 : _Object$keys4.length) > 0 && (searchFormParamCount >= (apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.minParametersForSearchForm) || filterFormParamCount >= (apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.minParametersForFilterForm))) {
      setEnable(true);
    }
    if ((configs === null || configs === void 0 ? void 0 : configs.type) === 'inbox' || (configs === null || configs === void 0 ? void 0 : configs.type) === 'download') setEnable(true);
  }, [state]);
  var requestCriteria = {
    url: configs === null || configs === void 0 ? void 0 : (_configs$apiDetails = configs.apiDetails) === null || _configs$apiDetails === void 0 ? void 0 : _configs$apiDetails.serviceName,
    params: configs === null || configs === void 0 ? void 0 : (_configs$apiDetails2 = configs.apiDetails) === null || _configs$apiDetails2 === void 0 ? void 0 : _configs$apiDetails2.requestParam,
    body: configs === null || configs === void 0 ? void 0 : (_configs$apiDetails3 = configs.apiDetails) === null || _configs$apiDetails3 === void 0 ? void 0 : _configs$apiDetails3.requestBody,
    config: {
      enabled: enable
    },
    state: state
  };
  var updatedReqCriteria = (_Digit = Digit) !== null && _Digit !== void 0 && (_Digit$Customizations = _Digit.Customizations) !== null && _Digit$Customizations !== void 0 && (_Digit$Customizations2 = _Digit$Customizations[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) !== null && _Digit$Customizations2 !== void 0 && (_Digit$Customizations3 = _Digit$Customizations2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) !== null && _Digit$Customizations3 !== void 0 && _Digit$Customizations3.preProcess ? (_Digit2 = Digit) === null || _Digit2 === void 0 ? void 0 : (_Digit2$Customization = _Digit2.Customizations) === null || _Digit2$Customization === void 0 ? void 0 : (_Digit2$Customization2 = _Digit2$Customization[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.masterName]) === null || _Digit2$Customization2 === void 0 ? void 0 : (_Digit2$Customization3 = _Digit2$Customization2[apiDetails === null || apiDetails === void 0 ? void 0 : apiDetails.moduleName]) === null || _Digit2$Customization3 === void 0 ? void 0 : _Digit2$Customization3.preProcess(requestCriteria, configs.additionalDetails) : requestCriteria;
  if (configs.customHookName) {
    var _eval = eval("Digit.Hooks." + configs.customHookName + "(updatedReqCriteria)"),
      isLoading = _eval.isLoading,
      data = _eval.data,
      revalidate = _eval.revalidate,
      isFetching = _eval.isFetching;
  } else {
    var _Digit$Hooks$useCusto = Digit.Hooks.useCustomAPIHook(updatedReqCriteria),
      isLoading = _Digit$Hooks$useCusto.isLoading,
      data = _Digit$Hooks$useCusto.data,
      revalidate = _Digit$Hooks$useCusto.revalidate,
      isFetching = _Digit$Hooks$useCusto.isFetching;
  }
  React.useEffect(function () {
    return function () {
      revalidate();
      setEnable(false);
    };
  });
  var handlePopupClose = function handlePopupClose() {
    setPopup(false);
    setType("");
  };
  return /*#__PURE__*/React__default.createElement(InboxContext.Provider, {
    value: {
      state: state,
      dispatch: dispatch
    }
  }, headerLabel && /*#__PURE__*/React__default.createElement(Header, {
    className: "digit-form-composer-header"
  }, t(headerLabel)), /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-search-component-wrapper "
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sections-parent " + (configs === null || configs === void 0 ? void 0 : configs.type)
  }, (configs === null || configs === void 0 ? void 0 : (_configs$sections = configs.sections) === null || _configs$sections === void 0 ? void 0 : (_configs$sections$lin = _configs$sections.links) === null || _configs$sections$lin === void 0 ? void 0 : _configs$sections$lin.show) && /*#__PURE__*/React__default.createElement("div", {
    className: "section links"
  }, /*#__PURE__*/React__default.createElement(InboxSearchLinks, {
    headerText: configs === null || configs === void 0 ? void 0 : (_configs$sections2 = configs.sections) === null || _configs$sections2 === void 0 ? void 0 : (_configs$sections2$li = _configs$sections2.links) === null || _configs$sections2$li === void 0 ? void 0 : (_configs$sections2$li2 = _configs$sections2$li.uiConfig) === null || _configs$sections2$li2 === void 0 ? void 0 : _configs$sections2$li2.label,
    links: configs === null || configs === void 0 ? void 0 : (_configs$sections3 = configs.sections) === null || _configs$sections3 === void 0 ? void 0 : (_configs$sections3$li = _configs$sections3.links) === null || _configs$sections3$li === void 0 ? void 0 : (_configs$sections3$li2 = _configs$sections3$li.uiConfig) === null || _configs$sections3$li2 === void 0 ? void 0 : _configs$sections3$li2.links,
    businessService: "WORKS",
    logoIcon: configs === null || configs === void 0 ? void 0 : (_configs$sections4 = configs.sections) === null || _configs$sections4 === void 0 ? void 0 : (_configs$sections4$li = _configs$sections4.links) === null || _configs$sections4$li === void 0 ? void 0 : (_configs$sections4$li2 = _configs$sections4$li.uiConfig) === null || _configs$sections4$li2 === void 0 ? void 0 : _configs$sections4$li2.logoIcon
  })), (configs === null || configs === void 0 ? void 0 : configs.type) === 'search' && (configs === null || configs === void 0 ? void 0 : (_configs$sections5 = configs.sections) === null || _configs$sections5 === void 0 ? void 0 : (_configs$sections5$se = _configs$sections5.search) === null || _configs$sections5$se === void 0 ? void 0 : _configs$sections5$se.show) && /*#__PURE__*/React__default.createElement("div", {
    className: "section search"
  }, /*#__PURE__*/React__default.createElement(SearchComponent, {
    uiConfig: configs === null || configs === void 0 ? void 0 : (_configs$sections6 = configs.sections) === null || _configs$sections6 === void 0 ? void 0 : (_configs$sections6$se = _configs$sections6.search) === null || _configs$sections6$se === void 0 ? void 0 : _configs$sections6$se.uiConfig,
    header: configs === null || configs === void 0 ? void 0 : (_configs$sections7 = configs.sections) === null || _configs$sections7 === void 0 ? void 0 : (_configs$sections7$se = _configs$sections7.search) === null || _configs$sections7$se === void 0 ? void 0 : _configs$sections7$se.label,
    screenType: configs.type,
    fullConfig: configs,
    data: data
  })), (configs === null || configs === void 0 ? void 0 : configs.type) === 'search' && (configs === null || configs === void 0 ? void 0 : (_configs$sections8 = configs.sections) === null || _configs$sections8 === void 0 ? void 0 : (_configs$sections8$fi = _configs$sections8.filter) === null || _configs$sections8$fi === void 0 ? void 0 : _configs$sections8$fi.show) && /*#__PURE__*/React__default.createElement("div", {
    className: "section filter"
  }, /*#__PURE__*/React__default.createElement(SearchComponent, {
    uiConfig: configs === null || configs === void 0 ? void 0 : (_configs$sections9 = configs.sections) === null || _configs$sections9 === void 0 ? void 0 : (_configs$sections9$fi = _configs$sections9.filter) === null || _configs$sections9$fi === void 0 ? void 0 : _configs$sections9$fi.uiConfig,
    header: configs === null || configs === void 0 ? void 0 : (_configs$sections10 = configs.sections) === null || _configs$sections10 === void 0 ? void 0 : (_configs$sections10$f = _configs$sections10.filter) === null || _configs$sections10$f === void 0 ? void 0 : _configs$sections10$f.label,
    screenType: configs.type,
    fullConfig: configs,
    data: data
  })), (configs === null || configs === void 0 ? void 0 : configs.type) === 'inbox' && (configs === null || configs === void 0 ? void 0 : (_configs$sections11 = configs.sections) === null || _configs$sections11 === void 0 ? void 0 : (_configs$sections11$s = _configs$sections11.search) === null || _configs$sections11$s === void 0 ? void 0 : _configs$sections11$s.show) && /*#__PURE__*/React__default.createElement(MediaQuery, {
    minWidth: 426
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "section search"
  }, /*#__PURE__*/React__default.createElement(SearchComponent, {
    uiConfig: configs === null || configs === void 0 ? void 0 : (_configs$sections12 = configs.sections) === null || _configs$sections12 === void 0 ? void 0 : (_configs$sections12$s = _configs$sections12.search) === null || _configs$sections12$s === void 0 ? void 0 : _configs$sections12$s.uiConfig,
    header: configs === null || configs === void 0 ? void 0 : (_configs$sections13 = configs.sections) === null || _configs$sections13 === void 0 ? void 0 : (_configs$sections13$s = _configs$sections13.search) === null || _configs$sections13$s === void 0 ? void 0 : _configs$sections13$s.label,
    screenType: configs.type,
    fullConfig: configs,
    data: data
  }))), (configs === null || configs === void 0 ? void 0 : configs.type) === 'inbox' && (configs === null || configs === void 0 ? void 0 : (_configs$sections14 = configs.sections) === null || _configs$sections14 === void 0 ? void 0 : (_configs$sections14$f = _configs$sections14.filter) === null || _configs$sections14$f === void 0 ? void 0 : _configs$sections14$f.show) && /*#__PURE__*/React__default.createElement(MediaQuery, {
    minWidth: 426
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "section filter"
  }, /*#__PURE__*/React__default.createElement(SearchComponent, {
    uiConfig: configs === null || configs === void 0 ? void 0 : (_configs$sections15 = configs.sections) === null || _configs$sections15 === void 0 ? void 0 : (_configs$sections15$f = _configs$sections15.filter) === null || _configs$sections15$f === void 0 ? void 0 : _configs$sections15$f.uiConfig,
    header: configs === null || configs === void 0 ? void 0 : (_configs$sections16 = configs.sections) === null || _configs$sections16 === void 0 ? void 0 : (_configs$sections16$f = _configs$sections16.filter) === null || _configs$sections16$f === void 0 ? void 0 : _configs$sections16$f.label,
    screenType: configs.type,
    fullConfig: configs,
    data: data
  }))), (configs === null || configs === void 0 ? void 0 : configs.type) === 'inbox' && /*#__PURE__*/React__default.createElement(MediaQuery, {
    maxWidth: 426
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "searchBox"
  }, (configs === null || configs === void 0 ? void 0 : (_configs$sections17 = configs.sections) === null || _configs$sections17 === void 0 ? void 0 : (_configs$sections17$s = _configs$sections17.search) === null || _configs$sections17$s === void 0 ? void 0 : _configs$sections17$s.show) && /*#__PURE__*/React__default.createElement(SearchAction, {
    text: "SEARCH",
    handleActionClick: function handleActionClick() {
      setType("SEARCH");
      setPopup(true);
    }
  }), (configs === null || configs === void 0 ? void 0 : (_configs$sections18 = configs.sections) === null || _configs$sections18 === void 0 ? void 0 : (_configs$sections18$f = _configs$sections18.filter) === null || _configs$sections18$f === void 0 ? void 0 : _configs$sections18$f.show) && /*#__PURE__*/React__default.createElement(FilterAction, {
    text: "FILTER",
    handleActionClick: function handleActionClick() {
      setType("FILTER");
      setPopup(true);
    }
  }))), (configs === null || configs === void 0 ? void 0 : (_configs$sections19 = configs.sections) === null || _configs$sections19 === void 0 ? void 0 : (_configs$sections19$s = _configs$sections19.searchResult) === null || _configs$sections19$s === void 0 ? void 0 : _configs$sections19$s.show) && /*#__PURE__*/React__default.createElement("div", {
    className: "",
    style: ((_data = data) === null || _data === void 0 ? void 0 : (_data$configs$section = _data[configs === null || configs === void 0 ? void 0 : (_configs$sections20 = configs.sections) === null || _configs$sections20 === void 0 ? void 0 : (_configs$sections20$s = _configs$sections20.searchResult) === null || _configs$sections20$s === void 0 ? void 0 : (_configs$sections20$s2 = _configs$sections20$s.uiConfig) === null || _configs$sections20$s2 === void 0 ? void 0 : _configs$sections20$s2.resultsJsonPath]) === null || _data$configs$section === void 0 ? void 0 : _data$configs$section.length) > 0 ? !(isLoading || isFetching) ? {
      overflowX: "auto"
    } : {} : {}
  }, /*#__PURE__*/React__default.createElement(MediaQuery, {
    minWidth: 426
  }, /*#__PURE__*/React__default.createElement(ResultsTable, {
    config: configs === null || configs === void 0 ? void 0 : (_configs$sections21 = configs.sections) === null || _configs$sections21 === void 0 ? void 0 : (_configs$sections21$s = _configs$sections21.searchResult) === null || _configs$sections21$s === void 0 ? void 0 : _configs$sections21$s.uiConfig,
    data: data,
    isLoading: isLoading,
    isFetching: isFetching,
    fullConfig: configs
  })), /*#__PURE__*/React__default.createElement(MediaQuery, {
    maxWidth: 426
  }, /*#__PURE__*/React__default.createElement(MobileSearchResults, {
    config: configs === null || configs === void 0 ? void 0 : (_configs$sections22 = configs.sections) === null || _configs$sections22 === void 0 ? void 0 : (_configs$sections22$s = _configs$sections22.searchResult) === null || _configs$sections22$s === void 0 ? void 0 : _configs$sections22$s.uiConfig,
    data: data,
    isLoading: isLoading,
    isFetching: isFetching,
    fullConfig: configs
  }))), popup && /*#__PURE__*/React__default.createElement(PopUp, null, type === "FILTER" && /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React__default.createElement(MobileSearchComponent, {
    uiConfig: configs === null || configs === void 0 ? void 0 : (_configs$sections23 = configs.sections) === null || _configs$sections23 === void 0 ? void 0 : (_configs$sections23$f = _configs$sections23.filter) === null || _configs$sections23$f === void 0 ? void 0 : _configs$sections23$f.uiConfig,
    header: configs === null || configs === void 0 ? void 0 : (_configs$sections24 = configs.sections) === null || _configs$sections24 === void 0 ? void 0 : (_configs$sections24$f = _configs$sections24.filter) === null || _configs$sections24$f === void 0 ? void 0 : _configs$sections24$f.label,
    modalType: type,
    screenType: configs.type,
    fullConfig: configs,
    data: data,
    onClose: handlePopupClose,
    defaultValues: configs === null || configs === void 0 ? void 0 : (_configs$sections25 = configs.sections) === null || _configs$sections25 === void 0 ? void 0 : (_configs$sections25$f = _configs$sections25.filter) === null || _configs$sections25$f === void 0 ? void 0 : (_configs$sections25$f2 = _configs$sections25$f.uiConfig) === null || _configs$sections25$f2 === void 0 ? void 0 : _configs$sections25$f2.defaultValues
  })), type === "SEARCH" && /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React__default.createElement(MobileSearchComponent, {
    uiConfig: configs === null || configs === void 0 ? void 0 : (_configs$sections26 = configs.sections) === null || _configs$sections26 === void 0 ? void 0 : (_configs$sections26$s = _configs$sections26.search) === null || _configs$sections26$s === void 0 ? void 0 : _configs$sections26$s.uiConfig,
    header: configs === null || configs === void 0 ? void 0 : (_configs$sections27 = configs.sections) === null || _configs$sections27 === void 0 ? void 0 : (_configs$sections27$s = _configs$sections27.search) === null || _configs$sections27$s === void 0 ? void 0 : _configs$sections27$s.label,
    modalType: type,
    screenType: configs.type,
    fullConfig: configs,
    data: data,
    onClose: handlePopupClose,
    defaultValues: configs === null || configs === void 0 ? void 0 : (_configs$sections28 = configs.sections) === null || _configs$sections28 === void 0 ? void 0 : (_configs$sections28$s = _configs$sections28.search) === null || _configs$sections28$s === void 0 ? void 0 : (_configs$sections28$s2 = _configs$sections28$s.uiConfig) === null || _configs$sections28$s2 === void 0 ? void 0 : _configs$sections28$s2.defaultValues
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "additional-sections-parent"
  })));
};

var Reason = function Reason(_ref) {
  var headComment = _ref.headComment,
    otherComment = _ref.otherComment,
    additionalComment = _ref.additionalComment;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var getMarkup = function getMarkup() {
    if (additionalComment) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "checkpoint-comments-wrap",
        style: {
          marginBottom: "1rem"
        }
      }, /*#__PURE__*/React__default.createElement("p", null, t("COMMON_CERTIFY_ONE")), /*#__PURE__*/React__default.createElement("br", null), /*#__PURE__*/React__default.createElement("p", null, /*#__PURE__*/React__default.createElement("b", null, " ", t("ES_COMMON_NOTE")), t("COMMON_CERTIFY_TWO")));
    } else {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "checkpoint-comments-wrap"
      }, /*#__PURE__*/React__default.createElement("h4", null, headComment), /*#__PURE__*/React__default.createElement("p", null, otherComment));
    }
  };
  return getMarkup();
};

var TLCaption = function TLCaption(_ref) {
  var _data$wfComment, _data$thumbnailsToSho, _data$thumbnailsToSho2;
  var data = _ref.data,
    OpenImage = _ref.OpenImage,
    _ref$privacy = _ref.privacy,
    privacy = _ref$privacy === void 0 ? {} : _ref$privacy;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  return /*#__PURE__*/React__default.createElement("div", null, data.date && /*#__PURE__*/React__default.createElement("p", null, data.date), /*#__PURE__*/React__default.createElement("p", null, data.name), data.mobileNumber && /*#__PURE__*/React__default.createElement("span", {
    style: {
      display: "inline-flex",
      width: "fit-content",
      marginLeft: "10px"
    }
  }, /*#__PURE__*/React__default.createElement(TelePhone, {
    mobile: data.mobileNumber
  }), /*#__PURE__*/React__default.createElement("p", null, "\xA0\xA0\xA0\xA0"), /*#__PURE__*/React__default.createElement(UnMaskComponent, {
    privacy: privacy
  })), data.source && /*#__PURE__*/React__default.createElement("p", null, t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + data.source.toUpperCase())), data.comment && /*#__PURE__*/React__default.createElement(Reason, {
    otherComment: data === null || data === void 0 ? void 0 : data.otherComment,
    headComment: data === null || data === void 0 ? void 0 : data.comment
  }), data.additionalComment && /*#__PURE__*/React__default.createElement(Reason, {
    otherComment: data === null || data === void 0 ? void 0 : data.otherComment,
    headComment: data === null || data === void 0 ? void 0 : data.additionalComment,
    additionalComment: data === null || data === void 0 ? void 0 : data.additionalComment
  }), (data === null || data === void 0 ? void 0 : data.wfComment.length) > 0 ? /*#__PURE__*/React__default.createElement("div", null, data === null || data === void 0 ? void 0 : (_data$wfComment = data.wfComment) === null || _data$wfComment === void 0 ? void 0 : _data$wfComment.map(function (e) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "TLComments text-wrap-overflow",
      style: {
        "backgoundColor": "unset"
      }
    }, /*#__PURE__*/React__default.createElement("h3", null, t("WF_COMMON_COMMENTS")), /*#__PURE__*/React__default.createElement("p", null, e));
  })) : null, (data === null || data === void 0 ? void 0 : (_data$thumbnailsToSho = data.thumbnailsToShow) === null || _data$thumbnailsToSho === void 0 ? void 0 : (_data$thumbnailsToSho2 = _data$thumbnailsToSho.thumbs) === null || _data$thumbnailsToSho2 === void 0 ? void 0 : _data$thumbnailsToSho2.length) > 0 ? /*#__PURE__*/React__default.createElement("div", {
    className: "TLComments"
  }, /*#__PURE__*/React__default.createElement("h3", null, t("CS_COMMON_ATTACHMENTS")), /*#__PURE__*/React__default.createElement(DisplayPhotos, {
    srcs: data === null || data === void 0 ? void 0 : data.thumbnailsToShow.thumbs,
    onClick: function onClick(src, index) {
      OpenImage(src, index, data === null || data === void 0 ? void 0 : data.thumbnailsToShow);
    }
  })) : null);
};

var _excluded$e = ["businessService", "tenantId", "applicationNo", "timelineStatusPrefix", "statusAttribute"];
function OpenImage(imageSource, index, thumbnailsToShow) {
  var _thumbnailsToShow$ful;
  window.open(thumbnailsToShow === null || thumbnailsToShow === void 0 ? void 0 : (_thumbnailsToShow$ful = thumbnailsToShow.fullImage) === null || _thumbnailsToShow$ful === void 0 ? void 0 : _thumbnailsToShow$ful[0], "_blank");
}
var WorkflowTimeline = function WorkflowTimeline(_ref) {
  var _workflowDetails$data4, _workflowDetails$data5, _workflowDetails$data6, _workflowDetails$data7, _workflowDetails$data8;
  var businessService = _ref.businessService,
    tenantId = _ref.tenantId,
    applicationNo = _ref.applicationNo,
    _ref$timelineStatusPr = _ref.timelineStatusPrefix,
    timelineStatusPrefix = _ref$timelineStatusPr === void 0 ? "WF_SERVICE_" : _ref$timelineStatusPr,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$e);
  var _useState = React.useState(false),
    additionalComment = _useState[0],
    setAdditionalComment = _useState[1];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var getTimelineCaptions = function getTimelineCaptions(checkpoint, index) {
    var captionDetails = {
      name: '',
      date: '',
      mobileNumber: '',
      wfComment: '',
      additionalComment: '',
      thumbnailsToShow: ''
    };
    if (index === -1) {
      var _checkpoint$assignes, _checkpoint$assignes$;
      captionDetails.name = checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$assignes = checkpoint.assignes) === null || _checkpoint$assignes === void 0 ? void 0 : (_checkpoint$assignes$ = _checkpoint$assignes[0]) === null || _checkpoint$assignes$ === void 0 ? void 0 : _checkpoint$assignes$.name;
      captionDetails.date = '';
      captionDetails.mobileNumber = '';
      captionDetails.wfComment = '';
      captionDetails.additionalComment = '';
      captionDetails.thumbnailsToShow = '';
    } else {
      var _checkpoint$assigner, _Digit$DateUtils, _Digit$DateUtils2, _Digit$DateUtils3, _checkpoint$assigner2;
      captionDetails.name = checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$assigner = checkpoint.assigner) === null || _checkpoint$assigner === void 0 ? void 0 : _checkpoint$assigner.name;
      captionDetails.date = ((_Digit$DateUtils = Digit.DateUtils) === null || _Digit$DateUtils === void 0 ? void 0 : _Digit$DateUtils.ConvertTimestampToDate(checkpoint.auditDetails.lastModifiedEpoch)) + " " + ((_Digit$DateUtils2 = Digit.DateUtils) === null || _Digit$DateUtils2 === void 0 ? void 0 : _Digit$DateUtils2.ConvertEpochToTimeInHours(checkpoint.auditDetails.lastModifiedEpoch)) + " " + ((_Digit$DateUtils3 = Digit.DateUtils) === null || _Digit$DateUtils3 === void 0 ? void 0 : _Digit$DateUtils3.getDayfromTimeStamp(checkpoint.auditDetails.lastModifiedEpoch));
      captionDetails.mobileNumber = checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$assigner2 = checkpoint.assigner) === null || _checkpoint$assigner2 === void 0 ? void 0 : _checkpoint$assigner2.mobileNumber;
      captionDetails.wfComment = checkpoint !== null && checkpoint !== void 0 && checkpoint.comment ? [checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.comment] : [];
      captionDetails.additionalComment = additionalComment && (checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.performedAction) === "APPROVE", captionDetails.thumbnailsToShow = checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.thumbnailsToShow;
    }
    var caption = {
      date: captionDetails === null || captionDetails === void 0 ? void 0 : captionDetails.date,
      name: captionDetails === null || captionDetails === void 0 ? void 0 : captionDetails.name,
      mobileNumber: captionDetails === null || captionDetails === void 0 ? void 0 : captionDetails.mobileNumber,
      wfComment: captionDetails === null || captionDetails === void 0 ? void 0 : captionDetails.wfComment,
      additionalComment: captionDetails === null || captionDetails === void 0 ? void 0 : captionDetails.additionalComment,
      thumbnailsToShow: checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.thumbnailsToShow
    };
    return /*#__PURE__*/React__default.createElement(TLCaption, {
      data: caption,
      OpenImage: OpenImage
    });
  };
  var workflowDetails = Digit.Hooks.useWorkflowDetailsV2({
    tenantId: tenantId,
    id: applicationNo,
    moduleCode: businessService,
    config: {
      enabled: true,
      cacheTime: 0
    }
  });
  React.useEffect(function () {
    var _workflowDetails$data, _workflowDetails$data2, _workflowDetails$data3;
    if ((workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data = workflowDetails.data) === null || _workflowDetails$data === void 0 ? void 0 : _workflowDetails$data.applicationBusinessService) === "muster-roll-approval" && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data2 = workflowDetails.data) === null || _workflowDetails$data2 === void 0 ? void 0 : (_workflowDetails$data3 = _workflowDetails$data2.actionState) === null || _workflowDetails$data3 === void 0 ? void 0 : _workflowDetails$data3.applicationStatus) === "APPROVED") {
      setAdditionalComment(true);
    }
  }, [workflowDetails]);
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, (workflowDetails === null || workflowDetails === void 0 ? void 0 : workflowDetails.isLoading) && /*#__PURE__*/React__default.createElement(Loader, null), (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data4 = workflowDetails.data) === null || _workflowDetails$data4 === void 0 ? void 0 : (_workflowDetails$data5 = _workflowDetails$data4.timeline) === null || _workflowDetails$data5 === void 0 ? void 0 : _workflowDetails$data5.length) > 0 && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, (workflowDetails === null || workflowDetails === void 0 ? void 0 : workflowDetails.breakLineRequired) === undefined ? /*#__PURE__*/React__default.createElement(BreakLine, null) : workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.breakLineRequired ? /*#__PURE__*/React__default.createElement(BreakLine, null) : null, !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(CardSectionHeader, {
    style: {
      marginBottom: "16px",
      marginTop: "32px"
    }
  }, t("WORKS_WORKFLOW_TIMELINE")), (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data6 = workflowDetails.data) === null || _workflowDetails$data6 === void 0 ? void 0 : _workflowDetails$data6.timeline) && /*#__PURE__*/React__default.createElement(ConnectingCheckPoints, null, (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data7 = workflowDetails.data) === null || _workflowDetails$data7 === void 0 ? void 0 : _workflowDetails$data7.timeline) && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data8 = workflowDetails.data) === null || _workflowDetails$data8 === void 0 ? void 0 : _workflowDetails$data8.timeline.map(function (checkpoint, index, arr) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, index === 0 && !(checkpoint !== null && checkpoint !== void 0 && checkpoint.isTerminateState) && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(CheckPoint, {
      keyValue: index,
      isCompleted: index === 0,
      label: t(Digit.Utils.locale.getTransformedLocale(timelineStatusPrefix + "STATE_" + (checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint["state"]))),
      customClassName: "checkpoint-connect-wrap"
    })), /*#__PURE__*/React__default.createElement(CheckPoint, {
      keyValue: index,
      isCompleted: (checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.isTerminateState) && index === 0,
      label: t(Digit.Utils.locale.getTransformedLocale(timelineStatusPrefix + "STATUS_" + ((checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.performedAction) === "EDIT" ? "" + (checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.performedAction) : "" + (checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.performedAction)))),
      customChild: getTimelineCaptions(checkpoint, index)
    }));
  }))))));
};

var configEstimateModal = function configEstimateModal(t, action, approvers, businessService, moduleCode) {
  var _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit2, _Digit2$Customization, _Digit2$Customization2, _Digit3, _Digit3$Customization, _Digit3$Customization2, _Digit4, _Digit4$Customization, _Digit4$Customization2, _configMap, _configMap$businessSe27, _configMap$businessSe28, _configMap$businessSe29;
  var actionString = action.action;
  var bsEstimate = (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations["commonUiConfig"]) === null || _Digit$Customizations2 === void 0 ? void 0 : _Digit$Customizations2.getBusinessService("estimate");
  var bsContract = (_Digit2 = Digit) === null || _Digit2 === void 0 ? void 0 : (_Digit2$Customization = _Digit2.Customizations) === null || _Digit2$Customization === void 0 ? void 0 : (_Digit2$Customization2 = _Digit2$Customization["commonUiConfig"]) === null || _Digit2$Customization2 === void 0 ? void 0 : _Digit2$Customization2.getBusinessService("contract");
  var bsMuster = (_Digit3 = Digit) === null || _Digit3 === void 0 ? void 0 : (_Digit3$Customization = _Digit3.Customizations) === null || _Digit3$Customization === void 0 ? void 0 : (_Digit3$Customization2 = _Digit3$Customization["commonUiConfig"]) === null || _Digit3$Customization2 === void 0 ? void 0 : _Digit3$Customization2.getBusinessService("muster roll");
  var bsPurchaseBill = (_Digit4 = Digit) === null || _Digit4 === void 0 ? void 0 : (_Digit4$Customization = _Digit4.Customizations) === null || _Digit4$Customization === void 0 ? void 0 : (_Digit4$Customization2 = _Digit4$Customization["commonUiConfig"]) === null || _Digit4$Customization2 === void 0 ? void 0 : _Digit4$Customization2.getBusinessService("works.purchase");
  var configMap = (_configMap = {}, _configMap[bsEstimate] = {
    "default": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: true
      },
      upload: {
        isMandatory: false,
        show: true,
        allowedFileTypes: /(.*?)(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv|jpeg)$/i
      }
    },
    "REJECT": {
      comments: {
        isMandatory: true,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "SENDBACK": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "SENDBACKTOORIGINATOR": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "APPROVE": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    }
  }, _configMap[bsContract] = {
    "default": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: true
      },
      upload: {
        isMandatory: false,
        show: true,
        allowedFileTypes: /(.*?)(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv|jpeg)$/i
      }
    },
    "REJECT": {
      comments: {
        isMandatory: true,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "SEND_BACK": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "VERIFY_AND_FORWARD": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: true
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "SEND_BACK_TO_ORIGINATOR": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "APPROVE": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    }
  }, _configMap[bsMuster] = {
    "default": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: true
      },
      upload: {
        isMandatory: false,
        show: true,
        allowedFileTypes: /(.*?)(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|msword|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv|jpeg)$/i
      }
    },
    "APPROVE": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      },
      acceptTerms: {
        isMandatory: true,
        show: true
      }
    },
    "REJECT": {
      comments: {
        isMandatory: true,
        show: true
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "SENDBACK": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      },
      acceptTerms: {
        isMandatory: false,
        show: false
      }
    },
    "SENDBACKTOCBO": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      },
      acceptTerms: {
        isMandatory: false,
        show: false
      }
    }
  }, _configMap[bsPurchaseBill] = {
    "default": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "VERIFY_AND_FORWARD": {
      comments: {
        isMandatory: false,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: true
      },
      upload: {
        isMandatory: false,
        show: true
      }
    },
    "REJECT": {
      comments: {
        isMandatory: true,
        show: true
      },
      assignee: {
        isMandatory: false,
        show: false
      },
      upload: {
        isMandatory: false,
        show: true
      }
    }
  }, _configMap);
  var fetchIsMandatory = function fetchIsMandatory(field) {
    var _configMap$businessSe;
    if (configMap !== null && configMap !== void 0 && (_configMap$businessSe = configMap[businessService]) !== null && _configMap$businessSe !== void 0 && _configMap$businessSe[actionString]) {
      var _configMap$businessSe2, _configMap$businessSe3, _configMap$businessSe4, _configMap$businessSe5, _configMap$businessSe6, _configMap$businessSe7;
      return configMap !== null && configMap !== void 0 && (_configMap$businessSe2 = configMap[businessService]) !== null && _configMap$businessSe2 !== void 0 && (_configMap$businessSe3 = _configMap$businessSe2[actionString]) !== null && _configMap$businessSe3 !== void 0 && (_configMap$businessSe4 = _configMap$businessSe3[field]) !== null && _configMap$businessSe4 !== void 0 && _configMap$businessSe4.isMandatory ? configMap === null || configMap === void 0 ? void 0 : (_configMap$businessSe5 = configMap[businessService]) === null || _configMap$businessSe5 === void 0 ? void 0 : (_configMap$businessSe6 = _configMap$businessSe5[actionString]) === null || _configMap$businessSe6 === void 0 ? void 0 : (_configMap$businessSe7 = _configMap$businessSe6[field]) === null || _configMap$businessSe7 === void 0 ? void 0 : _configMap$businessSe7.isMandatory : false;
    } else {
      var _configMap$businessSe8, _configMap$businessSe9, _configMap$businessSe10, _configMap$businessSe11, _configMap$businessSe12, _configMap$businessSe13;
      return configMap !== null && configMap !== void 0 && (_configMap$businessSe8 = configMap[businessService]) !== null && _configMap$businessSe8 !== void 0 && (_configMap$businessSe9 = _configMap$businessSe8.default) !== null && _configMap$businessSe9 !== void 0 && (_configMap$businessSe10 = _configMap$businessSe9[field]) !== null && _configMap$businessSe10 !== void 0 && _configMap$businessSe10.isMandatory ? configMap === null || configMap === void 0 ? void 0 : (_configMap$businessSe11 = configMap[businessService]) === null || _configMap$businessSe11 === void 0 ? void 0 : (_configMap$businessSe12 = _configMap$businessSe11.default) === null || _configMap$businessSe12 === void 0 ? void 0 : (_configMap$businessSe13 = _configMap$businessSe12[field]) === null || _configMap$businessSe13 === void 0 ? void 0 : _configMap$businessSe13.isMandatory : false;
    }
  };
  var fetchIsShow = function fetchIsShow(field) {
    var _configMap$businessSe14;
    if (configMap !== null && configMap !== void 0 && (_configMap$businessSe14 = configMap[businessService]) !== null && _configMap$businessSe14 !== void 0 && _configMap$businessSe14[actionString]) {
      var _configMap$businessSe15, _configMap$businessSe16, _configMap$businessSe17, _configMap$businessSe18, _configMap$businessSe19, _configMap$businessSe20;
      return configMap !== null && configMap !== void 0 && (_configMap$businessSe15 = configMap[businessService]) !== null && _configMap$businessSe15 !== void 0 && (_configMap$businessSe16 = _configMap$businessSe15[actionString]) !== null && _configMap$businessSe16 !== void 0 && (_configMap$businessSe17 = _configMap$businessSe16[field]) !== null && _configMap$businessSe17 !== void 0 && _configMap$businessSe17.show ? configMap === null || configMap === void 0 ? void 0 : (_configMap$businessSe18 = configMap[businessService]) === null || _configMap$businessSe18 === void 0 ? void 0 : (_configMap$businessSe19 = _configMap$businessSe18[actionString]) === null || _configMap$businessSe19 === void 0 ? void 0 : (_configMap$businessSe20 = _configMap$businessSe19[field]) === null || _configMap$businessSe20 === void 0 ? void 0 : _configMap$businessSe20.show : false;
    } else {
      var _configMap$businessSe21, _configMap$businessSe22, _configMap$businessSe23, _configMap$businessSe24, _configMap$businessSe25, _configMap$businessSe26;
      return configMap !== null && configMap !== void 0 && (_configMap$businessSe21 = configMap[businessService]) !== null && _configMap$businessSe21 !== void 0 && (_configMap$businessSe22 = _configMap$businessSe21.default) !== null && _configMap$businessSe22 !== void 0 && (_configMap$businessSe23 = _configMap$businessSe22[field]) !== null && _configMap$businessSe23 !== void 0 && _configMap$businessSe23.show ? configMap === null || configMap === void 0 ? void 0 : (_configMap$businessSe24 = configMap[businessService]) === null || _configMap$businessSe24 === void 0 ? void 0 : (_configMap$businessSe25 = _configMap$businessSe24.default) === null || _configMap$businessSe25 === void 0 ? void 0 : (_configMap$businessSe26 = _configMap$businessSe25[field]) === null || _configMap$businessSe26 === void 0 ? void 0 : _configMap$businessSe26.show : false;
    }
  };
  return {
    label: {
      heading: Digit.Utils.locale.getTransformedLocale("WF_MODAL_HEADER_" + businessService + "_" + action.action),
      submit: Digit.Utils.locale.getTransformedLocale("WF_MODAL_SUBMIT_" + businessService + "_" + action.action),
      cancel: "WF_MODAL_CANCEL"
    },
    form: [{
      body: [{
        label: " ",
        type: "checkbox",
        disable: false,
        isMandatory: false,
        populators: {
          name: "acceptTerms",
          title: "MUSTOR_APPROVAL_CHECKBOX",
          isMandatory: false,
          labelStyles: {
            marginLeft: "40px"
          },
          customLabelMarkup: true,
          hideInForm: !fetchIsShow("acceptTerms")
        }
      }, {
        label: t("WF_MODAL_APPROVER"),
        type: "dropdown",
        isMandatory: fetchIsMandatory("assignee"),
        disable: false,
        key: "assignees",
        populators: {
          name: "assignee",
          optionsKey: "nameOfEmp",
          options: approvers,
          hideInForm: !fetchIsShow("assignee"),
          "optionsCustomStyle": {
            "top": "2.3rem"
          }
        }
      }, {
        label: t("WF_MODAL_COMMENTS"),
        type: "textarea",
        isMandatory: fetchIsMandatory("comments"),
        populators: {
          name: "comments",
          hideInForm: !fetchIsShow("comments"),
          validation: {
            maxLength: {
              value: 1024,
              message: t("WORKS_COMMENT_LENGTH_EXCEEDED_1024")
            }
          }
        }
      }, {
        type: "multiupload",
        label: t("WORKFLOW_MODAL_UPLOAD_FILES"),
        populators: {
          name: "documents",
          allowedMaxSizeInMB: 5,
          maxFilesAllowed: 1,
          allowedFileTypes: configMap === null || configMap === void 0 ? void 0 : (_configMap$businessSe27 = configMap[businessService]) === null || _configMap$businessSe27 === void 0 ? void 0 : (_configMap$businessSe28 = _configMap$businessSe27.default) === null || _configMap$businessSe28 === void 0 ? void 0 : (_configMap$businessSe29 = _configMap$businessSe28.upload) === null || _configMap$businessSe29 === void 0 ? void 0 : _configMap$businessSe29.allowedFileTypes,
          hintText: t("WORKS_DOC_UPLOAD_HINT"),
          showHintBelow: true,
          customClass: "upload-margin-bottom",
          errorMessage: t("WORKS_FILE_UPLOAD_CUSTOM_ERROR_MSG"),
          hideInForm: !fetchIsShow("upload")
        }
      }]
    }]
  };
};

var _excluded$f = ["applicationDetails"];
var Heading$1 = function Heading(props) {
  return /*#__PURE__*/React__default.createElement("h1", {
    className: "heading-m"
  }, props.label);
};
var Close$2 = function Close() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
  }));
};
var CloseBtn$1 = function CloseBtn(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "icon-bg-secondary",
    onClick: props.onClick
  }, /*#__PURE__*/React__default.createElement(Close$2, null));
};
var WorkflowPopup = function WorkflowPopup(_ref) {
  var _Digit, _Digit$Customizations, _Digit$Customizations2, _action$assigneeRoles, _action$assigneeRoles2, _assigneeOptions, _assigneeOptions2;
  var applicationDetails = _ref.applicationDetails,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$f);
  var action = props.action,
    tenantId = props.tenantId,
    t = props.t,
    closeModal = props.closeModal,
    submitAction = props.submitAction,
    businessService = props.businessService;
  var enableAssignee = (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations["commonUiConfig"]) === null || _Digit$Customizations2 === void 0 ? void 0 : _Digit$Customizations2.enableHrmsSearch(businessService, action);
  var _useState = React.useState(null),
    config = _useState[0],
    setConfig = _useState[1];
  var _useState2 = React.useState(true),
    modalSubmit = _useState2[0],
    setModalSubmit = _useState2[1];
  var _Digit$Hooks$hrms$use = Digit.Hooks.hrms.useHRMSSearch({
      roles: action === null || action === void 0 ? void 0 : (_action$assigneeRoles = action.assigneeRoles) === null || _action$assigneeRoles === void 0 ? void 0 : _action$assigneeRoles.toString(),
      isActive: true
    }, tenantId, null, null, {
      enabled: (action === null || action === void 0 ? void 0 : (_action$assigneeRoles2 = action.assigneeRoles) === null || _action$assigneeRoles2 === void 0 ? void 0 : _action$assigneeRoles2.length) > 0 && enableAssignee
    }),
    isLoadingHrmsSearch = _Digit$Hooks$hrms$use.isLoading,
    assigneeOptions = _Digit$Hooks$hrms$use.data;
  assigneeOptions = (_assigneeOptions = assigneeOptions) === null || _assigneeOptions === void 0 ? void 0 : _assigneeOptions.Employees;
  (_assigneeOptions2 = assigneeOptions) === null || _assigneeOptions2 === void 0 ? void 0 : _assigneeOptions2.map(function (emp) {
    var _emp$user;
    return emp.nameOfEmp = (emp === null || emp === void 0 ? void 0 : (_emp$user = emp.user) === null || _emp$user === void 0 ? void 0 : _emp$user.name) || t("ES_COMMON_NA");
  });
  React.useEffect(function () {
    if (businessService === "muster-roll-approval" && action.action === "APPROVE") {
      setModalSubmit(false);
    }
  }, [businessService]);
  React.useEffect(function () {
    var _assigneeOptions3;
    if (((_assigneeOptions3 = assigneeOptions) === null || _assigneeOptions3 === void 0 ? void 0 : _assigneeOptions3.length) >= 0) {
      setConfig(configEstimateModal(t, action, assigneeOptions, businessService));
    } else {
      setConfig(configEstimateModal(t, action, undefined, businessService));
    }
  }, [assigneeOptions]);
  var _submit = function _submit(data) {
    var _Digit2, _Digit2$Customization, _Digit2$Customization2;
    var updatePayload = (_Digit2 = Digit) === null || _Digit2 === void 0 ? void 0 : (_Digit2$Customization = _Digit2.Customizations) === null || _Digit2$Customization === void 0 ? void 0 : (_Digit2$Customization2 = _Digit2$Customization["commonUiConfig"]) === null || _Digit2$Customization2 === void 0 ? void 0 : _Digit2$Customization2.updatePayload(applicationDetails, data, action, businessService);
    submitAction(updatePayload, action);
  };
  var modalCallBack = function modalCallBack(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) {
    var _Digit3, _Digit3$Customization, _Digit3$Customization2;
    (_Digit3 = Digit) === null || _Digit3 === void 0 ? void 0 : (_Digit3$Customization = _Digit3.Customizations) === null || _Digit3$Customization === void 0 ? void 0 : (_Digit3$Customization2 = _Digit3$Customization["commonUiConfig"]) === null || _Digit3$Customization2 === void 0 ? void 0 : _Digit3$Customization2.enableModalSubmit(businessService, action, setModalSubmit, formData);
  };
  if (isLoadingHrmsSearch) return /*#__PURE__*/React__default.createElement(Loader, null);
  return action && config !== null && config !== void 0 && config.form ? /*#__PURE__*/React__default.createElement(Modal, {
    headerBarMain: /*#__PURE__*/React__default.createElement(Heading$1, {
      label: t(config.label.heading)
    }),
    headerBarEnd: /*#__PURE__*/React__default.createElement(CloseBtn$1, {
      onClick: closeModal
    }),
    actionCancelLabel: t(config.label.cancel),
    actionCancelOnSubmit: closeModal,
    actionSaveLabel: t(config.label.submit),
    actionSaveOnSubmit: function actionSaveOnSubmit() {},
    formId: "modal-action",
    isDisabled: !modalSubmit
  }, /*#__PURE__*/React__default.createElement(FormComposer, {
    config: config.form,
    noBoxShadow: true,
    inline: true,
    childrenAtTheBottom: true,
    onSubmit: _submit,
    defaultValues: {},
    formId: "modal-action",
    onFormValueChange: modalCallBack
  })) : /*#__PURE__*/React__default.createElement(Loader, null);
};

var ActionModal = function ActionModal(props) {
  return /*#__PURE__*/React__default.createElement(WorkflowPopup, props);
};

var WorkflowActions = function WorkflowActions(_ref) {
  var _user$info, _user$info$roles, _workflowDetails$data, _workflowDetails$data2, _workflowDetails$data3, _workflowDetails$data4, _workflowDetails$data5, _workflowDetails$data6, _workflowDetails$data7, _workflowDetails$data8, _actions$, _actions$2, _actions$3;
  var businessService = _ref.businessService,
    tenantId = _ref.tenantId,
    applicationNo = _ref.applicationNo,
    forcedActionPrefix = _ref.forcedActionPrefix,
    _ref$ActionBarStyle = _ref.ActionBarStyle,
    ActionBarStyle = _ref$ActionBarStyle === void 0 ? {} : _ref$ActionBarStyle,
    _ref$MenuStyle = _ref.MenuStyle,
    MenuStyle = _ref$MenuStyle === void 0 ? {} : _ref$MenuStyle,
    applicationDetails = _ref.applicationDetails,
    url = _ref.url,
    moduleCode = _ref.moduleCode,
    editApplicationNumber = _ref.editApplicationNumber,
    editCallback = _ref.editCallback,
    callback = _ref.callback;
  var history = reactRouterDom.useHistory();
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    estimateNumber = _Digit$Hooks$useQuery.estimateNumber;
  applicationNo = applicationNo ? applicationNo : estimateNumber;
  var _Digit$Hooks$useUpdat = Digit.Hooks.useUpdateCustom(url),
    mutate = _Digit$Hooks$useUpdat.mutate;
  var _useState = React.useState(false),
    displayMenu = _useState[0],
    setDisplayMenu = _useState[1];
  var _useState2 = React.useState(false),
    showModal = _useState2[0],
    setShowModal = _useState2[1];
  var _useState3 = React.useState(null),
    selectedAction = _useState3[0],
    setSelectedAction = _useState3[1];
  var _useState4 = React.useState(false),
    isEnableLoader = _useState4[0],
    setIsEnableLoader = _useState4[1];
  var _useState5 = React.useState(null),
    showToast = _useState5[0],
    setShowToast = _useState5[1];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var user = Digit.UserService.getUser();
  var workflowDetails = Digit.Hooks.useWorkflowDetailsV2({
    tenantId: tenantId,
    id: applicationNo,
    moduleCode: businessService,
    config: {
      enabled: true,
      cacheTime: 0
    }
  });
  var menuRef = React.useRef();
  var userRoles = user === null || user === void 0 ? void 0 : (_user$info = user.info) === null || _user$info === void 0 ? void 0 : (_user$info$roles = _user$info.roles) === null || _user$info$roles === void 0 ? void 0 : _user$info$roles.map(function (e) {
    return e.code;
  });
  var isSingleButton = false;
  var isMenuBotton = false;
  var actions = (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data = workflowDetails.data) === null || _workflowDetails$data === void 0 ? void 0 : (_workflowDetails$data2 = _workflowDetails$data.actionState) === null || _workflowDetails$data2 === void 0 ? void 0 : (_workflowDetails$data3 = _workflowDetails$data2.nextActions) === null || _workflowDetails$data3 === void 0 ? void 0 : _workflowDetails$data3.filter(function (e) {
    return userRoles.some(function (role) {
      var _e$roles;
      return (_e$roles = e.roles) === null || _e$roles === void 0 ? void 0 : _e$roles.includes(role);
    }) || !e.roles;
  })) || (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data4 = workflowDetails.data) === null || _workflowDetails$data4 === void 0 ? void 0 : (_workflowDetails$data5 = _workflowDetails$data4.nextActions) === null || _workflowDetails$data5 === void 0 ? void 0 : _workflowDetails$data5.filter(function (e) {
    return userRoles.some(function (role) {
      var _e$roles2;
      return (_e$roles2 = e.roles) === null || _e$roles2 === void 0 ? void 0 : _e$roles2.includes(role);
    }) || !e.roles;
  }));
  var closeMenu = function closeMenu() {
    setDisplayMenu(false);
  };
  var closeToast = function closeToast() {
    setTimeout(function () {
      setShowToast(null);
    }, 5000);
  };
  setTimeout(function () {
    setShowToast(null);
  }, 20000);
  Digit.Hooks.useClickOutside(menuRef, closeMenu, displayMenu);
  if ((actions === null || actions === void 0 ? void 0 : actions.length) > 0) {
    isMenuBotton = true;
    isSingleButton = false;
  }
  var closeModal = function closeModal() {
    setSelectedAction(null);
    setShowModal(false);
    setShowToast({
      warning: true,
      label: "WF_ACTION_CANCELLED"
    });
    closeToast();
  };
  var onActionSelect = function onActionSelect(action) {
    var _Digit, _Digit$Customizations, _Digit$Customizations2, _Digit2, _Digit2$Customization, _Digit2$Customization2, _Digit3, _Digit3$Customization, _Digit3$Customization2, _Digit4, _Digit4$Customization, _Digit4$Customization2;
    var bsContract = (_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Customizations = _Digit.Customizations) === null || _Digit$Customizations === void 0 ? void 0 : (_Digit$Customizations2 = _Digit$Customizations["commonUiConfig"]) === null || _Digit$Customizations2 === void 0 ? void 0 : _Digit$Customizations2.getBusinessService("contract");
    var bsEstimate = (_Digit2 = Digit) === null || _Digit2 === void 0 ? void 0 : (_Digit2$Customization = _Digit2.Customizations) === null || _Digit2$Customization === void 0 ? void 0 : (_Digit2$Customization2 = _Digit2$Customization["commonUiConfig"]) === null || _Digit2$Customization2 === void 0 ? void 0 : _Digit2$Customization2.getBusinessService("estimate");
    var bsAttendance = (_Digit3 = Digit) === null || _Digit3 === void 0 ? void 0 : (_Digit3$Customization = _Digit3.Customizations) === null || _Digit3$Customization === void 0 ? void 0 : (_Digit3$Customization2 = _Digit3$Customization["commonUiConfig"]) === null || _Digit3$Customization2 === void 0 ? void 0 : _Digit3$Customization2.getBusinessService("muster roll");
    var bsPurchaseBill = (_Digit4 = Digit) === null || _Digit4 === void 0 ? void 0 : (_Digit4$Customization = _Digit4.Customizations) === null || _Digit4$Customization === void 0 ? void 0 : (_Digit4$Customization2 = _Digit4$Customization["commonUiConfig"]) === null || _Digit4$Customization2 === void 0 ? void 0 : _Digit4$Customization2.getBusinessService("works.purchase");
    setDisplayMenu(false);
    setSelectedAction(action);
    if (bsEstimate === businessService && (action === null || action === void 0 ? void 0 : action.action) === "RE-SUBMIT") {
      var _window;
      history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/estimate/create-estimate?tenantId=" + tenantId + "&projectNumber=" + editApplicationNumber + "&estimateNumber=" + (applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.estimateNumber) + "&isEdit=true");
      return;
    }
    if (bsContract === businessService && (action === null || action === void 0 ? void 0 : action.action) === "EDIT") {
      var _window2;
      history.push("/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/employee/contracts/create-contract?tenantId=" + tenantId + "&workOrderNumber=" + applicationNo);
      return;
    }
    if (bsAttendance === businessService && (action === null || action === void 0 ? void 0 : action.action) === "RE-SUBMIT") {
      editCallback();
      return;
    }
    if (bsPurchaseBill === businessService && (action === null || action === void 0 ? void 0 : action.action) === "RE-SUBMIT") {
      var _window3;
      history.push("/" + ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) + "/employee/expenditure/create-purchase-bill?tenantId=" + tenantId + "&billNumber=" + editApplicationNumber);
      return;
    }
    setShowModal(true);
  };
  var submitAction = function submitAction(data, selectAction) {
    setShowModal(false);
    setIsEnableLoader(true);
    var mutateObj = _extends({}, data);
    mutate(mutateObj, {
      onError: function onError(error, variables) {
        var _callback$onError;
        setIsEnableLoader(false);
        setShowToast({
          error: true,
          label: Digit.Utils.locale.getTransformedLocale("WF_UPDATE_ERROR_" + businessService + "_" + selectAction.action),
          isDleteBtn: true
        });
        callback === null || callback === void 0 ? void 0 : (_callback$onError = callback.onError) === null || _callback$onError === void 0 ? void 0 : _callback$onError.call(callback);
      },
      onSuccess: function onSuccess(data, variables) {
        var _callback$onSuccess;
        setIsEnableLoader(false);
        setShowToast({
          label: Digit.Utils.locale.getTransformedLocale("WF_UPDATE_SUCCESS_" + businessService + "_" + selectAction.action)
        });
        callback === null || callback === void 0 ? void 0 : (_callback$onSuccess = callback.onSuccess) === null || _callback$onSuccess === void 0 ? void 0 : _callback$onSuccess.call(callback);
        workflowDetails.revalidate();
      }
    });
  };
  if (isEnableLoader) {
    return /*#__PURE__*/React__default.createElement(Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && isMenuBotton && !isSingleButton && /*#__PURE__*/React__default.createElement(ActionBar, {
    style: _extends({}, ActionBarStyle)
  }, displayMenu && (workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data6 = workflowDetails.data) !== null && _workflowDetails$data6 !== void 0 && (_workflowDetails$data7 = _workflowDetails$data6.actionState) !== null && _workflowDetails$data7 !== void 0 && _workflowDetails$data7.nextActions || workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data8 = workflowDetails.data) !== null && _workflowDetails$data8 !== void 0 && _workflowDetails$data8.nextActions) ? /*#__PURE__*/React__default.createElement(Menu$1, {
    localeKeyPrefix: forcedActionPrefix || Digit.Utils.locale.getTransformedLocale("WF_" + (businessService === null || businessService === void 0 ? void 0 : businessService.toUpperCase()) + "_ACTION"),
    options: actions,
    optionKey: "action",
    t: t,
    onSelect: onActionSelect,
    style: MenuStyle
  }) : null, /*#__PURE__*/React__default.createElement(SubmitBar, {
    ref: menuRef,
    label: t("WORKS_ACTIONS"),
    onSubmit: function onSubmit() {
      return setDisplayMenu(!displayMenu);
    }
  })), !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && !isMenuBotton && isSingleButton && /*#__PURE__*/React__default.createElement(ActionBar, {
    style: _extends({}, ActionBarStyle)
  }, /*#__PURE__*/React__default.createElement("button", {
    style: {
      color: "#FFFFFF",
      fontSize: "18px"
    },
    className: "submit-bar",
    name: actions === null || actions === void 0 ? void 0 : (_actions$ = actions[0]) === null || _actions$ === void 0 ? void 0 : _actions$.action,
    value: actions === null || actions === void 0 ? void 0 : (_actions$2 = actions[0]) === null || _actions$2 === void 0 ? void 0 : _actions$2.action,
    onClick: function onClick(e) {
      onActionSelect((actions === null || actions === void 0 ? void 0 : actions[0]) || {});
    }
  }, t(Digit.Utils.locale.getTransformedLocale((forcedActionPrefix || "WF_" + (businessService === null || businessService === void 0 ? void 0 : businessService.toUpperCase()) + "_ACTION") + "_" + (actions === null || actions === void 0 ? void 0 : (_actions$3 = actions[0]) === null || _actions$3 === void 0 ? void 0 : _actions$3.action))))), showModal && /*#__PURE__*/React__default.createElement(ActionModal, {
    t: t,
    action: selectedAction,
    tenantId: tenantId,
    id: applicationNo,
    closeModal: closeModal,
    submitAction: submitAction,
    businessService: businessService,
    applicationDetails: applicationDetails,
    moduleCode: moduleCode
  }), showToast && /*#__PURE__*/React__default.createElement(Toast$1, {
    error: showToast === null || showToast === void 0 ? void 0 : showToast.error,
    warning: t(showToast === null || showToast === void 0 ? void 0 : showToast.warning),
    label: t(showToast === null || showToast === void 0 ? void 0 : showToast.label),
    onClose: function onClose() {
      setShowToast(null);
    },
    isDleteBtn: showToast === null || showToast === void 0 ? void 0 : showToast.isDleteBtn
  }));
};

var _excluded$g = ["t", "roundOff"];
var Amount = function Amount(_ref) {
  var _Digit, _Digit$Utils, _Digit$Utils$dss;
  var t = _ref.t,
    _ref$roundOff = _ref.roundOff,
    roundOff = _ref$roundOff === void 0 ? true : _ref$roundOff,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$g);
  var value = roundOff ? Math.round(props === null || props === void 0 ? void 0 : props.value) : props === null || props === void 0 ? void 0 : props.value;
  return /*#__PURE__*/React__default.createElement("p", {
    style: props === null || props === void 0 ? void 0 : props.customStyle
  }, value ? "" + ((_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$Utils = _Digit.Utils) === null || _Digit$Utils === void 0 ? void 0 : (_Digit$Utils$dss = _Digit$Utils.dss) === null || _Digit$Utils$dss === void 0 ? void 0 : _Digit$Utils$dss.formatterWithoutRound(value, "number")) : t("ES_COMMON_NA"));
};

var Heading$2 = function Heading(props) {
  return /*#__PURE__*/React__default.createElement("h1", {
    style: {
      marginLeft: "22px"
    },
    className: "heading-m BPAheading-m"
  }, props.label);
};
var Close$3 = function Close() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z",
    fill: "#0B0C0C"
  }));
};
var CloseBtn$2 = function CloseBtn(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "icon-bg-secondary",
    onClick: props.onClick,
    style: {
      backgroundColor: "#FFFFFF"
    }
  }, /*#__PURE__*/React__default.createElement(Close$3, null));
};
var CitizenConsentForm = function CitizenConsentForm(_ref) {
  var _labels$filter, _labels$filter$;
  var t = _ref.t,
    styles = _ref.styles,
    _ref$mdmsConfig = _ref.mdmsConfig,
    mdmsConfig = _ref$mdmsConfig === void 0 ? "" : _ref$mdmsConfig,
    setMdmsConfig = _ref.setMdmsConfig,
    labels = _ref.labels;
  var _useState = React.useState(false),
    showModal = _useState[0],
    setShowModal = _useState[1];
  React.useEffect(function () {
    if (mdmsConfig && !showModal) setShowModal(true);
  }, [mdmsConfig]);
  var closeModal = function closeModal() {
    setShowModal(false);
    setMdmsConfig("");
  };
  var url = labels === null || labels === void 0 ? void 0 : (_labels$filter = labels.filter(function (data) {
    return data.linkId == mdmsConfig;
  })) === null || _labels$filter === void 0 ? void 0 : (_labels$filter$ = _labels$filter[0]) === null || _labels$filter$ === void 0 ? void 0 : _labels$filter$[Digit.StoreData.getCurrentLanguage()];
  return /*#__PURE__*/React__default.createElement("div", {
    style: styles ? styles : {}
  }, showModal ? /*#__PURE__*/React__default.createElement(Modal, {
    headerBarMain: /*#__PURE__*/React__default.createElement(Heading$2, {
      label: mdmsConfig && url ? t("CCF_" + (mdmsConfig === null || mdmsConfig === void 0 ? void 0 : mdmsConfig.toUpperCase()) + "_HEADER") : ""
    }),
    headerBarEnd: /*#__PURE__*/React__default.createElement(CloseBtn$2, {
      onClick: closeModal
    }),
    actionCancelOnSubmit: closeModal,
    formId: "modal-action",
    popupStyles: {
      width: "750px",
      overflow: "auto"
    },
    style: {
      minHeight: "45px",
      height: "auto",
      width: "160px"
    },
    hideSubmit: true,
    headerBarMainStyle: {
      margin: "0px",
      height: "35px"
    }
  }, url ? /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "auto",
      height: "91vh",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React__default.createElement("iframe", {
    scrollbar: "none",
    border: "none",
    width: "100%",
    height: "100%",
    overflow: "auto",
    src: "" + url
  })) : /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%",
      height: "100px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }, t("COMMON_URL_NOT_FOUND"))) : null);
};

exports.ActionBar = ActionBar;
exports.ActionLinks = ActionLinks;
exports.AddFileFilled = AddFileFilled;
exports.AddFilled = AddFilled;
exports.AddIcon = AddIcon;
exports.AddNewIcon = AddNewIcon;
exports.AddressBookIcon = AddressBookIcon;
exports.Amount = Amount;
exports.AnnouncementIcon = AnnouncementIcon;
exports.AppContainer = AppContainer;
exports.ApplyFilterBar = ApplyFilterBar;
exports.ArrowDirection = ArrowDirection;
exports.ArrowDown = ArrowDown;
exports.ArrowForward = ArrowForward;
exports.ArrowLeft = ArrowLeft;
exports.ArrowLeftWhite = ArrowLeftWhite;
exports.ArrowRightInbox = ArrowRightInbox;
exports.ArrowVectorDown = ArrowVectorDown;
exports.AttendanceIcon = AttendanceIcon;
exports.BPAHomeIcon = BPAHomeIcon;
exports.BPAIcon = BPAIcon;
exports.BackButton = BackButton$1;
exports.Banner = Banner;
exports.BillsIcon = BillsIcon;
exports.BioMetricIcon = BioMetricIcon;
exports.BirthIcon = BirthIcon;
exports.Body = Body;
exports.BreadCrumb = Breadcrumb;
exports.BreakLine = BreakLine;
exports.Button = Button;
exports.ButtonSelector = ButtonSelector;
exports.Calender = Calender;
exports.CameraIcon = CameraIcon;
exports.Card = Card;
exports.CardBasedOptions = CardBasedOptions;
exports.CardCaption = CardCaption;
exports.CardHeader = CardHeader;
exports.CardLabel = CardLabel;
exports.CardLabelDesc = CardLabelDesc;
exports.CardLabelError = CardLabelError;
exports.CardSectionHeader = CardSectionHeader;
exports.CardSectionSubText = CardSectionSubText;
exports.CardSubHeader = CardSubHeader;
exports.CardText = CardText;
exports.CardTextButton = CardText$1;
exports.CaseIcon = CaseIcon;
exports.CheckBox = CheckBox;
exports.CheckPoint = CheckPoint;
exports.CheckSvg = CheckSvg;
exports.CitizenConsentForm = CitizenConsentForm;
exports.CitizenHomeCard = CitizenHomeCard;
exports.CitizenInfoLabel = CitizenInfoLabel;
exports.CitizenTruck = CitizenTruck;
exports.CityMohalla = CityMohalla;
exports.Clock = Clock;
exports.Close = Close;
exports.CloseSvg = CloseSvg;
exports.CollapseAndExpandGroups = CollapseAndExpandGroups;
exports.CollectionIcon = CollectionIcon;
exports.CollectionsBookmarIcons = CollectionsBookmarIcons;
exports.ComplaintIcon = ComplaintIcon;
exports.ConnectingCheckPoints = ConnectingCheckPoints;
exports.ContractIcon = ContractIcon;
exports.CreateEstimateIcon = CreateEstimateIcon;
exports.CreateLoiIcon = CreateLoiIcon;
exports.CustomButton = CustomButton;
exports.CustomDropdown = CustomDropdown;
exports.DashboardBox = DashboardBox;
exports.DashboardIcon = DashboardIcon;
exports.DatePicker = DatePicker;
exports.DateRange = DateRange;
exports.DateRangeNew = DateRangeNew;
exports.DateWrap = DateWrap;
exports.DeathIcon = DeathIcon;
exports.DeleteIcon = DeleteIcon;
exports.Details = Details;
exports.DetailsCard = DetailsCard;
exports.DisplayPhotos = DisplayPhotos;
exports.DocumentIcon = DocumentIcon;
exports.DocumentIconSolid = DocumentIconSolid;
exports.DocumentSVG = DocumentSVG;
exports.DownloadBtnCommon = DownloadBtnCommon;
exports.DownloadIcon = DownloadIcon;
exports.DownloadImgIcon = DownloadImgIcon;
exports.DownloadPrefixIcon = DownloadPrefixIcon;
exports.DownwardArrow = DownwardArrow;
exports.DropIcon = DropIcon;
exports.Dropdown = Dropdown;
exports.DustbinIcon = DustbinIcon;
exports.EDCRIcon = EDCRIcon;
exports.EditIcon = EditIcon;
exports.EditPencilIcon = EditPencilIcon;
exports.Ellipsis = Ellipsis;
exports.EllipsisMenu = EllipsisMenu;
exports.EmailIcon = EmailIcon;
exports.EmployeeAppContainer = EmployeeAppContainer;
exports.EmployeeModuleCard = EmployeeModuleCard;
exports.ErrorIcon = ErrorIcon;
exports.EstimateIcon = EstimateIcon;
exports.EventCalendar = EventCalendar;
exports.EventCalendarView = EventCalendarView;
exports.EventsIconSolid = EventsIconSolid;
exports.ExpenditureIcon = ExpenditureIcon;
exports.ExternalLinkIcon = ExternalLinkIcon;
exports.FSMIcon = FSMIcon;
exports.FilterAction = FilterAction;
exports.FilterForm = FilterForm;
exports.FilterFormField = FilterFormField;
exports.FilterIcon = FilterIcon;
exports.FilterSvg = FilterSvg;
exports.FinanceChartIcon = FinanceChartIcon;
exports.FirenocIcon = FirenocIcon;
exports.FormComposer = FormComposer;
exports.FormComposerV2 = FormComposer$1;
exports.FormStep = FormStep;
exports.GalleryIcon = GalleryIcon;
exports.GenericFileIcon = GenericFileIcon;
exports.GetApp = GetApp;
exports.GotoInboxIcon = GotoInboxIcon;
exports.GreyOutText = GreyOutText;
exports.HRIcon = HRIcon;
exports.Hamburger = Hamburger;
exports.Header = Header;
exports.HeaderBar = HeaderBar;
exports.HelpIcon = HelpIcon;
exports.HelpLineIcon = HelpLineIcon;
exports.HelperIcon = HelperIcon;
exports.HistoryIcon = HistoryIcon;
exports.HomeIcon = HomeIcon;
exports.HomeLink = HomeLink;
exports.HorizontalNav = HorizontalNav;
exports.ImageIcon = ImageIcon;
exports.ImageUploadHandler = ImageUploadHandler;
exports.ImageViewer = ImageViewer;
exports.InboxComposer = InboxComposer;
exports.InboxIcon = InboxIcon;
exports.InboxLinks = InboxLinks;
exports.InboxSearchComposer = InboxSearchComposer;
exports.InboxSearchLinks = InboxSearchLinks;
exports.InfoBanner = InfoBanner;
exports.InfoBannerIcon = InfoBannerIcon;
exports.InputCard = InputCard;
exports.InputTextAmount = InputTextAmount;
exports.KeyNote = KeyNote;
exports.Label = Label;
exports.LabelFieldPair = LabelFieldPair;
exports.LanguageIcon = LanguageIcon;
exports.LastRow = LastRow;
exports.LinkButton = LinkButton;
exports.LinkLabel = LinkLabel;
exports.Loader = Loader;
exports.Localities = Localities;
exports.LocateIcon = LocateIcon;
exports.LocationIcon = LocationIcon;
exports.LocationSearch = LocationSearch;
exports.LocationSearchCard = LocationSearchCard;
exports.LogoutIcon = LogoutIcon;
exports.MCollectIcon = MCollectIcon;
exports.MapMarker = MapMarker;
exports.MediaRow = MediaRow;
exports.Menu = Menu$1;
exports.MobileNumber = MobileNumber;
exports.MobileSearchComponent = MobileSearchComponent;
exports.MobileSearchResults = MobileSearchResults;
exports.Modal = Modal;
exports.ModuleCardFullWidth = ModuleCardFullWidth;
exports.MuktaHomeIcon = MuktaHomeIcon;
exports.MultiLink = MultiLink;
exports.MultiSelectDropdown = MultiSelectDropdown;
exports.MultiUploadWrapper = MultiUploadWrapper;
exports.NavBar = NavBar;
exports.NoResultsFound = NoResultsFound;
exports.NoResultsFoundIcon = NoResultsFoundIcon;
exports.NotificationBell = NotificationBell;
exports.OBPSIcon = OBPSIcon;
exports.OBPSIconSolidBg = OBPSIconSolidBg;
exports.OTPInput = OTPInput;
exports.OnGroundEventCard = OnGroundEventCard;
exports.OpenLinkContainer = OpenLinkContainer;
exports.OrganisationIcon = OrganisationIcon;
exports.PDFSvg = PDFSvg;
exports.PGRIcon = PGRIcon;
exports.PMBIcon = PMBIcon;
exports.PMBIconSolid = PMBIconSolid;
exports.PTIcon = PTIcon;
exports.PageBasedInput = PageBasedInput;
exports.Paragraph = Paragraph;
exports.PaymentIcon = PaymentIcon;
exports.Person = Person;
exports.PersonIcon = PersonIcon;
exports.Phone = Phone;
exports.PitDimension = PitDimension;
exports.Poll = Poll;
exports.PopUp = PopUp;
exports.PopupHeadingLabel = PopupHeadingLabel;
exports.PrevIcon = PrevIcon;
exports.PrintBtnCommon = PrintBtnCommon;
exports.PrintIcon = PrintIcon;
exports.PrivacyMaskIcon = PrivacyMaskIcon;
exports.PrivateRoute = PrivateRoute;
exports.ProjectIcon = ProjectIcon;
exports.PropertyHouse = PropertyHouse;
exports.RadioButtons = RadioButtons;
exports.RadioOrSelect = RadioOrSelect;
exports.Rating = Rating;
exports.RatingCard = RatingCard;
exports.ReceiptIcon = ReceiptIcon;
exports.RefreshIcon = RefreshIcon;
exports.RefreshSVG = RefreshSVG;
exports.RemoveIcon = RemoveIcon;
exports.RemoveableTag = RemoveableTag;
exports.RenderFormFields = RenderFormFields;
exports.ResponseComposer = ResponseComposer;
exports.ResultsTable = ResultsTable;
exports.RoundedLabel = RoundedLabel;
exports.Row = Row;
exports.RupeeIcon = RupeeIcon;
exports.RupeeSymbol = RupeeSymbol;
exports.SVG = SVG;
exports.SearchAction = SearchAction;
exports.SearchField = SearchField;
exports.SearchForm = SearchForm;
exports.SearchIcon = SearchIcon;
exports.SearchIconSvg = SearchIconSvg;
exports.SearchOnRadioButtons = SearchOnRadioButtons;
exports.SearchableDropdown = Dropdown$1;
exports.SectionalDropdown = SectionalDropdown;
exports.ServiceCenterIcon = ServiceCenterIcon;
exports.ShareIcon = ShareIcon;
exports.ShippingTruck = ShippingTruck;
exports.SortAction = SortAction;
exports.SortDown = SortDown;
exports.SortSvg = SortSvg;
exports.SortUp = SortUp;
exports.StandaloneSearchBar = StandaloneSearchBar;
exports.StatusTable = StatusTable;
exports.SubmitBar = SubmitBar;
exports.SubtractIcon = SubtractIcon;
exports.SurveyIconSolid = SurveyIconSolid;
exports.TLIcon = TLIcon;
exports.Table = Table;
exports.TelePhone = TelePhone;
exports.TextArea = TextArea;
exports.TextInput = TextInput;
exports.TextInputCard = TextInputCard;
exports.TickMark = TickMark;
exports.TimerIcon = TimerIcon;
exports.Toast = Toast$1;
exports.ToggleSwitch = ToggleSwitch;
exports.TopBar = TopBar;
exports.TypeSelectCard = TypeSelectCard;
exports.ULBHomeCard = ULBHomeCard;
exports.UnMaskComponent = UnMaskComponent;
exports.UploadFile = UploadFile;
exports.UploadFileComposer = UploadFileComposer;
exports.UploadImages = UploadImages;
exports.UploadPitPhoto = UploadPitPhoto;
exports.UpwardArrow = UpwardArrow;
exports.ValidityTimeIcon = ValidityTimeIcon;
exports.ViewDetailsCard = ViewDetailsCard;
exports.ViewImages = ViewImages;
exports.ViewReportIcon = ViewReportIcon;
exports.ViewsIcon = ViewsIcon;
exports.WSICon = WSICon;
exports.WageseekerIcon = WageseekerIcon;
exports.WarningIcon = WarningIcon;
exports.WeekPicker = WeekPicker;
exports.WhatsNewCard = WhatsNewCard;
exports.WhatsappIcon = WhatsappIcon;
exports.WhatsappIconGreen = WhatsappIconGreen;
exports.WorkflowActions = WorkflowActions;
exports.WorkflowModal = WorkflowModal;
exports.WorkflowTimeline = WorkflowTimeline;
exports.WorksMgmtIcon = WorksMgmtIcon;
//# sourceMappingURL=index.js.map
