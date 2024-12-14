import React from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ControlsProps {
  format: string;
  quality: number;
  onFormatChange: (format: string) => void;
  onQualityChange: (quality: number) => void;
  onDownload: () => void;
  hasImages: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  format,
  quality,
  onFormatChange,
  onQualityChange,
  onDownload,
  hasImages
}) => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Label>Format</Label>
        <Select value={format} onValueChange={onFormatChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image/png">PNG</SelectItem>
            <SelectItem value="image/jpeg">JPEG</SelectItem>
            <SelectItem value="image/webp">WEBP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(format === 'image/jpeg' || format === 'image/webp') && (
        <div className="space-y-2">
          <Label>Quality ({quality}%)</Label>
          <Slider
            value={[quality]}
            onValueChange={(value) => onQualityChange(value[0])}
            min={1}
            max={100}
            step={1}
          />
        </div>
      )}

      <Button
        className="w-full"
        onClick={onDownload}
        disabled={!hasImages}
      >
        <Download className="w-4 h-4 mr-2" />
        Download All
      </Button>
    </div>
  );
};