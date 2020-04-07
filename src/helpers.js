'use strict';

let getTimeElapsedInDays = (duration, quantity) => {
  switch (quantity) {
    case 'weeks':
    case 'week':
      return duration * 7;
      break;

    case 'months':
    case 'month':
      return duration * 30;
      break;

    case 'days':
    case 'day':
    default:
      return duration;
      break;
  }
}

export default {
  getTimeElapsedInDays,
}