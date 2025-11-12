import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from './components/FileUploader';
import SummaryModal from './components/SummaryModal';
import { FileText, Sparkles, AlertCircle } from 'lucide-react';
import './App.css';

// Remove trailing slash if present to prevent double slashes
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleUpload = async (file, summaryLength) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('summaryLength', summaryLength);

    try {
      const uploadUrl = `${API_URL}/api/upload`;
      console.log('Making request to:', uploadUrl);
      console.log('API_URL:', API_URL);
      
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResult(response.data.data);
        setShowModal(true);
      } else {
        setError(response.data.error || 'Failed to process document');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'An error occurred while processing your document. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 bg-white shadow-md w-full max-w-9xl z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Document Summary Assistant
              </h1>
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="w-full max-w-7xl">
          <div className="space-y-8 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
            {/* Description */}
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-10">
                Upload Your Document
              </h2>
              <p className="text-gray-600">
                Upload any PDF or image document, and our AI will extract the text and generate
                a smart, concise summary highlighting the key ideas and insights.
              </p>
            </div>

            {/* File Uploader */}
            <FileUploader onUpload={handleUpload} isLoading={isLoading} />

            {/* Error Message */}
            {error && (
              <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">PDF & Image Support</h3>
                <p className="text-sm text-gray-600 text-center">
                  Extract text from PDFs and images using advanced OCR technology
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center gap-1">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">AI-Powered Summaries</h3>
                <p className="text-sm text-gray-600 text-center">
                  Generate intelligent summaries using Google's Gemini AI model
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center gap-1">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Key Points Extraction</h3>
                <p className="text-sm text-gray-600 text-center">
                  Automatically identify and highlight the most important points
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Summary Modal */}
      <SummaryModal 
        result={result} 
        isOpen={showModal} 
        onClose={handleCloseModal} 
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Document Summary Assistant © 2025 | Built with React, Tailwind CSS, and Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
