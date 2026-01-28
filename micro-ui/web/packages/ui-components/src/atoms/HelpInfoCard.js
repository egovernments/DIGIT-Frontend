import React, { useState, Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import TextBlock from "./TextBlock";
import AlertCard from "./AlertCard";
import Loader from "./Loader";


//sample config for reference
const helpCardConfig = {
    title: "How to Submit Your Application",
    sections: [
      {
        heading: {
          caption: "Start Here",
          header: "Application Submission Guide",
          body: "Follow these instructions to complete and submit your application without issues.",
          subHeader: "Simple steps to begin"
        },
        content: [
          {
            type: "text",
            text: "To begin your application, ensure all necessary documents are available and valid."
          },
          {
            type: "image",
            src: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/mapView.png",
            alt: "Application Submission Flow",
            width: "100%"
          },
          {
            type: "text",
            text: "Application Section",
            style: ["bold", "italic"]
          },
          {
            type: "text",
            text: " is available in the main dashboard. Navigate to it"
          },
          {
            type: "text",
            text: "Apply Now",
            style: ["link"],
            href: "/apply"
          }
        ]
      },
      {
        heading: { header: "Step-by-Step Instructions" },
        content: [
          {
            type: "list",
            style: "number",
            items: [
              "Login using your registered mobile number or email.",
              {
                text: "Navigate to the ",
                children: [
                  {
                    text: "Application Section",
                    style: ["bold", "italic"]
                  },
                  {
                    text: " and click on "
                  },
                  {
                    text: "Apply Now",
                    style: ["link"],
                    href: "/apply"
                  }
                ]
              },
              "Fill in the required fields and upload the necessary documents.",
              "Review the application and click on Submit.",
              "You will receive an acknowledgement with a reference number."
            ]
          }
        ]
      },
      {
        heading: { header: "Need Assistance?" },
        content: [
          {
            type: "text",
            text: "For more information, please visit the ",
            children: [
              {
                text: "Help Center",
                style: ["link"],
                href: "https://help.example.com"
              },
              {
                text: " or contact our support team at "
              },
              {
                text: "1800-123-456",
                style: ["bold"]
              }
            ]
          }
        ]
      }
    ],
    pages: "apply-page",
    module: "application-module"
  };

const StyledText = ({ text, style = [], href }) => {
  const { t } = useTranslation();
  let element = <span>{t(text)}</span>;

  style.forEach((s) => {
    switch (s) {
      case "bold":
        element = <strong>{element}</strong>;
        break;
      case "italic":
        element = <em>{element}</em>;
        break;
      case "link":
        element = (
          <a href={href} target="_blank" rel="noopener noreferrer" className="link">
            {element}
          </a>
        );
        break;
      default:
        break;
    }
  });

  return element;
};

const RenderContent = ({ content, groupTextBlocks = false }) => {
  const { t } = useTranslation();
  const result = [];

  for (let i = 0; i < content.length; i++) {
    const block = content[i];

    const isImageGroup =
      groupTextBlocks &&
      block.type === "image" &&
      content[i + 1]?.type === "text" &&
      content[i + 1]?.style?.includes("bold") &&
      content[i + 2]?.type === "text" &&
      !content[i + 2]?.style?.includes("bold");

    if (isImageGroup) {
      const image = block;
      const boldText = content[i + 1];
      const normalText = content[i + 2];
      const isLastGroup = i + 3 >= content.length;

      result.push(
        <div key={`grouped-${i}`} className={`content-group ${isLastGroup ? "no-border" : ""}`}>
          <img src={image.src} alt={image.alt || "icon"} className="content-icon" />
          <div className="content-text-block">
            <div className="content-bold-text">{t(boldText.text)}</div>
            <div className="content-regular-text">{t(normalText.text)}</div>
          </div>
        </div>
      );

      i += 2;
      continue;
    }

    switch (block.type) {
      case "text": {
        const isBold = block.style?.includes("bold");
        const nextBlock = content[i + 1];
        const nextIsText = nextBlock?.type === "text" && !nextBlock.style?.includes("bold");

        if (groupTextBlocks && isBold && nextIsText) {
          result.push(
            <div key={`group-${i}`} className="text-group">
              <p className="bold-text">{t(block.text)}</p>
              <p className="regular-text">{t(nextBlock.text)}</p>
            </div>
          );
          i++;
        } else {
          result.push(
            <p key={i} className="paragraph-text">
              {t(block.text)}
              {block.children?.map((child, idx) => (
                <StyledText key={idx} {...child} />
              ))}
            </p>
          );
        }
        break;
      }

      case "image":
        result.push(
          <div key={i} className="image-block">
            <img src={block.src} alt={block.alt || "Image"} className="responsive-image" />
          </div>
        );
        break;

      case "list": {
        const ListTag = block.style === "number" ? "ol" : "ul";
        result.push(
          <ListTag key={i} className="list-block">
            {block.items.map((item, idx) =>
              typeof item === "string" ? (
                <li key={idx}>{t(item)}</li>
              ) : (
                <li key={idx}>
                  {t(item?.text)}
                  {item.children?.map((child, childIdx) => (
                    <StyledText key={childIdx} {...child} />
                  ))}
                </li>
              )
            )}
          </ListTag>
        );
        break;
      }

      default:
        break;
    }
  }

  return result;
};

export const AppHelpContent = ({ config = {}, groupTextBlocks }) => {
  const { t } = useTranslation();

  return (
    <div>
      {config.sections.map((section, index) => (
        <div key={index} className="cmn-help-info-card-elements-wrapper" style={{ flexDirection: "column" }}>
          {section.heading && (
            <TextBlock
              caption={section?.heading?.caption && t(section.heading.caption)}
              header={section?.heading?.header && t(section.heading.header)}
              body={section?.heading?.body && t(section.heading.body)}
              subHeader={section?.heading?.subHeader && t(section.heading.subHeader)}
            />
          )}
          <RenderContent content={section.content} groupTextBlocks={groupTextBlocks} />
        </div>
      ))}
    </div>
  );
};

const HelpCard = ({ module, pathVar }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Fetch full help card config for the current page
  const selectedFeatureCriteria = useMemo(() => {
    return Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      "commonUiConfig",
      [
        {
          name: "HelpInfo",
          filter: `[?(@.module=='${module}'&&@.page=='${pathVar}')]`,
        },
      ],
      `MDMSDATA-${module}-HelpInfo-${pathVar}-data-config`,
      {
        enabled: !!module,
        ...Digit.Utils.campaign.getMDMSV1Selector("commonUiConfig", "HelpInfo"),
      }
    );
  }, [module, pathVar]);

  const { isLoading: isSelectedFeatureLoading, data } = Digit.Hooks.useCustomAPIHook(selectedFeatureCriteria);

  if (isSelectedFeatureLoading) return <Loader />;

  const config = data?.[0] || {};

  return (
    <AlertCard
      populators={{ name: "infocard" }}
      variant="default"
      className="cmn-help-info-card"
      label={config?.title && t(config.title)}
      additionalElements={[<AppHelpContent config={config}></AppHelpContent>]}
    />
  );
};

const HelpInfoCard = ({ config = helpCardConfig, appPath, location }) => {
  const { t } = useTranslation();
  const module = appPath?.split?.("/")?.[appPath?.split("/")?.length - 1];
  const pathVar = location.pathname.replace(`${appPath}/`, "").split("?")?.[0];
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Fetch page config for the module
  const selectedFeatureCriteria = useMemo(() => {
    return Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      "commonUiConfig",
      [
        {
          name: "HelpInfo",
          filter: `[?(@.module=='${module}')].page`,
        },
      ],
      `MDMSDATA-${module}-HelpInfo-data`,
      {
        enabled: !!module,
        ...Digit.Utils.campaign.getMDMSV1Selector("commonUiConfig", "HelpInfo"),
      }
    );
  }, [module]);

  const { isLoading: isSelectedFeatureLoading, data: selectedFeatureConfigs } = Digit.Hooks.useCustomAPIHook(selectedFeatureCriteria);

  const showHelpCard = selectedFeatureConfigs?.some((ele) => ele === pathVar);

  if (isSelectedFeatureLoading) return null;

  return showHelpCard ? <HelpCard module={module} pathVar={pathVar} /> : null;
};


export default HelpInfoCard;
