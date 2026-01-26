import React from "react";
import { Spacers as SpacersMain } from "../../constants/spacers/spacers";

export default {
  title: "Foundations",
};

const commonStyles = {
  background: "#d6d5d4",
  width: "100%",
};

const SpacersDisplay = () => {
  const spacerKeys = [
    "spacer1",
    "spacer2",
    "spacer3",
    "spacer4",
    "spacer5",
    "spacer6",
    "spacer7",
    "spacer8",
    "spacer9",
    "spacer10",
    "spacer11",
    "spacer12",
  ];

  // Updated toTitleCase function
  const toTitleCase = (str) => {
    return str
      .replace(/([a-z])([0-9]+)/i, "$1 $2") // Add space between the name and number
      .split(/(?=[A-Z])/g) // Split based on capital letters
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
        Spacers
      </div>
      {spacerKeys.map((spacerKey) => (
        <div
          key={spacerKey}
          className="typography caption-s"
          style={{
            gap: "8px",
            display: "flex",
            flexDirection: "column",
            color: "#363636",
          }}
        >
          <div
            style={{
              gap: "8px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                gap: "4px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div>{`${toTitleCase(spacerKey)}`}</div>
              <div
                className="typography body-xs"
                style={{ color: "#787878" }}
              >{`${`digitv2.spacers.${spacerKey}`}`}</div>
            </div>
            <div>{`${SpacersMain?.[spacerKey]}`}</div>
          </div>
          <div
            key={spacerKey}
            style={{
              height: SpacersMain?.[spacerKey],
              ...commonStyles,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export const Spacers = () => <SpacersDisplay />;
