import React, { useMemo, useCallback } from "react";
import { Controller, useFieldArray } from "react-hook-form";

export const RenderIndividualField = React.memo(({ keyName, property={}, uiWidget, control, errors, prefix = '' }) => (
    <div key={prefix + keyName} style={{ display: 'inline-block', marginRight: '20px' }}>
      <label>{property?.title}</label>
      <Controller
        name={prefix + keyName}
        control={control}
        rules={{ required: property?.required }}
        render={({ field }) => (
          <input
            type={uiWidget === "email" ? "email" : uiWidget === "number" ? "number" : "text"}
            {...field}
          />
        )}
      />
      {errors[prefix + keyName] && <div>{property?.title} is required</div>}
    </div>
  ));
  
  export const RenderArrayField = React.memo(({ keyName, property={}, uiSchema, control, errors }) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: keyName,
    });
  
    return (
      <div key={keyName}>
        <label>{property?.title}</label>
        {fields.map((field, index) => (
          <div key={field.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            {Object.keys(property?.items?.properties).map(subKey => (
              <RenderIndividualField
                key={subKey}
                keyName={subKey}
                property={property?.items?.properties?.[subKey]}
                uiWidget={uiSchema?.[keyName]?.items?.[subKey]?.["ui:widget"]}
                control={control}
                errors={errors}
                prefix={`${keyName}[${index}].`}
              />
            ))}
            <button type="button" onClick={() => remove(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({})}>Add {property?.title}</button>
      </div>
    );
  });