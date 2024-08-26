export const Complaint = {
  create: async ({
    cityCode,
    complaintType,
    description,
    landmark,
    city,
    district,
    region,
    state,
    pincode,
    localityCode,
    localityName,
    uploadedImages,
    mobileNumber,
    name,
   
  }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const defaultData = {
      service: {
        tenantId: cityCode,
        active :true,
        serviceCode: complaintType,
        description: description,
        additionalDetail: {},
        source: Digit.Utils.browser.isWebview() ? "mobile" : "web",
        address: {
          landmark: landmark,
          city: city,
          district: district,
          region: region,
          state: state,
          pincode: pincode,
          locality: {
            code: localityCode,
            name: localityName,
          },
          geoLocation: {},
        },
    citizen:{
      mobileNumber,
      name,
      type:"CITIZEN"
    },
    

      },
      workflow: {
        action: "APPLY",
         verificationDocuments: uploadedImages,
        //action: "CREATE", assignes: [], hrmsAssignes: [], comments: ""
      },
    };

    
    if (Digit.SessionStorage.get("user_type") === "employee") {
      defaultData.service.user = {
        name: name,
        type: "CITIZEN",
        mobileNumber: mobileNumber,
        roles: [
          {
            id: null,
            name: "Citizen",
            code: "CITIZEN",
            tenantId: tenantId,
          },
        ],
        tenantId: tenantId,
      };
    }

    const response = await Digit.PGRService.create(defaultData, cityCode);
    return response;
  },

  assign: async (complaintDetails, action, employeeData, comments, uploadedDocument, tenantId) => {
    complaintDetails.workflow.action = action;
    complaintDetails.workflow.assignes = employeeData ? [employeeData.uuid] : null;
    complaintDetails.workflow.comments = comments;
    uploadedDocument
      ? (complaintDetails.workflow.verificationDocuments = [
            {
              documentType: "PHOTO",
              fileStoreId: uploadedDocument,
              documentUid: "",
              additionalDetails: {},
            },
          ])
      : null;

    if (!uploadedDocument) complaintDetails.workflow.verificationDocuments = [];

    const response = await Digit.PGRService.update(complaintDetails, tenantId);
    return response;
  },
};
