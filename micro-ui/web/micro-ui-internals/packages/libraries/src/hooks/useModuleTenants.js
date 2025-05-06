import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const useModuleTenants = (module, config = {}) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ["ULB_TENANTS", module],
    queryFn: () => Digit.SessionStorage.get("initData"),
    select: (data) => {
      const tenantsModule = data.modules.find((e) => e.module === module)?.tenants || [];
  
      const transformedTenants = tenantsModule.map((tenant) => ({
        ...tenant,
        ulbKey: t(`TENANT_TENANTS_${tenant?.code?.toUpperCase?.()?.replace(".", "_")}`),
        ddrKey: t(
          `DDR_${data.tenants
            .filter((t) => t.code === tenant.code)?.[0]
            .city?.districtTenantCode?.toUpperCase?.()
            .replace(".", "_")}`
        ),
      }));
  
      return {
        ddr: transformedTenants.filter((item, i, arr) => i === arr.findIndex((t) => t.ddrKey === item.ddrKey)),
        ulb: transformedTenants,
      };
    },
    ...config,
  });
};
export default useModuleTenants;
