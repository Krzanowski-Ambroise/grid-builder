import { useEffect } from 'react';
import { useGridStore } from '@/store/gridStore';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { 
  FileText, 
  FolderOpen, 
  Save, 
  Undo, 
  Redo, 
  Sun, 
  Moon,
  RotateCcw
} from 'lucide-react';
import { downloadFile } from '@/lib/utils';
import { useToast } from './ui/Toast';
import { presets } from '@/lib/presets';

export function Topbar() {
  const {
    theme,
    setTheme,
    undo,
    redo,
    canUndo,
    canRedo,
    loadState,
    reset,
    config,
    items,
    currentBreakpoint,
  } = useGridStore();
  
  const { showToast } = useToast();

  const handleNew = () => {
    if (items.length > 0 && !confirm('Créer un nouveau projet ? Les modifications non sauvegardées seront perdues.')) {
      return;
    }
    reset();
    showToast('Nouveau projet créé', 'success');
  };

  const handleSave = () => {
    const state = useGridStore.getState();
    const data = {
      version: '1.0',
      config: state.config,
      items: state.items,
      currentBreakpoint: state.currentBreakpoint,
    };
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `grid-project-${Date.now()}.json`, 'application/json');
    showToast('Projet sauvegardé !', 'success');
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          loadState({
            config: data.config,
            items: data.items,
            currentBreakpoint: data.currentBreakpoint || 'base',
          });
          showToast('Projet chargé !', 'success');
        } catch (error) {
          showToast('Erreur lors du chargement', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleLoadPreset = (presetName: string) => {
    if (presetName === '') return;
    const preset = presets.find(p => p.name === presetName);
    if (!preset) return;
    
    loadState(preset.state);
    showToast(`Preset "${preset.name}" chargé !`, 'success');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  };

  // Écouter les raccourcis clavier
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Grid Builder
        </h1>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleNew} title="Nouveau projet">
            <FileText size={16} className="mr-1" />
            Nouveau
          </Button>
          
          <Button size="sm" variant="ghost" onClick={handleLoad} title="Ouvrir un projet">
            <FolderOpen size={16} className="mr-1" />
            Ouvrir
          </Button>
          
          <Button size="sm" variant="ghost" onClick={handleSave} title="Sauvegarder">
            <Save size={16} className="mr-1" />
            Sauvegarder
          </Button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={undo}
            disabled={!canUndo()}
            title="Annuler (Ctrl+Z)"
          >
            <Undo size={16} />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={redo}
            disabled={!canRedo()}
            title="Refaire (Ctrl+Shift+Z)"
          >
            <Redo size={16} />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={reset}
            title="Réinitialiser"
          >
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value=""
          onChange={(e) => handleLoadPreset(e.target.value)}
          className="w-48"
        >
          <option value="">Charger un preset...</option>
          {presets.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </Select>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
    </div>
  );
}

