import React from "react";
import { useTranslation } from "react-i18next";
import { CardText, CardHeader, LinkLabel, Card } from "@egovernments/digit-ui-components";
import { CardSubHeader, CardSectionHeader, BreakLine, CardSectionSubText } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import FaqComponent from "../../citizen/FAQs/FaqComponent";

const CardC = ({ type, title, content, actions, style }) => {
  const ListTag = type === "number" ? "ol" : "ul";
  return (
    <div>
      {/* <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", margin: "16px", ...style }}> */}
      <CardSectionHeader>{title}</CardSectionHeader>
      <CardSectionSubText style={{ marginTop: "1rem" }}>{content}</CardSectionSubText>
      <div style={{ marginTop: "1rem" }}>
        {actions && (
          <ListTag>
            {actions.map((action, index) => (
              <li key={index} style={{ listStyleType: ListTag === "ul" ? "disc" : "auto", margin: "8px 0" }}>
                {action?.label ? <strong>{action?.label}:</strong> : null} {action.description}
              </li>
            ))}
          </ListTag>
        )}
      </div>
    </div>
  );
};

const FAQ = ({ key, title, content, faqs }) => {
  return (
    <div style={{ width: "100%" }}>
      <CardSectionHeader>{title}</CardSectionHeader>
      <CardSectionSubText style={{ marginTop: "1rem" }}>{content}</CardSectionSubText>
      <div style={{ width: "100%" }}>
        {faqs.map((faq, i) => (
          <FaqComponent key={"faq_" + i} question={faq.question} answer={faq.answer} lastIndex={i === faqs?.length - 1} />
        ))}
      </div>
    </div>
  );
};
const QuickSetup = ({ cardConfig }) => {
  const { t } = useTranslation();

  const moduleFaqs = [
    {
      question: "SANDBOX_FAQ_QUES_ONE",
      answer: "SANDBOX_FAQ_ANS_ONE",
    },
    {
      question: "SANDBOX_FAQ_QUES_TWO",
      answer: "SANDBOX_FAQ_ANS_TWO",
    },
    {
      question: "SANDBOX_FAQ_QUES_THREE",
      answer: "SANDBOX_FAQ_ANS_THREE",
    },
    {
      question: "SANDBOX_FAQ_QUES_FOUR",
      answer: "SANDBOX_FAQ_ANS_FOUR",
    },
  ];
  return (
    <Card className={"sandbox-guide"} style={{ width: "25rem", height: "47rem", overflowY: "scroll" }}>
      {/* <Card style={{ height: "47rem", overflowY: "scroll" }}> */}
      <CardHeader>Guide To Sandbox</CardHeader>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {cardConfig.map((config, index) => {
          return config?.type === "faqs" ? (
            <FAQ key={config.id} title={config.title} content={config.content} faqs={config.actions} />
          ) : (
            <React.Fragment>
              <CardC
                type={config?.type}
                key={config.id}
                title={config.title}
                content={config.content}
                actions={config.actions}
                style={config.style}
              />
              {index !== cardConfig?.length - 1 && <BreakLine style={{ width: "100%", border: "1px solid #d6d5d4" }} />}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickSetup;
