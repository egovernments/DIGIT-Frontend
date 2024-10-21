import React, { useState, useEffect, Fragment, createContext, useContext } from "react";
import { Stepper, TextBlock, ActionBar, Button, Card, Toast, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { concat } from "lodash";
import UserAccess from "./UserAccess";

const UserAccessContext = createContext("userAccessContext");

export const useUserAccessContext = () => {
  return useContext(UserAccessContext);
};

const UserAccessWrapper = ({ onSelect, props: customProps }) => {
  const { t } = useTranslation();
  const { state } = useMyContext();
  const [data,setData]=useState(null);
  // vertical stepper array role code fetch and sorted based on orderNumber
  const rolesArray = state?.rolesForMicroplan?.sort((a, b) => a.orderNumber - b.orderNumber).map((item) => item.roleCode);
  // console.log("rolesArray",rolesArray);
  const nationalRoles=["ROOT_PLAN_ESTIMATION_APPROVER","ROOT_POPULATION_DATA_APPROVER","ROOT_FACILITY_CATCHMENT_MAPPER"]
  const hierarchyData = customProps?.hierarchyData;
  const campaignType = customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code;

  const searchParams = new URLSearchParams(window.location.search);

  const [internalKey, setInternalKey] = useState(() => {
    const keyParam = searchParams.get("internalKey");
    return keyParam ? parseInt(keyParam) : 1;
  });

  const [showToast, setShowToast] = useState(null);
  const [showErrorToast, setShowErrorToast] = useState(null);


  const [executionCount, setExecutionCount] = useState(0);

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();

  const moveToPreviousStep = () => {
    if (internalKey > 1) {
      setInternalKey((prevKey) => prevKey - 1);
    }
  };

  const isLastStep = () => {
    Digit.Utils.microplanv1.updateUrlParams({ isLastVerticalStep: false });
    Digit.Utils.microplanv1.updateUrlParams({ internalKey: internalKey });
  };

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  };

  const handleNext = () => {
    if((data===null && (internalKey in [0,1,2]))){
      setShowErrorToast(true);
      // console.log("hi1");
    }else{
      setInternalKey((prevKey) => prevKey + 1);
      // console.log("hi1");

    }
   
  };

  const handleBack = () => {
    if (internalKey > 1) {
      setInternalKey((prevKey) => prevKey - 1); // Update key in URL
    } else {
      window.dispatchEvent(new Event("moveToPrevious"));
    }
  };

  const handleStepClick = (step) => {
    // Step is zero-based, so we adjust by adding 1
    const currentStepIndex = internalKey - 1; // Current step index (zero-based)

    if (step === currentStepIndex) {
      setInternalKey(step + 1); // Move to the next step
    }
    // Allow going back to any previous step
    else if (step < currentStepIndex) {
      setInternalKey(step + 1); // Move back to the selected step
    }
    // Prevent jumping ahead to a later step if the user hasn't filled the required fields
    else if (step > currentStepIndex) {
      setShowToast({
        key: "error",
        label: t("ERR_SKIP_STEP"),
        transitionTime: 3000,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("verticalStepper", moveToPreviousStep);
    window.addEventListener("isLastStep", isLastStep);
    return () => {
      window.removeEventListener("verticalStepper", moveToPreviousStep);
      window.removeEventListener("isLastStep", isLastStep);
    };
  }, [internalKey]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect(customProps.name, {});
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  useEffect(() => {
    updateUrlParams({ internalKey });
  }, [internalKey]);

  return (
    <Fragment>
      <UserAccessContext.Provider value={{ hierarchyData, category: rolesArray?.[internalKey - 1] }}>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div className="card-container">
            <Card className="card-header-timeline">
              <TextBlock subHeader={t("USER_ACCESS_MANAGMNT")} subHeaderClasName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
            </Card>
            <Card className="stepper-card">
              <Stepper customSteps={[...rolesArray]} currentStep={internalKey} onStepClick={handleStepClick} direction={"vertical"} />
            </Card>
          </div>

          <div style={{ width: "100%" }}>
            <UserAccess 
            category={rolesArray?.[internalKey - 1] }
            setData={setData}
            nationalRoles={nationalRoles}
            />
          </div>
        </div>

        {internalKey > 0 && internalKey < rolesArray.length && (
          <ActionBar>
            <Button className="previous-button" variation="secondary" label={t("BACK")} onClick={handleBack} />
            <Button className="previous-button" variation="primary" label={t("NEXT")} onClick={handleNext} />
          </ActionBar>
        )}
      </UserAccessContext.Provider>

      {showToast && (
        <Toast
          type={showToast.key === "error" ? "error" : "success"} // Adjust based on your needs
          label={t(showToast.label)}
          transitionTime={showToast.transitionTime}
          onClose={() => {
            setShowToast(false);
          }}
          isDleteBtn={true}
        />
      )}
      {showErrorToast && (
        <Toast
          type={"error"} // Adjust based on your needs
          label={"EMPLOYESS_NOT_FOUND"}
          onClose={() => {
            setShowErrorToast(false);
          }}
          isDleteBtn={true}
        />
      )}
    </Fragment>
  );
};

export default UserAccessWrapper;