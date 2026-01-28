import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
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
const FormComposerCitizen = ({
  config: baseConfig,
  onSubmit: onFinalSubmit,
  onFormValueChange,
  nextStepLabel,
  submitLabel,
  baseRoute = "",
  sessionKey = "DEFAULT_CITIZEN_CREATE",
  submitInForm = true,
  fieldStyle = { marginRight: 0 }
}) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate(); // Replaces useHistory

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
  const [nextStep, setNextStep] = useState(baseRoute);

  /**
   * Handles form submission.
   * Stores the submitted data in session storage and navigates to the next step.
   */
  const onSubmit = async (data) => {
    setParams({ ...params, ...data });
    if (nextStep !== null) {
      navigate(nextStep); // Use relative navigation
    } else {
      onFinalSubmit({ ...params, ...data });
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
          const bodyConfigs = newConfig?.body?.filter((configs) => configs.route === currentPath);
          newConfig.body = bodyConfigs;
          return newConfig;
        })
        ?.filter((eachConfig) => eachConfig?.body?.length > 0),
    [currentConfig, currentPath]
  );

  // Clears session storage parameters when the component mounts
  useEffect(() => {
    return clearParams();
  }, []);

  // Updates the next step based on the current form configuration
  useEffect(() => {
    setNextStep(currentRunningConfig?.[0]?.body?.[0]?.nextRoute);
  }, [currentRunningConfig]);

  return (
    <div>
      <Routes>
        {/* Renders the FormComposerV2 component for the current step */}
        <Route
          path={currentPath}
          element={
            <FormComposerV2
              label={nextStep === null ? t(submitLabel) : t(nextStepLabel)}
              config={currentRunningConfig.map((config) => ({
                ...config,
              }))}
              defaultValues={{ ...params }}
              submitInForm={submitInForm}
              onFormValueChange={onFormValueChange}
              onSubmit={(data) => onSubmit(data)}
              fieldStyle={fieldStyle}
            />
          }
        />

        {/* Redirects to the base route if no matching route is found */}
        <Route path="*" element={<Navigate to={baseRoute} replace />} />
      </Routes>
    </div>
  );
};

export default FormComposerCitizen;