/**
 * Utilidades para mejorar la experiencia móvil
 */

/**
 * Detecta si el dispositivo es móvil
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
}

/**
 * Previene zoom accidental en inputs en iOS
 */
export function preventZoomOnInput(): void {
  if (typeof document === 'undefined') return;

  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    (input as HTMLElement).style.fontSize = '16px';
  });
}

/**
 * Optimiza el viewport para móviles
 */
export function setupMobileViewport(): void {
  if (typeof document === 'undefined') return;

  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
}

/**
 * Añade soporte para safe areas en iOS
 */
export function setupSafeAreas(): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
  root.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
  root.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
  root.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
}

/**
 * Previene el scroll horizontal accidental
 */
export function preventHorizontalScroll(): void {
  if (typeof window === 'undefined') return;

  let touchStartX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const diffX = touchX - touchStartX;

    // Prevenir scroll horizontal si no es intencional
    if (Math.abs(diffX) > Math.abs(e.touches[0].clientY - (e as any).touchStartY)) {
      // Permitir scroll horizontal en elementos con scroll horizontal
      const target = e.target as HTMLElement;
      if (target && target.scrollWidth > target.clientWidth) {
        return;
      }
    }
  }, { passive: true });
}

/**
 * Configura todas las optimizaciones móviles
 */
export function setupMobileOptimizations(): void {
  if (isMobile()) {
    setupMobileViewport();
    setupSafeAreas();
    preventHorizontalScroll();
    setTimeout(preventZoomOnInput, 100);
  }
}
