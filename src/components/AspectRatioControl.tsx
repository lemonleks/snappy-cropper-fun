import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AspectRatioOption = {
  value: string;
  label: string;
  ratio: number;
};

const aspectRatioOptions: AspectRatioOption[] = [
  { value: "1:1", label: "1:1", ratio: 1 },
  { value: "16:9", label: "16:9", ratio: 16 / 9 },
  { value: "9:16", label: "9:16", ratio: 9 / 16 },
  { value: "4:3", label: "4:3", ratio: 4 / 3 },
  { value: "3:4", label: "3:4", ratio: 3 / 4 },
];

interface AspectRatioControlProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export const AspectRatioControl: React.FC<AspectRatioControlProps> = ({
  value,
  onChange,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="space-y-2">
        <Tabs value={value} onValueChange={onChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {aspectRatioOptions.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="text-xs px-2"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Tabs value={value} onValueChange={onChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {aspectRatioOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export { aspectRatioOptions };
