module.exports.getTemplate = (componentName, template) => {
  const exportVarName = componentName.replace(/[^\w]+/g, "");
  const templates = {
    // Template for React Class Component
    rcc: `import React, { Component } from "react";
import { Text, RichText } from "@sitecore-jss/sitecore-jss-react";
import PropTypes from "prop-types";

/**
 * A scaffold class component, with a heading and rich text block.
 * This is the sample component with example usage on sitecode fields
 */
class ${exportVarName} extends Component {
  static propTypes = {
    fields: PropTypes.shape({
      heading: PropTypes.shape({}),
      content: PropTypes.shape({})
    }).isRequired
  };
  render() {
    const { fields } = this.props;
    return (
      <main>
        <Text tag="h1" field={fields.heading} />
        <RichText field={fields.content} />
      </main>
    );
  }
}

export default ${exportVarName};
`,

    // Template for React Functional Component
    rfc: `import React from "react";
import { Text, RichText } from "@sitecore-jss/sitecore-jss-react";
import PropTypes from "prop-types";

/**
 * A scaffold functional component, with a heading and rich text block.
 * This is the sample component with example usage on sitecode fields
 */
const ${exportVarName} = ({ fields }) => (
  <main>
    <Text tag="h2" field={fields.heading} />
    <RichText field={fields.content} />
  </main>
);

${exportVarName}.propTypes = {
  fields: PropTypes.shape({
    heading: PropTypes.shape({}),
    content: PropTypes.shape({})
  }).isRequired
};

export default ${exportVarName};
`,

    // template for minifest
    minifest: `import {
  CommonFieldTypes,
  SitecoreIcon
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
`,

    styleguide: `${`<${exportVarName} />`} example:

${"```" +
  `jsx inside Markdown
<${exportVarName}
  fields={{
    heading: { value: "Placeholder for heading field" }, // from jss manifest API
    content: { value: "Placeholder for content field" } // from jss manifest API
  }}
/>` +
  "\n```"}
`
  };

  if (templates[template]) {
    return templates[template];
  }

  console.log("No template found");

  return templates.rfc;
};
