function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var digitUiReactComponents = require('@egovernments/digit-ui-react-components');
var React = require('react');
var React__default = _interopDefault(React);
var reactI18next = require('react-i18next');
var reactQuery = require('react-query');
var reactRedux = require('react-redux');
var reactRouterDom = require('react-router-dom');
var ReactTooltip = _interopDefault(require('react-tooltip'));
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));

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
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
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

var ErrorConfig = {
  error: {
    imgUrl: "https://s3.ap-south-1.amazonaws.com/egov-qa-assets/error-image.png",
    infoMessage: "CORE_SOMETHING_WENT_WRONG",
    buttonInfo: "ACTION_TEST_HOME"
  },
  maintenance: {
    imgUrl: "https://s3.ap-south-1.amazonaws.com/egov-qa-assets/maintainence-image.png",
    infoMessage: "CORE_UNDER_MAINTENANCE",
    buttonInfo: "ACTION_TEST_HOME"
  },
  notfound: {
    imgUrl: "https://s3.ap-south-1.amazonaws.com/egov-qa-assets/PageNotFound.png",
    infoMessage: "MODULE_NOT_FOUND",
    buttonInfo: "ACTION_TEST_HOME"
  }
};
var ErrorComponent = function ErrorComponent(props) {
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    _Digit$Hooks$useQuery2 = _Digit$Hooks$useQuery.type,
    type = _Digit$Hooks$useQuery2 === void 0 ? "error" : _Digit$Hooks$useQuery2;
  var config = ErrorConfig[type];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "error-boundary"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "error-container"
  }, /*#__PURE__*/React__default.createElement("img", {
    src: config.imgUrl,
    alt: "error"
  }), /*#__PURE__*/React__default.createElement("h1", null, t(config.infoMessage)), /*#__PURE__*/React__default.createElement("button", {
    onClick: function onClick() {
      props.goToHome();
    }
  }, t(config.buttonInfo))));
};

var Redircter = function Redircter() {
  var _window, _window2;
  var path = Digit.UserService.getType() === "employee" ? "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/user/error" : "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen/error";
  if (window.location.href.includes("employee/user/error") || window.location.href.includes("citizen/error") || process.env.NODE_ENV === "development") ; else {
    window.location.href = path;
  }
  return /*#__PURE__*/React__default.createElement("span", null);
};
var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ErrorBoundary, _React$Component);
  function ErrorBoundary(props) {
    var _this;
    _this = _React$Component.call(this, props) || this;
    _this.state = {
      error: null,
      errorStack: null,
      hasError: false
    };
    return _this;
  }
  ErrorBoundary.getDerivedStateFromError = function getDerivedStateFromError(error) {
    return {
      error: error === null || error === void 0 ? void 0 : error.message,
      hasError: true,
      errorStack: error === null || error === void 0 ? void 0 : error.stack
    };
  };
  var _proto = ErrorBoundary.prototype;
  _proto.componentDidCatch = function componentDidCatch(error, errorInfo) {
    this.setState({
      error: error === null || error === void 0 ? void 0 : error.message,
      hasError: true,
      errorStack: error === null || error === void 0 ? void 0 : error.stack
    });
  };
  _proto.render = function render() {
    if (this.state.hasError) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "error-boundary"
      }, /*#__PURE__*/React__default.createElement(Redircter, null), /*#__PURE__*/React__default.createElement(ErrorComponent, {
        initData: this.props.initData
      }));
    }
    return this.props.children;
  };
  return ErrorBoundary;
}(React__default.Component);

var processLinkData = function processLinkData(newData, code, t) {
  var obj = newData === null || newData === void 0 ? void 0 : newData["" + code];
  if (obj) {
    obj.map(function (link) {
      link.link = link["navigationURL"], link.i18nKey = t(link["name"]);
    });
  }
  var newObj = {
    links: obj === null || obj === void 0 ? void 0 : obj.reverse(),
    header: Digit.Utils.locale.getTransformedLocale("ACTION_TEST_" + code),
    iconName: "CITIZEN_" + code + "_ICON"
  };
  if (code === "FSM") {
    var _window;
    var roleBasedLoginRoutes = [{
      role: "FSM_DSO",
      from: "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/citizen/fsm/dso-dashboard",
      dashoardLink: "CS_LINK_DSO_DASHBOARD",
      loginLink: "CS_LINK_LOGIN_DSO"
    }];
    roleBasedLoginRoutes.map(function (_ref) {
      var _newObj$links, _newObj$links2, _window2;
      var role = _ref.role,
        from = _ref.from,
        loginLink = _ref.loginLink,
        dashoardLink = _ref.dashoardLink;
      if (Digit.UserService.hasAccess(role)) newObj === null || newObj === void 0 ? void 0 : (_newObj$links = newObj.links) === null || _newObj$links === void 0 ? void 0 : _newObj$links.push({
        link: from,
        i18nKey: t(dashoardLink)
      });else newObj === null || newObj === void 0 ? void 0 : (_newObj$links2 = newObj.links) === null || _newObj$links2 === void 0 ? void 0 : _newObj$links2.push({
        link: "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen/login",
        state: {
          role: "FSM_DSO",
          from: from
        },
        i18nKey: t(loginLink)
      });
    });
  }
  return newObj;
};
var iconSelector = function iconSelector(code) {
  switch (code) {
    case "PT":
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.PTIcon, {
        className: "fill-path-primary-main"
      });
    case "WS":
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.WSICon, {
        className: "fill-path-primary-main"
      });
    case "FSM":
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FSMIcon, {
        className: "fill-path-primary-main"
      });
    case "MCollect":
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.MCollectIcon, {
        className: "fill-path-primary-main"
      });
    case "PGR":
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.PGRIcon, {
        className: "fill-path-primary-main"
      });
    case "TL":
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.TLIcon, {
        className: "fill-path-primary-main"
      });
    case "OBPS":
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.OBPSIcon, {
        className: "fill-path-primary-main"
      });
    case "Bills":
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.BillsIcon, {
        className: "fill-path-primary-main"
      });
    default:
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.PTIcon, {
        className: "fill-path-primary-main"
      });
  }
};
var CitizenHome = function CitizenHome(_ref2) {
  var modules = _ref2.modules,
    getCitizenMenu = _ref2.getCitizenMenu,
    fetchedCitizen = _ref2.fetchedCitizen,
    isLoading = _ref2.isLoading;
  var paymentModule = modules.filter(function (_ref3) {
    var code = _ref3.code;
    return code === "Payment";
  })[0];
  var moduleArr = modules.filter(function (_ref4) {
    var code = _ref4.code;
    return code !== "Payment";
  });
  var moduleArray = [paymentModule].concat(moduleArr);
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "citizen-all-services-wrapper"
  }, location.pathname.includes("sanitation-ui/citizen/all-services") ? null : /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null), /*#__PURE__*/React__default.createElement("div", {
    className: "citizenAllServiceGrid"
  }, moduleArray.filter(function (mod) {
    return mod;
  }).map(function (_ref5, index) {
    var _mdmsDataObj, _mdmsDataObj$links;
    var code = _ref5.code;
    var mdmsDataObj;
    if (fetchedCitizen) mdmsDataObj = fetchedCitizen ? processLinkData(getCitizenMenu, code, t) : undefined;
    if (((_mdmsDataObj = mdmsDataObj) === null || _mdmsDataObj === void 0 ? void 0 : (_mdmsDataObj$links = _mdmsDataObj.links) === null || _mdmsDataObj$links === void 0 ? void 0 : _mdmsDataObj$links.length) > 0) {
      var _mdmsDataObj2, _mdmsDataObj3, _mdmsDataObj3$links, _mdmsDataObj3$links$f;
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenHomeCard, {
        header: t((_mdmsDataObj2 = mdmsDataObj) === null || _mdmsDataObj2 === void 0 ? void 0 : _mdmsDataObj2.header),
        links: (_mdmsDataObj3 = mdmsDataObj) === null || _mdmsDataObj3 === void 0 ? void 0 : (_mdmsDataObj3$links = _mdmsDataObj3.links) === null || _mdmsDataObj3$links === void 0 ? void 0 : (_mdmsDataObj3$links$f = _mdmsDataObj3$links.filter(function (ele) {
          return ele === null || ele === void 0 ? void 0 : ele.link;
        })) === null || _mdmsDataObj3$links$f === void 0 ? void 0 : _mdmsDataObj3$links$f.sort(function (x, y) {
          return (x === null || x === void 0 ? void 0 : x.orderNumber) - (y === null || y === void 0 ? void 0 : y.orderNumber);
        }),
        Icon: function Icon() {
          return iconSelector(code);
        },
        Info: code === "OBPS" ? function () {
          return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenInfoLabel, {
            style: {
              margin: "0px",
              padding: "10px"
            },
            info: t("CS_FILE_APPLICATION_INFO_LABEL"),
            text: t("BPA_CITIZEN_HOME_STAKEHOLDER_INCLUDES_INFO_LABEL")
          });
        } : null,
        isInfo: code === "OBPS" ? true : false
      });
    } else return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
  }))));
};
var EmployeeHome = function EmployeeHome(_ref6) {
  var modules = _ref6.modules;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "employee-app-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "ground-container moduleCardWrapper gridModuleWrapper"
  }, modules.map(function (_ref7, index) {
    var code = _ref7.code;
    var Card = Digit.ComponentRegistryService.getComponent(code + "Card") || function () {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
    };
    return /*#__PURE__*/React__default.createElement(Card, {
      key: index
    });
  })));
};
var AppHome = function AppHome(_ref8) {
  var userType = _ref8.userType,
    modules = _ref8.modules,
    getCitizenMenu = _ref8.getCitizenMenu,
    fetchedCitizen = _ref8.fetchedCitizen,
    isLoading = _ref8.isLoading;
  if (userType === "citizen") {
    return /*#__PURE__*/React__default.createElement(CitizenHome, {
      modules: modules,
      getCitizenMenu: getCitizenMenu,
      fetchedCitizen: fetchedCitizen,
      isLoading: isLoading
    });
  }
  return /*#__PURE__*/React__default.createElement(EmployeeHome, {
    modules: modules
  });
};

var stringReplaceAll = function stringReplaceAll(str, searcher, replaceWith) {
  if (str === void 0) {
    str = "";
  }
  if (searcher === void 0) {
    searcher = "";
  }
  if (replaceWith === void 0) {
    replaceWith = "";
  }
  if (searcher == "") return str;
  while ((_str = str) !== null && _str !== void 0 && _str.includes(searcher)) {
    var _str, _str2;
    str = (_str2 = str) === null || _str2 === void 0 ? void 0 : _str2.replace(searcher, replaceWith);
  }
  return str;
};
var ChangeCity = function ChangeCity(prop) {
  var _stringReplaceAll2;
  var _useState = React.useState(null),
    dropDownData = _useState[0],
    setDropDownData = _useState[1];
  var _useState2 = React.useState([]),
    selectCityData = _useState2[0],
    setSelectCityData = _useState2[1];
  var _useState3 = React.useState([]);
  var history = reactRouterDom.useHistory();
  var selectedCities = [];
  var handleChangeCity = function handleChangeCity(city) {
    var _Digit$SessionStorage, _Digit$SessionStorage2, _Digit$SessionStorage3, _window;
    var loggedInData = Digit.SessionStorage.get("citizen.userRequestObject");
    var filteredRoles = (_Digit$SessionStorage = Digit.SessionStorage.get("citizen.userRequestObject")) === null || _Digit$SessionStorage === void 0 ? void 0 : (_Digit$SessionStorage2 = _Digit$SessionStorage.info) === null || _Digit$SessionStorage2 === void 0 ? void 0 : (_Digit$SessionStorage3 = _Digit$SessionStorage2.roles) === null || _Digit$SessionStorage3 === void 0 ? void 0 : _Digit$SessionStorage3.filter(function (role) {
      return role.tenantId === city.value;
    });
    if ((filteredRoles === null || filteredRoles === void 0 ? void 0 : filteredRoles.length) > 0) {
      loggedInData.info.roles = filteredRoles;
      loggedInData.info.tenantId = city === null || city === void 0 ? void 0 : city.value;
    }
    Digit.SessionStorage.set("Employee.tenantId", city === null || city === void 0 ? void 0 : city.value);
    Digit.UserService.setUser(loggedInData);
    setDropDownData(city);
    if (window.location.href.includes("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/")) {
      var _location$state, _window2;
      var redirectPath = ((_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.from) || "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/employee";
      history.replace(redirectPath);
    }
    window.location.reload();
  };
  React.useEffect(function () {
    var _userloggedValues$inf, _userloggedValues$inf2;
    var userloggedValues = Digit.SessionStorage.get("citizen.userRequestObject");
    var teantsArray = [],
      filteredArray = [];
    userloggedValues === null || userloggedValues === void 0 ? void 0 : (_userloggedValues$inf = userloggedValues.info) === null || _userloggedValues$inf === void 0 ? void 0 : (_userloggedValues$inf2 = _userloggedValues$inf.roles) === null || _userloggedValues$inf2 === void 0 ? void 0 : _userloggedValues$inf2.forEach(function (role) {
      return teantsArray.push(role.tenantId);
    });
    var unique = teantsArray.filter(function (item, i, ar) {
      return ar.indexOf(item) === i;
    });
    unique === null || unique === void 0 ? void 0 : unique.forEach(function (uniCode) {
      var _stringReplaceAll;
      filteredArray.push({
        label: "TENANT_TENANTS_" + ((_stringReplaceAll = stringReplaceAll(uniCode, ".", "_")) === null || _stringReplaceAll === void 0 ? void 0 : _stringReplaceAll.toUpperCase()),
        value: uniCode
      });
    });
    selectedCities = filteredArray === null || filteredArray === void 0 ? void 0 : filteredArray.filter(function (select) {
      return select.value == Digit.SessionStorage.get("Employee.tenantId");
    });
    setSelectCityData(filteredArray);
  }, [dropDownData]);
  return /*#__PURE__*/React__default.createElement("div", {
    style: prop !== null && prop !== void 0 && prop.mobileView ? {
      color: "#767676"
    } : {}
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    t: prop === null || prop === void 0 ? void 0 : prop.t,
    option: selectCityData,
    selected: selectCityData.find(function (cityValue) {
      return cityValue.value === (dropDownData === null || dropDownData === void 0 ? void 0 : dropDownData.value);
    }),
    optionKey: "label",
    select: handleChangeCity,
    freeze: true,
    customSelector: /*#__PURE__*/React__default.createElement("label", {
      className: "cp"
    }, prop === null || prop === void 0 ? void 0 : prop.t("TENANT_TENANTS_" + ((_stringReplaceAll2 = stringReplaceAll(Digit.SessionStorage.get("Employee.tenantId"), ".", "_")) === null || _stringReplaceAll2 === void 0 ? void 0 : _stringReplaceAll2.toUpperCase())))
  }));
};

var ChangeLanguage = function ChangeLanguage(prop) {
  var isDropdown = prop.dropdown || false;
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    storeData = _Digit$Hooks$useStore.data,
    isLoading = _Digit$Hooks$useStore.isLoading;
  var _ref = storeData || {},
    languages = _ref.languages,
    stateInfo = _ref.stateInfo;
  var selectedLanguage = Digit.StoreData.getCurrentLanguage();
  var _useState = React.useState(selectedLanguage),
    selected = _useState[0],
    setselected = _useState[1];
  var handleChangeLanguage = function handleChangeLanguage(language) {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };
  if (isLoading) return null;
  if (isDropdown) {
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      option: languages,
      selected: languages.find(function (language) {
        return language.value === selectedLanguage;
      }),
      optionKey: "label",
      select: handleChangeLanguage,
      freeze: true,
      customSelector: /*#__PURE__*/React__default.createElement("label", {
        className: "cp"
      }, languages.find(function (language) {
        return language.value === selected;
      }).label)
    }));
  } else {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      style: {
        marginBottom: "5px"
      }
    }, "Language"), /*#__PURE__*/React__default.createElement("div", {
      className: "language-selector"
    }, languages.map(function (language, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "language-button-container",
        key: index
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CustomButton, {
        selected: language.value === selected,
        text: language.label,
        onClick: function onClick() {
          return handleChangeLanguage(language);
        }
      }));
    })));
  }
};

var TextToImg = function TextToImg(props) {
  var _props$name, _props$name$;
  return /*#__PURE__*/React__default.createElement("span", {
    className: "user-img-txt",
    onClick: props.toggleMenu,
    title: props.name
  }, props === null || props === void 0 ? void 0 : (_props$name = props.name) === null || _props$name === void 0 ? void 0 : (_props$name$ = _props$name[0]) === null || _props$name$ === void 0 ? void 0 : _props$name$.toUpperCase());
};
var TopBar = function TopBar(_ref) {
  var _userDetails$info2, _cityDetails$city, _cityDetails$city2, _stateInfo$code, _userDetails$info3, _userDetails$info4, _userDetails$info4$us;
  var t = _ref.t,
    stateInfo = _ref.stateInfo,
    toggleSidebar = _ref.toggleSidebar,
    handleLogout = _ref.handleLogout,
    userDetails = _ref.userDetails,
    CITIZEN = _ref.CITIZEN,
    cityDetails = _ref.cityDetails,
    mobileView = _ref.mobileView,
    userOptions = _ref.userOptions,
    handleUserDropdownSelection = _ref.handleUserDropdownSelection,
    logoUrl = _ref.logoUrl,
    _ref$showLanguageChan = _ref.showLanguageChange,
    showLanguageChange = _ref$showLanguageChan === void 0 ? true : _ref$showLanguageChan;
  var _React$useState = React__default.useState(null),
    profilePic = _React$useState[0],
    setProfilePic = _React$useState[1];
  React__default.useEffect(function () {
    try {
      var _userDetails$info;
      var tenant = Digit.ULBService.getCurrentTenantId();
      var uuid = userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$info = userDetails.info) === null || _userDetails$info === void 0 ? void 0 : _userDetails$info.uuid;
      var _temp = function () {
        if (uuid) {
          return Promise.resolve(Digit.UserService.userSearch(tenant, {
            uuid: [uuid]
          }, {})).then(function (usersResponse) {
            if (usersResponse && usersResponse.user && usersResponse.user.length) {
              var _userDetails$photo;
              var _userDetails = usersResponse.user[0];
              var thumbs = _userDetails === null || _userDetails === void 0 ? void 0 : (_userDetails$photo = _userDetails.photo) === null || _userDetails$photo === void 0 ? void 0 : _userDetails$photo.split(",");
              setProfilePic(thumbs === null || thumbs === void 0 ? void 0 : thumbs.at(0));
            }
          });
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [profilePic !== null, userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$info2 = userDetails.info) === null || _userDetails$info2 === void 0 ? void 0 : _userDetails$info2.uuid]);
  var CitizenHomePageTenantId = Digit.ULBService.getCitizenCurrentTenant(true);
  var history = reactRouterDom.useHistory();
  var _useLocation = reactRouterDom.useLocation(),
    pathname = _useLocation.pathname;
  var conditionsToDisableNotificationCountTrigger = function conditionsToDisableNotificationCountTrigger() {
    var _Digit$UserService, _Digit$UserService$ge, _Digit$UserService$ge2, _Digit$UserService2, _Digit$UserService2$g, _Digit$UserService2$g2;
    if (((_Digit$UserService = Digit.UserService) === null || _Digit$UserService === void 0 ? void 0 : (_Digit$UserService$ge = _Digit$UserService.getUser()) === null || _Digit$UserService$ge === void 0 ? void 0 : (_Digit$UserService$ge2 = _Digit$UserService$ge.info) === null || _Digit$UserService$ge2 === void 0 ? void 0 : _Digit$UserService$ge2.type) === "EMPLOYEE") return false;
    if (((_Digit$UserService2 = Digit.UserService) === null || _Digit$UserService2 === void 0 ? void 0 : (_Digit$UserService2$g = _Digit$UserService2.getUser()) === null || _Digit$UserService2$g === void 0 ? void 0 : (_Digit$UserService2$g2 = _Digit$UserService2$g.info) === null || _Digit$UserService2$g2 === void 0 ? void 0 : _Digit$UserService2$g2.type) === "CITIZEN") {
      if (!CitizenHomePageTenantId) return false;else return true;
    }
    return false;
  };
  var _Digit$Hooks$useNotif = Digit.Hooks.useNotificationCount({
      tenantId: CitizenHomePageTenantId,
      config: {
        enabled: conditionsToDisableNotificationCountTrigger()
      }
    }),
    _Digit$Hooks$useNotif2 = _Digit$Hooks$useNotif.data,
    _Digit$Hooks$useNotif3 = _Digit$Hooks$useNotif2 === void 0 ? {} : _Digit$Hooks$useNotif2,
    unreadNotificationCount = _Digit$Hooks$useNotif3.unreadCount,
    notificationCountLoaded = _Digit$Hooks$useNotif.isSuccess;
  var updateSidebar = function updateSidebar() {
    if (!Digit.clikOusideFired) {
      toggleSidebar(true);
    } else {
      Digit.clikOusideFired = false;
    }
  };
  function onNotificationIconClick() {
    var _window;
    history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/citizen/engagement/notifications");
  }
  var urlsToDisableNotificationIcon = function urlsToDisableNotificationIcon(pathname) {
    var _Digit$UserService3, _Digit$UserService3$g, _window2, _window3;
    return !!((_Digit$UserService3 = Digit.UserService) !== null && _Digit$UserService3 !== void 0 && (_Digit$UserService3$g = _Digit$UserService3.getUser()) !== null && _Digit$UserService3$g !== void 0 && _Digit$UserService3$g.access_token) ? false : ["/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen/select-language", "/" + ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) + "/citizen/select-location"].includes(pathname);
  };
  if (CITIZEN) {
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TopBar, {
      img: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.logoUrlWhite,
      isMobile: true,
      toggleSidebar: updateSidebar,
      logoUrl: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.logoUrlWhite,
      onLogout: handleLogout,
      userDetails: userDetails,
      notificationCount: unreadNotificationCount < 99 ? unreadNotificationCount : 99,
      notificationCountLoaded: notificationCountLoaded,
      cityOfCitizenShownBesideLogo: t(CitizenHomePageTenantId),
      onNotificationIconClick: onNotificationIconClick,
      hideNotificationIconOnSomeUrlsWhenNotLoggedIn: urlsToDisableNotificationIcon(pathname),
      changeLanguage: !mobileView ? /*#__PURE__*/React__default.createElement(ChangeLanguage, {
        dropdown: true
      }) : null
    }));
  }
  var loggedin = userDetails !== null && userDetails !== void 0 && userDetails.access_token ? true : false;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "topbar"
  }, mobileView ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Hamburger, {
    handleClick: toggleSidebar,
    color: "#9E9E9E"
  }) : null, /*#__PURE__*/React__default.createElement("img", {
    className: "city",
    src: loggedin ? cityDetails === null || cityDetails === void 0 ? void 0 : cityDetails.logoId : stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.statelogo
  }), /*#__PURE__*/React__default.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    }
  }, loggedin && (cityDetails !== null && cityDetails !== void 0 && (_cityDetails$city = cityDetails.city) !== null && _cityDetails$city !== void 0 && _cityDetails$city.ulbGrade ? /*#__PURE__*/React__default.createElement("p", {
    className: "ulb",
    style: mobileView ? {
      fontSize: "14px",
      display: "inline-block"
    } : {}
  }, t(cityDetails === null || cityDetails === void 0 ? void 0 : cityDetails.i18nKey).toUpperCase(), " ", t("ULBGRADE_" + (cityDetails === null || cityDetails === void 0 ? void 0 : (_cityDetails$city2 = cityDetails.city) === null || _cityDetails$city2 === void 0 ? void 0 : _cityDetails$city2.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_"))).toUpperCase()) : /*#__PURE__*/React__default.createElement("img", {
    className: "state",
    src: logoUrl
  })), !loggedin && /*#__PURE__*/React__default.createElement("p", {
    className: "ulb",
    style: mobileView ? {
      fontSize: "14px",
      display: "inline-block"
    } : {}
  }, t("MYCITY_" + (stateInfo === null || stateInfo === void 0 ? void 0 : (_stateInfo$code = stateInfo.code) === null || _stateInfo$code === void 0 ? void 0 : _stateInfo$code.toUpperCase()) + "_LABEL"), " ", t("MYCITY_STATECODE_LABEL")), !mobileView && /*#__PURE__*/React__default.createElement("div", {
    className: mobileView ? "right" : "flex-right right w-80 column-gap-15",
    style: !loggedin ? {
      width: "80%"
    } : {}
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "left"
  }, !window.location.href.includes("employee/user/login") && !window.location.href.includes("employee/user/language-selection") && /*#__PURE__*/React__default.createElement(ChangeCity, {
    dropdown: true,
    t: t
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "left"
  }, showLanguageChange && /*#__PURE__*/React__default.createElement(ChangeLanguage, {
    dropdown: true
  })), (userDetails === null || userDetails === void 0 ? void 0 : userDetails.access_token) && /*#__PURE__*/React__default.createElement("div", {
    className: "left"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    option: userOptions,
    optionKey: "name",
    select: handleUserDropdownSelection,
    showArrow: true,
    freeze: true,
    style: mobileView ? {
      right: 0
    } : {},
    optionCardStyles: {
      overflow: "revert",
      display: "table"
    },
    customSelector: profilePic == null ? /*#__PURE__*/React__default.createElement(TextToImg, {
      name: (userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$info3 = userDetails.info) === null || _userDetails$info3 === void 0 ? void 0 : _userDetails$info3.name) || (userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$info4 = userDetails.info) === null || _userDetails$info4 === void 0 ? void 0 : (_userDetails$info4$us = _userDetails$info4.userInfo) === null || _userDetails$info4$us === void 0 ? void 0 : _userDetails$info4$us.name) || "Employee"
    }) : /*#__PURE__*/React__default.createElement("img", {
      src: profilePic,
      style: {
        height: "48px",
        width: "48px",
        borderRadius: "50%"
      }
    })
  })), /*#__PURE__*/React__default.createElement("img", {
    className: "state",
    src: logoUrl
  }))));
};

var SideBarMenu = function SideBarMenu(t, closeSidebar, redirectToLoginPage, isEmployee) {
  var _window, _window2;
  return [{
    type: "link",
    element: "HOME",
    text: t("COMMON_BOTTOM_NAVIGATION_HOME"),
    link: isEmployee ? "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee" : "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen",
    icon: "HomeIcon",
    populators: {
      onClick: closeSidebar
    }
  }, {
    type: "component",
    element: "LANGUAGE",
    action: /*#__PURE__*/React__default.createElement(ChangeLanguage, null),
    icon: "LanguageIcon"
  }, {
    id: "login-btn",
    element: "LOGIN",
    text: t("CORE_COMMON_LOGIN"),
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.LogoutIcon, {
      className: "icon"
    }),
    populators: {
      onClick: redirectToLoginPage
    }
  }];
};

var defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAADUCAMAAACs0e/bAAAAM1BMVEXK0eL" + "/" + "/" + "/" + "/Dy97GzuD4+fvL0uPg5O7T2efb4OvR1+Xr7vTk5/Df4+37/P3v8fbO1eTt8PUsnq5FAAAGqElEQVR4nO2d25ajIBBFCajgvf/" + "/a0eMyZgEjcI5xgt7Hmatme507UaxuJXidiDqjmSgeVIMlB1ZR1WZAf2gbdu0QwixSYzjOJPmHurfEGEfY9XzjNGG9whQCeVAuv5xQEySLtR9hPuIcwj0EeroN5m3D1IbsbgHK0esiQ9MKs" + "qXVr8Hm/a/Pulk6wihpCIXBw3dh7bTvRBt9+dC5NfS1VH3xETdM3MxXRN1T0zUPTNR98xcS1dlV9NNfx3DhkTdM6PKqHteVBF1z0vU5f0sKdpc2zWLKutXrjJjdLvpesRmukqYonauPhXpds" + "Lb6CppmpnltsYIuY2yavi6Mi2/rzAWm1zUfF0limVLqkZyA+mDYevKBS37aGC+L1lX5e7uyU1Cv565uiua9k5LFqbqqrnu2I3m+jJ11ZoLeRtfmdB0Uw/ZDsP0VTxdn7a1VERfmq7Xl" + "Xyn5D2QWLoq8bZlPoBJumphJjVBw/Ll6CoTZGsTDs4NrGqKbqBth8ZHJUi6cn168QmleSm6GmB7Kxm+6obXlf7PoDHosCwM3QpiS2legi6ocSl3L0G3BdneDDgwQdENfeY+SfDJBkF37Z" + "B+GvwzA6/rMaafAn8143VhPZWdjMWG1oHXhdnemgPoAvLlB/iZyRTfVeF06wPoQhJmlm4bdcOAZRlRN5gcPc5SoPEQR1fDdbOo6wn+uYvXxY0QCLom6gYROKH+Aj5nvphuFXWDiLpRdxl" + "/19LFT95k6CHCrnW7pCDqBn1i1PUFvii2c11oZOJ6usWeH0RRNzC4Zs+6FTi2nevCVwCjbugnXklX5fkfTldL8PEilUB1kfNyN1u9MME2sATr4lbuB7AjfLAuvsRm1A0g6gYRdcPAjvBlje" + "2Z8brI8OC68AcRdlCkwLohx2mcZMjw9q+LzarQurjtnwPYAydX08WecECO/u6Ad0GBdYG7jO5gB4Ap+PwKcA9ZT43dn4/W9TyiPAn4OAJaF7h3uwe8StSCddFdM3jqFa2LvnnB5zzhuuBBAj" + "Y4gi50cg694gnXhTYvfMdrjtcFZhrwE9r41gUem8IXWMC3LrBzxh+a0gRd1N1LOK7M0IUUGuggvEmHoStA2/MJh7MpupiDU4TzjhxdzLAoO4ouZvqVURbFMHQlZD6SUeWHoguZsSLUGegreh" + "A+FZFowPdUWTi6iMoZlIpGGUUXkDbjj/9ZOLqAQS/+GIKl5BQOCn/ycqpzkXSDm5dU7ZWkG7wUyGlcmm7g5Ux56AqirgoaJ7BeokPTDbp9CbVunjFxPrl7+HqnkrSq1Da7JX20f3dV8yJi6v" + "oO81mX8vV0mx3qUsZCPRfTlVRdz2EvdufYGDvNQvvwqHtmXd+a1ITinwNcXc+lT6JuzdT1XDyBn/x7wtX1HCQQdW9MXc8xArGrirowfLeUEbMqqq6f7TF1lfRdOuGNiGi6SpT+WxY06xUfNN" + "2wBfyE9I4tlm7w5hvOPDNJN3yNiLMipji6gE3chKhouoCtN5x3QlF0EZt8OW/8ougitqJQlk1aii7iFC9l0MvRReyao7xNjKML2Z/PuHlzhi5mFxljiZeiC9rPTEisNEMX9KYAwo5Xhi7qaA" + "3hamboYm7dG+NVrXhdaYDv5zFaQZsYrCtbbAGnjkQDX2+J1FXCwOsqWOpKoIQNTFdqYBWydxqNqUoG0pVpCS+H8kaJaGKErlIaXj7CRRE+gRWuKwW9YZ80oVOUgbpdT0zpnSZJTIiwCtJVelv" + "Xntr4P5j6BWfPb5Wcx84C4cq3hb11lco2u2Mdwp6XdJ/Ne3wb8DWdfiRenZaXrhLwOj4e+GQeHroy3YOspS7TlU28Wle2m2QUS0mqdcbrdNW+ZHsSsyK7tBfm0q/dWcv+Z3mytVx3t7KWulq" + "Ue6ilunu8jF8pFwgv1FXp3mUt35OtRbr7eM4u4Gs6vUBXgeuHc5kfE/cbvWZtkROLm1DMtLCy80tzsu2PRj0hTI8fvrQuvsjlJkyutszq+m423wHaLTyniy/XuiGZ84LuT+m5ZfNfRxyGs7L" + "XZOvia7VujatUwVTrIt+Q/Csc7Tuhe+BOakT10b4TuoiiJjvgU9emTO42PwEfBa+cuodKkuf42DXr1D3JpXz73Hnn0j10evHKe+nufgfUm+7B84sX9FfdEzXux2DBpWuKokkCqN/5pa/8pmvn" + "L+RGKCddCGmatiPyPB/+ekO/M/q/7uvbt22kTt3zEnXPzCV13T3Gel4/6NduDu66xRvlPNkM1RjjxUdv+4WhGx6TftD19Q/dfzpwcHO+rE3fAAAAAElFTkSuQmCC";

var Heading = function Heading(props) {
  return /*#__PURE__*/React__default.createElement("h1", {
    className: "heading-m"
  }, props.label);
};
var Close = function Close() {
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
    onClick: props === null || props === void 0 ? void 0 : props.onClick,
    style: props !== null && props !== void 0 && props.isMobileView ? {
      padding: 5
    } : null
  }, props !== null && props !== void 0 && props.isMobileView ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, null) : /*#__PURE__*/React__default.createElement("div", {
    className: "icon-bg-secondary",
    style: {
      backgroundColor: "#505A5F"
    }
  }, " ", /*#__PURE__*/React__default.createElement(Close, null), " "));
};
var LogoutDialog = function LogoutDialog(_ref) {
  var onSelect = _ref.onSelect,
    onCancel = _ref.onCancel,
    onDismiss = _ref.onDismiss;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var mobileDeviceWidth = 780;
  var _React$useState = React__default.useState(window.innerWidth <= mobileDeviceWidth),
    isMobileView = _React$useState[0],
    setIsMobileView = _React$useState[1];
  var onResize = function onResize() {
    if (window.innerWidth <= mobileDeviceWidth) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  React__default.useEffect(function () {
    window.addEventListener("resize", function () {
      onResize();
    });
    return function () {
      window.addEventListener("resize", function () {
        onResize();
      });
    };
  });
  return isMobileView ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Modal, {
    popupStyles: {
      height: "174px",
      maxHeight: "174px",
      width: "324px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    },
    popupModuleActionBarStyles: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-start",
      width: "100%",
      position: "absolute",
      left: 0,
      bottom: 0,
      padding: "18px"
    },
    style: {
      flex: 1
    },
    popupModuleMianStyles: {
      padding: "18px"
    },
    headerBarMain: /*#__PURE__*/React__default.createElement(Heading, {
      label: t("CORE_LOGOUT_WEB_HEADER")
    }),
    headerBarEnd: /*#__PURE__*/React__default.createElement(CloseBtn, {
      onClick: onDismiss,
      isMobileView: isMobileView
    }),
    actionCancelLabel: t("CORE_LOGOUT_CANCEL"),
    actionCancelOnSubmit: onCancel,
    actionSaveLabel: t("CORE_LOGOUT_WEB_YES"),
    actionSaveOnSubmit: onSelect,
    formId: "modal-action"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, {
    style: {
      margin: 0
    }
  }, t("CORE_LOGOUT_WEB_CONFIRMATION_MESSAGE") + " "))) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Modal, {
    popupModuleMianStyles: {
      paddingTop: "30px"
    },
    headerBarMain: /*#__PURE__*/React__default.createElement(Heading, {
      label: t("CORE_LOGOUT_WEB_HEADER")
    }),
    headerBarEnd: /*#__PURE__*/React__default.createElement(CloseBtn, {
      onClick: onDismiss,
      isMobileView: false
    }),
    actionCancelLabel: t("CORE_LOGOUT_CANCEL"),
    actionCancelOnSubmit: onCancel,
    actionSaveLabel: t("CORE_LOGOUT_WEB_YES"),
    actionSaveOnSubmit: onSelect,
    formId: "modal-action"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, {
    style: {
      marginBottom: "54px",
      marginLeft: "8px",
      marginRight: "8px"
    }
  }, t("CORE_LOGOUT_WEB_CONFIRMATION_MESSAGE") + " ", /*#__PURE__*/React__default.createElement("strong", null, t("CORE_LOGOUT_MESSAGE"), "?"))));
};

var Profile = function Profile(_ref) {
  var info = _ref.info,
    t = _ref.t;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "profile-section"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "imageloader imageloader-loaded"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: "img-responsive img-circle img-Profile",
    src: defaultImage
  })), /*#__PURE__*/React__default.createElement("div", {
    id: "profile-name",
    className: "label-container name-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info === null || info === void 0 ? void 0 : info.name, " ")), /*#__PURE__*/React__default.createElement("div", {
    id: "profile-location",
    className: "label-container loc-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info === null || info === void 0 ? void 0 : info.mobileNumber, " ")), (info === null || info === void 0 ? void 0 : info.emailId) && /*#__PURE__*/React__default.createElement("div", {
    id: "profile-emailid",
    className: "label-container loc-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info.emailId, " ")), /*#__PURE__*/React__default.createElement("div", {
    className: "profile-divider"
  }), window.location.href.includes("/employee") && !window.location.href.includes("/employee/user/login") && !window.location.href.includes("employee/user/language-selection") && /*#__PURE__*/React__default.createElement(ChangeCity, {
    t: t,
    mobileView: true
  }));
};
var IconsObject = {
  CommonPTIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.PTIcon, {
    className: "icon"
  }),
  OBPSIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.OBPSIcon, {
    className: "icon"
  }),
  propertyIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.PropertyHouse, {
    className: "icon"
  }),
  TLIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.CaseIcon, {
    className: "icon"
  }),
  PGRIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.PGRIcon, {
    className: "icon"
  }),
  FSMIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.FSMIcon, {
    className: "icon"
  }),
  WSIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.WSICon, {
    className: "icon"
  }),
  MCollectIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.MCollectIcon, {
    className: "icon"
  }),
  BillsIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.CollectionIcon, {
    className: "icon"
  }),
  BirthIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.BirthIcon, {
    className: "icon"
  }),
  DeathIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.DeathIcon, {
    className: "icon"
  }),
  FirenocIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.FirenocIcon, {
    className: "icon"
  }),
  HomeIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.HomeIcon, {
    className: "icon"
  }),
  EditPencilIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.EditPencilIcon, {
    className: "icon"
  }),
  LogoutIcon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.LogoutIcon, {
    className: "icon"
  }),
  Phone: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Phone, {
    className: "icon"
  })
};
var StaticCitizenSideBar = function StaticCitizenSideBar(_ref2) {
  var _Object$keys, _Object$keys$sort, _menuItems;
  var linkData = _ref2.linkData,
    islinkDataLoading = _ref2.islinkDataLoading;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var location = reactRouterDom.useLocation();
  var pathname = location.pathname;
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    storeData = _Digit$Hooks$useStore.data,
    isFetched = _Digit$Hooks$useStore.isFetched;
  var _ref3 = storeData || {},
    stateInfo = _ref3.stateInfo;
  var user = Digit.UserService.getUser();
  var isMobile = window.Digit.Utils.browser.isMobile();
  var _useState = React.useState(false),
    isEmployee = _useState[0];
  var _useState2 = React.useState(false),
    toggleSidebar = _useState2[1];
  var _useState3 = React.useState(false),
    showDialog = _useState3[0],
    setShowDialog = _useState3[1];
  var handleLogout = function handleLogout() {
    toggleSidebar(false);
    setShowDialog(true);
  };
  var handleOnSubmit = function handleOnSubmit() {
    Digit.UserService.logout();
    setShowDialog(false);
  };
  var handleOnCancel = function handleOnCancel() {
    setShowDialog(false);
  };
  if (islinkDataLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  var redirectToLoginPage = function redirectToLoginPage() {
    var _window;
    history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/citizen/login");
  };
  var showProfilePage = function showProfilePage() {
    var _window2;
    history.push("/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen/user/profile");
  };
  var menuItems = [].concat(SideBarMenu(t, showProfilePage, redirectToLoginPage, isEmployee));
  menuItems = menuItems.filter(function (item) {
    return item.element !== "LANGUAGE";
  });
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var MenuItem = function MenuItem(_ref4) {
    var _item$icon, _item$icon$type;
    var item = _ref4.item;
    var leftIconArray = (item === null || item === void 0 ? void 0 : item.icon) || ((_item$icon = item.icon) === null || _item$icon === void 0 ? void 0 : (_item$icon$type = _item$icon.type) === null || _item$icon$type === void 0 ? void 0 : _item$icon$type.name);
    var leftIcon = leftIconArray ? IconsObject[leftIconArray] : IconsObject.BillsIcon;
    var itemComponent;
    if (item.type === "component") {
      itemComponent = item.action;
    } else {
      itemComponent = item.text;
    }
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
      return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        to: item === null || item === void 0 ? void 0 : item.link
      }, /*#__PURE__*/React__default.createElement(Item, null));
    }
    return /*#__PURE__*/React__default.createElement(Item, null);
  };
  var profileItem;
  if (isFetched && user && user.access_token) {
    profileItem = /*#__PURE__*/React__default.createElement(Profile, {
      info: user === null || user === void 0 ? void 0 : user.info,
      stateName: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.name,
      t: t
    });
    menuItems = menuItems.filter(function (item) {
      return (item === null || item === void 0 ? void 0 : item.id) !== "login-btn";
    });
    menuItems = [].concat(menuItems, [{
      text: t("EDIT_PROFILE"),
      element: "PROFILE",
      icon: "EditPencilIcon",
      populators: {
        onClick: showProfilePage
      }
    }, {
      text: t("CORE_COMMON_LOGOUT"),
      element: "LOGOUT",
      icon: "LogoutIcon",
      populators: {
        onClick: handleLogout
      }
    }, {
      text: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, t("CS_COMMON_HELPLINE"), /*#__PURE__*/React__default.createElement("div", {
        className: "telephone",
        style: {
          marginTop: "-10%"
        }
      }, storeData === null || storeData === void 0 ? void 0 : storeData.tenants.map(function (i) {
      }), /*#__PURE__*/React__default.createElement("div", {
        className: "link"
      }, /*#__PURE__*/React__default.createElement("a", {
        href: "tel:" + (storeData === null || storeData === void 0 ? void 0 : storeData.tenants[0].contactNumber)
      }, storeData === null || storeData === void 0 ? void 0 : storeData.tenants[0].contactNumber)))),
      element: "Helpline",
      icon: "Phone"
    }]);
  }
  (_Object$keys = Object.keys(linkData)) === null || _Object$keys === void 0 ? void 0 : (_Object$keys$sort = _Object$keys.sort(function (x, y) {
    return y.localeCompare(x);
  })) === null || _Object$keys$sort === void 0 ? void 0 : _Object$keys$sort.map(function (key) {
    var _linkData$key$;
    if (((_linkData$key$ = linkData[key][0]) === null || _linkData$key$ === void 0 ? void 0 : _linkData$key$.sidebar) === window.contextPath + "-links") {
      var _linkData$key$2, _linkData$key$2$sideb, _window3, _linkData$key$3, _linkData$key$4;
      menuItems.splice(1, 0, {
        type: (_linkData$key$2 = linkData[key][0]) !== null && _linkData$key$2 !== void 0 && (_linkData$key$2$sideb = _linkData$key$2.sidebarURL) !== null && _linkData$key$2$sideb !== void 0 && _linkData$key$2$sideb.includes((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) ? "link" : "external-link",
        text: t("ACTION_TEST_" + Digit.Utils.locale.getTransformedLocale(key)),
        links: linkData[key],
        icon: (_linkData$key$3 = linkData[key][0]) === null || _linkData$key$3 === void 0 ? void 0 : _linkData$key$3.leftIcon,
        link: (_linkData$key$4 = linkData[key][0]) === null || _linkData$key$4 === void 0 ? void 0 : _linkData$key$4.sidebarURL
      });
    }
  });
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      height: "100%",
      width: "100%",
      top: "0px",
      backgroundColor: "rgba(0, 0, 0, 0.54)",
      pointerzevents: "auto"
    }
  }), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: isMobile ? "calc(100vh - 56px)" : "auto",
      zIndex: "99"
    }
  }, profileItem, /*#__PURE__*/React__default.createElement("div", {
    className: "drawer-desktop"
  }, (_menuItems = menuItems) === null || _menuItems === void 0 ? void 0 : _menuItems.map(function (item, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "sidebar-list " + (pathname === (item === null || item === void 0 ? void 0 : item.link) || pathname === (item === null || item === void 0 ? void 0 : item.sidebarURL) ? "active" : ""),
      key: index
    }, /*#__PURE__*/React__default.createElement(MenuItem, {
      item: item
    }));
  }))), /*#__PURE__*/React__default.createElement("div", null, showDialog && /*#__PURE__*/React__default.createElement(LogoutDialog, {
    onSelect: handleOnSubmit,
    onCancel: handleOnCancel,
    onDismiss: handleOnCancel
  }))));
};

var Profile$1 = function Profile(_ref) {
  var info = _ref.info,
    t = _ref.t;
  var _React$useState = React__default.useState(null),
    profilePic = _React$useState[0],
    setProfilePic = _React$useState[1];
  React__default.useEffect(function () {
    try {
      var tenant = Digit.ULBService.getCurrentTenantId();
      var uuid = info === null || info === void 0 ? void 0 : info.uuid;
      var _temp = function () {
        if (uuid) {
          return Promise.resolve(Digit.UserService.userSearch(tenant, {
            uuid: [uuid]
          }, {})).then(function (usersResponse) {
            if (usersResponse && usersResponse.user && usersResponse.user.length) {
              var _userDetails$photo;
              var userDetails = usersResponse.user[0];
              var thumbs = userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$photo = userDetails.photo) === null || _userDetails$photo === void 0 ? void 0 : _userDetails$photo.split(",");
              setProfilePic(thumbs === null || thumbs === void 0 ? void 0 : thumbs.at(0));
            }
          });
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [profilePic !== null]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "profile-section"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "imageloader imageloader-loaded"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: "img-responsive img-circle img-Profile",
    src: profilePic ? profilePic : defaultImage,
    style: {
      objectFit: "cover",
      objectPosition: "center"
    }
  })), /*#__PURE__*/React__default.createElement("div", {
    id: "profile-name",
    className: "label-container name-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info === null || info === void 0 ? void 0 : info.name, " ")), /*#__PURE__*/React__default.createElement("div", {
    id: "profile-location",
    className: "label-container loc-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info === null || info === void 0 ? void 0 : info.mobileNumber, " ")), (info === null || info === void 0 ? void 0 : info.emailId) && /*#__PURE__*/React__default.createElement("div", {
    id: "profile-emailid",
    className: "label-container loc-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info.emailId, " ")), /*#__PURE__*/React__default.createElement("div", {
    className: "profile-divider"
  }), window.location.href.includes("/employee") && !window.location.href.includes("/employee/user/login") && !window.location.href.includes("employee/user/language-selection") && /*#__PURE__*/React__default.createElement(ChangeCity, {
    t: t,
    mobileView: true
  }));
};
var PoweredBy = function PoweredBy() {
  var _window, _window$globalConfigs, _window$globalConfigs2;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "digit-footer",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React__default.createElement("img", {
    alt: "Powered by DIGIT",
    src: (_window = window) === null || _window === void 0 ? void 0 : (_window$globalConfigs = _window.globalConfigs) === null || _window$globalConfigs === void 0 ? void 0 : (_window$globalConfigs2 = _window$globalConfigs.getConfig) === null || _window$globalConfigs2 === void 0 ? void 0 : _window$globalConfigs2.call(_window$globalConfigs, "DIGIT_FOOTER"),
    style: {
      cursor: "pointer"
    },
    onClick: function onClick() {
      var _window2, _window2$globalConfig, _window2$globalConfig2;
      window.open((_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$globalConfig = _window2.globalConfigs) === null || _window2$globalConfig === void 0 ? void 0 : (_window2$globalConfig2 = _window2$globalConfig.getConfig) === null || _window2$globalConfig2 === void 0 ? void 0 : _window2$globalConfig2.call(_window2$globalConfig, "DIGIT_HOME_URL"), "_blank").focus();
    }
  }), " ");
};
var CitizenSideBar = function CitizenSideBar(_ref2) {
  var isOpen = _ref2.isOpen,
    _ref2$isMobile = _ref2.isMobile,
    isMobile = _ref2$isMobile === void 0 ? false : _ref2$isMobile,
    toggleSidebar = _ref2.toggleSidebar,
    onLogout = _ref2.onLogout,
    _ref2$isEmployee = _ref2.isEmployee,
    isEmployee = _ref2$isEmployee === void 0 ? false : _ref2$isEmployee,
    linkData = _ref2.linkData,
    islinkDataLoading = _ref2.islinkDataLoading;
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    storeData = _Digit$Hooks$useStore.data,
    isFetched = _Digit$Hooks$useStore.isFetched;
  var _ref3 = storeData || {},
    stateInfo = _ref3.stateInfo;
  var user = Digit.UserService.getUser();
  var _useState = React.useState(""),
    search = _useState[0],
    setSearch = _useState[1];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var closeSidebar = function closeSidebar() {
    Digit.clikOusideFired = true;
    toggleSidebar(false);
  };
  var _Digit$Hooks$useAcces = Digit.Hooks.useAccessControl(),
    isLoading = _Digit$Hooks$useAcces.isLoading,
    data = _Digit$Hooks$useAcces.data;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var showProfilePage = function showProfilePage() {
    var _window3, _window4;
    var redirectUrl = isEmployee ? "/" + ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) + "/employee/user/profile" : "/" + ((_window4 = window) === null || _window4 === void 0 ? void 0 : _window4.contextPath) + "/citizen/user/profile";
    history.push(redirectUrl);
    closeSidebar();
  };
  var redirectToLoginPage = function redirectToLoginPage() {
    var _window5;
    history.push("/" + ((_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.contextPath) + "/citizen/login");
    closeSidebar();
  };
  if (islinkDataLoading || isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  var menuItems = [].concat(SideBarMenu(t, closeSidebar, redirectToLoginPage, isEmployee));
  var profileItem;
  if (isFetched && user && user.access_token) {
    profileItem = /*#__PURE__*/React__default.createElement(Profile$1, {
      info: user === null || user === void 0 ? void 0 : user.info,
      stateName: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.name,
      t: t
    });
    menuItems = menuItems.filter(function (item) {
      return (item === null || item === void 0 ? void 0 : item.id) !== "login-btn";
    });
    menuItems = [].concat(menuItems, [{
      text: t("EDIT_PROFILE"),
      element: "PROFILE",
      icon: "EditPencilIcon",
      populators: {
        onClick: showProfilePage
      }
    }, {
      text: t("CORE_COMMON_LOGOUT"),
      element: "LOGOUT",
      icon: "LogoutIcon",
      populators: {
        onClick: onLogout
      }
    }, {
      text: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, t("CS_COMMON_HELPLINE"), /*#__PURE__*/React__default.createElement("div", {
        className: "telephone",
        style: {
          marginTop: "-10%"
        }
      }, storeData === null || storeData === void 0 ? void 0 : storeData.tenants.map(function (i) {
      }), /*#__PURE__*/React__default.createElement("div", {
        className: "link"
      }, /*#__PURE__*/React__default.createElement("a", {
        href: "tel:" + (storeData === null || storeData === void 0 ? void 0 : storeData.tenants[0].contactNumber)
      }, storeData === null || storeData === void 0 ? void 0 : storeData.tenants[0].contactNumber)))),
      element: "Helpline",
      icon: "Phone"
    }]);
  }
  var configEmployeeSideBar = {};
  if (!isEmployee) {
    var _Object$keys, _Object$keys$sort;
    (_Object$keys = Object.keys(linkData)) === null || _Object$keys === void 0 ? void 0 : (_Object$keys$sort = _Object$keys.sort(function (x, y) {
      return y.localeCompare(x);
    })) === null || _Object$keys$sort === void 0 ? void 0 : _Object$keys$sort.map(function (key) {
      var _linkData$key$, _linkData$key$2, _linkData$key$2$sideb, _window6, _linkData$key$3, _linkData$key$4;
      if (((_linkData$key$ = linkData[key][0]) === null || _linkData$key$ === void 0 ? void 0 : _linkData$key$.sidebar) === "digit-ui-links") menuItems.splice(1, 0, {
        type: (_linkData$key$2 = linkData[key][0]) !== null && _linkData$key$2 !== void 0 && (_linkData$key$2$sideb = _linkData$key$2.sidebarURL) !== null && _linkData$key$2$sideb !== void 0 && _linkData$key$2$sideb.includes((_window6 = window) === null || _window6 === void 0 ? void 0 : _window6.contextPath) ? "link" : "external-link",
        text: t("ACTION_TEST_" + Digit.Utils.locale.getTransformedLocale(key)),
        links: linkData[key],
        icon: (_linkData$key$3 = linkData[key][0]) === null || _linkData$key$3 === void 0 ? void 0 : _linkData$key$3.leftIcon,
        link: (_linkData$key$4 = linkData[key][0]) === null || _linkData$key$4 === void 0 ? void 0 : _linkData$key$4.sidebarURL
      });
    });
  } else {
    var _menuItems;
    data === null || data === void 0 ? void 0 : data.actions.filter(function (e) {
      return e.url === "url" && e.displayName !== "Home";
    }).forEach(function (item) {
      var _item$displayName;
      if (search == "" && item.path !== "") {
        var index = item.path.split(".")[0];
        if (index === "TradeLicense") index = "Trade License";
        if (!configEmployeeSideBar[index]) {
          configEmployeeSideBar[index] = [item];
        } else {
          configEmployeeSideBar[index].push(item);
        }
      } else if (item.path !== "" && item !== null && item !== void 0 && (_item$displayName = item.displayName) !== null && _item$displayName !== void 0 && _item$displayName.toLowerCase().includes(search.toLowerCase())) {
        var _index = item.path.split(".")[0];
        if (_index === "TradeLicense") _index = "Trade License";
        if (!configEmployeeSideBar[_index]) {
          configEmployeeSideBar[_index] = [item];
        } else {
          configEmployeeSideBar[_index].push(item);
        }
      }
    });
    var keys = Object.keys(configEmployeeSideBar);
    var _loop = function _loop(i) {
      var _configEmployeeSideBa, _configEmployeeSideBa2, _configEmployeeSideBa3, _keys$i, _keys$i$toUpperCase;
      var getSingleDisplayName = (_configEmployeeSideBa = configEmployeeSideBar[keys[i]][0]) === null || _configEmployeeSideBa === void 0 ? void 0 : (_configEmployeeSideBa2 = _configEmployeeSideBa.displayName) === null || _configEmployeeSideBa2 === void 0 ? void 0 : (_configEmployeeSideBa3 = _configEmployeeSideBa2.toUpperCase()) === null || _configEmployeeSideBa3 === void 0 ? void 0 : _configEmployeeSideBa3.replace(/[ -]/g, "_");
      var getParentDisplayName = (_keys$i = keys[i]) === null || _keys$i === void 0 ? void 0 : (_keys$i$toUpperCase = _keys$i.toUpperCase()) === null || _keys$i$toUpperCase === void 0 ? void 0 : _keys$i$toUpperCase.replace(/[ -]/g, "_");
      if (configEmployeeSideBar[keys[i]][0].path.indexOf(".") === -1) {
        var _configEmployeeSideBa4, _configEmployeeSideBa5, _configEmployeeSideBa6, _configEmployeeSideBa7;
        menuItems.splice(1, 0, {
          type: "link",
          text: t("ACTION_TEST_" + getSingleDisplayName),
          link: (_configEmployeeSideBa4 = configEmployeeSideBar[keys[i]][0]) === null || _configEmployeeSideBa4 === void 0 ? void 0 : _configEmployeeSideBa4.navigationURL,
          icon: (_configEmployeeSideBa5 = configEmployeeSideBar[keys[i]][0]) === null || _configEmployeeSideBa5 === void 0 ? void 0 : (_configEmployeeSideBa6 = _configEmployeeSideBa5.leftIcon) === null || _configEmployeeSideBa6 === void 0 ? void 0 : (_configEmployeeSideBa7 = _configEmployeeSideBa6.split) === null || _configEmployeeSideBa7 === void 0 ? void 0 : _configEmployeeSideBa7.call(_configEmployeeSideBa6, ":")[1],
          populators: {
            onClick: function onClick() {
              var _configEmployeeSideBa8;
              history.push((_configEmployeeSideBa8 = configEmployeeSideBar[keys[i]][0]) === null || _configEmployeeSideBa8 === void 0 ? void 0 : _configEmployeeSideBa8.navigationURL);
              closeSidebar();
            }
          }
        });
      } else {
        var _configEmployeeSideBa9, _configEmployeeSideBa10;
        menuItems.splice(1, 0, {
          type: "dynamic",
          moduleName: t("ACTION_TEST_" + getParentDisplayName),
          links: (_configEmployeeSideBa9 = configEmployeeSideBar[keys[i]]) === null || _configEmployeeSideBa9 === void 0 ? void 0 : _configEmployeeSideBa9.map(function (ob) {
            var _ob$displayName, _ob$displayName$toUpp;
            return _extends({}, ob, {
              displayName: t("ACTION_TEST_" + (ob === null || ob === void 0 ? void 0 : (_ob$displayName = ob.displayName) === null || _ob$displayName === void 0 ? void 0 : (_ob$displayName$toUpp = _ob$displayName.toUpperCase()) === null || _ob$displayName$toUpp === void 0 ? void 0 : _ob$displayName$toUpp.replace(/[ -]/g, "_")))
            });
          }),
          icon: (_configEmployeeSideBa10 = configEmployeeSideBar[keys[i]][1]) === null || _configEmployeeSideBa10 === void 0 ? void 0 : _configEmployeeSideBa10.leftIcon
        });
      }
    };
    for (var i = 0; i < keys.length; i++) {
      _loop(i);
    }
    var indx = menuItems.findIndex(function (a) {
      return a.element === "HOME";
    });
    var home = menuItems.splice(indx, 1);
    var comp = menuItems.findIndex(function (a) {
      return a.element === "LANGUAGE";
    });
    var part = menuItems.splice(comp, ((_menuItems = menuItems) === null || _menuItems === void 0 ? void 0 : _menuItems.length) - comp);
    menuItems.sort(function (a, b) {
      var c1 = (a === null || a === void 0 ? void 0 : a.type) === "dynamic" ? a === null || a === void 0 ? void 0 : a.moduleName : a === null || a === void 0 ? void 0 : a.text;
      var c2 = (b === null || b === void 0 ? void 0 : b.type) === "dynamic" ? b === null || b === void 0 ? void 0 : b.moduleName : b === null || b === void 0 ? void 0 : b.text;
      return c1.localeCompare(c2);
    });
    (home === null || home === void 0 ? void 0 : home[0]) && menuItems.splice(0, 0, home[0]);
    menuItems = (part === null || part === void 0 ? void 0 : part.length) > 0 ? menuItems.concat(part) : menuItems;
  }
  if (history.location.pathname.includes("/openlink")) {
    profileItem = /*#__PURE__*/React__default.createElement("span", null);
    menuItems = menuItems.filter(function (ele) {
      return ele.element === "LANGUAGE";
    });
  }
  return isMobile ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.NavBar, {
    open: isOpen,
    toggleSidebar: toggleSidebar,
    profileItem: profileItem,
    onClose: closeSidebar,
    menuItems: menuItems,
    Footer: /*#__PURE__*/React__default.createElement(PoweredBy, null),
    isEmployee: isEmployee,
    search: search,
    setSearch: setSearch
  }) : /*#__PURE__*/React__default.createElement(StaticCitizenSideBar, {
    logout: onLogout
  });
};

var SubMenu = function SubMenu(_ref) {
  var _item$icon, _item$icon$leftIcon, _item$icon$leftIcon$s, _item$icon$leftIcon$s2, _item$leftIcon, _item$leftIcon$split, _item$icon2, _item$icon2$leftIcon, _item$icon2$leftIcon$, _item$leftIcon2, _item$leftIcon2$split, _item$moduleName;
  var item = _ref.item;
  var _useState = React.useState(false),
    subnav = _useState[0],
    setSubnav = _useState[1];
  var location = reactRouterDom.useLocation();
  var pathname = location.pathname;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var showSubnav = function showSubnav() {
    return setSubnav(!subnav);
  };
  var IconsObject = {
    home: /*#__PURE__*/React__default.createElement(digitUiReactComponents.HomeIcon, null),
    announcement: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ComplaintIcon, null),
    business: /*#__PURE__*/React__default.createElement(digitUiReactComponents.BPAHomeIcon, null),
    store: /*#__PURE__*/React__default.createElement(digitUiReactComponents.PropertyHouse, null),
    assignment: /*#__PURE__*/React__default.createElement(digitUiReactComponents.CaseIcon, null),
    receipt: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ReceiptIcon, null),
    "business-center": /*#__PURE__*/React__default.createElement(digitUiReactComponents.PersonIcon, null),
    description: /*#__PURE__*/React__default.createElement(digitUiReactComponents.DocumentIconSolid, null),
    "water-tap": /*#__PURE__*/React__default.createElement(digitUiReactComponents.DropIcon, null),
    "collections-bookmark": /*#__PURE__*/React__default.createElement(digitUiReactComponents.CollectionsBookmarIcons, null),
    "insert-chart": /*#__PURE__*/React__default.createElement(digitUiReactComponents.FinanceChartIcon, null),
    edcr: /*#__PURE__*/React__default.createElement(digitUiReactComponents.CollectionIcon, null),
    collections: /*#__PURE__*/React__default.createElement(digitUiReactComponents.CollectionIcon, null)
  };
  var leftIconArray = (item === null || item === void 0 ? void 0 : (_item$icon = item.icon) === null || _item$icon === void 0 ? void 0 : (_item$icon$leftIcon = _item$icon.leftIcon) === null || _item$icon$leftIcon === void 0 ? void 0 : (_item$icon$leftIcon$s = _item$icon$leftIcon.split) === null || _item$icon$leftIcon$s === void 0 ? void 0 : (_item$icon$leftIcon$s2 = _item$icon$leftIcon$s.call(_item$icon$leftIcon, ":")) === null || _item$icon$leftIcon$s2 === void 0 ? void 0 : _item$icon$leftIcon$s2[1]) || (item === null || item === void 0 ? void 0 : (_item$leftIcon = item.leftIcon) === null || _item$leftIcon === void 0 ? void 0 : (_item$leftIcon$split = _item$leftIcon.split) === null || _item$leftIcon$split === void 0 ? void 0 : _item$leftIcon$split.call(_item$leftIcon, ":")[1]);
  var leftIcon = IconsObject[leftIconArray] || IconsObject.collections;
  var iconArr = (item === null || item === void 0 ? void 0 : (_item$icon2 = item.icon) === null || _item$icon2 === void 0 ? void 0 : (_item$icon2$leftIcon = _item$icon2.leftIcon) === null || _item$icon2$leftIcon === void 0 ? void 0 : (_item$icon2$leftIcon$ = _item$icon2$leftIcon.split) === null || _item$icon2$leftIcon$ === void 0 ? void 0 : _item$icon2$leftIcon$.call(_item$icon2$leftIcon, ":")) || (item === null || item === void 0 ? void 0 : (_item$leftIcon2 = item.leftIcon) === null || _item$leftIcon2 === void 0 ? void 0 : (_item$leftIcon2$split = _item$leftIcon2.split) === null || _item$leftIcon2$split === void 0 ? void 0 : _item$leftIcon2$split.call(_item$leftIcon2, ":"));
  if ((iconArr === null || iconArr === void 0 ? void 0 : iconArr[0]) == "dynamic") {
    var _require;
    var IconComp = (_require = require("@egovernments/digit-ui-react-components")) === null || _require === void 0 ? void 0 : _require[iconArr === null || iconArr === void 0 ? void 0 : iconArr[1]];
    leftIcon = IconComp ? /*#__PURE__*/React__default.createElement(IconComp, null) : leftIcon;
  }
  var getModuleName = item === null || item === void 0 ? void 0 : (_item$moduleName = item.moduleName) === null || _item$moduleName === void 0 ? void 0 : _item$moduleName.replace(/[ -]/g, "_");
  var appendTranslate = t("ACTION_TEST_" + getModuleName);
  var trimModuleName = t((appendTranslate === null || appendTranslate === void 0 ? void 0 : appendTranslate.length) > 20 ? appendTranslate.substring(0, 20) + "..." : appendTranslate);
  if (item.type === "single") {
    var _item$navigationURL, _window;
    var getOrigin = window.location.origin;
    return /*#__PURE__*/React__default.createElement("div", {
      className: "submenu-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sidebar-link  " + (pathname === (item === null || item === void 0 ? void 0 : item.navigationURL) ? "active" : "")
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "actions"
    }, /*#__PURE__*/React__default.createElement("span", {
      style: {
        marginLeft: "0px"
      },
      onClick: function onClick() {
        return history.push("" + item.navigationURL);
      }
    }, leftIcon), ((_item$navigationURL = item.navigationURL) === null || _item$navigationURL === void 0 ? void 0 : _item$navigationURL.indexOf("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath))) === -1 ? /*#__PURE__*/React__default.createElement("a", {
      "data-tip": "React-tooltip",
      "data-for": "jk-side-" + getModuleName,
      className: "custom-link",
      href: getOrigin + "/employee/" + item.navigationURL
    }, /*#__PURE__*/React__default.createElement("span", null, " ", trimModuleName, " "), (trimModuleName === null || trimModuleName === void 0 ? void 0 : trimModuleName.includes("...")) && /*#__PURE__*/React__default.createElement(ReactTooltip, {
      textColor: "white",
      backgroundColor: "grey",
      place: "right",
      type: "info",
      effect: "solid",
      id: "jk-side-" + getModuleName
    }, t("ACTION_TEST_" + getModuleName))) :
    /*#__PURE__*/
    React__default.createElement(reactRouterDom.Link, {
      className: "custom-link",
      to: item.navigationURL
    }, /*#__PURE__*/React__default.createElement("div", {
      "data-tip": "React-tooltip",
      "data-for": "jk-side-" + getModuleName
    }, /*#__PURE__*/React__default.createElement("span", null, " ", trimModuleName, " "), (trimModuleName === null || trimModuleName === void 0 ? void 0 : trimModuleName.includes("...")) && /*#__PURE__*/React__default.createElement(ReactTooltip, {
      textColor: "white",
      backgroundColor: "grey",
      place: "right",
      type: "info",
      effect: "solid",
      id: "jk-side-" + getModuleName
    }, t("ACTION_TEST_" + getModuleName)))))));
  } else {
    var _item$links;
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      className: "submenu-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      onClick: item.links && showSubnav,
      className: "sidebar-link  " + (item !== null && item !== void 0 && (_item$links = item.links) !== null && _item$links !== void 0 && _item$links.some(function (ele) {
        return (ele === null || ele === void 0 ? void 0 : ele.url) === "url" && (pathname === null || pathname === void 0 ? void 0 : pathname.includes(ele === null || ele === void 0 ? void 0 : ele.navigationURL));
      }) ? "active" : "")
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "actions"
    }, leftIcon, /*#__PURE__*/React__default.createElement("div", {
      "data-tip": "React-tooltip",
      "data-for": "jk-side-" + getModuleName
    }, /*#__PURE__*/React__default.createElement("span", null, " ", trimModuleName, " "), (trimModuleName === null || trimModuleName === void 0 ? void 0 : trimModuleName.includes("...")) && /*#__PURE__*/React__default.createElement(ReactTooltip, {
      textColor: "white",
      backgroundColor: "grey",
      place: "right",
      type: "info",
      effect: "solid",
      id: "jk-side-" + getModuleName
    }, t("ACTION_TEST_" + getModuleName)))), /*#__PURE__*/React__default.createElement("div", null, " ", item.links && subnav ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.ArrowVectorDown, null) : item.links ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.ArrowForward, null) : null, " "))), subnav && item.links.sort(function (a, b) {
      return a.orderNumber - b.orderNumber;
    }).filter(function (item) {
      return item.url === "url" || item.url !== "";
    }).map(function (item, index) {
      var _item$displayName, _item$displayName$toU, _window2;
      var getChildName = item === null || item === void 0 ? void 0 : (_item$displayName = item.displayName) === null || _item$displayName === void 0 ? void 0 : (_item$displayName$toU = _item$displayName.toUpperCase()) === null || _item$displayName$toU === void 0 ? void 0 : _item$displayName$toU.replace(/[ -]/g, "_");
      var appendTranslate = t("ACTION_TEST_" + getChildName);
      var trimModuleName = t((appendTranslate === null || appendTranslate === void 0 ? void 0 : appendTranslate.length) > 20 ? appendTranslate.substring(0, 20) + "..." : appendTranslate);
      if (item.navigationURL.indexOf("/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath)) === -1) {
        var _getOrigin = window.location.origin;
        return /*#__PURE__*/React__default.createElement("a", {
          key: index,
          className: "dropdown-link " + (pathname === item.link ? "active" : ""),
          href: _getOrigin + "/employee/" + item.navigationURL
        }, /*#__PURE__*/React__default.createElement("div", {
          className: "actions",
          "data-tip": "React-tooltip",
          "data-for": "jk-side-" + index
        }, /*#__PURE__*/React__default.createElement("span", null, " ", trimModuleName, " "), (trimModuleName === null || trimModuleName === void 0 ? void 0 : trimModuleName.includes("...")) && /*#__PURE__*/React__default.createElement(ReactTooltip, {
          textColor: "white",
          backgroundColor: "grey",
          place: "right",
          type: "info",
          effect: "solid",
          id: "jk-side-" + index
        }, t("ACTION_TEST_" + getChildName))));
      }
      return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        to: (item === null || item === void 0 ? void 0 : item.link) || item.navigationURL,
        key: index,
        className: "dropdown-link " + (pathname === (item === null || item === void 0 ? void 0 : item.link) || pathname === (item === null || item === void 0 ? void 0 : item.navigationURL) ? "active" : "")
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "actions",
        "data-tip": "React-tooltip",
        "data-for": "jk-side-" + index
      }, /*#__PURE__*/React__default.createElement("span", null, " ", trimModuleName, " "), (trimModuleName === null || trimModuleName === void 0 ? void 0 : trimModuleName.includes("...")) && /*#__PURE__*/React__default.createElement(ReactTooltip, {
        textColor: "white",
        backgroundColor: "grey",
        place: "right",
        type: "info",
        effect: "solid",
        id: "jk-side-" + index
      }, t("ACTION_TEST_" + getChildName))));
    }));
  }
};

var checkMatch = function checkMatch(path, searchCriteria) {
  if (path === void 0) {
    path = "";
  }
  if (searchCriteria === void 0) {
    searchCriteria = "";
  }
  return path.toLowerCase().includes(searchCriteria.toLowerCase());
};
var EmployeeSideBar = function EmployeeSideBar() {
  var sidebarRef = React.useRef(null);
  var _Digit$Hooks$useAcces = Digit.Hooks.useAccessControl(),
    isLoading = _Digit$Hooks$useAcces.isLoading,
    data = _Digit$Hooks$useAcces.data;
  var _useState = React.useState(""),
    search = _useState[0],
    setSearch = _useState[1];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  React.useEffect(function () {
    if (isLoading) {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
    }
    sidebarRef.current.style.cursor = "pointer";
    collapseNav();
  }, [isLoading]);
  var expandNav = function expandNav() {
    sidebarRef.current.style.width = "260px";
    sidebarRef.current.style.overflow = "auto";
    sidebarRef.current.querySelectorAll(".dropdown-link").forEach(function (element) {
      element.style.display = "flex";
    });
  };
  var collapseNav = function collapseNav() {
    sidebarRef.current.style.width = "55px";
    sidebarRef.current.style.overflow = "hidden";
    sidebarRef.current.querySelectorAll(".dropdown-link").forEach(function (element) {
      element.style.display = "none";
    });
    sidebarRef.current.querySelectorAll(".actions").forEach(function (element) {
      element.style.padding = "0";
    });
  };
  var configEmployeeSideBar = {};
  data === null || data === void 0 ? void 0 : data.actions.filter(function (e) {
    return e.url === "url";
  }).forEach(function (item) {
    var _item$path, _item$path$split, _index, _index$toUpperCase;
    var index = (item === null || item === void 0 ? void 0 : (_item$path = item.path) === null || _item$path === void 0 ? void 0 : (_item$path$split = _item$path.split(".")) === null || _item$path$split === void 0 ? void 0 : _item$path$split[0]) || "";
    if (search == "" && item.path !== "") {
      index = item.path.split(".")[0];
      if (!configEmployeeSideBar[index]) {
        configEmployeeSideBar[index] = [item];
      } else {
        configEmployeeSideBar[index].push(item);
      }
    } else if (checkMatch(t("ACTION_TEST_" + ((_index = index) === null || _index === void 0 ? void 0 : (_index$toUpperCase = _index.toUpperCase()) === null || _index$toUpperCase === void 0 ? void 0 : _index$toUpperCase.replace(/[ -]/g, "_"))), search) || checkMatch(t(Digit.Utils.locale.getTransformedLocale("ACTION_TEST_" + (item === null || item === void 0 ? void 0 : item.displayName))), search)) {
      index = item.path.split(".")[0];
      if (!configEmployeeSideBar[index]) {
        configEmployeeSideBar[index] = [item];
      } else {
        configEmployeeSideBar[index].push(item);
      }
    }
  });
  var res = [];
  var splitKeyValue = function splitKeyValue() {
    var _res3;
    var keys = Object.keys(configEmployeeSideBar);
    keys.sort(function (a, b) {
      return a.orderNumber - b.orderNumber;
    });
    for (var i = 0; i < keys.length; i++) {
      if (configEmployeeSideBar[keys[i]][0].path.indexOf(".") === -1) {
        if (configEmployeeSideBar[keys[i]][0].displayName === "Home") {
          var _window;
          var homeURL = "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee";
          res.unshift({
            moduleName: keys[i].toUpperCase(),
            icon: configEmployeeSideBar[keys[i]][0],
            navigationURL: homeURL,
            type: "single"
          });
        } else {
          var _configEmployeeSideBa;
          res.push({
            moduleName: (_configEmployeeSideBa = configEmployeeSideBar[keys[i]][0]) === null || _configEmployeeSideBa === void 0 ? void 0 : _configEmployeeSideBa.displayName.toUpperCase(),
            type: "single",
            icon: configEmployeeSideBar[keys[i]][0],
            navigationURL: configEmployeeSideBar[keys[i]][0].navigationURL
          });
        }
      } else {
        res.push({
          moduleName: keys[i].toUpperCase(),
          links: configEmployeeSideBar[keys[i]],
          icon: configEmployeeSideBar[keys[i]][0],
          orderNumber: configEmployeeSideBar[keys[i]][0].orderNumber
        });
      }
    }
    if (res.find(function (a) {
      return a.moduleName === "HOME";
    })) {
      var _res, _res2;
      var home = (_res = res) === null || _res === void 0 ? void 0 : _res.filter(function (ob) {
        return (ob === null || ob === void 0 ? void 0 : ob.moduleName) === "HOME";
      });
      var res1 = (_res2 = res) === null || _res2 === void 0 ? void 0 : _res2.filter(function (ob) {
        return (ob === null || ob === void 0 ? void 0 : ob.moduleName) !== "HOME";
      });
      res = res1.sort(function (a, b) {
        return a.moduleName.localeCompare(b.moduleName);
      });
      (home === null || home === void 0 ? void 0 : home[0]) && res.unshift(home[0]);
    } else {
      res.sort(function (a, b) {
        return a.moduleName.localeCompare(b.moduleName);
      });
    }
    return (_res3 = res) === null || _res3 === void 0 ? void 0 : _res3.map(function (item, index) {
      return /*#__PURE__*/React__default.createElement(SubMenu, {
        item: item,
        key: index + 1
      });
    });
  };
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  if (!res) {
    return "";
  }
  var renderSearch = function renderSearch() {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "submenu-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sidebar-link"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "actions search-icon-wrapper"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchIcon, {
      className: "search-icon"
    }), /*#__PURE__*/React__default.createElement("input", {
      className: "employee-search-input",
      type: "text",
      placeholder: t("ACTION_TEST_SEARCH"),
      name: "search",
      value: search,
      onChange: function onChange(e) {
        return setSearch(e.target.value);
      }
    }))));
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sidebar",
    ref: sidebarRef,
    onMouseOver: expandNav,
    onMouseLeave: collapseNav
  }, renderSearch(), splitKeyValue());
};

var SideBar = function SideBar(_ref) {
  var CITIZEN = _ref.CITIZEN,
    isSidebarOpen = _ref.isSidebarOpen,
    toggleSidebar = _ref.toggleSidebar,
    handleLogout = _ref.handleLogout,
    mobileView = _ref.mobileView,
    userDetails = _ref.userDetails,
    modules = _ref.modules,
    linkData = _ref.linkData,
    islinkDataLoading = _ref.islinkDataLoading;
  if (CITIZEN) return /*#__PURE__*/React__default.createElement(CitizenSideBar, {
    isOpen: isSidebarOpen,
    isMobile: true,
    toggleSidebar: toggleSidebar,
    onLogout: handleLogout,
    linkData: linkData,
    islinkDataLoading: islinkDataLoading
  });else {
    if (!mobileView && userDetails !== null && userDetails !== void 0 && userDetails.access_token) return /*#__PURE__*/React__default.createElement(EmployeeSideBar, {
      mobileView: mobileView,
      userDetails: userDetails,
      modules: modules
    });else return /*#__PURE__*/React__default.createElement(CitizenSideBar, {
      isOpen: isSidebarOpen,
      isMobile: true,
      toggleSidebar: toggleSidebar,
      onLogout: handleLogout,
      isEmployee: true
    });
  }
};

var TopBarSideBar = function TopBarSideBar(_ref) {
  var t = _ref.t,
    stateInfo = _ref.stateInfo,
    userDetails = _ref.userDetails,
    CITIZEN = _ref.CITIZEN,
    cityDetails = _ref.cityDetails,
    mobileView = _ref.mobileView,
    handleUserDropdownSelection = _ref.handleUserDropdownSelection,
    logoUrl = _ref.logoUrl,
    _ref$showSidebar = _ref.showSidebar,
    showSidebar = _ref$showSidebar === void 0 ? true : _ref$showSidebar,
    showLanguageChange = _ref.showLanguageChange,
    linkData = _ref.linkData,
    islinkDataLoading = _ref.islinkDataLoading;
  var _useState = React.useState(false),
    isSidebarOpen = _useState[0],
    toggleSidebar = _useState[1];
  var history = reactRouterDom.useHistory();
  var _useState2 = React.useState(false),
    showDialog = _useState2[0],
    setShowDialog = _useState2[1];
  var handleLogout = function handleLogout() {
    toggleSidebar(false);
    setShowDialog(true);
  };
  var handleOnSubmit = function handleOnSubmit() {
    Digit.UserService.logout();
    setShowDialog(false);
  };
  var handleOnCancel = function handleOnCancel() {
    setShowDialog(false);
  };
  var userProfile = function userProfile() {
    var _window;
    history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/user/profile");
  };
  var userOptions = [{
    name: t("EDIT_PROFILE"),
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.EditPencilIcon, {
      className: "icon"
    }),
    func: userProfile
  }, {
    name: t("CORE_COMMON_LOGOUT"),
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.LogoutIcon, {
      className: "icon"
    }),
    func: handleLogout
  }];
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(TopBar, {
    t: t,
    stateInfo: stateInfo,
    toggleSidebar: toggleSidebar,
    isSidebarOpen: isSidebarOpen,
    handleLogout: handleLogout,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    userOptions: userOptions,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl,
    showLanguageChange: showLanguageChange
  }), showDialog && /*#__PURE__*/React__default.createElement(LogoutDialog, {
    onSelect: handleOnSubmit,
    onCancel: handleOnCancel,
    onDismiss: handleOnCancel
  }), showSidebar && /*#__PURE__*/React__default.createElement(SideBar, {
    t: t,
    CITIZEN: CITIZEN,
    isSidebarOpen: isSidebarOpen,
    toggleSidebar: toggleSidebar,
    handleLogout: handleLogout,
    mobileView: mobileView,
    userDetails: userDetails,
    linkData: linkData,
    islinkDataLoading: islinkDataLoading
  }));
};

var FaqComponent = function FaqComponent(props) {
  var question = props.question,
    answer = props.answer,
    lastIndex = props.lastIndex;
  var _useState = React.useState(false),
    isOpen = _useState[0],
    toggleOpen = _useState[1];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "faqs border-none",
    onClick: function onClick() {
      return toggleOpen(!isOpen);
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "faq-question",
    style: {
      justifyContent: "space-between",
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement("span", null, t(question)), /*#__PURE__*/React__default.createElement("span", {
    className: isOpen ? "faqicon rotate" : "faqicon",
    style: {
      "float": "right"
    }
  }, isOpen ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.ArrowForward, null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.ArrowForward, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "faq-answer",
    style: isOpen ? {
      display: "block"
    } : {
      display: "none"
    }
  }, /*#__PURE__*/React__default.createElement("span", null, t(answer))), !lastIndex ? /*#__PURE__*/React__default.createElement("div", {
    className: "cs-box-border"
  }) : null);
};

var FAQsSection = function FAQsSection(_ref) {
  var _user$info, _data$MdmsRes$common, _data$MdmsRes$common$;
  var module = _ref.module;
  var user = Digit.UserService.getUser();
  var tenantId = (user === null || user === void 0 ? void 0 : (_user$info = user.info) === null || _user$info === void 0 ? void 0 : _user$info.tenantId) || Digit.ULBService.getCurrentTenantId();
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _Digit$Hooks$useGetFA = Digit.Hooks.useGetFAQsJSON(Digit.ULBService.getStateId()),
    isLoading = _Digit$Hooks$useGetFA.isLoading,
    data = _Digit$Hooks$useGetFA.data;
  var moduleFaqs = data === null || data === void 0 ? void 0 : (_data$MdmsRes$common = data.MdmsRes["common-masters"]) === null || _data$MdmsRes$common === void 0 ? void 0 : (_data$MdmsRes$common$ = _data$MdmsRes$common.faqs[0]) === null || _data$MdmsRes$common$ === void 0 ? void 0 : _data$MdmsRes$common$["" + module].faqs;
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "faq-page"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, {
    style: {
      marginLeft: "unset"
    }
  }), /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginBottom: "15px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, {
    styles: {
      marginLeft: "0px",
      paddingTop: "10px",
      fontSize: "32px"
    }
  }, t("FAQ_S"))), /*#__PURE__*/React__default.createElement("div", {
    className: "faq-list"
  }, moduleFaqs.map(function (faq, i) {
    return /*#__PURE__*/React__default.createElement(FaqComponent, {
      key: "faq_" + i,
      question: faq.question,
      answer: faq.answer,
      lastIndex: i === (moduleFaqs === null || moduleFaqs === void 0 ? void 0 : moduleFaqs.length) - 1
    });
  }))));
};

var Home = function Home() {
  var _window3, _window3$location, _window3$location$hre, _window3$location$hre2, _citizenServicesObj$s, _citizenServicesObj$p, _citizenServicesObj$p2, _citizenServicesObj$p5, _citizenServicesObj$p6, _citizenServicesObj$p9, _citizenServicesObj$p10, _citizenServicesObj$p13, _citizenServicesObj$p14, _infoAndUpdatesObj$si, _infoAndUpdatesObj$pr, _infoAndUpdatesObj$pr2, _infoAndUpdatesObj$pr5, _infoAndUpdatesObj$pr6, _infoAndUpdatesObj$pr9, _infoAndUpdatesObj$pr10, _infoAndUpdatesObj$pr13, _infoAndUpdatesObj$pr14, _whatsNewSectionObj$s2;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var tenantId = Digit.ULBService.getCitizenCurrentTenant(true);
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    _Digit$Hooks$useStore2 = _Digit$Hooks$useStore.data,
    _Digit$Hooks$useStore3 = _Digit$Hooks$useStore2 === void 0 ? {} : _Digit$Hooks$useStore2,
    uiHomePage = _Digit$Hooks$useStore3.uiHomePage,
    isLoading = _Digit$Hooks$useStore.isLoading;
  var isMobile = window.Digit.Utils.browser.isMobile();
  var conditionsToDisableNotificationCountTrigger = function conditionsToDisableNotificationCountTrigger() {
    var _Digit$UserService, _Digit$UserService$ge, _Digit$UserService$ge2, _Digit$UserService2, _Digit$UserService2$g;
    if (((_Digit$UserService = Digit.UserService) === null || _Digit$UserService === void 0 ? void 0 : (_Digit$UserService$ge = _Digit$UserService.getUser()) === null || _Digit$UserService$ge === void 0 ? void 0 : (_Digit$UserService$ge2 = _Digit$UserService$ge.info) === null || _Digit$UserService$ge2 === void 0 ? void 0 : _Digit$UserService$ge2.type) === "EMPLOYEE") return false;
    if (!((_Digit$UserService2 = Digit.UserService) !== null && _Digit$UserService2 !== void 0 && (_Digit$UserService2$g = _Digit$UserService2.getUser()) !== null && _Digit$UserService2$g !== void 0 && _Digit$UserService2$g.access_token)) return false;
    return true;
  };
  var _Digit$Hooks$useEvent = Digit.Hooks.useEvents({
      tenantId: tenantId,
      variant: "whats-new",
      config: {
        enabled: conditionsToDisableNotificationCountTrigger()
      }
    }),
    EventsData = _Digit$Hooks$useEvent.data,
    EventsDataLoading = _Digit$Hooks$useEvent.isLoading;
  if (!tenantId) {
    var _window;
    history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/citizen/select-language");
  }
  var appBannerWebObj = uiHomePage === null || uiHomePage === void 0 ? void 0 : uiHomePage.appBannerDesktop;
  var appBannerMobObj = uiHomePage === null || uiHomePage === void 0 ? void 0 : uiHomePage.appBannerMobile;
  var citizenServicesObj = uiHomePage === null || uiHomePage === void 0 ? void 0 : uiHomePage.citizenServicesCard;
  var infoAndUpdatesObj = uiHomePage === null || uiHomePage === void 0 ? void 0 : uiHomePage.informationAndUpdatesCard;
  var whatsAppBannerWebObj = uiHomePage === null || uiHomePage === void 0 ? void 0 : uiHomePage.whatsAppBannerDesktop;
  var whatsAppBannerMobObj = uiHomePage === null || uiHomePage === void 0 ? void 0 : uiHomePage.whatsAppBannerMobile;
  var whatsNewSectionObj = uiHomePage === null || uiHomePage === void 0 ? void 0 : uiHomePage.whatsNewSection;
  var redirectURL = uiHomePage === null || uiHomePage === void 0 ? void 0 : uiHomePage.redirectURL;
  if (redirectURL) {
    var _window2;
    history.push("/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen/" + redirectURL);
  }
  if ((_window3 = window) !== null && _window3 !== void 0 && (_window3$location = _window3.location) !== null && _window3$location !== void 0 && (_window3$location$hre = _window3$location.href) !== null && _window3$location$hre !== void 0 && (_window3$location$hre2 = _window3$location$hre.includes) !== null && _window3$location$hre2 !== void 0 && _window3$location$hre2.call(_window3$location$hre, "sanitation-ui")) {
    var _window4;
    history.push("/" + ((_window4 = window) === null || _window4 === void 0 ? void 0 : _window4.contextPath) + "/citizen/all-services");
  }
  var handleClickOnWhatsAppBanner = function handleClickOnWhatsAppBanner(obj) {
    window.open(obj === null || obj === void 0 ? void 0 : obj.navigationUrl);
  };
  var allCitizenServicesProps = {
    header: t(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : citizenServicesObj.headerLabel),
    sideOption: {
      name: t(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$s = citizenServicesObj.sideOption) === null || _citizenServicesObj$s === void 0 ? void 0 : _citizenServicesObj$s.name),
      onClick: function onClick() {
        var _citizenServicesObj$s2;
        return history.push(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$s2 = citizenServicesObj.sideOption) === null || _citizenServicesObj$s2 === void 0 ? void 0 : _citizenServicesObj$s2.navigationUrl);
      }
    },
    options: [{
      name: t(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$p = citizenServicesObj.props) === null || _citizenServicesObj$p === void 0 ? void 0 : (_citizenServicesObj$p2 = _citizenServicesObj$p[0]) === null || _citizenServicesObj$p2 === void 0 ? void 0 : _citizenServicesObj$p2.label),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ComplaintIcon, null),
      onClick: function onClick() {
        var _citizenServicesObj$p3, _citizenServicesObj$p4;
        return history.push(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$p3 = citizenServicesObj.props) === null || _citizenServicesObj$p3 === void 0 ? void 0 : (_citizenServicesObj$p4 = _citizenServicesObj$p3[0]) === null || _citizenServicesObj$p4 === void 0 ? void 0 : _citizenServicesObj$p4.navigationUrl);
      }
    }, {
      name: t(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$p5 = citizenServicesObj.props) === null || _citizenServicesObj$p5 === void 0 ? void 0 : (_citizenServicesObj$p6 = _citizenServicesObj$p5[1]) === null || _citizenServicesObj$p6 === void 0 ? void 0 : _citizenServicesObj$p6.label),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.PTIcon, {
        className: "fill-path-primary-main"
      }),
      onClick: function onClick() {
        var _citizenServicesObj$p7, _citizenServicesObj$p8;
        return history.push(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$p7 = citizenServicesObj.props) === null || _citizenServicesObj$p7 === void 0 ? void 0 : (_citizenServicesObj$p8 = _citizenServicesObj$p7[1]) === null || _citizenServicesObj$p8 === void 0 ? void 0 : _citizenServicesObj$p8.navigationUrl);
      }
    }, {
      name: t(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$p9 = citizenServicesObj.props) === null || _citizenServicesObj$p9 === void 0 ? void 0 : (_citizenServicesObj$p10 = _citizenServicesObj$p9[2]) === null || _citizenServicesObj$p10 === void 0 ? void 0 : _citizenServicesObj$p10.label),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.CaseIcon, {
        className: "fill-path-primary-main"
      }),
      onClick: function onClick() {
        var _citizenServicesObj$p11, _citizenServicesObj$p12;
        return history.push(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$p11 = citizenServicesObj.props) === null || _citizenServicesObj$p11 === void 0 ? void 0 : (_citizenServicesObj$p12 = _citizenServicesObj$p11[2]) === null || _citizenServicesObj$p12 === void 0 ? void 0 : _citizenServicesObj$p12.navigationUrl);
      }
    }, {
      name: t(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$p13 = citizenServicesObj.props) === null || _citizenServicesObj$p13 === void 0 ? void 0 : (_citizenServicesObj$p14 = _citizenServicesObj$p13[3]) === null || _citizenServicesObj$p14 === void 0 ? void 0 : _citizenServicesObj$p14.label),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.OBPSIcon, null),
      onClick: function onClick() {
        var _citizenServicesObj$p15, _citizenServicesObj$p16;
        return history.push(citizenServicesObj === null || citizenServicesObj === void 0 ? void 0 : (_citizenServicesObj$p15 = citizenServicesObj.props) === null || _citizenServicesObj$p15 === void 0 ? void 0 : (_citizenServicesObj$p16 = _citizenServicesObj$p15[3]) === null || _citizenServicesObj$p16 === void 0 ? void 0 : _citizenServicesObj$p16.navigationUrl);
      }
    }],
    styles: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      width: "100%"
    }
  };
  var allInfoAndUpdatesProps = {
    header: t(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : infoAndUpdatesObj.headerLabel),
    sideOption: {
      name: t(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$si = infoAndUpdatesObj.sideOption) === null || _infoAndUpdatesObj$si === void 0 ? void 0 : _infoAndUpdatesObj$si.name),
      onClick: function onClick() {
        var _infoAndUpdatesObj$si2;
        return history.push(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$si2 = infoAndUpdatesObj.sideOption) === null || _infoAndUpdatesObj$si2 === void 0 ? void 0 : _infoAndUpdatesObj$si2.navigationUrl);
      }
    },
    options: [{
      name: t(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$pr = infoAndUpdatesObj.props) === null || _infoAndUpdatesObj$pr === void 0 ? void 0 : (_infoAndUpdatesObj$pr2 = _infoAndUpdatesObj$pr[0]) === null || _infoAndUpdatesObj$pr2 === void 0 ? void 0 : _infoAndUpdatesObj$pr2.label),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.HomeIcon, null),
      onClick: function onClick() {
        var _infoAndUpdatesObj$pr3, _infoAndUpdatesObj$pr4;
        return history.push(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$pr3 = infoAndUpdatesObj.props) === null || _infoAndUpdatesObj$pr3 === void 0 ? void 0 : (_infoAndUpdatesObj$pr4 = _infoAndUpdatesObj$pr3[0]) === null || _infoAndUpdatesObj$pr4 === void 0 ? void 0 : _infoAndUpdatesObj$pr4.navigationUrl);
      }
    }, {
      name: t(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$pr5 = infoAndUpdatesObj.props) === null || _infoAndUpdatesObj$pr5 === void 0 ? void 0 : (_infoAndUpdatesObj$pr6 = _infoAndUpdatesObj$pr5[1]) === null || _infoAndUpdatesObj$pr6 === void 0 ? void 0 : _infoAndUpdatesObj$pr6.label),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Calender, null),
      onClick: function onClick() {
        var _infoAndUpdatesObj$pr7, _infoAndUpdatesObj$pr8;
        return history.push(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$pr7 = infoAndUpdatesObj.props) === null || _infoAndUpdatesObj$pr7 === void 0 ? void 0 : (_infoAndUpdatesObj$pr8 = _infoAndUpdatesObj$pr7[1]) === null || _infoAndUpdatesObj$pr8 === void 0 ? void 0 : _infoAndUpdatesObj$pr8.navigationUrl);
      }
    }, {
      name: t(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$pr9 = infoAndUpdatesObj.props) === null || _infoAndUpdatesObj$pr9 === void 0 ? void 0 : (_infoAndUpdatesObj$pr10 = _infoAndUpdatesObj$pr9[2]) === null || _infoAndUpdatesObj$pr10 === void 0 ? void 0 : _infoAndUpdatesObj$pr10.label),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.DocumentIcon, null),
      onClick: function onClick() {
        var _infoAndUpdatesObj$pr11, _infoAndUpdatesObj$pr12;
        return history.push(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$pr11 = infoAndUpdatesObj.props) === null || _infoAndUpdatesObj$pr11 === void 0 ? void 0 : (_infoAndUpdatesObj$pr12 = _infoAndUpdatesObj$pr11[2]) === null || _infoAndUpdatesObj$pr12 === void 0 ? void 0 : _infoAndUpdatesObj$pr12.navigationUrl);
      }
    }, {
      name: t(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$pr13 = infoAndUpdatesObj.props) === null || _infoAndUpdatesObj$pr13 === void 0 ? void 0 : (_infoAndUpdatesObj$pr14 = _infoAndUpdatesObj$pr13[3]) === null || _infoAndUpdatesObj$pr14 === void 0 ? void 0 : _infoAndUpdatesObj$pr14.label),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.DocumentIcon, null),
      onClick: function onClick() {
        var _infoAndUpdatesObj$pr15, _infoAndUpdatesObj$pr16;
        return history.push(infoAndUpdatesObj === null || infoAndUpdatesObj === void 0 ? void 0 : (_infoAndUpdatesObj$pr15 = infoAndUpdatesObj.props) === null || _infoAndUpdatesObj$pr15 === void 0 ? void 0 : (_infoAndUpdatesObj$pr16 = _infoAndUpdatesObj$pr15[3]) === null || _infoAndUpdatesObj$pr16 === void 0 ? void 0 : _infoAndUpdatesObj$pr16.navigationUrl);
      }
    }],
    styles: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      width: "100%"
    }
  };
  return isLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement("div", {
    className: "HomePageContainer"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "HomePageWrapper"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "BannerWithSearch"
  }, isMobile ? /*#__PURE__*/React__default.createElement("img", {
    src: appBannerMobObj === null || appBannerMobObj === void 0 ? void 0 : appBannerMobObj.bannerUrl
  }) : /*#__PURE__*/React__default.createElement("img", {
    src: appBannerWebObj === null || appBannerWebObj === void 0 ? void 0 : appBannerWebObj.bannerUrl
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "ServicesSection"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardBasedOptions, _extends({
    style: {
      marginTop: "-30px"
    }
  }, allCitizenServicesProps)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardBasedOptions, _extends({
    style: isMobile ? {} : {
      marginTop: "-30px"
    }
  }, allInfoAndUpdatesProps)))), (whatsAppBannerMobObj || whatsAppBannerWebObj) && /*#__PURE__*/React__default.createElement("div", {
    className: "WhatsAppBanner"
  }, isMobile ? /*#__PURE__*/React__default.createElement("img", {
    src: whatsAppBannerMobObj === null || whatsAppBannerMobObj === void 0 ? void 0 : whatsAppBannerMobObj.bannerUrl,
    onClick: function onClick() {
      return handleClickOnWhatsAppBanner(whatsAppBannerMobObj);
    }
  }) : /*#__PURE__*/React__default.createElement("img", {
    src: whatsAppBannerWebObj === null || whatsAppBannerWebObj === void 0 ? void 0 : whatsAppBannerWebObj.bannerUrl,
    onClick: function onClick() {
      return handleClickOnWhatsAppBanner(whatsAppBannerWebObj);
    }
  })), conditionsToDisableNotificationCountTrigger() ? EventsDataLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement("div", {
    className: "WhatsNewSection"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "headSection"
  }, /*#__PURE__*/React__default.createElement("h2", null, t(whatsNewSectionObj === null || whatsNewSectionObj === void 0 ? void 0 : whatsNewSectionObj.headerLabel)), /*#__PURE__*/React__default.createElement("p", {
    onClick: function onClick() {
      var _whatsNewSectionObj$s;
      return history.push(whatsNewSectionObj === null || whatsNewSectionObj === void 0 ? void 0 : (_whatsNewSectionObj$s = whatsNewSectionObj.sideOption) === null || _whatsNewSectionObj$s === void 0 ? void 0 : _whatsNewSectionObj$s.navigationUrl);
    }
  }, t(whatsNewSectionObj === null || whatsNewSectionObj === void 0 ? void 0 : (_whatsNewSectionObj$s2 = whatsNewSectionObj.sideOption) === null || _whatsNewSectionObj$s2 === void 0 ? void 0 : _whatsNewSectionObj$s2.name))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.WhatsNewCard, EventsData === null || EventsData === void 0 ? void 0 : EventsData[0])) : null));
};

var LanguageSelection = function LanguageSelection() {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    _Digit$Hooks$useStore2 = _Digit$Hooks$useStore.data,
    _Digit$Hooks$useStore3 = _Digit$Hooks$useStore2 === void 0 ? {} : _Digit$Hooks$useStore2,
    languages = _Digit$Hooks$useStore3.languages,
    stateInfo = _Digit$Hooks$useStore3.stateInfo,
    isLoading = _Digit$Hooks$useStore.isLoading;
  var selectedLanguage = Digit.StoreData.getCurrentLanguage();
  var texts = React.useMemo(function () {
    return {
      header: t("CS_COMMON_CHOOSE_LANGUAGE"),
      submitBarLabel: t("CORE_COMMON_CONTINUE")
    };
  }, [t]);
  var RadioButtonProps = React.useMemo(function () {
    return {
      options: languages,
      optionsKey: "label",
      additionalWrapperClass: "reverse-radio-selection-wrapper",
      onSelect: function onSelect(language) {
        return Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
      },
      selectedOption: languages === null || languages === void 0 ? void 0 : languages.filter(function (i) {
        return i.value === selectedLanguage;
      })[0]
    };
  }, [selectedLanguage, languages]);
  function onSubmit() {
    var _window;
    history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/citizen/select-location");
  }
  return isLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement("div", {
    className: "selection-card-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PageBasedInput, {
    texts: texts,
    onSubmit: onSubmit
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("CS_COMMON_CHOOSE_LANGUAGE")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, RadioButtonProps)));
};

var LocationSelection = function LocationSelection() {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var location = reactRouterDom.useLocation();
  var _Digit$Hooks$useTenan = Digit.Hooks.useTenants(),
    cities = _Digit$Hooks$useTenan.data,
    isLoading = _Digit$Hooks$useTenan.isLoading;
  var _useState = React.useState(function () {
      return {
        code: Digit.ULBService.getCitizenCurrentTenant(true)
      };
    }),
    selectedCity = _useState[0],
    setSelectedCity = _useState[1];
  var _useState2 = React.useState(false),
    showError = _useState2[0],
    setShowError = _useState2[1];
  var texts = React.useMemo(function () {
    return {
      header: t("CS_COMMON_CHOOSE_LOCATION"),
      submitBarLabel: t("CORE_COMMON_CONTINUE")
    };
  }, [t]);
  function selectCity(city) {
    setSelectedCity(city);
    setShowError(false);
  }
  var RadioButtonProps = React.useMemo(function () {
    return {
      options: cities,
      optionsKey: "i18nKey",
      additionalWrapperClass: "reverse-radio-selection-wrapper",
      onSelect: selectCity,
      selectedOption: selectedCity
    };
  }, [cities, t, selectedCity]);
  function onSubmit() {
    if (selectedCity) {
      var _location$state, _window;
      Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
      var redirectBackTo = (_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.redirectBackTo;
      if (redirectBackTo) {
        history.replace(redirectBackTo);
      } else history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/citizen");
    } else {
      setShowError(true);
    }
  }
  return isLoading ? /*#__PURE__*/React__default.createElement("loader", null) : /*#__PURE__*/React__default.createElement("div", {
    className: "selection-card-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PageBasedInput, {
    texts: texts,
    onSubmit: onSubmit,
    className: "location-selection-container"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("CS_COMMON_CHOOSE_LOCATION")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchOnRadioButtons, _extends({}, RadioButtonProps, {
    placeholder: t("COMMON_TABLE_SEARCH")
  })), showError ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t("CS_COMMON_LOCATION_SELECTION_ERROR")) : null));
};

var _Pact = /*#__PURE__*/function () {
  function _Pact() {}
  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;
    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;
      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }
        return result;
      } else {
        return this;
      }
    }
    this.o = function (_this) {
      try {
        var value = _this.v;
        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };
    return result;
  };
  return _Pact;
}();
function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }
        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }
    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }
    pact.s = state;
    pact.v = value;
    var observer = pact.o;
    if (observer) {
      observer(pact);
    }
  }
}
function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}
function _forTo(array, body, check) {
  var i = -1,
    pact,
    reject;
  function _cycle(result) {
    try {
      while (++i < array.length && (!check || !check())) {
        result = body(i);
        if (result && result.then) {
          if (_isSettledPact(result)) {
            result = result.v;
          } else {
            result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
            return;
          }
        }
      }
      if (pact) {
        _settle(pact, 1, result);
      } else {
        pact = result;
      }
    } catch (e) {
      _settle(pact || (pact = new _Pact()), 2, e);
    }
  }
  _cycle();
  return pact;
}
var _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
function _forOf(target, body, check) {
  if (typeof target[_iteratorSymbol] === "function") {
    var _cycle = function _cycle(result) {
      try {
        while (!(step = iterator.next()).done && (!check || !check())) {
          result = body(step.value);
          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }
        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    };
    var iterator = target[_iteratorSymbol](),
      step,
      pact,
      reject;
    _cycle();
    if (iterator["return"]) {
      var _fixup = function _fixup(value) {
        try {
          if (!step.done) {
            iterator["return"]();
          }
        } catch (e) {}
        return value;
      };
      if (pact && pact.then) {
        return pact.then(_fixup, function (e) {
          throw _fixup(e);
        });
      }
      _fixup();
    }
    return pact;
  }
  if (!("length" in target)) {
    throw new TypeError("Object is not iterable");
  }
  var values = [];
  for (var i = 0; i < target.length; i++) {
    values.push(target[i]);
  }
  return _forTo(values, function (i) {
    return body(values[i]);
  }, check);
}
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

function UploadDrawer(_ref) {
  var setProfilePic = _ref.setProfilePic,
    closeDrawer = _ref.closeDrawer,
    userType = _ref.userType,
    removeProfilePic = _ref.removeProfilePic,
    showToast = _ref.showToast;
  var _useState = React.useState(null),
    setUploadedFile = _useState[1];
  var _useState2 = React.useState(""),
    file = _useState2[0],
    setFile = _useState2[1];
  var _useState3 = React.useState(null),
    setError = _useState3[1];
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var selectfile = function selectfile(e) {
    return setFile(e.target.files[0]);
  };
  var removeimg = function removeimg() {
    removeProfilePic();
    closeDrawer();
  };
  var onOverlayBodyClick = function onOverlayBodyClick() {
    return closeDrawer();
  };
  React.useEffect(function () {
    (function () {
      try {
        setError(null);
        var _temp3 = function () {
          if (file) {
            var _temp2 = function () {
              if (file.size >= 1000000) {
                showToast("error", t("CORE_COMMON_PROFILE_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
                setError(t("CORE_COMMON_PROFILE_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else {
                var _temp = _catch(function () {
                  return Promise.resolve(Digit.UploadServices.Filestorage(userType + "-profile", file, Digit.ULBService.getStateId())).then(function (response) {
                    var _response$data, _response$data$files;
                    if ((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$files = _response$data.files) === null || _response$data$files === void 0 ? void 0 : _response$data$files.length) > 0) {
                      var _response$data2, _response$data2$files;
                      var fileStoreId = response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$files = _response$data2.files[0]) === null || _response$data2$files === void 0 ? void 0 : _response$data2$files.fileStoreId;
                      setUploadedFile(fileStoreId);
                      setProfilePic(fileStoreId);
                    } else {
                      showToast("error", t("CORE_COMMON_PROFILE_FILE_UPLOAD_ERROR"));
                      setError(t("CORE_COMMON_PROFILE_FILE_UPLOAD_ERROR"));
                    }
                  });
                }, function () {
                  showToast("error", t("CORE_COMMON_PROFILE_INVALID_FILE_INPUT"));
                });
                if (_temp && _temp.then) return _temp.then(function () {});
              }
            }();
            if (_temp2 && _temp2.then) return _temp2.then(function () {});
          }
        }();
        return _temp3 && _temp3.then ? _temp3.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [file]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      width: "100%",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,.5)"
    },
    onClick: onOverlayBodyClick
  }), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%",
      justifyContent: "space-between",
      display: "flex",
      backgroundColor: "white",
      alignItems: "center",
      position: "fixed",
      left: "0",
      right: "0",
      height: "20%",
      bottom: userType === "citizen" ? "2.5rem" : "0",
      zIndex: "1000"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px 0"
    }
  }, /*#__PURE__*/React__default.createElement("label", {
    "for": "file",
    style: {
      cursor: "pointer"
    }
  }, " ", /*#__PURE__*/React__default.createElement(digitUiReactComponents.GalleryIcon, null)), /*#__PURE__*/React__default.createElement("label", {
    style: {
      cursor: "pointer"
    }
  }, " Gallery"), /*#__PURE__*/React__default.createElement("input", {
    type: "file",
    id: "file",
    accept: "image/*, .png, .jpeg, .jpg",
    onChange: selectfile,
    style: {
      display: "none"
    }
  })), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      flex: "1",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "8px 0"
    }
  }, /*#__PURE__*/React__default.createElement("button", {
    onClick: removeimg
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.RemoveIcon, null)), /*#__PURE__*/React__default.createElement("label", {
    style: {
      cursor: "pointer"
    }
  }, "Remove"))));
}

var defaultImage$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAADUCAMAAACs0e/bAAAAM1BMVEXK0eL" + "/" + "/" + "/" + "/Dy97GzuD4+fvL0uPg5O7T2efb4OvR1+Xr7vTk5/Df4+37/P3v8fbO1eTt8PUsnq5FAAAGqElEQVR4nO2d25ajIBBFCajgvf/" + "/a0eMyZgEjcI5xgt7Hmatme507UaxuJXidiDqjmSgeVIMlB1ZR1WZAf2gbdu0QwixSYzjOJPmHurfEGEfY9XzjNGG9whQCeVAuv5xQEySLtR9hPuIcwj0EeroN5m3D1IbsbgHK0esiQ9MKs" + "qXVr8Hm/a/Pulk6wihpCIXBw3dh7bTvRBt9+dC5NfS1VH3xETdM3MxXRN1T0zUPTNR98xcS1dlV9NNfx3DhkTdM6PKqHteVBF1z0vU5f0sKdpc2zWLKutXrjJjdLvpesRmukqYonauPhXpds" + "Lb6CppmpnltsYIuY2yavi6Mi2/rzAWm1zUfF0limVLqkZyA+mDYevKBS37aGC+L1lX5e7uyU1Cv565uiua9k5LFqbqqrnu2I3m+jJ11ZoLeRtfmdB0Uw/ZDsP0VTxdn7a1VERfmq7Xl" + "Xyn5D2QWLoq8bZlPoBJumphJjVBw/Ll6CoTZGsTDs4NrGqKbqBth8ZHJUi6cn168QmleSm6GmB7Kxm+6obXlf7PoDHosCwM3QpiS2legi6ocSl3L0G3BdneDDgwQdENfeY+SfDJBkF37Z" + "B+GvwzA6/rMaafAn8143VhPZWdjMWG1oHXhdnemgPoAvLlB/iZyRTfVeF06wPoQhJmlm4bdcOAZRlRN5gcPc5SoPEQR1fDdbOo6wn+uYvXxY0QCLom6gYROKH+Aj5nvphuFXWDiLpRdxl" + "/19LFT95k6CHCrnW7pCDqBn1i1PUFvii2c11oZOJ6usWeH0RRNzC4Zs+6FTi2nevCVwCjbugnXklX5fkfTldL8PEilUB1kfNyN1u9MME2sATr4lbuB7AjfLAuvsRm1A0g6gYRdcPAjvBlje" + "2Z8brI8OC68AcRdlCkwLohx2mcZMjw9q+LzarQurjtnwPYAydX08WecECO/u6Ad0GBdYG7jO5gB4Ap+PwKcA9ZT43dn4/W9TyiPAn4OAJaF7h3uwe8StSCddFdM3jqFa2LvnnB5zzhuuBBAj" + "Y4gi50cg694gnXhTYvfMdrjtcFZhrwE9r41gUem8IXWMC3LrBzxh+a0gRd1N1LOK7M0IUUGuggvEmHoStA2/MJh7MpupiDU4TzjhxdzLAoO4ouZvqVURbFMHQlZD6SUeWHoguZsSLUGegreh" + "A+FZFowPdUWTi6iMoZlIpGGUUXkDbjj/9ZOLqAQS/+GIKl5BQOCn/ycqpzkXSDm5dU7ZWkG7wUyGlcmm7g5Ux56AqirgoaJ7BeokPTDbp9CbVunjFxPrl7+HqnkrSq1Da7JX20f3dV8yJi6v" + "oO81mX8vV0mx3qUsZCPRfTlVRdz2EvdufYGDvNQvvwqHtmXd+a1ITinwNcXc+lT6JuzdT1XDyBn/x7wtX1HCQQdW9MXc8xArGrirowfLeUEbMqqq6f7TF1lfRdOuGNiGi6SpT+WxY06xUfNN" + "2wBfyE9I4tlm7w5hvOPDNJN3yNiLMipji6gE3chKhouoCtN5x3QlF0EZt8OW/8ougitqJQlk1aii7iFC9l0MvRReyao7xNjKML2Z/PuHlzhi5mFxljiZeiC9rPTEisNEMX9KYAwo5Xhi7qaA" + "3hamboYm7dG+NVrXhdaYDv5zFaQZsYrCtbbAGnjkQDX2+J1FXCwOsqWOpKoIQNTFdqYBWydxqNqUoG0pVpCS+H8kaJaGKErlIaXj7CRRE+gRWuKwW9YZ80oVOUgbpdT0zpnSZJTIiwCtJVelv" + "Xntr4P5j6BWfPb5Wcx84C4cq3hb11lco2u2Mdwp6XdJ/Ne3wb8DWdfiRenZaXrhLwOj4e+GQeHroy3YOspS7TlU28Wle2m2QUS0mqdcbrdNW+ZHsSsyK7tBfm0q/dWcv+Z3mytVx3t7KWulq" + "Ue6ilunu8jF8pFwgv1FXp3mUt35OtRbr7eM4u4Gs6vUBXgeuHc5kfE/cbvWZtkROLm1DMtLCy80tzsu2PRj0hTI8fvrQuvsjlJkyutszq+m423wHaLTyniy/XuiGZ84LuT+m5ZfNfRxyGs7L" + "XZOvia7VujatUwVTrIt+Q/Csc7Tuhe+BOakT10b4TuoiiJjvgU9emTO42PwEfBa+cuodKkuf42DXr1D3JpXz73Hnn0j10evHKe+nufgfUm+7B84sX9FfdEzXux2DBpWuKokkCqN/5pa/8pmvn" + "L+RGKCddCGmatiPyPB/+ekO/M/q/7uvbt22kTt3zEnXPzCV13T3Gel4/6NduDu66xRvlPNkM1RjjxUdv+4WhGx6TftD19Q/dfzpwcHO+rE3fAAAAAElFTkSuQmCC";
var UserProfile = function UserProfile(_ref) {
  var _Digit$UserService$ge, _window, _window2, _errors$userName, _errors$emailAddress, _errors$userName2, _errors$mobileNumber, _errors$emailAddress2, _ref3, _errors$currentPasswo, _errors$newPassword, _errors$confirmPasswo;
  var stateCode = _ref.stateCode,
    userType = _ref.userType,
    cityDetails = _ref.cityDetails;
  var history = reactRouterDom.useHistory();
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var url = window.location.href;
  var stateId = Digit.ULBService.getStateId();
  var tenant = Digit.ULBService.getCurrentTenantId();
  var userInfo = ((_Digit$UserService$ge = Digit.UserService.getUser()) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.info) || {};
  var _useState = React.useState(null),
    userDetails = _useState[0],
    setUserDetails = _useState[1];
  var _useState2 = React.useState(userInfo !== null && userInfo !== void 0 && userInfo.name ? userInfo.name : ""),
    name = _useState2[0],
    setName = _useState2[1];
  var _useState3 = React.useState(userInfo !== null && userInfo !== void 0 && userInfo.emailId ? userInfo.emailId : ""),
    email = _useState3[0],
    setEmail = _useState3[1];
  var _useState4 = React.useState(userDetails === null || userDetails === void 0 ? void 0 : userDetails.gender),
    gender = _useState4[0],
    setGender = _useState4[1];
  var _useState5 = React.useState(userInfo !== null && userInfo !== void 0 && userInfo.permanentCity ? userInfo.permanentCity : cityDetails.name),
    city = _useState5[0],
    setCity = _useState5[1];
  var _useState6 = React.useState(userInfo !== null && userInfo !== void 0 && userInfo.mobileNumber ? userInfo.mobileNumber : ""),
    mobileNumber = _useState6[0],
    setMobileNo = _useState6[1];
  var _useState7 = React.useState(null),
    profilePic = _useState7[0],
    setProfilePic = _useState7[1];
  var _useState8 = React.useState(""),
    profileImg = _useState8[0],
    setProfileImg = _useState8[1];
  var _useState9 = React.useState(false),
    openUploadSlide = _useState9[0],
    setOpenUploadSide = _useState9[1];
  var _useState10 = React.useState(false),
    changepassword = _useState10[0],
    setChangepassword = _useState10[1];
  var _useState11 = React.useState(""),
    currentPassword = _useState11[0],
    setCurrentPassword = _useState11[1];
  var _useState12 = React.useState(""),
    newPassword = _useState12[0],
    setNewPassword = _useState12[1];
  var _useState13 = React.useState(""),
    confirmPassword = _useState13[0],
    setConfirmPassword = _useState13[1];
  var _useState14 = React.useState(null),
    toast = _useState14[0],
    setToast = _useState14[1];
  var _useState15 = React.useState(false),
    loading = _useState15[0],
    setLoading = _useState15[1];
  var _React$useState = React__default.useState(window.innerWidth),
    windowWidth = _React$useState[0],
    setWindowWidth = _React$useState[1];
  var _React$useState2 = React__default.useState({}),
    errors = _React$useState2[0],
    setErrors = _React$useState2[1];
  var isMobile = window.Digit.Utils.browser.isMobile();
  var getUserInfo = function getUserInfo() {
    try {
      var uuid = userInfo === null || userInfo === void 0 ? void 0 : userInfo.uuid;
      var _temp = function () {
        if (uuid) {
          return Promise.resolve(Digit.UserService.userSearch(tenant, {
            uuid: [uuid]
          }, {})).then(function (usersResponse) {
            usersResponse && usersResponse.user && usersResponse.user.length && setUserDetails(usersResponse.user[0]);
          });
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  React__default.useEffect(function () {
    window.addEventListener("resize", function () {
      return setWindowWidth(window.innerWidth);
    });
    return function () {
      window.removeEventListener("resize", function () {
        return setWindowWidth(window.innerWidth);
      });
    };
  });
  React.useEffect(function () {
    var _userDetails$photo;
    setLoading(true);
    getUserInfo();
    setGender({
      i18nKey: undefined,
      code: userDetails === null || userDetails === void 0 ? void 0 : userDetails.gender,
      value: userDetails === null || userDetails === void 0 ? void 0 : userDetails.gender
    });
    var thumbs = userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$photo = userDetails.photo) === null || _userDetails$photo === void 0 ? void 0 : _userDetails$photo.split(",");
    setProfileImg(thumbs === null || thumbs === void 0 ? void 0 : thumbs.at(0));
    setLoading(false);
  }, [userDetails !== null]);
  var validation = {};
  var editScreen = false;
  var onClickAddPic = function onClickAddPic() {
    return setOpenUploadSide(!openUploadSlide);
  };
  var TogleforPassword = function TogleforPassword() {
    return setChangepassword(!changepassword);
  };
  var setGenderName = function setGenderName(value) {
    return setGender(value);
  };
  var closeFileUploadDrawer = function closeFileUploadDrawer() {
    return setOpenUploadSide(false);
  };
  var setUserName = function setUserName(value) {
    setName(value);
    if (!new RegExp(/^[a-zA-Z ]+$/i).test(value) || value.length === 0 || value.length > 50) {
      setErrors(_extends({}, errors, {
        userName: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_NAME_INVALID"
        }
      }));
    } else {
      setErrors(_extends({}, errors, {
        userName: null
      }));
    }
  };
  var setUserEmailAddress = function setUserEmailAddress(value) {
    if ((userInfo === null || userInfo === void 0 ? void 0 : userInfo.userName) !== value) {
      setEmail(value);
      if (value.length && !(value.includes("@") && value.includes("."))) {
        setErrors(_extends({}, errors, {
          emailAddress: {
            type: "pattern",
            message: "CORE_COMMON_PROFILE_EMAIL_INVALID"
          }
        }));
      } else {
        setErrors(_extends({}, errors, {
          emailAddress: null
        }));
      }
    } else {
      setErrors(_extends({}, errors, {
        emailAddress: null
      }));
    }
  };
  var setUserMobileNumber = function setUserMobileNumber(value) {
    setMobileNo(value);
    if (userType === "employee" && !new RegExp(/^[6-9]{1}[0-9]{9}$/).test(value)) {
      setErrors(_extends({}, errors, {
        mobileNumber: {
          type: 'pattern',
          message: "CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID"
        }
      }));
    } else {
      setErrors(_extends({}, errors, {
        mobileNumber: null
      }));
    }
  };
  var setUserCurrentPassword = function setUserCurrentPassword(value) {
    setCurrentPassword(value);
    if (!new RegExp(/^([a-zA-Z0-9@#$%]{8,15})$/i).test(value)) {
      setErrors(_extends({}, errors, {
        currentPassword: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_PASSWORD_INVALID"
        }
      }));
    } else {
      setErrors(_extends({}, errors, {
        currentPassword: null
      }));
    }
  };
  var setUserNewPassword = function setUserNewPassword(value) {
    setNewPassword(value);
    if (!new RegExp(/^([a-zA-Z0-9@#$%]{8,15})$/i).test(value)) {
      setErrors(_extends({}, errors, {
        newPassword: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_PASSWORD_INVALID"
        }
      }));
    } else {
      setErrors(_extends({}, errors, {
        newPassword: null
      }));
    }
  };
  var setUserConfirmPassword = function setUserConfirmPassword(value) {
    setConfirmPassword(value);
    if (!new RegExp(/^([a-zA-Z0-9@#$%]{8,15})$/i).test(value)) {
      setErrors(_extends({}, errors, {
        confirmPassword: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_PASSWORD_INVALID"
        }
      }));
    } else {
      setErrors(_extends({}, errors, {
        confirmPassword: null
      }));
    }
  };
  var removeProfilePic = function removeProfilePic() {
    setProfilePic(null);
    setProfileImg(null);
  };
  var showToast = function showToast(type, message, duration) {
    if (duration === void 0) {
      duration = 5000;
    }
    setToast({
      key: type,
      action: message
    });
    setTimeout(function () {
      setToast(null);
    }, duration);
  };
  var updateProfile = function updateProfile() {
    try {
      var _temp3 = function _temp3(_result) {
        if (_exit) return _result;
        setLoading(false);
      };
      var _exit = false;
      setLoading(true);
      var _temp2 = _catch(function () {
        var requestData = _extends({}, userInfo, {
          name: name,
          gender: gender === null || gender === void 0 ? void 0 : gender.value,
          emailId: email,
          photo: profilePic
        });
        if (!new RegExp(/^([a-zA-Z ])*$/).test(name) || name === "" || name.length > 50 || name.length < 1) {
          throw JSON.stringify({
            type: "error",
            message: t("CORE_COMMON_PROFILE_NAME_INVALID")
          });
        }
        if (userType === "employee" && !new RegExp(/^[6-9]{1}[0-9]{9}$/).test(mobileNumber)) {
          throw JSON.stringify({
            type: "error",
            message: t("CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID")
          });
        }
        if (email.length && !(email.includes("@") && email.includes("."))) {
          throw JSON.stringify({
            type: "error",
            message: t("CORE_COMMON_PROFILE_EMAIL_INVALID")
          });
        }
        if (changepassword && (currentPassword.length || newPassword.length || confirmPassword.length)) {
          if (newPassword !== confirmPassword) {
            throw JSON.stringify({
              type: "error",
              message: t("CORE_COMMON_PROFILE_PASSWORD_MISMATCH")
            });
          }
          if (!(currentPassword.length && newPassword.length && confirmPassword.length)) {
            throw JSON.stringify({
              type: "error",
              message: t("CORE_COMMON_PROFILE_PASSWORD_INVALID")
            });
          }
          if (!new RegExp(/^([a-zA-Z0-9@#$%]{8,15})$/i).test(newPassword) && !new RegExp(/^([a-zA-Z0-9@#$%]{8,15})$/i).test(confirmPassword)) {
            throw JSON.stringify({
              type: "error",
              message: t("CORE_COMMON_PROFILE_PASSWORD_INVALID")
            });
          }
        }
        return Promise.resolve(Digit.UserService.updateUser(requestData, stateCode)).then(function (_ref2) {
          var responseInfo = _ref2.responseInfo,
            user = _ref2.user;
          if (responseInfo && responseInfo.status === "200") {
            var _user = Digit.UserService.getUser();
            if (_user) {
              Digit.UserService.setUser(_extends({}, _user, {
                info: _extends({}, _user.info, {
                  name: name,
                  mobileNumber: mobileNumber,
                  emailId: email,
                  permanentCity: city
                })
              }));
            }
          }
          return function () {
            if (currentPassword.length && newPassword.length && confirmPassword.length) {
              var _requestData = {
                existingPassword: currentPassword,
                newPassword: newPassword,
                tenantId: tenant,
                type: "EMPLOYEE",
                username: userInfo === null || userInfo === void 0 ? void 0 : userInfo.userName,
                confirmPassword: confirmPassword
              };
              return function () {
                if (newPassword === confirmPassword) {
                  return _catch(function () {
                    return Promise.resolve(Digit.UserService.changePassword(_requestData, tenant)).then(function (res) {
                      var changePasswordResponseInfo = res.responseInfo;
                      if (changePasswordResponseInfo !== null && changePasswordResponseInfo !== void 0 && changePasswordResponseInfo.status && changePasswordResponseInfo.status === "200") {
                        showToast("success", t("CORE_COMMON_PROFILE_UPDATE_SUCCESS_WITH_PASSWORD"), 5000);
                        setTimeout(function () {
                          return Digit.UserService.logout();
                        }, 2000);
                      } else {
                        throw "";
                      }
                    });
                  }, function (error) {
                    var _error$Errors, _error$Errors$at;
                    throw JSON.stringify({
                      type: "error",
                      message: (_error$Errors = error.Errors) !== null && _error$Errors !== void 0 && (_error$Errors$at = _error$Errors.at(0)) !== null && _error$Errors$at !== void 0 && _error$Errors$at.description ? error.Errors.at(0).description : "CORE_COMMON_PROFILE_UPDATE_ERROR_WITH_PASSWORD"
                    });
                  });
                } else {
                  throw JSON.stringify({
                    type: "error",
                    message: "CORE_COMMON_PROFILE_ERROR_PASSWORD_NOT_MATCH"
                  });
                }
              }();
            } else if (responseInfo !== null && responseInfo !== void 0 && responseInfo.status && responseInfo.status === "200") {
              showToast("success", t("CORE_COMMON_PROFILE_UPDATE_SUCCESS"), 5000);
            }
          }();
        });
      }, function (error) {
        var errorObj = JSON.parse(error);
        showToast(errorObj.type, t(errorObj.message), 5000);
      });
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var menu = [];
  var _Digit$Hooks$useGende = Digit.Hooks.useGenderMDMS(stateId, "common-masters", "GenderType"),
    Menu = _Digit$Hooks$useGende.data;
  Menu && Menu.map(function (genderDetails) {
    menu.push({
      i18nKey: "PT_COMMON_GENDER_" + genderDetails.code,
      code: "" + genderDetails.code,
      value: "" + genderDetails.code
    });
  });
  var setFileStoreId = function setFileStoreId(fileStoreId) {
    try {
      var _temp4 = function _temp4(thumbnails) {
        setProfileImg(thumbnails === null || thumbnails === void 0 ? void 0 : thumbnails.thumbs[0]);
        closeFileUploadDrawer();
      };
      setProfilePic(fileStoreId);
      return Promise.resolve(fileStoreId ? Promise.resolve(getThumbnails([fileStoreId], stateId)).then(_temp4) : _temp4(null));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var getThumbnails = function getThumbnails(ids, tenantId) {
    try {
      return Promise.resolve(Digit.UploadServices.Filefetch(ids, tenantId)).then(function (res) {
        if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
          return {
            thumbs: res.data.fileStoreIds.map(function (o) {
              return o.url.split(",")[3];
            }),
            images: res.data.fileStoreIds.map(function (o) {
              return Digit.Utils.getFileUrl(o.url);
            })
          };
        } else {
          return null;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  if (loading) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "user-profile"
  }, /*#__PURE__*/React__default.createElement("section", {
    style: {
      margin: userType === "citizen" ? "8px" : "24px"
    }
  }, userType === "citizen" ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.BreadCrumb, {
    crumbs: [{
      path: "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee",
      content: t("ES_COMMON_HOME"),
      show: true
    }, {
      path: "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/employee/user/profile",
      content: t("ES_COMMON_PAGE_1"),
      show: url.includes("/user/profile")
    }]
  })), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      flex: 1,
      flexDirection: windowWidth < 768 || userType === "citizen" ? "column" : "row",
      margin: userType === "citizen" ? "8px" : "16px",
      gap: userType === "citizen" ? "" : "0 24px",
      boxShadow: userType === "citizen" ? "1px 1px 4px 0px rgba(0,0,0,0.2)" : "",
      background: userType === "citizen" ? "white" : "",
      borderRadius: userType === "citizen" ? "4px" : "",
      maxWidth: userType === "citizen" ? "960px" : ""
    }
  }, /*#__PURE__*/React__default.createElement("section", {
    style: {
      position: "relative",
      display: "flex",
      flex: userType === "citizen" ? 1 : 2.5,
      justifyContent: "center",
      alignItems: "center",
      maxWidth: "100%",
      height: "376px",
      borderRadius: "4px",
      boxShadow: userType === "citizen" ? "" : "1px 1px 4px 0px rgba(0,0,0,0.2)",
      border: (userType === "citizen" ? "8px" : "24px") + " solid #fff",
      background: "#EEEEEE",
      padding: userType === "citizen" ? "8px" : "16px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "relative",
      height: userType === "citizen" ? "114px" : "150px",
      width: userType === "citizen" ? "114px" : "150px",
      margin: "16px"
    }
  }, /*#__PURE__*/React__default.createElement("img", {
    style: {
      margin: "auto",
      borderRadius: "300px",
      justifyContent: "center",
      height: "100%",
      width: "100%"
    },
    src: !profileImg || profileImg === "" ? defaultImage$1 : profileImg
  }), /*#__PURE__*/React__default.createElement("button", {
    style: {
      position: "absolute",
      left: "50%",
      bottom: "-24px",
      transform: "translateX(-50%)"
    },
    onClick: onClickAddPic
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CameraIcon, null)))), /*#__PURE__*/React__default.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      flex: userType === "citizen" ? 1 : 7.5,
      width: "100%",
      borderRadius: "4px",
      height: "fit-content",
      boxShadow: userType === "citizen" ? "" : "1px 1px 4px 0px rgba(0,0,0,0.2)",
      background: "white",
      padding: userType === "citizen" ? "8px" : "24px",
      paddingBottom: "20px"
    }
  }, userType === "citizen" ? /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    style:  {}
  }, "" + t("CORE_COMMON_PROFILE_NAME"), "*"), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%",
      maxWidth: "960px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
    t: t,
    style: {
      width: "100%"
    },
    type: "text",
    isMandatory: false,
    name: "name",
    value: name,
    onChange: function onChange(e) {
      return setUserName(e.target.value);
    }
  }, validation = {
    isRequired: true,
    pattern: "^[a-zA-Z-.`' ]*$",
    type: "tel",
    title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE")
  }, {
    disable: editScreen
  })), (errors === null || errors === void 0 ? void 0 : errors.userName) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, " ", t(errors === null || errors === void 0 ? void 0 : (_errors$userName = errors.userName) === null || _errors$userName === void 0 ? void 0 : _errors$userName.message), " "))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    style:  {}
  }, "" + t("CORE_COMMON_PROFILE_GENDER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    style: {
      width: "100%"
    },
    className: "form-field",
    selected: (gender === null || gender === void 0 ? void 0 : gender.length) === 1 ? gender[0] : gender,
    disable: (gender === null || gender === void 0 ? void 0 : gender.length) === 1 || editScreen,
    option: menu,
    select: setGenderName,
    value: gender,
    optionKey: "code",
    t: t,
    name: "gender"
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    style:  {}
  }, "" + t("CORE_COMMON_PROFILE_EMAIL")), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    t: t,
    style: {
      width: "100%"
    },
    type: "email",
    isMandatory: false,
    optionKey: "i18nKey",
    name: "email",
    value: email,
    onChange: function onChange(e) {
      return setUserEmailAddress(e.target.value);
    },
    disable: editScreen
  }), (errors === null || errors === void 0 ? void 0 : errors.emailAddress) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, " ", t(errors === null || errors === void 0 ? void 0 : (_errors$emailAddress = errors.emailAddress) === null || _errors$emailAddress === void 0 ? void 0 : _errors$emailAddress.message), " "))), /*#__PURE__*/React__default.createElement("button", {
    onClick: updateProfile,
    style: {
      marginTop: "24px",
      backgroundColor: "#F47738",
      width: "100%",
      height: "40px",
      color: "white",
      maxWidth: isMobile ? "100%" : "240px",
      borderBottom: "1px solid black"
    }
  }, t("CORE_COMMON_SAVE"))) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "profile-label-margin",
    style:  {
      width: "300px"
    }
  }, "" + t("CORE_COMMON_PROFILE_NAME"), "*"), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
    t: t,
    type: "text",
    isMandatory: false,
    name: "name",
    value: name,
    onChange: function onChange(e) {
      return setUserName(e.target.value);
    },
    placeholder: "Enter Your Name"
  }, validation = {
    isRequired: true,
    pattern: "^[a-zA-Z-.`' ]*$",
    type: "text",
    title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE")
  }, {
    disable: editScreen
  })), (errors === null || errors === void 0 ? void 0 : errors.userName) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, {
    style: {
      margin: 0,
      padding: 0
    }
  }, " ", t(errors === null || errors === void 0 ? void 0 : (_errors$userName2 = errors.userName) === null || _errors$userName2 === void 0 ? void 0 : _errors$userName2.message), " "))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "profile-label-margin",
    style:  {
      width: "300px"
    }
  }, "" + t("CORE_COMMON_PROFILE_GENDER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    style: {
      width: "100%"
    },
    selected: (gender === null || gender === void 0 ? void 0 : gender.length) === 1 ? gender[0] : gender,
    disable: (gender === null || gender === void 0 ? void 0 : gender.length) === 1 || editScreen,
    option: menu,
    select: setGenderName,
    value: gender,
    optionKey: "code",
    t: t,
    name: "gender"
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "profile-label-margin",
    style:  {
      width: "300px"
    }
  }, "" + t("CORE_COMMON_PROFILE_CITY")), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
    t: t,
    type: "text",
    isMandatory: false,
    name: "city",
    value: t(Digit.Utils.locale.getTransformedLocale("TENANT_TENANTS_" + tenant)),
    onChange: function onChange(e) {
      return setCity(e.target.value);
    },
    placeholder: "Enter Your City Name"
  }, validation = {
    isRequired: true,
    type: "text",
    title: t("CORE_COMMON_PROFILE_CITY_ERROR_MESSAGE")
  }, {
    disable: true
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "profile-label-margin",
    style: {
      width: "300px"
    }
  }, t("CORE_COMMON_PROFILE_MOBILE_NUMBER") + "*"), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.MobileNumber, {
    value: mobileNumber,
    style: {
      width: "100%"
    },
    name: "mobileNumber",
    placeholder: "Enter a valid Mobile No.",
    onChange: function onChange(value) {
      return setUserMobileNumber(value);
    },
    disable: true,
    required: true,
    pattern: "[6-9]{1}[0-9]{9}",
    type: "tel",
    title: t("CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID")
  }), (errors === null || errors === void 0 ? void 0 : errors.mobileNumber) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, {
    style: {
      margin: 0,
      padding: 0
    }
  }, " ", t(errors === null || errors === void 0 ? void 0 : (_errors$mobileNumber = errors.mobileNumber) === null || _errors$mobileNumber === void 0 ? void 0 : _errors$mobileNumber.message), " "))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "profile-label-margin",
    style:  {
      width: "300px"
    }
  }, "" + t("CORE_COMMON_PROFILE_EMAIL")), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    t: t,
    type: "email",
    isMandatory: false,
    placeholder: t("EMAIL_VALIDATION"),
    optionKey: "i18nKey",
    name: "email",
    value: email,
    onChange: function onChange(e) {
      return setUserEmailAddress(e.target.value);
    },
    disable: editScreen
  }), (errors === null || errors === void 0 ? void 0 : errors.emailAddress) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, " ", t(errors === null || errors === void 0 ? void 0 : (_errors$emailAddress2 = errors.emailAddress) === null || _errors$emailAddress2 === void 0 ? void 0 : _errors$emailAddress2.message), " "))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("a", {
    style: (_ref3 = {
      color: "orange",
      cursor: "default",
      marginBottom: "5"
    }, _ref3["cursor"] = "pointer", _ref3),
    onClick: TogleforPassword
  }, t("CORE_COMMON_CHANGE_PASSWORD")), changepassword ? /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginTop: "10px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "profile-label-margin",
    style:  {
      width: "300px"
    }
  }, "" + t("CORE_COMMON_PROFILE_CURRENT_PASSWORD")), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    t: t,
    type: "password",
    isMandatory: false,
    name: "name",
    pattern: "^([a-zA-Z0-9@#$%])+$",
    onChange: function onChange(e) {
      return setUserCurrentPassword(e.target.value);
    },
    disable: editScreen
  }), (errors === null || errors === void 0 ? void 0 : errors.currentPassword) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(errors === null || errors === void 0 ? void 0 : (_errors$currentPasswo = errors.currentPassword) === null || _errors$currentPasswo === void 0 ? void 0 : _errors$currentPasswo.message)))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "profile-label-margin",
    style:  {
      width: "300px"
    }
  }, "" + t("CORE_COMMON_PROFILE_NEW_PASSWORD")), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    t: t,
    type: "password",
    isMandatory: false,
    name: "name",
    pattern: "^([a-zA-Z0-9@#$%])+$",
    onChange: function onChange(e) {
      return setUserNewPassword(e.target.value);
    },
    disable: editScreen
  }), (errors === null || errors === void 0 ? void 0 : errors.newPassword) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(errors === null || errors === void 0 ? void 0 : (_errors$newPassword = errors.newPassword) === null || _errors$newPassword === void 0 ? void 0 : _errors$newPassword.message)))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "profile-label-margin",
    style:  {
      width: "300px"
    }
  }, "" + t("CORE_COMMON_PROFILE_CONFIRM_PASSWORD")), /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    t: t,
    type: "password",
    isMandatory: false,
    name: "name",
    pattern: "^([a-zA-Z0-9@#$%])+$",
    onChange: function onChange(e) {
      return setUserConfirmPassword(e.target.value);
    },
    disable: editScreen
  }), (errors === null || errors === void 0 ? void 0 : errors.confirmPassword) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(errors === null || errors === void 0 ? void 0 : (_errors$confirmPasswo = errors.confirmPassword) === null || _errors$confirmPasswo === void 0 ? void 0 : _errors$confirmPasswo.message))))) : ""))))), userType === "employee" ? /*#__PURE__*/React__default.createElement("div", {
    className: "action-bar-wrap"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    t: t,
    label: t("CORE_COMMON_SAVE"),
    onSubmit: updateProfile
  })) : "", toast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: toast.key === "error",
    label: t(toast.key === "success" ? "CORE_COMMON_PROFILE_UPDATE_SUCCESS" : toast.action),
    onClose: function onClose() {
      return setToast(null);
    },
    style: {
      maxWidth: "670px"
    }
  }), openUploadSlide == true ? /*#__PURE__*/React__default.createElement(UploadDrawer, {
    setProfilePic: setFileStoreId,
    closeDrawer: closeFileUploadDrawer,
    userType: userType,
    removeProfilePic: removeProfilePic,
    showToast: showToast
  }) : "");
};

var HowItWorks = function HowItWorks(_ref) {
  var _user$info, _data$MdmsRes$common, _data$MdmsRes$common$;
  var module = _ref.module;
  var user = Digit.UserService.getUser();
  var tenantId = (user === null || user === void 0 ? void 0 : (_user$info = user.info) === null || _user$info === void 0 ? void 0 : _user$info.tenantId) || Digit.ULBService.getCurrentTenantId();
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var storeData = Digit.SessionStorage.get("initData");
  var stateInfo = storeData.stateInfo;
  var selectedLanguage = Digit.StoreData.getCurrentLanguage();
  var _useState = React.useState(selectedLanguage),
    selected = _useState[0],
    setselected = _useState[1];
  var handleChangeLanguage = function handleChangeLanguage(language) {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };
  var _useState2 = React.useState(false),
    videoPlay = _useState2[0],
    setVideoPlay = _useState2[1];
  var _useState3 = React.useState(""),
    vidSrc = _useState3[0],
    setVidSrc = _useState3[1];
  var ViDSvg = function ViDSvg() {
    return /*#__PURE__*/React__default.createElement("svg", {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M12 24C5.38053 24 0 18.6143 0 12C0 5.38054 5.38053 1.90735e-06 12 1.90735e-06C18.6143 1.90735e-06 24 5.38054 24 12C24 18.6143 18.6143 24 12 24ZM16.3488 10.7852L11.3855 7.25251C11.1263 7.0701 10.8238 6.97889 10.5214 6.97889C10.291 6.97889 10.0557 7.03172 9.83976 7.14202C9.34054 7.40118 9.02857 7.91006 9.02857 8.46694L9.02877 15.5323C9.02877 16.0892 9.34076 16.5979 9.83996 16.8572C10.3344 17.1116 10.9296 17.0732 11.3857 16.7467L16.349 13.214C16.7426 12.9356 16.9778 12.4795 16.9778 11.9996C16.9776 11.5197 16.7426 11.0636 16.3489 10.7852L16.3488 10.7852Z",
      fill: "white"
    }));
  };
  var onClickVideo = function onClickVideo(vidObj) {
    if (selected === "hi_IN") {
      setVidSrc(vidObj["hi_IN"]);
    } else {
      setVidSrc(vidObj["en_IN"]);
    }
    setVideoPlay(true);
  };
  var onClose = function onClose() {
    setVideoPlay(false);
  };
  var _Digit$Hooks$useGetHo = Digit.Hooks.useGetHowItWorksJSON(Digit.ULBService.getStateId()),
    isLoading = _Digit$Hooks$useGetHo.isLoading,
    data = _Digit$Hooks$useGetHo.data;
  var mdmsConfigResult = data === null || data === void 0 ? void 0 : (_data$MdmsRes$common = data.MdmsRes["common-masters"]) === null || _data$MdmsRes$common === void 0 ? void 0 : (_data$MdmsRes$common$ = _data$MdmsRes$common.howItWorks[0]) === null || _data$MdmsRes$common$ === void 0 ? void 0 : _data$MdmsRes$common$["" + module];
  var languages = [{
    label: "ENGLISH",
    value: "en_IN"
  }, {
    label: "हिंदी",
    value: "hi_IN"
  }];
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "how-it-works-page"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null), /*#__PURE__*/React__default.createElement("div", {
    className: "how-it-works-page-header"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("HOW_IT_WORKS"))), /*#__PURE__*/React__default.createElement("div", {
    className: "language-selector",
    style: {
      margin: "10px"
    }
  }, languages.map(function (language, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "language-button-container",
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CustomButton, {
      selected: language.value === selected,
      text: language.label,
      onClick: function onClick() {
        return handleChangeLanguage(language);
      }
    }));
  })), mdmsConfigResult.videosJson.map(function (videos, index) {
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
      className: "WhatsNewCard",
      style: {
        "float": "left",
        position: "relative",
        width: "100%",
        marginBottom: 10
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "video-icon",
      onClick: function onClick() {
        return onClickVideo(videos);
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "vid-svg"
    }, /*#__PURE__*/React__default.createElement(ViDSvg, null))), /*#__PURE__*/React__default.createElement("div", {
      className: "how-it-works-header-description"
    }, /*#__PURE__*/React__default.createElement("h2", null, t(videos.headerLabel)), /*#__PURE__*/React__default.createElement("p", null, t(videos.description)))));
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "WhatsNewCard",
    style: {
      position: "relative",
      width: "100%",
      marginBottom: 10,
      display: "inline-block"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "how-it-works-pdf-section"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "pdf-icon-header-desc"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "pdf-icon"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PDFSvg, null)), /*#__PURE__*/React__default.createElement("div", {
    className: "pdf-header-desc"
  }, /*#__PURE__*/React__default.createElement("h2", null, t(mdmsConfigResult.pdfHeader)), /*#__PURE__*/React__default.createElement("p", null, t(mdmsConfigResult.pdfDesc)))), /*#__PURE__*/React__default.createElement("div", {
    className: "download-icon"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownloadImgIcon, null)))), videoPlay && /*#__PURE__*/React__default.createElement("div", {
    className: "how-it-works-video-play"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "close-button"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, {
    onClick: onClose
  })), /*#__PURE__*/React__default.createElement("video", {
    width: 500,
    height: 500,
    controls: true,
    autoPlay: true
  }, /*#__PURE__*/React__default.createElement("source", {
    src: vidSrc,
    type: "video/mp4"
  })))));
};

var loginSteps = [{
  texts: {
    header: "CS_LOGIN_PROVIDE_MOBILE_NUMBER",
    cardText: "CS_LOGIN_TEXT",
    nextText: "CS_COMMONS_NEXT",
    submitBarLabel: "CS_COMMONS_NEXT"
  },
  inputs: [{
    label: "CORE_COMMON_MOBILE_NUMBER",
    type: "text",
    name: "mobileNumber",
    error: "ERR_HRMS_INVALID_MOB_NO",
    validation: {
      required: true,
      minLength: 10,
      maxLength: 10
    }
  }]
}, {
  texts: {
    header: "CS_LOGIN_OTP",
    cardText: "CS_LOGIN_OTP_TEXT",
    nextText: "CS_COMMONS_NEXT",
    submitBarLabel: "CS_COMMONS_NEXT"
  }
}, {
  texts: {
    header: "CS_LOGIN_PROVIDE_NAME",
    cardText: "CS_LOGIN_NAME_TEXT",
    nextText: "CS_COMMONS_NEXT",
    submitBarLabel: "CS_COMMONS_NEXT"
  },
  inputs: [{
    label: "CORE_COMMON_NAME",
    type: "text",
    name: "name",
    error: "CORE_COMMON_NAME_VALIDMSG",
    validation: {
      required: true,
      minLength: 1,
      pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i
    }
  }]
}];

var SelectMobileNumber = function SelectMobileNumber(_ref) {
  var t = _ref.t,
    onSelect = _ref.onSelect,
    mobileNumber = _ref.mobileNumber,
    onMobileChange = _ref.onMobileChange,
    config = _ref.config,
    canSubmit = _ref.canSubmit;
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    isDisabled: !(mobileNumber.length === 10 && canSubmit),
    onSelect: onSelect,
    config: config,
    t: t,
    componentInFront: "+91",
    onChange: onMobileChange,
    value: mobileNumber
  });
};

var SelectName = function SelectName(_ref) {
  var config = _ref.config,
    onSelect = _ref.onSelect,
    t = _ref.t,
    isDisabled = _ref.isDisabled;
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: config,
    onSelect: onSelect,
    t: t,
    isDisabled: isDisabled
  });
};

function useInterval(callback, delay) {
  var savedCallback = React.useRef();
  React.useEffect(function () {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(function () {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      var timer = setInterval(tick, delay);
      return function () {
        return clearInterval(timer);
      };
    }
  }, [delay]);
}

var SelectOtp = function SelectOtp(_ref) {
  var config = _ref.config,
    otp = _ref.otp,
    onOtpChange = _ref.onOtpChange,
    onResend = _ref.onResend,
    onSelect = _ref.onSelect,
    t = _ref.t,
    error = _ref.error,
    _ref$userType = _ref.userType,
    userType = _ref$userType === void 0 ? "citizen" : _ref$userType,
    canSubmit = _ref.canSubmit;
  var _useState = React.useState(30),
    timeLeft = _useState[0],
    setTimeLeft = _useState[1];
  useInterval(function () {
    setTimeLeft(timeLeft - 1);
  }, timeLeft > 0 ? 1000 : null);
  var handleResendOtp = function handleResendOtp() {
    onResend();
    setTimeLeft(2);
  };
  if (userType === "employee") {
    return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.OTPInput, {
      length: 6,
      onChange: onOtpChange,
      value: otp
    }), timeLeft > 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_RESEND_ANOTHER_OTP") + " " + timeLeft + " " + t("CS_RESEND_SECONDS")) : /*#__PURE__*/React__default.createElement("p", {
      className: "card-text-button resend-otp",
      onClick: handleResendOtp
    }, t("CS_RESEND_OTP")), !error && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t("CS_INVALID_OTP")));
  }
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    onSelect: onSelect,
    config: config,
    t: t,
    isDisabled: !((otp === null || otp === void 0 ? void 0 : otp.length) === 6 && canSubmit)
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.OTPInput, {
    length: 6,
    onChange: onOtpChange,
    value: otp
  }), timeLeft > 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_RESEND_ANOTHER_OTP") + " " + timeLeft + " " + t("CS_RESEND_SECONDS")) : /*#__PURE__*/React__default.createElement("p", {
    className: "card-text-button",
    onClick: handleResendOtp
  }, t("CS_RESEND_OTP")), !error && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t("CS_INVALID_OTP")));
};

var _excluded = ["ResponseInfo", "UserRequest"],
  _excluded2 = ["ResponseInfo", "UserRequest"];
var _window;
var TYPE_REGISTER = {
  type: "register"
};
var TYPE_LOGIN = {
  type: "login"
};
var DEFAULT_REDIRECT_URL = "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/citizen";
var setCitizenDetail = function setCitizenDetail(userObject, token, tenantId) {
  var _JSON$parse, _JSON$parse$value;
  var locale = (_JSON$parse = JSON.parse(sessionStorage.getItem("Digit.initData"))) === null || _JSON$parse === void 0 ? void 0 : (_JSON$parse$value = _JSON$parse.value) === null || _JSON$parse$value === void 0 ? void 0 : _JSON$parse$value.selectedLanguage;
  localStorage.setItem("Citizen.tenant-id", tenantId);
  localStorage.setItem("tenant-id", tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Citizen.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Citizen.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
};
var getFromLocation = function getFromLocation(state, searchParams) {
  return (state === null || state === void 0 ? void 0 : state.from) || (searchParams === null || searchParams === void 0 ? void 0 : searchParams.from) || DEFAULT_REDIRECT_URL;
};
var Login = function Login(_ref) {
  var _location$state, _location$state7;
  var stateCode = _ref.stateCode,
    _ref$isUserRegistered = _ref.isUserRegistered,
    isUserRegistered = _ref$isUserRegistered === void 0 ? true : _ref$isUserRegistered;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var location = reactRouterDom.useLocation();
  var _useRouteMatch = reactRouterDom.useRouteMatch(),
    path = _useRouteMatch.path;
  var history = reactRouterDom.useHistory();
  var _useState = React.useState(null),
    user = _useState[0],
    setUser = _useState[1];
  var _useState2 = React.useState(null),
    error = _useState2[0],
    setError = _useState2[1];
  var _useState3 = React.useState(true),
    isOtpValid = _useState3[0],
    setIsOtpValid = _useState3[1];
  var _useState4 = React.useState(null);
  var _useState5 = React.useState(isUserRegistered ? {} : location === null || location === void 0 ? void 0 : (_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.data),
    params = _useState5[0],
    setParmas = _useState5[1];
  var _useState6 = React.useState(null),
    errorTO = _useState6[0],
    setErrorTO = _useState6[1];
  var searchParams = Digit.Hooks.useQueryParams();
  var _useState7 = React.useState(false),
    canSubmitName = _useState7[0],
    setCanSubmitName = _useState7[1];
  var _useState8 = React.useState(true),
    canSubmitOtp = _useState8[0],
    setCanSubmitOtp = _useState8[1];
  var _useState9 = React.useState(true),
    canSubmitNo = _useState9[0],
    setCanSubmitNo = _useState9[1];
  React.useEffect(function () {
    var errorTimeout;
    if (error) {
      if (errorTO) {
        clearTimeout(errorTO);
        setErrorTO(null);
      }
      errorTimeout = setTimeout(function () {
        setError("");
      }, 5000);
      setErrorTO(errorTimeout);
    }
    return function () {
      errorTimeout && clearTimeout(errorTimeout);
    };
  }, [error]);
  React.useEffect(function () {
    var _location$state2;
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    Digit.UserService.setUser(user);
    setCitizenDetail(user === null || user === void 0 ? void 0 : user.info, user === null || user === void 0 ? void 0 : user.access_token, stateCode);
    var redirectPath = ((_location$state2 = location.state) === null || _location$state2 === void 0 ? void 0 : _location$state2.from) || DEFAULT_REDIRECT_URL;
    if (!Digit.ULBService.getCitizenCurrentTenant(true)) {
      var _window2;
      history.replace("/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen/select-location", {
        redirectBackTo: redirectPath
      });
    } else {
      history.replace(redirectPath);
    }
  }, [user]);
  var stepItems = React.useMemo(function () {
    return loginSteps.map(function (step) {
      var texts = {};
      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return _extends({}, step, {
        texts: texts
      });
    }, [loginSteps]);
  });
  var getUserType = function getUserType() {
    return Digit.UserService.getType();
  };
  var handleOtpChange = function handleOtpChange(otp) {
    setParmas(_extends({}, params, {
      otp: otp
    }));
  };
  var handleMobileChange = function handleMobileChange(event) {
    var value = event.target.value;
    setParmas(_extends({}, params, {
      mobileNumber: value
    }));
  };
  var selectMobileNumber = function selectMobileNumber(mobileNumber) {
    try {
      setCanSubmitNo(false);
      setParmas(_extends({}, params, mobileNumber));
      var data = _extends({}, mobileNumber, {
        tenantId: stateCode,
        userType: getUserType()
      });
      return Promise.resolve(function () {
        if (isUserRegistered) {
          return Promise.resolve(sendOtp({
            otp: _extends({}, data, TYPE_LOGIN)
          })).then(function (_ref2) {
            var _location$state4;
            var res = _ref2[0],
              err = _ref2[1];
            if (!err) {
              var _location$state3;
              setCanSubmitNo(true);
              history.replace(path + "/otp", {
                from: getFromLocation(location.state, searchParams),
                role: (_location$state3 = location.state) === null || _location$state3 === void 0 ? void 0 : _location$state3.role
              });
              return;
            } else {
              setCanSubmitNo(true);
              if (!(location.state && location.state.role === "FSM_DSO")) {
                var _window3;
                history.push("/" + ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) + "/citizen/register/name", {
                  from: getFromLocation(location.state, searchParams),
                  data: data
                });
              }
            }
            if ((_location$state4 = location.state) !== null && _location$state4 !== void 0 && _location$state4.role) {
              var _location$state5;
              setCanSubmitNo(true);
              setError(((_location$state5 = location.state) === null || _location$state5 === void 0 ? void 0 : _location$state5.role) === "FSM_DSO" ? t("ES_ERROR_DSO_LOGIN") : "User not registered.");
            }
          });
        } else {
          return Promise.resolve(sendOtp({
            otp: _extends({}, data, TYPE_REGISTER)
          })).then(function (_ref3) {
            var res = _ref3[0],
              err = _ref3[1];
            if (!err) {
              setCanSubmitNo(true);
              history.replace(path + "/otp", {
                from: getFromLocation(location.state, searchParams)
              });
              return;
            }
            setCanSubmitNo(true);
          });
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var selectName = function selectName(name) {
    try {
      var data = _extends({}, params, {
        tenantId: stateCode,
        userType: getUserType()
      }, name);
      setParmas(_extends({}, params, name));
      setCanSubmitName(true);
      return Promise.resolve(sendOtp({
        otp: _extends({}, data, TYPE_REGISTER)
      })).then(function (_ref4) {
        var res = _ref4[0],
          err = _ref4[1];
        if (res) {
          setCanSubmitName(false);
          history.replace(path + "/otp", {
            from: getFromLocation(location.state, searchParams)
          });
        } else {
          setCanSubmitName(false);
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var selectOtp = function selectOtp() {
    try {
      return Promise.resolve(_catch(function () {
        setIsOtpValid(true);
        setCanSubmitOtp(false);
        var mobileNumber = params.mobileNumber,
          otp = params.otp,
          name = params.name;
        return function () {
          if (isUserRegistered) {
            var requestData = {
              username: mobileNumber,
              password: otp,
              tenantId: stateCode,
              userType: getUserType()
            };
            return Promise.resolve(Digit.UserService.authenticate(requestData)).then(function (_ref5) {
              var _location$state6, _window4, _window4$globalConfig;
              var ResponseInfo = _ref5.ResponseInfo,
                info = _ref5.UserRequest,
                tokens = _objectWithoutPropertiesLoose(_ref5, _excluded);
              if ((_location$state6 = location.state) !== null && _location$state6 !== void 0 && _location$state6.role) {
                var roleInfo = info.roles.find(function (userRole) {
                  return userRole.code === location.state.role;
                });
                if (!roleInfo || !roleInfo.code) {
                  setError(t("ES_ERROR_USER_NOT_PERMITTED"));
                  setTimeout(function () {
                    return history.replace(DEFAULT_REDIRECT_URL);
                  }, 5000);
                  return;
                }
              }
              if ((_window4 = window) !== null && _window4 !== void 0 && (_window4$globalConfig = _window4.globalConfigs) !== null && _window4$globalConfig !== void 0 && _window4$globalConfig.getConfig("ENABLE_SINGLEINSTANCE")) {
                info.tenantId = Digit.ULBService.getStateId();
              }
              setUser(_extends({
                info: info
              }, tokens));
            });
          } else {
            var _temp2 = function () {
              if (!isUserRegistered) {
                var _requestData = {
                  name: name,
                  username: mobileNumber,
                  otpReference: otp,
                  tenantId: stateCode
                };
                return Promise.resolve(Digit.UserService.registerUser(_requestData, stateCode)).then(function (_ref6) {
                  var _window5, _window5$globalConfig;
                  var ResponseInfo = _ref6.ResponseInfo,
                    info = _ref6.UserRequest,
                    tokens = _objectWithoutPropertiesLoose(_ref6, _excluded2);
                  if ((_window5 = window) !== null && _window5 !== void 0 && (_window5$globalConfig = _window5.globalConfigs) !== null && _window5$globalConfig !== void 0 && _window5$globalConfig.getConfig("ENABLE_SINGLEINSTANCE")) {
                    info.tenantId = Digit.ULBService.getStateId();
                  }
                  setUser(_extends({
                    info: info
                  }, tokens));
                });
              }
            }();
            if (_temp2 && _temp2.then) return _temp2.then(function () {});
          }
        }();
      }, function () {
        setCanSubmitOtp(true);
        setIsOtpValid(false);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var resendOtp = function resendOtp() {
    try {
      var mobileNumber = params.mobileNumber;
      var data = {
        mobileNumber: mobileNumber,
        tenantId: stateCode,
        userType: getUserType()
      };
      var _temp4 = function () {
        if (!isUserRegistered) {
          return Promise.resolve(sendOtp({
            otp: _extends({}, data, TYPE_REGISTER)
          })).then(function () {});
        } else {
          var _temp5 = function () {
            if (isUserRegistered) {
              return Promise.resolve(sendOtp({
                otp: _extends({}, data, TYPE_LOGIN)
              })).then(function () {});
            }
          }();
          if (_temp5 && _temp5.then) return _temp5.then(function () {});
        }
      }();
      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var sendOtp = function sendOtp(data) {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(Digit.UserService.sendOtp(data, stateCode)).then(function (res) {
        return [res, null];
      });
    }, function (err) {
      return [null, err];
    }));
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: "citizen-form-wrapper"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.AppContainer, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React__default.createElement(SelectMobileNumber, {
    onSelect: selectMobileNumber,
    config: stepItems[0],
    mobileNumber: params.mobileNumber || "",
    onMobileChange: handleMobileChange,
    canSubmit: canSubmitNo,
    showRegisterLink: isUserRegistered && !((_location$state7 = location.state) !== null && _location$state7 !== void 0 && _location$state7.role),
    t: t
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/otp"
  }, /*#__PURE__*/React__default.createElement(SelectOtp, {
    config: _extends({}, stepItems[1], {
      texts: _extends({}, stepItems[1].texts, {
        cardText: stepItems[1].texts.cardText + " " + (params.mobileNumber || "")
      })
    }),
    onOtpChange: handleOtpChange,
    onResend: resendOtp,
    onSelect: selectOtp,
    otp: params.otp,
    error: isOtpValid,
    canSubmit: canSubmitOtp,
    t: t
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/name"
  }, /*#__PURE__*/React__default.createElement(SelectName, {
    config: stepItems[2],
    onSelect: selectName,
    t: t,
    isDisabled: canSubmitName
  })), error && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: true,
    label: error,
    onClose: function onClose() {
      return setError(null);
    }
  }))));
};

var isHTMLElement = function isHTMLElement(value) {
  return value instanceof HTMLElement;
};
var EVENTS = {
  BLUR: 'blur',
  CHANGE: 'change',
  INPUT: 'input'
};
var VALIDATION_MODE = {
  onBlur: 'onBlur',
  onChange: 'onChange',
  onSubmit: 'onSubmit',
  onTouched: 'onTouched',
  all: 'all'
};
var SELECT = 'select';
var UNDEFINED = 'undefined';
var INPUT_VALIDATION_RULES = {
  max: 'max',
  min: 'min',
  maxLength: 'maxLength',
  minLength: 'minLength',
  pattern: 'pattern',
  required: 'required',
  validate: 'validate'
};
function attachEventListeners(_ref, shouldAttachChangeEvent, handleChange) {
  var ref = _ref.ref;
  if (isHTMLElement(ref) && handleChange) {
    ref.addEventListener(shouldAttachChangeEvent ? EVENTS.CHANGE : EVENTS.INPUT, handleChange);
    ref.addEventListener(EVENTS.BLUR, handleChange);
  }
}
var isNullOrUndefined = function isNullOrUndefined(value) {
  return value == null;
};
var isObjectType = function isObjectType(value) {
  return typeof value === 'object';
};
var isObject = function isObject(value) {
  return !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !(value instanceof Date);
};
var isKey = function isKey(value) {
  return /^\w*$/.test(value);
};
var compact = function compact(value) {
  return value.filter(Boolean);
};
var stringToPath = function stringToPath(input) {
  return compact(input.replace(/["|']/g, '').replace(/\[/g, '.').replace(/\]/g, '').split('.'));
};
function set(object, path, value) {
  var index = -1;
  var tempPath = isKey(path) ? [path] : stringToPath(path);
  var length = tempPath.length;
  var lastIndex = length - 1;
  while (++index < length) {
    var key = tempPath[index];
    var newValue = value;
    if (index !== lastIndex) {
      var objValue = object[key];
      newValue = isObject(objValue) || Array.isArray(objValue) ? objValue : !isNaN(+tempPath[index + 1]) ? [] : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
}
var transformToNestObject = function transformToNestObject(data, value) {
  if (value === void 0) {
    value = {};
  }
  for (var key in data) {
    !isKey(key) ? set(value, key, data[key]) : value[key] = data[key];
  }
  return value;
};
var isUndefined = function isUndefined(val) {
  return val === undefined;
};
var _get = function get(obj, path, defaultValue) {
  if (obj === void 0) {
    obj = {};
  }
  var result = compact(path.split(/[,[\].]+?/)).reduce(function (result, key) {
    return isNullOrUndefined(result) ? result : result[key];
  }, obj);
  return isUndefined(result) || result === obj ? isUndefined(obj[path]) ? defaultValue : obj[path] : result;
};
var focusOnErrorField = function focusOnErrorField(fields, fieldErrors) {
  for (var key in fields) {
    if (_get(fieldErrors, key)) {
      var field = fields[key];
      if (field) {
        if (field.ref.focus && isUndefined(field.ref.focus())) {
          break;
        } else if (field.options) {
          field.options[0].ref.focus();
          break;
        }
      }
    }
  }
};
var removeAllEventListeners = function removeAllEventListeners(ref, validateWithStateUpdate) {
  if (isHTMLElement(ref) && ref.removeEventListener) {
    ref.removeEventListener(EVENTS.INPUT, validateWithStateUpdate);
    ref.removeEventListener(EVENTS.CHANGE, validateWithStateUpdate);
    ref.removeEventListener(EVENTS.BLUR, validateWithStateUpdate);
  }
};
var defaultReturn = {
  isValid: false,
  value: null
};
var getRadioValue = function getRadioValue(options) {
  return Array.isArray(options) ? options.reduce(function (previous, option) {
    return option && option.ref.checked ? {
      isValid: true,
      value: option.ref.value
    } : previous;
  }, defaultReturn) : defaultReturn;
};
var getMultipleSelectValue = function getMultipleSelectValue(options) {
  return [].concat(options).filter(function (_ref2) {
    var selected = _ref2.selected;
    return selected;
  }).map(function (_ref3) {
    var value = _ref3.value;
    return value;
  });
};
var isRadioInput = function isRadioInput(element) {
  return element.type === 'radio';
};
var isFileInput = function isFileInput(element) {
  return element.type === 'file';
};
var isCheckBoxInput = function isCheckBoxInput(element) {
  return element.type === 'checkbox';
};
var isMultipleSelect = function isMultipleSelect(element) {
  return element.type === SELECT + "-multiple";
};
var defaultResult = {
  value: false,
  isValid: false
};
var validResult = {
  value: true,
  isValid: true
};
var getCheckboxValue = function getCheckboxValue(options) {
  if (Array.isArray(options)) {
    if (options.length > 1) {
      var values = options.filter(function (option) {
        return option && option.ref.checked;
      }).map(function (_ref4) {
        var value = _ref4.ref.value;
        return value;
      });
      return {
        value: values,
        isValid: !!values.length
      };
    }
    var _options$0$ref = options[0].ref,
      checked = _options$0$ref.checked,
      value = _options$0$ref.value,
      attributes = _options$0$ref.attributes;
    return checked ? attributes && !isUndefined(attributes.value) ? isUndefined(value) || value === '' ? validResult : {
      value: value,
      isValid: true
    } : validResult : defaultResult;
  }
  return defaultResult;
};
function getFieldValue(fieldsRef, name, shallowFieldsStateRef, excludeDisabled, shouldKeepRawValue) {
  var field = fieldsRef.current[name];
  if (field) {
    var _field$ref = field.ref,
      value = _field$ref.value,
      disabled = _field$ref.disabled,
      ref = field.ref,
      valueAsNumber = field.valueAsNumber,
      valueAsDate = field.valueAsDate,
      setValueAs = field.setValueAs;
    if (disabled && excludeDisabled) {
      return;
    }
    if (isFileInput(ref)) {
      return ref.files;
    }
    if (isRadioInput(ref)) {
      return getRadioValue(field.options).value;
    }
    if (isMultipleSelect(ref)) {
      return getMultipleSelectValue(ref.options);
    }
    if (isCheckBoxInput(ref)) {
      return getCheckboxValue(field.options).value;
    }
    return shouldKeepRawValue ? value : valueAsNumber ? value === '' ? NaN : +value : valueAsDate ? ref.valueAsDate : setValueAs ? setValueAs(value) : value;
  }
  if (shallowFieldsStateRef) {
    return _get(shallowFieldsStateRef.current, name);
  }
}
function isDetached(element) {
  if (!element) {
    return true;
  }
  if (!(element instanceof HTMLElement) || element.nodeType === Node.DOCUMENT_NODE) {
    return false;
  }
  return isDetached(element.parentNode);
}
var isEmptyObject = function isEmptyObject(value) {
  return isObject(value) && !Object.keys(value).length;
};
var isBoolean = function isBoolean(value) {
  return typeof value === 'boolean';
};
function baseGet(object, updatePath) {
  var length = updatePath.slice(0, -1).length;
  var index = 0;
  while (index < length) {
    object = isUndefined(object) ? index++ : object[updatePath[index++]];
  }
  return object;
}
function unset(object, path) {
  var updatePath = isKey(path) ? [path] : stringToPath(path);
  var childObject = updatePath.length == 1 ? object : baseGet(object, updatePath);
  var key = updatePath[updatePath.length - 1];
  var previousObjRef;
  if (childObject) {
    delete childObject[key];
  }
  for (var k = 0; k < updatePath.slice(0, -1).length; k++) {
    var index = -1;
    var objectRef = void 0;
    var currentPaths = updatePath.slice(0, -(k + 1));
    var currentPathsLength = currentPaths.length - 1;
    if (k > 0) {
      previousObjRef = object;
    }
    while (++index < currentPaths.length) {
      var item = currentPaths[index];
      objectRef = objectRef ? objectRef[item] : object[item];
      if (currentPathsLength === index && (isObject(objectRef) && isEmptyObject(objectRef) || Array.isArray(objectRef) && !objectRef.filter(function (data) {
        return isObject(data) && !isEmptyObject(data) || isBoolean(data);
      }).length)) {
        previousObjRef ? delete previousObjRef[item] : delete object[item];
      }
      previousObjRef = objectRef;
    }
  }
  return object;
}
var isSameRef = function isSameRef(fieldValue, ref) {
  return fieldValue && fieldValue.ref === ref;
};
function findRemovedFieldAndRemoveListener(fieldsRef, handleChange, field, shallowFieldsStateRef, shouldUnregister, forceDelete) {
  var ref = field.ref,
    name = field.ref.name;
  var fieldRef = fieldsRef.current[name];
  if (!shouldUnregister) {
    var value = getFieldValue(fieldsRef, name, shallowFieldsStateRef);
    !isUndefined(value) && set(shallowFieldsStateRef.current, name, value);
  }
  if (!ref.type || !fieldRef) {
    delete fieldsRef.current[name];
    return;
  }
  if (isRadioInput(ref) || isCheckBoxInput(ref)) {
    if (Array.isArray(fieldRef.options) && fieldRef.options.length) {
      compact(fieldRef.options).forEach(function (option, index) {
        if (option === void 0) {
          option = {};
        }
        if (isDetached(option.ref) && isSameRef(option, option.ref) || forceDelete) {
          removeAllEventListeners(option.ref, handleChange);
          unset(fieldRef.options, "[" + index + "]");
        }
      });
      if (fieldRef.options && !compact(fieldRef.options).length) {
        delete fieldsRef.current[name];
      }
    } else {
      delete fieldsRef.current[name];
    }
  } else if (isDetached(ref) && isSameRef(fieldRef, ref) || forceDelete) {
    removeAllEventListeners(ref, handleChange);
    delete fieldsRef.current[name];
  }
}
var isPrimitive = function isPrimitive(value) {
  return isNullOrUndefined(value) || !isObjectType(value);
};
function deepMerge(target, source) {
  if (isPrimitive(target) || isPrimitive(source)) {
    return source;
  }
  for (var key in source) {
    var targetValue = target[key];
    var sourceValue = source[key];
    try {
      target[key] = isObject(targetValue) && isObject(sourceValue) || Array.isArray(targetValue) && Array.isArray(sourceValue) ? deepMerge(targetValue, sourceValue) : sourceValue;
    } catch (_a) {}
  }
  return target;
}
function deepEqual(object1, object2, isErrorObject) {
  if (isPrimitive(object1) || isPrimitive(object2) || object1 instanceof Date || object2 instanceof Date) {
    return object1 === object2;
  }
  if (!React.isValidElement(object1)) {
    var keys1 = Object.keys(object1);
    var keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (var _i = 0, _keys = keys1; _i < _keys.length; _i++) {
      var key = _keys[_i];
      var val1 = object1[key];
      if (!(isErrorObject && key === 'ref')) {
        var val2 = object2[key];
        if ((isObject(val1) || Array.isArray(val1)) && (isObject(val2) || Array.isArray(val2)) ? !deepEqual(val1, val2, isErrorObject) : val1 !== val2) {
          return false;
        }
      }
    }
  }
  return true;
}
function setDirtyFields(values, defaultValues, dirtyFields, parentNode, parentName) {
  var index = -1;
  while (++index < values.length) {
    for (var key in values[index]) {
      if (Array.isArray(values[index][key])) {
        !dirtyFields[index] && (dirtyFields[index] = {});
        dirtyFields[index][key] = [];
        setDirtyFields(values[index][key], _get(defaultValues[index] || {}, key, []), dirtyFields[index][key], dirtyFields[index], key);
      } else {
        var _Object$assign;
        deepEqual(_get(defaultValues[index] || {}, key), values[index][key]) ? set(dirtyFields[index] || {}, key) : dirtyFields[index] = Object.assign(Object.assign({}, dirtyFields[index]), (_Object$assign = {}, _Object$assign[key] = true, _Object$assign));
      }
    }
    parentNode && !dirtyFields.length && delete parentNode[parentName];
  }
  return dirtyFields;
}
var setFieldArrayDirtyFields = function setFieldArrayDirtyFields(values, defaultValues, dirtyFields) {
  return deepMerge(setDirtyFields(values, defaultValues, dirtyFields.slice(0, values.length)), setDirtyFields(defaultValues, values, dirtyFields.slice(0, values.length)));
};
var isString = function isString(value) {
  return typeof value === 'string';
};
var getFieldsValues = function getFieldsValues(fieldsRef, shallowFieldsState, shouldUnregister, excludeDisabled, search) {
  var output = {};
  var _loop = function _loop(name) {
    if (isUndefined(search) || (isString(search) ? name.startsWith(search) : Array.isArray(search) && search.find(function (data) {
      return name.startsWith(data);
    }))) {
      output[name] = getFieldValue(fieldsRef, name, undefined, excludeDisabled);
    }
  };
  for (var name in fieldsRef.current) {
    _loop(name);
  }
  return shouldUnregister ? transformToNestObject(output) : deepMerge(shallowFieldsState, transformToNestObject(output));
};
var isErrorStateChanged = function isErrorStateChanged(_ref5) {
  var errors = _ref5.errors,
    name = _ref5.name,
    error = _ref5.error,
    validFields = _ref5.validFields,
    fieldsWithValidation = _ref5.fieldsWithValidation;
  var isValid = isUndefined(error);
  var previousError = _get(errors, name);
  return isValid && !!previousError || !isValid && !deepEqual(previousError, error, true) || isValid && _get(fieldsWithValidation, name) && !_get(validFields, name);
};
var isRegex = function isRegex(value) {
  return value instanceof RegExp;
};
var getValueAndMessage = function getValueAndMessage(validationData) {
  return isObject(validationData) && !isRegex(validationData) ? validationData : {
    value: validationData,
    message: ''
  };
};
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
var isMessage = function isMessage(value) {
  return isString(value) || React.isValidElement(value);
};
function getValidateError(result, ref, type) {
  if (type === void 0) {
    type = 'validate';
  }
  if (isMessage(result) || isBoolean(result) && !result) {
    return {
      type: type,
      message: isMessage(result) ? result : '',
      ref: ref
    };
  }
}
var appendErrors = function appendErrors(name, validateAllFieldCriteria, errors, type, message) {
  var _Object$assign2;
  return validateAllFieldCriteria ? Object.assign(Object.assign({}, errors[name]), {
    types: Object.assign(Object.assign({}, errors[name] && errors[name].types ? errors[name].types : {}), (_Object$assign2 = {}, _Object$assign2[type] = message || true, _Object$assign2))
  }) : {};
};
var validateField = function validateField(fieldsRef, validateAllFieldCriteria, _ref6, shallowFieldsStateRef) {
  var ref = _ref6.ref,
    value = _ref6.ref.value,
    options = _ref6.options,
    required = _ref6.required,
    maxLength = _ref6.maxLength,
    minLength = _ref6.minLength,
    min = _ref6.min,
    max = _ref6.max,
    pattern = _ref6.pattern,
    validate = _ref6.validate;
  try {
    var _exit = false;
    var name = ref.name;
    var error = {};
    var isRadio = isRadioInput(ref);
    var isCheckBox = isCheckBoxInput(ref);
    var isRadioOrCheckbox = isRadio || isCheckBox;
    var isEmpty = value === '';
    var appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
    var getMinMaxMessage = function getMinMaxMessage(exceedMax, maxLengthMessage, minLengthMessage, maxType, minType) {
      if (maxType === void 0) {
        maxType = INPUT_VALIDATION_RULES.maxLength;
      }
      if (minType === void 0) {
        minType = INPUT_VALIDATION_RULES.minLength;
      }
      var message = exceedMax ? maxLengthMessage : minLengthMessage;
      error[name] = Object.assign({
        type: exceedMax ? maxType : minType,
        message: message,
        ref: ref
      }, exceedMax ? appendErrorsCurry(maxType, message) : appendErrorsCurry(minType, message));
    };
    if (required && (!isRadio && !isCheckBox && (isEmpty || isNullOrUndefined(value)) || isBoolean(value) && !value || isCheckBox && !getCheckboxValue(options).isValid || isRadio && !getRadioValue(options).isValid)) {
      var _ref7 = isMessage(required) ? {
          value: !!required,
          message: required
        } : getValueAndMessage(required),
        _value = _ref7.value,
        message = _ref7.message;
      if (_value) {
        error[name] = Object.assign({
          type: INPUT_VALIDATION_RULES.required,
          message: message,
          ref: isRadioOrCheckbox ? ((fieldsRef.current[name].options || [])[0] || {}).ref : ref
        }, appendErrorsCurry(INPUT_VALIDATION_RULES.required, message));
        if (!validateAllFieldCriteria) {
          return Promise.resolve(error);
        }
      }
    }
    if ((!isNullOrUndefined(min) || !isNullOrUndefined(max)) && value !== '') {
      var exceedMax;
      var exceedMin;
      var maxOutput = getValueAndMessage(max);
      var minOutput = getValueAndMessage(min);
      if (!isNaN(value)) {
        var valueNumber = ref.valueAsNumber || parseFloat(value);
        if (!isNullOrUndefined(maxOutput.value)) {
          exceedMax = valueNumber > maxOutput.value;
        }
        if (!isNullOrUndefined(minOutput.value)) {
          exceedMin = valueNumber < minOutput.value;
        }
      } else {
        var valueDate = ref.valueAsDate || new Date(value);
        if (isString(maxOutput.value)) {
          exceedMax = valueDate > new Date(maxOutput.value);
        }
        if (isString(minOutput.value)) {
          exceedMin = valueDate < new Date(minOutput.value);
        }
      }
      if (exceedMax || exceedMin) {
        getMinMaxMessage(!!exceedMax, maxOutput.message, minOutput.message, INPUT_VALIDATION_RULES.max, INPUT_VALIDATION_RULES.min);
        if (!validateAllFieldCriteria) {
          return Promise.resolve(error);
        }
      }
    }
    if (isString(value) && !isEmpty && (maxLength || minLength)) {
      var maxLengthOutput = getValueAndMessage(maxLength);
      var minLengthOutput = getValueAndMessage(minLength);
      var _exceedMax = !isNullOrUndefined(maxLengthOutput.value) && value.length > maxLengthOutput.value;
      var _exceedMin = !isNullOrUndefined(minLengthOutput.value) && value.length < minLengthOutput.value;
      if (_exceedMax || _exceedMin) {
        getMinMaxMessage(_exceedMax, maxLengthOutput.message, minLengthOutput.message);
        if (!validateAllFieldCriteria) {
          return Promise.resolve(error);
        }
      }
    }
    if (isString(value) && pattern && !isEmpty) {
      var _getValueAndMessage = getValueAndMessage(pattern),
        patternValue = _getValueAndMessage.value,
        _message = _getValueAndMessage.message;
      if (isRegex(patternValue) && !patternValue.test(value)) {
        error[name] = Object.assign({
          type: INPUT_VALIDATION_RULES.pattern,
          message: _message,
          ref: ref
        }, appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, _message));
        if (!validateAllFieldCriteria) {
          return Promise.resolve(error);
        }
      }
    }
    var _temp3 = function () {
      if (validate) {
        var fieldValue = getFieldValue(fieldsRef, name, shallowFieldsStateRef, false, true);
        var validateRef = isRadioOrCheckbox && options ? options[0].ref : ref;
        return function () {
          if (isFunction(validate)) {
            return Promise.resolve(validate(fieldValue)).then(function (result) {
              var validateError = getValidateError(result, validateRef);
              if (validateError) {
                error[name] = Object.assign(Object.assign({}, validateError), appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message));
                if (!validateAllFieldCriteria) {
                  _exit = true;
                  return error;
                }
              }
            });
          } else return function () {
            if (isObject(validate)) {
              var _temp2 = function _temp2() {
                if (!isEmptyObject(_validationResult)) {
                  error[name] = Object.assign({
                    ref: validateRef
                  }, _validationResult);
                  if (!validateAllFieldCriteria) {
                    _exit = true;
                    return error;
                  }
                }
              };
              var _interrupt = false;
              var _validationResult = {};
              var _temp = _forOf(Object.entries(validate), function (_ref8) {
                var key = _ref8[0],
                  validateFunction = _ref8[1];
                if (!isEmptyObject(_validationResult) && !validateAllFieldCriteria) {
                  _interrupt = true;
                  return;
                }
                return Promise.resolve(validateFunction(fieldValue)).then(function (validateResult) {
                  var validateError = getValidateError(validateResult, validateRef, key);
                  if (validateError) {
                    _validationResult = Object.assign(Object.assign({}, validateError), appendErrorsCurry(key, validateError.message));
                    if (validateAllFieldCriteria) {
                      error[name] = _validationResult;
                    }
                  }
                });
              }, function () {
                return _interrupt;
              });
              return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
            }
          }();
        }();
      }
    }();
    return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function (_result3) {
      return _exit ? _result3 : error;
    }) : _exit ? _temp3 : error);
  } catch (e) {
    return Promise.reject(e);
  }
};
var getPath = function getPath(rootPath, values, paths) {
  if (paths === void 0) {
    paths = [];
  }
  for (var property in values) {
    var rootName = rootPath + (isObject(values) ? "." + property : "[" + property + "]");
    isPrimitive(values[property]) ? paths.push(rootName) : getPath(rootName, values[property], paths);
  }
  return paths;
};
var assignWatchFields = function assignWatchFields(fieldValues, fieldName, watchFields, inputValue, isSingleField) {
  var value = undefined;
  watchFields.add(fieldName);
  if (!isEmptyObject(fieldValues)) {
    value = _get(fieldValues, fieldName);
    if (isObject(value) || Array.isArray(value)) {
      getPath(fieldName, value).forEach(function (name) {
        return watchFields.add(name);
      });
    }
  }
  return isUndefined(value) ? isSingleField ? inputValue : _get(inputValue, fieldName) : value;
};
var skipValidation = function skipValidation(_ref9) {
  var isOnBlur = _ref9.isOnBlur,
    isOnChange = _ref9.isOnChange,
    isOnTouch = _ref9.isOnTouch,
    isTouched = _ref9.isTouched,
    isReValidateOnBlur = _ref9.isReValidateOnBlur,
    isReValidateOnChange = _ref9.isReValidateOnChange,
    isBlurEvent = _ref9.isBlurEvent,
    isSubmitted = _ref9.isSubmitted,
    isOnAll = _ref9.isOnAll;
  if (isOnAll) {
    return false;
  } else if (!isSubmitted && isOnTouch) {
    return !(isTouched || isBlurEvent);
  } else if (isSubmitted ? isReValidateOnBlur : isOnBlur) {
    return !isBlurEvent;
  } else if (isSubmitted ? isReValidateOnChange : isOnChange) {
    return isBlurEvent;
  }
  return true;
};
var getFieldArrayParentName = function getFieldArrayParentName(name) {
  return name.substring(0, name.indexOf('['));
};
var isMatchFieldArrayName = function isMatchFieldArrayName(name, searchName) {
  return RegExp(("^" + searchName + "([|.)\\d+").replace(/\[/g, '\\[').replace(/\]/g, '\\]')).test(name);
};
var isNameInFieldArray = function isNameInFieldArray(names, name) {
  return [].concat(names).some(function (current) {
    return isMatchFieldArrayName(name, current);
  });
};
var isSelectInput = function isSelectInput(element) {
  return element.type === SELECT + "-one";
};
function onDomRemove(fieldsRef, removeFieldEventListenerAndRef) {
  var observer = new MutationObserver(function () {
    for (var _i2 = 0, _Object$values = Object.values(fieldsRef.current); _i2 < _Object$values.length; _i2++) {
      var field = _Object$values[_i2];
      if (field && field.options) {
        for (var _iterator = _createForOfIteratorHelperLoose(field.options), _step; !(_step = _iterator()).done;) {
          var option = _step.value;
          if (option && option.ref && isDetached(option.ref)) {
            removeFieldEventListenerAndRef(field);
          }
        }
      } else if (field && isDetached(field.ref)) {
        removeFieldEventListenerAndRef(field);
      }
    }
  });
  observer.observe(window.document, {
    childList: true,
    subtree: true
  });
  return observer;
}
var isWeb = typeof window !== UNDEFINED && typeof document !== UNDEFINED;
function cloneObject(data) {
  var _a;
  var copy;
  if (isPrimitive(data) || isWeb && (data instanceof File || isHTMLElement(data))) {
    return data;
  }
  if (!['Set', 'Map', 'Object', 'Date', 'Array'].includes((_a = data.constructor) === null || _a === void 0 ? void 0 : _a.name)) {
    return data;
  }
  if (data instanceof Date) {
    copy = new Date(data.getTime());
    return copy;
  }
  if (data instanceof Set) {
    copy = new Set();
    for (var _iterator2 = _createForOfIteratorHelperLoose(data), _step2; !(_step2 = _iterator2()).done;) {
      var item = _step2.value;
      copy.add(item);
    }
    return copy;
  }
  if (data instanceof Map) {
    copy = new Map();
    for (var _iterator3 = _createForOfIteratorHelperLoose(data.keys()), _step3; !(_step3 = _iterator3()).done;) {
      var key = _step3.value;
      copy.set(key, cloneObject(data.get(key)));
    }
    return copy;
  }
  copy = Array.isArray(data) ? [] : {};
  for (var _key in data) {
    copy[_key] = cloneObject(data[_key]);
  }
  return copy;
}
var modeChecker = function modeChecker(mode) {
  return {
    isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
    isOnBlur: mode === VALIDATION_MODE.onBlur,
    isOnChange: mode === VALIDATION_MODE.onChange,
    isOnAll: mode === VALIDATION_MODE.all,
    isOnTouch: mode === VALIDATION_MODE.onTouched
  };
};
var isRadioOrCheckboxFunction = function isRadioOrCheckboxFunction(ref) {
  return isRadioInput(ref) || isCheckBoxInput(ref);
};
var isWindowUndefined = typeof window === UNDEFINED;
var isProxyEnabled = isWeb ? 'Proxy' in window : typeof Proxy !== UNDEFINED;
function useForm(_temp4) {
  var _ref10 = _temp4 === void 0 ? {} : _temp4,
    _ref10$mode = _ref10.mode,
    mode = _ref10$mode === void 0 ? VALIDATION_MODE.onSubmit : _ref10$mode,
    _ref10$reValidateMode = _ref10.reValidateMode,
    reValidateMode = _ref10$reValidateMode === void 0 ? VALIDATION_MODE.onChange : _ref10$reValidateMode,
    resolver = _ref10.resolver,
    context = _ref10.context,
    _ref10$defaultValues = _ref10.defaultValues,
    defaultValues = _ref10$defaultValues === void 0 ? {} : _ref10$defaultValues,
    _ref10$shouldFocusErr = _ref10.shouldFocusError,
    shouldFocusError = _ref10$shouldFocusErr === void 0 ? true : _ref10$shouldFocusErr,
    _ref10$shouldUnregist = _ref10.shouldUnregister,
    shouldUnregister = _ref10$shouldUnregist === void 0 ? true : _ref10$shouldUnregist,
    criteriaMode = _ref10.criteriaMode;
  var fieldsRef = React.useRef({});
  var fieldArrayDefaultValuesRef = React.useRef({});
  var fieldArrayValuesRef = React.useRef({});
  var watchFieldsRef = React.useRef(new Set());
  var useWatchFieldsRef = React.useRef({});
  var useWatchRenderFunctionsRef = React.useRef({});
  var fieldsWithValidationRef = React.useRef({});
  var validFieldsRef = React.useRef({});
  var defaultValuesRef = React.useRef(defaultValues);
  var isUnMount = React.useRef(false);
  var isWatchAllRef = React.useRef(false);
  var handleChangeRef = React.useRef();
  var shallowFieldsStateRef = React.useRef({});
  var resetFieldArrayFunctionRef = React.useRef({});
  var contextRef = React.useRef(context);
  var resolverRef = React.useRef(resolver);
  var fieldArrayNamesRef = React.useRef(new Set());
  var modeRef = React.useRef(modeChecker(mode));
  var _modeRef$current = modeRef.current,
    isOnSubmit = _modeRef$current.isOnSubmit,
    isOnTouch = _modeRef$current.isOnTouch;
  var isValidateAllFieldCriteria = criteriaMode === VALIDATION_MODE.all;
  var _useState = React.useState({
      isDirty: false,
      isValidating: false,
      dirtyFields: {},
      isSubmitted: false,
      submitCount: 0,
      touched: {},
      isSubmitting: false,
      isSubmitSuccessful: false,
      isValid: !isOnSubmit,
      errors: {}
    }),
    formState = _useState[0],
    setFormState = _useState[1];
  var readFormStateRef = React.useRef({
    isDirty: !isProxyEnabled,
    dirtyFields: !isProxyEnabled,
    touched: !isProxyEnabled || isOnTouch,
    isValidating: !isProxyEnabled,
    isSubmitting: !isProxyEnabled,
    isValid: !isProxyEnabled
  });
  var formStateRef = React.useRef(formState);
  var observerRef = React.useRef();
  var _useRef$current = React.useRef(modeChecker(reValidateMode)).current,
    isReValidateOnBlur = _useRef$current.isOnBlur,
    isReValidateOnChange = _useRef$current.isOnChange;
  contextRef.current = context;
  resolverRef.current = resolver;
  formStateRef.current = formState;
  shallowFieldsStateRef.current = shouldUnregister ? {} : isEmptyObject(shallowFieldsStateRef.current) ? cloneObject(defaultValues) : shallowFieldsStateRef.current;
  var updateFormState = React.useCallback(function (state) {
    if (state === void 0) {
      state = {};
    }
    if (!isUnMount.current) {
      formStateRef.current = Object.assign(Object.assign({}, formStateRef.current), state);
      setFormState(formStateRef.current);
    }
  }, []);
  var updateIsValidating = function updateIsValidating() {
    return readFormStateRef.current.isValidating && updateFormState({
      isValidating: true
    });
  };
  var shouldRenderBaseOnError = React.useCallback(function (name, error, shouldRender, state, isValid) {
    if (shouldRender === void 0) {
      shouldRender = false;
    }
    if (state === void 0) {
      state = {};
    }
    var shouldReRender = shouldRender || isErrorStateChanged({
      errors: formStateRef.current.errors,
      error: error,
      name: name,
      validFields: validFieldsRef.current,
      fieldsWithValidation: fieldsWithValidationRef.current
    });
    var previousError = _get(formStateRef.current.errors, name);
    if (error) {
      unset(validFieldsRef.current, name);
      shouldReRender = shouldReRender || !previousError || !deepEqual(previousError, error, true);
      set(formStateRef.current.errors, name, error);
    } else {
      if (_get(fieldsWithValidationRef.current, name) || resolverRef.current) {
        set(validFieldsRef.current, name, true);
        shouldReRender = shouldReRender || previousError;
      }
      unset(formStateRef.current.errors, name);
    }
    if (shouldReRender && !isNullOrUndefined(shouldRender) || !isEmptyObject(state) || readFormStateRef.current.isValidating) {
      updateFormState(Object.assign(Object.assign(Object.assign({}, state), resolverRef.current ? {
        isValid: !!isValid
      } : {}), {
        isValidating: false
      }));
    }
  }, []);
  var setFieldValue = React.useCallback(function (name, rawValue) {
    var _fieldsRef$current$na = fieldsRef.current[name],
      ref = _fieldsRef$current$na.ref,
      options = _fieldsRef$current$na.options;
    var value = isWeb && isHTMLElement(ref) && isNullOrUndefined(rawValue) ? '' : rawValue;
    if (isRadioInput(ref)) {
      (options || []).forEach(function (_ref11) {
        var radioRef = _ref11.ref;
        return radioRef.checked = radioRef.value === value;
      });
    } else if (isFileInput(ref) && !isString(value)) {
      ref.files = value;
    } else if (isMultipleSelect(ref)) {
      [].concat(ref.options).forEach(function (selectRef) {
        return selectRef.selected = value.includes(selectRef.value);
      });
    } else if (isCheckBoxInput(ref) && options) {
      options.length > 1 ? options.forEach(function (_ref12) {
        var checkboxRef = _ref12.ref;
        return checkboxRef.checked = Array.isArray(value) ? !!value.find(function (data) {
          return data === checkboxRef.value;
        }) : value === checkboxRef.value;
      }) : options[0].ref.checked = !!value;
    } else {
      ref.value = value;
    }
  }, []);
  var isFormDirty = React.useCallback(function (name, data) {
    if (readFormStateRef.current.isDirty) {
      var formValues = getValues();
      name && data && set(formValues, name, data);
      return !deepEqual(formValues, defaultValuesRef.current);
    }
    return false;
  }, []);
  var updateAndGetDirtyState = React.useCallback(function (name, shouldRender) {
    if (shouldRender === void 0) {
      shouldRender = true;
    }
    if (readFormStateRef.current.isDirty || readFormStateRef.current.dirtyFields) {
      var isFieldDirty = !deepEqual(_get(defaultValuesRef.current, name), getFieldValue(fieldsRef, name, shallowFieldsStateRef));
      var isDirtyFieldExist = _get(formStateRef.current.dirtyFields, name);
      var previousIsDirty = formStateRef.current.isDirty;
      isFieldDirty ? set(formStateRef.current.dirtyFields, name, true) : unset(formStateRef.current.dirtyFields, name);
      var state = {
        isDirty: isFormDirty(),
        dirtyFields: formStateRef.current.dirtyFields
      };
      var isChanged = readFormStateRef.current.isDirty && previousIsDirty !== state.isDirty || readFormStateRef.current.dirtyFields && isDirtyFieldExist !== _get(formStateRef.current.dirtyFields, name);
      isChanged && shouldRender && updateFormState(state);
      return isChanged ? state : {};
    }
    return {};
  }, []);
  var executeValidation = React.useCallback(function (name, skipReRender) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        if (!fieldsRef.current[name]) {
          console.warn('📋 Field is missing with `name` attribute: ', name);
          return Promise.resolve(false);
        }
      }
      return Promise.resolve(validateField(fieldsRef, isValidateAllFieldCriteria, fieldsRef.current[name], shallowFieldsStateRef)).then(function (_validateField) {
        var error = _validateField[name];
        shouldRenderBaseOnError(name, error, skipReRender);
        return isUndefined(error);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, [shouldRenderBaseOnError, isValidateAllFieldCriteria]);
  var executeSchemaOrResolverValidation = React.useCallback(function (names) {
    try {
      return Promise.resolve(resolverRef.current(getValues(), contextRef.current, isValidateAllFieldCriteria)).then(function (_ref13) {
        var errors = _ref13.errors;
        var previousFormIsValid = formStateRef.current.isValid;
        if (Array.isArray(names)) {
          var isInputsValid = names.map(function (name) {
            var error = _get(errors, name);
            error ? set(formStateRef.current.errors, name, error) : unset(formStateRef.current.errors, name);
            return !error;
          }).every(Boolean);
          updateFormState({
            isValid: isEmptyObject(errors),
            isValidating: false
          });
          return isInputsValid;
        } else {
          var error = _get(errors, names);
          shouldRenderBaseOnError(names, error, previousFormIsValid !== isEmptyObject(errors), {}, isEmptyObject(errors));
          return !error;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, [shouldRenderBaseOnError, isValidateAllFieldCriteria]);
  var trigger = React.useCallback(function (name) {
    try {
      var _temp6 = function _temp6(_result4) {
        return _exit2 ? _result4 : Promise.resolve(executeValidation(fields));
      };
      var _exit2 = false;
      var fields = name || Object.keys(fieldsRef.current);
      updateIsValidating();
      if (resolverRef.current) {
        return Promise.resolve(executeSchemaOrResolverValidation(fields));
      }
      var _temp5 = function () {
        if (Array.isArray(fields)) {
          !name && (formStateRef.current.errors = {});
          return Promise.resolve(Promise.all(fields.map(function (data) {
            try {
              return Promise.resolve(executeValidation(data, null));
            } catch (e) {
              return Promise.reject(e);
            }
          }))).then(function (result) {
            updateFormState({
              isValidating: false
            });
            var _result$every = result.every(Boolean);
            _exit2 = true;
            return _result$every;
          });
        }
      }();
      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5));
    } catch (e) {
      return Promise.reject(e);
    }
  }, [executeSchemaOrResolverValidation, executeValidation]);
  var setInternalValues = React.useCallback(function (name, value, _ref14) {
    var shouldDirty = _ref14.shouldDirty,
      shouldValidate = _ref14.shouldValidate;
    var data = {};
    set(data, name, value);
    for (var _iterator4 = _createForOfIteratorHelperLoose(getPath(name, value)), _step4; !(_step4 = _iterator4()).done;) {
      var fieldName = _step4.value;
      if (fieldsRef.current[fieldName]) {
        setFieldValue(fieldName, _get(data, fieldName));
        shouldDirty && updateAndGetDirtyState(fieldName);
        shouldValidate && trigger(fieldName);
      }
    }
  }, [trigger, setFieldValue, updateAndGetDirtyState]);
  var setInternalValue = React.useCallback(function (name, value, config) {
    !shouldUnregister && !isPrimitive(value) && set(shallowFieldsStateRef.current, name, Array.isArray(value) ? [].concat(value) : Object.assign({}, value));
    if (fieldsRef.current[name]) {
      setFieldValue(name, value);
      config.shouldDirty && updateAndGetDirtyState(name);
      config.shouldValidate && trigger(name);
    } else if (!isPrimitive(value)) {
      setInternalValues(name, value, config);
      if (fieldArrayNamesRef.current.has(name)) {
        var _resetFieldArrayFunct;
        var parentName = getFieldArrayParentName(name) || name;
        set(fieldArrayDefaultValuesRef.current, name, value);
        resetFieldArrayFunctionRef.current[parentName]((_resetFieldArrayFunct = {}, _resetFieldArrayFunct[parentName] = _get(fieldArrayDefaultValuesRef.current, parentName), _resetFieldArrayFunct));
        if ((readFormStateRef.current.isDirty || readFormStateRef.current.dirtyFields) && config.shouldDirty) {
          var _Object$assign3;
          set(formStateRef.current.dirtyFields, name, setFieldArrayDirtyFields(value, _get(defaultValuesRef.current, name, []), _get(formStateRef.current.dirtyFields, name, [])));
          updateFormState({
            isDirty: !deepEqual(Object.assign(Object.assign({}, getValues()), (_Object$assign3 = {}, _Object$assign3[name] = value, _Object$assign3)), defaultValuesRef.current)
          });
        }
      }
    }
    !shouldUnregister && set(shallowFieldsStateRef.current, name, value);
  }, [updateAndGetDirtyState, setFieldValue, setInternalValues]);
  var isFieldWatched = function isFieldWatched(name) {
    return isWatchAllRef.current || watchFieldsRef.current.has(name) || watchFieldsRef.current.has((name.match(/\w+/) || [])[0]);
  };
  var renderWatchedInputs = function renderWatchedInputs(name) {
    var found = true;
    if (!isEmptyObject(useWatchFieldsRef.current)) {
      for (var key in useWatchFieldsRef.current) {
        if (!name || !useWatchFieldsRef.current[key].size || useWatchFieldsRef.current[key].has(name) || useWatchFieldsRef.current[key].has(getFieldArrayParentName(name))) {
          useWatchRenderFunctionsRef.current[key]();
          found = false;
        }
      }
    }
    return found;
  };
  function setValue(name, value, config) {
    setInternalValue(name, value, config || {});
    isFieldWatched(name) && updateFormState();
    renderWatchedInputs(name);
  }
  handleChangeRef.current = handleChangeRef.current ? handleChangeRef.current : function (_ref15) {
    var type = _ref15.type,
      target = _ref15.target;
    try {
      var name = target.name;
      var field = fieldsRef.current[name];
      var error;
      var isValid;
      return Promise.resolve(function () {
        if (field) {
          var _temp8 = function _temp8() {
            !_isBlurEvent && renderWatchedInputs(name);
            shouldRenderBaseOnError(name, error, _shouldRender, _state, isValid);
          };
          var _isBlurEvent = type === EVENTS.BLUR;
          var shouldSkipValidation = skipValidation(Object.assign({
            isBlurEvent: _isBlurEvent,
            isReValidateOnChange: isReValidateOnChange,
            isReValidateOnBlur: isReValidateOnBlur,
            isTouched: !!_get(formStateRef.current.touched, name),
            isSubmitted: formStateRef.current.isSubmitted
          }, modeRef.current));
          var _state = updateAndGetDirtyState(name, false);
          var _shouldRender = !isEmptyObject(_state) || !_isBlurEvent && isFieldWatched(name);
          if (_isBlurEvent && !_get(formStateRef.current.touched, name) && readFormStateRef.current.touched) {
            set(formStateRef.current.touched, name, true);
            _state = Object.assign(Object.assign({}, _state), {
              touched: formStateRef.current.touched
            });
          }
          if (!shouldUnregister && isCheckBoxInput(target)) {
            set(shallowFieldsStateRef.current, name, getFieldValue(fieldsRef, name));
          }
          if (shouldSkipValidation) {
            !_isBlurEvent && renderWatchedInputs(name);
            return (!isEmptyObject(_state) || _shouldRender && isEmptyObject(_state)) && updateFormState(_state);
          }
          updateIsValidating();
          var _temp7 = function () {
            if (resolverRef.current) {
              return Promise.resolve(resolverRef.current(getValues(), contextRef.current, isValidateAllFieldCriteria)).then(function (_ref16) {
                var errors = _ref16.errors;
                var previousFormIsValid = formStateRef.current.isValid;
                error = _get(errors, name);
                if (isCheckBoxInput(target) && !error && resolverRef.current) {
                  var parentNodeName = getFieldArrayParentName(name);
                  var currentError = _get(errors, parentNodeName, {});
                  currentError.type && currentError.message && (error = currentError);
                  if (parentNodeName && (currentError || _get(formStateRef.current.errors, parentNodeName))) {
                    name = parentNodeName;
                  }
                }
                isValid = isEmptyObject(errors);
                previousFormIsValid !== isValid && (_shouldRender = true);
              });
            } else {
              return Promise.resolve(validateField(fieldsRef, isValidateAllFieldCriteria, field, shallowFieldsStateRef)).then(function (_validateField2) {
                error = _validateField2[name];
              });
            }
          }();
          return _temp7 && _temp7.then ? _temp7.then(_temp8) : _temp8(_temp7);
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };
  function setFieldArrayDefaultValues(data) {
    if (!shouldUnregister) {
      var copy = cloneObject(data);
      for (var _iterator5 = _createForOfIteratorHelperLoose(fieldArrayNamesRef.current), _step5; !(_step5 = _iterator5()).done;) {
        var value = _step5.value;
        if (isKey(value) && !copy[value]) {
          var _Object$assign4;
          copy = Object.assign(Object.assign({}, copy), (_Object$assign4 = {}, _Object$assign4[value] = [], _Object$assign4));
        }
      }
      return copy;
    }
    return data;
  }
  function getValues(payload) {
    if (isString(payload)) {
      return getFieldValue(fieldsRef, payload, shallowFieldsStateRef);
    }
    if (Array.isArray(payload)) {
      var data = {};
      for (var _iterator6 = _createForOfIteratorHelperLoose(payload), _step6; !(_step6 = _iterator6()).done;) {
        var name = _step6.value;
        set(data, name, getFieldValue(fieldsRef, name, shallowFieldsStateRef));
      }
      return data;
    }
    return setFieldArrayDefaultValues(getFieldsValues(fieldsRef, cloneObject(shallowFieldsStateRef.current), shouldUnregister));
  }
  var validateResolver = React.useCallback(function (values) {
    if (values === void 0) {
      values = {};
    }
    try {
      var newDefaultValues = isEmptyObject(fieldsRef.current) ? defaultValuesRef.current : {};
      return Promise.resolve(resolverRef.current(Object.assign(Object.assign(Object.assign({}, newDefaultValues), getValues()), values), contextRef.current, isValidateAllFieldCriteria)).then(function (_ref17) {
        var errors = _ref17.errors;
        var isValid = isEmptyObject(errors);
        formStateRef.current.isValid !== isValid && updateFormState({
          isValid: isValid
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, [isValidateAllFieldCriteria]);
  var removeFieldEventListener = React.useCallback(function (field, forceDelete) {
    findRemovedFieldAndRemoveListener(fieldsRef, handleChangeRef.current, field, shallowFieldsStateRef, shouldUnregister, forceDelete);
    if (shouldUnregister) {
      unset(validFieldsRef.current, field.ref.name);
      unset(fieldsWithValidationRef.current, field.ref.name);
    }
  }, [shouldUnregister]);
  var updateWatchedValue = React.useCallback(function (name) {
    if (isWatchAllRef.current) {
      updateFormState();
    } else {
      for (var _iterator7 = _createForOfIteratorHelperLoose(watchFieldsRef.current), _step7; !(_step7 = _iterator7()).done;) {
        var watchField = _step7.value;
        if (watchField.startsWith(name)) {
          updateFormState();
          break;
        }
      }
      renderWatchedInputs(name);
    }
  }, []);
  var removeFieldEventListenerAndRef = React.useCallback(function (field, forceDelete) {
    if (field) {
      removeFieldEventListener(field, forceDelete);
      if (shouldUnregister && !compact(field.options || []).length) {
        unset(formStateRef.current.errors, field.ref.name);
        set(formStateRef.current.dirtyFields, field.ref.name, true);
        updateFormState({
          isDirty: isFormDirty()
        });
        readFormStateRef.current.isValid && resolverRef.current && validateResolver();
        updateWatchedValue(field.ref.name);
      }
    }
  }, [validateResolver, removeFieldEventListener]);
  function clearErrors(name) {
    name && (Array.isArray(name) ? name : [name]).forEach(function (inputName) {
      return fieldsRef.current[inputName] && isKey(inputName) ? delete formStateRef.current.errors[inputName] : unset(formStateRef.current.errors, inputName);
    });
    updateFormState({
      errors: name ? formStateRef.current.errors : {}
    });
  }
  function setError(name, error) {
    var ref = (fieldsRef.current[name] || {}).ref;
    set(formStateRef.current.errors, name, Object.assign(Object.assign({}, error), {
      ref: ref
    }));
    updateFormState({
      isValid: false
    });
    error.shouldFocus && ref && ref.focus && ref.focus();
  }
  var watchInternal = React.useCallback(function (fieldNames, defaultValue, watchId) {
    var watchFields = watchId ? useWatchFieldsRef.current[watchId] : watchFieldsRef.current;
    var fieldValues = getFieldsValues(fieldsRef, cloneObject(shallowFieldsStateRef.current), shouldUnregister, false, fieldNames);
    if (isString(fieldNames)) {
      var parentNodeName = getFieldArrayParentName(fieldNames) || fieldNames;
      if (fieldArrayNamesRef.current.has(parentNodeName)) {
        fieldValues = Object.assign(Object.assign({}, fieldArrayValuesRef.current), fieldValues);
      }
      return assignWatchFields(fieldValues, fieldNames, watchFields, isUndefined(_get(defaultValuesRef.current, fieldNames)) ? defaultValue : _get(defaultValuesRef.current, fieldNames), true);
    }
    var combinedDefaultValues = isUndefined(defaultValue) ? defaultValuesRef.current : defaultValue;
    if (Array.isArray(fieldNames)) {
      return fieldNames.reduce(function (previous, name) {
        var _Object$assign5;
        return Object.assign(Object.assign({}, previous), (_Object$assign5 = {}, _Object$assign5[name] = assignWatchFields(fieldValues, name, watchFields, combinedDefaultValues), _Object$assign5));
      }, {});
    }
    isWatchAllRef.current = isUndefined(watchId);
    return transformToNestObject(!isEmptyObject(fieldValues) && fieldValues || combinedDefaultValues);
  }, []);
  function watch(fieldNames, defaultValue) {
    return watchInternal(fieldNames, defaultValue);
  }
  function unregister(name) {
    for (var _iterator8 = _createForOfIteratorHelperLoose(Array.isArray(name) ? name : [name]), _step8; !(_step8 = _iterator8()).done;) {
      var fieldName = _step8.value;
      removeFieldEventListenerAndRef(fieldsRef.current[fieldName], true);
    }
  }
  function registerFieldRef(ref, options) {
    if (options === void 0) {
      options = {};
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!ref.name) {
        return console.warn('📋 Field is missing `name` attribute', ref, "https://react-hook-form.com/api#useForm");
      }
      if (fieldArrayNamesRef.current.has(ref.name.split(/\[\d+\]$/)[0]) && !RegExp(("^" + ref.name.split(/\[\d+\]$/)[0] + "[\\d+].\\w+").replace(/\[/g, '\\[').replace(/\]/g, '\\]')).test(ref.name)) {
        return console.warn('📋 `name` prop should be in object shape: name="test[index].name"', ref, 'https://react-hook-form.com/api#useFieldArray');
      }
    }
    var name = ref.name,
      type = ref.type,
      value = ref.value;
    var fieldRefAndValidationOptions = Object.assign({
      ref: ref
    }, options);
    var fields = fieldsRef.current;
    var isRadioOrCheckbox = isRadioOrCheckboxFunction(ref);
    var isFieldArray = isNameInFieldArray(fieldArrayNamesRef.current, name);
    var compareRef = function compareRef(currentRef) {
      return isWeb && (!isHTMLElement(ref) || currentRef === ref);
    };
    var field = fields[name];
    var isEmptyDefaultValue = true;
    var defaultValue;
    if (field && (isRadioOrCheckbox ? Array.isArray(field.options) && compact(field.options).find(function (option) {
      return value === option.ref.value && compareRef(option.ref);
    }) : compareRef(field.ref))) {
      fields[name] = Object.assign(Object.assign({}, field), options);
      return;
    }
    if (type) {
      field = isRadioOrCheckbox ? Object.assign({
        options: [].concat(compact(field && field.options || []), [{
          ref: ref
        }]),
        ref: {
          type: type,
          name: name
        }
      }, options) : Object.assign({}, fieldRefAndValidationOptions);
    } else {
      field = fieldRefAndValidationOptions;
    }
    fields[name] = field;
    var isEmptyUnmountFields = isUndefined(_get(shallowFieldsStateRef.current, name));
    if (!isEmptyObject(defaultValuesRef.current) || !isEmptyUnmountFields) {
      defaultValue = _get(isEmptyUnmountFields ? defaultValuesRef.current : shallowFieldsStateRef.current, name);
      isEmptyDefaultValue = isUndefined(defaultValue);
      if (!isEmptyDefaultValue && !isFieldArray) {
        setFieldValue(name, defaultValue);
      }
    }
    if (!isEmptyObject(options)) {
      set(fieldsWithValidationRef.current, name, true);
      if (!isOnSubmit && readFormStateRef.current.isValid) {
        validateField(fieldsRef, isValidateAllFieldCriteria, field, shallowFieldsStateRef).then(function (error) {
          var previousFormIsValid = formStateRef.current.isValid;
          isEmptyObject(error) ? set(validFieldsRef.current, name, true) : unset(validFieldsRef.current, name);
          previousFormIsValid !== isEmptyObject(error) && updateFormState();
        });
      }
    }
    if (shouldUnregister && !(isFieldArray && isEmptyDefaultValue)) {
      !isFieldArray && unset(formStateRef.current.dirtyFields, name);
    }
    if (type) {
      attachEventListeners(isRadioOrCheckbox && field.options ? field.options[field.options.length - 1] : field, isRadioOrCheckbox || isSelectInput(ref), handleChangeRef.current);
    }
  }
  function register(refOrRegisterOptions, options) {
    if (!isWindowUndefined) {
      if (isString(refOrRegisterOptions)) {
        registerFieldRef({
          name: refOrRegisterOptions
        }, options);
      } else if (isObject(refOrRegisterOptions) && 'name' in refOrRegisterOptions) {
        registerFieldRef(refOrRegisterOptions, options);
      } else {
        return function (ref) {
          return ref && registerFieldRef(ref, refOrRegisterOptions);
        };
      }
    }
  }
  var handleSubmit = React.useCallback(function (onValid, onInvalid) {
    return function (e) {
      try {
        if (e && e.preventDefault) {
          e.preventDefault();
          e.persist();
        }
        var fieldErrors = {};
        var fieldValues = setFieldArrayDefaultValues(getFieldsValues(fieldsRef, cloneObject(shallowFieldsStateRef.current), shouldUnregister, true));
        readFormStateRef.current.isSubmitting && updateFormState({
          isSubmitting: true
        });
        return Promise.resolve(_finallyRethrows(function () {
          function _temp13() {
            var _temp11 = function () {
              if (isEmptyObject(fieldErrors) && Object.keys(formStateRef.current.errors).every(function (name) {
                return name in fieldsRef.current;
              })) {
                updateFormState({
                  errors: {},
                  isSubmitting: true
                });
                return Promise.resolve(onValid(fieldValues, e)).then(function () {});
              } else {
                var _temp10 = function _temp10(_onInvalid) {
                  _onInvalid;
                  shouldFocusError && focusOnErrorField(fieldsRef.current, formStateRef.current.errors);
                };
                formStateRef.current.errors = Object.assign(Object.assign({}, formStateRef.current.errors), fieldErrors);
                return onInvalid ? Promise.resolve(onInvalid(formStateRef.current.errors, e)).then(_temp10) : _temp10(onInvalid);
              }
            }();
            if (_temp11 && _temp11.then) return _temp11.then(function () {});
          }
          var _temp12 = function () {
            if (resolverRef.current) {
              return Promise.resolve(resolverRef.current(fieldValues, contextRef.current, isValidateAllFieldCriteria)).then(function (_ref18) {
                var errors = _ref18.errors,
                  values = _ref18.values;
                formStateRef.current.errors = fieldErrors = errors;
                fieldValues = values;
              });
            } else {
              return _forOf(Object.values(fieldsRef.current), function (field) {
                var _temp9 = function () {
                  if (field) {
                    var name = field.ref.name;
                    return Promise.resolve(validateField(fieldsRef, isValidateAllFieldCriteria, field, shallowFieldsStateRef)).then(function (fieldError) {
                      if (fieldError[name]) {
                        set(fieldErrors, name, fieldError[name]);
                        unset(validFieldsRef.current, name);
                      } else if (_get(fieldsWithValidationRef.current, name)) {
                        unset(formStateRef.current.errors, name);
                        set(validFieldsRef.current, name, true);
                      }
                    });
                  }
                }();
                if (_temp9 && _temp9.then) return _temp9.then(function () {});
              });
            }
          }();
          return _temp12 && _temp12.then ? _temp12.then(_temp13) : _temp13(_temp12);
        }, function (_wasThrown, _result6) {
          formStateRef.current.isSubmitting = false;
          updateFormState({
            isSubmitted: true,
            isSubmitting: false,
            isSubmitSuccessful: isEmptyObject(formStateRef.current.errors),
            submitCount: formStateRef.current.submitCount + 1
          });
          if (_wasThrown) throw _result6;
          return _result6;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }, [shouldFocusError, isValidateAllFieldCriteria]);
  var resetRefs = function resetRefs(_ref19) {
    var errors = _ref19.errors,
      isDirty = _ref19.isDirty,
      isSubmitted = _ref19.isSubmitted,
      touched = _ref19.touched,
      isValid = _ref19.isValid,
      submitCount = _ref19.submitCount,
      dirtyFields = _ref19.dirtyFields;
    if (!isValid) {
      validFieldsRef.current = {};
      fieldsWithValidationRef.current = {};
    }
    fieldArrayDefaultValuesRef.current = {};
    watchFieldsRef.current = new Set();
    isWatchAllRef.current = false;
    updateFormState({
      submitCount: submitCount ? formStateRef.current.submitCount : 0,
      isDirty: isDirty ? formStateRef.current.isDirty : false,
      isSubmitted: isSubmitted ? formStateRef.current.isSubmitted : false,
      isValid: isValid ? formStateRef.current.isValid : false,
      dirtyFields: dirtyFields ? formStateRef.current.dirtyFields : {},
      touched: touched ? formStateRef.current.touched : {},
      errors: errors ? formStateRef.current.errors : {},
      isSubmitting: false,
      isSubmitSuccessful: false
    });
  };
  var reset = function reset(values, omitResetState) {
    if (omitResetState === void 0) {
      omitResetState = {};
    }
    if (isWeb) {
      for (var _i3 = 0, _Object$values2 = Object.values(fieldsRef.current); _i3 < _Object$values2.length; _i3++) {
        var field = _Object$values2[_i3];
        if (field) {
          var ref = field.ref,
            options = field.options;
          var inputRef = isRadioOrCheckboxFunction(ref) && Array.isArray(options) ? options[0].ref : ref;
          if (isHTMLElement(inputRef)) {
            try {
              inputRef.closest('form').reset();
              break;
            } catch (_a) {}
          }
        }
      }
    }
    fieldsRef.current = {};
    defaultValuesRef.current = Object.assign({}, values || defaultValuesRef.current);
    values && renderWatchedInputs('');
    Object.values(resetFieldArrayFunctionRef.current).forEach(function (resetFieldArray) {
      return isFunction(resetFieldArray) && resetFieldArray();
    });
    shallowFieldsStateRef.current = shouldUnregister ? {} : cloneObject(values || defaultValuesRef.current);
    resetRefs(omitResetState);
  };
  React.useEffect(function () {
    resolver && readFormStateRef.current.isValid && validateResolver();
    observerRef.current = observerRef.current || !isWeb ? observerRef.current : onDomRemove(fieldsRef, removeFieldEventListenerAndRef);
  }, [removeFieldEventListenerAndRef, defaultValuesRef.current]);
  React.useEffect(function () {
    return function () {
      observerRef.current && observerRef.current.disconnect();
      isUnMount.current = true;
      if (process.env.NODE_ENV !== 'production') {
        return;
      }
      Object.values(fieldsRef.current).forEach(function (field) {
        return removeFieldEventListenerAndRef(field, true);
      });
    };
  }, []);
  if (!resolver && readFormStateRef.current.isValid) {
    formState.isValid = deepEqual(validFieldsRef.current, fieldsWithValidationRef.current) && isEmptyObject(formStateRef.current.errors);
  }
  var commonProps = {
    trigger: trigger,
    setValue: React.useCallback(setValue, [setInternalValue, trigger]),
    getValues: React.useCallback(getValues, []),
    register: React.useCallback(register, [defaultValuesRef.current]),
    unregister: React.useCallback(unregister, []),
    formState: isProxyEnabled ? new Proxy(formState, {
      get: function get(obj, prop) {
        if (process.env.NODE_ENV !== 'production') {
          if (prop === 'isValid' && isOnSubmit) {
            console.warn('📋 `formState.isValid` is applicable with `onTouched`, `onChange` or `onBlur` mode. https://react-hook-form.com/api#formState');
          }
        }
        if (prop in obj) {
          readFormStateRef.current[prop] = true;
          return obj[prop];
        }
        return undefined;
      }
    }) : formState
  };
  var control = React.useMemo(function () {
    return Object.assign({
      isFormDirty: isFormDirty,
      updateWatchedValue: updateWatchedValue,
      shouldUnregister: shouldUnregister,
      updateFormState: updateFormState,
      removeFieldEventListener: removeFieldEventListener,
      watchInternal: watchInternal,
      mode: modeRef.current,
      reValidateMode: {
        isReValidateOnBlur: isReValidateOnBlur,
        isReValidateOnChange: isReValidateOnChange
      },
      validateResolver: resolver ? validateResolver : undefined,
      fieldsRef: fieldsRef,
      resetFieldArrayFunctionRef: resetFieldArrayFunctionRef,
      useWatchFieldsRef: useWatchFieldsRef,
      useWatchRenderFunctionsRef: useWatchRenderFunctionsRef,
      fieldArrayDefaultValuesRef: fieldArrayDefaultValuesRef,
      validFieldsRef: validFieldsRef,
      fieldsWithValidationRef: fieldsWithValidationRef,
      fieldArrayNamesRef: fieldArrayNamesRef,
      readFormStateRef: readFormStateRef,
      formStateRef: formStateRef,
      defaultValuesRef: defaultValuesRef,
      shallowFieldsStateRef: shallowFieldsStateRef,
      fieldArrayValuesRef: fieldArrayValuesRef
    }, commonProps);
  }, [defaultValuesRef.current, updateWatchedValue, shouldUnregister, removeFieldEventListener, watchInternal]);
  return Object.assign({
    watch: watch,
    control: control,
    handleSubmit: handleSubmit,
    reset: React.useCallback(reset, []),
    clearErrors: React.useCallback(clearErrors, []),
    setError: React.useCallback(setError, []),
    errors: formState.errors
  }, commonProps);
}
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}
var FormContext = React.createContext(null);
FormContext.displayName = 'RHFContext';
var useFormContext = function useFormContext() {
  return React.useContext(FormContext);
};
var getInputValue = function getInputValue(event) {
  return isPrimitive(event) || !isObject(event.target) || isObject(event.target) && !event.type ? event : isUndefined(event.target.value) ? event.target.checked : event.target.value;
};
function useController(_ref22) {
  var name = _ref22.name,
    rules = _ref22.rules,
    defaultValue = _ref22.defaultValue,
    control = _ref22.control,
    onFocus = _ref22.onFocus;
  var methods = useFormContext();
  if (process.env.NODE_ENV !== 'production') {
    if (!control && !methods) {
      throw new Error('📋 Controller is missing `control` prop. https://react-hook-form.com/api#Controller');
    }
  }
  var _ref23 = control || methods.control,
    defaultValuesRef = _ref23.defaultValuesRef,
    setValue = _ref23.setValue,
    register = _ref23.register,
    unregister = _ref23.unregister,
    trigger = _ref23.trigger,
    mode = _ref23.mode,
    _ref23$reValidateMode = _ref23.reValidateMode,
    isReValidateOnBlur = _ref23$reValidateMode.isReValidateOnBlur,
    isReValidateOnChange = _ref23$reValidateMode.isReValidateOnChange,
    formState = _ref23.formState,
    _ref23$formStateRef$c = _ref23.formStateRef.current,
    isSubmitted = _ref23$formStateRef$c.isSubmitted,
    touched = _ref23$formStateRef$c.touched,
    errors = _ref23$formStateRef$c.errors,
    updateFormState = _ref23.updateFormState,
    readFormStateRef = _ref23.readFormStateRef,
    fieldsRef = _ref23.fieldsRef,
    fieldArrayNamesRef = _ref23.fieldArrayNamesRef,
    shallowFieldsStateRef = _ref23.shallowFieldsStateRef;
  var isNotFieldArray = !isNameInFieldArray(fieldArrayNamesRef.current, name);
  var getInitialValue = function getInitialValue() {
    return !isUndefined(_get(shallowFieldsStateRef.current, name)) && isNotFieldArray ? _get(shallowFieldsStateRef.current, name) : isUndefined(defaultValue) ? _get(defaultValuesRef.current, name) : defaultValue;
  };
  var _useState3 = React.useState(getInitialValue()),
    value = _useState3[0],
    setInputStateValue = _useState3[1];
  var valueRef = React.useRef(value);
  var ref = React.useRef({
    focus: function focus() {
      return null;
    }
  });
  var onFocusRef = React.useRef(onFocus || function () {
    if (isFunction(ref.current.focus)) {
      ref.current.focus();
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!isFunction(ref.current.focus)) {
        console.warn("\uD83D\uDCCB 'ref' from Controller render prop must be attached to a React component or a DOM Element whose ref provides a 'focus()' method");
      }
    }
  });
  var shouldValidate = React.useCallback(function (isBlurEvent) {
    return !skipValidation(Object.assign({
      isBlurEvent: isBlurEvent,
      isReValidateOnBlur: isReValidateOnBlur,
      isReValidateOnChange: isReValidateOnChange,
      isSubmitted: isSubmitted,
      isTouched: !!_get(touched, name)
    }, mode));
  }, [isReValidateOnBlur, isReValidateOnChange, isSubmitted, touched, name, mode]);
  var commonTask = React.useCallback(function (_ref24) {
    var event = _ref24[0];
    var data = getInputValue(event);
    setInputStateValue(data);
    valueRef.current = data;
    return data;
  }, []);
  var registerField = React.useCallback(function (shouldUpdateValue) {
    if (process.env.NODE_ENV !== 'production') {
      if (!name) {
        return console.warn('📋 Field is missing `name` prop. https://react-hook-form.com/api#Controller');
      }
    }
    if (fieldsRef.current[name]) {
      fieldsRef.current[name] = Object.assign({
        ref: fieldsRef.current[name].ref
      }, rules);
    } else {
      register(Object.defineProperties({
        name: name,
        focus: onFocusRef.current
      }, {
        value: {
          set: function set(data) {
            setInputStateValue(data);
            valueRef.current = data;
          },
          get: function get() {
            return valueRef.current;
          }
        }
      }), rules);
      shouldUpdateValue = isUndefined(_get(defaultValuesRef.current, name));
    }
    shouldUpdateValue && isNotFieldArray && setInputStateValue(getInitialValue());
  }, [rules, name, register]);
  React.useEffect(function () {
    return function () {
      return unregister(name);
    };
  }, [name]);
  React.useEffect(function () {
    if (process.env.NODE_ENV !== 'production') {
      if (isUndefined(value)) {
        console.warn("\uD83D\uDCCB " + name + " is missing in the 'defaultValue' prop of either its Controller (https://react-hook-form.com/api#Controller) or useForm (https://react-hook-form.com/api#useForm)");
      }
      if (!isNotFieldArray && isUndefined(defaultValue)) {
        console.warn('📋 Controller is missing `defaultValue` prop when using `useFieldArray`. https://react-hook-form.com/api#Controller');
      }
    }
    registerField();
  }, [registerField]);
  React.useEffect(function () {
    !fieldsRef.current[name] && registerField(true);
  });
  var onBlur = React.useCallback(function () {
    if (readFormStateRef.current.touched && !_get(touched, name)) {
      set(touched, name, true);
      updateFormState({
        touched: touched
      });
    }
    shouldValidate(true) && trigger(name);
  }, [name, updateFormState, shouldValidate, trigger, readFormStateRef]);
  var onChange = React.useCallback(function () {
    for (var _len = arguments.length, event = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      event[_key2] = arguments[_key2];
    }
    return setValue(name, commonTask(event), {
      shouldValidate: shouldValidate(),
      shouldDirty: true
    });
  }, [setValue, name, shouldValidate]);
  return {
    field: {
      onChange: onChange,
      onBlur: onBlur,
      name: name,
      value: value,
      ref: ref
    },
    meta: Object.defineProperties({
      invalid: !!_get(errors, name)
    }, {
      isDirty: {
        get: function get() {
          return !!_get(formState.dirtyFields, name);
        }
      },
      isTouched: {
        get: function get() {
          return !!_get(formState.touched, name);
        }
      }
    })
  };
}
var Controller = function Controller(props) {
  var as = props.as,
    render = props.render,
    rest = __rest(props, ["rules", "as", "render", "defaultValue", "control", "onFocus"]);
  var _useController = useController(props),
    field = _useController.field,
    meta = _useController.meta;
  var componentProps = Object.assign(Object.assign({}, rest), field);
  return as ? React.isValidElement(as) ? React.cloneElement(as, componentProps) : React.createElement(as, componentProps) : render ? render(field, meta) : null;
};

var SearchFields = function SearchFields(_ref) {
  var control = _ref.control,
    t = _ref.t;
  var isMobile = window.Digit.Utils.browser.isMobile();
  return /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchField, {
    className: "pt-form-field"
  }, /*#__PURE__*/React__default.createElement("label", null, t("AUDIT_FROM_DATE_LABEL")), /*#__PURE__*/React__default.createElement(Controller, {
    render: function render(props) {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, {
        date: props.value,
        onChange: props.onChange
      });
    },
    name: "fromDate",
    control: control
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchField, {
    className: "pt-form-field"
  }, /*#__PURE__*/React__default.createElement("label", null, t("AUDIT_TO_DATE_LABEL")), /*#__PURE__*/React__default.createElement(Controller, {
    render: function render(props) {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, {
        date: props.value,
        onChange: props.onChange
      });
    },
    name: "toDate",
    control: control
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchField, {
    className: "pt-search-action-submit"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    style: {
      marginTop: isMobile ? "510px" : "25px",
      marginLeft: isMobile ? "0" : "-30px",
      maxWidth: isMobile ? "100%" : "240px"
    },
    label: t("ES_COMMON_APPLY"),
    submit: true
  })));
};

var _excluded$1 = ["currentlyActiveMobileModal", "searchFormFieldsComponentProps", "tenantId"],
  _excluded2$1 = ["currentlyActiveMobileModal", "searchFormFieldsComponentProps", "tenantId"];
var MobileSearchApplication = function MobileSearchApplication(_ref) {
  var _data$roles;
  var Controller = _ref.Controller,
    register = _ref.register,
    control = _ref.control,
    t = _ref.t,
    reset = _ref.reset,
    previousPage = _ref.previousPage,
    handleSubmit = _ref.handleSubmit,
    tenantId = _ref.tenantId,
    data = _ref.data,
    _onSubmit = _ref.onSubmit,
    isLoading = _ref.isLoading;
  function activateModal(state, action) {
    switch (action.type) {
      case "set":
        return action.payload;
      case "remove":
        return false;
    }
  }
  var _useState = React.useState([]),
    tabledata = _useState[0],
    settabledata = _useState[1];
  var DownloadBtn = function DownloadBtn(props) {
    return /*#__PURE__*/React__default.createElement("div", {
      onClick: props.onClick
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownloadBtnCommon, null));
  };
  var handleExcelDownload = function handleExcelDownload(tabData) {
    if ((tabData === null || tabData === void 0 ? void 0 : tabData[0]) !== undefined) {
      return Digit.Download.Excel(tabData === null || tabData === void 0 ? void 0 : tabData[0], "AuditReport");
    }
  };
  React.useEffect(function () {
    if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
      settabledata([data === null || data === void 0 ? void 0 : data.map(function (obj) {
        var returnObject = {};
        returnObject[t("AUDIT_DATE_LABEL")] = convertEpochToDate(obj === null || obj === void 0 ? void 0 : obj.timestamp);
        returnObject[t("AUDIT_TIME_LABEL")] = convertEpochToTimeInHours(obj === null || obj === void 0 ? void 0 : obj.timestamp);
        returnObject[t("AUDIT_DATAVIEWED_LABEL")] = (obj === null || obj === void 0 ? void 0 : obj.dataView[0]) + "," + (obj === null || obj === void 0 ? void 0 : obj.dataView[1]);
        returnObject[t("AUDIT_DATAVIEWED_BY_LABEL")] = obj === null || obj === void 0 ? void 0 : obj.dataViewedBy;
        returnObject[t("AUDIT_ROLE_LABEL")] = obj === null || obj === void 0 ? void 0 : obj.roles.map(function (obj) {
          return obj.name;
        }).join(",");
        return _extends({}, returnObject);
      })]);
    }
  }, [data]);
  var convertEpochToDate = function convertEpochToDate(dateEpoch) {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    var dateFromApi = new Date(dateEpoch);
    var month = dateFromApi.getMonth() + 1;
    var day = dateFromApi.getDate();
    var year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return day + "/" + month + "/" + year;
  };
  var convertEpochToTimeInHours = function convertEpochToTimeInHours(dateEpoch) {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    var dateFromApi = new Date(dateEpoch);
    var hour = dateFromApi.getHours();
    var min = dateFromApi.getMinutes();
    var period = hour > 12 ? "PM" : "AM";
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour > 9 ? "" : "0") + hour;
    min = (min > 9 ? "" : "0") + min;
    return hour + ":" + min + " " + period;
  };
  var _useReducer = React.useReducer(activateModal, false),
    currentlyActiveMobileModal = _useReducer[0],
    setActiveMobileModal = _useReducer[1];
  var closeMobilePopupModal = function closeMobilePopupModal() {
    setActiveMobileModal({
      type: "remove"
    });
  };
  var MobilePopUpCloseButton = function MobilePopUpCloseButton() {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "InboxMobilePopupCloseButtonWrapper",
      onClick: closeMobilePopupModal
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, null));
  };
  var searchFormFieldsComponentProps = {
    Controller: Controller,
    register: register,
    control: control,
    t: t,
    reset: reset,
    previousPage: previousPage
  };
  var MobileComponentDirectory = function MobileComponentDirectory(_ref2) {
    var currentlyActiveMobileModal = _ref2.currentlyActiveMobileModal,
      searchFormFieldsComponentProps = _ref2.searchFormFieldsComponentProps,
      tenantId = _ref2.tenantId,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded$1);
    var closeMobilePopupModal = props.closeMobilePopupModal;
    switch (currentlyActiveMobileModal) {
      case "SearchFormComponent":
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchForm, props, /*#__PURE__*/React__default.createElement(MobilePopUpCloseButton, null), /*#__PURE__*/React__default.createElement("div", {
          className: "MobilePopupHeadingWrapper"
        }, /*#__PURE__*/React__default.createElement("h2", null, t("PRIVACY_AUDIT_REPORT"), ":")), /*#__PURE__*/React__default.createElement(SearchFields, _extends({}, searchFormFieldsComponentProps, {
          closeMobilePopupModal: closeMobilePopupModal,
          tenantId: tenantId,
          t: t
        })));
      default:
        return /*#__PURE__*/React__default.createElement("span", null);
    }
  };
  var CurrentMobileModalComponent = React.useCallback(function (_ref3) {
    var currentlyActiveMobileModal = _ref3.currentlyActiveMobileModal,
      searchFormFieldsComponentProps = _ref3.searchFormFieldsComponentProps,
      tenantId = _ref3.tenantId,
      props = _objectWithoutPropertiesLoose(_ref3, _excluded2$1);
    return MobileComponentDirectory(_extends({
      currentlyActiveMobileModal: currentlyActiveMobileModal,
      searchFormFieldsComponentProps: searchFormFieldsComponentProps,
      tenantId: tenantId
    }, props));
  }, [currentlyActiveMobileModal]);
  data === null || data === void 0 ? void 0 : (_data$roles = data.roles) === null || _data$roles === void 0 ? void 0 : _data$roles.forEach(function (item) {
  });
  var propsMobileInboxCards = React.useMemo(function () {
    if (data !== null && data !== void 0 && data.display) {
      return [];
    }
    if (data === "") {
      return [];
    }
    return data === null || data === void 0 ? void 0 : data.map(function (data) {
      var _data$roles$slice, _ref4;
      return _ref4 = {}, _ref4[t("AUDIT_DATE_LABEL")] = convertEpochToDate(data.timestamp), _ref4[t("AUDIT_TIME_LABEL")] = convertEpochToTimeInHours(data.timestamp), _ref4[t("AUDIT_DATAVIEWED_LABEL")] = data.dataView[0] + "," + data.dataView[1], _ref4[t("AUDIT_DATAVIEWED_BY_LABEL")] = data.dataViewedBy, _ref4[t("AUDIT_ROLE_LABEL")] = (_data$roles$slice = data.roles.slice(0, 3)) === null || _data$roles$slice === void 0 ? void 0 : _data$roles$slice.map(function (e) {
        return e.name;
      }).join(","), _ref4;
    });
  }, [data]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null), /*#__PURE__*/React__default.createElement("div", {
    className: "sideContent",
    style: {
      marginLeft: "70%",
      marginTop: "-12%"
    }
  }, /*#__PURE__*/React__default.createElement(DownloadBtn, {
    className: "mrlg cursorPointer",
    onClick: function onClick() {
      return handleExcelDownload(tabledata);
    }
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("PRIVACY_AUDIT_REPORT"), ":"), /*#__PURE__*/React__default.createElement("div", {
    className: "searchBox"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchAction, {
    text: t("ES_COMMON_SEARCH"),
    handleActionClick: function handleActionClick() {
      return setActiveMobileModal({
        type: "set",
        payload: "SearchFormComponent"
      });
    },
    tenantId: tenantId,
    t: t
  })), currentlyActiveMobileModal ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.PopUp, null, /*#__PURE__*/React__default.createElement(CurrentMobileModalComponent, {
    onSubmit: function onSubmit(data) {
      setActiveMobileModal({
        type: "remove"
      });
      _onSubmit(data);
    },
    handleSubmit: handleSubmit,
    id: "search-form",
    className: "rm-mb form-field-flex-one inboxPopupMobileWrapper",
    searchFormFieldsComponentProps: searchFormFieldsComponentProps,
    currentlyActiveMobileModal: currentlyActiveMobileModal,
    closeMobilePopupModal: closeMobilePopupModal,
    tenantId: tenantId
  })) : null, isLoading && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.DetailsCard, {
    data: propsMobileInboxCards
  }));
};

var SearchApplication = function SearchApplication(_ref) {
  var tenantId = _ref.tenantId,
    t = _ref.t,
    onSubmit = _ref.onSubmit,
    data = _ref.data,
    count = _ref.count;
  var initialValues = Digit.SessionStorage.get("AUDIT_APPLICATION_DETAIL") || {
    offset: 0,
    limit: 5,
    sortOrder: "DESC"
  };
  var _useForm = useForm({
      defaultValues: initialValues
    }),
    register = _useForm.register,
    control = _useForm.control,
    handleSubmit = _useForm.handleSubmit,
    setValue = _useForm.setValue,
    getValues = _useForm.getValues,
    reset = _useForm.reset;
  var convertEpochToDate = function convertEpochToDate(dateEpoch) {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    var dateFromApi = new Date(dateEpoch);
    var month = dateFromApi.getMonth() + 1;
    var day = dateFromApi.getDate();
    var year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return day + "/" + month + "/" + year;
  };
  var convertEpochToTimeInHours = function convertEpochToTimeInHours(dateEpoch) {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    var dateFromApi = new Date(dateEpoch);
    var hour = dateFromApi.getHours();
    var min = dateFromApi.getMinutes();
    var period = hour > 12 ? "PM" : "AM";
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour > 9 ? "" : "0") + hour;
    min = (min > 9 ? "" : "0") + min;
    return hour + ":" + min + " " + period;
  };
  var _useState = React.useState([]),
    tabledata = _useState[0],
    settabledata = _useState[1];
  var DownloadBtn = function DownloadBtn(props) {
    return /*#__PURE__*/React__default.createElement("div", {
      onClick: props.onClick
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownloadBtnCommon, null));
  };
  var handleExcelDownload = function handleExcelDownload(tabData) {
    if ((tabData === null || tabData === void 0 ? void 0 : tabData[0]) !== undefined) {
      return Digit.Download.Excel(tabData === null || tabData === void 0 ? void 0 : tabData[0], "AuditReport");
    }
  };
  React.useEffect(function () {
    register("offset", 0);
    register("limit", 5);
    register("sortOrder", "DESC");
  }, [register]);
  React.useEffect(function () {
    if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
      settabledata([data === null || data === void 0 ? void 0 : data.map(function (obj) {
        var returnObject = {};
        returnObject[t("AUDIT_DATE_LABEL")] = convertEpochToDate(obj === null || obj === void 0 ? void 0 : obj.timestamp);
        returnObject[t("AUDIT_TIME_LABEL")] = convertEpochToTimeInHours(obj === null || obj === void 0 ? void 0 : obj.timestamp);
        returnObject[t("AUDIT_DATAVIEWED_LABEL")] = (obj === null || obj === void 0 ? void 0 : obj.dataView[0]) + "," + (obj === null || obj === void 0 ? void 0 : obj.dataView[1]);
        returnObject[t("AUDIT_DATAVIEWED_BY_LABEL")] = obj === null || obj === void 0 ? void 0 : obj.dataViewedBy;
        returnObject[t("AUDIT_ROLE_LABEL")] = obj === null || obj === void 0 ? void 0 : obj.roles.map(function (obj) {
          return obj.name;
        }).join(",");
        return _extends({}, returnObject);
      })]);
    }
  }, [data]);
  var onSort = React.useCallback(function (args) {
    if (args.length === 0) return;
    setValue("sortBy", args.id);
    setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);
  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  }
  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  }
  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    handleSubmit(onSubmit)();
  }
  var isMobile = window.Digit.Utils.browser.isMobile();
  if (isMobile) {
    return /*#__PURE__*/React__default.createElement(MobileSearchApplication, {
      Controller: Controller,
      register: register,
      control: control,
      t: t,
      reset: reset,
      previousPage: previousPage,
      handleSubmit: handleSubmit,
      tenantId: tenantId,
      data: data,
      onSubmit: onSubmit
    });
  }
  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React__default.createElement("span", {
      className: "cell-text"
    }, value);
  };
  var columns = React.useMemo(function () {
    return [{
      Header: t("AUDIT_DATE_LABEL"),
      disableSortBy: true,
      accessor: function accessor(row) {
        var timestamp = row.timestamp === "NA" ? t("WS_NA") : convertEpochToDate(row.timestamp);
        return GetCell("" + timestamp);
      }
    }, {
      Header: t("AUDIT_TIME_LABEL"),
      disableSortBy: true,
      accessor: function accessor(row) {
        var timestamp = row.timestamp === "NA" ? t("WS_NA") : convertEpochToTimeInHours(row.timestamp);
        return GetCell("" + timestamp);
      }
    }, {
      Header: isMobile ? t("AUDIT_DATAVIEWED_LABEL") : t("AUDIT_DATAVIEWED_PRIVACY"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell("" + (row === null || row === void 0 ? void 0 : row.dataView));
      }
    }, {
      Header: isMobile ? t("AUDIT_DATAVIEWED_BY_LABEL") : t("AUDIT_DATAVIEWED_BY_PRIVACY"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell("" + (row === null || row === void 0 ? void 0 : row.dataViewedBy));
      }
    }, {
      Header: t("AUDIT_ROLE_LABEL"),
      disableSortBy: true,
      accessor: function accessor(row) {
        var _row$roles$slice;
        return GetCell("" + (row === null || row === void 0 ? void 0 : (_row$roles$slice = row.roles.slice(0, 3)) === null || _row$roles$slice === void 0 ? void 0 : _row$roles$slice.map(function (e) {
          return e.name;
        })));
      }
    }];
  }, []);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginRight: "-70px"
    }
  }, " ", /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null), " "), /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginTop: "30px",
      marginLeft: "30px"
    }
  }, " ", /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("PRIVACY_AUDIT_REPORT")), " "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchForm, {
    className: "audit-card",
    onSubmit: onSubmit,
    handleSubmit: handleSubmit
  }, /*#__PURE__*/React__default.createElement(SearchFields, {
    register: register,
    control: control,
    reset: reset,
    tenantId: tenantId,
    t: t,
    previousPage: previousPage
  })), /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginTop: "240px",
      marginLeft: "-55%",
      maxWidth: "80%",
      marginRight: "52px"
    }
  }, data !== null && data !== void 0 && data.display ? /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginTop: "20x",
      width: "1025px",
      marginLeft: "25px",
      backgroundColor: "white",
      height: "60px"
    }
  }, t(data.display).split("\\n").map(function (text, index) {
    return /*#__PURE__*/React__default.createElement("p", {
      key: index,
      style: {
        textAlign: "center"
      }
    }, text);
  })) : data !== "" ? /*#__PURE__*/React__default.createElement("div", {
    style: {
      backgroundColor: "white",
      marginRight: "-30px",
      marginLeft: "30px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sideContent",
    style: {
      "float": "right",
      padding: "10px 30px"
    }
  }, /*#__PURE__*/React__default.createElement(DownloadBtn, {
    className: "mrlg cursorPointer",
    onClick: function onClick() {
      return handleExcelDownload(tabledata);
    }
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Table, {
    t: t,
    data: data,
    totalRecords: count,
    columns: columns,
    getCellProps: function getCellProps(cellInfo) {
      return {
        style: {
          minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
          padding: "20px 18px",
          fontSize: "16px"
        }
      };
    },
    onPageSizeChange: onPageSizeChange,
    currentPage: getValues("offset") / getValues("limit"),
    onNextPage: nextPage,
    onPrevPage: previousPage,
    manualPagination: false,
    pageSizeLimit: getValues("limit"),
    onSort: onSort,
    disableSort: false,
    sortParams: [{
      id: getValues("sortBy"),
      desc: getValues("sortOrder") === "DESC" ? true : false
    }]
  })) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null)));
};

var Search = function Search(_ref) {
  var _data$ElasticSearchDa, _data$ElasticSearchDa2;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var tenantId = Digit.ULBService.getCitizenCurrentTenant();
  var _useState = React.useState({}),
    payload = _useState[0],
    setPayload = _useState[1];
  var convertDateToEpoch = function convertDateToEpoch(dateString, dayStartOrEnd) {
    if (dayStartOrEnd === void 0) {
      dayStartOrEnd = "dayend";
    }
    try {
      var parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      var DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
      DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
      if (dayStartOrEnd === "dayend") {
        DateObj.setHours(DateObj.getHours() + 24);
        DateObj.setSeconds(DateObj.getSeconds() - 1);
      }
      return DateObj.getTime();
    } catch (e) {
      return dateString;
    }
  };
  function onSubmit(_data) {
    Digit.SessionStorage.set("AUDIT_APPLICATION_DETAIL", {
      offset: 0,
      limit: 5,
      sortBy: "commencementDate",
      sortOrder: "DESC"
    });
    var data = _extends({}, _data, {
      fromDate: convertDateToEpoch(_data === null || _data === void 0 ? void 0 : _data.fromDate),
      toDate: convertDateToEpoch(_data === null || _data === void 0 ? void 0 : _data.toDate)
    });
    setPayload(Object.keys(data).filter(function (k) {
      return data[k];
    }).reduce(function (acc, key) {
      var _extends2;
      return _extends({}, acc, (_extends2 = {}, _extends2[key] = typeof data[key] === "object" ? data[key] : data[key], _extends2));
    }, {}));
  }
  React.useEffect(function () {
    var storedPayload = Digit.SessionStorage.get("AUDIT_APPLICATION_DETAIL") || {};
    if (storedPayload) {
      var _data2 = _extends({}, storedPayload);
      setPayload(Object.keys(_data2).filter(function (k) {
        return _data2[k];
      }).reduce(function (acc, key) {
        var _extends3;
        return _extends({}, acc, (_extends3 = {}, _extends3[key] = typeof _data2[key] === "object" ? _data2[key].code : _data2[key], _extends3));
      }, {}));
    }
  }, []);
  var config = {
    enabled: !!(payload && Object.keys(payload).length > 0)
  };
  var newObj = _extends({}, payload);
  var _Digit$Hooks$useAudit = Digit.Hooks.useAudit({
      tenantId: tenantId,
      filters: _extends({}, newObj),
      config: config
    }),
    isLoading = _Digit$Hooks$useAudit.isLoading,
    data = _Digit$Hooks$useAudit.data;
  return /*#__PURE__*/React__default.createElement(SearchApplication, {
    t: t,
    tenantId: tenantId,
    onSubmit: onSubmit,
    data: !isLoading ? (data === null || data === void 0 ? void 0 : (_data$ElasticSearchDa = data.ElasticSearchData) === null || _data$ElasticSearchDa === void 0 ? void 0 : _data$ElasticSearchDa.length) > 0 ? data === null || data === void 0 ? void 0 : data.ElasticSearchData : {
      display: "ES_COMMON_NO_DATA"
    } : "",
    count: data === null || data === void 0 ? void 0 : (_data$ElasticSearchDa2 = data.ElasticSearchData) === null || _data$ElasticSearchDa2 === void 0 ? void 0 : _data$ElasticSearchDa2.length
  });
};

var StaticDynamicCard = function StaticDynamicCard(_ref) {
  var _mdmsData$MdmsRes$com, _mdmsData$MdmsRes$com2, _mdmsConfigResult$hel, _mdmsConfigResult$hel2, _mdmsConfigResult$hel3, _mdmsConfigResult$hel4, _mdmsConfigResult$hel5, _mdmsConfigResult$hel6, _staticData, _staticData2, _staticData3, _staticData4, _staticData5, _staticContent, _staticContent2, _staticContent3;
  var moduleCode = _ref.moduleCode;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var tenantId = Digit.ULBService.getCitizenCurrentTenant();
  var _Digit$Hooks$useStati = Digit.Hooks.useStaticData(Digit.ULBService.getStateId()),
    isMdmsLoading = _Digit$Hooks$useStati.isLoading,
    mdmsData = _Digit$Hooks$useStati.data;
  var _Digit$Hooks$useDynam = Digit.Hooks.useDynamicData({
      moduleCode: moduleCode,
      tenantId: tenantId,
      filters: {},
      t: t
    }),
    isSearchLoading = _Digit$Hooks$useDynam.isLoading,
    error = _Digit$Hooks$useDynam.error,
    dynamicData = _Digit$Hooks$useDynam.data;
  var handleClickOnWhatsApp = function handleClickOnWhatsApp(obj) {
    window.open(obj);
  };
  var IconComponent = function IconComponent(_ref2) {
    var module = _ref2.module,
      styles = _ref2.styles;
    switch (module) {
      case "TL":
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CaseIcon, {
          className: "fill-path-primary-main",
          styles: styles
        });
      case "PT":
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.PTIcon, {
          className: "fill-path-primary-main",
          styles: styles
        });
      case "MCOLLECT":
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.MCollectIcon, {
          className: "fill-path-primary-main",
          styles: styles
        });
      case "PGR":
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.ComplaintIcon, {
          className: "fill-path-primary-main",
          styles: styles
        });
      default:
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CaseIcon, {
          className: "fill-path-primary-main",
          styles: styles
        });
    }
  };
  var mdmsConfigResult = mdmsData === null || mdmsData === void 0 ? void 0 : (_mdmsData$MdmsRes$com = mdmsData.MdmsRes["common-masters"]) === null || _mdmsData$MdmsRes$com === void 0 ? void 0 : (_mdmsData$MdmsRes$com2 = _mdmsData$MdmsRes$com.StaticData[0]) === null || _mdmsData$MdmsRes$com2 === void 0 ? void 0 : _mdmsData$MdmsRes$com2["" + moduleCode];
  var StaticDataIconComponentOne = function StaticDataIconComponentOne(_ref3) {
    var module = _ref3.module;
    switch (module) {
      case "PT":
      case "WS":
        return /*#__PURE__*/React__default.createElement("span", {
          className: "timerIcon"
        }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TimerIcon, null));
      default:
        return null;
    }
  };
  var StaticDataIconComponentTwo = function StaticDataIconComponentTwo(_ref4) {
    var module = _ref4.module;
    switch (module) {
      case "PT":
        return /*#__PURE__*/React__default.createElement("span", {
          className: "rupeeSymbol"
        }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.RupeeSymbol, null));
      case "WS":
        return /*#__PURE__*/React__default.createElement("span", {
          className: "timerIcon"
        }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TimerIcon, null));
      default:
        return null;
    }
  };
  var staticContent = function staticContent(module) {
    switch (module) {
      case "TL":
      case "PT":
      case "MCOLLECT":
        return {
          staticCommonContent: t("COMMON_VALIDITY"),
          validity: (mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.validity) + ((mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.validity) === "1" ? t("COMMON_DAY") : t("COMMON_DAYS"))
        };
      case "PGR":
        return {
          staticCommonContent: t("ACTION_TEST_COMPLAINT_TYPES")
        };
      case "OBPS":
        return {
          staticCommonContent: t("BUILDING_PLAN_PERMIT_VALIDITY"),
          validity: (mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.validity) + " " + ((mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.validity) === "1" ? t("COMMON_DAY") : t("COMMON_DAYS"))
        };
      default:
        return {
          staticCommonContent: ""
        };
    }
  };
  var staticData = function staticData(module) {
    switch (module) {
      case "PT":
        return {
          staticDataOne: (mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.staticDataOne) + " " + t("COMMON_DAYS"),
          staticDataOneHeader: t("APPLICATION_PROCESSING_TIME"),
          staticDataTwo: mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.staticDataTwo,
          staticDataTwoHeader: t("APPLICATION_PROCESSING_FEE")
        };
      case "WS":
        return {
          staticDataOne: "",
          staticDataOneHeader: t("PAY_WATER_CHARGES_BY") + " " + (mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.staticDataOne) + " " + t("COMMON_DAYS") + " " + t("OF_BILL_GEN_TO_AVOID_LATE_FEE"),
          staticDataTwo: (mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.staticDataTwo) + " " + t("COMMON_DAYS"),
          staticDataTwoHeader: t("APPLICATION_PROCESSING_TIME")
        };
      default:
        return {};
    }
  };
  if (isMdmsLoading || isSearchLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  return mdmsConfigResult ? /*#__PURE__*/React__default.createElement(React__default.Fragment, null, mdmsConfigResult && mdmsConfigResult !== null && mdmsConfigResult !== void 0 && mdmsConfigResult.payViaWhatsApp ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      margin: "16px",
      padding: "16px",
      maxWidth: "unset"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "pay-whatsapp-card",
    onClick: function onClick() {
      return handleClickOnWhatsApp(mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.payViaWhatsApp);
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "pay-whatsapp-text"
  }, t("PAY_VIA_WHATSAPP")), /*#__PURE__*/React__default.createElement("div", {
    className: "whatsAppIconG"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.WhatsappIconGreen, null)))) : null, mdmsConfigResult && mdmsConfigResult !== null && mdmsConfigResult !== void 0 && mdmsConfigResult.helpline ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      margin: "16px",
      padding: "16px",
      maxWidth: "unset"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "static-home-Card"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "static-home-Card-header"
  }, t("CALL_CENTER_HELPLINE")), /*#__PURE__*/React__default.createElement("div", {
    className: "helplineIcon"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.HelpLineIcon, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "call-center-card-text"
  }, mdmsConfigResult !== null && mdmsConfigResult !== void 0 && (_mdmsConfigResult$hel = mdmsConfigResult.helpline) !== null && _mdmsConfigResult$hel !== void 0 && _mdmsConfigResult$hel.contactOne ? /*#__PURE__*/React__default.createElement("div", {
    className: "call-center-card-content"
  }, /*#__PURE__*/React__default.createElement("a", {
    href: "tel:" + (mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : (_mdmsConfigResult$hel2 = mdmsConfigResult.helpline) === null || _mdmsConfigResult$hel2 === void 0 ? void 0 : _mdmsConfigResult$hel2.contactOne)
  }, mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : (_mdmsConfigResult$hel3 = mdmsConfigResult.helpline) === null || _mdmsConfigResult$hel3 === void 0 ? void 0 : _mdmsConfigResult$hel3.contactOne)) : null, mdmsConfigResult !== null && mdmsConfigResult !== void 0 && (_mdmsConfigResult$hel4 = mdmsConfigResult.helpline) !== null && _mdmsConfigResult$hel4 !== void 0 && _mdmsConfigResult$hel4.contactTwo ? /*#__PURE__*/React__default.createElement("div", {
    className: "call-center-card-content"
  }, /*#__PURE__*/React__default.createElement("a", {
    href: "tel:" + (mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : (_mdmsConfigResult$hel5 = mdmsConfigResult.helpline) === null || _mdmsConfigResult$hel5 === void 0 ? void 0 : _mdmsConfigResult$hel5.contactTwo)
  }, mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : (_mdmsConfigResult$hel6 = mdmsConfigResult.helpline) === null || _mdmsConfigResult$hel6 === void 0 ? void 0 : _mdmsConfigResult$hel6.contactTwo)) : null)) : null, mdmsConfigResult && mdmsConfigResult !== null && mdmsConfigResult !== void 0 && mdmsConfigResult.serviceCenter ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      margin: "16px",
      padding: "16px",
      maxWidth: "unset"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "static-home-Card"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "static-home-Card-header"
  }, t("CITIZEN_SERVICE_CENTER")), /*#__PURE__*/React__default.createElement("div", {
    className: "serviceCentrIcon"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ServiceCenterIcon, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "service-center-details-card"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "service-center-details-text"
  }, mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.serviceCenter)), mdmsConfigResult !== null && mdmsConfigResult !== void 0 && mdmsConfigResult.viewMapLocation ? /*#__PURE__*/React__default.createElement("div", {
    className: "link"
  }, /*#__PURE__*/React__default.createElement("a", {
    href: mdmsConfigResult === null || mdmsConfigResult === void 0 ? void 0 : mdmsConfigResult.viewMapLocation
  }, t("VIEW_ON_MAP"))) : null) : /*#__PURE__*/React__default.createElement("div", null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      margin: "16px",
      padding: "16px",
      maxWidth: "unset"
    }
  }, error || dynamicData == null || (dynamicData === null || dynamicData === void 0 ? void 0 : dynamicData.dynamicDataOne) === null ? /*#__PURE__*/React__default.createElement("div", null) : /*#__PURE__*/React__default.createElement("div", {
    className: "dynamicDataCard"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "dynamicData"
  }, /*#__PURE__*/React__default.createElement(IconComponent, {
    module: moduleCode,
    styles: {
      width: "24px",
      height: "24px"
    }
  }), /*#__PURE__*/React__default.createElement("span", {
    className: "dynamicData-content"
  }, dynamicData === null || dynamicData === void 0 ? void 0 : dynamicData.dynamicDataOne))), error || dynamicData == null || (dynamicData === null || dynamicData === void 0 ? void 0 : dynamicData.dynamicDataTwo) === null ? /*#__PURE__*/React__default.createElement("div", null) : /*#__PURE__*/React__default.createElement("div", {
    className: "dynamicDataCard"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "dynamicData"
  }, /*#__PURE__*/React__default.createElement(IconComponent, {
    module: moduleCode,
    styles: {
      width: "24px",
      height: "24px"
    }
  }), /*#__PURE__*/React__default.createElement("span", {
    className: "dynamicData-content"
  }, dynamicData === null || dynamicData === void 0 ? void 0 : dynamicData.dynamicDataTwo))), mdmsConfigResult && mdmsConfigResult !== null && mdmsConfigResult !== void 0 && mdmsConfigResult.staticDataOne ? /*#__PURE__*/React__default.createElement("div", {
    className: "staticDataCard"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "staticData"
  }, /*#__PURE__*/React__default.createElement(StaticDataIconComponentOne, {
    module: moduleCode
  }), /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content-first",
    style: {
      marginTop: ((_staticData = staticData(moduleCode)) === null || _staticData === void 0 ? void 0 : _staticData.staticDataOne) === "" ? "8px" : "unset"
    }
  }, (_staticData2 = staticData(moduleCode)) === null || _staticData2 === void 0 ? void 0 : _staticData2.staticDataOneHeader), /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content-second"
  }, "" + ((_staticData3 = staticData(moduleCode)) === null || _staticData3 === void 0 ? void 0 : _staticData3.staticDataOne))))) : /*#__PURE__*/React__default.createElement("div", null), mdmsConfigResult && mdmsConfigResult !== null && mdmsConfigResult !== void 0 && mdmsConfigResult.staticDataTwo ? /*#__PURE__*/React__default.createElement("div", {
    className: "staticDataCard"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "staticData"
  }, /*#__PURE__*/React__default.createElement(StaticDataIconComponentTwo, {
    module: moduleCode
  }), /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content-first"
  }, (_staticData4 = staticData(moduleCode)) === null || _staticData4 === void 0 ? void 0 : _staticData4.staticDataTwoHeader), /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content-second"
  }, (_staticData5 = staticData(moduleCode)) === null || _staticData5 === void 0 ? void 0 : _staticData5.staticDataTwo)))) : /*#__PURE__*/React__default.createElement("div", null), mdmsConfigResult && mdmsConfigResult !== null && mdmsConfigResult !== void 0 && mdmsConfigResult.validity ? /*#__PURE__*/React__default.createElement("div", {
    className: "staticDataCard"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "staticData"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "validityIcon"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ValidityTimeIcon, null)), /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content-first"
  }, (_staticContent = staticContent(moduleCode)) === null || _staticContent === void 0 ? void 0 : _staticContent.staticCommonContent), /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content-second"
  }, (_staticContent2 = staticContent(moduleCode)) === null || _staticContent2 === void 0 ? void 0 : _staticContent2.validity)))) : /*#__PURE__*/React__default.createElement("div", null), error || dynamicData == null || !(dynamicData !== null && dynamicData !== void 0 && dynamicData.staticData) || (dynamicData === null || dynamicData === void 0 ? void 0 : dynamicData.staticData) === null ? /*#__PURE__*/React__default.createElement("div", null) : /*#__PURE__*/React__default.createElement("div", {
    className: "staticDataCard"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "staticData"
  }, moduleCode === "PGR" ? /*#__PURE__*/React__default.createElement(IconComponent, {
    module: moduleCode,
    styles: {
      width: "24px",
      height: "24px",
      marginLeft: "13px",
      marginTop: "12px"
    }
  }) : /*#__PURE__*/React__default.createElement("span", {
    className: "validityIcon"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ValidityTimeIcon, null)), /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content-first"
  }, (_staticContent3 = staticContent(moduleCode)) === null || _staticContent3 === void 0 ? void 0 : _staticContent3.staticCommonContent), /*#__PURE__*/React__default.createElement("span", {
    className: "static-data-content-second"
  }, dynamicData === null || dynamicData === void 0 ? void 0 : dynamicData.staticData)))))) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

var _window$1, _window2, _window3, _window4, _window5;
var sidebarHiddenFor = [((_window$1 = window) === null || _window$1 === void 0 ? void 0 : _window$1.contextPath) + "/citizen/register/name", "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen/select-language", "/" + ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) + "/citizen/select-location", "/" + ((_window4 = window) === null || _window4 === void 0 ? void 0 : _window4.contextPath) + "/citizen/login", "/" + ((_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.contextPath) + "/citizen/register/otp"];
var getTenants = function getTenants(codes, tenants) {
  return tenants.filter(function (tenant) {
    return codes.map(function (item) {
      return item.code;
    }).includes(tenant.code);
  });
};
var Home$1 = function Home$1(_ref) {
  var _window7, _window7$globalConfig, _window7$globalConfig2;
  var stateInfo = _ref.stateInfo,
    userDetails = _ref.userDetails,
    CITIZEN = _ref.CITIZEN,
    cityDetails = _ref.cityDetails,
    mobileView = _ref.mobileView,
    handleUserDropdownSelection = _ref.handleUserDropdownSelection,
    logoUrl = _ref.logoUrl,
    stateCode = _ref.stateCode,
    modules = _ref.modules,
    appTenants = _ref.appTenants,
    pathname = _ref.pathname,
    initData = _ref.initData;
  var _Digit$Hooks$useCusto = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), "ACCESSCONTROL-ACTIONS-TEST", [{
      name: "actions-test",
      filter: "[?(@.url == '" + window.contextPath + "-card')]"
    }], {
      select: function select(data) {
        var _data$ACCESSCONTROLA, _data$ACCESSCONTROLA$;
        var formattedData = data === null || data === void 0 ? void 0 : (_data$ACCESSCONTROLA = data["ACCESSCONTROL-ACTIONS-TEST"]) === null || _data$ACCESSCONTROLA === void 0 ? void 0 : (_data$ACCESSCONTROLA$ = _data$ACCESSCONTROLA["actions-test"]) === null || _data$ACCESSCONTROLA$ === void 0 ? void 0 : _data$ACCESSCONTROLA$.filter(function (el) {
          return el.enabled === true;
        }).reduce(function (a, b) {
          var _a$b$parentModule;
          a[b.parentModule] = ((_a$b$parentModule = a[b.parentModule]) === null || _a$b$parentModule === void 0 ? void 0 : _a$b$parentModule.length) > 0 ? [b].concat(a[b.parentModule]) : [b];
          return a;
        }, {});
        return formattedData;
      }
    }),
    islinkDataLoading = _Digit$Hooks$useCusto.isLoading,
    linkData = _Digit$Hooks$useCusto.data,
    isLinkDataFetched = _Digit$Hooks$useCusto.isFetched;
  var classname = Digit.Hooks.useRouteSubscription(pathname);
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useRouteMatch = reactRouterDom.useRouteMatch(),
    path = _useRouteMatch.path;
  var history = reactRouterDom.useHistory();
  var hideSidebar = sidebarHiddenFor.some(function (e) {
    return window.location.href.includes(e);
  });
  var appRoutes = modules.map(function (_ref2, index) {
    var code = _ref2.code,
      tenants = _ref2.tenants;
    var Module = Digit.ComponentRegistryService.getComponent(code + "Module");
    return Module ? /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      key: index,
      path: path + "/" + code.toLowerCase()
    }, /*#__PURE__*/React__default.createElement(Module, {
      stateCode: stateCode,
      moduleCode: code,
      userType: "citizen",
      tenants: getTenants(tenants, appTenants)
    })) : null;
  });
  var ModuleLevelLinkHomePages = modules.map(function (_ref3, index) {
    var code = _ref3.code,
      bannerImage = _ref3.bannerImage;
    var Links = Digit.ComponentRegistryService.getComponent(code + "Links") || function () {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
    };
    var mdmsDataObj = isLinkDataFetched ? processLinkData(linkData, code, t) : undefined;
    if ((mdmsDataObj === null || mdmsDataObj === void 0 ? void 0 : mdmsDataObj.header) === "ACTION_TEST_WS") {
      mdmsDataObj === null || mdmsDataObj === void 0 ? void 0 : mdmsDataObj.links.sort(function (a, b) {
        return b.orderNumber - a.orderNumber;
      });
    }
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      key: index,
      path: path + "/" + code.toLowerCase() + "-home"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "moduleLinkHomePage"
    }, /*#__PURE__*/React__default.createElement("img", {
      src: bannerImage || (stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.bannerUrl),
      alt: "noimagefound"
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, {
      className: "moduleLinkHomePageBackButton"
    }), /*#__PURE__*/React__default.createElement("h1", null, t("MODULE_" + code.toUpperCase())), /*#__PURE__*/React__default.createElement("div", {
      className: "moduleLinkHomePageModuleLinks"
    }, mdmsDataObj && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenHomeCard, {
      header: t(mdmsDataObj === null || mdmsDataObj === void 0 ? void 0 : mdmsDataObj.header),
      links: mdmsDataObj === null || mdmsDataObj === void 0 ? void 0 : mdmsDataObj.links,
      Icon: function Icon() {
        return /*#__PURE__*/React__default.createElement("span", null);
      },
      Info: code === "OBPS" ? function () {
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenInfoLabel, {
          style: {
            margin: "0px",
            padding: "10px"
          },
          info: t("CS_FILE_APPLICATION_INFO_LABEL"),
          text: t("BPA_CITIZEN_HOME_STAKEHOLDER_INCLUDES_INFO_LABEL")
        });
      } : null,
      isInfo: code === "OBPS" ? true : false
    })), /*#__PURE__*/React__default.createElement(StaticDynamicCard, {
      moduleCode: code === null || code === void 0 ? void 0 : code.toUpperCase()
    }))), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      key: "faq" + index,
      path: path + "/" + code.toLowerCase() + "-faq"
    }, /*#__PURE__*/React__default.createElement(FAQsSection, {
      module: code === null || code === void 0 ? void 0 : code.toUpperCase()
    })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      key: "hiw" + index,
      path: path + "/" + code.toLowerCase() + "-how-it-works"
    }, /*#__PURE__*/React__default.createElement(HowItWorks, {
      module: code === null || code === void 0 ? void 0 : code.toUpperCase()
    })));
  });
  return /*#__PURE__*/React__default.createElement("div", {
    className: classname
  }, /*#__PURE__*/React__default.createElement(TopBarSideBar, {
    t: t,
    stateInfo: stateInfo,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl,
    showSidebar: true,
    linkData: linkData,
    islinkDataLoading: islinkDataLoading
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "main center-container citizen-home-container mb-25"
  }, hideSidebar ? null : /*#__PURE__*/React__default.createElement("div", {
    className: "SideBarStatic"
  }, /*#__PURE__*/React__default.createElement(StaticCitizenSideBar, {
    linkData: linkData,
    islinkDataLoading: islinkDataLoading
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: path
  }, /*#__PURE__*/React__default.createElement(Home, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: path + "/select-language"
  }, /*#__PURE__*/React__default.createElement(LanguageSelection, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: path + "/select-location"
  }, /*#__PURE__*/React__default.createElement(LocationSelection, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/error"
  }, /*#__PURE__*/React__default.createElement(ErrorComponent, {
    initData: initData,
    goToHome: function goToHome() {
      var _window6, _Digit, _Digit$UserService, _Digit$UserService$ge;
      history.push("/" + ((_window6 = window) === null || _window6 === void 0 ? void 0 : _window6.contextPath) + "/" + ((_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$UserService = _Digit.UserService) === null || _Digit$UserService === void 0 ? void 0 : (_Digit$UserService$ge = _Digit$UserService.getType) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.call(_Digit$UserService)));
    }
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/all-services"
  }, /*#__PURE__*/React__default.createElement(AppHome, {
    userType: "citizen",
    modules: modules,
    getCitizenMenu: linkData,
    fetchedCitizen: isLinkDataFetched,
    isLoading: islinkDataLoading
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/login"
  }, /*#__PURE__*/React__default.createElement(Login, {
    stateCode: stateCode
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/register"
  }, /*#__PURE__*/React__default.createElement(Login, {
    stateCode: stateCode,
    isUserRegistered: false
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/profile"
  }, /*#__PURE__*/React__default.createElement(UserProfile, {
    stateCode: stateCode,
    userType: "citizen",
    cityDetails: cityDetails
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/Audit"
  }, /*#__PURE__*/React__default.createElement(Search, null)), /*#__PURE__*/React__default.createElement(ErrorBoundary, {
    initData: initData
  }, appRoutes, ModuleLevelLinkHomePages))), /*#__PURE__*/React__default.createElement("div", {
    className: "citizen-home-footer",
    style: window.location.href.includes("citizen/obps") ? {
      zIndex: "-1"
    } : {}
  }, /*#__PURE__*/React__default.createElement("img", {
    alt: "Powered by DIGIT",
    src: (_window7 = window) === null || _window7 === void 0 ? void 0 : (_window7$globalConfig = _window7.globalConfigs) === null || _window7$globalConfig === void 0 ? void 0 : (_window7$globalConfig2 = _window7$globalConfig.getConfig) === null || _window7$globalConfig2 === void 0 ? void 0 : _window7$globalConfig2.call(_window7$globalConfig, "DIGIT_FOOTER"),
    style: {
      height: "1.2em",
      cursor: "pointer"
    },
    onClick: function onClick() {
      var _window8, _window8$globalConfig, _window8$globalConfig2;
      window.open((_window8 = window) === null || _window8 === void 0 ? void 0 : (_window8$globalConfig = _window8.globalConfigs) === null || _window8$globalConfig === void 0 ? void 0 : (_window8$globalConfig2 = _window8$globalConfig.getConfig) === null || _window8$globalConfig2 === void 0 ? void 0 : _window8$globalConfig2.call(_window8$globalConfig, "DIGIT_HOME_URL"), "_blank").focus();
    }
  })));
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var b = "function" === typeof Symbol && Symbol["for"],
  c = b ? Symbol["for"]("react.element") : 60103,
  d = b ? Symbol["for"]("react.portal") : 60106,
  e = b ? Symbol["for"]("react.fragment") : 60107,
  f = b ? Symbol["for"]("react.strict_mode") : 60108,
  g = b ? Symbol["for"]("react.profiler") : 60114,
  h = b ? Symbol["for"]("react.provider") : 60109,
  k = b ? Symbol["for"]("react.context") : 60110,
  l = b ? Symbol["for"]("react.async_mode") : 60111,
  m = b ? Symbol["for"]("react.concurrent_mode") : 60111,
  n = b ? Symbol["for"]("react.forward_ref") : 60112,
  p = b ? Symbol["for"]("react.suspense") : 60113,
  q = b ? Symbol["for"]("react.suspense_list") : 60120,
  r = b ? Symbol["for"]("react.memo") : 60115,
  t = b ? Symbol["for"]("react.lazy") : 60116,
  v = b ? Symbol["for"]("react.block") : 60121,
  w = b ? Symbol["for"]("react.fundamental") : 60117,
  x = b ? Symbol["for"]("react.responder") : 60118,
  y = b ? Symbol["for"]("react.scope") : 60119;
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
      var hasSymbol = typeof Symbol === 'function' && Symbol["for"];
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]('react.element') : 0xeac7;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol["for"]('react.portal') : 0xeaca;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol["for"]('react.fragment') : 0xeacb;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol["for"]('react.strict_mode') : 0xeacc;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol["for"]('react.profiler') : 0xead2;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol["for"]('react.provider') : 0xeacd;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol["for"]('react.context') : 0xeace;
      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol["for"]('react.async_mode') : 0xeacf;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol["for"]('react.concurrent_mode') : 0xeacf;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol["for"]('react.forward_ref') : 0xead0;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol["for"]('react.suspense') : 0xead1;
      var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol["for"]('react.suspense_list') : 0xead8;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol["for"]('react.memo') : 0xead3;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol["for"]('react.lazy') : 0xead4;
      var REACT_BLOCK_TYPE = hasSymbol ? Symbol["for"]('react.block') : 0xead9;
      var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol["for"]('react.fundamental') : 0xead5;
      var REACT_RESPONDER_TYPE = hasSymbol ? Symbol["for"]('react.responder') : 0xead6;
      var REACT_SCOPE_TYPE = hasSymbol ? Symbol["for"]('react.scope') : 0xead7;
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

var Background = function Background(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "banner banner-container"
  }, children);
};

var Header = function Header() {
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    storeData = _Digit$Hooks$useStore.data,
    isLoading = _Digit$Hooks$useStore.isLoading;
  var _ref = storeData || {},
    stateInfo = _ref.stateInfo;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  if (isLoading) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "bannerHeader"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: "bannerLogo",
    src: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.logoUrl
  }), /*#__PURE__*/React__default.createElement("p", null, t("TENANT_TENANTS_" + (stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.code.toUpperCase()))));
};

var ChangePasswordComponent = function ChangePasswordComponent(_ref) {
  var _window3, _window3$globalConfig, _window3$globalConfig2;
  var propsConfig = _ref.config,
    t = _ref.t;
  var _useState = React.useState(null),
    user = _useState[0];
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    mobileNumber = _Digit$Hooks$useQuery.mobile_number,
    tenantId = _Digit$Hooks$useQuery.tenantId;
  var history = reactRouterDom.useHistory();
  var _useState2 = React.useState(""),
    otp = _useState2[0],
    setOtp = _useState2[1];
  var _useState3 = React.useState(true),
    isOtpValid = _useState3[0];
  var _useState4 = React.useState(null),
    showToast = _useState4[0],
    setShowToast = _useState4[1];
  var getUserType = function getUserType() {
    return Digit.UserService.getType();
  };
  React.useEffect(function () {
    var _location$state, _window;
    if (!user) {
      Digit.UserService.setType("employee");
      return;
    }
    Digit.UserService.setUser(user);
    var redirectPath = ((_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.from) || "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee";
    history.replace(redirectPath);
  }, [user]);
  var closeToast = function closeToast() {
    setShowToast(null);
  };
  var onResendOTP = function onResendOTP() {
    try {
      var _temp2 = function _temp2() {
        setTimeout(closeToast, 5000);
      };
      var requestData = {
        otp: {
          mobileNumber: mobileNumber,
          userType: getUserType().toUpperCase(),
          type: "passwordreset",
          tenantId: tenantId
        }
      };
      var _temp = _catch(function () {
        return Promise.resolve(Digit.UserService.sendOtp(requestData, tenantId)).then(function () {
          setShowToast(t("ES_OTP_RESEND"));
        });
      }, function (err) {
        var _err$response, _err$response$data;
        setShowToast((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.error_description) || t("ES_INVALID_LOGIN_CREDENTIALS"));
      });
      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var onChangePassword = function onChangePassword(data) {
    try {
      return Promise.resolve(_catch(function () {
        if (data.newPassword !== data.confirmPassword) {
          return setShowToast(t("ERR_PASSWORD_DO_NOT_MATCH"));
        }
        var requestData = _extends({}, data, {
          otpReference: otp,
          tenantId: tenantId,
          type: getUserType().toUpperCase()
        });
        return Promise.resolve(Digit.UserService.changePassword(requestData, tenantId)).then(function (response) {
          navigateToLogin();
        });
      }, function (err) {
        var _err$response2, _err$response2$data, _err$response2$data$e, _err$response2$data$e2, _err$response2$data$e3;
        setShowToast((err === null || err === void 0 ? void 0 : (_err$response2 = err.response) === null || _err$response2 === void 0 ? void 0 : (_err$response2$data = _err$response2.data) === null || _err$response2$data === void 0 ? void 0 : (_err$response2$data$e = _err$response2$data.error) === null || _err$response2$data$e === void 0 ? void 0 : (_err$response2$data$e2 = _err$response2$data$e.fields) === null || _err$response2$data$e2 === void 0 ? void 0 : (_err$response2$data$e3 = _err$response2$data$e2[0]) === null || _err$response2$data$e3 === void 0 ? void 0 : _err$response2$data$e3.message) || t("ES_SOMETHING_WRONG"));
        setTimeout(closeToast, 5000);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var navigateToLogin = function navigateToLogin() {
    var _window2;
    history.replace("/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/employee/user/login");
  };
  var _propsConfig$inputs = propsConfig.inputs,
    username = _propsConfig$inputs[0],
    password = _propsConfig$inputs[1],
    confirmPassword = _propsConfig$inputs[2];
  var config = [{
    body: [{
      label: t(username.label),
      type: username.type,
      populators: {
        name: username.name
      },
      isMandatory: true
    }, {
      label: t(password.label),
      type: password.type,
      populators: {
        name: password.name
      },
      isMandatory: true
    }, {
      label: t(confirmPassword.label),
      type: confirmPassword.type,
      populators: {
        name: confirmPassword.name
      },
      isMandatory: true
    }]
  }];
  return /*#__PURE__*/React__default.createElement(Background, null, /*#__PURE__*/React__default.createElement("div", {
    className: "employeeBackbuttonAlign"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, {
    variant: "white",
    style: {
      borderBottom: "none"
    }
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    onSubmit: onChangePassword,
    noBoxShadow: true,
    inline: true,
    submitInForm: true,
    config: config,
    label: propsConfig.texts.submitButtonLabel,
    cardStyle: {
      maxWidth: "408px",
      margin: "auto"
    },
    className: "employeeChangePassword"
  }, /*#__PURE__*/React__default.createElement(Header, null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, {
    style: {
      textAlign: "center"
    }
  }, " ", propsConfig.texts.header, " "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_LOGIN_OTP_TEXT") + " ", /*#__PURE__*/React__default.createElement("b", null, " ", "" + t("+ 91 - "), " ", mobileNumber)), /*#__PURE__*/React__default.createElement(SelectOtp, {
    t: t,
    userType: "employee",
    otp: otp,
    onOtpChange: setOtp,
    error: isOtpValid,
    onResend: onResendOTP
  })), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: true,
    label: t(showToast),
    onClose: closeToast
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "EmployeeLoginFooter"
  }, /*#__PURE__*/React__default.createElement("img", {
    alt: "Powered by DIGIT",
    src: (_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$globalConfig = _window3.globalConfigs) === null || _window3$globalConfig === void 0 ? void 0 : (_window3$globalConfig2 = _window3$globalConfig.getConfig) === null || _window3$globalConfig2 === void 0 ? void 0 : _window3$globalConfig2.call(_window3$globalConfig, "DIGIT_FOOTER_BW"),
    style: {
      cursor: "pointer"
    },
    onClick: function onClick() {
      var _window4, _window4$globalConfig, _window4$globalConfig2;
      window.open((_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$globalConfig = _window4.globalConfigs) === null || _window4$globalConfig === void 0 ? void 0 : (_window4$globalConfig2 = _window4$globalConfig.getConfig) === null || _window4$globalConfig2 === void 0 ? void 0 : _window4$globalConfig2.call(_window4$globalConfig, "DIGIT_HOME_URL"), "_blank").focus();
    }
  }), " "));
};
ChangePasswordComponent.propTypes = {
  loginParams: propTypes.any
};
ChangePasswordComponent.defaultProps = {
  loginParams: null
};

var config = [{
  texts: {
    header: "CORE_COMMON_RESET_PASSWORD_LABEL",
    submitButtonLabel: "CORE_COMMON_CHANGE_PASSWORD"
  },
  inputs: [{
    label: "CORE_LOGIN_USERNAME",
    type: "text",
    name: "userName",
    error: "ERR_HRMS_INVALID_USERNAME"
  }, {
    label: "CORE_LOGIN_NEW_PASSWORD",
    type: "password",
    name: "newPassword",
    error: "CORE_COMMON_REQUIRED_ERRMSG"
  }, {
    label: "CORE_LOGIN_CONFIRM_NEW_PASSWORD",
    type: "password",
    name: "confirmPassword",
    error: "CORE_COMMON_REQUIRED_ERRMSG"
  }]
}];

var EmployeeChangePassword = function EmployeeChangePassword() {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useRouteMatch = reactRouterDom.useRouteMatch(),
    path = _useRouteMatch.path;
  var params = React.useMemo(function () {
    return config.map(function (step) {
      var texts = {};
      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return _extends({}, step, {
        texts: texts
      });
    }, [config]);
  });
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React__default.createElement(ChangePasswordComponent, {
    config: params[0],
    t: t
  })));
};

var loginConfig = [{
  texts: {
    header: "CORE_COMMON_FORGOT_PASSWORD_LABEL",
    description: "ES_FORGOT_PASSWORD_DESC",
    submitButtonLabel: "CORE_COMMON_CONTINUE"
  },
  inputs: [{
    label: "CORE_COMMON_MOBILE_NUMBER",
    type: "text",
    name: "mobileNumber",
    error: "ERR_HRMS_INVALID_MOBILE_NUMBER"
  }, {
    label: "CORE_COMMON_CITY",
    type: "custom",
    name: "city",
    error: "ERR_HRMS_INVALID_CITY"
  }]
}];

var ForgotPassword = function ForgotPassword(_ref) {
  var _window4, _window4$globalConfig, _window4$globalConfig2;
  var propsConfig = _ref.config,
    t = _ref.t;
  var _Digit$Hooks$useTenan = Digit.Hooks.useTenants(),
    cities = _Digit$Hooks$useTenan.data,
    isLoading = _Digit$Hooks$useTenan.isLoading;
  var _useState = React.useState(null),
    user = _useState[0];
  var history = reactRouterDom.useHistory();
  var _useState2 = React.useState(null),
    showToast = _useState2[0],
    setShowToast = _useState2[1];
  var getUserType = function getUserType() {
    return Digit.UserService.getType();
  };
  React.useEffect(function () {
    var _location$state, _window;
    if (!user) {
      Digit.UserService.setType("employee");
      return;
    }
    Digit.UserService.setUser(user);
    var redirectPath = ((_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.from) || "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee";
    history.replace(redirectPath);
  }, [user]);
  var closeToast = function closeToast() {
    setShowToast(null);
  };
  var onForgotPassword = function onForgotPassword(data) {
    try {
      if (!data.city) {
        alert("Please Select City!");
        return Promise.resolve();
      }
      var requestData = {
        otp: {
          mobileNumber: data.mobileNumber,
          userType: getUserType().toUpperCase(),
          type: "passwordreset",
          tenantId: data.city.code
        }
      };
      var _temp = _catch(function () {
        return Promise.resolve(Digit.UserService.sendOtp(requestData, data.city.code)).then(function () {
          var _window2;
          history.push("/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/employee/user/change-password?mobile_number=" + data.mobileNumber + "&tenantId=" + data.city.code);
        });
      }, function (err) {
        var _err$response, _err$response$data, _err$response$data$er, _err$response$data$er2, _err$response$data$er3;
        setShowToast((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : (_err$response$data$er = _err$response$data.error) === null || _err$response$data$er === void 0 ? void 0 : (_err$response$data$er2 = _err$response$data$er.fields) === null || _err$response$data$er2 === void 0 ? void 0 : (_err$response$data$er3 = _err$response$data$er2[0]) === null || _err$response$data$er3 === void 0 ? void 0 : _err$response$data$er3.message) || "Invalid login credentials!");
        setTimeout(closeToast, 5000);
      });
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var navigateToLogin = function navigateToLogin() {
    var _window3;
    history.replace("/" + ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) + "/employee/login");
  };
  var _propsConfig$inputs = propsConfig.inputs,
    userId = _propsConfig$inputs[0],
    city = _propsConfig$inputs[1];
  var config = [{
    body: [{
      label: t(userId.label),
      type: userId.type,
      populators: {
        name: userId.name,
        componentInFront: "+91"
      },
      isMandatory: true
    }, {
      label: t(city.label),
      type: city.type,
      populators: {
        name: city.name,
        customProps: {},
        component: function component(props, customProps) {
          return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, _extends({
            option: cities,
            optionKey: "name",
            id: city.name,
            className: "login-city-dd",
            select: function select(d) {
              props.onChange(d);
            }
          }, customProps));
        }
      },
      isMandatory: true
    }]
  }];
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }
  return /*#__PURE__*/React__default.createElement(Background, null, /*#__PURE__*/React__default.createElement("div", {
    className: "employeeBackbuttonAlign"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, {
    variant: "white",
    style: {
      borderBottom: "none"
    }
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    onSubmit: onForgotPassword,
    noBoxShadow: true,
    inline: true,
    submitInForm: true,
    config: config,
    label: propsConfig.texts.submitButtonLabel,
    secondaryActionLabel: propsConfig.texts.secondaryButtonLabel,
    onSecondayActionClick: navigateToLogin,
    heading: propsConfig.texts.header,
    description: propsConfig.texts.description,
    headingStyle: {
      textAlign: "center"
    },
    cardStyle: {
      maxWidth: "408px",
      margin: "auto"
    },
    className: "employeeForgotPassword"
  }, /*#__PURE__*/React__default.createElement(Header, null)), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: true,
    label: t(showToast),
    onClose: closeToast
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "EmployeeLoginFooter"
  }, /*#__PURE__*/React__default.createElement("img", {
    alt: "Powered by DIGIT",
    src: (_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$globalConfig = _window4.globalConfigs) === null || _window4$globalConfig === void 0 ? void 0 : (_window4$globalConfig2 = _window4$globalConfig.getConfig) === null || _window4$globalConfig2 === void 0 ? void 0 : _window4$globalConfig2.call(_window4$globalConfig, "DIGIT_FOOTER_BW"),
    style: {
      cursor: "pointer"
    },
    onClick: function onClick() {
      var _window5, _window5$globalConfig, _window5$globalConfig2;
      window.open((_window5 = window) === null || _window5 === void 0 ? void 0 : (_window5$globalConfig = _window5.globalConfigs) === null || _window5$globalConfig === void 0 ? void 0 : (_window5$globalConfig2 = _window5$globalConfig.getConfig) === null || _window5$globalConfig2 === void 0 ? void 0 : _window5$globalConfig2.call(_window5$globalConfig, "DIGIT_HOME_URL"), "_blank").focus();
    }
  }), " "));
};
ForgotPassword.propTypes = {
  loginParams: propTypes.any
};
ForgotPassword.defaultProps = {
  loginParams: null
};

var EmployeeForgotPassword = function EmployeeForgotPassword() {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useRouteMatch = reactRouterDom.useRouteMatch(),
    path = _useRouteMatch.path;
  var params = React.useMemo(function () {
    return loginConfig.map(function (step) {
      var texts = {};
      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return _extends({}, step, {
        texts: texts
      });
    }, [loginConfig]);
  });
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React__default.createElement(ForgotPassword, {
    config: params[0],
    t: t
  })));
};

var getTenants$1 = function getTenants(codes, tenants) {
  return tenants.filter(function (tenant) {
    var _codes$map;
    return codes === null || codes === void 0 ? void 0 : (_codes$map = codes.map) === null || _codes$map === void 0 ? void 0 : _codes$map.call(codes, function (item) {
      return item.code;
    }).includes(tenant.code);
  });
};
var AppModules = function AppModules(_ref) {
  var _window3;
  var stateCode = _ref.stateCode,
    userType = _ref.userType,
    modules = _ref.modules,
    appTenants = _ref.appTenants;
  var ComponentProvider = Digit.Contexts.ComponentProvider;
  var _useRouteMatch = reactRouterDom.useRouteMatch(),
    path = _useRouteMatch.path;
  var location = reactRouterDom.useLocation();
  var user = Digit.UserService.getUser();
  if (!user || !(user !== null && user !== void 0 && user.access_token) || !(user !== null && user !== void 0 && user.info)) {
    var _window;
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
      to: {
        pathname: "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/user/login",
        state: {
          from: location.pathname + location.search
        }
      }
    });
  }
  var appRoutes = modules.map(function (_ref2, index) {
    var _window2;
    var code = _ref2.code,
      tenants = _ref2.tenants;
    var Module = Digit.ComponentRegistryService.getComponent(code + "Module");
    return Module ? /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      key: index,
      path: path + "/" + code.toLowerCase()
    }, /*#__PURE__*/React__default.createElement(Module, {
      stateCode: stateCode,
      moduleCode: code,
      userType: userType,
      tenants: getTenants$1(tenants, appTenants)
    })) : /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      key: index,
      path: path + "/" + code.toLowerCase()
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
      to: "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/employee/user/error?type=notfound&module=" + code
    }));
  });
  return /*#__PURE__*/React__default.createElement("div", {
    className: "ground-container"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, appRoutes, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/login"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: {
      pathname: "/" + ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) + "/employee/user/login",
      state: {
        from: location.pathname + location.search
      }
    }
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/forgot-password"
  }, /*#__PURE__*/React__default.createElement(EmployeeForgotPassword, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/change-password"
  }, /*#__PURE__*/React__default.createElement(EmployeeChangePassword, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(AppHome, {
    userType: userType,
    modules: modules
  }))));
};

var LanguageSelection$1 = function LanguageSelection() {
  var _window2, _window2$globalConfig, _window2$globalConfig2;
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    storeData = _Digit$Hooks$useStore.data,
    isLoading = _Digit$Hooks$useStore.isLoading;
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var history = reactRouterDom.useHistory();
  var _ref = storeData || {},
    languages = _ref.languages,
    stateInfo = _ref.stateInfo;
  var selectedLanguage = Digit.StoreData.getCurrentLanguage();
  var _useState = React.useState(selectedLanguage),
    selected = _useState[0],
    setselected = _useState[1];
  var handleChangeLanguage = function handleChangeLanguage(language) {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };
  var handleSubmit = function handleSubmit(event) {
    var _window;
    history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee/user/login");
  };
  if (isLoading) return null;
  return /*#__PURE__*/React__default.createElement(Background, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    className: "bannerCard removeBottomMargin"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "bannerHeader"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: "bannerLogo",
    src: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.logoUrl,
    alt: "Digit"
  }), /*#__PURE__*/React__default.createElement("p", null, t("TENANT_TENANTS_" + (stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.code.toUpperCase())))), /*#__PURE__*/React__default.createElement("div", {
    className: "language-selector",
    style: {
      justifyContent: "space-around",
      marginBottom: "24px",
      padding: "0 5%"
    }
  }, languages.map(function (language, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "language-button-container",
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CustomButton, {
      selected: language.value === selected,
      text: language.label,
      onClick: function onClick() {
        return handleChangeLanguage(language);
      }
    }));
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    style: {
      width: "100%"
    },
    label: t("CORE_COMMON_CONTINUE"),
    onSubmit: handleSubmit
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "EmployeeLoginFooter"
  }, /*#__PURE__*/React__default.createElement("img", {
    alt: "Powered by DIGIT",
    src: (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$globalConfig = _window2.globalConfigs) === null || _window2$globalConfig === void 0 ? void 0 : (_window2$globalConfig2 = _window2$globalConfig.getConfig) === null || _window2$globalConfig2 === void 0 ? void 0 : _window2$globalConfig2.call(_window2$globalConfig, "DIGIT_FOOTER_BW"),
    style: {
      cursor: "pointer"
    },
    onClick: function onClick() {
      var _window3, _window3$globalConfig, _window3$globalConfig2;
      window.open((_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$globalConfig = _window3.globalConfigs) === null || _window3$globalConfig === void 0 ? void 0 : (_window3$globalConfig2 = _window3$globalConfig.getConfig) === null || _window3$globalConfig2 === void 0 ? void 0 : _window3$globalConfig2.call(_window3$globalConfig, "DIGIT_HOME_URL"), "_blank").focus();
    }
  }), " "));
};

var loginConfig$1 = [{
  texts: {
    header: "CORE_COMMON_LOGIN",
    submitButtonLabel: "CORE_COMMON_CONTINUE",
    secondaryButtonLabel: "CORE_COMMON_FORGOT_PASSWORD"
  },
  inputs: [{
    label: "CORE_LOGIN_USERNAME",
    type: "text",
    populators: {
      name: "username"
    },
    isMandatory: true
  }, {
    label: "CORE_LOGIN_PASSWORD",
    type: "password",
    populators: {
      name: "password"
    },
    isMandatory: true
  }, {
    isMandatory: true,
    type: "dropdown",
    key: "city",
    label: "CORE_COMMON_CITY",
    disable: false,
    populators: {
      name: "city",
      optionsKey: "name",
      error: "ERR_HRMS_INVALID_CITY",
      mdmsConfig: {
        masterName: "tenants",
        moduleName: "tenant",
        localePrefix: "TENANT_TENANTS",
        select: "(data)=>{ return Array.isArray(data['tenant'].tenants) && Digit.Utils.getUnique(data['tenant'].tenants).map(ele=>({code:ele.code,name:Digit.Utils.locale.getTransformedLocale('TENANT_TENANTS_'+ele.code)}))}"
      }
    }
  }]
}];

var _excluded$2 = ["UserRequest"];
var setEmployeeDetail = function setEmployeeDetail(userObject, token) {
  var _JSON$parse;
  var locale = ((_JSON$parse = JSON.parse(sessionStorage.getItem("Digit.locale"))) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.value) || "en_IN";
  localStorage.setItem("Employee.tenant-id", userObject === null || userObject === void 0 ? void 0 : userObject.tenantId);
  localStorage.setItem("tenant-id", userObject === null || userObject === void 0 ? void 0 : userObject.tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Employee.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Employee.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Employee.user-info", JSON.stringify(userObject));
};
var Login$1 = function Login(_ref) {
  var _config$, _config$$body, _config$$body$, _config$2, _config$2$body, _config$2$body$, _config$2$body$$popul, _window8, _window8$globalConfig, _window8$globalConfig2;
  var propsConfig = _ref.config,
    t = _ref.t,
    isDisabled = _ref.isDisabled;
  var _Digit$Hooks$useTenan = Digit.Hooks.useTenants(),
    isLoading = _Digit$Hooks$useTenan.isLoading;
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    isStoreLoading = _Digit$Hooks$useStore.isLoading;
  var _useState = React.useState(null),
    user = _useState[0],
    setUser = _useState[1];
  var _useState2 = React.useState(null),
    showToast = _useState2[0],
    setShowToast = _useState2[1];
  var _useState3 = React.useState(false),
    disable = _useState3[0],
    setDisable = _useState3[1];
  var history = reactRouterDom.useHistory();
  React.useEffect(function () {
    var _user$info, _user$info$roles, _user$info2, _user$info2$roles, _window, _window2, _window2$location, _window2$location$hre, _user$info3, _user$info4, _user$info4$roles, _user$info5, _user$info6, _user$info6$roles;
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    var filteredRoles = user === null || user === void 0 ? void 0 : (_user$info = user.info) === null || _user$info === void 0 ? void 0 : (_user$info$roles = _user$info.roles) === null || _user$info$roles === void 0 ? void 0 : _user$info$roles.filter(function (role) {
      return role.tenantId === Digit.SessionStorage.get("Employee.tenantId");
    });
    if ((user === null || user === void 0 ? void 0 : (_user$info2 = user.info) === null || _user$info2 === void 0 ? void 0 : (_user$info2$roles = _user$info2.roles) === null || _user$info2$roles === void 0 ? void 0 : _user$info2$roles.length) > 0) user.info.roles = filteredRoles;
    Digit.UserService.setUser(user);
    setEmployeeDetail(user === null || user === void 0 ? void 0 : user.info, user === null || user === void 0 ? void 0 : user.access_token);
    var redirectPath = "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee";
    if ((_window2 = window) !== null && _window2 !== void 0 && (_window2$location = _window2.location) !== null && _window2$location !== void 0 && (_window2$location$hre = _window2$location.href) !== null && _window2$location$hre !== void 0 && _window2$location$hre.includes("from=")) {
      var _window3, _window3$location, _window3$location$hre, _window3$location$hre2, _window4;
      redirectPath = decodeURIComponent((_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$location = _window3.location) === null || _window3$location === void 0 ? void 0 : (_window3$location$hre = _window3$location.href) === null || _window3$location$hre === void 0 ? void 0 : (_window3$location$hre2 = _window3$location$hre.split("from=")) === null || _window3$location$hre2 === void 0 ? void 0 : _window3$location$hre2[1]) || "/" + ((_window4 = window) === null || _window4 === void 0 ? void 0 : _window4.contextPath) + "/employee";
    }
    if (user !== null && user !== void 0 && (_user$info3 = user.info) !== null && _user$info3 !== void 0 && _user$info3.roles && user !== null && user !== void 0 && (_user$info4 = user.info) !== null && _user$info4 !== void 0 && (_user$info4$roles = _user$info4.roles) !== null && _user$info4$roles !== void 0 && _user$info4$roles.every(function (e) {
      return e.code === "NATADMIN";
    })) {
      var _window5;
      redirectPath = "/" + ((_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.contextPath) + "/employee/dss/landing/NURT_DASHBOARD";
    }
    if (user !== null && user !== void 0 && (_user$info5 = user.info) !== null && _user$info5 !== void 0 && _user$info5.roles && user !== null && user !== void 0 && (_user$info6 = user.info) !== null && _user$info6 !== void 0 && (_user$info6$roles = _user$info6.roles) !== null && _user$info6$roles !== void 0 && _user$info6$roles.every(function (e) {
      return e.code === "STADMIN";
    })) {
      var _window6;
      redirectPath = "/" + ((_window6 = window) === null || _window6 === void 0 ? void 0 : _window6.contextPath) + "/employee/dss/landing/home";
    }
    history.replace(redirectPath);
  }, [user]);
  var onLogin = function onLogin(data) {
    try {
      var _data$city;
      var _temp2 = function _temp2() {
        setDisable(false);
      };
      setDisable(true);
      var requestData = _extends({}, data, {
        userType: "EMPLOYEE"
      });
      requestData.tenantId = (data === null || data === void 0 ? void 0 : (_data$city = data.city) === null || _data$city === void 0 ? void 0 : _data$city.code) || Digit.ULBService.getStateId();
      delete requestData.city;
      var _temp = _catch(function () {
        return Promise.resolve(Digit.UserService.authenticate(requestData)).then(function (_ref3) {
          var info = _ref3.UserRequest,
            tokens = _objectWithoutPropertiesLoose(_ref3, _excluded$2);
          Digit.SessionStorage.set("Employee.tenantId", info === null || info === void 0 ? void 0 : info.tenantId);
          setUser(_extends({
            info: info
          }, tokens));
        });
      }, function (err) {
        var _err$response, _err$response$data;
        setShowToast((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.error_description) || (err === null || err === void 0 ? void 0 : err.message) == "ES_ERROR_USER_NOT_PERMITTED" && t("ES_ERROR_USER_NOT_PERMITTED") || t("INVALID_LOGIN_CREDENTIALS"));
        setTimeout(closeToast, 5000);
      });
      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var closeToast = function closeToast() {
    setShowToast(null);
  };
  var onForgotPassword = function onForgotPassword() {
    var _window7;
    history.push("/" + ((_window7 = window) === null || _window7 === void 0 ? void 0 : _window7.contextPath) + "/employee/user/forgot-password");
  };
  var defaultValue = {
    code: Digit.ULBService.getStateId(),
    name: Digit.Utils.locale.getTransformedLocale("TENANT_TENANTS_" + Digit.ULBService.getStateId())
  };
  var config = [{
    body: propsConfig === null || propsConfig === void 0 ? void 0 : propsConfig.inputs
  }];
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
    mode = _Digit$Hooks$useQuery.mode;
  if (mode === "admin" && (config === null || config === void 0 ? void 0 : (_config$ = config[0]) === null || _config$ === void 0 ? void 0 : (_config$$body = _config$.body) === null || _config$$body === void 0 ? void 0 : (_config$$body$ = _config$$body[2]) === null || _config$$body$ === void 0 ? void 0 : _config$$body$.disable) == false && (config === null || config === void 0 ? void 0 : (_config$2 = config[0]) === null || _config$2 === void 0 ? void 0 : (_config$2$body = _config$2.body) === null || _config$2$body === void 0 ? void 0 : (_config$2$body$ = _config$2$body[2]) === null || _config$2$body$ === void 0 ? void 0 : (_config$2$body$$popul = _config$2$body$.populators) === null || _config$2$body$$popul === void 0 ? void 0 : _config$2$body$$popul.defaultValue) == undefined) {
    config[0].body[2].disable = true;
    config[0].body[2].isMandatory = false;
    config[0].body[2].populators.defaultValue = defaultValue;
  }
  return isLoading || isStoreLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement(Background, null, /*#__PURE__*/React__default.createElement("div", {
    className: "employeeBackbuttonAlign"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, {
    variant: "white",
    style: {
      borderBottom: "none"
    }
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposerV2, {
    onSubmit: onLogin,
    isDisabled: isDisabled || disable,
    noBoxShadow: true,
    inline: true,
    submitInForm: true,
    config: config,
    label: propsConfig.texts.submitButtonLabel,
    secondaryActionLabel: propsConfig.texts.secondaryButtonLabel,
    onSecondayActionClick: onForgotPassword,
    heading: propsConfig.texts.header,
    headingStyle: {
      textAlign: "center"
    },
    cardStyle: {
      margin: "auto",
      minWidth: "408px"
    },
    className: "loginFormStyleEmployee",
    buttonStyle: {
      maxWidth: "100%",
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(Header, null)), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: true,
    label: t(showToast),
    onClose: closeToast
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "employee-login-home-footer",
    style: {
      backgroundColor: "unset"
    }
  }, /*#__PURE__*/React__default.createElement("img", {
    alt: "Powered by DIGIT",
    src: (_window8 = window) === null || _window8 === void 0 ? void 0 : (_window8$globalConfig = _window8.globalConfigs) === null || _window8$globalConfig === void 0 ? void 0 : (_window8$globalConfig2 = _window8$globalConfig.getConfig) === null || _window8$globalConfig2 === void 0 ? void 0 : _window8$globalConfig2.call(_window8$globalConfig, "DIGIT_FOOTER_BW"),
    style: {
      cursor: "pointer"
    },
    onClick: function onClick() {
      var _window9, _window9$globalConfig, _window9$globalConfig2;
      window.open((_window9 = window) === null || _window9 === void 0 ? void 0 : (_window9$globalConfig = _window9.globalConfigs) === null || _window9$globalConfig === void 0 ? void 0 : (_window9$globalConfig2 = _window9$globalConfig.getConfig) === null || _window9$globalConfig2 === void 0 ? void 0 : _window9$globalConfig2.call(_window9$globalConfig, "DIGIT_HOME_URL"), "_blank").focus();
    }
  }), " "));
};
Login$1.propTypes = {
  loginParams: propTypes.any
};
Login$1.defaultProps = {
  loginParams: null
};

var EmployeeLogin = function EmployeeLogin() {
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useRouteMatch = reactRouterDom.useRouteMatch(),
    path = _useRouteMatch.path;
  var _useState = React.useState(loginConfig$1),
    loginConfig = _useState[0],
    setloginConfig = _useState[1];
  var _Digit$Hooks$useCommo = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "commonUiConfig", ["LoginConfig"], {
      select: function select(data) {
        var _data$commonUiConfig;
        return {
          config: data === null || data === void 0 ? void 0 : (_data$commonUiConfig = data.commonUiConfig) === null || _data$commonUiConfig === void 0 ? void 0 : _data$commonUiConfig.LoginConfig
        };
      },
      retry: false
    }),
    mdmsData = _Digit$Hooks$useCommo.data,
    isLoading = _Digit$Hooks$useCommo.isLoading;
  React.useEffect(function () {
    if (isLoading == false && mdmsData !== null && mdmsData !== void 0 && mdmsData.config) {
      setloginConfig(mdmsData === null || mdmsData === void 0 ? void 0 : mdmsData.config);
    }
  }, [mdmsData, isLoading]);
  var loginParams = React.useMemo(function () {
    return loginConfig.map(function (step) {
      var texts = {};
      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return _extends({}, step, {
        texts: texts
      });
    }, [loginConfig]);
  });
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React__default.createElement(Login$1, {
    config: loginParams[0],
    t: t
  })));
};

var userScreensExempted = ["user/profile", "user/error"];
var EmployeeApp = function EmployeeApp(_ref) {
  var _location$pathname, _window2, _window2$globalConfig, _window2$globalConfig2;
  var stateInfo = _ref.stateInfo,
    userDetails = _ref.userDetails,
    CITIZEN = _ref.CITIZEN,
    cityDetails = _ref.cityDetails,
    mobileView = _ref.mobileView,
    handleUserDropdownSelection = _ref.handleUserDropdownSelection,
    logoUrl = _ref.logoUrl,
    DSO = _ref.DSO,
    stateCode = _ref.stateCode,
    modules = _ref.modules,
    appTenants = _ref.appTenants,
    initData = _ref.initData;
  var history = reactRouterDom.useHistory();
  var _useTranslation = reactI18next.useTranslation(),
    t = _useTranslation.t;
  var _useRouteMatch = reactRouterDom.useRouteMatch(),
    path = _useRouteMatch.path;
  var location = reactRouterDom.useLocation();
  var showLanguageChange = location === null || location === void 0 ? void 0 : (_location$pathname = location.pathname) === null || _location$pathname === void 0 ? void 0 : _location$pathname.includes("language-selection");
  var isUserProfile = userScreensExempted.some(function (url) {
    var _location$pathname2;
    return location === null || location === void 0 ? void 0 : (_location$pathname2 = location.pathname) === null || _location$pathname2 === void 0 ? void 0 : _location$pathname2.includes(url);
  });
  React.useEffect(function () {
    Digit.UserService.setType("employee");
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "employee"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user"
  }, isUserProfile && /*#__PURE__*/React__default.createElement(TopBarSideBar, {
    t: t,
    stateInfo: stateInfo,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl,
    showSidebar: isUserProfile ? true : false,
    showLanguageChange: !showLanguageChange
  }), /*#__PURE__*/React__default.createElement("div", {
    className: isUserProfile ? "grounded-container" : "loginContainer",
    style: isUserProfile ? {
      padding: 0,
      paddingTop: "80px",
      marginLeft: mobileView ? "" : "64px"
    } : {
      "--banner-url": "url(" + (stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.bannerUrl) + ")",
      padding: "0px"
    }
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/login"
  }, /*#__PURE__*/React__default.createElement(EmployeeLogin, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/forgot-password"
  }, /*#__PURE__*/React__default.createElement(EmployeeForgotPassword, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/change-password"
  }, /*#__PURE__*/React__default.createElement(EmployeeChangePassword, null)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/user/profile"
  }, /*#__PURE__*/React__default.createElement(UserProfile, {
    stateCode: stateCode,
    userType: "employee",
    cityDetails: cityDetails
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/error"
  }, /*#__PURE__*/React__default.createElement(ErrorComponent, {
    initData: initData,
    goToHome: function goToHome() {
      var _window, _Digit, _Digit$UserService, _Digit$UserService$ge;
      history.push("/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/" + ((_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$UserService = _Digit.UserService) === null || _Digit$UserService === void 0 ? void 0 : (_Digit$UserService$ge = _Digit$UserService.getType) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.call(_Digit$UserService)));
    }
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/language-selection"
  }, /*#__PURE__*/React__default.createElement(LanguageSelection$1, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: path + "/user/language-selection"
  }))))), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(TopBarSideBar, {
    t: t,
    stateInfo: stateInfo,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl,
    modules: modules
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "main " + (DSO ? "m-auto" : "")
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "employee-app-wrapper"
  }, /*#__PURE__*/React__default.createElement(ErrorBoundary, {
    initData: initData
  }, /*#__PURE__*/React__default.createElement(AppModules, {
    stateCode: stateCode,
    userType: "employee",
    modules: modules,
    appTenants: appTenants
  }))), /*#__PURE__*/React__default.createElement("div", {
    className: "employee-home-footer"
  }, /*#__PURE__*/React__default.createElement("img", {
    alt: "Powered by DIGIT",
    src: (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$globalConfig = _window2.globalConfigs) === null || _window2$globalConfig === void 0 ? void 0 : (_window2$globalConfig2 = _window2$globalConfig.getConfig) === null || _window2$globalConfig2 === void 0 ? void 0 : _window2$globalConfig2.call(_window2$globalConfig, "DIGIT_FOOTER"),
    style: {
      height: "1.1em",
      cursor: "pointer"
    },
    onClick: function onClick() {
      var _window3, _window3$globalConfig, _window3$globalConfig2;
      window.open((_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$globalConfig = _window3.globalConfigs) === null || _window3$globalConfig === void 0 ? void 0 : (_window3$globalConfig2 = _window3$globalConfig.getConfig) === null || _window3$globalConfig2 === void 0 ? void 0 : _window3$globalConfig2.call(_window3$globalConfig, "DIGIT_HOME_URL"), "_blank").focus();
    }
  })))), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: path + "/user/language-selection"
  }))));
};

var DigitApp = function DigitApp(_ref) {
  var _userDetails$info, _window5, _window6, _window7;
  var stateCode = _ref.stateCode,
    modules = _ref.modules,
    appTenants = _ref.appTenants,
    logoUrl = _ref.logoUrl,
    initData = _ref.initData,
    _ref$defaultLanding = _ref.defaultLanding,
    defaultLanding = _ref$defaultLanding === void 0 ? "citizen" : _ref$defaultLanding;
  var history = reactRouterDom.useHistory();
  var _useLocation = reactRouterDom.useLocation(),
    pathname = _useLocation.pathname;
  var innerWidth = window.innerWidth;
  var cityDetails = Digit.ULBService.getCurrentUlb();
  var userDetails = Digit.UserService.getUser();
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
    storeData = _Digit$Hooks$useStore.data;
  var _ref2 = storeData || {},
    stateInfo = _ref2.stateInfo;
  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  var CITIZEN = (userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$info = userDetails.info) === null || _userDetails$info === void 0 ? void 0 : _userDetails$info.type) === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;
  if (window.location.pathname.split("/").includes("employee")) CITIZEN = false;
  React.useEffect(function () {
    var _window, _window2, _window3;
    if (!(pathname !== null && pathname !== void 0 && pathname.includes("application-details"))) {
      if (!(pathname !== null && pathname !== void 0 && pathname.includes("inbox"))) {
        Digit.SessionStorage.del("fsm/inbox/searchParams");
      }
      if (pathname !== null && pathname !== void 0 && pathname.includes("search")) {
        Digit.SessionStorage.del("fsm/search/searchParams");
      }
    }
    if (!(pathname !== null && pathname !== void 0 && pathname.includes("dss"))) {
      Digit.SessionStorage.del("DSS_FILTERS");
    }
    if ((pathname === null || pathname === void 0 ? void 0 : pathname.toString()) === "/" + ((_window = window) === null || _window === void 0 ? void 0 : _window.contextPath) + "/employee") {
      Digit.SessionStorage.del("SEARCH_APPLICATION_DETAIL");
      Digit.SessionStorage.del("WS_EDIT_APPLICATION_DETAILS");
    }
    if ((pathname === null || pathname === void 0 ? void 0 : pathname.toString()) === "/" + ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.contextPath) + "/citizen" || (pathname === null || pathname === void 0 ? void 0 : pathname.toString()) === "/" + ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.contextPath) + "/employee") {
      Digit.SessionStorage.del("WS_DISCONNECTION");
    }
  }, [pathname]);
  history.listen(function () {
    var _window4;
    (_window4 = window) === null || _window4 === void 0 ? void 0 : _window4.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });
  var handleUserDropdownSelection = function handleUserDropdownSelection(option) {
    option.func();
  };
  var mobileView = innerWidth <= 640;
  var sourceUrl = window.location.origin + "/citizen";
  var commonProps = {
    stateInfo: stateInfo,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl,
    DSO: DSO,
    stateCode: stateCode,
    modules: modules,
    appTenants: appTenants,
    sourceUrl: sourceUrl,
    pathname: pathname,
    initData: initData
  };
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "/" + ((_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.contextPath) + "/employee"
  }, /*#__PURE__*/React__default.createElement(EmployeeApp, commonProps)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "/" + ((_window6 = window) === null || _window6 === void 0 ? void 0 : _window6.contextPath) + "/citizen"
  }, /*#__PURE__*/React__default.createElement(Home$1, commonProps)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: "/" + ((_window7 = window) === null || _window7 === void 0 ? void 0 : _window7.contextPath) + "/" + defaultLanding
  })));
};

var commonReducer = function commonReducer(defaultData) {
  return function (state, action) {
    if (state === void 0) {
      state = defaultData;
    }
    switch (action.type) {
      case "LANGUAGE_SELECT":
        return _extends({}, state, {
          selectedLanguage: action.payload
        });
      default:
        return state;
    }
  };
};

var getRootReducer = function getRootReducer(defaultStore, moduleReducers) {
  return redux.combineReducers(_extends({
    common: commonReducer(defaultStore)
  }, moduleReducers));
};
var middleware = [thunk];
var composeEnhancers = typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : redux.compose;
var enhancer = composeEnhancers(redux.applyMiddleware.apply(void 0, middleware));
var getStore = function getStore(defaultStore, moduleReducers) {
  if (moduleReducers === void 0) {
    moduleReducers = {};
  }
  return redux.createStore(getRootReducer(defaultStore, moduleReducers), enhancer);
};

var DigitUIWrapper = function DigitUIWrapper(_ref) {
  var _initData$stateInfo;
  var stateCode = _ref.stateCode,
    enabledModules = _ref.enabledModules,
    moduleReducers = _ref.moduleReducers,
    defaultLanding = _ref.defaultLanding;
  var _Digit$Hooks$useInitS = Digit.Hooks.useInitStore(stateCode, enabledModules),
    isLoading = _Digit$Hooks$useInitS.isLoading,
    initData = _Digit$Hooks$useInitS.data;
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, {
      page: true
    });
  }
  var i18n = reactI18next.getI18n();
  return /*#__PURE__*/React__default.createElement(reactRedux.Provider, {
    store: getStore(initData, moduleReducers(initData))
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.BrowserRouter, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Body, null, /*#__PURE__*/React__default.createElement(DigitApp, {
    initData: initData,
    stateCode: stateCode,
    modules: initData === null || initData === void 0 ? void 0 : initData.modules,
    appTenants: initData.tenants,
    logoUrl: initData === null || initData === void 0 ? void 0 : (_initData$stateInfo = initData.stateInfo) === null || _initData$stateInfo === void 0 ? void 0 : _initData$stateInfo.logoUrl,
    defaultLanding: defaultLanding
  }))));
};
var DigitUI = function DigitUI(_ref2) {
  var stateCode = _ref2.stateCode,
    registry = _ref2.registry,
    enabledModules = _ref2.enabledModules,
    moduleReducers = _ref2.moduleReducers,
    defaultLanding = _ref2.defaultLanding;
  var _useState = React.useState(Digit.Utils.getPrivacyObject() || {}),
    privacy = _useState[0],
    setPrivacy = _useState[1];
  var userType = Digit.UserService.getType();
  var queryClient = new reactQuery.QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15 * 60 * 1000,
        cacheTime: 50 * 60 * 1000,
        retry: false,
        retryDelay: function retryDelay(attemptIndex) {
          return Infinity;
        }
      }
    }
  });
  var ComponentProvider = Digit.Contexts.ComponentProvider;
  var PrivacyProvider = Digit.Contexts.PrivacyProvider;
  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(ErrorBoundary, null, /*#__PURE__*/React__default.createElement(reactQuery.QueryClientProvider, {
    client: queryClient
  }, /*#__PURE__*/React__default.createElement(ComponentProvider.Provider, {
    value: registry
  }, /*#__PURE__*/React__default.createElement(PrivacyProvider.Provider, {
    value: {
      privacy: privacy === null || privacy === void 0 ? void 0 : privacy[window.location.pathname],
      resetPrivacy: function resetPrivacy(_data) {
        Digit.Utils.setPrivacyObject({});
        setPrivacy({});
      },
      getPrivacy: function getPrivacy() {
        var privacyObj = Digit.Utils.getPrivacyObject();
        setPrivacy(privacyObj);
        return privacyObj;
      },
      updatePrivacyDescoped: function updatePrivacyDescoped(_data) {
        var _extends2;
        var privacyObj = Digit.Utils.getAllPrivacyObject();
        var newObj = _extends({}, privacyObj, (_extends2 = {}, _extends2[window.location.pathname] = _data, _extends2));
        Digit.Utils.setPrivacyObject(_extends({}, newObj));
        setPrivacy((privacyObj === null || privacyObj === void 0 ? void 0 : privacyObj[window.location.pathname]) || {});
      },
      updatePrivacy: function updatePrivacy(uuid, fieldName) {
        setPrivacy(Digit.Utils.updatePrivacy(uuid, fieldName) || {});
      }
    }
  }, /*#__PURE__*/React__default.createElement(DigitUIWrapper, {
    stateCode: stateCode,
    enabledModules: enabledModules,
    moduleReducers: moduleReducers,
    defaultLanding: defaultLanding
  }))))));
};
var componentsToRegister = {
  SelectOtp: SelectOtp
};
var initCoreComponents = function initCoreComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref3) {
    var key = _ref3[0],
      value = _ref3[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

exports.DigitUI = DigitUI;
exports.initCoreComponents = initCoreComponents;
//# sourceMappingURL=index.js.map
