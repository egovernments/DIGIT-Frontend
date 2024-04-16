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
          // hrms: `hrms@${domain}/hrms-ui/remoteEntry.js`,
          // common: `common@${domain}/common-ui/remoteEntry.js`,
          // pgr: `pgr@${domain}/pgr-ui/remoteEntry.js`,
          // workbench : `workbench@${domain}/workbench-mfe/remoteEntry.js`,
          // dss : `dss@${domain}/dss-ui/remoteEntry.js`,
          // engagement : `engagement@${domain}/engagement-ui/remoteEntry.js`,
          // tqm : `tqm@${domain}/tqm-ui/remoteEntry.js`,
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
