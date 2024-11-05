import React, { useState, useEffect, Fragment } from 'react';
import FormulaSectionCard from './FormulaSectionCard';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';
import FormulaView from './FormulaView';
import { Loader, Button, Card } from '@egovernments/digit-ui-components';
import { useHistory } from 'react-router-dom';

const FormulaConfigScreen = ({ customProps, setupCompleted }) => {

    const { t } = useTranslation();
    const [planConfigurations, setPlanConfigurations] = useState(customProps?.sessionData?.FORMULA_CONFIGURATION?.formulaConfiguration?.formulaConfigValues);
    const [dictionary, setDictionary] = useState({});
    const history = useHistory();


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
                Object.keys(dictionary).map((category, ind) => (
                    <Fragment key={category}>
                        <div className="mp-header-container">
                            <HeaderComp title={t(String(category))} styles={{magingBottom:"1rem"}} />
                            {!(setupCompleted === 'true') &&
                                <Button
                                    label={t("WBH_EDIT")}
                                    variation="secondary"
                                    icon={"EditIcon"}
                                    type="button"
                                    onClick={(e) => {
                                        const urlParams = Digit.Hooks.useQueryParams();
                                        urlParams.key = '8';
                                        urlParams.formulaInternalKey = ind + 1;
                                        const updatedUrl = `${window.location.pathname}?${new URLSearchParams(urlParams).toString()}`;
                                        history.push(updatedUrl);
                                    }}
                                />
                            }
                        </div>
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
