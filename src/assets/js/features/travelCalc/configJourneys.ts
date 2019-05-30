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
const configJourneys = (journeys) => {
  return journeys.map(journey => {
    const splitString = journey
      .homeToAirport
      .split("");
    const distance = splitString.filter((char, index) => index > 0).join("");

    journey.depart = splitString[0];
    journey.homeToAirport = distance;
    journey.returnLeg = {
      depart: journey.destination,
      destination: journey.depart
    };

    return journey;
  });
};

export default configJourneys;