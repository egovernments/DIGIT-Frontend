//import BoundaryTypes from "../../enums/BoundaryTypes";

const healthHrms = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "health-hrms";
const mdmsPath = window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "mdms-v2";
const boundarySearchPath = window?.globalConfigs?.getConfig("BOUNDARY_CONTEXT") || "boundary-service/boundary-relationships/_search?";
const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "MICROPLAN";
const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_CONTEXT_PATH") || "health-project";

const Urls = {
  hrms: {
    search: `/${healthHrms}/employees/_search`,
    count: `/${healthHrms}/employees/_count`,
    create: `/${healthHrms}/employees/_create`,
    update: `/${healthHrms}/employees/_update`,
  },
  MDMS: `/${mdmsPath}/v1/_search`,
  WorkFlow: `/egov-workflow-v2/egov-wf/businessservice/_search`,
  WorkFlowProcessSearch: `/egov-workflow-v2/egov-wf/process/_search`,
  localization: `/localization/messages/v1/_search`,
  // [TO DO: Location Boundary -v2 need to be changed 
  // location: {
  //   localities: `/${boundarySearchPath}includeChildren=true&hierarchyType=${hierarchyType}&boundaryType=${BoundaryTypes.LOCALITY}`,
  //   withoutBoundaryType: `/${boundarySearchPath}includeChildren=true&hierarchyType=${hierarchyType}`,
  //   wards: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Ward`,
  //   revenue_localities: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality`,
  //   localityByCode: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN`
  // },

  pgr_search: `/pgr-services/v2/request/_search`,
  pgr_update: `/pgr-services/v2/request/_update`,
  filter_data: `https://run.mocky.io/v3/597a50a0-90e5-4a45-b82e-8a2186b760bd`,
  FileStore: "/filestore/v1/files",

  FileFetch: "/filestore/v1/files/url",
  PGR_Create: `/pgr-services/v2/request/_create`,
  pgr_count: `/pgr-services/v2/request/_count`,

  OTP_Send: "/user-otp/v1/_send",
  Authenticate: "/user/oauth/token",
  RegisterUser: "/user/citizen/_create",
  ChangePassword: "/user/password/nologin/_update",
  ChangePassword1: "/user/password/_update",
  UserProfileUpdate: "/user/profile/_update",
  EmployeeSearch: `/${healthHrms}/employees/_search`,

  InboxSearch: "/works-inbox-service/v2/_search",

  UserSearch: "/user/_search",
  UserLogout: "/user/_logout",

  Shortener: "/egov-url-shortening/shortener",

  

  fsm: {
    search: "/fsm/v1/_search",
    create: "/fsm/v1/_create",
    update: "/fsm/v1/_update",
    vendorSearch: "/vendor/v1/_search",
    vehicleSearch: "/vehicle/v1/_search",
    audit: "/fsm/v1/_audit",
    vehicleTripSearch: "/vehicle/trip/v1/_search",
    billingSlabSearch: "/fsm-calculator/v1/billingSlab/_search",
    vehilceUpdate: "/vehicle/trip/v1/_update",
    createVendor: "/vendor/v1/_create",
    updateVendor: "/vendor/v1/_update",
    createVehicle: "/vehicle/v1/_create",
    updateVehicle: "/vehicle/v1/_update",
    driverSearch: "/vendor/driver/v1/_search",
    createDriver: "/vendor/driver/v1/_create",
    updateDriver: "/vendor/driver/v1/_update",
    vehicleTripCreate: "/vehicle/trip/v1/_create",
  },

  payment: {
    fetch_bill: "/billing-service/bill/v2/_fetchbill",
    demandSearch: "/billing-service/demand/_search",
    create_reciept: "/collection-services/payments/_create",
    print_reciept: "/collection-services/payments",
    generate_pdf: "/pdf-service/v1/_create",
    create_citizen_reciept: "/pg-service/transaction/v1/_create",
    update_citizen_reciept: "/pg-service/transaction/v1/_update",
    search_bill: "/billing-service/bill/v2/_search",
    reciept_search: "/collection-services/payments/:buisnessService/_search",
    obps_Reciept_Search: "/collection-services/payments/_search",
    billAmendmentSearch: "/billing-service/amendment/_search",
    getBulkPdfRecordsDetails: "/pdf-service/v1/_getBulkPdfRecordsDetails",
  },

  pt: {
    fectch_property: "/property-services/property/_search",
    fetch_payment_details: "/billing-service/bill/v2/_fetchbill",
    create: "/property-services/property/_create",
    search: "/property-services/property/_search",
    update: "/property-services/property/_update",
    pt_calculation_estimate: "/pt-calculator-v2/propertytax/v2/_estimate",
    assessment_create: "/property-services/assessment/_create",
    assessment_search: "/property-services/assessment/_search",
    payment_search: "/collection-services/payments/PT/_search",
    pt_calculate_mutation: "/pt-calculator-v2/propertytax/mutation/_calculate",
  },

  dss: {
    dashboardConfig: "/dashboard-analytics/dashboard/getDashboardConfig",
    getCharts: "/dashboard-analytics/dashboard/getChartV2",
  },

  mcollect: {
    search: "/echallan-services/eChallan/v1/_search",
    create: "/echallan-services/eChallan/v1/_create?",
    fetch_bill: "/billing-service/bill/v2/_fetchbill?",
    search_bill: "/egov-searcher/bill-genie/mcollectbills/_get",
    search_bill_pt: "/egov-searcher/bill-genie/billswithaddranduser/_get",
    update: "/echallan-services/eChallan/v1/_update",
    download_pdf: "/egov-pdf/download/UC/mcollect-challan",
    receipt_download: "/egov-pdf/download/PAYMENT/consolidatedreceipt",
    bill_download: "/egov-pdf/download/BILL/consolidatedbill",
    count: "/echallan-services/eChallan/v1/_count",
  },
  hrms: {
    search: `/${healthHrms}/employees/_search`,
    count: `/${healthHrms}/employees/_count`,
    create: `/${healthHrms}/employees/_create`,
    update: `/${healthHrms}/employees/_update`,
  },
  tl: {
    create: "/tl-services/v1/_create",
    search: "/tl-services/v1/_search",
    fetch_payment_details: "/billing-service/bill/v2/_fetchbill",
    download_pdf: "/egov-pdf/download/TL/",
    update: "/tl-services/v1/_update",
    billingslab: "/tl-calculator/billingslab/_search",
  },
  receipts: {
    receipt_download: "/egov-pdf/download/PAYMENT/consolidatedreceipt",
    payments: "/collection-services/payments",
    count: `/${healthHrms}/employees/_count`,
  },
  obps: {
    scrutinyDetails: "/edcr/rest/dcr/scrutinydetails",
    comparisionReport: "/edcr/rest/dcr/occomparison",
    create: "/bpa-services/v1/bpa/_create",
    nocSearch: "/noc-services/v1/noc/_search",
    updateNOC: "/noc-services/v1/noc/_update",
    update: "/bpa-services/v1/bpa/_update",
    bpaSearch: "/bpa-services/v1/bpa/_search",
    bpaRegSearch: "/tl-services/v1/BPAREG/_search",
    bpaRegCreate: "/tl-services/v1/BPAREG/_create",
    bpaRegGetBill: "/tl-calculator/v1/BPAREG/_getbill",
    bpaRegUpdate: "/tl-services/v1/BPAREG/_update",
    receipt_download: "/egov-pdf/download/PAYMENT/consolidatedreceipt",
    edcrreportdownload: "/bpa-services/v1/bpa/_permitorderedcr",
    getSearchDetails: "/inbox/v1/dss/_search"
  },

  edcr: {
    create: "/edcr/rest/dcr/scrutinize",
  },

  events: {
    search: "/egov-user-event/v1/events/_search",
    update: "/egov-user-event/v1/events/lat/_update",
    updateEvent: "/egov-user-event/v1/events/_update",
    updateEventCDG: "/egov-user-event/v1/events/lat/_update",
    count: "/egov-user-event/v1/events/notifications/_count",
    create: "/egov-user-event/v1/events/_create",
  },

  ws: {
    water_create: "/ws-services/wc/_create",
    sewarage_create: "/sw-services/swc/_create",
    water_search: "/ws-services/wc/_search",
    sewarage_search: "/sw-services/swc/_search",
    water_update: "/ws-services/wc/_update",
    sewarage_update: "/sw-services/swc/_update",
    ws_calculation_estimate: "/ws-calculator/waterCalculator/_estimate",
    sw_calculation_estimate: "/sw-calculator/sewerageCalculator/_estimate",
    ws_connection_search: "/ws-calculator/meterConnection/_search",
    sw_payment_search: "/collection-services/payments/SW/_search",
    ws_payment_search: "/collection-services/payments/WS/_search",
    billAmendmentCreate: "/billing-service/amendment/_create",
    billAmendmentUpdate: "/billing-service/amendment/_update",
    ws_meter_conncetion_create: "/ws-calculator/meterConnection/_create",
    sw_meter_conncetion_create: "/sw-calculator/meterConnection/_create",
    wns_group_bill: "/egov-pdf/download/WNS/wnsgroupbill",
    cancel_group_bill: "/pdf-service/v1/_cancelProcess",
    wns_generate_pdf: "/egov-pdf/download/WNS/wnsbill",
    water_applyAdhocTax : "/ws-calculator/waterCalculator/_applyAdhocTax",
    sewerage_applyAdhocTax: "/sw-calculator/sewerageCalculator/_applyAdhocTax",
    getSearchDetails: "/inbox/v1/dss/_search",
  },

  engagement: {
    document: {
      search: "/egov-document-uploader/egov-du/document/_search",
      create: "/egov-document-uploader/egov-du/document/_create",
      delete: "/egov-document-uploader/egov-du/document/_delete",
      update: "/egov-document-uploader/egov-du/document/_update",
    },
    surveys: {
      create: "/egov-survey-services/egov-ss/survey/_create",
      update: "/egov-survey-services/egov-ss/survey/_update",
      search: "/egov-survey-services/egov-ss/survey/_search",
      delete: "/egov-survey-services/egov-ss/survey/_delete",
      submitResponse: "/egov-survey-services/egov-ss/survey/response/_submit",
      showResults: "/egov-survey-services/egov-ss/survey/response/_results",
    },
  },

  attendencemgmt: {
    mustorRoll: {
      estimate: "/muster-roll/v1/_estimate",
      create: "/muster-roll/v1/_create",
      update: "/muster-roll/v1/_update",
      search: "/muster-roll/v1/_search"
    }
  },

  noc: {
    nocSearch: "/noc-services/v1/noc/_search",
  },
  reports: {
    reportSearch: "/report/",
  },
  bills:{
    cancelBill:"/billing-service/bill/v2/_cancelbill"
  },
  access_control: "/access/v1/actions/mdms/_get",
  billgenie: "/egov-searcher",
  hcm: {
    searchStaff:`/${projectContextPath}/staff/v1/_search`,
    searchProject:`/${projectContextPath}/v1/_search`,
    createStaff:`/${projectContextPath}/staff/v1/bulk/_create`,
    deleteStaff: `/${projectContextPath}/staff/v1/bulk/_delete`
  }
};

export default Urls;
