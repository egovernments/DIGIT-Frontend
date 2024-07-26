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
  SearchEstimateConfig : {
    preProcess: (data) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      data.body.MdmsCriteria.tenantId = tenantId
     
      const filters = {}
      const custom = data.body.MdmsCriteria.customs

      const {field, value} = custom || {}
      if (field && field.name && value) {
        // console.log("f&v", field, value)
        filters[field.name] = value;
      }
      // console.log("filters", filters)
      // console.log("custom", custom)
      // console.log("data.body.MdmsCriteria", data.body.MdmsCriteria)

      data.body.MdmsCriteria.filters = filters
      delete data.body.MdmsCriteria.customs
      // console.log(data);
      return data;
    },
    // additionalCustomizations: (row, key, column, value, t, searchResult) => {
    //   console.log(row, key, column, value, );
    // }
  }
};