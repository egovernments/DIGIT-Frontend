import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import App from "./App";
import { DigitApp } from "components";

/**
 * Single SPA configuration for the React microfrontend.
 * 
 * This configuration sets up the Single SPA lifecycles for the React application,
 * integrating it with the Single SPA framework. It defines how the React application
 * should be mounted, unmounted, and bootstrapped within the Single SPA ecosystem.
 * 
 * The `rootComponent` renders the `DigitApp` component, which wraps the `Root` component
 * to provide additional functionality or context. This setup allows for a modular and 
 * scalable microfrontend architecture.
 * 
 * @module SingleSpaReactConfig
 */

/**
 * Configures Single SPA with React.
 * 
 * This function creates the lifecycles for Single SPA, including the `bootstrap`,
 * `mount`, and `unmount` methods. It sets up the `DigitApp` as the root component, which
 * wraps the `Root` component to provide necessary props and context.
 * 
 * @param {Object} props - The properties passed to the `DigitApp` component.
 * @param {Function} props.rootComponent - The root component to be rendered within
 *                                          the Single SPA container. In this case,
 *                                          it is a function that returns a JSX element
 *                                          consisting of `DigitApp` and `Root`.
 * @param {Function} errorBoundary - A function to handle errors that occur in the application.
 *                                    This is where you can customize the root error boundary
 *                                    for the microfrontend.
 * 
 * @returns {Object} An object containing the `bootstrap`, `mount`, and `unmount` methods
 *                    for integrating with Single SPA.
 */
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: (props) => <DigitApp {...props}><App/></DigitApp>, // Pass props to the root component
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null; // Return a fallback UI or null to hide the error boundary
  },
});

// Export lifecycle methods for Single SPA
export const { bootstrap, mount, unmount } = lifecycles;
