import Helpers from './helpers';

const calculateEstimatedInfectionsByDays = (currentInfections, days) => {
  const incrementFactor = Math.floor(days / 3);
  return currentInfections * (2 ** incrementFactor);
};

const formatDataForResponse = (data) => Math.floor(data);

const covid19ImpactEstimator = (data) => {
  const currentlyInfected = Helpers.getCurrentEstimatedInfections(
    data.reportedCases
  );
  const currentlyInfectedSevere = Helpers.getCurrentEstimatedInfections(
    data.reportedCases,
    true
  );

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

  let severeCasesByRequestedTime = Helpers.getSevereCasesByRequestedTime(
    infectionsByRequestedTime
  );
  severeCasesByRequestedTime = Math.floor(severeCasesByRequestedTime);
  let severeCasesByRequestedTimeSevere = Helpers.getSevereCasesByRequestedTime(
    infectionsByRequestedTimeSevere
  );
  severeCasesByRequestedTimeSevere = Math.floor(
    severeCasesByRequestedTimeSevere
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
    infectionsByRequestedTime
  );
  const casesForICUByRequestedTimeSevere = Helpers.getCasesForICUByRequestedTime(
    infectionsByRequestedTimeSevere
  );

  const casesForVentilatorsByRequestedTime = Helpers.getCasesForVentilatorsByRequestedTime(
    infectionsByRequestedTime
  );
  const casesForVentilatorsByRequestedTimeSevere = Helpers.getCasesForVentilatorsByRequestedTime(
    infectionsByRequestedTimeSevere
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
      currentlyInfected: formatDataForResponse(currentlyInfected),
      infectionsByRequestedTime: formatDataForResponse(infectionsByRequestedTime),
      severeCasesByRequestedTime: formatDataForResponse(severeCasesByRequestedTime),
      hospitalBedsByRequestedTime: parseInt(hospitalBedsByRequestedTime, 10),
      casesForICUByRequestedTime: formatDataForResponse(casesForICUByRequestedTime),
      casesForVentilatorsByRequestedTime: formatDataForResponse(
        casesForVentilatorsByRequestedTime
      ),
      dollarsInFlight: Number(dollarsInFlight.toFixed(2))
    },
    severeImpact: {
      currentlyInfected: formatDataForResponse(currentlyInfectedSevere),
      infectionsByRequestedTime: formatDataForResponse(infectionsByRequestedTimeSevere),
      severeCasesByRequestedTime: formatDataForResponse(severeCasesByRequestedTimeSevere),
      hospitalBedsByRequestedTime: parseInt(hospitalBedsByRequestedTimeSevere, 10),
      casesForICUByRequestedTime: formatDataForResponse(casesForICUByRequestedTimeSevere),
      casesForVentilatorsByRequestedTime: formatDataForResponse(
        casesForVentilatorsByRequestedTimeSevere
      ),
      dollarsInFlight: Number(dollarsInFlightSevere.toFixed(2))
    }
  };

  return response;
};

export default covid19ImpactEstimator;
