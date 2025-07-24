import { createElement } from '../render.js';

function createTemplate(type) {
  if (type === 'empty') {
    return '<p class="trip-events__msg">Click New Event to create your first point</p>';
  }
  if (type === 'loading') {
    return '<p class="trip-events__msg">Loading...</p>';
  }
  if (type === 'failed') {
    return '<p class="trip-events__msg">Failed to load latest route information</p>';
  }
  throw Error('ListMessageView MUST have a proper type');
}

class ListMessageView {
  constructor({ type }) {
    this.type = type ?? 'empty';
  }

  getTemplate() {
    return createTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate(this.type));
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

export default ListMessageView;
