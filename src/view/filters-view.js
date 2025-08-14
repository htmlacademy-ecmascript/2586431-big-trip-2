/* eslint-disable indent */
import { FILTERS } from '../constants';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createFilterItemTemplate({ id, label, selected, disabled }) {
  return `<div class="trip-filters__filter">
    <input id="filter-${id}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${id}" ${
    selected === id ? 'checked' : ''
  } ${disabled ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${id}">${label}</label>
  </div>`;
}

function createTemplate({ disabled, selected }) {
  return `<form class="trip-filters" action="#" method="get">
      ${createFilterItemTemplate({
        id: FILTERS.EVERYTHING,
        label: 'Everything',
        selected,
        disabled,
      })}
      ${createFilterItemTemplate({
        id: FILTERS.FUTURE,
        label: 'Future',
        selected,
        disabled,
      })}
      ${createFilterItemTemplate({
        id: FILTERS.PRESENT,
        label: 'Present',
        selected,
        disabled,
      })}
      ${createFilterItemTemplate({
        id: FILTERS.PAST,
        label: 'Past',
        selected,
        disabled,
      })}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

class FiltersView extends AbstractStatefulView {
  #onFilterChange = null;
  constructor({ disabled, selected, onFilterChange }) {
    super();
    this._setState({ disabled, selected });
    this.#onFilterChange = onFilterChange;
    this.#setupHandlers();
  }

  #setupHandlers() {
    this.element.querySelectorAll('input').forEach((input) => {
      input.addEventListener('click', this.#filterChangeHandler);
    });
  }

  _restoreHandlers() {
    this.#setupHandlers();
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterChange(evt.target.value);
  };

  get template() {
    return createTemplate(this._state);
  }
}

export default FiltersView;
