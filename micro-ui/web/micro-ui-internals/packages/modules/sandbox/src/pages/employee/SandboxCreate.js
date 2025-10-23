import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {  Header } from "@egovernments/digit-ui-react-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { configs } from "../../configs/pucarCreateConfig";
import { transformCreateData } from "../../utils/createUtils";

const fieldStyle={ marginRight: 0 };

const PucarCreate = () => {
  const defaultValue={};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const reqCreate = {
    url: `/individual/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onSubmit = async(data) => {
    await mutation.mutate(
      {
        url: `/individual/v1/_create`,
        params: { tenantId },
        body: transformCreateData(data),
        config: {
          enable: true,
        },
      },
    );
  };
  return (
    <div>
      <Header> {t("CREATE_INDIVIDUAL")}</Header>
      <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={configs.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={defaultValue}
        onFormValueChange ={ (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
        }}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={fieldStyle}
        noBreakLine={true}
      />
       
    </div>
  );
}

export default PucarCreate;