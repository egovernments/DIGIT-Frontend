import React from "react";
import { DigitUIComponents } from "components"; // Import only the necessary component
import Sample from "../components/Sample";
import NetworkTest from "../components/NetworkTest";
const { Card } = DigitUIComponents;
/**
 * PageOne Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 *
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const PageThree = () => {
  return (
    <Card type="primary">
      <NetworkTest />
      <Sample />

    </Card>
  );
};

export default PageThree;
