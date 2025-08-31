// @ts-check
import { render, replace } from '../framework/render.js';
import PointFormView from '../view/point-form-view.js';
import PointView from '../view/point-view.js';

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
   * onPointUpdate: (body: Partial<TPoint>) => Promise<void>,
   * onPointDelete: () => Promise<void>,
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
    this.#closeForm();
  };

  #prepareForm() {
    const destinations = this.#destinationsModel.list;
    this.#formView = new PointFormView({
      point: this.#point,
      offersModel: this.#offersModel,
      destinations,
      onFormClose: this.#closeForm,
      onFormSubmit: async (values) => {
        await this.#onPointUpdate(values);
        this.#closeForm();
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
      onEditClick: this.#openForm,
      onFavoriteClick: this.#toggleFavorite,
    });
    this.#prepareForm();
    render(this.#pointView, this.#parentElement);
    this.#currentView = this.#pointView;
  }

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
        this.#formView.reset();
        this.#replaceViews(this.#pointView, this.#formView);
        document.removeEventListener('keydown', this.#escKeyDownHandler);
        this.#currentView = this.#pointView;
    }
  };

  #openForm = () => {
    this.#onFormOpen(() => this.#setMode(Mode.VIEW));
    this.#setMode(Mode.EDIT);
  };

  #closeForm = () => {
    this.#onFormClose(() => this.#setMode(Mode.EDIT));
    this.#setMode(Mode.VIEW);
  };

  #toggleFavorite = async () => {
    await this.#onPointUpdate({
      // eslint-disable-next-line camelcase
      is_favorite: !this.#point.is_favorite,
    }).catch(() => {
      this.#pointView.shake();
    });
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeForm();
    }
  };
}

export default PointPresenter;
