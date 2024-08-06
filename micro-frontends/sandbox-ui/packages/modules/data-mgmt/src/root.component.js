import NavigateButton from "./NavigateButton";
import { Test } from "components";
import {ReactQueryWrapper} from "components";
import TestComponent from "./TestState";



export default function Root(props) {
  
  return <>
  <ReactQueryWrapper>
   <section>{props.name} hey react-app-0 
  <NavigateButton to="zero"></NavigateButton>
  </section>;
  <section>{props.name} hey react-app-1 
  <NavigateButton to="one"></NavigateButton>
  </section>;
  <section>{props.name} hey react-app-2 
  <NavigateButton to="two"></NavigateButton>
  </section>;
    <Test />
    <TestComponent/>
    </ReactQueryWrapper>
  </>
}
