import React from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer,  Button, AddFilled } from "@egovernments/digit-ui-components";
import { useNavigate, useLocation } from "react-router-dom";
import searchHRMSConfig from "../../../configs/HRMSSearchConfig";

const HRMSSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const configs = searchHRMSConfig();

  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        {Digit.Utils.didEmployeeHasRole(configs?.actionRole) && (
          <Button
            label={t(configs?.actionLabel)}
            variation="secondary"
            icon={<AddFilled />}
            onButtonClick={() => {
              navigate(`/${window?.contextPath}/employee/${configs?.actionLink}`);
            }}
            type="button"
          />
        )}
      </div>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={configs}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default HRMSSearch;
