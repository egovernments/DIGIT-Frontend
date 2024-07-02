import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


const RenderField = ({ control, register, name, property, uiSchema, errors }) => {
  if (property.type === 'object') {
    return (
      <div key={name} style={{ marginBottom: '20px' }}>
        <h3>{property.title}</h3>
        {Object.keys(property.properties).map(subKey => (
          <RenderField
            key={subKey}
            name={`${name}.${subKey}`}
            property={property?.properties?.[subKey]}
            uiSchema={uiSchema?.[subKey]}
            control={control}
            register={register}
            errors={errors}
          />
        ))}
      </div>
    );
  } else if (property.type === 'array') {
    const { fields, append, remove } = useFieldArray({
      control,
      name: name,
    });

    return (
      <div key={name} style={{ marginBottom: '20px' }}>
        <h3>{property.title}</h3>
        {fields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '10px' }}>
            {Object.keys(property.items.properties).map(subKey => (
              <RenderField
                key={subKey}
                name={`${name}[${index}].${subKey}`}
                property={property?.items?.properties?.[subKey]}
                uiSchema={uiSchema?.items && uiSchema.items?.[subKey]}
                control={control}
                register={register}
                errors={errors}
              />
            ))}
            <button type="button" onClick={() => remove(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({})}>Add {property.title}</button>
      </div>
    );
  } else {
    return (
      <div key={name} style={{ marginBottom: '10px' }}>
        <label>{property.title}</label>
        <Controller
          name={name}
          control={control}
          rules={{ required: property.required }}
          render={({ field }) => (
            <input
              type={uiSchema?.["ui:widget"] === "email" ? "email" :
                    uiSchema?.["ui:widget"] === "number" ? "number" :
                    uiSchema?.["ui:widget"] === "checkbox" ? "checkbox" :
                    "text"}
              {...field}
            />
          )}
        />
        {errors[name] && <div style={{ color: 'red' }}>{property.title} is required</div>}
      </div>
    );
  }
};

const TabForm = ({ schema, uiSchema, tabs, conditionalTabs }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = data => console.log(data);

  const isTabVisible = (tab) => {
    if (!conditionalTabs[tab]) return true;
    const condition = conditionalTabs[tab];
    const watchValues = watch(condition.fields);
    return condition.rule(watchValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '600px', margin: 'auto' }}>
      <Tabs selectedIndex={currentTab} onSelect={(index) => setCurrentTab(index)}>
        <TabList>
          {tabs.map((tab, index) => (
            isTabVisible(index) && <Tab key={index}>{tab.label}</Tab>
          ))}
        </TabList>

        {tabs.map((tab, index) => (
          isTabVisible(index) && (
            <TabPanel key={index}>
              <h2>{tab.label}</h2>
              {tab.fields.map(key => (
                <RenderField
                  key={key}
                  name={key}
                  property={schema.properties[key]}
                  uiSchema={uiSchema[key]}
                  control={control}
                  register={register}
                  errors={errors}
                />
              ))}
              {currentTab > 0 && <button type="button" onClick={() => setCurrentTab(prev => prev - 1)}>Previous</button>}
              {currentTab < tabs.length - 1 && <button type="button" onClick={() => setCurrentTab(prev => prev + 1)}>Next</button>}
              {currentTab === tabs.length - 1 && <button type="submit">Submit</button>}
            </TabPanel>
          )
        ))}
      </Tabs>
    </form>
  );
};



const tabs = [
  { label: "Personal Info", fields: ["personalInfo"] },
  { label: "Address", fields: ["address"] },
  { label: "Phones", fields: ["phones"] },
  { label: "Preferences", fields: ["preferences"] }
];

const conditionalTabs = {
  3: {
    fields: ["preferences.newsletter"],
    rule: values => values["preferences.newsletter"]
  }
};

const TabFormScreen = () => {
  return (
    <div className="App">
      <TabForm schema={schema} uiSchema={uiSchema} tabs={tabs} conditionalTabs={conditionalTabs} />
    </div>
  );
}

export default TabFormScreen;


 const schema = {
    "title": "Complex Form",
    "type": "object",
    "properties": {
      "personalInfo": {
        "type": "object",
        "title": "Personal Information",
        "properties": {
          "firstName": {
            "type": "string",
            "title": "First Name"
          },
          "lastName": {
            "type": "string",
            "title": "Last Name"
          },
          "age": {
            "type": "integer",
            "title": "Age"
          },
          "email": {
            "type": "string",
            "format": "email",
            "title": "Email"
          }
        }
      },
      "address": {
        "type": "object",
        "title": "Address",
        "properties": {
          "street": {
            "type": "string",
            "title": "Street"
          },
          "city": {
            "type": "string",
            "title": "City"
          },
          "state": {
            "type": "string",
            "title": "State"
          },
          "zipCode": {
            "type": "string",
            "title": "Zip Code"
          }
        }
      },
      "phones": {
        "type": "array",
        "title": "Phone Numbers",
        "items": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "title": "Type",
              "enum": ["Home", "Work", "Mobile"]
            },
            "number": {
              "type": "string",
              "title": "Number"
            }
          }
        }
      },
      "preferences": {
        "type": "object",
        "title": "Preferences",
        "properties": {
          "newsletter": {
            "type": "boolean",
            "title": "Receive Newsletter"
          },
          "notifications": {
            "type": "object",
            "title": "Notifications",
            "properties": {
              "email": {
                "type": "boolean",
                "title": "Email"
              },
              "sms": {
                "type": "boolean",
                "title": "SMS"
              },
              "push": {
                "type": "boolean",
                "title": "Push Notifications"
              }
            }
          }
        }
      }
    },
    "required": ["personalInfo", "email"]
  };
  
   const uiSchema = {
    "ui:groups": {
      "personalInfo": ["firstName", "lastName", "age", "email"],
      "address": ["street", "city", "state", "zipCode"],
      "phones": ["phones"],
      "preferences": ["newsletter", "notifications"]
    },
    "firstName": {
      "ui:widget": "text"
    },
    "lastName": {
      "ui:widget": "text"
    },
    "age": {
      "ui:widget": "number"
    },
    "email": {
      "ui:widget": "email"
    },
    "street": {
      "ui:widget": "text"
    },
    "city": {
      "ui:widget": "text"
    },
    "state": {
      "ui:widget": "text"
    },
    "zipCode": {
      "ui:widget": "text"
    },
    "phones": {
      "items": {
        "type": {
          "ui:widget": "select"
        },
        "number": {
          "ui:widget": "text"
        }
      }
    },
    "newsletter": {
      "ui:widget": "checkbox"
    },
    "notifications": {
      "email": {
        "ui:widget": "checkbox"
      },
      "sms": {
        "ui:widget": "checkbox"
      },
      "push": {
        "ui:widget": "checkbox"
      }
    }
  };