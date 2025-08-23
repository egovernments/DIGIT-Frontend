// Test script to verify MDMS schema parsing
const mdmsService = require('./packages/libraries-new/src/services/mdms.js').default;

// Test schema parsing
const schemas = [
  'ACCESSCONTROL-ROLES.roles',
  'ACCESSCONTROL-ROLES.actions',
  'common-masters.Department',
  'common-masters.Designation',
  'tenant.tenants',
  'tenant.citymodule',
  'workflow.BusinessService',
  'workflow.ProcessInstances'
];

console.log('Testing MDMS Schema Parsing:');
console.log('============================\n');

console.log('Input schemas:', schemas);
console.log('\nParsed to MdmsCriteria.moduleDetails:');

const moduleDetails = mdmsService.parseSchemas(schemas);
console.log(JSON.stringify(moduleDetails, null, 2));

console.log('\n\nExpected format for MDMS API:');
console.log(JSON.stringify({
  MdmsCriteria: {
    tenantId: "od",
    moduleDetails: moduleDetails
  }
}, null, 2));