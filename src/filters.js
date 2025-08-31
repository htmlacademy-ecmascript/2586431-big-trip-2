import dayjs from 'dayjs';
import { FilterType } from './constants.js';

const isPointFuture = (point) => dayjs().isBefore(dayjs(point.date_from));

const isPointPresent = (point) => {
  const currentDate = dayjs();
  return (
    currentDate.isBefore(dayjs(point.date_to)) &&
    currentDate.isAfter(dayjs(point.date_from))
  );
};

const isPointPast = (point) => dayjs().isAfter(dayjs(point.date_to));

/**
 * @param {TPoint[]} points
 * @param {string} filterType
 * @param {Date} [now]
 * @returns {TPoint[]}
 */
const filterPoints = (points, filterType, now = new Date()) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return [...points];
    case FilterType.FUTURE:
      return points.filter((point) => isPointFuture(point, now));
    case FilterType.PRESENT:
      return points.filter((point) => isPointPresent(point, now));
    case FilterType.PAST:
      return points.filter((point) => isPointPast(point, now));
    default:
      return [...points];
  }
};

const getAvailableFiltersForPoints = (points) => {
  const available = [];
  if (points.length > 0) {
    available.push(FilterType.EVERYTHING);
  }
  if (points.some(isPointFuture)) {
    available.push(FilterType.FUTURE);
  }
  if (points.some(isPointPresent)) {
    available.push(FilterType.PRESENT);
  }
  if (points.some(isPointPast)) {
    available.push(FilterType.PAST);
  }
  return available;
};

export { filterPoints, getAvailableFiltersForPoints };
