'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Package, Box } from 'lucide-react';
import { QuotationItem, QuotationCosts, QuotationConfig, Material } from '@/types/quotation';

interface ElementsStepProps {
  items: QuotationItem[];
  costs: QuotationCosts;
  config: QuotationConfig;
  onItemsChange: (items: QuotationItem[]) => void;
  onCostsChange: (costs: QuotationCosts) => void;
  onConfigChange: (config: QuotationConfig) => void;
}

const itemTypes: { type: QuotationItem['type']; name: string; emoji: string }[] = [
  { type: 'arcos-globos', name: 'Arcos de Globos', emoji: '🎈' },
  { type: 'paneles', name: 'Paneles', emoji: '🔲' },
  { type: 'cilindros', name: 'Cilindros', emoji: '🔘' },
  { type: 'neones', name: 'Neones', emoji: '💡' },
  { type: 'flores', name: 'Flores', emoji: '🌸' },
  { type: 'mesas', name: 'Mesas', emoji: '🪑' },
  { type: 'backdrops', name: 'Backdrops', emoji: '🖼️' },
  { type: 'globos-personalizados', name: 'Globos Personalizados', emoji: '✏️' },
  { type: 'cortinas', name: 'Cortinas', emoji: '🪟' },
  { type: 'estructuras', name: 'Estructuras', emoji: '🏗️' }
];

const defaultItems: Record<QuotationItem['type'], { unitCost: number; laborCost: number; category: string }> = {
  'arcos-globos': { unitCost: 2500, laborCost: 800, category: 'Arcos' },
  'paneles': { unitCost: 1800, laborCost: 600, category: 'Paneles' },
  'cilindros': { unitCost: 400, laborCost: 150, category: 'Cilindros' },
  'neones': { unitCost: 1200, laborCost: 300, category: 'Iluminación' },
  'flores': { unitCost: 150, laborCost: 50, category: 'Flores' },
  'mesas': { unitCost: 450, laborCost: 150, category: 'Mesas' },
  'backdrops': { unitCost: 2000, laborCost: 500, category: 'Backdrops' },
  'globos-personalizados': { unitCost: 80, laborCost: 30, category: 'Globos' },
  'cortinas': { unitCost: 1500, laborCost: 400, category: 'Textiles' },
  'estructuras': { unitCost: 3000, laborCost: 1000, category: 'Estructuras' }
};

export default function ElementsStep({
  items,
  costs,
  config,
  onItemsChange,
  onCostsChange,
  onConfigChange
}: ElementsStepProps) {

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [selectedType, setSelectedType] = useState<QuotationItem['type'] | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<QuotationConfig>(config);
  const [newMaterial, setNewMaterial] = useState<Material>({
    id: '',
    name: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    unit: 'pzas'
  });

  const calculateTotalCosts = () => {
    const materials = items.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);
    const labor = items.reduce((sum, item) => sum + (item.laborCost * item.quantity), 0);

    const rentals = materials * (config.rentalPercentage / 100);
    const transport = config.transportCost;
    const extras = (materials + labor) * (config.extrasPercentage / 100);

    const subtotal = materials + labor + transport + rentals + extras;
    const profitMargin = subtotal * (config.profitMargin / 100);
    const total = subtotal + profitMargin;

    return {
      materials,
      labor,
      transport,
      rentals,
      extras,
      subtotal,
      profitMargin,
      profitPercentage: config.profitMargin,
      total
    };
  };

  useEffect(() => {
    const newCosts = calculateTotalCosts();
    onCostsChange(newCosts);
  }, [items, config]);

  const addItem = (type: QuotationItem['type']) => {
    const defaults = defaultItems[type];
    const newItem: QuotationItem = {
      id: `item-${Date.now()}`,
      type,
      name: itemTypes.find(t => t.type === type)?.name || 'Elemento',
      quantity: 1,
      unitCost: defaults.unitCost,
      laborCost: defaults.laborCost,
      totalCost: defaults.unitCost + defaults.laborCost,
      category: defaults.category,
      materials: []
    };

    onItemsChange([...items, newItem]);
    setShowAddModal(false);
  };

  const addMaterialToItem = (itemId: string) => {
    if (!newMaterial.name || newMaterial.quantity <= 0 || newMaterial.unitPrice <= 0) {
      alert('Por favor completa todos los campos del material');
      return;
    }

    const materialTotal = newMaterial.quantity * newMaterial.unitPrice;
    const material: Material = {
      ...newMaterial,
      id: `material-${Date.now()}`,
      totalPrice: materialTotal
    };

    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const materials = item.materials || [];
        const newMaterials = [...materials, material];
        const materialsTotal = newMaterials.reduce((sum, m) => sum + m.totalPrice, 0);

        return {
          ...item,
          materials: newMaterials,
          unitCost: materialsTotal,
          totalCost: materialsTotal + item.laborCost
        };
      }
      return item;
    });

    onItemsChange(updatedItems);
    setNewMaterial({
      id: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      unit: 'pzas'
    });
    setShowMaterialsModal(false);
  };

  const removeMaterialFromItem = (itemId: string, materialId: string) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const materials = (item.materials || []).filter(m => m.id !== materialId);
        const materialsTotal = materials.reduce((sum, m) => sum + m.totalPrice, 0);

        return {
          ...item,
          materials,
          unitCost: materialsTotal,
          totalCost: materialsTotal + item.laborCost
        };
      }
      return item;
    });

    onItemsChange(updatedItems);
  };

  const openMaterialsModal = (itemId: string) => {
    setEditingItemId(itemId);
    setShowMaterialsModal(true);
  };

  const removeItem = (itemId: string) => {
    onItemsChange(items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: keyof QuotationItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitCost' || field === 'laborCost') {
          updated.totalCost = (updated.unitCost * updated.quantity) + (updated.laborCost * updated.quantity);
        }
        return updated;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  const saveConfig = () => {
    onConfigChange(editingConfig);
    setShowConfigModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gray-800 mb-2">Elementos de Decoración</h2>
        <p className="text-gray-600 mb-2">Agrega los elementos que necesitas para tu evento</p>
        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg inline-block">
          💡 Consejo: Puedes agregar materiales específicos (ej: 3 bolsas de globos a $5.50) usando el botón "Materiales"
        </p>
      </div>

      {/* Botón para agregar elementos */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#8E977D] hover:bg-[#6B7A5C] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition shadow-md"
          >
            <Plus size={20} />
            Agregar Elemento
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Usa el botón "Materiales" para agregar costos específicos
        </div>

        <button
          onClick={() => setShowConfigModal(true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-2 transition"
        >
          <Calculator size={20} />
          Configurar Costos
        </button>
      </div>

      {/* Lista de elementos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-lg font-medium text-gray-700 mb-2">¡Comencemos con tu decoración!</p>
            <p className="text-sm text-gray-600 mb-4">Agrega los elementos que necesitas para tu evento</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#8E977D] hover:bg-[#6B7A5C] text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition"
            >
              <Plus size={18} />
              Agregar Primer Elemento
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Elemento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo Unitario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mano de Obra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#8E977D]"
                      min="1"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative mb-2">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={item.unitCost}
                        onChange={(e) => updateItem(item.id, 'unitCost', parseInt(e.target.value) || 0)}
                        className="w-28 pl-6 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#8E977D]"
                      />
                    </div>
                    {(item.materials && item.materials.length > 0) && (
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-medium text-gray-700">Materiales:</p>
                        {item.materials.map((material) => (
                          <div key={material.id} className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded">
                            <span className="text-gray-700">{material.quantity} {material.unit} {material.name}</span>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-blue-600">${material.totalPrice.toFixed(2)}</span>
                              <button
                                onClick={() => removeMaterialFromItem(item.id, material.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={item.laborCost}
                        onChange={(e) => updateItem(item.id, 'laborCost', parseInt(e.target.value) || 0)}
                        className="w-28 pl-6 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#8E977D]"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.totalCost.toLocaleString('es-MX')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openMaterialsModal(item.id)}
                        className="text-blue-500 hover:text-blue-700 transition flex items-center gap-1"
                        title="Agregar materiales específicos"
                      >
                        <Box size={18} />
                        <span className="text-xs">Materiales</span>
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Eliminar elemento"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resumen de costos */}
      <div className="bg-gradient-to-r from-[#F0EDE5] to-[#E8E4DC] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Costos</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Materiales:</span>
            <span className="font-medium">${costs.materials.toLocaleString('es-MX')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Mano de obra:</span>
            <span className="font-medium">${costs.labor.toLocaleString('es-MX')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transporte:</span>
            <span className="font-medium">${costs.transport.toLocaleString('es-MX')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Alquileres:</span>
            <span className="font-medium">${costs.rentals.toLocaleString('es-MX')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Extras:</span>
            <span className="font-medium">${costs.extras.toLocaleString('es-MX')}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-medium text-gray-700">Subtotal:</span>
            <span className="font-bold">${costs.subtotal.toLocaleString('es-MX')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Margen de ganancia ({config.profitMargin}%):</span>
            <span className="font-medium text-green-600">${costs.profitMargin.toLocaleString('es-MX')}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">TOTAL:</span>
            <span className="text-2xl font-bold text-pink-600">${costs.total.toLocaleString('es-MX')}</span>
          </div>
        </div>
      </div>

      {/* Modal para agregar elementos */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-2">¿Qué elemento deseas agregar?</h3>
            <p className="text-sm text-gray-600 mb-4">Selecciona el tipo de elemento decorativo que necesitas para tu evento</p>
            <div className="grid grid-cols-2 gap-4">
              {itemTypes.map((itemType) => (
                <button
                  key={itemType.type}
                  onClick={() => addItem(itemType.type)}
                  className="p-4 border rounded-lg hover:border-pink-500 hover:bg-pink-50 transition text-left"
                >
                  <span className="text-3xl mr-2">{itemType.emoji}</span>
                  <span className="font-medium">{itemType.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal para configurar costos */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-2">Configurar Costos del Sistema</h3>
            <p className="text-sm text-gray-600 mb-4">Ajusta los porcentajes y costos base para calcular tus cotizaciones</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margen de Ganancia (%)
                </label>
                <input
                  type="number"
                  value={editingConfig.profitMargin}
                  onChange={(e) => setEditingConfig({ ...editingConfig, profitMargin: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo de Transporte ($)
                </label>
                <input
                  type="number"
                  value={editingConfig.transportCost}
                  onChange={(e) => setEditingConfig({ ...editingConfig, transportCost: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje de Alquileres (%)
                </label>
                <input
                  type="number"
                  value={editingConfig.rentalPercentage}
                  onChange={(e) => setEditingConfig({ ...editingConfig, rentalPercentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje de Extras (%)
                </label>
                <input
                  type="number"
                  value={editingConfig.extrasPercentage}
                  onChange={(e) => setEditingConfig({ ...editingConfig, extrasPercentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D]"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={saveConfig}
                className="flex-1 bg-[#8E977D] hover:bg-[#6B7A5C] text-white py-2 rounded-lg transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar materiales específicos */}
      {showMaterialsModal && editingItemId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Agregar Material Específico</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ejemplo: 3 bolsas de globos a $5.50 c/u = $16.50 total
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Material
                </label>
                <input
                  type="text"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D]"
                  placeholder="Ej: Globos, Brillos, Flores..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D]"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad
                  </label>
                  <select
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D]"
                  >
                    <option value="pzas">Piezas</option>
                    <option value="bolsas">Bolsas</option>
                    <option value="latas">Latas</option>
                    <option value="metros">Metros</option>
                    <option value="kg">Kilogramos</option>
                    <option value="litros">Litros</option>
                    <option value="cajas">Cajas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Unitario ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    value={newMaterial.unitPrice}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D]"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {newMaterial.quantity > 0 && newMaterial.unitPrice > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total del material:</p>
                  <p className="text-xl font-bold text-blue-600">
                    ${(newMaterial.quantity * newMaterial.unitPrice).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {newMaterial.quantity} {newMaterial.unit} × ${newMaterial.unitPrice.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => addMaterialToItem(editingItemId)}
                className="flex-1 bg-[#8E977D] hover:bg-[#6B7A5C] text-white py-2 rounded-lg transition"
              >
                Agregar Material
              </button>
              <button
                onClick={() => {
                  setShowMaterialsModal(false);
                  setNewMaterial({
                    id: '',
                    name: '',
                    quantity: 1,
                    unitPrice: 0,
                    totalPrice: 0,
                    unit: 'pzas'
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}