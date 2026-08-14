import React, { useState } from 'react';

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

    // Using 'ISO-8859-1' correctly handles French accents from Excel CSV exports
    reader.readAsText(file, 'ISO-8859-1');
  };

  const fixEncoding = (str: string) => {
    if (!str) return '';
    return str
      .replace(/ï¿½/g, 'ï')
      .replace(/Ã©/g, 'é')
      .replace(/Ã¨/g, 'è')
      .replace(/Ã /g, 'à')
      .replace(/Ã¢/g, 'â')
      .replace(/Ãª/g, 'ê')
      .replace(/Ã«/g, 'ë')
      .replace(/Ã®/g, 'î')
      .replace(/Ã¯/g, 'ï')
      .replace(/Ãô/g, 'ô')
      .replace(/Ã¹/g, 'ù')
      .replace(/Ãû/g, 'û');
  };

  // Simple CSV parser supporting comma and semicolon separators
  const parseCSV = (text: string) => {
    const lines = text.split(/\r\n|\n/);
    if (lines.length === 0) return [];

    // Detect separator (comma or semicolon)
    const firstLine = lines[0];
    const separator = firstLine.includes(';') ? ';' : ',';

    const headers = firstLine.split(separator).map(h => h.trim().replace(/^["']|["']$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const currentLine = lines[i].split(separator).map(val => val.trim().replace(/^["']|["']$/g, ''));
      const obj: { [key: string]: any } = {};

      headers.forEach((header, index) => {
        obj[header] = currentLine[index] !== undefined ? fixEncoding(currentLine[index]) : '';
      });

      result.push(obj);
    }

    return result;
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-6">
      <h2 className="text-lg font-semibold text-white mb-2">Import Data</h2>
      <p className="text-slate-400 text-sm mb-4">Upload your CSV player dataset to analyze.</p>
      
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition">
        <span className="text-slate-300 font-medium">
          {fileName ? `Selected file: ${fileName}` : "Click here or drag and drop your CSV file"}
        </span>
        <span className="text-slate-500 text-xs mt-1">Accepted format: .csv</span>
        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
};