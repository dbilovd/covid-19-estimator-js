import Helpers from './helpers';

const CURRENTLY_INFECTED_FACTOR = 10;
const CURRENTLY_INFECTED_SEVERE_FACTOR = 50;

const calculateCurrentlyInfected = (cases, severe) => {
  const factor = severe ? CURRENTLY_INFECTED_SEVERE_FACTOR : CURRENTLY_INFECTED_FACTOR;

  return cases * factor;
};

const calculateEstimatedInfectionsByDays = (currentInfections, days) => {
  const incrementFactor = Math.floor(days / 3);
  return currentInfections * (2 ** incrementFactor);
};

const covid19ImpactEstimator = (data) => {
  const currentlyInfected = calculateCurrentlyInfected(data.reportedCases);
  const currentlyInfectedSevere = calculateCurrentlyInfected(data.reportedCases, true);

  const numberOfDays = Helpers.getTimeElapsedInDays(28, 'days');
  const infectionsByRequestedTime = calculateEstimatedInfectionsByDays(
    currentlyInfected,
    numberOfDays
  );
  const infectionsByRequestedTimeSevere = calculateEstimatedInfectionsByDays(
    currentlyInfectedSevere,
    numberOfDays
  );

  const response = {
    data,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime
    },
    severeImpact: {
      currentlyInfected: currentlyInfectedSevere,
      infectionsByRequestedTime: infectionsByRequestedTimeSevere
    }
  };

  return response;
};

export default covid19ImpactEstimator;
