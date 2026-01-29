import { FormComposerV2, HeaderComponent, Toast, Loader, Stepper } from "@egovernments/digit-ui-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { TradeLicenseConfig } from "../../../configs/employee/TradeLicenseConfig";
import { convertDateToEpoch } from "../../../utils";

const NewApplication = () => {
    const tenantId = Digit.ULBService.getCurrentTenantId() || Digit.ULBService.getCitizenCurrentTenant();
    const tenants = Digit.Hooks.tl.useTenants();
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();

    const [propertyId, setPropertyId] = useState(new URLSearchParams(location.search).get("propertyId"));
    const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("PT_CREATE_EMP_TRADE_NEW_FORM", {});
    const [showToast, setShowToast] = useState(null);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Initial Config
    const config = TradeLicenseConfig(t);
    const currentConfig = config[currentStep];

    const { data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
        { filters: { propertyIds: propertyId }, tenantId: tenantId },
        { filters: { propertyIds: propertyId }, tenantId: tenantId, enabled: propertyId ? true : false }
    );

    useEffect(() => {
        !propertyId && setPropertyId(sessionFormData?.cpt?.details?.propertyId);
    }, [sessionFormData?.cpt]);

    const closeToast = () => {
        setShowToast(null);
        setError(null);
    };

    const handleStepClick = (step) => {
        setCurrentStep(step);
    };

    const handleFormSubmit = (data) => {
        const currentStepKey = currentConfig.key;

        // Merge data for current step
        const newFormData = {
            ...sessionFormData,
            [currentStepKey]: {
                ...sessionFormData[currentStepKey],
                ...data
            }
        };

        // Update session storage
        setSessionFormData(newFormData);

        // Move to next step or submit
        if (currentStep < config.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinalSubmit(newFormData);
        }
    };

    const handleFinalSubmit = (formData) => {
        setLoading(true);
        // Flatten data for legacy logic compatibility
        // The legacy logic expects keys like 'tradedetils', 'tradeUnits' at top level or nested in a specific way.
        // Our new formData has them under step keys: 'trade-details', etc.

        const flattenedData = {
            ...formData["trade-details"],
            ...formData["property-details"],
            ...formData["ownership-details"],
            ...formData["document-details"],
        };

        // Legacy onSubmit logic adapted
        onSubmit(flattenedData);
    };

    const onSubmit = (data) => {
        let isSameAsPropertyOwner = sessionStorage.getItem("isSameAsPropertyOwner");
        if (data?.cpt?.id) {
            if (!data?.cpt?.details || !propertyDetails) {
                setShowToast({ key: "error" });
                setError(t("ERR_INVALID_PROPERTY_ID"));
                setLoading(false);
                return;
            }
        }

        // Validate Pincode
        const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item.toString() === data?.address?.pincode));
        if (!foundValue && data?.address?.pincode) {
            setShowToast({ key: "error" });
            setError(t("TL_COMMON_PINCODE_NOT_SERVICABLE"));
            setLoading(false);
            return;
        }

        let accessories = [];
        if (data?.accessories?.length > 0) {
            data?.accessories?.map((data) => {
                if (data?.accessoryCategory?.code) {
                    accessories.push({
                        accessoryCategory: data?.accessoryCategory?.code || null,
                        uom: data?.accessoryCategory?.uom || null,
                        count: Number(data?.count) || null,
                        uomValue: Number(data?.uomValue) || null,
                    });
                }
            });
        }

        let tradeUnits = [];
        if (data?.tradeUnits?.length > 0) {
            data?.tradeUnits?.map((data) => {
                tradeUnits.push({
                    tradeType: data?.tradeSubType?.code || null,
                    uom: data?.tradeSubType?.uom || null,
                    uomValue: Number(data?.uomValue) || null,
                });
            });
        }

        let address = {};
        if (data?.cpt?.details?.address) {
            address.city = data?.cpt?.details?.address?.city || null;
            address.locality = { code: data?.cpt?.details?.address?.locality?.code || null };
            if (data?.cpt?.details?.address?.doorNo || data?.address?.doorNo) address.doorNo = data?.cpt?.details?.address?.doorNo || data?.address?.doorNo || null;
            if (data?.cpt?.details?.address?.street || data?.address?.street) address.street = data?.cpt?.details?.address?.street || data?.address?.street || null;
            if (data?.cpt?.details?.address?.pincode) address.pincode = data?.cpt?.details?.address?.pincode;
        } else if (data?.address) {
            address.city = data?.address?.city?.code || null;
            address.locality = { code: data?.address?.locality?.code || null };
            if (data?.address?.doorNo) address.doorNo = data?.address?.doorNo || null;
            if (data?.address?.street) address.street = data?.address?.street || null;
            if (data?.address?.pincode) address.pincode = data?.address?.pincode;
        }

        let owners = [];
        if (data?.owners?.length > 0) {
            data?.owners?.map((data) => {
                let obj = {};
                obj.dob = data?.dob ? convertDateToEpoch(data?.dob) : null;
                if (data?.fatherOrHusbandName) obj.fatherOrHusbandName = data?.fatherOrHusbandName;
                if (data?.gender?.code) obj.gender = data?.gender?.code;
                if (data?.mobileNumber) obj.mobileNumber = Number(data?.mobileNumber);
                if (data?.name) obj.name = !data?.ownershipCategory?.code.includes("INSTITUTIONAL") ? data?.name : "";
                if (data?.permanentAddress) obj.permanentAddress = data?.permanentAddress;
                obj.permanentAddress = obj.permanentAddress ? obj.permanentAddress : null;
                if (data?.relationship) obj.relationship = data?.relationship?.code;
                if (data?.emailId) obj.emailId = data?.emailId;
                if (data?.ownerType?.code) obj.ownerType = data?.ownerType?.code;
                owners.push(obj);
            });
        }

        let applicationDocuments = data?.documents?.documents || [];
        // tradedetils might be under 'tradedetils' key from 'trade-details' step
        const tradeDetail = data?.tradedetils?.["0"] || {};

        let commencementDate = convertDateToEpoch(tradeDetail?.commencementDate);
        let financialYear = tradeDetail?.financialYear?.code;
        let gstNo = tradeDetail?.gstNo || "";
        let noOfEmployees = Number(tradeDetail?.noOfEmployees) || "";
        let operationalArea = Number(tradeDetail?.operationalArea) || "";
        let structureType = tradeDetail?.structureSubType?.code || "";
        let tradeName = tradeDetail?.tradeName || "";
        let subOwnerShipCategory = data?.ownershipCategory?.code || "";
        let licenseType = tradeDetail?.licenseType?.code || "PERMANENT";

        let formData = {
            action: "INITIATE",
            applicationType: "NEW",
            workflowCode: "NewTL",
            commencementDate,
            financialYear,
            licenseType,
            tenantId,
            tradeName,
            wfDocuments: [],
            tradeLicenseDetail: {
                channel: "COUNTER",
                additionalDetail: {},
            },
        };

        if (gstNo) formData.tradeLicenseDetail.additionalDetail.gstNo = gstNo;
        if (noOfEmployees) formData.tradeLicenseDetail.noOfEmployees = noOfEmployees;
        if (operationalArea) formData.tradeLicenseDetail.operationalArea = operationalArea;
        if (accessories?.length > 0) formData.tradeLicenseDetail.accessories = accessories;
        if (tradeUnits?.length > 0) formData.tradeLicenseDetail.tradeUnits = tradeUnits;
        if (owners?.length > 0) formData.tradeLicenseDetail.owners = owners;
        // if (applicationDocuments?.length > 0) formData.tradeLicenseDetail.applicationDocuments = applicationDocuments;
        if (address) formData.tradeLicenseDetail.address = address;
        if (structureType) formData.tradeLicenseDetail.structureType = structureType;
        if (data?.ownershipCategory?.code.includes("INDIVIDUAL")) formData.tradeLicenseDetail.subOwnerShipCategory = data?.ownershipCategory?.code;
        if (subOwnerShipCategory) formData.tradeLicenseDetail.subOwnerShipCategory = subOwnerShipCategory;
        if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
            formData.tradeLicenseDetail = { ...formData.tradeLicenseDetail, institution: {} };
        if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
            formData.tradeLicenseDetail.institution["designation"] = data?.owners?.[0]?.designation;
        if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
            formData.tradeLicenseDetail.institution["instituionName"] = data?.owners?.[0]?.instituionName;
        if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
            formData.tradeLicenseDetail.institution["name"] = data?.owners?.[0]?.name;
        if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
            formData.tradeLicenseDetail.institution["contactNo"] = data?.owners?.[0]?.altContactNumber;
        if (data?.cpt) {
            formData.tradeLicenseDetail.additionalDetail.propertyId = data?.cpt?.details?.propertyId;
            formData.tradeLicenseDetail.additionalDetail.isSameAsPropertyOwner = isSameAsPropertyOwner;
        };

        // Call customize logic
        formData = Digit?.Customizations?.TL?.customiseCreateFormData ? Digit?.Customizations?.TL?.customiseCreateFormData(data, formData) : formData;

        Digit.TLService.create({ Licenses: [formData] }, tenantId)
            .then((result, err) => {
                if (result?.Licenses?.length > 0) {
                    let licenses = result?.Licenses?.[0];
                    licenses.tradeLicenseDetail.applicationDocuments = applicationDocuments;
                    licenses.wfDocuments = [];
                    licenses.action = "APPLY";
                    Digit.TLService.update({ Licenses: [licenses] }, tenantId)
                        .then((response) => {
                            if (response?.Licenses?.length > 0) {
                                sessionStorage.setItem("isCreateEnabledEmployee", "true");
                                history.replace(`/digit-ui/employee/tl/response`, { data: response?.Licenses });
                                clearSessionFormData();
                            }
                        })
                        .catch((e) => {
                            setShowToast({ key: "error" });
                            setError(e?.response?.data?.Errors[0]?.message || null);
                            setLoading(false);
                        });
                }
            })
            .catch((e) => {
                setShowToast({ key: "error" });
                setError(e?.response?.data?.Errors[0]?.message || null);
                setLoading(false);
            });
    };

    const textStyles = {
        color: "#0B4B66",
        fontWeight: "700",
        fontSize: "32px",
        marginBottom: "1.5rem"
    };

    return (
        <div>
            <div style={{ marginLeft: "15px" }}>
                <HeaderComponent styles={textStyles}>
                    {t("ES_TITLE_NEW_TRADE_LICESE_APPLICATION")}
                </HeaderComponent>
            </div>

            <Stepper
                customSteps={["TL_COMMON_TR_DETAILS", "TL_NEW_APPLICATION_PROPERTY", "ES_NEW_APPLICATION_OWNERSHIP_DETAILS", "TL_NEW_APPLICATION_DOCUMENTS_REQUIRED", "TL_SUMMARY_HEADER"]}
                currentStep={currentStep + 1}
                onStepClick={handleStepClick}
                style={{ marginBottom: "24px" }}
            />

            <FormComposerV2
                key={currentConfig.key}
                config={[currentConfig]}
                onSubmit={handleFormSubmit}
                defaultValues={sessionFormData[currentConfig.key] || {}}
                label={currentStep === config.length - 1 ? t("CS_COMMON_SUBMIT") : t("CS_COMMON_NEXT")}
                isSubmitting={loading}
                showSecondaryLabel={currentStep > 0}
                secondaryLabel={t("CS_COMMON_BACK")}
                secondaryActionIcon="ArrowBack"
                onSecondayActionClick={() => setCurrentStep(currentStep - 1)}
            />

            {showToast && <Toast isDleteBtn={true} error={showToast?.key === "error" ? true : false} label={error} onClose={closeToast} />}
            {loading && <Loader />}
        </div>
    );
};

export default NewApplication;
