export const transformCreateData = (data) => {
  return {
    tenant: {
      name: data.tenantName,
      email: data.emailId,
      code: data.tenantCode,
    },
  };
};
