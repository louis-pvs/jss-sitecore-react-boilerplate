/**
 * SR Data
 * If we're running in a server-side rendering scenario,
 * the server will provide JSON in the #__JSS_STATE__ element
 * for us to acquire the initial state to run with on the client.
 *
 * This enables us to skip a network request to load up the layout data.
 * We are emitting a quiescent script with JSON so that we can take advantage
 * of JSON.parse()'s speed advantage over parsing full JS, and enable
 * working without needing `unsafe-inline` in Content Security Policies.
 *
 *  SSR is initiated from /server/server.js.
 * @param {String} JSS_ID - html `id` attribute to query where JSS state rendered
 * @return {Object} Parsed JSON object that contain JSS STATE
 */
let __JSS_STATE__ = null; // caching, this will cause issue if JSS render state twice after inital load
export default function getSSRData(JSS_ID = "__JSS_STATE__") {
  if (__JSS_STATE__) return __JSS_STATE__;
  const ssrRawJson = document.getElementById(JSS_ID);
  if (ssrRawJson) __JSS_STATE__ = JSON.parse(ssrRawJson.innerHTML);
  if (__JSS_STATE__) {
    __JSS_STATE__.context = __JSS_STATE__.context || {};
    __JSS_STATE__.sitecore = __JSS_STATE__.sitecore || {};
    __JSS_STATE__.sitecore.route = __JSS_STATE__.sitecore.route || {};
  }

  return __JSS_STATE__;
}

/**
 *
 * GraphQL Data
 * The Apollo Client needs to be initialized to make GraphQL available to the JSS app.
 *
 * Apollo supports SSR of GraphQL queries, so like JSS SSR, it has an object we can pre-hydrate the client cache from
 * to avoid needing to re-run GraphQL queries after the SSR page loads
 * @param {Object} jsonObject - a json object that contain initial state from JSS
 * @return {Object} apollo initial state from JSS in json object format
 */
export function getGraghQLStateFromJSS(jsonObject = getSSRData()) {
  return jsonObject && jsonObject.APOLLO_STATE ? jsonObject.APOLLO_STATE : null;
}
