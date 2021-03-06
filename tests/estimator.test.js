import estimator from '../src/estimator';

let baseData;

describe('Estimator', () => {
  beforeEach(() => {
    baseData = {
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
  });

  it('returns data formatted to match specification', () => {
    const response = estimator(baseData);

    expect(response.data).toBe(baseData);
  });

  it('calculates and returns currently infected persons', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;
    const response = estimator(baseData);

    expect(response.impact.currentlyInfected).toBe(
      Math.floor(currentlyInfected)
    );
    expect(response.severeImpact.currentlyInfected).toBe(
      Math.floor(currentlyInfectedSevere)
    );
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

    expect(response.impact.infectionsByRequestedTime).toBe(Math.floor(estimatedInfected));
    expect(response.severeImpact.infectionsByRequestedTime).toBe(Math.floor(estimatedInfectedSevere));
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

    expect(response.impact.infectionsByRequestedTime).toBe(Math.floor(estimatedInfected));
    expect(response.severeImpact.infectionsByRequestedTime).toBe(
      Math.floor(estimatedInfectedSevere)
    );
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

    expect(response.impact.infectionsByRequestedTime).toBe(Math.floor(estimatedInfected));
    expect(response.severeImpact.infectionsByRequestedTime).toBe(
      Math.floor(estimatedInfectedSevere)
    );
  });

  it('returns an number severe cases to hospitalise', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    baseData.timeToElapse = 1;
    baseData.periodType = 'months';
    const increaseFactor = 10;
    const estimatedInfected = currentlyInfected * (2 ** increaseFactor);
    const estimatedInfectedSevere = currentlyInfectedSevere * (2 ** increaseFactor);

    const severeCases = (estimatedInfected * 0.15);
    const severeCasesSevere = (estimatedInfectedSevere * 0.15);

    const response = estimator(baseData);

    expect(response.impact.severeCasesByRequestedTime).toBe(Math.floor(severeCases));
    expect(response.severeImpact.severeCasesByRequestedTime).toBe(Math.floor(severeCasesSevere));
  });

  it('returns total of beds available in hospitals', () => {
    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    baseData.timeToElapse = 28;
    baseData.periodType = 'days';
    baseData.totalHospitalBeds = 10000;
    const increaseFactor = Math.floor(baseData.timeToElapse / 3);
    const estimatedInfected = currentlyInfected * (2 ** increaseFactor);
    const estimatedInfectedSevere = currentlyInfectedSevere * (2 ** increaseFactor);

    const severeCases = Math.floor(estimatedInfected * 0.15);
    const severeCasesSevere = Math.floor(estimatedInfectedSevere * 0.15);

    const hospitalBedAvailable = (baseData.totalHospitalBeds * 0.35) - severeCases;
    const hospitalBedAvailableSevere = (baseData.totalHospitalBeds * 0.35) - severeCasesSevere;

    const response = estimator(baseData);

    expect(response.impact.hospitalBedsByRequestedTime).toBe(
      Math.floor(hospitalBedAvailable)
    );
    expect(response.severeImpact.hospitalBedsByRequestedTime).toBe(
      Math.floor(hospitalBedAvailableSevere)
    );
  });

  it('returns total of ICU, ventilators and impact on economy needed', () => {
    baseData.timeToElapse = 28;
    baseData.periodType = 'days';

    const currentlyInfected = baseData.reportedCases * 10;
    const currentlyInfectedSevere = baseData.reportedCases * 50;

    baseData.timeToElapse = 28;
    baseData.periodType = 'days';
    baseData.totalHospitalBeds = 10000;
    const increaseFactor = Math.floor(baseData.timeToElapse / 3);
    const estimatedInfected = currentlyInfected * (2 ** increaseFactor);
    const estimatedInfectedSevere = currentlyInfectedSevere * (2 ** increaseFactor);

    const icuCases = estimatedInfected * 0.05;
    const icuCasesSevere = estimatedInfectedSevere * 0.05;

    const ventilatorCases = estimatedInfected * 0.02;
    const ventilatorCasesSevere = estimatedInfectedSevere * 0.02;

    const lossToEconomy = estimatedInfected
      * baseData.region.avgDailyIncomePopulation
      * baseData.region.avgDailyIncomeInUSD * baseData.timeToElapse;
    const lossToEconomySevere = estimatedInfectedSevere
      * baseData.region.avgDailyIncomePopulation
      * baseData.region.avgDailyIncomeInUSD * baseData.timeToElapse;

    const response = estimator(baseData);

    expect(response.impact.casesForICUByRequestedTime).toBe(Math.floor(icuCases));
    expect(response.severeImpact.casesForICUByRequestedTime).toBe(Math.floor(icuCasesSevere));

    expect(response.impact.casesForVentilatorsByRequestedTime)
      .toBe(Math.floor(ventilatorCases));
    expect(response.severeImpact.casesForVentilatorsByRequestedTime)
      .toBe(Math.floor(ventilatorCasesSevere));

    expect(response.impact.dollarsInFlight).toBe(
      Number(parseFloat(lossToEconomy).toFixed(2))
    );
    expect(response.severeImpact.dollarsInFlight).toBe(
      Number(parseFloat(lossToEconomySevere).toFixed(2))
    );
  });
});
