import React, { Suspense } from "react";
import { SitecoreContext } from "@sitecore-jss/sitecore-jss-react";
import { Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { HelmetProvider } from "react-helmet-async";
import i18n from "i18next";
import { I18nextProvider } from "react-i18next";

import componentFactory from "./temp/componentFactory";
import SitecoreContextFactory from "./lib/SitecoreContextFactory";
import RouteHandler from "./RouteHandler.hook";
/* import below not needed if not using graphQL */
import { ApolloProvider } from "react-apollo";
import { getGraghQLStateFromJSS } from "./getSSRData";
import GraphQLClientFactory from "./lib/GraphQLClientFactory";
import config from "./temp/config";

// This is the main JSX entry point of the app invoked by the renderer (server or client rendering).
// By default the app's normal rendering is delegated to <RouteHandler> that handles the loading of JSS route data.

// support languages in the URL prefix
// e.g. /da-DK/path, or /en/path, or /path
export const routePatterns = [
  "/:lang([a-z]{2}-[A-Z]{2})/:sitecoreRoute*",
  "/:lang([a-z]{2})/:sitecoreRoute*",
  "/:sitecoreRoute*"
];

const defaultHistory = () => createBrowserHistory();
const defaultGraphQLClient = () =>
  GraphQLClientFactory(
    config.graphQLEndpoint,
    !!getGraghQLStateFromJSS(),
    getGraghQLStateFromJSS()
  );
// wrap the app with:
// ApolloProvider: provides an instance of Apollo GraphQL client to the app to make Connected GraphQL queries.
//    Not needed if not using connected GraphQL.
// SitecoreContext: provides component resolution and context services via withSitecoreContext
// Router: provides a basic routing setup that will resolve Sitecore item routes and allow for language URL prefixes.

const AppRoot = ({
  Router,
  graphQLClient = defaultGraphQLClient(),
  helmetContext = {},
  routerHistory = defaultHistory()
}) => {
  return (
    // remove ApolloProvider if not GraphQL.
    <ApolloProvider client={graphQLClient}>
      <SitecoreContext
        componentFactory={componentFactory}
        contextFactory={SitecoreContextFactory}
      >
        <I18nextProvider i18n={i18n}>
          <HelmetProvider context={helmetContext}>
            <Router history={routerHistory}>
              <Switch>
                {routePatterns.map(routePattern => (
                  <Route
                    key={routePattern}
                    path={routePattern}
                    render={renderRoute}
                  />
                ))}
              </Switch>
            </Router>
          </HelmetProvider>
        </I18nextProvider>
      </SitecoreContext>
    </ApolloProvider>
  );
};

function renderRoute(props) {
  return (
    <Suspense fallback={<h1>Suspensed</h1>}>
      <RouteHandler route={props} />
    </Suspense>
  );
}

export default AppRoot;
