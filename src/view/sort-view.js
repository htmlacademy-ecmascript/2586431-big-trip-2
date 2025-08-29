import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { SortType } from '../constants.js';

function createSortItemTemplate({ id, label, disabled, selected }) {
  // prettier-ignore
  return `<div class="trip-sort__item  trip-sort__item--${id}">
    <input id="sort-${id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${id}" ${
  disabled ? 'disabled' : ''
} ${selected === id ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${id}">${label}</label>
  </div>`;
}

function createTemplate({ disabled, selected }) {
  // prettier-ignore
  return `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
  ${createSortItemTemplate({
    id: SortType.DAY,
    label: 'Day',
    disabled,
    selected,
  })}
  ${createSortItemTemplate({
    id: 'event',
    label: 'Event',
    disabled: true,
    selected,
  })}
  ${createSortItemTemplate({
    id: SortType.TIME,
    label: 'Time',
    disabled,
    selected,
  })}
  ${createSortItemTemplate({
    id: SortType.PRICE,
    label: 'Price',
    disabled,
    selected,
  })}
  ${createSortItemTemplate({
    id: 'offer',
    label: 'Offers',
    disabled: true,
    selected,
  })}
</form>`;
}

class SortView extends AbstractStatefulView {
  #onChange = null;
  constructor({ onChange, disabled, selected }) {
    super();
    this.#onChange = onChange;
    this._setState({ disabled, selected });
    this.#setupHandlers();
  }

  #setupHandlers() {
    this.element.querySelectorAll('input').forEach((input) => {
      input.addEventListener('click', this.#sortChangeHandler);
    });
  }

  _restoreHandlers() {
    this.#setupHandlers();
  }

  #sortChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onChange(evt.target.value.split('-')[1]);
  };

  get template() {
    return createTemplate(this._state);
  }
}

export default SortView;
