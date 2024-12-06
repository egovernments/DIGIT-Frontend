import { Link, useHistory } from "react-router-dom";
import _ from "lodash";
import React from "react";
import { Button } from "@egovernments/digit-ui-components";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};

const businessServiceMap = {};

const inboxModuleNameMap = {};

const PGRInboxConfig = {
  additionalCustomizations: (row, key, column, value, t, searchResult) => {
    switch (key) {
      case "complaintNumber":
        return (
          <span className="link">
            <Link to={`/${window.contextPath}/employee/sample/view?tenantId=${Digit.ULBService.getCurrentTenantId()}&complaintNumber=${value}`}>
              <Button
                className=""
                iconFill=""
                label={String(value ? value : t("ES_COMMON_NA"))}
                size="medium"
                style={{ padding: "0px" }}
                title=""
                variation="link"
              />
            </Link>
          </span>
        );
      case "state":
        return value;

      default:
        return t("ES_COMMON_NA");
    }
  },
};

export const UICustomizations = {};