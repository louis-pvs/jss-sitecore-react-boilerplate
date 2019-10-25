const chalk = require("chalk");

/**
 * configs to overrides `create-react-app`'s default webpack config without `eject` them.
 * for more information please refer to https://github.com/timarney/react-app-rewired
 */
module.exports = function overrides(config, env) {
  const overridedConfig = { ...config };
  const isProd = env === "production";

  if (isProd) {
    // add webpack performance hints config https://webpack.js.org/configuration/performance/
    if (config.performance) warnDefaultExist("performance");
    overridedConfig.performance = {
      maxAssetSize: 170000,
      maxEntrypointSize: 170000,
      hints: "warning"
    };
  }
  return overridedConfig;
};

/**
 * util to console warning when webpack default configurartion is exist
 * @param {string} configName - webpack's configuration
 */
function warnDefaultExist(configName) {
  console.log(
    chalk.yellow(
      `* webpack's config[${chalk.red(
        configName
      )}] has default value overrides with caution`
    )
  );
}
