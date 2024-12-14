import React from 'react';
import { toast } from "sonner";

interface ImageGridProps {
  images: { id: string; url: string; file: File }[];
  onImageClick: (id: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500">
        No images uploaded yet
      </div>
    );
  }

  return (
    <div className="image-grid">
      {images.map((image) => (
        <div
          key={image.id}
          className="image-card group cursor-pointer"
          onClick={() => onImageClick(image.id)}
        >
          <div className="relative w-full">
            <img
              src={image.url}
              alt={`Uploaded ${image.file.name}`}
              className="w-full"
              onLoad={(e) => {
                console.log(`Image loaded: ${image.file.name}`);
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
              <p className="text-sm">{image.file.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};