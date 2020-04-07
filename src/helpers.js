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

export default {
  getTimeElapsedInDays
};
