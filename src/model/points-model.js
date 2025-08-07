import { POINTS_COUNT } from '../constants';
import { getRandomPoint as getRandomMockPoint } from '../mock/points';

class PointsModel {
  #data;

  constructor() {
    this.#data = Array.from({ length: POINTS_COUNT }, getRandomMockPoint);
  }

  get list() {
    if (!this.#data) {
      return [];
    }
    return this.#data;
  }

  updatePoint(id, update) {
    const index = this.#data.findIndex((point) => point.id === id);
    if (index === -1) {
      return;
    }
    this.#data[index] = { ...this.#data[index], ...update };
  }
}

export default PointsModel;
