import React from "react";
import { Card, Button, CardHeader, HeaderComponent } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ComplaintIcon } from "@egovernments/digit-ui-react-components";

const ProductsPageComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const ProductsConfig = {
    header : "Products",
    headerDescription : "The DIGIT suite of products help in public service delivery. It is designed to work across countries at varying levels of capacity and complexity. Please select the product you would like to explore. Currently, two of our products are available on Sandbox. We are working on bringing the rest to you soon!",
    products : [
      {
        title: "Complaints Management",
        description: "Users can file and track complaints, which can be assigned and resolved by a higher authority.",
        icon: <ComplaintIcon className="product-icon"/>,
        link: "productDetailsPage/TL",
      },
      {
        title: "License Management",
        description: "Users can apply for licenses and make payment which can be tracked, paid, verified and renewed.",
        icon: <ComplaintIcon className="product-icon" />,
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
              {product.icon}
              <h2 className="product-title">{t(product.title)}</h2>
              {/* <HeaderComponent>{t(product.title)}</HeaderComponent> */}
            </div>
            <p className="product-description">{t(product.description)}</p>
            <Button
              className="explore-button"
              variation="secondary"
              label={t("Explore →")}
              onClick={() => handleNavigate(`/${window?.contextPath}/employee/user/${product?.link}`)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPageComponent;
