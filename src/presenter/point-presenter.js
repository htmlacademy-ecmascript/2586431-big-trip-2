/* eslint-disable camelcase */
import { render, replace } from '../framework/render';
import PointFormView from '../view/point-form-view';
import PointView from '../view/point-view';

const Mode = {
  VIEW: 'view',
  EDIT: 'edit',
};

class PointPresenter {
  #currentView = null;
  #parentElement = null;
  /** @type {import('../view/point-view').default} */
  #pointView = null;
  /** @type {import('../view/point-form-view').default} */
  #formView = null;
  #point = null;
  /** @type {import('../model/offers-model').default} */
  #offersModel = null;
  /** @type {import('../model/destinations-model').default} */
  #destinationsModel = null;
  #onPointUpdate = null;
  #onPointDelete = null;
  #onFormOpen = null;
  #onFormClose = null;

  constructor({
    parentElement,
    point,
    offersModel,
    destinationsModel,
    onPointUpdate,
    onPointDelete,
    onFormOpen,
    onFormClose,
  }) {
    this.#parentElement = parentElement;
    this.#point = point;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#onPointUpdate = onPointUpdate;
    this.#onPointDelete = onPointDelete;
    this.#onFormOpen = onFormOpen;
    this.#onFormClose = onFormClose;
  }

  #replaceViews = (next, prev) => {
    replace(next, prev);
    next.updateElement({});
  };

  #updatePoint = (update) => {
    this.#onPointUpdate(update);
  };

  #handleDelete = () => {
    this.#onPointDelete();
  };

  #prepareForm() {
    const destinations = this.#destinationsModel.list;
    this.#formView = new PointFormView({
      point: this.#point,
      offersModel: this.#offersModel,
      destinations,
      onFormClose: this.#handleFormClose,
      onFormSubmit: (values) => {
        this.#updatePoint(values);
        this.#handleFormClose();
      },
      onReset: this.#handleDelete,
    });
  }

  #preparePointViewData = (point) => ({
    point: point,
    destinationName: this.#destinationsModel.getById(point.destination).name,
    offers: point.offers.map((id) => this.#offersModel.getById(id)),
  });

  render() {
    this.#pointView = new PointView({
      ...this.#preparePointViewData(this.#point),
      onEditClick: this.#handleFormOpen,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#prepareForm();
    render(this.#pointView, this.#parentElement);
    this.#currentView = this.#pointView;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#handleFormClose();
    }
  };

  #setMode = (mode) => {
    switch (mode) {
      case Mode.EDIT:
        this.#replaceViews(this.#formView, this.#pointView);
        document.addEventListener('keydown', this.#escKeyDownHandler);
        this.#currentView = this.#formView;
        return;
      case Mode.VIEW:
        this.#replaceViews(this.#pointView, this.#formView);
        document.removeEventListener('keydown', this.#escKeyDownHandler);
        this.#currentView = this.#pointView;
    }
  };

  #handleFormOpen = () => {
    this.#onFormOpen(() => this.#setMode(Mode.VIEW));
    this.#setMode(Mode.EDIT);
  };

  #handleFormClose = () => {
    this.#onFormClose(() => this.#setMode(Mode.EDIT));
    this.#setMode(Mode.VIEW);
  };

  #handleFavoriteClick = () => {
    this.#updatePoint({ is_favorite: !this.#point.is_favorite });
  };
}

export default PointPresenter;
