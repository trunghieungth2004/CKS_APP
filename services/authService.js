import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';

class AuthService {
  async login(email, password) {
    try {
      // Add timeout to detect hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      const data = await response.json();

      if (response.ok && data.statusCode === 200) {
        return {
          success: true,
          data: {
            user: {
              user_id: data.data.user_id,
              email: data.data.email,
              role_id: data.data.role_id,
            },
            token: data.data.token,
          },
          message: data.message || 'Login successful',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Invalid credentials',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout. Server took too long to respond.',
        };
      }
      
      return {
        success: false,
        message: 'Unable to connect to server. Please check your internet connection.',
      };
    }
  }

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.VERIFY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: 'Token verification failed',
      };
    }
  }

  async register(userData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
      };
    }
  }
}

export default new AuthService();
