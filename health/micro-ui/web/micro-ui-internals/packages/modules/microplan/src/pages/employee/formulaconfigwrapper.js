import React, { useState, useEffect, Fragment } from 'react';
// import FormulaConfiguration from './FormulaConfiguration';
import FormulaConfiguration from './sample1';
// import { useMyContext } from '../utils/context';
import { useMyContext } from '../../utils/context';
const FormulaConfigWrapper = ()=>{
//     const [selectedCategory, setSelectedCategory] = useState("GENERAL_ESTIMATION");
//     const { state, dispatch } = useMyContext();
//     console.log("hiiii",state);
//  customProps.ruleConfigurations = state.AutoFilledRuleConfigurations?.[0]?.ruleConfigurationCategories?.[0]?.ruleConfigurations
//  customProps.ruleConfigureOperators  = state.RuleConfigureOperators
//  customProps.ruleConfigureOutput    = state.RuleConfigureOutput[0].outputCategories[0].outputs

const [selectedCategory, setSelectedCategory] = useState("GENERAL_ESTIMATION");

const customProps = {
    ruleConfigurations: [
      { input: "Household Count" },
      { input: "Bednet Count" },
      { input: "Bale Count" }
    ],
    ruleConfigureOperators: [
      { operatorName: "Multiply" },
      { operatorName: "Divide" },
      { operatorName: "Add" },
      { operatorName: "Subtract" }
    ],
    ruleConfigurations1: [
      { input: "Average People H/H" },
      { input: "Average People B/B" },
      { input: "Average People C/C" }
    ],

  };

  const onSelect = (selectedValue) => {
    console.log("Selected value:", selectedValue);
  };
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

export default FormulaConfigWrapper;
