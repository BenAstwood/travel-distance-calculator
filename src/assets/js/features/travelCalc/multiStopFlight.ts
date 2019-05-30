/**
   * Calculating method for one stop and two stop journeys.
   *
   * @param {Object} options
   * Object containing properties used for logic operations within this method.
   *
   * @returns {Object} finalRoute
   * Object containing the calculated final route data.
   */
const multiStopFlight = (options) => {
  let {route, destFlight, flights, journey} = options;
  let routeDistance = null;
  let finalRoute = [];

  const journeyStartFlights = flights.filter(startFlight => journey.depart === startFlight.depart);
  const startFlights = journeyStartFlights.filter(startFlight => destFlight.depart === startFlight.arrival);

  if (startFlights.length > 0) {
    const oneStopDistance = startFlights[0].distance + destFlight.distance;

    if (route.length > 0) {
      if (routeDistance < oneStopDistance) {
        finalRoute.push(startFlights[0], destFlight);
      } else {
        return;
      }
    } else {
      finalRoute.push(startFlights[0], destFlight);
      routeDistance = oneStopDistance;
    }
  } else {
    journeyStartFlights.forEach(journeyStartFlight => {
      flights
        .filter(flight => journeyStartFlight.arrival === flight.depart)
        .filter(flight => flight.arrival === destFlight.depart)
        .map(flight => {
          const twoStopRouteDistance = journeyStartFlight.distance + flight.distance + destFlight.distance;

          if (routeDistance === null || twoStopRouteDistance < routeDistance) {
            routeDistance = twoStopRouteDistance;
            finalRoute.push(journeyStartFlight, flight, destFlight);
          }
        });
    });
  }

  return finalRoute;
};

export default multiStopFlight;