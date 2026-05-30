/**
 * Utilidades seguras para localStorage con manejo de errores
 */

export class StorageError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Guarda datos en localStorage con manejo de errores
 */
export function saveToLocalStorage<T>(key: string, data: T): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'QuotaExceededError':
          console.error(`LocalStorage quota exceeded for key "${key}"`);
          throw new StorageError(`No hay suficiente espacio en localStorage para "${key}"`, error);
        default:
          console.error(`DOMException accessing localStorage for key "${key}":`, error);
          throw new StorageError(`Error al acceder a localStorage para "${key}"`, error);
      }
    } else {
      console.error(`Unexpected error saving to localStorage for key "${key}":`, error);
      throw new StorageError(`Error inesperado al guardar "${key}"`, error as Error);
    }
  }
}

/**
 * Carga datos desde localStorage con manejo de errores
 */
export function loadFromLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) {
      return defaultValue ?? null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`Invalid JSON in localStorage for key "${key}"`);
      // Remove corrupted data
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        console.error(`Failed to remove corrupted data for key "${key}":`, removeError);
      }
      return defaultValue ?? null;
    } else if (error instanceof DOMException) {
      console.error(`DOMException accessing localStorage for key "${key}":`, error);
      return defaultValue ?? null;
    } else {
      console.error(`Unexpected error loading from localStorage for key "${key}":`, error);
      return defaultValue ?? null;
    }
  }
}

/**
 * Elimina datos desde localStorage con manejo de errores
 */
export function removeFromLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing "${key}" from localStorage:`, error);
    return false;
  }
}

/**
 * Verifica si localStorage está disponible
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('LocalStorage is not available:', error);
    return false;
  }
}

/**
 * Obtiene el espacio usado en localStorage (en bytes)
 */
export function getLocalStorageUsage(): { used: number; total: number } {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    // La mayoría de navegadores tienen 5-10MB de límite
    return { used: total, total: 5 * 1024 * 1024 }; // Asumimos 5MB
  } catch (error) {
    console.error('Error calculating localStorage usage:', error);
    return { used: 0, total: 5 * 1024 * 1024 };
  }
}

/**
 * Limpia todos los datos de la aplicación de localStorage
 */
export function clearAppData(): boolean {
  try {
    const keysToRemove = Object.keys(localStorage).filter(key =>
      key.startsWith('amere-') ||
      key.startsWith('quotations') ||
      key.startsWith('quotation')
    );

    keysToRemove.forEach(key => localStorage.removeItem(key));

    console.log(`Cleared ${keysToRemove.length} keys from localStorage`);
    return true;
  } catch (error) {
    console.error('Error clearing app data from localStorage:', error);
    return false;
  }
}
