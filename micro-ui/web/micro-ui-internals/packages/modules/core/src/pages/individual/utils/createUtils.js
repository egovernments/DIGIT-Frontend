export const transformCreateData = (data) => {
  return {
    Individual: {
      tenantId: Digit.ULBService.getStateId(),
      name: {
        givenName: data.applicantname,
      },
      dateOfBirth: null,
      gender: data?.genders?.code,
      mobileNumber: data.mobileNumber,
      address: [
        {
          tenantId: Digit.ULBService.getStateId(),
          pincode: data.pincode,
          city: data.city,
          street: data.street,
          doorNo: data.doorno,
          locality: {
            code: data?.locality?.code || "SUN01",
          },
          landmark: data.landmark,
          type: "PERMANENT",
        },
      ],
      identifiers: null,
      skills: [
        {
          type: "DRIVING",
          level: "UNSKILLED",
        },
      ],
      photograph: null,
      additionalFields: {
        fields: [
          {
            key: "EMPLOYER",
            value: "ULB",
          },
        ],
      },
      isSystemUser: null,
      userDetails: {
        username: data.mobileNumber,
        tenantId: Digit.ULBService.getStateId(),
        roles: [
          {
            code: "SANITATION_WORKER",
            tenantId: Digit.ULBService.getStateId(),
          },
        ],
        type: "CITIZEN",
      },
    },
  };
};
