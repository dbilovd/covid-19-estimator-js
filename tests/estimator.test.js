import estimator from '../src/estimator';

const baseData = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};

describe('Estimator', () => {
  it('returns data formatted to match specification', () => {
    const response = estimator(baseData);

    expect(response.data).toBe(baseData);
  });

  it('can calculates and returns currently infected persons', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;
    const response = estimator(baseData);

    expect(response.impact.currentlyInfected).toBe(currentlyInfected);
    expect(response.severeImpact.currentlyInfected).toBe(currentlyInfectedSevere);
  });

  it('returns an estimated number of infected persons in number of days provided (28)', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    baseData.timeToElapse = 28;
    baseData.periodType = 'days';
    const increaseFactor = 9;
    const estimatedInfected = currentlyInfected * (2 ** increaseFactor);
    const estimatedInfectedSevere = currentlyInfectedSevere * (2 ** increaseFactor);

    const response = estimator(baseData);

    expect(response.impact.infectionsByRequestedTime).toBe(estimatedInfected);
    expect(response.severeImpact.infectionsByRequestedTime).toBe(estimatedInfectedSevere);
  });

  it('returns an estimated number of infected persons in number of weeks', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    baseData.timeToElapse = 4;
    baseData.periodType = 'weeks';
    const increaseFactor = 9;
    const estimatedInfected = currentlyInfected * (2 ** increaseFactor);
    const estimatedInfectedSevere = currentlyInfectedSevere * (2 ** increaseFactor);

    const response = estimator(baseData);

    expect(response.impact.infectionsByRequestedTime).toBe(estimatedInfected);
    expect(response.severeImpact.infectionsByRequestedTime).toBe(estimatedInfectedSevere);
  });

  it('returns an estimated number of infected persons in number of months', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    baseData.timeToElapse = 1;
    baseData.periodType = 'months';
    const increaseFactor = 10;
    const estimatedInfected = currentlyInfected * (2 ** increaseFactor);
    const estimatedInfectedSevere = currentlyInfectedSevere * (2 ** increaseFactor);

    const response = estimator(baseData);

    expect(response.impact.infectionsByRequestedTime).toBe(estimatedInfected);
    expect(response.severeImpact.infectionsByRequestedTime).toBe(estimatedInfectedSevere);
  });

  it('returns an number severe cases to hospitalise', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    baseData.timeToElapse = 1;
    baseData.periodType = 'months';
    const increaseFactor = 10;
    const estimatedInfected = currentlyInfected * (2 ** increaseFactor);
    const estimatedInfectedSevere = currentlyInfectedSevere * (2 ** increaseFactor);

    const severeCases = estimatedInfected * 0.15;
    const severeCasesSevere = estimatedInfectedSevere * 0.15;

    const response = estimator(baseData);

    expect(response.impact.severeCasesByRequestedTime).toBe(severeCases);
    expect(response.severeImpact.severeCasesByRequestedTime).toBe(severeCasesSevere);
  });

  it.only('returns total of beds available in hospitals', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    baseData.timeToElapse = 1;
    baseData.periodType = 'week';
    baseData.totalHospitalBeds = 10000;
    const increaseFactor = 2;
    const estimatedInfected = currentlyInfected * (2 ** increaseFactor);
    const estimatedInfectedSevere = currentlyInfectedSevere * (2 ** increaseFactor);

    const severeCases = estimatedInfected * 0.15;
    const severeCasesSevere = estimatedInfectedSevere * 0.15;

    const hospitalBedAvailable = (baseData.totalHospitalBeds * 0.35) - severeCases;
    const hospitalBedAvailableSevere = (baseData.totalHospitalBeds * 0.35) - severeCasesSevere;

    const response = estimator(baseData);

    expect(response.impact.hospitalBedsByRequestedTime).toBe(hospitalBedAvailable);
    expect(response.severeImpact.hospitalBedsByRequestedTime).toBe(hospitalBedAvailableSevere);
  });

  it.only('returns total of beds available in hospitals', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    const icuCases = currentlyInfected * 0.05;
    const icuCasesSevere = currentlyInfectedSevere * 0.05;

    const ventilatorCases = currentlyInfected * 0.02;
    const ventilatorCasesSevere = currentlyInfectedSevere * 0.02;

    const lossToEconomy = currentlyInfected
      * baseData.region.avgDailyIncomePopulation * baseData.population
      * baseData.region.avgDailyIncomeInUSD * 30;
    const lossToEconomySevere = currentlyInfectedSevere
      * baseData.region.avgDailyIncomePopulation * baseData.population
      * baseData.region.avgDailyIncomeInUSD * 30;


    baseData.timeToElapse = 30;
    baseData.periodType = 'days';
    const response = estimator(baseData);

    expect(response.impact.casesForICUByRequestedTime).toBe(icuCases);
    expect(response.severeImpact.casesForICUByRequestedTime).toBe(icuCasesSevere);

    expect(response.impact.casesForVentilatorsByRequestedTime)
      .toBe(ventilatorCases);
    expect(response.severeImpact.casesForVentilatorsByRequestedTime)
      .toBe(ventilatorCasesSevere);

    expect(response.impact.dollarsInFlight).toBe(lossToEconomy);
    expect(response.severeImpact.dollarsInFlight).toBe(lossToEconomySevere);
  });
});
