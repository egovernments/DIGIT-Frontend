import React, { useState, useEffect, useMemo } from "react";
import {
    CardLabel,
    LabelFieldPair,
    Dropdown,
    TextInput,
    LinkButton,
    CardLabelError
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import _, { isUndefined } from "lodash";
import { useLocation } from "react-router-dom";
import { getUniqueItemsFromArray, stringReplaceAll, sortDropdownNames, getPattern } from "../utils";

const createAccessoriesDetails = () => ({
    accessoryCategory: "",
    count: "",
    uom: "",
    uomValue: "",
    key: Date.now(),
});

const TLAccessoriesEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const isEditScreen = pathname.includes("/modify-application/");
    const isRenewal = pathname.includes("/renew-application-details") || pathname.includes("/edit-application-details");

    const [accessoriesList, setAccessoriesList] = useState(formData?.accessories || [createAccessoriesDetails()]);
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const { data: billingSlabData } = Digit.Hooks.tl.useTradeLicenseBillingslab({ tenantId, filters: {} }, {
        select: (data) => {
            return data?.billingSlab.filter((e) => e.accessoryCategory && e.applicationType === "NEW" && e.uom);
        }
    });

    // Helper to extract accessories options from billing slabs
    const [accessoriesOptions, setAccessoriesOptions] = useState([]);

    useEffect(() => {
        if (billingSlabData?.length > 0) {
            const processedAccessories = billingSlabData.map(item => ({
                code: item.accessoryCategory,
                uom: item.uom,
                rate: item.rate,
                fromUom: item.fromUom,
                toUom: item.toUom,
                i18nKey: t(`TRADELICENSE_ACCESSORIESCATEGORY_${stringReplaceAll(item.accessoryCategory.toUpperCase(), "-", "_")}`)
            }));

            const uniqueAccessories = getUniqueItemsFromArray(processedAccessories, "code");
            setAccessoriesOptions(uniqueAccessories);
        }
    }, [billingSlabData, t]);


    const addAccessory = () => {
        setAccessoriesList((prev) => [...prev, createAccessoriesDetails()]);
    };

    const removeAccessor = (accessor) => {
        setAccessoriesList((prev) => prev.filter((o) => o.key !== accessor.key));
    };

    const updateAccessor = (index, field, value) => {
        const updatedList = [...accessoriesList];
        updatedList[index] = { ...updatedList[index], [field]: value };

        if (field === 'accessoryCategory') {
            updatedList[index].uom = value?.uom || "";
            updatedList[index].uomValue = "";
            updatedList[index].count = "";
        }

        setAccessoriesList(updatedList);
    };

    useEffect(() => {
        onSelect(config?.key, accessoriesList);
    }, [accessoriesList]);


    if (isEditScreen) return <React.Fragment />;

    return (
        <React.Fragment>
            {accessoriesList.map((accessor, index) => (
                <AccessoriersForm
                    key={accessor.key}
                    index={index}
                    accessor={accessor}
                    t={t}
                    updateAccessor={updateAccessor}
                    removeAccessor={removeAccessor}
                    accessoriesOptions={accessoriesOptions}
                    listLength={accessoriesList.length}
                    isRenewal={isRenewal}
                />
            ))}
            <LinkButton label={`${t("TL_NEW_TRADE_DETAILS_NEW_ACCESSORIES")}`} onClick={addAccessory} style={{ color: "#F47738", width: "fit-content" }} />
        </React.Fragment>
    );
};

const AccessoriersForm = ({ accessor, index, t, updateAccessor, removeAccessor, accessoriesOptions, listLength, isRenewal }) => {

    function checkRangeForUomValue(e, fromUom, toUom) {
        if (Number.isInteger(fromUom)) {
            if (!(e && parseFloat(e) >= fromUom)) return false;
        }
        if (Number.isInteger(toUom)) {
            if (!(e && parseFloat(e) <= toUom)) return false;
        }
        return true;
    }

    const validateUomValue = (val) => {
        if (!accessor.accessoryCategory?.uom) return true;
        if (!val) return false;
        if (val <= 0 || val >= 99999) return false;
        return checkRangeForUomValue(val, accessor.accessoryCategory.fromUom, accessor.accessoryCategory.toUom);
    };

    const validateCount = (val) => {
        if (!accessor.accessoryCategory?.code) return true;
        return val && /^[0-9]+$/.test(val);
    };

    return (
        <div style={{ marginBottom: "16px", border: "1px solid #D6D5D4", padding: "16px", marginTop: "8px", background: "#FAFAFA" }}>
            {listLength > 1 && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div onClick={() => removeAccessor(accessor)} style={{ padding: "5px", cursor: "pointer", textAlign: "right" }}>
                        <span>
                            <svg style={{ float: "right", position: "relative", bottom: "5px" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#494848" />
                            </svg>
                        </span>
                    </div>
                </div>
            )}

            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_ACC_LABEL")} `}</CardLabel>
                <Dropdown
                    t={t}
                    option={sortDropdownNames(accessoriesOptions, "i18nKey", t)}
                    selected={accessor.accessoryCategory}
                    select={(value) => updateAccessor(index, "accessoryCategory", value)}
                    optionKey="i18nKey"
                />
            </LabelFieldPair>

            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{accessor?.accessoryCategory?.uom ? `${t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER")} * ` : `${t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER")} `}</CardLabel>
                <TextInput
                    value={accessor.uom || ""}
                    disable={true}
                    style={{ background: "#FAFAFA" }}
                />
            </LabelFieldPair>

            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{accessor?.accessoryCategory?.uom ? `${t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")} *  ` : `${t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")}  `}</CardLabel>
                <TextInput
                    t={t}
                    value={accessor.uomValue}
                    onChange={(e) => updateAccessor(index, "uomValue", e.target.value)}
                    disable={!accessor.accessoryCategory?.uom}
                    style={{ background: "#FAFAFA" }}
                    validation={{
                        validator: validateUomValue,
                        title: `${t("ERR_WRONG_UOM_VALUE")} ${accessor.accessoryCategory?.fromUom || ""} - ${accessor.accessoryCategory?.toUom || ""}`
                    }}
                />
            </LabelFieldPair>

            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{accessor?.accessoryCategory?.code ? `${t("TL_ACCESSORY_COUNT_LABEL")} * ` : `${t("TL_ACCESSORY_COUNT_LABEL")} `}</CardLabel>
                <TextInput
                    t={t}
                    value={accessor.count}
                    onChange={(e) => updateAccessor(index, "count", e.target.value)}
                    style={{ background: "#FAFAFA" }}
                    validation={{
                        validator: validateCount,
                        title: t("ERR_DEFAULT_INPUT_FIELD_MSG")
                    }}
                />
            </LabelFieldPair>
        </div>
    );
};

export default TLAccessoriesEmployee;
