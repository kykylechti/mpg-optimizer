import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { PlayerTable } from './components/PlayerTable';

function App() {
  // Initial dummy dataset
  const [players, setPlayers] = useState([
    { Joueur: 'Kylian Mbappé', Poste: 'ATT', Cote: 95},
    { Joueur: 'Ousmane Dembele', Poste: 'ATT', Cote: 75},
    { Joueur: 'Achraf Hakimi', Poste: 'DEF', Cote: 80},
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">MPG Optimizer Dashboard</h1>
        <p className="text-slate-400">Import, visualize, and optimize your players for the season.</p>
      </header>

      <main className="max-w-5xl mx-auto">
        {/* File upload component */}
        <FileUpload onDataLoaded={(newData) => setPlayers(newData)} />

        {/* Player table visualization component */}
        <PlayerTable players={players} />
      </main>
    </div>
  );
}

export default App;