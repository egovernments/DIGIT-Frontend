// import {ActionBar,Button} from "@egovernments/digit-ui-components";
/* The line `const {ActionBar,Button}= DigitUIComponents;` is using object destructuring to extract the
`ActionBar` and `Button` components from the `DigitUIComponents` module. This allows you to directly
access and use these components in your code without having to reference the entire module path each
time. */

import { Test } from "components-lib/src";

// const {ActionBar,Button}= DigitUIComponents;
export default function Root(props) {
  const onCLickHandler = (e) => {
    console.log(e);
  }
 /* The `<Button>` component you provided is being rendered in the `Root` component's JSX code. It
 seems to be a custom button component with various props being passed to it. Here's a breakdown of
 the props being passed to the `<Button>` component: */
  // <Button
  //   className="custom-class"
  //   iconFill=""
  //   label="Button"
  //   onClick={function noRefCheck(){}}
  //   options={[]}
  //   optionsKey=""
  //   size=""
  //   style={{}}
  //   title=""
  //   variation=""
  // />
  return (
    <div>
    <Test/>
      <section>{props.name} is mounted!</section>
    </div>
  )
}
