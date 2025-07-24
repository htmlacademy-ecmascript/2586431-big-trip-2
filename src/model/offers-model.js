import { offers as mockOffers } from '../mock/offers';

class OffersModel {
  #data;

  constructor() {
    this.#data = mockOffers;
  }

  get list() {
    if (!this.#data) {
      return [];
    }
    return this.#data;
  }

  getById(id) {
    for (const type of this.list) {
      const offer = type.offers.find((destination) => destination.id === id);
      if (offer) {
        return offer;
      }
    }
  }

  getByType(type) {
    return this.list.find((offer) => offer.type === type)?.offers;
  }

  get types() {
    return this.list.map((offer) => offer.type);
  }
}

export default OffersModel;
