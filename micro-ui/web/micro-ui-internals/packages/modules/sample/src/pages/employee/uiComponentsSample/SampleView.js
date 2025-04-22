import { SummaryCard,Tag } from "@egovernments/digit-ui-components";
import React from "react";

const SampleView = () => {
  return (
    <SummaryCard
      asSeperateCards
      className=""
      header="Heading"
      layout={1}
      sections={[
        {
          cardType: "primary",
          fieldPairs: [
            {
              inline: true,
              label: "Name",
              type: "text",
              value: "John Doe",
            },
            {
              inline: true,
              label: "Age",
              value: "28",
            },
            {
              inline: true,
              label: "Profile Picture",
              type: "image",
              value: {
                alt: "Profile",
                height: "50px",
                src:
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                width: "50px",
              },
            },
          ],
          header: "Personal Information",
          subHeader: "Basic details",
        },
        {
          cardType: "primary",
          fieldPairs: [
            {
              inline: true,
              label: "Email",
              value: "john.doe@example.com",
            },
            {
              inline: true,
              label: "Phone",
              type: "action",
              value: {
                icon: "Call",
                label: "+1 123-456-7890",
                onClick: () => {},
                size: "medium",
                style: {},
                variation: "link",
              },
            },
          ],
          header: "Contact Information",
          subHeader: "How to reach me",
        },
        {
          cardType: "primary",
          fieldPairs: [
            {
              inline: true,
              label: "Street",
              value: "123 Main St",
            },
            {
              inline: true,
              label: "City",
              value: "Los Angeles",
            },
            {
              inline: true,
              label: "State",
              value: "CA",
            },
            {
              inline: true,
              label: "Zip Code",
              value: "90001",
            },
          ],
          header: "Address",
          subHeader: "Where I live",
        },
        {
          cardType: "primary",
          fieldPairs: [
            {
              inline: true,
              label: "Resume",
              type: "document",
              value: {
                onClick: () => {},
              },
            },
            {
              inline: true,
              label: "Custom",
              renderCustomContent: (value) => value,
              type: "custom",
                value: <Tag label="Tag" stroke type="success"/>
            },
          ],
          header: "Other Details",
        },
      ]}
      style={{}}
      subHeader="Subheading"
      type="primary"
    />
  );
};
export default SampleView;