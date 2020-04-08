const getTimeElapsedInDays = (duration, quantity) => {
  switch (quantity) {
    case 'weeks':
    case 'week':
      return duration * 7;

    case 'months':
    case 'month':
      return duration * 30;

    case 'days':
    case 'day':
    default:
      return duration;
  }
};

const getSevereCasesByRequestedTime = (infections) => infections * 0.15;

const getTotalAvailableBeds = (totalBeds, cases) => (totalBeds * 0.35) - cases;

export default {
  getTimeElapsedInDays,
  getSevereCasesByRequestedTime,
  getTotalAvailableBeds
};
