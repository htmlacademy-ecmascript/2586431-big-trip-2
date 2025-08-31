import 'flatpickr/dist/flatpickr.min.css';
import Api from './api.js';
import { API_URL, AUTH_TOKEN } from './env.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import SortModel from './model/sort-model.js';
import MainPresenter from './presenter/main-presenter.js';

function initApp() {
  const mainContainer = document.querySelector('.trip-main');
  const listContainer = document.querySelector('.trip-events');
  const filtersContainer = document.querySelector('.trip-controls__filters');

  const api = new Api(API_URL, AUTH_TOKEN);

  const pointsModel = new PointsModel({ api });
  const offersModel = new OffersModel({ api });
  const destinationsModel = new DestinationsModel({ api });
  const filtersModel = new FiltersModel();
  const sortModel = new SortModel();

  const presenter = new MainPresenter({
    mainContainer,
    listContainer,
    filtersContainer,
    pointsModel,
    offersModel,
    destinationsModel,
    filtersModel,
    sortModel,
  });

  presenter.render();
}

try {
  initApp();
} catch (error) {
  //
}
