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
  /** @returns {Promise<TPoint[]>} */
  getPoints() {
    return this.get('points');
  }

  /** @returns {Promise<TDestination[]>} */
  getDestinations() {
    return this.get('destinations');
  }

  /** @returns {Promise<TOffersGroup[]>} */
  getOffers() {
    return this.get('offers');
  }

  /** @param {TPoint} point */
  createPoint(point) {
    return this.post('points', point);
  }

  /**
   * @param {string} id
   * @param {TPoint} body */
  updatePoint(id, body) {
    return this.put(`points/${id}`, body);
  }

  /** @param {string} id */
  deletePoint(id) {
    return this.delete(`points/${id}`);
  }
}

export default Api;
