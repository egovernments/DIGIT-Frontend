import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { JsonEditor } from "json-edit-react";
import _ from "lodash";

const JSONViewer = ({ formData, screenType, onDataUpdate }) => {
  const { t } = useTranslation();
  const [updatedData, setUpdatedData] = useState(_.cloneDeep(formData));

  useEffect(() => {
    setUpdatedData(_.cloneDeep(formData));
  }, [formData]);

  const handleEditorUpdate = ({ newData }) => {
    setUpdatedData(newData);
    if (onDataUpdate) {
      onDataUpdate(newData);
    }
  };

  return (
    <JsonEditor
      data={updatedData}
      onUpdate={handleEditorUpdate}
      restrictEdit={screenType === "view"}
      restrictDelete={screenType === "view"}
      restrictAdd={screenType === "view"}
    />
  );
};

export default JSONViewer;
