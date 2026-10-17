import { CardLabel, Dropdown, LabelFieldPair, Loader, RemoveableTag, MultiSelectDropdown } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import cleanup from "../Utils/cleanup";

/**
 * The boundary-relationships API and the older MDMS TenantBoundary payload disagree
 * on whether hierarchyType is a plain string or an object with a `code`.
 * Normalise once here so comparisons downstream are unambiguous.
 */
const getHierarchyCode = (entry) => (typeof entry?.hierarchyType === "string" ? entry?.hierarchyType : entry?.hierarchyType?.code);

/**
 * Boundary nodes are returned as a tree when includeChildren=true, so the
 * boundary types we need for the dropdown are spread across every depth.
 */
const flattenBoundaries = (nodes = []) => {
  const out = [];
  const walk = (list) => {
    (list || []).forEach((node) => {
      if (!node) return;
      out.push(node);
      walk(node.children);
    });
  };
  walk(nodes);
  return out;
};

const getBoundaryTypeLabel = (boundary) => boundary?.boundaryType || boundary?.label;

const makeDefaultValues = (sessionFormData) => {
  return sessionFormData?.Jurisdictions?.map((ele, index) => {
    return {
      key: index,
      hierarchy: {
        code: ele?.hierarchy,
        name: ele?.hierarchy,
      },
      boundaryType: {
        label: ele?.boundaryType,
        i18text: ele?.boundaryType ? Digit.Utils.locale.convertToLocale(ele.boundaryType, "EGOV_LOCATION_BOUNDARYTYPE") : null,
      },
      boundary: { code: ele?.boundary },
      roles: ele?.roles,
    };
  });
};

const Jurisdictions = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [inactiveJurisdictions, setInactiveJurisdictions] = useState([]);
  const [boundaryData, setBoundaryData] = useState();
  const [isBoundaryLoading, setIsBoundaryLoading] = useState(true);
  const { data: data = {}, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  const employeeCreateSession = Digit.Hooks.useSessionStorage("NEW_EMPLOYEE_CREATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = employeeCreateSession;
  const isEdit = window.location.href.includes("hrms/edit");
  const [jurisdictions, setjurisdictions] = useState(
    !isEdit && sessionFormData?.Jurisdictions?.length > 0
      ? makeDefaultValues(sessionFormData)
      : formData?.Jurisdictions || [
          {
            id: undefined,
            key: 1,
            hierarchy: null,
            boundaryType: null,
            boundary: null,
            roles: [],
          },
        ],
  );

  useEffect(() => {
    fetchDetailsForSelectedOption();
  }, []);

  const fetchDetailsForSelectedOption = async () => {
    const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
    const boundaryType = window?.globalConfigs?.getConfig("BOUNDARY_TYPE") || "Locality";

    try {
      const response = await Digit.CustomService.getResponse({
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
      setBoundaryData(response);
    } catch (error) {
      console.error("Error fetching boundary relationships:", error);
      setBoundaryData(null);
    } finally {
      setIsBoundaryLoading(false);
    }
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
      [...jurisdictionsData, ...inactiveJurisdictions].filter((value) => Object.keys(value).length !== 0),
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

  const [focusIndex, setFocusIndex] = useState(-1);

  function gethierarchylistdata() {
    const seen = new Set();
    return (boundaryData?.["TenantBoundary"] || []).reduce((acc, ele) => {
      const code = getHierarchyCode(ele);
      if (!code || seen.has(code)) return acc;
      seen.add(code);
      acc.push({ name: code, code: code });
      return acc;
    }, []);
  }

  function getroledata() {
    return data?.MdmsRes?.["ACCESSCONTROL-ROLES"]?.roles?.map((role) => {
      return { code: role.code, name: role?.name ? role?.name : " ", labelKey: "ACCESSCONTROL_ROLES_ROLES_" + role.code };
    });
  }

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
  getroledata,
  roleoption,
  index,
  boundaryData,
}) {
  const [BoundaryType, selectBoundaryType] = useState([]);
  const [Boundary, selectboundary] = useState([]);
  const { data: cities, isCityLoading } = Digit.Hooks.useTenants();

  /**
   * Populate the boundary type dropdown from the boundary hierarchy that matches
   * the selected hierarchy. Previously this list was hardcoded to "City", so any
   * deployment using a different hierarchy had no usable options. See issue #3929.
   */
  useEffect(() => {
    const selectedHierarchy = jurisdiction?.hierarchy?.code;
    if (!selectedHierarchy) {
      selectBoundaryType([]);
      return;
    }

    const matched = (boundaryData?.["TenantBoundary"] || []).filter((ele) => getHierarchyCode(ele) === selectedHierarchy);

    const seenTypes = new Set();
    const uniqueByType = [];

    matched.forEach((item) => {
      const boundaries = Array.isArray(item?.boundary) ? item.boundary : Object.values(item?.boundary || {});
      flattenBoundaries(boundaries).forEach((boundary) => {
        const label = getBoundaryTypeLabel(boundary);
        if (!label || seenTypes.has(label)) return;
        seenTypes.add(label);
        uniqueByType.push({
          ...boundary,
          label,
          i18text: Digit.Utils.locale.convertToLocale(label, "EGOV_LOCATION_BOUNDARYTYPE"),
        });
      });
    });

    selectBoundaryType(uniqueByType);
  }, [jurisdiction?.hierarchy, boundaryData]);

  const tenant = Digit.ULBService.getCurrentTenantId();

  const { data: TenantMngmtSearch, isLoading: isLoadingTenantMngmtSearch } = Digit.Hooks.useTenantManagementSearch({
    stateId: Digit.ULBService.getStateId(),
    includeSubTenants: true,
    config: {
      enabled: Digit.Utils.getMultiRootTenant(),
    },
  });

  useEffect(() => {
    if (Digit.Utils.getMultiRootTenant()) {
      selectboundary(cities);
      return;
    }

    const allTenants = data?.MdmsRes?.tenant?.tenants || [];

    if (allTenants.length === 1) {
      const onlyTenant = { ...allTenants[0], i18text: Digit.Utils.locale.getCityLocale(allTenants[0].code) };
      selectboundary([onlyTenant]);
      selectedboundary(onlyTenant);
      return;
    }

    selectboundary(
      allTenants
        .filter((city) => city.code !== Digit.ULBService.getStateId())
        .map((city) => ({ ...city, i18text: Digit.Utils.locale.getCityLocale(city.code) })),
    );
  }, [jurisdiction?.boundaryType, data?.MdmsRes, cities]);

  useEffect(() => {
    if (Boundary?.length > 0) {
      selectedboundary(Boundary.find((ele) => ele.code === jurisdiction?.boundary?.code));
    }
  }, [Boundary]);

  const selectHierarchy = (value) => {
    const hierarchy = {
      code: value?.code,
      name: value?.name,
    };
    // Clear the dependent boundary type so a stale selection from the previous
    // hierarchy is not submitted.
    setjurisdictions((prev) => prev.map((item) => (item.key === jurisdiction.key ? { ...item, hierarchy, boundaryType: null } : item)));
  };

  const selectboundaryType = (value) => {
    const boundaryType = {
      label: getBoundaryTypeLabel(value),
      i18text: value?.i18text,
    };
    setjurisdictions((prev) => prev.map((item) => (item.key === jurisdiction.key ? { ...item, boundaryType } : item)));
  };

  const selectedboundary = (value) => {
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, boundary: value } : item)));
  };

  const selectrole = (e, data) => {
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
            option={gethierarchylistdata() || []}
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
