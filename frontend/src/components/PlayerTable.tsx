import React, { useState } from 'react';

interface PlayerTableProps {
  players: any[];
}

export const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  const [search, setSearch] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("ALL");

  // Filter players dynamically based on potential keys
  const filteredPlayers = players.filter((p) => {
    const playerName = p.Joueur || p.name || p.Player || "";
    const playerPos = p.Poste || p.position || "";

    const matchesName = playerName.toLowerCase().includes(search.toLowerCase());
    const matchesPos = selectedPosition === "ALL" || playerPos === selectedPosition;
    return matchesName && matchesPos;
  });

  if (players.length === 0) {
    return (
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center text-slate-400">
        No data available. Import a file to get started.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white">Squad ({filteredPlayers.length} players)</h2>
        
        {/* Search bar and filters */}
        <div className="flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search a player..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
          />
          <select 
            value={selectedPosition} 
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All positions</option>
            <option value="GB">GB</option>
            <option value="DEF">DEF</option>
            <option value="MIL">MIL</option>
            <option value="ATT">ATT</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-sm">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Price (Cote)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((p, index) => {
              // Price is now mapped directly from cote/Cote/price/Prix
              const playerPrice = p.Cote || p.cote || p.price || p.Prix;

              return (
                <tr key={p.id || index} className="border-b border-slate-700/50 hover:bg-slate-700/30 text-sm">
                  <td className="py-3 px-4 font-medium text-white">{p.Joueur || p.name || p.Player || "-"}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {p.Poste || p.position || "-"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {playerPrice ? `${playerPrice}M` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};