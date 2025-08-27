import dayjs from 'dayjs';

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

export { sortPointsByDate, sortPointsByPrice, sortPointsByTime };
