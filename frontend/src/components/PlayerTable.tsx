import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';

interface PlayerTableProps {
  players: any[];
}

export const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  const [search, setSearch] = useState("");

  if (players.length === 0) {
    return (
      <div className="bg-slate-800/80 p-12 rounded-2xl border border-slate-700/60 text-center text-slate-400 shadow-xl">
        <Users className="mx-auto mb-3 text-slate-600" size={48} />
        <p className="font-medium">No data available.</p>
        <p className="text-xs text-slate-500 mt-1">Import a CSV file above to begin your analysis.</p>
      </div>
    );
  }

  const headers = Object.keys(players[0]);

  const filteredPlayers = players.filter((p) => {
    if (!search) return true;
    return headers.some(header => 
      String(p[header]).toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-700/60 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="text-emerald-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Squad Players</h2>
          <span className="ml-2 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full">
            {filteredPlayers.length}
          </span>
        </div>
        
        <div className="flex w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search anywhere..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 pl-9 pr-4 py-2 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md shadow-sm z-10">
            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
              {headers.map((header, idx) => (
                <th key={idx} className="py-3.5 px-6 font-semibold whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {filteredPlayers.map((p, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-700/20 transition-colors">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="py-3 px-6 text-sm text-slate-300 whitespace-nowrap">
                    {p[header] !== undefined && p[header] !== "" ? p[header] : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};