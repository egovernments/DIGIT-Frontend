import React from 'react';
import { Card } from '@egovernments/digit-ui-react-components';
import { Header } from '@egovernments/digit-ui-react-components';
import { useTranslation } from 'react-i18next';
const HeaderComp = ({ title,styles = {} }) => {
    const {t}=useTranslation();
    // Merge default styles with the custom styles passed as a prop
    const mergedStyles = { ...styles };

    return (
        
            <Header className="header-style"styles={mergedStyles}>
                {t(title)}
            </Header>
       
    );
};

export default HeaderComp;
