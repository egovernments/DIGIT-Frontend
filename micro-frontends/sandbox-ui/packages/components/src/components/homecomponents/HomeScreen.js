import React from "react";
import * as DigitUIComponents from '@egovernments/digit-ui-components';

import CustomCard from "./CustomCard";
import mockData from './mockData.json'; // Assuming the JSON is saved as mockData.json
import './HomeScreen.css';
import useMDMSHook from "../../hooks/useMDMSHook";

const { InfoCard, Stepper, Button, Timeline, InfoButton, Card ,isLoading, error} = DigitUIComponents

const HomeScreen = () => {
    const tenantId = "pg"; // Replace with actual tenant ID
    const moduleDetails = [
      {
        moduleName: "SandBox",
        masterDetails: [{ name: "HomeScreen" }]
      }
    ];
  
    const { data: mdms2 } = useMDMSHook({
      tenantId: "pg",
      moduleDetails: [
        {
          moduleName: "SandBox",
          masterDetails: [
            { name: "HomeScreen" },
          ],
        },
      ],
      url: "/mdms-v2/v1/_search",
    });
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;
  
    const cards = mdms2?.MdmsRes?.SandBox?.HomeScreen ?? [];
    console.log("Data from mdms is:", cards);
    return (
      <div className="custom-card-container">
        Hi in the homescreen
        {cards.map((card, index) => (
          <CustomCard key={index} card={card} />
        ))}
      </div>
    );
  };
  
  export default HomeScreen;