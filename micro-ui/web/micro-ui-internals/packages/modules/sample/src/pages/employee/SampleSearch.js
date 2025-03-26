import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header, Loader, Button, AddFilled } from "@egovernments/digit-ui-react-components";
import searchWageSeekerConfig from "../../configs/searchWageSeekerConfig";
import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import { useHistory, useLocation } from "react-router-dom";
// not working todo
const SearchWageSeeker = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const configs = searchWageSeekerConfig();

  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        {Digit.Utils.didEmployeeHasRole(configs?.actionRole) && (
          <Button
            label={t(configs?.actionLabel)}
            variation="secondary"
            icon={<AddFilled />}
            onButtonClick={() => {
              history.push(`/${window?.contextPath}/employee/${configs?.actionLink}`);
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

export default SearchWageSeeker;
