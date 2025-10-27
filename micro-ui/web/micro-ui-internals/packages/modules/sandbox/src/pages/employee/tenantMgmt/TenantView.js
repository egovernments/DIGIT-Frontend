import {
  Header,
  InboxSearchComposer
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tenantSearchConfig } from "../../../configs/tenantSearchConfig";
import { useHistory, useLocation } from "react-router-dom";

const defaultSearchValues = {
  tenantName: "",
  tenantCode: ""
};


const TenantView = () => {
  
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const indConfigs = tenantSearchConfig();

  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get("name");
  const code = searchParams.get("code");
  const config = tenantSearchConfig(name,code);

  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);

  const onClickRow = ({ original: row }) => {
    const code = row?.code;
    const name= row?.name;
    const email=row?.email;
    history.push(`/${window?.contextPath}/employee/sandbox/tenant-management/update`, {name,code,email});
  };

  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t(config?.tenantSearchConfig?.[0]?.label || "N/A")}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer
          configs={config?.tenantSearchConfig?.[0]}
          additionalConfig={{
            resultsTable: {
              onClickRow,
            },
          }}
        ></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};
export default TenantView;