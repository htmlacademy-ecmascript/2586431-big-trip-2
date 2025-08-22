/* eslint-disable camelcase */
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

  /**
   * @param {{
   *   parentElement: HTMLElement;
   *   disabled?: boolean;
   *   filtersModel: import('../model/filters-model').default;
   * }}
   */
  constructor({ parentElement, disabled, filtersModel }) {
    this.#parentElement = parentElement;
    this.#disabled = disabled;
    this.#filtersModel = filtersModel;

    this.#filtersModel.addObserver(this.#handleFiltersEvent);
  }

  render() {
    if (this.#filtersView) {
      remove(this.#filtersView);
    }
    this.#filtersView = new FiltersView({
      disabled: this.#disabled,
      selected: this.#filtersModel.filter,
      onFilterChange: this.#handleFilterChange.bind(this),
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

  #onFilterChange = (filter) => {
    this.#filtersView.updateElement({
      disabled: this.#disabled,
      selected: filter,
    });
  };
}

export default FiltersPresenter;
