import React, { useState, useRef } from "react";
import { FormComposerV2, TextInput, Button, Card, CardLabel } from "@egovernments/digit-ui-react-components";
import { addBoundaryHierarchyConfig } from "./boundaryHierarchyConfig";
import { Header } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import { SubmitBar } from "@egovernments/digit-ui-react-components";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";

const BoundaryHierarchyTypeAdd = () => {
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();

  const [config, setConfig] = useState([...addBoundaryHierarchyConfig]);
  const levelCounter = useRef(2);

  console.log("confififif", config);

  const handleAddField = () => {
    const newField = {
      label: `Level ${levelCounter.current}`,
      type: "text",
      isMandatory: false,
      disable: false,
      populators: {
        name: `Level ${levelCounter.current}`,
      },
    };
    const updatedConfig = [...config];

    updatedConfig[config.length - 1].body.push(newField); // Add the new field to the last body array
    setConfig(updatedConfig);
    levelCounter.current += 1; // Increment the counter for the next level
  };

  const handleDeleteField = (index) => {
    // Remove the selected field from the configuration
    const updatedConfig = [...config];

    updatedConfig[1].body.splice(index, 1);
    setConfig(updatedConfig);
  };

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
    const levelKeys = Object.keys(data).filter((key) => key.startsWith("Level"));

    for (let i = 1; i < levelKeys.length; i++) {
      const currentLevel = levelKeys[i];
      const previousLevel = levelKeys[i - 1];
      dynamicParentType[currentLevel] = data[previousLevel];
    }

    return dynamicParentType;
  };

  const handleFormSubmit = async (formData) => {
    // Handle form submission logic here

    try {
      const parentTypeMapping = generateDynamicParentType(formData);

      await mutation.mutate({
        params: {},
        body: {
          BoundaryHierarchy: {
            tenantId: stateId,
            hierarchyType: formData.hierarchyType,
            boundaryHierarchy: Object.keys(formData)
              .filter((key) => key.startsWith("Level"))
              .map((key, index) => {
                const parentBoundaryType = key === "Level 1" ? null : parentTypeMapping[key] || null;

                return {
                  boundaryType: formData[key],
                  parentBoundaryType: parentBoundaryType,
                  active: true,
                };
              }),
          },
        },
      });
    } catch {}
  };

  const shouldShowHeader = config[1].body && config[1].body[0]?.label === "Level 1";

  console.log(shouldShowHeader);

  return (
    <React.Fragment>
      <Header> {t("WBH_BOUNDARY_HIERARCHY_TYPE")} </Header>

      <Card>
        <FormComposerV2
          defaultValues={{}}
          onSubmit={handleFormSubmit}
          fieldStyle={{ marginRight: 0 }}
          showMultipleCardsWithoutNavs={true}
          config={config}
          formLength={config[1].body?.length}
          noBreakLine={true}
          label="CORE_COMMON_SAVE"
          enableDelete={true}
          handleDeleteField={handleDeleteField}
        >
          {shouldShowHeader ? <Header> {t("WBH_CREATE_BOUNDARY_HIERARCHY_TYPES")} </Header> : null}
        </FormComposerV2>

        <Button onButtonClick={handleAddField} label={"WBH_ADD_NEW_LEVEL"} variation="secondary" type="button" />
      </Card>
    </React.Fragment>
  );
};

export default BoundaryHierarchyTypeAdd;
