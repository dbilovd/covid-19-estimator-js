import EstimatorHelper from '../src/helpers';

describe('EstimatorHelper', () => {
  describe('getTimeElapsedInDays', () => {
    it('returns same number of days provided to it', () => {
      const estimatedDays = EstimatorHelper.getTimeElapsedInDays(10, 'days');

      expect(estimatedDays).toBe(10);
    });

    it('converts a week into 7 days', () => {
      let estimatedDays = EstimatorHelper.getTimeElapsedInDays(2, 'weeks');
      expect(estimatedDays).toBe(14);

      estimatedDays = EstimatorHelper.getTimeElapsedInDays(1, 'weeks');
      expect(estimatedDays).toBe(7);
    });

    it('converts a month into 30 days', () => {
      let estimatedDays = EstimatorHelper.getTimeElapsedInDays(2, 'months');
      expect(estimatedDays).toBe(60);

      estimatedDays = EstimatorHelper.getTimeElapsedInDays(1, 'months');
      expect(estimatedDays).toBe(30);
    });
  });

  describe('getSevereCasesByRequestedTime', () => {
    it('returns 15% of the value provided to it', () => {
      const infections = 100;
      const severeCases = EstimatorHelper.getSevereCasesByRequestedTime(infections);

      expect(severeCases).toBe(15);
    });
  });

  describe('getTotalAvailableBeds', () => {
    it('returns 35% of the number of total beds if no severe case', () => {
      const totalBeds = 100;
      const severeCases = 0;

      const availableBeds = EstimatorHelper.getTotalAvailableBeds(totalBeds, severeCases);

      expect(availableBeds).toBe(35);
    });

    it('returns 35% of total beds available - severe cases', () => {
      const totalBeds = 100;

      let severeCases = 10;
      let availableBeds = EstimatorHelper.getTotalAvailableBeds(totalBeds, severeCases);
      expect(availableBeds).toBe(25);

      severeCases = 40;
      availableBeds = EstimatorHelper.getTotalAvailableBeds(totalBeds, severeCases);
      expect(availableBeds).toBe(-5);
    });
  });

  describe('getCasesForICUByRequestedTime', () => {
    it('returns 5% of infections by Requested time', () => {
      const infections = 100;
      expect(
        EstimatorHelper.getCasesForICUByRequestedTime(infections)
      ).toBe(5);
    });
  });

  describe('getCasesForVentilatorsByRequestedTime', () => {
    it('returns 2% of infections by Requested time', () => {
      const infections = 100;
      expect(
        EstimatorHelper.getCasesForVentilatorsByRequestedTime(infections)
      ).toBe(2);
    });
  });

  describe('getLossToEconomy', () => {
    it('returns the amount lost using the formula (infections) * earningPopulation * averageIncome * days', () => {
      const infections = 100;
      const population = 0.5;
      const income = 1;
      const days = 30;

      const expected = infections * population * income * days;

      expect(
        EstimatorHelper.getLossToEconomy(
          infections, population, income, days
        )
      ).toBe(expected);
    });
  });
});
