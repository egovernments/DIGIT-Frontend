const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

const domain = process.env.PRODUCTION_DOMAIN || "https://unified-dev.digit.org";

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "/core-digit-ui/"
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "core-digit-ui",
        remotes: {
          // landing: `landing@${domain}/landing/remoteEntry.js`,
          // auth: `auth@${domain}/auth/remoteEntry.js`,
          // header: `header@${domain}/header/remoteEntry.js`,
          // dashboard: `dashboard@${domain}/dashboard/remoteEntry.js`,
          hrms: `hrms@${domain}/hrms-ui/remoteEntry.js`,
          common: `common@${domain}/common-ui/remoteEntry.js`,
          pgr: `pgr@${domain}/pgr-ui/remoteEntry.js`,
          workbench : `workbench@${domain}/workbench-mfe/remoteEntry.js`,
          dss : `dss@${domain}/dss-ui/remoteEntry.js`,
          engagement : `engagement@${domain}/engagement-ui/remoteEntry.js`,
          tqm : `tqm@${domain}/tqm-ui/remoteEntry.js`,
          // measurement : `measurement@${domain}/measurement/remoteEntry.js`
        },
        shared: {
          
    "@egovernments/digit-ui-react-components": "1.4.109",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "react-i18next": "11.16.2",
    "react-query": "3.6.1",
    "react-redux": "7.2.8",
    "react-router-dom": "5.3.0",
    "single-spa-react": "^4.6.1",
    "react-tooltip": "^5.21.1",
    "redux": "4.1.2",
    "redux-thunk": "^2.4.2",
    "rxjs": "6.6.3",
    "single-spa": "^5.9.3"
        },
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
