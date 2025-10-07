/**
 * Unified Grid Engine - Système de grille unifié pour alignement pixel-perfect
 * 
 * Ce moteur garantit que :
 * - L'overlay (grille visible)
 * - Le placement des items (CSS Grid)
 * - Le snapping des items
 * - Les repères visuels
 * 
 * Utilisent tous exactement les mêmes calculs et dimensions.
 */

export interface UnifiedGridConfig {
  columns: number;
  rows: number;
  columnWidths: number[]; // Valeurs en fr
  rowHeights: number[];   // Valeurs en fr
  gapItems: number;       // Gap entre items (px)
  padding: number;        // Padding du conteneur (px)
  containerWidth: number; // Largeur du conteneur (px)
  containerHeight: number; // Hauteur du conteneur (px)
}

export interface UnifiedGridTracks {
  // Dimensions des cellules en pixels
  cellWidths: number[];
  cellHeights: number[];
  
  // Positions des lignes de grille (pour overlay et snapping)
  columnLines: number[]; // [0, cell1Width, cell1Width+cell2Width, ...]
  rowLines: number[];    // [0, cell1Height, cell1Height+cell2Height, ...]
  
  // Dimensions totales
  totalWidth: number;   // Largeur totale sans padding
  totalHeight: number;  // Hauteur totale sans padding
}

/**
 * Calcule les tracks unifiés pour tous les composants
 * @param config Configuration de la grille
 * @returns Tracks unifiés utilisés partout
 */
export function computeUnifiedTracks(config: UnifiedGridConfig): UnifiedGridTracks {
  const { columns, rows, columnWidths, rowHeights, padding, containerWidth, containerHeight } = config;
  
  // Espace disponible pour la grille (sans padding)
  const availableWidth = containerWidth - (2 * padding);
  const availableHeight = containerHeight - (2 * padding);
  
  // Calculer les largeurs des cellules en pixels
  const totalFrWidth = columnWidths.reduce((sum, fr) => sum + fr, 0);
  const cellWidths = columnWidths.map(fr => (fr / totalFrWidth) * availableWidth);
  
  // Calculer les hauteurs des cellules en pixels
  const totalFrHeight = rowHeights.reduce((sum, fr) => sum + fr, 0);
  const cellHeights = rowHeights.map(fr => (fr / totalFrHeight) * availableHeight);
  
  
  // Calculer les positions des lignes de grille
  const columnLines: number[] = [0];
  let cumulativeWidth = 0;
  for (const width of cellWidths) {
    cumulativeWidth += width;
    columnLines.push(cumulativeWidth);
  }
  
  const rowLines: number[] = [0];
  let cumulativeHeight = 0;
  for (const height of cellHeights) {
    cumulativeHeight += height;
    rowLines.push(cumulativeHeight);
  }
  
  return {
    cellWidths,
    cellHeights,
    columnLines,
    rowLines,
    totalWidth: availableWidth,
    totalHeight: availableHeight,
  };
}

/**
 * Convertit une position pixel en index de ligne de grille
 * @param position Position en pixels (0 = début du conteneur)
 * @param lines Positions des lignes de grille
 * @returns Index de la ligne la plus proche (0 à n)
 */
export function pixelToGridLine(position: number, lines: number[]): number {
  // Trouver la ligne la plus proche
  let closestIndex = 0;
  let minDistance = Math.abs(position - lines[0]);
  
  for (let i = 1; i < lines.length; i++) {
    const distance = Math.abs(position - lines[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }
  
  return closestIndex;
}

/**
 * Génère les templates CSS Grid avec les dimensions exactes
 * @param tracks Tracks unifiés
 * @param gapItems Gap entre items en pixels
 * @returns Objet avec les templates CSS
 */
export function generateGridTemplates(tracks: UnifiedGridTracks, gapItems: number) {
  const { cellWidths, cellHeights } = tracks;
  
  return {
    gridTemplateColumns: cellWidths.map(width => `${width}px`).join(' '),
    gridTemplateRows: cellHeights.map(height => `${height}px`).join(' '),
    gap: `${gapItems}px`,
  };
}

/**
 * Snap un item sur la grille
 * @param startLine Ligne de départ souhaitée
 * @param endLine Ligne de fin souhaitée
 * @param maxLines Nombre maximum de lignes
 * @returns Lignes snappées avec span minimum de 1
 */
export function snapItemToGrid(
  startLine: number,
  endLine: number,
  maxLines: number
): { start: number; end: number } {
  // Clamper les valeurs dans les limites
  const start = Math.max(1, Math.min(Math.round(startLine), maxLines));
  const end = Math.max(start + 1, Math.min(Math.round(endLine), maxLines + 1));
  
  return { start, end };
}

/**
 * Convertit une position de souris en position de grille
 * @param mouseX Position X de la souris (relative au conteneur)
 * @param mouseY Position Y de la souris (relative au conteneur)
 * @param tracks Tracks unifiés
 * @param padding Padding du conteneur
 * @returns Position en coordonnées de grille
 */
export function mouseToGridPosition(
  mouseX: number,
  mouseY: number,
  tracks: UnifiedGridTracks,
  padding: number
): { col: number; row: number } {
  // Soustraire le padding pour obtenir la position relative à la grille
  const gridX = mouseX - padding;
  const gridY = mouseY - padding;
  
  // Convertir en indices de grille
  const col = pixelToGridLine(gridX, tracks.columnLines);
  const row = pixelToGridLine(gridY, tracks.rowLines);
  
  return { col, row };
}

/**
 * Valide que les calculs sont corrects
 * @param tracks Tracks à valider
 * @param config Configuration originale
 * @returns true si les calculs sont valides
 */
export function validateUnifiedTracks(tracks: UnifiedGridTracks, config: UnifiedGridConfig): boolean {
  const { columns, rows, padding, containerWidth, containerHeight } = config;
  const { cellWidths, cellHeights, columnLines, rowLines, totalWidth, totalHeight } = tracks;
  
  // Vérifier les dimensions
  if (cellWidths.length !== columns) return false;
  if (cellHeights.length !== rows) return false;
  if (columnLines.length !== columns + 1) return false;
  if (rowLines.length !== rows + 1) return false;
  
  // Vérifier que la somme des cellules correspond aux dimensions totales
  const sumWidths = cellWidths.reduce((sum, w) => sum + w, 0);
  const sumHeights = cellHeights.reduce((sum, h) => sum + h, 0);
  
  const tolerance = 1; // Tolérance de 1px pour les erreurs d'arrondi
  
  return (
    Math.abs(sumWidths - totalWidth) <= tolerance &&
    Math.abs(sumHeights - totalHeight) <= tolerance &&
    Math.abs(totalWidth - (containerWidth - 2 * padding)) <= tolerance &&
    Math.abs(totalHeight - (containerHeight - 2 * padding)) <= tolerance
  );
}
