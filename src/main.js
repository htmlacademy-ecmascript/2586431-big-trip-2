import Presenter from './presenter';

const mainContainer = document.querySelector('.trip-main');
const listContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

const presenter = new Presenter({
  mainContainer,
  listContainer,
  filtersContainer,
});

presenter.render();
