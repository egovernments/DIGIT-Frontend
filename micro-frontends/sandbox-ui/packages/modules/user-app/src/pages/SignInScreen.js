import React from "react";
import { DigitUIComponents } from "components"; // Import only the necessary component
// import { Sample } from "../components";
const { Card} = DigitUIComponents
/**
 * SignInScreen Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 * 
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const SignInScreen = () => {
  return <Card type="primary">SignInScreen</Card>;
};

export default SignInScreen;
