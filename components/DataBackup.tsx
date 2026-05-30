'use client';

import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { exportLocalStorageData, importLocalStorageData, readBackupFile } from '@/lib/utils/exportData';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export function DataBackup() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportLocalStorageData();
    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readBackupFile(file);
      importLocalStorageData(data);
      setImportStatus('success');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus('idle');
        // Recargar la página para aplicar los datos importados
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error al importar:', error);
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border border-[#8E977D]/30 hover:bg-[#8E977D]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <span className="animate-spin text-xs">⏳</span>
              <span>Exportando...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Exportar Datos</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border border-[#8E977D]/30 hover:bg-[#8E977D]/10 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Importar Datos</span>
        </button>
      </div>

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar Backup"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Selecciona un archivo de backup (.json) para importar los datos.
            Esto reemplazará todos los datos actuales del localStorage.
          </p>

          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="w-full p-2 border border-gray-300 rounded-md"
          />

          {importStatus === 'success' && (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <span>✅</span>
              Datos importados correctamente. Recargando...
            </p>
          )}

          {importStatus === 'error' && (
            <p className="text-sm text-red-600 flex items-center gap-2">
              <span>❌</span>
              Error al importar. Verifica que el archivo sea válido.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
