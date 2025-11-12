import React from 'react';
import { X, FileText, Clock, FileType, Hash, BookOpen, List, Download } from 'lucide-react';

const SummaryModal = ({ result, isOpen, onClose }) => {
  if (!isOpen || !result) return null;

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

  const handleDownload = () => {
    const content = `
DOCUMENT SUMMARY
================

File: ${meta.fileName}
Type: ${meta.fileType.toUpperCase()}
Size: ${formatFileSize(meta.fileSize)}
Processed: ${formatDate(meta.processedAt)}
Text Length: ${meta.textLength.toLocaleString()} characters
Summary Type: ${meta.summaryLength}

SUMMARY
=======
${summary}

KEY POINTS
==========
${keyPointsList.map((point, index) => `${index + 1}. ${point}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.fileName.replace(/\.[^/.]+$/, '')}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Document Summary
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <br />
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Meta Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Document Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">File:</span>
                  <span className="text-gray-700">{meta.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileType className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Type:</span>
                  <span className="text-gray-700">{meta.fileType.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Size:</span>
                  <span className="text-gray-700">{formatFileSize(meta.fileSize)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Processed:</span>
                  <span className="text-gray-700">{formatDate(meta.processedAt)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-gray-600">
                <span className="font-medium">Text Length:</span> {meta.textLength.toLocaleString()} characters
                <span className="mx-2">•</span>
                <span className="font-medium">Summary Type:</span> <span className="capitalize">{meta.summaryLength}</span>
              </div>
            </div>
            <br />
            {/* Summary Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Summary
              </h3>
              <div className="space-y-3">
                {summaryParagraphs.length > 1 ? (
                  summaryParagraphs.map((paragraph, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-gray-700 leading-relaxed text-base">{paragraph.trim()}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
                  </div>
                )}
              </div>
            </div>

            <br />
            {/* Key Points Section */}
            {keyPointsList.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <List className="w-6 h-6 text-green-600" />
                  Key Points
                </h3>
                <div className="space-y-3">
                  {keyPointsList.map((point, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
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
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
