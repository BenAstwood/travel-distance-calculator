import noneStopFlight from './noneStopFlight';
import multiStopFlight from './multiStopFlight';

/**
   * Flight route picking method.
   *
   * @param {Object} journey
   * Journey data.
   *
   * @param {Object} flights
   * Flights data.
   *
   * @returns {Object} route
   * Final route object.
   */
const pickFlightRoute = (journey, flights) => {
  const destFlights = flights.filter(flight => flight.arrival === journey.destination);
  let routeDistance = null;
  let route = [];
  let nonStopFlight = null;

  destFlights.forEach(destFlight => {
    if (journey.depart === destFlight.depart) {
      nonStopFlight = noneStopFlight(route, routeDistance, destFlight);
    } else if (nonStopFlight !== true) {
      route = multiStopFlight({route, destFlight, flights, journey});
    }
  });

  return route;
};

export default pickFlightRoute;