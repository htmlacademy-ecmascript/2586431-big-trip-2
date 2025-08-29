// @ts-check
import { render, RenderPosition, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import ListView from '../view/list-view.js';
import SortView from '../view/sort-view.js';
import { sortPoints } from '../sorters.js';
import { filterPoints } from '../filters.js';
import PointPresenter from './point-presenter.js';
import FiltersPresenter from './filters-presenter.js';
import ListMessageView from '../view/list-message-view.js';
import { DEFAULTS, ListMessageText } from '../constants.js';
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
  /** @type {TripInfoView} */
  #tripInfoView;
  /** @type {(() => void) | null} */
  #closeLastForm = null;
  /** @type {PointFormView | null} */
  #newPointView = null;
  #uiBlocker;
  #newPointButton;

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

    this.#newPointButton = /** @type {HTMLButtonElement} */ (
      this.#mainContainer.querySelector('.trip-main__event-add-btn')
    );

    this.#newPointButton?.addEventListener('click', this.#openNewPointView);
    document.addEventListener('keydown', this.#newPointEscHandler);

    this.#uiBlocker = new UiBlocker({
      lowerLimit: BLOCKER_LIMITS.LOWER,
      upperLimit: BLOCKER_LIMITS.UPPER,
    });
  }

  get isReady() {
    return (
      this.#pointsModel.isLoaded &&
      this.#offersModel.isLoaded &&
      this.#destinationsModel.isLoaded
    );
  }

  #closeNewPointView = () => {
    if (!this.#newPointView) {
      return;
    }
    remove(this.#newPointView);
    this.#newPointView = null;
    this.#newPointButton.disabled = false;
    if (!this.#getPoints().length) {
      this.#renderMessage(ListMessageText.EMPTY[this.#filtersModel.filter]);
    }
  };

  #openNewPointView = () => {
    if (this.#newPointView || !this.#listView.element) {
      return;
    }
    if (this.#closeLastForm) {
      this.#closeLastForm();
    }
    this.#closeLastForm = this.#closeNewPointView;
    this.#newPointButton.disabled = true;
    this.#newPointView = new PointFormView({
      point: DEFAULTS.POINT,
      offersModel: this.#offersModel,
      destinations: this.#destinationsModel.list,
      onFormClose: this.#closeNewPointView,
      onFormSubmit: async (body) => {
        this.#uiBlocker.block();
        await this.#pointsModel.create(body).finally(() => {
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
        this.#updateInfo();
        break;
      case this.#offersModel.EventType.ERROR:
        this.#renderMessage(ListMessageText.FAILED);
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
        this.#updateInfo();
        break;
      case this.#offersModel.EventType.ERROR:
        this.#renderMessage(ListMessageText.FAILED);
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
        this.#updateInfo();
        break;
      case this.#pointsModel.EventType.UPDATE:
      case this.#pointsModel.EventType.DELETE:
      case this.#pointsModel.EventType.INIT:
        this.#renderPoints();
        this.#updateInfo();
        break;
      case this.#pointsModel.EventType.ERROR:
        this.#renderMessage(ListMessageText.FAILED);
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
        this.#sortModel.reset();
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
        this.#sortView?.updateElement({ selected: payload });
        break;
    }
  };

  /**
   * @param {string} value
   */
  #setSort(value) {
    this.#sortModel.sort = value;
  }

  #renderFilters() {
    const filtersPresenter = new FiltersPresenter({
      parentElement: this.#filtersContainer,
      filtersModel: this.#filtersModel,
      pointsModel: this.#pointsModel,
    });
    filtersPresenter.render();
  }

  #enrichPoints(points) {
    return points.map((point) => ({
      ...point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: point.offers.map((id) => this.#offersModel.getById(id)),
    }));
  }

  #renderInfo() {
    const tripInfo = new TripInfoView({
      points: [],
    });
    if (this.#tripInfoView) {
      remove(this.#tripInfoView);
    }
    this.#tripInfoView = tripInfo;
    render(this.#tripInfoView, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #updateInfo() {
    if (!this.isReady) {
      return;
    }
    const enrichedPoints = this.#enrichPoints(this.#getPoints());
    this.#tripInfoView.updateElement({ points: enrichedPoints });
  }

  /**
   * Получение отфильтрованных и отсортированных точек
   * @returns {TPoint[]} массив точек
   */
  #getPoints() {
    const allPoints = this.#pointsModel.list;
    const filterType = this.#filtersModel.filter;
    const sortType = this.#sortModel.sort;

    const filteredPoints = filterPoints(allPoints, filterType);
    return sortPoints(filteredPoints, sortType);
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
        await this.#pointsModel.update(point.id, update).finally(() => {
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
        await this.#pointsModel.delete(point.id).finally(() => {
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
      onChange: this.#setSort.bind(this),
      selected: this.#sortModel.sort,
      disabled,
    });

    render(this.#sortView, this.#listContainer);
    this.#renderPoints();
  }

  /** @param {string} message */
  #renderMessage(message) {
    if (this.#listView) {
      remove(this.#listView);
    }
    this.#listView = new ListView();
    render(this.#listView, this.#listContainer);
    const listMessageView = new ListMessageView({
      message,
    });
    render(listMessageView, this.#listView.element);
  }

  #renderPoints() {
    if (!this.isReady) {
      if (!this.#listView) {
        this.#renderMessage(ListMessageText.LOADING);
      }
      return;
    }

    const data = this.#getPoints();
    this.#updateSortViewDisabled(data.length < 1);

    if (!data.length && !this.#newPointView) {
      this.#renderMessage(ListMessageText.EMPTY[this.#filtersModel.filter]);
      return;
    }

    if (this.#listView) {
      remove(this.#listView);
    }

    this.#listView = new ListView();
    render(this.#listView, this.#listContainer);

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

  /**
   * @param {KeyboardEvent} evt
   */
  #newPointEscHandler = (evt) => {
    if (evt.key === 'Escape' && this.#newPointView) {
      this.#closeNewPointView();
    }
  };
}

export default MainPresenter;
