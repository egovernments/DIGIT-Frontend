import { FormComposerV2  } from "@egovernments/digit-ui-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { config as CreateConfig } from "../../configs/SampleCreateConfig";

const Create = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    ///
  };

  /* use newConfig instead of commonFields for local development in case needed */

  const configs = CreateConfig ? CreateConfig : CreateConfig;
  return (
    <FormComposerV2
      heading={t("Application Heading")}
      label={t("Submit Bar")}
      description={"Description"}
      text={"Sample Text if required"}
      config={configs.map((config) => {
        return {
          ...config,
          body: config.body.filter((a) => !a.hideInEmployee),
        };
      })}
      defaultValues={{}}
      onSubmit={onSubmit}
      fieldStyle={{ marginRight: 0 }}
    />
  );
};

export default Create;