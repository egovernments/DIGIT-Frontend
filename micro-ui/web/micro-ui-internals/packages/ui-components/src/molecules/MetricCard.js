import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Card, Divider, CustomSVG } from "../atoms";
import { Spacers } from "../constants/spacers/spacers";
import { useTranslation } from "react-i18next";

const MetricCard = ({ className, styles, layout, withDivider, metrics, withBottomDivider }) => {
  const { t } = useTranslation();

  // Parse the layout prop to determine rows and columns
  const [rows, columns] = layout ? layout.split("*").map(Number) : [1, metrics.length];

  // Create grid template strings dynamically
  const gridTemplateColumns = `repeat(${columns}, 1fr)`;

  // Inline styles for the grid layout
  const gridStyles = {
    display: "grid",
    gridTemplateColumns,
    gridRowGap: withBottomDivider ? Spacers.spacer4 : "0", 
    ...styles,
  };

  return (
    <Card className={`digit-metric-card ${className}`} style={gridStyles}>
      {metrics?.map((metric, index) => {
        const isEndOfRow = (index + 1) % columns === 0;
        const isInLastRow = index >= (Math.ceil(metrics.length / columns) - 1) * columns;

        return (
          <Fragment key={index}>
            <div className="metric-item">
              {metric?.value && <div className="metric-value">{metric.value}</div>}
              {metric?.description && <div className="metric-description">{t(metric.description)}</div>}

              {metric?.statusmessage && (
                <div className={`metric-status ${metric.status}`}>
                  {metric.status === "Increased" ? (
                    <CustomSVG.SortUp fill={"#00703c"} />
                  ) : metric.status === "Decreased" ? (
                    <CustomSVG.SortDown fill={"#b91900"} />
                  ) : null}
                  {t(metric.statusmessage)}
                </div>
              )}
            </div>
            {!isEndOfRow && withDivider && (
              <div
                className="vertical-metric-divider"
                style={{
                  left: `calc(100% / ${columns} * ${(index % columns) + 1})`,
                }}
              />
            )}
            {isEndOfRow && !isInLastRow && withBottomDivider && (
              <div style={{ gridColumn: `1 / span ${columns}` }}>
                <Divider variant="small" className="metric-divider" />
              </div>
            )}
          </Fragment>
        );
      })}
    </Card>
  );
};

MetricCard.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  withDivider: PropTypes.bool,
  withBottomDivider: PropTypes.bool,
  className: PropTypes.string,
  styles: PropTypes.object,
  layout: PropTypes.string,
  statusmessage: PropTypes.string,
};

MetricCard.defaultProps = {
  className: "",
  styles: {},
  metrics: [],
  layout: "1*1",
  withDivider: false,
  withBottomDivider: false,
};

export default MetricCard;

