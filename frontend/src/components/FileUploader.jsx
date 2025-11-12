import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image } from 'lucide-react';
import Loader from './Loader';

const FileUploader = ({ onUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleUpload = (summaryLength) => {
    if (selectedFile) {
      onUpload(selectedFile, summaryLength);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-12 h-12 text-gray-400" />;
    
    if (selectedFile.type === 'application/pdf') {
      return <FileText className="w-12 h-12 text-red-500" />;
    }
    return <Image className="w-12 h-12 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div
        {...getRootProps()}
        className={`w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {getFileIcon()}
          {isDragActive ? (
            <p className="text-lg font-medium text-blue-600">Drop the file here...</p>
          ) : selectedFile ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-green-600">File Selected!</p>
              <p className="text-sm text-gray-600">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, PNG, JPG, JPEG (Max 50MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedFile && !isLoading && (
        <div className="mt-6 space-y-4 w-full">
          <h3 className="text-lg font-semibold text-gray-800">Choose Summary Length:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleUpload('short')}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <div className="text-center">
                <div className="font-bold text-lg">Short</div>
                <div className="text-sm opacity-90">3-4 lines</div>
              </div>
            </button>
            <button
              onClick={() => handleUpload('medium')}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <div className="text-center">
                <div className="font-bold text-lg">Medium</div>
                <div className="text-sm opacity-90">5-8 lines</div>
              </div>
            </button>
            <button
              onClick={() => handleUpload('long')}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <div className="text-center">
                <div className="font-bold text-lg">Long</div>
                <div className="text-sm opacity-90">3 paragraphs</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-6 w-full flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <Loader />
          <p className="text-blue-700 font-medium text-lg">Processing your document...</p>
          <p className="text-blue-600 text-sm">Please wait while we extract text and generate your summary</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
