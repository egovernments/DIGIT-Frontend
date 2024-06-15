export const transformCreateData = (data) => {

  return {
    cases: {
      "id": data?.id,
      "tenantId": "pg",
      "resolutionMechanism": "COURT",
      "caseTitle": null,
      "isActive": null,
      "caseDescription": "Case description",
      "filingNumber": data?.filingNumber,
      "courtCaseNumber": null,
      "caseNumber": data?.caseNumber,
      "cnrNumber": null,
      "accessCode": null,
      "courtId": data?.courtId,
      "benchId": data?.benchId,
      "linkedCases": data?.linkedCases?.map(linkedCase => ({
        "id": linkedCase.id,
        "relationshipType": linkedCase.relationshipType,
        "caseNumber": linkedCase.caseNumber || "null",
        "referenceUri": linkedCase.referenceUri,
        "isActive": linkedCase.isActive,
        "documents": linkedCase.documents,
        "additionalDetails": linkedCase.additionalDetails || "string",
        "auditdetails": {
          "createdBy": linkedCase.auditdetails?.createdBy,
          "lastModifiedBy": linkedCase.auditdetails?.lastModifiedBy,
          "createdTime": linkedCase.auditdetails?.createdTime || 0,
          "lastModifiedTime": linkedCase.auditdetails?.lastModifiedTime,
        }
      })) || [],
      "filingDate": data?.filingDate,
      "registrationDate": data?.registrationDate,
      "caseDetails": {},
      "caseCategory": data?.caseCategory,
      "natureOfPleading": data?.natureOfPleading,
      "statutesAndSections": data?.statutesAndSections?.map(section => ({
        "id": section.id,
        "tenantId": "pg",
        "statute": "Statute",
        "sections": section.sections || ["str"],
        "subsections": section.subsections || ["str"],
        "additionalDetails": section.additionalDetails,
        "auditdetails": {
          "createdBy": section.auditdetails?.createdBy,
          "lastModifiedBy": section.auditdetails?.lastModifiedBy,
          "createdTime": section.auditdetails?.createdTime || 0,
          "lastModifiedTime": section.auditdetails?.lastModifiedTime || 0
        },
        "strSections": section.strSections,
        "strSubsections": section.strSubsections
      })) || [],
      "litigants": data?.litigants || [],
      "representatives": data?.representatives || [],
      "status": "DRAFT_IN_PROGRESS",
      "documents": data?.documents || [],
      "remarks": "remarks",
      "workflow": {
        "action": "SAVE_DRAFT",
        "comments": null,
        "documents": null,
        "assignes": null,
        "rating": null
      },
      "additionalDetails": data?.additionalDetails || {},
      "auditDetails": {
        "createdBy": data?.auditDetails?.createdBy,
        "lastModifiedBy": data?.auditDetails?.lastModifiedBy,
        "createdTime": data?.auditDetails?.createdTime || 1718430975954,
        "lastModifiedTime": data?.auditDetails?.lastModifiedTime || 1718430975954
      }
    }
  }
}
