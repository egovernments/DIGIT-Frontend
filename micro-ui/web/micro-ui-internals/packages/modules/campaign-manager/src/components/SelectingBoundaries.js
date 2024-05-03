import React, { useEffect, useState, Fragment } from "react";
import { CardText, LabelFieldPair, Card, Header, CardLabel } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Dropdown, InfoCard, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import { mailConfig } from "../configs/mailConfig";
/**
 * The function `SelectingBoundaries` in JavaScript handles the selection of boundaries based on
 * hierarchy data and allows users to choose specific boundaries within the hierarchy.
 * @returns The `SelectingBoundaries` component is being returned. It consists of JSX elements
 * including Cards, Headers, Dropdowns, MultiSelectDropdowns, and InfoCard. The component allows users
 * to select hierarchy types and boundaries based on the data fetched from API calls. It also handles
 * the selection of boundaries and updates the state accordingly. The component is designed to be
 * interactive and user-friendly for selecting boundaries within
 */
function SelectingBoundaries({ onSelect, formData, ...props }) {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [hierarchy, setHierarchy] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.hierarchy || {});
  const [showcomponent, setShowComponent] = useState(
    props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.hierarchy || false
  );
  const [boundaryType, setBoundaryType] = useState(null);
  const [boundaryData, setBoundaryData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData || {});
  const [parentArray, setParentArray] = useState(null);
  const [boundaryTypeDataresult, setBoundaryTypeDataresult] = useState(null);
  const [selectedData, setSelectedData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData || []);
  const [parentBoundaryType, setParentBoundaryType] = useState(null);
  console.log("props", props);
  useEffect(() => {
    onSelect("boundaryType", { boundaryData: boundaryData, selectedData: selectedData, hierarchy: hierarchy });
  }, [boundaryData, selectedData, hierarchy]);
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
    // to make the boundary data object
    const boundaryDataObj = {};
    data.boundaryHierarchy.forEach((boundary) => {
      boundaryDataObj[boundary.boundaryType] = [];
    });
    setBoundaryData(boundaryDataObj);
    const boundaryWithTypeNullParent = data.boundaryHierarchy.find((boundary) => boundary.parentBoundaryType === null);
    // Set the boundary type with null parentBoundaryType
    if (boundaryWithTypeNullParent) {
      setBoundaryType(boundaryWithTypeNullParent.boundaryType);
      setParentBoundaryType(boundaryWithTypeNullParent.boundaryType);
    }
  };

  const newData = [];
  const fetchBoundaryTypeData = async () => {
    if (parentArray === null) {
      const reqCriteriaBoundaryTypeSearch = Digit.CustomService.getResponse({
        url: "/boundary-service/boundary-relationships/_search",
        params: {
          tenantId: tenantId,
          hierarchyType: hierarchy?.hierarchyType,
          boundaryType: boundaryType,
          parent: null,
        },
        body: {},
      });
      const boundaryTypeData = await reqCriteriaBoundaryTypeSearch;
      // setBoundaryTypeDataresult([boundaryTypeData]);
      setBoundaryTypeDataresult([{ parentCode: null, boundaryTypeData: boundaryTypeData }]);
    } else {
      for (const parentCode of parentArray) {
        console.log("boundaryType", boundaryType);
        const reqCriteriaBoundaryTypeSearch = Digit.CustomService.getResponse({
          url: "/boundary-service/boundary-relationships/_search",
          params: {
            tenantId: tenantId,
            hierarchyType: hierarchy?.hierarchyType,
            boundaryType: boundaryType,
            parent: parentCode,
          },
          body: {},
        });
        const boundaryTypeData = await reqCriteriaBoundaryTypeSearch;
        console.log("parentCode", parentCode, boundaryTypeData);
        newData.push({ parentCode, boundaryTypeData });
        // newData.push(boundaryTypeData);
      }
      setBoundaryTypeDataresult(newData);
    }
  };

  useEffect(() => {
    fetchBoundaryTypeData();
  }, [boundaryType, parentArray, hierarchy]);

  console.log("boundaryType", boundaryType);
  console.log("undefined", boundaryTypeDataresult?.[0]?.boundaryTypeData?.TenantBoundary?.[0]);

  useEffect(() => {
    if (boundaryTypeDataresult) {
      if (boundaryType !== undefined) {
        const updatedBoundaryData = {
          ...boundaryData,
          [boundaryType]: boundaryTypeDataresult,
        };
        console.log("updatedBoundaryData111", updatedBoundaryData);
        setBoundaryData(updatedBoundaryData);
      } else {
        const updatedBoundaryData = {
          ...boundaryData,
          [boundaryTypeDataresult?.[0]?.boundaryTypeData?.TenantBoundary?.[0]?.boundary?.[0]?.boundaryType]: boundaryTypeDataresult,
        };
        console.log("updatedBoundaryData2222", updatedBoundaryData);
        setBoundaryData(updatedBoundaryData);
      }
    }
  }, [boundaryTypeDataresult, hierarchy]);

  const handleBoundaryChange = (data, boundary) => {
    let res = [];
    data &&
      data?.map((ob) => {
        res.push(ob?.[1]);
      });

    console.log("res", res);
    const transformedRes = res?.map((item) => ({
      code: item.code,
      type: item.boundaryType,
      isRoot: item.boundaryType === parentBoundaryType,
      includeAllChildren: true,
    }));

    res.forEach((boundary) => {
      const index = transformedRes.findIndex((item) => item.code === boundary?.code);
      if (index !== -1) {
        transformedRes[index].includeAllChildren = true; // Set includeAllChildren to true for the selected boundary
      }
      // Find the parent boundary type using the hierarchy data
      const parentBoundaryType = hierarchy?.boundaryHierarchy.find((e) => e.boundaryType === boundary.boundaryType)?.parentBoundaryType;

      // If the selected boundary has a parent, set includeAllChildren to false for the parent
      if (parentBoundaryType) {
        const parentIndexes = selectedData.reduce((acc, item, index) => {
          if (item.type === parentBoundaryType) {
            acc.push(index);
          }
          return acc;
        }, []);

        parentIndexes.forEach((parentIndex) => {
          selectedData[parentIndex].includeAllChildren = false;
        });
      }
    });

    const newBoundaryType = transformedRes?.[0]?.type;
    const existingBoundaryType = selectedData.length > 0 ? selectedData?.[0]?.type : null;

    if (existingBoundaryType === newBoundaryType) {
      // Update only the data for the specific boundaryType
      const updatedSelectedData = selectedData?.map((item) => {
        if (item.type === newBoundaryType) {
          return transformedRes;
        } else {
          return item;
        }
      });
      console.log("updatedSelectedData", updatedSelectedData);
      setSelectedData(updatedSelectedData);
    } else {
      // Update only the data for the new boundaryType
      // setSelectedData([...selectedData.filter((item) => item.type !== newBoundaryType), ...transformedRes]);
      const mergedData = [...selectedData.filter((item) => item.type !== newBoundaryType), ...transformedRes];

      // Filter out items with undefined type
      const filteredData = mergedData.filter((item, index, self) => item.type !== undefined && index === self.findIndex((t) => t.code === item.code));

      setSelectedData(filteredData);
    }

    // setSelectedData(res);
    console.log("res", res);
    const parentBoundaryEntry = hierarchy ? hierarchy?.boundaryHierarchy.find((e) => e.parentBoundaryType === res?.[0]?.boundaryType) : null;

    // const boundaryTypeToParentMap = {};
    // hierarchy.boundaryHierarchy.forEach((boundary) => {
    //   boundaryTypeToParentMap[boundary.boundaryType] = boundary.parentBoundaryType;
    // });

    // // Now you can use this map to find the parentBoundaryType for a given boundaryType
    // const boundaryType = res?.[0]?.boundaryType; // Assuming res contains the boundary objects
    // const parentBoundaryType111 = boundaryTypeToParentMap[boundaryType];
    // console.log("boundaryTypeToParentMap", boundaryTypeToParentMap);
    // console.log("boundaryType7777", boundaryType);

    // console.log("parentBoundaryType111", parentBoundaryType111);
    // console.log("parentBoundaryEntry" , parentBoundaryEntry);

    // Assuming hierarchy contains the hierarchy data
    // const boundaryType = res?.[0]?.type; // Assuming res contains the boundary objects
    // let parentBoundaryType1111 = boundaryType; // Start with the boundary type itself as the parent

    // // Find the parent boundary type using the hierarchy data
    // const parentBoundary = hierarchy?.boundaryHierarchy.find((e) => e.boundaryType === boundaryType);
    // if (parentBoundary && parentBoundary.parentBoundaryType !== null) {
    //   parentBoundaryType = parentBoundary.parentBoundaryType; // If parent exists, update the parent boundary type
    // }

    // console.log("Parent Boundary Type:", parentBoundaryType1111);

    setBoundaryType(parentBoundaryEntry?.boundaryType);
    const codes = res.map((item) => item.code);
    if (JSON.stringify(codes) !== JSON.stringify(parentArray)) {
      setParentArray(codes);
    }
  };

  console.log("boundaryData", boundaryData);
  console.log("selectedData", selectedData);
  console.log("boundaryTypeDataResult", boundaryTypeDataresult);
  return (
    <>
      <Card>
        <Header>{t(`CAMPAIGN_SELECT_HIERARCHY`)} </Header>
        <LabelFieldPair>
          <CardLabel>
            {`${t("HCM_HIERARCHY_TYPE")}`}
            <span className="mandatory-span">*</span>
          </CardLabel>
          <div className="digit-field">
            {" "}
            <Dropdown
              t={t}
              option={hierarchyTypeDataresult?.BoundaryHierarchy}
              optionKey={"hierarchyType"}
              selected={hierarchy}
              select={(value) => {
                handleChange(value);
              }}
            />
          </div>
        </LabelFieldPair>
      </Card>
      {showcomponent && (
        <Card>
          <div className="selecting-boundary-div">
            <Header>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</Header>
            <CardText>{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</CardText>
            {/* {hierarchy?.boundaryHierarchy.map((boundary, index) => (
              <LabelFieldPair key={index}>
                <CardLabel>
                  {boundary.boundaryType}
                  <span className="mandatory-span">*</span>
                </CardLabel>
                <div className="digit-field">
                <MultiSelectDropdown
                  t={t}
                  // option={boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary}
                  // options={boundaryData[boundary.boundaryType]?.map((item) => item?.TenantBoundary?.[0]?.boundary).flat() || []}

                  options={boundaryData[boundary.boundaryType]?.map((item) => ({
                    code: item.parentCode,
                    name: "hello",
                    options: item?.boundaryTypeData?.TenantBoundary?.[0]?.boundary.map((child) => ({
                      code: child.code,
                      boundaryType: child.boundaryType
                    })) || []
                  })) || []} 
                  
                  optionsKey={"code"}
                  // selected={selectedData.filter(item => item.type === boundary.boundaryType)}
                  onSelect={(value) => {
                    handleBoundaryChange(value, boundary);
                  }}
                  variant="nestedmultiselect"
                />
                </div>
              </LabelFieldPair>
            ))} */}
            {hierarchy?.boundaryHierarchy.map((boundary, index) =>
              boundary.parentBoundaryType == null ? (
                <LabelFieldPair key={index}>
                  <CardLabel>
                    {boundary.boundaryType}
                    <span className="mandatory-span">*</span>
                  </CardLabel>
                  <div className="digit-field">
                    <MultiSelectDropdown
                      t={t}
                      options={boundaryData[boundary.boundaryType]?.map((item) => item?.boundaryTypeData?.TenantBoundary?.[0]?.boundary).flat() || []}
                      optionsKey={"code"}
                      selected={selectedData.filter((item) => item.type === boundary.boundaryType)}
                      onSelect={(value) => {
                        handleBoundaryChange(value, boundary);
                      }}
                    />
                  </div>
                </LabelFieldPair>
              ) : (
                <LabelFieldPair key={index}>
                  <CardLabel>
                    {boundary.boundaryType}
                    <span className="mandatory-span">*</span>
                  </CardLabel>
                  <div className="digit-field">
                    <MultiSelectDropdown
                      t={t}
                      options={
                        boundaryData[boundary.boundaryType]?.map((item) => ({
                          code: item.parentCode,
                          options:
                            item?.boundaryTypeData?.TenantBoundary?.[0]?.boundary.map((child) => ({
                              code: child.code,
                              boundaryType: child.boundaryType,
                            })) || [],
                        })) || []
                      }
                      optionsKey={"code"}
                      onSelect={(value) => {
                        handleBoundaryChange(value, boundary);
                      }}
                      selected={selectedData.filter((item) => item.type === boundary.boundaryType)}
                      addCategorySelectAllCheck={true}
                      addSelectAllCheck={true}
                      variant="nestedmultiselect"
                    />
                  </div>
                </LabelFieldPair>
              )
            )}
          </div>
        </Card>
      )}
      {showcomponent && (
        <InfoCard
          populators={{
            name: "infocard",
          }}
          variant="default"
          style={{ marginLeft: "0rem", maxWidth: "100%" }}
          additionalElements={[
            <span>
              {t("HCM_BOUNDARY_INFO ")}
              <a href={`mailto:${mailConfig.mailId}`} style={{ color: "black" }}>
                {t("L1team@email.com")}
              </a>
            </span>,
          ]}
          label={"Info"}
        />
      )}
    </>
  );
}
export default SelectingBoundaries;
