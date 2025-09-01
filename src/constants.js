const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const ListMessageText = {
  LOADING: 'Loading...',
  FAILED: 'Failed to load latest route information',
  EMPTY: {
    [FilterType.EVERYTHING]: 'Click New Event to create your first point',
    [FilterType.PAST]: 'There are no past events now',
    [FilterType.PRESENT]: 'There are no present events now',
    [FilterType.FUTURE]: 'There are no future events now',
  },
};

const DateFormat = {
  MONTH_DAY: 'MMM D',
  DAY_MONTH: 'D MMM',
  HOUR_MINUTE: 'HH:mm',
  DAY_MONTH_YEAR_HOUR_MINUTE: 'DD/MM/YY HH:mm',
  DURATION_MINUTE: 'mm[M]',
  DURATION_HOUR_MINUTE: 'HH[H] mm[M]',
  DURATION_DAY_SUFFIX: 'D',
  DURATION_DAY_PAD: 2,
};

const INFO_MAX_DESTINATIONS = 3;

const DEFAULTS = {
  FILTER: FilterType.EVERYTHING,
  SORT: SortType.DAY,
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

export {
  SortType,
  FilterType,
  ListMessageText,
  DateFormat,
  INFO_MAX_DESTINATIONS,
  DEFAULTS,
};
