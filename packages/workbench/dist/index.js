function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var digitUiReactComponents = require('@egovernments/digit-ui-react-components');
var React = require('react');
var React__default = _interopDefault(React);
var reactRouterDom = require('react-router-dom');
var reactI18next = require('react-i18next');
var Form = _interopDefault(require('@rjsf/core'));
var validator = _interopDefault(require('@rjsf/validator-ajv8'));
var utils$1 = require('@rjsf/utils');
var Select = _interopDefault(require('react-select'));

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

var Config = {
  label: "WBH_SEARCH_LOCALISATION",
  type: "search",
  actionLabel: "WBH_ADD_LOCALISATION",
  actionRole: "EMPLOYEE",
  actionLink: "workbench/add-localisation",
  apiDetails: {
    serviceName: "/wms/individual/_search",
    requestParam: {},
    requestBody: {
      inbox: {
        moduleSearchCriteria: {}
      }
    },
    minParametersForSearchForm: 1,
    masterName: "commonUiConfig",
    moduleName: "SearchWMSWageSeekerConfig",
    tableFormJsonPath: "requestBody.inbox",
    filterFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
    searchFormJsonPath: "requestBody.inbox.moduleSearchCriteria"
  },
  sections: {
    search: {
      uiConfig: {
        headerStyle: null,
        formClassName: "custom-both-clear-search",
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        minReqFields: 1,
        defaultValues: {
          ward: "",
          individualId: "",
          name: "",
          socialCategoryValue: "",
          mobileNumber: "",
          createdFrom: "",
          createdTo: ""
        },
        fields: [{
          label: "COMMON_WARD",
          type: "locationdropdown",
          isMandatory: false,
          disable: false,
          populators: {
            optionsCustomStyle: {
              top: "2.3rem"
            },
            name: "ward",
            type: "ward",
            optionsKey: "i18nKey",
            defaultText: "COMMON_SELECT_WARD",
            selectedText: "COMMON_SELECTED",
            allowMultiSelect: false
          }
        }, {
          label: "MASTERS_WAGESEEKER_NAME",
          type: "text",
          isMandatory: false,
          disable: false,
          populators: {
            name: "name",
            validation: {
              pattern: {},
              maxlength: 140
            }
          }
        }, {
          label: "MASTERS_WAGESEEKER_ID",
          type: "text",
          isMandatory: false,
          disable: false,
          populators: {
            name: "individualId",
            error: "PROJECT_PATTERN_ERR_MSG",
            validation: {
              minlength: 2
            }
          }
        }, {
          label: "CORE_COMMON_PROFILE_MOBILE_NUMBER",
          type: "mobileNumber",
          isMandatory: false,
          disable: false,
          populators: {
            name: "mobileNumber",
            error: "PROJECT_PATTERN_ERR_MSG",
            validation: {
              pattern: {},
              minlength: 2
            }
          }
        }, {
          label: "MASTERS_SOCIAL_CATEGORY",
          type: "dropdown",
          isMandatory: false,
          disable: false,
          populators: {
            name: "socialCategoryValue",
            optionsKey: "code",
            optionsCustomStyle: {
              top: "2.3rem"
            },
            mdmsConfig: {
              masterName: "SocialCategory",
              moduleName: "common-masters",
              localePrefix: "MASTERS"
            }
          }
        }, {
          label: "CREATED_FROM_DATE",
          type: "date",
          isMandatory: false,
          disable: false,
          key: "createdFrom",
          preProcess: {
            updateDependent: ["populators.max"]
          },
          populators: {
            name: "createdFrom",
            max: "currentDate"
          }
        }, {
          label: "CREATED_TO_DATE",
          type: "date",
          isMandatory: false,
          disable: false,
          key: "createdTo",
          preProcess: {
            updateDependent: ["populators.max"]
          },
          populators: {
            name: "createdTo",
            error: "DATE_VALIDATION_MSG",
            max: "currentDate"
          },
          additionalValidation: {
            type: "date",
            keys: {
              start: "createdFrom",
              end: "createdTo"
            }
          }
        }]
      },
      label: "",
      children: {},
      show: true
    },
    searchResult: {
      label: "",
      uiConfig: {
        columns: [{
          label: "MASTERS_WAGESEEKER_ID",
          jsonPath: "businessObject.individualId",
          additionalCustomization: true
        }, {
          label: "MASTERS_WAGESEEKER_NAME",
          jsonPath: "businessObject.name.givenName"
        }, {
          label: "MASTERS_FATHER_NAME",
          jsonPath: "businessObject.fatherName"
        }, {
          label: "MASTERS_SOCIAL_CATEGORY",
          jsonPath: "businessObject.additionalFields.fields[0].value"
        }, {
          label: "CORE_COMMON_PROFILE_CITY",
          jsonPath: "businessObject.address[0].tenantId",
          additionalCustomization: true
        }, {
          label: "MASTERS_WARD",
          jsonPath: "businessObject.address[0].ward.code",
          additionalCustomization: true
        }, {
          label: "MASTERS_LOCALITY",
          jsonPath: "businessObject.address[0].locality.code",
          additionalCustomization: true
        }],
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "items"
      },
      children: {},
      show: true
    }
  },
  additionalSections: {}
};

var MDMSSearch = function MDMSSearch() {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var _useParams = reactRouterDom.useParams();
  var _useState = React.useState(null),
    pageConfig = _useState[0],
    setPageConfig = _useState[1];
  var tenant = Digit.ULBService.getStateId();
  var data = Config || {};
  var configs = data || {};
  var updatedConfig = React.useMemo(function () {
    return Digit.Utils.preProcessMDMSConfigInboxSearch(t, pageConfig, "sections.search.uiConfig.fields", {});
  }, [data, pageConfig]);
  React.useEffect(function () {
    setPageConfig(_.cloneDeep(configs));
  }, [data]);
  if ( !pageConfig) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "jk-header-btn-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, {
    styles: {
      fontSize: "32px"
    }
  }, t(updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.label)), Digit.Utils.didEmployeeHasRole(updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionRole) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Button, {
    label: t(updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionLabel),
    variation: "secondary",
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.AddFilled, {
      style: {
        height: "20px",
        width: "20px"
      }
    }),
    onButtonClick: function onButtonClick() {
      var _window;
      history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/" + (updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionLink));
    },
    type: "button"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-search-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.InboxSearchComposer, {
    configs: updatedConfig
  })));
};

var Config$1 = {
  label: "WBH_SEARCH_MDMS",
  type: "search",
  actionLabel: "WBH_ADD_MDMS",
  actionRole: "MDMS_ADMIN",
  actionLink: "workbench/mdms-add-v2",
  apiDetails: {
    serviceName: "/mdms-v2/v2/_search",
    requestParam: {},
    requestBody: {
      MdmsCriteria: {}
    },
    minParametersForSearchForm: 0,
    masterName: "commonUiConfig",
    moduleName: "SearchMDMSConfig",
    tableFormJsonPath: "requestBody.MdmsCriteria.custom",
    filterFormJsonPath: "requestBody.MdmsCriteria.custom",
    searchFormJsonPath: "requestBody.MdmsCriteria.custom"
  },
  sections: {
    search: {
      uiConfig: {
        headerStyle: null,
        formClassName: "",
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        minReqFields: 0,
        defaultValues: {
          value: "",
          field: "",
          createdFrom: "",
          createdTo: ""
        },
        fields: [{
          label: "WBH_FIELD",
          type: "dropdown",
          isMandatory: false,
          disable: false,
          populators: {
            name: "field",
            optionsKey: "i18nKey",
            optionsCustomStyle: {
              top: "2.3rem"
            },
            options: [{
              code: "code",
              name: "code"
            }, {
              code: "name",
              name: "name"
            }, {
              code: "description",
              name: "description"
            }]
          }
        }, {
          label: "WBH_FIELD_VALUE",
          type: "text",
          isMandatory: false,
          disable: false,
          populators: {
            name: "value",
            validation: {
              pattern: {},
              maxlength: 140
            }
          }
        }, {
          label: "CREATED_FROM_DATE",
          type: "date",
          isMandatory: false,
          disable: false,
          key: "createdFrom",
          preProcess: {
            updateDependent: ["populators.max"]
          },
          populators: {
            name: "createdFrom",
            max: "currentDate"
          }
        }, {
          label: "CREATED_TO_DATE",
          type: "date",
          isMandatory: false,
          disable: false,
          key: "createdTo",
          preProcess: {
            updateDependent: ["populators.max"]
          },
          populators: {
            name: "createdTo",
            error: "DATE_VALIDATION_MSG",
            max: "currentDate"
          },
          additionalValidation: {
            type: "date",
            keys: {
              start: "createdFrom",
              end: "createdTo"
            }
          }
        }]
      },
      label: "",
      children: {},
      show: true
    },
    searchResult: {
      label: "",
      uiConfig: {
        columns: [],
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "mdms"
      },
      children: {},
      show: true
    }
  },
  additionalSections: {}
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lodash = createCommonjsModule(function (module, exports) {
  (function () {
    var undefined$1;
    var VERSION = '4.17.21';
    var LARGE_ARRAY_SIZE = 200;
    var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function',
      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';
    var HASH_UNDEFINED = '__lodash_hash_undefined__';
    var MAX_MEMOIZE_SIZE = 500;
    var PLACEHOLDER = '__lodash_placeholder__';
    var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;
    var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;
    var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;
    var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';
    var HOT_COUNT = 800,
      HOT_SPAN = 16;
    var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;
    var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;
    var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
    var wrapFlags = [['ary', WRAP_ARY_FLAG], ['bind', WRAP_BIND_FLAG], ['bindKey', WRAP_BIND_KEY_FLAG], ['curry', WRAP_CURRY_FLAG], ['curryRight', WRAP_CURRY_RIGHT_FLAG], ['flip', WRAP_FLIP_FLAG], ['partial', WRAP_PARTIAL_FLAG], ['partialRight', WRAP_PARTIAL_RIGHT_FLAG], ['rearg', WRAP_REARG_FLAG]];
    var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';
    var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';
    var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);
    var reTrimStart = /^\s+/;
    var reWhitespace = /\s/;
    var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
    var reEscapeChar = /\\(\\)?/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    var rsAstralRange = "\\ud800-\\udfff",
      rsComboMarksRange = "\\u0300-\\u036f",
      reComboHalfMarksRange = "\\ufe20-\\ufe2f",
      rsComboSymbolsRange = "\\u20d0-\\u20ff",
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = "\\u2700-\\u27bf",
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = "\\u2000-\\u206f",
      rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = "\\ufe0e\\ufe0f",
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = "\\ud83c[\\udffb-\\udfff]",
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
      rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = "\\u200d";
    var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
    var reApos = RegExp(rsApos, 'g');
    var reComboMark = RegExp(rsCombo, 'g');
    var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
    var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')', rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower, rsUpper + '+' + rsOptContrUpper, rsOrdUpper, rsOrdLower, rsDigits, rsEmoji].join('|'), 'g');
    var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    var contextProps = ['Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object', 'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'];
    var templateCounter = -1;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    var deburredLetters = {
      '\xc0': 'A',
      '\xc1': 'A',
      '\xc2': 'A',
      '\xc3': 'A',
      '\xc4': 'A',
      '\xc5': 'A',
      '\xe0': 'a',
      '\xe1': 'a',
      '\xe2': 'a',
      '\xe3': 'a',
      '\xe4': 'a',
      '\xe5': 'a',
      '\xc7': 'C',
      '\xe7': 'c',
      '\xd0': 'D',
      '\xf0': 'd',
      '\xc8': 'E',
      '\xc9': 'E',
      '\xca': 'E',
      '\xcb': 'E',
      '\xe8': 'e',
      '\xe9': 'e',
      '\xea': 'e',
      '\xeb': 'e',
      '\xcc': 'I',
      '\xcd': 'I',
      '\xce': 'I',
      '\xcf': 'I',
      '\xec': 'i',
      '\xed': 'i',
      '\xee': 'i',
      '\xef': 'i',
      '\xd1': 'N',
      '\xf1': 'n',
      '\xd2': 'O',
      '\xd3': 'O',
      '\xd4': 'O',
      '\xd5': 'O',
      '\xd6': 'O',
      '\xd8': 'O',
      '\xf2': 'o',
      '\xf3': 'o',
      '\xf4': 'o',
      '\xf5': 'o',
      '\xf6': 'o',
      '\xf8': 'o',
      '\xd9': 'U',
      '\xda': 'U',
      '\xdb': 'U',
      '\xdc': 'U',
      '\xf9': 'u',
      '\xfa': 'u',
      '\xfb': 'u',
      '\xfc': 'u',
      '\xdd': 'Y',
      '\xfd': 'y',
      '\xff': 'y',
      '\xc6': 'Ae',
      '\xe6': 'ae',
      '\xde': 'Th',
      '\xfe': 'th',
      '\xdf': 'ss',
      "\u0100": 'A',
      "\u0102": 'A',
      "\u0104": 'A',
      "\u0101": 'a',
      "\u0103": 'a',
      "\u0105": 'a',
      "\u0106": 'C',
      "\u0108": 'C',
      "\u010A": 'C',
      "\u010C": 'C',
      "\u0107": 'c',
      "\u0109": 'c',
      "\u010B": 'c',
      "\u010D": 'c',
      "\u010E": 'D',
      "\u0110": 'D',
      "\u010F": 'd',
      "\u0111": 'd',
      "\u0112": 'E',
      "\u0114": 'E',
      "\u0116": 'E',
      "\u0118": 'E',
      "\u011A": 'E',
      "\u0113": 'e',
      "\u0115": 'e',
      "\u0117": 'e',
      "\u0119": 'e',
      "\u011B": 'e',
      "\u011C": 'G',
      "\u011E": 'G',
      "\u0120": 'G',
      "\u0122": 'G',
      "\u011D": 'g',
      "\u011F": 'g',
      "\u0121": 'g',
      "\u0123": 'g',
      "\u0124": 'H',
      "\u0126": 'H',
      "\u0125": 'h',
      "\u0127": 'h',
      "\u0128": 'I',
      "\u012A": 'I',
      "\u012C": 'I',
      "\u012E": 'I',
      "\u0130": 'I',
      "\u0129": 'i',
      "\u012B": 'i',
      "\u012D": 'i',
      "\u012F": 'i',
      "\u0131": 'i',
      "\u0134": 'J',
      "\u0135": 'j',
      "\u0136": 'K',
      "\u0137": 'k',
      "\u0138": 'k',
      "\u0139": 'L',
      "\u013B": 'L',
      "\u013D": 'L',
      "\u013F": 'L',
      "\u0141": 'L',
      "\u013A": 'l',
      "\u013C": 'l',
      "\u013E": 'l',
      "\u0140": 'l',
      "\u0142": 'l',
      "\u0143": 'N',
      "\u0145": 'N',
      "\u0147": 'N',
      "\u014A": 'N',
      "\u0144": 'n',
      "\u0146": 'n',
      "\u0148": 'n',
      "\u014B": 'n',
      "\u014C": 'O',
      "\u014E": 'O',
      "\u0150": 'O',
      "\u014D": 'o',
      "\u014F": 'o',
      "\u0151": 'o',
      "\u0154": 'R',
      "\u0156": 'R',
      "\u0158": 'R',
      "\u0155": 'r',
      "\u0157": 'r',
      "\u0159": 'r',
      "\u015A": 'S',
      "\u015C": 'S',
      "\u015E": 'S',
      "\u0160": 'S',
      "\u015B": 's',
      "\u015D": 's',
      "\u015F": 's',
      "\u0161": 's',
      "\u0162": 'T',
      "\u0164": 'T',
      "\u0166": 'T',
      "\u0163": 't',
      "\u0165": 't',
      "\u0167": 't',
      "\u0168": 'U',
      "\u016A": 'U',
      "\u016C": 'U',
      "\u016E": 'U',
      "\u0170": 'U',
      "\u0172": 'U',
      "\u0169": 'u',
      "\u016B": 'u',
      "\u016D": 'u',
      "\u016F": 'u',
      "\u0171": 'u',
      "\u0173": 'u',
      "\u0174": 'W',
      "\u0175": 'w',
      "\u0176": 'Y',
      "\u0177": 'y',
      "\u0178": 'Y',
      "\u0179": 'Z',
      "\u017B": 'Z',
      "\u017D": 'Z',
      "\u017A": 'z',
      "\u017C": 'z',
      "\u017E": 'z',
      "\u0132": 'IJ',
      "\u0133": 'ij',
      "\u0152": 'Oe',
      "\u0153": 'oe',
      "\u0149": "'n",
      "\u017F": 's'
    };
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    var htmlUnescapes = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    };
    var stringEscapes = {
      '\\': '\\',
      "'": "'",
      '\n': 'n',
      '\r': 'r',
      "\u2028": 'u2028',
      "\u2029": 'u2029'
    };
    var freeParseFloat = parseFloat,
      freeParseInt = parseInt;
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function('return this')();
    var freeExports =  exports && !exports.nodeType && exports;
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function () {
      try {
        var types = freeModule && freeModule.require && freeModule.require('util').types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }();
    var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index = -1,
        length = array == null ? 0 : array.length;
      while (++index < length) {
        var value = array[index];
        setter(accumulator, value, iteratee(value), array);
      }
      return accumulator;
    }
    function arrayEach(array, iteratee) {
      var index = -1,
        length = array == null ? 0 : array.length;
      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEachRight(array, iteratee) {
      var length = array == null ? 0 : array.length;
      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEvery(array, predicate) {
      var index = -1,
        length = array == null ? 0 : array.length;
      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }
    function arrayFilter(array, predicate) {
      var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index = -1,
        length = array == null ? 0 : array.length;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    function arrayMap(array, iteratee) {
      var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    function arrayPush(array, values) {
      var index = -1,
        length = values.length,
        offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
        length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    function arrayReduceRight(array, iteratee, accumulator, initAccum) {
      var length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }
    function arraySome(array, predicate) {
      var index = -1,
        length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    var asciiSize = baseProperty('length');
    function asciiToArray(string) {
      return string.split('');
    }
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }
    function baseFindKey(collection, predicate, eachFunc) {
      var result;
      eachFunc(collection, function (value, key, collection) {
        if (predicate(value, key, collection)) {
          result = key;
          return false;
        }
      });
      return result;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }
    function baseIndexOfWith(array, value, fromIndex, comparator) {
      var index = fromIndex - 1,
        length = array.length;
      while (++index < length) {
        if (comparator(array[index], value)) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function baseMean(array, iteratee) {
      var length = array == null ? 0 : array.length;
      return length ? baseSum(array, iteratee) / length : NAN;
    }
    function baseProperty(key) {
      return function (object) {
        return object == null ? undefined$1 : object[key];
      };
    }
    function basePropertyOf(object) {
      return function (key) {
        return object == null ? undefined$1 : object[key];
      };
    }
    function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
      eachFunc(collection, function (value, index, collection) {
        accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    function baseSum(array, iteratee) {
      var result,
        index = -1,
        length = array.length;
      while (++index < length) {
        var current = iteratee(array[index]);
        if (current !== undefined$1) {
          result = result === undefined$1 ? current : result + current;
        }
      }
      return result;
    }
    function baseTimes(n, iteratee) {
      var index = -1,
        result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseToPairs(object, props) {
      return arrayMap(props, function (key) {
        return [key, object[key]];
      });
    }
    function baseTrim(string) {
      return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
    }
    function baseUnary(func) {
      return function (value) {
        return func(value);
      };
    }
    function baseValues(object, props) {
      return arrayMap(props, function (key) {
        return object[key];
      });
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function charsStartIndex(strSymbols, chrSymbols) {
      var index = -1,
        length = strSymbols.length;
      while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
      return index;
    }
    function charsEndIndex(strSymbols, chrSymbols) {
      var index = strSymbols.length;
      while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
      return index;
    }
    function countHolders(array, placeholder) {
      var length = array.length,
        result = 0;
      while (length--) {
        if (array[length] === placeholder) {
          ++result;
        }
      }
      return result;
    }
    var deburrLetter = basePropertyOf(deburredLetters);
    var escapeHtmlChar = basePropertyOf(htmlEscapes);
    function escapeStringChar(chr) {
      return '\\' + stringEscapes[chr];
    }
    function getValue(object, key) {
      return object == null ? undefined$1 : object[key];
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }
    function iteratorToArray(iterator) {
      var data,
        result = [];
      while (!(data = iterator.next()).done) {
        result.push(data.value);
      }
      return result;
    }
    function mapToArray(map) {
      var index = -1,
        result = Array(map.size);
      map.forEach(function (value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function (arg) {
        return func(transform(arg));
      };
    }
    function replaceHolders(array, placeholder) {
      var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];
      while (++index < length) {
        var value = array[index];
        if (value === placeholder || value === PLACEHOLDER) {
          array[index] = PLACEHOLDER;
          result[resIndex++] = index;
        }
      }
      return result;
    }
    function setToArray(set) {
      var index = -1,
        result = Array(set.size);
      set.forEach(function (value) {
        result[++index] = value;
      });
      return result;
    }
    function setToPairs(set) {
      var index = -1,
        result = Array(set.size);
      set.forEach(function (value) {
        result[++index] = [value, value];
      });
      return result;
    }
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1,
        length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function strictLastIndexOf(array, value, fromIndex) {
      var index = fromIndex + 1;
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return index;
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function trimmedEndIndex(string) {
      var index = string.length;
      while (index-- && reWhitespace.test(string.charAt(index))) {}
      return index;
    }
    var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        ++result;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }
    var runInContext = function runInContext(context) {
      context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
      var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;
      var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;
      var coreJsData = context['__core-js_shared__'];
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var idCounter = 0;
      var maskSrcKey = function () {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
        return uid ? 'Symbol(src)_1.' + uid : '';
      }();
      var nativeObjectToString = objectProto.toString;
      var objectCtorString = funcToString.call(Object);
      var oldDash = root._;
      var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
      var Buffer = moduleExports ? context.Buffer : undefined$1,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined$1,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined$1,
        symIterator = Symbol ? Symbol.iterator : undefined$1,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined$1;
      var defineProperty = function () {
        try {
          var func = getNative(Object, 'defineProperty');
          func({}, '', {});
          return func;
        } catch (e) {}
      }();
      var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
      var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined$1,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;
      var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');
      var metaMap = WeakMap && new WeakMap();
      var realNames = {};
      var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);
      var symbolProto = Symbol ? Symbol.prototype : undefined$1,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1,
        symbolToString = symbolProto ? symbolProto.toString : undefined$1;
      function lodash(value) {
        if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
          if (value instanceof LodashWrapper) {
            return value;
          }
          if (hasOwnProperty.call(value, '__wrapped__')) {
            return wrapperClone(value);
          }
        }
        return new LodashWrapper(value);
      }
      var baseCreate = function () {
        function object() {}
        return function (proto) {
          if (!isObject(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result = new object();
          object.prototype = undefined$1;
          return result;
        };
      }();
      function baseLodash() {}
      function LodashWrapper(value, chainAll) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = undefined$1;
      }
      lodash.templateSettings = {
        'escape': reEscape,
        'evaluate': reEvaluate,
        'interpolate': reInterpolate,
        'variable': '',
        'imports': {
          '_': lodash
        }
      };
      lodash.prototype = baseLodash.prototype;
      lodash.prototype.constructor = lodash;
      LodashWrapper.prototype = baseCreate(baseLodash.prototype);
      LodashWrapper.prototype.constructor = LodashWrapper;
      function LazyWrapper(value) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = MAX_ARRAY_LENGTH;
        this.__views__ = [];
      }
      function lazyClone() {
        var result = new LazyWrapper(this.__wrapped__);
        result.__actions__ = copyArray(this.__actions__);
        result.__dir__ = this.__dir__;
        result.__filtered__ = this.__filtered__;
        result.__iteratees__ = copyArray(this.__iteratees__);
        result.__takeCount__ = this.__takeCount__;
        result.__views__ = copyArray(this.__views__);
        return result;
      }
      function lazyReverse() {
        if (this.__filtered__) {
          var result = new LazyWrapper(this);
          result.__dir__ = -1;
          result.__filtered__ = true;
        } else {
          result = this.clone();
          result.__dir__ *= -1;
        }
        return result;
      }
      function lazyValue() {
        var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : start - 1,
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);
        if (!isArr || !isRight && arrLength == length && takeCount == length) {
          return baseWrapperValue(array, this.__actions__);
        }
        var result = [];
        outer: while (length-- && resIndex < takeCount) {
          index += dir;
          var iterIndex = -1,
            value = array[index];
          while (++iterIndex < iterLength) {
            var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);
            if (type == LAZY_MAP_FLAG) {
              value = computed;
            } else if (!computed) {
              if (type == LAZY_FILTER_FLAG) {
                continue outer;
              } else {
                break outer;
              }
            }
          }
          result[resIndex++] = value;
        }
        return result;
      }
      LazyWrapper.prototype = baseCreate(baseLodash.prototype);
      LazyWrapper.prototype.constructor = LazyWrapper;
      function Hash(entries) {
        var index = -1,
          length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? undefined$1 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : undefined$1;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== undefined$1 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === undefined$1 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype['delete'] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index = -1,
          length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function listCacheDelete(key) {
        var data = this.__data__,
          index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__,
          index = assocIndexOf(data, key);
        return index < 0 ? undefined$1 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__,
          index = assocIndexOf(data, key);
        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype['delete'] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index = -1,
          length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          'hash': new Hash(),
          'map': new (Map || ListCache)(),
          'string': new Hash()
        };
      }
      function mapCacheDelete(key) {
        var result = getMapData(this, key)['delete'](key);
        this.size -= result ? 1 : 0;
        return result;
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        var data = getMapData(this, key),
          size = data.size;
        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype['delete'] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function SetCache(values) {
        var index = -1,
          length = values == null ? 0 : values.length;
        this.__data__ = new MapCache();
        while (++index < length) {
          this.add(values[index]);
        }
      }
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key) {
        var data = this.__data__,
          result = data['delete'](key);
        this.size = data.size;
        return result;
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      function stackSet(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype['delete'] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isBuff && (key == 'offset' || key == 'parent') || isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || isIndex(key, length)))) {
            result.push(key);
          }
        }
        return result;
      }
      function arraySample(array) {
        var length = array.length;
        return length ? array[baseRandom(0, length - 1)] : undefined$1;
      }
      function arraySampleSize(array, n) {
        return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
      }
      function arrayShuffle(array) {
        return shuffleSelf(copyArray(array));
      }
      function assignMergeValue(object, key, value) {
        if (value !== undefined$1 && !eq(object[key], value) || value === undefined$1 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined$1 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseAggregator(collection, setter, iteratee, accumulator) {
        baseEach(collection, function (value, key, collection) {
          setter(accumulator, value, iteratee(value), collection);
        });
        return accumulator;
      }
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }
      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }
      function baseAssignValue(object, key, value) {
        if (key == '__proto__' && defineProperty) {
          defineProperty(object, key, {
            'configurable': true,
            'enumerable': true,
            'value': value,
            'writable': true
          });
        } else {
          object[key] = value;
        }
      }
      function baseAt(object, paths) {
        var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;
        while (++index < length) {
          result[index] = skip ? undefined$1 : get(object, paths[index]);
        }
        return result;
      }
      function baseClamp(number, lower, upper) {
        if (number === number) {
          if (upper !== undefined$1) {
            number = number <= upper ? number : upper;
          }
          if (lower !== undefined$1) {
            number = number >= lower ? number : lower;
          }
        }
        return number;
      }
      function baseClone(value, bitmask, customizer, key, object, stack) {
        var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;
        if (customizer) {
          result = object ? customizer(value, key, object, stack) : customizer(value);
        }
        if (result !== undefined$1) {
          return result;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray(value);
        if (isArr) {
          result = initCloneArray(value);
          if (!isDeep) {
            return copyArray(value, result);
          }
        } else {
          var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag || tag == argsTag || isFunc && !object) {
            result = isFlat || isFunc ? {} : initCloneObject(value);
            if (!isDeep) {
              return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result = initCloneByTag(value, tag, isDeep);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result);
        if (isSet(value)) {
          value.forEach(function (subValue) {
            result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap(value)) {
          value.forEach(function (subValue, key) {
            result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
          });
        }
        var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
        var props = isArr ? undefined$1 : keysFunc(value);
        arrayEach(props || value, function (subValue, key) {
          if (props) {
            key = subValue;
            subValue = value[key];
          }
          assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
        return result;
      }
      function baseConforms(source) {
        var props = keys(source);
        return function (object) {
          return baseConformsTo(object, source, props);
        };
      }
      function baseConformsTo(object, source, props) {
        var length = props.length;
        if (object == null) {
          return !length;
        }
        object = Object(object);
        while (length--) {
          var key = props[length],
            predicate = source[key],
            value = object[key];
          if (value === undefined$1 && !(key in object) || !predicate(value)) {
            return false;
          }
        }
        return true;
      }
      function baseDelay(func, wait, args) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return setTimeout(function () {
          func.apply(undefined$1, args);
        }, wait);
      }
      function baseDifference(array, values, iteratee, comparator) {
        var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;
        if (!length) {
          return result;
        }
        if (iteratee) {
          values = arrayMap(values, baseUnary(iteratee));
        }
        if (comparator) {
          includes = arrayIncludesWith;
          isCommon = false;
        } else if (values.length >= LARGE_ARRAY_SIZE) {
          includes = cacheHas;
          isCommon = false;
          values = new SetCache(values);
        }
        outer: while (++index < length) {
          var value = array[index],
            computed = iteratee == null ? value : iteratee(value);
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;
            while (valuesIndex--) {
              if (values[valuesIndex] === computed) {
                continue outer;
              }
            }
            result.push(value);
          } else if (!includes(values, computed, comparator)) {
            result.push(value);
          }
        }
        return result;
      }
      var baseEach = createBaseEach(baseForOwn);
      var baseEachRight = createBaseEach(baseForOwnRight, true);
      function baseEvery(collection, predicate) {
        var result = true;
        baseEach(collection, function (value, index, collection) {
          result = !!predicate(value, index, collection);
          return result;
        });
        return result;
      }
      function baseExtremum(array, iteratee, comparator) {
        var index = -1,
          length = array.length;
        while (++index < length) {
          var value = array[index],
            current = iteratee(value);
          if (current != null && (computed === undefined$1 ? current === current && !isSymbol(current) : comparator(current, computed))) {
            var computed = current,
              result = value;
          }
        }
        return result;
      }
      function baseFill(array, value, start, end) {
        var length = array.length;
        start = toInteger(start);
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end === undefined$1 || end > length ? length : toInteger(end);
        if (end < 0) {
          end += length;
        }
        end = start > end ? 0 : toLength(end);
        while (start < end) {
          array[start++] = value;
        }
        return array;
      }
      function baseFilter(collection, predicate) {
        var result = [];
        baseEach(collection, function (value, index, collection) {
          if (predicate(value, index, collection)) {
            result.push(value);
          }
        });
        return result;
      }
      function baseFlatten(array, depth, predicate, isStrict, result) {
        var index = -1,
          length = array.length;
        predicate || (predicate = isFlattenable);
        result || (result = []);
        while (++index < length) {
          var value = array[index];
          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              baseFlatten(value, depth - 1, predicate, isStrict, result);
            } else {
              arrayPush(result, value);
            }
          } else if (!isStrict) {
            result[result.length] = value;
          }
        }
        return result;
      }
      var baseFor = createBaseFor();
      var baseForRight = createBaseFor(true);
      function baseForOwn(object, iteratee) {
        return object && baseFor(object, iteratee, keys);
      }
      function baseForOwnRight(object, iteratee) {
        return object && baseForRight(object, iteratee, keys);
      }
      function baseFunctions(object, props) {
        return arrayFilter(props, function (key) {
          return isFunction(object[key]);
        });
      }
      function baseGet(object, path) {
        path = castPath(path, object);
        var index = 0,
          length = path.length;
        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : undefined$1;
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
      }
      function baseGetTag(value) {
        if (value == null) {
          return value === undefined$1 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      function baseGt(value, other) {
        return value > other;
      }
      function baseHas(object, key) {
        return object != null && hasOwnProperty.call(object, key);
      }
      function baseHasIn(object, key) {
        return object != null && key in Object(object);
      }
      function baseInRange(number, start, end) {
        return number >= nativeMin(start, end) && number < nativeMax(start, end);
      }
      function baseIntersection(arrays, iteratee, comparator) {
        var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];
        while (othIndex--) {
          var array = arrays[othIndex];
          if (othIndex && iteratee) {
            array = arrayMap(array, baseUnary(iteratee));
          }
          maxLength = nativeMin(array.length, maxLength);
          caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined$1;
        }
        array = arrays[0];
        var index = -1,
          seen = caches[0];
        outer: while (++index < length && result.length < maxLength) {
          var value = array[index],
            computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
            othIndex = othLength;
            while (--othIndex) {
              var cache = caches[othIndex];
              if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
                continue outer;
              }
            }
            if (seen) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
        return result;
      }
      function baseInverter(object, setter, iteratee, accumulator) {
        baseForOwn(object, function (value, key, object) {
          setter(accumulator, iteratee(value), key, object);
        });
        return accumulator;
      }
      function baseInvoke(object, path, args) {
        path = castPath(path, object);
        object = parent(object, path);
        var func = object == null ? object : object[toKey(last(path))];
        return func == null ? undefined$1 : apply(func, object, args);
      }
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
      }
      function baseIsArrayBuffer(value) {
        return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
      }
      function baseIsDate(value) {
        return isObjectLike(value) && baseGetTag(value) == dateTag;
      }
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
      function baseIsMap(value) {
        return isObjectLike(value) && getTag(value) == mapTag;
      }
      function baseIsMatch(object, source, matchData, customizer) {
        var index = matchData.length,
          length = index,
          noCustomizer = !customizer;
        if (object == null) {
          return !length;
        }
        object = Object(object);
        while (index--) {
          var data = matchData[index];
          if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
          }
        }
        while (++index < length) {
          data = matchData[index];
          var key = data[0],
            objValue = object[key],
            srcValue = data[1];
          if (noCustomizer && data[2]) {
            if (objValue === undefined$1 && !(key in object)) {
              return false;
            }
          } else {
            var stack = new Stack();
            if (customizer) {
              var result = customizer(objValue, srcValue, key, object, source, stack);
            }
            if (!(result === undefined$1 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
              return false;
            }
          }
        }
        return true;
      }
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function baseIsRegExp(value) {
        return isObjectLike(value) && baseGetTag(value) == regexpTag;
      }
      function baseIsSet(value) {
        return isObjectLike(value) && getTag(value) == setTag;
      }
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseIteratee(value) {
        if (typeof value == 'function') {
          return value;
        }
        if (value == null) {
          return identity;
        }
        if (typeof value == 'object') {
          return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
        }
        return property(value);
      }
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
          }
        }
        return result;
      }
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object),
          result = [];
        for (var key in object) {
          if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
            result.push(key);
          }
        }
        return result;
      }
      function baseLt(value, other) {
        return value < other;
      }
      function baseMap(collection, iteratee) {
        var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];
        baseEach(collection, function (value, key, collection) {
          result[++index] = iteratee(value, key, collection);
        });
        return result;
      }
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function (object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }
      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }
        return function (object) {
          var objValue = get(object, path);
          return objValue === undefined$1 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }
      function baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }
        baseFor(source, function (srcValue, key) {
          stack || (stack = new Stack());
          if (isObject(srcValue)) {
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
          } else {
            var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + '', object, source, stack) : undefined$1;
            if (newValue === undefined$1) {
              newValue = srcValue;
            }
            assignMergeValue(object, key, newValue);
          }
        }, keysIn);
      }
      function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);
        if (stacked) {
          assignMergeValue(object, key, stacked);
          return;
        }
        var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined$1;
        var isCommon = newValue === undefined$1;
        if (isCommon) {
          var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);
          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray(objValue)) {
              newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
              newValue = copyArray(objValue);
            } else if (isBuff) {
              isCommon = false;
              newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
              isCommon = false;
              newValue = cloneTypedArray(srcValue, true);
            } else {
              newValue = [];
            }
          } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject(objValue) || isFunction(objValue)) {
              newValue = initCloneObject(srcValue);
            }
          } else {
            isCommon = false;
          }
        }
        if (isCommon) {
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack['delete'](srcValue);
        }
        assignMergeValue(object, key, newValue);
      }
      function baseNth(array, n) {
        var length = array.length;
        if (!length) {
          return;
        }
        n += n < 0 ? length : 0;
        return isIndex(n, length) ? array[n] : undefined$1;
      }
      function baseOrderBy(collection, iteratees, orders) {
        if (iteratees.length) {
          iteratees = arrayMap(iteratees, function (iteratee) {
            if (isArray(iteratee)) {
              return function (value) {
                return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
              };
            }
            return iteratee;
          });
        } else {
          iteratees = [identity];
        }
        var index = -1;
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        var result = baseMap(collection, function (value, key, collection) {
          var criteria = arrayMap(iteratees, function (iteratee) {
            return iteratee(value);
          });
          return {
            'criteria': criteria,
            'index': ++index,
            'value': value
          };
        });
        return baseSortBy(result, function (object, other) {
          return compareMultiple(object, other, orders);
        });
      }
      function basePick(object, paths) {
        return basePickBy(object, paths, function (value, path) {
          return hasIn(object, path);
        });
      }
      function basePickBy(object, paths, predicate) {
        var index = -1,
          length = paths.length,
          result = {};
        while (++index < length) {
          var path = paths[index],
            value = baseGet(object, path);
          if (predicate(value, path)) {
            baseSet(result, castPath(path, object), value);
          }
        }
        return result;
      }
      function basePropertyDeep(path) {
        return function (object) {
          return baseGet(object, path);
        };
      }
      function basePullAll(array, values, iteratee, comparator) {
        var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;
        if (array === values) {
          values = copyArray(values);
        }
        if (iteratee) {
          seen = arrayMap(array, baseUnary(iteratee));
        }
        while (++index < length) {
          var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;
          while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
            if (seen !== array) {
              splice.call(seen, fromIndex, 1);
            }
            splice.call(array, fromIndex, 1);
          }
        }
        return array;
      }
      function basePullAt(array, indexes) {
        var length = array ? indexes.length : 0,
          lastIndex = length - 1;
        while (length--) {
          var index = indexes[length];
          if (length == lastIndex || index !== previous) {
            var previous = index;
            if (isIndex(index)) {
              splice.call(array, index, 1);
            } else {
              baseUnset(array, index);
            }
          }
        }
        return array;
      }
      function baseRandom(lower, upper) {
        return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
      }
      function baseRange(start, end, step, fromRight) {
        var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);
        while (length--) {
          result[fromRight ? length : ++index] = start;
          start += step;
        }
        return result;
      }
      function baseRepeat(string, n) {
        var result = '';
        if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
          return result;
        }
        do {
          if (n % 2) {
            result += string;
          }
          n = nativeFloor(n / 2);
          if (n) {
            string += string;
          }
        } while (n);
        return result;
      }
      function baseRest(func, start) {
        return setToString(overRest(func, start, identity), func + '');
      }
      function baseSample(collection) {
        return arraySample(values(collection));
      }
      function baseSampleSize(collection, n) {
        var array = values(collection);
        return shuffleSelf(array, baseClamp(n, 0, array.length));
      }
      function baseSet(object, path, value, customizer) {
        if (!isObject(object)) {
          return object;
        }
        path = castPath(path, object);
        var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;
        while (nested != null && ++index < length) {
          var key = toKey(path[index]),
            newValue = value;
          if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            return object;
          }
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined$1;
            if (newValue === undefined$1) {
              newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
      var baseSetData = !metaMap ? identity : function (func, data) {
        metaMap.set(func, data);
        return func;
      };
      var baseSetToString = !defineProperty ? identity : function (func, string) {
        return defineProperty(func, 'toString', {
          'configurable': true,
          'enumerable': false,
          'value': constant(string),
          'writable': true
        });
      };
      function baseShuffle(collection) {
        return shuffleSelf(values(collection));
      }
      function baseSlice(array, start, end) {
        var index = -1,
          length = array.length;
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result = Array(length);
        while (++index < length) {
          result[index] = array[index + start];
        }
        return result;
      }
      function baseSome(collection, predicate) {
        var result;
        baseEach(collection, function (value, index, collection) {
          result = predicate(value, index, collection);
          return !result;
        });
        return !!result;
      }
      function baseSortedIndex(array, value, retHighest) {
        var low = 0,
          high = array == null ? low : array.length;
        if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
          while (low < high) {
            var mid = low + high >>> 1,
              computed = array[mid];
            if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return high;
        }
        return baseSortedIndexBy(array, value, identity, retHighest);
      }
      function baseSortedIndexBy(array, value, iteratee, retHighest) {
        var low = 0,
          high = array == null ? 0 : array.length;
        if (high === 0) {
          return 0;
        }
        value = iteratee(value);
        var valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined$1;
        while (low < high) {
          var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined$1,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);
          if (valIsNaN) {
            var setLow = retHighest || othIsReflexive;
          } else if (valIsUndefined) {
            setLow = othIsReflexive && (retHighest || othIsDefined);
          } else if (valIsNull) {
            setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
          } else if (valIsSymbol) {
            setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
          } else if (othIsNull || othIsSymbol) {
            setLow = false;
          } else {
            setLow = retHighest ? computed <= value : computed < value;
          }
          if (setLow) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return nativeMin(high, MAX_ARRAY_INDEX);
      }
      function baseSortedUniq(array, iteratee) {
        var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];
        while (++index < length) {
          var value = array[index],
            computed = iteratee ? iteratee(value) : value;
          if (!index || !eq(computed, seen)) {
            var seen = computed;
            result[resIndex++] = value === 0 ? 0 : value;
          }
        }
        return result;
      }
      function baseToNumber(value) {
        if (typeof value == 'number') {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        return +value;
      }
      function baseToString(value) {
        if (typeof value == 'string') {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + '';
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : '';
        }
        var result = value + '';
        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
      }
      function baseUniq(array, iteratee, comparator) {
        var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;
        if (comparator) {
          isCommon = false;
          includes = arrayIncludesWith;
        } else if (length >= LARGE_ARRAY_SIZE) {
          var set = iteratee ? null : createSet(array);
          if (set) {
            return setToArray(set);
          }
          isCommon = false;
          includes = cacheHas;
          seen = new SetCache();
        } else {
          seen = iteratee ? [] : result;
        }
        outer: while (++index < length) {
          var value = array[index],
            computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
        return result;
      }
      function baseUnset(object, path) {
        path = castPath(path, object);
        object = parent(object, path);
        return object == null || delete object[toKey(last(path))];
      }
      function baseUpdate(object, path, updater, customizer) {
        return baseSet(object, path, updater(baseGet(object, path)), customizer);
      }
      function baseWhile(array, predicate, isDrop, fromRight) {
        var length = array.length,
          index = fromRight ? length : -1;
        while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
        return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
      }
      function baseWrapperValue(value, actions) {
        var result = value;
        if (result instanceof LazyWrapper) {
          result = result.value();
        }
        return arrayReduce(actions, function (result, action) {
          return action.func.apply(action.thisArg, arrayPush([result], action.args));
        }, result);
      }
      function baseXor(arrays, iteratee, comparator) {
        var length = arrays.length;
        if (length < 2) {
          return length ? baseUniq(arrays[0]) : [];
        }
        var index = -1,
          result = Array(length);
        while (++index < length) {
          var array = arrays[index],
            othIndex = -1;
          while (++othIndex < length) {
            if (othIndex != index) {
              result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
            }
          }
        }
        return baseUniq(baseFlatten(result, 1), iteratee, comparator);
      }
      function baseZipObject(props, values, assignFunc) {
        var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};
        while (++index < length) {
          var value = index < valsLength ? values[index] : undefined$1;
          assignFunc(result, props[index], value);
        }
        return result;
      }
      function castArrayLikeObject(value) {
        return isArrayLikeObject(value) ? value : [];
      }
      function castFunction(value) {
        return typeof value == 'function' ? value : identity;
      }
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }
      var castRest = baseRest;
      function castSlice(array, start, end) {
        var length = array.length;
        end = end === undefined$1 ? length : end;
        return !start && end >= length ? array : baseSlice(array, start, end);
      }
      var clearTimeout = ctxClearTimeout || function (id) {
        return root.clearTimeout(id);
      };
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result);
        return result;
      }
      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array(result).set(new Uint8Array(arrayBuffer));
        return result;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      function cloneRegExp(regexp) {
        var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
      }
      function cloneSymbol(symbol) {
        return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      function compareAscending(value, other) {
        if (value !== other) {
          var valIsDefined = value !== undefined$1,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);
          var othIsDefined = other !== undefined$1,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);
          if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
            return 1;
          }
          if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
            return -1;
          }
        }
        return 0;
      }
      function compareMultiple(object, other, orders) {
        var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;
        while (++index < length) {
          var result = compareAscending(objCriteria[index], othCriteria[index]);
          if (result) {
            if (index >= ordersLength) {
              return result;
            }
            var order = orders[index];
            return result * (order == 'desc' ? -1 : 1);
          }
        }
        return object.index - other.index;
      }
      function composeArgs(args, partials, holders, isCurried) {
        var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;
        while (++leftIndex < leftLength) {
          result[leftIndex] = partials[leftIndex];
        }
        while (++argsIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result[holders[argsIndex]] = args[argsIndex];
          }
        }
        while (rangeLength--) {
          result[leftIndex++] = args[argsIndex++];
        }
        return result;
      }
      function composeArgsRight(args, partials, holders, isCurried) {
        var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;
        while (++argsIndex < rangeLength) {
          result[argsIndex] = args[argsIndex];
        }
        var offset = argsIndex;
        while (++rightIndex < rightLength) {
          result[offset + rightIndex] = partials[rightIndex];
        }
        while (++holdersIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result[offset + holders[holdersIndex]] = args[argsIndex++];
          }
        }
        return result;
      }
      function copyArray(source, array) {
        var index = -1,
          length = source.length;
        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index = -1,
          length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined$1;
          if (newValue === undefined$1) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }
        return object;
      }
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }
      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }
      function createAggregator(setter, initializer) {
        return function (collection, iteratee) {
          var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};
          return func(collection, setter, getIteratee(iteratee, 2), accumulator);
        };
      }
      function createAssigner(assigner) {
        return baseRest(function (object, sources) {
          var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined$1,
            guard = length > 2 ? sources[2] : undefined$1;
          customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined$1;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined$1 : customizer;
            length = 1;
          }
          object = Object(object);
          while (++index < length) {
            var source = sources[index];
            if (source) {
              assigner(object, source, index, customizer);
            }
          }
          return object;
        });
      }
      function createBaseEach(eachFunc, fromRight) {
        return function (collection, iteratee) {
          if (collection == null) {
            return collection;
          }
          if (!isArrayLike(collection)) {
            return eachFunc(collection, iteratee);
          }
          var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);
          while (fromRight ? index-- : ++index < length) {
            if (iteratee(iterable[index], index, iterable) === false) {
              break;
            }
          }
          return collection;
        };
      }
      function createBaseFor(fromRight) {
        return function (object, iteratee, keysFunc) {
          var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;
          while (length--) {
            var key = props[fromRight ? length : ++index];
            if (iteratee(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }
      function createBind(func, bitmask, thisArg) {
        var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);
        function wrapper() {
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          return fn.apply(isBind ? thisArg : this, arguments);
        }
        return wrapper;
      }
      function createCaseFirst(methodName) {
        return function (string) {
          string = toString(string);
          var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined$1;
          var chr = strSymbols ? strSymbols[0] : string.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join('') : string.slice(1);
          return chr[methodName]() + trailing;
        };
      }
      function createCompounder(callback) {
        return function (string) {
          return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
        };
      }
      function createCtor(Ctor) {
        return function () {
          var args = arguments;
          switch (args.length) {
            case 0:
              return new Ctor();
            case 1:
              return new Ctor(args[0]);
            case 2:
              return new Ctor(args[0], args[1]);
            case 3:
              return new Ctor(args[0], args[1], args[2]);
            case 4:
              return new Ctor(args[0], args[1], args[2], args[3]);
            case 5:
              return new Ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          }
          var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        };
      }
      function createCurry(func, bitmask, arity) {
        var Ctor = createCtor(func);
        function wrapper() {
          var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);
          while (index--) {
            args[index] = arguments[index];
          }
          var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
          length -= holders.length;
          if (length < arity) {
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined$1, args, holders, undefined$1, undefined$1, arity - length);
          }
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          return apply(fn, this, args);
        }
        return wrapper;
      }
      function createFind(findIndexFunc) {
        return function (collection, predicate, fromIndex) {
          var iterable = Object(collection);
          if (!isArrayLike(collection)) {
            var iteratee = getIteratee(predicate, 3);
            collection = keys(collection);
            predicate = function predicate(key) {
              return iteratee(iterable[key], key, iterable);
            };
          }
          var index = findIndexFunc(collection, predicate, fromIndex);
          return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined$1;
        };
      }
      function createFlow(fromRight) {
        return flatRest(function (funcs) {
          var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;
          if (fromRight) {
            funcs.reverse();
          }
          while (index--) {
            var func = funcs[index];
            if (typeof func != 'function') {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
              var wrapper = new LodashWrapper([], true);
            }
          }
          index = wrapper ? index : length;
          while (++index < length) {
            func = funcs[index];
            var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined$1;
            if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
              wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
            } else {
              wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
            }
          }
          return function () {
            var args = arguments,
              value = args[0];
            if (wrapper && args.length == 1 && isArray(value)) {
              return wrapper.plant(value).value();
            }
            var index = 0,
              result = length ? funcs[index].apply(this, args) : value;
            while (++index < length) {
              result = funcs[index].call(this, result);
            }
            return result;
          };
        });
      }
      function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
        var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined$1 : createCtor(func);
        function wrapper() {
          var length = arguments.length,
            args = Array(length),
            index = length;
          while (index--) {
            args[index] = arguments[index];
          }
          if (isCurried) {
            var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
          }
          if (partials) {
            args = composeArgs(args, partials, holders, isCurried);
          }
          if (partialsRight) {
            args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
          }
          length -= holdersCount;
          if (isCurried && length < arity) {
            var newHolders = replaceHolders(args, placeholder);
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
          }
          var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;
          length = args.length;
          if (argPos) {
            args = reorder(args, argPos);
          } else if (isFlip && length > 1) {
            args.reverse();
          }
          if (isAry && ary < length) {
            args.length = ary;
          }
          if (this && this !== root && this instanceof wrapper) {
            fn = Ctor || createCtor(fn);
          }
          return fn.apply(thisBinding, args);
        }
        return wrapper;
      }
      function createInverter(setter, toIteratee) {
        return function (object, iteratee) {
          return baseInverter(object, setter, toIteratee(iteratee), {});
        };
      }
      function createMathOperation(operator, defaultValue) {
        return function (value, other) {
          var result;
          if (value === undefined$1 && other === undefined$1) {
            return defaultValue;
          }
          if (value !== undefined$1) {
            result = value;
          }
          if (other !== undefined$1) {
            if (result === undefined$1) {
              return other;
            }
            if (typeof value == 'string' || typeof other == 'string') {
              value = baseToString(value);
              other = baseToString(other);
            } else {
              value = baseToNumber(value);
              other = baseToNumber(other);
            }
            result = operator(value, other);
          }
          return result;
        };
      }
      function createOver(arrayFunc) {
        return flatRest(function (iteratees) {
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          return baseRest(function (args) {
            var thisArg = this;
            return arrayFunc(iteratees, function (iteratee) {
              return apply(iteratee, thisArg, args);
            });
          });
        });
      }
      function createPadding(length, chars) {
        chars = chars === undefined$1 ? ' ' : baseToString(chars);
        var charsLength = chars.length;
        if (charsLength < 2) {
          return charsLength ? baseRepeat(chars, length) : chars;
        }
        var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join('') : result.slice(0, length);
      }
      function createPartial(func, bitmask, thisArg, partials) {
        var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);
        function wrapper() {
          var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          while (++leftIndex < leftLength) {
            args[leftIndex] = partials[leftIndex];
          }
          while (argsLength--) {
            args[leftIndex++] = arguments[++argsIndex];
          }
          return apply(fn, isBind ? thisArg : this, args);
        }
        return wrapper;
      }
      function createRange(fromRight) {
        return function (start, end, step) {
          if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
            end = step = undefined$1;
          }
          start = toFinite(start);
          if (end === undefined$1) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          step = step === undefined$1 ? start < end ? 1 : -1 : toFinite(step);
          return baseRange(start, end, step, fromRight);
        };
      }
      function createRelationalOperation(operator) {
        return function (value, other) {
          if (!(typeof value == 'string' && typeof other == 'string')) {
            value = toNumber(value);
            other = toNumber(other);
          }
          return operator(value, other);
        };
      }
      function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
        var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined$1,
          newHoldersRight = isCurry ? undefined$1 : holders,
          newPartials = isCurry ? partials : undefined$1,
          newPartialsRight = isCurry ? undefined$1 : partials;
        bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
        bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
        if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
          bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
        }
        var newData = [func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary, arity];
        var result = wrapFunc.apply(undefined$1, newData);
        if (isLaziable(func)) {
          setData(result, newData);
        }
        result.placeholder = placeholder;
        return setWrapToString(result, func, bitmask);
      }
      function createRound(methodName) {
        var func = Math[methodName];
        return function (number, precision) {
          number = toNumber(number);
          precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
          if (precision && nativeIsFinite(number)) {
            var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));
            pair = (toString(value) + 'e').split('e');
            return +(pair[0] + 'e' + (+pair[1] - precision));
          }
          return func(number);
        };
      }
      var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function (values) {
        return new Set(values);
      };
      function createToPairs(keysFunc) {
        return function (object) {
          var tag = getTag(object);
          if (tag == mapTag) {
            return mapToArray(object);
          }
          if (tag == setTag) {
            return setToPairs(object);
          }
          return baseToPairs(object, keysFunc(object));
        };
      }
      function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
        var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
        if (!isBindKey && typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var length = partials ? partials.length : 0;
        if (!length) {
          bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
          partials = holders = undefined$1;
        }
        ary = ary === undefined$1 ? ary : nativeMax(toInteger(ary), 0);
        arity = arity === undefined$1 ? arity : toInteger(arity);
        length -= holders ? holders.length : 0;
        if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
          var partialsRight = partials,
            holdersRight = holders;
          partials = holders = undefined$1;
        }
        var data = isBindKey ? undefined$1 : getData(func);
        var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
        if (data) {
          mergeData(newData, data);
        }
        func = newData[0];
        bitmask = newData[1];
        thisArg = newData[2];
        partials = newData[3];
        holders = newData[4];
        arity = newData[9] = newData[9] === undefined$1 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
        if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
          bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
        }
        if (!bitmask || bitmask == WRAP_BIND_FLAG) {
          var result = createBind(func, bitmask, thisArg);
        } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
          result = createCurry(func, bitmask, arity);
        } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
          result = createPartial(func, bitmask, thisArg, partials);
        } else {
          result = createHybrid.apply(undefined$1, newData);
        }
        var setter = data ? baseSetData : setData;
        return setWrapToString(setter(result, newData), func, bitmask);
      }
      function customDefaultsAssignIn(objValue, srcValue, key, object) {
        if (objValue === undefined$1 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
          return srcValue;
        }
        return objValue;
      }
      function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
        if (isObject(objValue) && isObject(srcValue)) {
          stack.set(srcValue, objValue);
          baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack);
          stack['delete'](srcValue);
        }
        return objValue;
      }
      function customOmitClone(value) {
        return isPlainObject(value) ? undefined$1 : value;
      }
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index = -1,
          result = true,
          seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined$1;
        stack.set(array, other);
        stack.set(other, array);
        while (++index < arrLength) {
          var arrValue = array[index],
            othValue = other[index];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== undefined$1) {
            if (compared) {
              continue;
            }
            result = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function (othValue, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result = false;
            break;
          }
        }
        stack['delete'](array);
        stack['delete'](other);
        return result;
      }
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
              return false;
            }
            return true;
          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);
          case errorTag:
            return object.name == other.name && object.message == other.message;
          case regexpTag:
          case stringTag:
            return object == other + '';
          case mapTag:
            var convert = mapToArray;
          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG;
            stack.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack['delete'](object);
            return result;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
            return false;
          }
        }
        var objStacked = stack.get(object);
        var othStacked = stack.get(other);
        if (objStacked && othStacked) {
          return objStacked == other && othStacked == object;
        }
        var result = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key],
            othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
          }
          if (!(compared === undefined$1 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result = false;
            break;
          }
          skipCtor || (skipCtor = key == 'constructor');
        }
        if (result && !skipCtor) {
          var objCtor = object.constructor,
            othCtor = other.constructor;
          if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
            result = false;
          }
        }
        stack['delete'](object);
        stack['delete'](other);
        return result;
      }
      function flatRest(func) {
        return setToString(overRest(func, undefined$1, flatten), func + '');
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      function getAllKeysIn(object) {
        return baseGetAllKeys(object, keysIn, getSymbolsIn);
      }
      var getData = !metaMap ? noop : function (func) {
        return metaMap.get(func);
      };
      function getFuncName(func) {
        var result = func.name + '',
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;
        while (length--) {
          var data = array[length],
            otherFunc = data.func;
          if (otherFunc == null || otherFunc == func) {
            return data.name;
          }
        }
        return result;
      }
      function getHolder(func) {
        var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
        return object.placeholder;
      }
      function getIteratee() {
        var result = lodash.iteratee || iteratee;
        result = result === iteratee ? baseIteratee : result;
        return arguments.length ? result(arguments[0], arguments[1]) : result;
      }
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
      }
      function getMatchData(object) {
        var result = keys(object),
          length = result.length;
        while (length--) {
          var key = result[length],
            value = object[key];
          result[length] = [key, value, isStrictComparable(value)];
        }
        return result;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined$1;
      }
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];
        try {
          value[symToStringTag] = undefined$1;
          var unmasked = true;
        } catch (e) {}
        var result = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }
        return result;
      }
      var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
        if (object == null) {
          return [];
        }
        object = Object(object);
        return arrayFilter(nativeGetSymbols(object), function (symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function (object) {
        var result = [];
        while (object) {
          arrayPush(result, getSymbols(object));
          object = getPrototype(object);
        }
        return result;
      };
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
        getTag = function getTag(value) {
          var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined$1,
            ctorString = Ctor ? toSource(Ctor) : '';
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result;
        };
      }
      function getView(start, end, transforms) {
        var index = -1,
          length = transforms.length;
        while (++index < length) {
          var data = transforms[index],
            size = data.size;
          switch (data.type) {
            case 'drop':
              start += size;
              break;
            case 'dropRight':
              end -= size;
              break;
            case 'take':
              end = nativeMin(end, start + size);
              break;
            case 'takeRight':
              start = nativeMax(start, end - size);
              break;
          }
        }
        return {
          'start': start,
          'end': end
        };
      }
      function getWrapDetails(source) {
        var match = source.match(reWrapDetails);
        return match ? match[1].split(reSplitDetails) : [];
      }
      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);
        var index = -1,
          length = path.length,
          result = false;
        while (++index < length) {
          var key = toKey(path[index]);
          if (!(result = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result || ++index != length) {
          return result;
        }
        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
      }
      function initCloneArray(array) {
        var length = array.length,
          result = new array.constructor(length);
        if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
          result.index = array.index;
          result.input = array.input;
        }
        return result;
      }
      function initCloneObject(object) {
        return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);
          case boolTag:
          case dateTag:
            return new Ctor(+object);
          case dataViewTag:
            return cloneDataView(object, isDeep);
          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);
          case mapTag:
            return new Ctor();
          case numberTag:
          case stringTag:
            return new Ctor(object);
          case regexpTag:
            return cloneRegExp(object);
          case setTag:
            return new Ctor();
          case symbolTag:
            return cloneSymbol(object);
        }
      }
      function insertWrapDetails(source, details) {
        var length = details.length;
        if (!length) {
          return source;
        }
        var lastIndex = length - 1;
        details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
        details = details.join(length > 2 ? ', ' : ' ');
        return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
      }
      function isFlattenable(value) {
        return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
      }
      function isIterateeCall(value, index, object) {
        if (!isObject(object)) {
          return false;
        }
        var type = typeof index;
        if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
          return eq(object[index], value);
        }
        return false;
      }
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
      }
      function isLaziable(func) {
        var funcName = getFuncName(func),
          other = lodash[funcName];
        if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
          return false;
        }
        if (func === other) {
          return true;
        }
        var data = getData(other);
        return !!data && func === data[0];
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var isMaskable = coreJsData ? isFunction : stubFalse;
      function isPrototype(value) {
        var Ctor = value && value.constructor,
          proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
        return value === proto;
      }
      function isStrictComparable(value) {
        return value === value && !isObject(value);
      }
      function matchesStrictComparable(key, srcValue) {
        return function (object) {
          if (object == null) {
            return false;
          }
          return object[key] === srcValue && (srcValue !== undefined$1 || key in Object(object));
        };
      }
      function memoizeCapped(func) {
        var result = memoize(func, function (key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result.cache;
        return result;
      }
      function mergeData(data, source) {
        var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
        var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
        if (!(isCommon || isCombo)) {
          return data;
        }
        if (srcBitmask & WRAP_BIND_FLAG) {
          data[2] = source[2];
          newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
        }
        var value = source[3];
        if (value) {
          var partials = data[3];
          data[3] = partials ? composeArgs(partials, value, source[4]) : value;
          data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
        }
        value = source[5];
        if (value) {
          partials = data[5];
          data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
          data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
        }
        value = source[7];
        if (value) {
          data[7] = value;
        }
        if (srcBitmask & WRAP_ARY_FLAG) {
          data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
        }
        if (data[9] == null) {
          data[9] = source[9];
        }
        data[0] = source[0];
        data[1] = newBitmask;
        return data;
      }
      function nativeKeysIn(object) {
        var result = [];
        if (object != null) {
          for (var key in Object(object)) {
            result.push(key);
          }
        }
        return result;
      }
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      function overRest(func, start, transform) {
        start = nativeMax(start === undefined$1 ? func.length - 1 : start, 0);
        return function () {
          var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);
          while (++index < length) {
            array[index] = args[start + index];
          }
          index = -1;
          var otherArgs = Array(start + 1);
          while (++index < start) {
            otherArgs[index] = args[index];
          }
          otherArgs[start] = transform(array);
          return apply(func, this, otherArgs);
        };
      }
      function parent(object, path) {
        return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
      }
      function reorder(array, indexes) {
        var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);
        while (length--) {
          var index = indexes[length];
          array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined$1;
        }
        return array;
      }
      function safeGet(object, key) {
        if (key === 'constructor' && typeof object[key] === 'function') {
          return;
        }
        if (key == '__proto__') {
          return;
        }
        return object[key];
      }
      var setData = shortOut(baseSetData);
      var setTimeout = ctxSetTimeout || function (func, wait) {
        return root.setTimeout(func, wait);
      };
      var setToString = shortOut(baseSetToString);
      function setWrapToString(wrapper, reference, bitmask) {
        var source = reference + '';
        return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
      }
      function shortOut(func) {
        var count = 0,
          lastCalled = 0;
        return function () {
          var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(undefined$1, arguments);
        };
      }
      function shuffleSelf(array, size) {
        var index = -1,
          length = array.length,
          lastIndex = length - 1;
        size = size === undefined$1 ? length : size;
        while (++index < size) {
          var rand = baseRandom(index, lastIndex),
            value = array[rand];
          array[rand] = array[index];
          array[index] = value;
        }
        array.length = size;
        return array;
      }
      var stringToPath = memoizeCapped(function (string) {
        var result = [];
        if (string.charCodeAt(0) === 46) {
          result.push('');
        }
        string.replace(rePropName, function (match, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
        });
        return result;
      });
      function toKey(value) {
        if (typeof value == 'string' || isSymbol(value)) {
          return value;
        }
        var result = value + '';
        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {}
          try {
            return func + '';
          } catch (e) {}
        }
        return '';
      }
      function updateWrapDetails(details, bitmask) {
        arrayEach(wrapFlags, function (pair) {
          var value = '_.' + pair[0];
          if (bitmask & pair[1] && !arrayIncludes(details, value)) {
            details.push(value);
          }
        });
        return details.sort();
      }
      function wrapperClone(wrapper) {
        if (wrapper instanceof LazyWrapper) {
          return wrapper.clone();
        }
        var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
        result.__actions__ = copyArray(wrapper.__actions__);
        result.__index__ = wrapper.__index__;
        result.__values__ = wrapper.__values__;
        return result;
      }
      function chunk(array, size, guard) {
        if (guard ? isIterateeCall(array, size, guard) : size === undefined$1) {
          size = 1;
        } else {
          size = nativeMax(toInteger(size), 0);
        }
        var length = array == null ? 0 : array.length;
        if (!length || size < 1) {
          return [];
        }
        var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));
        while (index < length) {
          result[resIndex++] = baseSlice(array, index, index += size);
        }
        return result;
      }
      function compact(array) {
        var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];
        while (++index < length) {
          var value = array[index];
          if (value) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function concat() {
        var length = arguments.length;
        if (!length) {
          return [];
        }
        var args = Array(length - 1),
          array = arguments[0],
          index = length;
        while (index--) {
          args[index - 1] = arguments[index];
        }
        return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
      }
      var difference = baseRest(function (array, values) {
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
      });
      var differenceBy = baseRest(function (array, values) {
        var iteratee = last(values);
        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2)) : [];
      });
      var differenceWith = baseRest(function (array, values) {
        var comparator = last(values);
        if (isArrayLikeObject(comparator)) {
          comparator = undefined$1;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined$1, comparator) : [];
      });
      function drop(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        return baseSlice(array, n < 0 ? 0 : n, length);
      }
      function dropRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }
      function dropRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
      }
      function dropWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
      }
      function fill(array, value, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
          start = 0;
          end = length;
        }
        return baseFill(array, value, start, end);
      }
      function findIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax(length + index, 0);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index);
      }
      function findLastIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length - 1;
        if (fromIndex !== undefined$1) {
          index = toInteger(fromIndex);
          index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index, true);
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, 1) : [];
      }
      function flattenDeep(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, INFINITY) : [];
      }
      function flattenDepth(array, depth) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(array, depth);
      }
      function fromPairs(pairs) {
        var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};
        while (++index < length) {
          var pair = pairs[index];
          result[pair[0]] = pair[1];
        }
        return result;
      }
      function head(array) {
        return array && array.length ? array[0] : undefined$1;
      }
      function indexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax(length + index, 0);
        }
        return baseIndexOf(array, value, index);
      }
      function initial(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 0, -1) : [];
      }
      var intersection = baseRest(function (arrays) {
        var mapped = arrayMap(arrays, castArrayLikeObject);
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
      });
      var intersectionBy = baseRest(function (arrays) {
        var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);
        if (iteratee === last(mapped)) {
          iteratee = undefined$1;
        } else {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee, 2)) : [];
      });
      var intersectionWith = baseRest(function (arrays) {
        var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        if (comparator) {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined$1, comparator) : [];
      });
      function join(array, separator) {
        return array == null ? '' : nativeJoin.call(array, separator);
      }
      function last(array) {
        var length = array == null ? 0 : array.length;
        return length ? array[length - 1] : undefined$1;
      }
      function lastIndexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length;
        if (fromIndex !== undefined$1) {
          index = toInteger(fromIndex);
          index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
        }
        return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
      }
      function nth(array, n) {
        return array && array.length ? baseNth(array, toInteger(n)) : undefined$1;
      }
      var pull = baseRest(pullAll);
      function pullAll(array, values) {
        return array && array.length && values && values.length ? basePullAll(array, values) : array;
      }
      function pullAllBy(array, values, iteratee) {
        return array && array.length && values && values.length ? basePullAll(array, values, getIteratee(iteratee, 2)) : array;
      }
      function pullAllWith(array, values, comparator) {
        return array && array.length && values && values.length ? basePullAll(array, values, undefined$1, comparator) : array;
      }
      var pullAt = flatRest(function (array, indexes) {
        var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);
        basePullAt(array, arrayMap(indexes, function (index) {
          return isIndex(index, length) ? +index : index;
        }).sort(compareAscending));
        return result;
      });
      function remove(array, predicate) {
        var result = [];
        if (!(array && array.length)) {
          return result;
        }
        var index = -1,
          indexes = [],
          length = array.length;
        predicate = getIteratee(predicate, 3);
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result.push(value);
            indexes.push(index);
          }
        }
        basePullAt(array, indexes);
        return result;
      }
      function reverse(array) {
        return array == null ? array : nativeReverse.call(array);
      }
      function slice(array, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
          start = 0;
          end = length;
        } else {
          start = start == null ? 0 : toInteger(start);
          end = end === undefined$1 ? length : toInteger(end);
        }
        return baseSlice(array, start, end);
      }
      function sortedIndex(array, value) {
        return baseSortedIndex(array, value);
      }
      function sortedIndexBy(array, value, iteratee) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
      }
      function sortedIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index = baseSortedIndex(array, value);
          if (index < length && eq(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function sortedLastIndex(array, value) {
        return baseSortedIndex(array, value, true);
      }
      function sortedLastIndexBy(array, value, iteratee) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
      }
      function sortedLastIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index = baseSortedIndex(array, value, true) - 1;
          if (eq(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function sortedUniq(array) {
        return array && array.length ? baseSortedUniq(array) : [];
      }
      function sortedUniqBy(array, iteratee) {
        return array && array.length ? baseSortedUniq(array, getIteratee(iteratee, 2)) : [];
      }
      function tail(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 1, length) : [];
      }
      function take(array, n, guard) {
        if (!(array && array.length)) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }
      function takeRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, n < 0 ? 0 : n, length);
      }
      function takeRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
      }
      function takeWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
      }
      var union = baseRest(function (arrays) {
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
      });
      var unionBy = baseRest(function (arrays) {
        var iteratee = last(arrays);
        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
      });
      var unionWith = baseRest(function (arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator);
      });
      function uniq(array) {
        return array && array.length ? baseUniq(array) : [];
      }
      function uniqBy(array, iteratee) {
        return array && array.length ? baseUniq(array, getIteratee(iteratee, 2)) : [];
      }
      function uniqWith(array, comparator) {
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return array && array.length ? baseUniq(array, undefined$1, comparator) : [];
      }
      function unzip(array) {
        if (!(array && array.length)) {
          return [];
        }
        var length = 0;
        array = arrayFilter(array, function (group) {
          if (isArrayLikeObject(group)) {
            length = nativeMax(group.length, length);
            return true;
          }
        });
        return baseTimes(length, function (index) {
          return arrayMap(array, baseProperty(index));
        });
      }
      function unzipWith(array, iteratee) {
        if (!(array && array.length)) {
          return [];
        }
        var result = unzip(array);
        if (iteratee == null) {
          return result;
        }
        return arrayMap(result, function (group) {
          return apply(iteratee, undefined$1, group);
        });
      }
      var without = baseRest(function (array, values) {
        return isArrayLikeObject(array) ? baseDifference(array, values) : [];
      });
      var xor = baseRest(function (arrays) {
        return baseXor(arrayFilter(arrays, isArrayLikeObject));
      });
      var xorBy = baseRest(function (arrays) {
        var iteratee = last(arrays);
        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }
        return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
      });
      var xorWith = baseRest(function (arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator);
      });
      var zip = baseRest(unzip);
      function zipObject(props, values) {
        return baseZipObject(props || [], values || [], assignValue);
      }
      function zipObjectDeep(props, values) {
        return baseZipObject(props || [], values || [], baseSet);
      }
      var zipWith = baseRest(function (arrays) {
        var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined$1;
        iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined$1;
        return unzipWith(arrays, iteratee);
      });
      function chain(value) {
        var result = lodash(value);
        result.__chain__ = true;
        return result;
      }
      function tap(value, interceptor) {
        interceptor(value);
        return value;
      }
      function thru(value, interceptor) {
        return interceptor(value);
      }
      var wrapperAt = flatRest(function (paths) {
        var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function interceptor(object) {
            return baseAt(object, paths);
          };
        if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
          return this.thru(interceptor);
        }
        value = value.slice(start, +start + (length ? 1 : 0));
        value.__actions__.push({
          'func': thru,
          'args': [interceptor],
          'thisArg': undefined$1
        });
        return new LodashWrapper(value, this.__chain__).thru(function (array) {
          if (length && !array.length) {
            array.push(undefined$1);
          }
          return array;
        });
      });
      function wrapperChain() {
        return chain(this);
      }
      function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
      }
      function wrapperNext() {
        if (this.__values__ === undefined$1) {
          this.__values__ = toArray(this.value());
        }
        var done = this.__index__ >= this.__values__.length,
          value = done ? undefined$1 : this.__values__[this.__index__++];
        return {
          'done': done,
          'value': value
        };
      }
      function wrapperToIterator() {
        return this;
      }
      function wrapperPlant(value) {
        var result,
          parent = this;
        while (parent instanceof baseLodash) {
          var clone = wrapperClone(parent);
          clone.__index__ = 0;
          clone.__values__ = undefined$1;
          if (result) {
            previous.__wrapped__ = clone;
          } else {
            result = clone;
          }
          var previous = clone;
          parent = parent.__wrapped__;
        }
        previous.__wrapped__ = value;
        return result;
      }
      function wrapperReverse() {
        var value = this.__wrapped__;
        if (value instanceof LazyWrapper) {
          var wrapped = value;
          if (this.__actions__.length) {
            wrapped = new LazyWrapper(this);
          }
          wrapped = wrapped.reverse();
          wrapped.__actions__.push({
            'func': thru,
            'args': [reverse],
            'thisArg': undefined$1
          });
          return new LodashWrapper(wrapped, this.__chain__);
        }
        return this.thru(reverse);
      }
      function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
      }
      var countBy = createAggregator(function (result, value, key) {
        if (hasOwnProperty.call(result, key)) {
          ++result[key];
        } else {
          baseAssignValue(result, key, 1);
        }
      });
      function every(collection, predicate, guard) {
        var func = isArray(collection) ? arrayEvery : baseEvery;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      function filter(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, getIteratee(predicate, 3));
      }
      var find = createFind(findIndex);
      var findLast = createFind(findLastIndex);
      function flatMap(collection, iteratee) {
        return baseFlatten(map(collection, iteratee), 1);
      }
      function flatMapDeep(collection, iteratee) {
        return baseFlatten(map(collection, iteratee), INFINITY);
      }
      function flatMapDepth(collection, iteratee, depth) {
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(map(collection, iteratee), depth);
      }
      function forEach(collection, iteratee) {
        var func = isArray(collection) ? arrayEach : baseEach;
        return func(collection, getIteratee(iteratee, 3));
      }
      function forEachRight(collection, iteratee) {
        var func = isArray(collection) ? arrayEachRight : baseEachRight;
        return func(collection, getIteratee(iteratee, 3));
      }
      var groupBy = createAggregator(function (result, value, key) {
        if (hasOwnProperty.call(result, key)) {
          result[key].push(value);
        } else {
          baseAssignValue(result, key, [value]);
        }
      });
      function includes(collection, value, fromIndex, guard) {
        collection = isArrayLike(collection) ? collection : values(collection);
        fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
        var length = collection.length;
        if (fromIndex < 0) {
          fromIndex = nativeMax(length + fromIndex, 0);
        }
        return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
      }
      var invokeMap = baseRest(function (collection, path, args) {
        var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];
        baseEach(collection, function (value) {
          result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
        });
        return result;
      });
      var keyBy = createAggregator(function (result, value, key) {
        baseAssignValue(result, key, value);
      });
      function map(collection, iteratee) {
        var func = isArray(collection) ? arrayMap : baseMap;
        return func(collection, getIteratee(iteratee, 3));
      }
      function orderBy(collection, iteratees, orders, guard) {
        if (collection == null) {
          return [];
        }
        if (!isArray(iteratees)) {
          iteratees = iteratees == null ? [] : [iteratees];
        }
        orders = guard ? undefined$1 : orders;
        if (!isArray(orders)) {
          orders = orders == null ? [] : [orders];
        }
        return baseOrderBy(collection, iteratees, orders);
      }
      var partition = createAggregator(function (result, value, key) {
        result[key ? 0 : 1].push(value);
      }, function () {
        return [[], []];
      });
      function reduce(collection, iteratee, accumulator) {
        var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
      }
      function reduceRight(collection, iteratee, accumulator) {
        var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
      }
      function reject(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, negate(getIteratee(predicate, 3)));
      }
      function sample(collection) {
        var func = isArray(collection) ? arraySample : baseSample;
        return func(collection);
      }
      function sampleSize(collection, n, guard) {
        if (guard ? isIterateeCall(collection, n, guard) : n === undefined$1) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        var func = isArray(collection) ? arraySampleSize : baseSampleSize;
        return func(collection, n);
      }
      function shuffle(collection) {
        var func = isArray(collection) ? arrayShuffle : baseShuffle;
        return func(collection);
      }
      function size(collection) {
        if (collection == null) {
          return 0;
        }
        if (isArrayLike(collection)) {
          return isString(collection) ? stringSize(collection) : collection.length;
        }
        var tag = getTag(collection);
        if (tag == mapTag || tag == setTag) {
          return collection.size;
        }
        return baseKeys(collection).length;
      }
      function some(collection, predicate, guard) {
        var func = isArray(collection) ? arraySome : baseSome;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      var sortBy = baseRest(function (collection, iteratees) {
        if (collection == null) {
          return [];
        }
        var length = iteratees.length;
        if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
          iteratees = [];
        } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
          iteratees = [iteratees[0]];
        }
        return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
      });
      var now = ctxNow || function () {
        return root.Date.now();
      };
      function after(n, func) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function () {
          if (--n < 1) {
            return func.apply(this, arguments);
          }
        };
      }
      function ary(func, n, guard) {
        n = guard ? undefined$1 : n;
        n = func && n == null ? func.length : n;
        return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n);
      }
      function before(n, func) {
        var result;
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function () {
          if (--n > 0) {
            result = func.apply(this, arguments);
          }
          if (n <= 1) {
            func = undefined$1;
          }
          return result;
        };
      }
      var bind = baseRest(function (func, thisArg, partials) {
        var bitmask = WRAP_BIND_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bind));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(func, bitmask, thisArg, partials, holders);
      });
      var bindKey = baseRest(function (object, key, partials) {
        var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bindKey));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(key, bitmask, object, partials, holders);
      });
      function curry(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
        result.placeholder = curry.placeholder;
        return result;
      }
      function curryRight(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
        result.placeholder = curryRight.placeholder;
        return result;
      }
      function debounce(func, wait, options) {
        var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = 'maxWait' in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = 'trailing' in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs,
            thisArg = lastThis;
          lastArgs = lastThis = undefined$1;
          lastInvokeTime = time;
          result = func.apply(thisArg, args);
          return result;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === undefined$1 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time = now();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
          timerId = undefined$1;
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = undefined$1;
          return result;
        }
        function cancel() {
          if (timerId !== undefined$1) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = undefined$1;
        }
        function flush() {
          return timerId === undefined$1 ? result : trailingEdge(now());
        }
        function debounced() {
          var time = now(),
            isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;
          if (isInvoking) {
            if (timerId === undefined$1) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              clearTimeout(timerId);
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === undefined$1) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      var defer = baseRest(function (func, args) {
        return baseDelay(func, 1, args);
      });
      var delay = baseRest(function (func, wait, args) {
        return baseDelay(func, toNumber(wait) || 0, args);
      });
      function flip(func) {
        return createWrap(func, WRAP_FLIP_FLAG);
      }
      function memoize(func, resolver) {
        if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var memoized = function memoized() {
          var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result) || cache;
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      function negate(predicate) {
        if (typeof predicate != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return function () {
          var args = arguments;
          switch (args.length) {
            case 0:
              return !predicate.call(this);
            case 1:
              return !predicate.call(this, args[0]);
            case 2:
              return !predicate.call(this, args[0], args[1]);
            case 3:
              return !predicate.call(this, args[0], args[1], args[2]);
          }
          return !predicate.apply(this, args);
        };
      }
      function once(func) {
        return before(2, func);
      }
      var overArgs = castRest(function (func, transforms) {
        transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
        var funcsLength = transforms.length;
        return baseRest(function (args) {
          var index = -1,
            length = nativeMin(args.length, funcsLength);
          while (++index < length) {
            args[index] = transforms[index].call(this, args[index]);
          }
          return apply(func, this, args);
        });
      });
      var partial = baseRest(function (func, partials) {
        var holders = replaceHolders(partials, getHolder(partial));
        return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
      });
      var partialRight = baseRest(function (func, partials) {
        var holders = replaceHolders(partials, getHolder(partialRight));
        return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
      });
      var rearg = flatRest(function (func, indexes) {
        return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
      });
      function rest(func, start) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        start = start === undefined$1 ? start : toInteger(start);
        return baseRest(func, start);
      }
      function spread(func, start) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        start = start == null ? 0 : nativeMax(toInteger(start), 0);
        return baseRest(function (args) {
          var array = args[start],
            otherArgs = castSlice(args, 0, start);
          if (array) {
            arrayPush(otherArgs, array);
          }
          return apply(func, this, otherArgs);
        });
      }
      function throttle(func, wait, options) {
        var leading = true,
          trailing = true;
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (isObject(options)) {
          leading = 'leading' in options ? !!options.leading : leading;
          trailing = 'trailing' in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {
          'leading': leading,
          'maxWait': wait,
          'trailing': trailing
        });
      }
      function unary(func) {
        return ary(func, 1);
      }
      function wrap(value, wrapper) {
        return partial(castFunction(wrapper), value);
      }
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value = arguments[0];
        return isArray(value) ? value : [value];
      }
      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG);
      }
      function cloneWith(value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
      }
      function cloneDeep(value) {
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
      }
      function cloneDeepWith(value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
      }
      function conformsTo(object, source) {
        return source == null || baseConformsTo(object, source, keys(source));
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var gt = createRelationalOperation(baseGt);
      var gte = createRelationalOperation(function (value, other) {
        return value >= other;
      });
      var isArguments = baseIsArguments(function () {
        return arguments;
      }()) ? baseIsArguments : function (value) {
        return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
      };
      var isArray = Array.isArray;
      var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }
      function isBoolean(value) {
        return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
      }
      var isBuffer = nativeIsBuffer || stubFalse;
      var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
      function isElement(value) {
        return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
      }
      function isEmpty(value) {
        if (value == null) {
          return true;
        }
        if (isArrayLike(value) && (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
          return !value.length;
        }
        var tag = getTag(value);
        if (tag == mapTag || tag == setTag) {
          return !value.size;
        }
        if (isPrototype(value)) {
          return !baseKeys(value).length;
        }
        for (var key in value) {
          if (hasOwnProperty.call(value, key)) {
            return false;
          }
        }
        return true;
      }
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }
      function isEqualWith(value, other, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        var result = customizer ? customizer(value, other) : undefined$1;
        return result === undefined$1 ? baseIsEqual(value, other, undefined$1, customizer) : !!result;
      }
      function isError(value) {
        if (!isObjectLike(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == errorTag || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value);
      }
      function isFinite(value) {
        return typeof value == 'number' && nativeIsFinite(value);
      }
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      function isInteger(value) {
        return typeof value == 'number' && value == toInteger(value);
      }
      function isLength(value) {
        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == 'object' || type == 'function');
      }
      function isObjectLike(value) {
        return value != null && typeof value == 'object';
      }
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      function isMatch(object, source) {
        return object === source || baseIsMatch(object, source, getMatchData(source));
      }
      function isMatchWith(object, source, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseIsMatch(object, source, getMatchData(source), customizer);
      }
      function isNaN(value) {
        return isNumber(value) && value != +value;
      }
      function isNative(value) {
        if (isMaskable(value)) {
          throw new Error(CORE_ERROR_TEXT);
        }
        return baseIsNative(value);
      }
      function isNull(value) {
        return value === null;
      }
      function isNil(value) {
        return value == null;
      }
      function isNumber(value) {
        return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag;
      }
      function isPlainObject(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
          return false;
        }
        var proto = getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
        return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }
      var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
      function isSafeInteger(value) {
        return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
      }
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      function isString(value) {
        return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
      }
      function isSymbol(value) {
        return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      function isUndefined(value) {
        return value === undefined$1;
      }
      function isWeakMap(value) {
        return isObjectLike(value) && getTag(value) == weakMapTag;
      }
      function isWeakSet(value) {
        return isObjectLike(value) && baseGetTag(value) == weakSetTag;
      }
      var lt = createRelationalOperation(baseLt);
      var lte = createRelationalOperation(function (value, other) {
        return value <= other;
      });
      function toArray(value) {
        if (!value) {
          return [];
        }
        if (isArrayLike(value)) {
          return isString(value) ? stringToArray(value) : copyArray(value);
        }
        if (symIterator && value[symIterator]) {
          return iteratorToArray(value[symIterator]());
        }
        var tag = getTag(value),
          func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
        return func(value);
      }
      function toFinite(value) {
        if (!value) {
          return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY || value === -INFINITY) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      }
      function toInteger(value) {
        var result = toFinite(value),
          remainder = result % 1;
        return result === result ? remainder ? result - remainder : result : 0;
      }
      function toLength(value) {
        return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
      }
      function toNumber(value) {
        if (typeof value == 'number') {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        if (isObject(value)) {
          var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
          value = isObject(other) ? other + '' : other;
        }
        if (typeof value != 'string') {
          return value === 0 ? value : +value;
        }
        value = baseTrim(value);
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }
      function toPlainObject(value) {
        return copyObject(value, keysIn(value));
      }
      function toSafeInteger(value) {
        return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
      }
      function toString(value) {
        return value == null ? '' : baseToString(value);
      }
      var assign = createAssigner(function (object, source) {
        if (isPrototype(source) || isArrayLike(source)) {
          copyObject(source, keys(source), object);
          return;
        }
        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            assignValue(object, key, source[key]);
          }
        }
      });
      var assignIn = createAssigner(function (object, source) {
        copyObject(source, keysIn(source), object);
      });
      var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
        copyObject(source, keysIn(source), object, customizer);
      });
      var assignWith = createAssigner(function (object, source, srcIndex, customizer) {
        copyObject(source, keys(source), object, customizer);
      });
      var at = flatRest(baseAt);
      function create(prototype, properties) {
        var result = baseCreate(prototype);
        return properties == null ? result : baseAssign(result, properties);
      }
      var defaults = baseRest(function (object, sources) {
        object = Object(object);
        var index = -1;
        var length = sources.length;
        var guard = length > 2 ? sources[2] : undefined$1;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          var props = keysIn(source);
          var propsIndex = -1;
          var propsLength = props.length;
          while (++propsIndex < propsLength) {
            var key = props[propsIndex];
            var value = object[key];
            if (value === undefined$1 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
              object[key] = source[key];
            }
          }
        }
        return object;
      });
      var defaultsDeep = baseRest(function (args) {
        args.push(undefined$1, customDefaultsMerge);
        return apply(mergeWith, undefined$1, args);
      });
      function findKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
      }
      function findLastKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
      }
      function forIn(object, iteratee) {
        return object == null ? object : baseFor(object, getIteratee(iteratee, 3), keysIn);
      }
      function forInRight(object, iteratee) {
        return object == null ? object : baseForRight(object, getIteratee(iteratee, 3), keysIn);
      }
      function forOwn(object, iteratee) {
        return object && baseForOwn(object, getIteratee(iteratee, 3));
      }
      function forOwnRight(object, iteratee) {
        return object && baseForOwnRight(object, getIteratee(iteratee, 3));
      }
      function functions(object) {
        return object == null ? [] : baseFunctions(object, keys(object));
      }
      function functionsIn(object) {
        return object == null ? [] : baseFunctions(object, keysIn(object));
      }
      function get(object, path, defaultValue) {
        var result = object == null ? undefined$1 : baseGet(object, path);
        return result === undefined$1 ? defaultValue : result;
      }
      function has(object, path) {
        return object != null && hasPath(object, path, baseHas);
      }
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }
      var invert = createInverter(function (result, value, key) {
        if (value != null && typeof value.toString != 'function') {
          value = nativeObjectToString.call(value);
        }
        result[value] = key;
      }, constant(identity));
      var invertBy = createInverter(function (result, value, key) {
        if (value != null && typeof value.toString != 'function') {
          value = nativeObjectToString.call(value);
        }
        if (hasOwnProperty.call(result, value)) {
          result[value].push(key);
        } else {
          result[value] = [key];
        }
      }, getIteratee);
      var invoke = baseRest(baseInvoke);
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
      }
      function mapKeys(object, iteratee) {
        var result = {};
        iteratee = getIteratee(iteratee, 3);
        baseForOwn(object, function (value, key, object) {
          baseAssignValue(result, iteratee(value, key, object), value);
        });
        return result;
      }
      function mapValues(object, iteratee) {
        var result = {};
        iteratee = getIteratee(iteratee, 3);
        baseForOwn(object, function (value, key, object) {
          baseAssignValue(result, key, iteratee(value, key, object));
        });
        return result;
      }
      var merge = createAssigner(function (object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });
      var mergeWith = createAssigner(function (object, source, srcIndex, customizer) {
        baseMerge(object, source, srcIndex, customizer);
      });
      var omit = flatRest(function (object, paths) {
        var result = {};
        if (object == null) {
          return result;
        }
        var isDeep = false;
        paths = arrayMap(paths, function (path) {
          path = castPath(path, object);
          isDeep || (isDeep = path.length > 1);
          return path;
        });
        copyObject(object, getAllKeysIn(object), result);
        if (isDeep) {
          result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
        }
        var length = paths.length;
        while (length--) {
          baseUnset(result, paths[length]);
        }
        return result;
      });
      function omitBy(object, predicate) {
        return pickBy(object, negate(getIteratee(predicate)));
      }
      var pick = flatRest(function (object, paths) {
        return object == null ? {} : basePick(object, paths);
      });
      function pickBy(object, predicate) {
        if (object == null) {
          return {};
        }
        var props = arrayMap(getAllKeysIn(object), function (prop) {
          return [prop];
        });
        predicate = getIteratee(predicate);
        return basePickBy(object, props, function (value, path) {
          return predicate(value, path[0]);
        });
      }
      function result(object, path, defaultValue) {
        path = castPath(path, object);
        var index = -1,
          length = path.length;
        if (!length) {
          length = 1;
          object = undefined$1;
        }
        while (++index < length) {
          var value = object == null ? undefined$1 : object[toKey(path[index])];
          if (value === undefined$1) {
            index = length;
            value = defaultValue;
          }
          object = isFunction(value) ? value.call(object) : value;
        }
        return object;
      }
      function set(object, path, value) {
        return object == null ? object : baseSet(object, path, value);
      }
      function setWith(object, path, value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return object == null ? object : baseSet(object, path, value, customizer);
      }
      var toPairs = createToPairs(keys);
      var toPairsIn = createToPairs(keysIn);
      function transform(object, iteratee, accumulator) {
        var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);
        iteratee = getIteratee(iteratee, 4);
        if (accumulator == null) {
          var Ctor = object && object.constructor;
          if (isArrLike) {
            accumulator = isArr ? new Ctor() : [];
          } else if (isObject(object)) {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
          } else {
            accumulator = {};
          }
        }
        (isArrLike ? arrayEach : baseForOwn)(object, function (value, index, object) {
          return iteratee(accumulator, value, index, object);
        });
        return accumulator;
      }
      function unset(object, path) {
        return object == null ? true : baseUnset(object, path);
      }
      function update(object, path, updater) {
        return object == null ? object : baseUpdate(object, path, castFunction(updater));
      }
      function updateWith(object, path, updater, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
      }
      function values(object) {
        return object == null ? [] : baseValues(object, keys(object));
      }
      function valuesIn(object) {
        return object == null ? [] : baseValues(object, keysIn(object));
      }
      function clamp(number, lower, upper) {
        if (upper === undefined$1) {
          upper = lower;
          lower = undefined$1;
        }
        if (upper !== undefined$1) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }
        if (lower !== undefined$1) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }
        return baseClamp(toNumber(number), lower, upper);
      }
      function inRange(number, start, end) {
        start = toFinite(start);
        if (end === undefined$1) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        number = toNumber(number);
        return baseInRange(number, start, end);
      }
      function random(lower, upper, floating) {
        if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
          upper = floating = undefined$1;
        }
        if (floating === undefined$1) {
          if (typeof upper == 'boolean') {
            floating = upper;
            upper = undefined$1;
          } else if (typeof lower == 'boolean') {
            floating = lower;
            lower = undefined$1;
          }
        }
        if (lower === undefined$1 && upper === undefined$1) {
          lower = 0;
          upper = 1;
        } else {
          lower = toFinite(lower);
          if (upper === undefined$1) {
            upper = lower;
            lower = 0;
          } else {
            upper = toFinite(upper);
          }
        }
        if (lower > upper) {
          var temp = lower;
          lower = upper;
          upper = temp;
        }
        if (floating || lower % 1 || upper % 1) {
          var rand = nativeRandom();
          return nativeMin(lower + rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1))), upper);
        }
        return baseRandom(lower, upper);
      }
      var camelCase = createCompounder(function (result, word, index) {
        word = word.toLowerCase();
        return result + (index ? capitalize(word) : word);
      });
      function capitalize(string) {
        return upperFirst(toString(string).toLowerCase());
      }
      function deburr(string) {
        string = toString(string);
        return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
      }
      function endsWith(string, target, position) {
        string = toString(string);
        target = baseToString(target);
        var length = string.length;
        position = position === undefined$1 ? length : baseClamp(toInteger(position), 0, length);
        var end = position;
        position -= target.length;
        return position >= 0 && string.slice(position, end) == target;
      }
      function escape(string) {
        string = toString(string);
        return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
      }
      function escapeRegExp(string) {
        string = toString(string);
        return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
      }
      var kebabCase = createCompounder(function (result, word, index) {
        return result + (index ? '-' : '') + word.toLowerCase();
      });
      var lowerCase = createCompounder(function (result, word, index) {
        return result + (index ? ' ' : '') + word.toLowerCase();
      });
      var lowerFirst = createCaseFirst('toLowerCase');
      function pad(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        if (!length || strLength >= length) {
          return string;
        }
        var mid = (length - strLength) / 2;
        return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
      }
      function padEnd(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
      }
      function padStart(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
      }
      function parseInt(string, radix, guard) {
        if (guard || radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }
        return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
      }
      function repeat(string, n, guard) {
        if (guard ? isIterateeCall(string, n, guard) : n === undefined$1) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        return baseRepeat(toString(string), n);
      }
      function replace() {
        var args = arguments,
          string = toString(args[0]);
        return args.length < 3 ? string : string.replace(args[1], args[2]);
      }
      var snakeCase = createCompounder(function (result, word, index) {
        return result + (index ? '_' : '') + word.toLowerCase();
      });
      function split(string, separator, limit) {
        if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
          separator = limit = undefined$1;
        }
        limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
        if (!limit) {
          return [];
        }
        string = toString(string);
        if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
          separator = baseToString(separator);
          if (!separator && hasUnicode(string)) {
            return castSlice(stringToArray(string), 0, limit);
          }
        }
        return string.split(separator, limit);
      }
      var startCase = createCompounder(function (result, word, index) {
        return result + (index ? ' ' : '') + upperFirst(word);
      });
      function startsWith(string, target, position) {
        string = toString(string);
        position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
        target = baseToString(target);
        return string.slice(position, position + target.length) == target;
      }
      function template(string, options, guard) {
        var settings = lodash.templateSettings;
        if (guard && isIterateeCall(string, options, guard)) {
          options = undefined$1;
        }
        string = toString(string);
        options = assignInWith({}, options, settings, customDefaultsAssignIn);
        var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);
        var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";
        var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
        var sourceURL = '//# sourceURL=' + (hasOwnProperty.call(options, 'sourceURL') ? (options.sourceURL + '').replace(/\s/g, ' ') : 'lodash.templateSources[' + ++templateCounter + ']') + '\n';
        string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
          interpolateValue || (interpolateValue = esTemplateValue);
          source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
          if (escapeValue) {
            isEscaping = true;
            source += "' +\n__e(" + escapeValue + ") +\n'";
          }
          if (evaluateValue) {
            isEvaluating = true;
            source += "';\n" + evaluateValue + ";\n__p += '";
          }
          if (interpolateValue) {
            source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
          }
          index = offset + match.length;
          return match;
        });
        source += "';\n";
        var variable = hasOwnProperty.call(options, 'variable') && options.variable;
        if (!variable) {
          source = 'with (obj) {\n' + source + '\n}\n';
        } else if (reForbiddenIdentifierChars.test(variable)) {
          throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
        }
        source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
        source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
        var result = attempt(function () {
          return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined$1, importsValues);
        });
        result.source = source;
        if (isError(result)) {
          throw result;
        }
        return result;
      }
      function toLower(value) {
        return toString(value).toLowerCase();
      }
      function toUpper(value) {
        return toString(value).toUpperCase();
      }
      function trim(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return baseTrim(string);
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start, end).join('');
      }
      function trimEnd(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return string.slice(0, trimmedEndIndex(string) + 1);
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
        return castSlice(strSymbols, 0, end).join('');
      }
      function trimStart(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrimStart, '');
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));
        return castSlice(strSymbols, start).join('');
      }
      function truncate(string, options) {
        var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;
        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? toInteger(options.length) : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        }
        string = toString(string);
        var strLength = string.length;
        if (hasUnicode(string)) {
          var strSymbols = stringToArray(string);
          strLength = strSymbols.length;
        }
        if (length >= strLength) {
          return string;
        }
        var end = length - stringSize(omission);
        if (end < 1) {
          return omission;
        }
        var result = strSymbols ? castSlice(strSymbols, 0, end).join('') : string.slice(0, end);
        if (separator === undefined$1) {
          return result + omission;
        }
        if (strSymbols) {
          end += result.length - end;
        }
        if (isRegExp(separator)) {
          if (string.slice(end).search(separator)) {
            var match,
              substring = result;
            if (!separator.global) {
              separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
            }
            separator.lastIndex = 0;
            while (match = separator.exec(substring)) {
              var newEnd = match.index;
            }
            result = result.slice(0, newEnd === undefined$1 ? end : newEnd);
          }
        } else if (string.indexOf(baseToString(separator), end) != end) {
          var index = result.lastIndexOf(separator);
          if (index > -1) {
            result = result.slice(0, index);
          }
        }
        return result + omission;
      }
      function unescape(string) {
        string = toString(string);
        return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
      }
      var upperCase = createCompounder(function (result, word, index) {
        return result + (index ? ' ' : '') + word.toUpperCase();
      });
      var upperFirst = createCaseFirst('toUpperCase');
      function words(string, pattern, guard) {
        string = toString(string);
        pattern = guard ? undefined$1 : pattern;
        if (pattern === undefined$1) {
          return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
        }
        return string.match(pattern) || [];
      }
      var attempt = baseRest(function (func, args) {
        try {
          return apply(func, undefined$1, args);
        } catch (e) {
          return isError(e) ? e : new Error(e);
        }
      });
      var bindAll = flatRest(function (object, methodNames) {
        arrayEach(methodNames, function (key) {
          key = toKey(key);
          baseAssignValue(object, key, bind(object[key], object));
        });
        return object;
      });
      function cond(pairs) {
        var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();
        pairs = !length ? [] : arrayMap(pairs, function (pair) {
          if (typeof pair[1] != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          return [toIteratee(pair[0]), pair[1]];
        });
        return baseRest(function (args) {
          var index = -1;
          while (++index < length) {
            var pair = pairs[index];
            if (apply(pair[0], this, args)) {
              return apply(pair[1], this, args);
            }
          }
        });
      }
      function conforms(source) {
        return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
      }
      function constant(value) {
        return function () {
          return value;
        };
      }
      function defaultTo(value, defaultValue) {
        return value == null || value !== value ? defaultValue : value;
      }
      var flow = createFlow();
      var flowRight = createFlow(true);
      function identity(value) {
        return value;
      }
      function iteratee(func) {
        return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
      }
      function matches(source) {
        return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
      }
      function matchesProperty(path, srcValue) {
        return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
      }
      var method = baseRest(function (path, args) {
        return function (object) {
          return baseInvoke(object, path, args);
        };
      });
      var methodOf = baseRest(function (object, args) {
        return function (path) {
          return baseInvoke(object, path, args);
        };
      });
      function mixin(object, source, options) {
        var props = keys(source),
          methodNames = baseFunctions(source, props);
        if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
          options = source;
          source = object;
          object = this;
          methodNames = baseFunctions(source, keys(source));
        }
        var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);
        arrayEach(methodNames, function (methodName) {
          var func = source[methodName];
          object[methodName] = func;
          if (isFunc) {
            object.prototype[methodName] = function () {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);
                actions.push({
                  'func': func,
                  'args': arguments,
                  'thisArg': object
                });
                result.__chain__ = chainAll;
                return result;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }
        });
        return object;
      }
      function noConflict() {
        if (root._ === this) {
          root._ = oldDash;
        }
        return this;
      }
      function noop() {}
      function nthArg(n) {
        n = toInteger(n);
        return baseRest(function (args) {
          return baseNth(args, n);
        });
      }
      var over = createOver(arrayMap);
      var overEvery = createOver(arrayEvery);
      var overSome = createOver(arraySome);
      function property(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
      }
      function propertyOf(object) {
        return function (path) {
          return object == null ? undefined$1 : baseGet(object, path);
        };
      }
      var range = createRange();
      var rangeRight = createRange(true);
      function stubArray() {
        return [];
      }
      function stubFalse() {
        return false;
      }
      function stubObject() {
        return {};
      }
      function stubString() {
        return '';
      }
      function stubTrue() {
        return true;
      }
      function times(n, iteratee) {
        n = toInteger(n);
        if (n < 1 || n > MAX_SAFE_INTEGER) {
          return [];
        }
        var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);
        iteratee = getIteratee(iteratee);
        n -= MAX_ARRAY_LENGTH;
        var result = baseTimes(length, iteratee);
        while (++index < n) {
          iteratee(index);
        }
        return result;
      }
      function toPath(value) {
        if (isArray(value)) {
          return arrayMap(value, toKey);
        }
        return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
      }
      function uniqueId(prefix) {
        var id = ++idCounter;
        return toString(prefix) + id;
      }
      var add = createMathOperation(function (augend, addend) {
        return augend + addend;
      }, 0);
      var ceil = createRound('ceil');
      var divide = createMathOperation(function (dividend, divisor) {
        return dividend / divisor;
      }, 1);
      var floor = createRound('floor');
      function max(array) {
        return array && array.length ? baseExtremum(array, identity, baseGt) : undefined$1;
      }
      function maxBy(array, iteratee) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseGt) : undefined$1;
      }
      function mean(array) {
        return baseMean(array, identity);
      }
      function meanBy(array, iteratee) {
        return baseMean(array, getIteratee(iteratee, 2));
      }
      function min(array) {
        return array && array.length ? baseExtremum(array, identity, baseLt) : undefined$1;
      }
      function minBy(array, iteratee) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseLt) : undefined$1;
      }
      var multiply = createMathOperation(function (multiplier, multiplicand) {
        return multiplier * multiplicand;
      }, 1);
      var round = createRound('round');
      var subtract = createMathOperation(function (minuend, subtrahend) {
        return minuend - subtrahend;
      }, 0);
      function sum(array) {
        return array && array.length ? baseSum(array, identity) : 0;
      }
      function sumBy(array, iteratee) {
        return array && array.length ? baseSum(array, getIteratee(iteratee, 2)) : 0;
      }
      lodash.after = after;
      lodash.ary = ary;
      lodash.assign = assign;
      lodash.assignIn = assignIn;
      lodash.assignInWith = assignInWith;
      lodash.assignWith = assignWith;
      lodash.at = at;
      lodash.before = before;
      lodash.bind = bind;
      lodash.bindAll = bindAll;
      lodash.bindKey = bindKey;
      lodash.castArray = castArray;
      lodash.chain = chain;
      lodash.chunk = chunk;
      lodash.compact = compact;
      lodash.concat = concat;
      lodash.cond = cond;
      lodash.conforms = conforms;
      lodash.constant = constant;
      lodash.countBy = countBy;
      lodash.create = create;
      lodash.curry = curry;
      lodash.curryRight = curryRight;
      lodash.debounce = debounce;
      lodash.defaults = defaults;
      lodash.defaultsDeep = defaultsDeep;
      lodash.defer = defer;
      lodash.delay = delay;
      lodash.difference = difference;
      lodash.differenceBy = differenceBy;
      lodash.differenceWith = differenceWith;
      lodash.drop = drop;
      lodash.dropRight = dropRight;
      lodash.dropRightWhile = dropRightWhile;
      lodash.dropWhile = dropWhile;
      lodash.fill = fill;
      lodash.filter = filter;
      lodash.flatMap = flatMap;
      lodash.flatMapDeep = flatMapDeep;
      lodash.flatMapDepth = flatMapDepth;
      lodash.flatten = flatten;
      lodash.flattenDeep = flattenDeep;
      lodash.flattenDepth = flattenDepth;
      lodash.flip = flip;
      lodash.flow = flow;
      lodash.flowRight = flowRight;
      lodash.fromPairs = fromPairs;
      lodash.functions = functions;
      lodash.functionsIn = functionsIn;
      lodash.groupBy = groupBy;
      lodash.initial = initial;
      lodash.intersection = intersection;
      lodash.intersectionBy = intersectionBy;
      lodash.intersectionWith = intersectionWith;
      lodash.invert = invert;
      lodash.invertBy = invertBy;
      lodash.invokeMap = invokeMap;
      lodash.iteratee = iteratee;
      lodash.keyBy = keyBy;
      lodash.keys = keys;
      lodash.keysIn = keysIn;
      lodash.map = map;
      lodash.mapKeys = mapKeys;
      lodash.mapValues = mapValues;
      lodash.matches = matches;
      lodash.matchesProperty = matchesProperty;
      lodash.memoize = memoize;
      lodash.merge = merge;
      lodash.mergeWith = mergeWith;
      lodash.method = method;
      lodash.methodOf = methodOf;
      lodash.mixin = mixin;
      lodash.negate = negate;
      lodash.nthArg = nthArg;
      lodash.omit = omit;
      lodash.omitBy = omitBy;
      lodash.once = once;
      lodash.orderBy = orderBy;
      lodash.over = over;
      lodash.overArgs = overArgs;
      lodash.overEvery = overEvery;
      lodash.overSome = overSome;
      lodash.partial = partial;
      lodash.partialRight = partialRight;
      lodash.partition = partition;
      lodash.pick = pick;
      lodash.pickBy = pickBy;
      lodash.property = property;
      lodash.propertyOf = propertyOf;
      lodash.pull = pull;
      lodash.pullAll = pullAll;
      lodash.pullAllBy = pullAllBy;
      lodash.pullAllWith = pullAllWith;
      lodash.pullAt = pullAt;
      lodash.range = range;
      lodash.rangeRight = rangeRight;
      lodash.rearg = rearg;
      lodash.reject = reject;
      lodash.remove = remove;
      lodash.rest = rest;
      lodash.reverse = reverse;
      lodash.sampleSize = sampleSize;
      lodash.set = set;
      lodash.setWith = setWith;
      lodash.shuffle = shuffle;
      lodash.slice = slice;
      lodash.sortBy = sortBy;
      lodash.sortedUniq = sortedUniq;
      lodash.sortedUniqBy = sortedUniqBy;
      lodash.split = split;
      lodash.spread = spread;
      lodash.tail = tail;
      lodash.take = take;
      lodash.takeRight = takeRight;
      lodash.takeRightWhile = takeRightWhile;
      lodash.takeWhile = takeWhile;
      lodash.tap = tap;
      lodash.throttle = throttle;
      lodash.thru = thru;
      lodash.toArray = toArray;
      lodash.toPairs = toPairs;
      lodash.toPairsIn = toPairsIn;
      lodash.toPath = toPath;
      lodash.toPlainObject = toPlainObject;
      lodash.transform = transform;
      lodash.unary = unary;
      lodash.union = union;
      lodash.unionBy = unionBy;
      lodash.unionWith = unionWith;
      lodash.uniq = uniq;
      lodash.uniqBy = uniqBy;
      lodash.uniqWith = uniqWith;
      lodash.unset = unset;
      lodash.unzip = unzip;
      lodash.unzipWith = unzipWith;
      lodash.update = update;
      lodash.updateWith = updateWith;
      lodash.values = values;
      lodash.valuesIn = valuesIn;
      lodash.without = without;
      lodash.words = words;
      lodash.wrap = wrap;
      lodash.xor = xor;
      lodash.xorBy = xorBy;
      lodash.xorWith = xorWith;
      lodash.zip = zip;
      lodash.zipObject = zipObject;
      lodash.zipObjectDeep = zipObjectDeep;
      lodash.zipWith = zipWith;
      lodash.entries = toPairs;
      lodash.entriesIn = toPairsIn;
      lodash.extend = assignIn;
      lodash.extendWith = assignInWith;
      mixin(lodash, lodash);
      lodash.add = add;
      lodash.attempt = attempt;
      lodash.camelCase = camelCase;
      lodash.capitalize = capitalize;
      lodash.ceil = ceil;
      lodash.clamp = clamp;
      lodash.clone = clone;
      lodash.cloneDeep = cloneDeep;
      lodash.cloneDeepWith = cloneDeepWith;
      lodash.cloneWith = cloneWith;
      lodash.conformsTo = conformsTo;
      lodash.deburr = deburr;
      lodash.defaultTo = defaultTo;
      lodash.divide = divide;
      lodash.endsWith = endsWith;
      lodash.eq = eq;
      lodash.escape = escape;
      lodash.escapeRegExp = escapeRegExp;
      lodash.every = every;
      lodash.find = find;
      lodash.findIndex = findIndex;
      lodash.findKey = findKey;
      lodash.findLast = findLast;
      lodash.findLastIndex = findLastIndex;
      lodash.findLastKey = findLastKey;
      lodash.floor = floor;
      lodash.forEach = forEach;
      lodash.forEachRight = forEachRight;
      lodash.forIn = forIn;
      lodash.forInRight = forInRight;
      lodash.forOwn = forOwn;
      lodash.forOwnRight = forOwnRight;
      lodash.get = get;
      lodash.gt = gt;
      lodash.gte = gte;
      lodash.has = has;
      lodash.hasIn = hasIn;
      lodash.head = head;
      lodash.identity = identity;
      lodash.includes = includes;
      lodash.indexOf = indexOf;
      lodash.inRange = inRange;
      lodash.invoke = invoke;
      lodash.isArguments = isArguments;
      lodash.isArray = isArray;
      lodash.isArrayBuffer = isArrayBuffer;
      lodash.isArrayLike = isArrayLike;
      lodash.isArrayLikeObject = isArrayLikeObject;
      lodash.isBoolean = isBoolean;
      lodash.isBuffer = isBuffer;
      lodash.isDate = isDate;
      lodash.isElement = isElement;
      lodash.isEmpty = isEmpty;
      lodash.isEqual = isEqual;
      lodash.isEqualWith = isEqualWith;
      lodash.isError = isError;
      lodash.isFinite = isFinite;
      lodash.isFunction = isFunction;
      lodash.isInteger = isInteger;
      lodash.isLength = isLength;
      lodash.isMap = isMap;
      lodash.isMatch = isMatch;
      lodash.isMatchWith = isMatchWith;
      lodash.isNaN = isNaN;
      lodash.isNative = isNative;
      lodash.isNil = isNil;
      lodash.isNull = isNull;
      lodash.isNumber = isNumber;
      lodash.isObject = isObject;
      lodash.isObjectLike = isObjectLike;
      lodash.isPlainObject = isPlainObject;
      lodash.isRegExp = isRegExp;
      lodash.isSafeInteger = isSafeInteger;
      lodash.isSet = isSet;
      lodash.isString = isString;
      lodash.isSymbol = isSymbol;
      lodash.isTypedArray = isTypedArray;
      lodash.isUndefined = isUndefined;
      lodash.isWeakMap = isWeakMap;
      lodash.isWeakSet = isWeakSet;
      lodash.join = join;
      lodash.kebabCase = kebabCase;
      lodash.last = last;
      lodash.lastIndexOf = lastIndexOf;
      lodash.lowerCase = lowerCase;
      lodash.lowerFirst = lowerFirst;
      lodash.lt = lt;
      lodash.lte = lte;
      lodash.max = max;
      lodash.maxBy = maxBy;
      lodash.mean = mean;
      lodash.meanBy = meanBy;
      lodash.min = min;
      lodash.minBy = minBy;
      lodash.stubArray = stubArray;
      lodash.stubFalse = stubFalse;
      lodash.stubObject = stubObject;
      lodash.stubString = stubString;
      lodash.stubTrue = stubTrue;
      lodash.multiply = multiply;
      lodash.nth = nth;
      lodash.noConflict = noConflict;
      lodash.noop = noop;
      lodash.now = now;
      lodash.pad = pad;
      lodash.padEnd = padEnd;
      lodash.padStart = padStart;
      lodash.parseInt = parseInt;
      lodash.random = random;
      lodash.reduce = reduce;
      lodash.reduceRight = reduceRight;
      lodash.repeat = repeat;
      lodash.replace = replace;
      lodash.result = result;
      lodash.round = round;
      lodash.runInContext = runInContext;
      lodash.sample = sample;
      lodash.size = size;
      lodash.snakeCase = snakeCase;
      lodash.some = some;
      lodash.sortedIndex = sortedIndex;
      lodash.sortedIndexBy = sortedIndexBy;
      lodash.sortedIndexOf = sortedIndexOf;
      lodash.sortedLastIndex = sortedLastIndex;
      lodash.sortedLastIndexBy = sortedLastIndexBy;
      lodash.sortedLastIndexOf = sortedLastIndexOf;
      lodash.startCase = startCase;
      lodash.startsWith = startsWith;
      lodash.subtract = subtract;
      lodash.sum = sum;
      lodash.sumBy = sumBy;
      lodash.template = template;
      lodash.times = times;
      lodash.toFinite = toFinite;
      lodash.toInteger = toInteger;
      lodash.toLength = toLength;
      lodash.toLower = toLower;
      lodash.toNumber = toNumber;
      lodash.toSafeInteger = toSafeInteger;
      lodash.toString = toString;
      lodash.toUpper = toUpper;
      lodash.trim = trim;
      lodash.trimEnd = trimEnd;
      lodash.trimStart = trimStart;
      lodash.truncate = truncate;
      lodash.unescape = unescape;
      lodash.uniqueId = uniqueId;
      lodash.upperCase = upperCase;
      lodash.upperFirst = upperFirst;
      lodash.each = forEach;
      lodash.eachRight = forEachRight;
      lodash.first = head;
      mixin(lodash, function () {
        var source = {};
        baseForOwn(lodash, function (func, methodName) {
          if (!hasOwnProperty.call(lodash.prototype, methodName)) {
            source[methodName] = func;
          }
        });
        return source;
      }(), {
        'chain': false
      });
      lodash.VERSION = VERSION;
      arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function (methodName) {
        lodash[methodName].placeholder = lodash;
      });
      arrayEach(['drop', 'take'], function (methodName, index) {
        LazyWrapper.prototype[methodName] = function (n) {
          n = n === undefined$1 ? 1 : nativeMax(toInteger(n), 0);
          var result = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
          if (result.__filtered__) {
            result.__takeCount__ = nativeMin(n, result.__takeCount__);
          } else {
            result.__views__.push({
              'size': nativeMin(n, MAX_ARRAY_LENGTH),
              'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
            });
          }
          return result;
        };
        LazyWrapper.prototype[methodName + 'Right'] = function (n) {
          return this.reverse()[methodName](n).reverse();
        };
      });
      arrayEach(['filter', 'map', 'takeWhile'], function (methodName, index) {
        var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
        LazyWrapper.prototype[methodName] = function (iteratee) {
          var result = this.clone();
          result.__iteratees__.push({
            'iteratee': getIteratee(iteratee, 3),
            'type': type
          });
          result.__filtered__ = result.__filtered__ || isFilter;
          return result;
        };
      });
      arrayEach(['head', 'last'], function (methodName, index) {
        var takeName = 'take' + (index ? 'Right' : '');
        LazyWrapper.prototype[methodName] = function () {
          return this[takeName](1).value()[0];
        };
      });
      arrayEach(['initial', 'tail'], function (methodName, index) {
        var dropName = 'drop' + (index ? '' : 'Right');
        LazyWrapper.prototype[methodName] = function () {
          return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
        };
      });
      LazyWrapper.prototype.compact = function () {
        return this.filter(identity);
      };
      LazyWrapper.prototype.find = function (predicate) {
        return this.filter(predicate).head();
      };
      LazyWrapper.prototype.findLast = function (predicate) {
        return this.reverse().find(predicate);
      };
      LazyWrapper.prototype.invokeMap = baseRest(function (path, args) {
        if (typeof path == 'function') {
          return new LazyWrapper(this);
        }
        return this.map(function (value) {
          return baseInvoke(value, path, args);
        });
      });
      LazyWrapper.prototype.reject = function (predicate) {
        return this.filter(negate(getIteratee(predicate)));
      };
      LazyWrapper.prototype.slice = function (start, end) {
        start = toInteger(start);
        var result = this;
        if (result.__filtered__ && (start > 0 || end < 0)) {
          return new LazyWrapper(result);
        }
        if (start < 0) {
          result = result.takeRight(-start);
        } else if (start) {
          result = result.drop(start);
        }
        if (end !== undefined$1) {
          end = toInteger(end);
          result = end < 0 ? result.dropRight(-end) : result.take(end - start);
        }
        return result;
      };
      LazyWrapper.prototype.takeRightWhile = function (predicate) {
        return this.reverse().takeWhile(predicate).reverse();
      };
      LazyWrapper.prototype.toArray = function () {
        return this.take(MAX_ARRAY_LENGTH);
      };
      baseForOwn(LazyWrapper.prototype, function (func, methodName) {
        var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? 'take' + (methodName == 'last' ? 'Right' : '') : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);
        if (!lodashFunc) {
          return;
        }
        lodash.prototype[methodName] = function () {
          var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);
          var interceptor = function interceptor(value) {
            var result = lodashFunc.apply(lodash, arrayPush([value], args));
            return isTaker && chainAll ? result[0] : result;
          };
          if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
            isLazy = useLazy = false;
          }
          var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;
          if (!retUnwrapped && useLazy) {
            value = onlyLazy ? value : new LazyWrapper(this);
            var result = func.apply(value, args);
            result.__actions__.push({
              'func': thru,
              'args': [interceptor],
              'thisArg': undefined$1
            });
            return new LodashWrapper(result, chainAll);
          }
          if (isUnwrapped && onlyLazy) {
            return func.apply(this, args);
          }
          result = this.thru(interceptor);
          return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
        };
      });
      arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function (methodName) {
        var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);
        lodash.prototype[methodName] = function () {
          var args = arguments;
          if (retUnwrapped && !this.__chain__) {
            var value = this.value();
            return func.apply(isArray(value) ? value : [], args);
          }
          return this[chainName](function (value) {
            return func.apply(isArray(value) ? value : [], args);
          });
        };
      });
      baseForOwn(LazyWrapper.prototype, function (func, methodName) {
        var lodashFunc = lodash[methodName];
        if (lodashFunc) {
          var key = lodashFunc.name + '';
          if (!hasOwnProperty.call(realNames, key)) {
            realNames[key] = [];
          }
          realNames[key].push({
            'name': methodName,
            'func': lodashFunc
          });
        }
      });
      realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [{
        'name': 'wrapper',
        'func': undefined$1
      }];
      LazyWrapper.prototype.clone = lazyClone;
      LazyWrapper.prototype.reverse = lazyReverse;
      LazyWrapper.prototype.value = lazyValue;
      lodash.prototype.at = wrapperAt;
      lodash.prototype.chain = wrapperChain;
      lodash.prototype.commit = wrapperCommit;
      lodash.prototype.next = wrapperNext;
      lodash.prototype.plant = wrapperPlant;
      lodash.prototype.reverse = wrapperReverse;
      lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
      lodash.prototype.first = lodash.prototype.head;
      if (symIterator) {
        lodash.prototype[symIterator] = wrapperToIterator;
      }
      return lodash;
    };
    var _ = runInContext();
    if (freeModule) {
      (freeModule.exports = _)._ = _;
      freeExports._ = _;
    } else {
      root._ = _;
    }
  }).call(commonjsGlobal);
});

var MDMSSearch$1 = function MDMSSearch() {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    moduleName = _Digit$Hooks$useQuery.moduleName,
    masterName = _Digit$Hooks$useQuery.masterName;
  var tenant = Digit.ULBService.getStateId();
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomMDMS(tenant, moduleName, [{
      name: masterName
    }], {
      select: function select(data) {
        var _Object$keys;
        var response = lodash.get(data, moduleName + "." + masterName, {});
        var dropDownOptions = [];
        (_Object$keys = Object.keys(response === null || response === void 0 ? void 0 : response[0])) === null || _Object$keys === void 0 ? void 0 : _Object$keys.forEach(function (key) {
          var _response$;
          if (typeof (response === null || response === void 0 ? void 0 : (_response$ = response[0]) === null || _response$ === void 0 ? void 0 : _response$[key]) === "string") {
            dropDownOptions.push({
              name: key,
              code: key
            });
          }
        });
        Config$1.apiDetails.requestBody.MdmsCriteria.moduleDetails[0].moduleName = moduleName;
        Config$1.apiDetails.requestBody.MdmsCriteria.moduleDetails[0].masterDetails[0].name = moduleName;
        Config$1.sections.search.uiConfig.fields[0].populators.options = dropDownOptions;
        return Config$1;
      }
    }),
    isLoading = _Digit$Hooks$useCusto.isLoading,
    ccConfig = _Digit$Hooks$useCusto.data;
  var updatedConfig = React.useMemo(function () {
    return Digit.Utils.preProcessMDMSConfigInboxSearch(t, ccConfig, "sections.search.uiConfig.fields", {
      updateDependent: [{
        key: "createdFrom",
        value: [new Date().toISOString().split("T")[0]]
      }, {
        key: "createdTo",
        value: [new Date().toISOString().split("T")[0]]
      }]
    });
  }, [ccConfig]);
  if (isLoading) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "jk-header-btn-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, {
    styles: {
      fontSize: "32px"
    }
  }, t(updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.label)), Digit.Utils.didEmployeeHasRole(updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionRole) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Button, {
    label: t(updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionLabel),
    variation: "secondary",
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.AddFilled, {
      style: {
        height: "20px",
        width: "20px"
      }
    }),
    onButtonClick: function onButtonClick() {
      var _window;
      history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/" + (updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionLink) + "?moduleName=common-masters&masterName=StateInfo1");
    },
    type: "button"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-search-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.InboxSearchComposer, {
    configs: updatedConfig
  })));
};

var schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Generated schema for Root",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    code: {
      type: "string"
    },
    qrCodeURL: {
      type: "string"
    },
    bannerUrl: {
      type: "string"
    },
    logoUrl: {
      type: "string"
    },
    logoUrlWhite: {
      type: "string"
    },
    statelogo: {
      type: "string"
    },
    gender: {
      type: "string"
    },
    hasLocalisation: {
      type: "boolean"
    },
    enableWhatsApp: {
      type: "boolean"
    },
    mobileNo: {
      type: "number"
    },
    defaultUrl: {
      type: "object",
      properties: {
        citizen: {
          type: "string"
        },
        employee: {
          type: "string"
        }
      },
      required: ["citizen", "employee"]
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: {
            type: "string"
          },
          value: {
            type: "string"
          }
        },
        required: ["label", "value"]
      }
    },
    sampleObject: {
      type: "array",
      items: {
        type: "string"
      },
      required: ["label", "value"]
    },
    localizationModules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: {
            type: "string"
          },
          value: {
            type: "string"
          }
        },
        required: ["label", "value"]
      }
    }
  },
  required: ["name", "code", "logoUrl", "statelogo", "hasLocalisation", "enableWhatsApp", "mobileNo", "defaultUrl", "languages", "localizationModules"]
};
var mdmsSchema = {
  tenantId: "pg",
  code: "common-masters.StateInfo",
  description: "StateInfo",
  definition: _extends({}, schema, {
    "x-unique": ["code"],
    "x-ref-schema": [{
      fieldPath: "gender",
      schemaCode: "common-masters.GenderType"
    }]
  }),
  isActive: true
};

var MDMSAdd = function MDMSAdd(_ref) {
  var FormSession = _ref.FormSession;
  var stateId = Digit.ULBService.getStateId();
  var _useState = React.useState(false),
    showErrorToast = _useState[0],
    setShowErrorToast = _useState[1];
  var _useState2 = React.useState(false),
    showToast = _useState2[0],
    setShowToast = _useState2[1];
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    moduleName = _Digit$Hooks$useQuery.moduleName,
    masterName = _Digit$Hooks$useQuery.masterName,
    tenantId = _Digit$Hooks$useQuery.tenantId;
  var sessionFormData = FormSession[0],
    setSessionFormData = FormSession[1];
  var _useState3 = React.useState(sessionFormData),
    session = _useState3[0],
    setSession = _useState3[1];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var reqCriteria = {
    url: "/mdms-v2/schema/v1/_search",
    params: {},
    body: {
      SchemaDefCriteria: {
        tenantId: tenantId || stateId,
        codes: [moduleName + "." + masterName]
      }
    },
    config: {
      enabled: moduleName && masterName && true,
      select: function select(data) {
        var _data$SchemaDefinitio;
        return (data === null || data === void 0 ? void 0 : (_data$SchemaDefinitio = data.SchemaDefinitions) === null || _data$SchemaDefinitio === void 0 ? void 0 : _data$SchemaDefinitio[0]) || {};
      }
    }
  };
  var reqCriteriaAdd = {
    url: "/mdms-v2/v2/_create/" + moduleName + "." + masterName,
    params: {},
    body: {
      Mdms: {
        tenantId: stateId,
        schemaCode: moduleName + "." + masterName,
        uniqueIdentifier: null,
        data: {},
        isActive: true
      }
    },
    config: {
      enabled: true,
      select: function select(data) {
        var _data$SchemaDefinitio2;
        return (data === null || data === void 0 ? void 0 : (_data$SchemaDefinitio2 = data.SchemaDefinitions) === null || _data$SchemaDefinitio2 === void 0 ? void 0 : _data$SchemaDefinitio2[0]) || {};
      }
    }
  };
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomAPIHook(reqCriteria),
    isLoading = _Digit$Hooks$useCusto.isLoading,
    schema = _Digit$Hooks$useCusto.data;
  var mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaAdd);
  var onSubmit = function onSubmit(data) {
    var formattedData = Digit.Utils.workbench.getFormattedData(data);
    var onSuccess = function onSuccess(resp) {
      var _resp$mdms, _resp$mdms$;
      setTimeout(function () {
        setSessionFormData({});
      }, 1500);
      setShowToast("Success ::  " + (resp === null || resp === void 0 ? void 0 : (_resp$mdms = resp.mdms) === null || _resp$mdms === void 0 ? void 0 : (_resp$mdms$ = _resp$mdms[0]) === null || _resp$mdms$ === void 0 ? void 0 : _resp$mdms$.id));
    };
    var onError = function onError(resp) {
      var _resp$response, _resp$response$data, _resp$response$data$E, _resp$response$data$E2;
      setShowErrorToast("Error :: " + (resp === null || resp === void 0 ? void 0 : (_resp$response = resp.response) === null || _resp$response === void 0 ? void 0 : (_resp$response$data = _resp$response.data) === null || _resp$response$data === void 0 ? void 0 : (_resp$response$data$E = _resp$response$data.Errors) === null || _resp$response$data$E === void 0 ? void 0 : (_resp$response$data$E2 = _resp$response$data$E[0]) === null || _resp$response$data$E2 === void 0 ? void 0 : _resp$response$data$E2.code));
    };
    mutation.mutate({
      params: {},
      body: {
        Mdms: {
          tenantId: stateId,
          schemaCode: moduleName + "." + masterName,
          uniqueIdentifier: null,
          data: _extends({}, formattedData),
          isActive: true
        }
      }
    }, {
      onError: onError,
      onSuccess: onSuccess
    });
  };
  var onFormValueChange = function onFormValueChange(setValue, formData, formState) {
    if (!lodash.isEqual(session, formData)) {
      setSession(_extends({}, session, formData));
    }
  };
  React.useEffect(function () {
    if (!lodash.isEqual(sessionFormData, session)) {
      var timer = setTimeout(function () {
        setSessionFormData(_extends({}, sessionFormData, session));
      }, 1000);
      return function () {
        clearTimeout(timer);
      };
    }
  }, [session]);
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  var configs = Digit.Hooks.workbench.UICreateConfigGenerator(schema, {});
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposerV2, {
    headerLabel: "WBH_ADD_MDMS",
    label: t("WBH_ADD_MDMS_ADD_ACTION"),
    description: "",
    text: "",
    config: configs.map(function (config) {
      return _extends({}, config, {
        body: config.body.filter(function (a) {
          return !a.hideInEmployee;
        })
      });
    }),
    customToast: showToast ? {
      error: false,
      label: showToast
    } : showErrorToast ? {
      error: true,
      label: showErrorToast
    } : null,
    updateCustomToast: function updateCustomToast() {
      return setShowToast(false);
    },
    defaultValues: session,
    onFormValueChange: onFormValueChange,
    onSubmit: onSubmit,
    fieldStyle: {
      marginRight: 0
    },
    jsonSchema: schema === null || schema === void 0 ? void 0 : schema.definition
  });
};

var _excluded = ["defaultFormData", "updatesToUISchema", "screenType", "onViewActionsSelect", "viewActions", "onSubmitEditAction"];
var onFormError = function onFormError(errors) {
  return console.log("I have", errors.length, "errors to fix");
};
var uiSchema = {};
var MDMSAdd$1 = function MDMSAdd(_ref) {
  var _formSchema$definitio;
  var defaultFormData = _ref.defaultFormData,
    updatesToUISchema = _ref.updatesToUISchema,
    _ref$screenType = _ref.screenType,
    screenType = _ref$screenType === void 0 ? "add" : _ref$screenType,
    onViewActionsSelect = _ref.onViewActionsSelect,
    viewActions = _ref.viewActions,
    onSubmitEditAction = _ref.onSubmitEditAction,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var FormSession = Digit.Hooks.useSessionStorage("MDMS_" + screenType, {});
  var sessionFormData = FormSession[0],
    setSessionFormData = FormSession[1];
  var _useState = React.useState(sessionFormData),
    session = _useState[0],
    setSession = _useState[1];
  var _useState2 = React.useState({}),
    formSchema = _useState2[0],
    setFormSchema = _useState2[1];
  var _useState3 = React.useState(false),
    api = _useState3[0],
    setAPI = _useState3[1];
  var _useState4 = React.useState(false),
    noSchema = _useState4[0],
    setNoSchema = _useState4[1];
  var _useState5 = React.useState([]),
    loadDependent = _useState5[0],
    setLoadDependent = _useState5[1];
  var _useState6 = React.useState(false),
    showErrorToast = _useState6[0],
    setShowErrorToast = _useState6[1];
  var _useState7 = React.useState(false),
    showToast = _useState7[0],
    setShowToast = _useState7[1];
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    moduleName = _Digit$Hooks$useQuery.moduleName,
    masterName = _Digit$Hooks$useQuery.masterName;
  React.useEffect(function () {
    setSession(_extends({}, session, defaultFormData));
  }, [defaultFormData]);
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var reqCriteria = {
    url: "/mdms-v2/schema/v1/_search",
    params: {},
    body: {
      SchemaDefCriteria: {
        tenantId: tenantId,
        codes: [moduleName + "." + masterName]
      }
    },
    config: {
      enabled: moduleName && masterName && true,
      select: function select(data) {
        var _data$SchemaDefinitio, _data$SchemaDefinitio2, _data$SchemaDefinitio3, _data$SchemaDefinitio4, _data$SchemaDefinitio5, _data$SchemaDefinitio10;
        if ((data === null || data === void 0 ? void 0 : (_data$SchemaDefinitio = data.SchemaDefinitions) === null || _data$SchemaDefinitio === void 0 ? void 0 : _data$SchemaDefinitio.length) == 0) {
          setNoSchema(true);
        }
        if (data !== null && data !== void 0 && (_data$SchemaDefinitio2 = data.SchemaDefinitions) !== null && _data$SchemaDefinitio2 !== void 0 && (_data$SchemaDefinitio3 = _data$SchemaDefinitio2[0]) !== null && _data$SchemaDefinitio3 !== void 0 && (_data$SchemaDefinitio4 = _data$SchemaDefinitio3.definition) !== null && _data$SchemaDefinitio4 !== void 0 && (_data$SchemaDefinitio5 = _data$SchemaDefinitio4["x-ui-schema"]) !== null && _data$SchemaDefinitio5 !== void 0 && _data$SchemaDefinitio5["ui-apidetails"]) {
          var _data$SchemaDefinitio6, _data$SchemaDefinitio7, _data$SchemaDefinitio8, _data$SchemaDefinitio9;
          setAPI(data === null || data === void 0 ? void 0 : (_data$SchemaDefinitio6 = data.SchemaDefinitions) === null || _data$SchemaDefinitio6 === void 0 ? void 0 : (_data$SchemaDefinitio7 = _data$SchemaDefinitio6[0]) === null || _data$SchemaDefinitio7 === void 0 ? void 0 : (_data$SchemaDefinitio8 = _data$SchemaDefinitio7.definition) === null || _data$SchemaDefinitio8 === void 0 ? void 0 : (_data$SchemaDefinitio9 = _data$SchemaDefinitio8["x-ui-schema"]) === null || _data$SchemaDefinitio9 === void 0 ? void 0 : _data$SchemaDefinitio9["ui-apidetails"]);
        }
        return (data === null || data === void 0 ? void 0 : (_data$SchemaDefinitio10 = data.SchemaDefinitions) === null || _data$SchemaDefinitio10 === void 0 ? void 0 : _data$SchemaDefinitio10[0]) || {};
      }
    },
    changeQueryName: "schema"
  };
  var reqCriteriaForData = {
    url: "/mdms-v2/v2/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCodes: loadDependent.map(function (e) {
          return e.schemaCode;
        })
      }
    },
    config: {
      enabled: loadDependent && (loadDependent === null || loadDependent === void 0 ? void 0 : loadDependent.length) > 0,
      select: function select(data) {
        var _data$mdms;
        var dependentData = {};
        data === null || data === void 0 ? void 0 : (_data$mdms = data.mdms) === null || _data$mdms === void 0 ? void 0 : _data$mdms.map(function (ele) {
          var _dependentData$ele$sc;
          if (dependentData !== null && dependentData !== void 0 && dependentData[ele === null || ele === void 0 ? void 0 : ele.schemaCode] && (dependentData === null || dependentData === void 0 ? void 0 : (_dependentData$ele$sc = dependentData[ele === null || ele === void 0 ? void 0 : ele.schemaCode]) === null || _dependentData$ele$sc === void 0 ? void 0 : _dependentData$ele$sc.length) > 0) {
            var _dependentData$ele$sc2;
            (_dependentData$ele$sc2 = dependentData[ele === null || ele === void 0 ? void 0 : ele.schemaCode]) === null || _dependentData$ele$sc2 === void 0 ? void 0 : _dependentData$ele$sc2.push(ele === null || ele === void 0 ? void 0 : ele.uniqueIdentifier);
          } else {
            dependentData[ele === null || ele === void 0 ? void 0 : ele.schemaCode] = [ele === null || ele === void 0 ? void 0 : ele.uniqueIdentifier];
          }
        });
        return dependentData;
      }
    },
    changeQueryName: "data"
  };
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomAPIHook(reqCriteriaForData),
    additonalData = _Digit$Hooks$useCusto.data;
  var _Digit$Hooks$useCusto2 = Digit.Hooks.useCustomAPIHook(reqCriteria),
    isLoading = _Digit$Hooks$useCusto2.isLoading,
    schema = _Digit$Hooks$useCusto2.data;
  var body = api !== null && api !== void 0 && api.requestBody ? _extends({}, api === null || api === void 0 ? void 0 : api.requestBody) : {
    Mdms: {
      tenantId: tenantId,
      schemaCode: moduleName + "." + masterName,
      uniqueIdentifier: null,
      data: {},
      isActive: true
    }
  };
  var reqCriteriaAdd = {
    url: api ? api === null || api === void 0 ? void 0 : api.url : "/mdms-v2/v2/_create/" + moduleName + "." + masterName,
    params: {},
    body: _extends({}, body),
    config: {
      enabled: schema ? true : false,
      select: function select(data) {
        var _data$SchemaDefinitio11;
        return (data === null || data === void 0 ? void 0 : (_data$SchemaDefinitio11 = data.SchemaDefinitions) === null || _data$SchemaDefinitio11 === void 0 ? void 0 : _data$SchemaDefinitio11[0]) || {};
      }
    }
  };
  var mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaAdd);
  var onSubmit = function onSubmit(data) {
    var onSuccess = function onSuccess(resp) {
      setTimeout(function () {
        setSessionFormData({});
        setSession({});
      }, 1500);
      setShowErrorToast(false);
      var jsonPath = api !== null && api !== void 0 && api.responseJson ? api === null || api === void 0 ? void 0 : api.responseJson : "mdms[0].id";
      setShowToast(t("WBH_SUCCESS_MDMS_MSG") + " " + lodash.get(resp, jsonPath, "NA"));
    };
    var onError = function onError(resp) {
      var _resp$response, _resp$response$data, _resp$response$data$E, _resp$response$data$E2;
      setShowToast(t("WBH_ERROR_MDMS_DATA") + " " + (resp === null || resp === void 0 ? void 0 : (_resp$response = resp.response) === null || _resp$response === void 0 ? void 0 : (_resp$response$data = _resp$response.data) === null || _resp$response$data === void 0 ? void 0 : (_resp$response$data$E = _resp$response$data.Errors) === null || _resp$response$data$E === void 0 ? void 0 : (_resp$response$data$E2 = _resp$response$data$E[0]) === null || _resp$response$data$E2 === void 0 ? void 0 : _resp$response$data$E2.description));
      setShowErrorToast(true);
    };
    if (api !== null && api !== void 0 && api.requestJson) {
      lodash.set(body, api !== null && api !== void 0 && api.requestJson ? api === null || api === void 0 ? void 0 : api.requestJson : "Mdms.data", _extends({}, data));
    }
    mutation.mutate({
      params: {},
      body: _extends({}, body)
    }, {
      onError: onError,
      onSuccess: onSuccess
    });
  };
  var onFormValueChange = function onFormValueChange(updatedSchema, element) {
    var formData = updatedSchema.formData;
    if (!lodash.isEqual(session, formData)) {
      setSession(_extends({}, session, formData));
    }
  };
  React.useEffect(function () {
    if (schema && schema !== null && schema !== void 0 && schema.definition) {
      var _schema$definition, _schema$definition2, _schema$definition2$x;
      Object.keys(schema === null || schema === void 0 ? void 0 : (_schema$definition = schema.definition) === null || _schema$definition === void 0 ? void 0 : _schema$definition.properties).map(function (key) {
        var title = Digit.Utils.locale.getTransformedLocale((schema === null || schema === void 0 ? void 0 : schema.code) + "_" + key);
        schema.definition.properties[key] = _extends({}, schema.definition.properties[key], {
          title: t(title)
        });
      });
      setFormSchema(schema);
      if ((schema === null || schema === void 0 ? void 0 : (_schema$definition2 = schema.definition) === null || _schema$definition2 === void 0 ? void 0 : (_schema$definition2$x = _schema$definition2["x-ref-schema"]) === null || _schema$definition2$x === void 0 ? void 0 : _schema$definition2$x.length) > 0) {
        var _schema$definition3;
        setLoadDependent([].concat(schema === null || schema === void 0 ? void 0 : (_schema$definition3 = schema.definition) === null || _schema$definition3 === void 0 ? void 0 : _schema$definition3["x-ref-schema"]));
      }
    }
  }, [schema]);
  React.useEffect(function () {
    if (loadDependent && (loadDependent === null || loadDependent === void 0 ? void 0 : loadDependent.length) > 0) {
      loadDependent === null || loadDependent === void 0 ? void 0 : loadDependent.map(function (dependent) {
        var _additonalData$depend;
        if (dependent !== null && dependent !== void 0 && dependent.fieldPath && (additonalData === null || additonalData === void 0 ? void 0 : (_additonalData$depend = additonalData[dependent === null || dependent === void 0 ? void 0 : dependent.schemaCode]) === null || _additonalData$depend === void 0 ? void 0 : _additonalData$depend.length) > 0) {
          var _schema$definition4;
          var updatedPath = Digit.Utils.workbench.getUpdatedPath(dependent === null || dependent === void 0 ? void 0 : dependent.fieldPath);
          if (lodash.get(schema === null || schema === void 0 ? void 0 : (_schema$definition4 = schema.definition) === null || _schema$definition4 === void 0 ? void 0 : _schema$definition4.properties, updatedPath)) {
            var _schema$definition5, _$get, _schema$definition6, _schema$definition7, _schema$definition8;
            if (lodash.get(schema === null || schema === void 0 ? void 0 : (_schema$definition5 = schema.definition) === null || _schema$definition5 === void 0 ? void 0 : _schema$definition5.properties, updatedPath) && ((_$get = lodash.get(schema === null || schema === void 0 ? void 0 : (_schema$definition6 = schema.definition) === null || _schema$definition6 === void 0 ? void 0 : _schema$definition6.properties, updatedPath, {})) === null || _$get === void 0 ? void 0 : _$get.type) == "array") {
              updatedPath += ".items";
            }
            lodash.set(schema === null || schema === void 0 ? void 0 : (_schema$definition7 = schema.definition) === null || _schema$definition7 === void 0 ? void 0 : _schema$definition7.properties, updatedPath, _extends({}, lodash.get(schema === null || schema === void 0 ? void 0 : (_schema$definition8 = schema.definition) === null || _schema$definition8 === void 0 ? void 0 : _schema$definition8.properties, updatedPath, {}), {
              "enum": additonalData === null || additonalData === void 0 ? void 0 : additonalData[dependent === null || dependent === void 0 ? void 0 : dependent.schemaCode]
            }));
            schema.definition.properties["temp_field"] = _extends({}, schema.definition.properties[updatedPath], {
              "enum": additonalData === null || additonalData === void 0 ? void 0 : additonalData[dependent === null || dependent === void 0 ? void 0 : dependent.schemaCode]
            });
          }
        }
      });
      setFormSchema(_extends({}, schema));
      setTimeout(function () {
        setFormSchema(function (schema) {
          delete schema.definition.properties["temp_field"];
          return _extends({}, schema);
        }, 500);
      });
    }
  }, [additonalData]);
  React.useEffect(function () {
    if (!lodash.isEqual(sessionFormData, session)) {
      var timer = setTimeout(function () {
        setSessionFormData(_extends({}, sessionFormData, session));
      }, 1000);
      return function () {
        clearTimeout(timer);
      };
    }
  }, [session]);
  if (noSchema) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement("span", {
      className: "workbench-no-schema-found"
    }, /*#__PURE__*/React__default.createElement("h4", null, t("WBH_NO_SCHEMA_FOUND")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SVG.NoResultsFoundIcon, {
      width: "20em",
      height: "20em"
    })));
  }
  if (isLoading || !formSchema || Object.keys(formSchema) == 0) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  var uiJSONSchema = formSchema === null || formSchema === void 0 ? void 0 : (_formSchema$definitio = formSchema["definition"]) === null || _formSchema$definitio === void 0 ? void 0 : _formSchema$definitio["x-ui-schema"];
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, formSchema && /*#__PURE__*/React__default.createElement(DigitJSONForm, {
    schema: formSchema,
    onFormChange: onFormValueChange,
    onFormError: onFormError,
    formData: session,
    onSubmit: screenType === "add" ? onSubmit : onSubmitEditAction,
    uiSchema: _extends({}, uiSchema, uiJSONSchema, updatesToUISchema),
    showToast: showToast,
    showErrorToast: showErrorToast,
    screenType: screenType,
    viewActions: viewActions,
    onViewActionsSelect: onViewActionsSelect
  }));
};

var _excluded$1 = ["isLoading", "data", "isFetching"];
var MDMSEdit = function MDMSEdit(_ref) {
  var props = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    moduleName = _Digit$Hooks$useQuery.moduleName,
    masterName = _Digit$Hooks$useQuery.masterName,
    uniqueIdentifier = _Digit$Hooks$useQuery.uniqueIdentifier;
  var stateId = Digit.ULBService.getCurrentTenantId();
  var _useState = React.useState(false),
    showToast = _useState[0],
    setShowToast = _useState[1];
  var reqCriteria = {
    url: "/mdms-v2/v2/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: stateId,
        uniqueIdentifier: uniqueIdentifier,
        schemaCodes: [moduleName + "." + masterName]
      }
    },
    config: {
      enabled: moduleName && masterName && true,
      select: function select(data) {
        var _data$mdms;
        return data === null || data === void 0 ? void 0 : (_data$mdms = data.mdms) === null || _data$mdms === void 0 ? void 0 : _data$mdms[0];
      }
    }
  };
  var reqCriteriaSchema = {
    url: "/mdms-v2/schema/v1/_search",
    params: {},
    body: {
      SchemaDefCriteria: {
        tenantId: stateId,
        codes: [moduleName + "." + masterName]
      }
    },
    config: {
      enabled: moduleName && masterName && true,
      select: function select(data) {
        var _data$SchemaDefinitio, _data$SchemaDefinitio2, _data$SchemaDefinitio3, _data$SchemaDefinitio4;
        var uniqueFields = data === null || data === void 0 ? void 0 : (_data$SchemaDefinitio = data.SchemaDefinitions) === null || _data$SchemaDefinitio === void 0 ? void 0 : (_data$SchemaDefinitio2 = _data$SchemaDefinitio[0]) === null || _data$SchemaDefinitio2 === void 0 ? void 0 : (_data$SchemaDefinitio3 = _data$SchemaDefinitio2.definition) === null || _data$SchemaDefinitio3 === void 0 ? void 0 : _data$SchemaDefinitio3["x-unique"];
        var updatesToUiSchema = {};
        uniqueFields.forEach(function (field) {
          return updatesToUiSchema[field] = {
            "ui:disabled": true
          };
        });
        return {
          schema: data === null || data === void 0 ? void 0 : (_data$SchemaDefinitio4 = data.SchemaDefinitions) === null || _data$SchemaDefinitio4 === void 0 ? void 0 : _data$SchemaDefinitio4[0],
          updatesToUiSchema: updatesToUiSchema
        };
      }
    },
    changeQueryName: "schema"
  };
  var closeToast = function closeToast() {
    setTimeout(function () {
      setShowToast(null);
    }, 5000);
  };
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomAPIHook(reqCriteria),
    isLoading = _Digit$Hooks$useCusto.isLoading,
    data = _Digit$Hooks$useCusto.data;
  var _Digit$Hooks$useCusto2 = Digit.Hooks.useCustomAPIHook(reqCriteriaSchema),
    isLoadingSchema = _Digit$Hooks$useCusto2.isLoading,
    schemaData = _Digit$Hooks$useCusto2.data,
    rest = _objectWithoutPropertiesLoose(_Digit$Hooks$useCusto2, _excluded$1);
  var reqCriteriaUpdate = {
    url: "/mdms-v2/v2/_update/" + moduleName + "." + masterName,
    params: {},
    body: {},
    config: {
      enabled: true
    }
  };
  var mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);
  var handleUpdate = function handleUpdate(formData) {
    try {
      var onSuccess = function onSuccess(resp) {
        var _resp$mdms, _resp$mdms$;
        setShowToast({
          label: t("WBH_SUCCESS_UPD_MDMS_MSG") + " " + (resp === null || resp === void 0 ? void 0 : (_resp$mdms = resp.mdms) === null || _resp$mdms === void 0 ? void 0 : (_resp$mdms$ = _resp$mdms[0]) === null || _resp$mdms$ === void 0 ? void 0 : _resp$mdms$.id)
        });
        closeToast();
      };
      var onError = function onError(resp) {
        var _resp$response, _resp$response$data, _resp$response$data$E, _resp$response$data$E2;
        setShowToast({
          label: t("WBH_ERROR_MDMS_DATA") + "  " + (resp === null || resp === void 0 ? void 0 : (_resp$response = resp.response) === null || _resp$response === void 0 ? void 0 : (_resp$response$data = _resp$response.data) === null || _resp$response$data === void 0 ? void 0 : (_resp$response$data$E = _resp$response$data.Errors) === null || _resp$response$data$E === void 0 ? void 0 : (_resp$response$data$E2 = _resp$response$data$E[0]) === null || _resp$response$data$E2 === void 0 ? void 0 : _resp$response$data$E2.description),
          isError: true
        });
        closeToast();
      };
      mutation.mutate({
        url: "/mdms-v2/v2/_update/" + moduleName + "." + masterName,
        params: {},
        body: {
          Mdms: _extends({}, data, {
            data: formData
          })
        }
      }, {
        onError: onError,
        onSuccess: onSuccess
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };
  if (isLoading || isLoadingSchema) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(MDMSAdd$1, {
    defaultFormData: data === null || data === void 0 ? void 0 : data.data,
    screenType: "edit",
    onSubmitEditAction: handleUpdate,
    updatesToUISchema: schemaData === null || schemaData === void 0 ? void 0 : schemaData.updatesToUiSchema
  }), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    label: t(showToast.label),
    error: showToast === null || showToast === void 0 ? void 0 : showToast.isError
  }));
};

var MDMSView = function MDMSView(_ref) {
  var props = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
  var history = reactRouterDom.useHistory();
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useState = React.useState(false),
    showToast = _useState[0],
    setShowToast = _useState[1];
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    moduleName = _Digit$Hooks$useQuery.moduleName,
    masterName = _Digit$Hooks$useQuery.masterName,
    tenantId = _Digit$Hooks$useQuery.tenantId,
    uniqueIdentifier = _Digit$Hooks$useQuery.uniqueIdentifier;
  tenantId = Digit.ULBService.getCurrentTenantId();
  var fetchActionItems = function fetchActionItems(data) {
    var actionItems = [{
      action: "EDIT",
      label: "Edit Master"
    }];
    var isActive = data === null || data === void 0 ? void 0 : data.isActive;
    if (isActive) actionItems.push({
      action: "DISABLE",
      label: "Disable Master"
    });else actionItems.push({
      action: "ENABLE",
      label: "Enable Master"
    });
    return actionItems;
  };
  var reqCriteria = {
    url: "/mdms-v2/v2/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        uniqueIdentifier: uniqueIdentifier,
        schemaCodes: [moduleName + "." + masterName]
      }
    },
    config: {
      enabled: moduleName && masterName && true,
      select: function select(data) {
        var _data$mdms;
        return data === null || data === void 0 ? void 0 : (_data$mdms = data.mdms) === null || _data$mdms === void 0 ? void 0 : _data$mdms[0];
      }
    }
  };
  var closeToast = function closeToast() {
    setTimeout(function () {
      setShowToast(null);
    }, 5000);
  };
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomAPIHook(reqCriteria),
    isLoading = _Digit$Hooks$useCusto.isLoading,
    data = _Digit$Hooks$useCusto.data;
  var reqCriteriaUpdate = {
    url: "/mdms-v2/v2/_update/" + moduleName + "." + masterName,
    params: {},
    body: {},
    config: {
      enabled: true
    }
  };
  var mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);
  var handleEnableDisable = function handleEnableDisable(action) {
    try {
      var onSuccess = function onSuccess(resp) {
        var _resp$mdms, _resp$mdms$;
        setShowToast({
          label: t("WBH_SUCCESS_DIS_MDMS_MSG") + " " + (resp === null || resp === void 0 ? void 0 : (_resp$mdms = resp.mdms) === null || _resp$mdms === void 0 ? void 0 : (_resp$mdms$ = _resp$mdms[0]) === null || _resp$mdms$ === void 0 ? void 0 : _resp$mdms$.id)
        });
        closeToast();
      };
      var onError = function onError(resp) {
        var _resp$response, _resp$response$data, _resp$response$data$E, _resp$response$data$E2;
        setShowToast({
          label: t("WBH_ERROR_MDMS_DATA") + "  " + (resp === null || resp === void 0 ? void 0 : (_resp$response = resp.response) === null || _resp$response === void 0 ? void 0 : (_resp$response$data = _resp$response.data) === null || _resp$response$data === void 0 ? void 0 : (_resp$response$data$E = _resp$response$data.Errors) === null || _resp$response$data$E === void 0 ? void 0 : (_resp$response$data$E2 = _resp$response$data$E[0]) === null || _resp$response$data$E2 === void 0 ? void 0 : _resp$response$data$E2.description),
          isError: true
        });
        closeToast();
      };
      mutation.mutate({
        url: "/mdms-v2/v2/_update/" + moduleName + "." + masterName,
        params: {},
        body: {
          Mdms: _extends({}, data, {
            isActive: action === "ENABLE" ? true : false
          })
        }
      }, {
        onError: onError,
        onSuccess: onSuccess
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var onActionSelect = function onActionSelect(action) {
    var actionSelected = action.action;
    if (actionSelected === "EDIT") {
      var _window;
      history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/workbench/mdms-edit?moduleName=" + moduleName + "&masterName=" + masterName + "&uniqueIdentifier=" + uniqueIdentifier);
    } else {
      handleEnableDisable(actionSelected);
    }
  };
  if (isLoading) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(MDMSAdd$1, {
    defaultFormData: data === null || data === void 0 ? void 0 : data.data,
    updatesToUISchema: {
      "ui:readonly": true
    },
    screenType: "view",
    onViewActionsSelect: onActionSelect,
    viewActions: fetchActionItems(data)
  }), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    label: t(showToast.label),
    error: showToast === null || showToast === void 0 ? void 0 : showToast.isError
  }));
};

var toDropdownObj = function toDropdownObj(master, mod) {
  if (master === void 0) {
    master = "";
  }
  if (mod === void 0) {
    mod = "";
  }
  return {
    name: mod || master,
    code: Digit.Utils.locale.getTransformedLocale(mod ? "WBH_MDMS_" + master + "_" + mod : "WBH_MDMS_MASTER_" + master)
  };
};
var MDMSSearchv2 = function MDMSSearchv2() {
  var Config = lodash.clone(Config$1);
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    modulee = _Digit$Hooks$useQuery.masterName,
    master = _Digit$Hooks$useQuery.moduleName,
    tenantId = _Digit$Hooks$useQuery.tenantId;
  var _useState = React.useState([]),
    availableSchemas = _useState[0],
    setAvailableSchemas = _useState[1];
  var _useState2 = React.useState(null),
    currentSchema = _useState2[0],
    setCurrentSchema = _useState2[1];
  var _useState3 = React.useState(null),
    masterName = _useState3[0],
    setMasterName = _useState3[1];
  var _useState4 = React.useState(null),
    moduleName = _useState4[0],
    setModuleName = _useState4[1];
  var _useState5 = React.useState([]),
    masterOptions = _useState5[0],
    setMasterOptions = _useState5[1];
  var _useState6 = React.useState([]),
    moduleOptions = _useState6[0],
    setModuleOptions = _useState6[1];
  var _useState7 = React.useState(null),
    updatedConfig = _useState7[0],
    setUpdatedConfig = _useState7[1];
  tenantId = tenantId || Digit.ULBService.getCurrentTenantId();
  var SchemaDefCriteria = {
    tenantId: tenantId
  };
  if (master && modulee) {
    SchemaDefCriteria.codes = [master + "." + modulee];
  }
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomAPIHook({
      url: "/mdms-v2/schema/v1/_search",
      params: {},
      body: {
        SchemaDefCriteria: SchemaDefCriteria
      },
      config: {
        select: function select(data) {
          function onlyUnique(value, index, array) {
            return array.indexOf(value) === index;
          }
          var schemas = data === null || data === void 0 ? void 0 : data.SchemaDefinitions;
          setAvailableSchemas(schemas);
          if ((schemas === null || schemas === void 0 ? void 0 : schemas.length) === 1) setCurrentSchema(schemas === null || schemas === void 0 ? void 0 : schemas[0]);
          var obj = {
            mastersAvailable: []
          };
          schemas.forEach(function (schema, idx) {
            var _obj$master;
            var code = schema.code;
            var splittedString = code.split(".");
            var master = splittedString[0],
              mod = splittedString[1];
            obj[master] = ((_obj$master = obj[master]) === null || _obj$master === void 0 ? void 0 : _obj$master.length) > 0 ? [].concat(obj[master], [toDropdownObj(master, mod)]) : [toDropdownObj(master, mod)];
            obj.mastersAvailable.push(master);
          });
          obj.mastersAvailable = obj.mastersAvailable.filter(onlyUnique);
          obj.mastersAvailable = obj.mastersAvailable.map(function (mas) {
            return toDropdownObj(mas);
          });
          return obj;
        }
      }
    }),
    isLoading = _Digit$Hooks$useCusto.isLoading,
    dropdownData = _Digit$Hooks$useCusto.data;
  React.useEffect(function () {
    setMasterOptions(dropdownData === null || dropdownData === void 0 ? void 0 : dropdownData.mastersAvailable);
  }, [dropdownData]);
  React.useEffect(function () {
    setModuleOptions(dropdownData === null || dropdownData === void 0 ? void 0 : dropdownData[masterName === null || masterName === void 0 ? void 0 : masterName.name]);
  }, [masterName]);
  React.useEffect(function () {
    if (masterName !== null && masterName !== void 0 && masterName.name && moduleName !== null && moduleName !== void 0 && moduleName.name) {
      var _availableSchemas$fil;
      setCurrentSchema((_availableSchemas$fil = availableSchemas.filter(function (schema) {
        return schema.code === (masterName === null || masterName === void 0 ? void 0 : masterName.name) + "." + (moduleName === null || moduleName === void 0 ? void 0 : moduleName.name);
      })) === null || _availableSchemas$fil === void 0 ? void 0 : _availableSchemas$fil[0]);
    }
  }, [moduleName]);
  React.useEffect(function () {
    if (currentSchema) {
      var _Object$keys;
      var dropDownOptions = [];
      var properties = currentSchema.definition.properties;
      (_Object$keys = Object.keys(properties)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.forEach(function (key) {
        if (properties[key].type === "string" && !properties[key].format) {
          dropDownOptions.push({
            name: key,
            code: key,
            i18nKey: Digit.Utils.locale.getTransformedLocale(currentSchema.code + "_" + key)
          });
        }
      });
      Config.sections.search.uiConfig.fields[0].populators.options = dropDownOptions;
      Config.actionLink = Config.actionLink + ("?moduleName=" + (masterName === null || masterName === void 0 ? void 0 : masterName.name) + "&masterName=" + (moduleName === null || moduleName === void 0 ? void 0 : moduleName.name));
      Config.additionalDetails = {
        currentSchemaCode: currentSchema.code
      };
      Config.sections.searchResult.uiConfig.columns = [{
        label: "Unique Identifier",
        jsonPath: "uniqueIdentifier",
        additionalCustomization: true
      }].concat(dropDownOptions.map(function (option) {
        return {
          label: option.i18nKey,
          i18nKey: option.i18nKey,
          jsonPath: "data." + option.code
        };
      }));
      setUpdatedConfig(Config);
    }
  }, [currentSchema]);
  if (isLoading) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, {
    className: "works-header-search"
  }, t(Config === null || Config === void 0 ? void 0 : Config.label)), /*#__PURE__*/React__default.createElement("div", {
    className: "jk-header-btn-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    option: masterOptions,
    style: {
      width: "25%",
      marginRight: "1rem"
    },
    className: "form-field",
    optionKey: "code",
    selected: master && modulee ? toDropdownObj(master) : masterName,
    select: function select(e) {
      setMasterName(e);
      setModuleName(null);
      setUpdatedConfig(null);
    },
    t: t,
    placeholder: t("WBH_MODULE_NAME"),
    disable: master ? true : false
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    option: moduleOptions,
    style: {
      width: "25%",
      marginRight: "auto"
    },
    className: "form-field",
    optionKey: "code",
    selected: master && modulee ? toDropdownObj(master, modulee) : moduleName,
    select: function select(e) {
      setModuleName(e);
    },
    t: t,
    placeholder: t("WBH_MASTER_NAME"),
    disable: modulee ? true : false
  }), updatedConfig && Digit.Utils.didEmployeeHasRole(updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionRole) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Button, {
    label: t(updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionLabel),
    variation: "secondary",
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.AddFilled, {
      style: {
        height: "20px",
        width: "20px"
      }
    }),
    onButtonClick: function onButtonClick() {
      var _window;
      var actionLink = updatedConfig === null || updatedConfig === void 0 ? void 0 : updatedConfig.actionLink;
      if (modulee && master) {
        actionLink = "workbench/mdms-add-v2?moduleName=" + master + "&masterName=" + modulee;
      }
      history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/" + actionLink);
    },
    type: "button"
  })), updatedConfig && /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-search-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.InboxSearchComposer, {
    configs: updatedConfig
  })));
};

var MastersBreadCrumb = function MastersBreadCrumb(_ref) {
  var _location$pathname$re, _window;
  var location = _ref.location,
    defaultPath = _ref.defaultPath;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var search = reactRouterDom.useLocation().search;
  var fromScreen = new URLSearchParams(search).get("from") || null;
  var pathVar = (_location$pathname$re = location.pathname.replace(defaultPath + '/', "").split("?")) === null || _location$pathname$re === void 0 ? void 0 : _location$pathname$re[0];
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    masterName = _Digit$Hooks$useQuery.masterName,
    moduleName = _Digit$Hooks$useQuery.moduleName;
  var crumbs = [{
    path: "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee",
    content: t("WORKS_MUKTA"),
    show: true
  }, {
    path: "/" + window.contextPath + "/employee/workbench/mdms-search-v2",
    content: t("MDMS_SEARCH_V2"),
    show: pathVar.includes("mdms-search-v2") ? false : true,
    query: "moduleName=" + moduleName + "&masterName=" + masterName
  }, {
    path: "/" + window.contextPath + "/employee/masters/response",
    content: t("" + Digit.Utils.workbench.getMDMSLabel(pathVar)),
    show: true
  }];
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.BreadCrumb, {
    crumbs: crumbs,
    spanStyle: {
      maxWidth: "min-content"
    }
  });
};
var App = function App(_ref2) {
  var path = _ref2.path;
  var location = reactRouterDom.useLocation();
  var MDMSCreateSession = Digit.Hooks.useSessionStorage("MDMS_add", {});
  var sessionFormData = MDMSCreateSession[0],
    clearSessionFormData = MDMSCreateSession[2];
  var MDMSViewSession = Digit.Hooks.useSessionStorage("MDMS_view", {});
  var sessionFormDataView = MDMSViewSession[0],
    clearSessionFormDataView = MDMSViewSession[2];
  React.useEffect(function () {
    if (!window.location.href.includes("mdms-add-v2") && sessionFormData && Object.keys(sessionFormData) != 0) {
      clearSessionFormData();
    }
    if (!window.location.href.includes("mdms-view") && sessionFormDataView) {
      clearSessionFormDataView();
    }
  }, [location]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(MastersBreadCrumb, {
    location: location,
    defaultPath: path
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/sample",
    component: function component() {
      return /*#__PURE__*/React__default.createElement("div", null, "Sample Screen loaded");
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/localisation-search",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(MDMSSearch, null);
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/mdms-search",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(MDMSSearch$1, null);
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/mdms-add",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(MDMSAdd, {
        FormSession: MDMSCreateSession,
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/mdms-add-v2",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(MDMSAdd$1, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/mdms-view",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(MDMSView, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/mdms-edit",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(MDMSEdit, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/mdms-search-v2",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(MDMSSearchv2, {
        parentRoute: path
      });
    }
  }))));
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
function _finallyRethrows(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer(true, e);
  }
  if (result && result.then) {
    return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
  }
  return finalizer(false, result);
}

var Digit$1 = window.Digit || {};
var logoutV1 = function logoutV1() {
  try {
    var user = Digit$1.UserService.getUser();
    if (!user || !user.info || !user.access_token) return Promise.resolve(false);
    var type = user.info.type;
    var access_token = user === null || user === void 0 ? void 0 : user.access_token;
    var tenantId = type === "CITIZEN" ? Digit$1.ULBService.getStateId() : Digit$1.ULBService.getCurrentTenantId();
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("content-type", "application/json;charset=UTF-8");
    var raw = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: ".01",
        ts: "",
        action: "_logout",
        did: "1",
        key: "",
        msgId: "20170310130900|en_IN",
        authToken: access_token
      },
      access_token: access_token
    };
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow"
    };
    var userType = Digit$1.UserService.getType();
    var _temp = _finallyRethrows(function () {
      return _catch(function () {
        return Promise.resolve(fetch(window.location.origin + "/user/v1/_logout?tenantId=" + tenantId, requestOptions).then(function (response) {
          return response.json();
        })["catch"](function (error) {
          return console.log("error", error);
        })).then(function () {});
      }, function () {});
    }, function (_wasThrown, _result) {
      window.localStorage.clear();
      window.sessionStorage.clear();
      if (userType === "citizen") {
        window.location.replace("/digit-ui/citizen");
      } else {
        window.location.replace("/digit-ui/employee/user/language-selection");
      }
      if (_wasThrown) throw _result;
      return _result;
    });
    return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};

var UIFormBodyGenerator = function UIFormBodyGenerator(JSONSchema, UISchema) {
  var _JSONSchema, _JSONSchema2;
  if (JSONSchema === void 0) {
    JSONSchema = {};
  }
  var schema = (_JSONSchema = JSONSchema) === null || _JSONSchema === void 0 ? void 0 : _JSONSchema.properties;
  var referenceSchema = ((_JSONSchema2 = JSONSchema) === null || _JSONSchema2 === void 0 ? void 0 : _JSONSchema2["x-ref-schema"]) || [];
  var body = Object.keys(schema).map(function (property) {
    var _JSONSchema3, _JSONSchema3$required, _JSONSchema3$required2;
    var bodyConfig = {};
    var referenceSchemaObject = referenceSchema === null || referenceSchema === void 0 ? void 0 : referenceSchema.filter(function (e) {
      return e.fieldPath == property;
    });
    if (referenceSchemaObject && Array.isArray(referenceSchemaObject) && referenceSchemaObject.length > 0) {
      var _referenceSchemaObjec, _referenceSchemaObjec2, _referenceSchemaObjec3, _referenceSchemaObjec4;
      bodyConfig = Digit.Utils.workbench.getConfig("select");
      var masterDetails = referenceSchemaObject === null || referenceSchemaObject === void 0 ? void 0 : (_referenceSchemaObjec = referenceSchemaObject[0]) === null || _referenceSchemaObjec === void 0 ? void 0 : (_referenceSchemaObjec2 = _referenceSchemaObjec.schemaCode) === null || _referenceSchemaObjec2 === void 0 ? void 0 : (_referenceSchemaObjec3 = _referenceSchemaObjec2.split) === null || _referenceSchemaObjec3 === void 0 ? void 0 : _referenceSchemaObjec3.call(_referenceSchemaObjec2, ".");
      bodyConfig.populators.mdmsConfig.moduleName = masterDetails === null || masterDetails === void 0 ? void 0 : masterDetails[0];
      bodyConfig.populators.mdmsConfig.masterName = masterDetails === null || masterDetails === void 0 ? void 0 : masterDetails[1];
      bodyConfig.populators.mdmsConfig.localePrefix = Digit.Utils.locale.getTransformedLocale(referenceSchemaObject === null || referenceSchemaObject === void 0 ? void 0 : (_referenceSchemaObjec4 = referenceSchemaObject[0]) === null || _referenceSchemaObjec4 === void 0 ? void 0 : _referenceSchemaObjec4.schemaCode);
      bodyConfig.key = "SELECT" + property;
      bodyConfig.populators.name = "SELECT" + property;
    } else {
      bodyConfig = Digit.Utils.workbench.getConfig(schema[property].type);
      bodyConfig.key = schema[property].type == "boolean" ? "SELECT" + property : property;
      bodyConfig.populators.name = schema[property].type == "boolean" ? "SELECT" + property : property;
    }
    bodyConfig.label = Digit.Utils.workbench.getMDMSLabel(property);
    bodyConfig.isMandatory = (_JSONSchema3 = JSONSchema) === null || _JSONSchema3 === void 0 ? void 0 : (_JSONSchema3$required = _JSONSchema3.required) === null || _JSONSchema3$required === void 0 ? void 0 : (_JSONSchema3$required2 = _JSONSchema3$required.includes) === null || _JSONSchema3$required2 === void 0 ? void 0 : _JSONSchema3$required2.call(_JSONSchema3$required, property);
    return _extends({}, bodyConfig);
  });
  return body;
};
var UICreateConfigGenerator = function UICreateConfigGenerator(MDMSSchema, UISchema) {
  var _MDMSSchema, _MDMSSchema2;
  if (MDMSSchema === void 0) {
    MDMSSchema = {};
  }
  var body = UIFormBodyGenerator(MDMSSchema.definition);
  var newConfig = [{
    head: Digit.Utils.workbench.getMDMSLabel((_MDMSSchema = MDMSSchema) === null || _MDMSSchema === void 0 ? void 0 : _MDMSSchema.code),
    subHead: (_MDMSSchema2 = MDMSSchema) === null || _MDMSSchema2 === void 0 ? void 0 : _MDMSSchema2.description,
    body: body
  }];
  return newConfig;
};

var CONFIGS_TEMPLATE = {
  string: {
    inline: true,
    label: "",
    isMandatory: false,
    type: "text",
    disable: false,
    populators: {
      name: "text1",
      error: "invalid text field",
      validation: {
        pattern: /^[A-Za-z]+$/i
      }
    }
  },
  object: {
    inline: true,
    label: "",
    isMandatory: false,
    type: "object",
    disable: false,
    populators: {
      name: "text1",
      error: "invalid text field",
      validation: {
        pattern: /^[A-Za-z]+$/i
      }
    }
  },
  array: {
    inline: true,
    label: "",
    isMandatory: false,
    type: "array",
    disable: false,
    populators: {
      name: "text1",
      error: "invalid text field",
      validation: {
        pattern: /^[A-Za-z]+$/i
      }
    }
  },
  number: {
    label: "",
    isMandatory: false,
    type: "number",
    disable: false,
    populators: {
      name: "number1",
      error: "invalid number field",
      validation: {
        min: 0,
        max: 9999999999
      }
    }
  },
  "boolean": {
    isMandatory: false,
    key: "radio1",
    type: "radio",
    label: "",
    disable: false,
    populators: {
      name: "radio1",
      optionsKey: "name",
      error: "select any one value",
      required: false,
      options: [{
        code: true,
        name: "True"
      }, {
        code: false,
        name: "false"
      }]
    }
  },
  select: {
    isMandatory: false,
    type: "dropdown",
    label: "",
    disable: false,
    populators: {
      name: "select1",
      optionsKey: "name",
      error: "select any one value",
      required: false,
      mdmsConfig: {
        masterName: "",
        moduleName: "",
        localePrefix: ""
      }
    }
  },
  "default": {
    inline: true,
    label: "",
    isMandatory: false,
    type: "text",
    disable: false,
    populators: {
      name: "text1",
      error: "invalid text field",
      validation: {
        pattern: /^[A-Za-z]+$/i
      }
    }
  }
};
var getConfig = function getConfig(type) {
  if (type === void 0) {
    type = "text";
  }
  var config = CONFIGS_TEMPLATE !== null && CONFIGS_TEMPLATE !== void 0 && CONFIGS_TEMPLATE[type] ? CONFIGS_TEMPLATE === null || CONFIGS_TEMPLATE === void 0 ? void 0 : CONFIGS_TEMPLATE[type] : CONFIGS_TEMPLATE === null || CONFIGS_TEMPLATE === void 0 ? void 0 : CONFIGS_TEMPLATE["default"];
  return _extends({}, config, {
    populators: _extends({}, config.populators)
  });
};
var getMDMSLabel = function getMDMSLabel(code) {
  if (code === void 0) {
    code = "";
  }
  return Digit.Utils.locale.getTransformedLocale(code);
};
var getFormattedData = function getFormattedData(data) {
  if (data === void 0) {
    data = {};
  }
  var formattedData = {};
  Object.keys(data).map(function (key) {
    if (key !== null && key !== void 0 && key.startsWith("SELECT")) {
      var _data$newKey;
      var newKey = key === null || key === void 0 ? void 0 : key.replace("SELECT", "");
      formattedData[newKey] = (_data$newKey = data[newKey]) === null || _data$newKey === void 0 ? void 0 : _data$newKey.code;
    } else {
      formattedData[key] = data[key];
    }
  });
  return formattedData;
};
var getUpdatedPath = function getUpdatedPath(path) {
  var _path, _path2;
  if (path === void 0) {
    path = "";
  }
  if (!((_path = path) !== null && _path !== void 0 && _path.includes('.'))) {
    return path;
  } else if ((_path2 = path) !== null && _path2 !== void 0 && _path2.includes('.*.')) {
    return Digit.Utils.locale.stringReplaceAll(path, ".*.", ".items.properties.");
  } else {
    return Digit.Utils.locale.stringReplaceAll(path, ".", ".properties.");
  }
};
var utils = {
  getConfig: getConfig,
  getMDMSLabel: getMDMSLabel,
  getFormattedData: getFormattedData,
  getUpdatedPath: getUpdatedPath
};

var UserService = {
  logoutV1: logoutV1
};
var workbench = {
  UICreateConfigGenerator: UICreateConfigGenerator
};
var contracts = {};
var Hooks = {
  attendance: {
    update: function update() {}
  },
  workbench: workbench,
  contracts: contracts
};
var Utils = {
  browser: {
    sample: function sample() {}
  },
  workbench: _extends({}, utils)
};
var CustomisedHooks = {
  Hooks: Hooks,
  UserService: UserService,
  Utils: Utils
};

var Digit$2 = window.Digit || {};
var businessServiceMap = {
  "muster roll": "MR"
};
var inboxModuleNameMap = {
  "muster-roll-approval": "muster-roll-service"
};
var UICustomizations = {
  businessServiceMap: businessServiceMap,
  updatePayload: function updatePayload(applicationDetails, data, action, businessService) {
    if (businessService === businessServiceMap.estimate) {
      var _data$documents, _data$assignees, _data$assignees2;
      var workflow = {
        comment: data.comments,
        documents: data === null || data === void 0 ? void 0 : (_data$documents = data.documents) === null || _data$documents === void 0 ? void 0 : _data$documents.map(function (document) {
          var _document$, _document$$file, _document$2, _document$2$fileStore, _document$3, _document$3$fileStore, _document$4, _document$4$fileStore;
          return {
            documentType: (action === null || action === void 0 ? void 0 : action.action) + " DOC",
            fileName: document === null || document === void 0 ? void 0 : (_document$ = document[1]) === null || _document$ === void 0 ? void 0 : (_document$$file = _document$.file) === null || _document$$file === void 0 ? void 0 : _document$$file.name,
            fileStoreId: document === null || document === void 0 ? void 0 : (_document$2 = document[1]) === null || _document$2 === void 0 ? void 0 : (_document$2$fileStore = _document$2.fileStoreId) === null || _document$2$fileStore === void 0 ? void 0 : _document$2$fileStore.fileStoreId,
            documentUid: document === null || document === void 0 ? void 0 : (_document$3 = document[1]) === null || _document$3 === void 0 ? void 0 : (_document$3$fileStore = _document$3.fileStoreId) === null || _document$3$fileStore === void 0 ? void 0 : _document$3$fileStore.fileStoreId,
            tenantId: document === null || document === void 0 ? void 0 : (_document$4 = document[1]) === null || _document$4 === void 0 ? void 0 : (_document$4$fileStore = _document$4.fileStoreId) === null || _document$4$fileStore === void 0 ? void 0 : _document$4$fileStore.tenantId
          };
        }),
        assignees: data !== null && data !== void 0 && (_data$assignees = data.assignees) !== null && _data$assignees !== void 0 && _data$assignees.uuid ? [data === null || data === void 0 ? void 0 : (_data$assignees2 = data.assignees) === null || _data$assignees2 === void 0 ? void 0 : _data$assignees2.uuid] : null,
        action: action.action
      };
      Object.keys(workflow).forEach(function (key, index) {
        var _workflow$key;
        if (!workflow[key] || ((_workflow$key = workflow[key]) === null || _workflow$key === void 0 ? void 0 : _workflow$key.length) === 0) delete workflow[key];
      });
      return {
        estimate: applicationDetails,
        workflow: workflow
      };
    }
    if (businessService === businessServiceMap.contract) {
      var _data$documents2, _data$assignees3, _data$assignees4;
      var _workflow = {
        comment: data === null || data === void 0 ? void 0 : data.comments,
        documents: data === null || data === void 0 ? void 0 : (_data$documents2 = data.documents) === null || _data$documents2 === void 0 ? void 0 : _data$documents2.map(function (document) {
          var _document$5, _document$5$file, _document$6, _document$6$fileStore, _document$7, _document$7$fileStore, _document$8, _document$8$fileStore;
          return {
            documentType: (action === null || action === void 0 ? void 0 : action.action) + " DOC",
            fileName: document === null || document === void 0 ? void 0 : (_document$5 = document[1]) === null || _document$5 === void 0 ? void 0 : (_document$5$file = _document$5.file) === null || _document$5$file === void 0 ? void 0 : _document$5$file.name,
            fileStoreId: document === null || document === void 0 ? void 0 : (_document$6 = document[1]) === null || _document$6 === void 0 ? void 0 : (_document$6$fileStore = _document$6.fileStoreId) === null || _document$6$fileStore === void 0 ? void 0 : _document$6$fileStore.fileStoreId,
            documentUid: document === null || document === void 0 ? void 0 : (_document$7 = document[1]) === null || _document$7 === void 0 ? void 0 : (_document$7$fileStore = _document$7.fileStoreId) === null || _document$7$fileStore === void 0 ? void 0 : _document$7$fileStore.fileStoreId,
            tenantId: document === null || document === void 0 ? void 0 : (_document$8 = document[1]) === null || _document$8 === void 0 ? void 0 : (_document$8$fileStore = _document$8.fileStoreId) === null || _document$8$fileStore === void 0 ? void 0 : _document$8$fileStore.tenantId
          };
        }),
        assignees: data !== null && data !== void 0 && (_data$assignees3 = data.assignees) !== null && _data$assignees3 !== void 0 && _data$assignees3.uuid ? [data === null || data === void 0 ? void 0 : (_data$assignees4 = data.assignees) === null || _data$assignees4 === void 0 ? void 0 : _data$assignees4.uuid] : null,
        action: action.action
      };
      Object.keys(_workflow).forEach(function (key, index) {
        var _workflow$key2;
        if (!_workflow[key] || ((_workflow$key2 = _workflow[key]) === null || _workflow$key2 === void 0 ? void 0 : _workflow$key2.length) === 0) delete _workflow[key];
      });
      return {
        contract: applicationDetails,
        workflow: _workflow
      };
    }
    if (businessService === (businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["muster roll"])) {
      var _data$documents3, _data$assignees5, _data$assignees6;
      var _workflow2 = {
        comment: data === null || data === void 0 ? void 0 : data.comments,
        documents: data === null || data === void 0 ? void 0 : (_data$documents3 = data.documents) === null || _data$documents3 === void 0 ? void 0 : _data$documents3.map(function (document) {
          var _document$9, _document$9$file, _document$10, _document$10$fileStor, _document$11, _document$11$fileStor, _document$12, _document$12$fileStor;
          return {
            documentType: (action === null || action === void 0 ? void 0 : action.action) + " DOC",
            fileName: document === null || document === void 0 ? void 0 : (_document$9 = document[1]) === null || _document$9 === void 0 ? void 0 : (_document$9$file = _document$9.file) === null || _document$9$file === void 0 ? void 0 : _document$9$file.name,
            fileStoreId: document === null || document === void 0 ? void 0 : (_document$10 = document[1]) === null || _document$10 === void 0 ? void 0 : (_document$10$fileStor = _document$10.fileStoreId) === null || _document$10$fileStor === void 0 ? void 0 : _document$10$fileStor.fileStoreId,
            documentUid: document === null || document === void 0 ? void 0 : (_document$11 = document[1]) === null || _document$11 === void 0 ? void 0 : (_document$11$fileStor = _document$11.fileStoreId) === null || _document$11$fileStor === void 0 ? void 0 : _document$11$fileStor.fileStoreId,
            tenantId: document === null || document === void 0 ? void 0 : (_document$12 = document[1]) === null || _document$12 === void 0 ? void 0 : (_document$12$fileStor = _document$12.fileStoreId) === null || _document$12$fileStor === void 0 ? void 0 : _document$12$fileStor.tenantId
          };
        }),
        assignees: data !== null && data !== void 0 && (_data$assignees5 = data.assignees) !== null && _data$assignees5 !== void 0 && _data$assignees5.uuid ? [data === null || data === void 0 ? void 0 : (_data$assignees6 = data.assignees) === null || _data$assignees6 === void 0 ? void 0 : _data$assignees6.uuid] : null,
        action: action.action
      };
      Object.keys(_workflow2).forEach(function (key, index) {
        var _workflow2$key;
        if (!_workflow2[key] || ((_workflow2$key = _workflow2[key]) === null || _workflow2$key === void 0 ? void 0 : _workflow2$key.length) === 0) delete _workflow2[key];
      });
      return {
        musterRoll: applicationDetails,
        workflow: _workflow2
      };
    }
    if (businessService === (businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["works.purchase"])) {
      var _data$documents4, _data$assignees7, _data$assignees8, _applicationDetails$r, _applicationDetails$r2;
      var _workflow3 = {
        comment: data.comments,
        documents: data === null || data === void 0 ? void 0 : (_data$documents4 = data.documents) === null || _data$documents4 === void 0 ? void 0 : _data$documents4.map(function (document) {
          var _document$13, _document$13$file, _document$14, _document$14$fileStor, _document$15, _document$15$fileStor, _document$16, _document$16$fileStor;
          return {
            documentType: (action === null || action === void 0 ? void 0 : action.action) + " DOC",
            fileName: document === null || document === void 0 ? void 0 : (_document$13 = document[1]) === null || _document$13 === void 0 ? void 0 : (_document$13$file = _document$13.file) === null || _document$13$file === void 0 ? void 0 : _document$13$file.name,
            fileStoreId: document === null || document === void 0 ? void 0 : (_document$14 = document[1]) === null || _document$14 === void 0 ? void 0 : (_document$14$fileStor = _document$14.fileStoreId) === null || _document$14$fileStor === void 0 ? void 0 : _document$14$fileStor.fileStoreId,
            documentUid: document === null || document === void 0 ? void 0 : (_document$15 = document[1]) === null || _document$15 === void 0 ? void 0 : (_document$15$fileStor = _document$15.fileStoreId) === null || _document$15$fileStor === void 0 ? void 0 : _document$15$fileStor.fileStoreId,
            tenantId: document === null || document === void 0 ? void 0 : (_document$16 = document[1]) === null || _document$16 === void 0 ? void 0 : (_document$16$fileStor = _document$16.fileStoreId) === null || _document$16$fileStor === void 0 ? void 0 : _document$16$fileStor.tenantId
          };
        }),
        assignees: data !== null && data !== void 0 && (_data$assignees7 = data.assignees) !== null && _data$assignees7 !== void 0 && _data$assignees7.uuid ? [data === null || data === void 0 ? void 0 : (_data$assignees8 = data.assignees) === null || _data$assignees8 === void 0 ? void 0 : _data$assignees8.uuid] : null,
        action: action.action
      };
      Object.keys(_workflow3).forEach(function (key, index) {
        var _workflow3$key;
        if (!_workflow3[key] || ((_workflow3$key = _workflow3[key]) === null || _workflow3$key === void 0 ? void 0 : _workflow3$key.length) === 0) delete _workflow3[key];
      });
      var additionalFieldsToSet = {
        projectId: applicationDetails.additionalDetails.projectId,
        invoiceDate: applicationDetails.billDate,
        invoiceNumber: (_applicationDetails$r = applicationDetails.referenceId.split("_")) === null || _applicationDetails$r === void 0 ? void 0 : _applicationDetails$r[1],
        contractNumber: (_applicationDetails$r2 = applicationDetails.referenceId.split("_")) === null || _applicationDetails$r2 === void 0 ? void 0 : _applicationDetails$r2[0],
        documents: applicationDetails.additionalDetails.documents
      };
      return {
        bill: _extends({}, applicationDetails, additionalFieldsToSet),
        workflow: _workflow3
      };
    }
  },
  enableModalSubmit: function enableModalSubmit(businessService, action, setModalSubmit, data) {
    if (businessService === (businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["muster roll"]) && action.action === "APPROVE") {
      setModalSubmit(data === null || data === void 0 ? void 0 : data.acceptTerms);
    }
  },
  enableHrmsSearch: function enableHrmsSearch(businessService, action) {
    if (businessService === businessServiceMap.estimate) {
      return action.action.includes("TECHNICALSANCTION") || action.action.includes("VERIFYANDFORWARD");
    }
    if (businessService === businessServiceMap.contract) {
      return action.action.includes("VERIFY_AND_FORWARD");
    }
    if (businessService === (businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["muster roll"])) {
      return action.action.includes("VERIFY");
    }
    if (businessService === (businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["works.purchase"])) {
      return action.action.includes("VERIFY_AND_FORWARD");
    }
    return false;
  },
  getBusinessService: function getBusinessService(moduleCode) {
    if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("estimate")) {
      return businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap.estimate;
    } else if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("contract")) {
      return businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap.contract;
    } else if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("muster roll")) {
      return businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["muster roll"];
    } else if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("works.purchase")) {
      return businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["works.purchase"];
    } else if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("works.wages")) {
      return businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["works.wages"];
    } else if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("works.supervision")) {
      return businessServiceMap === null || businessServiceMap === void 0 ? void 0 : businessServiceMap["works.supervision"];
    } else {
      return businessServiceMap;
    }
  },
  getInboxModuleName: function getInboxModuleName(moduleCode) {
    if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("estimate")) {
      return inboxModuleNameMap === null || inboxModuleNameMap === void 0 ? void 0 : inboxModuleNameMap.estimate;
    } else if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("contract")) {
      return inboxModuleNameMap === null || inboxModuleNameMap === void 0 ? void 0 : inboxModuleNameMap.contracts;
    } else if (moduleCode !== null && moduleCode !== void 0 && moduleCode.includes("attendence")) {
      return inboxModuleNameMap === null || inboxModuleNameMap === void 0 ? void 0 : inboxModuleNameMap.attendencemgmt;
    } else {
      return inboxModuleNameMap;
    }
  },
  AttendanceInboxConfig: {
    preProcess: function preProcess(data) {
      var _data$body, _data$body$inbox, _data$body$inbox$modu, _data$body$inbox$modu2, _data$body2, _data$body2$inbox, _data$body2$inbox$mod, _data$body2$inbox$mod2, _Object$keys, _ward;
      data.body.inbox.tenantId = Digit$2.ULBService.getCurrentTenantId();
      data.body.inbox.processSearchCriteria.tenantId = Digit$2.ULBService.getCurrentTenantId();
      var musterRollNumber = data === null || data === void 0 ? void 0 : (_data$body = data.body) === null || _data$body === void 0 ? void 0 : (_data$body$inbox = _data$body.inbox) === null || _data$body$inbox === void 0 ? void 0 : (_data$body$inbox$modu = _data$body$inbox.moduleSearchCriteria) === null || _data$body$inbox$modu === void 0 ? void 0 : (_data$body$inbox$modu2 = _data$body$inbox$modu.musterRollNumber) === null || _data$body$inbox$modu2 === void 0 ? void 0 : _data$body$inbox$modu2.trim();
      if (musterRollNumber) data.body.inbox.moduleSearchCriteria.musterRollNumber = musterRollNumber;
      var attendanceRegisterName = data === null || data === void 0 ? void 0 : (_data$body2 = data.body) === null || _data$body2 === void 0 ? void 0 : (_data$body2$inbox = _data$body2.inbox) === null || _data$body2$inbox === void 0 ? void 0 : (_data$body2$inbox$mod = _data$body2$inbox.moduleSearchCriteria) === null || _data$body2$inbox$mod === void 0 ? void 0 : (_data$body2$inbox$mod2 = _data$body2$inbox$mod.attendanceRegisterName) === null || _data$body2$inbox$mod2 === void 0 ? void 0 : _data$body2$inbox$mod2.trim();
      if (attendanceRegisterName) data.body.inbox.moduleSearchCriteria.attendanceRegisterName = attendanceRegisterName;
      var assignee = lodash.clone(data.body.inbox.moduleSearchCriteria.assignee);
      delete data.body.inbox.moduleSearchCriteria.assignee;
      if ((assignee === null || assignee === void 0 ? void 0 : assignee.code) === "ASSIGNED_TO_ME") {
        data.body.inbox.moduleSearchCriteria.assignee = Digit$2.UserService.getUser().info.uuid;
      }
      var selectedOrg = lodash.clone(data.body.inbox.moduleSearchCriteria.orgId ? data.body.inbox.moduleSearchCriteria.orgId : null);
      delete data.body.inbox.moduleSearchCriteria.orgId;
      if (selectedOrg) {
        var _selectedOrg$;
        data.body.inbox.moduleSearchCriteria.orgId = selectedOrg === null || selectedOrg === void 0 ? void 0 : (_selectedOrg$ = selectedOrg[0]) === null || _selectedOrg$ === void 0 ? void 0 : _selectedOrg$.applicationNumber;
      }
      var states = lodash.clone(data.body.inbox.moduleSearchCriteria.state ? data.body.inbox.moduleSearchCriteria.state : []);
      var ward = lodash.clone(data.body.inbox.moduleSearchCriteria.ward ? data.body.inbox.moduleSearchCriteria.ward : []);
      delete data.body.inbox.moduleSearchCriteria.state;
      delete data.body.inbox.moduleSearchCriteria.ward;
      states = (_Object$keys = Object.keys(states)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.filter(function (key) {
        return states[key];
      });
      ward = (_ward = ward) === null || _ward === void 0 ? void 0 : _ward.map(function (row) {
        return row === null || row === void 0 ? void 0 : row.code;
      });
      if (states.length > 0) data.body.inbox.moduleSearchCriteria.status = states;
      if (ward.length > 0) data.body.inbox.moduleSearchCriteria.ward = ward;
      var projectType = lodash.clone(data.body.inbox.moduleSearchCriteria.projectType ? data.body.inbox.moduleSearchCriteria.projectType : {});
      if (projectType !== null && projectType !== void 0 && projectType.code) data.body.inbox.moduleSearchCriteria.projectType = projectType.code;
      data.body.inbox.moduleSearchCriteria.tenantId = Digit$2.ULBService.getCurrentTenantId();
      data.body.inbox.limit = data.state.tableForm.limit;
      data.body.inbox.offset = data.state.tableForm.offset;
      delete data.state;
      return data;
    },
    postProcess: function postProcess(responseArray, uiConfig) {
      var _responseArray$status, _responseArray$status2;
      var statusOptions = responseArray === null || responseArray === void 0 ? void 0 : (_responseArray$status = responseArray.statusMap) === null || _responseArray$status === void 0 ? void 0 : (_responseArray$status2 = _responseArray$status.filter(function (item) {
        return item.applicationstatus;
      })) === null || _responseArray$status2 === void 0 ? void 0 : _responseArray$status2.map(function (item) {
        return {
          code: item.applicationstatus,
          i18nKey: "COMMON_MASTERS_" + item.applicationstatus
        };
      });
      if ((uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.type) === "filter") {
        var _uiConfig$fields;
        var fieldConfig = uiConfig === null || uiConfig === void 0 ? void 0 : (_uiConfig$fields = uiConfig.fields) === null || _uiConfig$fields === void 0 ? void 0 : _uiConfig$fields.filter(function (item) {
          return item.type === "dropdown" && item.populators.name === "musterRollStatus";
        });
        if (fieldConfig.length) {
          fieldConfig[0].populators.options = statusOptions;
        }
      }
    },
    additionalCustomizations: function additionalCustomizations(row, key, column, value, t, searchResult) {
      if (key === "ATM_MUSTER_ROLL_ID") {
        return /*#__PURE__*/React__default.createElement("span", {
          className: "link"
        }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
          to: "/" + window.contextPath + "/employee/attendencemgmt/view-attendance?tenantId=" + Digit$2.ULBService.getCurrentTenantId() + "&musterRollNumber=" + value
        }, String(value ? column.translate ? t(column.prefix ? "" + column.prefix + value : value) : value : t("ES_COMMON_NA"))));
      }
      if (key === "ATM_ATTENDANCE_WEEK") {
        var week = Digit$2.DateUtils.ConvertTimestampToDate(value === null || value === void 0 ? void 0 : value.startDate, "dd/MM/yyyy") + "-" + Digit$2.DateUtils.ConvertTimestampToDate(value === null || value === void 0 ? void 0 : value.endDate, "dd/MM/yyyy");
        return /*#__PURE__*/React__default.createElement("div", null, week);
      }
      if (key === "ATM_NO_OF_INDIVIDUALS") {
        return /*#__PURE__*/React__default.createElement("div", null, value === null || value === void 0 ? void 0 : value.length);
      }
      if (key === "ATM_AMOUNT_IN_RS") {
        return /*#__PURE__*/React__default.createElement("span", null, value ? Digit$2.Utils.dss.formatterWithoutRound(value, "number") : t("ES_COMMON_NA"));
      }
      if (key === "ATM_SLA") {
        return parseInt(value) > 0 ? /*#__PURE__*/React__default.createElement("span", {
          className: "sla-cell-success"
        }, t(value) || "") : /*#__PURE__*/React__default.createElement("span", {
          className: "sla-cell-error"
        }, t(value) || "");
      }
      if (key === "COMMON_WORKFLOW_STATES") {
        return /*#__PURE__*/React__default.createElement("span", null, t("WF_MUSTOR_" + value));
      }
      return /*#__PURE__*/React__default.createElement("span", null, t("CASE_NOT_HANDLED"));
    },
    MobileDetailsOnClick: function MobileDetailsOnClick(row, tenantId) {
      var link;
      Object.keys(row).map(function (key) {
        if (key === "ATM_MUSTER_ROLL_ID") link = "/" + window.contextPath + "/employee/attendencemgmt/view-attendance?tenantId=" + tenantId + "&musterRollNumber=" + row[key];
      });
      return link;
    },
    populateReqCriteria: function populateReqCriteria() {
      var tenantId = Digit$2.ULBService.getCurrentTenantId();
      return {
        url: "/org-services/organisation/v1/_search",
        params: {
          limit: 50,
          offset: 0
        },
        body: {
          SearchCriteria: {
            tenantId: tenantId,
            functions: {
              type: "CBO"
            }
          }
        },
        config: {
          enabled: true,
          select: function select(data) {
            return data === null || data === void 0 ? void 0 : data.organisations;
          }
        }
      };
    }
  },
  SearchWageSeekerConfig: {
    customValidationCheck: function customValidationCheck(data) {
      var createdFrom = data.createdFrom,
        createdTo = data.createdTo;
      if (createdFrom === "" && createdTo !== "" || createdFrom !== "" && createdTo === "") return {
        warning: true,
        label: "ES_COMMON_ENTER_DATE_RANGE"
      };
      return false;
    },
    preProcess: function preProcess(data) {
      data.params = _extends({}, data.params, {
        tenantId: Digit$2.ULBService.getCurrentTenantId()
      });
      var requestBody = _extends({}, data.body.Individual);
      var pathConfig = {
        name: "name.givenName"
      };
      var dateConfig = {
        createdFrom: "daystart",
        createdTo: "dayend"
      };
      var selectConfig = {
        wardCode: "wardCode[0].code",
        socialCategory: "socialCategory.code"
      };
      var textConfig = ["name", "individualId"];
      var Individual = Object.keys(requestBody).map(function (key) {
        if (selectConfig[key]) {
          requestBody[key] = lodash.get(requestBody, selectConfig[key], null);
        } else if (typeof requestBody[key] == "object") {
          var _requestBody$key;
          requestBody[key] = (_requestBody$key = requestBody[key]) === null || _requestBody$key === void 0 ? void 0 : _requestBody$key.code;
        } else if (textConfig !== null && textConfig !== void 0 && textConfig.includes(key)) {
          var _requestBody$key2;
          requestBody[key] = (_requestBody$key2 = requestBody[key]) === null || _requestBody$key2 === void 0 ? void 0 : _requestBody$key2.trim();
        }
        return key;
      }).filter(function (key) {
        return requestBody[key];
      }).reduce(function (acc, curr) {
        var _dateConfig$curr;
        if (pathConfig[curr]) {
          lodash.set(acc, pathConfig[curr], requestBody[curr]);
        } else if (dateConfig[curr] && (_dateConfig$curr = dateConfig[curr]) !== null && _dateConfig$curr !== void 0 && _dateConfig$curr.includes("day")) {
          lodash.set(acc, curr, Digit$2.Utils.date.convertDateToEpoch(requestBody[curr], dateConfig[curr]));
        } else {
          lodash.set(acc, curr, requestBody[curr]);
        }
        return acc;
      }, {});
      data.body.Individual = _extends({}, Individual);
      return data;
    },
    additionalCustomizations: function additionalCustomizations(row, key, column, value, t, searchResult) {
      switch (key) {
        case "MASTERS_WAGESEEKER_ID":
          return /*#__PURE__*/React__default.createElement("span", {
            className: "link"
          }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
            to: "/" + window.contextPath + "/employee/masters/view-wageseeker?tenantId=" + (row === null || row === void 0 ? void 0 : row.tenantId) + "&individualId=" + value
          }, String(value ? column.translate ? t(column.prefix ? "" + column.prefix + value : value) : value : t("ES_COMMON_NA"))));
        case "MASTERS_SOCIAL_CATEGORY":
          return value ? /*#__PURE__*/React__default.createElement("span", {
            style: {
              whiteSpace: "nowrap"
            }
          }, String(t("MASTERS_" + value))) : t("ES_COMMON_NA");
        case "CORE_COMMON_PROFILE_CITY":
          return value ? /*#__PURE__*/React__default.createElement("span", {
            style: {
              whiteSpace: "nowrap"
            }
          }, String(t(Digit$2.Utils.locale.getCityLocale(value)))) : t("ES_COMMON_NA");
        case "MASTERS_WARD":
          return value ? /*#__PURE__*/React__default.createElement("span", {
            style: {
              whiteSpace: "nowrap"
            }
          }, String(t(Digit$2.Utils.locale.getMohallaLocale(value, row === null || row === void 0 ? void 0 : row.tenantId)))) : t("ES_COMMON_NA");
        case "MASTERS_LOCALITY":
          return value ? /*#__PURE__*/React__default.createElement("span", {
            style: {
              whiteSpace: "break-spaces"
            }
          }, String(t(Digit$2.Utils.locale.getMohallaLocale(value, row === null || row === void 0 ? void 0 : row.tenantId)))) : t("ES_COMMON_NA");
        default:
          return t("ES_COMMON_NA");
      }
    },
    MobileDetailsOnClick: function MobileDetailsOnClick(row, tenantId) {
      var link;
      Object.keys(row).map(function (key) {
        if (key === "MASTERS_WAGESEEKER_ID") link = "/" + window.contextPath + "/employee/masters/view-wageseeker?tenantId=" + tenantId + "&wageseekerId=" + row[key];
      });
      return link;
    },
    additionalValidations: function additionalValidations(type, data, keys) {
      if (type === "date") {
        return data[keys.start] && data[keys.end] ? function () {
          return new Date(data[keys.start]).getTime() <= new Date(data[keys.end]).getTime();
        } : true;
      }
    }
  },
  SearchMDMSConfig: {
    customValidationCheck: function customValidationCheck(data) {
      var createdFrom = data.createdFrom,
        createdTo = data.createdTo;
      if (createdFrom === "" && createdTo !== "" || createdFrom !== "" && createdTo === "") return {
        warning: true,
        label: "ES_COMMON_ENTER_DATE_RANGE"
      };
      return false;
    },
    preProcess: function preProcess(data, additionalDetails) {
      var tenantId = Digit$2.ULBService.getCurrentTenantId();
      data.body.MdmsCriteria.tenantId = tenantId;
      var filters = {};
      var custom = data.body.MdmsCriteria.custom;
      var _ref = custom || {},
        field = _ref.field,
        value = _ref.value;
      filters[field === null || field === void 0 ? void 0 : field.code] = value;
      data.body.MdmsCriteria.filters = filters;
      data.body.MdmsCriteria.schemaCodes = [additionalDetails === null || additionalDetails === void 0 ? void 0 : additionalDetails.currentSchemaCode];
      delete data.body.MdmsCriteria.custom;
      return data;
    },
    additionalCustomizations: function additionalCustomizations(row, key, column, value, t, searchResult) {
      switch (key) {
        case "Unique Identifier":
          var _row$schemaCode$split = row.schemaCode.split("."),
            moduleName = _row$schemaCode$split[0],
            masterName = _row$schemaCode$split[1];
          return /*#__PURE__*/React__default.createElement("span", {
            className: "link"
          }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
            to: "/" + window.contextPath + "/employee/workbench/mdms-view?moduleName=" + moduleName + "&masterName=" + masterName + "&uniqueIdentifier=" + row.uniqueIdentifier
          }, String(value ? column.translate ? t(column.prefix ? "" + column.prefix + value : value) : value : t("ES_COMMON_NA"))));
        case "MASTERS_SOCIAL_CATEGORY":
          return value ? /*#__PURE__*/React__default.createElement("span", {
            style: {
              whiteSpace: "nowrap"
            }
          }, String(t("MASTERS_" + value))) : t("ES_COMMON_NA");
        case "CORE_COMMON_PROFILE_CITY":
          return value ? /*#__PURE__*/React__default.createElement("span", {
            style: {
              whiteSpace: "nowrap"
            }
          }, String(t(Digit$2.Utils.locale.getCityLocale(value)))) : t("ES_COMMON_NA");
        case "MASTERS_WARD":
          return value ? /*#__PURE__*/React__default.createElement("span", {
            style: {
              whiteSpace: "nowrap"
            }
          }, String(t(Digit$2.Utils.locale.getMohallaLocale(value, row === null || row === void 0 ? void 0 : row.tenantId)))) : t("ES_COMMON_NA");
        case "MASTERS_LOCALITY":
          return value ? /*#__PURE__*/React__default.createElement("span", {
            style: {
              whiteSpace: "break-spaces"
            }
          }, String(t(Digit$2.Utils.locale.getMohallaLocale(value, row === null || row === void 0 ? void 0 : row.tenantId)))) : t("ES_COMMON_NA");
        default:
          return t("ES_COMMON_NA");
      }
    },
    MobileDetailsOnClick: function MobileDetailsOnClick(row, tenantId) {
      var link;
      Object.keys(row).map(function (key) {
        if (key === "MASTERS_WAGESEEKER_ID") link = "/" + window.contextPath + "/employee/masters/view-wageseeker?tenantId=" + tenantId + "&wageseekerId=" + row[key];
      });
      return link;
    },
    additionalValidations: function additionalValidations(type, data, keys) {
      if (type === "date") {
        return data[keys.start] && data[keys.end] ? function () {
          return new Date(data[keys.start]).getTime() <= new Date(data[keys.end]).getTime();
        } : true;
      }
    }
  }
};

var ROLES = {
  LOCALISATION: ["EMPLOYEE", "SUPERUSER"],
  MDMS: ["MDMS_ADMIN", "EMPLOYEE", "SUPERUSER"],
  DSS: ["STADMIN"]
};
var WorkbenchCard = function WorkbenchCard() {
  var _window, _window2;
  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap(function (e) {
    return e;
  }))) {
    return null;
  }
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var links = [{
    label: t("ACTION_TEST_LOCALISATION"),
    link: "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/workbench/localisation-search",
    roles: ROLES.LOCALISATION
  }, {
    label: t("ACTION_TEST_MDMS"),
    link: "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/employee/workbench/mdms-search-v2",
    roles: ROLES.MDMS
  }];
  links = links.filter(function (link) {
    var _link$roles;
    return link !== null && link !== void 0 && link.roles && (link === null || link === void 0 ? void 0 : (_link$roles = link.roles) === null || _link$roles === void 0 ? void 0 : _link$roles.length) > 0 ? Digit.Utils.didEmployeeHasAtleastOneRole(link === null || link === void 0 ? void 0 : link.roles) : true;
  });
  var propsForModuleCard = {
    Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.WorksMgmtIcon, null),
    moduleName: t("ACTION_TEST_WORKBENCH"),
    kpis: [],
    links: links
  };
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmployeeModuleCard, propsForModuleCard);
};

var customStyles = {
  control: function control(provided, state) {
    return _extends({}, provided, {
      borderColor: state.isFocused ? '#f47738' : '#505a5f',
      borderRadius: 'unset',
      '&:hover': {
        borderColor: '#f47738'
      }
    });
  }
};
var CustomSelectWidget = function CustomSelectWidget(props) {
  var options = props.options,
    value = props.value,
    disabled = props.disabled,
    readonly = props.readonly,
    onChange = props.onChange,
    onBlur = props.onBlur,
    onFocus = props.onFocus,
    placeholder = props.placeholder,
    _props$multiple = props.multiple,
    multiple = _props$multiple === void 0 ? false : _props$multiple;
  var handleChange = function handleChange(selectedValue) {
    return onChange(multiple ? selectedValue === null || selectedValue === void 0 ? void 0 : selectedValue.value : selectedValue === null || selectedValue === void 0 ? void 0 : selectedValue.value);
  };
  var optionsList = (options === null || options === void 0 ? void 0 : options.enumOptions) || options || [];
  var selectedOption = optionsList === null || optionsList === void 0 ? void 0 : optionsList.filter(function (obj) {
    return multiple ? value === null || value === void 0 ? void 0 : value.includes(obj.value) : obj.value == value;
  });
  return /*#__PURE__*/React__default.createElement(Select, {
    className: "form-control form-select",
    classNamePrefix: "digit",
    options: optionsList,
    disabled: disabled || readonly,
    placeholder: placeholder,
    onBlur: onBlur,
    onFocus: onFocus,
    closeMenuOnScroll: true,
    value: selectedOption,
    onChange: handleChange,
    isSearchable: true,
    isMulti: multiple,
    styles: customStyles
  });
};

var CustomCheckbox = function CustomCheckbox(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    onClick: function onClick() {
      return props.onChange(!props.value);
    },
    className: "custom-checkbox"
  }, props.value && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ToggleSwitch, {
    value: true
  }), !props.value && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ToggleSwitch, {
    value: false
  }), /*#__PURE__*/React__default.createElement("span", {
    className: "custom-checkbox-label"
  }, props.value ? "True" : "False"));
};

var _uiSchema;
var uiSchema$1 = (_uiSchema = {
  "ui:title": " ",
  "ui:classNames": "my-class",
  "ui:submitButtonOptions": {
    props: {
      disabled: false,
      className: "btn btn-info"
    },
    norender: true,
    submitText: "Submit"
  }
}, _uiSchema["ui:submitButtonOptions"] = {
  props: {
    className: "object-jk"
  }
}, _uiSchema);
function transformErrors(errors) {
  var t = this.t;
  console.log(errors, "errors");
  return errors.map(function (error) {
    error.message = t(Digit.Utils.workbench.getMDMSLabel("WBH_ERROR_" + (error === null || error === void 0 ? void 0 : error.name)));
    if ((error === null || error === void 0 ? void 0 : error.name) === "pattern") {
      var _error$params;
      error.message += " : " + (error === null || error === void 0 ? void 0 : (_error$params = error.params) === null || _error$params === void 0 ? void 0 : _error$params.pattern);
    }
    return error;
  });
}
function ArrayFieldItemTemplate(props) {
  var _useTranslation = reactI18next.useTranslation();
  var children = props.children,
    className = props.className;
  return /*#__PURE__*/React__default.createElement("div", {
    className: className
  }, children);
}
function TitleFieldTemplate(props) {
  var id = props.id,
    required = props.required,
    title = props.title;
  return /*#__PURE__*/React__default.createElement("header", {
    id: id
  }, title, required && /*#__PURE__*/React__default.createElement("mark", null, "*"));
}
function ArrayFieldTitleTemplate(props) {
  var idSchema = props.idSchema;
  var id = utils$1.titleId(idSchema);
  return null;
}
function ArrayFieldTemplate(props) {
  var _useTranslation2 = reactI18next.useTranslation(),
    t = _useTranslation2.t;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "array-wrapper"
  }, props.items.map(function (element, index) {
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(ArrayFieldItemTemplate, _extends({
      title: props === null || props === void 0 ? void 0 : props.title,
      key: index,
      index: index
    }, element)));
  }), props.canAdd && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Button, {
    label: t("Add " + (props === null || props === void 0 ? void 0 : props.title)),
    variation: "secondary",
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.AddFilled, {
      style: {
        height: "20px",
        width: "20px"
      }
    }),
    onButtonClick: props.onAddClick,
    type: "button"
  }));
}
function ObjectFieldTemplate(props) {
  var _props$idSchema2, _props$idSchema3;
  var children = props.properties.map(function (element) {
    var _props$idSchema;
    return /*#__PURE__*/React__default.createElement("div", {
      className: "field-wrapper object-wrapper",
      id: (props === null || props === void 0 ? void 0 : (_props$idSchema = props.idSchema) === null || _props$idSchema === void 0 ? void 0 : _props$idSchema["$id"]) + "_" + element.name
    }, element.content);
  });
  var isRoot = (props === null || props === void 0 ? void 0 : (_props$idSchema2 = props["idSchema"]) === null || _props$idSchema2 === void 0 ? void 0 : _props$idSchema2["$id"]) == "digit_root";
  return /*#__PURE__*/React__default.createElement("div", {
    id: props === null || props === void 0 ? void 0 : (_props$idSchema3 = props.idSchema) === null || _props$idSchema3 === void 0 ? void 0 : _props$idSchema3["$id"]
  }, props.description, isRoot ? children : /*#__PURE__*/React__default.createElement(digitUiReactComponents.CollapseAndExpandGroups, {
    showHelper: true,
    groupHeader: "",
    groupElements: true,
    children: children
  }));
}
function CustomFieldTemplate(props) {
  var id = props.id,
    classNames = props.classNames,
    style = props.style,
    label = props.label,
    help = props.help,
    required = props.required,
    description = props.description,
    errors = props.errors,
    children = props.children;
  return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("div", {
    className: classNames,
    style: style
  }, /*#__PURE__*/React__default.createElement("label", {
    htmlFor: id,
    className: "control-label"
  }, label, required ? "*" : null), description, /*#__PURE__*/React__default.createElement("span", {
    "class": "all-input-field-wrapper"
  }, children, errors, help)));
}
var FieldErrorTemplate = function FieldErrorTemplate(props) {
  var errors = props.errors;
  return errors && errors.length > 0 && errors !== null && errors !== void 0 && errors[0] ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, errors === null || errors === void 0 ? void 0 : errors[0]) : null;
};
var DigitJSONForm = function DigitJSONForm(_ref) {
  var schema = _ref.schema,
    onSubmit = _ref.onSubmit,
    inputUiSchema = _ref.uiSchema,
    showToast = _ref.showToast,
    showErrorToast = _ref.showErrorToast,
    _ref$formData = _ref.formData,
    formData = _ref$formData === void 0 ? {} : _ref$formData,
    onFormChange = _ref.onFormChange,
    onFormError = _ref.onFormError,
    _ref$screenType = _ref.screenType,
    screenType = _ref$screenType === void 0 ? "add" : _ref$screenType,
    onViewActionsSelect = _ref.onViewActionsSelect,
    viewActions = _ref.viewActions;
  var _useTranslation3 = reactI18next.useTranslation(),
    t = _useTranslation3.t;
  var onSubmitV2 = function onSubmitV2(_ref2) {
    var formData = _ref2.formData;
    onSubmit(formData);
  };
  var customWidgets = {
    SelectWidget: CustomSelectWidget,
    CheckboxWidget: CustomCheckbox
  };
  var _useState = React.useState(false),
    displayMenu = _useState[0],
    setDisplayMenu = _useState[1];
  var _useState2 = React.useState(false),
    liveValidate = _useState2[0],
    setLiveValidate = _useState2[1];
  var onError = function onError(errors) {
    setLiveValidate(true);
    onFormError(errors);
  };
  var person = {
    t: t
  };
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, {
    className: "digit-form-composer-header"
  }, screenType === "add" ? t("WBH_ADD_MDMS") : screenType === "view" ? t("WBH_VIEW_MDMS") : t("WBH_EDIT_MDMS")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    className: "workbench-create-form"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, {
    className: "digit-form-composer-sub-header"
  }, t(Digit.Utils.workbench.getMDMSLabel("SCHEMA_" + (schema === null || schema === void 0 ? void 0 : schema.code)))), /*#__PURE__*/React__default.createElement(Form, {
    schema: schema === null || schema === void 0 ? void 0 : schema.definition,
    validator: validator,
    showErrorList: false,
    formData: formData,
    noHtml5Validate: true,
    onChange: onFormChange,
    onSubmit: onSubmitV2,
    idPrefix: "digit_root",
    templates: {
      FieldErrorTemplate: FieldErrorTemplate,
      ArrayFieldTemplate: ArrayFieldTemplate,
      FieldTemplate: CustomFieldTemplate,
      ObjectFieldTemplate: ObjectFieldTemplate,
      TitleFieldTemplate: TitleFieldTemplate,
      ArrayFieldTitleTemplate: ArrayFieldTitleTemplate,
      ArrayFieldItemTemplate: ArrayFieldItemTemplate
    },
    experimental_defaultFormStateBehavior: {
      arrayMinItems: {
        populate: "requiredOnly"
      }
    },
    widgets: customWidgets,
    transformErrors: transformErrors.bind(person),
    uiSchema: _extends({}, uiSchema$1, inputUiSchema),
    onError: onError,
    liveValidate: liveValidate
  }, (screenType === "add" || screenType === "edit") && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: screenType === "edit" ? t("WBH_ADD_MDMS_UPDATE_ACTION") : t("WBH_ADD_MDMS_ADD_ACTION"),
    submit: "submit"
  })), screenType === "view" && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, null, displayMenu ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Menu, {
    localeKeyPrefix: "",
    options: viewActions,
    optionKey: "label",
    t: t,
    onSelect: onViewActionsSelect,
    textStyles: {
      margin: "0px"
    }
  }) : null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("WORKS_ACTIONS"),
    onSubmit: function onSubmit() {
      return setDisplayMenu(!displayMenu);
    }
  })))), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    label: t(showToast),
    error: showErrorToast
  }));
};

var WorkbenchModule = function WorkbenchModule(_ref) {
  var stateCode = _ref.stateCode;
  var moduleCode = ["workbench", "mdms", "schema"];
  var _useRouteMatch = reactRouterDom.useRouteMatch(),
    path = _useRouteMatch.path;
  var language = Digit.StoreData.getCurrentLanguage();
  var _Digit$Services$useSt = Digit.Services.useStore({
      stateCode: stateCode,
      moduleCode: moduleCode,
      language: language
    }),
    isLoading = _Digit$Services$useSt.isLoading;
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(App, {
    path: path,
    stateCode: stateCode
  });
};
var componentsToRegister = {
  WorkbenchModule: WorkbenchModule,
  WorkbenchCard: WorkbenchCard,
  DigitJSONForm: DigitJSONForm,
  DSSCard: null
};
var overrideHooks = function overrideHooks() {
  Object.keys(CustomisedHooks).map(function (ele) {
    if (ele === "Hooks") {
      Object.keys(CustomisedHooks[ele]).map(function (hook) {
        Object.keys(CustomisedHooks[ele][hook]).map(function (method) {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method]);
        });
      });
    } else if (ele === "Utils") {
      Object.keys(CustomisedHooks[ele]).map(function (hook) {
        Object.keys(CustomisedHooks[ele][hook]).map(function (method) {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method], false);
        });
      });
    } else {
      Object.keys(CustomisedHooks[ele]).map(function (method) {
        setupLibraries(ele, method, CustomisedHooks[ele][method]);
      });
    }
  });
};
var setupHooks = function setupHooks(HookName, HookFunction, method, isHook) {
  if (isHook === void 0) {
    isHook = true;
  }
  window.Digit = window.Digit || {};
  window.Digit[isHook ? "Hooks" : "Utils"] = window.Digit[isHook ? "Hooks" : "Utils"] || {};
  window.Digit[isHook ? "Hooks" : "Utils"][HookName] = window.Digit[isHook ? "Hooks" : "Utils"][HookName] || {};
  window.Digit[isHook ? "Hooks" : "Utils"][HookName][HookFunction] = method;
};
var setupLibraries = function setupLibraries(Library, service, method) {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = method;
};
var updateCustomConfigs = function updateCustomConfigs() {
  var _window, _window$Digit, _window$Digit$Customi;
  setupLibraries("Customizations", "commonUiConfig", _extends({}, (_window = window) === null || _window === void 0 ? void 0 : (_window$Digit = _window.Digit) === null || _window$Digit === void 0 ? void 0 : (_window$Digit$Customi = _window$Digit.Customizations) === null || _window$Digit$Customi === void 0 ? void 0 : _window$Digit$Customi.commonUiConfig, UICustomizations));
};
var initWorkbenchComponents = function initWorkbenchComponents() {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(function (_ref2) {
    var key = _ref2[0],
      value = _ref2[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

exports.DigitJSONForm = DigitJSONForm;
exports.initWorkbenchComponents = initWorkbenchComponents;
//# sourceMappingURL=index.js.map
