import React ,{Fragment} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {  Header,  ViewComposer } from "@egovernments/digit-ui-react-components";
import {  Loader} from "@egovernments/digit-ui-components";

const HRMSViewDetails = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const reqCriteria = {
    url: "/egov-hrms/employees/_search",
    params: {
      tenantId: tenantId,
      limit: 10,
      offset: 0,
    },
    body: {
      apiOperation: "SEARCH",
    },
    config: {
      select: (data) => {
        const response = data?.Employees?.[0] || {};
        return {
          cards: [
            {
              sections: [
                {
                  type: "DATA",
                  cardHeader: { value: t("Individual Details"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  values: [
                    {
                      key: "Id",
                      value: response?.code ? response?.code : t("NA"),
                    },
                    {
                      key: "Name",
                      value: response?.user?.name ? response?.user?.name : t("NA"),
                    },
                    {
                      key: "Family name",
                      value: response?.user?.familyName ? response?.user?.familyName : t("NA"),
                    },
                    {
                      key: "Other name",
                      value: response?.user?.otherNames ? response?.user?.otherNames : t("NA"),
                    },
                    {
                      key: "DOB",
                      value: response?.user?.dob ? response?.user?.dob : t("NA"),
                    },
                    {
                      key: "Gender",
                      value: response?.user?.gender ? response?.user?.gender : t("NA"),
                    },
                  ],
                },
              ],
            },
            {
              name: "address",
              sections: [
                {
                  cardHeader: { value: t("Address Details"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  name: "address",
                  type: "DATA",
                  values: [
                    {
                      key: "City",
                      value: response?.user?.correspondenceAddress ? response?.user?.correspondenceAddress : t("NA"),
                    },
                    {
                      key: "Mobile Number",
                      value: response?.user?.mobileNumber ? response?.user?.mobileNumber : t("NA"),
                    },
                    {
                      key: "Email Id",
                      value: response?.user?.emailId ? response?.user?.emailId : t("NA"),
                    },
                    {
                      key: "Role",
                      value: response?.user?.roles?.[0]?.name ? response?.user?.roles?.[0]?.name : t("NA"),
                    },
                  ],
                },
              ],
            },
          ],
        };
      },
    },
  };
  const { isLoading, data } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"}/>;
  }
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header className="summary-header">{t("Employee Details")}</Header>
      </div>
      <div className="campaign-summary-container">
        <ViewComposer data={data} />
      </div>
    </>
  );
};

export default HRMSViewDetails;
