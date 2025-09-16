import React from 'react'
import { Loader, FormComposerV2 as FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import { useLocation } from 'react-router-dom';

const SampleView = () => {
  const newConfig = [
    {
      head: "View Facility",
      body: [
        {
          inline: true,
          label: "Facility Name",
          isMandatory: false,
          key: "facilityname",
          type: "text",
          disable: true,
          populators: { name: "facilityname", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
        },
        {
          inline: true,
          label: "Facility Id",
          isMandatory: false,
          key: "facilityids",
          type: "text",
          disable: true,
          populators: { name: "facilityid", error: "Required" },
        },
        {
          inline: true,
          label: "Address Id",
          isMandatory: false,
          key: "addressid",
          type: "text",
          disable: true,
          populators: { name: "addressid", error: "Required" },
        },
        {
          inline: true,
          label: "Tenant Id",
          isMandatory: false,
          key: "tenantid",
          type: "text",
          disable: true,
          populators: { name: "tenantid", error: "Required" },
        },
        {
          isMandatory: true,
          key: "usage",
          type: "dropdown",
          label: "Usage",
          disable: true,
          populators: {
            name: "usage",
            optionsKey: "name",
            error: "required ",
          },
        },
      ],
    },
  ];
  const location = useLocation();
  console.log(location.state?.rowData)
  const data = location.state?.rowData;

  const defVal = {
    "facilityname":`${data["name"]}`,
    "facilityid":`${data["id"]}`,
    "tenantid":`${data["tenantId"]}`,
    "addressid": data.address ? `${data["address"]["id"]}` : "123",
    "usage[name]":`${data["usage"]}`,
  }

  return (
    <FormComposer
    config={newConfig}
    defaultValues={defVal}
    onSubmit={(data)=>console.log(data)}
    fieldStyle={{ marginRight: 0 }}
    className="form-no-margin"
    labelBold={true}
    />
  )
}

export default SampleView;