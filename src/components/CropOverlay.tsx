import React, { useRef, useState, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { aspectRatioOptions } from "./AspectRatioControl";

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

  const aspect =
    aspectRatioOptions.find((opt) => opt.value === defaultAspectRatio)?.ratio ||
    1;

  const setInitialCrop = () => {
    if (!imgRef.current) return;

    const { width, height } = imgRef.current;
    let cropWidth, cropHeight;

    if (width / height > aspect) {
      cropHeight = height;
      cropWidth = height * aspect;
    } else {
      cropWidth = width;
      cropHeight = width / aspect;
    }

    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;

    const newCrop = {
      unit: "px",
      x,
      y,
      width: cropWidth,
      height: cropHeight,
    };

    setCrop(newCrop);
    onCropChange(newCrop as PixelCrop);
  };

  useEffect(() => {
    setInitialCrop();
  }, [aspect]);

  const handleCropChange = (newCrop: Crop, pixelCrop: PixelCrop) => {
    setCrop(pixelCrop);
    onCropChange(pixelCrop);
  };

  return (
    <ReactCrop
      crop={crop}
      onChange={handleCropChange}
      aspect={aspect}
      locked={true}
      keepSelection
      style={{ maxWidth: "100%" }}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Crop preview"
        onLoad={setInitialCrop}
        style={{ maxWidth: "100%", display: "block" }}
        draggable={false}
      />
    </ReactCrop>
  );
};
