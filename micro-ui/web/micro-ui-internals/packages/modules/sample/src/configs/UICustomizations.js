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
  SearchEstimateConfig: {
    preProcess: (data, additionalDetails) => {
      //   debugger;
      console.log("preProcessing Data", data);
      //   console.log(data);
      const filters = {};

      //   debugger;

      if (data.body.MdmsCriteria && data.body.MdmsCriteria.customs != null && data.body.MdmsCriteria.customs.options != null) {
        const key = data.body.MdmsCriteria.customs.options.name;
        // console.log(key);
        if (data.body.MdmsCriteria.customs.options.type == "number") {
          filters[key] = parseInt(data.body.MdmsCriteria.customs.value);
        } else filters[key] = data.body.MdmsCriteria.customs.value;

        data.body.MdmsCriteria.filters = filters;
        // debugger;
        delete data.body.MdmsCriteria.customs;
        console.log(data);
      }
      return data;
    },
    additionalCustomizations: (row, key) => {
      //   debugger;
      if (key === "id") {
        return <div> IDDD</div>;
      }
    },
  },
};
