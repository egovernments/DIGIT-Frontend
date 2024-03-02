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
          // pgr : `pgr-ui@${domain}/pgr/remoteEntry.js`,
          // hrms: `hrms@${domain}/hrms/remoteEntry.js`,
          // common: `common-ui@${domain}/common-ui/remoteEntry.js`,
          workbench : `workbench_web@${domain}/workbench/remoteEntry.js`,
          // dss : `dss@${domain}/dss/remoteEntry.js`,
          // measurement : `measurement@${domain}/measurement/remoteEntry.js`
        },
        // shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
