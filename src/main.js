import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import MainPresenter from './presenter/main-presenter.js';

const mainContainer = document.querySelector('.trip-main');
const listContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const presenter = new MainPresenter({
  mainContainer,
  listContainer,
  filtersContainer,
  pointsModel,
  offersModel,
  destinationsModel,
});

presenter.render();
