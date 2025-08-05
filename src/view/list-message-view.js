import AbstractView from '../framework/view/abstract-view.js';

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

class ListMessageView extends AbstractView {
  constructor({ type }) {
    super();
    this.type = type ?? 'empty';
  }

  get template() {
    return createTemplate();
  }
}

export default ListMessageView;
