import React, { Fragment, useState, useEffect } from "react";
import { ViewComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useEstimateView } from "../hooks/useEstimateView";

function ViewEstimate() {
  const { t } = useTranslation();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [estimateIdentifier, setEstimateIdentifier] = useState(null); // Define individualId state

  useEffect(() => {
    const name = searchParams.get("name");
    console.log("name", name);
    setEstimateIdentifier(name); // Set estimateId state with the value from URL
  }, [searchParams]);

  const { isLoading, data, revalidate, isFetching } = useEstimateView({
    t,
    tenantId: tenantId,
    estimateIdentifier: searchParams.get("name"), // Use estimateId here
    config: {
      select: (data) => ({
        cards: [
          {
            sections: [
              {
                type: "DATA",
                values: data?.details,
              },
            ],
          },
        ],
      }),
    },
  });
  console.log("testData", data);

  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <Header>{t("Estimate details")}</Header>
      {!isLoading && estimateIdentifier && <ViewComposer data={data} isLoading={isLoading} />}
    </>
  );
}

export default ViewEstimate;
