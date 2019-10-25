import React from "react";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { HelmetProvider } from "react-helmet-async";
import {
  SitecoreContext,
  SitecoreContextFactory
} from "@sitecore-jss/sitecore-jss-react";
import componentFactory from "./temp/componentFactory";
/* import below not needed if not using graphQL */
import { ApolloProvider } from "react-apollo";
import { getGraghQLStateFromJSS } from "./getSSRData";
import GraphQLClientFactory from "./lib/GraphQLClientFactory";
import config from "./temp/config";

/** avoid CORS issue on jest xhr-utils
 * @see  https://github.com/axios/axios/issues/1180#issuecomment-477920274
 */
global.XMLHttpRequest = undefined;
const graphQLClient = GraphQLClientFactory(
  config.graphQLEndpoint,
  false,
  getGraghQLStateFromJSS()
);

const sitecoreContext = new SitecoreContextFactory();

export const AllTheProviders = ({ children }) => {
  return (
    <ApolloProvider client={graphQLClient}>
      <SitecoreContext
        componentFactory={componentFactory}
        contextFactory={sitecoreContext}
      >
        <I18nextProvider i18n={i18n}>
          <HelmetProvider>{children}</HelmetProvider>
        </I18nextProvider>
      </SitecoreContext>
    </ApolloProvider>
  );
};

const renderWithWrapper = (ui, options) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

const renderWithRouter = (
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] })
  } = {}
) => {
  return renderWithWrapper(<Router history={history}>{ui}</Router>, {
    history
  });
};

/**
 * util to help set up wrapper for `@test-library`'s render function
 * @param {*} ui - React Element
 * @param {{withRouter: Boolean, route: String }: {}} options
 */
const customRender = (ui, { withRouter = true, ...options } = {}) => {
  if (withRouter) return renderWithRouter(ui, options);
  return renderWithWrapper(ui, options);
};

export * from "@testing-library/react";

export { customRender as render };
