import React, { useState } from 'react';
import { UploadCloud, FileText, Loader2, Wand2 } from 'lucide-react';

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length > 0) {
          const headers = lines[0].split(';');
          const parsedData = lines.slice(1).map(line => {
            const values = line.split(';');
            const rowData: any = {};
            headers.forEach((header, index) => {
              rowData[header.trim()] = values[index] !== undefined ? values[index].trim() : "";
            });
            return rowData;
          });
          onDataLoaded(parsedData);
        }
      } catch (err) {
        setError("Error parsing the local CSV file.");
      }
    };
    reader.onerror = () => setError("Failed to read the file.");
    
    // Read locally with ISO-8859-1 for French accents
    reader.readAsText(file, 'ISO-8859-1');
  };

  const handleProcessClick = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/api/process-dataset", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server processing error.");
      }

      const data = await response.json();
      onDataLoaded(data); 
      
    } catch (err: any) {
      setError(err.message || "Failed to reach the API. Is the server running?");
    } finally {
      setIsProcessing(false);
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
          <p className="text-slate-400 text-xs">Upload your CSV to preview, then optimize it.</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition group ${
        selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-600/60 hover:border-emerald-500 hover:bg-slate-700/20'
      } cursor-pointer`}>
        <FileText className={`${selectedFile ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'} mb-2 transition`} size={36} />
        
        <span className="text-slate-200 font-medium text-sm">
          {selectedFile 
            ? `Selected file: ${selectedFile.name}` 
            : "Click here or drag and drop your CSV file"}
        </span>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={isProcessing}
        />
      </label>

      {selectedFile && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleProcessClick}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                Optimize Dataset
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};