export const downloadHearingsAsPDF = async ({ t, params }) => {
    
    await Digit.CustomService.getResponse({
        // TODO: Replace with BFF service Hearing download PDF URL
        url: "https://cases.free.beeceptor.com/hearings",
        body: {
            criteria: {
                "tenantId": params.tenantId,
                "judgeId": params.judgeId != null ? params.judgeId: null,
                "advocateId": params.advocateId != null ? params.advocateId: null,
                "litigantId": params.litigantId != null ? params.litigantId: null,
                'fromDate': params.fromDate,
                'toDate': params.toDate
            },
        }
    });
}