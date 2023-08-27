import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import Input from "./Input";
import { CardFooter, TabTitle } from "./styled";
import { Card } from "../App";

const Login = ({ login }) => {
  const onLogin = useCallback(() => {
    // verify details are correct (not implemented) and login
    login();
  }, []);

  return (
    <>
      <Card>
        <TabTitle>Login page (route)</TabTitle>
        <Input label="Username" />
        <Input label="Password" />
      </Card>

      <CardFooter>
        <Link to="/auth/register" style={{ textDecoration: "initial" }}>
          <button variant="outlined">Register</button>
        </Link>
        <button
          variant="contained"
          onClick={onLogin}
          style={{ background: "#1db954" }}
        >
          Login
        </button>
      </CardFooter>
    </>
  );
};

export default Login;
