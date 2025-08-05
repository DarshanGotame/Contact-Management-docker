"use client";

import { useState } from "react";
import { FiCamera } from "react-icons/fi";
import ContactImageModal from "./ContactImageModal";
import { getQualifiedImageUrl } from "@/utils/imageHelper";
import { getContactInitials } from "@/utils/avatarUtils";

interface ContactAvatarProps {
  contactId: number;
  contactName: string;
  avatar?: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
}

const ContactAvatar = ({ 
  contactId, 
  contactName, 
  avatar, 
  size = "md", 
  editable = false,
  onAvatarUpdate 
}: ContactAvatarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8 text-sm";
      case "md":
        return "w-12 h-12 text-lg";
      case "lg":
        return "w-16 h-16 text-xl";
      case "xl":
        return "w-32 h-32 text-3xl";
      default:
        return "w-12 h-12 text-lg";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "md":
        return "w-4 h-4";
      case "lg":
        return "w-5 h-5";
      case "xl":
        return "w-6 h-6";
      default:
        return "w-4 h-4";
    }
  };

  const avatarUrl = getQualifiedImageUrl(avatar, false); // Don't use default for contact avatars
  
  console.log('ContactAvatar Debug:', {
    contactId,
    contactName,
    avatar,
    avatarUrl,
    editable,
    size
  });  const handleAvatarSuccess = (newAvatarUrl: string) => {
    if (onAvatarUpdate) {
      onAvatarUpdate(newAvatarUrl);
    }
  };

  const avatarElement = (
    <div className={`relative ${getSizeClasses()} group`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${contactName}'s avatar`}
          className={`${getSizeClasses()} rounded-full object-cover border-2 border-gray-200 dark:border-gray-600`}
          onError={(e) => {
            console.log('Image failed to load:', avatarUrl);
            // Hide the failed image and show fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            // Show the fallback div
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.style.display = 'flex';
            }
          }}
        />
      ) : null}
      
      {/* Fallback initials - always render but conditionally show */}
      <div 
        className={`${getSizeClasses()} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-gray-200 dark:border-gray-600`}
        style={{ display: avatarUrl ? 'none' : 'flex' }}
      >
        <span className={size === "xl" ? "text-2xl" : size === "lg" ? "text-lg" : "text-sm"}>
          {getContactInitials(contactName || 'Contact')}
        </span>
      </div>
      
      {editable && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <FiCamera className={`${getIconSize()} text-white`} />
        </div>
      )}
    </div>
  );

  if (editable) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          title="Change contact picture"
        >
          {avatarElement}
        </button>
        
        <ContactImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contactId={contactId}
          currentAvatar={avatar}
          contactName={contactName}
          onSuccess={handleAvatarSuccess}
        />
      </>
    );
  }

  return avatarElement;
};

export default ContactAvatar;
