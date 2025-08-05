'use client';

import { FiUser } from 'react-icons/fi';

interface User {
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

interface UserTableProps {
  users: User[];
  loading: boolean;
  showAll?: boolean;
  onUserRoleUpdate: (userId: string, newRole: string) => Promise<void>;
}

export default function UserTable({ 
  users, 
  loading, 
  showAll = false,
  onUserRoleUpdate 
}: UserTableProps) {
  const displayUsers = showAll ? users : users.slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {showAll ? 'User Management' : 'Recent Users'}
          </h2>
        </div>
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {showAll ? 'User Management' : 'Recent Users'}
          </h2>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                Email
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Status
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {displayUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.fullName}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                  {user.email}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isEmailVerified 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={user.role.title.toLowerCase()}
                    onChange={(e) => onUserRoleUpdate(user.id, e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!showAll && users.length > 5 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing 5 of {users.length} users
          </p>
        </div>
      )}
    </div>
  );
}
