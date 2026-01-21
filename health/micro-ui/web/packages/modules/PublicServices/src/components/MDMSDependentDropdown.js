import React, { useEffect, useMemo, useState } from "react";
import { Dropdown } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

/**
 * MDMSDependentDropdown (PublicServices)
 * Wrapper over DIGIT Dropdown that accepts a schemaCode and filters options
 * based on a provided parent value. Fetches data from MDMS.
 */
const MDMSDependentDropdown = (props) => {
    const { t } = useTranslation();
    const hasOwn = (obj, key) => obj && Object.prototype.hasOwnProperty.call(obj, key);
    // Prefer schema-driven config
    const cfg = (props?.config && props?.config?.populators) ? props.config.populators : (props?.populators || {});
    const schemaCode = props?.schemaCode || cfg?.schemaCode;
    // const optionKey = props?.optionKey || cfg?.optionKey || "name"; // Commented out - using code with prefix instead
    const valueKey = props?.valueKey || cfg?.valueKey || "code";
    const parentKey = props?.parentKey || cfg?.parentKey || "parent";
    const mdmsModule = cfg?.mdmsModule || "common-masters"; // Default module name
    const localePrefix = cfg?.mdmsConfig?.localePrefix || `${mdmsModule}_${schemaCode}`.toUpperCase().replaceAll(".", "_");

    // Resolve parentValue: explicit prop -> cfg.parentValue -> cfg.dependsOn path in props.data
    let parentValue = hasOwn(props, "parentValue") ? props.parentValue : (hasOwn(cfg, "parentValue") ? cfg.parentValue : null);
    const getByPath = (obj, path) => {
        if (!obj || !path) return undefined;
        return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
    };
    if (!parentValue && typeof cfg?.dependsOn === "string") {
        const resolved = getByPath(props?.data, cfg.dependsOn);
        if (resolved && typeof resolved === "object") parentValue = resolved[valueKey] || resolved.code || null;
        else if (typeof resolved === "string") parentValue = resolved;
    }

    const label = props?.label || props?.config?.label || cfg?.label;
    const placeholder = props?.placeholder || cfg?.placeholder;

    // Selected value: prop -> cfg -> from data by name
    let value = props?.value || cfg?.value;
    if (!value && cfg?.name && props?.data) {
        const existing = props.data[cfg.name];
        if (existing && typeof existing === "object") value = existing[valueKey] || existing.code || null;
        else if (typeof existing === "string") value = existing;
    }

    const disabled = hasOwn(props, "disabled") ? props.disabled : (hasOwn(cfg, "disabled") ? cfg.disabled : false);
    const className = props?.className || cfg?.className;
    const style = props?.style || cfg?.style;
    const onChange = props?.onChange || cfg?.onChange;
    const [items, setItems] = useState([]);

    // Get tenant ID from session or props
    const tenantId = Digit.ULBService.getCurrentTenantId();

    // Fetch data from MDMS using the Digit.Hooks.useCustomMDMS hook
    const { isLoading, data: mdmsData } = Digit.Hooks.useCustomMDMS(
        tenantId,
        mdmsModule,
        [
            {
                name: schemaCode,
            },
        ],
        {
            enabled: !!schemaCode,
            select: (data) => {
                // Extract the array from the nested structure
                const masterData = data?.[mdmsModule]?.[schemaCode] || [];
                // Filter only active items
                return masterData.filter(item => item.active !== false);
            },
        }
    );

    useEffect(() => {
        if (mdmsData && !isLoading) {
            setItems(mdmsData);
        }
    }, [mdmsData, isLoading]);

    const filtered = useMemo(() => {
        const baseFiltered = parentValue ? items.filter((item) => item[parentKey] === parentValue) : items;
        // Transform options to use code with locale prefix and label
        return baseFiltered.map(item => ({
            ...item,
            name: label
                ? `${localePrefix}_${item.code}`.toUpperCase().replace(/[^A-Z0-9_]/g, "_")
                : `${localePrefix}_${item.code}`.toUpperCase()
        }));
    }, [items, parentKey, parentValue, localePrefix, label]);

    const selectedObj = useMemo(() => {
        if (!value) return null;
        return filtered.find((it) => it[valueKey] === value) || null;
    }, [filtered, value, valueKey]);

    const handleSelect = (selected) => {
        if (typeof onChange === "function") onChange(selected);
        if (cfg?.name && typeof props?.setValue === "function") {
            props.setValue(cfg.name, selected);
        }
    };

    return (
        <div className={className} style={style}>
            {/* {label ? (
                <div className="typography body-m" style={{ marginBottom: "4px" }}>
                    {t(label)}
                </div>
            ) : null} */}
            <Dropdown
                option={filtered}
                optionKey="name" // Using name which contains code with locale prefix
                selected={selectedObj}
                select={handleSelect}
                placeholder={isLoading ? t("LOADING") : t(placeholder || "SELECT")}
                disabled={disabled || isLoading}
                t={t}
                isSearchable
            />
        </div>
    );
};

export default MDMSDependentDropdown;


