import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, LabelFieldPair, DeleteIconv2, Button, } from "@egovernments/digit-ui-react-components";
import { Dropdown, CheckBox } from "@egovernments/digit-ui-components";
const datas = [
    ["GENERAL_ESTIMATION",
        "Number of households per boundary",
        "Number of bednets per boundary",
        "Number of bales per boundary"],
    [
        "HOUSEHOLD_REGISTRATION_INFORMATION",
        "Number of hosueholds registered",
        "Number of houdeholds registered per boundary",
        "Number of Supervisors per Boundary"
    ],
    [
        "CAMPAIGN_COMMODITIES",
        "Number of sticker rolls per boundary"
    ]
]
const FormulaConfiguration = ({ onSelect, category, customProps }) => {
    const { t } = useTranslation();
    const [estimationData, setEstimationData] = useState(datas)
    console.log("CProps",customProps.ruleConfigureOperators);
    return (
        <>

            <Card>
                <Header className="header-comp-blue" style={{ marginTop: 0, fontSize: "1.5rem", color: "#0B4B66" }}>{t("FORMULA_CONFIGURATION")}</Header>

            </Card>
            
                
                
                    {estimationData.map((itemz, index) => (
                        <Card>
                        {itemz.map((item, index) => {
                            if (index === 0) {
                                return (
                                    <Header key={index} className="header-comp-blue" style={{ marginTop: 0, fontSize: "1.5rem", color: "#0B4B66" }}>
                                        {t(item)}
                                    </Header>
                                );
                            } else {
                                return (
                                    <Card style={{background:"#FAFAFA"}} >
                                        {/* <Card style={{ margin: "0", padding: "0 1rem", background:"#eee", border:"0.1rem solid #ddd" }}> */}
                                        <LabelFieldPair className="formula-label-field" key={index}>
                                            <span>{`${t(item)}`}</span>
                                            <div className="equals-icon">=</div>
                                            <Dropdown
                                            // disabled={true}
                                                variant="select-dropdown"
                                                t={t}
                                                isMandatory={false}
                                                option={customProps.ruleConfigurations.map(item => ({
                                                    code: t(item.input),
                                                    label: item.input,
                                                }))}
                                                select={() => { }}
                                                selected={{
                                                    code:"Household Count",
                                                    label:"Household Count"
                                                }
                                                }
                                                optionKey="code"
                                                showToolTip={true}
                                                style={{ width: "30rem",background: "#EEEEEE" }}
                                            />
                                            <Dropdown
                                            disable={true}
                                                variant="select-dropdown"
                                                t={t}
                                                isMandatory={false}
                                                option={customProps.ruleConfigureOperators.map(item => ({
                                                    code: item.operatorName,
                                                    label: item.operatorName,
                                                }))}
                                                select={() => { }}
                                                selected={{
                                                    code:"Multiply",
                                                    label:"Multiply"
                                                }}
                                                optionKey="code"
                                                showToolTip={true}
                                                style={{ width: "20rem" }}
                                            />
                                            <Dropdown
                                            disable={true}
                                                variant="select-dropdown"
                                                t={t}
                                                isMandatory={false}
                                                option={customProps.ruleConfigurations1.map(item => ({
                                                    code: t(item.input),
                                                    label: item.input,
                                                }))}
                                                select={() => { }}
                                                selected={{
                                                    code:"Average People H/H",
                                                    label:"Average People H/H"
                                                }}
                                                optionKey="code"
                                                showToolTip={true}
                                                style={{ width: "25rem" }}
                                            />
                                            {/* <Button
                                                className="custom-class"
                                                icon={<DeleteIconv2 styles={{ height: "1.5rem", width: "2.5rem", margin: "0rem" }} />}
                                                iconFill=""
                                                label="Delete"
                                                size=""
                                                style={{ height: "50px", fontSize: "20px" }}
                                                title=""
                                                variation="secondary"
                                            /> */}
                                        </LabelFieldPair>
                                        <div style={{ background: "#eee", height: "0.2rem", marginBottom: "1rem" }}></div>
                                        </Card>
                                );
                            }
                        })}
                        </Card>
                    ))}
               
           


            {/* Third card */}


        </>
    )
}
export default FormulaConfiguration