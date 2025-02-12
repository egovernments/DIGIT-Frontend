import { CardLabel, Dropdown, LabelFieldPair, Loader, RemoveableTag, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useMemo } from "react";

const RolesAssigned = ({ t, config, onSelect, userType, formData }) => {
  const MultiSelectWrapper = Digit.ComponentRegistryService.getComponent("MultiSelectDropdownBoundary");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";

  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const { data: data, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};

  useEffect(() => {
    if (data?.MdmsRes) {
      setRoleList(data);
      // getroledata();
    }
  }, [data]);

  useEffect(() => {
    onSelect(config.key, selectedRole);
  }, [selectedRole]);

  const getroledata = () => {
    const transformedData = roleList?.MdmsRes?.["ACCESSCONTROL-ROLES"].roles.map((role) => {
      return {
        code: role.code,
        name: role?.name ? role?.name : " ",
        // , labelKey: "ACCESSCONTROL_ROLES_ROLES_" + role.code, tenantId: tenantId
      };
    });

    return transformedData;

    // setRoleList(transformedData);
  };

  const handleBoundarySelect = (selectBoundariesEvent) => {
    if (!selectBoundariesEvent) return;
    if (selectBoundariesEvent.length === 0) {
      setSelectedRole([]);
      return;
    }

    //otherwise your event object would look like this [[a,b],[a,b]] bs' are the boundaries that we need
    const boundariesInEvent = selectBoundariesEvent?.map((event) => {
      return event?.[1];
    });

    setSelectedRole(boundariesInEvent);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <LabelFieldPair>
      <CardLabel style={{ width: "43.8%" }} className="card-label-smaller">
        {t("Role Assigned")} *{/*input.isMandatory ? " * " : null*/}
      </CardLabel>

      <div style={{ width: "100%" }}>
        <MultiSelectWrapper
          props={{ className: "form-field" }}
          t={t}
          addCategorySelectAllCheck={true}
          addSelectAllCheck={true}
          options={getroledata() || []}
          // variant="nestedmultiselect"

          selected={selectedRole}
          onSelect={(e) => {
            debugger;
            handleBoundarySelect(e);
          }}
          onClose={(e) => {
            // debugger
            // handleBoundarySelect(e);
          }}
          isSearchable={true}
          optionsKey={"name"}
        />
      </div>
    </LabelFieldPair>
  );
};

export default RolesAssigned;
