import { Loader, FormComposerV2  } from "@egovernments/digit-ui-components-core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { newConfig } from "../../configs/SampleConfig";


const Create = () => {
  const { t } = useTranslation();

  const onSubmit = (data) => {
    console.log(data, "data");
  };
  const configs = newConfig ? newConfig : newConfig;

  return (
    <FormComposerV2
      label={t("Submit")}
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