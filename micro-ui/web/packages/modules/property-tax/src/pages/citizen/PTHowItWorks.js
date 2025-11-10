import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Accordion, AccordionList, BackLink, Card, Button } from "@egovernments/digit-ui-components";

const PTHowItWorks = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack();
  };

  const faqItems = [
    { question: "CS_HOWITWORKS_QUESTION1", answer: "CS_HOWITWORKS_ANSWER1" },
    { question: "CS_HOWITWORKS_QUESTION2", answer: "CS_HOWITWORKS_ANSWER2" },
    { question: "CS_HOWITWORKS_QUESTION3", answer: "CS_HOWITWORKS_ANSWER3" },
    { question: "CS_HOWITWORKS_QUESTION4", answer: "CS_HOWITWORKS_ANSWER4" },
    { question: "CS_HOWITWORKS_QUESTION5", answer: "CS_HOWITWORKS_ANSWER5" },
    { question: "CS_HOWITWORKS_QUESTION6", answer: "CS_HOWITWORKS_ANSWER6" },
    { question: "CS_HOWITWORKS_QUESTION7", answer: "CS_HOWITWORKS_ANSWER7" },
    { question: "CS_HOWITWORKS_QUESTION8", answer: "CS_HOWITWORKS_ANSWER8" },
    { question: "CS_HOWITWORKS_QUESTION9", answer: "CS_HOWITWORKS_ANSWER9" },
    { question: "CS_HOWITWORKS_QUESTION20", answer: "CS_HOWITWORKS_ANSWER10" },
    { question: "CS_HOWITWORKS_QUESTION11", answer: "CS_HOWITWORKS_ANSWER11" },
    { question: "CS_HOWITWORKS_QUESTION12", answer: "CS_HOWITWORKS_ANSWER12" }
  ];

  const punjabiVideos = [
    { url: "https://www.youtube.com/embed/5GpLiCYS584?rel=0", title: "CS_HOWITWORKS_PROPERTY_TAX_PAYMENT", desc: "CS_HOWITWORKS_PROPERTY_TAX_PAYMENT_DESCRIPTION" },
    { url: "https://www.youtube.com/embed/P9U3EGNxrKU?rel=0", title: "CS_HOWITWORKS__PARTIAL_PAY", desc: "CS_HOWITWORKS__PARTIAL_PAY_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/PKHSa33puxQ?rel=0", title: "CS_HOWITWORKS_ASSESSMENTS", desc: "CS_HOWITWORKS_ASSESSMENTS_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/uF_G9dk_GBY?rel=0", title: "CS_HOWITWORKS_ASSESSMENTS_INCOMPLETE", desc: "CS_HOWITWORKS_ASSESSMENTS_INCOMPLETE_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/8V1k-v93BRg?rel=0", title: "CS_HOWITWORKS_FULL_PAY", desc: "CS_HOWITWORKS_FULL_PAY_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/gw7bS_-7aM8?rel=0", title: "CS_HOWITWORKS_PROPERTY_PARTIAL_PAYMENT", desc: "CS_HOWITWORKS_PROPERTY_PARTIAL_PAYMENT_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/fVRd6ylStdY?rel=0", title: "CS_HOWITWORKS_PROPERTY_ASS", desc: "CS_HOWITWORKS_PROPERTY_ASS_DISCRIPTION" }
  ];

  const englishVideos = [
    { url: "https://www.youtube.com/embed/E0g26AzwRvs", title: "CS_HOWITWORKS_PROPERTY_HOMEPG_REG", desc: "CS_HOWITWORKS_PROPERTY_HOMEPG_REG_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/G2_EA0zTiM0", title: "CS_HOWITWORKS_PROPERTY_FLOOR_UNIT", desc: "CS_HOWITWORKS_PROPERTY_FLOOR_UNIT_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/UbmY5LmdiQc", title: "CS_HOWITWORKS_PROPERTY_ASS_PAY", desc: "CS_HOWITWORKS_PROPERTY_ASS_PAY_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/r6k7_J7jkYc", title: "CS_HOWITWORKS_PROPERTY_FULL_PAYMENT1", desc: "CS_HOWITWORKS_PROPERTY_FULL_PAYMENT1_DISCRIPTION" },
    { url: "https://www.youtube.com/embed/oQu4qDNWP7I", title: "CS_HOWITWORKS_PROPERTY_PARTIAL1_PAY", desc: "CS_HOWITWORKS_PROPERTY_EXPLAIN" },
    { url: "https://www.youtube.com/embed/3s6GtEWmf00", title: "CS_HOWITWORKS_PROPERTY_COMPLETE_ASS", desc: "CS_HOWITWORKS_PROPERTY_COMPLETE_ASS_VIDEO" },
    { url: "https://www.youtube.com/embed/mKLsORPO1o8", title: "CS_HOWITWORKS_PROPERTY_INCOMP_ASS", desc: "CS_HOWITWORKS_PROPERTY_INCOMP_ASS_VIDEO" }
  ];

  return (
    <div style={{ maxWidth: "100%" }}>
      <BackLink label={t("CS_COMMON_BACK")} onClick={handleBackClick} style={{ marginBottom: "24px" }} />

      <Card>
        {/* Punjabi Videos Section */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#484848", marginBottom: "16px" }}>
            {t("CS_HOWITWORKS_HELP_VIDEOS_PUNJABI") || "Help Videos (Punjabi)"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {punjabiVideos.map((video, index) => (
              <div key={index} style={{ minHeight: "270px" }}>
                <iframe
                  width="100%"
                  height="200"
                  src={video.url}
                  frameBorder="0"
                  allowFullScreen
                  style={{ borderRadius: "4px" }}
                  title={t(video.title)}
                />
                <h4 style={{ marginTop: "12px", fontSize: "16px", fontWeight: 600 }}>{t(video.title)}</h4>
                <p style={{ fontSize: "14px", color: "#505A5F" }}>{t(video.desc)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* English Videos Section */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#484848", marginBottom: "16px" }}>
            {t("CS_HOWITWORKS_HELP_VIDEOS_ENGLISH") || "Help Videos (English)"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {englishVideos.map((video, index) => (
              <div key={index} style={{ minHeight: "270px" }}>
                <iframe
                  width="100%"
                  height="200"
                  src={video.url}
                  frameBorder="0"
                  allowFullScreen
                  style={{ borderRadius: "4px" }}
                  title={t(video.title)}
                />
                <h4 style={{ marginTop: "12px", fontSize: "16px", fontWeight: 600 }}>{t(video.title)}</h4>
                <p style={{ fontSize: "14px", color: "#505A5F" }}>{t(video.desc)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Download Help Document Button */}
        <div>
          <Button
            label={t("PT_DOWNLOAD_HELP_DOCUMENT") || "Download Help Document"}
            variation="primary"
            type="button"
            onClick={() => {
              window.open("https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb/PT_User_Manual_Citizen.pdf", "_blank", "noopener,noreferrer");
            }}
          />
        </div>

        {/* FAQ Section */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#484848", marginBottom: "24px" }}>
            {t("PT_FAQ") || "Frequently Asked Questions"}
          </h2>
          <AccordionList>
            {faqItems.map((item, index) => (
              <Accordion
                key={index}
                title={t(item.question)}
                hideCardBorder={false}
                hideDivider={false}
              >
                {t(item.answer)}
              </Accordion>
            ))}
          </AccordionList>
        </div>
      </Card>
    </div>
  );
};

export default PTHowItWorks;
