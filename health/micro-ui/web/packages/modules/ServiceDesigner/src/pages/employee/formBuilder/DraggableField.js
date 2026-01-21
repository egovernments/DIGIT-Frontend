import React, { useRef } from "react";
import AppFieldComposer from "./AppFieldComposer";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";

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
  isMandatory,
  isApplicantSection,
}) {
  const ref = useRef(null);
  const { t } = useTranslation();

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
    <div 
      ref={ref}
      onClick={() => {
        // Disable field selection for mandatory applicant fields
        // if (isApplicantSection && isMandatory) {
        //   return;
        // }
        onSelectField();
      }}
      className="draggableField-cont"
      // style={{
      //   opacity: isApplicantSection && isMandatory ? 0.6 : 1, // Just add opacity for mandatory fields
      //   cursor: isApplicantSection && isMandatory ? 'not-allowed' : 'pointer' // Change cursor for mandatory fields
      // }}
    >
      <AppFieldComposer
        type={type}
        label={label}
        active={active}
        required={required}
        isDelete={isDelete && !isMandatory} // Disable delete for mandatory fields
        dropDownOptions={dropDownOptions}
        onDelete={onDelete}
        onSelectField={() => onSelectField()}
        //onHide={() => onHide()}
        config={config}
        Mandatory={Mandatory}
        helpText={helpText}
        infoText={infoText}
        innerLabel={innerLabel}
        rest={rest}
        index={index}
        fieldIndex={fieldIndex}
        cardIndex={cardIndex}
        moveField={moveField}
        onHide={onHide}
        fields={fields}
        indexOfCard={indexOfCard}
        isMandatory={isMandatory}
        isApplicantSection={isApplicantSection}
      />
    </div>
  );
}

export default React.memo(DraggableField);
