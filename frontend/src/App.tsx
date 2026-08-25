import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { PlayerTable } from './components/PlayerTable';
import { LayoutDashboard, Sparkles } from 'lucide-react';

function App() {
  const [rawPlayers, setRawPlayers] = useState([
    { Joueur: 'Kylian Mbappé', Poste: 'ATT', Cote: 95 },
    { Joueur: 'Ousmane Dembele', Poste: 'ATT', Cote: 75 },
    { Joueur: 'Achraf Hakimi', Poste: 'DEF', Cote: 80 },
  ]);
  const [processedPlayers, setProcessedPlayers] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'raw' | 'processed'>('raw');

  const displayedPlayers = activeView === 'raw' ? rawPlayers : processedPlayers;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/20">
              <LayoutDashboard size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">MPG Optimizer</h1>
              <p className="text-slate-400 text-sm">Data analytics & squad builder for your fantasy league.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-emerald-400">
            <Sparkles size={14} />
            <span>Ready to optimize</span>
          </div>
        </header>

        <main className="space-y-6">
          <FileUpload
            onRawDataLoaded={(newData) => {
              setRawPlayers(newData);
              setActiveView('raw');
            }}
            onProcessedDataLoaded={(newData) => {
              setProcessedPlayers(newData);
              setActiveView('processed');
            }}
          />

          <div className="inline-flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveView('raw')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeView === 'raw'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw data
            </button>
            <button
              onClick={() => setActiveView('processed')}
              disabled={processedPlayers.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed ${
                activeView === 'processed'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Processed data
            </button>
          </div>

          <PlayerTable players={displayedPlayers} />
        </main>
      </div>
    </div>
  );
}

export default App;