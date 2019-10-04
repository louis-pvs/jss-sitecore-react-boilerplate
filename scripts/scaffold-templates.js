module.exports.getTemplate = (componentName, template) => {
  const exportVarName = componentName.replace(/[^\w]+/g, "");
  const templates = {
    // Template for React Class Component
    rcc: `import React, { Component, Fragment } from "react";
import { Text, RichText } from "@sitecore-jss/sitecore-jss-react";

/**
 * A scaffold class component, with a heading and rich text block.
 * This is the sample component with example usage on sitecode fields
 */
class ${exportVarName} extends Component {
  render() {
    const { fields } = this.props;
    return (
      <Fragment>
        <Text tag="h2" field={fields.heading} />
        <RichText field={fields.content} />
      </Fragment>
    );
  }
}

export default ${exportVarName};
`,

    // Template for React Functional Component
    rfc: `import React, { Fragment } from "react";
import { Text, RichText } from "@sitecore-jss/sitecore-jss-react";

/**
 * A scaffold functional component, with a heading and rich text block.
 * This is the sample component with example usage on sitecode fields
 */
const ${exportVarName} = ({ fields }) => (
  <Fragment>
    <Text tag="h2" field={fields.heading} />
    <RichText field={fields.content} />
  </Fragment>
);

export default ${exportVarName};
`,

    // template for minifest
    minifest: `import {
  CommonFieldTypes,
  SitecoreIcon,
  Manifest
} from "@sitecore-jss/sitecore-jss-manifest";

/**
 * Adds the TestComponent component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function(manifest) {
  manifest.addComponent({
    name: "${componentName}",
    displayName: "${componentName}", // Change me
    icon: SitecoreIcon.DocumentTag, // totally optional, but fun
    fields: [
      { name: "heading", type: CommonFieldTypes.SingleLineText },
      { name: "content", type: CommonFieldTypes.RichText }
      // create more fields from here
    ]
  });
}
`
  };

  if (templates.hasOwnProperty(template)) {
    return templates[template];
  }

  console.log(
    "No component template or invalid template specified, using React Functional Component template."
  );
  return templates.rfc;
};
