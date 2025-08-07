import dayjs from 'dayjs';

const TODAY = dayjs('2025-10-07T07:00:00');

const isPointFuture = (point) => dayjs(TODAY).isBefore(dayjs(point.date_from));

const isPointPresent = (point) => {
  const currentDate = dayjs(TODAY);
  return (
    currentDate.isBefore(dayjs(point.date_to)) &&
    currentDate.isAfter(dayjs(point.date_from))
  );
};

const isPointPast = (point) => dayjs(TODAY).isAfter(dayjs(point.date_to));

export { isPointFuture, isPointPresent, isPointPast };
