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

const formatDataForResponse = (data) => Math.floor(data);

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

  const casesForICUByRequestedTime = Helpers.getCasesForICUByRequestedTime(
    currentlyInfected
  );
  const casesForICUByRequestedTimeSevere = Helpers.getCasesForICUByRequestedTime(
    currentlyInfectedSevere
  );

  const casesForVentilatorsByRequestedTime = Helpers.getCasesForVentilatorsByRequestedTime(
    currentlyInfected
  );
  const casesForVentilatorsByRequestedTimeSevere = Helpers.getCasesForVentilatorsByRequestedTime(
    currentlyInfectedSevere
  );

  const dollarsInFlight = Helpers.getLossToEconomy(
    currentlyInfected,
    (data.region.avgDailyIncomePopulation * data.population),
    data.region.avgDailyIncomeInUSD,
    numberOfDays
  );
  const dollarsInFlightSevere = Helpers.getLossToEconomy(
    currentlyInfectedSevere,
    (data.region.avgDailyIncomePopulation * data.population),
    data.region.avgDailyIncomeInUSD,
    numberOfDays
  );

  const response = {
    data,
    impact: {
      currentlyInfected: formatDataForResponse(currentlyInfectedSevere),
      infectionsByRequestedTime: formatDataForResponse(infectionsByRequestedTime),
      severeCasesByRequestedTime: formatDataForResponse(severeCasesByRequestedTime),
      hospitalBedsByRequestedTime: formatDataForResponse(hospitalBedsByRequestedTime),
      casesForICUByRequestedTime: formatDataForResponse(casesForICUByRequestedTime),
      casesForVentilatorsByRequestedTime: formatDataForResponse(casesForVentilatorsByRequestedTime),
      dollarsInFlight
    },
    severeImpact: {
      currentlyInfected: formatDataForResponse(currentlyInfectedSevere),
      infectionsByRequestedTime: formatDataForResponse(infectionsByRequestedTimeSevere),
      severeCasesByRequestedTime: formatDataForResponse(severeCasesByRequestedTimeSevere),
      hospitalBedsByRequestedTime: formatDataForResponse(hospitalBedsByRequestedTimeSevere),
      casesForICUByRequestedTime: formatDataForResponse(casesForICUByRequestedTimeSevere),
      casesForVentilatorsByRequestedTime: formatDataForResponse(casesForVentilatorsByRequestedTimeSevere),
      dollarsInFlight: dollarsInFlightSevere
    }
  };

  return response;
};

export default covid19ImpactEstimator;
