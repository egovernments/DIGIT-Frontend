import React, { useCallback } from "react";
import Input from "./Input";
import { CardFooter, TabTitle } from "./styled";
import { Link } from "react-router-dom";
import { Card } from "../App";

const Register = () => {
  const onRegister = useCallback(() => {
    console.log("register");
  }, []);

  return (
    <>
      <Card>
        <TabTitle>Register page (route)</TabTitle>
        <Input label="Username" />
        <Input label="Password" />
        <Input label="Confirm Password" />
      </Card>

      <CardFooter>
        <Link to="/auth/login" style={{ textDecoration: "initial" }}>
          <button variant="outlined">Login</button>
        </Link>
        <button
          variant="contained"
          onClick={onRegister}
          style={{ background: "#1db954" }}
        >
          Register
        </button>
      </CardFooter>
    </>
  );
};

export default Register;
