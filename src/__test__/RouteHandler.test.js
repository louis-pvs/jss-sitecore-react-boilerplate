import React, { Suspense } from "React";
import { Route, Switch } from "react-router-dom";
import { waitForElementToBeRemoved } from "@testing-library/dom";

import config from "../temp/config";
import RouteHandler from "../RouteHandler.hook";
import i18nInit from "../i18n";
import { render } from "../test-util";

const routePatterns = [
  "/:lang([a-z]{2}-[A-Z]{2})/:sitecoreRoute*",
  "/:lang([a-z]{2})/:sitecoreRoute*",
  "/:sitecoreRoute*"
];

const renderRoute = props => (
  <Suspense fallback={"Suspensed"}>
    <RouteHandler route={props} />
  </Suspense>
);

function App() {
  return (
    <Switch>
      {routePatterns.map(routePattern => (
        <Route key={routePattern} path={routePattern} render={renderRoute} />
      ))}
    </Switch>
  );
}

beforeAll(done => {
  i18nInit(config.defaultLanguage)
    .then(() => done())
    .catch(() => done());
});

describe("<RouteHandler />", () => {
  it("should start render with Loading...", () => {
    const { queryByText, unmount } = render(<App />);
    expect(queryByText("Loading...")).toBeInTheDocument();
    expect(queryByText("Loading..")).not.toBeInTheDocument();
    unmount();
  });
  it("should should show Welcome when go to '/'", async () => {
    const { container, queryByText } = render(<App />);
    await waitForElementToBeRemoved(() => queryByText("Loading..."), {
      container
    });
    expect(queryByText("Welcome to Sitecore JSS")).toBeInTheDocument();
  });
  it("it should show not found wen go to '/randonpath'", async () => {
    const { container, queryByText } = render(<App />, {
      route: "/randompath"
    });
    await waitForElementToBeRemoved(() => queryByText("Loading..."), {
      container
    });
    expect(queryByText("Page not found")).toBeInTheDocument({ container });
  });
});
