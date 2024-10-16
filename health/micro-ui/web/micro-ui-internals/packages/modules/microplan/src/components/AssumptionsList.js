import React from 'react'
import { Card } from '@egovernments/digit-ui-components';
import HeaderComp from './HeaderComp';

const AssumptionsList = ({ customProps }) => {

    const assumptionValues
        = customProps?.sessionData?.HYPOTHESIS.Assumptions?.
            assumptionValues
    console.log("assumptionsval", assumptionValues);

    let dic = {};
    for (const ob of assumptionValues) {
        if (!(ob?.category in dic)) {
            dic[ob.category] = [{ [ob?.key]: ob.value }]
        }else{
            dic[ob.category].push({ [ob?.key]: ob.value })
        }
    }

    console.log("dic",dic);







    return (
        <div>
            {
                Object.keys(dic).map((item, ind) => {
                    console.log(dic[item]);
                    debugger; 
                    return (
                        < Card key={`card_${ind}`} style={{ padding: '20px', marginBottom: '15px' }}>
                            <HeaderComp title={String(item)}/>
                            <div className="table-like1">
                                {dic[item].map((item1, index) => {
                                    // Since each item1 is an object with a single key-value pair
                                    const [key, value] = Object.entries(item1)[0]; // Destructure the first and only key-value pair
                                    debugger;
                                    return (
                                        <div key={`pair_${index}`} className="table-row1">
                                            <span className="table-cell key-cell1">
                                                <strong>{key}</strong> {/* Display key as label */}
                                            </span>
                                            <span className="table-cell value-cell1">
                                                {value} {/* Display value */}
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