import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashRouter } from "react-router-dom";

const AppWithRouter = () => {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
};

ReactDOM.render(<AppWithRouter />, document.querySelector("#root"));
