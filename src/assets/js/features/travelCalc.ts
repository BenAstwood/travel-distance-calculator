export const travelCalc = {
  dataCheck(data) {
    if (!data.flight || !data.journey) {
      const checkInterval = setInterval(() => {
        if (data["price"]) {
          clearInterval(checkInterval);
          return travelCalc.init(data);
        }
      }, 5);
    } else {
      return travelCalc.init(data);
    }
  },

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

  pickFlightRoute(journey, flights) {
    const { depart, destination } = journey;
    const destFlights = flights.filter(
      flight => flight.arrival === journey.destination
    );
    let routeDistance = null;
    let route = [];
    let nonStopFlight = null;

    destFlights.forEach(destFlight => {
      if (journey.depart === destFlight.depart) {
        if (routeDistance === null || destFlight.distance < routeDistance) {
          routeDistance = destFlight.distance;
          route.push(destFlight);
        }

        nonStopFlight = true;
      } else if (nonStopFlight !== true) {
        const journeyStartFlights = flights.filter(
          startFlight => journey.depart === startFlight.depart
        );
        const startFlights = journeyStartFlights.filter(
          startFlight => destFlight.depart === startFlight.arrival
        );

        if (startFlights.length > 0) {
          const oneStopDistance =
            startFlights[0].distance + destFlight.distance;

          if (route.length > 0) {
            if (routeDistance < oneStopDistance) {
              route.push(startFlights[0], destFlight);
            } else {
              return;
            }
          } else {
            route.push(startFlights[0], destFlight);
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
                  route = [];
                  route.push(journeyStartFlight, flight, destFlight);
                }
              });
          });
        }
      }
    });

    return route;
  },

  flightCost(route, prices) {
    const { flight } = prices;
    let totalDistance = 0;

    route.forEach(leg => (totalDistance += leg.distance));
    return ((totalDistance * flight.price) / 100).toFixed(2);
  },

  flightRouteString(route) {
    if (route.length === 0) {
      return "No outbound route";
    }

    return route.length === 1
      ? route[0].flightName
      : route
          .map((leg, index) =>
            index === 0 ? leg.flightName : `--${leg.flightName}`
          )
          .join("");
  },

  processCost(flights, journeys, prices) {
    return journeys.forEach(journey => {
      journey.route = travelCalc.pickFlightRoute(journey, flights);
      journey.cost = travelCalc.flightCost(journey.route, prices);
      journey.routeString = travelCalc.flightRouteString(journey.route);
    });
  }
};
