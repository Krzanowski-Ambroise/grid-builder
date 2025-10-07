export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export interface GridItem {
  id: string;
  startCol: number;
  endCol: number;
  startRow: number;
  endRow: number;
  name?: string;
  locked?: boolean;
  // Variations par breakpoint
  responsive?: Partial<Record<Breakpoint, {
    startCol: number;
    endCol: number;
    startRow: number;
    endRow: number;
  }>>;
}

export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  gapUnit: 'px' | 'rem';
  gapItems: number; // Gap spécifique pour les items (en px)
  padding: number;
  paddingUnit: 'px' | 'rem';
  containerWidth: number;
  containerWidthUnit: 'px' | '%';
  columnWidths: number[]; // Valeurs en fr pour chaque colonne
  rowHeights: number[]; // Valeurs en fr pour chaque ligne
}

export interface GridState {
  config: GridConfig;
  items: GridItem[];
  selectedItemId: string | null;
  history: {
    past: GridHistoryState[];
    future: GridHistoryState[];
  };
  theme: 'light' | 'dark';
  currentBreakpoint: Breakpoint;
}

export interface GridHistoryState {
  config: GridConfig;
  items: GridItem[];
}

export type DragHandle = 'move' | 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export interface Preset {
  name: string;
  description: string;
  state: Omit<GridState, 'history' | 'theme' | 'selectedItemId'>;
}

