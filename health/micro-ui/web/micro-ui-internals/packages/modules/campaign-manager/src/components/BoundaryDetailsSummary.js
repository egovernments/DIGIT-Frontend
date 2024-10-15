import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Chip, PopUp } from "@egovernments/digit-ui-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const BoundaryDetailsSummary = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);

  const [expandedGroups, setExpandedGroups] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const handleToggle = (parentKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [parentKey]: !prev[parentKey],
    }));
  };

  const handleShowAllToggle = () => {
    setShowPopUp(true);
    setShowAll((prevShowAll) => {
      const newShowAll = !prevShowAll;
      const newExpandedState = Object.keys(groupedByParent).reduce((acc, key) => {
        acc[key] = newShowAll;
        return acc;
      }, {});
      return newShowAll;
    });
  };

  const groupedByParent = props?.boundaries?.boundaries.reduce((acc, boundary) => {
    const parent = boundary.parent;
    if (!acc[parent]) {
      acc[parent] = [];
    }
    acc[parent].push(boundary);
    return acc;
  }, {});

  console.log("pdsds", groupedByParent);

  // return (
  //   <div>
  //     <div>
  //       {Object.keys(groupedByParent)
  //         .slice(0, showAll ? Object.keys(groupedByParent).length : 2)
  //         .map((parentKey, index) => (
  //           <div className="parent-group" key={index} style={{ marginBottom: "20px" }}>
  //             {parentKey && parentKey !== "undefined" && parentKey.trim() !== "" && <div className="boundary-header">{t(parentKey)}</div>}
  //             <div>
  //               <div className="digit-tag-container" style={{ display: "flex", maxWidth: "100%" }}>
  //                 {groupedByParent[parentKey]
  //                   .slice(0, expandedGroups[parentKey] ? groupedByParent[parentKey].length : 10)
  //                   .map((boundary) => (
  //                     <Chip
  //                       key={boundary.code}
  //                       text={t(boundary.code)}
  //                       onClick={() => {}}
  //                       className="multiselectdropdown-tag"
  //                       hideClose={true}
  //                     />
  //                   ))}
  //                 {groupedByParent[parentKey].length > 10 && (
  //                   <Button
  //                     label={expandedGroups[parentKey] ? t("HCM_SHOW_LESS_SELECTED") : `+${groupedByParent[parentKey].length - 10} ${t("HCM_SELECTED")}`}
  //                     onClick={() => handleToggle(parentKey)}
  //                     variation="link"
  //                   />
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         ))}

  //       {/* Show the button if there are more than 2 parent keys */}
  //       {Object.keys(groupedByParent).length > 2 && (
  //         <Button label={showAll ? t("HCM_SHOW_LESS_ALL") : t("HCM_SHOW_MORE_ALL")} onClick={handleShowAllToggle} variation="link" />
  //       )}
  //     </div>
  //     {showPopUp && (
  //         <PopUp
  //           className={"boundaries-pop-module"}
  //           type={"default"}
  //           heading={t("ES_CAMPAIGN_UPDATE_TYPE_MODAL_HEADER")}
  //           children={[]}
  //           onOverlayClick={() => {
  //             setShowPopUp(false);
  //           }}
  //           onClose={() => {
  //             setShowPopUp(false);
  //           }}
  //           footerChildren={[
  //             <Button
  //               className={"campaign-type-alert-button"}
  //               type={"button"}
  //               size={"large"}
  //               variation={"secondary"}
  //               label={t("ES_CAMPAIGN_BOUNDARY_MODAL_BACK")}
  //               onClick={() => {
  //                 setShowPopUp(false);
  //               }}
  //             />,
  //             <Button
  //               className={"campaign-type-alert-button"}
  //               type={"button"}
  //               size={"large"}
  //               variation={"primary"}
  //               label={t("ES_CAMPAIGN_BOUNDARY_MODAL_SUBMIT")}
  //               onClick={() => {
  //                 setShowPopUp(false);
  //               }}
  //             />,
  //           ]}
  //           sortFooterChildren={true}
  //         ></PopUp>
  //       )}
  //   </div>
  // );

  return (
    <div>
      {Object.keys(groupedByParent)
        .slice(0, 2)
        .map((parentKey, index) => (
          <div className="parent-group" key={index} style={{ marginBottom: "20px" }}>
            {parentKey && parentKey !== "undefined" && parentKey.trim() !== "" && <div className="boundary-header">{t(parentKey)}</div>}
            <div>
              <div className="digit-tag-container" style={{ display: "flex", maxWidth: "100%" }}>
                {groupedByParent[parentKey].slice(0, expandedGroups[parentKey] ? groupedByParent[parentKey].length : 10).map((boundary) => (
                  <Chip key={boundary.code} text={t(boundary.code)} onClick={() => {}} className="multiselectdropdown-tag" hideClose={true} />
                ))}
                {groupedByParent[parentKey].length > 10 && (
                  <Button
                    label={
                      expandedGroups[parentKey] ? t("HCM_SHOW_LESS_SELECTED") : `+${groupedByParent[parentKey].length - 10} ${t("HCM_SELECTED")}`
                    }
                    onClick={() => handleToggle(parentKey)}
                    variation="link"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      {/* Show the button if there are more than 2 parent keys */}
      {Object.keys(groupedByParent).length > 2 && (
        <Button label={ t("HCM_SHOW_MORE_ALL")} onClick={handleShowAllToggle} variation="link" />
      )}
      {showPopUp && (
        <PopUp
          // className={"boundaries-pop-module"}
          type={"default"}
          // heading={t("ES_CAMPAIGN_UPDATE_TYPE_MODAL_HEADER")}
          children={[]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          equalWidthButtons = {"false"}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("HCM_BOUNDARY_CLOSE")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
          ]}
          // sortFooterChildren={true}
        >
          {Object.keys(groupedByParent)
            .map((parentKey, index) => (
              <div className="parent-group" key={index} style={{ marginBottom: "20px" }}>
                {parentKey && parentKey !== "undefined" && parentKey.trim() !== "" && <div className="boundary-header">{t(parentKey)}</div>}
                <div>
                  <div className="digit-tag-container" style={{ display: "flex", maxWidth: "100%" }}>
                    {groupedByParent[parentKey].slice(0, expandedGroups[parentKey] ? groupedByParent[parentKey].length : 10).map((boundary) => (
                      <Chip key={boundary.code} text={t(boundary.code)} onClick={() => {}} className="multiselectdropdown-tag" hideClose={true} />
                    ))}
                    {groupedByParent[parentKey].length > 10 && (
                      <Button
                        label={
                          expandedGroups[parentKey] ? t("HCM_SHOW_LESS_SELECTED") : `+${groupedByParent[parentKey].length - 10} ${t("HCM_SELECTED")}`
                        }
                        onClick={() => handleToggle(parentKey)}
                        variation="link"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </PopUp>
      )}
    </div>
  );
};

export default BoundaryDetailsSummary;
