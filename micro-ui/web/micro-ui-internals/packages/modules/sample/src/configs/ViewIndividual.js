import React, { Fragment, useState, useEffect } from "react";
import { ViewComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useIndividualView } from "../hooks/useIndividualView";

function ViewIndividual() {
  const { t } = useTranslation();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [individualId, setIndividualId] = useState(null); // Define individualId state

  useEffect(() => {
    const id = searchParams.get("id");
    console.log("id", id);
    setIndividualId(id); // Set individualId state with the value from URL
  }, [searchParams]);

  const { isLoading, data: testData, revalidate, isFetching } = useIndividualView({
    t,
    tenantId: tenantId,
    individualId: searchParams.get("id"), // Use individualId here
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
  console.log("testData",testData);

  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <Header>{t("Individual details")}</Header>
      {!isLoading && individualId && <ViewComposer data={testData} isLoading={isLoading} />}
    </>
  );
}

export default ViewIndividual;
