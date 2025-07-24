import { destinations as mockDestinations } from '../mock/destinations';

class DestinationsModel {
  #data;

  constructor() {
    this.#data = mockDestinations;
  }

  get list() {
    if (!this.#data) {
      return [];
    }
    return this.#data;
  }

  getById(id) {
    return this.#data.find((destination) => destination.id === id);
  }
}

export default DestinationsModel;
