import React,{Fragment} from 'react'
import SearchJurisdiction from '../../components/SearchJurisdiction'
import { boundaries } from '../../components/boundaries'

const jurisdiction = {
  boundaryType: "Country",
  boundaryCodes: [
    // "MICROPLAN_MO_05_05_GREENVILLE",
    // "MICROPLAN_MO_05_04_GBLONEE",
    // "MICROPLAN_MO_04_06_KUNGBOR"
    "MICROPLAN_MO"
  ],
};

const PopInbox = () => {

  
  return (
    <>
      <SearchJurisdiction boundaries={boundaries()} jurisdiction={jurisdiction} />
    </>
  )
}

export default PopInbox