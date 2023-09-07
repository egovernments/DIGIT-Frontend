import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { HRMSModule } from "./Module.js";

const mount = (el, { history, login }) => {
  ReactDOM.render(
    /*<Router history={history}>
      <App login={login} />
    </Router>,*/
    <HRMSModule />,
    el
  );
};

if (process.env.NODE_ENV === "development") {
  const rootNode = document.querySelector("#hrms-module-root");

  if (rootNode) {
    mount(rootNode, {
      history: createBrowserHistory(),
      login: () => {},
    });
  }
}

export { mount };
