import pickFlightRoute from './pickFlightRoute';
import flightCost from './flightCost';
import flightRouteString from './flightRouteString';

/**
 * This method passes data for each journey into the logic methods.
 *
 * @param {Array} flights
 * Array of the flights data.
 *
 * @param {Array} journeys
 * Array of the journeys data.
 *
 * @param {Object} prices
 * Object containing the prices data.
 *
 * @returns {Array} journeys
 * Returns calcuated journeys.
 */
const processCost = (flights, journeys, prices) => {
  journeys.forEach(journey => {
    journey.route = pickFlightRoute(journey, flights);
    journey.cost = flightCost(journey.route, prices, journey.passengers);
    journey.routeString = flightRouteString(journey.route);
    journey.returnLeg.route = pickFlightRoute(journey.returnLeg, flights);
    journey.returnLeg.cost = flightCost(journey.returnLeg.route, prices, journey.passengers);
    journey.returnLeg.routeString = flightRouteString(journey.returnLeg.route, true);
  });

  return journeys;
};

export default processCost;