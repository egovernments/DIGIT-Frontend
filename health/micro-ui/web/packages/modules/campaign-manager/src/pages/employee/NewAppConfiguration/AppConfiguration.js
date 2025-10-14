import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectField } from "./redux/remoteConfigSlice";
import { useCustomTranslate } from "./hooks/useCustomT";
import AppPreview from "../../../components/AppPreview";
import SidePanelApp from "./SidePanelApp";
// import LayoutRenderer from "./LayoutRenderer";
import NewLayoutRenderer from "./NewLayoutRenderer";

function AppConfiguration() {
  const dispatch = useDispatch();
  const { currentData, selectedField, isFieldSelected, pageType } = useSelector((state) => state.remoteConfig);
  const t = useCustomTranslate();

  const handleFieldClick = useCallback(
    (field, screen, card, cardIndex, fieldIndex) => {
      dispatch(selectField({ field, screen, card, cardIndex, fieldIndex }));
    },
    [dispatch]
  );

  console.log("pageTypepageType", pageType);
  // Determine which preview to render based on pageType
  const isTemplateView = pageType === "template";

  return (
    <div>
      {isTemplateView ? (
        <NewLayoutRenderer data={currentData} selectedField={selectedField} onFieldClick={handleFieldClick} t={t} />
      ) : (
        <AppPreview data={currentData} onFieldClick={handleFieldClick} selectedField={selectedField} t={t} />
      )}
      <SidePanelApp showPanelProperties={isFieldSelected && selectedField} />
    </div>
  );
}

export default React.memo(AppConfiguration);
