import React from "react";
import { States } from "components";
const { useUserState } = States;

const TestComponent =()=>{
    const { setData, resetData, data } = useUserState();
console.log(data,"logging all data");

return <div>
          <h1>Hi {data?.name}</h1>


</div>
}
export default TestComponent;