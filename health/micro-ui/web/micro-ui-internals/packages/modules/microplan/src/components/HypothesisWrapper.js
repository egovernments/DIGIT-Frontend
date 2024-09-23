import React, { useState, useEffect, Fragment } from 'react';
import Hypothesis from './Hypothesis';

import { useMyContext } from "../utils/context";




const HypothesisWrapper = ({onSelect, props:customProps}) => {

    const [selectedCategory, setSelectedCategory] = useState('GENERAL_INFORMATION'); 
    const { state, dispatch } = useMyContext();
    const assumptionCategories = state.HypothesisAssumptions[0].assumptionCategories

    const filteredAssumptions = assumptionCategories.find(category => category.category === selectedCategory)?.assumptions || [];


    return <>
             <div>
                <Hypothesis
                    category={selectedCategory}
                    assumptions={filteredAssumptions}
                    onSelect={onSelect}
                    customProps={customProps}
                    
                />
             </div>
    
           </>

}

export default HypothesisWrapper;