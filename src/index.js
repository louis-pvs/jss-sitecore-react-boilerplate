import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import AppRoot from "./AppRoot";
import i18ninit from "./i18n";
import axeInit from "./axe";
import "./assets/app.css";
import getSSRData from "./getSSRData";
import config from "./temp/config";

// when React initializes from a SSR-based initial state, you need to render with `hydrate` instead of `render`
let renderFunction = ReactDOM.render;
if (getSSRData()) renderFunction = ReactDOM.hydrate;

// push the initial SSR state into the route handler, where it will be used
// setServerSideRenderingState(__JSS_STATE__);

/* App Rendering */
// initialize the dictionary, then render the app
// note: if not making a multlingual app, the dictionary init can be removed.
Promise.all([i18ninit(config.defaultLanguage), axeInit(React, ReactDOM)]).then(
  () => {
    // HTML element to place the app into
    const rootElement = document.getElementById("root");

    renderFunction(
      <AppRoot path={window.location.pathname} Router={Router} />,
      rootElement
    );
  }
);
