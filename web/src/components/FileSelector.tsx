import { useState } from 'react';

interface FileSelectorProps {
  onFileSelect: (file: File, hash: string) => void;
}

export default function FileSelector({ onFileSelect }: FileSelectorProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const calculateSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `0x${hashHex}`;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const hash = await calculateSHA256(file);
      setSelectedFile(file);
      onFileSelect(file, hash);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const hash = await calculateSHA256(file);
      setSelectedFile(file);
      onFileSelect(file, hash);
    }
  };

  const onButtonClick = () => {
    const input = document.getElementById('file-upload') as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        htmlFor="file-upload"
        className={`w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-blue-500 rounded-lg shadow-md tracking-wide uppercase border border-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-300 ${
          dragActive ? 'bg-blue-50 dark:bg-gray-600' : ''
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l3.723 3.723a.75.75 0 01-1.06 1.06L10 10.44l-3.723 3.723a.75.75 0 01-1.06-1.06L8.94 9.413V13h-1.5z" />
          <path d="M3.5 13h1H3.5z" />
        </svg>
        <span className="mt-2 text-base leading-normal">Select a file or drag and drop here</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, DOCX, TXT, etc.</span>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleChange}
        />
      </label>
      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Selected file:</strong> {selectedFile.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
          <button
            className="mt-2 text-red-500 hover:text-red-700 text-sm"
            onClick={() => {
              setSelectedFile(null);
              onFileSelect(null as any, '');
            }}
          >
            Remove file
          </button>
        </div>
      )}
    </div>
  );
}