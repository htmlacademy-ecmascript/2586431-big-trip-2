/* eslint-disable camelcase */
import { FILTERS } from '../constants';
import { isPointFuture, isPointPast, isPointPresent } from '../filters';
import { remove, render } from '../framework/render';
import FiltersView from '../view/filters-view';

class FiltersPresenter {
  /** @type {HTMLElement} */
  #parentElement = null;
  /** @type {import('../view/filters-view').default} */
  #filtersView = null;
  #disabled = true;
  /** @type {import('../model/filters-model').default} */
  #filtersModel = null;
  /** @type {import('../model/points-model').default} */
  #pointsModel = null;

  /**
   * @param {{
   *   parentElement: HTMLElement;
   *   disabled?: boolean;
   *   filtersModel: import('../model/filters-model').default;
   *   pointsModel: import('../model/points-model').default;
   * }}
   */
  constructor({ parentElement, disabled, filtersModel, pointsModel }) {
    this.#parentElement = parentElement;
    this.#disabled = disabled;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#filtersModel.addObserver(this.#handleFiltersEvent);
    this.#pointsModel.addObserver(this.#handlePointsEvent);
  }

  render() {
    if (this.#filtersView) {
      remove(this.#filtersView);
    }
    this.#filtersView = new FiltersView({
      disabled: this.#disabled,
      selected: this.#filtersModel.filter,
      onFilterChange: this.#handleFilterChange.bind(this),
      available: [],
    });
    render(this.#filtersView, this.#parentElement);
  }

  #handleFilterChange = (filter) => {
    this.#filtersModel.filter = filter;
  };

  #handleFiltersEvent = (event, payload) => {
    switch (event) {
      case this.#filtersModel.EventType.CHANGE:
      case this.#filtersModel.EventType.RESET:
        this.#onFilterChange(payload);
        break;
    }
  };

  /**
   * @param {string} event
   */
  #handlePointsEvent = (event) => {
    switch (event) {
      case this.#pointsModel.EventType.CREATE:
      case this.#pointsModel.EventType.UPDATE:
      case this.#pointsModel.EventType.DELETE:
      case this.#pointsModel.EventType.INIT:
        this.#updateAvailableFilters();
        break;
    }
  };

  #updateAvailableFilters() {
    const points = this.#pointsModel.list;
    const available = [];
    if (points.length > 0) {
      available.push(FILTERS.EVERYTHING);
    }
    if (points.some(isPointFuture)) {
      available.push(FILTERS.FUTURE);
    }
    if (points.some(isPointPresent)) {
      available.push(FILTERS.PRESENT);
    }
    if (points.some(isPointPast)) {
      available.push(FILTERS.PAST);
    }
    this.#filtersView.updateElement({ available });
  }

  #onFilterChange = (filter) => {
    this.#filtersView.updateElement({
      disabled: this.#disabled,
      selected: filter,
    });
  };
}

export default FiltersPresenter;
