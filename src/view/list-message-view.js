import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

class ListMessageView extends AbstractView {
  constructor({ message }) {
    super();
    this.message = message;
  }

  get template() {
    return createTemplate(this.message);
  }
}

export default ListMessageView;
