// @ts-check
import Observable from '../framework/observable.js';

const EventType = {
  INIT: 'init',
  ERROR: 'error',
};

class DestinationsModel extends Observable {
  /** @type {TDestination[]} */
  #data;
  #api;

  EventType = EventType;

  /** @param {{ api: import('../api').default }} config */
  constructor({ api }) {
    super();
    this.#api = api;
    this.updateData().then(() => {
      this._notify(EventType.INIT, this.#data);
    });
  }

  get isLoaded() {
    return this.#data !== undefined;
  }

  get list() {
    if (!this.#data) {
      return [];
    }
    return this.#data;
  }

  /** @param {string} id */
  getById(id) {
    return this.#data.find((destination) => destination.id === id);
  }

  async updateData() {
    try {
      this.#data = await this.#api.getDestinations();
    } catch (err) {
      this._notify(EventType.ERROR, err);
    }
  }
}

export default DestinationsModel;
