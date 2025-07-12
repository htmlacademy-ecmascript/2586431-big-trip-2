import { render, RenderPosition } from './render';
import {
  FiltersView,
  ListView,
  PointView,
  PointEditView,
  SortView,
  TripInfoView,
} from './view';

class Presenter {
  constructor({ filtersContainer, listContainer, mainContainer }) {
    this.filtersContainer = filtersContainer;
    this.listContainer = listContainer;
    this.mainContainer = mainContainer;
  }

  renderFilters() {
    const filters = new FiltersView();
    render(filters, this.filtersContainer);
  }

  renderInfo() {
    const tripInfo = new TripInfoView();
    render(tripInfo, this.mainContainer, RenderPosition.AFTERBEGIN);
  }

  renderList() {
    const list = new ListView();
    const sort = new SortView();
    const pointEdit = new PointEditView();
    const points = [new PointView(), new PointView(), new PointView()];

    render(sort, this.listContainer);
    render(list, this.listContainer);
    render(pointEdit, list.getElement());
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
