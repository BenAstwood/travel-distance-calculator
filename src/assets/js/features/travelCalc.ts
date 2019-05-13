export const travelCalc = {
  /**
   * Initialising method, which returns outcome data.
   *
   * @param {Object} data
   * Fetched and parsed JSON data.
   *
   * @returns {Object}
   * Returned data outcome.
   */
  init(data) {
    let { flight, journeys, price } = data;

    data.flight = travelCalc.configFlights(flight);
    data.journeys = travelCalc.configJourneys(journeys);
    data.outcome = travelCalc.processCost(data.flight, journeys, price);

    return data.outcome;
  },

  /**
   * Method which configures the journeys data object so
   * that it can be passed to the logic methods.
   *
   * @param {Object} journeys
   * Fetched and parsed journeys JSON data.
   *
   * @returns {Object} journey
   * Better formatted journeys data object.
   */
  configJourneys(journeys) {
    return journeys.map(journey => {
      const splitString = journey.homeToAirport.split("");
      const distance = splitString.filter((char, index) => index > 0).join("");

      journey.depart = splitString[0];
      journey.homeToAirport = distance;
      journey.returnLeg = {
        depart: journey.destination,
        destination: journey.depart
      };

      return journey;
    });
  },

  /**
   * Method which configures the flights data object so
   * that it can be passed to the logic methods.
   *
   * @param {Object} flights
   * Fetched and parsed flights JSON data.
   *
   * @returns {Object}
   * Object created with the flights data.
   */
  configFlights(flights) {
    return flights.map(flight => {
      const splitString = flight.split("");
      const distance = splitString.filter((char, index) => index > 1).join("");

      return {
        flightName: flight,
        depart: splitString[0],
        arrival: splitString[1],
        distance: parseInt(distance)
      };
    });
  },

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
  noneStopFlight(route, routeDistance, destFlight) {
    if (routeDistance === null || destFlight.distance < routeDistance) {
      routeDistance = destFlight.distance;
      route.push(destFlight);
      return true;
    }
  },

  /**
   * Calculating method for one stop and two stop journeys.
   *
   * @param {Object} options
   * Object containing properties used for logic operations within this method.
   *
   * @returns {Object} finalRoute
   * Object containing the calculated final route data.
   */
  multiStopFlight(options) {
    let { route, destFlight, flights, journey } = options;
    let routeDistance = null;
    let finalRoute = [];

    const journeyStartFlights = flights.filter(
      startFlight => journey.depart === startFlight.depart
    );
    const startFlights = journeyStartFlights.filter(
      startFlight => destFlight.depart === startFlight.arrival
    );

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
            const twoStopRouteDistance =
              journeyStartFlight.distance +
              flight.distance +
              destFlight.distance;

            if (
              routeDistance === null ||
              twoStopRouteDistance < routeDistance
            ) {
              routeDistance = twoStopRouteDistance;
              finalRoute.push(journeyStartFlight, flight, destFlight);
            }
          });
      });
    }

    return finalRoute;
  },

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
  pickFlightRoute(journey, flights) {
    const destFlights = flights.filter(
      flight => flight.arrival === journey.destination
    );
    let routeDistance = null;
    let route = [];
    let nonStopFlight = null;

    destFlights.forEach(destFlight => {
      if (journey.depart === destFlight.depart) {
        nonStopFlight = travelCalc.noneStopFlight(
          route,
          routeDistance,
          destFlight
        );
      } else if (nonStopFlight !== true) {
        route = travelCalc.multiStopFlight({
          route,
          destFlight,
          flights,
          journey
        });
      }
    });

    return route;
  },

  /**
   * Calculates cost of the flights, comparing price, distamnce and passenger amount.
   *
   * @param {Array} route
   * Array of flight routes.
   *
   * @param {Object} prices
   * Object of prices for taxi, airplane and car.
   *
   * @param {Number} passengers
   * Passenger amount.
   *
   * @returns {Number}
   */
  flightCost(route, prices, passengers = 1) {
    const { flight } = prices;
    let totalDistance = 0;

    route.forEach(leg => (totalDistance += leg.distance));
    return (((totalDistance * flight.price) / 100) * passengers).toFixed(2);
  },

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
  flightRouteString(route, inboundFlight = false) {
    if (route.length === 0) {
      return inboundFlight ? "No inbound route" : "No outbound route";
    } else {
      return route.length === 1
        ? route[0].flightName
        : route
            .map((leg, index) =>
              index === 0 ? leg.flightName : `--${leg.flightName}`
            )
            .join("");
    }
  },

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
  processCost(flights, journeys, prices) {
    journeys.forEach(journey => {
      journey.route = travelCalc.pickFlightRoute(journey, flights);
      journey.cost = travelCalc.flightCost(
        journey.route,
        prices,
        journey.passengers
      );
      journey.routeString = travelCalc.flightRouteString(journey.route);
      journey.returnLeg.route = travelCalc.pickFlightRoute(
        journey.returnLeg,
        flights
      );
      journey.returnLeg.cost = travelCalc.flightCost(
        journey.returnLeg.route,
        prices,
        journey.passengers
      );
      journey.returnLeg.routeString = travelCalc.flightRouteString(
        journey.returnLeg.route,
        true
      );
    });

    return journeys;
  }
};
