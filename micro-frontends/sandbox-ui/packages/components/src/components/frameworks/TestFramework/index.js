import React from "react";
import { TestAtom } from "../../atoms";
import { TestOrganism } from "../../organisms";

const TestFramework =()=>{
    return <div>
        <h6>molecule</h6>
        <TestAtom></TestAtom>
        <TestAtom></TestAtom>
<TestOrganism></TestOrganism>
    </div>
}

export default TestFramework;