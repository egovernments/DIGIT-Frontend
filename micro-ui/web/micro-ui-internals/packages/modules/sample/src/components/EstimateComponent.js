import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, TextInput,Dropdown, CheckBox } from "@egovernments/digit-ui-react-components";

const EstimateComponent = ({onSelect, ...props})=>{

    const {t} =useTranslation()
    

     const [estimateData, setEStimateData] = useState({
        sorId:"",
        category:"",
        name:"",
        description:"",
        unitRate:"",
        numberOfUnits:"",
        uom:"",
        length:"",
        width:"",
        isActive:false

     })
     const [category, setCategory] = useState([
         {code:"CATEGORY-01"},
         {code:"CATEGORY-01"},
         {code:"CATEGORY-01"}
     ])
     const [uomOPtions, setUomOPtions] = useState([
       {code:"METER", name:"meter"},
       {code:"KG", name:"kilo"},
       {code:"LITRE", name:"litre"}
     ])

      const handleUpdateField = (field, value)=>{
          setEStimateData((prev)=>{
             return {
                ...prev,
                [field]:value
             }
          })
      }
      useEffect(() => {
         onSelect("estimateDetails", estimateData);
       }, [estimateData]);
         

      

       

     return (
        <>
         <div style={{marginBottom:"1.5rem", background:"#eee", padding:"1.5rem", border:"1px solid  #d6d5d4", }}>
         <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("SOR ID*")}`}</span>
             </div>
             <TextInput 
              t={t}
              type={"text"}
              name="sorId"
              value={estimateData.sorId}
              onChange={(event)=> handleUpdateField("sorId", event.target.value)}
             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("Category*")}`}</span>
             </div>
             <Dropdown 
               style={{ width: "100%" }}
               t={t}
               option={category}
               optionKey={"code"}
               select={(value)=> handleUpdateField("category", value.code)}
               selected={category.find((i)=> i.code === estimateData.category)}
             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("name*")}`}</span>
             </div>
             <TextInput 
              t={t}
              type={"text"}
              isMandatory={true}
              name="name"
              value={estimateData.name}
              onChange={(event)=> handleUpdateField("name", event.target.value)}
             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("Description*")}`}</span>
             </div>
             <TextInput 
              t={t}
              type={"text"}
              isMandatory={true}
              name="description"
              value={estimateData.description}
              onChange={(event)=> handleUpdateField("description", event.target.value)}
             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("Unit Rate*")}`}</span>
             </div>
             <TextInput 
              t={t}
              type={"number"}
              isMandatory={true}
              name="unitRate"
              value={estimateData.unitRate}
              onChange={(event)=> handleUpdateField("unitRate", event.target.value)}
             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("No Of Units*")}`}</span>
             </div>
             <TextInput 
              t={t}
              type={"number"}
              isMandatory={true}
              name="noOfUnits"
              value={estimateData.noOfUnits}
              onChange={(event)=> handleUpdateField("noOfUnits", event.target.value)}
             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{t("UOM")}</span>
             </div>
             <Dropdown 
              style={{ width: "100%" }}
              option={uomOPtions}
              select={(value)=> handleUpdateField("uom", value.code)}
              selected={uomOPtions.find((i)=> i.code === estimateData.uom)}
              optionKey={"code"}

             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("length*")}`}</span>
             </div>
             <TextInput 
              t={t}
              type={"number"}
              isMandatory={true}
              name="length"
              value={estimateData.length}
              onChange={(event)=> handleUpdateField("length", event.target.value)}
             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("width*")}`}</span>
             </div>
             <TextInput 
              t={t}
              type={"number"}
              isMandatory={true}
              name="width"
              value={estimateData.width}
              onChange={(event)=> handleUpdateField("width", event.target.value)}
             />
          </LabelFieldPair>
          <LabelFieldPair>
             <div style={{width:"30%"}}>
                <span>{`${t("isActive*")}`}</span>
             </div>
             <CheckBox
               checked={estimateData.isActive}
               onChange={(event)=> handleUpdateField("isActive", event.target.checked)}
               name="isActive"
             />

          </LabelFieldPair>
        
         </div>
        
        </>
     )

}


export default EstimateComponent