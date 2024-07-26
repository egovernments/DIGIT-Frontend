import { Link, useHistory } from "react-router-dom";
import _ from "lodash";
import React from "react";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};

const businessServiceMap = {};

const inboxModuleNameMap = {};

export const UICustomizations = {
    SearchContractConfig: {
    preProcess: (data, additionalDetails) => {
    //     // Retrieve the field and value from the filters object
    //   const field = data.body?.MdmsCriteria?.filters?.Field?.opt;
    //   const value = data.body?.MdmsCriteria?.filters?.Value;

    // //   Ensure the MdmsCriteria and filters objects are defined
    //   if (!data.body) {
    //     data.body = {};
    //   }
    //   if (!data.body.MdmsCriteria) {
    //     data.body.MdmsCriteria = {};
    //   }
    //   if (!data.body.MdmsCriteria.filters) {
    //     data.body.MdmsCriteria.filters = {};
    //   }

    //   // Create a new filters object with the selected field and value
    //   const newFilters = {};
    //   if (field && value) {
    //     newFilters[field] = value;
    //   }
    //   console.log("newfilter", newFilters);

    //   // Assign the new filters object to MdmsCriteria
    //   data.body.MdmsCriteria.filters = newFilters;
    // //   delete data.requestBody.MdmsCriteria.

    //   console.log("preProcessing Data", data);
    //   return data;

        //  Log the entire data object to understand its structure
  console.log("Full Data Object:", data);

  // Safely access the `field` and `value` from the nested `filters`
  const field = data?.body?.MdmsCriteria?.filters?.Field?.opt;
  const value = data?.body?.MdmsCriteria?.filters?.Value;

  // Log the extracted `field` and `value`
  console.log("Extracted Field:", field);
  console.log("Extracted Value:", value);

  // Create the `newFilters` object if both `field` and `value` are defined
  const newFilters = {};
  if (field && value) {
    newFilters[field] = value;
  }

  // Log the `newFilters` object to verify its structure and values
  console.log("New Filters:", newFilters);

  // Create the processed data object with updated filters
  const processedData = {
    ...data,
    body: {
      ...data.body,
      MdmsCriteria: {
        ...data.body?.MdmsCriteria,
        filters: newFilters,
      },
    },
  };

  // Log the final processed data object
  console.log("Processed Data:", processedData);

  return processedData;
    },
    additionalCustomizations: (row, key) => {
      //   debugger;
    //   if (key === "id") {
    //     return <div> IDDD</div>;
    //   }
    },
  },
};