// @ts-check
import Observable from '../framework/observable.js';

const EventType = {
  INIT: 'init',
  ERROR: 'error',
};

class OffersModel extends Observable {
  /** @type {TOffersGroup[]} */
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

  get types() {
    return this.list.map((offer) => offer.type);
  }

  /** @param {string} id */
  getById(id) {
    for (const type of this.list) {
      const offer = type.offers.find((destination) => destination.id === id);
      if (offer) {
        return offer;
      }
    }
  }

  /** @param {string} type */
  getByType(type) {
    return this.list.find((offer) => offer.type === type)?.offers;
  }

  async updateData() {
    try {
      this.#data = await this.#api.getOffers();
    } catch (err) {
      this._notify(EventType.ERROR, err);
    }
  }
}

export default OffersModel;
