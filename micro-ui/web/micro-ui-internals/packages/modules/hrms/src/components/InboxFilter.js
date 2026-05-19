import { ActionBar, ApplyFilterBar, CloseSvg, Dropdown, RadioButtons, RemoveableTag, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCityThatUserhasAccess } from "./Utils";

const Filter = ({ searchParams, onFilterChange, onSearch, removeParam, ...props }) => {
  
  const [filters, onSelectFilterRoles] = useState(searchParams?.filters?.role || { role: [] });
  const [_searchParams, setSearchParams] = useState(() => searchParams);
  const [selectedRoles, onSelectFilterRolessetSelectedRole] = useState(null);
  const { t } = useTranslation();
  const tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");

  // In multi-root tenant mode (or when no HRMS_TENANTS list is seeded) there is only one
  // tenant in scope. Surface it as the single dropdown option so the filter doesn't render empty.
  const ulbOptions = (() => {
    const accessible = getCityThatUserhasAccess(tenantIds);
    if (Digit.Utils.getMultiRootTenant?.() || !accessible || accessible.length === 0) {
      const currentTenantId = Digit.ULBService.getCurrentTenantId();
      return [{
        code: currentTenantId,
        name: currentTenantId,
        i18text: Digit.Utils.locale.getCityLocale(currentTenantId),
      }];
    }
    return accessible
      .sort((x, y) => x?.name?.localeCompare(y?.name))
      .map((city) => ({ ...city, i18text: Digit.Utils.locale.getCityLocale(city.code) }));
  })();

  function onSelectRoles(value, type) {
    if (!ifExists(filters.role, value)) {
      onSelectFilterRoles({ ...filters, role: [...filters.role, value] });
    }
  }

  const onRemove = (index, key) => {
    let afterRemove = filters[key].filter((value, i) => {
      return i !== index;
    });
    onSelectFilterRoles({ ...filters, [key]: afterRemove });
  };

  useEffect(() => {
    if (filters.role.length > 1) {
      // For multi-select, leave the dropdown input empty so the user can keep typing
      // to search for more options. The count is surfaced via the placeholder.
      onSelectFilterRolessetSelectedRole(null);
    } else {
      onSelectFilterRolessetSelectedRole(filters.role[0]);
    }
  }, [filters.role]);
  const [tenantId, settenantId] = useState(() => {
    // Multi-root or empty tenant list: seed with the current tenant so the dropdown
    // shows a selected value matching the single option we render.
    if (Digit.Utils.getMultiRootTenant?.() || !tenantIds || tenantIds.length === 0) {
      const currentTenantId = Digit.ULBService.getCurrentTenantId();
      return {
        code: currentTenantId,
        name: currentTenantId,
        i18text: Digit.Utils.locale.getCityLocale(currentTenantId),
      };
    }
    return tenantIds.filter(
      (ele) =>
        ele.code == (searchParams?.tenantId != undefined ? { code: searchParams?.tenantId } : { code: Digit.ULBService.getCurrentTenantId() })?.code
    )[0];
  });
  const { isLoading, isError, errors, data: data, ...rest } = Digit.Hooks.hrms.useHrmsMDMS(
    tenantId ? tenantId.code : searchParams?.tenantId,
    "egov-hrms",
    "HRMSRolesandDesignation"
  );
  const [departments, setDepartments] = useState(() => {
    return { departments: null };
  });

  const [roles, setRoles] = useState(() => {
    return { roles: null };
  });
  const [isActive, setIsactive] = useState(() => {
    return { isActive: true };
  });

  useEffect(() => {
    if (tenantId?.code) {
      setSearchParams({ ..._searchParams, tenantId: tenantId.code });
    }
  }, [tenantId]);

  useEffect(() => {
    if (filters.role && filters.role.length > 0) {
      let res = [];
      filters.role.forEach((ele) => {
        res.push(ele.code);
      });

      setSearchParams({ ..._searchParams, roles: [...res].join(",") });
      if (filters.role && filters.role.length > 1) {
        let res = [];
        filters.role.forEach((ele) => {
          res.push(ele.code);
        });
        setSearchParams({ ..._searchParams, roles: [...res].join(",") });
      }
    }
    else if(filters.role && filters.role.length===0) {
      setSearchParams({ ..._searchParams, roles: undefined });
    }
  }, [filters.role]);

  useEffect(() => {
    if (departments) {
      setSearchParams({ ..._searchParams, departments: departments.code });
    }
  }, [departments]);

  useEffect(() => {
    if (roles) {
      setSearchParams({ ..._searchParams, roles: roles.code });
    }
  }, [roles]);

  const ifExists = (list, key) => {
    return list?.filter((object) => object.code === key.code).length;
  };

  useEffect(() => {
    if (isActive) {
      setSearchParams({ ..._searchParams, isActive: isActive.code });
    }
  }, [isActive]);
  const clearAll = () => {
    onFilterChange({ delete: Object.keys(searchParams) });
    const currentTenantId = Digit.ULBService.getCurrentTenantId();
    
    // For multiroot tenant, use currentTenantId directly
    if (Digit.Utils.getMultiRootTenant() || !tenantIds || tenantIds.length === 0) {
      settenantId({ code: currentTenantId, name: currentTenantId });
    } else {
      // For single tenant, find from the list
      const matchedTenant = tenantIds?.find((ele) => ele.code === currentTenantId);
      settenantId(matchedTenant || tenantIds?.[0]);
    }
    
    setDepartments(null);
    setRoles(null);
    setIsactive(null);
    props?.onClose?.();
    onSelectFilterRoles({ role: [] });
  };

  const GetSelectOptions = (lable, options, selected, select, optionKey, onRemove, key, placeholder) => {
    // When a placeholder is supplied, leave the selected value empty so the placeholder text
    // is actually visible. Otherwise fall back to a " " shape so the dropdown doesn't crash.
    selected = selected || (placeholder ? { [optionKey]: "", code: "" } : { [optionKey]: " ", code: "" });
    return (
      <div>
        <div className="filter-label">{lable}</div>
        {<Dropdown option={options} selected={selected} select={(value) => select(value, key)} optionKey={optionKey} placeholder={placeholder} />}
        <div className="tag-container">
          {filters?.role?.length > 0 &&
            filters?.role?.map((value, index) => {
              return <RemoveableTag key={index} text={`${value[optionKey].slice(0, 22)} ...`} onClick={() => onRemove(index, key)} />;
            })}
        </div>
      </div>
    );
  };
  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label" style={{ display: "flex", alignItems: "center" }}>
              <span>
                <svg width="17" height="17" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z"
                    fill="#505A5F"
                  />
                </svg>
              </span>
              <span>{t("HR_COMMON_FILTER")}:</span>{" "}
            </div>
            {props.type === "mobile" && (
              <span onClick={props.onClose}>
                <CloseSvg />
              </span>
            )}
          </div>
          <div>
            <div>
              <div className="filter-label">{t("HR_ULB_LABEL")}</div>
              <Dropdown
                option={ulbOptions}
                selected={tenantId}
                select={settenantId}
                optionKey={"i18text"}
                t={t}
              />
            </div>
            <div>
              <div className="filter-label">{t("HR_COMMON_TABLE_COL_DEPT")}</div>
              <Dropdown
                option={Digit.Utils.locale.convertToLocaleData(data?.MdmsRes?.["common-masters"]?.Department, 'COMMON_MASTERS_DEPARTMENT')}
                selected={departments}
                select={setDepartments}
                optionKey={"i18text"}
                t={t}
              />
            </div>
            <div>
              <div>
                {GetSelectOptions(
                  t("HR_COMMON_TABLE_COL_ROLE"),
                  Digit.Utils.locale.convertToLocaleData(data?.MdmsRes["ACCESSCONTROL-ROLES"]?.roles, 'ACCESSCONTROL_ROLES_ROLES', t),
                  selectedRoles,
                  onSelectRoles,
                  "i18text",
                  onRemove,
                  "role",
                  filters.role.length > 1 ? `${filters.role.length} ${t("COMMON_SELECTED")}` : undefined
                )}
              </div>
            </div>
            <div>
              <div className="filter-label">{t("HR_EMP_STATUS_LABEL")}</div>
              <RadioButtons
                onSelect={setIsactive}
                selected={isActive}
                selectedOption={isActive}
                optionsKey="name"
                options={[
                  { code: true, name: t("HR_ACTIVATE_HEAD") },
                  { code: false, name: t("HR_DEACTIVATE_HEAD") },
                ]}
              />
              {props.type !== "mobile" && (
                <div>
                  <SubmitBar onSubmit={() => onFilterChange(_searchParams)} label={t("HR_COMMON_APPLY")} />
                  <button
                    type="button"
                    onClick={clearAll}
                    style={{
                      marginTop: "8px",
                      width: "100%",
                      height: "40px",
                      padding: "0 16px",
                      backgroundColor: "white",
                      color: "#c84c0e",
                      border: "1px solid #c84c0e",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("ES_COMMON_CLEAR_ALL")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {props.type === "mobile" && (
        <ActionBar>
          <ApplyFilterBar
            submit={false}
            labelLink={t("ES_COMMON_CLEAR_ALL")}
            buttonLink={t("ES_COMMON_FILTER")}
            onClear={clearAll}
            onSubmit={() => {
              onFilterChange(_searchParams)
              props?.onClose?.()
            }}
            style={{ flex: 1 }}
          />
        </ActionBar>
      )}
    </React.Fragment>
  );
};

export default Filter;
