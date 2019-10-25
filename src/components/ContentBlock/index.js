import React from "react";
import { Text, RichText } from "@sitecore-jss/sitecore-jss-react";
import PropTypes from "prop-types";
import RoutableSitecoreLink from "../RouterLink";

/**
 * A simple Content Block component, with a heading and rich text block.
 * This is the most basic building block of a content site, and the most basic
 * JSS component that's useful.
 */
const ContentBlock = ({ fields }) => {
  return (
    <main>
      <Text tag="h1" className="display-4" field={fields.heading} />
      <RichText className="contentDescription" field={fields.content} />
      <nav>
        <RoutableSitecoreLink field={fields.dkLink} />
      </nav>
    </main>
  );
};

ContentBlock.propTypes = {
  fields: PropTypes.shape({
    heading: PropTypes.shape({}),
    content: PropTypes.shape({}),
    dkLink: PropTypes.shape({ value: PropTypes.shape() })
  }).isRequired
};

export default ContentBlock;
