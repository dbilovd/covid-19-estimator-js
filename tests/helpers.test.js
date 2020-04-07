'use strict';
import EstimatorHelper from './../src/helpers';

describe("EstimatorHelper", () => {

  describe("getTimeElapsedInDays", () => {
    it("returns same number of days provided to it", () => {
      let estimatedDays = EstimatorHelper.getTimeElapsedInDays(10, "days");

      expect(estimatedDays).toBe(10);
    });

    it("converts a week into 7 days", () => {
      let estimatedDays = EstimatorHelper.getTimeElapsedInDays(2, "weeks");
      expect(estimatedDays).toBe(14);

      estimatedDays = EstimatorHelper.getTimeElapsedInDays(1, "weeks");
      expect(estimatedDays).toBe(7);
    });

    it("converts a month into 30 days", () => {
      let estimatedDays = EstimatorHelper.getTimeElapsedInDays(2, "months");
      expect(estimatedDays).toBe(60);

      estimatedDays = EstimatorHelper.getTimeElapsedInDays(1, "months");
      expect(estimatedDays).toBe(30);
    });
  });

});
