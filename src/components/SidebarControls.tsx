import { useGridStore } from '@/store/gridStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Slider } from './ui/Slider';
import { Select } from './ui/Select';
import { Plus, Trash2, Copy, Lock, Unlock, RotateCcw } from 'lucide-react';
import { Breakpoint } from '@/types';

export function SidebarControls() {
  const {
    config,
    items,
    selectedItemId,
    setConfig,
    addItem,
    deleteItem,
    duplicateItem,
    updateItem,
    currentBreakpoint,
    setCurrentBreakpoint,
    resetColumnWidths,
    resetRowHeights,
  } = useGridStore();

  const selectedItem = items.find(i => i.id === selectedItemId);

  const breakpoints: { value: Breakpoint; label: string }[] = [
    { value: 'base', label: 'Base' },
    { value: 'sm', label: 'SM (640px)' },
    { value: 'md', label: 'MD (768px)' },
    { value: 'lg', label: 'LG (1024px)' },
    { value: 'xl', label: 'XL (1280px)' },
  ];

  return (
    <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Configuration de la grille */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Configuration Grille
            </h2>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={resetColumnWidths}
                title="Réinitialiser les largeurs de colonnes à 1fr"
              >
                <RotateCcw size={14} className="mr-1" />
                Cols
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetRowHeights}
                title="Réinitialiser les hauteurs de lignes à 1fr"
              >
                <RotateCcw size={14} className="mr-1" />
                Rows
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <Slider
              label="Colonnes"
              min={1}
              max={24}
              value={config.columns}
              onChange={(e) => setConfig({ columns: parseInt(e.target.value) })}
            />
            
            <Slider
              label="Lignes"
              min={1}
              max={24}
              value={config.rows}
              onChange={(e) => setConfig({ rows: parseInt(e.target.value) })}
            />
            
            <div className="flex gap-2">
              <Input
                label="Gap"
                type="number"
                min={0}
                max={100}
                step={config.gapUnit === 'rem' ? 0.25 : 1}
                value={config.gap}
                onChange={(e) => setConfig({ gap: parseFloat(e.target.value) || 0 })}
                className="flex-1"
              />
              <Select
                label="Unité"
                value={config.gapUnit}
                onChange={(e) => {
                  const newUnit = e.target.value as 'px' | 'rem';
                  const oldUnit = config.gapUnit;
                  let newGap = config.gap;
                  
                  // Conversion automatique
                  if (oldUnit === 'px' && newUnit === 'rem') {
                    newGap = config.gap / 16; // px → rem
                  } else if (oldUnit === 'rem' && newUnit === 'px') {
                    newGap = config.gap * 16; // rem → px
                  }
                  
                  setConfig({ gapUnit: newUnit, gap: Math.round(newGap * 100) / 100 });
                }}
                className="w-20"
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
              </Select>
            </div>
            
            <Input
              label="Gap items"
              type="number"
              min={0}
              max={50}
              step={1}
              value={config.gapItems}
              onChange={(e) => setConfig({ gapItems: parseFloat(e.target.value) || 0 })}
              className="w-full"
              placeholder="Espacement entre items"
            />
            
            <div className="flex gap-2">
              <Input
                label="Largeur"
                type="number"
                min={1}
                max={2000}
                value={config.containerWidth}
                onChange={(e) => setConfig({ containerWidth: parseFloat(e.target.value) || 100 })}
                className="flex-1"
              />
              <Select
                label="Unité"
                value={config.containerWidthUnit}
                onChange={(e) => setConfig({ containerWidthUnit: e.target.value as 'px' | '%' })}
                className="w-20"
              >
                <option value="px">px</option>
                <option value="%">%</option>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setConfig({ containerWidth: 360, containerWidthUnit: 'px' })}
              >
                360px
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setConfig({ containerWidth: 768, containerWidthUnit: 'px' })}
              >
                768px
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setConfig({ containerWidth: 1024, containerWidthUnit: 'px' })}
              >
                1024px
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setConfig({ containerWidth: 1280, containerWidthUnit: 'px' })}
              >
                1280px
              </Button>
            </div>
          </div>
        </section>

        {/* Breakpoints */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
            Breakpoint
          </h2>
          <Select
            value={currentBreakpoint}
            onChange={(e) => setCurrentBreakpoint(e.target.value as Breakpoint)}
          >
            {breakpoints.map(bp => (
              <option key={bp.value} value={bp.value}>{bp.label}</option>
            ))}
          </Select>
          {currentBreakpoint !== 'base' && selectedItem && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Mode responsive : modifiez l'item pour créer une variation à ce breakpoint
            </p>
          )}
        </section>

        {/* Gestion des items */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Items ({items.length})
            </h2>
            <Button size="sm" onClick={() => addItem()}>
              <Plus size={16} className="mr-1" />
              Ajouter
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`p-3 rounded border ${
                  item.id === selectedItemId
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                } transition-colors cursor-pointer`}
                onClick={() => useGridStore.getState().selectItem(item.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                    {item.name || `Item ${index + 1}`}
                  </span>
                  <div className="flex gap-1">
                    <button
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItem(item.id, { locked: !item.locked });
                      }}
                      title={item.locked ? 'Déverrouiller' : 'Verrouiller'}
                    >
                      {item.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                    <button
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateItem(item.id);
                      }}
                      title="Dupliquer"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Col: {item.startCol}→{item.endCol} | Row: {item.startRow}→{item.endRow}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Édition item sélectionné */}
        {selectedItem && (
          <section className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Éditer l'item
            </h2>
            
            <div className="space-y-4">
              <Input
                label="Nom"
                value={selectedItem.name || ''}
                onChange={(e) => updateItem(selectedItem.id, { name: e.target.value })}
                placeholder="Item sans nom"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Col Début"
                  type="number"
                  min={1}
                  max={config.columns}
                  value={selectedItem.startCol}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val < selectedItem.endCol) {
                      updateItem(selectedItem.id, { startCol: val });
                    }
                  }}
                />
                <Input
                  label="Col Fin"
                  type="number"
                  min={selectedItem.startCol + 1}
                  max={config.columns + 1}
                  value={selectedItem.endCol}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > selectedItem.startCol) {
                      updateItem(selectedItem.id, { endCol: val });
                    }
                  }}
                />
                <Input
                  label="Row Début"
                  type="number"
                  min={1}
                  max={config.rows}
                  value={selectedItem.startRow}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val < selectedItem.endRow) {
                      updateItem(selectedItem.id, { startRow: val });
                    }
                  }}
                />
                <Input
                  label="Row Fin"
                  type="number"
                  min={selectedItem.startRow + 1}
                  max={config.rows + 1}
                  value={selectedItem.endRow}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > selectedItem.startRow) {
                      updateItem(selectedItem.id, { endRow: val });
                    }
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

