import React, { useState, useRef } from "react";
import { FormComposerV2, TextInput, Button, Card, CardLabel } from "@digit-ui/digit-ui-react-components";
import { Header } from "@digit-ui/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar } from "@digit-ui/digit-ui-react-components";
import { SubmitBar } from "@digit-ui/digit-ui-react-components";
import { LabelFieldPair } from "@digit-ui/digit-ui-react-components";
import { Toast } from "@digit-ui/digit-ui-react-components";
import LevelCards from "../../components/LevelCards";
import { addBoundaryHierarchyConfig } from "../../configs/BoundaryHierarchyConfig";

const BoundaryHierarchyTypeAdd = () => {
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();
  const [showToast, setShowToast] = useState(null);
  const [config, setConfig] = useState([...addBoundaryHierarchyConfig]);
  const levelCounter = useRef(2);

  const reqCriteriaBoundaryHierarchyTypeAdd = {
    url: `/boundary-service/boundary-hierarchy-definition/_create`,
    params: {},
    body: {},
    config: {
      enabled: true,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaBoundaryHierarchyTypeAdd);
  const generateDynamicParentType = (data) => {
    const dynamicParentType = {};
    const levelKeys = data.levelcards;

    for (let i = 1; i < levelKeys.length; i++) {
      const currentLevel = levelKeys[i].level;
      const previousLevel = levelKeys[i - 1].level;
      dynamicParentType[currentLevel] = previousLevel;
  }

    return dynamicParentType;
  };

  const resetFormState = () => {
    setConfig([...addBoundaryHierarchyConfig]);
    levelCounter.current = 2;
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  const handleFormSubmit = async (formData) => {

    try {
      const parentTypeMapping = generateDynamicParentType(formData);

      const boundaryHierarchy = formData.levelcards.map((level, index) => {
        const currentLevel = level.level;
        const parentBoundaryType = index === 0 ? null : parentTypeMapping[currentLevel] || null;
  
        return {
          boundaryType: currentLevel,
          parentBoundaryType: parentBoundaryType,
          active: true,
        };
      });

      await mutation.mutate(
        {
          params: {},
          body: {
            BoundaryHierarchy: {
              tenantId: stateId,
              hierarchyType: formData.hierarchyType,
              boundaryHierarchy: boundaryHierarchy
            },
          },
        },
        {
          onError: (resp) => {
            let label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
            resp?.response?.data?.Errors?.map((err, idx) => {
              if (idx === resp?.response?.data?.Errors?.length - 1) {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
              } else {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
              }
            });
            setShowToast({ label, isError: true });
            closeToast();
          },
          onSuccess: () => {
            setShowToast({ label: `${t("WBH_BOUNDARY_UPSERT_SUCCESS")}` });
            closeToast();
          },
        }
      );
      resetFormState();

      setConfig([...addBoundaryHierarchyConfig]);
      levelCounter.current = 2;
    } catch {}
  };


  return (
    <React.Fragment>

        <FormComposerV2
          defaultValues={{}}
          onSubmit={handleFormSubmit}
          fieldStyle={{ marginRight: 0 }}
          config={config}
          noBreakLine={true}
          label="HCM_CREATE_BOUNDARY_HIERARCHY"
          heading="HCM_CREATE_BOUNDARY_HIERARCHY"
          description = "HCM_CREATE_BOUNDARY_HIERARCHY_DESCRIPTION"
          enableDelete={true}
        >
        </FormComposerV2>
        {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
      
    </React.Fragment>
  );
};

export default BoundaryHierarchyTypeAdd;
