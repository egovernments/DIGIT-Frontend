import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, CardText, HeaderComponent } from "@egovernments/digit-ui-components";

/**
 * Multi-select list of delivery strategies for a campaign.
 *
 * The list, its labels and its descriptions all come from the campaign type's MDMS record - no
 * strategy code or copy is held here. Labels resolve through each entry's own `i18nKey` rather
 * than a key built from the code, so a strategy added in MDMS shows correctly without a release.
 */
const DeliveryMethodSelection = ({ methods = [], selected = [], onChange, disabled = false }) => {
  const { t } = useTranslation();

  const toggle = (code) => {
    if (disabled) return;
    const next = selected?.includes(code) ? selected.filter((c) => c !== code) : [...(selected || []), code];
    // Hand back in declared order, not click order, so the tabs on the next step stay stable.
    onChange(methods.map((m) => m?.code).filter((c) => next.includes(c)));
  };

  return (
    <React.Fragment>
      <HeaderComponent className="cycle-configuration-heading">{t("HCM_DELIVERY_SETUP_HEADING")}</HeaderComponent>
      <CardText style={{ fontSize: "16px", color: "#505a5f", marginBottom: "0rem" }}>{t("HCM_DELIVERY_SETUP_DESC")}</CardText>

      <div className="delivery-methods-card-group" role="group" aria-label={t("HCM_DELIVERY_SETUP_HEADING")}>
        {methods.map((method) => {
          const code = method?.code;
          const isChecked = selected?.includes(code);
          return (
            <div
              key={code}
              style={{
                border: `1px solid ${isChecked ? "#c84c0e" : "#d6d5d4"}`,
                background: isChecked ? "#CC55000D" : "#FAFAFAB2",
              }}
              className="delivery-method-card"
            >
              <CheckBox
                label={t(method?.i18nKey || code)}
                checked={!!isChecked}
                onChange={() => toggle(code)}
                disabled={disabled}
                index={code}
                mainClassName="checkboxOptionVariant deliverymethodselectioncheckbox"
                style={{ marginBottom: "0" }}
              />
              {method?.descriptionI18nKey && (
                <CardText className="delivery-methods-description">{t(method.descriptionI18nKey)}</CardText>
              )}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default DeliveryMethodSelection;
