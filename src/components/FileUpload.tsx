import { FileText, Upload } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`relative group transition-all duration-300 ${
          isDragging ? 'scale-[1.02]' : 'hover:scale-[1.01]'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload log file"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl opacity-50"></div>
        
        {/* Border animation */}
        <div className={`absolute inset-0 rounded-3xl border-2 border-dashed transition-colors duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-gray-300 group-hover:border-blue-400'
        }`}></div>

        {/* Content */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50">
          <div className="text-center">
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 transition-all duration-300 ${
              isDragging 
                ? 'bg-blue-500 text-white scale-110' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white group-hover:scale-105'
            }`}>
              <Upload className="w-10 h-10" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isLoading ? 'Processing File...' : 'Upload Your Log Files'}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Drag and drop your JSON or TXT log files here, or click to browse and select files from your computer.
            </p>

            {/* Action Button */}
            <div className="mb-8">
              <button
                type="button"
                disabled={isLoading}
                className={`inline-flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Choose Files
                  </>
                )}
              </button>
            </div>

            {/* File format info */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>JSON files</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>TXT files</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.txt"
            className="hidden"
            onChange={handleFileInput}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Sample format info */}
      <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-gray-600" />
          Expected File Format
        </h4>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <pre className="text-xs text-gray-600 overflow-x-auto">
{`[
  {
    "event_type": "API",
    "method": "POST",
    "url": "https://api.example.com/endpoint",
    "timestamp": "2024-01-15T10:30:00Z",
    "response": {
      "statusCode": 200,
      "headers": {
        "x-envoy-upstream-service-time": "150"
      }
    },
    "error": {}
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  );
};