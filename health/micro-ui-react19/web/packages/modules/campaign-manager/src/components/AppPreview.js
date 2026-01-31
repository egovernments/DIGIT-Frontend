import React, { Fragment, useMemo, useState } from "react";
import { Card, CardText, CardHeader, Button } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "./MobileBezelFrame";
import ComponentToRender from "./ComponentToRender";


// Simple tabs component
const Tabs = React.memo(({ tabs, activeTab, onTabChange, t }) => {
  return (
    <div className="configure-app-tabs" style={{
      display: "flex",
      scrollbarWidth: "none",
      borderBottom: "2px solid #e0e0e0",
      backgroundColor: "#fff",
      overflow: "auto"
    }}>
      {tabs.map((tab) => (
        <button 
          key={tab.productVariantId} 
          className={`configure-app-tab-head ${activeTab === tab.productVariantId ? "active" : ""} hover`}
          style={{
            padding: "6px 6px",
            border: "none",
            backgroundColor: activeTab === tab.productVariantId ? "#C84C0E" : "transparent",
            color: activeTab === tab.productVariantId ? "#fff" : "#0B0C0C",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeTab === tab.productVariantId ? "600" : "400",
            borderRadius: "4px 4px 0 0",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            minWidth: "fit-content"
          }}
          onClick={() => onTabChange(tab.productVariantId)}
        >
          <p style={{ margin: 0 }}>{tab.name}</p>
        </button>
      ))}
    </div>
  );
});

const AppPreview = ({ data = {}, selectedField, t, onFieldClick }) => {
    // Extract all unique product variants from sessionStorage
  const productVariants = useMemo(() => {
    try {
      const sessionData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
      if (!sessionData) return [];

      // const parsedData = JSON.parse(sessionData);
      const deliveryData = sessionData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
      
      if (!deliveryData || !Array.isArray(deliveryData)) return [];

      // Extract all product variants from all cycles and deliveries
      const variantsMap = new Map();
      
      deliveryData?.forEach(campaign => {
        if (campaign?.cycles && Array.isArray(campaign.cycles)) {
          campaign.cycles.forEach(cycle => {
            if (cycle?.deliveries && Array.isArray(cycle.deliveries)) {
              cycle.deliveries.forEach(delivery => {
                if (delivery?.doseCriteria && Array.isArray(delivery.doseCriteria)) {
                  delivery.doseCriteria.forEach(criteria => {
                    if (criteria?.ProductVariants && Array.isArray(criteria.ProductVariants)) {
                      criteria.ProductVariants.forEach(variant => {
                        if (variant?.productVariantId && variant?.name) {
                          // Use productVariantId as key to avoid duplicates
                          variantsMap.set(variant.productVariantId, {
                            productVariantId: variant.productVariantId,
                            name: variant.name
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });

      return Array.from(variantsMap.values());
    } catch (error) {
      console.error("Error extracting product variants:", error);
      return [];
    }
  }, []);


  // Initialize active tab with first product variant
  const [activeTab, setActiveTab] = useState(
    productVariants.length > 0 ? productVariants[0].productVariantId : null
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Show tabs only if showTabView is true and there are product variants
  const showTabs = data.showTabView === true && productVariants.length > 1;
  return (
    <MobileBezelFrame>
      <div
        className="mobile-bezel-child-container"
        style={{
          backgroundColor: "#eee",
          display: "flex",
          flexDirection: "column",
          height: "90%",
        }}
      >
        <Card
          className="app-preview-card"
          style={{
            backgroundColor: "#eee",
            boxShadow: "none",
            flex: 1,
            overflow: "auto",
          }}
        >
          <Card className="app-card" style={{}}>
            {/* RENDERING HEADER AND SUB-HEADING */}
            {data.heading && <CardHeader className="app-preview-card-header">{t(data.heading)}</CardHeader>}
            {data.description && <CardText className="app-preview-sub-heading">{t(data.description)}</CardText>}

            {/* RENDERING TABS */}
            {showTabs && (
              <Tabs 
                tabs={productVariants} 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
                t={t}
              />
            )}


            {/* RENDERING FORMS */}
            {data?.body?.map((card, cardIndex) => (
              <Fragment key={cardIndex}>
                {data.type !== "template" &&
                  card?.fields?.map((field, originalFieldIndex) => {
                    // Skip hidden fields in rendering but preserve original index
                    if (field.hidden) return null;

                    const isSelected =
                      selectedField &&
                      ((selectedField.fieldName && selectedField.fieldName === field.fieldName) ||
                        (selectedField.id && selectedField.id === field.id));

                    return (
                      <div
                        key={field.id || field.fieldName || originalFieldIndex}
                        onClick={() => onFieldClick && onFieldClick(field, data, card, cardIndex, originalFieldIndex)}
                        style={{
                          cursor: "pointer",
                          // border: isSelected ? "2px solid #C84C0E" : "2px solid transparent",
                          // borderRadius: "4px",
                          // padding: "8px",
                          // margin: "4px 0",
                          // backgroundColor: isSelected ? "#C84C0E08" : "transparent",
                        }}
                      >
                        <ComponentToRender field={field} t={t} selectedField={selectedField} isSelected={isSelected} />
                      </div>
                    );
                  })}
              </Fragment>
            ))}
          </Card>
        </Card>

        {/* RENDERING FOOTER */}
        {data?.footer?.length > 0 && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
              borderTop: "1px solid #e0e0e0",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            {data?.footer?.map((footer_item, index) => {
              return (
                <Button
                  key={index}
                  className="app-preview-action-button"
                  variation="primary"
                  label={t(footer_item?.label)}
                  title={t(footer_item?.label)}
                  onClick={() => {}}
                />
              );
            })}
          </div>
        )}
      </div>
    </MobileBezelFrame>
  );
};

export default AppPreview;
