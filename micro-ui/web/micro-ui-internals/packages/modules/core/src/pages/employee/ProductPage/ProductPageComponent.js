import React from "react";
import { Card, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const ProductsPageComponent = ({detailsConfig}) => {
  const { t } = useTranslation();
  const history = useHistory();
  
  const handleNavigate = (path) => {
    history.push(path,{ detailsConfig },
    );
  };

  return (
    <div className="products-container">
      {/* Header Section */}
      <h1 className="products-title">{t("SANDBOX_PRODUCT_HEADER")}</h1>
      <p className="products-description">
        {t("SANDBOX_PRODUCT_HEADER_DESC")}
      </p>

      {/* Product Cards Section */}
      <div className="products-list">
        {detailsConfig?.map((product, index) => (
          <Card key={index} className="product-card">
            <div className="product-header">
              {Digit.Utils.iconRender(product.icon,"#c84c0e")}
              <h2 className="product-title">{t(product.heading)}</h2>
            </div>
            <p className="product-description">{t(product?.cardDescription)}</p>
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
