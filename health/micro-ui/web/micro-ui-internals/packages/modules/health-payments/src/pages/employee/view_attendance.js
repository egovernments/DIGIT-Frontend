// import React, { useState, useEffect } from "react";
// import { useLocation, useHistory } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { Loader, Header } from "@egovernments/digit-ui-react-components";
// import { Divider, Button, PopUp, Card, ActionBar, Link, ViewCardFieldPair, Toast } from "@egovernments/digit-ui-components";
// import AccessibilityPopUP from "../../components/accessbilityPopUP";
// import SecurityPopUp from "../../components/securityPopUp";
// import EditVillagePopulationPopUp from "../../components/editVillagePopulationPopUP";
// import TimelinePopUpWrapper from "../../components/timelinePopUpWrapper";
// import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";

// const ViewAttendance = () => {
//   const location = useLocation();
//   const { t } = useTranslation();
//   const history = useHistory();

//   const hrms_context_path = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || 'health-hrms';

//   if (isLoading || isLoadingCampaignObject || isLoadingPlanEmployee || isWorkflowLoading || isProcessLoading) {
//     return <Loader />;
//   }

//   return (
//     <React.Fragment>
//       <div>
//         <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
//           {t(boundaryCode)}
//         </Header>
//         <div className="summary-sub-heading" style={{ marginBottom: "1.5rem" }}>
//           {`${t("HCM_MICROPLAN_MICROPLAN_NAME_LABEL")}: ${campaignObject?.campaignName || t("NO_NAME_AVAILABLE")}`}
//         </div>
//         <Card type="primary" className="middle-child">
//           {hierarchy.map((node, index) => (
//             <div key={index} className="label-pair">
//               <span className="label-heading">{t(`HCM_MICROPLAN_${node.type.toUpperCase()}_LABEL`)}</span>
//               <span className="label-text">{t(node.name)}</span>
//             </div>
//           ))}
//         </Card>

//         <Card type="primary" className="middle-child">
//           <h2 className="card-heading-title">{t(`HCM_MICROPLAN_SECURITY_AND_ACCESSIBILITY_HEADING`)}</h2>
//           <div className="label-pair">
//             <span className="label-heading">{t(`HCM_MICROPLAN_VILLAGE_SECURITY_LABEL`)}</span>
//             <div className="label-text">
//               <Button
//                 className="custom-class"
//                 icon="ArrowForward"
//                 iconFill=""
//                 isSuffix
//                 title={
//                   disabledAction ? t(`HCM_MICROPLAN_VILLAGE_SECURITY_VIEW_LINK`): data?.additionalDetails?.securityDetails
//                     ? t(`HCM_MICROPLAN_VILLAGE_SECURITY_EDIT_LINK`)
//                     : t(`HCM_MICROPLAN_VILLAGE_SECURITY_DETAIL_LINK`)
//                 }
//                 label={
//                   disabledAction ? t(`HCM_MICROPLAN_VILLAGE_SECURITY_VIEW_LINK`): data?.additionalDetails?.securityDetails
//                     ? t(`HCM_MICROPLAN_VILLAGE_SECURITY_EDIT_LINK`)
//                     : t(`HCM_MICROPLAN_VILLAGE_SECURITY_DETAIL_LINK`)
//                 }
//                 onClick={handleSecurityClick}
//                 options={[]}
//                 optionsKey=""
//                 size="medium"
//                 style={{ alignSelf: "flex-start" }}
//                 variation="link"
//               />
//             </div>
//           </div>
//           <div className="label-pair">
//             <span className="label-heading">{t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_LABEL`)}</span>
//             <div className="label-text">
//               <Button
//                 className="custom-class"
//                 icon="ArrowForward"
//                 iconFill=""
//                 isSuffix
//                 label={
//                   disabledAction ? t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_DETAIL_VIEW_LINK`): data?.additionalDetails?.accessibilityDetails
//                     ? t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_DETAIL_EDIT_LINK`)
//                     : t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_DETAIL_LINK`)
//                 }
//                 onClick={handleAccibilityClick}
//                 options={[]}
//                 optionsKey=""
//                 size="medium"
//                 style={{ alignSelf: "flex-start" }}
//                 title={
//                   disabledAction ? t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_DETAIL_VIEW_LINK`): data?.additionalDetails?.accessibilityDetails
//                     ? t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_DETAIL_EDIT_LINK`)
//                     : t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_DETAIL_LINK`)
//                 }
//                 variation="link"
//               />
//             </div>
//           </div>
//         </Card>
//         {showAccessbilityPopup && (
//           <AccessibilityPopUP
//             onClose={onAccibilityClose}
//             census={data}
//             onSuccess={(data) => {
//               onAccibilityClose();
//               setShowToast({ key: "success", label: t("ACCESSIBILITY_DETAILS_UPDATE_SUCCESS"), transitionTime: 5000 });
//               refetch();
//             }}
//             disableEditing={disabledAction}
//           />
//         )}
    

//       {/* commenting becuase some css is not working inside the component*/}
//       <ActionBar
//         actionFields={[
//           <Button
//             icon="ArrowBack"
//             label={t(`HCM_MICROPLAN_VIEW_VILLAGE_BACK`)}
//             onClick={() => {
//               history.push(`/${window.contextPath}/employee/microplan/pop-inbox?microplanId=${microplanId}&campaignId=${campaignId}`);
//             }}
//             title={t(`HCM_MICROPLAN_VIEW_VILLAGE_BACK`)}
//             type="button"
//             variation="secondary"
//           />,
//         ]}
//         className=""
//         maxActionFieldsAllowed={5}
//         setactionFieldsToRight
//         sortActionFields
//         style={{}}
//       />

//       {/* {showToast && (
//         <Toast
//           style={{ zIndex: 10001 }}
//           label={showToast.label}
//           type={showToast.key}
//           // error={showToast.key === "error"}
//           transitionTime={showToast.transitionTime}
//           onClose={() => setShowToast(null)}
//         />
//       )} */}
//     </React.Fragment>
//   );
// };
// export default ViewAttendance;
