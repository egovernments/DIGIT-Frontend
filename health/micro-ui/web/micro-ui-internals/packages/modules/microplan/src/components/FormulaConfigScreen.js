import React, { useState, useEffect, Fragment } from 'react';
import FormulaSectionCard from './FormulaSectionCard';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';
import FormulaView from './FormulaView';
import { Loader, Button, Card  } from '@egovernments/digit-ui-components';

const FormulaConfigScreen = ({ customProps }) => {
   
    const { t } = useTranslation();
    const [planConfigurations, setPlanConfigurations] = useState(customProps?.sessionData?.FORMULA_CONFIGURATION?.formulaConfiguration?.formulaConfigValues);
    const [dictionary, setDictionary] = useState({});


    // Effect to populate `dic` based on `planConfigurations`
    useEffect(() => {
        if (planConfigurations && planConfigurations.length > 0) {
            const tempDic = {};
            planConfigurations.forEach((ob) => {
                if (!tempDic[ob.category]) {
                    tempDic[ob.category] = [{ ...ob }];
                } else {
                    tempDic[ob.category].push({ ...ob });
                }
            });
            setDictionary(tempDic); // Update `dic` with organized data
        }
    }, [planConfigurations, customProps]);

    // Loader condition based on `dic`
    if (Object.keys(dictionary).length < 1) {
        return <Loader />;
    }


    return (
        <>
            {Object.keys(dictionary).length > 0 && (
                Object.keys(dictionary).map((category) => (
                    <Fragment key={category}>
                        <HeaderComp title={t(String(category))} />
                        {dictionary[category].map((ob, index) => (
                            <Fragment key={index}>
                                <FormulaView
                                    output={ob.output}
                                    input1={ob.input}
                                    input2={ob.operatorName}
                                    input3={ob.assumptionValue}
                                />
                            </Fragment>
                        ))}
                    </Fragment>
                ))
            )}
            
        </>
    );
};

export default FormulaConfigScreen;
