import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectField } from "./redux/remoteConfigSlice";
import { useCustomTranslate } from "./hooks/useCustomT";
import AppPreview from "../../../components/AppPreview";
import SidePanelApp from "./SidePanelApp";

function AppConfiguration({ screenConfig, localeModule, pageTag }) {
  const dispatch = useDispatch();
  const { currentData, selectedField, isFieldSelected } = useSelector((state) => state.remoteConfig);
  const t = useCustomTranslate();

  const handleFieldClick = (field, screen, card) => {
    dispatch(selectField({ field, screen, card }));
  };

  return (
    <div>
      <AppPreview data={currentData} onFieldClick={handleFieldClick} selectedField={selectedField} t={t} />
      <SidePanelApp showPanelProperties={isFieldSelected && selectedField} />
    </div>
  );
}

export default React.memo(AppConfiguration);
