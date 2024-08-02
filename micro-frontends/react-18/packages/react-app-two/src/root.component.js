import {TestComponent} from "@egovernments/digit-ui-components";
export default function Root(props) {
  return<div>
    <h1>hi</h1>
    <TestComponent></TestComponent>
    <section>{props.name} hey react-app-2</section></div> ;
}
