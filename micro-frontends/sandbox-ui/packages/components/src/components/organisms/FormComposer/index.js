import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import "react-tabs/style/react-tabs.css";
import { getUpdatedUISchema } from "./formTabUtils";
import Stepper from "react-stepper-horizontal";
import useLastUpdatedField from "../../../hooks/useLastUpdatedField";
import DigitUIComponents from "../../../DigitUIComponents";

const { TextInput, Button } = DigitUIComponents;

/**
 * @author jagankumar-egov
 * @date 2024-08-01
 * @description  This file contains the FormComposer component and related subcomponents for building dynamic forms using React Hook Form and custom widgets.
 */



/**
 * dropdown component 
 */
const EnumBasedDropdown = ({ options, value, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <select
        className='digit-citizenCard-input'
        value={value}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * CheckBox 
*/
const CheckBox = ({ checked, onChange, label }) => {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ width: '2vh', height: '2vw' }}
      />
    </label>
  );
};

/**
 * RenderIndividualField - Renders an individual field based on its configuration.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the field.
 * @param {Object} props.property - The property configuration for the field.
 * @param {string} props.uiWidget - The custom widget type for rendering.
 * @param {Object} props.control - The control object from react-hook-form.
 * @param {Object} props.errors - The form errors object from react-hook-form.
 * @param {Object} props.customWidgets - A dictionary of custom widgets.
 *
 * @returns {React.ReactNode} The rendered field component.
 */
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
              return <EnumBasedDropdown
                options={property.enum}
                value={field.value}
                onChange={field.onChange}
              />
            }
            else if (CustomWidget) {
              const combinedProps = { ...field, ...property };
              return <CustomWidget {...combinedProps} />;
            }
            else {
              switch (property.type) {
                case "boolean":
                  return <CheckBox {...field} checked={field.value} />;
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

/**
 * RenderArrayField - Renders an array of fields with options to add or remove items.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the field array.
 * @param {Object} props.property - The property configuration for the field array.
 * @param {Object} props.uiSchema - The UI schema for the field array.
 * @param {Object} props.control - The control object from react-hook-form.
 * @param {Object} props.errors - The form errors object from react-hook-form.
 * @param {Function} props.watch - The watch function from react-hook-form.
 * @param {Object} props.customWidgets - A dictionary of custom widgets.
 *
 * @returns {React.ReactNode} The rendered field array component.
 */
const RenderArrayField = React.memo(
  ({ name, property, uiSchema, control, errors, watch, customWidgets }) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name,
    });
    const { theme, toggleTheme } = { theme: "light" };

    const buttonStyles = {
      backgroundColor: "#007bff",
      padding: "5px 10px",   // Reduced padding for a smaller button
      cursor: "pointer",
      marginRight: "5px",    // Reduced margin for a smaller button
      borderRadius: "5px",   // Keeps the rounded corners
      fontSize: "calc(1rem + 1vw)", // Adjust font size based on viewport width
      width: "8vw",         // Width as a percentage of viewport width
      height: "auto",        // Automatically adjust height based on content
      minWidth: "80px",      // Minimum width of the button
      minHeight: "30px",     // Minimum height of the button
      display: "flex",       // Ensure proper alignment of content
      alignItems: "center",  // Center content vertically
      justifyContent: "center" // Center content horizontally
    };






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
            <Button
              label="Remove"
              style={buttonStyles}
              onClick={() => remove(index)}
            />
          </Card>
        ))}
        <Button
          label="Add"
          style={buttonStyles}
          onClick={() => append({})}
        />
      </div>
    );
  }
);

/**
 * findUIDependencies - Recursively searches an object for UI dependencies.
 *
 * @param {Object} obj - The object to search for UI dependencies.
 * @param {string} [path=""] - The current path in the object.
 *
 * @returns {Array} An array of objects containing the path and the dependency object.
 */
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

/**
 * RenderDependentField - Renders a field based on its dependencies.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the field.
 * @param {Object} props.property - The property configuration for the field.
 * @param {Object} props.control - The control object from react-hook-form.
 * @param {Function} props.watch - The watch function from react-hook-form.
 * @param {Object} props.errors - The form errors object from react-hook-form.
 * @param {Object} props.dependencies - The dependencies configuration for the field.
 * @param {Object} props.customWidgets - A dictionary of custom widgets.
 *
 * @returns {React.ReactNode} The rendered dependent field component.
 */
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

/**
 * RenderField - Renders a field based on its configuration.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the field.
 * @param {Object} props.property - The property configuration for the field.
 * @param {Object} props.uiSchema - The UI schema for the field.
 * @param {Object} props.control - The control object from react-hook-form.
 * @param {Object} props.errors - The form errors object from react-hook-form.
 * @param {Function} props.watch - The watch function from react-hook-form.
 * @param {Object} props.customWidgets - A dictionary of custom widgets.
 *
 * @returns {React.ReactNode} The rendered field component.
 */
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
  console.log(property, " pppppppppppppppppp")
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

/**
 * FormComposer - A form builder component using React Hook Form.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.schema - The schema configuration for the form.
 * @param {Object} props.uiSchema - The UI schema for the form.
 * @param {Object} props.customWidgets - A dictionary of custom widgets.
 * @param {Function} props.onSubmit - Function to call when the form is submitted.
 * @param {Function} props.onError - Function to call when the form submission fails.
 * @author jagankumar-egov
 * @returns {React.ReactNode} The rendered form component.
 */
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