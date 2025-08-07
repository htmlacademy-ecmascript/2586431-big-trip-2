/* eslint-disable camelcase */
import { render, replace } from '../framework/render';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';

const Mode = {
  VIEW: 'view',
  EDIT: 'edit',
};

class PointPresenter {
  #mode = null;
  #parentElement = null;
  /** @type {import('../view/point-view').default} */
  #pointView = null;
  /** @type {import('../view/point-edit-view').default} */
  #formView = null;
  #point = null;
  #offersModel = null;
  #destinationsModel = null;
  #onPointUpdate = null;
  #onFormOpen = null;
  #onFormClose = null;

  constructor({
    parentElement,
    point,
    offersModel,
    destinationsModel,
    onPointUpdate,
    onFormOpen,
    onFormClose,
  }) {
    this.#parentElement = parentElement;
    this.#point = point;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#onPointUpdate = onPointUpdate;
    this.#onFormOpen = onFormOpen;
    this.#onFormClose = onFormClose;
  }

  #setPoint = (point) => {
    this.#point = point;
    this.#pointView.updateElement({ point });
    this.#formView.updateElement({ point });
  };

  #updatePoint = (update) => {
    this.#setPoint(this.#onPointUpdate(update));
  };

  #prepareForm() {
    const types = this.#offersModel.types;
    const offers = this.#offersModel.getByType(this.#point.type);
    const destinations = this.#destinationsModel.list;
    this.#formView = new PointEditView({
      point: this.#point,
      types,
      offers,
      destinations,
      onFormClose: this.#handleFormClose,
      onFormSubmit: () => {
        this.#handleFormClose();
      },
    });
  }

  render() {
    this.#pointView = new PointView({
      point: this.#point,
      onEditClick: this.#handleFormOpen,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#prepareForm();
    render(this.#pointView, this.#parentElement);
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
        replace(this.#formView, this.#pointView);
        document.addEventListener('keydown', this.#escKeyDownHandler);
        return;
      case Mode.VIEW:
        replace(this.#pointView, this.#formView);
        document.removeEventListener('keydown', this.#escKeyDownHandler);
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
