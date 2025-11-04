import React from "react";
import { HeaderComponent, CardText } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import ProductCard from "../../../components/ProductCard";
import "../../../components/product-inline.css";


const ProductsPageComponent = ({ detailsConfig }) => {
  const { t } = useTranslation();

  // Configurable modules list - easily modify this array to add/remove configurable modules
  const CONFIGURABLE_MODULES = ["PGR"];

  // Separate products into configurable and explorable
  const configurableProducts = detailsConfig?.filter(product =>
    CONFIGURABLE_MODULES.includes(product.module)
  ) || [];

  const explorableProducts = detailsConfig?.filter(product =>
    !CONFIGURABLE_MODULES.includes(product.module)
  ) || [];

  // Common styles
  const sectionContainerStyle = {
    backgroundColor: "#FAFAFA",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    boxShadow: "0px 2px 7px 0px #00000026"
  };

  const sectionHeadingStyle = {
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: "24px",
    lineHeight: "100%",
    letterSpacing: "0px",
    margin: "0 0 1rem 0",
    color: "#505050"
  };

  const sectionDescriptionStyle = {
    marginBottom: "1rem",
    color: "#505A5F",
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0px"
  };

  return (
    <div className="custom-products-container">
      <div className="custom-products-card">
        {/* Header Section */}
        <HeaderComponent className="products-title">{t("SANDBOX_PRODUCT_HEADER")}</HeaderComponent>
        <CardText className="products-description">
          {t("SANDBOX_PRODUCT_HEADER_DESC")}
        </CardText>

        {/* Configurable Products Section */}
        {configurableProducts.length > 0 && (
          <div style={sectionContainerStyle}>
            <h2 style={sectionHeadingStyle}>
              {t("SANDBOX_CONFIGURABLE_PRODUCTS")}
            </h2>
            <CardText style={sectionDescriptionStyle}>
              {t("SANDBOX_CONFIGURABLE_PRODUCTS_DESC")}
            </CardText>
            <div 
              className="products-list"
              style={{}}
            >
              {configurableProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Explorable Products Section */}
        {explorableProducts.length > 0 && (
          <div style={sectionContainerStyle}>
            <h2 style={sectionHeadingStyle}>
              {t("SANDBOX_EXPLORABLE_PRODUCTS")}
            </h2>
            <CardText style={sectionDescriptionStyle}>
              {t("SANDBOX_EXPLORABLE_PRODUCTS_DESC")}
            </CardText>
            <div 
              className="products-list"
              style={{}}
            >
              {explorableProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPageComponent;
