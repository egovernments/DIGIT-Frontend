// import React, { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Header, ViewComposer, Toast } from "@egovernments/digit-ui-react-components";
// import { data } from "../../configs/ViewIndividual";
// import UseIndividualDetails from "../../hooks/UseIndividualDetails";
// import useIndividualView from "../../hooks/useIndividualView";

// const IndividualDetails = () => {
//   const { t } = useTranslation();
//   const [showToast, setShowToast] = useState(false);
//   const { id } = Digit.Hooks.useQueryParams(); 
//   console.log("id:",id);
//   const { isLoading, isFetching, data: individual } = useIndividualView(id);
//   console.log("individual",individual);
//   let config = null;
  
//   // // const requestCriteria = {
//   // //   url: "/individual/v1/_search",
//   // //   changeQueryName:id,
//   // //   params: {
//   // //       tenantId:"pg.citya",
//   // //     offset: 0,
//   // //     limit: 100,
//   // //   },
//   // //   body: {
//   // //     Individual: 
//   // //       {
//   // //         tenantId:"pg.citya",
//   // //         "individualId":id
//   // //       },
      
//   // //   },
//   // // };
//   // // const closeToast = () => {
//   // //   setTimeout(() => {
//   // //     setShowToast(null);
//   // //   }, 5000);
//   // // };
//   // // const { data: individual, refetch } = Digit.Hooks.useCustomAPIHook(requestCriteria);

//   // console.log(individual,"jkhvuifuhidjf")
  
//   config = data(individual);
//   return (
//     <React.Fragment>
//       <Header className="works--view">{t("Individual data")}</Header>
//       <ViewComposer data={config} isLoading={false} />
//       {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
//     </React.Fragment>
//   );
// };
// export default IndividualDetails;
