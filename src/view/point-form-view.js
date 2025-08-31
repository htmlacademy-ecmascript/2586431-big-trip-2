// @ts-check
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDateTime } from '../utils.js';
import { DEFAULTS } from '../constants.js';

/**
 * @param {string[]} types
 */
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

/**
 * @param {TDestination[]} destinations
 */
function createDestinationsTemplate(destinations) {
  return destinations
    .map(({ name }) => `<option value="${name}"></option>`)
    .join('');
}

/**
 * @param {TOffer[]} offers
 * @param {string[] | undefined} selected
 */
function createOffersTemplate(offers, selected) {
  if (offers.length === 0) {
    return '';
  }

  const offersListTemplate = offers
    .map(({ id, title, price }) => {
      const isChecked = selected?.includes(id);
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

/**
 * @param {TDestination | undefined} destination
 */
function createDescriptionTemplate(destination) {
  const { description, pictures } = destination ?? {};
  if (!description) {
    return '';
  }

  const picturesListTemplate = pictures
    ?.map(
      (picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
    )
    .join('');

  // prettier-ignore
  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">
        Destination
      </h3>
      <p class="event__destination-description">
        ${description}
      </p>
      ${
  pictures?.length
    ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesListTemplate}
        </div>
      </div>
      `
    : ''
}
    </section>`;
}

/**
 * @param {{
 *   point: Partial<TPoint>;
 *   destinations: TDestination[];
 *   types: string[];
 *   offers: TOffer[];
 *   isSaving: boolean;
 *   isResetting: boolean;
 *   disabled: boolean;
 * }} state
 */
function createTemplate(state) {
  const {
    point,
    destinations,
    types,
    offers,
    isSaving,
    isResetting,
    disabled,
  } = state;
  const {
    base_price: basePrice,
    date_from: dateFrom,
    date_to: dateTo,
    offers: selectedOffers,
    type,
    id = 'new',
  } = point;
  const destination = destinations.find(
    (value) => value.id === point?.destination
  );

  const humanDateTimeFrom = humanizeDateTime(dateFrom);
  const humanDateTimeTo = humanizeDateTime(dateTo);

  const eventTypeTemplate = createEventTypeTemplate(types);
  const destinationsTemplate = createDestinationsTemplate(destinations);
  const offersTemplate = createOffersTemplate(offers, selectedOffers);
  const descriptionTemplate = createDescriptionTemplate(destination);

  let resetButtonText = 'Cancel';
  if (isResetting) {
    resetButtonText = 'Cancelling...';
  }
  if (id !== 'new') {
    resetButtonText = 'Delete';
    if (isResetting) {
      resetButtonText = 'Deleting...';
    }
  }

  // prettier-ignore
  return `<div><form class="event event--edit" action="#" method="post" autocomplete="off">
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
            required
            ${disabled ? 'disabled' : ''}
          >
          <datalist id="destination-list-${id}">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanDateTimeFrom}" required ${
  disabled ? 'disabled' : ''
}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanDateTimeTo}" required ${
  disabled ? 'disabled' : ''
}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>&euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" min="1" required name="event-price" value="${basePrice}" ${
  disabled ? 'disabled' : ''
}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${
  disabled ? 'disabled' : ''
}>
          ${isSaving ? 'Saving...' : 'Save'}
        </button>
        <button class="event__reset-btn" type="reset">
          ${resetButtonText}
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${descriptionTemplate}
      </section>
    </form></div>`;
}

class PointFormView extends AbstractStatefulView {
  /** @type {() => void | Promise<void>} */
  #handleFormClose;
  #handleFormSubmit;
  #offersModel;
  #handleReset;
  /** @type {import('flatpickr').default.Instance} */
  #startTimePicker;
  /** @type {import('flatpickr').default.Instance} */
  #endTimePicker;
  #pickerConfig = {
    enableTime: true,
    // eslint-disable-next-line camelcase
    time_24hr: true,
    dateFormat: 'd/m/y H:i',
  };

  /**
   * @param {{
   *   point: Partial<TPoint>;
   *   offersModel: import('../model/offers-model').default;
   *   destinations: TDestination[];
   *   onFormClose: () => void;
   *   onFormSubmit: (body: TPoint) => Promise<void>;
   *   onReset?: () => void | Promise<void>;
   * }} config
   */
  constructor({
    point,
    offersModel,
    destinations,
    onFormClose,
    onFormSubmit,
    onReset,
  }) {
    super();
    this.#offersModel = offersModel;
    const offers = point?.type ? this.#offersModel.getByType(point.type) : [];
    const types = this.#offersModel.types;
    this._setState({
      initialPoint: point,
      point: point ?? DEFAULTS.POINT,
      destinations,
      offers,
      types,
    });
    this.#handleFormClose = onFormClose;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleReset = onReset ?? this.#handleFormClose;
    this.#setupHandlers();
  }

  get template() {
    return createTemplate(this._state);
  }

  reset() {
    this.updateElement({ point: this._state.initialPoint });
  }

  /**
   * @param {TOffer[]} availableOffers
   */
  #updateAvailableOffers = (availableOffers) => {
    this.updateElement({
      offers: availableOffers,
      point: { ...this._state.point, offers: [] },
    });
  };

  /**
   * @param {Partial<TPoint>} update
   * @param {{ optimistic?: boolean }} options
   */
  #updatePoint = (update, { optimistic = false } = {}) => {
    const point = { ...this._state.point, ...update };
    if (optimistic) {
      this._setState({ point });
    } else {
      this.updateElement({ point });
    }
  };

  #setupHandlers() {
    const form = this.element;
    form.addEventListener('submit', this.#formSubmitHandler);
    form.addEventListener('reset', this.#resetHandler);

    const rollupBtn = form.querySelector('.event__rollup-btn');
    rollupBtn?.addEventListener('click', this.#formCloseHandler);

    const typeInputs = form.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) =>
      input.addEventListener('change', this.#typeChangeHandler)
    );

    const destinationInput = form.querySelector('.event__input--destination');
    destinationInput?.addEventListener(
      'change',
      this.#destinationChangeHandler
    );
    destinationInput?.addEventListener('blur', this.#destinationBlurHandler);

    const priceInput = form.querySelector('.event__input--price');
    priceInput?.addEventListener('change', this.#priceChangeHandler);

    const offersCheckboxes = form.querySelectorAll('.event__offer-checkbox');
    offersCheckboxes.forEach((checkbox) =>
      checkbox.addEventListener('change', this.#offersChangeHandler)
    );

    const startTimeInput = form.querySelector('input[name="event-start-time"]');
    const endTimeInput = form.querySelector('input[name="event-end-time"]');
    if (startTimeInput && endTimeInput) {
      this.#startTimePicker = flatpickr(startTimeInput, {
        ...this.#pickerConfig,
        defaultDate: this._state.point.date_from ?? null,
        onChange: (dates) => this.#timeChangeHandler(dates, true),
      });
      this.#endTimePicker = flatpickr(endTimeInput, {
        ...this.#pickerConfig,
        minDate: this.#startTimePicker.selectedDates[0],
        defaultDate: this._state.point.date_to ?? null,
        onChange: (dates) => this.#timeChangeHandler(dates, false),
      });
    }
  }

  _restoreHandlers() {
    this.#setupHandlers();
  }

  /**
   * @param {Date[]} dates
   * @param {boolean} isStartTime
   */
  #timeChangeHandler = (dates, isStartTime) => {
    if (this._state.disabled) {
      return;
    }
    const date = dayjs(dates[0]);
    const currentEnd = dayjs(this._state.point.date_to);
    const update = {
      [isStartTime ? 'date_from' : 'date_to']: date.toISOString(),
    };
    if (isStartTime) {
      this.#endTimePicker.set('minDate', date.toDate());
      if (date.isAfter(currentEnd)) {
        // eslint-disable-next-line camelcase
        update.date_to = date.toISOString();
        this.#endTimePicker.setDate(date.toDate());
      }
    }
    this.#updatePoint(update, { optimistic: true });
  };

  #typeChangeHandler = (evt) => {
    if (this._state.disabled) {
      return;
    }
    const offers = this.#offersModel.getByType(evt.target.value);
    this.#updateAvailableOffers(offers ?? []);
    this.#updatePoint({ type: evt.target.value });
  };

  #destinationChangeHandler = (evt) => {
    if (this._state.disabled) {
      return;
    }
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
    const destination = this._state.destinations.find(
      (value) => value.id === this._state.point.destination
    );
    evt.target.value = destination?.name ?? '';
  };

  #priceChangeHandler = (evt) => {
    if (this._state.disabled) {
      return;
    }
    this.#updatePoint(
      // eslint-disable-next-line camelcase
      { base_price: Number(evt.target.value) },
      { optimistic: true }
    );
  };

  #offersChangeHandler = (evt) => {
    if (this._state.disabled) {
      return;
    }
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

  #formSubmitHandler = async (evt) => {
    evt.preventDefault();
    if (this._state.disabled) {
      return;
    }
    this.updateElement({ isSaving: true, disabled: true });
    const reset = () =>
      this._state.isSaving &&
      this.updateElement({ isSaving: false, disabled: false });
    await this.#handleFormSubmit?.(this._state.point).catch(() => {
      reset();
      this.shake();
    });
  };

  #formCloseHandler = async (evt) => {
    evt.preventDefault();
    this.reset();
    this.#handleFormClose?.();
  };

  #resetHandler = async () => {
    if (this._state.disabled) {
      return;
    }
    const reset = this.#handleReset?.();
    if (!(reset instanceof Promise)) {
      return;
    }
    this.updateElement({ isResetting: true, disabled: true });
    await reset.catch(() => {
      this.updateElement({ isResetting: false, disabled: false });
      this.shake();
    });
  };
}

export default PointFormView;
