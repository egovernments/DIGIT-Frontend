import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, PopUp, Button, Header } from "@egovernments/digit-ui-components";
import { LinkButton } from "@egovernments/digit-ui-react-components";

const PrivacyComponent = ({ onSelect, formData, control, formState, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [isChecked, setIsChecked] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const { data: privacy } = Digit.Hooks.useCustomMDMS(tenantId, "commonUiConfig", [{ name: "PrivacyPolicy" }]);
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
          heading={t(privacy?.commonUiConfig?.PrivacyPolicy?.[0]?.texts?.[0]?.header)}
          children={[
            privacy?.commonUiConfig?.PrivacyPolicy?.[0]?.texts?.[0]?.descriptions.map((desc, index) => (
              <div key={index} style={{ fontWeight: desc.isBold ? 700 : 400 }}>
                {t(desc.text)}
              </div>
            ))
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
              style={{width : "11.886rem"}}
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
