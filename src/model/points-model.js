// @ts-check
import Observable from '../framework/observable.js';

const EventType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  FETCH: 'fetch',
  ERROR: 'error',
  INIT: 'init',
};

class PointsModel extends Observable {
  /** @type {TPoint[]} */
  #data;
  #api;

  EventType = EventType;

  /** @param {{ api: import('../api').default }} config */
  constructor({ api }) {
    super();
    this.#api = api;
    this.refetch().then(() => {
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
  getPointById(id) {
    return this.#data.find((point) => point.id === id);
  }

  async refetch() {
    try {
      this.#data = await this.#api.getPoints();
      this._notify(EventType.FETCH, this.#data);
    } catch (err) {
      this._notify(EventType.ERROR, err);
    }
  }

  /**
   * @param {string} id
   * @param {Partial<TPoint>} body
   */
  async update(id, body) {
    const current = this.getPointById(id);
    const update = /** @type {TPoint} */ ({ ...current, ...body });
    const updated = await this.#api.updatePoint(id, update);
    this.#data = this.#data.map((point) => (point.id === id ? updated : point));
    this._notify(EventType.UPDATE, { id, body, updated });
  }

  /** @param {TPoint} point */
  async create(point) {
    const created = await this.#api.createPoint(point);
    this.#data.push(created);
    this._notify(EventType.CREATE, created);
  }

  /** @param {string} id */
  async delete(id) {
    await this.#api.deletePoint(id);
    this.#data = this.#data.filter((point) => point.id !== id);
    this._notify(EventType.DELETE, id);
  }
}

export default PointsModel;
