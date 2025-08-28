import ApiService from './framework/api-service.js';

class AxiosAtHome extends ApiService {
  constructor(endPoint, authToken) {
    const authorization = `Basic ${authToken}`;
    super(endPoint, authorization);
  }

  async get(endpoint) {
    const response = await super._load({ url: endpoint, method: 'GET' });
    return response.json();
  }

  async post(endpoint, body) {
    const response = await super._load({
      url: endpoint,
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return response.json();
  }

  async put(endpoint, body) {
    const response = await super._load({
      url: endpoint,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return response.json();
  }

  async delete(endpoint) {
    await super._load({ url: endpoint, method: 'DELETE' });
  }
}

class Api extends AxiosAtHome {
  /**
   * Получение списка точек маршрута
   * @returns {Promise<TPoint[]>} массив точек маршрута
   */
  getPoints() {
    return this.get('points');
  }

  /**
   * Получение списка назначений
   * @returns {Promise<TDestination[]>} массив назначений
   */
  getDestinations() {
    return this.get('destinations');
  }

  /**
   * Получение списка предложений
   * @returns {Promise<TOffersGroup[]>} массив групп предложений
   */
  getOffers() {
    return this.get('offers');
  }

  /**
   * Создание новой точки маршрута
   * @param {TPoint} point - данные точки для создания
   * @returns {Promise<TPoint>} созданная точка
   */
  createPoint(point) {
    return this.post('points', point);
  }

  /**
   * Обновление существующей точки маршрута
   * @param {string} id - идентификатор точки
   * @param {TPoint} body - новые данные точки
   * @returns {Promise<TPoint>} обновленная точка
   */
  updatePoint(id, body) {
    return this.put(`points/${id}`, body);
  }

  /**
   * Удаление точки маршрута
   * @param {string} id - идентификатор точки для удаления
   * @returns {Promise<void>}
   */
  deletePoint(id) {
    return this.delete(`points/${id}`);
  }
}

export default Api;
