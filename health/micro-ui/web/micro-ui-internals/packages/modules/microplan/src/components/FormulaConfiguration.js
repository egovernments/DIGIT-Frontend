
import React, { useState, useEffect,Fragment,useContext, useRef} from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, DeleteIconv2,LabelFieldPair, AddIcon,Button, CardText, } from "@egovernments/digit-ui-react-components";
import { Dropdown, CheckBox,PopUp } from "@egovernments/digit-ui-components";
import { PRIMARY_COLOR } from "../utils/utilities";
import { useFormulaContext } from "./FormulaConfigWrapper";


const FormulaConfiguration = ({onSelect,  category,  customProps, formulas:initialFormulas})=>{

  const { t } = useTranslation();
  const [showPopUP, setShowPopUp] = useState(false)
  const [formulasPopUP, setFormulasPopUp] = useState(false)
  const [formulaToDelete, setFormulaToDelete] = useState(null)
  const [formulas, setFormulas] = useState(initialFormulas)
  const [selectedDeletedFormula, setSelectedDeletedFormula] = useState(null);
  const { formulaConfigValues, handleFormulaChange, setFormulaConfigValues, deletedFormulas, setDeletedFormulas, planObject} = useFormulaContext();
  const deletedFormulaCategories = useRef({});
  const isAddNewDisabled = !deletedFormulaCategories.current[category] || 
  deletedFormulaCategories.current[category].length === 0 || 
  deletedFormulaCategories.current[category].every(item => !deletedFormulas.includes(item));

  const availableDeletedFormulas = Array.from(new Set(
    (deletedFormulaCategories.current[category] || []).filter(item =>
        deletedFormulas.includes(item)
    )
));



useEffect(()=>{
  setFormulas(initialFormulas)
}, [initialFormulas])


const handleDeleteClick = (index) => {
  setFormulaToDelete(index); 
  setShowPopUp(true); 
};

const handleCancelDelete = () => {
  setShowPopUp(false); 
};


const handleConfirmDelete = () => {
  if (formulaToDelete !== null) {
    const deletedFormula = formulas[formulaToDelete];
    const updatedFormulas = formulas.filter((_, i) => i !== formulaToDelete);
    
    if (!deletedFormulaCategories.current[category]) {
      deletedFormulaCategories.current[category] = [];
      }
    deletedFormulaCategories.current[category].push(deletedFormula.output);

   
    
    setDeletedFormulas(prev => [...prev, deletedFormula.output]);

    
    setFormulaConfigValues((prevValues) => 
      prevValues.filter((value) => value.output !== deletedFormula.output)
     );

   
    setFormulas(updatedFormulas);
   
    setFormulaToDelete(null); 
 }

 setShowPopUp(false);
};


const addNewFormula = () => {
  if (selectedDeletedFormula) {
      const formulaToAdd = deletedFormulas.find(formula => formula === selectedDeletedFormula.code);
      
      
      // **Check if it already exists**
      if (formulaToAdd && !formulas.some(formula => formula.output === formulaToAdd)) { 
          setFormulas([...formulas, { output: formulaToAdd,category:category, input: '', operatorName: '', assumptionValue:"" }]);
          setDeletedFormulas(deletedFormulas.filter((formula) => formula !== selectedDeletedFormula.code));

          if (deletedFormulaCategories.current[category]) {
              deletedFormulaCategories.current[category] = deletedFormulaCategories.current[category].filter(
                  (item) => item !== formulaToAdd
              );
          }

          // **Conditionally Add to formulaConfigValues if not already present**
          if (!formulaConfigValues.some(formula =>  formula.output === formulaToAdd)) {
              setFormulaConfigValues(prevValues => [
                  ...prevValues,
                  {  source:"MDMS", output: formulaToAdd, input: '', operatorName: '', assumptionValue:"", category:category }// or an initial value
              ]);
          }

          setSelectedDeletedFormula(null);
          setFormulasPopUp(false);
      }
  }
};
const {filteredInputs, filteredOutputs, operators, assumptions} = customProps

const filteredFormulas = formulaConfigValues.filter(formula => formula.category === category);

const filteredFormulaOutputs = filteredFormulas.map(formula => formula.output);

    
  return (
      <>
         <Card>
                <Header>{t(category)}</Header>
                <p className="mp-description">{t(`Please configure the formula with respect to the assumptions considered for resource estimation`)}</p>
         </Card>   
         <Card>
            {filteredFormulas.map((formula, index)=>{
              // Gather outputs from previous formulas
              const previousOutputs = filteredFormulas
              .slice(0, index) // Get outputs of all previous formulas
              .map(prevFormula => prevFormula.output); // Extract outputs

                // Combine with filteredInputs for dropdown options
                const inputOptions = [
                    ...filteredInputs.map(input => ({ code: input, label: input })),
                    ...previousOutputs.map(output => ({ code: output, label: output })),
                ];
                return <>
                        <Card style={{ margin: "0", padding: "0 1rem", background:"#eee", border:"0.1rem solid #ddd" }}>
                            <LabelFieldPair className="formula-label-field">
                            <span>{`${t(formula.output)}`}</span>
                            <div className="equals-icon">=</div>
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={true}
                                option={inputOptions}
                                select={(value)=>{
                                  handleFormulaChange(formula.output,"input", value, category)
                                }}
                                selected={()=> ({code:formula.input})}
                                optionKey="code"
                                showToolTip={true}
                                style={{width:"20rem"}}
                            />

                                
                    
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={false}
                                option={operators.map(operator => ({
                                    code: operator.operatorCode,
                                    label:operator.operatorName 
                                  })) }
                                select={(value)=>{
                                  handleFormulaChange(formula.output,"operatorName", value, category)
                                }}
                                selected={()=> ({label:formula.operatorName})}
                                optionKey="label"
                                showToolTip={true}
                                style={{width:"10rem"}}
                            />
                            <Dropdown
                                variant="select-dropdown"
                                t={t}
                                isMandatory={false}
                                option={assumptions.map((assumptionValue)=>({
                                  code:assumptionValue,
                                  label:assumptionValue
                                }))}
                                select={(value)=>{
                                  handleFormulaChange(formula.output,"assumptionValue",value,category)
                                } }
                                selected={()=> ({code:formula.assumptionValue})}
                                optionKey="code"
                                showToolTip={true}
                                style={{width:"15rem"}}
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
                                onButtonClick={()=> handleDeleteClick(index)}
                                
                            />
                            
                        </LabelFieldPair>
                        </Card>
                        <CheckBox
              //key={field.key}
              mainClassName={"checkboxOptionVariant"}          
              label={t("Show on Estimation Dashboard")}
              checked={formula.showOnEstimationDashboard ? true : false}
              onChange={(event) => handleFormulaChange(formula.output, "showOnEstimationDashboard", !formula.showOnEstimationDashboard, category)}
              isLabelFirst={false}
           

              
              />
                        <div style={{background:"#eee", height:"0.2rem", marginBottom:"1rem"}}></div>
                      
                      </>
            })}
              <Button
                      className="custom-class"  
                      icon={<AddIcon styles={{ height: "1.5rem", width: "1.5rem",}} fill={PRIMARY_COLOR}/>}
                      iconFill=""
                      label={t("ADD_NEW_FORMULA")}
                      onButtonClick={()=>setFormulasPopUp(true)}
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

                        {formulasPopUP && <PopUp
                                    className={"popUpClass"}
                                    type={"default"}
                                    heading={t("CONFIRM_NEW_FORMULA")}
                                    equalWidthButtons={true}
                                      children={[
                                        <Dropdown
                                        variant="select-dropdown"
                                        t={t}
                                        isMandatory={false}
                                        option={availableDeletedFormulas.map(item => ({ code: item }))}
                                        select={(value)=>{
                                          setSelectedDeletedFormula(value)
                                         }}
                                        selected={selectedDeletedFormula}
                                        optionKey="code"  
                                        showToolTip={true}
                                        placeholder={t("SELECT_OPTION")}
                                        onChange={(e) => setSelectedDeletedFormula(e.target.value)}
                                        optionCardStyles={{ position: "relative" }}
                                        />
                                      ]}
                                        onOverlayClick={() => {
                                          setFormulasPopUp(false)
                                        }}
                                      footerChildren={[
                                        <Button
                                          type={"button"}
                                          size={"large"}
                                          variation={"secondary"}
                                          label={t("YES")}
                                          onButtonClick={() => {
                                            addNewFormula()
                                          }}
                                        />,
                                        <Button
                                          type={"button"}
                                          size={"large"}
                                          variation={"primary"}
                                          label={t("NO")}
                                          onButtonClick={()=> {
                                            setFormulasPopUp(false)
                                          }}
                                        />,
                                      ]}
                                      sortFooterChildren={true}
                                      onClose={() => {
                                        setFormulasPopUp(false)
                                      }}
                          ></PopUp> }      
         </Card>
      </>
  )
}
export default FormulaConfiguration