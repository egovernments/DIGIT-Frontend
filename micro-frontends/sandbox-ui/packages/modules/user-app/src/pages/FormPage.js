import React from "react";
import { DigitUIComponents } from "components"; // Import only the necessary componen
import TabForm from "../../../../components/src/components/TabForm";
import StepperForm from "../../../../components/src/components/StepperForm";
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
            <TabForm></TabForm>
            <StepperForm></StepperForm>
        </Card>
    );
};

export default FormPage;
