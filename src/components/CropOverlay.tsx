import React, { useRef, useState } from 'react';
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
  const [crop, setCrop] = useState<Crop>();

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    console.log(`Image loaded with dimensions: ${width}x${height}`);

    // If crop is already set, don't override it
    if (crop) {
      console.log('Crop already exists, keeping current crop:', crop);
      return;
    }

    const aspectRatio = aspectRatioOptions.find(opt => opt.value === defaultAspectRatio)?.ratio || 1;
    console.log('Using aspect ratio:', aspectRatio, 'from defaultAspectRatio:', defaultAspectRatio);
    
    // Calculate the maximum possible crop dimensions while maintaining aspect ratio
    let cropWidth, cropHeight;
    
    if (width / height > aspectRatio) {
      // Image is wider than the target ratio
      cropHeight = height;
      cropWidth = height * aspectRatio;
    } else {
      // Image is taller than the target ratio
      cropWidth = width;
      cropHeight = width / aspectRatio;
    }

    // Center the crop
    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;

    const newCrop: Crop = {
      unit: 'px',
      x,
      y,
      width: cropWidth,
      height: cropHeight
    };

    console.log('Setting initial crop:', newCrop);
    setCrop(newCrop);
    onCropChange(newCrop as PixelCrop);
  };

  // Get current aspect ratio
  const currentAspectRatio = aspectRatioOptions.find(opt => opt.value === defaultAspectRatio)?.ratio;

  return (
    <ReactCrop
      crop={crop}
      onChange={(c) => {
        console.log('Crop changed:', c);
        setCrop(c);
        onCropChange(c);
      }}
      aspect={currentAspectRatio}
      className="max-w-full h-auto"
      locked={true}
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