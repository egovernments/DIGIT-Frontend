import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header, Toast } from "@egovernments/digit-ui-react-components";
import { transformCreateData } from "../../../utils/TenantCreateUtil";
import { tenantCreateConfig } from "../../../configs/tenantCreateConfig";

const fieldStyle = { marginRight: 0 };

const TenantCreate = () => {
  const defaultValue = {};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const closeToast = () => {
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };
  const reqCreate = {
    url: `/tenant-management/subTenant/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onSubmit = async (data) => {
    await mutation.mutate(
      {
        url: `/tenant-management/tenant/_create`,
        body: transformCreateData(data),
        config: {
          enable: true,
        },
      },
      {
        onError: (error, variables) => {
          setShowToast({
            label: error.toString(),
            isError: true,
          });
          setTimeout(() => {
            setShowToast(false);
          }, 5000);
        },
        onSuccess: async (data) => {
          setShowToast({ key: "success", label: t("SANDBOX_TENANT_CREATE_SUCCESS_TOAST") });
          setTimeout(() => {
            closeToast();
            history.push(`/${window?.contextPath}/employee/sandbox/tenant-management/search`);
          }, 3000);
        },
      }
    );
  };
  return (
    <div>
      <Header> {t("SANDBOX_CREATE_TENANT_HEADER")}</Header>
      <FormComposerV2
        label={t("SANDBOX_CREATE_TENANT_SUBMIT_BUTTON")}
        config={tenantCreateConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={defaultValue}
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {}}
        onSubmit={(data) => onSubmit(data)}
        fieldStyle={fieldStyle}
        noBreakLine={true}
      />

      {showToast && <Toast error={showToast?.isError} label={showToast?.label} isDleteBtn={"true"} onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default TenantCreate;
