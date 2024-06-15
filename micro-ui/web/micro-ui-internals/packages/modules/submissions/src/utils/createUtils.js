export const transformCreateData = (data)=>{

    return {
        "application": { //Hardcoded the request for timebeing. Need to replace with actual input values from the screen
            "tenantId": Digit.ULBService.getCurrentTenantId(),
            "filingNumber": "CASE-FILING-NO-2024-06-10-001145",
            "cnrNumber": null,
            "caseId": "5d463047-3449-4140-a918-8c00e0867a4e",
            "referenceId": "db3b2f72-ec26-4a5e-976a-6e42c6b6f06d",
            "createdDate": 1716287400,
            "createdBy": "baf36d5a-58ff-4b9b-b263-69ab45b1c7b4",
            "onBehalfOf": [
                "baf36d5a-58ff-4b9b-b263-69ab45b1c7b4",
                "e5a28bb3-3f13-462c-aa75-fba94e8a3a1d"
            ],
            "applicationType": "baf36d5a-58ff-4b9b-b263-69ab45b1c7b4",
            "issuedBy": null,
            "status": "example_status",
            "comment": "example_comment",
            "isActive": true,
            "statuteSection": {
                "id": "a1e9a7d4-0e16-4ab8-b5ab-2928c78475a2",
                "tenantId": "pg",
                "statute": "example_statute",
                "sections": [
                    "section_1",
                    "section_2"
                ],
                "subsections": [
                    "subsection_1",
                    "subsection_2"
                ],
                "additionalDetails": null,
                "auditdetails": {
                    "createdBy": "baf36d5a-58ff-4b9b-b263-69ab45b1c7b4",
                    "lastModifiedBy": "baf36d5a-58ff-4b9b-b263-69ab45b1c7b4",
                    "createdTime": 1716287400,
                    "lastModifiedTime": 1716287400
                },
                "strSections": "example_str_sections",
                "strSubsections": "example_str_subsections"
            },
            "documents": [
                {
                    "documentName": "example_document_name",
                    "documentType": "example_document_type",
                    "fileStoreId": "example_file_store_id"
                },
                {
                    "documentName": "example_document_name_2",
                    "documentType": "example_document_type_2",
                    "fileStoreId": "example_file_store_id_2"
                }
            ],
            "additionalDetails": "example_additional_details",
            "auditDetails": {
                "createdBy": "baf36d5a-58ff-4b9b-b263-69ab45b1c7b4",
                "lastModifiedBy": "baf36d5a-58ff-4b9b-b263-69ab45b1c7b4",
                "createdTime": 1716287400,
                "lastModifiedTime": 1716287400
            },
            "workflow": {
                "id": "workflow123",
                "action": "CREATE",
                "status": "in_progress",
                "comments": "Workflow comments",
                "documents": [
                    {
                        "documentType": "pdf",
                        "fileName": "workflow_document.pdf",
                        "fileStoreId": "workflowStoreId123",
                        "documentUid": "workflowDoc123",
                        "auditDetails": {
                            "createdBy": "user123",
                            "lastModifiedBy": "user123",
                            "createdTime": 1687958400,
                            "lastModifiedTime": 1687958400
                        }
                    }
                ]
            }

        }
    }

}