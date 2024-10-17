import React from 'react'
import { Card } from '@egovernments/digit-ui-components';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';

const AssumptionsList = ({ customProps }) => {
    const {t}=useTranslation();
    const assumptionValues= customProps?.sessionData?.HYPOTHESIS.Assumptions?.assumptionValues

    let dic = {};
    for (const ob of assumptionValues) {
        if (!(ob?.category in dic)) {
            dic[ob.category] = [{ [ob?.key]: ob.value }]
        }else{
            dic[ob.category].push({ [ob?.key]: ob.value })
        }
    }








    return (
        <div>
            {
                Object.keys(dic).map((item, ind) => {
                    
                    return (
                        < Card key={`card_${ind}`} style={{ padding: '20px', marginBottom: '15px' }}>
                            <HeaderComp title={String(item)}/>
                            <div className="as-table-like">
                                {dic[item].map((item1, index) => {
                                    // Since each item1 is an object with a single key-value pair
                                    const [key, value] = Object.entries(item1)[0]; // Destructure the first and only key-value pair
                                    return (
                                        <div key={`pair_${index}`} className="as-table-row">
                                            <span className="as-table-cell as-key-cell">
                                                <strong>{t(key)}</strong> {/* Display key as label */}
                                            </span>
                                            <span className="as-table-cell as-value-cell">
                                                {t(value)} {/* Display value */}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })
            }


        </div >
    )
}

export default AssumptionsList