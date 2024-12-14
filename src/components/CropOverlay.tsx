import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { aspectRatioOptions } from './AspectRatioControl';

interface CropOverlayProps {
  imageUrl: string;
  defaultAspectRatio: string;
  onCropChange: (crop: PixelCrop) => void;
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  imageUrl,
  defaultAspectRatio,
  onCropChange,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    console.log(`Image loaded with dimensions: ${width}x${height}`);

    const aspectRatio = aspectRatioOptions.find(opt => opt.value === defaultAspectRatio)?.ratio || 1;
    const cropWidth = Math.min(width, height * aspectRatio);
    const cropHeight = cropWidth / aspectRatio;

    const newCrop: Crop = {
      unit: 'px',
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight
    };

    setCrop(newCrop);
    onCropChange(newCrop as PixelCrop);
  };

  return (
    <ReactCrop
      crop={crop}
      onChange={(_, percentCrop) => setCrop(percentCrop)}
      onComplete={(c) => onCropChange(c)}
      aspect={aspectRatioOptions.find(opt => opt.value === defaultAspectRatio)?.ratio}
      className="max-w-full h-auto"
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Crop preview"
        onLoad={handleImageLoad}
        className="max-w-full h-auto"
      />
    </ReactCrop>
  );
};