import React from "react";
import { Card, Button, HeaderComponent, CardText } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const ProductsPageComponent = ({ detailsConfig }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleNavigate = (path) => {
    history.push(path);
  };

    const Chip = ({ text = "Configure", color = "#215B730D", borderColor = "#215B73AD", textColor = "#215B73AD" }) => {
    const chipStyle = {
      padding: "2px 6px",
      border: `1px solid ${borderColor}`,
      backgroundColor: color,
      color: textColor,
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "400",
      cursor: "pointer",
      display: "inline-block",
    };
    return <div style={chipStyle}>{text}</div>;
  };

  return (
    <div className="products-container">
      {/* Header Section */}
      <HeaderComponent className="products-title">{t("SANDBOX_PRODUCT_HEADER")}</HeaderComponent>
      <CardText className="products-description">
        {t("SANDBOX_PRODUCT_HEADER_DESC")}
      </CardText>

      {/* Product Cards Section */}
      <div className="products-list">
        {detailsConfig?.map((product, index) => {                    
          return (
          <Card key={index} className="product-card">
            { 
            ((product.module == "PGR") ? <Chip text="Configure" /> : <div></div>   )
            }
            <div className="product-header">
              <div className="icon-wrap">
                {Digit.Utils.iconRender(product.icon, "#c84c0e")}
              </div>
              <HeaderComponent className="product-title">{t(product.heading)}</HeaderComponent>
            </div>
            <CardText className="product-description">{t(product?.cardDescription)}</CardText>
            <Button
              className="explore-button-updated no-hover"
              size={"medium"}
              style={{
                padding: "0px", justifyContent: "start", display: "flex",height: "1rem"
              }}
              variation="secondary"
              label={`${t("COMMON_EXPLORE")} ➔`}
              onClick={() => handleNavigate(`/${window?.contextPath}/employee/sandbox/productDetailsPage/${product?.module}`)}
            />
          </Card>
        )}
        )}
      </div>
    </div>
  );
};

export default ProductsPageComponent;
