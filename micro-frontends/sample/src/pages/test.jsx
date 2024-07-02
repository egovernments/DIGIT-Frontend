// src/components/JsonSchemaForm.js
import React, { useMemo, useCallback, use } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CustomDatePicker from "./CustomCheck"; // Import the custom component
import { ThemeContext } from "../examples/Theme";

const schema = {
  title: "Complex Form",
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      properties: {
        firstName: { type: "string", title: "First Name" },
        lastName: { type: "string", title: "Last Name" },
        dob: { type: "string", format: "date", title: "Date of Birth" },
      },
      required: ["firstName", "lastName"],
    },
    address: {
      type: "object",
      properties: {
        street: { type: "string", title: "Street" },
        city: { type: "string", title: "City" },
        state: { type: "string", title: "State" },
        zipCode: { type: "string", title: "Zip Code" },
      },
    },
    test: {
      type: "array",
      items: {
        type: "string",
      },
    },
    phones: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            title: "Type",
            enum: ["Home", "Work", "Mobile"],
          },
          number: { type: "string", title: "Number" },
          otherPhones: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  title: "Type",
                  enum: ["Home", "Work", "Mobile"],
                },
                number: { type: "string", title: "Number" },
              },
            },
          },
        },
      },
    },
    newsletter: {
      type: "boolean",
      title: "Subscribe to Newsletter",
    },
    subscriptionFrequency: {
      type: "string",
      title: "Subscription Frequency",
      enum: ["Daily", "Weekly", "Monthly"],
    },
  },
  required: ["personalInfo", "address"],
};
// src/uiSchema.json
const uiSchema = {
  "ui:groups": {
    personalInfo: {
      fields: ["personalInfo"],
      "ui:order": ["firstName", "lastName", "dob"],
    },
    address: {
      fields: ["address"],
      "ui:order": ["street", "city", "state", "zipCode"],
    },
    phones: {
      fields: ["phones"],
      "ui:order": ["phones"],
    },
    test: {
      fields: ["test"],
      "ui:order": ["test"],
    },
    subscription: {
      fields: ["newsletter", "subscriptionFrequency"],
      "ui:order": ["newsletter", "subscriptionFrequency"],
    },
  },
  personalInfo: {
    firstName: { "ui:widget": "text" },
    lastName: { "ui:widget": "text" },
    dob: { "ui:widget": "date" },
  },
  address: {
    street: { "ui:widget": "text" },
    city: { "ui:widget": "text" },
    state: { "ui:widget": "text" },
    zipCode: { "ui:widget": "text" },
  },
  phones: {
    items: {
      type: { "ui:widget": "select" },
      number: { "ui:widget": "text" },

      mobileNumber: {
        "ui:widget": "text",
        "ui:dependencies": {
          dependentField: "phones[0].type",
          expectedValue: "Mobile",
        },
      },
      otherPhones: {
        items: {
          type: { "ui:widget": "select" },
          number: { "ui:widget": "text" },
        },
      },
    },
  },
  newsletter: {
    "ui:widget": "checkbox",
  },
  subscriptionFrequency: {
    "ui:dependencies": {
      dependentField: "newsletter",
      expectedValue: true,
      "ui:widget": "select",
    },
  },
};

const customWidgets = {
  date: CustomDatePicker,
};

const RenderIndividualField = React.memo(
  ({ name, property, uiWidget, control, errors }) => {
    const CustomWidget = customWidgets[uiWidget];
    const { theme, toggleTheme } = use(ThemeContext);
    console.log(
      name,
      property,
      uiWidget,
      control,
      errors,
      "RenderIndividualField : name, property, uiWidget, control, errors"
    );
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
            if (property.type === "boolean") {
              return <input type="checkbox" {...field} checked={field.value} />;
            } else if (property.enum) {
              return (
                <select {...field}>
                  {property.enum.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            } else if (CustomWidget) {
              return <CustomWidget {...field} />;
            } else {
              return (
                <input
                  type={
                    uiWidget === "email"
                      ? "email"
                      : uiWidget === "number"
                      ? "number"
                      : "text"
                  }
                  {...field}
                />
              );
            }
          }}
        />
        {errors[name] && <div>{property.title} is required</div>}
      </div>
    );
  }
);

const RenderArrayField = React.memo(
  ({ name, property, uiSchema, control, errors, watch }) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name,
    });
    const { theme } = use(ThemeContext);
    if (property?.type == "array" && property?.items?.type == "string") {
      console.log(
        name,
        property,
        uiSchema,
        control,
        errors,
        watch,
        fields,
        "name, property, uiSchema, control, errors, watch,fields"
      );
    }
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

const RenderDependentField = ({
  name,
  property,
  control,
  watch,
  errors,
  dependencies,
}) => {
  console.log(name, property, control, watch, errors, dependencies);
  const dependentValue = watch(dependencies.dependentField);

  if (dependentValue === dependencies.expectedValue) {
    return (
      <RenderField
        name={name}
        property={property}
        uiSchema={dependencies?.uiWidget}
        control={control}
        errors={errors}
        watch={watch}
      />
    );
  }

  return null;
};
const RenderField = React.memo(
  ({ name, property, uiSchema, control, errors, watch }) => {
    const uiWidget = uiSchema && uiSchema["ui:widget"];
    const dependencies = uiSchema && uiSchema["ui:dependencies"];
    const { theme, toggleTheme } = use(ThemeContext);
    console.log(name, "name",property);

    if (dependencies) {
      console.log(dependencies, "dependencies");
      return (
        <RenderDependentField
          name={name}
          property={property}
          control={control}
          watch={watch}
          errors={errors}
          dependencies={dependencies}
        />
      );
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
      />
    );
  }
);

const JsonSchemaForm = ({ schema, uiSchema }) => {
  const {
    control,
    handleSubmit,
    watch,
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
        />
      ));
    },
    [schema, uiSchema, control, errors, watch]
  );

  const renderGroups = useCallback(
    (groups, schema, uiSchema, control, errors) => {
      return Object.keys(groups).map((groupName) => (
        <Card key={groupName}>
          <h2>{schema.properties[groupName]?.title}</h2>
          {renderFields(
            groups[groupName]?.["ui:order"],
            schema.properties[groupName] || schema,
            uiSchema,
            control,
            errors
          )}
        </Card>
      ));
    },
    [schema, uiSchema, control, errors, renderFields]
  );
  const { theme, toggleTheme } = use(ThemeContext);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className={theme === "light" ? "text-gray-800" : "text-white"}>
        {schema.title}
      </h1>
      {renderGroups(uiSchema?.["ui:groups"], schema, uiSchema, control, errors)}
      <button type="submit">Submit</button>
    </form>
  );
};
const Card = ({ key, children }) => {
 return (<div
    key={key}
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      margin: "10px 0",
    }}
  >
   { children }
  </div>)
};

// const Header = ({ className, children }) => {
//     return (<h1
//         className={className}
//      >
//       { children }
//      </h1>)
//    };
   

const Test = () => {
  return <JsonSchemaForm schema={schema} uiSchema={uiSchema}></JsonSchemaForm>;
};
export default Test;
