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
      currentlyInfected: formatDataForResponse(currentlyInfected),
      infectionsByRequestedTime: formatDataForResponse(infectionsByRequestedTime),
      severeCasesByRequestedTime: formatDataForResponse(severeCasesByRequestedTime),
      hospitalBedsByRequestedTime: formatDataForResponse(hospitalBedsByRequestedTime),
      // hospitalBedsByRequestedTime: hospitalBedsByRequestedTime < 0
      //   ? Math.round(hospitalBedsByRequestedTime)
      //   : formatDataForResponse(hospitalBedsByRequestedTime),
      casesForICUByRequestedTime: formatDataForResponse(casesForICUByRequestedTime),
      casesForVentilatorsByRequestedTime: formatDataForResponse(
        casesForVentilatorsByRequestedTime
      ),
      dollarsInFlight: parseFloat(dollarsInFlight).toFixed(2)
    },
    severeImpact: {
      currentlyInfected: formatDataForResponse(currentlyInfectedSevere),
      infectionsByRequestedTime: formatDataForResponse(infectionsByRequestedTimeSevere),
      severeCasesByRequestedTime: formatDataForResponse(severeCasesByRequestedTimeSevere),
      hospitalBedsByRequestedTime: formatDataForResponse(hospitalBedsByRequestedTimeSevere),
      // hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeSevere < 0
      //   ? Math.round(hospitalBedsByRequestedTimeSevere)
      //   : formatDataForResponse(hospitalBedsByRequestedTimeSevere),
      casesForICUByRequestedTime: formatDataForResponse(casesForICUByRequestedTimeSevere),
      casesForVentilatorsByRequestedTime: formatDataForResponse(
        casesForVentilatorsByRequestedTimeSevere
      ),
      dollarsInFlight: parseFloat(dollarsInFlightSevere).toFixed(2)
    }
  };

  return response;
};

export default covid19ImpactEstimator;
