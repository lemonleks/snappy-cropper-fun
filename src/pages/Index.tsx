import React, { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { Dropzone } from "../components/Dropzone";
import { ImageGrid } from "../components/ImageGrid";
import { Controls } from "../components/Controls";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { PixelCrop } from "react-image-crop";

interface ImageData {
  id: string;
  url: string;
  file: File;
  crop?: PixelCrop;
  aspectRatio?: string;
}

const Index = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(90);
  const [interactedImages] = useState(new Set<string>());

  const handleFilesAccepted = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      id: nanoid(),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleImageClick = (id: string) => {
    console.log("Image clicked:", id);
    interactedImages.add(id);
  };

  const handleCropChange = (id: string, crop: PixelCrop) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, crop } : img))
    );
    console.log(`Crop updated for image ${id}:`, crop);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    sourceImage: HTMLImageElement,
    crop: PixelCrop,
    fileName: string
  ): Promise<Blob> => {
    console.log("=== Starting getCroppedImg ===");
    console.log("Original image dimensions:", {
      naturalWidth: sourceImage.naturalWidth,
      naturalHeight: sourceImage.naturalHeight,
      displayWidth: sourceImage.width,
      displayHeight: sourceImage.height,
    });
    console.log("Crop parameters:", crop);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Get the actual displayed image size from the DOM
    const displayedImage = document.querySelector(
      `img[src="${sourceImage.src}"]`
    ) as HTMLImageElement;

    if (!displayedImage) {
      throw new Error("Could not find displayed image");
    }

    console.log("Displayed image size:", {
      width: displayedImage.width,
      height: displayedImage.height,
    });

    // Calculate the actual scaling ratio based on the displayed size
    const ratio = sourceImage.naturalWidth / displayedImage.width;
    console.log("Scaling ratio:", ratio);

    // Convert percentage to pixels if needed
    let cropX, cropY, cropWidth, cropHeight;

    if (crop.unit === "%") {
      cropX = (crop.x * displayedImage.width) / 100;
      cropY = (crop.y * displayedImage.height) / 100;
      cropWidth = (crop.width * displayedImage.width) / 100;
      cropHeight = (crop.height * displayedImage.height) / 100;
    } else {
      cropX = crop.x;
      cropY = crop.y;
      cropWidth = crop.width;
      cropHeight = crop.height;
    }

    // Calculate crop dimensions at full resolution
    const actualCropX = Math.round(cropX * ratio);
    const actualCropY = Math.round(cropY * ratio);
    const actualCropWidth = Math.round(cropWidth * ratio);
    const actualCropHeight = Math.round(cropHeight * ratio);

    console.log("Calculated crop dimensions:", {
      x: actualCropX,
      y: actualCropY,
      width: actualCropWidth,
      height: actualCropHeight,
    });

    // Set canvas size to the cropped dimensions
    canvas.width = actualCropWidth;
    canvas.height = actualCropHeight;

    // Draw the cropped portion directly from the source image
    ctx.drawImage(
      sourceImage,
      actualCropX,
      actualCropY,
      actualCropWidth,
      actualCropHeight,
      0,
      0,
      actualCropWidth,
      actualCropHeight
    );

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Failed to create blob");
            reject(new Error("Canvas is empty"));
            return;
          }
          console.log("Created blob:", {
            size: blob.size,
            type: blob.type,
          });
          console.log("=== Finished getCroppedImg ===");
          resolve(blob);
        },
        format,
        format === "image/png" ? undefined : quality / 100
      );
    });
  };

  const handleDownload = async () => {
    try {
      for (const image of images) {
        if (!image.crop) {
          // If no crop, save the original image
          const response = await fetch(image.url);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${image.file.name.split(".")[0]}.${
            format.split("/")[1]
          }`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          continue;
        }

        // For cropped images
        const sourceImage = await createImage(image.url);
        const croppedBlob = await getCroppedImg(
          sourceImage,
          image.crop,
          image.file.name
        );

        const url = URL.createObjectURL(croppedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${image.file.name.split(".")[0]}_cropped.${
          format.split("/")[1]
        }`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast.success("Images downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error downloading images");
    }
  };

  const handleAspectRatioChange = (id: string, ratio: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, aspectRatio: ratio } : img))
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Image Controls</h2>
          </SidebarHeader>
          <SidebarContent>
            <Controls
              format={format}
              quality={quality}
              onFormatChange={setFormat}
              onQualityChange={setQuality}
              onDownload={handleDownload}
              hasImages={images.length > 0}
            />
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6">
          <Dropzone onFilesAccepted={handleFilesAccepted} />
          <div className="mt-6">
            <ImageGrid
              images={images}
              onImageClick={handleImageClick}
              onCropChange={handleCropChange}
              onAspectRatioChange={handleAspectRatioChange}
              interactedImages={interactedImages}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
