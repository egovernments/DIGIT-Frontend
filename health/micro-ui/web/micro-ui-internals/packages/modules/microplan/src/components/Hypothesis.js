import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, DeleteIconv2,LabelFieldPair, AddIcon,Button, CardText,} from "@egovernments/digit-ui-react-components";

import { TextInput, InfoCard ,  FieldV1,PopUp} from "@egovernments/digit-ui-components";
import { size } from "lodash";
import { PRIMARY_COLOR } from "../utils";

const hypothesisAssumptions = [
    "NO_OF_PEOPLE_PER_HOUSEHOLD",
    "NO_OF_BEDNETS_PER_HOUSEHOLD",
    "NO_OF_DISTRIBUTORS_PER_MONITOR"
  ]

const Hypothesis = ({onSelect, formData, ...props})=>{
 
    const [assumptions, setAssumptions] = useState(hypothesisAssumptions)
     const [assumptionValues, setAssumptionValues] = useState({});
  
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [startValidation, setStartValidation] = useState(null);
    const [showPopUP, setShowPopUp] = useState(false)
    const [assumptionToDelete, setAssumptionToDelete] = useState(null)
    console.log(assumptionValues)
    

 
    // useEffect(()=>{
    //   if(props?.props?.isSubmitting && !averagePeopleInHousehold){
    //     setError({message:"Enter average household size"})
    //   }else{
    //     setError(null)
    //   }
      
    // }, [averagePeopleInHousehold, props?.props?.sessionData?.HYPOTHESIS?.hypothesis])

    // useEffect(()=>{
    //   if(props?.props?.isSubmitting && !numberOfBednetsPerBale){
    //     setError({message:"Enter no. of bednets per bale"})
    //   }else{
    //     setError(null)
    //   }
       
    // }, [numberOfBednetsPerBale, props?.props?.sessionData?.HYPOTHESIS?.hypothesis])

    // useEffect(()=>{
    //   if(props?.props?.isSubmitting && !averagePeopleInHousehold){
    //     setError({message:"Enter average household size"})
    //   }else{
    //     setError(null)
    //   }
       
    // }, [numberOfPeoplePerBednet, props?.props?.sessionData?.HYPOTHESIS?.hypothesis])

        const handleDeleteClick = (index) => {
          setAssumptionToDelete(index); // Set the assumption index to delete
          setShowPopUp(true); 
        };

        const handleConfirmDelete = () => {
          if (assumptionToDelete !== null) {
            const updatedAssumptions = assumptions.filter((_, i) => i !== assumptionToDelete);
            setAssumptions(updatedAssumptions);
            setAssumptionToDelete(null); // Resetting assumption index
         }
         setShowPopUp(false);
        };
        const handleCancelDelete = () => {
          setShowPopUp(false); // Simply close the popup
        };

      
        const addNewAssumption = () => {
              
          setAssumptions([...assumptions, "Number of People per Bed net "]);
      
        };
      
         useEffect(()=>{
           onSelect("hypothesis", assumptionValues)
         }, [assumptionValues])
         
     return (
         <>
          
              <Card>
                <Header>{t("General Information")}</Header>
                <p className="mp-description">{t(`Please enter the values for each assumptions stated below for resource calculation`)}</p>
              </Card>   
                  
             
              <Card>

                    {assumptions.map((item, index)=>{

                        return (
                              <LabelFieldPair className="label-field" style={{marginTop:"1rem"}} key={index}>
                                    <span>{`${t(item)}`}</span>
                                    <div class="input-container">
                                        <TextInput 
                                          type="number"
                                          name={item}
                                          value={assumptionValues[item] || ""}
                                          error={error?.message ? t(error.message) : ""}
                                          style={{ width: "30rem", marginBottom: "0" }}
                                          populators={{ name: item }}
                                          id={index}
                                          onChange={(event) => {
                                            setStartValidation(true);
                                            setAssumptionValues((prev)=> ({...prev,[event.target.name]:event.target.value}))

                                          }}
                                            />
                                        <div className="delete-button">
                                          <DeleteIconv2 />
                                          <span  style={{color:"red",textDecoration:"Underline" }} onClick={()=> handleDeleteClick(index)}>Delete</span>
                                        </div>
                                        
                                    </div>
                            </LabelFieldPair>
                        
                          )
                    })}
                    <Button
                      className="custom-class"
                      icon={<AddIcon styles={{ height: "1.5rem", width: "1.5rem",}} fill={PRIMARY_COLOR}/>}
                      iconFill=""
                      label="Add new Assumption"
                      onButtonClick={()=> addNewAssumption()}
                      options={[]}
                      optionsKey=""
                      size=""
                      style={{height:"50px", fontSize:"20px"}}
                      title=""
                      variation="secondary"
                      
                    />
                    {showPopUP && <PopUp
                                    className={"popUpClass"}
                                    type={"default"}
                                    heading={t("Are you sure you want to Delete?")}
                                    equalWidthButtons={true}
                                      children={[
                                        <div>
                                          <CardText style={{ margin: 0 }}>{t("Deleting a line item will permanently delete the assumption. You will not be able to retrieve it")}</CardText>
                                        </div>,
                                      ]}
                                        onOverlayClick={() => {
                                          setShowPopUp(false)
                                        }}
                                      footerChildren={[
                                        <Button
                                          type={"button"}
                                          size={"large"}
                                          variation={"secondary"}
                                          label={t("Yes")}
                                          onButtonClick={() => {
                                            handleConfirmDelete()
                                          }}
                                        />,
                                        <Button
                                          type={"button"}
                                          size={"large"}
                                          variation={"primary"}
                                          label={t("No")}
                                          onButtonClick={handleCancelDelete}
                                        />,
                                      ]}
                                      sortFooterChildren={true}
                                      onClose={() => {
                                        setShowPopUp(false);
                                      }}
                          ></PopUp> }
              </Card>     
        </>

        
     ) 
   
  
     
      
}

export default Hypothesis