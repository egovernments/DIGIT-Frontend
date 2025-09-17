import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, TextInput, Toast, Button, CardText, LabelFieldPair } from "@egovernments/digit-ui-components";
import { Link } from "react-router-dom";

const AddProducts = React.memo(({ 
  stref, 
  selectedDelivery, 
  selectedProducts, 
  projectConfig 
}) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([{
    key: 1,
    quantity: 1,
    value: null,
  }]);
  const [showToast, setShowToast] = useState(null);

  const tenantId = Digit.ULBService.getStateId();
  const sessionData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA");
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  // Fetch available products
  const productData = Digit.Hooks.campaign.useProductList(tenantId, projectConfig?.projectType);

  // Initialize products from selected products
  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      const updatedProducts = selectedProducts.map((selectedProduct, index) => ({
        key: index + 1,
        quantity: selectedProduct?.quantity || 1,
        value: {
          displayName: selectedProduct.name,
          id: selectedProduct?.value,
        },
        name: selectedProduct.name,
      }));
      setProducts(updatedProducts);
    }
  }, [selectedProducts]);

  // Update ref when products change
  useEffect(() => {
    if (stref) {
      stref.current = products;
    }
  }, [products, stref]);

  // Filter available options
  const availableOptions = useMemo(() => {
    if (!productData) return [];
    
    const selectedProductIds = new Set([
      ...(selectedDelivery?.products?.map(p => p.value) || []),
      ...products.map(p => p.value?.id).filter(Boolean)
    ]);
    
    return productData.filter(item => !selectedProductIds.has(item.id));
  }, [productData, selectedDelivery?.products, products]);

  const getOptionsForProduct = useCallback((currentProductKey) => {
    const otherProductIds = new Set(
      products
        .filter(p => p.key !== currentProductKey && p.value?.id)
        .map(p => p.value.id)
    );
    
    const alreadySelectedIds = new Set(
      selectedDelivery?.products?.map(p => p.value) || []
    );
    
    return productData?.filter(item => 
      !otherProductIds.has(item.id) && !alreadySelectedIds.has(item.id)
    ) || [];
  }, [productData, products, selectedDelivery?.products]);

  const addProduct = useCallback(() => {
    setProducts(prevState => [
      ...prevState,
      {
        key: prevState.length + 1,
        value: null,
        quantity: 1,
      },
    ]);
  }, []);

  const deleteProduct = useCallback((productToDelete) => {
    setProducts(prevState => {
      const filtered = prevState.filter(p => p.key !== productToDelete.key);
      return filtered.map((product, index) => ({ 
        ...product, 
        key: index + 1 
      }));
    });
  }, []);

  const updateQuantity = useCallback((productKey, value) => {
    const numValue = value?.target?.value ? Number(value.target.value) : value;
    
    if (numValue === 0 || numValue > 10 || isNaN(numValue)) {
      return;
    }

    setProducts(prevState =>
      prevState.map(product =>
        product.key === productKey
          ? { ...product, quantity: numValue }
          : product
      )
    );
  }, []);

  const updateProductValue = useCallback((productKey, newValue) => {
    setProducts(prevState =>
      prevState.map(product =>
        product.key === productKey
          ? { ...product, value: newValue }
          : product
      )
    );
  }, []);

  const updateSession = useCallback(() => {
    const oldSessionData = sessionData;
    const newData = {
      ...oldSessionData,
      HCM_CAMPAIGN_DELIVERY_DATA: {
        deliveryRule: [], // This would be populated from Redux store
      },
    };
    Digit.SessionStorage.set("HCM_CAMPAIGN_MANAGER_FORM_DATA", newData);
  }, [sessionData]);

  const closeToast = useCallback(() => {
    setShowToast(null);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(closeToast, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast, closeToast]);

  const canAddMore = availableOptions.length > 0;

  return (
    <div className="add-resource-wrapper">
      {products.map((product, index) => {
        const optionsForThisProduct = getOptionsForProduct(product.key);
        
        return (
          <div key={product.key} className="add-resource-container">
            <div className="header-container">
              <CardText>
                {t("CAMPAIGN_RESOURCE")} {index + 1}
              </CardText>
              {products.length > 1 && (
                <Button
                  icon="Delete"
                  label={t("DELETE")}
                  onClick={() => deleteProduct(product)}
                  variation="link"
                />
              )}
            </div>
            
            <div className="add-resource-label-field-container">
              <LabelFieldPair style={{ display: "grid" }}>
                <label>{t("CAMPAIGN_ADD_PRODUCTS_LABEL")}</label>
                <Dropdown
                  t={t}
                  style={{ width: "100%", minWidth: "100%", marginBottom: 0 }}
                  className="form-field"
                  selected={product?.value}
                  disable={false}
                  isMandatory
                  option={optionsForThisProduct}
                  select={(value) => updateProductValue(product.key, value)}
                  optionKey="displayName"
                />
              </LabelFieldPair>
              
              {!projectConfig?.productCountHide && (
                <LabelFieldPair style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "flex-start" 
                }}>
                  <label>{t("CAMPAIGN_COUNT_LABEL")}</label>
                  <TextInput
                    type="numeric"
                    value={product?.quantity}
                    onChange={(value) => updateQuantity(product.key, value)}
                  />
                </LabelFieldPair>
              )}
            </div>
          </div>
        );
      })}
      
      {canAddMore && (
        <Button
          variation="secondary"
          label={t("CAMPAIGN_PRODUCTS_MODAL_SECONDARY_ACTION")}
          className="add-rule-btn hover"
          icon="AddIcon"
          onClick={addProduct}
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
                projectType: projectConfig?.projectType,
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
          label={t(showToast.label)}
          onClose={closeToast}
        />
      )}
    </div>
  );
});

export default AddProducts;