/**
 * Localization keys and default English values for User Activity Tracking screens.
 * These keys should be added to the localization service / MDMS for multi-language support.
 */

const localizationKeys = {
  // ─── Main Screen: Page Header ───
  USER_ACTIVITY_TRACKING: "User Activity Tracking",

  // ─── Main Screen: Summary Cards ───
  TOTAL_FIELD_WORKERS: "Total Field Workers",
  ONLINE_NOW: "Online Now",
  RECORDS_TODAY: "Records Today",
  SYNC_WARNINGS: "Sync Warnings",
  ACTIVE_CAMPAIGN: "Active campaign",
  OFFLINE: "Offline",
  ACROSS_ALL_CDDS: "Across all CDDs",
  SYNC_GAP_DETECTED: "Sync gap detected",

  // ─── Main Screen: Device Management Section ───
  DEVICE_MANAGEMENT: "Device Management",
  DEVICE_MANAGEMENT_DESC: "All devices registered to this campaign — click View Profile to see activity log",
  EXPORT_CSV: "Export CSV",

  // ─── Main Screen: Table Column Headers ───
  USER_ACTIVITY_USER: "User",
  USER_ACTIVITY_ROLE: "Role",
  USER_ACTIVITY_GEO_BOUNDARY: "Geo Boundary",
  USER_ACTIVITY_LAST_SYNC: "Last Sync",
  USER_ACTIVITY_RECORDS_TODAY: "Records Today",
  USER_ACTIVITY_STATUS: "Status",

  // ─── Main Screen: Filter Options ───
  HCM_ALL_STATUS: "All Status",
  HCM_ONLINE: "Online",
  HCM_OFFLINE: "Offline",
  HCM_ALL_ROLES: "All Roles",
  HCM_ALL_BOUNDARIES: "All Boundaries",

  // ─── Main Screen: Role Labels ───
  HCM_ROLE_DISTRIBUTOR: "Distributor",
  HCM_ROLE_SUPERVISOR: "Supervisor",
  HCM_ROLE_CDD: "CDD",
  HCM_ROLE_WAREHOUSE_MANAGER: "Warehouse Manager",
  HCM_ROLE_HEALTH_FACILITY_WORKER: "Health Facility Worker",
  HCM_ROLE_DISTRICT_SUPERVISOR: "District Supervisor",
  HCM_ROLE_COMMUNITY_DISTRIBUTOR: "Community Distributor",
  HCM_ROLE_TEAM_SUPERVISOR: "Team Supervisor",
  HCM_ROLE_UNKNOWN: "Unknown",

  // ─── Main Screen: Search & Table ───
  SEARCH_PLACEHOLDER: "Search name, user ID, device...",
  NO_DATA: "No data available",
  CS_COMMON_ROWS_PER_PAGE: "Rows Per Page",

  // ─── Main Screen: View Profile Button ───
  VIEW_PROFILE: "View Profile",

  // ─── Popup: Summary Cards ───
  LAST_SYNC: "Last Sync",
  TOTAL_SYNCS: "Total Syncs",
  FAILED_ACTIONS: "Failed Actions",
  RECORDS_TODAY_DESC: "Records submitted today",
  WITHIN_THRESHOLD: "Within threshold",
  SYNC_GAP: "Sync gap detected",
  TODAY: "Today",
  NEEDS_REVIEW: "Needs review",
  NONE: "None",

  // ─── Popup: Info Tags ───
  ROLE_LABEL: "Role",
  CAMPAIGN_LABEL: "Campaign",
  LAST_SYNC_LABEL: "Last Sync",
  GPS_LABEL: "GPS",
  NA: "N/A",

  // ─── Popup: Activity Log ───
  ACTIVITY_LOG: "Activity Log",
  ENTRIES: "entries",

  // ─── Popup: Activity Log Table Column Headers ───
  TIMESTAMP: "Timestamp",
  ACTION_TYPE: "Action Type",
  DETAIL: "Detail",
  OUTCOME: "Outcome",
  GPS: "GPS",

  // ─── Popup: Activity Log Filters ───
  ALL_ACTION_TYPES: "All Action Types",
  SYNC_COMPLETED: "Sync Completed",
  RECORD_SUBMITTED: "Record Submitted",
  STOCK_ACTION: "Stock Action",
  LOGIN: "Login",
  DELIVERY: "Delivery",
  ALL_OUTCOMES: "All Outcomes",
  SUCCESS: "Success",
  FAILED: "Failed",
  FILTER_TODAY: "Today",
  FILTER_LAST_7_DAYS: "Last 7 days",
  FILTER_LAST_30_DAYS: "Last 30 days",
  SEARCH_RECORD_ID: "Search record ID...",
};

export default localizationKeys;
