import { Loader, FormComposerV2, Header  } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { complaintCreateConfig as CreateConfig } from "../../configs/PGRCreateConfig";

const PGRCreate = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();

  const onSubmit = (data) => {
    ///
    console.log(data, "data");
  };

  /* use newConfig instead of commonFields for local development in case needed */

  const configs = CreateConfig ? CreateConfig : CreateConfig;

  return (
    <div>
    <Header>{t("NEW_COMPLAINT")}</Header>
    <FormComposerV2
      label={t("Submit Bar")}
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
    </div>
  );
};

export default PGRCreate;