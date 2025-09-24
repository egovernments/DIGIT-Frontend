import { CardLabel, Dropdown, LabelFieldPair, Loader, RemoveableTag, MultiSelectDropdown } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import cleanup from "../Utils/cleanup";
// import MultiSelectDropdown from "./Multiselect";

const makeDefaultValues = (sessionFormData) => {
  return sessionFormData?.Jurisdictions?.map((ele, index) => {
    return {
      key: index,
      hierarchy: {
        code: ele?.hierarchy,
        name: ele?.hierarchy,
      },
      boundaryType: { label: ele?.boundaryType, i18text: ele.boundaryType ? `EGOV_LOCATION_BOUNDARYTYPE_${ele.boundaryType?.toUpperCase()}` : null },
      boundary: { code: ele?.boundary },
      roles: ele?.roles,
    }
  })
}

const Jurisdictions = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [inactiveJurisdictions, setInactiveJurisdictions] = useState([]);
  const [boundaryData, setBoundaryData] = useState();
  const { data: data = {}, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  // const { data: boundaryData = {}, isLoadingBoundary } = Digit.Hooks.hrms.useHrmsMDMS(tenantId,"FetchBoundaries") || {};
  const employeeCreateSession = Digit.Hooks.useSessionStorage("NEW_EMPLOYEE_CREATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = employeeCreateSession;
  const isEdit = window.location.href.includes("hrms/edit")
  const [jurisdictions, setjurisdictions] = useState(
    !isEdit && sessionFormData?.Jurisdictions?.length > 0 ? makeDefaultValues(sessionFormData) : (formData?.Jurisdictions || [
      {
        id: undefined,
        key: 1,
        hierarchy: null,
        boundaryType: null,
        boundary: null,
        roles: [],
      },
    ])
  );

  useEffect(() => {
    fetchDetailsForSelectedOption();
  }, [])

  const fetchDetailsForSelectedOption = async () => {
    const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
    const boundaryType = window?.globalConfigs?.getConfig("BOUNDARY_TYPE") || "Locality";

    let response = null;

    try {
      response = await Digit.CustomService.getResponse({
        url: `/boundary-service/boundary-relationships/_search`,
        useCache: false,
        method: "POST",
        userService: false,
        params: {
          tenantId: tenantId,
          hierarchyType: hierarchyType,
          boundaryType: boundaryType,
          includeChildren: true,
        },
      });
    } catch (error) {
      console.error("Error fetching boundary relationships:", error);
      // Optional: Handle fallback or notify user
    }

    const result = await response;
    setBoundaryData(result);
  };



  useEffect(() => {
    const jurisdictionsData = jurisdictions?.map((jurisdiction) => {
      let res = {
        id: jurisdiction?.id,
        hierarchy: jurisdiction?.hierarchy?.code,
        boundaryType: jurisdiction?.boundaryType?.label,
        boundary: jurisdiction?.boundary?.code,
        tenantId: jurisdiction?.boundary?.code,
        auditDetails: jurisdiction?.auditDetails,
      };
      res = cleanup(res);
      if (jurisdiction?.roles) {
        res["roles"] = jurisdiction?.roles?.map((ele) => {
          delete ele.description;
          return ele;
        });
      }
      return res;
    });

    onSelect(
      config.key,
      [...jurisdictionsData, ...inactiveJurisdictions].filter((value) => Object.keys(value).length !== 0)
    );
  }, [jurisdictions]);




  const reviseIndexKeys = () => {
    setjurisdictions((prev) => prev.map((unit, index) => ({ ...unit, key: index })));
  };

  const handleAddUnit = () => {
    setjurisdictions((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        hierarchy: null,
        boundaryType: null,
        boundary: null,
        roles: [],
      },
    ]);
  };
  const handleRemoveUnit = (unit) => {
    if (unit.id) {
      let res = {
        id: unit?.id,
        hierarchy: unit?.hierarchy?.code,
        boundaryType: unit?.boundaryType?.label,
        boundary: unit?.boundary?.code,
        tenantId: unit?.boundary?.code,
        auditDetails: unit?.auditDetails,
        isdeleted: true,
        isActive: false,
      };
      res = cleanup(res);
      if (unit?.roles) {
        res["roles"] = unit?.roles.map((ele) => {
          delete ele.description;
          return ele;
        });
      }
      setInactiveJurisdictions([...inactiveJurisdictions, res]);
    }
    setjurisdictions((prev) => prev.filter((el) => el.key !== unit.key));
    if (FormData.errors?.Jurisdictions?.type == unit.key) {
      clearErrors("Jurisdictions");
    }
    reviseIndexKeys();
  };
  let hierarchylist = [];
  let boundaryTypeoption = [];
  const [focusIndex, setFocusIndex] = useState(-1);




  function gethierarchylistdata() {
    return boundaryData?.["TenantBoundary"]?.map((ele, index) => ({
      name: ele.hierarchyType,
      // name: Digit.Utils.locale.convertToLocale(ele.hierarchyType, 'EGOV_LOCATION_BOUNDARYTYPE'),
      code: ele.hierarchyType,
    })) || [];
  }

  function getboundarydata() {
    return [];
  }

  function getroledata() {
    return data?.MdmsRes?.["ACCESSCONTROL-ROLES"]?.roles?.map(role => { return { code: role.code, name: role?.name ? role?.name : " ", labelKey: 'ACCESSCONTROL_ROLES_ROLES_' + role.code } });
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {jurisdictions?.map((jurisdiction, index) => (
        <Jurisdiction
          t={t}
          formData={formData}
          jurisdictions={jurisdictions}
          key={index}
          keys={jurisdiction.key}
          data={data}
          jurisdiction={jurisdiction}
          setjurisdictions={setjurisdictions}
          index={index}
          focusIndex={focusIndex}
          setFocusIndex={setFocusIndex}
          gethierarchylistdata={gethierarchylistdata}
          hierarchylist={hierarchylist}
          boundaryTypeoption={boundaryTypeoption}
          getboundarydata={getboundarydata}
          getroledata={getroledata}
          handleRemoveUnit={handleRemoveUnit}
          boundaryData={boundaryData}
        />
      ))}
      <label onClick={handleAddUnit} className="link-label" style={{ width: "12rem" }}>
        {t("HR_ADD_JURISDICTION")}
      </label>
    </div>
  );
};
function Jurisdiction({
  t,
  data,
  jurisdiction,
  jurisdictions,
  setjurisdictions,
  gethierarchylistdata,
  handleRemoveUnit,
  hierarchylist,
  getroledata,
  roleoption,
  index,
  boundaryData
}) {

  // {
  //       key: index,
  //       hierarchy: {
  //         code: ele?.hierarchy,
  //         name: ele?.hierarchy,
  //       },
  //       boundaryType: { label: ele?.boundaryType, i18text: ele.boundaryType ? `EGOV_LOCATION_BOUNDARYTYPE_${ele.boundaryType?.toUpperCase()}` : null },
  //       boundary: { code: ele?.boundary },
  //       roles: ele?.roles,
  //     }
  const [BoundaryType, selectBoundaryType] = useState([
    { label: "City", i18text: Digit.Utils.locale.convertToLocale("City", "EGOV_LOCATION_BOUNDARYTYPE") }
  ]);
  const [Boundary, selectboundary] = useState([]);
  const { data: cities, isCityLoading } = Digit.Hooks.useTenants();

  useEffect(() => {
    //   var boundaryDataTemp =  boundaryData;
    //     const matched = boundaryDataTemp?.["TenantBoundary"]?.filter(
    //   (ele) => ele?.hierarchyType?.code === jurisdiction?.hierarchy?.code
    // );

    // const boundaryTypeList = matched?.flatMap((item) => {
    //   const boundaries = Object.values(item.boundary || {});
    //   return boundaries.map((b) => ({
    //     ...b,
    //     i18text: Digit.Utils.locale.convertToLocale(
    //       b.boundaryType,
    //       "EGOV_LOCATION_BOUNDARYTYPE"
    //     ),
    //   }));
    // });

    // const uniqueByType = [];
    // const seenTypes = new Set();

    // for (const b of boundaryTypeList || []) {
    //   if (!seenTypes.has(b.boundaryType)) {
    //     seenTypes.add(b.boundaryType);
    //     uniqueByType.push(b);
    //   }
    // }

    // selectBoundaryType(uniqueByType);

  }, [jurisdiction?.hierarchy, data?.MdmsRes]);


  const tenant = Digit.ULBService.getCurrentTenantId();

  const { data: TenantMngmtSearch, isLoading: isLoadingTenantMngmtSearch } = Digit.Hooks.useTenantManagementSearch({
    stateId: Digit.ULBService.getStateId(),
    includeSubTenants: true,
    config: {
      enabled: Digit.Utils.getMultiRootTenant()
    }
  });

  useEffect(() => {
    if (Digit.Utils.getMultiRootTenant()) {
      selectboundary(cities);
    }
    else {
      const tenantList =
        data?.MdmsRes?.tenant?.tenants
          .filter((city) => city.code !== Digit.ULBService.getStateId())
          .map((city) => ({
            ...city,
            i18text: Digit.Utils.locale.getCityLocale(city.code),
          }));

      selectboundary(tenantList);

      let allTenant = data?.MdmsRes?.tenant?.tenants?.map((city) => ({
        ...city,
        i18text: Digit.Utils.locale.getCityLocale(city.code),
      }))
          
      if ( data?.MdmsRes?.tenant?.tenants?.length === 1) {
        selectboundary(allTenant);
        selectedboundary(allTenant?.[0]);
      }
    }
  }, [jurisdiction?.boundaryType, data?.MdmsRes, cities]);



  useEffect(() => {
    if (Boundary?.length > 0) {
      selectedboundary(Boundary?.filter((ele) => ele.code == jurisdiction?.boundary?.code)[0]);
    }
  }, [Boundary]);

  // const selectHierarchy = (value) => {
  //   setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, hierarchy: value } : item)));
  // };

  const selectHierarchy = (value) => {
    const hierarchy = {
      code: value?.code,
      name: value?.name,
    };
    setjurisdictions((prev) =>
      prev.map((item) =>
        item.key === jurisdiction.key ? { ...item, hierarchy } : item
      )
    );
  };




  const selectboundaryType = (value) => {
    const boundaryType = {
      label: value?.label,
      i18text: value?.i18text,
    };
    setjurisdictions((prev) =>
      prev.map((item) =>
        item.key === jurisdiction.key ? { ...item, boundaryType } : item
      )
    );
  };

  const selectedboundary = (value) => {
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, boundary: value } : item)));
  };

  const selectrole = (e, data) => {
    // const index = jurisdiction?.roles.filter((ele) => ele.code == data.code);
    // let res = null;
    // if (index.length) {
    //   jurisdiction?.roles.splice(jurisdiction?.roles.indexOf(index[0]), 1);
    //   res = jurisdiction.roles;
    // } else {
    //   res = [{ ...data }, ...jurisdiction?.roles];
    // }
    let res = [];
    e && e?.map((ob) => {
      res.push(ob?.[1]);
    });

    res?.forEach(resData => { resData.labelKey = 'ACCESSCONTROL_ROLES_ROLES_' + resData.code })


    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, roles: res } : item)));
  };


  const onRemove = (index, key) => {
    let afterRemove = jurisdiction?.roles.filter((value, i) => {
      return i !== index;
    });
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, roles: afterRemove } : item)));

  };

  return (
    <div key={jurisdiction?.keys} style={{ marginBottom: "16px" }}>
      <div style={{ border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px" }}>
        <LabelFieldPair>
          <div className="label-field-pair" style={{ width: "100%" }}>
            <h2 className="card-label card-label-smaller" style={{ color: "#505A5F" }}>
              {t("HR_JURISDICTION")} {index + 1}
            </h2>
          </div>
          {jurisdictions.length > 1 ? (
            <div
              onClick={() => handleRemoveUnit(jurisdiction)}
              style={{ marginBottom: "16px", padding: "5px", cursor: "pointer", textAlign: "right" }}
            >
              X
            </div>
          ) : null}
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel isMandatory={true} className="card-label-smaller">{`${t("HR_HIERARCHY_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            selected={jurisdiction?.hierarchy}
            disable={false}
            isMandatory={true}
            option={gethierarchylistdata(hierarchylist) || []}
            select={selectHierarchy}
            optionKey={Digit.Utils.getMultiRootTenant() ? "code" : "name"}
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{`${t("HR_BOUNDARY_TYPE_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            isMandatory={true}
            selected={jurisdiction?.boundaryType}
            disable={BoundaryType?.length === 0}
            option={BoundaryType}
            select={selectboundaryType}
            optionKey="i18text"
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{`${t("HR_BOUNDARY_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            isMandatory={true}
            selected={jurisdiction?.boundary}
            //disable={Boundary?.length === 0}
            option={Boundary}
            select={selectedboundary}
            optionKey={"name"}
            t={t}
          />
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("HR_COMMON_TABLE_COL_ROLE")} *</CardLabel>
          <div className="form-field">
            <MultiSelectDropdown
              className="form-field"
              isMandatory={true}
              defaultUnit="Selected"
              selected={jurisdiction?.roles}
              options={getroledata(roleoption)}
              onSelect={selectrole}
              optionsKey="labelKey"
              t={t}
            />
            <div className="tag-container">
              {jurisdiction?.roles.length > 0 &&
                jurisdiction?.roles.map((value, index) => {
                  return <RemoveableTag key={index} text={`${t(value["labelKey"]).slice(0, 22)} ...`} onClick={() => onRemove(index, value)} />;
                })}
            </div>
          </div>
        </LabelFieldPair>
      </div>
    </div>
  );
}

export default Jurisdictions;
