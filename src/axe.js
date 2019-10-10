/**
 * React-axe, wrapper for axe-core doing accessibility audit on react final rendered DOM
 * configure and init react-axe
 */

export default function axeInit() {
  // do not include react-axe in production mode
  if (process.env.NODE_ENV !== "production") {
    const config = {};
    return Promise.all([
      import("react"),
      import("react-dom"),
      import("react-axe")
    ]).then(([React, ReactDOM, axe]) => {
      axe.default(React, ReactDOM, 1000, config);
    });
  } else {
    return Promise.resolve();
  }
}
