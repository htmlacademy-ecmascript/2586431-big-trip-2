/* eslint-disable indent */
import { FilterType } from '../constants';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createFilterItemTemplate({
  id,
  label,
  selected,
  disabled,
  available,
}) {
  return `<div class="trip-filters__filter">
    <input id="filter-${id}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${id}" ${
    selected === id ? 'checked' : ''
  } ${disabled || !available?.includes(id) ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${id}">${label}</label>
  </div>`;
}

function createTemplate({ disabled, selected, available }) {
  return `<form class="trip-filters" action="#" method="get">
      ${createFilterItemTemplate({
        id: FilterType.EVERYTHING,
        label: 'Everything',
        selected,
        disabled,
        available,
      })}
      ${createFilterItemTemplate({
        id: FilterType.FUTURE,
        label: 'Future',
        selected,
        disabled,
        available,
      })}
      ${createFilterItemTemplate({
        id: FilterType.PRESENT,
        label: 'Present',
        selected,
        disabled,
        available,
      })}
      ${createFilterItemTemplate({
        id: FilterType.PAST,
        label: 'Past',
        selected,
        disabled,
        available,
      })}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

class FiltersView extends AbstractStatefulView {
  #onFilterChange = null;
  constructor({ disabled, selected, onFilterChange, available }) {
    super();
    this._setState({ disabled, selected, available });
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
