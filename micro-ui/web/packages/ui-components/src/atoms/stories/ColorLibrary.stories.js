import React from "react";

export default {
  title: "Foundations",
};

const hexCodes = {
  "primary-1": "#C84C0E",
  "primary-bg": "#FBEEE8",
  "primary-2": "#0B4B66",
  "text-primary": "#363636",
  "text-secondary": "#787878",
  "text-disabled": "#C5C5C5",
  "alert-error": "#B91900",
  "alert-errorbg": "#FFF5F4",
  "alert-success": "#00703C",
  "alert-successbg": "#F1FFF8",
  "alert-warning": "#9E5F00",
  "alert-warning-bg": "#FFF9F0",
  "alert-info": "#0057BD",
  "alert-infobg": "#DEEFFF",
  "generic-background": "#EEEEEE",
  "generic-divider": "#D6D5D4",
  "generic-inputborder": "#505A5F",
  "paper-primary": "#FFFFFF",
  "paper-secondary": "#FAFAFA",
};

const commonStyles = {
  display: "flex",
  flexDirection: "column",
  color: "#787878",
  backgroundColor: "#FAFAFA",
  padding: "16px",
  gap: "16px",
  borderRadius: "4px",
  border: "1px solid #d6d5d4",
};

const commonStylesForColors = {
  height: "40px",
  borderRadius: "4px",
  margin: "0 auto",
  width: "100%",
  border: "1px solid #d6d5d4",
};

const wrapperStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  alignItems: "center",
  color: "#787878",
  width: "50%",
};

const extrStyles = {
  display: "flex",
  flexDirection: "row",
  gap: "4px",
  justifyContent: "space-between",
  color: "#787878",
};

const ColorDisplay = () => {
  return (
    <div
      style={{
        padding: "24px",
        gap: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="typography heading-l"
        style={{ textAlign: "center", color: "#0B4B66" }}
      >
        Colors
      </div>
      <div style={commonStyles}>
        <div
          className="typography caption-m"
          style={{ width: "50%", color: "#363636" }}
        >
          Primary 
        </div>
        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.primary-1
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["primary-1"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #C84C0E
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.primary-2
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["primary-2"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #0B4B66
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.primary-bg
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["primary-bg"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #FBEEE8
            </div>
          </div>
        </div>
      </div>

      <div style={commonStyles}>
        <div
          className="typography caption-m"
          style={{ width: "50%", color: "#363636" }}
        >
          Text 
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.text-primary
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["text-primary"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #363636
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.text-secondary
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["text-secondary"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #787878
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.text-disabled
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["text-disabled"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #C5C5C5
            </div>
          </div>
        </div>
      </div>

      <div style={commonStyles}>
        <div
          className="typography caption-m"
          style={{ width: "50%", color: "#363636" }}
        >
          Alert
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.alert-error
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["alert-error"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #B91900
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.alert-errorbg
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["alert-errorbg"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #FFF5F4
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.alert-success
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["alert-success"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #00703C
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.alert-successbg
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["alert-successbg"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #F1FFF8
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.alert-info
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["alert-info"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #0057BD
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.alert-infobg
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["alert-infobg"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #DEEFFF
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.alert-warning
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["alert-warning"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #9E5F00
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.alert-warning-bg
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["alert-warning-bg"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #FFF9F0
            </div>
          </div>
        </div>
      </div>

      <div style={commonStyles}>
        <div
          className="typography caption-m"
          style={{ width: "50%", color: "#363636" }}
        >
          Generic 
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.generic-background
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["generic-background"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #EEEEEE
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.generic-divider
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["generic-divider"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #D6D5D4
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.generic-inputborder
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["generic-inputborder"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #505A5F
            </div>
          </div>
        </div>
      </div>

      <div style={commonStyles}>
        <div
          className="typography caption-m"
          style={{ width: "50%", color: "#363636" }}
        >
          Paper
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.paper-primary
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["paper-primary"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #FFFFFF
            </div>
          </div>
        </div>

        <div style={extrStyles}>
          <div className="typography caption-s" style={{ width: "50%" }}>
            digitv2.lightTheme.paper-secondary
          </div>
          <div style={wrapperStyles}>
            <div
              style={{
                backgroundColor: hexCodes["paper-secondary"],
                ...commonStylesForColors,
              }}
            />
            <div className="typography body-l" style={{ color: "#787878" }}>
              #FAFAFA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Colors = () => <ColorDisplay />;
