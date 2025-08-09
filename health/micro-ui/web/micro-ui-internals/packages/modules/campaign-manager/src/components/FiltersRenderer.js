import React, { useState, Fragment, useEffect } from "react";
import { TextInput, Dropdown, RadioButtons, Button, FieldV1, Switch, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
const FiltersRenderer = ({ cField, drawerState, setDrawerState, t, disabled }) => {
  const [localSelectedSchema, setLocalSelectedSchema] = useState(null);
  const [localActiveOptions, setLocalActiveOptions] = useState([]); // store codes

  // Fetch MDMS data based on selected schema
  const { isLoading, data: mdmsOptions = [] } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    localSelectedSchema?.moduleName,
    localSelectedSchema?.masterName ? [{ name: localSelectedSchema.masterName }] : [],
    {
      enabled: !!localSelectedSchema?.moduleName && !!localSelectedSchema?.masterName,
      select: (data) => data?.[localSelectedSchema?.moduleName]?.[localSelectedSchema.masterName] || [],
    },
    { schemaCode: "FILTERSDROPDOWNLIST" }
  );

  // When MDMS options load, set default active
  useEffect(() => {
    if (mdmsOptions.length > 0) {
      const defaultActive = mdmsOptions.filter((opt) => opt.active).map((opt) => opt.code);
      setLocalActiveOptions(defaultActive);
      // Also initialize enums in drawerState with these active objects
      const activeObjects = mdmsOptions.filter((item) => defaultActive.includes(item.code));
      setDrawerState((prev) => ({
        ...prev,
        enums: activeObjects,
      }));
    }
  }, [mdmsOptions]);

  // Handle toggle
  const handleToggle = (code, checked) => {
    setLocalActiveOptions((prev) => {
      let updated = [...prev];
      if (checked) {
        if (!updated.includes(code)) updated.push(code);
      } else {
        updated = updated.filter((c) => c !== code);
      }

      // Map updated codes to full objects
      const activeObjects = mdmsOptions.filter((item) => updated.includes(item.code));

      // Update drawerState.enums directly
      setDrawerState((prev) => ({
        ...prev,
        enums: activeObjects,
      }));

      return updated;
    });
  };

  return (
    <>
      {/* Dropdown for selecting schema */}
      <Dropdown
        variant={""}
        t={t}
        disabled={disabled}
        option={cField?.mdmsOptions || []}
        optionKey={"schemaCode"}
        selected={localSelectedSchema || {}}
        select={(value) => {
          setLocalSelectedSchema(value);
          setLocalActiveOptions([]); // reset active when schema changes
          setDrawerState((prev) => ({ ...prev, enums: [] })); // reset enums
        }}
      />

      {isLoading && <Loader/>}

      {!isLoading && mdmsOptions.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {mdmsOptions.map((opt) => {
            const isActive = localActiveOptions.includes(opt.code);
            return (
              <Switch
                key={opt.code}
                label={t(opt.name)}
                isCheckedInitially={isActive}
                onToggle={(checked) => handleToggle(opt.code, checked)}
                disable={false}
                shapeOnOff
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default FiltersRenderer;
