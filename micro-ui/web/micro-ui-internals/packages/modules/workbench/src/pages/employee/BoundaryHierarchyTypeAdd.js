import React, { useState, useRef } from "react";
import { FormComposerV2, TextInput, Button, Card, CardLabel } from "@egovernments/digit-ui-react-components";
import { addBoundaryHierarchyConfig } from "../../configs/boundaryHierarchyConfig";
import { Header } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import { SubmitBar } from "@egovernments/digit-ui-react-components";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-react-components";
import LevelCards from "../../components/LevelCards";

const BoundaryHierarchyTypeAdd = () => {
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();
  const [showToast, setShowToast] = useState(null);

  const [config, setConfig] = useState([...addBoundaryHierarchyConfig]);
  const levelCounter = useRef(2);

  console.log("confififif", config);

  // const handleAddField = () => {
  //   const newField = {
  //     label: `Level ${levelCounter.current}`,
  //     type: "text",
  //     isMandatory: false,
  //     disable: false,
  //     populators: {
  //       name: `Level ${levelCounter.current}`,
  //     },
  //   };
  //   const updatedConfig = [...config];

  //   updatedConfig[config.length - 1].body.push(newField); // Add the new field to the last body array
  //   setConfig(updatedConfig);
  //   levelCounter.current += 1; // Increment the counter for the next level
  // };

  // const handleDeleteField = (index) => {
  //   // Remove the selected field from the configuration
  //   const updatedConfig = [...config];
  //   updatedConfig[1].body.splice(index, 1);
    
  //   setConfig(updatedConfig);
  //   levelCounter.current -= 1;
  // };

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
    console.log("data", data.levelcards);
    const dynamicParentType = {};
    // const levelKeys = Object.keys(data).filter((key) => key.startsWith("Level"));
    const levelKeys = data.levelcards;
    console.log("llll",levelKeys);

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

    console.log("formData", formData);
    // Handle form submission

    try {
      const parentTypeMapping = generateDynamicParentType(formData);

      console.log("pp",parentTypeMapping)

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

  const onFormValueChange = (setValue, formData) => {
    console.log("formData", formData);
  };

  // const shouldShowHeader = config[0].body && config[0].body.length > 0 && config[0].body[0]?.label === "Level 1";

  return (
    <React.Fragment>
      <Header> {t("WBH_BOUNDARY_HIERARCHY_TYPE")} </Header>

      
        <FormComposerV2
          defaultValues={{}}
          onSubmit={handleFormSubmit}
          fieldStyle={{ marginRight: 0 }}
          // showMultipleCardsWithoutNavs={true}
          config={config}
          formLength={config[1].body?.length - 1}
          noBreakLine={true}
          label="CORE_COMMON_SAVE"
          enableDelete={true}
          // handleDeleteField={handleDeleteField}
          onFormValueChange={onFormValueChange}
        >
          {/* {shouldShowHeader ? null : <Header> {t("WBH_CREATE_BOUNDARY_HIERARCHY_TYPES")} </Header>} */}
        </FormComposerV2>
       

        {/* <Button onButtonClick={handleAddField} label={"WBH_ADD_NEW_LEVEL"} variation="secondary" type="button" /> */}
        {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
      
    </React.Fragment>
  );
};

export default BoundaryHierarchyTypeAdd;
