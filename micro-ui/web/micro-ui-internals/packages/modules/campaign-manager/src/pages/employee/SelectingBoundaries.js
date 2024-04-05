import React, { useEffect, useState } from "react";
import { CardText, LabelFieldPair, Card, CardHeader, CardLabel, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Dropdown, InfoCard, MultiSelectDropdown } from "@egovernments/digit-ui-components";
function SelectingBoundaries() {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [hierarchy, setHierarchy] = useState({});
  const [showcomponent, setShowComponent] = useState(false);
  const [boundaryType, setBoundaryType] = useState(null);
  const [parent, setParent] = useState(null);
  const [parentBoundaryType, setParentBoundaryType] = useState(null);
  const [boundaryData, setBoundaryData] = useState({});
  const [parentArray, setParentArray] = useState(null);
  const [boundaryTypeDataresult, setBoundaryTypeDataresult] = useState(null);

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

  // const reqCriteriaBoundaryTypeSearch = {
  //   url: "/boundary-service/boundary-relationships/_search",
  //   changeQueryName: `${hierarchy?.hierarchyType}${boundaryType}${parent}`,
  //   params: {
  //     tenantId: tenantId,
  //     hierarchyType: hierarchy?.hierarchyType,
  //     boundaryType: boundaryType,
  //     parent: parent,
  //   },
  //   body: {},
  //   config: {
  //     enabled: true,
  //   },
  // };
  // const { data: boundaryTypeDataresult } = Digit.Hooks.useCustomAPIHook(reqCriteriaBoundaryTypeSearch);


  const fetchBoundaryTypeData = async () => {
    if (parentArray === null) {
      const reqCriteriaBoundaryTypeSearch = Digit.CustomService.getResponse({
        url: "/boundary-service/boundary-relationships/_search",
        params: {
          tenantId: tenantId,
          hierarchyType: hierarchy.hierarchyType,
          boundaryType: boundaryType,
          parent: null,
        },
        body: {},
      });
      const boundaryTypeData = await reqCriteriaBoundaryTypeSearch;
      setBoundaryTypeDataresult(boundaryTypeData);
    } else {
      for (const parentCode of parentArray) {
        // console.log("parentCde", parentCode);
        const reqCriteriaBoundaryTypeSearch = Digit.CustomService.getResponse({
          url: "/boundary-service/boundary-relationships/_search",
          params: {
            tenantId: tenantId,
            hierarchyType: hierarchy.hierarchyType,
            boundaryType: boundaryType,
            parent: parentCode,
          },
          body: {},
        });
        const boundaryTypeData = await reqCriteriaBoundaryTypeSearch;
        setBoundaryTypeDataresult(boundaryTypeData);
      }
    }
  };


  useEffect(() => {
      fetchBoundaryTypeData();
  }, [boundaryType, parentArray , boundaryTypeDataresult]);

  // const fetchBoundaryData = async (parentCode) => {
  //   const reqCriteriaBoundaryTypeSearch = {
  //     url: "/boundary-service/boundary-relationships/_search",
  //     changeQueryName: `${hierarchy?.hierarchyType}${boundaryType}${parentCode}`,
  //     params: {
  //       tenantId: tenantId,
  //       hierarchyType: hierarchy?.hierarchyType,
  //       boundaryType: boundaryType,
  //       parent: parentCode,
  //     },
  //     body: {},
  //     config: {
  //       enabled: true,
  //     },
  //   };

  //   const { data: boundaryTypeDataresult } = await Digit.Hooks.useCustomAPIHook(reqCriteriaBoundaryTypeSearch);
  //   return boundaryTypeDataresult;
  // };

  // useEffect(() => {
  //   const fetchBoundaryDataForParents = async () => {
  //     if (parentArray.length >= 0) {
  //       const boundaryDataResults = await Promise.all(parentArray.map(parentCode => fetchBoundaryData(parentCode)));

  //       // Handle boundary data results here
  //       boundaryDataResults.forEach((result, index) => {
  //         // Handle each result as needed
  //         console.log(`Boundary data for parent ${parentArray[index]}:`, result);
  //       });
  //     } else {
  //       // Set parentArray to null if it's empty
  //       setParentArray(null);
  //     }
  //   };

  //   fetchBoundaryDataForParents();
  // }, [hierarchy, boundaryData, parentArray]);

  useEffect(() => {
    if (boundaryTypeDataresult && boundaryTypeDataresult.TenantBoundary) {
      if (parentArray.length === 0) {
        // Check if boundaryData is an empty object
        const updatedBoundaryData = {
          ...boundaryData,
          [boundaryTypeDataresult.TenantBoundary[0]?.boundary[0]?.boundaryType]: boundaryTypeDataresult.TenantBoundary[0]?.boundary,
        };
        setBoundaryData(updatedBoundaryData);
      }
    }
  }, [boundaryTypeDataresult]);

  const handleBoundary = (data, boundary) => {
    let res = [];
    data &&
      data?.map((ob) => {
        res.push(ob?.[1]);
      });

    console.log("res", res);
    const parentBoundaryEntry = hierarchy ? hierarchy?.boundaryHierarchy.find((e) => e.parentBoundaryType === boundary?.boundaryType) : null;
    setParentBoundaryType(parentBoundaryEntry?.parentBoundaryType);
    setBoundaryType(parentBoundaryEntry?.boundaryType);
    setParent(data?.[0]?.[1]?.code);
    const codes = res.map((item) => item.code);
    console.log("codes", codes);
    setParentArray(codes);
    const updatedBoundaryData = { ...boundaryData };
    const newBoundaryData = boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary;
    console.log("new", newBoundaryData);

    
    if (updatedBoundaryData[boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary?.[0]?.boundaryType]) {
      const existingData = updatedBoundaryData[boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary?.[0]?.boundaryType];
      const newData = newBoundaryData.filter((newItem) => !existingData.some((existingItem) => existingItem.code === newItem.code));
      updatedBoundaryData[boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary?.[0]?.boundaryType] = [...existingData, ...newData];
      console.log("updatedBoundaryData",updatedBoundaryData);
    } else {
      // If there's no existing data, simply add the new data
      updatedBoundaryData[boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary?.[0]?.boundaryType] = newBoundaryData;
    }

    setBoundaryData(updatedBoundaryData);

    fetchBoundaryTypeData();
  };

  console.log("parentArray", parentArray);

  return (
    <React.Fragment>
      <Card>
        <CardSubHeader>{t(`CAMPAIGN_SELECT_HIERARCHY`)}</CardSubHeader>
        {/* <CardText>{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</CardText> */}
        <LabelFieldPair>
          <CardLabel>{`${t("HCM_HIERARCHY_TYPE")}`} </CardLabel>
          <Dropdown
            // style={{ width: "50%" }}
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
        <React.Fragment>
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
                  options={boundaryData[boundary.boundaryType] ? boundaryData[boundary.boundaryType] : []}
                  // options={boundaryData[boundary.boundaryType]}
                  optionsKey={"code"}
                  // selected={boundaryType1}
                  onSelect={(value) => {
                    handleBoundary(value, boundary);
                  }}
                />
              </LabelFieldPair>
            ))}
          </Card>
          <InfoCard
            populators={{
              name: "infocard",
            }}
            variant="default"
            text={"HCM_SELECTING_BOUNDARIES"}
            label={"Info"}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default SelectingBoundaries;
