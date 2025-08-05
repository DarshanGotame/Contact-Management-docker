'use client';

import { FiMail, FiTag, FiX } from 'react-icons/fi';
import ContactAvatar from '@/components/ContactAvatar';

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

interface ContactTableProps {
  filteredContacts: Contact[];
  loading: boolean;
  showAll?: boolean;
  selectedCategory: string | number | null;
  onClearFilter: () => void;
  onAvatarUpdate?: (contactId: number, newAvatarUrl: string) => void;
}

export default function ContactTable({ 
  filteredContacts,
  loading, 
  showAll = false,
  selectedCategory,
  onClearFilter,
  onAvatarUpdate
}: ContactTableProps) {
  const displayContacts = showAll ? filteredContacts : filteredContacts.slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {showAll ? 'Contact Management' : 'Recent Contacts'}
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
            {showAll ? 'Contact Management' : 'Recent Contacts'}
          </h2>
          {selectedCategory && (
            <button
              onClick={onClearFilter}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
            >
              <FiTag className="w-3 h-3 mr-1" />
              Filtered
              <FiX className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                Email
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                Owner
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {displayContacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ContactAvatar
                        contactId={contact.id}
                        contactName={contact.fullName}
                        avatar={contact.avatar}
                        size="md"
                        editable={true}
                        onAvatarUpdate={(newAvatarUrl) => onAvatarUpdate?.(contact.id, newAvatarUrl)}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contact.fullName}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {contact.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                  <div className="flex items-center">
                    <FiMail className="w-4 h-4 mr-2" />
                    {contact.email}
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                  {contact.category ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      <FiTag className="w-3 h-3 mr-1" />
                      {contact.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">No category</span>
                  )}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                  {contact.user?.fullName || 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!showAll && filteredContacts.length > 5 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing 5 of {filteredContacts.length} contacts
            {selectedCategory && ' (filtered)'}
          </p>
        </div>
      )}
    </div>
  );
}
