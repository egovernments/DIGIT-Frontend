import React from "react";
import { Card, Button, HeaderComponent, CardText } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const ProductsPageComponent = ({detailsConfig}) => {
  const { t } = useTranslation();
  const history = useHistory();
  
  const handleNavigate = (path) => {
    history.push(path);
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
        {detailsConfig?.map((product, index) => (
          <Card key={index} className="product-card">
            <div className="product-header">
            <div className="icon-wrap">
              {Digit.Utils.iconRender(product.icon, "#c84c0e")}
            </div>
              <HeaderComponent className="product-title">{t(product.heading)}</HeaderComponent>
            </div>
            <CardText className="product-description">{t(product?.cardDescription)}</CardText>
            <Button
              className="explore-button"
              variation="secondary"
              label={t("COMMON_EXPLORE") + " →"}
              onClick={() => handleNavigate(`/${window?.contextPath}/employee/user/productDetailsPage/${product?.module}`)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPageComponent;
