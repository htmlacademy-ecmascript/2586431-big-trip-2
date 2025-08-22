// @ts-check
/* eslint-disable camelcase */
import { render, replace } from '../framework/render';
import PointFormView from '../view/point-form-view';
import PointView from '../view/point-view';

const Mode = {
  VIEW: 'view',
  EDIT: 'edit',
};

class PointPresenter {
  #parentElement;
  #point;
  #offersModel;
  #destinationsModel;
  #onPointUpdate;
  #onPointDelete;
  #onFormOpen;
  #onFormClose;
  /** @type {PointView | PointFormView} */
  #currentView;
  /** @type {PointView} */
  #pointView;
  /** @type {PointFormView} */
  #formView;

  /**
   * @param {{
   * parentElement: HTMLElement,
   * point: TPoint,
   * offersModel: import('../model/offers-model').default,
   * destinationsModel: import('../model/destinations-model').default,
   * onPointUpdate: (body: Partial<TPoint>) => void,
   * onPointDelete: () => void,
   * onFormOpen: (cb?: () => void) => void,
   * onFormClose: (cb?: () => void) => void,
   * }} config
   */
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

  #handleDelete = async () => {
    await this.#onPointDelete();
  };

  #prepareForm() {
    const destinations = this.#destinationsModel.list;
    this.#formView = new PointFormView({
      point: this.#point,
      offersModel: this.#offersModel,
      destinations,
      onFormClose: this.#handleFormClose,
      onFormSubmit: async (values) => {
        await this.#onPointUpdate(values);
        this.#handleFormClose();
      },
      onReset: this.#handleDelete,
    });
  }

  /**
   * @param {TPoint} point
   */
  #preparePointViewData = (point) => ({
    point: point,
    destinationName: this.#destinationsModel.getById(point.destination)?.name,
    offers: /** @type {TOffer[]} */ (
      point.offers.map((id) => this.#offersModel.getById(id)).filter(Boolean)
    ),
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

  /**
   * @param {string} mode
   */
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

  #handleFavoriteClick = async () => {
    await this.#onPointUpdate({ is_favorite: !this.#point.is_favorite });
  };
}

export default PointPresenter;
