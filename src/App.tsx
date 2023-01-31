import React from "react";
import styled from "@emotion/styled";

const Title = styled.h1`
  padding: 16px;
`;
const Container = styled.div`
  border-width: 0;
  width: 100vw;
  height: 100vh;
  margin: -32px 0 0;
`;

const App = () => {
  // return <Title>Dashboard Microfrontend</Title>;
  return (
    <Container>
      <iframe
        style={{ width: "100%", height: "100vh", margin: "-30px 0px 0px 0px" }}
        src="https://ifix-qa.ifix.org.in/digit-ui/employee/dss/dashboard/ifix"
      ></iframe>
    </Container>
  );
};

export default App;
