// @ts-check
import { getAvailableFiltersForPoints } from '../filters.js';
import { remove, render } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';

class FiltersPresenter {
  /** @type {HTMLElement} */
  #parentElement;
  /** @type {import('../view/filters-view').default} */
  #filtersView;
  #disabled = true;
  /** @type {import('../model/filters-model').default} */
  #filtersModel;
  /** @type {import('../model/points-model').default} */
  #pointsModel;

  /**
   * @param {{
   *   parentElement: HTMLElement;
   *   disabled?: boolean;
   *   filtersModel: import('../model/filters-model').default;
   *   pointsModel: import('../model/points-model').default;
   * }} config
   */
  constructor({ parentElement, disabled = false, filtersModel, pointsModel }) {
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
      onChange: this.#setFilter.bind(this),
      available: [],
    });

    render(this.#filtersView, this.#parentElement);
  }

  #setFilter = (filter) => {
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
    const available = getAvailableFiltersForPoints(points);
    this.#filtersView.updateElement({ available });
  }

  #onFilterChange = (filter) => {
    this.#filtersView?.updateElement({
      disabled: this.#disabled,
      selected: filter,
    });
  };
}

export default FiltersPresenter;
