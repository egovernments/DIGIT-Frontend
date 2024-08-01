import React from "react";
// import { Button, Text,Checkbox } from "../../components/src";
import {Button} from "components";
import {Checkbox} from "components";
import {Text} from "components";
// export default function Root(props) {
//   return (
//     <section>
//       <div>
//     <Button />
//     <Text />
//     <Checkbox/>
//   </div>
//     </section>
//   );
// }
// console.log("hey react-app default");
export default function Root(props) {
  return <section>{props.name} hey react-app-default
  <Button />
   <Checkbox/>
   <Text/>
  </section>;
}
