import React from 'react';
import { Card } from '@egovernments/digit-ui-react-components';
import { Header } from '@egovernments/digit-ui-react-components';
import { useTranslation } from 'react-i18next';
const HeaderComp = ({ title,styles = {} }) => {
    // Define default styles
    const {t}=useTranslation();
    const defaultStyles = {
        marginTop: 0,
        fontSize: "1.5rem",
        color: "#0B4B66",
    };
    
    // Merge default styles with the custom styles passed as a prop
    const mergedStyles = { ...defaultStyles, ...styles };
    
    console.log("styles",mergedStyles)
   


    return (
        <div>
            {/* Apply the merged styles */}
            <Header className="header-comp-blue" style={mergedStyles}>
                {t(title)}
            </Header>
        </div>
    );
};

export default HeaderComp;
