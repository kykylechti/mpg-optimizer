import React, { useState } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/process-dataset", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors du traitement côté serveur.");
      }

      const data = await response.json();
      onDataLoaded(data);
      
    } catch (err: any) {
      setError(err.message || "Cannot connect to API. Is server launched ?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/60 shadow-xl mb-8 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <UploadCloud size={24} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Import & Clean Dataset</h2>
          <p className="text-slate-400 text-xs">Upload your CSV to process it via the FastAPI backend.</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition group ${
        isLoading ? 'border-slate-600/30 bg-slate-800/30 cursor-wait' : 'border-slate-600/60 cursor-pointer hover:border-emerald-500 hover:bg-slate-700/20'
      }`}>
        {isLoading ? (
          <Loader2 className="text-emerald-500 animate-spin mb-2" size={36} />
        ) : (
          <FileText className="text-slate-500 group-hover:text-emerald-400 mb-2 transition" size={36} />
        )}
        
        <span className="text-slate-200 font-medium text-sm">
          {isLoading 
            ? "Processing dataset via API..." 
            : fileName 
              ? `Selected file: ${fileName}` 
              : "Click here or drag and drop your CSV file"}
        </span>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={isLoading}
        />
      </label>
    </div>
  );
};