import configFlights from './configFlights';
import configJourneys from './configJourneys';
import processCost from './processCost';

/**
 * Initialising method, which returns outcome data.
 *
 * @param {Object} data
 * Fetched and parsed JSON data.
 *
 * @returns {Object}
 * Returned data outcome.
 */
const init = (data) => {
  let {flight, journeys, price} = data;

  data.flight = configFlights(flight);
  data.journeys = configJourneys(journeys);
  data.outcome = processCost(data.flight, journeys, price);

  return data.outcome;
};

export default init;