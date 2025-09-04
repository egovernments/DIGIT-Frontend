import React, { useState, useEffect,Fragment } from "react";
import {
  Modal,
  TextInput,
  CloseSvg,
  Card,
  LabelFieldPair,
  Dropdown
} from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const StockCreateModal = ({
  onClose,
  projectId,
  tenantId,
  onSuccess
}) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  
  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    productVariantId: "",
    variation: "",
    materialNoteNumber: "",
    batchNumber: "",
    quantityReceived: "",
    quantitySent: "",
    distributorName: "",
    expireDate: "",
    transactionType: "",
    transactionReason: "",
    wayBillNumber: "",
    senderType: "",
    receiverType: ""
  });
  
  const [showToast, setShowToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Project resource mapping state
  const [projectResources, setProjectResources] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Dropdown options
  const transactionTypes = [
    { label: t("WBH_RECEIVED"), value: "RECEIVED" },
    { label: t("WBH_DISPATCHED"), value: "DISPATCHED" },
    { label: t("WBH_RETURNED"), value: "RETURNED" },
    { label: t("WBH_DAMAGED"), value: "DAMAGED" }
  ];

  const senderTypes = [
    { label: t("WBH_WAREHOUSE"), value: "WAREHOUSE" },
    { label: t("WBH_DISTRIBUTOR"), value: "DISTRIBUTOR" },
    { label: t("WBH_FACILITY"), value: "FACILITY" },
    { label: t("WBH_FIELD_TEAM"), value: "FIELD_TEAM" }
  ];

  const receiverTypes = [
    { label: t("WBH_WAREHOUSE"), value: "WAREHOUSE" },
    { label: t("WBH_DISTRIBUTOR"), value: "DISTRIBUTOR" },
    { label: t("WBH_FACILITY"), value: "FACILITY" },
    { label: t("WBH_FIELD_TEAM"), value: "FIELD_TEAM" }
  ];

  // Fetch project resources on component mount
  useEffect(() => {
    const fetchProjectResources = async () => {
      try {
        const res = await Digit.CustomService.getResponse({
          url: `${url}/resource/v1/_search`,
          body: {
            ProjectResource: {
              projectId: [projectId],
            },
            apiOperation: "SEARCH"
          },
            params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0,
    },
        });

        if (res?.ProjectResources?.length > 0) {
          setProjectResources(res.ProjectResources);
          
          // Extract product variant IDs and fetch product details
          const productVariantIds = res.ProjectResources
            .filter(resource => resource.resource?.productVariantId)
            .map(resource => resource.resource.productVariantId);
          
          if (productVariantIds.length > 0) {
            await fetchProductVariants(productVariantIds);
          } else {
            setIsLoadingProducts(false);
          }
        } else {
          setIsLoadingProducts(false);
        }
      } catch (error) {
        console.error("Error fetching project resources:", error);
        setIsLoadingProducts(false);
        setShowToast({ 
          label: t("WBH_FAILED_TO_LOAD_PRODUCTS"), 
          isError: true 
        });
        setTimeout(() => setShowToast(null), 5000);
      }
    };

    const fetchProductVariants = async (productVariantIds) => {
      try {
        const res = await Digit.CustomService.getResponse({
          url: "/product/variant/v1/_search",
          body: {
            ProductVariant: {
              id: productVariantIds,
            },
            apiOperation: "SEARCH"
          },
              params: {
      tenantId: tenantId,
      limit: 10,
      offset: 0,
    },
        });

        if (res?.ProductVariant?.length > 0) {
          const products = res.ProductVariant.map(variant => ({
            label: `${variant.sku} - ${variant.variation || 'Default'}`,
            value: variant.id,
            sku: variant.sku,
            variation: variant.variation,
            productId: variant.productId
          }));
          setAvailableProducts(products);
        }
      } catch (error) {
        console.error("Error fetching product variants:", error);
        setShowToast({ 
          label: t("WBH_FAILED_TO_LOAD_PRODUCTS"), 
          isError: true 
        });
        setTimeout(() => setShowToast(null), 5000);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (projectId && tenantId) {
      fetchProjectResources();
    }
  }, [projectId, tenantId, url, t]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    let newFormData = {
      ...formData,
      [field]: value
    };
    
    // If product is selected, auto-populate product name and variation
    if (field === 'productVariantId' && value) {
      const selectedProduct = availableProducts.find(p => p.value === value);
      if (selectedProduct) {
        newFormData = {
          ...newFormData,
          productName: selectedProduct.sku,
          variation: selectedProduct.variation || ''
        };
      }
    }
    
    setFormData(newFormData);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productVariantId) {
      newErrors.productName = t("WBH_PRODUCT_REQUIRED");
    }
    
    if (!formData.transactionType) {
      newErrors.transactionType = t("WBH_TRANSACTION_TYPE_REQUIRED");
    }
    
    if (!formData.quantityReceived && !formData.quantitySent) {
      newErrors.quantity = t("WBH_QUANTITY_REQUIRED");
    }

    if (formData.quantityReceived && (isNaN(formData.quantityReceived) || Number(formData.quantityReceived) <= 0)) {
      newErrors.quantityReceived = t("WBH_INVALID_QUANTITY");
    }

    if (formData.quantitySent && (isNaN(formData.quantitySent) || Number(formData.quantitySent) <= 0)) {
      newErrors.quantitySent = t("WBH_INVALID_QUANTITY");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Stock creation API
  const createStockCriteria = {
    url: `/stock/v1/_create`,
    config: false,
  };

  const createMutation = Digit.Hooks.useCustomAPIMutationHook(createStockCriteria);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Prepare additional fields
    const additionalFields = {
      fields: [
        { key: "productVariantId", value: formData.productVariantId },
        { key: "productName", value: formData.productName },
        { key: "variation", value: formData.variation },
        { key: "materialNoteNumber", value: formData.materialNoteNumber },
        { key: "batchNumber", value: formData.batchNumber },
        { key: "distributorName", value: formData.distributorName },
        { key: "quantityReceived", value: formData.quantityReceived },
        { key: "quantitySent", value: formData.quantitySent },
        { key: "expireDate", value: formData.expireDate ? new Date(formData.expireDate).getTime() : null }
      ].filter(field => field.value) // Only include fields with values
    };

    const stockPayload = {
      Stock: [
        {
          tenantId,
          referenceId: projectId,
          referenceIdType: "PROJECT",
          transactionType: formData.transactionType,
          transactionReason: formData.transactionReason || "MANUAL_ENTRY",
          quantity: Number(formData.quantityReceived || formData.quantitySent || 0),
          wayBillNumber: formData.wayBillNumber,
          senderType: formData.senderType,
          receiverType: formData.receiverType,
          additionalFields
        }
      ]
    };

    try {
      await createMutation.mutate(
        {
          params: { tenantId },
          body: stockPayload,
        },
        {
          onSuccess: () => {
            setShowToast({ 
              label: t("WBH_STOCK_CREATED_SUCCESSFULLY"), 
              isError: false 
            });
            setTimeout(() => {
              setShowToast(null);
              onSuccess?.();
              onClose();
            }, 2000);
          },
          onError: () => {
            setShowToast({ 
              label: t("WBH_STOCK_CREATION_FAILED"), 
              isError: true 
            });
            setTimeout(() => setShowToast(null), 5000);
            setIsSubmitting(false);
          }
        }
      );
    } catch (error) {
      setShowToast({ 
        label: t("WBH_STOCK_CREATION_FAILED"), 
        isError: true 
      });
      setTimeout(() => setShowToast(null), 5000);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      headerBarMain={<h1 className="heading-m">{t("WBH_CREATE_STOCK_ENTRY")}</h1>}
      headerBarEnd={<CloseSvg onClick={onClose} />}
      actionCancelLabel={t("CANCEL")}
      actionCancelOnSubmit={onClose}
      actionSaveLabel={t("CREATE")}
      actionSaveOnSubmit={handleSubmit}
      formId="stock-create-form"
      isDisabled={isSubmitting}
    >
      <Card>
        <div style={{ padding: "1rem" }}>
          {/* Product Information */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>
              {t("WBH_PRODUCT_INFORMATION")}
            </h3>
            
            <LabelFieldPair>
              <div className="field">
                {isLoadingProducts ? (
                  <div style={{ padding: "8px 12px", color: "#666" }}>
                    {t("WBH_LOADING_PRODUCTS")}...
                  </div>
                ) : availableProducts.length > 0 ? (
                  <Dropdown
                    t={t}
                    option={availableProducts}
                    selected={availableProducts.find(p => p.value === formData.productVariantId)}
                    optionKey="label"
                    select={(value) => handleInputChange("productVariantId", value.value)}
                    placeholder={t("WBH_SELECT_PRODUCT")}
                    errorMessage={errors.productName}
                  />
                ) : (
                  <div style={{ padding: "8px 12px", color: "#999", border: "1px solid #ccc", borderRadius: "4px" }}>
                    {t("WBH_NO_PRODUCTS_AVAILABLE")}
                  </div>
                )}
              </div>
            </LabelFieldPair>

            {/* Display selected product information */}
            {formData.productName && (
              <>
                <LabelFieldPair>
                  <div className="field">
                    <TextInput
                      name="productName"
                      placeholder={t("WBH_PRODUCT_NAME")}
                      value={formData.productName}
                      disabled={true}
                      style={{ backgroundColor: "#f5f5f5", color: "#666" }}
                    />
                  </div>
                </LabelFieldPair>

                <LabelFieldPair>
                  <div className="field">
                    <TextInput
                      name="variation"
                      placeholder={t("WBH_VARIATION")}
                      value={formData.variation || t("WBH_DEFAULT_VARIANT")}
                      disabled={true}
                      style={{ backgroundColor: "#f5f5f5", color: "#666" }}
                    />
                  </div>
                </LabelFieldPair>
              </>
            )}

            <LabelFieldPair>
              <div className="field">
                <TextInput
                  name="batchNumber"
                  placeholder={t("WBH_BATCH_NUMBER")}
                  value={formData.batchNumber}
                  onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                />
              </div>
            </LabelFieldPair>
          </div>

          {/* Quantity Information */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>
              {t("WBH_QUANTITY_INFORMATION")}
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <LabelFieldPair>
                <div className="field">
                  <TextInput
                    name="quantityReceived"
                    type="number"
                    placeholder={t("WBH_QUANTITY_RECEIVED")}
                    value={formData.quantityReceived}
                    onChange={(e) => handleInputChange("quantityReceived", e.target.value)}
                    errorMessage={errors.quantityReceived}
                  />
                </div>
              </LabelFieldPair>

              <LabelFieldPair>
                <div className="field">
                  <TextInput
                    name="quantitySent"
                    type="number"
                    placeholder={t("WBH_QUANTITY_SENT")}
                    value={formData.quantitySent}
                    onChange={(e) => handleInputChange("quantitySent", e.target.value)}
                    errorMessage={errors.quantitySent}
                  />
                </div>
              </LabelFieldPair>
            </div>
            
            {errors.quantity && (
              <span style={{ color: "#d32f2f", fontSize: "0.875rem" }}>
                {errors.quantity}
              </span>
            )}
          </div>

          {/* Transaction Information */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>
              {t("WBH_TRANSACTION_INFORMATION")}
            </h3>
            
            <LabelFieldPair>
              <div className="field">
                <Dropdown
                  t={t}
                  option={transactionTypes}
                  selected={transactionTypes.find(type => type.value === formData.transactionType)}
                  optionKey="label"
                  select={(value) => handleInputChange("transactionType", value.value)}
                  placeholder={t("WBH_SELECT_TRANSACTION_TYPE")}
                  errorMessage={errors.transactionType}
                />
              </div>
            </LabelFieldPair>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <LabelFieldPair>
                <div className="field">
                  <Dropdown
                    t={t}
                    option={senderTypes}
                    selected={senderTypes.find(type => type.value === formData.senderType)}
                    optionKey="label"
                    select={(value) => handleInputChange("senderType", value.value)}
                    placeholder={t("WBH_SELECT_SENDER_TYPE")}
                  />
                </div>
              </LabelFieldPair>

              <LabelFieldPair>
                <div className="field">
                  <Dropdown
                    t={t}
                    option={receiverTypes}
                    selected={receiverTypes.find(type => type.value === formData.receiverType)}
                    optionKey="label"
                    select={(value) => handleInputChange("receiverType", value.value)}
                    placeholder={t("WBH_SELECT_RECEIVER_TYPE")}
                  />
                </div>
              </LabelFieldPair>
            </div>
          </div>

          {/* Additional Information */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>
              {t("WBH_ADDITIONAL_INFORMATION")}
            </h3>
            
            <LabelFieldPair>
              <div className="field">
                <TextInput
                  name="materialNoteNumber"
                  placeholder={t("WBH_MATERIAL_NOTE_NUMBER")}
                  value={formData.materialNoteNumber}
                  onChange={(e) => handleInputChange("materialNoteNumber", e.target.value)}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair>
              <div className="field">
                <TextInput
                  name="distributorName"
                  placeholder={t("WBH_DISTRIBUTOR_NAME")}
                  value={formData.distributorName}
                  onChange={(e) => handleInputChange("distributorName", e.target.value)}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair>
              <div className="field">
                <TextInput
                  name="wayBillNumber"
                  placeholder={t("WBH_WAY_BILL_NUMBER")}
                  value={formData.wayBillNumber}
                  onChange={(e) => handleInputChange("wayBillNumber", e.target.value)}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair>
              <div className="field">
                <TextInput
                  name="expireDate"
                  type="date"
                  placeholder={t("WBH_EXPIRE_DATE")}
                  value={formData.expireDate}
                  onChange={(e) => handleInputChange("expireDate", e.target.value)}
                />
              </div>
            </LabelFieldPair>
          </div>
        </div>

        {showToast && (
          <Toast
            label={t(showToast.label)}
            isDleteBtn={true}
            onClose={() => setShowToast(null)}
            error={showToast.isError}
          />
        )}
      </Card>
    </Modal>
  );
};

export default StockCreateModal;