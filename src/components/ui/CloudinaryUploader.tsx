'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { FiUploadCloud, FiImage, FiTrash, FiCheck } from 'react-icons/fi';

interface CloudinaryUploaderProps {
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: any) => void;
  buttonText?: string;
  successText?: string;
  errorText?: string;
  uploadPreset?: string;
}

export default function CloudinaryUploader({
  onUploadSuccess,
  onUploadError,
  buttonText = 'Upload Image',
  successText = 'Upload successful!',
  errorText = 'Upload failed. Please try again.',
  uploadPreset = 'fitnass_uploads',
}: CloudinaryUploaderProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUploadSuccess = (result: any) => {
    setUploadStatus('success');
    setUploadedUrl(result.info.secure_url);
    if (onUploadSuccess) {
      onUploadSuccess(result);
    }
  };

  const handleUploadError = (error: any) => {
    setUploadStatus('error');
    console.error('Upload error:', error);
    if (onUploadError) {
      onUploadError(error);
    }
  };

  const resetUploader = () => {
    setUploadStatus('idle');
    setUploadedUrl(null);
  };

  return (
    <div className="w-full">
      {uploadStatus === 'idle' ? (
        <CldUploadWidget
          uploadPreset={uploadPreset}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          options={{
            sources: ['local', 'url', 'camera'],
            multiple: false,
            maxFiles: 1,
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiUploadCloud className="h-5 w-5" />
              {buttonText}
            </button>
          )}
        </CldUploadWidget>
      ) : uploadStatus === 'success' ? (
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4 text-green-600">
            <FiCheck className="h-5 w-5 mr-2" />
            <span>{successText}</span>
          </div>
          
          {uploadedUrl && (
            <div className="w-full mb-4">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={uploadedUrl} 
                  alt="Uploaded image" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={resetUploader}
              className="flex items-center justify-center py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
            >
              <FiUploadCloud className="h-4 w-4 mr-2" />
              Upload another
            </button>
            
            {uploadedUrl && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(uploadedUrl);
                  alert('Image URL copied to clipboard');
                }}
                className="flex items-center justify-center py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg"
              >
                <FiImage className="h-4 w-4 mr-2" />
                Copy URL
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4 text-red-600">
            <FiTrash className="h-5 w-5 mr-2" />
            <span>{errorText}</span>
          </div>
          
          <button
            onClick={resetUploader}
            className="flex items-center justify-center py-2 px-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
} 