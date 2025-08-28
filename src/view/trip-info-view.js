import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate } from '../utils.js';
import { sortPoints } from '../sorters.js';
import { INFO_MAX_DESTINATIONS, SortType } from '../constants.js';

function getDates(points) {
  const sortedPoints = sortPoints(points, SortType.DAY);
  const startDate = dayjs(sortedPoints[0].date_from);
  const endDate = dayjs(sortedPoints[sortedPoints.length - 1].date_to);
  return `${humanizeDate(startDate, true)} &mdash; ${humanizeDate(
    endDate,
    true
  )}`;
}

function getTotalPrice(points) {
  return points.reduce(
    (sum, point) =>
      sum +
      point.base_price +
      point.offers.reduce((offersSum, offer) => offersSum + offer.price, 0),
    0
  );
}

function getDestinations(points) {
  const sortedPoints = sortPoints(points, SortType.DAY);
  const destinations = sortedPoints.map((point) => point.destination.name);
  const uniqueDestinations = destinations.filter(
    (value, index, self) => self[index - 1] !== value
  );
  if (uniqueDestinations.length > INFO_MAX_DESTINATIONS) {
    return `${uniqueDestinations[0]} &mdash; ... &mdash; ${
      uniqueDestinations[uniqueDestinations.length - 1]
    }`;
  }
  return uniqueDestinations.join(' &mdash; ');
}

function createTemplate({ points }) {
  if (!points.length) {
    return '<<section class="trip-main__trip-info  trip-info"></section>';
  }
  const dates = getDates(points);
  const totalPrice = getTotalPrice(points);
  const destinations = getDestinations(points);
  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`;
}

class TripInfoView extends AbstractStatefulView {
  constructor({ points }) {
    super();
    this._setState({ points });
  }

  _restoreHandlers() {}

  get template() {
    return createTemplate(this._state);
  }
}

export default TripInfoView;
