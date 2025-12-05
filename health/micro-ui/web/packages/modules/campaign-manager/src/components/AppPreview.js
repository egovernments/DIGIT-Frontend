import React, { Fragment } from "react";
import { Card, CardText, CardHeader, Button } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "./MobileBezelFrame";
import ComponentToRender from "./ComponentToRender";

const AppPreview = ({ data = {}, selectedField, t, onFieldClick }) => {
  return (
    <MobileBezelFrame>
      <div
        className="mobile-bezel-child-container"
        style={{
          backgroundColor: "#eee",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Card
          className="app-preview-card"
          style={{
            backgroundColor: "#eee",
            boxShadow: "none",
            flex: 1,
            overflow: "auto",
          }}
        >
          <Card className="app-card" style={{}}>
            {/* RENDERING HEADER AND SUB-HEADING */}
            {data.heading && <CardHeader className="app-preview-card-header">{t(data.heading)}</CardHeader>}
            {data.description && <CardText className="app-preview-sub-heading">{t(data.description)}</CardText>}

            {/* RENDERING FORMS */}
            {data?.body?.map((card, index) => (
              <Fragment key={index}>
                {data.type !== "template" &&
                  card?.fields
                    ?.filter((field) => !field.hidden)
                    ?.map((field, fieldIndex) => {
                      const isSelected =
                        selectedField &&
                        ((selectedField.fieldName && selectedField.fieldName === field.fieldName) ||
                          (selectedField.id && selectedField.id === field.id));

                      return (
                        <div
                          key={fieldIndex}
                          onClick={() => onFieldClick && onFieldClick(field, data, card, index, fieldIndex)}
                          style={{
                            cursor: "pointer",
                            // border: isSelected ? "2px solid #C84C0E" : "2px solid transparent",
                            // borderRadius: "4px",
                            // padding: "8px",
                            // margin: "4px 0",
                            // backgroundColor: isSelected ? "#C84C0E08" : "transparent",
                          }}
                        >
                          <ComponentToRender field={field} t={t} selectedField={selectedField} isSelected={isSelected} />
                        </div>
                      );
                    })}
              </Fragment>
            ))}
          </Card>
        </Card>

        {/* RENDERING FOOTER */}
        {data?.footer?.length > 0 && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
              borderTop: "1px solid #e0e0e0",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            {data?.footer?.map((footer_item, index) => {
              return (
                <Button
                  key={index}
                  className="app-preview-action-button"
                  variation="primary"
                  label={t(footer_item?.label)}
                  title={t(footer_item?.label)}
                  onClick={() => {}}
                />
              );
            })}
          </div>
        )}
      </div>
    </MobileBezelFrame>
  );
};

export default AppPreview;
