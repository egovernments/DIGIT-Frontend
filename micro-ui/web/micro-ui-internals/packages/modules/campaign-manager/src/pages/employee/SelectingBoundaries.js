import React, { useEffect, useState, Fragment } from "react";
import { CardText, LabelFieldPair, Card, Header, CardLabel, CardSubHeader, TypeSelectCard, Button } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Dropdown, InfoCard, MultiSelectDropdown } from "@egovernments/digit-ui-components";
function SelectingBoundaries({ onSelect, formData, ...props }) {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [hierarchy, setHierarchy] = useState({});
  const [showcomponent, setShowComponent] = useState(false);
  const [boundaryType, setBoundaryType] = useState(null);
  const [parentBoundaryType, setParentBoundaryType] = useState(null);
  const [boundaryData, setBoundaryData] = useState({});
  const [parentArray, setParentArray] = useState(null);
  const [boundaryTypeDataresult, setBoundaryTypeDataresult] = useState(null);
  useEffect(() => {
    onSelect("boundaryType", boundaryData);
  }, [boundaryData]);

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
      setBoundaryTypeDataresult([boundaryTypeData]);
    } else {
      for (const parentCode of parentArray) {
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
        newData.push(boundaryTypeData);
      }
      setBoundaryTypeDataresult(newData);
    }
  };

  useEffect(() => {
    fetchBoundaryTypeData();
  }, [boundaryType, parentArray, hierarchy]);

  useEffect(() => {
    if (boundaryTypeDataresult && boundaryTypeDataresult[0]?.TenantBoundary) {
      if (boundaryType !== undefined) {
        const updatedBoundaryData = {
          ...boundaryData,
          [boundaryType]: boundaryTypeDataresult,
        };
        setBoundaryData(updatedBoundaryData);
      } else {
        const updatedBoundaryData = {
          ...boundaryData,
          [boundaryTypeDataresult?.[0]?.TenantBoundary?.[0]?.boundary?.[0]?.boundaryType]: boundaryTypeDataresult,
        };
        setBoundaryData(updatedBoundaryData);
      }
    }
  }, [boundaryTypeDataresult]);

  const handleBoundaryChange = (data, boundary) => {
    let res = [];
    data &&
      data?.map((ob) => {
        res.push(ob?.[1]);
      });
    const parentBoundaryEntry = hierarchy ? hierarchy?.boundaryHierarchy.find((e) => e.parentBoundaryType === res?.[0]?.boundaryType) : null;
    setBoundaryType(parentBoundaryEntry?.boundaryType);
    const codes = res.map((item) => item.code);
    if (JSON.stringify(codes) !== JSON.stringify(parentArray)) {
      setParentArray(codes);
    }
  };

  return (
    <>
      <Card>
        <Header>{t(`CAMPAIGN_SELECT_HIERARCHY`)} </Header>
        <LabelFieldPair>
          <CardLabel>
            {`${t("HCM_HIERARCHY_TYPE")}`}
            <span className="mandatory-span">*</span>
          </CardLabel>
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
        <Card>
          <div className="selecting-boundary-div">
            <Header>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</Header>
            <CardText>{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</CardText>
            {hierarchy?.boundaryHierarchy.map((boundary, index) => (
              <LabelFieldPair key={index}>
                <CardLabel>
                  {boundary.boundaryType}
                  <span className="mandatory-span">*</span>
                </CardLabel>
                <MultiSelectDropdown
                  style={{ width: "300%" }}
                  t={t}
                  // option={boundaryTypeDataresult?.TenantBoundary?.[0]?.boundary}
                  options={boundaryData[boundary.boundaryType]?.map((item) => item?.TenantBoundary?.[0]?.boundary).flat() || []}
                  optionsKey={"code"}
                  // selected={boundaryType}
                  onSelect={(value) => {
                    handleBoundaryChange(value, boundary);
                  }}
                />
              </LabelFieldPair>
            ))}
          </div>
        </Card>
      )}
      {showcomponent && (
        <InfoCard
          populators={{
            name: "infocard",
          }}
          variant="default"
          additionalElements={[
            <span>
              {t("HCM_BOUNDARY_INFO ")}
              <a href={`mailto:L1team@email.com`}>{t("L1team@email.com")}</a>
            </span>,
          ]}
          label={"Info"}
        />
      )}
    </>
  );
}

export default SelectingBoundaries;
