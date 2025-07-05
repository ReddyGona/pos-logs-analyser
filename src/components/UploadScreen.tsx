import { useState } from 'react';
import { BarChart3, FileText, Upload, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { processLogData } from '../utils/logAnalyzer';
import type { ApiCall } from '../types';

interface UploadScreenProps {
  onFileUpload: (data: ApiCall[]) => void;
}

export const UploadScreen = ({ onFileUpload }: UploadScreenProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError('Please upload a .json or .txt file');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        throw new Error('Invalid file format. Expected an array of log entries.');
      }
      const processedData = processLogData(data);
      onFileUpload(processedData);
    } catch (error) {
      setError('Error processing file: ' + (error as Error).message);
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">POS Log Analyzer</h1>
              <p className="text-sm text-muted-foreground">Professional API Log Analysis Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Welcome to POS Log Analyzer</h2>
              <p className="text-lg text-muted-foreground">
                Upload your API log files to start analyzing performance, errors, and trends
              </p>
            </div>
          </div>

          {/* Upload Card */}
          <Card className="border-2 border-dashed transition-colors hover:border-primary/50">
            <CardContent className="p-8">
              <div
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                      isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <FileText className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {isLoading ? 'Processing File...' : 'Drop your log files here'}
                    </h3>
                    <p className="text-muted-foreground">
                      Supports JSON and TXT files up to 10MB
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      size="lg" 
                      disabled={isLoading}
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Files
                        </>
                      )}
                    </Button>
                    
                    <input
                      id="file-input"
                      type="file"
                      accept=".json,.txt"
                      className="hidden"
                      onChange={handleFileInput}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>JSON</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>TXT</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error:</span>
                </div>
                <p className="mt-1 text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Sample Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Expected File Format</span>
              </CardTitle>
              <CardDescription>
                Your log files should contain an array of API call entries in JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4">
                <pre className="text-sm overflow-x-auto">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};