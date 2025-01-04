import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { Card, LoaderScreen } from "@egovernments/digit-ui-components";
import MyBillsSearch from "../../components/MyBillsSearch";
import MyBillsTable from "../../components/MyBillsTable";

const MyBills = () => {

    const { t } = useTranslation();
    const location = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const [tableData, setTableData] = useState([]);

    const BillSearchCri = {
        url: `/health-expense/bill/v1/_search`,
        body: {
            billCriteria: {
                tenantId: tenantId,
                locality: "",
                referenceId: []
            }
        },
        config: {
            enabled: true,
            select: (data) => {
                return data;
            },
        },
    };

    const { isLoading: isBillLoading, data: BillData } = Digit.Hooks.useCustomAPIHook(BillSearchCri);

    function formatTimestampToDate(timestamp) {
        // Check if the timestamp is valid
        if (!timestamp || typeof timestamp !== "number") {
            return "Invalid timestamp";
        }

        // Convert timestamp to a JavaScript Date object
        const date = new Date(timestamp);

        // Format the date to a readable format (e.g., DD/MM/YYYY)
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    function getUniqueReferenceIdCount(data) {
        if (!data?.billDetails) return 0;

        const uniqueReferenceIds = new Set(
            data.billDetails.map((detail) => detail.referenceId)
        );

        return uniqueReferenceIds.size;
    }

    function getBillSummary(data) {
        return data.map((individualEntry) => {
            const billId = individualEntry?.billNumber;
            const billDate = formatTimestampToDate(individualEntry.billDate);
            const noOfRegisters = getUniqueReferenceIdCount(individualEntry) || 0;
            const noOfWorkers = individualEntry?.billDetails?.length || 0;
            const boundaryCode = individualEntry?.localityCode || "NA";
            const projectName = 'NA';
            const pdfID = individualEntry?.additionalDetails?.reportDetails?.pdfReportId;
            const excelID = individualEntry?.additionalDetails?.reportDetails?.excelReportId;

            return [billId, billDate, noOfRegisters, noOfWorkers, boundaryCode, projectName, pdfID, excelID];

        });
    }

    useEffect(() => {
        // if(BillData){
        /// TODO: NEED TO UPDATE WHEN API WORKS
        // }

        setTableData(getBillSummary(hardCodedData));
    }, [])

    const hardCodedData =
        [
            {
                "id": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                "tenantId": "mz",
                "localityCode": null,
                "billDate": 1735986867921,
                "dueDate": 0,
                "totalAmount": 1830,
                "totalPaidAmount": 0,
                "businessService": "EXPENSE.WAGES",
                "referenceId": "4ec077ab-ecd3-44e3-a07e-b029ee0f1823",
                "fromPeriod": 1734373800000,
                "toPeriod": 1736101799000,
                "paymentStatus": null,
                "status": "ACTIVE",
                "billNumber": "WB-2025-01-04-000025",
                "payer": {
                    "id": "f8e6404a-851d-4b95-bc97-53ba40fe0017",
                    "parentId": null,
                    "tenantId": "mz",
                    "type": "ORG",
                    "identifier": "4ec077ab-ecd3-44e3-a07e-b029ee0f1823",
                    "status": "ACTIVE",
                    "additionalDetails": null,
                    "auditDetails": {
                        "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                        "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                        "createdTime": 1735986868787,
                        "lastModifiedTime": 1735986868787
                    }
                },
                "billDetails": [
                    {
                        "id": "61603578-1e07-4a67-be6a-a5f040ca5762",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "bf631995-c75b-4d13-98e2-609892b39947",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "95f1b444-3a5d-48e3-a1ac-247d234bd3c8",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "b12532de-df22-4580-96a9-401d14fdc55d",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "c424bd79-1ec3-4834-a0f1-831dd7efc299",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 35,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "beebefe3-49a0-4b1a-b9b3-223d606e53c3",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 25,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "6e2a0fc4-7357-4467-9058-eb3fcf085303",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 15,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "42b72b0c-ce59-4ce7-b940-c7d236cf2cc0",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "f9c76350-a1c6-4614-8a17-a9d853f4f054",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "5d39dcde-3557-4414-97a9-68dda4c42375",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "18226b21-6e3e-4f12-81a1-61275b28c5f1",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 28,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "0b67d809-9f77-43d0-ab9a-65527ef90861",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 20,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "bbddff43-f98f-4ef2-be25-981cce0a9900",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 12,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "629f1296-4de2-497e-b0e4-c0336683ed1f",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "c40542f9-9fbc-46d6-b0c5-c5286edbd0da",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "5b0d7010-7302-446c-b77c-8bf6bbd74114",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "13c9b2ba-a38d-4c0c-beb5-d7d8afe6d3fc",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 14,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "e20e2048-9424-4106-acf2-8484624176c3",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 10,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "14b77229-deb7-48a5-bbf2-6e5153daf7b1",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 6,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "57767427-e054-41b5-aac1-876f250c7534",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "ac2c9b62-ed63-4ba4-95f8-019ce63e7420",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "d0892da3-e879-48ee-b5c6-2d9126608811",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "5b8931b9-2937-43c9-b2c0-d9f1bf0d244c",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 28,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "466cca62-5924-47ef-a28d-968eaefaeeae",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 20,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "5496b71d-2e37-46de-91ae-0cd56b4def48",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 12,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "d7aea993-c1ce-4b5e-86cf-7ca20f72406c",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "368121bf-ffcd-4b85-8f15-431ec26305c9",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "c1d30efc-9b76-4d7c-8b3c-d0b3cbdfc646",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "5ad28c22-cf60-4617-a25b-636686c0ef9a",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 21,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "41a639f3-053e-40ec-bd36-508fd7591c57",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 15,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "b9b3f5ad-69e4-4447-bbff-bf7cc4f5a1d9",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 9,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "e966abd7-6a9f-4966-bae7-93f91a4765e1",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "d2a5353f-b0d7-4ab7-ba01-a8861b233eed",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "5757c153-5dfa-4468-b4a1-cf2d87532f2f",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "fe3d9f21-c44c-4f79-bed0-9b036c5efe08",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 91,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "a7cd81c2-45a8-4043-978c-af4dff24dc19",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 65,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "f7394c4f-8a46-4d5e-99bb-948766bb0e4b",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 39,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "5c94e4f8-0ffa-4fab-bb16-b261f297d53a",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "8045ba08-6d1d-438b-85a9-9bddec050f85",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "e8811705-0be8-44c0-bd2e-5bc6c42147b6",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "3378d888-c5c0-44f9-8bb4-40c16cc9abcd",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 56,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "da19fa6b-8972-4160-b325-143846a75d1d",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 40,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "b75e79d3-2d2c-4a43-ac39-9e2857f5a69e",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 24,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "f3c3eb4a-ac8e-4f84-b6aa-0b8ecc3ba17e",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "d87854c0-3224-405e-a35a-b828458c3030",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "e350df3c-a6a1-44da-a839-49134190b059",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "87d9ef39-76ef-4191-91e6-b8dc20fd3e11",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 21,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "3927a855-5337-4a29-867c-3d4d676f4164",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 15,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "83062ef4-80bb-4ac3-a1cb-abf989b98b6a",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 9,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "bafd9dd2-2744-4bc9-be8f-77418c8be509",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "2bbcc8a6-20e7-4013-853e-164d839fbfa6",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "10a5c7fe-8e27-47dc-b7a7-dd17f92e18ad",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "21329e99-394a-4f41-89a2-71467f64118f",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 21,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "ed3cc4cc-5b45-47bf-91a9-7375568431db",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 15,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "1926ad3b-c14e-43de-8aab-001d99858068",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 9,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "65d701d3-8ce7-495d-9a50-fe68688e5a37",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "687895ef-c7e5-45e0-8306-cf195b5bd098",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "7dc6af46-fc8a-471f-ad22-c03c572abb40",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "a1eff9a1-b239-483c-9afe-0228869eb00b",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 21,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "813c2cf1-8c30-4f1d-b29e-ee9a4ee466f5",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 15,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "d07d0533-f45b-4f8a-a2b3-7683e5686a23",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 9,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "06490e67-4be5-4539-8635-f27a98de3f4d",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "fa3927c3-02be-4299-98ba-af31084a596c",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "dee4ba5b-e18f-4fb5-b7c1-f55fdb83b6c4",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "159d6123-e5e9-4ad0-93be-36ae0784ef3b",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 21,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "a0eb6945-6e0e-4a53-9455-b1beeae53f4e",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 15,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "fa4cd9bd-2991-42fd-9842-97bd63244bfc",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 9,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "37f17346-40a1-4c79-883e-47719ada6224",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8299556-22c7-459e-925e-f265b7cd72a6",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "847182d4-edca-4777-833f-a56ce4808d15",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "f7043061-e4d6-429e-9a81-a9148af62513",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "a77eec84-a109-4678-b36f-131cf8a1fc5d",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 42,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "03a0ff4b-f84e-47bb-9923-4f666ba94541",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 30,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "6694a66f-3375-47b8-95dc-a9d5407f727b",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 18,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "45c91058-a096-44df-a484-40ed463b5865",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "b8a4b0dd-9a93-4cd3-b730-7b9cf368589e",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "13f9f430-2864-4b97-b9fb-61868405228d",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "ffa438ea-77af-4ebc-9bf3-4c3bff7bf609",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "f4ffef2b-1cd6-4bd3-bad8-8214c299a940",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 63,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "56f496a7-34c7-4aee-a3de-9f31c95cc439",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 45,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "ec98721c-8294-40cb-9ef9-fe51110560ed",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 27,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "7d1097bb-762b-4e84-a9ff-26ff45d2472e",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "9e278924-872c-4d51-9137-6c48829df494",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "a240ebbe-a062-4753-9aa6-437cd779b36c",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "398f28a1-7d04-473d-a5e7-d480fdabadd3",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "4c1533f4-318e-475d-9ce1-6c06e3dbbc67",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 56,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "8f688581-cdc3-4970-b02b-072116ea4644",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 40,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "481134c2-9c01-4604-a0b5-78c1735b2281",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 24,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "0ef03129-65f0-4667-8ec0-260ca76bae91",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "3ad2f4e7-db85-4aa2-b995-c85fca693052",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "0a9787aa-f2df-40bf-8e71-14977cdef4f5",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "3b39007d-8fee-4d26-ab50-a0055f9bcd6b",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "b7bc7d2d-b766-45fb-88ed-0a4048a13ef2",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 91,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "091ce646-d644-41fe-a7df-c9a2ef6aa995",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 65,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "46b11d8b-cf94-477f-b09a-7bdc40f418d5",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 39,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "cf899b72-cc56-4091-93e2-3a98f2f15047",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "3ad2f4e7-db85-4aa2-b995-c85fca693052",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "539a8d12-ba44-48f8-9806-83b867bd0431",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "c7685ac0-01ac-4af2-b75d-8d389c2dd4a6",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "6d990c25-3844-4937-bcd9-539529948217",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 91,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "5d5f3fcb-af24-4759-aa8b-16eaa16a6aa7",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 65,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "bed2a2a4-36ae-4bae-a8c1-7ccc5c421907",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 39,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "8d18f7a7-b6c5-42d8-89c0-4cd9615a2926",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "3ad2f4e7-db85-4aa2-b995-c85fca693052",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "b5697f29-3735-4528-a663-0b310f65e093",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "dcab5943-6ef6-43fd-aaaa-b8fa76a82de0",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "0590d097-50be-4a74-8919-368c0527c57b",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 91,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "b7440a48-1fee-41c2-a5db-aba8f260840a",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 65,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "aa282873-6836-44d2-8795-9cfa04a557c0",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 39,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "6f6d7d2a-74ae-46a3-91d5-f13fb0f8feea",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "3ce46cc9-dab8-41aa-8aa8-46c2c82f0cfe",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "a5ea6670-33e9-41e2-b024-cc5d897af93f",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "08cc9aec-d66e-4bc4-9781-569e9ec8e072",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "6598788e-e0ed-40b8-9f92-96c6765735c9",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 14,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "531ab657-39ae-42a8-b4a1-2d0cecba40eb",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 10,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "f6fa7ef5-c2e7-4147-a913-20f5308cf266",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 6,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "fa6355a8-9719-4f4e-bde6-566f17259b50",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "3ce46cc9-dab8-41aa-8aa8-46c2c82f0cfe",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "d944971e-c058-477e-b1f2-b79c60296a9a",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "efa752c6-b247-4a60-afbe-3f32fd580826",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "b2860ea3-9c3b-4df3-b769-5c653ab8cc67",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 14,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "09cfd482-0cc7-418a-9207-a1f7056a06ae",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 10,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "531ba880-36e4-4b74-a68d-0eb613d87116",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 6,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "05efa22f-ee72-4986-8994-29c1bddde3a2",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "3ce46cc9-dab8-41aa-8aa8-46c2c82f0cfe",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "6305f5f7-9273-4df9-a34e-64c9114ed7e5",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "203b457f-3805-402a-9a6e-0e419c601587",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "86ae91f1-19d5-41c5-8aca-029f9c05d3c8",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 21,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "67ef727c-3b73-4f2b-9d7a-6ff97d709d2d",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 15,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "f777f901-bb89-473f-82c6-04c46b4e8d5b",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 9,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    },
                    {
                        "id": "a7e55ba6-039a-4ac2-afb2-00badcdd549b",
                        "tenantId": "mz",
                        "billId": "2adfe6e4-1ccf-48ac-9d1e-91a93a80a114",
                        "totalAmount": 1830,
                        "totalPaidAmount": 0,
                        "referenceId": "3ce46cc9-dab8-41aa-8aa8-46c2c82f0cfe",
                        "paymentStatus": null,
                        "status": "ACTIVE",
                        "fromPeriod": 0,
                        "toPeriod": 0,
                        "payee": {
                            "id": "326c2c60-15ba-401d-9cea-f25afd2c5d31",
                            "parentId": null,
                            "tenantId": "mz",
                            "type": "IND",
                            "identifier": "569fe39e-1685-42d2-b3b9-6a2a12c42d79",
                            "status": "ACTIVE",
                            "additionalDetails": null,
                            "auditDetails": {
                                "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                "createdTime": 1735986868787,
                                "lastModifiedTime": 1735986868787
                            }
                        },
                        "lineItems": null,
                        "payableLineItems": [
                            {
                                "id": "ce7425d0-f5c4-454e-b487-78aa9b1857e3",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "FOOD",
                                "amount": 14,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "ac45052e-8177-46b6-aaf7-6c52fdc13e4f",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "TRAVEL",
                                "amount": 10,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            },
                            {
                                "id": "5b223df3-3bc2-4335-90a1-e3b2d2e7f183",
                                "billDetailId": null,
                                "tenantId": "mz",
                                "headCode": "PER_DAY",
                                "amount": 6,
                                "type": "PAYABLE",
                                "paidAmount": 0,
                                "status": "ACTIVE",
                                "paymentStatus": null,
                                "additionalDetails": null,
                                "auditDetails": {
                                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                                    "createdTime": 1735986868787,
                                    "lastModifiedTime": 1735986868787
                                }
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                            "createdTime": 1735986868787,
                            "lastModifiedTime": 1735986868787
                        },
                        "additionalDetails": null
                    }
                ],
                "additionalDetails": null,
                "auditDetails": {
                    "createdBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                    "lastModifiedBy": "488c2a00-e33f-49f5-932d-239b1ae33e88",
                    "createdTime": 1735986868787,
                    "lastModifiedTime": 1735986868787
                },
                "wfStatus": null
            }
        ];

    if (isBillLoading) {
        return <LoaderScreen />
    }

    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>
                {t("HCM_AM_MY_BILLS")}
            </Header>


            <MyBillsSearch />

            <Card>
                <MyBillsTable data={tableData} />
            </Card>

        </React.Fragment>
    );
};

export default MyBills;
