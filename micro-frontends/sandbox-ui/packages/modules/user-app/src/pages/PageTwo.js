import React from "react";
import { DigitUIComponents, States } from "components"; // Import only the necessary component
const { Sidebar } = DigitUIComponents;
const { Card } = DigitUIComponents;
const { useUserState } = States;
/**
 * PageOne Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 *
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const PageTwo = () => {
  const { setData, resetData, data } = useUserState();

//   configsidebar = {
//     "0Home": {
//         "item": {
//             "id": 1,
//             "name": "Home",
//             "url": "url",
//             "displayName": "Home",
//             "orderNumber": 1,
//             "queryParams": "",
//             "parentModule": "works",
//             "enabled": true,
//             "serviceCode": "works",
//             "tenantId": "pg",
//             "createdDate": {},
//             "createdBy": {},
//             "lastModifiedDate": {},
//             "lastModifiedBy": {},
//             "path": "0Home",
//             "navigationURL": "/works-ui/employee/",
//             "leftIcon": "dynamic:MuktaHomeIcon",
//             "rightIcon": ""
//         }
//     },
//     "1PROJECT": {
//         "Create": {
//             "item": {
//                 "id": 15,
//                 "name": "PROJECT",
//                 "url": "url",
//                 "displayName": "Create Project",
//                 "orderNumber": 2,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "PROJECT",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "1PROJECT.Create",
//                 "navigationURL": "/works-ui/employee/project/create-project",
//                 "leftIcon": "dynamic:ProjectIcon",
//                 "rightIcon": ""
//             }
//         },
//         "search": {
//             "item": {
//                 "id": 18,
//                 "name": "PROJECT",
//                 "url": "url",
//                 "displayName": "PROJECT Search",
//                 "orderNumber": 1,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "PROJECT",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "1PROJECT.search",
//                 "navigationURL": "/works-ui/employee/project/search-project",
//                 "leftIcon": "dynamic:ProjectIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "2ESTIMATE": {
//         "CreateEstimate": {
//             "item": {
//                 "id": 14,
//                 "name": "ESTIMATE",
//                 "url": "url",
//                 "displayName": "Create Estimate",
//                 "orderNumber": 2,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "WORKS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "2ESTIMATE.CreateEstimate",
//                 "navigationURL": "/works-ui/employee/project/search-project",
//                 "leftIcon": "dynamic:EstimateIcon",
//                 "rightIcon": ""
//             }
//         },
//         "SearchEstimate": {
//             "item": {
//                 "id": 16,
//                 "name": "ESTIMATE",
//                 "url": "url",
//                 "displayName": "Search Estimate",
//                 "orderNumber": 1,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "ESTIMATE",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "2ESTIMATE.SearchEstimate",
//                 "navigationURL": "/works-ui/employee/estimate/search-estimate",
//                 "leftIcon": "dynamic:EstimateIcon",
//                 "rightIcon": ""
//             }
//         },
//         "EstimateInbox": {
//             "item": {
//                 "id": 17,
//                 "name": "ESTIMATE",
//                 "url": "url",
//                 "displayName": "Estimate Inbox",
//                 "orderNumber": 3,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "ESTIMATE",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "2ESTIMATE.EstimateInbox",
//                 "navigationURL": "/works-ui/employee/estimate/inbox",
//                 "leftIcon": "dynamic:EstimateIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "3CONTRACTS": {
//         "Inbox": {
//             "item": {
//                 "id": 58,
//                 "name": "CONTRACTS",
//                 "url": "url",
//                 "displayName": "Contracts Inbox",
//                 "orderNumber": 3,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "CONTRACTS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "3CONTRACTS.Inbox",
//                 "navigationURL": "/works-ui/employee/contracts/inbox",
//                 "leftIcon": "dynamic:ContractIcon",
//                 "rightIcon": ""
//             }
//         },
//         "Create": {
//             "item": {
//                 "id": 60,
//                 "name": "CONTRACTS",
//                 "url": "url",
//                 "displayName": "Contracts Create",
//                 "orderNumber": 2,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "CONTRACTS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "3CONTRACTS.Create",
//                 "navigationURL": "/works-ui/employee/estimate/search-estimate?status=APPROVED",
//                 "leftIcon": "dynamic:ContractIcon",
//                 "rightIcon": ""
//             }
//         },
//         "Search": {
//             "item": {
//                 "id": 61,
//                 "name": "CONTRACTS",
//                 "url": "url",
//                 "displayName": "Contracts Search",
//                 "orderNumber": 1,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "CONTRACTS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "3CONTRACTS.Search",
//                 "navigationURL": "/works-ui/employee/contracts/search-contract",
//                 "leftIcon": "dynamic:ContractIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "4ATTENDENCEMGMT": {
//         "Inbox": {
//             "item": {
//                 "id": 59,
//                 "name": "ATTENDENCEMGMT",
//                 "url": "url",
//                 "displayName": "ATTENDENCEMGMT Inbox",
//                 "orderNumber": 3,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "ATTENDENCEMGMT",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "4ATTENDENCEMGMT.Inbox",
//                 "navigationURL": "/works-ui/employee/attendencemgmt/inbox",
//                 "leftIcon": "dynamic:AttendanceIcon",
//                 "rightIcon": ""
//             }
//         },
//         "Search": {
//             "item": {
//                 "id": 90,
//                 "name": "ATTENDENCEMGMT",
//                 "url": "url",
//                 "displayName": "ATTENDENCEMGMT Search",
//                 "orderNumber": 1,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "ATTENDENCEMGMT",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "4ATTENDENCEMGMT.Search",
//                 "navigationURL": "/works-ui/employee/attendencemgmt/search-attendance",
//                 "leftIcon": "dynamic:AttendanceIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "5BILLS": {
//         "BillInbox": {
//             "item": {
//                 "id": 54,
//                 "name": "BILLS",
//                 "url": "url",
//                 "displayName": "Bill Inbox",
//                 "orderNumber": 3,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "BILLS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "5BILLS.BillInbox",
//                 "navigationURL": "/works-ui/employee/expenditure/billinbox",
//                 "leftIcon": "dynamic:ExpenditureIcon",
//                 "rightIcon": ""
//             }
//         },
//         "CreratePurchaseBill": {
//             "item": {
//                 "id": 55,
//                 "name": "BILLS",
//                 "url": "url",
//                 "displayName": "Create Purchase Bill",
//                 "orderNumber": 3,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "BILLS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "5BILLS.CreratePurchaseBill",
//                 "navigationURL": "/works-ui/employee/contracts/search-contract?status=ACCEPTED",
//                 "leftIcon": "dynamic:ExpenditureIcon",
//                 "rightIcon": ""
//             }
//         },
//         "BillView": {
//             "item": {
//                 "id": 57,
//                 "name": "BILLS",
//                 "url": "url",
//                 "displayName": "Bill View",
//                 "orderNumber": 4,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "BILLS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "5BILLS.BillView",
//                 "navigationURL": "/works-ui/employee/expenditure/view-bills/menu",
//                 "leftIcon": "dynamic:ExpenditureIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "7MASTERS": {
//         "Search": {
//             "item": {
//                 "id": 62,
//                 "name": "MASTERS",
//                 "url": "url",
//                 "displayName": "Masters Search Organisation",
//                 "orderNumber": 1,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "MASTERS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "7MASTERS.Search",
//                 "navigationURL": "/works-ui/employee/masters/search-organization",
//                 "leftIcon": "dynamic:OrganisationIcon",
//                 "rightIcon": ""
//             }
//         },
//         "CreateOrganisation": {
//             "item": {
//                 "id": 64,
//                 "name": "MASTERS",
//                 "url": "url",
//                 "displayName": "Masters Create Organisation",
//                 "orderNumber": 2,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "MASTERS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "7MASTERS.CreateOrganisation",
//                 "navigationURL": "/works-ui/employee/masters/create-organization",
//                 "leftIcon": "dynamic:OrganisationIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "8WageSeeker": {
//         "CreateWageSeeker": {
//             "item": {
//                 "id": 63,
//                 "name": "WAGESEEKER",
//                 "url": "url",
//                 "displayName": "Masters Create WageSeeker",
//                 "orderNumber": 2,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "WageSeeker",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "8WageSeeker.CreateWageSeeker",
//                 "navigationURL": "/works-ui/employee/masters/create-wageseeker",
//                 "leftIcon": "dynamic:WageseekerIcon",
//                 "rightIcon": ""
//             }
//         },
//         "Search": {
//             "item": {
//                 "id": 78,
//                 "name": "WAGESEEKER",
//                 "url": "url",
//                 "displayName": "Masters Search Wageseeker",
//                 "orderNumber": 1,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "WageSeeker",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "8WageSeeker.Search",
//                 "navigationURL": "/works-ui/employee/masters/search-wageseeker",
//                 "leftIcon": "dynamic:WageseekerIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "9HRMS": {
//         "Search": {
//             "item": {
//                 "id": 5,
//                 "name": "HRMS",
//                 "url": "url",
//                 "displayName": "Search Employee",
//                 "orderNumber": 1,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "HRMS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "9HRMS.Search",
//                 "navigationURL": "/works-ui/employee/hrms/inbox",
//                 "leftIcon": "dynamic:HRIcon",
//                 "rightIcon": ""
//             }
//         },
//         "Create": {
//             "item": {
//                 "id": 13,
//                 "name": "HRMS",
//                 "url": "url",
//                 "displayName": "Create Employee",
//                 "orderNumber": 2,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "HRMS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "9HRMS.Create",
//                 "navigationURL": "/works-ui/employee/hrms/create",
//                 "leftIcon": "dynamic:HRIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "BILLS": {
//         "BillSearch": {
//             "item": {
//                 "id": 56,
//                 "name": "BILLS",
//                 "url": "url",
//                 "displayName": "Bill Search",
//                 "orderNumber": 1,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "BILLS",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "BILLS.BillSearch",
//                 "navigationURL": "/works-ui/employee/expenditure/search-bill",
//                 "leftIcon": "dynamic:ExpenditureIcon",
//                 "rightIcon": ""
//             }
//         }
//     },
//     "CHECKLIST": {
//         "Inbox": {
//             "item": {
//                 "id": 62,
//                 "name": "CHECKLIST",
//                 "url": "url",
//                 "displayName": "CHECKLIST Inbox",
//                 "orderNumber": 3,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "CHECKLIST",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "CHECKLIST.Inbox",
//                 "navigationURL": "/works-ui/employee/works/checklistinbox",
//                 "leftIcon": "dynamic:HRIcon",
//                 "rightIcon": ""
//             }
//         },
//         "Create": {
//             "item": {
//                 "id": 63,
//                 "name": "CHECKLIST",
//                 "url": "url",
//                 "displayName": "CHECKLIST Create",
//                 "orderNumber": 2,
//                 "queryParams": "",
//                 "parentModule": "",
//                 "enabled": true,
//                 "serviceCode": "CHECKLIST",
//                 "tenantId": "pg",
//                 "createdDate": {},
//                 "createdBy": {},
//                 "lastModifiedDate": {},
//                 "lastModifiedBy": {},
//                 "path": "CHECKLIST.Create",
//                 "navigationURL": "/works-ui/employee/works/checklist",
//                 "leftIcon": "dynamic:HRIcon",
//                 "rightIcon": ""
//             }
//         }
//     }
// }

  // const transformConfig = (config) => {
  //   const result = [];
  
  //   const processItem = (key, value) => {
  //     const item = value.item;
  
  //     // Define the object structure
  //     const obj = {
  //       label: item ? item.displayName : key,
  //       icon: item ? item.leftIcon : "", // Assuming icon is in leftIcon field
  //       link: item ? item.navigationURL : "",
  //       children: []
  //     };
  
  //     // Recursively process children if they exist
  //     for (const childKey in value) {
  //       if (childKey !== 'item' && typeof value[childKey] === 'object') {
  //         obj.children.push(processItem(childKey, value[childKey]));
  //       }
  //     }
  
  //     return obj;
  //   };
  
  //   for (const key in config) {
  //     result.push(processItem(key, config[key]));
  //   }
  
  //   return result;
  // };
  // const transformedSidebarItems = transformConfig(configsidebar);
  // console.log(transformedSidebarItems);
  //console.log(JSON.stringify(transformedSidebarItems, null, 2));

  return (
    <Card type="primary">
      {" "}
      <h1>Hi {data?.name}</h1>
    </Card>
  );
};

export default PageTwo;
