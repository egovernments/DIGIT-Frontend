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

  
  const onSearch = (selectedBoundaries) => {
    console.log(selectedBoundaries);
  }
  return (
    <>
      <SearchJurisdiction boundaries={boundaries()} jurisdiction={jurisdiction} onSubmit={onSearch} />
    </>
  )
}

export default PopInbox