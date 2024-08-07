import React from "react";
import * as DigitUIComponents from '@egovernments/digit-ui-components';

import CustomCard from "./CustomCard";
import mockData from './mockData.json'; // Assuming the JSON is saved as mockData.json
import './HomeScreen.css';
import useMDMSHook from "../../hooks/useMDMSHook";

const { InfoCard, Stepper, Button, Timeline, InfoButton, Card } = DigitUIComponents

const HomeScreen = () => {
    const tenantId = "pg"; // Replace with actual tenant ID
    const moduleDetails = [
      {
        moduleName: "SandBox",
        masterDetails: [{ name: "HomeScreen" }]
      }
    ];
  
    const { data, isLoading, error } = useMDMSHook({
      url: "/mdms-v2/v1/_search",
      moduleDetails,
      config: {
        select: (data) => data?.MdmsRes?.SandBox?.HomeScreen || [],
      },
      tenantId
    });
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;
  
    const cards = data || [];
  
    return (
      <div className="custom-card-container">
        {cards.map((card, index) => (
          <CustomCard key={index} card={card} />
        ))}
      </div>
    );
  };
  
  export default HomeScreen;