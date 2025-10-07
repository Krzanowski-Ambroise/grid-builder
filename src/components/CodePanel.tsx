import { useState } from 'react';
import { useGridStore } from '@/store/gridStore';
import { Button } from './ui/Button';
import { Copy, Download, Check } from 'lucide-react';
import { generateHTML, generateCSS, generateTailwind, generateFullHTML } from '@/lib/unifiedCodeGenerator';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { useToast } from './ui/Toast';

export function CodePanel() {
  const { config, items } = useGridStore();
  const [codeType, setCodeType] = useState<'html' | 'css' | 'tailwind'>('html');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const getCode = () => {
    switch (codeType) {
      case 'html':
        return generateHTML(items);
      case 'css':
        return generateCSS(config, items);
      case 'tailwind':
        return generateTailwind(config, items);
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(getCode());
      setCopied(true);
      showToast('Code copié !', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast('Erreur lors de la copie', 'error');
    }
  };

  const handleExportHTML = () => {
    const fullHTML = generateFullHTML(config, items);
    downloadFile(fullHTML, 'grid-layout.html', 'text/html');
    showToast('Fichier HTML exporté !', 'success');
  };

  const handleExportCSS = () => {
    const css = generateCSS(config, items);
    downloadFile(css, 'grid-layout.css', 'text/css');
    showToast('Fichier CSS exporté !', 'success');
  };

  return (
    <div className="w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Code Généré
        </h2>
        
        {/* Sélecteur de type de code */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={codeType === 'html' ? 'default' : 'outline'}
            onClick={() => setCodeType('html')}
            className="flex-1"
          >
            HTML
          </Button>
          <Button
            size="sm"
            variant={codeType === 'css' ? 'default' : 'outline'}
            onClick={() => setCodeType('css')}
            className="flex-1"
          >
            CSS
          </Button>
          <Button
            size="sm"
            variant={codeType === 'tailwind' ? 'default' : 'outline'}
            onClick={() => setCodeType('tailwind')}
            className="flex-1"
          >
            Tailwind
          </Button>
        </div>
      </div>

      {/* Zone de code */}
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-200 dark:border-slate-700">
          <code className="text-slate-800 dark:text-slate-200">{getCode()}</code>
        </pre>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <Button
          variant="default"
          className="w-full"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check size={16} className="mr-2" />
              Copié !
            </>
          ) : (
            <>
              <Copy size={16} className="mr-2" />
              Copier le code
            </>
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleExportHTML}
          >
            <Download size={16} className="mr-2" />
            Export HTML
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleExportCSS}
          >
            <Download size={16} className="mr-2" />
            Export CSS
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Raccourcis clavier :
          </p>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <li>• ←↑↓→ : Déplacer l'item</li>
            <li>• Shift+←↑↓→ : Redimensionner</li>
            <li>• Ctrl/Cmd+Z : Annuler</li>
            <li>• Ctrl/Cmd+Shift+Z : Refaire</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

