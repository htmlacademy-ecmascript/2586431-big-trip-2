import { render, replace } from '../framework/render';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';

class PointPresenter {
  #parentElement = null;
  #pointView = null;
  #formView = null;
  #point = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({ parentElement, point, offersModel, destinationsModel }) {
    this.#parentElement = parentElement;
    this.#point = point;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

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
      onEditClick: this.#handleEditClick,
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

  #handleEditClick = () => {
    replace(this.#formView, this.#pointView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormClose = () => {
    replace(this.#pointView, this.#formView);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}

export default PointPresenter;
