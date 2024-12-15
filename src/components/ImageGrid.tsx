import React from "react";
import { CropOverlay } from "./CropOverlay";
import { PixelCrop } from "react-image-crop";
import { AspectRatioControl } from "./AspectRatioControl";

interface ImageGridProps {
  images: { id: string; url: string; file: File; aspectRatio?: string }[];
  onImageClick: (id: string) => void;
  onCropChange: (id: string, crop: PixelCrop) => void;
  onAspectRatioChange: (id: string, ratio: string) => void;
  interactedImages: Set<string>;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onImageClick,
  onCropChange,
  onAspectRatioChange,
  interactedImages,
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
          <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
            <CropOverlay
              imageUrl={image.url}
              defaultAspectRatio={image.aspectRatio || "1:1"}
              onCropChange={(crop) => onCropChange(image.id, crop)}
            />
          </div>
          <div className="p-2 border-t" onClick={(e) => e.stopPropagation()}>
            <AspectRatioControl
              value={image.aspectRatio || "1:1"}
              onChange={(ratio) => onAspectRatioChange(image.id, ratio)}
              compact={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
