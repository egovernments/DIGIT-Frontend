import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, Dropdown, TextInput, Button, Card, CardText, HeaderComponent } from "@egovernments/digit-ui-components";
import { DustbinIcon } from "./icons/DustbinIcon";
// import { productType } from "../configs/productType";
import { PRIMARY_COLOR } from "../utils";
import { CONSOLE_MDMS_MODULENAME } from "../Module";

const AddProductField = ({ onSelect }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading: productTypeLoading, data: productType } = Digit.Hooks.useCustomMDMS(tenantId, CONSOLE_MDMS_MODULENAME, [{ name: "productType" }], {
    select: (data) => {
      return data?.[CONSOLE_MDMS_MODULENAME]?.productType;
    },
  });
  const [productFieldData, setProductFieldData] = useState([{ key: 1, name: null, type: null, variant: null }]);

  useEffect(() => {
    onSelect("addProduct", productFieldData);
  }, [productFieldData]);

  const addMoreField = () => {
    setProductFieldData((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        name: null,
        type: null,
        variant: null,
      },
    ]);
  };

  const deleteProductField = (index) => {
    setProductFieldData((prev) => {
      const temp = prev.filter((i) => i.key !== index);
      return temp.map((i, n) => ({ ...i, key: n + 1 }));
    });
  };

  const handleUpdateField = (data, target, index) => {
    setProductFieldData((prev) => {
      return prev.map((i) => {
        if (i.key === index) {
          return {
            ...i,
            [target]: data,
          };
        }
        return {
          ...i,
        };
      });
    });
  };

  return (
    <React.Fragment>
      <HeaderComponent styles={{ marginBottom: "1rem" }}>{t(`HCM_CAMPAIGN_ADD_NEW_PRODUCT_HEADER`)}</HeaderComponent>
      <p className="name-description">
        {t(`HCM_CAMPAIGN_ADD_NEW_PRODUCT_DESCRIPTION_PRE_TEXT`)} <b> {t(`HCM_CAMPAIGN_ADD_NEW_PRODUCT_DESCRIPTION_BOLD_TEXT`)} </b>
        {t(`HCM_CAMPAIGN_ADD_NEW_PRODUCT_DESCRIPTION_POST_TEXT`)}
      </p>
      <div style={{ height: "1.5rem" }}></div>
      {productFieldData?.map((field, index) => {
        return (
          <Card className="add-new-product-container">
            <div className="heading-bar">
              <CardText>{t(`ES_ADD_PRODUCT_TITLE`)} {field?.key}</CardText>
              {productFieldData?.length > 1 && (
                <div
                  onClick={() => deleteProductField(field.key)}
                  style={{
                    cursor: "pointer",
                    fontWeight: "600",
                    marginLeft: "1rem",
                    fontSize: "1rem",
                    color: PRIMARY_COLOR,
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <DustbinIcon />
                  {t(`CAMPAIGN_DELETE_ROW_TEXT`)}
                </div>
              )}
            </div>
            <LabelFieldPair style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
              <div
                className="product-label-field"
                style={{
                  width: "19rem",
                  flexShrink: 0,
                  display: "flex",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                <span>{t("HCM_PRODUCT_NAME")}</span>
                <span className="mandatory-span">*</span>
              </div>
              <div style={{ flex: 1 }}>
                <TextInput
                  name="name"
                  value={field?.name || ""}
                  onChange={(event) => handleUpdateField(event.target.value, "name", field.key)}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
              <div
                className="product-label-field"
                style={{
                  width: "19rem",
                  flexShrink: 0,
                  display: "flex",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                <span>{t("HCM_PRODUCT_TYPE")}</span>
                <span className="mandatory-span">*</span>
              </div>
              <div style={{ flex: 1 }}>
                <Dropdown
                  style={{ width: "100%" }}
                  t={t}
                  option={productType}
                  optionKey="code"
                  selected={field?.type}
                  select={(value) => handleUpdateField(value, "type", field.key)}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
              <div
                className="product-label-field"
                style={{
                  width: "19rem",
                  flexShrink: 0,
                  display: "flex",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                <span>{t("HCM_PRODUCT_VARIANT")}</span>
                <span className="mandatory-span">*</span>
              </div>
              <div style={{ flex: 1 }}>
                <TextInput
                  name="variant"
                  value={field?.variant || ""}
                  onChange={(event) => handleUpdateField(event.target.value, "variant", field?.key)}
                />
              </div>
            </LabelFieldPair>
          </Card>
        );
      })}
      <Button
        variation="secondary"
        label={t(`CAMPAIGN_ADD_MORE_PRODUCT_BUTTON`)}
        size={"large"}
        // className={"hover"}
        icon={"AddIcon"}
        textStyles={{ width: "fit-content" }}
        style={{ marginTop: "1.5rem" }}
        onClick={addMoreField}
      />
    </React.Fragment>
  );
};

export default AddProductField;
