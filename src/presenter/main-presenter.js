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
import { FILTERS, MESSAGES, SORTS } from '../constants.js';

class MainPresenter {
  #filtersContainer = null;
  #listContainer = null;
  #mainContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #listView = null;
  #sortView = null;
  #closeLastForm = null;
  #filtersModel = null;
  #sortModel = null;

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
    this.#filtersModel.addObserver(this.#handleFiltersEvent);
    this.#sortModel.addObserver(this.#handleSortEvent);
  }

  #handlePointsEvent = (event) => {
    switch (event) {
      case this.#pointsModel.EventType.CREATE:
        this.#filtersModel.reset();
        this.#sortModel.reset();
        // список обновляется при их сбросе
        break;
      case this.#pointsModel.EventType.UPDATE:
      case this.#pointsModel.EventType.DELETE:
        this.#renderPoints();
        break;
    }
  };

  #handleFiltersEvent = (event) => {
    switch (event) {
      case this.#filtersModel.EventType.CHANGE:
      case this.#filtersModel.EventType.RESET:
        this.#renderPoints();
        break;
    }
  };

  #handleSortEvent = (event, payload) => {
    switch (event) {
      case this.#sortModel.EventType.CHANGE:
      case this.#sortModel.EventType.RESET:
        this.#renderPoints();
        this.#sortView.updateElement({ selected: payload });
        break;
    }
  };

  #handleSortChange(value) {
    this.#sortModel.sort = value;
  }

  #renderFilters() {
    const filtersPresenter = new FiltersPresenter({
      parentElement: this.#filtersContainer,
      disabled: this.#getPoints().length < 1,
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

  #renderPoint(point, listElement) {
    const pointPresenter = new PointPresenter({
      parentElement: listElement,
      point,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onPointUpdate: (update) => {
        const updatedPoint = this.#pointsModel.updatePoint(point.id, update);
        return updatedPoint;
      },
      onFormOpen: (closeForm) => {
        this.#closeLastForm?.();
        this.#closeLastForm = closeForm;
      },
      onFormClose: () => {
        this.#closeLastForm = null;
      },
    });
    pointPresenter.render();
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
    if (this.#listView) {
      remove(this.#listView);
    }
    this.#listView = new ListView();
    render(this.#listView, this.#listContainer);
    const data = this.#getPoints();
    if (!data.length) {
      const listMessageView = new ListMessageView({
        message: MESSAGES.EMPTY[this.#filtersModel.filter],
      });
      render(listMessageView, this.#listView.element);
      return;
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
