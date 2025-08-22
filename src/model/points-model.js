// @ts-check
import Observable from '../framework/observable';

const EventType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  FETCH: 'fetch',
  INIT: 'init',
};

class PointsModel extends Observable {
  /** @type {TPoint[]} */
  #data;
  #api;

  EventType = EventType;

  /** @param {{ api: import('../api').default }} */
  constructor({ api }) {
    super();
    this.#api = api;
    this.updateList().then(() => {
      this._notify(EventType.INIT, this.#data);
    });
  }

  async updateList() {
    this.#data = await this.#api.getPoints();
    this._notify(EventType.FETCH, this.#data);
  }

  get list() {
    if (!this.#data) {
      return [];
    }
    return this.#data;
  }

  get isLoaded() {
    return this.#data !== undefined;
  }

  /** @param {string} id */
  getPointById(id) {
    return this.#data.find((point) => point.id === id);
  }

  /**
   * @param {string} id
   * @param {Partial<TPoint>} body
   */
  async updatePoint(id, body) {
    const current = this.getPointById(id);
    const update = /** @type {TPoint} */ ({ ...current, ...body });
    const updated = await this.#api.updatePoint(id, update);
    await this.updateList();
    this._notify(EventType.UPDATE, { id, body, updated });
  }

  /** @param {TPoint} point */
  async createPoint(point) {
    const created = await this.#api.createPoint(point);
    await this.updateList();
    this._notify(EventType.CREATE, created);
  }

  /** @param {string} id */
  async deletePoint(id) {
    await this.#api.deletePoint(id);
    await this.updateList();
    this._notify(EventType.DELETE, id);
  }
}

export default PointsModel;
