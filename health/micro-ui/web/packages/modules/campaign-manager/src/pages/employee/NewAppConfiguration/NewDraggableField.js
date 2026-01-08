import React, { useRef } from "react";
import PanelFieldDisplay from "./PanelFieldDisplay";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCustomT } from "./hooks/useCustomT";
const FIELD_TYPE = "FIELD";

function NewDraggableField({
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
  rest,
  fieldIndex,
  cardIndex,
  moveField,
  onHide,
}) {
  const ref = useRef(null);
  const localizedLabel = useCustomT(label) || useCustomT(rest?.fieldName);
  const isDragEnabled = typeof moveField === 'function';
  const [, drop] = useDrop({
    accept: FIELD_TYPE,
    hover: (draggedItem) => {
      if (isDragEnabled && draggedItem.index !== fieldIndex) {
        moveField(draggedItem.index, fieldIndex, cardIndex);
        draggedItem.index = fieldIndex;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: FIELD_TYPE,
    item: { index: fieldIndex },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <div className="draggableField-cont" ref={ref} style={{ opacity: isDragging ? 0.5 : 1, display: "flex", alignItems: "center" }}>
      <div className="drag-handle">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <PanelFieldDisplay
        type={type}
        label={localizedLabel}
        active={active}
        required={required}
        isDelete={isDelete}
        dropDownOptions={dropDownOptions}
        onDelete={() => onDelete()}
        onSelectField={onSelectField}
        onHide={() => onHide()}
        config={config}
        Mandatory={Mandatory}
        rest={rest}
      />
    </div>
  );
}

export default React.memo(NewDraggableField);
