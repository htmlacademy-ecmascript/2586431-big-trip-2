import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDateTime } from '../utils.js';

function createEventTypeTemplate(types) {
  return types
    .map(
      (type, i) =>
        `<div class="event__type-item">
      <input
        id="event-type-${type}-${i}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
      >
      <label
        class="event__type-label event__type-label--${type}"
        for="event-type-${type}-${i}"
      >
        ${type}
      </label>
    </div>`
    )
    .join('');
}

function createDestinationsTemplate(destinations) {
  return destinations
    .map(({ name }) => `<option value="${name}"></option>`)
    .join('');
}

function createOffersTemplate(offers, selected) {
  if (offers.length === 0) {
    return '';
  }

  const offersListTemplate = offers
    .map(({ id, title, price }) => {
      const isChecked = selected.includes(id);
      return `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox visually-hidden"
          id="event-offer-${id}"
          data-id="${id}"
          type="checkbox"
          name="event-offer-${id}"
          ${isChecked ? 'checked' : ''}
        >
        <label class="event__offer-label" for="event-offer-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
    })
    .join('');

  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersListTemplate}
      </div>
    </section>`;
}

function createDescriptionTemplate({ description, pictures }) {
  if (!description) {
    return '';
  }

  const picturesListTemplate = pictures
    .map(
      (picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
    )
    .join('');

  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">
        Destination
      </h3>
      <p class="event__destination-description">
        ${description}
      </p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesListTemplate}
        </div>
      </div>
    </section>`;
}

function createTemplate({ point, destinations, types, offers } = {}) {
  const {
    base_price: basePrice,
    date_from: dateFrom,
    date_to: dateTo,
    offers: selectedOffers,
    type,
    id,
  } = point;
  const destination = destinations.find(
    (value) => value.id === point.destination
  );

  const humanDateTimeFrom = humanizeDateTime(dateFrom);
  const humanDateTimeTo = humanizeDateTime(dateTo);

  const eventTypeTemplate = createEventTypeTemplate(types);
  const destinationsTemplate = createDestinationsTemplate(destinations);
  const offersTemplate = createOffersTemplate(offers, selectedOffers);
  const descriptionTemplate = createDescriptionTemplate(destination);

  return `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypeTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input
            class="event__input event__input--destination"
            id="event-destination-${id}"
            type="text"
            name="event-destination"
            value="${destination?.name ?? ''}"
            list="destination-list-${id}"
          >
          <datalist id="destination-list-${id}">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanDateTimeFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanDateTimeTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>&euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${descriptionTemplate}
      </section>
    </form>`;
}

class PointFormView extends AbstractStatefulView {
  #handleFormClose = null;
  #handleFormSubmit = null;
  #offersModel = null;

  constructor({
    point,
    offersModel,
    destinations,
    onFormClose,
    onFormSubmit,
  } = {}) {
    super();
    this.#offersModel = offersModel;
    const offers = this.#offersModel.getByType(point.type);
    const types = this.#offersModel.types;
    this._setState({
      initialPoint: point,
      point,
      destinations,
      offers,
      types,
    });
    this.#handleFormClose = onFormClose;
    this.#handleFormSubmit = onFormSubmit;
    this.#setupHandlers();
  }

  #setupHandlers() {
    const form = this.element;
    form.addEventListener('submit', this.#formSubmitHandler);

    const rollupBtn = form.querySelector('.event__rollup-btn');
    rollupBtn.addEventListener('click', this.#formCloseHandler);

    const typeInputs = form.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) =>
      input.addEventListener('change', this.#typeChangeHandler)
    );

    const destinationInput = form.querySelector('.event__input--destination');
    destinationInput.addEventListener('change', this.#destinationChangeHandler);
    destinationInput.addEventListener('blur', this.#destinationBlurHandler);

    const priceInput = form.querySelector('.event__input--price');
    priceInput.addEventListener('change', this.#priceChangeHandler);

    const offersCheckboxes = form.querySelectorAll('.event__offer-checkbox');
    offersCheckboxes.forEach((checkbox) =>
      checkbox.addEventListener('change', this.#offersChangeHandler)
    );
  }

  _restoreHandlers() {
    this.#setupHandlers();
  }

  #updateAvailableOffers = (availableOffers) => {
    this.updateElement({
      offers: availableOffers,
      point: { ...this._state.point, offers: [] },
    });
  };

  #updatePoint = (update, { optimistic = false } = {}) => {
    const point = { ...this._state.point, ...update };
    if (optimistic) {
      this._setState({ point });
    } else {
      this.updateElement({ point });
    }
  };

  #typeChangeHandler = (evt) => {
    const offers = this.#offersModel.getByType(evt.target.value);
    this.#updateAvailableOffers(offers);
    this.#updatePoint({ type: evt.target.value });
  };

  #destinationChangeHandler = (evt) => {
    const name = evt.target.value;
    const destination = this._state.destinations.find(
      (value) => value.name === name
    );
    if (!destination) {
      return;
    }
    this.#updatePoint({ destination: destination.id });
  };

  #destinationBlurHandler = (evt) => {
    evt.target.value = this._state.point.destination?.name ?? '';
  };

  #priceChangeHandler = (evt) => {
    // eslint-disable-next-line camelcase
    this.#updatePoint({ base_price: evt.target.value });
  };

  #offersChangeHandler = (evt) => {
    const offerId = evt.target.dataset.id;
    if (!offerId) {
      return;
    }
    const currentOffers = new Set(this._state.point.offers);
    if (evt.target.checked) {
      currentOffers.add(offerId);
    } else {
      currentOffers.delete(offerId);
    }
    this.#updatePoint(
      { offers: Array.from(currentOffers) },
      { optimistic: true }
    );
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit?.(this._state.point);
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose?.();
  };

  get template() {
    return createTemplate(this._state);
  }
}

export default PointFormView;
