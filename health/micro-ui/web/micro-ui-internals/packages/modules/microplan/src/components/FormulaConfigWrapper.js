import React, { useState, useEffect, Fragment } from 'react';
import FormulaConfiguration from './FormulaConfiguration';
import { useMyContext } from '../utils/context';


const FormulaConfigWrapper = ({onSelect, props:customProps})=>{
    
    const [selectedCategory, setSelectedCategory] = useState("GENERAL_ESTIMATION"); 
    const { state, dispatch } = useMyContext();
    console.log(state)
    

 customProps.ruleConfigurations = state.AutoFilledRuleConfigurations?.[0]?.ruleConfigurationCategories?.[0]?.ruleConfigurations
 customProps.ruleConfigureOperators  = state.RuleConfigureOperators
 customProps.ruleConfigureOutput    = state.RuleConfigureOutput[0].outputCategories[0].outputs
 

 
 
 
 
  

    return <>
             <div>
                 <FormulaConfiguration
                    customProps={customProps}
                    category={selectedCategory}
                    onSelect={onSelect}
                  />
                  
             </div>  
          </>




}


export default FormulaConfigWrapper

