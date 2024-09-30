import React, { useState, useEffect,Fragment,useContext} from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, DeleteIconv2,LabelFieldPair, AddIcon,Button, CardText, } from "@egovernments/digit-ui-react-components";
import {Dropdown,FieldV1,PopUp,} from "@egovernments/digit-ui-components";
import { PRIMARY_COLOR } from "../utils/utilities";
import { useMyContext } from "../utils/context";
import { useAssumptionContext } from "./HypothesisWrapper";



const Hypothesis = ({ category, assumptions:initialAssumptions, customProps, onSelect, })=>{
 
  
   
  
    const { t } = useTranslation();
    const [error, setError] = useState({});
    const [startValidation, setStartValidation] = useState(false);
    const [showPopUP, setShowPopUp] = useState(false)
    const [assumptionsPopUP, setAssumptionsPopUp] = useState(false)
    const [assumptionToDelete, setAssumptionToDelete] = useState(null)
    const { state, dispatch } = useMyContext();
    const [assumptions, setAssumptions] = useState(initialAssumptions);
    const [deletedAssumptions, setDeletedAssumptions] = useState([]);
    const [selectedDeletedAssumption, setSelectedDeletedAssumption] = useState(null);
    const { assumptionValues, handleAssumptionChange, setAssumptionValues } = useAssumptionContext();
    const maxAssumptions = initialAssumptions.length;

        //  useEffect(()=>{
        //     onSelect(customProps.name, { assumptionValues });
        //   },[assumptionValues])

      //   useEffect(() => {
      //     setAssumptions(initialAssumptions.filter(item => !deletedAssumptions.includes(item)));
      // }, [initialAssumptions, deletedAssumptions]);
      

      

      console.log("assumptionform values are", assumptionValues )

         
        useEffect(() => {
          setAssumptions(initialAssumptions);
        }, [initialAssumptions]);


        //   useEffect(() => {
        //     if (customProps.isSubmitting) {
        //           validateFields(); 
        //     }
        // }, [customProps.isSubmitting, assumptions, assumptionValues]);

          //   const validateFields = () => {
          //     const newError = {};
          //     assumptions.forEach((item) => {
          //         const value = assumptionValues.find((assumption) => assumption.key === item)?.value;
          //         if (!value) {
          //             newError[item] = "This field is required"; 
          //         }
          //     });

          //     setError(newError); 
          // };

    
        
   
        const handleDeleteClick = (index) => {
          setAssumptionToDelete(index); 
          setShowPopUp(true); 
        };

        const handleConfirmDelete = () => {
          if (assumptionToDelete !== null) {
            const deletedAssumption = assumptions[assumptionToDelete];
            const updatedAssumptions = assumptions.filter((_, i) => i !== assumptionToDelete);
            const updatedAssumptionValues = assumptionValues.filter(
              (value) => value.key !== deletedAssumption
          );
            

            setDeletedAssumptions([...deletedAssumptions, deletedAssumption]);
            setAssumptions(updatedAssumptions);
            setAssumptionValues(updatedAssumptionValues);
            setAssumptionToDelete(null); 
         }
         setShowPopUp(false);
        };
        const handleCancelDelete = () => {
          setShowPopUp(false); 
        };

      
        const addNewAssumption = () => {
         
          if (selectedDeletedAssumption) {
            const assumptionToAdd = deletedAssumptions.find(assumption => assumption === selectedDeletedAssumption.code);
            if (assumptionToAdd) {
              setAssumptions([...assumptions, assumptionToAdd]);
              setDeletedAssumptions(deletedAssumptions.filter((assumption) => assumption !== selectedDeletedAssumption.code));
              setAssumptionValues((prevValues) => {
                return prevValues.filter((value) => value.key !== assumptionToAdd);
              });
              setSelectedDeletedAssumption(null);
              setAssumptionsPopUp(false);
        };
      
      };

   };   
      console.log(customProps)
         
         
     return (
         <>
          
              <Card>
                <Header>{t(category)}</Header>
                <p className="mp-description">{t(`Please enter the values for each assumptions stated below for resource calculation`)}</p>
              </Card>   
                  
             
              <Card>

                    {assumptions.map((item, index)=>{

                        return (
                              <LabelFieldPair className="assumptions-label-field" style={{marginTop:"1rem"}} key={index}>
                                    <div style={{display:"flex"}}>
                                    <span>{`${t(item)}`}
                                    <span className="mandatory-span">*</span>
                                    </span>
                               
                                    </div>


                                    <div class="input-container">
                                        <FieldV1 
                                          type="number"
                                          name={item}
                                          value={assumptionValues.find((assumption) => assumption.key === item)?.value || ""}
                                          //error={error[item] ? t(error[item]) : ""}
                                          error={""}
                                          style={{marginBottom: "0" }}
                                          populators={{ name: item }}
                                          id={index}
                                          onChange={(event) => {
                                            
                                            handleAssumptionChange(category,event, item);
                                          
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

                <div style={{background:"#eee", height:"0.2rem", marginBottom:"1.5rem"}}></div>
                    <Button
                      className="custom-class"
                      icon={<AddIcon styles={{ height: "1.5rem", width: "1.5rem",}} fill={PRIMARY_COLOR}/>}
                      iconFill=""
                      label="Add new Assumption"
                      onButtonClick={()=> setAssumptionsPopUp(true)}
                      options={[]}
                      optionsKey=""
                      size=""
                      style={{height:"50px", fontSize:"20px"}}
                      title=""
                      variation="secondary"
                      isDisabled={assumptions.length >= maxAssumptions || deletedAssumptions.length === 0}
                      
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

                    {assumptionsPopUP && <PopUp
                                    className={"popUpClass"}
                                    type={"default"}
                                    heading={t("Are you sure you want to add a new assumption?")}
                                    equalWidthButtons={true}
                                      children={[
                                        <Dropdown
                                        variant="select-dropdown"
                                        t={t}
                                        isMandatory={false}
                                        option={deletedAssumptions?.map((item)=> ({code:item}))}
                                        select={(value)=>{
                                          setSelectedDeletedAssumption(value)
                                         }}
                                        selected={selectedDeletedAssumption}
                                        optionKey="code"  
                                        showToolTip={true}
                                        placeholder={t("SELECT_OPTION")}
                                        onChange={(e) => setSelectedDeletedAssumption(e.target.value)}
                                        optionCardStyles={{ position: "relative" }}
                                        />
                                      ]}
                                        onOverlayClick={() => {
                                          setAssumptionsPopUp(false)
                                        }}
                                      footerChildren={[
                                        <Button
                                          type={"button"}
                                          size={"large"}
                                          variation={"secondary"}
                                          label={t("Yes")}
                                          onButtonClick={() => {
                                            addNewAssumption()
                                          }}
                                        />,
                                        <Button
                                          type={"button"}
                                          size={"large"}
                                          variation={"primary"}
                                          label={t("No")}
                                          onButtonClick={()=> {
                                            setAssumptionsPopUp(false)
                                          }}
                                        />,
                                      ]}
                                      sortFooterChildren={true}
                                      onClose={() => {
                                        setAssumptionsPopUp(false)
                                      }}
                          ></PopUp> }
              </Card>     
        </>

        
     ) 
   
  
     
      
}

export default Hypothesis