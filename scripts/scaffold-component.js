/*
  Component Scaffolding Script
  This is a script that enables scaffolding a new JSS component using `jss scaffold <componentname>`.
  Edit this script if you wish to use your own conventions for component storage in your JSS app.
*/

/* eslint-disable no-throw-literal,no-console */

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const getTemplate = require("./scaffold-templates").getTemplate;

/*
  SCAFFOLDING SCRIPT
*/
const componentName = process.argv[2];

if (!componentName) {
  throw "Component name was not passed. Usage: jss scaffold <ComponentName>";
}

if (!/^[A-Z][A-Za-z0-9-]+$/.test(componentName)) {
  throw "Component name should start with an uppercase letter and contain only letters and numbers.";
}

const PATHS = {
  componentManifestDefinition: "sitecore/definitions/components",
  componentRoot: "src/components",
  componentOutput: path.join("src/components", componentName)
};

if (fs.existsSync(PATHS.componentOutput)) {
  throw `Component path ${PATHS.componentOutput} already existed. Not creating component.`;
}

/**
 * Components can be created from different scaffolding templates.
 * Use argument when calling the `jss scaffold` command to specific which template to use.
 * Supported arguments:
 * --template=rfc - use template for react functional component
 * --template=rcc - use template for react class component
 */
let template = process.argv.find(arg => arg.indexOf("--template") >= 0);

if (template) template = template.split("=")[1];

/**
 * Styleguide can be created if needed only
 * Use argument when calling `jss scaffold` command to specific if styleguide is needed
 * @see {@link https://react-styleguidist.js.org/}
 * Supported arguments:
 *  `--styleguide` or shorthand `-S`
 */
let styleguide = !!process.argv.find(
  arg => arg.indexOf("--styleguide") >= 0 || arg.indexOf("-S") >= 0
);

fs.mkdirSync(PATHS.componentOutput);

let manifestFilePath = null;
let componentFilePath = null;
let styleguideFilePath = null;

if (fs.existsSync(PATHS.componentManifestDefinition)) {
  manifestFilePath = scaffoldManifest();
} else {
  console.log(
    `Not scaffolding manifest because ${PATHS.componentManifestDefinition} did not exist. This is normal for Sitecore-first workflow.`
  );
}
componentFilePath = scaffoldComponent();
if (styleguide) styleguideFilePath = scaffoldStyleguide();

console.log();
console.log(chalk.green(`Component <${componentName}> has been scaffolded.`));
console.log(chalk.green("Next steps:"));
if (manifestFilePath) {
  console.log(
    `* Define the component's data in ${chalk.green(manifestFilePath)}`
  );
} else {
  console.log(
    `* Scaffold the component in Sitecore using '${chalk.green(
      `jss deploy component ${componentName} --allowedPlaceholders placeholder-for-component`
    )}, or create the rendering item and datasource template yourself.`
  );
}
console.log(
  `* Implement the React component in ${chalk.green(componentFilePath)}`
);
if (styleguideFilePath) {
  console.log(
    `* Implement issolate styleguide component in ${chalk.green(
      styleguideFilePath
    )}`
  );
}
if (manifestFilePath) {
  console.log(
    `* Add the component to a route layout (/data/routes) and test it with ${chalk.green(
      "jss start"
    )}`
  );
} else {
  console.log(
    `* Deploy your app with the new component to Sitecore (${chalk.green(
      "jss deploy:watch"
    )} or ${chalk.green("jss deploy files")})`
  );
  console.log(
    `* Add the component to a route using Sitecore Experience Editor, and test it.`
  );
}

/*
  TEMPLATING FUNCTIONS
*/

function scaffoldComponent() {
  // file destination
  const componentFilePath = path.join(PATHS.componentOutput, "index.js");
  // creating file content
  const componentTemplate = getTemplate(componentName, template);
  // putting content into file
  fs.writeFileSync(componentFilePath, componentTemplate, "utf8");

  return componentFilePath;
}

function scaffoldStyleguide() {
  // file destination
  const styleguidePath = path.join(PATHS.componentOutput, "README.md");
  // creating file content
  const styleguideTemplate = getTemplate(componentName, "styleguide");
  // putting content into file
  fs.writeFileSync(styleguidePath, styleguideTemplate, "utf8");

  return styleguidePath;
}

function scaffoldManifest() {
  // file destination
  const outputFilePath = path.join(
    PATHS.componentManifestDefinition,
    `${componentName}.sitecore.js`
  );
  // confirm file destination availability
  if (fs.existsSync(outputFilePath)) {
    throw `Manifest definition path ${outputFilePath} already exists. Not creating manifest definition.`;
  }
  // creating file content
  const manifestTemplate = getTemplate(componentName, "minifest");
  // putting content into file
  fs.writeFileSync(outputFilePath, manifestTemplate, "utf8");

  return outputFilePath;
}
