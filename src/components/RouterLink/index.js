import React from "react";
import { Link } from "@sitecore-jss/sitecore-jss-react";
import { Link as RouterLink } from "react-router-dom";
import has from "lodash/has";
import PropTypes from "prop-types";

/**
 * A scaffold functional component, with a heading and rich text block.
 * This is the sample component with example usage on sitecode fields
 */
const RoutableSitecoreLink = ({ field, editable, children, ...otherProps }) => {
  const hasValidHref = has(field, "value.href");
  const isEditing = editable && field.editable;

  // only want to apply the routing link if not editing (if editing, need to render editable link value)
  if (hasValidHref && !isEditing) {
    const { value } = field;

    // determine if a link is a route or not. This logic may not be appropriate for all usages.
    if (value.href.charAt() === "/") {
      return (
        <RouterLink to={value.href} title={value.title} target={value.target}>
          {children || value.text || value.href}
        </RouterLink>
      );
    }
  }

  return <Link field={field} editable={editable} {...otherProps} />;
};

RoutableSitecoreLink.propTypes = {
  editable: PropTypes.bool,
  field: PropTypes.shape({
    editable: PropTypes.bool,
    value: PropTypes.shape({
      href: PropTypes.string.isRequired,
      title: PropTypes.string,
      target: PropTypes.string,
      text: PropTypes.string
    })
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ])
};

export default RoutableSitecoreLink;
