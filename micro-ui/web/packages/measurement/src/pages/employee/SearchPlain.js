import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader, Button, AddFilled } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import SearchMeasurementConfig from "../../configs/MeasurementSearchConfig";
import SearchMeasurementPlainConfig from "../../configs/MeasurementSearchPlainConfig";

const SearchPlain = () => {
  const { t } = useTranslation();
  const history = useHistory()
  const location = useLocation()
  const configs = SearchMeasurementPlainConfig();
  


  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        <Header className="works-header-search">{t(configs?.label)}</Header>
   
      </div>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={configs}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default SearchPlain;