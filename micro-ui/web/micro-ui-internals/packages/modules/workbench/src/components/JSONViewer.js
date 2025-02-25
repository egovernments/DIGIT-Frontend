import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { JsonEditor } from "json-edit-react";
import _ from "lodash";
import PropTypes from "prop-types";

JSONViewer.propTypes = {
  formData: PropTypes.object.isRequired,
  screenType: PropTypes.oneOf(["view", "add", "edit"]).isRequired,
  onDataUpdate: PropTypes.func
};

const JSONViewer = ({ formData, screenType, onDataUpdate }) => {
  const { t } = useTranslation();
  const [updatedData, setUpdatedData] = useState(() => _.cloneDeep(formData));

  const memoizedData = useMemo(() => _.cloneDeep(formData), [formData]);
  useEffect(() => {
    setUpdatedData(memoizedData);
  }, [memoizedData]);

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
