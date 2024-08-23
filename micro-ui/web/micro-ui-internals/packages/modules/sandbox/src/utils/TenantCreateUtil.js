export const transformCreateData = (data) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  return {
    tenant: {
      name: data.tenantName,
      email: data.emailId,
      code: data.tenantCode,
      parentId: tenantId,
    },
  };
};
