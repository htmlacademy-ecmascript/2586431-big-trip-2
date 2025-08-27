import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DateFormat, BasePrice } from './constants.js';

dayjs.extend(duration);

const getRandomArrayElement = (items) =>
  items[Math.floor(Math.random() * items.length)];

const humanizeDateTime = (date) =>
  date ? dayjs(date).format(DateFormat.DAY_MONTH_YEAR_HOUR_MINUTE) : '';

const humanizeDate = (date, dayFirst = false) =>
  dayjs(date).format(dayFirst ? DateFormat.DAY_MONTH : DateFormat.MONTH_DAY);

const humanizeTime = (date) => dayjs(date).format(DateFormat.HOUR_MINUTE);

const getTimeDifference = (dateFrom, dateTo) => {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);
  const datesDifference = date2.diff(date1);
  const durationObject = dayjs.duration(datesDifference);
  if (durationObject.asHours() < 1) {
    return durationObject.format(DateFormat.DURATION_MINUTE);
  }
  const hourMinute = durationObject.format(DateFormat.DURATION_HOUR_MINUTE);
  if (durationObject.asDays() < 1) {
    return hourMinute;
  }
  const days = Math.trunc(durationObject.asDays());
  return `${days.toString().padStart(DateFormat.DURATION_DAY_PAD, '0')}${
    DateFormat.DURATION_DAY_SUFFIX
  } ${hourMinute}`;
};

const getRandomBasePrice = (a = BasePrice.MIN, b = BasePrice.MAX) => {
  const from = Math.ceil(Math.min(a, b));
  const to = Math.floor(Math.max(a, b));
  return Math.floor(Math.random() * (to - from + 1)) + from;
};

export {
  humanizeDate,
  humanizeTime,
  humanizeDateTime,
  getTimeDifference,
  getRandomArrayElement,
  getRandomBasePrice,
};
