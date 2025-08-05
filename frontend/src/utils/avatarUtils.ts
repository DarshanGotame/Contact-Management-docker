/**
 * Get the backend base URL for constructing avatar URLs
 */
const getBackendBaseUrl = (): string => {
  // Try to get from environment variable first
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or fallback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    // Remove '/api' suffix if present to get the base URL
    return apiUrl.replace('/api', '');
  }
  // Server-side: fallback to localhost
  return 'http://localhost:8080';
};

/**
 * Helper function to construct proper avatar URLs
 * Handles different avatar formats returned by the backend
 */
export const getAvatarUrl = (avatar?: string, isUserProfile?: boolean): string | null => {
  console.log('getAvatarUrl called with:', { avatar, isUserProfile });
  
  if (!avatar) {
    console.log('No avatar provided, returning null');
    return null;
  }
  
  // If it's already a complete URL, use it as is
  if (avatar.startsWith('http')) {
    console.log('Avatar is complete URL:', avatar);
    return avatar;
  }
  
  const baseUrl = getBackendBaseUrl();
  console.log('Base URL:', baseUrl);
  
  // Normalize path separators (convert backslashes to forward slashes)
  let normalizedAvatar = avatar.replace(/\\/g, '/');
  
  // If it starts with uploads/ or /uploads/, construct the URL
  if (normalizedAvatar.startsWith('uploads/') || normalizedAvatar.startsWith('/uploads/')) {
    const path = normalizedAvatar.startsWith('/') ? normalizedAvatar : `/${normalizedAvatar}`;
    const fullUrl = `${baseUrl}${path}`;
    console.log('Avatar with uploads path, full URL:', fullUrl);
    return fullUrl;
  }
  
  // For just filenames, default to profile_pictures since most images are there
  // and the backend should be providing full paths anyway
  const fullUrl = `${baseUrl}/uploads/profile_pictures/${normalizedAvatar}`;
  console.log('Avatar is filename, defaulting to profile_pictures:', fullUrl);
  return fullUrl;
};

/**
 * Helper function to get contact initials for fallback display
 */
export const getContactInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
};
