import NavigateButton from "./NavigateButton";
import { Test } from "components";
import { ReactQueryWrapper } from "components";
import TestComponent from "./TestState";
import NetworkTest from "./components/NetworkTest";
import "../css/index.scss"



export default function Root(props) {

  return <>
    <ReactQueryWrapper>
      <section className="custom-class">hey account-mgmt
        <NavigateButton to="account-mgmt"></NavigateButton>
      </section>;
      <section> hey user
        <NavigateButton to="user"></NavigateButton>
      </section>;
      <section>hey data-mgmt
        <NavigateButton to="data-mgmt"></NavigateButton>
      </section>;
      <Test />
      <TestComponent />
      <NetworkTest></NetworkTest>
    </ReactQueryWrapper>
  </>
}
