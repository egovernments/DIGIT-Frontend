import NavigateButton from "./NavigateButton";
import {Sample} from "components"

export default function Root(props) {
  
  return <>
   <section>{props.name} hey react-app-0 
  <NavigateButton to="zero"></NavigateButton>
  </section>;
  <section>{props.name} hey react-app-1 
  <NavigateButton to="one"></NavigateButton>
  </section>;
  <section>{props.name} hey react-app-2 
  <NavigateButton to="two"></NavigateButton>
  </section>;
<Sample></Sample>
  </>
}
