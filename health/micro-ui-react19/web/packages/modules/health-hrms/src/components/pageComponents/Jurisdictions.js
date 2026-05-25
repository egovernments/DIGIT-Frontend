import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BoundaryComponent from "./SelectEmployeeBoundary";
import { Loader,Card,Button,DeleteIcon } from "@egovernments/digit-ui-components";

const Jurisdictions = ({ config, onSelect, formData }) => {
  const { t } = useTranslation();
  const selectedHierarchy = Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED");
  const initialBoundaries = formData?.Jurisdictions || [];
  const [boundaryList, setBoundaryList] = useState(
    initialBoundaries.length > 0
      ? initialBoundaries.map(() => ({ id: Date.now() + Math.random() }))
      : [{ id: Date.now() }]
  );
  const [boundaryValues, setBoundaryValues] = useState(initialBoundaries);

  const handleAdd = () => {
    setBoundaryList([...boundaryList, { id: Date.now() }]);
  };

  const handleRemove = (id) => {
    const updatedList = boundaryList.filter((item) => item.id !== id);
    const updatedValues = boundaryValues.filter((_, idx) => idx !== boundaryList.findIndex(i => i.id === id));
    setBoundaryList(updatedList);
    setBoundaryValues(updatedValues);
    onSelect(config.key, updatedValues);
  };

  const isLastBoundaryValid = () => {
    const lastValue = boundaryValues[boundaryValues.length - 1];
    return lastValue?.boundaryType && lastValue?.code; // Validation to disable the add button if the last boundary is not selected
  };

  const handleBoundarySelect = (index, value) => {
    const updatedValues = [...boundaryValues];
    updatedValues[index] = value;
    setBoundaryValues(updatedValues);
    onSelect(config.key, updatedValues); // Send array of selected boundaries
  };

  
  return (
    <div className="boundary-list-wrapper">
      {selectedHierarchy && boundaryList.map((entry, index) => (
        <Card key={entry.id} type={"secondary"} style={{
          marginBottom: "16px", position: "relative"
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
            {boundaryList.length > 1 && (
              <div
                onClick={() => handleRemove(entry.id)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                }}
              >
                <DeleteIcon fill="#C84C0E" className="toast-close-btn" />
              </div>
            )}
          </div>
          <BoundaryComponent
            t={t}
            index={index + 1}
            config={{ ...config, key: `${config.key}-${index}` }}
            onSelect={(key, value) => handleBoundarySelect(index, value)}
            formData={boundaryValues[index]}
            hierarchy={selectedHierarchy}
          />
        </Card>
      ))}
      {selectedHierarchy && (<div>
        <Button label={t("ADD_JURISDICTION")} variation={"primary"} onClick={handleAdd} isDisabled={(boundaryList.length > 0 && !isLastBoundaryValid()) ? true : false} />
      </div>)}
    </div>
  );
};

export default Jurisdictions;
