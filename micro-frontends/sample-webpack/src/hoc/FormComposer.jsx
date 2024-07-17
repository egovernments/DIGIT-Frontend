import { RenderArrayField, RenderIndividualField } from "./renderForm";
// src/components/JsonSchemaForm.js
import React, { useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';




const JsonSchemaForm = ({ schema, uiSchema }) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
      defaultValues: useMemo(() => Object.keys(schema.properties).reduce((acc, key) => {
        if (schema.properties[key].type === 'array') {
          acc[key] = [{}]; // Default to an array with one empty object
        } else {
          acc[key] = '';
        }
        return acc;
      }, {}), [schema])
    });
  
    const onSubmit = useCallback((data) => {
      console.log('Form Data:', data);
    }, []);
  
    const renderFields = useCallback((keys, schema, uiSchema, control, errors) => {
      return keys.map(key => {
        const property = schema?.properties?.[key];
        const uiWidget = uiSchema?.[key] && uiSchema?.[key]?.["ui:widget"];
  
        if (property?.type === 'array') {
          return <RenderArrayField key={key} keyName={key} property={property} uiSchema={uiSchema} control={control} errors={errors} />;
        } else {
          return <RenderIndividualField key={key} keyName={key} property={property} uiWidget={uiWidget} control={control} errors={errors} />;
        }
      });
    }, [schema, uiSchema, control, errors]);
  
    const renderGroups = useCallback((groups, schema, uiSchema, control, errors) => {
      return Object.keys(groups).map(groupName => (
        <div key={groupName} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h2>{schema?.properties?.[groupName]?.title}</h2>
          {renderFields(groups?.[groupName], schema?.properties?.[groupName], uiSchema, control, errors)}
        </div>
      ));
    }, [schema, uiSchema, control, errors]);
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>{schema?.title}</h1>
        {renderGroups(uiSchema["ui:groups"], schema, uiSchema, control, errors)}
        <button type="submit">Submit</button>
      </form>
    );
  };
  
  export default JsonSchemaForm;
