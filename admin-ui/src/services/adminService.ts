import { usersAPI } from './api';

export interface AdminUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin';
}

export interface AdminCreateRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin';
}

// Admin User Management API
export const adminService = {
  // Get all admins
  getAllAdmins: () => usersAPI.getAllAdmins(),

  // Get admin by ID
  getAdminById: (id: string) => usersAPI.getAdminById(id),

  // Create new admin
  createAdmin: (adminData: AdminCreateRequest) => {
    console.log('Creating admin:', adminData);
    return usersAPI.createAdmin(adminData);
  },

  // Update admin
  updateAdmin: (id: string, adminData: Partial<AdminUser>) => {
    console.log('Updating admin:', id, adminData);
    return usersAPI.updateAdmin(id, adminData);
  },

  // Delete admin
  deleteAdmin: (id: string) => usersAPI.deleteAdmin(id),

  // Change admin status
  changeAdminStatus: (id: string, status: 'active' | 'inactive' | 'suspended') => {
    return usersAPI.changeAdminStatus(id, status);
  },

  // Change admin password
  changePassword: (id: string, currentPassword: string, newPassword: string) => {
    return usersAPI.changeAdminPassword(id, { currentPassword, newPassword });
  },
};

export default adminService;
