import { GridConfig, GridItem } from '@/types';
import { UnifiedGridConfig, computeUnifiedTracks, generateGridTemplates } from './unifiedGridEngine';

/**
 * Convertit la configuration Zustand en configuration unifiée
 */
function convertToUnifiedConfig(config: GridConfig): UnifiedGridConfig {
  return {
    columns: config.columns,
    rows: config.rows,
    columnWidths: config.columnWidths || Array(config.columns).fill(1),
    rowHeights: config.rowHeights || Array(config.rows).fill(1),
    gapItems: config.gapItems,
    padding: config.paddingUnit === 'px' ? config.padding : config.padding * 16,
    containerWidth: config.containerWidthUnit === 'px' ? config.containerWidth : 800,
    containerHeight: 600,
  };
}

export function generateUnifiedHTML(items: GridItem[], useClasses: boolean = true): string {
  const itemsHTML = items.map((item, index) => {
    const className = useClasses ? `grid-item item-${index + 1}` : '';
    const style = !useClasses ? ` style="grid-column: ${item.startCol} / ${item.endCol}; grid-row: ${item.startRow} / ${item.endRow};"` : '';
    const name = item.name || `Item ${index + 1}`;
    return `    <div class="${className}"${style}>${name}</div>`;
  }).join('\n');

  return `<div class="grid-container">\n${itemsHTML}\n</div>`;
}

export function generateUnifiedCSS(config: GridConfig, items: GridItem[]): string {
  const unifiedConfig = convertToUnifiedConfig(config);
  const tracks = computeUnifiedTracks(unifiedConfig);
  const gridTemplates = generateGridTemplates(tracks, unifiedConfig.gapItems);
  
  const padding = `${config.padding}${config.paddingUnit}`;
  const width = `${config.containerWidth}${config.containerWidthUnit}`;
  
  let css = `.grid-container {
  display: grid;
  grid-template-columns: ${gridTemplates.gridTemplateColumns};
  grid-template-rows: ${gridTemplates.gridTemplateRows};
  gap: 0; /* Gap géré avec des margins sur les items */
  padding: ${padding};
  width: ${width};
  min-height: 400px;
}\n\n`;

  items.forEach((item, index) => {
    css += `.grid-item.item-${index + 1} {
  grid-column: ${item.startCol} / ${item.endCol};
  grid-row: ${item.startRow} / ${item.endRow};
  width: calc(100% - ${config.gapItems}px);
  height: calc(100% - ${config.gapItems}px);
  margin: ${config.gapItems / 2}px; /* Gap visuel avec margins */
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 1rem;
  box-sizing: border-box;
}\n\n`;
  });

  return css.trim();
}

export function generateUnifiedTailwindClasses(config: GridConfig, items: GridItem[]): string {
  const unifiedConfig = convertToUnifiedConfig(config);
  const tracks = computeUnifiedTracks(unifiedConfig);
  
  // Générer les classes Tailwind avec les dimensions exactes
  const gridCols = tracks.cellWidths.map(width => `${width}px`).join(' ');
  const gridRows = tracks.cellHeights.map(height => `${height}px`).join(' ');
  
  const gap = `gap-[${config.gapItems}px]`;
  const padding = config.paddingUnit === 'px' ? `p-[${config.padding}px]` : `p-[${config.padding}rem]`;
  const width = config.containerWidthUnit === '%' ? `w-[${config.containerWidth}%]` : `w-[${config.containerWidth}px]`;

  let html = `<div class="grid grid-cols-[${gridCols}] grid-rows-[${gridRows}] gap-0 ${padding} ${width} min-h-[400px]">\n`;

  items.forEach((item) => {
    const colStart = `col-start-${item.startCol}`;
    const colEnd = `col-end-${item.endCol}`;
    const rowStart = `row-start-${item.startRow}`;
    const rowEnd = `row-end-${item.endRow}`;
    const name = item.name || 'Item';
    
    html += `  <div class="${colStart} ${colEnd} ${rowStart} ${rowEnd} w-[calc(100%-${config.gapItems}px)] h-[calc(100%-${config.gapItems}px)] m-[${config.gapItems / 2}px] bg-slate-200 border border-slate-300 rounded p-4 box-border">${name}</div>\n`;
  });

  html += `</div>`;
  
  return html;
}

export function generateUnifiedFullHTMLFile(config: GridConfig, items: GridItem[]): string {
  const html = generateUnifiedHTML(items, true);
  const css = generateUnifiedCSS(config, items);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Grid Layout</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      background: #f8fafc;
    }
    
${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

