/**
 * Role-based configuration for the Manage Bills flow.
 *
 * Each role maps to:
 *   tabs[]           - ordered array of tab definitions
 *   tabStatusMap     - maps tab code → API bill status filter values
 *   selectableTabs[] - tab codes where row checkboxes appear
 *   tabColumns       - maps tab code → ordered array of column keys
 *   tabCTAs          - maps tab code → { label (i18n key), action } for ActionBar
 *   headerLabel      - i18n key for the page header
 *   billDetailViewMap - maps bill API status → detail view identifier
 *   statusDisplayMap  - maps bill API status → i18n label for status badge
 */

export const MANAGE_BILLS_ROLES = {
  PAYMENT_EDITOR: "PAYMENT_EDITOR",
  PAYMENT_REVIEWER: "PAYMENT_REVIEWER",
  PAYMENT_APPROVER: "PAYMENT_APPROVER",
  PAYMENT_APPROVER_BANK: "PAYMENT_APPROVER_BANK",
};

const MANAGE_BILLS_ROLE_CONFIG = {
  // ─── PAYMENT_EDITOR ──────────────────────────────────────────────
  [MANAGE_BILLS_ROLES.PAYMENT_EDITOR]: {
    headerLabel: "HCM_AM_MANAGE_BILLS",
    tabs: [
      { code: "NOT_VERIFIED", name: "HCM_AM_NOT_VERIFIED" },
      { code: "VERIFICATION_IN_PROGRESS", name: "HCM_AM_VERIFICATION_IN_PROGRESS" },
      { code: "PARTIALLY_VERIFIED", name: "HCM_AM_PARTIALLY_VERIFIED" },
      { code: "VERIFIED", name: "HCM_AM_VERIFIED" },
      { code: "SENT_FOR_REVIEW", name: "HCM_AM_SENT_FOR_REVIEW" },
    ],
    tabStatusMap: {
      NOT_VERIFIED: ["PENDING_VERIFICATION"],
      VERIFICATION_IN_PROGRESS: ["VERIFICATION_IN_PROGRESS"],
      PARTIALLY_VERIFIED: ["PARTIALLY_VERIFIED"],
      VERIFIED: ["FULLY_VERIFIED"],
      SENT_FOR_REVIEW: ["SENT_FOR_REVIEW"],
    },
    selectableTabs: ["NOT_VERIFIED", "PARTIALLY_VERIFIED", "VERIFIED"],
    tabColumns: {
      NOT_VERIFIED: ["billId", "billDate", "source", "registers", "payees", "totalAmount", "download"],
      VERIFICATION_IN_PROGRESS: ["billId", "billDate", "payees", "pending", "verificationFailed", "verified", "download"],
      PARTIALLY_VERIFIED: ["billId", "billDate", "payees", "failures", "download", "editBill"],
      VERIFIED: ["billId", "billDate", "totalAmount", "payees", "download"],
      SENT_FOR_REVIEW: ["billId", "billDate", "source", "registers", "payees", "totalAmount", "download"],
    },
    tabCTAs: {
      NOT_VERIFIED: { label: "HCM_AM_VERIFY_BILLS", action: "VERIFY" },
      PARTIALLY_VERIFIED: { label: "HCM_AM_VERIFY_BILLS", action: "VERIFY" },
      VERIFIED: { label: "HCM_AM_SEND_FOR_REVIEW", action: "SEND_FOR_REVIEW" },
    },
    billDetailViewMap: {
      PENDING_VERIFICATION: "EDITOR_NOT_VERIFIED_VIEW",
      VERIFICATION_IN_PROGRESS: "EDITOR_VERIFICATION_IN_PROGRESS_VIEW",
      PARTIALLY_VERIFIED: "EDITOR_PARTIALLY_VERIFIED_VIEW",
      FULLY_VERIFIED: "EDITOR_VERIFIED_VIEW",
      SENT_FOR_REVIEW: "EDITOR_SENT_FOR_REVIEW_VIEW",
    },
    statusDisplayMap: {
      PENDING_VERIFICATION: "HCM_AM_NOT_VERIFIED",
      VERIFICATION_IN_PROGRESS: "HCM_AM_VERIFICATION_IN_PROGRESS",
      PARTIALLY_VERIFIED: "HCM_AM_PARTIALLY_VERIFIED",
      FULLY_VERIFIED: "HCM_AM_VERIFIED",
      SENT_FOR_REVIEW: "HCM_AM_SENT_FOR_REVIEW",
    },
  },

  // ─── PAYMENT_REVIEWER ────────────────────────────────────────────
  [MANAGE_BILLS_ROLES.PAYMENT_REVIEWER]: {
    headerLabel: "HCM_AM_REVIEW_BILLS",
    tabs: [
      { code: "PENDING_BILLS", name: "HCM_AM_PENDING_BILLS" },
      { code: "SENT_FOR_APPROVAL", name: "HCM_AM_SENT_FOR_APPROVAL" },
    ],
    tabStatusMap: {
      PENDING_BILLS: ["SENT_FOR_REVIEW"],
      SENT_FOR_APPROVAL: ["SENT_FOR_APPROVAL"],
    },
    selectableTabs: ["PENDING_BILLS"],
    tabColumns: {
      PENDING_BILLS: ["billId", "billDate", "source", "registers", "payees", "totalAmount", "download", "editBill"],
      SENT_FOR_APPROVAL: ["billId", "billDate", "source", "registers", "payees", "totalAmount", "download"],
    },
    tabCTAs: {
      PENDING_BILLS: { label: "HCM_AM_SEND_FOR_APPROVAL", action: "SEND_FOR_APPROVAL" },
    },
    billDetailViewMap: {
      SENT_FOR_REVIEW: "REVIEWER_PENDING_VIEW",
      SENT_FOR_APPROVAL: "REVIEWER_SENT_FOR_APPROVAL_VIEW",
    },
    statusDisplayMap: {
      SENT_FOR_REVIEW: "HCM_AM_PENDING_PAYMENT_REVIEW",
      SENT_FOR_APPROVAL: "HCM_AM_PENDING_PAYMENT_APPROVAL",
    },
  },

  // ─── PAYMENT_APPROVER ────────────────────────────────────────────
  [MANAGE_BILLS_ROLES.PAYMENT_APPROVER]: {
    headerLabel: "HCM_AM_APPROVE_PAYMENTS",
    tabs: [
      { code: "PAYMENT_NOT_INITIATED", name: "HCM_AM_PAYMENT_NOT_INITIATED" },
      { code: "PAYMENT_IN_PROGRESS", name: "HCM_AM_PAYMENT_IN_PROGRESS" },
      { code: "PARTIALLY_PAID_FAILED", name: "HCM_AM_PARTIALLY_PAID_FAILED" },
      { code: "PAID", name: "HCM_AM_PAID" },
    ],
    tabStatusMap: {
      PAYMENT_NOT_INITIATED: ["SENT_FOR_APPROVAL"],
      PAYMENT_IN_PROGRESS: ["PAYMENT_IN_PROGRESS"],
      PARTIALLY_PAID_FAILED: ["PARTIALLY_PAID"],
      PAID: ["FULLY_PAID"],
    },
    selectableTabs: ["PAYMENT_NOT_INITIATED", "PARTIALLY_PAID_FAILED", "PAID"],
    tabColumns: {
      PAYMENT_NOT_INITIATED: ["billId", "billDate", "source", "payees", "totalAmount", "download"],
      PAYMENT_IN_PROGRESS: ["billId", "billDate", "source", "payees", "totalAmount", "amountPaid", "pendingPayment", "failedPayment", "paidCount", "download"],
      PARTIALLY_PAID_FAILED: ["billId", "billDate", "source", "payees", "failedPayment", "totalAmount", "amountPaid", "download"],
      PAID: ["billId", "billDate", "source", "payees", "totalAmount", "download"],
    },
    tabCTAs: {
      PAYMENT_NOT_INITIATED: { label: "HCM_AM_INITIATE_PAYMENT", action: "INITIATE_PAYMENT" },
      PARTIALLY_PAID_FAILED: { label: "HCM_AM_RETRY_PAYMENT", action: "RETRY_PAYMENT" },
      PAID: { label: "HCM_AM_DOWNLOAD_TXN_HISTORY", action: "DOWNLOAD_TXN_HISTORY" },
    },
    billDetailViewMap: {
      SENT_FOR_APPROVAL: "APPROVER_NOT_INITIATED_VIEW",
      PAYMENT_IN_PROGRESS: "APPROVER_IN_PROGRESS_VIEW",
      PARTIALLY_PAID: "APPROVER_PARTIALLY_PAID_VIEW",
      FULLY_PAID: "APPROVER_PAID_VIEW",
    },
    statusDisplayMap: {
      SENT_FOR_APPROVAL: "HCM_AM_PAYMENT_NOT_INITIATED",
      PAYMENT_IN_PROGRESS: "HCM_AM_PAYMENT_IN_PROGRESS",
      PARTIALLY_PAID: "HCM_AM_PARTIALLY_PAID_FAILED",
      FULLY_PAID: "HCM_AM_PAID",
    },
  },

  // ─── PAYMENT_APPROVER (BANK MODE) ─────────────────────────────────
  [MANAGE_BILLS_ROLES.PAYMENT_APPROVER_BANK]: {
    headerLabel: "HCM_AM_APPROVE_PAYMENTS",
    tabs: [
      { code: "PENDING_BILLS", name: "HCM_AM_PENDING_BILLS" },
      { code: "GENERATED_ADVISORIES", name: "HCM_AM_GENERATED_ADVISORIES" },
    ],
    tabStatusMap: {
      PENDING_BILLS: ["SENT_FOR_APPROVAL"],
      GENERATED_ADVISORIES: ["FULLY_PAID"],
    },
    selectableTabs: ["PENDING_BILLS"],
    tabColumns: {
      PENDING_BILLS: ["billId", "billDate", "source", "payees", "totalAmount", "download"],
      GENERATED_ADVISORIES: ["billId", "billDate", "source", "payees", "totalAmount", "download", "downloadAdvisory"],
    },
    tabCTAs: {
      PENDING_BILLS: { label: "HCM_AM_GENERATE_PAYMENT_ADVISORY", action: "GENERATE_ADVISORY" },
    },
    billDetailViewMap: {
      SENT_FOR_APPROVAL: "APPROVER_NOT_INITIATED_VIEW",
      FULLY_PAID: "APPROVER_PAID_VIEW",
    },
    statusDisplayMap: {
      SENT_FOR_APPROVAL: "HCM_AM_PENDING_BILLS",
      FULLY_PAID: "HCM_AM_ADVISORY_GENERATED",
    },
  },
};

export default MANAGE_BILLS_ROLE_CONFIG;
