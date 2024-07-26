import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const EstimateViewDetails = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { name } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const reqCriteria = {
    url: "/mdms-v2/v2/_search",
    params: {
      tenantId: tenantId,
      limit: 10,
      offset: 0,
    },
    body: {
      apiOperation: "SEARCH",
      MdmsCriteria: {
        tenantId,
        filters: {
          "name": name
        }
      },
    },
    config: {
      select: (data) => {
        const response = data?.mdms?.[0].data;
        return {
          cards: [
            {
              sections: [
                {
                  cardHeader: { value: t("Basic information"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  type: "DATA",
                  values: [
                    {
                      key: "Name",
                      value: response?.name ? response?.name : t("NA"),
                    },
                    {
                      key: "Description",
                      value: response?.description ? response?.description : t("NA"),
                    },
                    {
                      key: "Executing Department",
                      value: response?.executingDepartment ? response?.executingDepartment : t("NA"),
                    },
                    {
                      key: "Proposal Date",
                      value: response?.proposalDate ? response?.proposalDate : t("NA"),
                    },
                    {
                      key: "Status",
                      value: response?.status ? response?.status : t("NA"),
                    },
                    {
                      key: "Workflow Status",
                      value: response?.wfStatus ? response?.wfStatus : t("NA"),
                    },
                  ]
                }
              ]
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
                      value: response?.address?.city ? response?.address?.city : t("NA"),
                    },
                    {
                      key: "Latitude",
                      value: response?.address?.latitude ? response?.address?.latitude : t("NA"),
                    },
                    {
                      key: "Longitude",
                      value: response?.address?.longitude ? response?.address?.longitude : t("NA"),
                    },
                  ],
                },
              ],
            },
            {
              name: "estimateDetails",
              sections: [
                {
                  type: "DATA",
                  cardHeader: { value: t("Estimate Details"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                  values: [
                    {
                      key: "Name",
                      value: response?.estimateDetails?.[0]?.name ? response?.estimateDetails?.[0]?.name : t("NA"),
                    },
                    {
                      key: "Description",
                      value: response?.estimateDetails?.[0]?.description ? response?.estimateDetails?.[0]?.description : t("NA"),
                    },
                    {
                      key: "Amount",
                      value: response?.estimateDetails?.[0]?.amountDetail?.[0]?.amount ? response?.estimateDetails?.[0]?.amountDetail?.[0]?.amount : t("NA"),
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
    return <Loader />;
  }
  return (
    <>
    {/* {console.log(JSON.stringify(data))}
    {console.log(JSON.stringify(response))} */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header className="summary-header">{t("ESTIMATE DETAILS")}</Header>
      </div>
      <div className="campaign-summary-container">
        <ViewComposer data={data} />
      </div>
    </>
  );
};

export default EstimateViewDetails;

