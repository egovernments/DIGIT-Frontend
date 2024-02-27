import { Button } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { SVG, UploadIcon } from "@egovernments/digit-ui-react-components";

const HierarchyType = ({ props }) => {
  const { t } = useTranslation();
  console.log("hhiiihihi");
  const BoundaryHierarchy = [
    {
      id: "d69b1097-4f85-4c1d-ae2d-a817a5f4747c",
      tenantId: "pg",
      hierarchyType: "office",
      boundaryHierarchy: [
        {
          boundaryType: "CEO",
          parentBoundaryType: null,
          active: true,
        },
        {
          boundaryType: "manager",
          parentBoundaryType: "CEO",
          active: true,
        },
        {
          boundaryType: "team lead",
          parentBoundaryType: "manager",
          active: true,
        },
      ],
      auditDetails: {
        createdBy: "e82c3f49-da7c-459c-86a5-a56ac2d4f5b1",
        lastModifiedBy: "e82c3f49-da7c-459c-86a5-a56ac2d4f5b1",
        createdTime: 1707468839610,
        lastModifiedTime: 1707468839610,
      },
      boundaryHierarchyJsonNode: null,
    },
  ];

  return (
    <div style={{ border: "1px solid grey" }}>
      <Button
        variation="secondary"
        label={`${t("HCM_SELECT")}`}
        type="button"
        className="workbench-add-row-detail-btn"
        style={{ fontSize: "1rem" }}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: "1.7em", height: "1.7em", marginRight: "0px" }}>
            <circle cx="12" cy="12" r="11" stroke="#F47738" strokeWidth="2" fill="transparent" />
          </svg>
        }
      />
      {BoundaryHierarchy.map((boundary, index) => (
        <div key={index}>
          <span>{boundary.hierarchyType}</span>
          {boundary.boundaryHierarchy.map((subBoundary, subIndex) => (
            <div key={subIndex}>
              <span>{subBoundary.boundaryType}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HierarchyType;
