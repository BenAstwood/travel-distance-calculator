export const travelCalc = {
  init(data) {
    let { flight, journeys, price } = data;

    data.flight = travelCalc.configFlights(flight);
    data.journeys = travelCalc.configJourneys(journeys);
    data.outcome = travelCalc.processCost(data.flight, journeys, price);

    return data.outcome;
  },

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

  noneStopFlight(route, routeDistance, destFlight) {
    if (routeDistance === null || destFlight.distance < routeDistance) {
      routeDistance = destFlight.distance;
      route.push(destFlight);
      return true;
    }
  },

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

  flightCost(route, prices, passengers = 1) {
    const { flight } = prices;
    let totalDistance = 0;

    route.forEach(leg => (totalDistance += leg.distance));
    return (((totalDistance * flight.price) / 100) * passengers).toFixed(2);
  },

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
