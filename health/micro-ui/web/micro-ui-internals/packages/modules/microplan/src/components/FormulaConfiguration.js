import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card,  Header, LabelFieldPair, DeleteIconv2, Button, } from "@egovernments/digit-ui-react-components";
import { Dropdown } from "@egovernments/digit-ui-components";

const titles = [
    "Number of households per boundary",
    "Number of bednets per boundary",
    "Number of bales per boundary"
  ]

const FormulaConfiguration = ({onSelect, formData, ...props})=>{

    const { t } = useTranslation();
    const [estimationTitles, setEstimationTitles] = useState(titles)
    
  return (
      <>
         <Card>
                <Header>{t("General estimation")}</Header>
                <p className="mp-description">{t(`Please configure the formula with respect to the assumptions considered for resource estimation`)}</p>
         </Card>   
         <Card>
            {estimationTitles.map((item, index)=>{
                return (
                    <LabelFieldPair className="label-field">
                        <span>{`${t(item)}`}</span>
                        <div className="equals-icon">=</div>
                        <Dropdown
                            variant="select-dropdown"
                            t={t}
                            isMandatory={false}
                            option={[{code:"Target population of the boundary",name:"TARGET POPULATION"}]}
                            
                            selected={null}
                            optionKey="code"
                            showToolTip={true}
                            style={{width:"35rem"}}
                        />

                            
                   
                         <Dropdown
                            variant="select-dropdown"
                            t={t}
                            isMandatory={false}
                            option={[{code:"Divide By",name:""}]}
                            selected={null}
                            optionKey="code"
                            showToolTip={true}
                            style={{width:"20rem"}}
                        />
                         <Dropdown
                            variant="select-dropdown"
                            t={t}
                            isMandatory={false}
                            option={[{code:"Average People/HH",name:""}]}
                            selected={null}
                            optionKey="code"
                            showToolTip={true}
                            style={{width:"25rem"}}
                        />
                        <Button
                            className="custom-class"
                            icon={<DeleteIconv2 styles={{ height: "1.5rem", width: "2.5rem", margin:"0rem   " }}/>}
                            iconFill=""
                            label="Delete"
                            size=""
                            style={{height:"50px", fontSize:"20px"}}
                            title=""
                            variation="secondary"
                            
                        />
                         
                    </LabelFieldPair>
                )
            })}
         </Card>
      </>
  )
}
export default FormulaConfiguration