import React from "react";
import { Tag, Button } from "@egovernments/digit-ui-components";

export const UICustomizations = {

    PropertySearchConfig: {

        populateULBCityOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-mdms-service/v1/_search",
                params: { tenantId },
                body: {
                    MdmsCriteria: {
                        tenantId: tenantId,
                        moduleDetails: [
                            {
                                moduleName: "tenant",
                                masterDetails: [
                                    {
                                        name: "tenants",
                                    }
                                ]
                            }
                        ]
                    }
                },
                config: {
                    enabled: true,
                    select: (data) => {
                        const tenants = data?.MdmsRes?.tenant?.tenants || [];
                        return tenants.map((tenant) => ({
                            code: tenant.code,
                            name: tenant.name,
                            value: tenant.code,
                            i18nKey: `TENANT_TENANTS_${tenant.code.toUpperCase().replace(/[.:-\s\/]/g, "_")}`
                        }));
                    },
                },
            };
        },

        populateLocalityOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-location/location/v11/boundarys/_search",
                params: {
                    tenantId,
                    hierarchyTypeCode: "REVENUE",
                    boundaryType: "Locality"
                },
                body: {},
                config: {
                    enabled: true,
                    select: (data) => {
                        const localities = data?.TenantBoundary?.[0]?.boundary || [];
                        return localities.map((locality) => ({
                            code: locality.code,
                            name: locality.name,
                            value: locality.code,
                            i18nKey: `${tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${locality.code.toUpperCase().replace(/[._:-\s\/]/g, "_")}`
                        }));
                    }
                }
            };
        },

        preProcess: (requestCriteria, additionalDetails) => {
            // Handle both body.Property (old format) and params (new format)
            const propertyParams = requestCriteria?.body?.Property || requestCriteria?.params || {};
            // Always ensure we have a tenantId for the API call
            const searchParams = {};
            const defaultTenant = Digit?.ULBService?.getCurrentTenantId();
            searchParams.tenantId = defaultTenant;

            // Add pagination and sorting params
            if (requestCriteria.params?.limit) searchParams.limit = requestCriteria.params.limit;
            if (requestCriteria.params?.offset) searchParams.offset = requestCriteria.params.offset;
            if (requestCriteria.params?.sortOrder) searchParams.sortOrder = requestCriteria.params.sortOrder;
            if (requestCriteria.params?.sortBy) searchParams.sortBy = requestCriteria.params.sortBy;

            // Set tenantId (required for all API calls)
            if (propertyParams.ulbCity) {
                searchParams.tenantId = propertyParams.ulbCity?.[0]?.code;
            } else if (defaultTenant) {
                searchParams.tenantId = defaultTenant;
            }

            // Check if this is a real search (has search fields) or just initial load
            const hasSearchFields = Object.keys(propertyParams).some(key =>
                key !== 'ulbCity' && propertyParams[key] && propertyParams[key].toString().trim() !== ''
            );

            if (hasSearchFields) {

                // Property Search Parameters
                if (propertyParams.ownerMobNo) {
                    searchParams.mobileNumber = propertyParams.ownerMobNo;
                }
                if (propertyParams.propertyTaxUniqueId) {
                    searchParams.propertyIds = propertyParams.propertyTaxUniqueId;
                }
                if (propertyParams.existingPropertyId) {
                    searchParams.oldpropertyids = propertyParams.existingPropertyId;
                }
                if (propertyParams.propertyMohalla) {
                    searchParams.locality = propertyParams.propertyMohalla;
                }
                if (propertyParams.ownerName) {
                    searchParams.name = propertyParams.ownerName;
                }
                if (propertyParams.surveyId) {
                    searchParams.surveyId = propertyParams.surveyId;
                }

                // Application Search Parameters
                if (propertyParams.propertyTaxApplicationNo) {
                    searchParams.acknowledgementIds = propertyParams.propertyTaxApplicationNo;
                }
                if (propertyParams.ownerMobNoProp) {
                    searchParams.mobileNumber = propertyParams.ownerMobNoProp;
                }
                if (propertyParams.applicationPropertyTaxUniqueId) {
                    searchParams.propertyIds = propertyParams.applicationPropertyTaxUniqueId;
                }

                // Only validate if this is an actual search request (not initial page load)
                // Check if any search parameters exist before validation
                // const hasAnyParams = Object.keys(propertyParams).some(key =>
                //     propertyParams[key] && propertyParams[key].trim() !== ''
                // );

                // if (hasAnyParams) {
                //     // Validation: At least one search parameter besides tenantId
                //     const hasValidParams = Object.keys(searchParams).some(key =>
                //         key !== 'tenantId' && searchParams[key] && searchParams[key].trim() !== ''
                //     );

                //     if (!hasValidParams || !searchParams.tenantId) {
                //         throw new Error("Please fill at least one field along with city");
                //     }
                // } else {
                //     // Return empty search params for initial load
                //     return {
                //         ...requestCriteria,
                //         body: {
                //             ...requestCriteria.body,
                //             Property: null
                //         }
                //     };
                // }

                // Apply same filtering logic as mono-ui for propertyIds
                if (searchParams.propertyIds && typeof searchParams.propertyIds === 'string') {
                    // Transform "ids" to "propertyIds" as per mono-ui logic
                    searchParams.propertyIds = searchParams.propertyIds.trim();
                }

                // Clean up empty values
                Object.keys(searchParams).forEach(key => {
                    const value = searchParams[key];
                    if (!value || (typeof value === 'string' && value.trim() === '')) {
                        delete searchParams[key];
                    } else if (typeof value === 'string') {
                        searchParams[key] = value.trim();
                    }
                    // If value is not a string (object, array, etc.), keep it as is
                });

            }

            // Always return the request with at least tenantId for valid API calls
            return {
                ...requestCriteria,
                params: searchParams
            };
        },

        additionalCustomizations: (row, key, column, value, t, searchResult) => {
            // Helper function to format address like mono-ui
            const getAddress = (addressObj) => {
                if (!addressObj) return "-";
                let doorNo = addressObj.doorNo ? (addressObj.doorNo + ",") : '';
                let buildingName = addressObj.buildingName ? (addressObj.buildingName + ",") : '';
                let street = addressObj.street ? (addressObj.street + ",") : '';
                let mohalla = addressObj.locality?.name ? (addressObj.locality.name + ",") : '';
                let city = addressObj.city ? addressObj.city : '';
                return (doorNo + buildingName + street + mohalla + city) || "-";
            };

            // Get userType to determine routing
            const userType = Digit.SessionStorage.get("userType") || window.sessionStorage.getItem("userType") || "employee";
            const basePath = userType === "citizen" ? "citizen" : "employee";

            switch (key) {
                case "PT_COMMON_TABLE_COL_PT_ID":
                    return (
                        <Button
                            label={String(value || t("ES_COMMON_NA"))}
                            title={String(value || t("ES_COMMON_NA"))}
                            variation="link"
                            icon="ExternalLink"
                            size="small"
                            onClick={() => window.location.href = `/${window.contextPath}/${basePath}/pt/property/${value}?tenantId=${row?.tenantId}`}
                        />
                    );

                case "PT_COMMON_TABLE_COL_APP_NO":
                    return (
                        <Button
                            label={String(value || t("ES_COMMON_NA"))}
                            title={String(value || t("ES_COMMON_NA"))}
                            variation="link"
                            icon="ExternalLink"
                            size="small"
                            onClick={() => window.location.href = `/${window.contextPath}/${basePath}/pt/application-preview?propertyId=${row?.propertyId || row?.PT_PROPERTY_ID || ''}&applicationNumber=${value}&tenantId=${row?.tenantId}&type=property`}
                        />
                    );

                case "PT_COMMON_COL_ADDRESS":
                    return getAddress(value);

                case "PT_PROPERTY_ID":
                case "PT_COMMON_TABLE_COL_PROPERTY_ID":
                    return (
                        <Button
                            label={String(value || t("ES_COMMON_NA"))}
                            title={String(value || t("ES_COMMON_NA"))}
                            variation="link"
                            icon="Home"
                            size="small"
                            onClick={() => window.location.href = `/${window.contextPath}/${basePath}/pt/property/${value}?tenantId=${row?.tenantId}`}
                        />
                    );

                case "PT_RECEIPT_NUMBER":
                case "PT_COMMON_TABLE_COL_RECEIPT_NO":
                    return (
                        <Button
                            label={String(value || t("ES_COMMON_NA"))}
                            title={String(value || t("ES_COMMON_NA"))}
                            variation="link"
                            icon="Receipt"
                            size="small"
                            onClick={() => {
                                // In real implementation, this would download or view the receipt
                                // window.location.href = `/${window.contextPath}/employee/pt/receipt-details/${value}?tenantId=${row?.tenantId}`;
                            }}
                        />
                    );

                case "PT_COMMON_TABLE_COL_APP_TYPE":
                    return value ? t(`PT_${value}`) : t("ES_COMMON_NA");

                case "PT_COMMON_TABLE_COL_STATUS":
                case "PT_COMMON_TABLE_COL_STATUS_LABEL":
                case "PT_PROPERTY_STATUS":
                    const getPropertyStatusType = (status) => {
                        switch (status) {
                            case "ACTIVE":
                                return "success";
                            case "INACTIVE":
                                return "error";
                            case "INWORKFLOW":
                                return "warning";
                            default:
                                return "monochrome";
                        }
                    };
                    return (
                        <Tag
                            type={getPropertyStatusType(value)}
                            label={t(`PT_STATUS_${value}`) || value || t("ES_COMMON_NA")}
                            showIcon={true}
                        />
                    );

                case "PT_COMMON_TABLE_COL_APP_STATUS":
                case "PT_APPLICATION_STATUS":
                    const getApplicationStatusType = (status) => {
                        switch (status) {
                            case "APPROVED":
                                return "success";
                            case "REJECTED":
                                return "error";
                            case "PENDING_APPROVAL":
                            case "PENDINGAPPROVAL":
                                return "warning";
                            case "INITIATED":
                                return "monochrome";
                            default:
                                return "monochrome";
                        }
                    };
                    return (
                        <Tag
                            type={getApplicationStatusType(value)}
                            label={t(`PT_APPLICATION_${value}`) || value || t("ES_COMMON_NA")}
                            showIcon={true}
                        />
                    );

                default:
                    return value ? String(value) : t("ES_COMMON_NA");
            }
        }
    },

    PropertyInboxConfig: {

        populateULBCityOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-mdms-service/v1/_search",
                params: { tenantId },
                body: {
                    MdmsCriteria: {
                        tenantId: tenantId,
                        moduleDetails: [
                            {
                                moduleName: "tenant",
                                masterDetails: [
                                    {
                                        name: "tenants",
                                    }
                                ]
                            }
                        ]
                    }
                },
                config: {
                    enabled: true,
                    select: (data) => {
                        const tenants = data?.MdmsRes?.tenant?.tenants || [];
                        return tenants.map((tenant) => ({
                            code: tenant.code,
                            name: tenant.name,
                            value: tenant.code,
                            i18nKey: `TENANT_TENANTS_${tenant.code.toUpperCase().replace(/[.:-\s\/]/g, "_")}`
                        }));
                    },
                },
            };
        },

        populateLocalityOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-location/location/v11/boundarys/_search",
                params: {
                    tenantId,
                    hierarchyTypeCode: "REVENUE",
                    boundaryType: "Locality"
                },
                body: {},
                config: {
                    enabled: true,
                    select: (data) => {
                        const localities = data?.TenantBoundary?.[0]?.boundary || [];
                        return localities.map((locality) => ({
                            code: locality.code,
                            name: locality.name,
                            value: locality.code,
                            i18nKey: `${tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${locality.code.toUpperCase().replace(/[._:-\s\/]/g, "_")}`
                        }));
                    }
                }
            };
        },

        populateStatusOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-workflow-v2/egov-wf/businessservice/_search",
                params: {
                    tenantId,
                    businessServices: "PT.CREATE,PT.UPDATE"
                },
                body: {},
                config: {
                    enabled: true,
                    select: (data) => {
                        const businessServices = data?.BusinessServices || [];
                        const allStates = [];

                        businessServices.forEach(service => {
                            const states = service?.states || [];
                            states.forEach(state => {
                                if (!allStates.find(s => s.code === state.state)) {
                                    allStates.push({
                                        code: state.state,
                                        name: state.state,
                                        value: state.state,
                                        i18nKey: `WF_PT_${state.state}`
                                    });
                                }
                            });
                        });

                        return allStates;
                    }
                }
            };
        },

        preProcess: (requestCriteria, additionalDetails) => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            const filterFormData = requestCriteria?.body?.inbox || requestCriteria?.state?.filterForm || {};

            const limit = requestCriteria.params?.limit || requestCriteria.state?.tableForm?.limit || 10;
            const offset = requestCriteria.params?.offset !== undefined ? requestCriteria.params.offset :
                (requestCriteria.state?.tableForm?.offset !== undefined ? requestCriteria.state.tableForm.offset : 0);

            const searchParams = {
                tenantId: tenantId,
                moduleName: "PT",
                limit: limit,
                offset: offset
            };

            // Add sorting params if provided
            if (requestCriteria.params?.sortOrder) searchParams.sortOrder = requestCriteria.params.sortOrder;
            if (requestCriteria.params?.sortBy) searchParams.sortBy = requestCriteria.params.sortBy;

            // Handle filter parameters
            if (filterFormData.propertyMohalla) {
                // Handle array of objects, single object, or string values
                if (Array.isArray(filterFormData.propertyMohalla) && filterFormData.propertyMohalla.length > 0) {
                    searchParams.locality = filterFormData.propertyMohalla[0].code || filterFormData.propertyMohalla[0];
                } else if (typeof filterFormData.propertyMohalla === 'object' && filterFormData.propertyMohalla.code) {
                    searchParams.locality = filterFormData.propertyMohalla.code;
                } else if (typeof filterFormData.propertyMohalla === 'string') {
                    searchParams.locality = filterFormData.propertyMohalla;
                }
            }

            if (filterFormData.status) {
                // Handle array of objects, single object, or string values
                if (Array.isArray(filterFormData.status) && filterFormData.status.length > 0) {
                    searchParams.status = filterFormData.status[0].code || filterFormData.status[0];
                } else if (typeof filterFormData.status === 'object' && filterFormData.status.code) {
                    searchParams.status = filterFormData.status.code;
                } else if (typeof filterFormData.status === 'string') {
                    searchParams.status = filterFormData.status;
                }
            }

            // Handle assignedToMe filter
            if (filterFormData.assignedToMe === "ASSIGNED_TO_ME") {
                const currentUser = Digit.UserService.getUser();
                const uuid = currentUser?.info?.uuid;
                if (uuid) {
                    searchParams.assignee = uuid;
                }
            }

            const requestBody = {
                RequestInfo: requestCriteria.body?.RequestInfo || {
                    apiId: "Rainmaker",
                    ver: ".01",
                    ts: "",
                    action: "_search",
                    did: "1",
                    key: "",
                    msgId: "20170310130900|en_IN",
                    authToken: Digit?.UserService?.getUser()?.access_token
                }
            };

            return {
                ...requestCriteria,
                params: searchParams,
                body: requestBody
            };
        },

        additionalCustomizations: (row, key, column, value, t, searchResult) => {
            // Get userType to determine routing
            const userType = Digit.SessionStorage.get("userType") || window.sessionStorage.getItem("userType") || "employee";
            const basePath = userType === "citizen" ? "citizen" : "employee";

            // Helper function to get workflow status type
            const getWorkflowStatusType = (status) => {
                if (!status) return "monochrome";
                const upperStatus = status.toUpperCase();

                if (upperStatus.includes("APPROVED") || upperStatus.includes("ACTIVE")) {
                    return "success";
                } else if (upperStatus.includes("REJECTED") || upperStatus.includes("CANCELLED")) {
                    return "error";
                } else if (upperStatus.includes("PENDING") || upperStatus.includes("INPROGRESS")) {
                    return "warning";
                } else if (upperStatus.includes("INITIATED")) {
                    return "monochrome";
                }
                return "monochrome";
            };

            // Helper function to calculate SLA
            const getSLADays = (sla) => {
                if (!sla || sla < 0) return t("ES_COMMON_NA");
                const days = Math.floor(sla / (24 * 60 * 60 * 1000));
                return days > 0 ? `${days} ${t("ES_COMMON_DAYS")}` : t("ES_COMMON_TODAY");
            };

            switch (key) {
                case "PT_COMMON_TABLE_COL_APP_NO":
                    return (
                        <Button
                            label={String(value || t("ES_COMMON_NA"))}
                            variation="link"
                            icon="ExternalLink"
                            onClick={() => {
                                window.location.href = `/${window.contextPath}/${basePath}/pt/application-preview?applicationNumber=${value}&tenantId=${row?.tenantId}`;
                            }}
                        />
                    );

                case "WF_INBOX_HEADER_STATUS":
                    const statusValue = value || row?.state?.state || row?.status;
                    return (
                        <Tag
                            type={getWorkflowStatusType(statusValue)}
                            label={statusValue || t("ES_COMMON_NA")}
                            showIcon={true}
                        />
                    );

                case "PT_LOCALITY_MOHALLA":
                    const localityValue = value || row?.locality || row?.localityCode;
                    return localityValue || t("ES_COMMON_NA");

                case "WF_INBOX_HEADER_ASSIGNED_TO":
                    const assigneeValue = value || row?.assignee?.name || row?.assignee;
                    return assigneeValue || t("ES_COMMON_UNASSIGNED");

                case "WF_INBOX_HEADER_SLA_DAYS_REMAINING":
                    const slaValue = value || row?.businesssServiceSla || row?.sla;
                    return getSLADays(slaValue);

                default:
                    return value ? String(value) : t("ES_COMMON_NA");
            }
        }
    },

    PropertyRegistrationConfig: {
        populateLocalityOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-location/location/v11/boundarys/_search",
                params: {
                    tenantId,
                    hierarchyTypeCode: "REVENUE",
                    boundaryType: "Locality"
                },
                body: {},
                config: {
                    enabled: true,
                    select: (data) => {
                        const localities = data?.TenantBoundary?.[0]?.boundary || [];
                        return localities.map((locality) => ({
                            code: locality.code,
                            name: locality.name,
                            value: locality.code,
                            i18nKey: `${tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${locality.code.toUpperCase().replace(/[._:-\s\/]/g, "_")}`
                        }));
                    }
                }
            };
        },

        populatePropertyTypeOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-mdms-service/v1/_search",
                params: { tenantId },
                body: {
                    MdmsCriteria: {
                        tenantId: tenantId,
                        moduleDetails: [
                            {
                                moduleName: "PropertyTax",
                                masterDetails: [
                                    { name: "PropertyType" },
                                    { name: "PropertySubType" }
                                ]
                            }
                        ]
                    }
                },
                config: {
                    enabled: true,
                    select: (data) => {
                        // Merge PropertyType (excluding BUILTUP) + PropertySubType like mono-ui
                        const propertyTypes = (data?.MdmsRes?.PropertyTax?.PropertyType || [])
                            .filter(item => item.active === true && !item.code.includes("BUILTUP"));
                        const propertySubTypes = (data?.MdmsRes?.PropertyTax?.PropertySubType || []).filter(item => item.active === true);
                        return [...propertySubTypes, ...propertyTypes];
                    }
                }
            };
        },

        populateUsageCategoryOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-mdms-service/v1/_search",
                params: { tenantId },
                body: {
                    MdmsCriteria: {
                        tenantId: tenantId,
                        moduleDetails: [
                            {
                                moduleName: "PropertyTax",
                                masterDetails: [
                                    { name: "UsageCategoryMajor" },
                                    { name: "UsageCategoryMinor" }
                                ]
                            }
                        ]
                    }
                },
                config: {
                    enabled: true,
                    select: (data) => {
                        // Merge UsageCategoryMajor + UsageCategoryMinor like mono-ui
                        const usageMajor = data?.MdmsRes?.PropertyTax?.UsageCategoryMajor || [];
                        const usageMinor = data?.MdmsRes?.PropertyTax?.UsageCategoryMinor || [];

                        // First add all UsageCategoryMinor items
                        const merged = usageMinor.map(item => ({
                            code: item.code,
                            name: item.name,
                            value: item.code,
                            i18nKey: `PROPERTYTAX_BILLING_SLAB_${item.code}`,
                            usageCategoryMajor: item?.usageCategoryMajor || ""
                        }));

                        // Then add UsageCategoryMajor items that don't have corresponding UsageCategoryMinor
                        const majorWithoutMinor = usageMajor
                            .filter(major => !usageMinor.some(minor => minor.usageCategoryMajor === major.code))
                            .map(item => ({
                                code: item.code,
                                name: item.name,
                                value: item.code,
                                i18nKey: `PROPERTYTAX_BILLING_SLAB_${item.code}`,
                                usageCategoryMajor: item?.usageCategoryMajor || ""
                            }));

                        return [...merged, ...majorWithoutMinor];
                    }
                }
            };
        },

        populateOwnershipTypeOptions: () => {
            const tenantId = Digit?.ULBService?.getCurrentTenantId();
            return {
                url: "/egov-mdms-service/v1/_search",
                params: { tenantId },
                body: {
                    MdmsCriteria: {
                        tenantId: tenantId,
                        moduleDetails: [
                            {
                                moduleName: "PropertyTax",
                                masterDetails: [
                                    { name: "OwnerShipCategory" },
                                    { name: "SubOwnerShipCategory" }
                                ]
                            }
                        ]
                    }
                },
                config: {
                    enabled: true,
                    select: (data) => {
                        // Same logic as mono-ui's getOwnerDetails function
                        const ownerShipCategory = data?.MdmsRes?.PropertyTax?.OwnerShipCategory || [];
                        const subOwnerShipCategory = data?.MdmsRes?.PropertyTax?.SubOwnerShipCategory || [];
                        const ownerShipDropdown = [];
                        const subCategoriesInOwnersType = ["INDIVIDUAL"];

                        ownerShipCategory.forEach((category) => {
                            const categoryCode = category.code;

                            if (subCategoriesInOwnersType.includes(categoryCode)) {
                                // For INDIVIDUAL category, show subcategories (SINGLEOWNER, MULTIPLEOWNERS)
                                const subCategories = subOwnerShipCategory.filter(
                                    subCat => subCat.ownerShipCategory === categoryCode
                                );
                                subCategories.forEach(subCat => {
                                    ownerShipDropdown.push({
                                        code: subCat.code,
                                        name: subCat.name,
                                        value: subCat.code,
                                        i18nKey: `PROPERTYTAX_BILLING_SLAB_${subCat.code}`
                                    });
                                });
                            } else {
                                // For other categories (INSTITUTIONAL, etc.), show the main category
                                ownerShipDropdown.push({
                                    code: category.code,
                                    name: category.name,
                                    value: category.code,
                                    i18nKey: `PROPERTYTAX_BILLING_SLAB_${category.code}`
                                });
                            }
                        });

                        // For property-tax/assessment-form, limit to first 4 options
                        const isAssessmentForm = window.location.href.indexOf("/property-tax/assessment-form") > 0 ||
                            window.location.href.indexOf("/pt/assessment-form") > 0;

                        return isAssessmentForm ? ownerShipDropdown.slice(0, 4) : ownerShipDropdown;
                    }
                }
            };
        },
    }
};