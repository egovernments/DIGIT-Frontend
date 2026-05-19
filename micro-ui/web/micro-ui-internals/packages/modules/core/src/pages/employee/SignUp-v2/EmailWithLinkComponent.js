import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";

const EmailWithLinkComponent = ({ onSelect, formData, control, formState, ...props }) => {
  const { t } = useTranslation();

  const onButtonClickLogin = () => {
    window.location.replace(`/${window?.contextPath}/user/login`);
  };

  return (
    <div style={{ width: "100%", maxWidth: "540px", marginTop: "-0.5rem" }}>
      {/* Already have an account link - aligned to the right */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          width: "100%"
        }}
      >
        <Button
          label={t(`SB_ALREADY_HAVE_ACCOUNT`)}
          variation={"link"}
          size={"small"}
          onClick={onButtonClickLogin}
          style={{
            padding: "0",
            whiteSpace: "nowrap"
          }}
        />
      </div>
    </div>
  );
};

export default EmailWithLinkComponent;
