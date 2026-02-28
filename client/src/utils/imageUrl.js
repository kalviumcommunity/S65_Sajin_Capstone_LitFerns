/**
 * Utility to resolve image URLs properly.
 * Uses the Vite proxy in dev, or the VITE_API_URL env var in production.
 */
export const getImageUrl = (url, fallbackText = 'Book') => {
    const placeholder = `https://placehold.co/300x450/4f46e5/ffffff?text=${encodeURIComponent(fallbackText)}`;
    if (!url) return placeholder;
    if (url.startsWith('http')) return url;
    // In dev mode, Vite proxy handles /uploads/* -> server
    // In production, VITE_API_URL is used
    const base = import.meta.env.VITE_API_URL || '';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${base}${cleanPath}`;
};
