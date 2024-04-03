import React, { useEffect, useState } from "react";
import { CardText, LabelFieldPair, Card, CardHeader, CardLabel, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Dropdown, MultiSelectDropdown } from "@egovernments/digit-ui-components";
function SelectingBoundaries() {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [hierarchy, setHierarchy] = useState({});
  const [showcomponent, setShowComponent] = useState(false);
  const [boundaryType1, setBoundaryType] = useState(null);
  const [parent, setParent] = useState(null);
  const [parentBoundaryType, setParentBoundaryType] = useState(null);
  const [boundaryData, setBoundaryData] = useState({});

  const reqCriteriaBoundaryHierarchySearch = {
    url: "/boundary-service/boundary-hierarchy-definition/_search",
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
      },
    },
    config: {
      enabled: true,
    },
  };
  const { data: hierarchyTypeDataresult } = Digit.Hooks.useCustomAPIHook(reqCriteriaBoundaryHierarchySearch);
  const handleChange = (data) => {
    console.log("data1", data);
    setHierarchy(data);
    setShowComponent(true);
    setParent(null);

    // to make the boundary data object
    const boundaryDataObj = {};
    data.boundaryHierarchy.forEach((boundary) => {
      boundaryDataObj[boundary.boundaryType] = null;
    });
    setBoundaryData(boundaryDataObj);
    const boundaryWithTypeNullParent = data.boundaryHierarchy.find((boundary) => boundary.parentBoundaryType === null);
    // Set the boundary type with null parentBoundaryType
    if (boundaryWithTypeNullParent) {
      setBoundaryType(boundaryWithTypeNullParent.boundaryType);
    } else {
      setBoundaryType(null);
    }
  };
  // console.log("boundaryType", boundaryType);

  const handleBoundary = (data, boundary) => {
    console.log("data", data);
    const parentBoundaryEntry = hierarchy ? hierarchy?.boundaryHierarchy.find((e) => e.parentBoundaryType === data?.boundaryType) : null;
    console.log("parentBoundaryEntry", parentBoundaryEntry);
    setParentBoundaryType(parentBoundaryEntry?.parentBoundaryType);
    setBoundaryType(parentBoundaryEntry?.boundaryType);
    setParent(data?.code);
    // const updatedBoundaryData = { ...boundaryData };
    // updatedBoundaryData[data?.boundaryType] = data;
    // setBoundaryData(updatedBoundaryData);
  };

  console.log("ooooooo", boundaryData);

  const reqCriteriaBoundaryTypeSearch = {
    url: "/boundary-service/boundary-relationships/_search",
    changeQueryName: `${hierarchy?.hierarchyType}${boundaryType1}${parent}`,
    params: {
      tenantId: tenantId,
      hierarchyType: hierarchy?.hierarchyType,
      boundaryType: boundaryType1,
      parent: parent,
    },
    body: {},
    config: {
      enabled: true,
    },
  };
  const { data: boundaryTypeDataresult } = Digit.Hooks.useCustomAPIHook(reqCriteriaBoundaryTypeSearch);

  useEffect(() => {
    const updatedBoundaryData = { ...boundaryData };
    updatedBoundaryData[boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary?.[0]?.boundaryType] =
      boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary;
    setBoundaryData(updatedBoundaryData);
  }, [boundaryTypeDataresult]);

  console.log("pppppppp", boundaryTypeDataresult);

  console.log("llllllllllll", boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary);

  return (
    <React.Fragment>
      <Card>
        <CardSubHeader>{t(`CAMPAIGN_SELECT_HIERARCHY`)}</CardSubHeader>
        {/* <CardText>{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</CardText> */}
        <LabelFieldPair>
          <CardLabel>{`${t("HCM_HIERARCHY_TYPE")}`} </CardLabel>
          <Dropdown
            style={{ width: "50%" }}
            t={t}
            option={hierarchyTypeDataresult?.BoundaryHierarchy}
            optionKey={"hierarchyType"}
            selected={hierarchy}
            select={(value) => {
              handleChange(value);
            }}
          />
        </LabelFieldPair>
      </Card>
      {showcomponent && (
        <Card>
          <CardSubHeader>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</CardSubHeader>
          <CardText>{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</CardText>
          {hierarchy?.boundaryHierarchy.map((boundary, index) => (
            <LabelFieldPair key={index}>
              <CardLabel>{boundary.boundaryType}</CardLabel>
              <MultiSelectDropdown
                // style={{ width: "50%" }}
                t={t}
                // option={boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary}
                options={boundaryData[boundary.boundaryType]?boundaryData[boundary.boundaryType]:[]}
                // options={boundaryData[boundary.boundaryType]}
                // options = {[
                //   {
                //     code: "Province A",
                //     name: "Province A",
                //   },
                //   {
                //     code: "Province B",
                //     name: "Province B",
                //   },
                //   {
                //     code: "Province c",
                //     name: "Province c",
                //   },
                // ]}
                optionsKey={"code"}
                // selected={boundaryType1}
                onSelect={(value) => {
                  handleBoundary(value, boundary);
                }}
              />
            </LabelFieldPair>
          ))}
        </Card>
      )}
    </React.Fragment>
  );
}

export default SelectingBoundaries;
