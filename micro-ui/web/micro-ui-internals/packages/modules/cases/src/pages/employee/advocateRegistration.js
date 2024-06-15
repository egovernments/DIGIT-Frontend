import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {  Header } from "@egovernments/digit-ui-react-components";
import { FormComposerV2 } from "@egovernments/digit-ui-components";
// import { configs } from "../../configs/pucarCreateConfig";
import { transformCreateData } from "../../utils/createUtils";
import { advocateRegistrationConfig } from "../../configs/advocateRegistrationConfig";
import { InfoCard } from "@egovernments/digit-ui-components";

const fieldStyle={ marginRight: 0 };

const AdvocateRegistration = () => {
  const defaultValue={};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const reqCreate = {
    url: `/case/case/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onSubmit = async(data) => {
    console.log(data, "data");
    await mutation.mutate(
      {
        url: `/case/case/v1/_create`,
        params: { tenantId },
        body: transformCreateData(data),
        config: {
          enable: true,
        },
      },
      {
        onSuccess: async (result) => {
          console.log("result", result)
        },
        onError: (result) => {
          setShowToast({ key: "error", label: t("ERROR_WHILE_SUBMITING") });
        },
      }
    );

  };
  return (
    <div>
      <Header> {t("PUCAR_JOIN_A_CASE")}</Header>
      <InfoCard
        populators={{
          name: "infocard",
        }}
        variant="default"
        style={{ margin: "0rem", maxWidth: "100%" }}
        additionalElements={[
          <span style={{ color: "#505A5F" }}>
            {t("HCM_BOUNDARY_INFO ")}
          </span>,
        ]}
        label={"Info"}
      />
      <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={advocateRegistrationConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={defaultValue}
        onFormValueChange ={ (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={fieldStyle}
        noBreakLine={true}
      />
       
    </div>
  );
}

export default AdvocateRegistration;