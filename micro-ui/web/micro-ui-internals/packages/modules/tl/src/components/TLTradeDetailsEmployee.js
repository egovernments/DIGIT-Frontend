import React, { useState, useEffect, useMemo } from "react";
import {
    CardLabel,
    LabelFieldPair,
    Dropdown,
    TextInput,
    CardLabelError,
    DatePicker
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { getUniqueItemsFromArray, stringReplaceAll, convertEpochToDate } from "../utils";

const defaultFinancialYear = () => {
    const data = convertEpochToDate(Date.now());
    const splitData = data.split("-")[0];
    const year = splitData.slice(2, 4);
    let monthNo = Number(data.split("-")[1]);
    const currentFinancialYear = monthNo < 4 ? `${Number(splitData) - 1}-${Number(year)}` : `${Number(splitData)}-${Number(year) + 1}`;
    return {
        code: currentFinancialYear,
        i18nKey: `FY${currentFinancialYear}`,
        id: currentFinancialYear?.split('-')[0]
    }
}

const createTradeDetailsDetails = () => ({
    financialYear: defaultFinancialYear(),
    licenseType: "",
    structureType: "",
    structureSubType: "",
    commencementDate: "",
    gstNo: "",
    operationalArea: "",
    noOfEmployees: "",
    tradeName: "",
    key: Date.now()
});

const TLTradeDetailsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const isEditScreen = pathname.includes("/modify-application/");
    const isRenewal = pathname.includes("/renew-application-details") || pathname.includes("/edit-application-details");

    const [tradedetils, setTradedetils] = useState(formData?.tradedetils || [createTradeDetailsDetails()]);
    const [structureSubTypeOptions, setStructureSubTypeOptions] = useState([]);

    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();

    // MDMS & API Data
    const { isLoading: menuLoading, data: Menu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "StructureType");
    const { data: FinaceMenu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", ["FinancialYear"]);
    const { data: billingSlabData } = Digit.Hooks.tl.useTradeLicenseBillingslab({ tenantId, filters: {} });

    // Derived State
    const [licenseTypeList, setLicenseTypeList] = useState([]);
    const [licenseTypeValue, setLicenseTypeValue] = useState([]);

    // Logic to process billing slabs and extract license types
    useEffect(() => {
        if (billingSlabData?.billingSlab?.length > 0) {
            const processedData = billingSlabData.billingSlab.reduce(
                (acc, item) => {
                    if (item.tradeType && item.accessoryCategory === null) {
                        acc.tradeTypeData.push({
                            code: item.tradeType,
                            uom: item.uom,
                            structureType: item.structureType,
                            licenseType: item.licenseType,
                            rate: item.rate
                        });
                    }
                    return acc;
                },
                { accessories: [], tradeTypeData: [] }
            );

            let licenseTypes = getUniqueItemsFromArray(processedData.tradeTypeData, "licenseType");
            licenseTypes = licenseTypes?.map(item => ({
                code: item.licenseType,
                active: true,
                i18nKey: `TRADELICENSE_LICENSETYPE_${item.licenseType}`
            }));

            if (licenseTypes?.length > 0) {
                const permanentType = licenseTypes.find(data => data.code === "PERMANENT");
                setLicenseTypeValue(permanentType);
                setLicenseTypeList(licenseTypes);

                // Auto-set license type for all details if not set
                setTradedetils(prev => prev.map(detail => ({
                    ...detail,
                    licenseType: detail.licenseType || permanentType
                })));
            }
        }
    }, [billingSlabData]);

    // Structure Type Options
    const structureTypeOptions = useMemo(() => {
        if (!Menu?.["common-masters"]?.StructureType) return [];
        const options = Menu["common-masters"].StructureType.map(e => {
            let code = e.code.split('.')[0];
            return {
                i18nKey: t(`COMMON_MASTERS_STRUCTURETYPE_${stringReplaceAll(code.toUpperCase(), ".", "_")}`),
                label: code,
                ...e
            };
        });

        // Filter unique by label
        return _.uniqBy(options, 'label').map(item => ({
            code: item.label,
            i18nKey: item.i18nKey
        }));
    }, [Menu, t]);

    // Financial Year Options
    const financialYearOptions = useMemo(() => {
        if (!FinaceMenu?.["egf-master"]?.FinancialYear) return [];
        return FinaceMenu["egf-master"].FinancialYear
            .filter(data => data.module === "TL")
            .map(data => ({ code: data.name, i18nKey: `FY${data.name}`, id: data.name.split('-')[0] }))
            .sort((a, b) => Number(a.id) - Number(b.id));
    }, [FinaceMenu]);


    // Update Tradedetils Logic
    const updateTradeDetail = (index, field, value) => {
        const updatedDetails = [...tradedetils];
        updatedDetails[index] = { ...updatedDetails[index], [field]: value };

        // Special logic for Structure Type change
        if (field === 'structureType') {
            const selectedOption = value?.code?.split('.')[0];
            let subTypes = [];
            if (Menu?.["common-masters"]?.StructureType) {
                subTypes = Menu["common-masters"].StructureType
                    .filter(data => data.code.split('.')[0] === selectedOption)
                    .map(data => ({
                        code: data.code,
                        i18nKey: t(`COMMON_MASTERS_STRUCTURETYPE_${stringReplaceAll(data.code.toUpperCase(), ".", "_")}`),
                    }));
            }
            setStructureSubTypeOptions(subTypes);
            updatedDetails[index].structureSubType = ""; // Reset sub type
        }

        setTradedetils(updatedDetails);
    };

    useEffect(() => {
        onSelect(config?.key, tradedetils);
    }, [tradedetils]);


    if (isEditScreen) return <React.Fragment />;

    return (
        <React.Fragment>
            {tradedetils.map((detail, index) => (
                <div key={detail.key}>
                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_FINANCIAL_YEAR_LABEL")} * `}</CardLabel>
                        <Dropdown
                            t={t}
                            option={financialYearOptions}
                            selected={detail.financialYear}
                            select={(value) => updateTradeDetail(index, "financialYear", value)}
                            optionKey="i18nKey"
                            disable={isRenewal}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL")} * `}</CardLabel>
                        <Dropdown
                            t={t}
                            option={licenseTypeList}
                            selected={licenseTypeValue}
                            select={(value) => { }} // Read only usually
                            optionKey="i18nKey"
                            disable={true}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_COMMON_TABLE_COL_TRD_NAME")} * `}</CardLabel>
                        <TextInput
                            t={t}
                            value={detail.tradeName}
                            onChange={(e) => updateTradeDetail(index, "tradeName", e.target.value)}
                            disable={isRenewal}
                            validation={{
                                pattern: /^[-@.\/#&+\w\s]*$/,
                                title: t("INVALID_NAME")
                            }}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL")} * `}</CardLabel>
                        <Dropdown
                            t={t}
                            option={structureTypeOptions}
                            selected={detail.structureType}
                            select={(value) => updateTradeDetail(index, "structureType", value)}
                            optionKey="i18nKey"
                            disable={isRenewal}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL")} * `}</CardLabel>
                        <Dropdown
                            t={t}
                            option={structureSubTypeOptions}
                            selected={detail.structureSubType}
                            select={(value) => updateTradeDetail(index, "structureSubType", value)}
                            optionKey="i18nKey"
                            disable={false}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")} * `}</CardLabel>
                        <DatePicker
                            date={detail.commencementDate}
                            onChange={(value) => updateTradeDetail(index, "commencementDate", value)}
                            disabled={isRenewal}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_GST_NUMBER_LABEL")} `}</CardLabel>
                        <TextInput
                            t={t}
                            value={detail.gstNo}
                            onChange={(e) => updateTradeDetail(index, "gstNo", e.target.value)}
                            disable={isRenewal}
                            validation={{
                                pattern: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/, // Example GST Pattern
                                title: t("ERR_DEFAULT_INPUT_FIELD_MSG")
                            }}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_OPERATIONAL_SQ_FT_AREA_LABEL")} `}</CardLabel>
                        <TextInput
                            t={t}
                            value={detail.operationalArea}
                            onChange={(e) => updateTradeDetail(index, "operationalArea", e.target.value)}
                            disable={isRenewal}
                            validation={{
                                pattern: /^[0-9]+(\.[0-9]+)?$/,
                                title: t("ERR_DEFAULT_INPUT_FIELD_MSG")
                            }}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_NUMBER_OF_EMPLOYEES_LABEL")} `}</CardLabel>
                        <TextInput
                            t={t}
                            value={detail.noOfEmployees}
                            onChange={(e) => updateTradeDetail(index, "noOfEmployees", e.target.value)}
                            disable={isRenewal}
                            validation={{
                                pattern: /^[0-9]+$/,
                                title: t("ERR_DEFAULT_INPUT_FIELD_MSG")
                            }}
                        />
                    </LabelFieldPair>
                </div>
            ))}
        </React.Fragment>
    );
};

export default TLTradeDetailsEmployee;
