// core/marketing/affinity.js
/**
 * Localized affinity tracker. Stores user interests in localStorage
 * to customize storefront layout and scroll anchors.
 */

const STORAGE_KEY = 'sheets_media_affinity';

/**
 * Retrieves the stored user affinity.
 * @returns {Object}
 */
export function getAffinity() {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Failed to parse affinity storage:', e);
    return {};
  }
}

/**
 * Updates the user's affinity parameters.
 * @param {Object} data
 * @param {string} [data.preferredInstrument] e.g., 'guitar', 'piano'
 * @param {string} [data.preferredScale] e.g., 'major', 'dorian'
 * @param {string} [data.preferredChord] e.g., 'C', 'Amin'
 * @param {string} [data.preferredKey] e.g., 'C', 'G', 'D#'
 * @param {string} [data.preferredPage] e.g., '/play/guitar'
 * @param {string} [data.preferredProduct] e.g., 'bundle-C-chords'
 * @param {string} [data.preferredComponent] e.g., 'timeline', 'chord-grid'
 */
export function trackAffinity(data) {
  if (typeof window === 'undefined') return;
  try {
    const current = getAffinity();
    const updated = {
      ...current,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save affinity storage:', e);
  }
}

/**
 * Clears the stored user affinity.
 */
export function clearAffinity() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear affinity storage:', e);
  }
}

/**
 * Applies personalization on mount, such as scrolling to a preferred product block.
 * @param {Function} routerPush - Next.js router.push callback if needed
 */
export function applyStorefrontPersonalization(routerPush) {
  if (typeof window === 'undefined') return;
  
  setTimeout(() => {
    const affinity = getAffinity();
    
    // 1. If user has a preferred product, scroll/anchor redirect to it
    if (affinity.preferredProduct) {
      const targetId = `product-${affinity.preferredProduct}`;
      const element = document.getElementById(targetId);
      if (element) {
        // Apply anchor redirect
        if (window.location.hash !== `#${targetId}`) {
          if (routerPush) {
            routerPush(`#${targetId}`);
          } else {
            window.location.hash = targetId;
          }
        }
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, 200);
}
