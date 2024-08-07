import React from "react";
import { DigitUIComponents, States } from "components"; // Import only the necessary component
const { Card } = DigitUIComponents;
const { useUserState } = States;
/**
 * PageOne Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 *
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const PageTwo = () => {
  const { setData, resetData, data } = useUserState();

  return (
    <Card type="primary">
      {" "}
      <h1>Hi {data?.name}</h1>
    </Card>
  );
};

export default PageTwo;
