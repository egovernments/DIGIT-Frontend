import React from "react";
import * as DigitUIComponents from '@egovernments/digit-ui-components';
const { InfoCard, Stepper, Button, Timeline, InfoButton, Card ,DigitIcons} = DigitUIComponents
import './HomeScreen.css';
import { useTranslation } from "react-i18next";

import {
  TenantManagementIcon,
  AccountManagementIcon,
  DataConfigurationsIcon,
  // Add other icons
} from './CustomIcons';

const iconMapping = {
  "Tenant Management": <TenantManagementIcon />,
  "Account Management": <AccountManagementIcon />,
  "Data and Configurations": <DataConfigurationsIcon />,
  // Map other icons
};

const CustomCard = ({ card }) => {
  const { t } = useTranslation();
  const IconComponent = iconMapping[card.name] || null;

  return (
    <Card className="custom-card">
      <div className="custom-card-header">
        {IconComponent && <div className="custom-card-icon">{IconComponent}</div>}
        <h3 className="custom-card-name">{t(card.name)}</h3>
      </div>
      <p className="custom-card-description">{t(card.description)}</p>
      <button
        className="custom-card-button"
        onClick={() => window.location.href = card.navigationURL}
      >
        {t(card.buttonName)}
      </button>
    </Card>
  );
};

export default CustomCard;




