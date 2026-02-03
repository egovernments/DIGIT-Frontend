import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { FormComposerCitizen} from "@egovernments/digit-ui-react-components";
import { newConfig as baseConfig } from "./CreateCommonConfig";

// import { newConfig } from "../../configs/IndividualCreateConfig";
// import { transformIndividualCreateData } from "../../utils/createUtils";

const IndividualCreateCitizen = () => {
  
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
   const reqCreate = {
    url: `/individual/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);



  const onFormSubmit = async (data) => {
    await mutation.mutate({
      url: `/individual/v1/_create`,
      params: { tenantId },
      body: data,
      config: {
        enable: true,
      },
    });
  };


  return (
    <div>
     <FormComposerCitizen config={baseConfig} onSubmit={onFormSubmit}
     onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
    nextStepLabel={"CMN_NEXT_BTN"} submitLabel={"CMN_SUBMIT"} baseRoute="name" sessionKey="PGR_CITIZEN_CREATE"
     ></FormComposerCitizen>
    </div>
  );
};

export default IndividualCreateCitizen;
