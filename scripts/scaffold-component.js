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

const componentManifestDefinitionsPath = "sitecore/definitions/components";
const componentRootPath = "src/components";

let manifestOutputPath = null;

if (fs.existsSync(componentManifestDefinitionsPath)) {
  manifestOutputPath = scaffoldManifest(componentName);
} else {
  console.log(
    `Not scaffolding manifest because ${componentManifestDefinitionsPath} did not exist. This is normal for Sitecore-first workflow.`
  );
}

/*
Components can be created from different scaffolding templates.
Use flags when calling the `jss scaffold` command to speficiy which template to use.
Supported flags:
* --template=rfc - use template for react functional component
* --template=rcc - use template for react class component
*/
let template = process.argv.find(arg => arg.indexOf("--template") === 0);
if (template) {
  template = template.split("=")[1];
}

const componentOutputPath = scaffoldComponent(
  getTemplate(componentName, template)
);

console.log();
console.log(chalk.green(`Component <${componentName}> has been scaffolded.`));
console.log(chalk.green("Next steps:"));
if (manifestOutputPath) {
  console.log(
    `* Define the component's data in ${chalk.green(manifestOutputPath)}`
  );
} else {
  console.log(
    `* Scaffold the component in Sitecore using '${chalk.green(
      `jss deploy component ${componentName} --allowedPlaceholders placeholder-for-component`
    )}, or create the rendering item and datasource template yourself.`
  );
}
console.log(
  `* Implement the React component in ${chalk.green(componentOutputPath)}`
);
if (manifestOutputPath) {
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

function scaffoldComponent(componentTemplate) {
  const outputDirectoryPath = path.join(componentRootPath, componentName);

  if (fs.existsSync(outputDirectoryPath)) {
    throw `Component path ${outputDirectoryPath} already existed. Not creating component.`;
  }

  fs.mkdirSync(outputDirectoryPath);

  const outputFilePath = path.join(outputDirectoryPath, "index.js");

  fs.writeFileSync(outputFilePath, componentTemplate, "utf8");

  return outputFilePath;
}

function scaffoldManifest(componentName) {
  const manifestTemplate = getTemplate(componentName, "minifest");

  const outputFilePath = path.join(
    componentManifestDefinitionsPath,
    `${componentName}.sitecore.js`
  );

  if (fs.existsSync(outputFilePath)) {
    throw `Manifest definition path ${outputFilePath} already exists. Not creating manifest definition.`;
  }

  fs.writeFileSync(outputFilePath, manifestTemplate, "utf8");

  return outputFilePath;
}
