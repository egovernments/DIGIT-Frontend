import React from "react";
import { DigitUIComponents } from "components"; // Import only the necessary component
import Drawer from "../../../../components/src/components/Drawer";

// import { Sample } from "../components";
const { Card } = DigitUIComponents;
/**
 * PageOne Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 *
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const PageOne = () => {
  return <Card type="primary"></Card>;
};

export default PageOne;
