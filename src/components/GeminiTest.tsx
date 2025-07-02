import React, { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';
import { useGemini } from '../hooks/useGemini';

export default function GeminiTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const { 
    loading, 
    error, 
    data, 
    testConnection, 
    generateStory,
    isReady 
  } = useGemini({
    onSuccess: (data) => {
      console.log('Gemini request successful:', data);
    },
    onError: (error) => {
      console.error('Gemini request failed:', error);
    }
  });

  const runConnectionTest = async () => {
    const result = await testConnection();
    setTestResults(result);
  };

  const runStoryTest = async () => {
    const result = await generateStory({
      names: 'Sarah & Michael',
      style: 'romantic',
      weddingDate: '2024-09-15',
      venue: 'Garden Venue',
      additionalInfo: 'Met in college, love hiking together'
    });
    setTestResults(result);
  };

  const getStatusIcon = () => {
    if (loading) return <Loader className="h-5 w-5 animate-spin text-blue-500" />;
    if (error) return <XCircle className="h-5 w-5 text-red-500" />;
    if (data) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <Sparkles className="h-5 w-5 text-gray-400" />;
  };

  const getStatusText = () => {
    if (loading) return 'Testing...';
    if (error) return 'Failed';
    if (data) return 'Success';
    return 'Ready to test';
  };

  const getStatusColor = () => {
    if (loading) return 'text-blue-600';
    if (error) return 'text-red-600';
    if (data) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-800">Gemini API Test Console</h2>
        </div>

        {/* API Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <span className={`font-medium ${getStatusColor()}`}>
                API Status: {getStatusText()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Ready: {isReady ? '✅' : '❌'}
              </span>
              {!isReady && (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </div>
          
          {!isReady && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Gemini API is not properly configured. Please check your environment variables.
              </p>
            </div>
          )}
        </div>

        {/* Test Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={runConnectionTest}
            disabled={loading || !isReady}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Test Connection</span>
          </button>

          <button
            onClick={runStoryTest}
            disabled={loading || !isReady}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Test Story Generation</span>
          </button>
        </div>

        {/* Results Display */}
        {(data || error) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Test Results</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-800">Error</span>
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {data && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-800">Success</span>
                </div>
                
                {data.status && (
                  <p className="text-green-700 mb-2">
                    Status: {data.status} - {data.message}
                  </p>
                )}

                {data.story && (
                  <div className="space-y-2">
                    <p className="font-medium text-green-800">Generated Story:</p>
                    <p className="text-green-700 italic">"{data.story}"</p>
                    <p className="text-sm text-green-600">
                      Style: {data.style} | Word Count: {data.wordCount}
                    </p>
                  </div>
                )}
              </div>
            )}

            {showDetails && testResults && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Raw Response:</h4>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Configuration Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Configuration</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Temperature: 0.7-0.9 (creative outputs)</p>
            <p>• Safety filters: Enabled</p>
            <p>• Response format: JSON</p>
            <p>• Max tokens: 2048</p>
            <p>• Rate limiting: Enabled with exponential backoff</p>
            <p>• Retry attempts: 3</p>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Setup Instructions</h4>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>1. Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in your project root</p>
            <p>2. Add your Gemini API key: <code className="bg-yellow-100 px-1 rounded">VITE_GEMINI_API_KEY=your_actual_api_key</code></p>
            <p>3. Restart your development server</p>
            <p>4. Click "Test Connection" to verify the setup</p>
          </div>
        </div>
      </div>
    </div>
  );
}