import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { FormComposerV2 } from "..";


/**
 * FormComposerCitizen 
 * Handles dynamic form rendering based on the given configuration.
 * Supports form navigation, session storage, and form submission.
 * 
 * used to render forms in citizen screens way mostly targetted for mobile views
 *
 * @author jagankumar-egov
 *
 * @example
 *
 * refer this implementation of sample file
 * micro-ui/web/micro-ui-internals/packages/modules/utilities/src/pages/employee/Sample/CitizenCreate.js
 * still not used officialy anywhere so feel free to contribute new features to use this hoc
 * 
 */
const FormComposerCitizen = ({config : baseConfig,onSubmit:onFinalSubmit,onFormValueChange,nextStepLabel,submitLabel,baseRoute="",sessionKey="DEFAULT_CITIZEN_CREATE",submitInForm=true,fieldStyle={ marginRight: 0 }}) => {
  const { pathname } = useLocation(); // Gets the current URL pathname
  const match = useRouteMatch(); // Matches the current route
  const { t } = useTranslation(); // Localization hook for translations
  const history = useHistory(); // React Router history object for navigation
  
  /**
   * Filters out configurations that have a defined route.
   */
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

  // State to store session data using custom session storage hook
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage(sessionKey, {});
  const [nextStep, setNextStep] = useState(baseRoute); // State to manage the next step in the form flow

  /**
   * Handles form submission.
   * Stores the submitted data in session storage and navigates to the next step.
   */
  const onSubmit = async (data) => {
    setParams({ ...params, ...data });
    if (nextStep !== null) {
      history.push(`${match.path}/${nextStep}`); // Navigate to the next step
    } else {
        onFinalSubmit({ ...params, ...data }); // Final form submission
    }
  };

  // Extracts the last part of the current path
  const currentPath = useMemo(() => pathname.split("/").pop(), [pathname]);

  /**
   * Retrieves the current configuration that matches the current path.
   */
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

  // Clears session storage parameters when the component mounts
  useEffect(()=>{
    return clearParams();
  },[]);

  // Updates the next step based on the current form configuration
  useEffect(() => {
    setNextStep(currentRunningConfig?.[0]?.body?.[0]?.nextRoute);
  }, [currentRunningConfig]);

  return (
    <div>
      <Switch>
        {/* Renders the FormComposerV2 component for the current step */}
        <Route path={`${match.path}/${currentPath}`} key={""}>
          <FormComposerV2
            label={nextStep==null?t(submitLabel):t(nextStepLabel)}
            config={currentRunningConfig.map((config) => {
              return {
                ...config,
              };
            })}
            defaultValues={{ ...params }}
            submitInForm={submitInForm}
            onFormValueChange={onFormValueChange}
            onSubmit={(data) => onSubmit(data)}
            fieldStyle={fieldStyle}
          />
        </Route>

        {/* Redirects to the base route if no matching route is found */}
        <Route>
          <Redirect to={`${match.path}/${baseRoute}`} />
        </Route>
      </Switch>
    </div>
  );
};

export default FormComposerCitizen;
