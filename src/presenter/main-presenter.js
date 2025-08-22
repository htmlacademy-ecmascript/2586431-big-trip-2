// @ts-check
import { render, RenderPosition, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import ListView from '../view/list-view.js';
import SortView from '../view/sort-view.js';
import {
  sortPointsByDate,
  sortPointsByPrice,
  sortPointsByTime,
} from '../sorters.js';
import { isPointFuture, isPointPresent, isPointPast } from '../filters.js';
import PointPresenter from './point-presenter.js';
import FiltersPresenter from './filters-presenter.js';
import ListMessageView from '../view/list-message-view.js';
import { DEFAULTS, FILTERS, MESSAGES, SORTS } from '../constants.js';
import PointFormView from '../view/point-form-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const BLOCKER_LIMITS = {
  LOWER: 350,
  UPPER: 1000,
};

class MainPresenter {
  #filtersContainer;
  #listContainer;
  #mainContainer;
  #pointsModel;
  #offersModel;
  #destinationsModel;
  #filtersModel;
  #sortModel;
  /** @type {ListView} */
  #listView;
  /** @type {SortView} */
  #sortView;
  /** @type {(() => void) | null} */
  #closeLastForm = null;
  /** @type {PointFormView | null} */
  #newPointView = null;
  #uiBlocker;

  /**
   * @param {{
   *  filtersContainer: HTMLElement;
   *  listContainer: HTMLElement;
   *  mainContainer: HTMLElement;
   *  pointsModel: import('../model/points-model').default;
   *  offersModel: import('../model/offers-model').default;
   *  destinationsModel: import('../model/destinations-model').default;
   *  filtersModel: import('../model/filters-model').default;
   *  sortModel: import('../model/sort-model').default;
   * }} config
   */
  constructor({
    filtersContainer,
    listContainer,
    mainContainer,
    pointsModel,
    offersModel,
    destinationsModel,
    filtersModel,
    sortModel,
  }) {
    this.#filtersContainer = filtersContainer;
    this.#listContainer = listContainer;
    this.#mainContainer = mainContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filtersModel = filtersModel;
    this.#sortModel = sortModel;

    this.#pointsModel.addObserver(this.#handlePointsEvent);
    this.#offersModel.addObserver(this.#handleOffersEvent);
    this.#destinationsModel.addObserver(this.#handleDestinationsEvent);
    this.#filtersModel.addObserver(this.#handleFiltersEvent);
    this.#sortModel.addObserver(this.#handleSortEvent);

    this.#mainContainer
      .querySelector('.trip-main__event-add-btn')
      ?.addEventListener('click', this.#handleNewPointClick);
    document.addEventListener('keydown', this.#newPointEscHandler);

    this.#uiBlocker = new UiBlocker({
      lowerLimit: BLOCKER_LIMITS.LOWER,
      upperLimit: BLOCKER_LIMITS.UPPER,
    });
  }

  /**
   * @param {KeyboardEvent} evt
   */
  #newPointEscHandler = (evt) => {
    if (evt.key === 'Escape' && this.#newPointView) {
      this.#closeNewPointView();
    }
  };

  #closeNewPointView = () => {
    if (!this.#newPointView) {
      return;
    }
    remove(this.#newPointView);
    this.#newPointView = null;
  };

  #handleNewPointClick = () => {
    if (this.#newPointView || !this.#listView.element) {
      return;
    }
    if (this.#closeLastForm) {
      this.#closeLastForm();
    }
    this.#closeLastForm = this.#closeNewPointView;
    this.#newPointView = new PointFormView({
      point: DEFAULTS.POINT,
      offersModel: this.#offersModel,
      destinations: this.#destinationsModel.list,
      onFormClose: this.#closeNewPointView,
      onFormSubmit: async (body) => {
        this.#uiBlocker.block();
        await this.#pointsModel.createPoint(body).finally(() => {
          this.#uiBlocker.unblock();
        });
        this.#closeNewPointView();
      },
    });
    this.#resetList();
  };

  #resetList = () => {
    this.#filtersModel.reset();
    this.#sortModel.reset();
    this.#renderPoints();
  };

  /**
   * @param {string} event
   */
  #handleOffersEvent = (event) => {
    switch (event) {
      case this.#offersModel.EventType.INIT:
        this.#renderPoints();
        break;
    }
  };

  /**
   * @param {string} event
   */
  #handleDestinationsEvent = (event) => {
    switch (event) {
      case this.#destinationsModel.EventType.INIT:
        this.#renderPoints();
        break;
    }
  };

  /**
   * @param {string} event
   */
  #handlePointsEvent = (event) => {
    switch (event) {
      case this.#pointsModel.EventType.CREATE:
        this.#resetList();
        break;
      case this.#pointsModel.EventType.UPDATE:
      case this.#pointsModel.EventType.DELETE:
      case this.#pointsModel.EventType.INIT:
        this.#renderPoints();
        break;
    }
  };

  /**
   * @param {string} event
   */
  #handleFiltersEvent = (event) => {
    switch (event) {
      case this.#filtersModel.EventType.CHANGE:
      case this.#filtersModel.EventType.RESET:
        this.#renderPoints();
        break;
    }
  };

  /**
   * @param {string} event
   * @param {string} payload
   */
  #handleSortEvent = (event, payload) => {
    switch (event) {
      case this.#sortModel.EventType.CHANGE:
      case this.#sortModel.EventType.RESET:
        this.#renderPoints();
        this.#sortView.updateElement({ selected: payload });
        break;
    }
  };

  /**
   * @param {string} value
   */
  #handleSortChange(value) {
    this.#sortModel.sort = value;
  }

  #renderFilters() {
    const filtersPresenter = new FiltersPresenter({
      parentElement: this.#filtersContainer,
      filtersModel: this.#filtersModel,
    });
    filtersPresenter.render();
  }

  #renderInfo() {
    const enrichedPoints = this.#getPoints().map((point) => ({
      ...point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: point.offers.map((id) => this.#offersModel.getById(id)),
    }));
    const tripInfo = new TripInfoView({
      points: enrichedPoints,
    });
    render(tripInfo, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #getPoints() {
    const filter = this.#filtersModel.filter;
    const filteredPoints = this.#pointsModel.list.filter((point) => {
      switch (filter) {
        case FILTERS.EVERYTHING:
          return true;
        case FILTERS.FUTURE:
          return isPointFuture(point);
        case FILTERS.PRESENT:
          return isPointPresent(point);
        case FILTERS.PAST:
          return isPointPast(point);
        default:
          return false;
      }
    });

    const sort = this.#sortModel.sort;
    switch (sort) {
      case SORTS.DAY:
        return sortPointsByDate(filteredPoints);
      case SORTS.PRICE:
        return sortPointsByPrice(filteredPoints);
      case SORTS.TIME:
        return sortPointsByTime(filteredPoints);
      default:
        return filteredPoints;
    }
  }

  /**
   * @param {TPoint} point
   * @param {HTMLElement} listElement
   */
  #renderPoint(point, listElement) {
    const pointPresenter = new PointPresenter({
      parentElement: listElement,
      point,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onPointUpdate: async (update) => {
        this.#uiBlocker.block();
        await this.#pointsModel.updatePoint(point.id, update).finally(() => {
          this.#uiBlocker.unblock();
        });
      },
      onFormOpen: (closeForm) => {
        this.#closeLastForm?.();
        this.#closeLastForm = closeForm ?? null;
      },
      onFormClose: () => {
        this.#closeLastForm = null;
      },
      onPointDelete: async () => {
        this.#uiBlocker.block();
        await this.#pointsModel.deletePoint(point.id).finally(() => {
          this.#uiBlocker.unblock();
        });
      },
    });
    pointPresenter.render();
  }

  /** @param {boolean} disabled */
  #updateSortViewDisabled(disabled) {
    if (!this.#sortView || this.#sortView._state.disabled === disabled) {
      return;
    }
    this.#sortView.updateElement({ disabled });
  }

  #renderList() {
    const disabled = this.#getPoints().length < 1;
    if (this.#sortView) {
      remove(this.#sortView);
    }
    this.#sortView = new SortView({
      onSortChange: this.#handleSortChange.bind(this),
      selected: this.#sortModel.sort,
      disabled,
    });

    render(this.#sortView, this.#listContainer);
    this.#renderPoints();
  }

  #renderPoints() {
    if (
      !this.#pointsModel.isLoaded ||
      !this.#offersModel.isLoaded ||
      !this.#destinationsModel.isLoaded
    ) {
      return;
    }
    if (this.#listView) {
      remove(this.#listView);
    }
    this.#listView = new ListView();
    render(this.#listView, this.#listContainer);
    const data = this.#getPoints();
    this.#updateSortViewDisabled(data.length < 1);
    if (!data.length && !this.#newPointView) {
      const listMessageView = new ListMessageView({
        message: MESSAGES.EMPTY[this.#filtersModel.filter],
      });
      render(listMessageView, this.#listView.element);
      return;
    }
    if (this.#newPointView) {
      render(this.#newPointView, this.#listView.element);
    }
    data.forEach((point) => this.#renderPoint(point, this.#listView.element));
  }

  render() {
    this.#renderFilters();
    this.#renderInfo();
    this.#renderList();
  }
}

export default MainPresenter;
