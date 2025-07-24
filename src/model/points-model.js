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
}

export default PointsModel;
