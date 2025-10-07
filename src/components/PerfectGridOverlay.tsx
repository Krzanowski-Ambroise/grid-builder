import React from 'react';
import { UnifiedGridConfig, computeUnifiedTracks } from '@/lib/unifiedGridEngine';

interface PerfectGridOverlayProps {
  config: UnifiedGridConfig;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function PerfectGridOverlay({ config, containerRef }: PerfectGridOverlayProps) {
  const tracks = computeUnifiedTracks(config);
  
  // Calculer les dimensions exactes de la grille des items
  const padding = config.padding;
  
  // Dimensions exactes de chaque cellule en pixels (arrondies)
  const cellWidths = tracks.cellWidths.map(width => Math.round(width));
  const cellHeights = tracks.cellHeights.map(height => Math.round(height));
  
  // Créer l'overlay avec exactement les mêmes dimensions que la grille des items
  // L'overlay utilise les dimensions de base (sans gap)
  const overlayWidth = cellWidths.reduce((sum, width) => sum + width, 0);
  const overlayHeight = cellHeights.reduce((sum, height) => sum + height, 0);
  
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{ 
        zIndex: 1,
        // Position exacte : même padding que la grille des items
        left: `${padding}px`,
        top: `${padding}px`,
        // Dimensions exactes : même largeur/hauteur que la grille des items
        width: `${overlayWidth}px`,
        height: `${overlayHeight}px`,
        display: 'grid',
        // Templates exactement identiques à la grille des items
        gridTemplateColumns: cellWidths.map(width => `${width}px`).join(' '),
        gridTemplateRows: cellHeights.map(height => `${height}px`).join(' '),
        // Gap = 0 pour des carrés jointifs
        gap: 0,
        // Box-sizing pour alignement parfait
        boxSizing: 'border-box',
      }}
    >
      {/* Carrés jointifs pour chaque cellule */}
      {Array.from({ length: config.columns * config.rows }).map((_, index) => {
        const col = (index % config.columns) + 1;
        const row = Math.floor(index / config.columns) + 1;
        
        return (
          <div
            key={`overlay-${index}`}
            className="border border-slate-200 dark:border-slate-700 bg-transparent"
            style={{
              gridColumn: `${col} / ${col + 1}`,
              gridRow: `${row} / ${row + 1}`,
            }}
          />
        );
      })}
    </div>
  );
}
