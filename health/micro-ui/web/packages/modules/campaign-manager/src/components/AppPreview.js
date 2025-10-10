import React, { Fragment } from "react";
import { Card, CardText, CardHeader, Button } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "./MobileBezelFrame";
import ComponentToRender from "./ComponentToRender";

const AppPreview = ({ data = {}, selectedField, t, onFieldClick }) => {
  return (
    <MobileBezelFrame>
      <div className="mobile-bezel-child-container">
        <Card className="app-card" style={{}}>
          {/* RENDERING HEADER AND SUB-HEADING */}
          {data.headerFields?.map((headerField, headerIndex) => (
            <div key={headerIndex}>
              {headerField.jsonPath === "ScreenHeading" ? (
                <CardHeader>{t(headerField.value)}</CardHeader>
              ) : (
                <CardText className="app-preview-sub-heading">{t(headerField.value)}</CardText>
              )}
            </div>
          ))}

          {/* RENDERING FORMS */}
          {data?.cards?.map((card, index) => (
            <Card key={index} className="app-card" style={{}}>
              {data.type !== "template" &&
                card?.fields
                  ?.filter((field) => field.active && !field.hidden)
                  ?.map((field, fieldIndex) => {
                    const isSelected =
                      selectedField &&
                      ((selectedField.jsonPath && selectedField.jsonPath === field.jsonPath) ||
                        (selectedField.id && selectedField.id === field.id));

                    return (
                      <div
                        key={fieldIndex}
                        onClick={() => onFieldClick && onFieldClick(field, data, card, index, fieldIndex)}
                        style={{
                          cursor: "pointer",
                          border: isSelected ? "2px solid #0B4B66" : "2px solid transparent",
                          borderRadius: "4px",
                          padding: "8px",
                          margin: "4px 0",
                          backgroundColor: isSelected ? "#f0f8ff" : "transparent",
                        }}
                      >
                        <ComponentToRender field={field} t={t} selectedField={selectedField} />
                      </div>
                    );
                  })}
            </Card>
          ))}

          {/* RENDERING FOOTER */}
          {data?.footer?.length > 0 &&
            data?.footer?.map((footer_item) => {
              return (
                <Button
                  className="app-preview-action-button"
                  variation="primary"
                  label={t(footer_item?.label)}
                  title={t(footer_item?.label)}
                  onClick={() => {}}
                />
              );
            })}
        </Card>
      </div>
    </MobileBezelFrame>
  );
};

export default AppPreview;
