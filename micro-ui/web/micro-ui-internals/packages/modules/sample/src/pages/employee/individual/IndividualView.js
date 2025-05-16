import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ViewComposer } from "@egovernments/digit-ui-react-components";
import { Loader, HeaderComponent } from "@egovernments/digit-ui-components";

const IndividualViewDetails = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const reqCriteria = {
    url: "/individual/v1/_search",
    params: {
      tenantId: tenantId,
      limit: 10,
      offset: 0,
    },
    body: {
      apiOperation: "SEARCH",
      Individual: {
        tenantId,
        id: ["1e909b34-17cf-448b-a64d-65abd07bc7d0"],
      },
    },
    config: {
      select: (data) => {
        const response = data?.Individual?.[0] || {};
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
                      value: response?.id ? response?.id : t("NA"),
                    },
                    {
                      key: "Name",
                      value: response?.name?.givenName ? response?.name?.givenName : t("NA"),
                    },
                    {
                      key: "Family name",
                      value: response?.name?.familyName ? response?.name?.familyName : t("NA"),
                    },
                    {
                      key: "Other name",
                      value: response?.name?.otherNames ? response?.name?.otherNames : t("NA"),
                    },
                    {
                      key: "DOB",
                      value: response?.dateOfBirth ? response?.dateOfBirth : t("NA"),
                    },
                    {
                      key: "Gender",
                      value: response?.gender ? response?.gender : t("NA"),
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
                      key: "Door Number",
                      value: response?.address?.doorNo ? response?.address?.doorNo : t("NA"),
                    },
                    {
                      key: "Address 1",
                      value: response?.address?.addressLine1 ? response?.address?.addressLine1 : t("NA"),
                    },
                    {
                      key: "Address 2",
                      value: response?.address?.addressLine2 ? response?.address?.addressLine2 : t("NA"),
                    },
                    {
                      key: "Landmark",
                      value: response?.address?.landmark ? response?.address?.landmark : t("NA"),
                    },
                    {
                      key: "City",
                      value: response?.address?.city ? response?.address?.city : t("NA"),
                    },
                    {
                      key: "Pincode",
                      value: response?.address?.pincode ? response?.address?.pincode : t("NA"),
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
    return <Loader page={true} variant={"PageLoader"} />;
  }
  return (
    <>
      {/* <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
        {t("INDIVIDUAL DETAILS")}
      </HeaderComponent> */}
      <div className="campaign-summary-container">{data && <ViewComposer data={data} />}</div>
    </>
  );
};

export default IndividualViewDetails;
