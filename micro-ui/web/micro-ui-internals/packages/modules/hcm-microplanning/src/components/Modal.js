import React, { useEffect } from "react";
import { PopUp, HeaderBar, Toast, CloseButton, ButtonSelector } from "@egovernments/digit-ui-react-components";
import { Close } from "@egovernments/digit-ui-svg-components";

const Modal = ({
  headerBarMain,
  headerBarEnd,
  popupStyles,
  children = {},
  actionCancelLabel,
  actionCancelOnSubmit,
  actionSaveLabel,
  actionSaveOnSubmit,
  error,
  setError,
  formId,
  isDisabled,
  hideSubmit,
  style = {},
  footerLeftButtonstyle = {},
  footerRightButtonstyle = {},
  footerLeftButtonBody,
  footerRightButtonBody,
  popupModuleMianStyles,
  headerBarMainStyle,
  isOBPSFlow = false,
  popupModuleActionBarStyles = {},
}) => {
  /**
   * TODO: It needs to be done from the desgin changes
   */
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  return (
    <PopUp>
      <div className="popup-module" style={popupStyles}>
        <HeaderBar main={headerBarMain} end={headerBarEnd} style={headerBarMainStyle ? headerBarMainStyle : {}} />
        <div className="popup-module-main" style={popupModuleMianStyles ? popupModuleMianStyles : {}}>
          {children}
          <div className="popup-module-action-bar" style={moduleActionBarStyle(isOBPSFlow, popupModuleActionBarStyles)}>
            {actionCancelLabel || footerLeftButtonBody ? (
              <ButtonSelector
                textStyles={{ margin: "0px" }}
                ButtonBody={footerLeftButtonBody}
                theme="border"
                label={actionCancelLabel}
                onSubmit={actionCancelOnSubmit}
                style={Object.keys(style).length > 0 ? style : footerLeftButtonstyle}
              />
            ) : null}
            {!hideSubmit ? (
              <ButtonSelector
                textStyles={{ margin: "0px" }}
                ButtonBody={footerRightButtonBody}
                label={actionSaveLabel}
                onSubmit={actionSaveOnSubmit}
                formId={formId}
                isDisabled={isDisabled}
                style={Object.keys(style).length > 0 ? style : footerRightButtonstyle}
              />
            ) : null}
          </div>
        </div>
      </div>
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </PopUp>
  );
};

const moduleActionBarStyle = (isOBPSFlow, popupModuleActionBarStyles) => {
  return isOBPSFlow
    ? !mobileView
      ? { marginRight: "18px" }
      : { position: "absolute", bottom: "5%", right: "10%", left: window.location.href.includes("employee") ? "0%" : "7%" }
    : popupModuleActionBarStyles;
};


// Wrapper for modal
export const ModalWrapper = ({
  closeModal,
  LeftButtonHandler,
  RightButtonHandler,
  footerLeftButtonBody,
  footerRightButtonBody,
  header,
  bodyText,
  body,
  popupStyles,
  headerBarMainStyle,
  popupModuleActionBarStyles,
  hideSubmit,
  closeButton=false,
}) => {
  return (
    <Modal
      headerBarMain={header}
      headerBarEnd={closeButton?<div className="microplan-close-button" onClick={closeModal}> <Close width={"1.5rem"} height={"1.5rem"} fill={"#000000"}/></div>:""}
      actionCancelOnSubmit={LeftButtonHandler}
      actionSaveOnSubmit={RightButtonHandler}
      formId="microplanning"
      popupStyles={{ width: "34rem", borderRadius: "0.25rem", ...(popupStyles ? popupStyles : {}) }}
      headerBarMainStyle={{ margin: 0, width: "34rem", overflow: "hidden", ...(headerBarMainStyle ? headerBarMainStyle : {}) }}
      popupModuleMianStyles={{ margin: 0, padding: 0 }}
      popupModuleActionBarStyles={popupModuleActionBarStyles ? popupModuleActionBarStyles : { justifyContent: "space-between", padding: "1rem" }}
      style={{}}
      hideSubmit={hideSubmit ? hideSubmit : false}
      footerLeftButtonstyle={{
        padding: 0,
        alignSelf: "flex-start",
        height: "fit-content",
        textStyles: { fontWeight: "600" },
        backgroundColor: "rgba(255, 255, 255, 1)",
        color: "rgba(244, 119, 56, 1)",
        minWidth: "13rem",
        border: "1px solid rgba(244, 119, 56, 1)",
      }}
      footerRightButtonstyle={{
        padding: 0,
        alignSelf: "flex-end",
        height: "fit-content",
        textStyles: { fontWeight: "500" },
        backgroundColor: "rgba(244, 119, 56, 1)",
        color: "rgba(255, 255, 255, 1)",
        minWidth: "13rem",
        boxShadow: "0px -2px 0px 0px rgba(11, 12, 12, 1) inset",
      }}
      footerLeftButtonBody={footerLeftButtonBody}
      footerRightButtonBody={footerRightButtonBody}
    >
      {bodyText && (
        <div className="modal-body">
          <p className="modal-main-body-p">{bodyText}</p>
        </div>
      )}
      {body ? body : ""}
    </Modal>
  );
};

export default Modal;
