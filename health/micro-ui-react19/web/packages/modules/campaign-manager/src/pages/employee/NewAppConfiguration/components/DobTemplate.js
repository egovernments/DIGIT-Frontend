import React from "react";
import { FieldV1 } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../../../../utils/i18nKeyConstants";

/**
 * DobTemplate - preview for a date of birth field.
 *
 * The app collects a child's age either as a date or as years and months, so a single date
 * box did not show what the worker actually sees. This draws both halves with the "(or)"
 * between them, the way the app lays them out.
 *
 * The field's own label, help text and tooltip are drawn by the FieldV1 this sits inside,
 * so only the two inputs belong here.
 */
const DobTemplate = ({ field, props }) => {
  const { t } = useTranslation();
  const dobField = field || props?.field;
  const isDisabled = dobField?.readOnly || false;

  return (
    <div className="app-preview-dob">
      <div className="app-preview-dob-part">
        <label className="app-preview-dob-label">{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_DOB_DATE_OF_BIRTH)}</label>
        <FieldV1 type="date" withoutLabel={true} value="" onChange={function noRefCheck() {}} disabled={isDisabled} />
      </div>

      <div className="app-preview-dob-or">{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_DOB_OR)}</div>

      <div className="app-preview-dob-part">
        <label className="app-preview-dob-label">{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_DOB_AGE)}</label>
        <div className="app-preview-dob-age">
          <FieldV1
            type="number"
            withoutLabel={true}
            value=""
            onChange={function noRefCheck() {}}
            disabled={isDisabled}
            placeholder={t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_DOB_YEARS)}
          />
          <FieldV1
            type="number"
            withoutLabel={true}
            value=""
            onChange={function noRefCheck() {}}
            disabled={isDisabled}
            placeholder={t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_DOB_MONTHS)}
          />
        </div>
      </div>
    </div>
  );
};

export default DobTemplate;
