
import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card,  Header, LabelFieldPair, DeleteIconv2, Button, } from "@egovernments/digit-ui-react-components";
import { Dropdown, CheckBox } from "@egovernments/digit-ui-components";

const data = [
    "Number of households per boundary",
    "Number of bednets per boundary",
    "Number of bales per boundary"
  ]

const FormulaConfiguration = ({onSelect,  category,  customProps})=>{

    const { t } = useTranslation();
    const [estimationData, setEstimationData] = useState(data)
    
  return (
      <>
         <Card>
                <Header>{t("General estimation")}</Header>
                <p className="mp-description">{t(`Please configure the formula with respect to the assumptions considered for resource estimation`)}</p>
         </Card>   
         <Card>
            {estimationData.map((item, index)=>{
                return <>
                        <Card style={{ margin: "0", padding: "0 1rem", background:"#eee", border:"0.1rem solid #ddd" }}>
                            <LabelFieldPair className="formula-label-field">
                            <span>{`${t(item)}`}</span>
                            <div className="equals-icon">=</div>
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={false}
                                option={customProps.ruleConfigurations.map(item => ({
                                    code: t(item.input),
                                    label: item.input
                                  })) }
                                select={()=> {}}
                                selected={null}
                                optionKey="code"
                                showToolTip={true}
                                style={{width:"30rem"}}
                            />

                                
                    
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={false}
                                option={customProps.ruleConfigureOperators.map(item => ({
                                    code: item.operatorName,
                                    label: item.operatorName 
                                  })) }
                                select={()=> {}}
                                selected={null}
                                optionKey="code"
                                showToolTip={true}
                                style={{width:"20rem"}}
                            />
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={false}
                                option={estimationData.map((item)=> ({code:item}))}
                                select={()=> {}}
                                selected={null}
                                optionKey="code"
                                showToolTip={true}
                                style={{width:"25rem"}}
                            />
                            <Button
                                className="custom-class"
                                icon={<DeleteIconv2 styles={{ height: "1.5rem", width: "2.5rem", margin:"0rem" }}/>}
                                iconFill=""
                                label="Delete"
                                size=""
                                style={{height:"50px", fontSize:"20px"}}
                                title=""
                                variation="secondary"
                                
                            />
                            
                        </LabelFieldPair>
                        </Card>
                        <CheckBox
              //key={field.key}
              mainClassName={"checkboxOptionVariant"}          
              //disabled={optionDependency ? true: false}
              label={t("Show on Estimation Dashboard")}
              //checked={optionComment}
             // onChange={(event) => handleOptionComment(optionId)}
              isLabelFirst={false}
              //index={field.key}

              
              />
                        <div style={{background:"#eee", height:"0.2rem", marginBottom:"1rem"}}></div>
                      </>
            })}
         </Card>
      </>
  )
}
export default FormulaConfiguration