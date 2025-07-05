import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
  onError: (message: string) => void;
}

export const FileUpload = ({ onFileUpload, onError }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(json|txt)$/)) {
      onError('Please upload a .json or .txt file');
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        throw new Error('Invalid file format. Expected an array of log entries.');
      }
      onFileUpload(data);
    } catch (error) {
      onError('Error processing file: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files?.length) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[320px]">
      <div
        className={`w-full max-w-xl bg-gradient-to-br from-white to-blue-50 border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center shadow-xl transition-colors duration-200 cursor-pointer relative ${isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload log file"
      >
        <div className="absolute inset-0 pointer-events-none rounded-2xl border-4 border-dotted border-blue-300 opacity-40" />
        <div className="relative z-10 flex flex-col items-center">
          <Upload className={`w-14 h-14 mb-4 ${isDragging ? 'text-blue-600' : 'text-blue-400'}`} />
          <div className="text-2xl font-bold text-gray-700 mb-2">Drag & drop files here</div>
          <div className="text-base text-gray-500 mb-4">or <span className="text-blue-600 font-semibold underline">upload a file</span></div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.txt"
            className="hidden"
            onChange={handleFileInput}
            disabled={isLoading}
          />
          {isLoading && <div className="mt-2 text-blue-600 animate-pulse">Processing...</div>}
        </div>
      </div>
    </div>
  );
};
