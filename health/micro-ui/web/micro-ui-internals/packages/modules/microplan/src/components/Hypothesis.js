import React, { useState, useEffect,Fragment,useContext, useRef} from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, DeleteIconv2,LabelFieldPair, AddIcon,Button, CardText, } from "@egovernments/digit-ui-react-components";
import {Dropdown,FieldV1,PopUp,} from "@egovernments/digit-ui-components";
import { PRIMARY_COLOR } from "../utils/utilities"; 
import { useMyContext } from "../utils/context";
import { useAssumptionContext } from "./HypothesisWrapper";



const Hypothesis = ({ category, assumptions:initialAssumptions })=>{
 
  const { t } = useTranslation();
  const [error, setError] = useState({});
  const [showPopUP, setShowPopUp] = useState(false)
  const [assumptionsPopUP, setAssumptionsPopUp] = useState(false)
  const [assumptionToDelete, setAssumptionToDelete] = useState(null)
  const [assumptions, setAssumptions] = useState(initialAssumptions);
  const [selectedDeletedAssumption, setSelectedDeletedAssumption] = useState(null);
  const { assumptionValues, handleAssumptionChange, setAssumptionValues,setDeletedAssumptions, deletedAssumptions } = useAssumptionContext();
  const deletedAssumptionCategories = useRef({});
  const isAddNewDisabled = !deletedAssumptionCategories.current[category] || 
  deletedAssumptionCategories.current[category].length === 0 || 
  deletedAssumptionCategories.current[category].every(item => !deletedAssumptions.includes(item));
   

  const availableDeletedAssumptions = Array.from(new Set(
    (deletedAssumptionCategories.current[category] || []).filter(item =>
        deletedAssumptions.includes(item)
    )
));
    
     
    const handleDeleteClick = (index) => {
      setAssumptionToDelete(index); 
      setShowPopUp(true); 
    };

    const handleCancelDelete = () => {
      setShowPopUp(false); 
    };
    

    const handleConfirmDelete = () => {
      if (assumptionToDelete !== null) {
        const deletedAssumption = assumptions[assumptionToDelete];
        const updatedAssumptions = assumptions.filter((_, i) => i !== assumptionToDelete);
        const updatedAssumptionValues = assumptionValues.filter(
          (value) => value.key !== deletedAssumption
      );
    

        if (!deletedAssumptionCategories.current[category]) {
          deletedAssumptionCategories.current[category] = [];
          }
        deletedAssumptionCategories.current[category].push(deletedAssumption);
        

        setDeletedAssumptions([...deletedAssumptions, deletedAssumption]);
        setAssumptions(updatedAssumptions);
        setAssumptionValues(updatedAssumptionValues);
        setAssumptionToDelete(null); 
     }
     setShowPopUp(false);
    };


const addNewAssumption = () => {
  if (selectedDeletedAssumption) {
      const assumptionToAdd = deletedAssumptions.find(assumption => assumption === selectedDeletedAssumption.code);
      
      // **Check if it already exists**
      if (assumptionToAdd && !assumptions.includes(assumptionToAdd)) { 
          setAssumptions([...assumptions, assumptionToAdd]);
          setDeletedAssumptions(deletedAssumptions.filter((assumption) => assumption !== selectedDeletedAssumption.code));

          if (deletedAssumptionCategories.current[category]) {
              deletedAssumptionCategories.current[category] = deletedAssumptionCategories.current[category].filter(
                  (item) => item !== assumptionToAdd
              );
          }

          // **Conditionally Add to assumptionValues if not already present**
          if (!assumptionValues.some(assumption => assumption.key === assumptionToAdd)) {
              setAssumptionValues(prevValues => [
                  ...prevValues,
                  { key: assumptionToAdd, value: null } // or an initial value
              ]);
          }

          setSelectedDeletedAssumption(null);
          setAssumptionsPopUp(false);
      }
  }
};
        
    
         
    useEffect(() => {
      setAssumptions(initialAssumptions);
    }, [initialAssumptions]);
         
     return (
         <>
          
              <Card>
                <Header>{t(category)}</Header>
                <p className="mp-description">{t(`RESOURCE_CALCULATION`)}</p>
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


                                    <div className="fieldv1-container">
                                        <FieldV1 
                                          type="number"
                                          name={item}
                                          value={assumptionValues.find((assumption) => assumption.key === item)?.value || ""}
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
                                          <span  style={{color:"red",textDecoration:"Underline" }} onClick={()=> handleDeleteClick(index)}>{t("DELETE")}</span>
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
                      label={t("ADD_ASSUMPTION")}
                      onButtonClick={()=> setAssumptionsPopUp(true)}
                      options={[]}
                      optionsKey=""
                      size=""
                      style={{height:"50px", fontSize:"20px"}}
                      title=""
                      variation="secondary"
                      isDisabled={isAddNewDisabled}
                      
                    />
                    {showPopUP && <PopUp
                                    className={"popUpClass"}
                                    type={"default"}
                                    heading={t("CONFIRM_TO_DELETE")}
                                    equalWidthButtons={true}
                                      children={[
                                        <div>
                                          <CardText style={{ margin: 0 }}>{t("PERMANENT_DELETE")}</CardText>
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
                                          label={t("YES")}
                                          onButtonClick={() => {
                                            handleConfirmDelete()
                                          }}
                                        />,
                                        <Button
                                          type={"button"}
                                          size={"large"}
                                          variation={"primary"}
                                          label={t("NO")}
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
                                    heading={t("CONFIRM_NEW_ASSUMPTION")}
                                    equalWidthButtons={true}
                                      children={[
                                        <Dropdown
                                        variant="select-dropdown"
                                        t={t}
                                        isMandatory={false}
                                        option={availableDeletedAssumptions.map(item => ({ code: item }))}
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
                                          label={t("YES")}
                                          onButtonClick={() => {
                                            addNewAssumption()
                                          }}
                                        />,
                                        <Button
                                          type={"button"}
                                          size={"large"}
                                          variation={"primary"}
                                          label={t("NO")}
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

export default Hypothesis;