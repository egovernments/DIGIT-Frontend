import React, { useState, useEffect, useMemo } from "react";
import {
    CardLabel,
    LabelFieldPair,
    Dropdown,
    TextInput,
    LinkButton,
    CardLabelError,
    Loader
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import _, { isUndefined } from "lodash";
import { useLocation } from "react-router-dom";
import { getUniqueItemsFromArray, stringReplaceAll, sortDropdownNames } from "../utils";
import cloneDeep from "lodash/cloneDeep";

const createUnitDetails = () => ({
    tradeType: "",
    tradeSubType: "",
    tradeCategory: "",
    uom: "",
    uomValue: "",
    key: Date.now(),
});

const TLTradeUnitsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const isEditScreen = pathname.includes("/modify-application/");
    const isRenewal = pathname.includes("/renew-application-details") || pathname.includes("/edit-application-details");
    const applicationType = isRenewal ? "RENEWAL" : "NEW";

    const [units, setUnits] = useState(formData?.tradeUnits || [createUnitDetails()]);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [previousLicenseDetails, setPreviousLicenseDetails] = useState(formData?.tradedetils1 || []);

    // MDMS & Billing Slabs
    const { data: tradeMdmsData, isLoading } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TradeUnits", "[?(@.type=='TL')]");
    const { data: billingSlabTradeTypeData, isLoading: isbillingSlabLoading } = Digit.Hooks.tl.useTradeLicenseBillingslab({ tenantId, filters: {} }, {
        select: (data) => {
            return data?.billingSlab.filter((e) => e.tradeType && e.applicationType === applicationType && e.licenseType === "PERMANENT" && e.uom);
        }
    });

    // Helper to filter MDMS data based on structure type
    const [tradeTypeMdmsData, setTradeTypeMdmsData] = useState([]);

    useEffect(() => {
        if (tradeMdmsData && (billingSlabTradeTypeData?.length > 0 && formData?.tradedetils?.["0"]?.structureType?.code)) {
            let filteredTradeDetails = tradeMdmsData?.TradeLicense.TradeType;
            filteredTradeDetails = filteredTradeDetails?.map((ob) => ({ ...ob, tradeType: ob?.code }));
            setTradeTypeMdmsData(filteredTradeDetails);
        }
    }, [formData?.tradedetils?.[0]?.structureType?.code, !isLoading, billingSlabTradeTypeData]);

    const addNewUnit = () => {
        setUnits((prev) => [...prev, createUnitDetails()]);
    };

    const removeUnit = (unitToRemove) => {
        setUnits((prev) => prev.filter((o) => o.key !== unitToRemove.key));
    };

    const updateUnit = (index, field, value) => {
        const updatedUnits = [...units];
        updatedUnits[index] = { ...updatedUnits[index], [field]: value };

        // Cascade clears
        if (field === 'tradeCategory') {
            updatedUnits[index].tradeType = "";
            updatedUnits[index].tradeSubType = "";
            updatedUnits[index].uom = "";
            updatedUnits[index].uomValue = "";
        } else if (field === 'tradeType') {
            updatedUnits[index].tradeSubType = "";
            updatedUnits[index].uom = "";
            updatedUnits[index].uomValue = "";
        } else if (field === 'tradeSubType') {
            updatedUnits[index].uom = value?.uom || "";
            updatedUnits[index].uomValue = "";
        }

        setUnits(updatedUnits);
        if (isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
    };

    useEffect(() => {
        onSelect(config?.key, units);
    }, [units]);

    useEffect(() => {
        onSelect("tradedetils1", previousLicenseDetails);
    }, [previousLicenseDetails]);


    if (isLoading || isbillingSlabLoading || isEditScreen) {
        return isLoading || isbillingSlabLoading ? <Loader /> : <React.Fragment />;
    }

    return (
        <React.Fragment>
            {units.map((unit, index) => (
                <TradeUnitForm
                    key={unit.key}
                    index={index}
                    unit={unit}
                    t={t}
                    updateUnit={updateUnit}
                    removeUnit={removeUnit}
                    tradeTypeMdmsData={tradeTypeMdmsData}
                    unitsLength={units.length}
                    isRenewal={isRenewal}
                    billingSlabTradeTypeData={billingSlabTradeTypeData}
                    formData={formData}
                />
            ))}
            <LinkButton label={t("TL_ADD_TRADE_UNIT")} onClick={addNewUnit} style={{ color: "#F47738", width: "fit-content" }} />
        </React.Fragment>
    );
};

const TradeUnitForm = ({ unit, index, t, updateUnit, removeUnit, tradeTypeMdmsData, unitsLength, isRenewal, billingSlabTradeTypeData, formData }) => {

    // Derived Options based on current selection
    const tradeCategoryOptions = useMemo(() => {
        if (!tradeTypeMdmsData) return [];
        let tradeType = cloneDeep(tradeTypeMdmsData);
        let list = tradeType.map(data => ({
            code: data?.tradeType?.split('.')[0],
            i18nKey: t(`TRADELICENSE_TRADETYPE_${data?.tradeType?.split('.')[0]}`)
        }));
        return getUniqueItemsFromArray(list, "code");
    }, [tradeTypeMdmsData, t]);

    const tradeTypeOptions = useMemo(() => {
        if (!unit.tradeCategory || !tradeTypeMdmsData) return [];
        let tradeType = cloneDeep(tradeTypeMdmsData);
        let filtered = tradeType.filter(data => data?.tradeType?.split('.')[0] === unit.tradeCategory.code);
        let list = filtered.map(data => ({
            code: data?.tradeType?.split('.')[1],
            i18nKey: t(`TRADELICENSE_TRADETYPE_${data?.tradeType?.split('.')[1]}`)
        }));
        return getUniqueItemsFromArray(list, "code");
    }, [unit.tradeCategory, tradeTypeMdmsData, t]);

    const tradeSubTypeOptions = useMemo(() => {
        if (!unit.tradeType || !tradeTypeMdmsData) return [];
        let tradeType = cloneDeep(tradeTypeMdmsData);
        let filtered = tradeType.filter(data => data?.tradeType?.split('.')[1] === unit.tradeType.code);
        let list = filtered.map(data => ({
            code: data?.tradeType,
            i18nKey: t(`TRADELICENSE_TRADETYPE_${stringReplaceAll(data?.tradeType, ".", "_")}`),
            ...data // Keep extra data like uom
        }));
        const options = getUniqueItemsFromArray(list, "code");
        return sortDropdownNames(options, "i18nKey", t);
    }, [unit.tradeType, tradeTypeMdmsData, t]);

    function checkRangeForUomValue(e, fromUom, toUom) {
        let selectedtradesubType = billingSlabTradeTypeData?.filter((ob) => ob?.tradeType === unit?.tradeSubType?.code && (ob?.structureType === formData?.tradedetils?.[0]?.structureSubType?.code))?.[0];
        fromUom = fromUom ? fromUom : selectedtradesubType?.fromUom;
        toUom = toUom ? toUom : selectedtradesubType?.toUom;
        if (Number.isInteger(fromUom)) {
            if (!(e && parseFloat(e) >= fromUom)) {
                return false;
            }
        }
        if (Number.isInteger(toUom)) {
            if (!(e && parseFloat(e) <= toUom)) {
                return false
            }
        }
        return true
    }

    function getUomRange(type) {
        let selectedtradesubType = billingSlabTradeTypeData?.filter((ob) => ob?.tradeType === unit?.tradeSubType?.code && (ob?.structureType === formData?.tradedetils?.[0]?.structureSubType?.code))?.[0];
        if (type === "fromUom")
            return selectedtradesubType?.fromUom;
        else
            return selectedtradesubType?.toUom;
    }

    // Validation Logic wrapper
    const validateUomValue = (val) => {
        if (!unit.tradeSubType?.uom) return true;
        if (!val) return false;
        if (val <= 0 || val >= 99999) return false;
        return checkRangeForUomValue(val, unit?.tradeSubType?.fromUom, unit?.tradeSubType?.toUom);
    };


    return (
        <div style={{ marginBottom: "16px", border: "1px solid #D6D5D4", padding: "16px", marginTop: "8px", background: "#FAFAFA" }}>
            {unitsLength > 1 && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div onClick={() => removeUnit(unit)} style={{ cursor: "pointer", padding: "5px" }}>
                        <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#494848" />
                            </svg>
                        </span>
                    </div>
                </div>
            )}

            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{`${t("TRADELICENSE_TRADECATEGORY_LABEL")} * `}</CardLabel>
                <Dropdown
                    t={t}
                    option={tradeCategoryOptions}
                    selected={unit.tradeCategory}
                    select={(value) => updateUnit(index, "tradeCategory", value)}
                    optionKey="i18nKey"
                    disable={false}
                />
            </LabelFieldPair>

            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{`${t("TRADELICENSE_TRADETYPE_LABEL")} * `}</CardLabel>
                <Dropdown
                    t={t}
                    option={tradeTypeOptions}
                    selected={unit.tradeType}
                    select={(value) => updateUnit(index, "tradeType", value)}
                    optionKey="i18nKey"
                    disable={!unit.tradeCategory}
                />
            </LabelFieldPair>

            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_SUB_TYPE_LABEL")} * `}</CardLabel>
                <Dropdown
                    t={t}
                    option={tradeSubTypeOptions}
                    selected={unit.tradeSubType}
                    select={(value) => updateUnit(index, "tradeSubType", value)}
                    optionKey="i18nKey"
                    disable={!unit.tradeType}
                />
            </LabelFieldPair>

            {/* UOM Display (Read Only) */}
            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{unit?.tradeSubType?.uom ? `${t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER")} * ` : `${t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER")}`}</CardLabel>
                <TextInput
                    value={unit.uom || ""}
                    disable={true}
                    style={{ background: "#FAFAFA" }}
                />
            </LabelFieldPair>

            {/* UOM Value */}
            <LabelFieldPair>
                <CardLabel className="card-label-smaller">{unit?.tradeSubType?.uom ? `${t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")} * ` : `${t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")} `}</CardLabel>
                <TextInput
                    t={t}
                    value={unit.uomValue}
                    onChange={(e) => updateUnit(index, "uomValue", e.target.value)}
                    disable={!unit.tradeSubType?.uom}
                    style={{ background: "#FAFAFA" }}
                    validation={{
                        validator: (val) => validateUomValue(val),
                        title: `${t("ERR_WRONG_UOM_VALUE")} ${getUomRange("fromUom") || ""} - ${getUomRange("toUom") || ""}`
                    }}
                />
            </LabelFieldPair>
        </div>
    );
};

export default TLTradeUnitsEmployee;
