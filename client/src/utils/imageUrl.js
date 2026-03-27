/**
 * Utility to resolve image URLs properly.
 * Uses the Vite proxy in dev, or the VITE_API_URL env var in production.
 */
export const getImageUrl = (url, fallbackText = 'Book') => {
    const placeholder = `https://placehold.co/300x450/4f46e5/ffffff?text=${encodeURIComponent(fallbackText)}`;
    if (!url) return placeholder;
    // Handle data URLs (from file picker previews)
    if (url.startsWith('data:')) return url;
    // Handle absolute HTTP/HTTPS URLs
    if (url.startsWith('http')) return url;
    // Handle relative paths - use API base URL
    const base = import.meta.env.VITE_API_URL || '';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${base}${cleanPath}`;
};
