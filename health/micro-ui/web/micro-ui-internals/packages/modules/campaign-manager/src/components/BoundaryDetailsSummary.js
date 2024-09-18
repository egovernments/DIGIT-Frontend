import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Chip } from "@egovernments/digit-ui-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const BoundaryDetailsSummary = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);

  const [expandedGroups, setExpandedGroups] = useState({});
  const [showAll, setShowAll] = useState(false);

  const handleToggle = (parentKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [parentKey]: !prev[parentKey],
    }));
  };

  const handleShowAllToggle = () => {
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

  return (
    <div>
      <div>
        {Object.keys(groupedByParent)
          .slice(0, showAll ? Object.keys(groupedByParent).length : 2)
          .map((parentKey, index) => (
            <div className="parent-group" key={index} style={{ marginBottom: "20px" }}>
              {parentKey && parentKey !== "undefined" && parentKey.trim() !== "" && <div className="boundary-header">{t(parentKey)}</div>}
              <div>
                <div className="digit-tag-container" style={{ display: "flex", maxWidth: "100%" }}>
                  {groupedByParent[parentKey]
                    .slice(0, expandedGroups[parentKey] ? groupedByParent[parentKey].length : 10)
                    .map((boundary) => (
                      <Chip
                        key={boundary.code}
                        text={t(boundary.code)}
                        onClick={() => {}}
                        className="multiselectdropdown-tag"
                      />
                    ))}
                  {groupedByParent[parentKey].length > 10 && (
                    <Button
                      label={expandedGroups[parentKey] ? t("HCM_SHOW_LESS_SELECTED") : `+${groupedByParent[parentKey].length - 10} ${t("HCM_SELECTED")}`}
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
          <Button label={showAll ? t("HCM_SHOW_LESS_ALL") : t("HCM_SHOW_MORE_ALL")} onClick={handleShowAllToggle} variation="link" />
        )}
      </div>
    </div>
  );

};

export default BoundaryDetailsSummary;
