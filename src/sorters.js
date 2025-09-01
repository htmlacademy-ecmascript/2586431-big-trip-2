import dayjs from 'dayjs';
import { SortType } from './constants.js';

/**
 * @param {TPoint[]} points
 */
const sortPointsByDate = (points) =>
  points.sort((pointA, pointB) => {
    const dateA = dayjs(pointA.date_from);
    const dateB = dayjs(pointB.date_from);
    return dateA.diff(dateB);
  });

/**
 * @param {TPoint[]} points
 */
const sortPointsByPrice = (points) =>
  points.sort((pointA, pointB) => pointB.base_price - pointA.base_price);

/**
 * @param {TPoint[]} points
 */
const sortPointsByTime = (points) =>
  points.sort((pointA, pointB) => {
    const dateA = dayjs(pointA.date_to).diff(dayjs(pointA.date_from));
    const dateB = dayjs(pointB.date_to).diff(dayjs(pointB.date_from));
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
