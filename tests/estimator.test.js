// let estimator = require('./../src/estimator');
import estimator from './../src/estimator'

let baseData = {
    region: {
        name: "Africa",
        avgAge: 19.7, avgDailyIncomeInUSD: 5, avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
}

describe("Estimator", () => {
    it("returns data formatted to match specification", () => {
        let response = estimator(baseData);

        expect(response.hasOwnProperty('data')).toBe(true);
        expect(response.data).toBe(baseData);
        expect(response.hasOwnProperty('impact')).toBe(true);
        expect(response.hasOwnProperty('severeImpact')).toBe(true);
    });

    it("can calculates and returns currently infected persons", () => {
        let currentlyInfected = baseData.reportedCases * 10;
        let currentlyInfectedSevere = baseData.reportedCases * 50;
        let response = estimator(baseData);

        expect(response.impact.hasOwnProperty("currentlyInfected")).toBe(true);
        expect(response.impact.currentlyInfected).toBe(currentlyInfected);
        expect(response.severeImpact.hasOwnProperty("currentlyInfected")).toBe(true);
        expect(response.severeImpact.currentlyInfected).toBe(currentlyInfectedSevere);
    });

    it("returns an estimated number of infected persons in number of days provided (28)", () => {
        let currentlyInfected = baseData.reportedCases * 10;
        let currentlyInfectedSevere = baseData.reportedCases * 50;

        let numberOfDays = 28;
        let increaseFactor = Math.floor(numberOfDays / 3);
        let estimatedInfected = currentlyInfected * Math.pow(2, increaseFactor);
        let estimatedInfectedSevere = currentlyInfectedSevere * Math.pow(2, increaseFactor);

        let response = estimator(baseData);

        expect(response.impact.hasOwnProperty("infectionsByRequestedTime")).toBe(true);
        expect(response.impact.infectionsByRequestedTime).toBe(estimatedInfected);
        expect(response.severeImpact.hasOwnProperty("infectionsByRequestedTime")).toBe(true);
        expect(response.severeImpact.infectionsByRequestedTime).toBe(estimatedInfectedSevere);
    });
});
