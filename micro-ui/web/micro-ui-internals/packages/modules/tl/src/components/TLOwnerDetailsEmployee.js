import React, { useState, useEffect, useMemo } from "react";
import {
    CardLabel,
    LabelFieldPair,
    Dropdown,
    TextInput,
    CardLabelError,
    LinkButton,
    MobileNumber,
    CardSectionHeader,
    HeaderComponent,
    ErrorMessage
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import _ from "lodash";

const createOwnerDetails = () => ({
    name: "",
    designation: "",
    mobileNumber: "",
    altContactNumber: "",
    instituionName: "",
    fatherOrHusbandName: "",
    relationship: "",
    emailId: "",
    permanentAddress: "",
    ownerType: "",
    gender: "",
    subOwnerShipCategory: "",
    correspondenceAddress: "",
    key: Date.now(),
});

const TLOwnerDetailsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const isEditScreen = pathname.includes("/modify-application/");
    const isRenewal = pathname.includes("/renew-application-details") || pathname.includes("/edit-application-details");

    // State initialization
    const [owners, setOwners] = useState(formData?.owners || [createOwnerDetails()]);
    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [previousLicenseDetails, setPreviousLicenseDetails] = useState(formData?.tradedetils1 || []);

    // MDMS Data
    const { data: mdmsData } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", [
        "OwnerType",
        "OwnerShipCategory",
        "SubOwnerShipCategory",
    ]);

    const { data: genderTypeData } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", ["GenderType"]);
    const { data: institutionOwnershipTypeOptions } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TradeOwnershipSubType", {
        keyToSearchOwnershipSubtype: formData?.ownershipCategory?.code ? formData?.ownershipCategory?.code.split(".")[0] : undefined,
    });

    // Derived State
    const typeOfOwner = useMemo(() => {
        if (formData?.ownershipCategory?.code?.includes("SINGLEOWNER")) return "SINGLEOWNER";
        if (formData?.ownershipCategory?.code?.includes("INSTITUTIONAL")) return "INSTITUTIONAL";
        return "MULTIOWNER";
    }, [formData?.ownershipCategory]);

    const isMultipleOwners = typeOfOwner === "MULTIOWNER";
    const isInstitutional = typeOfOwner === "INSTITUTIONAL";

    const ownerTypesMenu = useMemo(
        () =>
            mdmsData?.PropertyTax?.OwnerType?.map?.((e) => ({
                i18nKey: `${e.code.replaceAll("PROPERTY", "COMMON_MASTERS").replaceAll(".", "_")}`,
                code: e.code,
                name: e.name
            })) || [],
        [mdmsData]
    );

    const genderTypeMenu = useMemo(
        () =>
            genderTypeData?.["common-masters"]?.GenderType?.filter(e => e.active)?.map?.((e) => ({
                i18nKey: `TL_GENDER_${e.code}`,
                code: e.code,
            })) || [],
        [genderTypeData]
    );

    // Update Owners Logic
    const updateOwner = (index, field, value) => {
        const updatedOwners = [...owners];
        updatedOwners[index] = { ...updatedOwners[index], [field]: value };
        setOwners(updatedOwners);
        if (isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true });
    };

    const addNewOwner = () => {
        setOwners([...owners, createOwnerDetails()]);
    };

    const removeOwner = (ownerToRemove) => {
        setOwners(owners.filter(o => o.key !== ownerToRemove.key));
    };

    // Effects
    useEffect(() => {
        onSelect(config?.key, owners);
    }, [owners]);

    useEffect(() => {
        onSelect("tradedetils1", previousLicenseDetails);
    }, [previousLicenseDetails]);


    // Validation (simplified for V2 pattern - typically V2 handles this via validation schemas or onSelect propagation)
    // Here we duplicate the logic to set errors if needed, but FormComposerV2 might handle required fields differently.
    // For now, we keep the side-effect error setting for compatibility with existing validations if any.
    useEffect(() => {
        if (isMultipleOwners && owners.length === 1) {
            setError("mulipleOwnerError", { type: "owner_missing", message: `TL_ERROR_MULTIPLE_OWNER` });
        } else {
            clearErrors("mulipleOwnerError");
        }
    }, [owners, isMultipleOwners]);

    // Render Individual Owner Form
    const renderOwnerForm = (owner, index) => {
        return (
            <div key={owner.key} style={isMultipleOwners ? { border: "1px solid #D6D5D4", padding: "16px", marginTop: "8px", borderRadius: "4px", background: "#FAFAFA" } : {}}>
                {isMultipleOwners && owners.length > 1 && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div onClick={() => removeOwner(owner)} style={{ cursor: "pointer" }}>
                            <span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#494848" />
                                </svg>
                            </span>
                        </div>
                    </div>
                )}

                {/* Institutional Fields */}
                {isInstitutional && (
                    <>
                        <LabelFieldPair>
                            <CardLabel>{`${t("TL_INSTITUTION_NAME_LABEL")}*`}</CardLabel>
                            <TextInput
                                t={t}
                                isMandatory={false}
                                value={owner.instituionName}
                                onChange={(e) => updateOwner(index, "instituionName", e.target.value)}
                                disable={false} // Add specific disable logic if needed
                                validation={{
                                    pattern: /^\w+( +\w+)*$/,
                                    title: t("TL_NAME_ERROR_MESSAGE")
                                }}
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel>{`${t("TL_INSTITUTION_TYPE_LABEL")}*`}</CardLabel>
                            <Dropdown
                                t={t}
                                option={institutionOwnershipTypeOptions}
                                selected={owner.subOwnerShipCategory}
                                select={(value) => updateOwner(index, "subOwnerShipCategory", value)}
                                optionKey="i18nKey"
                            />
                        </LabelFieldPair>
                        <CardSectionHeader>{t("TL_AUTHORIZED_PERSON_DETAILS")}</CardSectionHeader>
                        <LabelFieldPair>
                            <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_NAME_LABEL")}*`}</CardLabel>
                            <TextInput
                                t={t}
                                value={owner.name}
                                onChange={(e) => updateOwner(index, "name", e.target.value)}
                                validation={{
                                    pattern: /^[a-zA-Z-.`' ]*$/,
                                    title: t("TL_NAME_ERROR_MESSAGE")
                                }}
                            />
                        </LabelFieldPair>
                        <LabelFieldPair>
                            <CardLabel>{`${t("TL_NEW_OWNER_DESIG_LABEL")}`}</CardLabel>
                            <TextInput
                                t={t}
                                value={owner.designation}
                                onChange={(e) => updateOwner(index, "designation", e.target.value)}
                                validation={{
                                    pattern: /^[a-zA-Z-.`' ]*$/,
                                    title: t("TL_NAME_ERROR_MESSAGE")
                                }}
                            />
                        </LabelFieldPair>
                        <LabelFieldPair>
                            <CardLabel>{`${t("TL_MOBILE_NUMBER_LABEL")}*`}</CardLabel>
                            <MobileNumber
                                value={owner.mobileNumber}
                                onChange={(value) => updateOwner(index, "mobileNumber", value)}
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel>{`${t("TL_TELEPHONE_NUMBER_LABEL")}`}</CardLabel>
                            <MobileNumber
                                value={owner.altContactNumber}
                                onChange={(value) => updateOwner(index, "altContactNumber", value)}
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel>{`${t("NOC_APPLICANT_EMAIL_LABEL")}`}</CardLabel>
                            <TextInput
                                t={t}
                                value={owner.emailId}
                                onChange={(e) => updateOwner(index, "emailId", e.target.value)}
                            />
                        </LabelFieldPair>
                    </>
                )}

                {/* Individual Fields */}
                {!isInstitutional && (
                    <>
                        <LabelFieldPair>
                            <CardLabel className="card-label-smaller">{`${t("TL_OWNER_S_NAME_LABEL")} * `}</CardLabel>
                            <TextInput
                                t={t}
                                value={owner.name}
                                onChange={(e) => updateOwner(index, "name", e.target.value)}
                                validation={{
                                    pattern: /^\w+( +\w+)*$/,
                                    title: t("INVALID_NAME")
                                }}
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel className="card-label-smaller">{`${t("TL_OWNER_S_MOBILE_NUM_LABEL")} * `}</CardLabel>
                            <MobileNumber
                                value={owner.mobileNumber}
                                onChange={(value) => updateOwner(index, "mobileNumber", value)}
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel className="card-label-smaller">{`${t("TL_GUARDIAN_S_NAME_LABEL")} * `}</CardLabel>
                            <TextInput
                                t={t}
                                value={owner.fatherOrHusbandName}
                                onChange={(e) => updateOwner(index, "fatherOrHusbandName", e.target.value)}
                                validation={{
                                    pattern: /^\w+( +\w+)*$/,
                                    title: t("INVALID_NAME")
                                }}
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel className="card-label-smaller">{`${t("TL_RELATIONSHIP_WITH_GUARDIAN_LABEL")} * `}</CardLabel>
                            <Dropdown
                                t={t}
                                option={[
                                    { i18nKey: "COMMON_RELATION_FATHER", code: "FATHER" },
                                    { i18nKey: "COMMON_RELATION_HUSBAND", code: "HUSBAND" },
                                ]}
                                selected={owner.relationship}
                                select={(value) => updateOwner(index, "relationship", value)}
                                optionKey="i18nKey"
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")} * `}</CardLabel>
                            <Dropdown
                                t={t}
                                option={genderTypeMenu}
                                selected={owner.gender}
                                select={(value) => updateOwner(index, "gender", value)}
                                optionKey="i18nKey"
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_EMAIL_LABEL")} `}</CardLabel>
                            <TextInput
                                t={t}
                                value={owner.emailId}
                                onChange={(e) => updateOwner(index, "emailId", e.target.value)}
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel className="card-label-smaller">{`${t("TL_OWNER_SPECIAL_CATEGORY")} `}</CardLabel>
                            <Dropdown
                                t={t}
                                option={ownerTypesMenu}
                                selected={owner.ownerType}
                                select={(value) => updateOwner(index, "ownerType", value)}
                                optionKey="i18nKey"
                            />
                        </LabelFieldPair>

                        <LabelFieldPair>
                            <CardLabel className="card-label-smaller">{`${t("TL_NEW_OWNER_DETAILS_ADDR_LABEL")} `}</CardLabel>
                            <TextInput
                                t={t}
                                value={owner.permanentAddress}
                                onChange={(e) => updateOwner(index, "permanentAddress", e.target.value)}
                            />
                        </LabelFieldPair>
                    </>
                )}
            </div>
        );
    };

    if (isEditScreen) return <React.Fragment />;

    return (
        <React.Fragment>
            {owners.map((owner, index) => renderOwnerForm(owner, index))}
            {isMultipleOwners && (
                <div>
                    <LinkButton label={t("TL_NEW_OWNER_DETAILS_ADD_OWN")} onClick={addNewOwner} style={{ color: "#F47738", width: "fit-content" }} />
                    <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-24px" }}>
                        {t(formState.errors?.mulipleOwnerError?.message || "")}
                    </CardLabelError>
                </div>
            )}
        </React.Fragment>
    );
};

export default TLOwnerDetailsEmployee;
