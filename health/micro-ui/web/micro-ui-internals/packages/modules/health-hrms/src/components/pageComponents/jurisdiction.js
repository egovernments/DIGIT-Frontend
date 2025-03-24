import { CardLabel, Dropdown, LabelFieldPair, Loader, RemoveableTag, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useMemo } from "react";
import cleanup from "../Utils/cleanup";
import { BoundaryTypes } from "../../constants/enums";
// import MultiSelectDropdown from "./Multiselect";

const Jurisdictions = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const [inactiveJurisdictions, setInactiveJurisdictions] = useState([]);
  const userProjectDetails = Digit.SessionStorage.get("currentProject");
  const { data: data = {}, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  
  const { datak: boundaryData = {}, isBoundaryLoading } = Digit.Hooks.hrms.useBoundriesFetch(tenantId);

  const [jurisdictions, setjurisdictions] = useState(
    formData?.Jurisdictions || [
      {
        id: undefined,
        key: 1,
        hierarchy: hierarchyType,
        boundaryType: userProjectDetails?.[0]?.address?.boundaryType, //TODO: if national level boundary data label is changed in mdms, this must be changed
        boundary: userProjectDetails?.[0]?.address?.boundary,
        roles: [],
      },
    ]
  );

  useEffect(() => {
    const jurisdictionsData = jurisdictions?.map((jurisdiction) => {
      let res = {
        id: jurisdiction?.id,
        hierarchy: jurisdiction?.hierarchy?.code || hierarchyType,
        boundaryType: jurisdiction?.boundaryType || BoundaryTypes.NATIONAL,
        boundary: jurisdiction?.boundary || userProjectDetails?.[0]?.address?.boundary || tenantId,
        tenantId: tenantId,
        auditDetails: jurisdiction?.auditDetails,
      };
      res = cleanup(res);
      if (jurisdiction?.roles) {
        res["roles"] = jurisdiction?.roles.map((ele) => {
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
        boundary: unit?.boundary,
        tenantId: tenantId,
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
    return boundaryData?.TenantBoundary?.map((ele) => ele?.hierarchyType);
  }

  function getboundarydata() {
    return [];
  }

  function getroledata() {
    const p = data?.MdmsRes?.["ACCESSCONTROL-ROLES"].roles.map((role) => {
      return { code: role.code, name: role?.name ? role?.name : " ", labelKey: "ACCESSCONTROL_ROLES_ROLES_" + role.code, tenantId: tenantId };
    });
   
    return p;
  }

  console.log("Jurisdictions: ", jurisdictions);
  if (isLoading || isBoundaryLoading) {
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
        />
      ))}
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
}) {
  const [BoundaryType, selectBoundaryType] = useState([]);
  const [Boundary, selectboundary] = useState([]);
 
  useEffect(() => {
    selectBoundaryType(
      data?.MdmsRes?.["egov-location"]?.["TenantBoundary"]
        .filter((ele) => {
          return ele?.hierarchyType?.code == jurisdiction?.hierarchy?.code;
        })
        .map((item) => {
          return { ...item.boundary, i18text: Digit.Utils.locale.convertToLocale(item.boundary.label, "EGOV_LOCATION_BOUNDARYTYPE") };
        })
    );
  }, [jurisdiction?.hierarchy, data?.MdmsRes]);
  const tenant = Digit.ULBService.getCurrentTenantId();
  useEffect(() => {
    selectboundary(
      data?.MdmsRes?.tenant?.tenants.map((city) => {
        return { ...city, i18text: Digit.Utils.locale.getCityLocale(city.code) };
      })
    );
  }, [jurisdiction?.boundaryType, data?.MdmsRes]);

  // useEffect(() => {
  //   if (Boundary?.length > 0) {
  //     selectedboundary(Boundary?.filter((ele) => ele.code == jurisdiction?.boundary?.code)[0]);
  //   }
  // }, [Boundary]);

  const selectHierarchy = (value) => {
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, hierarchy: value } : item)));
  };

  const selectboundaryType = (value) => {
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, boundaryType: value } : item)));
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
    e &&
      e?.map((ob) => {
        res.push(ob?.[1]);
      });

    res?.forEach((resData) => {
      resData.labelKey = "ACCESSCONTROL_ROLES_ROLES_" + resData.code;
    });
   
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, roles: res } : item)));
  };

  const onRemove = (index, key) => {
    let afterRemove = jurisdiction?.roles.filter((value, i) => {
      return i !== index;
    });
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, roles: afterRemove } : item)));
  };
  const getJurisdictionRoles = useMemo(() => {
    jurisdiction?.roles.map((role) => {
      if (!role.labelKey) {
        role.labelKey = "ACCESSCONTROL_ROLES_ROLES_" + role.code;
      }
    });
    return jurisdiction?.roles;
  }, [jurisdiction]);

  return (
    <div key={jurisdiction?.keys} style={{ marginBottom: "16px" }}>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("HR_COMMON_TABLE_COL_ROLE")} *</CardLabel>
        <div className="form-field">
          <MultiSelectDropdown
            className="form-field"
            isMandatory={true}
            defaultUnit="Selected"
            selected={getJurisdictionRoles}
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
  );
}

export default Jurisdictions;
