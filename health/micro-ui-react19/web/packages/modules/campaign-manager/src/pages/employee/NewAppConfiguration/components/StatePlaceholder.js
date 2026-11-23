import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedStateGroup } from "../redux/remoteConfigSlice";

/**
 * Stands in for a state group while none of its states is chosen.
 *
 * Every group draws this same box, so it reads as "something goes here" rather than as one
 * of the states. `placeholder.style` in the config resizes or restyles it.
 *
 * It reads the store directly instead of taking props, because renderTemplateComponent has a
 * fixed signature and is called from every container.
 */
const StatePlaceholder = ({ field, t }) => {
  const dispatch = useDispatch();
  const selectedStateGroup = useSelector((state) => state.remoteConfig?.selectedStateGroup);

  const group = field?.statePlaceholderFor;
  if (!group) return null;

  return (
    <div
      className={`app-preview-state-placeholder${selectedStateGroup === group?.name ? " selected" : ""}`}
      style={group?.placeholder?.style}
      // Stops the click also selecting the card this sits inside
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setSelectedStateGroup(group?.name));
      }}
    >
      <span className="app-preview-state-placeholder-text">{t(group?.label)}</span>
    </div>
  );
};

export default StatePlaceholder;
