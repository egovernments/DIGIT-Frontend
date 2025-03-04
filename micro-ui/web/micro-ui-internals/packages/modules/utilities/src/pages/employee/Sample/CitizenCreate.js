import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import { newConfig as baseConfig } from "./PGRCreate";

// import { newConfig } from "../../configs/IndividualCreateConfig";
// import { transformIndividualCreateData } from "../../utils/createUtils";

const IndividualCreateCitizen = () => {
  const { pathname } = useLocation();
  const match = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const currentConfig = useMemo(
    () =>
      baseConfig.map((config) => {
        const newConfig = { ...config };
        const bodyConfigs = newConfig?.body?.filter((configs) => configs?.route);
        newConfig.body = bodyConfigs;
        return newConfig;
      }),
    [baseConfig]
  );

  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PGRCITIZE", {});
  console.log(match, pathname, params, baseConfig, currentConfig);
  const [paramState, setParamState] = useState(params);
  const [nextStep, setNextStep] = useState("name");
  const [canSubmit, setCanSubmit] = useState(false);
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

    setParams({ ...params, ...data });
    if (nextStep !== null) {
      history.push(`${match.path}/${nextStep}`);
    } else {
      onFormSubmit({ ...params, ...data });
    }
  };

  const onFormSubmit = async (data) => {
    console.log(data, "data");
    await mutation.mutate({
      url: `/individual/v1/_create`,
      params: { tenantId },
      body: data,
      config: {
        enable: true,
      },
    });
  };
  const currentPath = useMemo(() => pathname.split("/").pop(), [pathname]);

  const currentRunningConfig = useMemo(
    () =>
      currentConfig
        .map((config) => {
          const newConfig = { ...config };
          const bodyConfigs = newConfig?.body?.filter((configs) => configs.route == currentPath);
          newConfig.body = bodyConfigs;
          return newConfig;
        })
        ?.filter((eachConfig) => eachConfig?.body?.length > 0),
    [currentConfig, currentPath]
  );

  useEffect(()=>{
return clearParams();
  },[])

  useEffect(() => {
    setNextStep(currentRunningConfig?.[0]?.body?.[0]?.nextRoute);
  }, [currentRunningConfig]);

  return (
    <div>
      <Header> {t("CREATE_INDIVIDUAL")}</Header>

      <Switch>
        <Route path={`${match.path}/${currentPath}`} key={""}>
          <FormComposerV2
            label={t("SUBMIT_BUTTON")}
            config={currentRunningConfig.map((config) => {
              return {
                ...config,
              };
            })}
            defaultValues={{ ...params }}
            onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
              console.log(formData, "formData");
            }}
            onSubmit={(data) => onSubmit(data)}
            fieldStyle={{ marginRight: 0 }}
          />
        </Route>

        <Route>
          <Redirect to={`${match.path}/${"name"}`} />
        </Route>
      </Switch>
    </div>
  );
};

export default IndividualCreateCitizen;
