import { Topbar } from './components/Topbar';
import { SidebarControls } from './components/SidebarControls';
import { UnifiedGridCanvas } from './components/UnifiedGridCanvas';
import { CodePanel } from './components/CodePanel';
import { useToast } from './components/ui/Toast';

function App() {
  const { ToastContainer } = useToast();

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Topbar />
      <div className="flex-1 flex overflow-hidden">
        <SidebarControls />
        <UnifiedGridCanvas />
        <CodePanel />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;

