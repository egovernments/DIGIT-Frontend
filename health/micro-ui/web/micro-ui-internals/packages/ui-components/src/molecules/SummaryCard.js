import React, { Fragment } from "react";
import { Card } from "../atoms";
import { SummaryCardFieldPair } from "../atoms";
import { Divider } from "../atoms";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const SummaryCard = ({
  className,
  style,
  type,
  sections,
  withDivider,
  layout,
  withSectionDivider,
  showSectionsAsMultipleCards,
  asSeperateCards,
}) => {
  const isTwoColumnLayout = layout === 2;
  const { t } = useTranslation();

  const renderSectionHeader = (section) => {
    if (section?.header || section?.subHeader) {
      return (
        <div>
          {section?.header && (
            <div className="digit-view-card-header">{section?.header}</div>
          )}
          {section?.subHeader && (
            <div className="digit-view-card-subheader">
              {section?.subHeader}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderFieldPairs = (fieldPairs) => {
    return fieldPairs?.map((pair, index) => (
      <Fragment key={index}>
        <SummaryCardFieldPair
          label={t(pair?.label)}
          value={pair?.value}
          inline={pair?.inline}
          className={pair?.className}
          style={pair?.style}
          type={pair?.type}
          renderCustomContent={pair?.renderCustomContent}
        />
        {withDivider && layout === 1 && index < fieldPairs.length - 1 && (
          <Divider />
        )}
        {withDivider && layout === 2 && (index + 1) % 2 !== 0 && (
          <div
            className="vertical-summarycard-divider"
            style={{
              left: `calc(100% / ${2} * ${(index % 2) + 1})`,
            }}
          />
        )}
      </Fragment>
    ));
  };

  const renderSectionContent = (section, sectionIndex) => (
    <Fragment key={sectionIndex}>
      {renderSectionHeader(section)}
      <div
        className={`view-card-field-pairs ${
          isTwoColumnLayout ? "two-column-layout" : ""
        } ${withDivider ? "with-divider" : ""}`}
      >
        {renderFieldPairs(section?.fieldPairs)}
      </div>
      {withSectionDivider && sectionIndex < sections.length - 1 && (
        <Divider variant="medium" />
      )}
    </Fragment>
  );

  // When asSeperateCards is true, render each section inside its own Card
  if (asSeperateCards) {
    return (
      <div className="seperate-card-sections">
        {sections?.map((section, sectionIndex) => (
          <Card key={sectionIndex} className={`digit-view-card`}>
            {renderSectionHeader(section)}
            <div
              className={`view-card-field-pairs ${
                isTwoColumnLayout ? "two-column-layout" : ""
              }`}
            >
              {renderFieldPairs(section.fieldPairs)}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (showSectionsAsMultipleCards && !asSeperateCards) {
    // When showSectionsAsMultipleCards is true, render each section inside its own Card
    return (
      <Card
        className={`digit-view-card ${className || ""}`}
        style={style}
        type={type}
      >
        {sections?.map((section, sectionIndex) => (
          <Card
            key={sectionIndex}
            className={`digit-view-card ${className || ""}`}
            style={style}
            type={section?.cardType || "primary"}
          >
            {renderSectionHeader(section)}
            <div
              className={`view-card-field-pairs ${
                isTwoColumnLayout ? "two-column-layout" : ""
              }`}
            >
              {renderFieldPairs(section?.fieldPairs)}
            </div>
          </Card>
        ))}
      </Card>
    );
  }
  // When showSectionsAsMultipleCards is false, render sections inside a single Card
  return (
    <Card
      className={`digit-view-card ${className || ""}`}
      style={style}
      type={type}
    >
      {sections?.map((section, sectionIndex) =>
        renderSectionContent(section, sectionIndex)
      )}
    </Card>
  );
};

SummaryCard.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string,
  sections: PropTypes.array.isRequired,
  withDivider: PropTypes.bool,
  layout: PropTypes.number,
  withSectionDivider: PropTypes.bool,
  showSectionsAsMultipleCards: PropTypes.bool,
  asSeperateCards: PropTypes.bool,
};

export default SummaryCard;