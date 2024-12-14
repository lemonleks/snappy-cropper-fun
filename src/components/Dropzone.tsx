import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from "sonner";

interface DropzoneProps {
  onFilesAccepted: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesAccepted }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error("Please upload image files only");
      return;
    }
    onFilesAccepted(imageFiles);
    toast.success(`${imageFiles.length} images uploaded`);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      {isDragActive ? (
        <p className="text-primary">Drop the images here...</p>
      ) : (
        <p className="text-gray-500">Drag & drop images here, or click to select files</p>
      )}
    </div>
  );
};