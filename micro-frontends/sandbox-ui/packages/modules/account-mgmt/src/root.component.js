import { DigitUIComponents ,ReactQueryWrapper} from "components";
const { TestComponent, Tag, SelectionCard, ErrorMessage } = DigitUIComponents;

export default function Root(props) {
  return (
    <div>
      <ReactQueryWrapper>
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
      <section>{props.name} hey react-app-2</section>
      </ReactQueryWrapper>
    </div>
  );
}
