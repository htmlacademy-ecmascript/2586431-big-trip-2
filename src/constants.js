const POINTS_COUNT = 4;

const DateFormat = {
  MONTH_DAY: 'MMM D',
  HOUR_MINUTE: 'HH:mm',
  DAY_MONTH_YEAR_HOUR_MINUTE: 'DD/MM/YY HH:mm',
  DURATION_MINUTE: 'mm[M]',
  DURATION_HOUR_MINUTE: 'HH[H] mm[M]',
  DURATION_DAY_HOUR_MINUTE: 'DD[D] HH[H] mm[M]',
};

const BasePrice = {
  MIN: 100,
  MAX: 9999,
};

const INFO_MAX_DESTINATIONS = 3;

const SORTS = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
  OFFER: 'offer',
  EVENT: 'event',
};

const FILTERS = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

const DEFAULTS = {
  FILTER: FILTERS.EVERYTHING,
  SORT: SORTS.DAY,
  /** @type {Partial<TPoint>} */
  POINT: {
    type: 'flight',
    // eslint-disable-next-line camelcase
    base_price: 0,
    offers: [],
    // eslint-disable-next-line camelcase
    is_favorite: false,
  },
};

const MESSAGES = {
  EMPTY: {
    [FILTERS.EVERYTHING]: 'Click New Event to create your first point',
    [FILTERS.PAST]: 'There are no past events now',
    [FILTERS.PRESENT]: 'There are no present events now',
    [FILTERS.FUTURE]: 'There are no future events now',
  },
  LOADING: 'Loading...',
  FAILED: 'Failed to load latest route information',
};

export {
  POINTS_COUNT,
  DateFormat,
  BasePrice,
  INFO_MAX_DESTINATIONS,
  DEFAULTS,
  SORTS,
  FILTERS,
  MESSAGES,
};
