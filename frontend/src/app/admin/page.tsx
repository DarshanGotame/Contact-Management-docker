"use client";

import { useState, useEffect } from "react";
import { UserManagement, UserFilters, CreateUserData, UpdateUserData } from "@/types/userManagement.type";
import { userManagementService } from "@/services/userManagementService";
import AdminUserSidebar from "@/components/admin/AdminUserSidebar";
import UserList from "@/components/admin/UserList";
import UserDetails from "@/components/admin/UserDetails";
import UserModal from "@/components/admin/UserModal";
import DashboardStats from "@/components/admin/DashboardStats";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/utils/storageHelper";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserManagement | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'users'>('dashboard');
  const [stats, setStats] = useState(null);
  
  const router = useRouter();

  // Check admin access
  useEffect(() => {
    const user = getLoggedInUser();
    if (!user || user.role?.title?.toLowerCase() !== 'admin') {
      toast.error("Access denied. Admin privileges required.");
      router.push('/dashboard');
      return;
    }
  }, [router]);

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userManagementService.getUsers(filters);
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard stats
  const loadStats = async () => {
    try {
      const response = await userManagementService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => {
    if (currentView === 'users') {
      loadUsers();
    } else if (currentView === 'dashboard') {
      loadStats();
    }
  }, [filters, currentView]);

  const handleUserSelect = (user: UserManagement) => {
    setSelectedUser(user);
  };

  const handleUserEdit = (user: UserManagement) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleUserDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await userManagementService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleUserSave = async () => {
    await loadUsers();
    setShowModal(false);
    setEditingUser(null);
    toast.success(editingUser ? "User updated" : "User created");
  };

  const renderContent = () => {
    if (currentView === 'dashboard') {
      return <DashboardStats stats={stats} onNavigateToUsers={() => setCurrentView('users')} />;
    }

    return (
      <div className="flex-1 flex">
        {/* User List */}
        <UserList
          users={users}
          totalUsers={users.length}
          currentPage={1}
          totalPages={1}
          filters={filters}
          onUserSelect={handleUserSelect}
          onEditUser={handleUserEdit}
          onDeleteUser={handleUserDelete}
          onFiltersChange={setFilters}
          onPageChange={() => {}}
          selectedUserId={selectedUser?.id}
        />

        {/* User Details */}
        {selectedUser && (
          <UserDetails
            user={selectedUser}
            onEditUser={handleUserEdit}
            onDeleteUser={handleUserDelete}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Sidebar */}
      <AdminUserSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddUser={() => {
          setEditingUser(null);
          setShowModal(true);
        }}
      />

      {/* Main Content */}
      {renderContent()}

      {/* User Modal */}
      {showModal && (
        <UserModal
          isOpen={showModal}
          user={editingUser}
          onSubmit={async (data: CreateUserData | UpdateUserData) => {
            // Handle user creation/update
            if (editingUser) {
              await userManagementService.updateUser(editingUser.id, data as UpdateUserData);
            } else {
              await userManagementService.createUser(data as CreateUserData);
            }
            handleUserSave();
          }}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          isLoading={loading}
        />
      )}
    </div>
  );
}
