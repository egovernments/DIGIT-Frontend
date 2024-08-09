import React from "react";
import { DigitUIComponents, TabForm, StepperForm } from "components"; // Import only the necessary componen
const { Card } = DigitUIComponents;
/**
 * PageOne Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 *
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const FormPage = () => {
    return (
        <Card type="primary">
            <TabForm />
            <StepperForm />
        </Card>
    );
};

export default FormPage;
