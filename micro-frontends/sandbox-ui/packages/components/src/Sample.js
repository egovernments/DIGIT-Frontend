import React from "react";
import TabForm from "./components/TabForm";
import StepperForm from "./components/StepperForm";

const SampleWithForm = () => {
  console.log("sample");

  const styles = {
    container: {
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      margin: '0 auto',
    },
    formSection: {
      marginBottom: '20px',
    },
    textCenter: {
      textAlign: 'center',
      fontSize: '16px',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <TabForm />
      </div>
      <div style={styles.textCenter}>
        yes
      </div>
      <div style={styles.formSection}>
        <StepperForm />
      </div>
    </div>
  );
};

export default SampleWithForm;
