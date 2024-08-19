import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Header } from "@egovernments/digit-ui-react-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { transformCreateData } from "../../../utils/TenantCreateUtil";
import { tenantCreateConfig } from "../../../configs/tenantCreateConfig";

const fieldStyle = { marginRight: 0 };

const TenantCreate = () => {
  const defaultValue = {};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const reqCreate = {
    url: `/tenant-management/tenant/_create`,
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
    );
  };
  return (
    <div>
      <Header> {t("CREATE_TENANT")}</Header>
      <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={tenantCreateConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={defaultValue}
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
        }}
        onSubmit={(data,) => onSubmit(data,)}
        fieldStyle={fieldStyle}
        noBreakLine={true}
      />

    </div>
  );
}

export default TenantCreate;