// @ts-check
import Observable from '../framework/observable.js';
import { DEFAULTS } from '../constants.js';

const EventType = {
  CHANGE: 'change',
  RESET: 'reset',
};

class SortModel extends Observable {
  /** @type {string} */
  #sort;

  EventType = EventType;

  constructor() {
    super();
    this.#sort = DEFAULTS.SORT;
  }

  get sort() {
    return this.#sort;
  }

  set sort(sort) {
    this.#sort = sort;
    this._notify(EventType.CHANGE, sort);
  }

  reset() {
    this.#sort = DEFAULTS.SORT;
    this._notify(EventType.RESET, this.#sort);
  }
}

export default SortModel;
