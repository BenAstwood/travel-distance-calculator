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
const configFlights = (flights) => {
  return flights.map(flight => {
    const splitString = flight.split("");
    const distance = splitString.filter((char, index) => index > 1).join("");

    return {flightName: flight, depart: splitString[0], arrival: splitString[1], distance: parseInt(distance)};
  });
};

export default configFlights;