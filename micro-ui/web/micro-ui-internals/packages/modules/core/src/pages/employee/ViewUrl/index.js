import React from "react";
import { BackLink, Button, Card, CardHeader, CardText, FieldV1, SVG } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import Background from "../../../components/Background";

const ViewUrl = () => {
  const { t } = useTranslation();
  const email = "aaradhya.sahu@egov.org";

  // Inline styles
  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      margin: "auto",
    },
    cardHeader: {
      fontSize: "24px",
      color: "green",
      marginBottom: "20px",
    },
    cardText: {
      fontSize: "16px",
      color: "#333",
      marginBottom: "20px",
      textAlign: "center",
    },
    field: {
        width: "100%",
        marginBottom: "10px",
        backgroundColor: "white",  
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      },
    sandboxUrl: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    button: {
      backgroundColor: "#ff6600",
      color: "white",
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      marginTop: "20px",
    },
    copyButton: {
      backgroundColor: "#ff6600",
      color: "white",
      padding: "5px 10px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
    },
    footer: {
      marginTop: "20px",
      textAlign: "center",
    },
  };

  return (
    <Background>
      <div className="employeeBackbuttonAlign">
        <BackLink />
      </div>
      <Card style={styles.card}>
        <SVG.TickMark />
        <CardHeader style={styles.cardHeader}>Congratulations !</CardHeader>
        <CardText style={styles.cardText}>
          Your account has been successfully created
        </CardText>
        <FieldV1
          style={styles.field}
          withoutLabel={false}
          label={"Sandbox URL"}
          type="text"
          nonEditable={true}
          value={email}
          placeholder={t("HCM_START_DATE")}
          populators={{}}
        />
        <div>Your sandbox URL has been sent to your mail ID for reference</div>
        <Button style={styles.button}>Continue</Button>
      </Card>
      <div style={styles.footer}>
        <img
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />
      </div>
    </Background>
  );
};

export default ViewUrl;


