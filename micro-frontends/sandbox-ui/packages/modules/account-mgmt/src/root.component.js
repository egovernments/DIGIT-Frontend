import { DigitUIComponents ,ReactQueryWrapper, YoutubeVideo} from "components";
const { TestComponent, Tag, SelectionCard, ErrorMessage } = DigitUIComponents;

export default function Root(props) {
  const obj = { link: "https://www.youtube.com/watch?v=ONzdr4SmOng", locale: "" , overlay: true}
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
      <p>video triggering overlay</p>
      <YoutubeVideo {...obj}/>
      <p>video not triggering overlay</p>
      <YoutubeVideo {...{ ...obj, overlay: false }}/>
    </div>
  );
}
