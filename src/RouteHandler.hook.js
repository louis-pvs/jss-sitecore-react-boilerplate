import React, { useEffect, useState, Fragment, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import has from "lodash/has";
import {
  isExperienceEditorActive,
  dataApi
} from "@sitecore-jss/sitecore-jss-react";
import { useTranslation } from "react-i18next";
import SitecoreContextFactory from "./lib/SitecoreContextFactory";
import { dataFetcher } from "./dataFetcher";
import config from "./temp/config";
import Layout from "./Layout";
import NotFound from "./NotFound";
import getSSRData from "./getSSRData";

/**
 * TL'TR
 * 1. get `language` and `sitecoreRoute` as from url
 * 2. render `null` || `loading` if both of it not yet ready
 * 3. call `dataApi` to get `routeData` when both ready, *skip* if `ssrInitialState` *exist*
 * 4. if `ssrInitialState` exist, use it as `routeData`, get language and route info from it
 * 5. use `routeData` to `setSitecoreContext`
 * 6. render `<Layout />` || `<NotFound />` with `routeData`, both needed it.
 * @param {{route: {match: {params: { lang: String, sitecoreRoute: String}}}}} props
 */
let ssrInitialState = getSSRData();
function RouteHandler({ route }) {
  const { t, i18n } = useTranslation();
  const [appLanguage, setAppLanguage] = useState(
    route.match.params.lang || config.defaultLanguage
  );
  const [routeString, setRouteString] = useState(
    formatRouteString(route.match.params.sitecoreRoute || "/")
  );
  const [loadingLanguage, setLoadingLanguage] = useState(!appLanguage);
  const [routeData, setRouteData] = useState(ssrInitialState); // null when client-side rendering;
  // route data from react-router - if route was resolved, it's not a 404
  const [notFound, setNotFound] = useState(
    !route || !has(routeData, "sitecore.route.itemId")
  );
  // Updates the current app language to match the route data.
  useMemo(() => {
    if (appLanguage !== i18n.language) {
      setLoadingLanguage(true);
      i18n.changeLanguage(appLanguage, () => {
        setLoadingLanguage(false);
      });
    }
  }, [appLanguage, i18n]);

  useMemo(() => {
    const { sitecoreRoute } = route.match.params;
    const formattedRouteString = formatRouteString(sitecoreRoute || "/");
    if (formattedRouteString !== routeString) {
      setRouteString(formattedRouteString);
    }
  }, [route.match.params, routeString]);

  useEffect(() => {
    let didCancel = false;
    // when component unmount setop the set state
    const cancel = () => (didCancel = true);
    const update = routeDataFromAPI => {
      if (!didCancel) setRouteData(routeDataFromAPI);
    };
    function fetchRouteData() {
      // bypass initial route data fetch calls.
      if (ssrInitialState) return { unsubscribe: cancel };
      // get the route data for the new route
      getRouteData(routeString, appLanguage)
        .then(update)
        .catch(cancel);
      return { unsubscribe: cancel };
    }
    const subscription = fetchRouteData();
    return () => subscription.unsubscribe();
  }, [routeString, appLanguage]);

  useEffect(() => {
    updateSitecoreContextFactory(routeData);
    setNotFound(!has(routeData, "sitecore.route.itemId")); // has to come before set route data
    setRouteData(routeData);
  }, [routeData]);

  // {6} Using SSR initial State from JSS
  useMemo(() => {
    if (ssrInitialState) {
      setAppLanguage(ssrInitialState.context.language);
      setRouteData(ssrInitialState);
      ssrInitialState = null;
    }
  }, []);

  // if in experience editor - force reload instead of route data update
  // avoids confusing Sitecore's editing JS
  if (isExperienceEditorActive()) {
    window.location.assign(route.match.url);
  }
  // Don't render anything if the route data or dictionary data is not fully loaded yet.
  // This is a good place for a "Loading" component, if one is needed.
  if (!has(routeData, "sitecore.route") || loadingLanguage) {
    return (
      <Fragment>
        <Helmet>
          <title>Loading...</title>
        </Helmet>
        <main>
          <h1>Loading...</h1>
        </main>
      </Fragment>
    );
  }
  // no route data for the current route in Sitecore - show not found component.
  // Note: this is client-side only 404 handling. Server-side 404 handling is the responsibility
  // of the server being used (i.e. node-headless-ssr-proxy and Sitecore intergrated rendering know how to send 404 status codes).
  if (notFound) {
    return (
      <Fragment>
        <Helmet>
          <title>{t("Page not found")}</title>
        </Helmet>
        <NotFound context={routeData.sitecore && routeData.sitecore.context} />
      </Fragment>
    );
  }
  // Render the app's root structural layout
  return <Layout route={routeData.sitecore.route} />;
}

export default RouteHandler;

/**
 * Gets route data from Sitecore. This data is used to construct the component layout for a JSS route.
 * @param {string} route Route path to get data for (e.g. /about)
 * @param {string} language Language to get route data in (content language, e.g. 'en')
 */
function getRouteData(route, language) {
  return new Promise(resolve => {
    const fetchOptions = {
      layoutServiceConfig: { host: config.sitecoreApiHost },
      querystringParams: {
        sc_lang: language,
        sc_apikey: config.sitecoreApiKey
      },
      fetcher: dataFetcher
    };

    return dataApi
      .fetchRouteData(route, fetchOptions)
      .then(resolve)
      .catch(error => {
        if (has(error, "response.data")) {
          resolve(error.response.data);
        } else {
          resolve(null);
        }
      });
  });
}

function updateSitecoreContextFactory(routeData) {
  if (has(routeData, "sitecore.route.itemId")) {
    SitecoreContextFactory.setSitecoreContext({
      route: routeData.sitecore.route,
      itemId: routeData.sitecore.route.itemId,
      ...routeData.sitecore.context
    });
  }
}

function formatRouteString(newRoutePath = "/") {
  let newRouteString = newRoutePath;
  if (newRoutePath.charAt() !== "/") {
    newRouteString = `/${newRoutePath}`;
  }
  return newRouteString;
}
