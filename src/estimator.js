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

  const numberOfDays = Helpers.getTimeElapsedInDays(
    data.timeToElapse,
    data.periodType
  );

  const infectionsByRequestedTime = calculateEstimatedInfectionsByDays(
    currentlyInfected,
    numberOfDays
  );
  const infectionsByRequestedTimeSevere = calculateEstimatedInfectionsByDays(
    currentlyInfectedSevere,
    numberOfDays
  );

  const severeCasesByRequestedTime = Helpers.getSevereCasesByRequestedTime(
    infectionsByRequestedTime
  );
  const severeCasesByRequestedTimeSevere = Helpers.getSevereCasesByRequestedTime(
    infectionsByRequestedTimeSevere
  );

  const hospitalBedsByRequestedTime = Helpers.getTotalAvailableBeds(
    data.totalHospitalBeds,
    severeCasesByRequestedTime
  );

  const hospitalBedsByRequestedTimeSevere = Helpers.getTotalAvailableBeds(
    data.totalHospitalBeds,
    severeCasesByRequestedTimeSevere
  );

  const response = {
    data,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime
    },
    severeImpact: {
      currentlyInfected: currentlyInfectedSevere,
      infectionsByRequestedTime: infectionsByRequestedTimeSevere,
      severeCasesByRequestedTime: severeCasesByRequestedTimeSevere,
      hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeSevere
    }
  };

  return response;
};

export default covid19ImpactEstimator;
