import React from 'react';
import { Button } from './Button';

// import {ActionBar,Button} from "@egovernments/digit-ui-components";
const ActionBar =(children)=><div>{children}</div>

export default function Test(props) {
  const onCLickHandler = (e) => {
    console.log(e);
  }
 
  return (
    <div>
      <ActionBar
  actionFields={[
    <Button icon="ArrowBack" label="Back" onClick={function noRefCheck(){}} type="button" variation="secondary"/>,
    <Button icon="ArrowForward" isSuffix label="Next" onClick={function noRefCheck(){}} type="button"/>
  ]}
  className=""
  maxActionFieldsAllowed={5}
  sortActionFields
  style={{}}
/>
    </div>
  )
}
