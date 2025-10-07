import { useRef, useState, useEffect, useMemo } from 'react';
import { useGridStore } from '@/store/gridStore';
import { GridItem as GridItemType, DragHandle } from '@/types';
import { cn } from '@/lib/utils';
import {
  UnifiedGridConfig,
  UnifiedGridTracks,
  computeUnifiedTracks,
  generateGridTemplates,
  snapItemToGrid,
  mouseToGridPosition,
} from '@/lib/unifiedGridEngine';
import { PerfectGridOverlay } from './PerfectGridOverlay';

export function UnifiedGridCanvas() {
  // Selectors Zustand
  const config = useGridStore((state) => state.config);
  const items = useGridStore((state) => state.items);
  const selectedItemId = useGridStore((state) => state.selectedItemId);
  const selectItem = useGridStore((state) => state.selectItem);
  const updateItem = useGridStore((state) => state.updateItem);
  const saveToHistory = useGridStore((state) => state.saveToHistory);
  const setColumnWidth = useGridStore((state) => state.setColumnWidth);
  const setRowHeight = useGridStore((state) => state.setRowHeight);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<{
    itemId: string;
    handle: DragHandle;
    startX: number;
    startY: number;
    startItem: GridItemType;
  } | null>(null);

  // Configuration unifiée
  const unifiedConfig: UnifiedGridConfig = useMemo(() => {
    // Convertir la largeur du conteneur en pixels
    const containerWidthPx = config.containerWidthUnit === 'px' 
      ? config.containerWidth 
      : 800; // Largeur fixe si en pourcentage
    
    const unified = {
      columns: config.columns,
      rows: config.rows,
      columnWidths: config.columnWidths || Array(config.columns).fill(1),
      rowHeights: config.rowHeights || Array(config.rows).fill(1),
      gapItems: config.gapItems,
      padding: config.paddingUnit === 'px' ? config.padding : config.padding * 16,
      containerWidth: containerWidthPx,
      containerHeight: 600,
    };
    
    
    return unified;
  }, [config, items.length]);

  // Tracks unifiés
  const tracks: UnifiedGridTracks = useMemo(() => 
    computeUnifiedTracks(unifiedConfig), 
    [unifiedConfig]
  );

  // Templates CSS Grid avec dimensions arrondies pour alignement parfait
  const gridTemplates = useMemo(() => {
    const templates = generateGridTemplates(tracks, unifiedConfig.gapItems);
    const cellWidths = tracks.cellWidths.map(width => Math.round(width));
    const cellHeights = tracks.cellHeights.map(height => Math.round(height));
    
    
    return {
      ...templates,
      gridTemplateColumns: cellWidths.map(width => `${width}px`).join(' '),
      gridTemplateRows: cellHeights.map(height => `${height}px`).join(' '),
    };
  }, [tracks, unifiedConfig.gapItems]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, itemId: string, handle: DragHandle) => {
    e.stopPropagation();
    const item = items.find(i => i.id === itemId);
    if (!item || item.locked) return;
    
    selectItem(itemId);
    setDragData({
      itemId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startItem: { ...item },
    });
  };

  useEffect(() => {
    if (!dragData || !containerRef.current) return;

    let hasMoved = false;
    const DRAG_THRESHOLD = 3;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = Math.abs(e.clientX - dragData.startX);
      const deltaY = Math.abs(e.clientY - dragData.startY);
      
      if (!hasMoved && (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD)) {
        hasMoved = true;
        setIsDragging(true);
      }
      
      if (hasMoved && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const { col, row } = mouseToGridPosition(mouseX, mouseY, tracks, unifiedConfig.padding);
        
        const { itemId, handle, startItem } = dragData;
        let newItem = { ...startItem };

        if (handle === 'move') {
          const centerCol = (startItem.startCol + startItem.endCol) / 2;
          const centerRow = (startItem.startRow + startItem.endRow) / 2;
          
          const deltaCol = col - centerCol;
          const deltaRow = row - centerRow;
          
          const width = startItem.endCol - startItem.startCol;
          const height = startItem.endRow - startItem.startRow;
          
          const newStartCol = startItem.startCol + deltaCol;
          const newStartRow = startItem.startRow + deltaRow;
          
          const snapped = {
            col: snapItemToGrid(newStartCol, newStartCol + width, config.columns),
            row: snapItemToGrid(newStartRow, newStartRow + height, config.rows),
          };
          
          newItem.startCol = snapped.col.start;
          newItem.endCol = snapped.col.end;
          newItem.startRow = snapped.row.start;
          newItem.endRow = snapped.row.end;
        } else {
          if (handle.includes('w')) {
            const snapped = snapItemToGrid(col, startItem.endCol, config.columns);
            newItem.startCol = snapped.start;
          }
          if (handle.includes('e')) {
            const snapped = snapItemToGrid(startItem.startCol, col, config.columns);
            newItem.endCol = snapped.end;
          }
          if (handle.includes('n')) {
            const snapped = snapItemToGrid(row, startItem.endRow, config.rows);
            newItem.startRow = snapped.start;
          }
          if (handle.includes('s')) {
            const snapped = snapItemToGrid(startItem.startRow, row, config.rows);
            newItem.endRow = snapped.end;
          }
        }

        updateItem(itemId, newItem);
      }
    };

    const handleMouseUp = () => {
      if (hasMoved) {
        saveToHistory();
      }
      setIsDragging(false);
      setDragData(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragData, tracks, unifiedConfig, config.columns, config.rows, items, updateItem, saveToHistory, selectItem]);

  // Clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItemId) return;
      const item = items.find(i => i.id === selectedItemId);
      if (!item || item.locked) return;

      let updated = false;
      let newItem = { ...item };

      if (!e.shiftKey) {
        if (e.key === 'ArrowLeft' && item.startCol > 1) {
          newItem.startCol--;
          newItem.endCol--;
          updated = true;
        } else if (e.key === 'ArrowRight' && item.endCol <= config.columns) {
          newItem.startCol++;
          newItem.endCol++;
          updated = true;
        } else if (e.key === 'ArrowUp' && item.startRow > 1) {
          newItem.startRow--;
          newItem.endRow--;
          updated = true;
        } else if (e.key === 'ArrowDown' && item.endRow <= config.rows) {
          newItem.startRow++;
          newItem.endRow++;
          updated = true;
        }
      } else {
        if (e.key === 'ArrowLeft' && item.endCol > item.startCol + 1) {
          newItem.endCol--;
          updated = true;
        } else if (e.key === 'ArrowRight' && item.endCol <= config.columns) {
          newItem.endCol++;
          updated = true;
        } else if (e.key === 'ArrowUp' && item.endRow > item.startRow + 1) {
          newItem.endRow--;
          updated = true;
        } else if (e.key === 'ArrowDown' && item.endRow <= config.rows) {
          newItem.endRow++;
          updated = true;
        }
      }

      if (updated) {
        e.preventDefault();
        updateItem(selectedItemId, newItem);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.startsWith('Arrow')) {
        saveToHistory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedItemId, items, config, updateItem, saveToHistory]);

  // Handlers inputs
  const handleColumnChange = (index: number, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 0.25) {
      setColumnWidth(index, parsed);
    }
  };

  const handleRowChange = (index: number, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 0.25) {
      setRowHeight(index, parsed);
    }
  };

  const handleColumnBlur = (index: number, value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0.25) {
      setColumnWidth(index, 1);
    }
  };

  const handleRowBlur = (index: number, value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0.25) {
      setRowHeight(index, 1);
    }
  };

  const padding = `${unifiedConfig.padding}px`;

  // Ajouter un item de test si aucun item n'existe
  const addTestItem = () => {
    const { addItem } = useGridStore.getState();
    addItem({
      name: 'Test Item',
      startCol: 2,
      endCol: 6,
      startRow: 2,
      endRow: 4,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 overflow-auto">
      {items.length === 0 && (
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={addTestItem}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Ajouter un item de test
          </button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {/* HEADER : Inputs colonnes */}
        <div className="flex">
          <div style={{ width: '60px' }} />
          <div
            className="bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-t-lg"
            style={{
              width: `${unifiedConfig.containerWidth}px`,
              boxSizing: 'border-box',
              padding: `${unifiedConfig.padding}px`,
            }}
          >
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: tracks.cellWidths.map(width => `${Math.round(width)}px`).join(' '),
              gap: 0 
            }}>
              {unifiedConfig.columnWidths.map((fr, index) => (
                <div key={index} className="flex flex-col items-center justify-center py-2">
                  <label
                    htmlFor={`col-${index}`}
                    className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1"
                  >
                    {index + 1}
                  </label>
                  <input
                    id={`col-${index}`}
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={fr}
                    onChange={(e) => handleColumnChange(index, e.target.value)}
                    onBlur={(e) => handleColumnBlur(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape' || e.key === 'Enter') e.currentTarget.blur();
                    }}
                    className="w-full h-7 px-1 text-xs text-center font-medium border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* SIDEBAR : Inputs lignes */}
          <div
            className="bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-l-lg"
            style={{
              width: '60px',
              height: `${unifiedConfig.containerHeight}px`,
              boxSizing: 'border-box',
              padding: `${unifiedConfig.padding}px`,
            }}
          >
            <div style={{ 
              display: 'grid', 
              gridTemplateRows: tracks.cellHeights.map(height => `${Math.round(height)}px`).join(' '),
              gap: 0 
            }}>
              {unifiedConfig.rowHeights.map((fr, index) => (
                <div key={index} className="flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                      {index + 1}
                    </span>
                    <input
                      id={`row-${index}`}
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={fr}
                      onChange={(e) => handleRowChange(index, e.target.value)}
                      onBlur={(e) => handleRowBlur(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape' || e.key === 'Enter') e.currentTarget.blur();
                      }}
                      className="w-10 h-full px-1 text-xs text-center font-medium border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SURFACE : Grid unifié */}
          <div
            ref={containerRef}
            className="relative bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
            style={{
              width: `${unifiedConfig.containerWidth}px`,
              height: `${unifiedConfig.containerHeight}px`,
              boxSizing: 'border-box',
              display: 'grid',
              gridTemplateColumns: tracks.cellWidths.map(width => `${Math.round(width)}px`).join(' '),
              gridTemplateRows: tracks.cellHeights.map(height => `${Math.round(height)}px`).join(' '),
              gap: 0, // Pas de gap CSS, on utilise des margins sur les items
              padding,
            }}
            onClick={() => selectItem(null)}
          >
            {/* OVERLAY : Grille parfaite */}
            <PerfectGridOverlay config={unifiedConfig} containerRef={containerRef} />

            {/* ITEMS par-dessus l'overlay */}
            {items.map((item) => (
              <GridItemComponent
                key={item.id}
                item={item}
                isSelected={item.id === selectedItemId}
                onMouseDown={handleMouseDown}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Item
interface GridItemComponentProps {
  item: GridItemType;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, itemId: string, handle: DragHandle) => void;
}

function GridItemComponent({ item, isSelected, onMouseDown }: GridItemComponentProps) {
  const handles: DragHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  const selectItem = useGridStore((state) => state.selectItem);
  const config = useGridStore((state) => state.config);

  // Calculer le span de l'item
  const colSpan = item.endCol - item.startCol;
  const rowSpan = item.endRow - item.startRow;
  const gapItems = config.gapItems;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-md border-2 transition-all',
        'bg-blue-100/70 dark:bg-blue-900/40 backdrop-blur-[2px]',
        isSelected
          ? 'border-blue-500 dark:border-blue-400 shadow-lg ring-2 ring-blue-300 dark:ring-blue-700 !bg-blue-200/80 dark:!bg-blue-800/50 z-20'
          : 'border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-200/80 dark:hover:bg-blue-800/50 z-10',
        item.locked && 'opacity-50 cursor-not-allowed'
      )}
      style={{
        gridColumn: `${item.startCol} / ${item.endCol}`,
        gridRow: `${item.startRow} / ${item.endRow}`,
        cursor: item.locked ? 'not-allowed' : 'move',
        // Réduire la taille et ajouter des margins pour simuler le gap
        width: `calc(100% - ${gapItems}px)`,
        height: `calc(100% - ${gapItems}px)`,
        margin: `${gapItems / 2}px`,
        boxSizing: 'border-box',
      }}
      onClick={(e) => {
        if (!item.locked) {
          e.stopPropagation();
          selectItem(item.id);
        }
      }}
      onMouseDown={(e) => !item.locked && onMouseDown(e, item.id, 'move')}
    >
      <div className="text-center pointer-events-none select-none">
        <div className="font-medium text-slate-700 dark:text-slate-300 text-sm">
          {item.name || 'Item'}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          C: {item.startCol}→{item.endCol} | R: {item.startRow}→{item.endRow}
        </div>
      </div>

      {/* Handles */}
      {isSelected && !item.locked && handles.map((handle) => {
        const positions: Record<DragHandle | 'move', string> = {
          move: '',
          nw: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize',
          n: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize',
          ne: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize',
          e: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-e-resize',
          se: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize',
          s: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize',
          sw: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize',
          w: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-w-resize',
        };

        return (
          <div
            key={handle}
            className={cn(
              'absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-md hover:scale-125 transition-transform',
              positions[handle]
            )}
            style={{ zIndex: 30 }}
            onMouseDown={(e) => onMouseDown(e, item.id, handle)}
          />
        );
      })}
    </div>
  );
}
