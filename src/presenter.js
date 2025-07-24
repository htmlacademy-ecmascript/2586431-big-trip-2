/* eslint-disable indent */
import { render, RenderPosition } from './render';
import FiltersView from './view/filters-view';
import TripInfoView from './view/trip-info-view';
import ListView from './view/list-view';
import SortView from './view/sort-view';
import PointEditView from './view/point-edit-view';
import PointView from './view/point-view';

class Presenter {
  constructor({
    filtersContainer,
    listContainer,
    mainContainer,
    pointsModel,
    offersModel,
    destinationsModel,
  }) {
    this.filtersContainer = filtersContainer;
    this.listContainer = listContainer;
    this.mainContainer = mainContainer;

    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  renderFilters() {
    const filters = new FiltersView();
    render(filters, this.filtersContainer);
  }

  renderInfo() {
    const tripInfo = new TripInfoView();
    render(tripInfo, this.mainContainer, RenderPosition.AFTERBEGIN);
  }

  prepareData() {
    return this.pointsModel.list.map((point, idx) => ({
      ...point,
      editing: idx === 0,
      destination: this.destinationsModel.getById(point.destination),
      offers: point.offers.map((id) => this.offersModel.getById(id)),
    }));
  }

  renderList() {
    const data = this.prepareData();
    const types = this.offersModel.types;
    const destinations = this.destinationsModel.list;

    const list = new ListView();
    const sort = new SortView();
    const points = data.map((point) =>
      point.editing
        ? new PointEditView({
            point,
            types,
            offers: this.offersModel.getByType(point.type),
            destinations,
          })
        : new PointView({ point })
    );

    render(sort, this.listContainer);
    render(list, this.listContainer);
    points.forEach((point) => {
      render(point, list.getElement());
    });
  }

  render() {
    this.renderFilters();
    this.renderInfo();
    this.renderList();
  }
}

export default Presenter;
