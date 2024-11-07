import React, { Fragment } from 'react';
import { Header } from '@egovernments/digit-ui-react-components';
import { Button, Card, Divider, LabelFieldPair } from '@egovernments/digit-ui-components';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const AssumptionsList = ({ customProps, setupCompleted }) => {
    const { t } = useTranslation();
    const history = useHistory();

    const assumptionValues = customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues || [];

    const campaignAssumption = customProps?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm || {};

    let dic = {};

    for (const ob of assumptionValues) {
        const category = ob?.category || 'NA';
        const key = ob?.key || 'NA';
        const value = ob?.value || 'NA';

        if (!(category in dic)) {
            dic[category] = [{ [key]: value }];
        } else {
            dic[category].push({ [key]: value });
        }
    }

    const orderedKeys = ["selectedRegistrationProcess", "selectedDistributionProcess", "selectedRegistrationDistributionMode"];

    return (
        <div style={{ marginBottom: "2.5rem" }}>
            <Card className="middle-child">
                <Header className="summary-main-heading">{t(`MICROPLAN_ESTIMATION_ASSUMPTIONS_HEADING`)} </Header>
                {orderedKeys.map((key, index) => {
                    const assumption = campaignAssumption?.[key] || {};
                    const code = assumption.code || "NA";
                    const value = assumption.value || "NA";
                    return (
                        <>
                            <LabelFieldPair className="as-label-field" style={{ marginBottom: "0px" }}>
                                <span>
                                    <strong>{t(key)}</strong>
                                </span>
                                <span>{t(code)}</span>
                            </LabelFieldPair>
                        </>
                    );
                })}
            </Card>
            {Object.keys(dic).map((item, ind) => (
                <Card key={`card_${ind}`} className="middle-child">
                    {/* Header with title and edit button */}
                    <div className="mp-header-container">
                        <Header className="summary-sub-heading">
                            {t(String(item))}
                        </Header>
                        {!(setupCompleted === 'true') &&
                            <Button
                                label={t("WBH_EDIT")}
                                variation="secondary"
                                icon={"Edit"}
                                type="button"
                                onClick={(e) => {
                                    const urlParams = Digit.Hooks.useQueryParams();
                                    urlParams.key = '7';
                                    urlParams.internalKey = ind + 1;
                                    const updatedUrl = `${window.location.pathname}?${new URLSearchParams(urlParams).toString()}`;
                                    history.push(updatedUrl);
                                }}
                            />
                        }
                    </div>


                    {dic[item].map((item1, index) => {
                        const [key, value] = Object.entries(item1)[0] || ['NA', 'NA'];

                        return (
                            <>
                                <LabelFieldPair className="as-label-field" style={{ marginBottom: "0px" }}>
                                    <span >
                                        <strong>{t(key)}</strong>
                                    </span>
                                    <span >
                                        {t(value)}
                                    </span>
                                    {/* </div> */}
                                </LabelFieldPair>
                                {index < dic[item].length - 1 && (
                                    <Divider variant="small" />
                                )}
                            </>
                        );
                    })}

                </Card>
            ))}
        </div>
    );
};

export default AssumptionsList;
