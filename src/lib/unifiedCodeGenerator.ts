import { GridConfig, GridItem } from '@/types';

export function generateHTML(items: GridItem[]): string {
  const itemsHTML = items.map((item, index) => {
    const name = item.name || `Item ${index + 1}`;
    return `  <div class="item-${index + 1}">${name}</div>`;
  }).join('\n');

  return `<div class="grid-container">\n${itemsHTML}\n</div>`;
}

export function generateCSS(config: GridConfig, items: GridItem[]): string {
  // Créer les templates de grille simples
  const cols = config.columnWidths?.map(fr => `${fr}fr`) || Array(config.columns).fill('1fr');
  const rows = config.rowHeights?.map(fr => `${fr}fr`) || Array(config.rows).fill('1fr');
  
  const padding = `${config.padding}${config.paddingUnit}`;
  const width = `${config.containerWidth}${config.containerWidthUnit}`;
  
  let css = `.grid-container {
  display: grid;
  grid-template-columns: ${cols.join(' ')};
  grid-template-rows: ${rows.join(' ')};
  gap: ${config.gapItems}px;
  padding: ${padding};
  width: ${width};
  min-height: 400px;
}

`;

  items.forEach((item, index) => {
    css += `.item-${index + 1} {
  grid-column: ${item.startCol} / ${item.endCol};
  grid-row: ${item.startRow} / ${item.endRow};
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 1rem;
}

`;
  });

  return css.trim();
}

export function generateTailwind(config: GridConfig, items: GridItem[]): string {
  const cols = config.columnWidths?.map(fr => `${fr}fr`) || Array(config.columns).fill('1fr');
  const rows = config.rowHeights?.map(fr => `${fr}fr`) || Array(config.rows).fill('1fr');
  
  const padding = config.paddingUnit === 'px' ? `p-[${config.padding}px]` : `p-[${config.padding}rem]`;
  const width = config.containerWidthUnit === '%' ? `w-[${config.containerWidth}%]` : `w-[${config.containerWidth}px]`;

  let html = `<div class="grid gap-[${config.gapItems}px] ${padding} ${width} min-h-[400px]">\n`;

  items.forEach((item, index) => {
    const name = item.name || `Item ${index + 1}`;
    html += `  <div class="bg-slate-200 border border-slate-300 rounded p-4">${name}</div>\n`;
  });

  html += `</div>`;
  
  return html;
}

export function generateFullHTML(config: GridConfig, items: GridItem[]): string {
  const html = generateHTML(items);
  const css = generateCSS(config, items);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Grid Layout</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 2rem; background: #f8fafc; }
    
${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

