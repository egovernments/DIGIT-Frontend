import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, HeaderComponent } from "@egovernments/digit-ui-components";
import { newConfig } from "../../../configs/IndividualCreateConfig";
import { transformIndividualCreateData } from "../../../utils/createUtils";
// import { newConfig } from "../../configs/IndividualCreateConfig";
// import { transformIndividualCreateData } from "../../utils/createUtils";



const IndividualCreate = () => {
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

  const onSubmit = async (data) => {
    console.log(data, "data");
    await mutation.mutate(
      {
        url: `/individual/v1/_create`,
        params: { tenantId },
        body: transformIndividualCreateData(data),
        config: {
          enable: true,
        },
      },
    );
  };
  return (
    <div>
      {/* <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
        {t("CREATE_INDIVIDUAL")}
      </HeaderComponent> */}
      <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={newConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={{}}
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
        onSubmit={(data) => onSubmit(data)}
        fieldStyle={{ marginRight: 0 }}
      />
    </div>
  );
}

export default IndividualCreate;