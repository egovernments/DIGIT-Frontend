import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { BackLink, Card, Divider } from "@egovernments/digit-ui-components";

const PTFAQ = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <BackLink label={t("CS_COMMON_BACK")} onClick={handleBackClick} style={{ marginBottom: "24px" }} />

      <Card>
        {/* PT Examples Description */}
        <div>
          <p style={{ fontSize: "16px", color: "#505A5F", lineHeight: "24px", margin: "0px" }}>
            {t("PT_EXAMPLES_DESCRIPTION")}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <a href="#" target="_blank" style={{ color: "#C84C0E", textDecoration: "none" }}>
              {t("PT_HERE_LABEL")}
            </a>
            <span>{t("PT_CORPORATION_LABEL")}</span>
            <a href="#" target="_blank" style={{ color: "#C84C0E", textDecoration: "none" }}>
              {t("PT_HERE_LABEL")}
            </a>
            <span>{t("PT_COUNCIL_LABEL")}</span>
          </div>
        </div>
        <Divider
          className=""
          style={{}}
          variant="small"
        />
        {/* Example 1: Residential Property */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#363636", marginBottom: "16px", marginTop: "0px" }}>
            {t("CS_EXAMPLES_DESCRIPTION")}
          </h2>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0B4B66" }}>
            {t("CS_EXAMPLE_AREA")}
          </h3>

          <Card type="secondary">
            <div style={{ display: "flex" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 500, color: "#363636" }}>
                {t("CS_EXAMPLES_SIZE")}
              </div>
              <div style={{ flex: "1", color: "#505A5F" }}>
                {t("CS_EXAMPLES_SIZE_VALUE")}
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 500, color: "#0B0C0C" }}>
                {t("CS_EXAMPLES_FLOOR")}
              </div>
              <div style={{ flex: "1", color: "#505A5F" }}>
                {t("CS_EXAMPLES_FLOOR_VALUE")}
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 500, color: "#0B0C0C" }}>
                {t("CS_EXAMPLES_LAND")}
              </div>
              <div style={{ flex: "1", color: "#505A5F" }}>
                {t("CS_EXAMPLES_LAND_VALUE")}
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 500, color: "#0B0C0C" }}>
                {t("CS_EXAMPLES_1ST_FLOOR")}
              </div>
              <div style={{ flex: "1", color: "#505A5F" }}>
                {t("CS_EXAMPLES_1ST_FLOOR_VALUE")}
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 500, color: "#0B0C0C" }}>
                {t("CS_EXAMPLES_PROPERTY_TAX")}
              </div>
              <div style={{ flex: "1", color: "#505A5F" }}>
                <div>{t("CS_EXAMPLES_PROPERTY_TAX_VALUE1")}</div>
                <div>{t("CS_EXAMPLES_PROPERTY_TAX_VALUE2")}</div>
                <div>{t("CS_EXAMPLES_PROPERTY_TAX_VALUE3")}</div>
              </div>
            </div>

            <div style={{ display: "flex", paddingTop: "12px", borderTop: "1px solid #D6D5D4" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 600, color: "#0B0C0C" }}>
                {t("CS_EXAMPLES_NET_PROPERTY_TEX")}
              </div>
              <div style={{ flex: "1", fontWeight: 600, color: "#0B4B66" }}>
                {t("CS_EXAMPLES_NET_PROPERTY_TEX_VALUE")}
              </div>
            </div>
          </Card>
        </div>
        <Divider
          className=""
          style={{}}
          variant="small"
        />
        {/* Example 2: Commercial/Flat */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0B4B66", marginTop: "0px" }}>
            {t("CS_EXAMPLES_FLAT")}
          </h3>

          <Card type="secondary">
            <div style={{ display: "flex" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 500, color: "#0B0C0C" }}>
                {t("CS_EXAMPLES_BUILTUP")}
              </div>
              <div style={{ flex: "1", color: "#505A5F" }}>
                {t("CS_EXAMPLES_BUILTUP_VALUE")}
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 500, color: "#0B0C0C" }}>
                {t("CS_EXAMPLES_CALCUL")}
              </div>
              <div style={{ flex: "1", color: "#505A5F" }}>
                {t("CS_EXAMPLES_CALCUL_VALUE")}
              </div>
            </div>

            <div style={{ display: "flex", paddingTop: "12px", borderTop: "1px solid #D6D5D4" }}>
              <div style={{ flex: "0 0 40%", fontWeight: 600, color: "#0B0C0C" }}>
                {t("CS_EXAMPLES_NET_PROPERTY_TEX1")}
              </div>
              <div style={{ flex: "1", fontWeight: 600, color: "#0B4B66" }}>
                {t("CS_EXAMPLES_NET_PROPERTY_TEX1_VALUE")}
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default PTFAQ;
