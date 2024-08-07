import React from "react";
import * as DigitUIComponents from '@egovernments/digit-ui-components';

const { InfoCard, Stepper, Button, Timeline, InfoButton, Card ,DigitIcons} = DigitUIComponents
import './HomeScreen.css';

const CustomCard = ({ card }) => {

  return (
    <Card className="custom-card">
      <p className="custom-card-description">{card.description}</p>
      <button
        className="custom-card-button"
        onClick={() => window.location.href = card.navigationURL}
      >
        {card.buttonName}
      </button>
    </Card>
  );
};

export default CustomCard;





