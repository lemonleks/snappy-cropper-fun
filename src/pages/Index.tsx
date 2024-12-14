import React, { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { Dropzone } from '../components/Dropzone';
import { ImageGrid } from '../components/ImageGrid';
import { Controls } from '../components/Controls';
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";

const Index = () => {
  const [images, setImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState(90);

  const handleFilesAccepted = useCallback((files: File[]) => {
    const newImages = files.map(file => ({
      id: nanoid(),
      url: URL.createObjectURL(file),
      file
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleImageClick = (id: string) => {
    console.log('Image clicked:', id);
    // Future enhancement: implement image editing
  };

  const handleDownload = async () => {
    try {
      for (const image of images) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.src = image.url;
        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${image.file.name.split('.')[0]}.${format.split('/')[1]}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
                resolve(null);
              },
              format,
              format === 'image/png' ? undefined : quality / 100
            );
          };
        });
      }
      toast.success('Images downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading images');
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar defaultCollapsed={false}>
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
            <ImageGrid images={images} onImageClick={handleImageClick} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;