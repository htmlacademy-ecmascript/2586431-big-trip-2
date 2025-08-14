import { POINTS_COUNT } from '../constants';
import { getRandomPoint as getRandomMockPoint } from '../mock/points';
import Observable from '../framework/observable';

const EventType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

class PointsModel extends Observable {
  #data;

  EventType = EventType;

  constructor() {
    super();
    this.#data = Array.from({ length: POINTS_COUNT }, getRandomMockPoint);
  }

  get list() {
    if (!this.#data) {
      return [];
    }
    return this.#data;
  }

  getPointById(id) {
    return this.#data.find((point) => point.id === id);
  }

  updatePoint(id, update) {
    const index = this.#data.findIndex((point) => point.id === id);
    if (index === -1) {
      return;
    }
    this.#data[index] = { ...this.#data[index], ...update };
    this._notify(EventType.UPDATE, { id, update });
  }

  createPoint(point) {
    point.id = String(this.#data.length + 1);
    this.#data.push(point);
    this._notify(EventType.CREATE, point);
  }

  deletePoint(id) {
    const index = this.#data.findIndex((point) => point.id === id);
    if (index === -1) {
      return;
    }
    this.#data.splice(index, 1);
    this._notify(EventType.DELETE, id);
  }
}

export default PointsModel;
