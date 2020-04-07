import Helpers from './helpers'

const CURRENTLY_INFECTED_FACTOR = 10;
const CURRENTLY_INFECTED_SEVERE_FACTOR = 50;

const calculateCurrentlyInfected = (cases, severe) => {
    let factor = severe ? CURRENTLY_INFECTED_SEVERE_FACTOR : CURRENTLY_INFECTED_FACTOR;
    
    return cases * factor;
}

const calculateEstimatedInfectionsByDays = (currentInfections, days, severe) => {
    let incrementFactor = Math.floor(days / 3);
    return currentInfections * Math.pow(2, incrementFactor);
}

const covid19ImpactEstimator = (data) => {
    let currentlyInfected = calculateCurrentlyInfected(data.reportedCases)
    let currentlyInfectedSevere = calculateCurrentlyInfected(data.reportedCases, true);

    let numberOfDays = Helpers.getTimeElapsedInDays(28, "days");
    let infectionsByRequestedTime = calculateEstimatedInfectionsByDays(currentlyInfected, numberOfDays);
    let infectionsByRequestedTimeSevere = calculateEstimatedInfectionsByDays(currentlyInfectedSevere, numberOfDays, true);

    return {
        data,
        impact: {
            currentlyInfected,
            infectionsByRequestedTime,
        },
        severeImpact: {
            currentlyInfected: currentlyInfectedSevere,
            infectionsByRequestedTime: infectionsByRequestedTimeSevere,
        }
    }
};

export default covid19ImpactEstimator;
