/**
   * Measures the distances for 'Non-stop' flights.
   * Pushing the shortest to the route array.
   *
   * @param {Array} route
   * An array which the shortest distance flight pushed to it.
   *
   * @param {Null|Number} routeDistance
   * Variable used for checking against.
   *
   * @param {destFlight} destFlight
   * A flight and instance of the destFilghts array.
   *
   * @returns {Boolean}
   * Boolean value used for checking within the invoking method.
   */
const noneStopFlight = (route, routeDistance, destFlight) => {
  if (routeDistance === null || destFlight.distance < routeDistance) {
    routeDistance = destFlight.distance;
    route.push(destFlight);
    return true;
  }
};

export default noneStopFlight;