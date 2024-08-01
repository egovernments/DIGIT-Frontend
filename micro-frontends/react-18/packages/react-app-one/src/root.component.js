import NavigateButton from "./NavigateButton";

export default function Root(props) {
  
  return <>
  <NavigateButton></NavigateButton>
  <section>{props.name} hey react-app-1</section>;

  </>
}
