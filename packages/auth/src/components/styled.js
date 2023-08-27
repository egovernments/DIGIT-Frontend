import React from "react";
import Container from "./container";

export const TabTitle = (props) => (
  <Container type="h2" style={{ marginBottom: "24px" }}>
    {props.children}
  </Container>
);

export const CardFooter = (props) => (
  <Container
    style={{ display: "flex", justifyContent: "flex-end", padding: "16px" }}
  >
    {props.children}
  </Container>
);
// styled.div`
//   display: flex;
//   justify-content: flex-end;
//   padding: 16px;

//   > Button {
//     margin-left: 16px;
//   }
// `;
