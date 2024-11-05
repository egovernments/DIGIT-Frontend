import React,{Fragment} from 'react';
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
                    <div className="mp-header-container">
                        <HeaderComp title={String(item)} />
                        {!(setupCompleted === 'true') &&
                            <Button
                                label={t("WBH_EDIT")}
                                variation="secondary"
                                icon={"EditIcon"}
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

                    <div>
                        {dic[item].map((item1, index) => {
                            const [key, value] = Object.entries(item1)[0] || ['NA', 'NA'];

                            return (
                                <>
                                <LabelFieldPair className="as-label-field" style={{marginBottom:"1rem"}}>
                                    <span >
                                        <strong>{t(key)}</strong>
                                    </span>
                                    <span >
                                        {t(value)}
                                    </span>
                                    {/* </div> */}
                                </LabelFieldPair>
                                {index < dic[item].length - 1 && (
                                    <div style={{ borderBottom: '1px solid #D3D3D3',marginBottom:"1rem" }}></div>
                                )}
                                </>
                            );
                        })}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default AssumptionsList;
