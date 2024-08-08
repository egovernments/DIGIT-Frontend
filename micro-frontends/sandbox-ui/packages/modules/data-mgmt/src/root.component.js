import NavigateButton from "./NavigateButton";
import { Test } from "components";
import {ReactQueryWrapper} from "components";
import TestComponent from "./TestState";
import NetworkTest from "./components/NetworkTest";



export default function Root(props) {
  
  return <>
  <ReactQueryWrapper>
   <section>hey account-mgmtt
  <NavigateButton to="account-mgmttt"></NavigateButton>
  </section>;
  <section> hey userr
  <NavigateButton to="userrr"></NavigateButton>
  </section>;
  <section>hey data-mgmtt
  <NavigateButton to="data-mgmttt"></NavigateButton>
  </section>;
    <Test />
    <TestComponent/>
    <NetworkTest></NetworkTest>
    </ReactQueryWrapper>
  </>
}
