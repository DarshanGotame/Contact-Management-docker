'use client';

import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiTag, FiChevronDown, FiChevronRight, FiUser } from 'react-icons/fi';
import { getAvatarUrl, getContactInitials } from '@/utils/avatarUtils';

interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  contactCount?: number;
  _count?: {
    contacts: number;
  };
  contacts?: Contact[];
}

interface CategoryTableProps {
  categories: Category[];
  contacts?: Contact[];
  loading: boolean;
  showAll?: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: number) => void;
  onAdd?: () => void;
}

export default function CategoryTable({ 
  categories, 
  contacts = [],
  loading, 
  showAll = false,
  onEdit,
  onDelete,
  onAdd
}: CategoryTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  
  const displayCategories = showAll ? categories : categories.slice(0, 5);

  // Function to get contacts for a specific category
  const getContactsForCategory = (categoryId: number): Contact[] => {
    return contacts.filter(contact => 
      (contact as any).category?.id === categoryId
    );
  };

  // Function to toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {showAll ? 'Category Management' : 'Categories'}
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
            {showAll ? 'Category Management' : 'Categories'}
          </h2>
          {showAll && onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contacts
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Created
              </th>
              {showAll && (onEdit || onDelete) && (
                <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {displayCategories.map((category) => {
              const categoryContacts = getContactsForCategory(category.id);
              const isExpanded = expandedCategories.has(category.id);
              
              return (
                <React.Fragment key={category.id}>
                  {/* Category Row */}
                  <tr>
                    <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <FiTag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </div>
                            {showAll && categoryContacts.length > 0 && (
                              <button
                                onClick={() => toggleCategoryExpansion(category.id)}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
                              >
                                {isExpanded ? (
                                  <FiChevronDown className="h-4 w-4" />
                                ) : (
                                  <FiChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        {category.contactCount ?? category._count?.contacts ?? categoryContacts.length} contacts
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {category.createdAt 
                        ? new Date(category.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : '-'
                      }
                    </td>
                    {showAll && (onEdit || onDelete) && (
                      <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(category)}
                              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(category.id)}
                              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>

                  {/* Expanded Contacts Rows */}
                  {showAll && isExpanded && categoryContacts.length > 0 && (
                    <tr>
                      <td colSpan={showAll && (onEdit || onDelete) ? 5 : 4} className="px-0 py-0">
                        <div className="bg-gray-50 dark:bg-gray-700/50">
                          <div className="px-6 py-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                              Contacts in {category.name} ({categoryContacts.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {categoryContacts.map((contact) => {
                                const avatarUrl = getAvatarUrl(contact.avatar);
                                const initials = getContactInitials(contact.fullName);
                                
                                return (
                                  <div
                                    key={contact.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex-shrink-0">
                                        {avatarUrl ? (
                                          <img
                                            className="h-8 w-8 rounded-full object-cover"
                                            src={avatarUrl}
                                            alt={contact.fullName}
                                            onError={(e) => {
                                              // Fallback to initials if image fails to load
                                              const target = e.target as HTMLImageElement;
                                              target.style.display = 'none';
                                              if (target.nextElementSibling) {
                                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                              }
                                            }}
                                          />
                                        ) : null}
                                        <div 
                                          className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400"
                                          style={{ display: avatarUrl ? 'none' : 'flex' }}
                                        >
                                          {initials}
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {contact.fullName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                          {contact.email}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {categoryContacts.length === 0 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                No contacts in this category
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {!showAll && categories.length > 5 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing 5 of {categories.length} categories
          </p>
        </div>
      )}
    </div>
  );
}
