import React from "react";
import{ useState } from "react";
import { useTranslation } from "react-i18next";
import { CardText, CardHeader, LinkLabel, Card, Button } from "@egovernments/digit-ui-components";
import { ArrowForward } from "@egovernments/digit-ui-svg-components";
import { CardSubHeader, CardSectionHeader, BreakLine, CardSectionSubText } from "@egovernments/digit-ui-react-components";

const FaqComponent = (props) => {
  const { question,isLabelLink, answer,type,actions,content, lastIndex } = props;
  const [isOpen, toggleOpen] = useState(false);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const ListTag = type === "number" ? "ol" : "ul";
  return (
    <div className="faqs border-none" onClick={() => toggleOpen(!isOpen)}>
      <div className="faq-question" style={{ justifyContent: "space-between", display: "flex" }}>
        <span>{t(question)}</span>
        <span className={isOpen ? "faqicon rotate" : "faqicon"} style={{ float: "right" }}>
          <ArrowForward />
        </span>
      </div>
      <div className="faq-answer" style={isOpen ? { display: "block" } : { display: "none" }}>
        <CardSectionSubText style={{ marginTop: "1rem" }}>{t(content)}</CardSectionSubText>
        <div style={{ marginTop: "1rem" }}>
        {actions && (
          <ListTag>
          {actions.map((action, index) => (
            <li key={index} style={{ listStyleType: ListTag === "ul" ? "disc" : "auto", margin: "8px 0" }}>
              {isLabelLink ? (
                action?.label ? (
                  <Button
                  variation="teritiary"
                  label={t(action?.label)}                  
                  type="button"
                  size={"medium"}
                  onClick={() => {
                    if (action?.fulllink) {
                      window.open(action?.link, "_blank");
                    } else {
                      const baseURL = `https://${window.location.hostname}/${window?.globalPath}/${tenantId}`;
                      window.open(`${baseURL}/${action?.link}`, "_blank");
                    }
                  }}
                  style={{ padding: "0px" }}
                />
                ) : null
              ) : (
                action?.label ? <strong>{t(action?.label)}:</strong> : null
              )} 
              {t(action?.description)}
            </li>
          ))}
        </ListTag>
        )}
      </div>
      </div>
      {!lastIndex ? <div className="cs-box-border" /> : null}
    </div>
  );
};

const CardC = ({ type, title, content, actions, style }) => {
  const { t } = useTranslation();
  const ListTag = type === "number" ? "ol" : "ul";
  return (
    <div>
      {/* <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", margin: "16px", ...style }}> */}
      <CardSectionHeader>{t(title)}</CardSectionHeader>
      <CardSectionSubText style={{ marginTop: "1rem" }}>{t(content)}</CardSectionSubText>
      <div style={{ marginTop: "1rem" }}>
        {actions && (
          <ListTag>
            {actions.map((action, index) => (
              <li key={index} style={{ listStyleType: ListTag === "ul" ? "disc" : "auto", margin: "8px 0" }}>
                {action?.label ? <strong>{t(action?.label)}:</strong> : null} {t(action?.description)}
              </li>
            ))}
          </ListTag>
        )}
      </div>
    </div>
  );
};

const FAQ = ({ key, title, content, faqs ,type}) => {
  const { t } = useTranslation();
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%" }}>
        {faqs.map((faq, i) => (
          <FaqComponent key={"faq_" + i} question={faq.question} answer={faq.answer} isLabelLink={faq.isLabelLink} type ={type} actions={faq.answer} content ={faq.content}lastIndex={i === faqs?.length - 1} />
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
      <CardHeader>{t("GUIDE_TO_SETUP")}</CardHeader>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {cardConfig.map((config, index) => {
          return config?.type === "faqs" ? (
            <FAQ key={config.id} title={config.title} type = {config?.type} content={config.content} faqs={config.actions} />
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