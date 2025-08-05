import { render, RenderPosition, replace } from './framework/render.js';
import FiltersView from './view/filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import ListView from './view/list-view.js';
import SortView from './view/sort-view.js';
import PointEditView from './view/point-edit-view.js';
import PointView from './view/point-view.js';

class Presenter {
  #filtersContainer = null;
  #listContainer = null;
  #mainContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

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
    const filters = new FiltersView();
    render(filters, this.#filtersContainer);
  }

  #renderInfo() {
    const tripInfo = new TripInfoView();
    render(tripInfo, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #prepareData() {
    return this.#pointsModel.list.map((point) => ({
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

  #renderList() {
    const data = this.#prepareData();

    const list = new ListView();
    const sort = new SortView();

    render(sort, this.#listContainer);
    render(list, this.#listContainer);
    data.forEach((point) => this.#renderPoint(point, list.element));
  }

  render() {
    this.#renderFilters();
    this.#renderInfo();
    this.#renderList();
  }
}

export default Presenter;
