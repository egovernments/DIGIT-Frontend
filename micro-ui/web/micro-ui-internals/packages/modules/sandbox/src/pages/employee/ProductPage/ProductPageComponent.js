import React, { useState, useEffect } from "react";
import { HeaderComponent, CardText } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import ProductCard from "../../../components/ProductCard";

const ProductsPageComponent = ({ detailsConfig }) => {
  const { t } = useTranslation();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);

  // Configurable modules list - easily modify this array to add/remove configurable modules
  const CONFIGURABLE_MODULES = ["PGR"];

  // Separate products into configurable and explorable
  const configurableProducts = detailsConfig?.filter(product =>
    CONFIGURABLE_MODULES.includes(product.module)
  ) || [];

  const explorableProducts = detailsConfig?.filter(product =>
    !CONFIGURABLE_MODULES.includes(product.module)
  ) || [];

  // Handle responsive padding for custom-products-card and grid columns
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsLargeScreen(width >= 1281);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Calculate grid columns based on screen width - max 4 cards per row
  const getGridColumns = () => {
    if (screenWidth >= 1280) {
      return "repeat(4, 1fr)"; // Max 4 cards on large desktop - cards expand to fill space
    } else if (screenWidth >= 1024) {
      return "repeat(3, minmax(250px, 1fr))"; // 3 cards on small desktop
    } else if (screenWidth >= 768) {
      return "repeat(2, minmax(250px, 1fr))"; // 2 cards on tablet
    } else {
      return "minmax(250px, 1fr)"; // 1 card on mobile
    }
  };

  // Container styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "1rem 0 0 0",
  };

  // Card wrapper styles with responsive padding
  const cardWrapperStyle = {
    minWidth: "75rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingLeft: isLargeScreen ? "0" : "2.5rem",
  };

  // Product title styles
  const productTitleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#0B4B66",
  };

  // Product description styles
  const productDescriptionStyle = {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "2rem",
    maxWidth: "100%",
  };

  // Section container styles
  const sectionContainerStyle = {
    backgroundColor: "#FAFAFA",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    boxShadow: "0px 2px 7px 0px #00000026",
  };

  // Section heading styles
  const sectionHeadingStyle = {
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: "24px",
    lineHeight: "100%",
    letterSpacing: "0px",
    margin: "0 0 1rem 0",
    color: "#505050",
  };

  // Section description styles
  const sectionDescriptionStyle = {
    marginBottom: "1rem",
    color: "#505A5F",
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0px",
  };

  // Products list grid styles with max 4 cards limit
  const getProductsListStyle = (cardCount) => {
    return {
      display: "grid",
      gridTemplateColumns: getGridColumns(),
      gap: "1rem",
      width: "100%",
      maxWidth: "none",
      margin: "0 auto",
      justifyContent: "flex-start",
      padding: 0,
    };
  };

  return (
    <div className="custom-products-container" style={containerStyle}>
      <div className="custom-products-card" style={cardWrapperStyle}>
        {/* Header Section */}
        <HeaderComponent className="products-title" style={productTitleStyle}>
          {t("SANDBOX_PRODUCT_HEADER")}
        </HeaderComponent>
        <CardText className="products-description" style={productDescriptionStyle}>
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
            <div className="products-list" style={getProductsListStyle(configurableProducts.length)}>
              {configurableProducts.map((product, index) => (
                <ProductCard 
                  key={index} 
                  product={product} 
                  isSingleCard={configurableProducts.length === 1}
                />
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
            <div className="products-list" style={getProductsListStyle(explorableProducts.length)}>
              {explorableProducts.map((product, index) => (
                <ProductCard 
                  key={index} 
                  product={product} 
                  isSingleCard={explorableProducts.length === 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPageComponent;
