import axiosInstance from './apiService';

export interface DashboardStats {
  totalUsers: number;
  totalContacts: number;
  totalCategories: number;
  newUsersToday: number;
  newContactsToday: number;
  userGrowth: number;
  contactGrowth: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role?: {
    id: number;
    title: string;
  };
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  category?: {
    id: number;
    name: string;
  };
  user?: {
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    contacts: number;
  };
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
}

class AdminDashboardAPIService {
  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats if API fails
      return {
        totalUsers: 0,
        totalContacts: 0,
        totalCategories: 0,
        newUsersToday: 0,
        newContactsToday: 0,
        userGrowth: 0,
        contactGrowth: 0
      };
    }
  }

  // Users Management
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data.data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await axiosInstance.get(`/admin/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUserRole(userId: number, roleTitle: string): Promise<User> {
    try {
      console.log('UpdateUserRole called with:', { userId, roleTitle });
      const requestData = { role: roleTitle };
      console.log('Sending request data:', requestData);
      
      const response = await axiosInstance.put(`/admin/users/${userId}/role`, requestData);
      console.log('Response received:', response.data);
      return response.data.data.user;
    } catch (error: any) {
      console.error('Error updating user role:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Contacts Management
  async getAllContacts(): Promise<Contact[]> {
    try {
      const response = await axiosInstance.get('/admin/contacts');
      return response.data.data.contacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getContactById(id: number): Promise<Contact> {
    try {
      const response = await axiosInstance.get(`/admin/contacts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async deleteContact(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/admin/contacts/${id}`);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  // Categories Management
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await axiosInstance.get('/admin/categories');
      return response.data.data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await axiosInstance.get(`/admin/categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async createCategory(name: string, description?: string): Promise<Category> {
    try {
      const response = await axiosInstance.post('/admin/categories', {
        name,
        description
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: number, name: string, description?: string): Promise<Category> {
    try {
      const response = await axiosInstance.patch(`/admin/categories/${id}`, {
        name,
        description
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/admin/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Roles Management
  async getAllRoles(): Promise<Role[]> {
    try {
      const response = await axiosInstance.get('/admin/roles');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async getRoleById(id: number): Promise<Role> {
    try {
      const response = await axiosInstance.get(`/admin/roles/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  }

  async createRole(name: string, description?: string, permissions?: string[]): Promise<Role> {
    try {
      const response = await axiosInstance.post('/admin/roles', {
        name,
        description,
        permissions
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(id: number, name: string, description?: string, permissions?: string[]): Promise<Role> {
    try {
      const response = await axiosInstance.patch(`/admin/roles/${id}`, {
        name,
        description,
        permissions
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/admin/roles/${id}`);
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  // Analytics
  async getUserAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    try {
      const response = await axiosInstance.get(`/admin/analytics/users?period=${period}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  async getContactAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    try {
      const response = await axiosInstance.get(`/admin/analytics/contacts?period=${period}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contact analytics:', error);
      throw error;
    }
  }
}

export const adminDashboardAPI = new AdminDashboardAPIService();
export default adminDashboardAPI;
