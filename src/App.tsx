import { useState } from 'react';
import { UploadScreen } from './components/UploadScreen';
import { Dashboard } from './components/Dashboard';
import type { ApiCall } from './types';

function App() {
  const [logData, setLogData] = useState<ApiCall[]>([]);
  const [currentView, setCurrentView] = useState<'upload' | 'dashboard'>('upload');

  const handleFileUpload = (data: ApiCall[]) => {
    setLogData(data);
    setCurrentView('dashboard');
  };

  const handleBackToUpload = () => {
    setCurrentView('upload');
    setLogData([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'upload' ? (
        <UploadScreen onFileUpload={handleFileUpload} />
      ) : (
        <Dashboard logData={logData} onBackToUpload={handleBackToUpload} />
      )}
    </div>
  );
}

export default App;