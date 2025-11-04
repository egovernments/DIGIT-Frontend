import React from "react";
import { Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./product-inline.css";

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleNavigate = (path) => {
    history.push(path);
  };

  return (
    <div 
      className="new-product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: '0px 2px 7px 0px #00000026',
        border: '1px solid transparent',
        background: '#fff',
        height: 'fit-content',
        width: '100%',
        minWidth: '250px',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Row 1: Icon + Heading (max 2 lines) */}
      <div 
        className="card-header-section"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <div 
          className="card-icon-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: '0.5rem'
          }}
        >
          {Digit.Utils.iconRender(product.icon, "#c84c0e", "24", "24")}
        </div>
        <h3 
          className="card-title" 
          title={t(product.heading)}
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0b4b66',
            lineHeight: '1.25',
            margin: '0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordWrap: 'break-word',
            hyphens: 'auto',
            flex: 1,
            padding: '0rem 0.25rem',

          }}
        >
          {t(product.heading)}
        </h3>
      </div>

      {/* Row 2: Description */}
      <div 
        className="card-description-section"
        style={{
          display: 'flex',
          alignItems: 'flex-start'
        }}
      >
        <p 
          className="card-description" 
          title={t(product?.cardDescription)}
          style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '1.5',
            margin: '0',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordWrap: 'break-word',
            padding: '0rem 0.25rem',

          }}
        >
          {t(product?.cardDescription)}
        </p>
      </div>

      {/* Row 3: Explore Button */}
      <div 
        className="card-button-section"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Button
          className="card-explore-button"
          size="medium"
          variation="secondary"
          label={`${t("COMMON_EXPLORE")} ➔`}
          onClick={() => handleNavigate(`/${window?.contextPath}/employee/sandbox/productDetailsPage/${product?.module}`)}
          style={{
            width: '100%',
            padding: '0.5rem 0.25rem',
            border: '1px solid transparent',
            background: 'transparent',
            color: '#c84c0e',
            fontWeight: '500',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}
        />
      </div>
    </div>
  );
};

export default ProductCard;