import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/common/Navbar';
import { adminService, AdminCreateRequest } from '../services/adminService';

type AdminStatus = 'active' | 'inactive' | 'suspended';

const STATUS_OPTIONS: { value: AdminStatus; label: string; icon: string; hoverClass: string }[] = [
  { value: 'active',    label: 'Active',    icon: '✓', hoverClass: 'hover:bg-green-50' },
  { value: 'inactive',  label: 'Inactive',  icon: '⊘', hoverClass: 'hover:bg-gray-50'  },
  { value: 'suspended', label: 'Suspended', icon: '⛔', hoverClass: 'hover:bg-red-50'   },
];

const STATUS_BADGE: Record<AdminStatus, string> = {
  active:    'bg-green-100 text-green-800',
  inactive:  'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
};

const EMPTY_FORM: AdminCreateRequest = { name: '', email: '', password: '', role: 'admin' };

const AdminManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [admins, setAdmins]                     = useState<any[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState<string | null>(null);
  const [showForm, setShowForm]                 = useState(false);
  const [editingId, setEditingId]               = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId]   = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId]   = useState<string | null>(null);
  const [openMenuId, setOpenMenuId]             = useState<string | null>(null);
  const [formData, setFormData]                 = useState<AdminCreateRequest>(EMPTY_FORM);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close status menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllAdmins();
      setAdmins(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setError(t('validation.fillAllFields'));
      return;
    }
    if (!editingId && !formData.password) {
      setError('Password is required for new admins');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        await adminService.updateAdmin(editingId, { name: formData.name, email: formData.email });
      } else {
        await adminService.createAdmin(formData);
      }

      resetForm();
      await fetchAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save admin');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: AdminStatus) => {
    setOpenMenuId(null);
    try {
      setStatusLoadingId(id);
      setError(null);
      await adminService.changeAdminStatus(id, newStatus);
      await fetchAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change status');
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteAdmin(id);
      setDeleteConfirmId(null);
      await fetchAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete admin');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin: any) => {
    setFormData({ name: admin.name, email: admin.email, password: '', role: 'admin' });
    setEditingId(admin._id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="py-6 sm:py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('admin.management')}
            </h1>
            <button
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {showForm ? 'Cancel' : 'Create New Admin'}
            </button>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Create / Edit Form */}
            {showForm && (
              <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingId ? 'Edit Admin' : 'Create New Admin'}
                  </h3>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Admin name"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="admin@example.com"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={editingId ? 'Optional' : 'Strong password'}
                        disabled={loading}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {loading ? 'Saving…' : editingId ? 'Update Admin' : 'Create Admin'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Admins Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  All Admins ({admins.length})
                </h3>

                {loading && !showForm ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    <p className="mt-2 text-gray-600">Loading admins…</p>
                  </div>
                ) : admins.length === 0 ? (
                  <p className="text-gray-600 text-center py-6">
                    No admins found. Create one to get started!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Name', 'Email', 'Role', 'Status', 'Created At', 'end','Actions'].map((h) => (
                            <th
                              key={h}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {admins.map((admin: any) => (
                          <tr key={admin._id} className="hover:bg-gray-50">

                            {/* Name */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {admin.name}
                            </td>

                            {/* Email */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {admin.email}
                            </td>

                            {/* Role */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {admin.role}
                              </span>
                            </td>

                            {/* Status + dropdown */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_BADGE[admin.status as AdminStatus] ?? 'bg-gray-100 text-gray-800'}`}>
                                  {admin.status}
                                </span>

                                {/* ── Status menu ── */}
                                <div className="relative" ref={openMenuId === admin._id ? menuRef : null}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(openMenuId === admin._id ? null : admin._id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    title="Change status"
                                    disabled={statusLoadingId === admin._id}
                                  >
                                    {statusLoadingId === admin._id ? (
                                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <circle cx="10" cy="4"  r="1.5" />
                                        <circle cx="10" cy="10" r="1.5" />
                                        <circle cx="10" cy="16" r="1.5" />
                                      </svg>
                                    )}
                                  </button>

                                  {openMenuId === admin._id && (
                                    <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
                                      {STATUS_OPTIONS.map(({ value, label, icon, hoverClass }) => (
                                        <button
                                          key={value}
                                          onClick={() => handleStatusChange(admin._id, value)}
                                          disabled={admin.status === value}
                                          className={`w-full text-left px-4 py-2 text-sm text-gray-700 ${hoverClass} disabled:opacity-40 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg`}
                                        >
                                          {icon} {label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Created At */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(admin.createdAt).toLocaleDateString()}
                            </td>
                            {/*end */}
                            <td className=" text-sm text-gray-500">
                              {new Date(admin.endAccessDate).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                              <button
                                onClick={() => handleEdit(admin)}
                                className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                disabled={loading}
                              >
                                Edit
                              </button>

                              {deleteConfirmId === admin._id ? (
                                <span className="inline-flex gap-2">
                                  <button
                                    onClick={() => handleDelete(admin._id)}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-900 text-xs font-bold disabled:opacity-50"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    disabled={loading}
                                    className="text-gray-600 hover:text-gray-900 text-xs disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(admin._id)}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  disabled={loading}
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminManagementPage;
