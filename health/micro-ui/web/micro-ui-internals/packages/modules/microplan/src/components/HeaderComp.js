import React from 'react';
import { Card } from '@egovernments/digit-ui-react-components';
import { Header } from '@egovernments/digit-ui-react-components';
import { useTranslation } from 'react-i18next';
const HeaderComp = ({ title,styles = {} }) => {
    // Define default styles
    const {t}=useTranslation();
    // const defaultStyles = {
    //     marginTop: 0,
    //     fontSize: "3rem",
    //     color: "#0B4B66" !important

    // };
    
    // Merge default styles with the custom styles passed as a prop
    const mergedStyles = { ...styles };

    console.log(mergedStyles,"merged")
    
   


    return (
        
            <Header className="header-style"styles={mergedStyles}>
                {t(title)}
            </Header>
       
    );
};

export default HeaderComp;
