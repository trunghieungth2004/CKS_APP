class Storage {
  constructor() {
    this.storage = {};
  }

  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      this.storage[key] = jsonValue;
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  async getItem(key) {
    try {
      const jsonValue = this.storage[key];
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      delete this.storage[key];
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }

  async clear() {
    try {
      this.storage = {};
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
}

export default new Storage();
