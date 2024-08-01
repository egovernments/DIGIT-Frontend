import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, PopUp, Button, Header } from "@egovernments/digit-ui-components";
import { LinkButton } from "@egovernments/digit-ui-react-components";

const PrivacyComponent = ({ onSelect, formData, control, formState, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [isChecked, setIsChecked] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const { data: privacy } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "commonUiConfig",
    [{ name: "PrivacyPolicy" }],
    {
      select: (data) => {
        return data?.commonUiConfig?.PrivacyPolicy?.[0]?.texts?.[0];
      },
    }
  );
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  useEffect(() => {
    onSelect("check", isChecked);
  }, [isChecked]);
  const onButtonClick = () => {
    setShowPopUp(true);
  };

  const handleScrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <React.Fragment>
      <div className="digit-privacy-checkbox">
        <CheckBox label={t("ES_BY_CLICKING")} checked={isChecked} onChange={handleCheckboxChange}></CheckBox>
        <Button
          label={t(`ES_PRIVACY_POLICY`)}
          variation={"link"}
          size={"medium"}
          onClick={onButtonClick}
          // isSuffix={true}
          style={{ marginBottom: "1.18rem", paddingLeft: "unset" }}
        ></Button>
      </div>
      {showPopUp && (
        <PopUp
          type={"default"}
          className={"privacy-popUpClass"}
          footerclassName={"popUpFooter"}
          heading={t(privacy?.header)}
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
                setIsChecked(false), setShowPopUp(false);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("DIGIT_I_ACCEPT")}
              className={"accept-class"}
              onClick={() => {
                setIsChecked(true), setShowPopUp(false);
              }}
            />,
          ]}
          sortFooterChildren={true}
          onClose={() => {
            setShowPopUp(false);
          }}
        >
          <div>
            <div className="privacy-table">{t("DIGIT_TABLE_OF_CONTENTS")}</div>
            <ul>
              {privacy?.descriptions
                .filter((desc) => desc?.isHeader)
                .map((desc, index) => (
                  <li key={index}>
                    <Button
                      label={t(desc.text)}
                      variation={"link"}
                      size={"medium"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollToElement(desc.text);
                      }}
                    ></Button>
                  </li>
                ))}
            </ul>
          </div>
          {privacy?.descriptions.map((desc, index) => (
            <div
              key={index}
              id={desc.isHeader ? desc.text : undefined}
              style={{
                fontWeight: desc.isBold ? 700 : 400,
                paddingLeft: desc.isSpaceRequired ? "1rem" : "0",
                display: "flex",
                alignItems: "center",
              }}
            >
              {desc.isDotRequired && (
                <span className="desc-dot"
                ></span>
              )}
              {t(desc.text)}
            </div>
          ))}
        </PopUp>
      )}
    </React.Fragment>
  );
};

export default PrivacyComponent;
