import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import merge from "lodash.merge";
import { PGR_CITIZEN_CREATE_COMPLAINT } from "../../../constants/Citizen";
import { config as defaultConfig } from "./defaultConfig";
import useCreateComplaint from "../../../hooks/useCreateComplaint";

// Multi-step citizen complaint creation flow.
// React Router v6: useNavigate replaces useHistory, Routes/Route replace Switch/Route.
// Redux replaced by useCreateComplaint mutation + Digit.SessionStorage for form state.
export const CreateComplaint = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const tenantId =
    Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const createComplaintMutation = useCreateComplaint(tenantId);

  // Persist multi-step form state in session storage
  const [params, setParams] = useState(() => Digit.SessionStorage.get(PGR_CITIZEN_CREATE_COMPLAINT) || {});
  const [canSubmit, setCanSubmit] = useState(false);

  // Merge default config with any MDMS/Customization overrides
  const config = useMemo(
    () => merge({}, defaultConfig, Digit.Customizations?.PGR?.complaintConfig),
    []
  );

  // Persist params to session storage on every update
  useEffect(() => {
    Digit.SessionStorage.set(PGR_CITIZEN_CREATE_COMPLAINT, params);
  }, [params]);

  // Current step key from the URL (last path segment)
  const currentStep = location.pathname.split("/").pop();

  const goNext = (stepData) => {
    const updatedParams = { ...params, ...stepData };
    setParams(updatedParams);
    Digit.SessionStorage.set(PGR_CITIZEN_CREATE_COMPLAINT, updatedParams);

    const routeConfig = config.routes[currentStep];
    if (!routeConfig) return;

    let { nextStep } = routeConfig;

    // Skip sub-type if complaint type is "Others"
    if (nextStep === "sub-type" && updatedParams.complaintType?.key === "Others") {
      setParams((prev) => ({
        ...prev,
        subType: { key: "Others", name: t("SERVICEDEFS.OTHERS") },
      }));
      nextStep = config.routes["sub-type"].nextStep;
    }

    if (nextStep === null) {
      submitComplaint(updatedParams);
    } else {
      const base = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
      navigate(`${base}/${nextStep}`);
    }
  };

  const submitComplaint = async (finalParams) => {
    if (!finalParams?.complaintType) return;

    const { city_complaint, locality_complaint, uploadedImages, complaintType, subType, details, landmark } = finalParams;
    const payload = {
      complaintType: subType?.key || complaintType?.key,
      cityCode: city_complaint?.code,
      city: city_complaint?.name,
      localityCode: locality_complaint?.code,
      localityName: locality_complaint?.name,
      landmark,
      description: details,
      documents: uploadedImages?.map((fileStoreId) => ({
        documentType: "PHOTO",
        fileStoreId,
        documentUid: "",
        additionalDetails: {},
      })),
    };

    createComplaintMutation.mutate(payload, {
      onSuccess: (res) => {
        Digit.SessionStorage.del(PGR_CITIZEN_CREATE_COMPLAINT);
        const base = location.pathname.substring(0, location.pathname.indexOf("/create-complaint"));
        navigate(`${base}/response`, {
          state: {
            action: "APPLY",
            serviceRequestId: res?.ServiceWrappers?.[0]?.service?.serviceRequestId,
          },
        });
      },
    });
  };

  // Render the step component for each route
  const renderStep = (stepKey) => {
    const routeConfig = config.routes[stepKey];
    if (!routeConfig) return null;
    const StepComponent = routeConfig.component;
    return (
      <StepComponent
        config={{ texts: routeConfig.texts, inputs: routeConfig.inputs }}
        onSelect={goNext}
        onSkip={() => goNext({})}
        value={params}
        t={t}
      />
    );
  };

  const indexRoute = config.indexRoute;
  const base = location.pathname.endsWith("/create-complaint") ? location.pathname : location.pathname.substring(0, location.pathname.lastIndexOf("/"));

  return (
    <Routes>
      <Route index element={<Navigate to={`${base}/${indexRoute}`} replace />} />
      {Object.keys(config.routes).map((stepKey) => (
        <Route key={stepKey} path={stepKey} element={renderStep(stepKey)} />
      ))}
    </Routes>
  );
};
