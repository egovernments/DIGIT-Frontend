import React, { useState, useEffect, Fragment } from 'react';
import FormulaSectionCard from './FormulaSectionCard';
import { useTranslation } from 'react-i18next';
import FormulaView from './FormulaView';
import { Loader, Button, Card } from '@egovernments/digit-ui-components';
import { Header } from '@egovernments/digit-ui-react-components';
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
        <div style={{ marginBottom: "1.5rem" }}>
            <Card className="middle-child">
                <Header className="summary-main-heading">{t(`MICROPLAN_FORMULA_CONFIGURATION_HEADING`)} </Header>
            </Card>
            {Object.keys(dictionary).length > 0 && (
                Object.keys(dictionary).map((category, ind) => (
                    <Card key={category} className="middle-child">
                        <div className="mp-header-container">
                            <Header className="summary-sub-heading">
                                {t(String(category))}
                            </Header>
                            {!(setupCompleted === 'true') &&
                                <Button
                                    label={t("WBH_EDIT")}
                                    title={t("WBH_EDIT")}
                                    variation="secondary"
                                    icon={"Edit"}
                                    size="medium"
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
                    </Card>
                ))
            )}

        </div>
    );
};

export default FormulaConfigScreen;
