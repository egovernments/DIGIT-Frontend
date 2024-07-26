import React, { Fragment, useState, useEffect } from "react";
import { ViewComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useContractView } from "../hooks/useContractView.js";

function ViewContract() {
  const { t } = useTranslation();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [contractIdentifier, setContractIdentifier] = useState(null); // Define individualId state

  useEffect(() => {
    const id = searchParams.get("id");
    console.log("id is:", id);
    setContractIdentifier(id); // Set estimateId state with the value from URL
  }, [searchParams]);

  const { isLoading, data: testData, revalidate, isFetching } = useContractView({
    t,
    tenantId: tenantId,
    contractIdentifier: searchParams.get("id"), // Use estimateId here
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
  console.log("testData", testData);
  console.log("contractidentfier is", contractIdentifier);
  // if (isLoading) {
  //   return <Loader />;
  // }
  return (
    <>
      <Header>{t("Contractdetails")}</Header>
      {!isLoading && contractIdentifier && <ViewComposer data={testData} isLoading={isLoading} />}
    </>
  );
}
export default ViewContract;