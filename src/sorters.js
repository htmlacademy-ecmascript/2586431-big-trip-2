import dayjs from 'dayjs';
import { SortType } from './constants.js';

/**
 * @param {TPoint[]} points
 */
const sortPointsByDate = (points) =>
  points.sort((a, b) => {
    const dateA = dayjs(a.date_from);
    const dateB = dayjs(b.date_from);
    return dateA.diff(dateB);
  });

/**
 * @param {TPoint[]} points
 */
const sortPointsByPrice = (points) =>
  points.sort((a, b) => b.base_price - a.base_price);

/**
 * @param {TPoint[]} points
 */
const sortPointsByTime = (points) =>
  points.sort((a, b) => {
    const dateA = dayjs(a.date_to).diff(dayjs(a.date_from));
    const dateB = dayjs(b.date_to).diff(dayjs(b.date_from));
    return dateB - dateA;
  });

/**
 * @param {TPoint[]} points
 * @param {string} sortType
 */
const sortPoints = (points, sortType) => {
  switch (sortType) {
    case SortType.DAY:
      return sortPointsByDate(points);
    case SortType.PRICE:
      return sortPointsByPrice(points);
    case SortType.TIME:
      return sortPointsByTime(points);
    default:
      return [...points];
  }
};

export { sortPoints };
