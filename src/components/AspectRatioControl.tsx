import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type AspectRatioOption = {
  value: string;
  label: string;
  ratio: number;
};

const aspectRatioOptions: AspectRatioOption[] = [
  { value: "1:1", label: "Square (1:1)", ratio: 1 },
  { value: "16:9", label: "Landscape (16:9)", ratio: 16 / 9 },
  { value: "9:16", label: "Portrait (9:16)", ratio: 9 / 16 },
  { value: "4:3", label: "Standard (4:3)", ratio: 4 / 3 },
  { value: "3:4", label: "Portrait (3:4)", ratio: 3 / 4 },
];

interface AspectRatioControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const AspectRatioControl: React.FC<AspectRatioControlProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      <Label>Aspect Ratio</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-2"
      >
        {aspectRatioOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export { aspectRatioOptions };