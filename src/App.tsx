import { Canvas } from '@/components/canvas/Canvas';
import { ChatPanel } from '@/components/chat/ChatPanel';

function App() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="shrink-0 h-12 px-4 flex items-center border-b border-slate-200 bg-white">
        <span className="font-semibold text-slate-800">Flex</span>
        <span className="ml-2 text-sm text-slate-500">
          AI Design System Playground
        </span>
      </header>
      <div className="flex-1 flex min-h-0">
        <Canvas />
        <ChatPanel />
      </div>
    </div>
  );
}

export default App;
