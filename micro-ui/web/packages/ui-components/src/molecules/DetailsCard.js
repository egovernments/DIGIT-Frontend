import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CitizenInfoLabel from "../atoms/CitizenInfoLabel";
import Button from "../atoms/Button";
import Footer from "../atoms/Footer";

export const Details = ({ label, name, onClick }) => {
  return (
    <div className="digit-detail" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick && onClick(e);
      }
    }}>
      <span className="digit-label">
        <h2>{label}</h2>
      </span>
      <span className="digit-name">{name}</span>
    </div>
  );
};

const DetailsCard = ({
  data,
  serviceRequestIdKey,
  linkPrefix,
  handleSelect,
  selectedItems,
  keyForSelected,
  handleDetailCardClick,
  isTwoDynamicPrefix = false,
  getRedirectionLink,
  handleClickEnabled = true,
  t,
  showActionBar = true,
  showCitizenInfoLabel = false,
  submitButtonLabel,
  styleVariant = "",
  redirectedLink,
  subRedirectedLink,
}) => {
  if (linkPrefix && serviceRequestIdKey) {
    return (
      <div role="list" aria-label="Details list">
        {data.map((object, itemIndex) => {
          return (
            <Link
              key={itemIndex}
              to={
                isTwoDynamicPrefix
                  ? `${linkPrefix}${
                      typeof serviceRequestIdKey === "function"
                        ? serviceRequestIdKey(object)
                        : // : `${getRedirectionLink(object["Application Type"] === "BPA_STAKEHOLDER_REGISTRATION" ? "BPAREG" : "BPA")}/${
                          `${getRedirectionLink(redirectedLink)}/${
                            // object[object["Application Type"] === "BPA_STAKEHOLDER_REGISTRATION" ? "applicationNo" : "Application Number"]
                            object[subRedirectedLink ? subRedirectedLink : "Application Number"]
                          }`
                    }`
                  : `${linkPrefix}${typeof serviceRequestIdKey === "function" ? serviceRequestIdKey(object) : object[serviceRequestIdKey]}`
              }
            >
              <div className="digit-details-container" role="listitem">
                {Object.keys(object).map((name, index) => {
                  if (name === "applicationNo" || name === "Vehicle Log") return null;
                  return <Details label={name} name={object[name]} key={index} />;
                })}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div role="list" aria-label="Details list">
      {data.map((object, itemIndex) => {
        return (
          <div 
            key={itemIndex} 
            className={`digit-details-container ${styleVariant}`} 
            onClick={() => handleClickEnabled && handleSelect(object)}
            role="listitem"
            tabIndex={handleClickEnabled ? 0 : -1}
            onKeyDown={(e) => {
              if (handleClickEnabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleSelect(object);
              }
            }}
            aria-label={`Details card ${itemIndex + 1}`}
          >
            {Object.keys(object)
              .filter((rowEle) => !(typeof object[rowEle] == "object" && object[rowEle]?.hidden == true))
              .map((name, index) => {
                return <Details label={name} name={object[name]} key={index} onClick={() => handleClickEnabled && handleDetailCardClick(object)} />;
              })}
            {showCitizenInfoLabel ? (
              <CitizenInfoLabel className={"digit-core-variant"} info={t("ATM_INFO_LABEL")} text={t(`ATM_INFO_TEXT`)} fill={"#CC7B2F"} />
            ) : null}
            {showActionBar ? (
              <Footer>
                <Button onClick={() => handleDetailCardClick(object)} label={submitButtonLabel} />
              </Footer>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

DetailsCard.propTypes = {
  data: PropTypes.array,
};

DetailsCard.defaultProps = {
  data: [],
};

export default DetailsCard;
