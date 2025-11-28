export const StatusEnum = Object.freeze({
  // PENDING_FOR_APPROVAL: "PENDINGFORAPPROVAL",
  PENDING_FOR_APPROVAL: "PENDING",
  APPROVED: "APPROVED",
});

export const ScreenTypeEnum = Object.freeze({
  BILL: "BILL",
  REGISTER: "REGISTER",
});

export const lowerBoundaryDefaultSet = "DISTRICT";

export const defaultRowsPerPage = 10;
export const defaultRowsPerPageForEditAttendee = 5;

export const defaultPaginationValues = [10, 20, 30, 40, 50];
export const defaultPaginationValuesForEditAttendee = [5, 10, 15, 20, 25];

// For type of Bill

export const billTypeOptions = [
  { name: "ES_INDIVIDUAL_BILL", code: "INTERMEDIATE" },
  { name: "ES_AGGREGATE_BILL", code: "FINAL_AGGREGATE" },
];
//FINAL_AGGREGATE,INTERMEDIATE
