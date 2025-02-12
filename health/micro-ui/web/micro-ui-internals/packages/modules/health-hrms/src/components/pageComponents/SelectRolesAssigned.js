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
    console.log(selectBoundariesEvent, "selectBoundariesEvent");
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
        {/* <MultiSelectWrapper
          props={{ className: "form-field" }}
          t={t}
          addCategorySelectAllCheck={true}
          addSelectAllCheck={true}
          options={getroledata() || []}
          // variant="nestedmultiselect"

          //selected={selectedRole}
          onSelect={(e) => {
            console.log(e, "event-onselect");
          }}
          onClose={(e) => {
            console.log(e, "event-close");
            // debugger
            // handleBoundarySelect(e);
          }}
          isSearchable={true}
          optionsKey={"code"}
        />*/}

        <MultiSelectDropdown
          additionalWrapperClass=""
          categorySelectAllLabel=""
          chipsKey=""
          clearLabel="Clear All"
          config={{
            isDropdownWithChip: true,
          }}
          defaultValue="FEMALE"
          description=""
          error=""
          errorStyle={null}
          inputRef={null}
          isSearchable
          label="Select Option"
          name="genders"
          onChange={(e)=>{
            console.log("role-onchnage", e);
          }}
          onSelect={(e) => {
            console.log("role", e);
            handleBoundarySelect(e);
          }}
          onClose={(e) => {
            console.log("role-close", e);
            handleBoundarySelect(e);
          }}
          options={getroledata() || []}
          optionsCustomStyle={{}}
          optionsKey="code"
          selectAllLabel=""
          t={t}
          type="multiselectdropdown"
        />
      </div>
    </LabelFieldPair>
  );
};

export default RolesAssigned;
