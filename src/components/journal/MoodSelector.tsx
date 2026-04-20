"use client";

import { Check, ChevronDown } from "lucide-react";
import { MOODS, MoodType } from "@/lib/moods";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MoodSelectorProps {
  value: MoodType;
  onChange: (mood: MoodType) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const currentMood = MOODS[value];

  return (
    <Popover>
      <PopoverTrigger 
        render={
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-sm font-medium">
            <span>{currentMood.emoji}</span>
            <span className="text-zinc-300">{currentMood.label}</span>
            <ChevronDown size={14} className="text-zinc-500" />
          </button>
        } 
      />
      <PopoverContent className="w-64 p-2 bg-zinc-900 border-zinc-800 rounded-2xl" align="end">
        <div className="grid grid-cols-2 gap-1">
          {(Object.entries(MOODS) as [MoodType, typeof currentMood][]).map(([key, mood]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all",
                value === key 
                  ? "bg-zinc-800 text-white shadow-sm" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
              style={value === key ? { 
                backgroundColor: mood.bg + '20', 
                borderColor: mood.border,
                borderWidth: '1px'
              } : {}}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
              {value === key && <Check size={12} className="ml-auto" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
