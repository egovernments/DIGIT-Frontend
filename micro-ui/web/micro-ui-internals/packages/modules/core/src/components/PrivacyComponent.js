import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, PopUp, Button, Header } from "@egovernments/digit-ui-components";
import { LinkButton } from "@egovernments/digit-ui-react-components";

const PrivacyComponent = ({ onSelect, formData, control, formState, ...props }) => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  useEffect(() => {
      onSelect("check", isChecked);
  }, [isChecked]);
  const onButtonClick = () => {
    setShowPopUp(true);
  };
  return (
    <React.Fragment>
        <div className="digit-privacy-checkbox">
      <CheckBox label={t("ES_BY_CLICKING")} checked={isChecked} onChange={handleCheckboxChange}></CheckBox>
      <LinkButton
        label={t(`ES_PRIVACY_POLICY`)}
        onClick={onButtonClick}
        style = {{textDecoration : "underline"}}
      />
      </div>
      {showPopUp && (
        <PopUp
          type={"default"}
          className={"popUpClass"}
          footerclassName={"popUpFooter"}
          heading={t("ES_PRIVACY_NOTICE")}
          children={[
            <div>
              <div className="privacy-popup-header">{"ES_PREREQUISITES"}</div>
              <div>{"ES_PREREQUISITES_CONTENT1"}</div>
              <div>{"ES_PREREQUISITES_CONTENT2"}</div>
            </div>,
            <div>
              <div className="privacy-popup-header">{"ES_PROCEDURE"}</div>
              <div>{"ES_PROCEDURE_CONTENT1"}</div>
              <div>{"ES_PROCEDURE_CONTENT2"}</div>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("DIGIT_I_DO_NOT_ACCEPT")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("DIGIT_I_ACCEPT")}
              title={t("HCM_CAMPAIGN_DOWNLOAD_TEMPLATE")}
              onClick={() => {
                setIsChecked(true),setShowPopUp(false);
              }}
            />,
          ]}
          sortFooterChildren={true}
          onClose={() => {
            setShowPopUp(false);
          }}
        ></PopUp>
      )}
    </React.Fragment>
  );
};

export default PrivacyComponent;
