import { render, RenderPosition, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
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

class MainPresenter {
  #filtersContainer = null;
  #listContainer = null;
  #mainContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #sort = 'day';
  #filter = 'everything';
  #listView = null;
  #sortView = null;
  #filtersView = null;
  #closeLastForm = null;

  constructor({
    filtersContainer,
    listContainer,
    mainContainer,
    pointsModel,
    offersModel,
    destinationsModel,
  }) {
    this.#filtersContainer = filtersContainer;
    this.#listContainer = listContainer;
    this.#mainContainer = mainContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  #renderFilters() {
    if (this.#filtersView) {
      remove(this.#filtersView);
    }
    this.#filtersView = new FiltersView({
      disabled: this.#getPoints().length < 1,
      selected: this.#filter,
      onFilterChange: this.#handleFilterChange.bind(this),
    });
    render(this.#filtersView, this.#filtersContainer);
  }

  #renderInfo() {
    const tripInfo = new TripInfoView({ points: this.#prepareData() });
    render(tripInfo, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #getPoints() {
    const filteredPoints = this.#pointsModel.list.filter((point) => {
      switch (this.#filter) {
        case 'everything':
          return true;
        case 'future':
          return isPointFuture(point);
        case 'present':
          return isPointPresent(point);
        case 'past':
          return isPointPast(point);
        default:
          return false;
      }
    });

    switch (this.#sort) {
      case 'day':
        return sortPointsByDate(filteredPoints);
      case 'price':
        return sortPointsByPrice(filteredPoints);
      case 'time':
        return sortPointsByTime(filteredPoints);
      default:
        return filteredPoints;
    }
  }

  #preparePoint = (point) => ({
    ...point,
    destination: this.#destinationsModel.getById(point.destination),
    offers: point.offers.map((id) => this.#offersModel.getById(id)),
  });

  #prepareData() {
    return this.#getPoints().map(this.#preparePoint);
  }

  #renderPoint(point, listElement) {
    const pointPresenter = new PointPresenter({
      parentElement: listElement,
      point,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onPointUpdate: (update) => {
        const updatedPoint = this.#pointsModel.updatePoint(point.id, update);
        return this.#preparePoint(updatedPoint);
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

  #handleSortChange(value) {
    this.#sort = value;
    this.#renderPoints();
    this.#sortView.updateElement({ selected: this.#sort });
  }

  #handleFilterChange(value) {
    if (this.#filter === value) {
      return;
    }
    this.#filter = value;
    this.#renderPoints();
    this.#filtersView.updateElement({ selected: this.#filter });
  }

  #renderList() {
    const disabled = this.#getPoints().length < 1;
    if (this.#sortView) {
      remove(this.#sortView);
    }
    this.#sortView = new SortView({
      onSortChange: this.#handleSortChange.bind(this),
      selected: this.#sort,
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
    const data = this.#prepareData();
    data.forEach((point) => this.#renderPoint(point, this.#listView.element));
  }

  render() {
    this.#renderFilters();
    this.#renderInfo();
    this.#renderList();
  }
}

export default MainPresenter;
