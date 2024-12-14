import React from 'react';
import { CropOverlay } from './CropOverlay';
import { PixelCrop } from 'react-image-crop';
import { toast } from "sonner";

interface ImageGridProps {
  images: { id: string; url: string; file: File }[];
  onImageClick: (id: string) => void;
  aspectRatio: string;
  onCropChange: (id: string, crop: PixelCrop) => void;
  interactedImages: Set<string>;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onImageClick,
  aspectRatio,
  onCropChange,
  interactedImages
}) => {
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
          className="image-card"
          onClick={() => onImageClick(image.id)}
        >
          <div className="p-2 text-sm text-gray-600 truncate border-b">
            {image.file.name}
          </div>
          <div className="relative w-full">
            <CropOverlay
              imageUrl={image.url}
              defaultAspectRatio={interactedImages.has(image.id) ? aspectRatio : "1:1"}
              onCropChange={(crop) => onCropChange(image.id, crop)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};