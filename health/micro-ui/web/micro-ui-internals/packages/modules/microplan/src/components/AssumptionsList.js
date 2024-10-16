import React from 'react'

const AssumptionsList = ({ customProps }) => {

    const assumptionValues
            = customProps?.sessionData?.HYPOTHESIS.Assumptions?.
                assumptionValues
    console.log("assumptionsval",assumptionValues);

    let mapper={};
    for (const ob of assumptionValues){
        if(!(ob?.category in mapper) ){
            mapper[ob.category]=[{[ob?.key]:ob.value}]
        }
    }

    



    return (
        <div>


        </div>
    )
}

export default AssumptionsList