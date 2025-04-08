import React from "react";
import { Card, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const ProductsPageComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const ProductsConfig = {
    header : "SANDBOX_PRODUCT_HEADER",
    headerDescription : "SANDBOX_PRODUCT_HEADER_DESC",
    products : [
      {
        title: "SANDBOX_PGR_TITLE",
        description: "SANDBOX_PGR_DESC",
        icon: "ComplaintIcon",
        link: "productDetailsPage/TL",
      },
      {
        title: "SANDBOX_TL_TITLE",
        description: "SANDBOX_TL_DESC",
        icon: "ComplaintIcon",
        link: "productDetailsPage/TL",
      },
    ]
  }

  const handleNavigate = (path) => {
    history.push(path);
  };

  return (
    <div className="products-container">
      {/* Header Section */}
      <h1 className="products-title">{t(ProductsConfig?.header)}</h1>
      <p className="products-description">
        {t(ProductsConfig?.description)}
      </p>

      {/* Product Cards Section */}
      <div className="products-list">
        {ProductsConfig?.products.map((product, index) => (
          <Card key={index} className="product-card">
            <div className="product-header">
              {Digit.Utils.iconRender(product.icon,"#c84c0e")}
              <h2 className="product-title">{t(product.title)}</h2>
            </div>
            <p className="product-description">{t(product.description)}</p>
            <Button
              className="explore-button"
              variation="secondary"
              label={t("COMMON_EXPLORE") + " →"}
              onClick={() => handleNavigate(`/${window?.contextPath}/employee/user/${product?.link}`)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPageComponent;
