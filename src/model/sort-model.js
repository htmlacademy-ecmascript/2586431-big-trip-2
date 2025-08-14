import Observable from '../framework/observable';
import { DEFAULTS } from '../constants';

const EventType = {
  CHANGE: 'change',
  RESET: 'reset',
};

class SortModel extends Observable {
  #sort;

  EventType = EventType;

  constructor() {
    super();
    this.#sort = DEFAULTS.SORT;
  }

  reset() {
    this.#sort = DEFAULTS.SORT;
    this._notify(EventType.RESET, this.#sort);
  }

  get sort() {
    return this.#sort;
  }

  set sort(sort) {
    this.#sort = sort;
    this._notify(EventType.CHANGE, sort);
  }
}

export default SortModel;
