import React, { useState, useEffect } from 'react';
import { Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlayerTableProps {
  players: any[];
}

export const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page whenever the search query or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  if (players.length === 0) {
    return (
      <div className="bg-slate-800/80 p-12 rounded-2xl border border-slate-700/60 text-center text-slate-400 shadow-xl">
        <Users className="mx-auto mb-3 text-slate-600" size={48} />
        <p className="font-medium">No data available.</p>
        <p className="text-xs text-slate-500 mt-1">Import a CSV file above to begin your analysis.</p>
      </div>
    );
  }

  // 1. Extract dynamic headers
  const headers = Object.keys(players[0]);

  // 2. Global search filter
  const filteredPlayers = players.filter((p) => {
    if (!search) return true;
    return headers.some(header => 
      String(p[header]).toLowerCase().includes(search.toLowerCase())
    );
  });

  // 3. Pagination logic
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = itemsPerPage === -1 
    ? filteredPlayers 
    : filteredPlayers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-700/60 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="text-emerald-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Squad Players</h2>
          <span className="ml-2 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full">
            {filteredPlayers.length}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Show:</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-slate-900/80 border border-slate-700 px-2 py-1.5 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={-1}>All</option>
            </select>
          </div>

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

      <div className="overflow-x-auto overflow-y-auto max-h-[600px] flex-grow">
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
            {paginatedPlayers.map((p, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-700/20 transition-colors">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="py-3 px-6 text-sm text-slate-300 whitespace-nowrap">
                    {p[header] !== undefined && p[header] !== "" ? p[header] : "-"}
                  </td>
                ))}
              </tr>
            ))}
            {paginatedPlayers.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="py-8 text-center text-slate-500">
                  No matching players found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-700/60 flex items-center justify-between bg-slate-900/30">
          <span className="text-xs text-slate-400">
            Showing <span className="font-medium text-white">{startIndex + 1}</span> to <span className="font-medium text-white">{Math.min(startIndex + itemsPerPage, filteredPlayers.length)}</span> of <span className="font-medium text-white">{filteredPlayers.length}</span> players
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-medium text-slate-200">
              {currentPage} / {totalPages}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};