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
const flightCost = (route, prices, passengers = 1) => {
  const {flight} = prices;
  let totalDistance = 0;

  route.forEach(leg => (totalDistance += leg.distance));
  return (((totalDistance * flight.price) / 100) * passengers).toFixed(2);
};

export default flightCost;