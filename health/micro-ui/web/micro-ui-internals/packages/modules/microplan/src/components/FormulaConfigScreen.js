import React, { Fragment } from 'react'
import FormulaSectionCard from './FormulaSectionCard';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';
import FormulaView from './FormulaView';

const FormulaConfigScreen = ({ customProps }) => {
    const { t } = useTranslation();
    const planConfigurations1 = customProps?.sessionData?.PLANCONFIGURATION?.operations
    const planConfigurations = [
        {
            input: "input1",
            operator: "+",
            assumptionValue: "assumption1",
            output: "output1",
            showOnEstimationDashboard: true,
            category: "CATEGORY_1"
        },
        {
            input: "input2",
            operator: "+",
            assumptionValue: "assumption2",
            output: "output2",
            showOnEstimationDashboard: true,
            category: "CATEGORY_1"
        },
        {
            input: "input3",
            operator: "+",
            assumptionValue: "assumption3",
            output: "output3",
            showOnEstimationDashboard: true,
            category: "CATEGORY_2"
        },
        {
            input: "input4",
            operator: "+",
            assumptionValue: "assumption4",
            output: "output4",
            showOnEstimationDashboard: true,
            category: "CATEGORY_2"
        }
    ];

    // You can log or manipulate the array as needed
    console.log(planConfigurations);

    let dic = {};
    for (const ob of planConfigurations) {
        if (!(ob.category in dic)) {
            dic[String(ob.category)] = [{ ...ob }]
        } else {
            dic[String(ob.category)].push({ ...ob })
        }
    }
    console.log("dic1", dic);






    return (

        Object.keys(dic) && Object.keys(dic).map((item) => {
            debugger;
            return (
                <>
                    <HeaderComp title={t(item)} />

                    {dic[item].map((ob => {

                        return (
                            <>

                                <FormulaView
                                    output={ob.output}
                                    input1={ob.input}
                                    input2={ob.operator}
                                    input3={ob.assumptionValue}
                                />
                            </>

                        )
                    }))}
                </>
            )
        })

    )
}

export default FormulaConfigScreen