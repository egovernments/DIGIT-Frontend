import { DigitUIComponents ,ReactQueryWrapper} from "components";
import Slider from "../../../components/src/components/Slider";
// import { InfoButton,BreadCrumb, InfoCard } from "@egovernments/digit-ui-components";
const { TestComponent,BreadCrumb, Tag, SelectionCard, ErrorMessage,Button } = DigitUIComponents;


export default function Root(props) {
  return (
    <div>

      {/* <ErrorMessage/> */}
      {/* <SelectionCard/> */}
      {/* <TestComponent/> */}
      {/* <Tag/>   */}
      {/* <BreadCrumb/> */}
      
      
      <Slider/>
      <ReactQueryWrapper>
      <h1>hi </h1>
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
