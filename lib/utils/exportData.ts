/**
 * Exporta todos los datos del localStorage a un archivo JSON
 * Útil para backup o migración de datos
 */
export function exportLocalStorageData(): void {
  const data: Record<string, any> = {};

  // Obtener todas las claves del localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value; // Si no es JSON, guardar como string
        }
      }
    }
  }

  // Crear blob y descargar
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `amare-decor-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Importa datos desde un archivo JSON al localStorage
 */
export function importLocalStorageData(jsonData: Record<string, any>): void {
  Object.entries(jsonData).forEach(([key, value]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      localStorage.setItem(key, String(value));
    }
  });
}

/**
 * Lee un archivo JSON y retorna los datos
 */
export function readBackupFile(file: File): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Archivo JSON inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsText(file);
  });
}
