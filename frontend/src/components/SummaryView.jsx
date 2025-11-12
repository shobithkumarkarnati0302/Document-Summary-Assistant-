import React from 'react';
import { FileText, Clock, FileType, Hash, CheckCircle, ArrowLeft, BookOpen, List } from 'lucide-react';

const SummaryView = ({ result, onReset }) => {
  const { summary, keyPoints, meta } = result;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Parse summary into paragraphs
  const parseSummary = (text) => {
    if (!text) return [];
    return text.split('\n\n').filter(para => para.trim().length > 0);
  };

  // Parse key points from the text
  const parseKeyPoints = (text) => {
    if (!text) return [];
    
    // Split by newlines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Remove bullet points, numbers, and asterisks
    return lines.map(line => 
      line.replace(/^[\*\-\•\d\.\)]+\s*/, '').trim()
    ).filter(line => line.length > 0 && line.length > 10); // Filter out very short lines
  };

  const summaryParagraphs = parseSummary(summary);
  const keyPointsList = parseKeyPoints(keyPoints);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 flex flex-col items-center pt-8">
      {/* Header with Reset Button */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Document Summary</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          New Document
        </button>
      </div>

      {/* Meta Information */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Document Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">File Name</p>
              <p className="font-medium text-gray-800">{meta.fileName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileType className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">File Type</p>
              <p className="font-medium text-gray-800">{meta.fileType.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Hash className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">File Size</p>
              <p className="font-medium text-gray-800">{formatFileSize(meta.fileSize)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Processed At</p>
              <p className="font-medium text-gray-800">{formatDate(meta.processedAt)}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Text Length:</span>
            <span>{meta.textLength.toLocaleString()} characters</span>
            <span className="mx-2">•</span>
            <span className="font-medium">Summary Type:</span>
            <span className="capitalize">{meta.summaryLength}</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="w-full bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Summary
        </h3>
        <div className="space-y-4">
          {summaryParagraphs.length > 1 ? (
            summaryParagraphs.map((paragraph, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 px-8 border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed text-base">{paragraph.trim()}</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 px-8 border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
            </div>
          )}
        </div>
      </div>

      {/* Key Points Section */}
      {keyPointsList.length > 0 && (
        <div className="w-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <List className="w-6 h-6 text-green-600" />
            Key Points
          </h3>
          <div className="grid gap-4">
            {keyPointsList.map((point, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-lg font-bold text-gray-600 min-w-[24px]">
                    {index + 1}.
                  </span>
                  <p className="text-gray-700 leading-relaxed flex-1 text-base">{point}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryView;
