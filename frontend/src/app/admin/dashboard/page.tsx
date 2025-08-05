'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminLayout } from '@/app/admin/layout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserTable from '@/components/admin/UserTable';
import ContactTable from '@/components/admin/ContactTable';
import CategoryTable from '@/components/admin/CategoryTable';
import CategoryModal from '@/components/admin/CategoryModal';
import UserModal from '@/components/admin/UserModal';
import { adminDashboardAPI } from '@/services/adminDashboardAPI.service';
import { FiLoader } from 'react-icons/fi';

// Local interfaces that match the backend API
interface DashboardUser {
  id: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  role: {
    id: number;
    title: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface Contact {
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
}

interface Category {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  user?: {
    fullName: string;
  };
}

interface Stats {
  totalUsers: number;
  totalContacts: number;
  totalCategories: number;
  recentContacts: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useAdminLayout();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>(null);
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, category: null as Category | null });
  const [userModal, setUserModal] = useState({ isOpen: false, user: null as DashboardUser | null });
  
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalContacts: 0,
    totalCategories: 0,
    recentContacts: 0,
  });

  // Function declarations must come before useEffect hooks
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching admin dashboard data...");

      // Use admin endpoints directly since we're in an admin context
      try {
        // Try admin endpoints first - these are the correct endpoints
        console.log("Calling adminDashboardAPI.getDashboardStats()...");
        const statsResult = await adminDashboardAPI.getDashboardStats();
        console.log("Stats result:", statsResult);
        
        console.log("Calling adminDashboardAPI.getAllUsers()...");
        const usersResult = await adminDashboardAPI.getAllUsers();
        console.log("Users result:", usersResult);
        
        console.log("Calling adminDashboardAPI.getAllContacts()...");
        const contactsResult = await adminDashboardAPI.getAllContacts();
        console.log("Contacts result:", contactsResult);
        
        console.log("Calling adminDashboardAPI.getAllCategories()...");
        const categoriesResult = await adminDashboardAPI.getAllCategories();
        console.log("Categories result:", categoriesResult);
        
        console.log(`Loaded ${usersResult.length} users, ${contactsResult.length} contacts, ${categoriesResult.length} categories`);
        
        setStats({
          totalUsers: statsResult.totalUsers || usersResult.length,
          totalContacts: statsResult.totalContacts || contactsResult.length,
          totalCategories: statsResult.totalCategories || categoriesResult.length,
          recentContacts: statsResult.newContactsToday || 0
        });
        
        setUsers(usersResult.map((userItem: any) => ({
          id: userItem.id.toString(),
          fullName: userItem.fullName,
          email: userItem.email,
          isEmailVerified: userItem.isEmailVerified,
          role: {
            id: userItem.role?.id || 2,
            title: userItem.role?.name || userItem.role?.title || 'User'
          },
          createdAt: userItem.createdAt,
          updatedAt: userItem.updatedAt
        })));
        
        setContacts(contactsResult);
        setCategories(categoriesResult);
        
        console.log("Dashboard data loaded successfully");
        
      } catch (adminError: any) {
        console.log("Admin endpoints failed:", adminError.response?.status, adminError.response?.data);
        
        // If admin endpoints fail, it might be an authentication issue
        if (adminError.response?.status === 401 || adminError.response?.status === 403) {
          setError('You do not have permission to access admin data. Please ensure you are logged in as an administrator.');
        } else {
          setError('Failed to load admin data. The admin endpoints may not be available.');
        }
        
        // Fallback to showing current user data only
        if (user) {
          setStats({
            totalUsers: 1,
            totalContacts: 0,
            totalCategories: 0,
            recentContacts: 0
          });
          
          setUsers([{
            id: user.id || '1',
            fullName: user.fullName,
            email: user.email,
            isEmailVerified: user.isEmailVerified || false,
            role: {
              id: user.role?.id || 2,
              title: user.role?.title || 'User'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }]);
        }
        
        setContacts([]);
        setCategories([]);
      }

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      setError('Failed to load dashboard data. Please check your connection and try again.');
      
      // Set fallback data including current user
      setStats({
        totalUsers: user ? 1 : 0,
        totalContacts: 0,
        totalCategories: 0,
        recentContacts: 0
      });
      
      // Always show current user even if API fails
      if (user) {
        setUsers([{
          id: user.id || '1',
          fullName: user.fullName,
          email: user.email,
          isEmailVerified: user.isEmailVerified || false,
          role: {
            id: user.role?.id || 2,
            title: user.role?.title || 'User'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
      } else {
        setUsers([]);
      }
      
      setContacts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // All useEffect hooks must come before any conditional returns
  // Fetch dashboard data
  useEffect(() => {
    console.log("=== ADMIN DASHBOARD AUTHENTICATION DEBUG ===");
    console.log("Current user:", user);
    console.log("User role:", user?.role);
    console.log("User role title:", user?.role?.title);
    console.log("Is admin check:", user?.role?.title?.toLowerCase() === 'admin');
    console.log("Loading state:", loading);
    
    // Only fetch data if user is loaded and is admin
    if (user && user.role?.title?.toLowerCase() === 'admin') {
      console.log("✅ User is admin, fetching dashboard data...");
      fetchDashboardData();
    } else if (user && user.role?.title?.toLowerCase() !== 'admin') {
      // Redirect non-admin users
      console.log("❌ User is not admin, redirecting to dashboard");
      router.push('/dashboard');
    } else if (!loading && !user) {
      console.log("❌ No user found, redirecting to login");
      router.push('/login');
    } else {
      console.log("⏳ Still loading user data...");
    }
  }, [user, router]);

  // Filter contacts when contacts or selectedCategory changes
  useEffect(() => {
    if (selectedCategory === null || selectedCategory === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => 
        contact.category?.id === selectedCategory
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, selectedCategory]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect if not admin
  if (user && user.role?.title?.toLowerCase() !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  // Redirect if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  // Add contact counts to categories for sidebar
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    contactCount: contacts.filter(c => c.category?.id === category.id).length
  }));

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleCategorySelect = (categoryId: string | number | null) => {
    setSelectedCategory(categoryId === '' ? null : categoryId);
  };

  const handleContactAvatarUpdate = async (contactId: number, newAvatarUrl: string) => {
    // Update the contact in the local state immediately for better UX
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, avatar: newAvatarUrl }
          : contact
      )
    );

    // Refresh all data to ensure consistency
    try {
      const contactsResult = await adminDashboardAPI.getAllContacts();
      setContacts(contactsResult);
    } catch (error) {
      console.error("Error refreshing contacts after avatar update:", error);
    }
  };

  const handleOpenCategoryModal = (category: Category | null = null) => {
    setCategoryModal({ isOpen: true, category });
  };

  const handleCloseCategoryModal = () => {
    setCategoryModal({ isOpen: false, category: null });
  };

  const handleCategoryModalSuccess = () => {
    fetchDashboardData(); // Refresh data after category create/update
  };

  const handleCloseUserModal = () => {
    setUserModal({ isOpen: false, user: null });
  };

  const handleUserModalSubmit = async (data: any) => {
    // Handle user role update
    if (userModal.user) {
      await handleUserRoleUpdate(userModal.user.id, data.roleId === 1 ? 'admin' : 'user');
      setUserModal({ isOpen: false, user: null });
      fetchDashboardData(); // Refresh data after update
    }
  };

  const convertUserToUserManagement = (user: DashboardUser | null): any => {
    if (!user) return null;
    
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: {
        id: user.role?.id || (user.role?.title === 'Admin' ? 1 : 2),
        title: user.role?.title || 'User'
      },
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    };
  };

  const handleUserRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await adminDashboardAPI.updateUserRole(parseInt(userId), newRole);
      
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, role: { id: response.role?.id || 0, title: response.role?.title || newRole } }
          : u
      ));
      alert('User role updated successfully');
    } catch (error: any) {
      console.error('Error updating user role:', error);
      alert(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await adminDashboardAPI.deleteCategory(parseInt(categoryId));
      setCategories(categories.filter(c => c.id !== parseInt(categoryId)));
      alert('Category deleted successfully');
      fetchDashboardData(); // Refresh data to get updated counts
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  if (!user || user.role.title !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-full relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 md:z-auto
          w-80 flex-shrink-0 transition-transform duration-300 ease-in-out
        `}>
          <AdminSidebar
            categories={categoriesWithCounts}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

          {/* Overview Section - Stats */}
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Stats cards will be added here using DashboardStats component */}
              <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? <FiLoader className="animate-spin h-5 w-5 lg:h-6 lg:w-6 mx-auto" /> : stats.totalContacts}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Total Contacts</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? <FiLoader className="animate-spin h-5 w-5 lg:h-6 lg:w-6 mx-auto" /> : stats.totalUsers}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Total Users</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? <FiLoader className="animate-spin h-5 w-5 lg:h-6 lg:w-6 mx-auto" /> : stats.totalCategories}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Categories</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? <FiLoader className="animate-spin h-5 w-5 lg:h-6 lg:w-6 mx-auto" /> : stats.recentContacts}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Recent (7 days)</div>
                </div>
              </div>
            </div>
          )}

          {/* Users Section */}
          {(activeSection === 'overview' || activeSection === 'users') && (
            <UserTable
              users={users}
              loading={loading}
              showAll={activeSection === 'users'}
              onUserRoleUpdate={handleUserRoleUpdate}
            />
          )}

          {/* Contacts Section */}
          {(activeSection === 'overview' || activeSection === 'contacts') && (
            <ContactTable
              filteredContacts={filteredContacts}
              loading={loading}
              showAll={activeSection === 'contacts'}
              selectedCategory={selectedCategory}
              onClearFilter={() => setSelectedCategory(null)}
              onAvatarUpdate={handleContactAvatarUpdate}
            />
          )}

          {/* Categories Section */}
          {(activeSection === 'overview' || activeSection === 'categories') && (
            <CategoryTable
              categories={categories}
              contacts={contacts}
              loading={loading}
              showAll={activeSection === 'categories'}
              onEdit={handleOpenCategoryModal}
              onDelete={(categoryId: number) => handleDeleteCategory(categoryId.toString())}
              onAdd={() => handleOpenCategoryModal()}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={categoryModal.isOpen}
        onClose={handleCloseCategoryModal}
        onSuccess={handleCategoryModalSuccess}
        category={categoryModal.category}
      />

      <UserModal
        isOpen={userModal.isOpen}
        onClose={handleCloseUserModal}
        onSubmit={handleUserModalSubmit}
        user={convertUserToUserManagement(userModal.user)}
      />
    </div>
    </div>
  );
}
