import { FieldV1 } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// Simple helper function to get field type
const getFieldType = (field, fieldTypeMasterData) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return "textInput";
  }

  // Find matching field type based on type and format
  const matched = fieldTypeMasterData.find((item) => item?.metadata?.type === field.type && item?.metadata?.format === field.format);

  return matched?.fieldType || "textInput";
};

const ComponentToRender = ({ field, t: customT, selectedField }) => {
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  const { t } = useTranslation();
  console.log("responsePanelComponent", field, byName);
  // Get field type mapping from the field master data
  const fieldTypeMasterData = byName?.FieldTypeMappingConfig || [];

  // Get the field type
  const fieldType = getFieldType(field, fieldTypeMasterData);

  console.log("fieldType", fieldType);

  return (
    <FieldV1
      charCount={field?.charCount}
      config={{
        step: "",
      }}
      description={field?.isMdms ? t(field?.helpText) : field?.helpText || null}
      error={field?.isMdms ? t(field?.errorMessage) : field?.errorMessage || null}
      infoMessage={field?.isMdms ? t(field?.tooltip) : field?.tooltip || null}
      label={field?.label}
      onChange={function noRefCheck() {}}
      placeholder={t(field?.innerLabel) || ""}
      populators={{
        t: field?.isMdms ? null : customT,
        fieldPairClassName: `app-preview-field-pair ${
          selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
            ? `app-preview-selected`
            : selectedField?.id && selectedField?.id === field?.id
            ? `app-preview-selected`
            : ``
        }`,
      }}
      required={getFieldType(field) === "custom" ? null : field?.["toArray.required"]}
      type={fieldType}
      value={field?.value === true ? "" : field?.value || ""}
      disabled={field?.readOnly || false}
    />
  );
};

export default ComponentToRender;
// {data?.cards?.map((card, index) => (
//   <Card key={index} className="app-card" style={{}}>
//     {card.headerFields.map((headerField, headerIndex) => (
//       <div key={headerIndex}>
//         {headerField.jsonPath === "ScreenHeading" ? (
//           <CardHeader>{t(headerField.value)}</CardHeader>
//         ) : (
//           <CardText className="app-preview-sub-heading">{t(headerField.value)}</CardText>
//         )}
//       </div>
//     ))}
//     {data.type !== "template" &&
//       card?.fields
//         ?.filter((field) => field.active && (field.hidden == false || field.deleteFlag == true)) //added logic to hide fields in display
//         ?.map((field, fieldIndex) => {
//           if (getFieldType(field) === "checkbox") {
//             return (
//               <div
//                 className={`app-preview-field-pair ${
//                   selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
//                     ? `app-preview-selected`
//                     : selectedField?.id && selectedField?.id === field?.id
//                     ? `app-preview-selected`
//                     : ``
//                 }`}
//               >
//                 <CheckBox
//                   mainClassName={"app-config-checkbox-main"}
//                   labelClassName={`app-config-checkbox-label ${field?.["toArray.required"] ? "required" : ""}`}
//                   onChange={(e) => {}}
//                   value={""}
//                   label={t(field?.label)}
//                   isLabelFirst={false}
//                   disabled={field?.readOnly || false}
//                 />
//               </div>
//             );
//           }
//           return (
//             <FieldV1
//               charCount={field?.charCount}
//               config={{
//                 step: "",
//               }}
//               description={field?.isMdms ? t(field?.helpText) : field?.helpText || null}
//               error={field?.isMdms ? t(field?.errorMessage) : field?.errorMessage || null}
//               infoMessage={field?.isMdms ? t(field?.tooltip) : field?.tooltip || null}
//               label={
//                 getFieldType(field) === "checkbox" || getFieldType(field) === "button" || getFieldType(field) === "custom"
//                   ? null
//                   : field?.isMdms
//                   ? t(field?.label)
//                   : field?.label
//               }
//               onChange={function noRefCheck() {}}
//               placeholder={t(field?.innerLabel) || ""}
//               populators={{
//                 t: field?.isMdms ? null : t,
//                 title: field?.label,
//                 fieldPairClassName: `app-preview-field-pair ${
//                   selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
//                     ? `app-preview-selected`
//                     : selectedField?.id && selectedField?.id === field?.id
//                     ? `app-preview-selected`
//                     : ``
//                 }`,
//                 mdmsConfig: field?.isMdms
//                   ? {
//                       moduleName: field?.schemaCode?.split(".")[0],
//                       masterName: field?.schemaCode?.split(".")[1],
//                     }
//                   : null,
//                 options: field?.isMdms ? null : field?.dropDownOptions,
//                 optionsKey: field?.isMdms ? "code" : "name",
//                 component:
//                   getFieldType(field) === "button" || getFieldType(field) === "select" || getFieldType(field) === "custom"
//                     ? renderField(field, t)
//                     : null,
//               }}
//               required={getFieldType(field) === "custom" ? null : field?.["toArray.required"]}
//               type={getFieldType(field) === "button" || getFieldType(field) === "select" ? "custom" : getFieldType(field) || "text"}
//               value={field?.value === true ? "" : field?.value || ""}
//               disabled={field?.readOnly || false}
//             />
//           );
//         })}
//     {data.type !== "template" && (
//       <Button
//         className="app-preview-action-button"
//         variation="primary"
//         label={t(data?.actionLabel)}
//         title={t(data?.actionLabel)}
//         onClick={() => {}}
//       />
//     )}
//     {data.type === "template" && (
//       <GenericTemplateScreen components={card.fields} selectedField={selectedField} t={t} templateName={data.name} />
//     )}
//   </Card>
// ))}
