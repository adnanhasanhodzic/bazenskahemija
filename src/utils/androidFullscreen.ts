import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

/**
 * Inicijalizuje Android Fullscreen Immersive Sticky način rada.
 * 
 * - Skriva gornji Android status bar (sat, baterija, mreža)
 * - Omogućava aplikaciji crtanje sadržaja preko cijelog ekrana (edge-to-edge)
 * - Android sistemski navigation bar na dnu je skriven, ali se može pozvati swipe-up gestom
 *   nakon čega se automatski ponovo skriva (Immersive Sticky).
 */
export async function initializeAndroidFullscreen(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    if (Capacitor.isNativePlatform() || Capacitor.getPlatform() === 'android') {
      // 1. Sakrij gornji status bar
      await StatusBar.hide().catch(() => {});
      
      // 2. Postavi da se sadržaj prostire preko cijelog ekrana bez praznih traka
      await StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
    }
  } catch (err) {
    console.debug('StatusBar hide info (native bridge):', err);
  }

  // Re-apply na povratak u aplikaciju (focus / visibilitychange)
  const handleAppActive = async () => {
    try {
      if (Capacitor.isNativePlatform() || Capacitor.getPlatform() === 'android') {
        await StatusBar.hide().catch(() => {});
        await StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
      }
    } catch {}
  };

  window.addEventListener('focus', handleAppActive);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleAppActive();
    }
  });
}
