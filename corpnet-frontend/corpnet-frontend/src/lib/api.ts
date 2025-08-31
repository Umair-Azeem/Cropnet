const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.18.28:5000/api';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, role: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  // Product endpoints
  async getProducts() {
    return this.request('/products');
  }

  async addProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Order endpoints
  async getOrders() {
    return this.request('/orders');
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Transaction endpoints
  async getTransactions() {
    return this.request('/transactions');
  }

  async createTransaction(transactionData: any) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // Farmer Offer endpoints
  async createFarmerOffer(offerData: any) {
    return this.request('/farmer-offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  }

  async getFarmerOffers() {
    return this.request('/farmer-offers/my-offers');
  }

  async getAllFarmerOffers(params?: { status?: string; category?: string; page?: number; limit?: number }) {
    const queryParams = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/farmer-offers${queryParams}`);
  }

  async getFarmerOffer(id: string) {
    return this.request(`/farmer-offers/${id}`);
  }

  async updateFarmerOffer(id: string, offerData: any) {
    return this.request(`/farmer-offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(offerData),
    });
  }

  async deleteFarmerOffer(id: string) {
    return this.request(`/farmer-offers/${id}`, {
      method: 'DELETE',
    });
  }

  async adminRespondToOffer(id: string, responseData: any) {
    return this.request(`/farmer-offers/${id}/respond`, {
      method: 'PATCH',
      body: JSON.stringify(responseData),
    });
  }

  // User management endpoints (admin only)
  async getAllUsers(params?: { role?: string; status?: string; page?: number; limit?: number }) {
    const queryParams = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/users${queryParams}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleUserStatus(id: string) {
    return this.request(`/users/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService(); 