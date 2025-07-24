import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model';
import Presenter from './presenter';

const mainContainer = document.querySelector('.trip-main');
const listContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const presenter = new Presenter({
  mainContainer,
  listContainer,
  filtersContainer,
  pointsModel,
  offersModel,
  destinationsModel,
});

presenter.render();
