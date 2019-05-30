/**
   * Concatinates flghts in the routes array into a string.
   *
   * @param {Array} route
   * Array of flights which make up the journey route.
   *
   * @param {Boolen} inboundFlight
   * Boolean value used for checking, default is set to false.
   *
   * @returns {String}
   */
const flightRouteString = (route, inboundFlight = false) => {
  if (route.length === 0) {
    return inboundFlight
      ? "No inbound route"
      : "No outbound route";
  } else {
    return route.length === 1
      ? route[0].flightName
      : route.map((leg, index) => index === 0
        ? leg.flightName
        : `--${leg.flightName}`).join("");
  }
};

export default flightRouteString;