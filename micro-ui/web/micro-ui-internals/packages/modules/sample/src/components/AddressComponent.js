import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";


const AddressComponent = ({onSelect, ...props})=>{
   
     const {t} = useTranslation()
  
     const [addressData, setAddressData] = useState({
        tenantId:"",
        latitude:"",
        longitude:"",
        city:""
     })

   
     const handleUpdateField = (field, value)=>{
        setAddressData((prev)=>{
             return {
                ...prev,
                [field]:value
             }
          })
     }

     useEffect(()=>{
       onSelect("address", addressData)
     },[addressData])

    

     return (
        
          <div style={{background:"#eee", padding:"1.5rem", marginBottom:"1.5rem",border:"1px solid #d6d5d4",}}>
                <LabelFieldPair>
                    <div style={{width:"30%"}}>
                        <span>{`${t("Tenant ID*")}`}</span>
                    </div>
                    <TextInput 
                    style={{ background: "#FAFAFA", width: "100%" }} 
                    name="tenantId"
                    value={addressData.tenantId}
                    onChange={(event)=> handleUpdateField("tenantId", event.target.value)}
                    />
                </LabelFieldPair>

                <LabelFieldPair>
                    <div style={{width:"30%"}}>
                        <span>{t("Latitude*")}</span>
                    </div>
                    <TextInput
                    name="latitude"
                    style={{background:"#FAFAFA", width: "100%"}}
                     value={addressData.latitude}
                    onChange={(event)=>  handleUpdateField("latitude", event.target.value)}
                    />
                </LabelFieldPair>
                <LabelFieldPair>
                    <div style={{width:"30%"}}>
                        <span>{t("Longitude*")}</span>
                    </div>
                    <TextInput
                    name="longitude"
                    style={{background:"#FAFAFA"}}
                    value={addressData.longitude}
                    onChange={(event)=>  handleUpdateField("longitude", event.target.value)}
                    />
                </LabelFieldPair>
                <LabelFieldPair>
                    <div style={{width:"30%"}}>
                        <span>{t("City*")}</span>
                    </div>
                    <TextInput
                    name="city"
                    style={{background:"#FAFAFA"}}
                    value={addressData.city}
                    onChange={(event)=>  handleUpdateField("city", event.target.value)}
                    />
                </LabelFieldPair>
                
          </div>
         
        
        
     )
     

}

export default AddressComponent