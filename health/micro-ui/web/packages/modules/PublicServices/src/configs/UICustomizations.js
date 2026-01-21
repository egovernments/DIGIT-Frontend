import { Link, useHistory } from "react-router-dom";
import _ from "lodash";
import { useParams } from "react-router-dom";
import React from "react";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};

const businessServiceMap = {};

const inboxModuleNameMap = {};

export const UICustomizations = {
    searchGenericConfig: {
        customValidationCheck: (data) => {
          //checking both to and from date are present
          const { createdFrom, createdTo, field, value } = data;
          if (
            (createdFrom === "" && createdTo !== "") ||
            (createdFrom !== "" && createdTo === "")
          )
            return { type: "warning", label: "ES_COMMON_ENTER_DATE_RANGE" };
    
          if ((field && !value) || (!field && value)) {
            return {
              type: "warning",
              label: "WBH_MDMS_SEARCH_VALIDATION_FIELD_VALUE_PAIR",
            };
          }
    
          return false;
        },
        preProcess: (data, additionalDetails) => {
          const tenantId = Digit.ULBService.getCurrentTenantId();
          data.body.SearchCriteria.tenantId = tenantId;
        //   const filters = {};
          const custom = data.body.SearchCriteria.custom;
          data.headers = {"X-Tenant-Id":tenantId, "auth-token" : window?.localStorage?.getItem("Employee.token"),}
          data.params = {tenantId : tenantId};
          data.method = "GET"
          data.config = {
            enabled : false,
          }
          if(data?.state?.searchForm?.applicationNumber) data.params.applicationNumber = data?.state?.searchForm?.applicationNumber;
          if(custom?.status) data.params.status = custom?.status;
          if(custom?.todate) data.params.todate = Digit.Utils.date.convertDateToEpoch(custom?.todate);
          if(custom?.fromdate) data.params.fromdate = Digit.Utils.date.convertDateToEpoch(custom?.fromdate);
          if(data?.state?.searchForm?.businessService) data.url = `${data.url}/${data?.state?.searchForm?.businessService?.serviceCode}`

          // Add limit and offset from tableForm state for pagination
          if (data?.state?.tableForm?.limit) {
            data.params.limit = data.state.tableForm.limit;
          }
          if (data?.state?.tableForm?.offset !== undefined) {
            data.params.offset = data.state.tableForm.offset;
          }

          if(data?.state?.searchForm?.businessService) data.config = { enabled : true}

          // Add changeQueryName to force React Query to refetch when search parameters change
          const serviceCode = data?.state?.searchForm?.businessService?.serviceCode || '';
          const appNum = data?.state?.searchForm?.applicationNumber || '';
          const limit = data?.state?.tableForm?.limit || 10;
          const offset = data?.state?.tableForm?.offset || 0;
          data.changeQueryName = `SEARCH_${serviceCode}_${appNum}_${limit}_${offset}`;

          delete data.body.SearchCriteria.custom;
          return data;
        },
        additionalCustomizations: (row, key, column, value, t, searchResult) => {        
          switch (key) {
            case `${row?.module.toUpperCase()}_APPLICATION_NUMBER`:
              return (
                <span className="link" style={{whiteSpace:"normal"}}>
            <Link to={window.location.href.includes("module=") && window.location.href.includes("service=") ? `/${window.contextPath}/employee/publicservices/${row?.module}/${row?.businessService}/ViewScreen?applicationNumber=${row?.applicationNumber}&serviceCode=${row?.serviceCode}&selectedModule=true&from=search` : `/${window.contextPath}/employee/publicservices/${row?.module}/${row?.businessService}/ViewScreen?applicationNumber=${row?.applicationNumber}&serviceCode=${row?.serviceCode}&from=search`}>
            {String(value ? value : t("ES_COMMON_NA"))}
            </Link>
          </span>
              );
            default:
              return t("ES_COMMON_NA");
          }
        },
        MobileDetailsOnClick: (row, tenantId) => {
          let link;
          Object.keys(row).map((key) => {
            if (key === "MASTERS_WAGESEEKER_ID")
              link = `/${window.contextPath}/employee/masters/view-wageseeker?tenantId=${tenantId}&wageseekerId=${row[key]}`;
          });
          return link;
        },
        additionalValidations: (type, data, keys) => {
          if (type === "date") {
            return data[keys.start] && data[keys.end]
              ? () =>
                  new Date(data[keys.start]).getTime() <=
                  new Date(data[keys.end]).getTime()
              : true;
          }
        },
        selectionHandler: (event) => {
        }, // selectionHandler : Is used to handle row selections. gets on object which containes 3 key value pairs:  allSelected(whether all rows are selected or not), selectedCount (no, of rows selected),selectedRows( an array of selected rows)
        actionSelectHandler: (index, label, selectedRows) => {
        }, // actionSelectHandler : Is used to handle onClick functions of table action button on row selections, gets index,label and selectedRows as props
        footerActionHandler: (index, event) => {
        }, // footerActionHandler : Is used to handle onclick functions of footer action buttons, gets index and event as props
        linkColumnHandler: (row) => {
          const url = `/${window.contextPath}/employee/microplan/view-main?tenantId=${row?.tenantId}&uniqueIdentifier=${row?.uniqueIdentifier}`;
          const history = useHistory();
          history.push(url);
          //window.location.href = url;
        }, 
      },

      InboxGenericConfig:{
        preProcess: (data, additionalDetails) => {
          const tenantId = Digit.ULBService.getCurrentTenantId();    
          // Don't process if business service is not selected
          if (!data?.state?.searchForm?.businessService?.code) {
            return { ...data, config: { ...data.config, enabled: false } };
          }
        
          const module = additionalDetails?.module || window.location.pathname.split("/")[3];
        
          const businessService = data?.state?.searchForm?.businessService?.code;
          const workflowBusinessService = data?.state?.searchForm?.businessService?.workflowBusinessService;
          const parallelWorkflow = data?.state?.searchForm?.businessService?.parallelWorkflow || [];
        
          // Process assignee BEFORE creating formattedInbox
          const assignee = _.clone(data?.body?.inbox?.moduleSearchCriteria?.assignee);
          let processedAssignee = null;
          if (assignee?.code?.includes("ASSIGNED_TO_ME")) {
            processedAssignee = Digit.UserService.getUser().info.uuid;
          }
          // For "ASSIGNED_TO_ALL" or any other value, don't include assignee

          // Process states BEFORE creating formattedInbox
          let states = _.clone(data?.body?.inbox?.moduleSearchCriteria?.state ? data.body.inbox.moduleSearchCriteria.state : []);
          states = Object.keys(states)?.filter((key) => states[key]);

          let formattedInbox = {
            limit: data?.state?.tableForm?.limit || 10,
            offset: data?.state?.tableForm?.offset || 0,
            tenantId,

            processSearchCriteria: {
              businessService: [workflowBusinessService, ...parallelWorkflow],
              moduleName: "public-services",
              tenantId,
            },

            moduleSearchCriteria: {
              businessService,
              module,
              sortOrder: "ASC",
            },
          };

          // Add applicationNumber if present
          if(data?.state?.searchForm?.applicationNumber) {
            formattedInbox.moduleSearchCriteria.applicationNumber = data?.state?.searchForm?.applicationNumber;
          }

          // Add processed assignee if it's "ASSIGNED_TO_ME"
          if (processedAssignee) {
            formattedInbox.moduleSearchCriteria.assignee = processedAssignee;
          }

          // Add processed states if present
          if (states.length > 0) {
            formattedInbox.moduleSearchCriteria.status = states;
          }

          data.body.inbox = formattedInbox;
          data.method = "POST";

          // Include assignee and status in changeQueryName to ensure React Query refetches when filters change
          const assigneeParam = data.body.inbox.moduleSearchCriteria.assignee ? `_${data.body.inbox.moduleSearchCriteria.assignee}` : '';
          const statusParam = data.body.inbox.moduleSearchCriteria.status ? `_${data.body.inbox.moduleSearchCriteria.status.join('_')}` : '';
          data.changeQueryName = `INBOX_${workflowBusinessService}_${formattedInbox.limit}_${formattedInbox.offset}${assigneeParam}${statusParam}`;
          return data;
        },
        additionalCustomizations: (row, key, column, value, t, searchResult) => {
          if (key === "Application Number") {
            return (
              <span className="link" style={{whiteSpace:"normal"}}>
                <Link
                  to={window.location.href.includes("module=") && window.location.href.includes("service=") ? `/${window.contextPath}/employee/publicservices/${row?.businessObject?.module}/${row?.businessObject?.businessService}/ViewScreen?applicationNumber=${row?.businessObject?.applicationNumber}&serviceCode=${row?.businessObject?.serviceCode}&businessService=${row?.ProcessInstance?.businessService}&selectedModule=true&from=inbox` : `/${window.contextPath}/employee/publicservices/${row?.businessObject?.module}/${row?.businessObject?.businessService}/ViewScreen?applicationNumber=${row?.businessObject?.applicationNumber}&serviceCode=${row?.businessObject?.serviceCode}&businessService=${row?.ProcessInstance?.businessService}&from=inbox`}
                >
                  {String(value ? value : t("ES_COMMON_NA"))}
                </Link>
              </span>
            );
          
          }
          if(key === "Status"){
            return t(`${row?.businessObject?.module.replaceAll(/[./-]/g, "_").toUpperCase()}_${row?.businessObject?.module.replaceAll(/[./-]/g, "_").toUpperCase()}_${row?.businessObject?.businessService?.replaceAll(/[./-]/g, "_")?.toUpperCase()}_STATE_${value}`)
          }
          if(key === "SLA"){
            return value > 0 ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span>;
          }
        },
        selectionHandler: (event) => {
        }, // selectionHandler : Is used to handle row selections. gets on object which containes 3 key value pairs:  allSelected(whether all rows are selected or not), selectedCount (no, of rows selected),selectedRows( an array of selected rows)
        actionSelectHandler: (index, label, selectedRows) => {
        }, // actionSelectHandler : Is used to handle onClick functions of table action button on row selections, gets index,label and selectedRows as props
        footerActionHandler: (index, event) => {
        },// footerActionHandler : Is used to handle onclick functions of footer action buttons, gets index and event as props
      },

      CitizenInboxConfig:{
        customValidationCheck: (data) => {
          //checking both to and from date are present
          const { createdFrom, createdTo, field, value } = data;
          if (
            (createdFrom === "" && createdTo !== "") ||
            (createdFrom !== "" && createdTo === "")
          )
            return { type: "warning", label: "ES_COMMON_ENTER_DATE_RANGE" };
    
          if ((field && !value) || (!field && value)) {
            return {
              type: "warning",
              label: "WBH_MDMS_SEARCH_VALIDATION_FIELD_VALUE_PAIR",
            };
          }
    
          return false;
        },
        preProcess: (data, additionalDetails) => {
          const tenantId = Digit.ULBService.getCurrentTenantId();
          const userInfo = Digit.UserService.getUser();
          data.body.SearchCriteria.tenantId = tenantId;
        //   const filters = {};
          const custom = data.body.SearchCriteria.custom;
          data.headers = {"X-Tenant-Id":tenantId, "auth-token" : window?.localStorage?.getItem("token"),}
          data.params = {
            tenantId : tenantId, 
            limit: data?.body?.SearchCriteria?.limit, 
            offset: data?.body?.SearchCriteria?.offset,  
            tenantId: tenantId,
            createdBy: userInfo?.info?.uuid,
            mobileNumber: userInfo?.info?.mobileNumber
          };
          data.method = "GET"
          data.config = { enabled : false   }
          data.config = { enabled : true}
          delete data.body.SearchCriteria.custom;
          return data;
        },
        additionalCustomizations: (row, key, column, value, t, searchResult) => {
          if (key === "STUDIO_APPLICATION_NUMBER") {
            return (
              <span className="link">
                <Link
                  to={`/${window.contextPath}/citizen/publicservices/${row?.module}/${row?.businessService}/ViewScreen?applicationNumber=${row?.applicationNumber}&serviceCode=${row?.serviceCode}&businessService=${row?.workflow?.businessService}`}
                >
                  {String(value ? value : t("ES_COMMON_NA"))}
                </Link>
              </span>
            );
          
          }
          if(key === "STUDIO_STATUS"){
            return t(`${row?.module.replaceAll(/[./-]/g, "_").toUpperCase()}_${row?.module.replaceAll(/[./-]/g, "_").toUpperCase()}_${row?.businessService?.replaceAll(/[./-]/g, "_")?.toUpperCase()}_STATE_${value}`)
          }
          if(key === "STUDIO_DATE"){
            return Digit.DateUtils.ConvertEpochToDate(value)
          }
        },
        MobileDetailsOnClick: (row, tenantId) => {
          let link;
          Object.keys(row).map((key) => {
            if (key === "MASTERS_WAGESEEKER_ID")
              link = `/${window.contextPath}/employee/masters/view-wageseeker?tenantId=${tenantId}&wageseekerId=${row[key]}`;
          });
          return link;
        },
        additionalValidations: (type, data, keys) => {
          if (type === "date") {
            return data[keys.start] && data[keys.end]
              ? () =>
                  new Date(data[keys.start]).getTime() <=
                  new Date(data[keys.end]).getTime()
              : true;
          }
        },
        selectionHandler: (event) => {
        }, // selectionHandler : Is used to handle row selections. gets on object which containes 3 key value pairs:  allSelected(whether all rows are selected or not), selectedCount (no, of rows selected),selectedRows( an array of selected rows)
        actionSelectHandler: (index, label, selectedRows) => {
        }, // actionSelectHandler : Is used to handle onClick functions of table action button on row selections, gets index,label and selectedRows as props
        footerActionHandler: (index, event) => {
        }, // footerActionHandler : Is used to handle onclick functions of footer action buttons, gets index and event as props
        linkColumnHandler: (row) => {
          const url = `/${window.contextPath}/employee/microplan/view-main?tenantId=${row?.tenantId}&uniqueIdentifier=${row?.uniqueIdentifier}`;
          const history = useHistory();
          history.push(url);
          //window.location.href = url;
        }, 
      }
};