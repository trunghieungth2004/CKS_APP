class ApiService {
  constructor() {
    this.baseURL = 'https://app-thvt3ndwfq-uc.a.run.app';
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, method = 'GET', body = null) {
    try {
      const config = {
        method,
        headers: this.getHeaders(),
      };

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      return {
        success: response.ok,
        statusCode: response.status,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async get(endpoint) {
    return this.request(endpoint, 'GET');
  }

  async post(endpoint, body) {
    return this.request(endpoint, 'POST', body);
  }

  async put(endpoint, body) {
    return this.request(endpoint, 'PUT', body);
  }

  async delete(endpoint, body) {
    return this.request(endpoint, 'DELETE', body);
  }
}

export default new ApiService();
