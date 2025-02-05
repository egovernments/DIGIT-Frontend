import React from "react";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";

const transformTenantCode = (tenant, data) => {
  const city = data.tenants.find(t => t.code === tenant.code)?.city;
  const districtCode = city?.districtTenantCode || '';
  return districtCode.toUpperCase().replace('.', '_');
};


const useModuleTenants = (module, config = {}) => {
  const { t } = useTranslation();

  return useQuery(["ULB_TENANTS", module], () => Digit.SessionStorage.get("initData"), {
    select: (data) => ({
      ddr: data.modules
        .find((e) => e.module === module)
        .tenants.map((tenant) => ({
          ...tenant,
          ulbKey: t(`TENANT_TENANTS_${tenant?.code?.toUpperCase?.()?.replace(".", "_")}`),
          ddrKey: t(
            `DDR_${transformTenantCode(tenant, data)}`
          ),
        }))
        .filter((item, i, arr) => i === arr.findIndex((t) => t.ddrKey === item.ddrKey)),
      ulb: data.modules
        .find((e) => e.module === module)
        .tenants.map((tenant) => ({
          ...tenant,
          ulbKey: t(`TENANT_TENANTS_${tenant?.code?.toUpperCase?.()?.replace(".", "_")}`),
          ddrKey: t(
            `DDR_${transformTenantCode(tenant, data)}`
          ),
        })),
    }),
    ...config,
  });
};
export default useModuleTenants;
