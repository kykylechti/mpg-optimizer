import React, { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = parseCSV(content);
        onDataLoaded(parsedData);
      } catch (error) {
        alert("Error reading CSV file. Please make sure it is a valid format.");
      }
    };

    // ISO-8859-1 encoding handles French accents properly from Excel CSV exports
    reader.readAsText(file, 'ISO-8859-1');
  };

  // Simple CSV parser supporting comma and semicolon separators + encoding cleanup
  const parseCSV = (text: string) => {
    const lines = text.split(/\r\n|\n/);
    if (lines.length === 0) return [];

    const firstLine = lines[0];
    const separator = firstLine.includes(';') ? ';' : ',';

    const fixEncoding = (str: string) => {
      if (!str) return '';
      return str
        .replace(/ï¿½/g, 'ï')
        .replace(/Ã©/g, 'é')
        .replace(/Ã¨/g, 'è')
        .replace(/Ã /g, 'à')
        .replace(/Ã¢/g, 'â')
        .replace(/Ãª/g, 'ê');
    };

    const headers = firstLine.split(separator).map(h => fixEncoding(h.trim().replace(/^["']|["']$/g, '')));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const currentLine = lines[i].split(separator).map(val => fixEncoding(val.trim().replace(/^["']|["']$/g, '')));
      const obj: { [key: string]: any } = {};

      headers.forEach((header, index) => {
        obj[header] = currentLine[index] !== undefined ? currentLine[index] : '';
      });

      result.push(obj);
    }

    return result;
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/60 shadow-xl mb-8 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <UploadCloud size={24} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Import Dataset</h2>
          <p className="text-slate-400 text-xs">Upload your CSV player dataset to start optimizing.</p>
        </div>
      </div>
      
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600/60 rounded-xl p-8 cursor-pointer hover:border-emerald-500 hover:bg-slate-700/20 transition group">
        <FileText className="text-slate-500 group-hover:text-emerald-400 mb-2 transition" size={36} />
        <span className="text-slate-200 font-medium text-sm">
          {fileName ? `Selected file: ${fileName}` : "Click here or drag and drop your CSV file"}
        </span>
        <span className="text-slate-500 text-xs mt-1">Format accepted: .csv (Semicolon or Comma separated)</span>
        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
};