import React, { Fragment, useState } from "react";
import Card from "../../atoms/Card";
import { Loader } from "../../atoms/Loader";
import { RenderDataSection, RenderDocumentsSection, RenderWfActions, RenderWfHistorySection } from "./renderUtils";
import HorizontalNav from "../../atoms/HorizontalNav";
import CardSubHeader from "../../atoms/CardSubHeader";
import { SVG } from "../../atoms/SVG";
import { useRef } from "react";

// format of data expected by this component

// {
//   cards:[
//     {
//       sections: [
//         {
//           type: "DATA",
//           sectionHeader: { value: "Section 1", inlineStyles: {} },
//           cardHeader: { value: "Card 2", inlineStyles: {} },
//           values: [
//             {
//               key: "key 1",
//               value: "value 1",
//             },
//             {
//               key: "key 2",
//               value: "value 2",
//             },
//             {
//               key: "key 3",
//               value: "value 3",
//             },
//           ],
//         },
//         {
//           type: "DATA",
//           sectionHeader: { value: "Section 2", inlineStyles: { marginTop: "2rem" } },
//           // cardHeader:{value:"Card 1",inlineStyles:{}},
//           values: [
//             {
//               key: "key 1",
//               value: "value 1",
//             },
//             {
//               key: "key 2",
//               value: "value 2",
//             },
//             {
//               key: "key 3",
//               value: "value 3",
//             },
//           ],
//         },
//         {
//           type: "DOCUMENTS",
//           documents: [
//             {
//               title: "WORKS_RELEVANT_DOCUMENTS",
//               BS: "Works",
//               values: [
//                 {
//                   title: "Proposal document",
//                   documentType: "PROJECT_PROPOSAL",
//                   documentUid: "cfed582b-31b0-42e9-985f-fb9bb4543670",
//                   fileStoreId: "cfed582b-31b0-42e9-985f-fb9bb4543670",
//                 },
//                 {
//                   title: "Finalised worklist",
//                   documentType: "FINALIZED_WORKLIST",
//                   documentUid: "f7543894-d3a1-4263-acb2-58b1383eebec",
//                   fileStoreId: "f7543894-d3a1-4263-acb2-58b1383eebec",
//                 },
//                 {
//                   title: "Feasibility analysis",
//                   documentType: "FEASIBILITY_ANALYSIS",
//                   documentUid: "c4fb4f5d-a4c3-472e-8991-e05bc2d671f5",
//                   fileStoreId: "c4fb4f5d-a4c3-472e-8991-e05bc2d671f5",
//                 },
//               ],
//             },
//           ],
//           inlineStyles: {
//             marginTop: "1rem",
//           },
//         },
//         {
//           type: "WFHISTORY",
//           businessService: "ESTIMATE",
//           applicationNo: "ES/2023-24/000828",
//           tenantId: "pg.citya",
//           timelineStatusPrefix: "TEST",
//         },
//         {
//           type: "WFACTIONS",
//           forcedActionPrefix: "TEST",
//           businessService: "ESTIMATE",
//           applicationNo: "ES/2023-24/000828",
//           tenantId: "pg.citya",
//           applicationDetails: {},
//           url: "/estimate/v1/_update",
//           moduleCode: "Estimate",
//           editApplicationNumber: undefined,
//         },
//       ],
//     },
//   ],
//   apiResponse:{},
//   additionalDetails:{}
// }

const renderCardSectionJSX = (section, cardErrors) => {
    const fieldId = Digit?.Utils?.getFieldIdName?.( section?.name || section?.type || "card-section")||"NA";
  
  const { type } = section;
  switch (type) {
    case "DATA":
      return <RenderDataSection section={section} id={fieldId}/>;
    case "DOCUMENTS":
      return <RenderDocumentsSection section={section} id={fieldId}/>;
    case "WFHISTORY":
      return <RenderWfHistorySection section={section} id={fieldId} />;
    case "WFACTIONS":
      return <RenderWfActions section={section} id={fieldId} />;
    case "COMPONENT":
      const Component = Digit.ComponentRegistryService.getComponent(section.component);
      return (
        <>
          <div className="view-composer-header-section" id={fieldId} >
            {section.cardHeader && (
              <CardSubHeader
                className={cardErrors?.filter((i) => i?.name === section?.name)?.length > 0 ? "error" : ""}
                style={section?.cardHeader?.inlineStyles}
              >
                {section.cardHeader.value}
                {cardErrors?.filter((i) => i?.name === section?.name)?.length > 0 ? <SVG.Error fill="#D4351C" /> : null}
              </CardSubHeader>
            )}
            {section.cardSecondaryAction ? section.cardSecondaryAction : null}
          </div>
          <Component {...section.props} cardErrors={cardErrors?.filter((i) => i?.name === section?.name)} />
        </>
      );
    default:
      return null;
  }
};

//data is the response of the hook call for View Screen
const ViewComposer = ({ isLoading = false, data, cardErrors, ...props }) => {
  const { cards } = data;
  const [activeNav, setActiveNav] = useState(data?.horizontalNav?.activeByDefault);
  const cardRefs = useRef([]);

  const scrollToCard = (index) => {
    if (cardRefs.current[index]) {
      const cardTopPosition = cardRefs.current[index].offsetTop;
      window.scrollTo({ top: cardTopPosition, behavior: "smooth" });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      {/* This first {} is for rendering cards at the top without navigationKey(out of navbar) */}
      {cards
        ?.filter((card) => !card?.navigationKey && card?.sections)
        ?.map((card, cardIdx) => {
          const { sections, noCardStyle } = card;
          const hasErrors = cardErrors?.[card?.errorName]?.filter((i) => i?.name === card?.name)?.length > 0;
          return (
            noCardStyle ?
              <div>
                {sections?.map((section, sectionIdx) => {
                  return renderCardSectionJSX(section, cardErrors?.[card?.errorName ? card?.errorName : card?.name]);
                })}
              </div> :
              <Card
                style={activeNav && card.navigationKey ? (activeNav !== card.navigationKey ? { display: "none" } : {}) : {}}
                className={`employeeCard-override ${card?.cardStyle ? card?.cardStyle : ""} ${hasErrors ? "card-error" : ""}`}
                ReactRef={hasErrors ? (el) => (cardRefs.current[cardIdx] = el) : null}>
                {hasErrors && scrollToCard(cardIdx)}
                {sections?.map((section, sectionIdx) => {
                  return renderCardSectionJSX(section, cardErrors?.[card?.errorName ? card?.errorName : card?.name]);
                })}
              </Card>
          );
        })}
      {/* This second section is for rendering cards that are part of the navBar) */}

      <HorizontalNav
        showNav={data?.horizontalNav?.showNav}
        configNavItems={data?.horizontalNav?.configNavItems}
        activeLink={activeNav}
        setActiveLink={setActiveNav}
        inFormComposer={false}
      >
        {cards
          ?.filter((card) => card?.navigationKey)
          ?.map((card, cardIdx) => {
            const { sections, noCardStyle } = card;
            return (
              noCardStyle ?
                <div style={activeNav && card.navigationKey ? (activeNav !== card.navigationKey ? { display: "none" } : {}) : {}}>
                  {sections?.map((section, sectionIdx) => {
                    return renderCardSectionJSX(section);
                  })}
                </div> :
                <Card style={activeNav && card.navigationKey ? (activeNav !== card.navigationKey ? { display: "none" } : {}) : {}} className={`employeeCard-override ${card?.cardStyle ? card?.cardStyle : ""}`}>
                  {sections?.map((section, sectionIdx) => {
                    return renderCardSectionJSX(section);
                  })}
                </Card>
            );
          })}
      </HorizontalNav>
    </>
  );
};

export default ViewComposer;
