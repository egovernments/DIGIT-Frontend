import {TestComponent} from "@egovernments/digit-ui-components";
import {
  Tag,
  SelectionCard,
  ErrorMessage,
} from "@egovernments/digit-ui-components";

export default function Root(props) {
  return<div>
    <h1>hi</h1>
    <Tag />
      <SelectionCard
        options={[
          {
            code: "sasa",
            name: "name",
          },
        ]}
      />
      <ErrorMessage message="Error" />
    <TestComponent></TestComponent>
    <section>{props.name} hey react-app-2</section></div> ;
}
