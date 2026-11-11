import React from "react";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

// Demo-only component: one t(...) call per case digit-i18n handles differently,
// to show lint/scan/export (and the pre-commit hook) reacting to each live.
const DemoUnlocalizedCheck = ({ status }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Unprefixed, never synced: scan reports it, lint flags naming, export skips it (no module prefix) */}
      <p>{t("CONFIRM_BULK_DELETE_WARNING")}</p>
      <p>{t("BULK_UPLOAD_PARTIAL_FAILURE")}</p>

      {/* Follows DIGIT_{MODULE}_{KEY}, never synced: export drafts a message for each under hcm-campaignmanager */}
      <p>{t("DIGIT_CAMPAIGN_CONFIRM_BULK_DELETE_WARNING")}</p>
      <p>{t("DIGIT_CAMPAIGN_BULK_DELETE_SUCCESS")}</p>
      <p>{t("DIGIT_CAMPAIGN_BULK_DELETE_FAILED")}</p>
      <p>{t("DIGIT_CAMPAIGN_SELECT_CAMPAIGNS_TO_DELETE")}</p>

      {/* Unregistered module prefix: lint passes the format, but export can't map it to a backend module */}
      <p>{t("DIGIT_INVENTORY_STOCK_LOW_WARNING")}</p>

      {/* Generic word in a feature module: once hcm-common is synced, lint suggests reusing the common key */}
      <p>{t("DIGIT_CAMPAIGN_CANCEL")}</p>

      {/* Already exists in hcm-campaignmanager: not reported missing once synced, but lint still flags naming */}
      <p>{t("SAVE")}</p>

      {/* Resolved through the constants file, not a literal: scanner reads the assigned value */}
      <p>{t(I18N_KEYS.PAGES.ES_CAMPAIGN_ADD_PRODUCT_BUTTON)}</p>

      {/* Built at runtime: can't be checked statically, reported as a coverage gap */}
      <p>{t(`DIGIT_CAMPAIGN_STATUS_${status}`)}</p>
    </>
  );
};

export default DemoUnlocalizedCheck;
