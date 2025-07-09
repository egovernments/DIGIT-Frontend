import React, { useState } from "react";
import { Card, Button, Header, RemoveIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import BoundaryComponent from "./SelectEmployeeBoundary";
import { Loader } from "@egovernments/digit-ui-components";
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

  const DeleteIcon = ({ style, fill }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill={fill} />
    </svg>
  );

  const handleRemove = (id) => {
    const updatedList = boundaryList.filter((item) => item.id !== id);
    const updatedValues = boundaryValues.filter((_, idx) => idx !== boundaryList.findIndex(i => i.id === id));
    setBoundaryList(updatedList);
    setBoundaryValues(updatedValues);
    onSelect(config.key, updatedValues);
  };

  const isLastBoundaryValid = () => {
    const lastValue = boundaryValues[boundaryValues.length - 1];
    return lastValue?.boundaryType && lastValue?.boundary; // Validation to disable the add button if the last boundary is not selected
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
        <Card key={entry.id} style={{
          marginBottom: "16px", position: "relative", backgroundColor: "#EEEEEE", border: "1px solidrgb(0, 0, 0)", // 1px border using grey.border
          padding: "16px",
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
                <DeleteIcon fill="red" className="toast-close-btn" />
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
        <Button label={t("ADD_JURISDICTION")} onButtonClick={handleAdd} disabled={boundaryList.length > 0 && !isLastBoundaryValid()} />
      </div>)}
    </div>
  );
};

export default Jurisdictions;
