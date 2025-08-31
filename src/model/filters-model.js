// @ts-check
import Observable from '../framework/observable.js';
import { DEFAULTS } from '../constants.js';

const EventType = {
  CHANGE: 'change',
  RESET: 'reset',
};

class FiltersModel extends Observable {
  /** @type {string} */
  #filter;

  EventType = EventType;

  constructor() {
    super();
    this.#filter = DEFAULTS.FILTER;
  }

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
    this._notify(EventType.CHANGE, filter);
  }

  reset() {
    this.#filter = DEFAULTS.FILTER;
    this._notify(EventType.RESET, this.#filter);
  }
}

export default FiltersModel;
