import React, { useEffect } from "react";
import { PopUp, HeaderBar, Toast } from "@egovernments/digit-ui-react-components";

const Modal = ({
  headerBarMain,
  headerBarEnd,
  popupStyles,
  children,
  actionCancelLabel,
  actionCancelOnSubmit,
  actionSaveLabel,
  actionSaveOnSubmit,
  error,
  setError,
  formId,
  isDisabled,
  hideSubmit,
  style={},
  footerLeftButtonstyle={},
  footerRightButtonstyle={},
  footerLeftButtonBody,
  footerRightButtonBody,
  popupModuleMianStyles,
  headerBarMainStyle,
  isOBPSFlow = false,
  popupModuleActionBarStyles={}
}) => {
  /**
   * TODO: It needs to be done from the desgin changes
   */
   const mobileView = Digit.Utils.browser.isMobile() ? true : false;
  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () =>{
      document.body.style.overflowY = 'auto';
    }
  }, [])

  return (
    <PopUp>
      <div className="popup-module" style={popupStyles}>
        <HeaderBar main={headerBarMain} end={headerBarEnd} style={headerBarMainStyle ? headerBarMainStyle : {}}/>
        <div className="popup-module-main" style={popupModuleMianStyles ? popupModuleMianStyles : {}}>
          {children}
          <div className="popup-module-action-bar" style={isOBPSFlow?!mobileView?{marginRight:"18px"}:{position:"absolute",bottom:"5%",right:"10%",left:window.location.href.includes("employee")?"0%":"7%"}:popupModuleActionBarStyles}>
            {actionCancelLabel || footerLeftButtonBody ? <ButtonSelector textStyles={{margin:"0px"}} ButtonBody={footerLeftButtonBody} theme="border" label={actionCancelLabel} onSubmit={actionCancelOnSubmit} style={Object.keys(style).length>0?style:footerLeftButtonstyle}/> : null}
            {!hideSubmit ? <ButtonSelector textStyles={{margin:"0px"}} ButtonBody={footerRightButtonBody} label={actionSaveLabel} onSubmit={actionSaveOnSubmit} formId={formId} isDisabled={isDisabled} style={Object.keys(style).length>0?style:footerRightButtonstyle}/> : null}
          </div>
        </div>
      </div>
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </PopUp>
  );
};

const ButtonSelector = (props) => {
  let theme = "selector-button-primary";
  switch (props.theme) {
    case "border":
      theme = "selector-button-border";
      break;
    default:
      theme = "selector-button-primary";
      break;
  }
  return (
    <button
      className={props.isDisabled ? "selector-button-primary-disabled" : theme}
      type={props.type || "submit"}
      form={props.formId}
      onClick={props.onSubmit}
      disabled={props.isDisabled}
      style={props.style ? props.style : null}
    >
      <h2 style={{ ...props?.textStyles, ...{ width: "100%" } }}>{props.label}</h2>
      {props.ButtonBody?props.ButtonBody:""}
    </button>
  );
};


export default Modal;