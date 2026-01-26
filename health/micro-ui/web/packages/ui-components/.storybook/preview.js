// // import "@egovernments/digit-ui-components-css/example/index.css";
// // import { initCoreLibraries } from "@egovernments/digit-ui-libraries-core";
// import { initLibraries } from "@egovernments/digit-ui-libraries";

// // import '../src/index.css';
// //:point_down: Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
// /** @type { import('@storybook/react').Preview } */

// export const globalTypes = {
//   theme: {
//     description: "Global theme for components",
//     defaultValue: "light",
//     toolbar: {
//       // The label to show for this toolbar item
//       title: "Theme",
//       icon: "circlehollow",
//       // Array of plain string values or MenuItem shape (see below)
//       items: ["light", "dark"],
//       // Change title based on selected value
//       dynamicTitle: true,
//     },
//   },
// };

// const preview = {
//   parameters: {
//     actions: { argTypesRegex: "^on[A-Z].*" },
//     controls: {
//       expanded: true,
//       matchers: {
//         color: /(background|color)$/i,
//         date: /Date$/,
//       },
//     },
//     backgrounds: {
//       default: "twitter",
//       values: [
//         {
//           name: "twitter",
//           value: "#00ACED",
//         },
//         {
//           name: "facebook",
//           value: "#3B5998",
//         },
//       ],
//     },
//   },
// };

// initLibraries().then(() => {
//   console.info("DIGIT Contant, HOOKS enabled", window?.Digit);
// });

// export default preview;
