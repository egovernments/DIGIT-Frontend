// import { Loader, FormComposer } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
// import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import useCustomAPIMutationHook from "../../../ui-libraries/src/hooks/useCustomAPIMutationHook";
import { FormComposer } from "../components/react-components/src/hoc/FormComposerV2";
//const formDataToRequestObj = ( formData ) => {
//console.log("inside format")
//make a req object (refer from postman)
//return that obj
//}

export const newConfig = [
  {
    head: "Create Sanitation Worker",
    //subHead: "Config Sub Head",
    body: [
      {
        inline: true,
        label: "Applicant Name",
        isMandatory: false,
        key: "BrSelectFather",
        type: "text",
        disable: false,
        populators: {
          name: "applicantname",
          error: "Required",
          validation: { pattern: /^[A-Za-z]+$/i },
        },
      },
      {
        inline: true,
        label: "date of birth",
        isMandatory: false,
        key: "BrSelectFather",
        type: "date",
        disable: false,
        populators: { name: "dob", error: "Required" },
      },

      // {
      //   isMandatory: true,
      //   key: "genders",
      //   type: "dropdown",
      //   label: "Enter Gender",
      //   disable: false,
      //   populators: {
      //     name: "genders",
      //     optionsKey: "name",
      //     error: "sample required message",
      //     required: true,
      //     mdmsConfig: {
      //       masterName: "GenderType",
      //       moduleName: "common-masters",
      //       localePrefix: "COMMON_GENDER",
      //     },
      //   },
      // },
      // {
      //   isMandatory: true,
      //   key: "genders",
      //   type: "dropdown",
      //   label: "Enter Gender",
      //   disable: false,
      //   populators: {
      //     name: "genders",
      //     options: [
      //       { code: "MALE", name: "Male" },
      //       { code: "FEMALE", name: "Female" },
      //       // Add more options as needed
      //     ],
      //     error: "sample required message",
      //     required: true,
      //   },
      // },

      {
        label: "Phone number",
        isMandatory: true,
        key: "BrSelectFather",
        type: "number",
        disable: false,
        populators: {
          name: "phno",
          error: "sample error message",
          validation: { min: 0, max: 9999999999 },
        },
      },
    ],
  },
  {
    head: "Residential Details",
    body: [
      {
        inline: true,
        label: "Pincode",
        isMandatory: true,
        //description: "Field supporting description",
        key: "BrSelectFather",
        type: "number",
        disable: false,
        populators: { name: "pincode", error: "sample error message" },
      },
      {
        inline: true,
        label: "City",
        isMandatory: true,
        //description: "Field supporting description",
        key: "BrSelectFather",
        type: "text",
        disable: false,
        populators: {
          name: "city",
          error: "sample error message",
          validation: { pattern: /^[A-Za-z]+$/i },
        },
      },
      {
        isMandatory: false,
        key: "locality",
        type: "dropdown",
        label: "Enter locality",
        disable: false,
        populators: {
          name: "locality",
          optionsKey: "name",
          error: "sample required message",
          required: true,
          // mdmsConfig: {
          //   masterName: "GenderType",
          //   moduleName: "common-masters",
          //   localePrefix: "COMMON_GENDER",
          // },
          options: [
            {
              code: "SUN01",
              name: "Ajit Nagar - Area1",
              label: "Locality",
              latitude: "31.63089",
              longitude: "74.871552",
              area: "Area1",
              pincode: [143001],
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN02",
              name: "Back Side 33 KVA Grid Patiala Road",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: [143001],
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN03",
              name: "Bharath Colony",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: [143001],
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN10",
              name: "Backside Brijbala Hospital - Area3",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area3",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN11",
              name: "Bigharwal Chowk to Railway Station - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN12",
              name: "Chandar Colony Biggarwal Road - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: [143001],
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN20",
              name: "Aggarsain Chowk to Mal Godown - Both Sides - Area3",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area3",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN21",
              name: "ATAR SINGH COLONY - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN22",
              name: "Back Side Naina Devi Mandir - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN30",
              name: "Bakhtaur Nagar - Area1",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN31",
              name: "Bhai Mool Chand Sahib Colony - Area1",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN32",
              name: "College Road (Southern side) - Area2",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area2",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
            {
              code: "SUN33",
              name: "Ekta Colony (Southern Side) - Area1",
              label: "Locality",
              latitude: null,
              longitude: null,
              area: "Area1",
              pincode: null,
              boundaryNum: 1,
              children: [],
            },
          ],
        },
      },

      //{
      //   inline:true,
      //   label: "Locality",
      //   isMandatory: true,
      //   //description: "Field supporting description",
      //   key: "BrSelectFather",
      //   type: "text",
      //   disable: false,
      //   populators: { name: "locality", error: "sample error message", validation: { pattern: /^[A-Za-z]+$/i } },
      // },
      {
        inline: true,
        label: "Street",
        isMandatory: false,
        //description: "Field supporting description",
        key: "BrSelectFather",
        type: "text",
        disable: false,
        populators: {
          name: "street",
          error: "sample error message",
          validation: { pattern: /^[A-Za-z]+$/i },
        },
      },
      {
        inline: true,
        label: "Door Number",
        isMandatory: true,
        //description: "Field supporting description",
        key: "BrSelectFather",
        type: "number",
        disable: false,
        populators: {
          name: "doorno",
          error: " error ",
          validation: { min: 0, max: 9999999999 },
        },
      },
      {
        inline: true,
        label: "Landmark",
        isMandatory: false,
        //description: "Field supporting description",
        key: "BrSelectFather",
        type: "text",
        disable: false,
        populators: {
          name: "landmark",
          error: "sample error message",
          validation: { pattern: /^[A-Za-z]+$/i },
        },
      },
    ],
  },
];

// const convertDateToEpoch = (dateString) => {
//   // Parse the date string in the format "dd/mm/yyyy"
//   const [day, month, year] = dateString.split("/");

//   // Create a Date object using the parsed components
//   const convertedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

//   // Check if the converted date is valid
//   if (isNaN(convertedDate.getTime())) {
//     console.error("Invalid date provided.");
//     return null;
//   }

//   // Convert the date to epoch time in seconds
//   const epochTimeInSeconds = Math.floor(convertedDate.getTime() / 1000);

//   return epochTimeInSeconds;
// };
export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};
const Create = () => {
  // const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { t } = useTranslation();
  // const history = useHistory();
  const [gender, setGender] = useState("");
  const reqCreate = {
    url: `/individual/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = useCustomAPIMutationHook(reqCreate);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const onSubmit = async (data) => {
    console.log(data, "data");
    const dateconverted = convertDateToEpoch(data?.dob);
    console.log(dateconverted);

    const onSuccess = (resp) => {
      if (resp) {
        console.log("successful", resp);
        setShowToast({ key: "success", action: "Creation Success" });
      }
    };
    const onError = (resp) => {
      if (resp && resp.ResponseInfo && resp.ResponseInfo.length > 0) {
        console.log("giving errors", resp);
        setShowToast({ key: "error", action: "Creation Failed" });
      }
    };

    await mutation.mutate(
      {
        url: `/individual/v1/_create`,
        params: { tenantId: "pg.citya" },
        body: {
          Individual: {
            tenantId: "pg.citya",
            name: {
              givenName: data.applicantname,
            },
            dateOfBirth: null,
            // gender: data.genders.code,
            mobileNumber: data.phno,
            address: [
              {
                tenantId: "pg.citya",
                pincode: data.pincode,
                city: data.city,
                street: data.street,
                doorNo: data.doorno,
                locality: {
                  code: data.locality.code,
                },
                landmark: data.landmark,
                type: "PERMANENT",
              },
            ],
            identifiers: null,
            skills: [
              {
                type: "DRIVING",
                level: "UNSKILLED",
              },
            ],
            photo: null,
            additionalFields: {
              fields: [
                {
                  key: "EMPLOYER",
                  value: "ULB",
                },
              ],
            },
            isSystemUser: null,
            userDetails: {
              username: "8821243212",
              tenantId: "pg.citya",
              roles: [
                {
                  code: "SANITATION_WORKER",
                  tenantId: "pg.citya",
                },
              ],
              type: "CITIZEN",
            },
          },
        },
        config: {
          enable: true,
        },
      },
      {
        onSuccess,
        onError,
      }
    );

    // const requestObj = {}
    // {
    //   requestObj.name = data.applicantname;
    //   requestObj.gender = data.gender;
    //   requestObj.phno =data.phno;
    //   requestObj.pincode = data.pincode;
    //   requestObj.city =data.city;
    //   requestObj.locality =data.locality;
    //   requestObj.street = data.street;
    //   requestObj.doorno =data.roomno;
    //   requestObj.landmark = data.landmark;

    // }
    //console.log(requestObj, "data in form");
    //};

    /* use newConfig instead of commonFields for local development in case needed */

    const configs = newConfig;
  };

  return (
    <div>
      <FormComposer
        label={"Submit"}
        // description={"Description"}
        // text={"Sample Text if required"}
        config={newConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={{}}
        onSubmit={onSubmit}
        fieldStyle={{ marginRight: 0 }}
      />
    </div>
  );
};

export default Create;
