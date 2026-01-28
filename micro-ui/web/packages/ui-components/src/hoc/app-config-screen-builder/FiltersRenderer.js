import React, { Fragment, useState, useEffect } from "react";
import { Dropdown, Loader, Switch } from "../../atoms";



const FiltersRenderer = ({ cField, drawerState, setDrawerState, t, disabled }) => {
  const [localSelectedSchema, setLocalSelectedSchema] = useState(drawerState?.schemaCode ? {
    masterName: drawerState?.schemaCode?.split('.')?.[1],
    moduleName: drawerState?.schemaCode?.split('.')?.[0],
    schemaCode: drawerState?.schemaCode,
}: null);
  const [localActiveOptions, setLocalActiveOptions] = useState([]); // codes

  // --- 1) Always auto-select a master (prefer saved, else first option)
  useEffect(() => {
    if (localSelectedSchema) return;

    const saved = drawerState?.schemaCode ? {
      masterName: drawerState?.schemaCode?.split('.')?.[1],
      moduleName: drawerState?.schemaCode?.split('.')?.[0],
      schemaCode: drawerState?.schemaCode,
  } : null ;
    const fallback = Array.isArray(cField?.mdmsOptions) && cField.mdmsOptions.length > 0
      ? cField.mdmsOptions[0]
      : null;

    const nextSchema = saved || fallback;
    if (nextSchema) {
      setLocalSelectedSchema(nextSchema);
      // also persist schema + schemaCode so it survives re-open
      setDrawerState(prev => ({
        ...prev,
        selectedSchema: nextSchema,
        schemaCode: nextSchema.schemaCode,     // <- requested
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cField?.mdmsOptions, drawerState?.selectedSchema]);

  // --- 2) Fetch MDMS by selected schema
  const { isLoading, data: mdmsOptions = [] } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    localSelectedSchema?.moduleName,
    localSelectedSchema?.masterName ? [{ name: localSelectedSchema.masterName }] : [],
    {
      enabled: !!localSelectedSchema?.moduleName && !!localSelectedSchema?.masterName,
      select: (data) =>
        data?.[localSelectedSchema?.moduleName]?.[localSelectedSchema.masterName] || [],
    },
    { schemaCode: "FILTERSDROPDOWNLIST" }
  );

  // --- 3) Prefill active toggles:
  // - If drawerState.enums exists, use that.
  // - Else, use MDMS items where active === true.
  useEffect(() => {
    if (!localSelectedSchema) return;
    if (mdmsOptions.length === 0) return;

    if (Array.isArray(drawerState?.dropdownOptions) && drawerState.dropdownOptions.length > 0) {
      // hydrate from drawerState
      const codes = drawerState.dropdownOptions.map(e => e.code);
      setLocalActiveOptions(codes);
    } else {
      // default from MDMS active flags
      const defaultCodes = mdmsOptions.filter(o => o.active).map(o => o.code);
      setLocalActiveOptions(defaultCodes);

      const activeObjects = mdmsOptions.filter(o => defaultCodes.includes(o.code));
      setDrawerState(prev => ({
        ...prev,
        dropdownOptions: activeObjects,
        selectedSchema: localSelectedSchema,
        schemaCode: localSelectedSchema.schemaCode,   // <- requested
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mdmsOptions, localSelectedSchema]);

  // --- 4) Handle toggle (also persist schemaCode each time we change enums)
  const handleToggle = (code, checked) => {
    setLocalActiveOptions(prev => {
      const nextCodes = checked
        ? Array.from(new Set([...prev, code]))
        : prev.filter(c => c !== code);

      const activeObjects = mdmsOptions.filter(item => nextCodes.includes(item.code));
      setDrawerState(prevState => ({
        ...prevState,
        dropdownOptions: activeObjects,
        selectedSchema: localSelectedSchema,
        schemaCode: localSelectedSchema?.schemaCode,  // <- keep schemaCode in sync
      }));

      return nextCodes;
    });
  };

  return (
    <>
      {/* Schema selector (auto-populated) */}
      <Dropdown
        t={t}
        disabled={disabled}
        option={cField?.mdmsOptions || []}         // [{ schemaCode, moduleName, masterName, name? }]
        optionKey={"schemaCode"}
        selected={localSelectedSchema || {}}
        select={(value) => {
          setLocalSelectedSchema(value);
          setLocalActiveOptions([]);               // reset toggles on schema change
          setDrawerState(prev => ({
            ...prev,
            selectedSchema: value,
            schemaCode: value?.schemaCode,        // <- requested
            dropdownOptions: [],                            // reset enums for new master
          }));
        }}
      />

      {isLoading && <Loader />}

      {!isLoading && mdmsOptions.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {mdmsOptions.map((opt) => {
            const isActive = localActiveOptions.includes(opt.code);
            return (
              <Switch
                key={`${opt.code}-${isActive}`}    // force re-sync if prefilled
                label={t(opt.name)}
                isChecked={isActive}               // controlled
                isCheckedInitially={isActive}      // in case Switch uses initial prop
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