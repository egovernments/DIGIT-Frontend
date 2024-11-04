import React from 'react';
import { Button, Card, LabelFieldPair } from '@egovernments/digit-ui-components';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const AssumptionsList = ({ customProps, setupCompleted }) => {
    const { t } = useTranslation();
    const history = useHistory();

    const assumptionValues = customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues || [];
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

    return (
        <div>
            {Object.keys(dic).map((item, ind) => (
                <Card key={`card_${ind}`} style={{ padding: '20px', marginBottom: '15px' }}>
                    {/* Header with title and edit button */}
                    <div className="header-container">
                        <HeaderComp title={String(item)} />
                        {!(setupCompleted === 'true') &&
                            <Button
                                label={t("WBH_EDIT")}
                                variation="secondary"
                                icon={"EditIcon"}
                                type="button"
                                className="dm-workbench-download-template-btn dm-hover"
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

                    <div>
                        {dic[item].map((item1, index) => {
                            const [key, value] = Object.entries(item1)[0] || ['NA', 'NA'];

                            return (
                                <LabelFieldPair className="as-label-field">


                                    {/* <div key={`pair_${index}`} className="as-table-row" style={{ borderBottom: '1px solid #e0e0e0' }} > */}
                                    {/* className="as-table-cell as-key-cell"
                                    className="as-table-cell as-value-cell" */}
                                    <span >
                                        <strong>{t(key)}</strong>
                                    </span>
                                    <span >
                                        {t(value)}
                                    </span>
                                    {/* </div> */}
                                </LabelFieldPair>
                            );
                        })}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default AssumptionsList;
