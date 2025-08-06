import { render, RenderPosition, replace, remove } from './framework/render.js';
import FiltersView from './view/filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import ListView from './view/list-view.js';
import SortView from './view/sort-view.js';
import PointEditView from './view/point-edit-view.js';
import PointView from './view/point-view.js';
import {
  sortPointsByDate,
  sortPointsByPrice,
  sortPointsByTime,
} from './sorters.js';
import { isPointFuture, isPointPresent, isPointPast } from './filters.js';

class Presenter {
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

  #prepareData() {
    return this.#getPoints().map((point) => ({
      ...point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: point.offers.map((id) => this.#offersModel.getById(id)),
    }));
  }

  #renderPoint(point, listElement) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        onFormClose();
      }
    };
    const pointView = new PointView({ point, onEditClick });
    const types = this.#offersModel.types;
    const offers = this.#offersModel.getByType(point.type);
    const destinations = this.#destinationsModel.list;
    const formView = new PointEditView({
      point,
      types,
      offers,
      destinations,
      onFormClose,
      onFormSubmit: () => {
        onFormClose();
      },
    });
    function onEditClick() {
      replace(formView, pointView);
      document.addEventListener('keydown', escKeyDownHandler);
    }
    function onFormClose() {
      replace(pointView, formView);
      document.removeEventListener('keydown', escKeyDownHandler);
    }
    render(pointView, listElement);
  }

  #handleSortChange(value) {
    this.#sort = value;
    this.#renderPoints();
    this.#sortView.updateElement({ selected: this.#sort });
  }

  #handleFilterChange(value) {
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

export default Presenter;
