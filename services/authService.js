class AuthService {
  async login(email, password) {
    try {
      const response = await fetch('https://app-thvt3ndwfq-uc.a.run.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

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
      return {
        success: false,
        message: 'Unable to connect to server. Please check your internet connection.',
      };
    }
  }

  async verifyToken(token) {
    try {
      const response = await fetch('https://app-thvt3ndwfq-uc.a.run.app/api/auth/verify', {
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
      const response = await fetch('https://app-thvt3ndwfq-uc.a.run.app/api/auth/register', {
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
