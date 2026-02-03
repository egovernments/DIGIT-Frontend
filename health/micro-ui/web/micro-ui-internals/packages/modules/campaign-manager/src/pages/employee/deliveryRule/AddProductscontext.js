import { AddIcon, Label } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, TextInput, Toast, Button, CardText, LabelFieldPair } from "@egovernments/digit-ui-components";
import { Link } from "react-router-dom";
import { CycleContext } from ".";
import { PRIMARY_COLOR } from "../../../utils";

const DustbinIcon = () => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.999837 13.8333C0.999837 14.75 1.74984 15.5 2.6665 15.5L9.33317 15.5C10.2498 15.5 10.9998 14.75 10.9998 13.8333L10.9998 3.83333L0.999837 3.83333L0.999837 13.8333ZM11.8332 1.33333L8.9165 1.33333L8.08317 0.5L3.9165 0.5L3.08317 1.33333L0.166504 1.33333L0.166504 3L11.8332 3V1.33333Z"
      fill={PRIMARY_COLOR}
    />
  </svg>
);
function AddProducts({ stref, selectedDelivery, showToast, closeToast, selectedProducts }) {
  const { t } = useTranslation();
  const oldSessionData = window.Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA");
  const { campaignData, dispatchCampaignData, filteredDeliveryConfig } = useContext(CycleContext);
  const tenantId = Digit.ULBService.getStateId();
  const updateSession = () => {
    const newData = {
      ...oldSessionData,
      HCM_CAMPAIGN_DELIVERY_DATA: {
        deliveryRule: campaignData,
      },
    };
    window.Digit.SessionStorage.set("HCM_CAMPAIGN_MANAGER_FORM_DATA", newData);
  };
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [products, setProducts] = useState([
    {
      key: 1,
      quantity: 1,
      value: null,
    },
  ]);
  const data = Digit.Hooks.campaign.useProductList(tenantId, filteredDeliveryConfig?.projectType);
  useEffect(() => {
    const updatedProducts = selectedProducts.map((selectedProduct, index) => {
      const id = selectedProduct?.value;
      return {
        key: index + 1,
        quantity: selectedProduct?.quantity || 1,
        // value: selectedProduct.additionalData,
        value: {
          displayName: selectedProduct.name,
          id: id,
        },
        name: selectedProduct.name,
      };
    });

    setProducts(updatedProducts);
  }, [selectedProducts]);

  const filteredData = data?.filter((item) => !selectedDelivery?.products?.some((entry) => entry?.value === item?.id));
  const temp = filteredData?.filter((item) => !products?.some((entry) => entry?.value?.id === item?.id));

  const add = () => {
    setProducts((prevState) => [
      ...prevState,
      {
        key: prevState.length + 1,
        value: null,
        quantity: 1,
      },
    ]);
  };

  const deleteItem = (data) => {
    const fil = products.filter((i) => i.key !== data.key);
    const up = fil.map((item, index) => ({ ...item, key: index + 1 }));
    setProducts(up);
  };

  const incrementC = (data, value) => {
    if (value?.target?.value.trim() === "") return;
    if (value?.target?.value.trim() === 0 || value?.target?.value.trim() > 10) return;
    if (value === 0) return;
    if (value > 10) return;
    setProducts((prevState) => {
      return prevState.map((item) => {
        if (item.key === data.key) {
          return { ...item, quantity: value?.target?.value ? Number(value?.target?.value) : value };
        }
        return item;
      });
    });
  };

  const updateValue = (key, newValue) => {
    setProducts((prevState) => {
      return prevState.map((item) => {
        if (item.key === key.key) {
          return { ...item, value: newValue };
        }
        return item;
      });
    });
  };

  // INFO:: removed "stref" from dependency array as it was causing infinite rerendering issue
  useEffect(() => {
    stref.current = products; // Update the ref with the latest child state
  }, [products]);

  return (
    <div className="add-resource-wrapper">
      {products.map((i, c) => (
        <div className="add-resource-container">
          <div className="header-container">
            <CardText>
              {t(`CAMPAIGN_RESOURCE`)} {c + 1}
            </CardText>
            {products?.length > 1 ? (
              <Button
                // className="custom-class"
                icon="Delete"
                iconFill=""
                label={t(`DELETE`)}
                onClick={() => deleteItem(i, c)}
                size=""
                style={{}}
                title=""
                variation="link"
              />
            ) : null}
          </div>
          <div className="add-resource-label-field-container">
            <LabelFieldPair style={{ display: "grid" }}>
              <Label>{t(`CAMPAIGN_ADD_PRODUCTS_LABEL`)}</Label>
              {<Dropdown
                t={t}
                style={{ width: "100%", minWidth: "100%", marginBottom: 0 }}
                className="form-field"
                selected={i?.value}
                disable={false}
                isMandatory={true}
                option={temp ? temp : filteredData}
                select={(d) => updateValue(i, d)}
                optionKey="displayName"
              />}
            </LabelFieldPair>
            {!filteredDeliveryConfig?.productCountHide && (
              <LabelFieldPair style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Label>{t(`CAMPAIGN_COUNT_LABEL`)}</Label>
                <TextInput type="numeric" defaultValue={i?.quantity} value={i?.quantity} onChange={(d) => incrementC(i, d)} />
              </LabelFieldPair>
            )}
          </div>
        </div>
      ))}
      {(temp === undefined || temp.length > 0) && (
        <Button
          variation="secondary"
          label={t(`CAMPAIGN_PRODUCTS_MODAL_SECONDARY_ACTION`)}
          className={"add-rule-btn hover"}
          icon="AddIcon"
          onClick={add}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1rem",
          marginBottom: "1rem"
        }}
      >
        <p>{t("CAMPAIGN_NEW_PRODUCT_TEXT")}</p>
        <span className="link" onClick={updateSession}>
          <Link
            to={{
              pathname: `/${window.contextPath}/employee/campaign/add-product`,
              state: {
                campaignId: id,
                urlParams: window?.location?.search,
                projectType: filteredDeliveryConfig?.projectType,
              },
            }}
          >
            {t("ES_CAMPAIGN_ADD_PRODUCT_LINK")}
          </Link>
        </span>
      </div>
      {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          // error={showToast.key === "error" ? true : false}
          label={t(showToast.label)}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default AddProducts;
