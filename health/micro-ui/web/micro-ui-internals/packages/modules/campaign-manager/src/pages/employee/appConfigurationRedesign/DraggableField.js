import React, { useRef } from "react";
import AppFieldComposer from "./AppFieldComposer";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const FIELD_TYPE = "FIELD";
function DraggableField({
  type,
  label,
  active,
  required,
  isDelete,
  dropDownOptions,
  onDelete,
  onSelectField,
  config,
  Mandatory,
  helpText,
  infoText,
  innerLabel,
  rest,
  index,
  fieldIndex,
  cardIndex,
  moveField,
  onHide,
  fields,
  indexOfCard,
}) {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: FIELD_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== fieldIndex) {
        moveField(fields, config, draggedItem.index, fieldIndex, cardIndex, indexOfCard);
        draggedItem.index = fieldIndex;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: FIELD_TYPE,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));
  return (
    <div className="draggableField-cont" ref={ref} style={{ opacity: isDragging ? 0.5 : 1, display: "flex", alignItems: "center" }}>
      {/* <span style={{ cursor: "grab", marginRight: "0.5rem", marginLeft: "0.5rem", lineHeight: "1" }}>⣿</span> */}
      <div class="drag-handle">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <AppFieldComposer
        type={type}
        label={label}
        active={active}
        required={required}
        isDelete={isDelete}
        dropDownOptions={dropDownOptions}
        onDelete={() => onDelete()}
        onSelectField={() => onSelectField()}
        onHide={() => onHide()}
        config={config}
        Mandatory={Mandatory}
        helpText={helpText}
        infoText={infoText}
        innerLabel={innerLabel}
        rest={rest}
      />
    </div>
  );
}

export default React.memo(DraggableField);
