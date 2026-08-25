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

        <main className="space-y-8">
          <FileUpload
            onRawDataLoaded={(newData) => setRawPlayers(newData)}
            onProcessedDataLoaded={(newData) => setProcessedPlayers(newData)}
          />

          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Raw data</h2>
            <PlayerTable players={rawPlayers} />
          </div>

          {processedPlayers.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Processed data</h2>
              <PlayerTable players={processedPlayers} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;