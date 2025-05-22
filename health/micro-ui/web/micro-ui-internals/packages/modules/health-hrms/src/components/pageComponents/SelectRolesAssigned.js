import { CardLabel, Dropdown, LabelFieldPair, Loader, RemoveableTag, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

const RolesAssigned = ({ config, onSelect, formData }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [roleAssigned, setroleAssigned] = useState(formData?.RolesAssigned||[]);
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const { data: data, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};

  useEffect(() => {
    if (data?.MdmsRes) {
      setRoleList(data);
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

        labelKey: "ACCESSCONTROL_ROLES_ROLES_" + role.code,
        tenantId: tenantId,
      };
    });

    return transformedData;

    // setRoleList(transformedData);
  };

  const handleBoundarySelect = (selectBoundariesEvent) => {
    if (!selectBoundariesEvent) return;
    if (selectBoundariesEvent.length === 0) {
      setSelectedRole([]);
    }

    //otherwise your event object would look like this [[a,b],[a,b]] bs' are the boundaries that we need
    const boundariesInEvent = selectBoundariesEvent?.map((event) => {
      return event?.[1];
    });

    onSelect(config.key, boundariesInEvent);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <LabelFieldPair>
      <CardLabel style={{ width: "50.1%" }} className="digit-card-label-smaller">
        {t("HR_COMMON_TABLE_COL_ROLE")} *{/*input.isMandatory ? " * " : null*/}
      </CardLabel>

      <div style={{ width: "100%" }}>
        <MultiSelectDropdown
          selected={roleAssigned}
          additionalWrapperClass=""
          categorySelectAllLabel=""
          chipsKey=""
          clearLabel="Clear All"
          config={{
            isDropdownWithChip: true,
          }}
          defaultValue=""
          description=""
          error=""
          errorStyle={null}
          inputRef={null}
          isSearchable
          label={t(`HRMS_SELECT_OPTION`)}
          name="roleAssigned"
          onChange={() => {}}
          onSelect={(e) => {
            handleBoundarySelect(e);
          }}
          onClose={(e) => {
            handleBoundarySelect(e);
          }}
          options={getroledata() || []}
          optionsCustomStyle={{}}
          optionsKey="labelKey"
          selectAllLabel=""
          t={t}
          type="multiselectdropdown"
        />
      </div>
    </LabelFieldPair>
  );
};

export default RolesAssigned;
