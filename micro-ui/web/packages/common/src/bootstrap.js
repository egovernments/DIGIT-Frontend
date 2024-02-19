import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";

const mount = (el, { history, login }) => {
  ReactDOM.render(
    <div>Common Module in isolation</div>,
    el
  );
};

if (process.env.NODE_ENV === "development") {
  const rootNode = document.querySelector("#common-module-root");

  if (rootNode) {
    mount(rootNode, {
      history: createBrowserHistory(),
      login: () => {},
    });
  }
}

export { mount };
