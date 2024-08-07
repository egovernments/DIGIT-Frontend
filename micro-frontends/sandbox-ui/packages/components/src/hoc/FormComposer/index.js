import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import "react-tabs/style/react-tabs.css";
import { getUpdatedUISchema } from "./formTabUtils";
import Stepper from "react-stepper-horizontal";
import useLastUpdatedField from "../../hooks/useLastUpdatedField";
import DigitUIComponents from "../../DigitUIComponents";
const { TextInput, CheckBox, Button, DatePicker } = DigitUIComponents;

const RenderIndividualField = React.memo(
  ({ name, property, uiWidget, control, errors, customWidgets }) => {
    const CustomWidget = customWidgets[uiWidget];
    const { theme, toggleTheme } = { theme: "light" };

    return (
      <div key={name} style={{ display: "inline-block", marginRight: "20px" }}>
        <label className={theme === "light" ? "text-gray-800" : "text-white"}>
          {property.title}
        </label>
        <Controller
          name={name}
          control={control}
          rules={{ required: property.required }}
          render={({ field }) => {
            if (property.enum) {
              return (
                <select {...field}>
                  {property.enum.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            } else {
              switch (property.type) {
                case "boolean":
                  return <CheckBox {...field} checked={field.value} />;
                case "date":
                  return <DatePicker {...field} />;
                default:
                  return <TextInput {...field} />;
              }
            }
          }}
        />
        {errors[name] && <div>{property.title} is required</div>}
      </div>
    );
  }
);

const RenderArrayField = React.memo(
  ({ name, property, uiSchema, control, errors, watch, customWidgets }) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name,
    });
    const { theme, toggleTheme } = { theme: "light" };

    return (
      <div key={name}>
        <label className={theme === "light" ? "text-gray-800" : "text-white"}>
          {property?.title}
        </label>
        {fields.map((field, index) => (
          <Card key={field.id}>
            {property?.items?.properties ? (
              Object.keys(property.items.properties).map((subKey) => (
                <RenderField
                  key={subKey}
                  name={`${name}[${index}].${subKey}`}
                  property={property.items.properties[subKey]}
                  uiSchema={uiSchema?.[name]?.items?.[subKey]}
                  control={control}
                  errors={errors}
                  watch={watch}
                  customWidgets={customWidgets}
                />
              ))
            ) : (
              <RenderField
                key={`${name}[${index}]`}
                name={`${name}[${index}]`}
                property={property.items}
                uiSchema={uiSchema?.[name]?.items}
                control={control}
                errors={errors}
                watch={watch}
                customWidgets={customWidgets}
              />
            )}
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </Card>
        ))}
        <button type="button" onClick={() => append({})}>
          Add {property.title}
        </button>
      </div>
    );
  }
);

function findUIDependencies(obj, path = "") {
  const result = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newPath = path ? `${path}.${key}` : key;

      if (key === "ui:dependencies") {
        result.push({ path: newPath, object: obj[key] });
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        result.push(...findUIDependencies(obj[key], newPath));
      }
    }
  }

  return result;
}

const RenderDependentField = ({
  name,
  property,
  control,
  watch,
  errors,
  dependencies,
  customWidgets,
}) => {
  return (
    <RenderField
      name={name}
      property={property}
      uiSchema={dependencies?.uiWidget}
      control={control}
      errors={errors}
      watch={watch}
      customWidgets={customWidgets}
    />
  );
};

const RenderField = ({
  name,
  property,
  uiSchema,
  control,
  errors,
  watch,
  customWidgets = {},
}) => {
  const uiWidget = uiSchema && uiSchema["ui:widget"];
  const dependencies = uiSchema && uiSchema["ui:dependencies"];
  const { theme, toggleTheme } = { theme: "light" };

  if (dependencies) {
    const dependentValue = watch(dependencies.dependentField);
    if (dependentValue === dependencies.expectedValue) {
      return (
        <RenderDependentField
          name={name}
          property={property}
          control={control}
          watch={watch}
          errors={errors}
          dependencies={dependencies}
          customWidgets={customWidgets}
        />
      );
    }
    return null;
  }

  if (property.type === "array") {
    return (
      <RenderArrayField
        name={name}
        property={property}
        uiSchema={uiSchema}
        control={control}
        errors={errors}
        watch={watch}
        customWidgets={customWidgets}
      />
    );
  }

  if (property.type === "object") {
    return (
      <Card key={name}>
        <label className={theme === "light" ? "text-gray-800" : "text-white"}>
          {property.title}
        </label>
        {Object.keys(property?.properties).map((subKey) => (
          <RenderField
            key={`${name}.${subKey}`}
            name={`${name}.${subKey}`}
            property={property.properties?.[subKey]}
            uiSchema={uiSchema?.[subKey]}
            control={control}
            errors={errors}
            watch={watch}
            customWidgets={customWidgets}
          />
        ))}
      </Card>
    );
  }

  return (
    <RenderIndividualField
      key={name}
      name={name}
      property={property}
      uiWidget={uiWidget}
      control={control}
      errors={errors}
      customWidgets={customWidgets}
    />
  );
};

const FormComposer = ({ schema, uiSchema, customWidgets }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const buttonStyles = {
    backgroundColor: "#007bff",
    padding: "10px 20px",
    cursor: "pointer",
    marginRight: "10px",
  }

  const {
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(
      () =>
        Object.keys(schema.properties).reduce((acc, key) => {
          if (schema.properties[key].type === "array") {
            acc[key] = [{}]; // Default to an array with one empty object
          } else {
            acc[key] = "";
          }
          return acc;
        }, {}),
      [schema]
    ),
  });

  const dependencies = findUIDependencies(uiSchema);

  // Extracting unique dependent fields from dependencies
  const dependentFields = useMemo(() => {
    const fields = [];
    dependencies.forEach((dep) => {
      if (!fields.includes(dep.object.dependentField)) {
        fields.push(dep.object.dependentField);
      }
    });
    return fields;
  }, [dependencies]);

  const lastUpdatedField = useLastUpdatedField(control, dependentFields);

  useEffect(() => {
    if (!lastUpdatedField) return;

    dependencies.forEach((dep) => {
      const { dependentField, expectedValue } = dep.object;

      if (dependentField === lastUpdatedField) {
        const fieldValue = getValues(dependentField);

        if (fieldValue === expectedValue) {
          // trigger(dep.path.replace('.ui:dependencies', '')); // Trigger validation for the specific path
        } else {
          // reset(getValues(), { keepValues: true, keepErrors: true, keepDirty: true });
        }
      }
    });
  }, [lastUpdatedField, reset, trigger, getValues, dependencies]);

  const onSubmit = useCallback((data) => {
    console.log("Form Data:", data);
  }, []);

  const renderFields = useCallback(
    (keys, schema, uiSchema, control, errors) => {
      return keys.map((key) => (
        <RenderField
          key={key}
          name={key}
          property={
            schema?.type == "array" ? schema : schema?.properties?.[key]
          }
          uiSchema={uiSchema[key]}
          control={control}
          errors={errors}
          watch={watch}
          customWidgets={customWidgets}
        />
      ));
    },
    [schema, uiSchema, control, errors, watch]
  );

  const uiLayout = uiSchema?.["ui:layout"];

  const isTabVisible = (tab) => {
    if (!uiLayout?.conditionalLayout?.[tab]) return true;
    const condition = uiLayout?.conditionalLayout?.[tab];
    const watchValues = watch(condition.fields);
    return condition.rule(watchValues);
  };

  const renderGroups = useCallback(
    (groups, schema, uiSchema, control, errors) => {
      return Object.keys(groups).map((groupName) => (
        <Card key={groupName}>
          <h2>{schema.properties[groupName]?.title}</h2>
          {renderFields(
            groups[groupName]?.["ui:order"],
            schema.properties[groupName] || schema,
            uiSchema[groupName],
            control,
            errors
          )}
        </Card>
      ));
    },
    [schema, uiSchema, control, errors, renderFields]
  );

  const { theme, toggleTheme } = { theme: "light" };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className={theme === "light" ? "text-gray-800" : "text-white"}>
        {schema.title}
      </h1>
      {uiLayout && uiLayout?.layouts && uiLayout?.layouts?.length > 0 ? (
        uiLayout?.type !== "TAB" ? (
          <>
            <Stepper
              steps={uiLayout?.layouts.map((step, index) => ({
                title: step.label,
                onClick: () => {
                  setCurrentTab(index);
                },
              }))}
              activeStep={currentTab}
            />
            {uiLayout?.layouts.map((tab, index) => {
              const updatedUiSchema = React.useMemo(
                () => getUpdatedUISchema(index, uiSchema, uiLayout?.layouts),
                [index, uiSchema, uiLayout?.layouts]
              );
              return (
                isTabVisible(index) &&
                index === currentTab && (
                  <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                    <h2>{tab.label}</h2>
                    {renderGroups(
                      updatedUiSchema?.["ui:groups"],
                      schema,
                      updatedUiSchema,
                      control,
                      errors
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                      {currentTab > 0 && (
                        <Button
                          label="Previous"
                          onClick={() => setCurrentTab((prev) => prev - 1)}
                          style={buttonStyles}
                        />
                      )}
                      {currentTab < uiLayout?.layouts.length - 1 && (
                        <Button
                          label="Next"
                          onClick={() => setCurrentTab((prev) => prev + 1)}
                          style={buttonStyles}
                        />
                      )}
                      {currentTab === uiLayout?.layouts.length - 1 && (
                        <Button
                          label="Submit"
                          type="submit"
                          style={buttonStyles}
                        />
                      )}
                    </div>
                  </div>
                )
              );
            })}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
              {uiLayout?.layouts.map((tab, index) => (
                isTabVisible(index) && (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentTab(index)}
                    style={{
                      padding: '10px 20px',
                      margin: '10px',
                      backgroundColor: currentTab === index ? '#007bff' : '#ccc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                )
              ))}
            </div>
            {uiLayout?.layouts.map((tab, index) => {
              const updatedUiSchema = React.useMemo(
                () => getUpdatedUISchema(index, uiSchema, uiLayout?.layouts),
                [index, uiSchema, uiLayout?.layouts]
              );
              return (
                isTabVisible(index) &&
                index === currentTab && (
                  <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                    <h2>{tab.label}</h2>
                    {renderGroups(
                      updatedUiSchema?.["ui:groups"],
                      schema,
                      updatedUiSchema,
                      control,
                      errors
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                      {currentTab > 0 && (
                        <Button
                          label="Previous"
                          onClick={() => setCurrentTab((prev) => prev - 1)}
                          style={buttonStyles}
                        />
                      )}
                      {currentTab < uiLayout?.layouts.length - 1 && (
                        <Button
                          label="Next"
                          onClick={() => setCurrentTab((prev) => prev + 1)}
                          style={buttonStyles}
                        />
                      )}
                      {currentTab === uiLayout?.layouts.length - 1 && (
                        <Button
                          label="Submit"
                          type="submit"
                          style={buttonStyles}
                        />
                      )}
                    </div>
                  </div>
                )
              );
            })}
          </>
        )


      ) : (
        <>
          {renderGroups(
            uiSchema?.["ui:groups"],
            schema,
            uiSchema,
            control,
            errors
          )}
          <button type="submit">Submit</button>
        </>
      )}
    </form>
  );
};

const Card = ({ children }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        margin: "10px 0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div style={{ marginLeft: index === 0 ? 0 : "10px" }}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default FormComposer;
