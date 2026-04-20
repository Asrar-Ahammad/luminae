"use client";

import Link from "next/link";
import { MOODS, MoodType } from "@/lib/moods";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JournalCardProps {
  journal: {
    id: string;
    title: string;
    content: any;
    mood: MoodType;
    createdAt: string;
    updatedAt: string;
  };
  index: number;
}

export function JournalCard({ journal, index }: JournalCardProps) {
  const mood = MOODS[journal.mood];

  // Simple text extraction from Tiptap JSON
  const getTextContent = (json: any) => {
    if (!json || !json.content) return "";
    return json.content
      .map((block: any) => {
        if (block.content) {
          return block.content.map((node: any) => node.text).join(" ");
        }
        return "";
      })
      .join(" ")
      .slice(0, 120) + "...";
  };

  const preview = getTextContent(journal.content);

  return (
    <Link href={`/journal/${journal.id}`}>
      <Card 
        className="group h-full bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 animate-card overflow-hidden cursor-pointer"
        style={{ 
          borderLeft: `4px solid ${mood.color}`,
          animationDelay: `${index * 50}ms`
        }}
      >
        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge 
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider"
              style={{ backgroundColor: mood.bg, color: mood.color, border: `1px solid ${mood.border}` }}
            >
              {mood.emoji} {mood.label}
            </Badge>
            <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
              {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(journal.createdAt))}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white font-[Lora] line-clamp-1 group-hover:text-zinc-200 transition-colors">
            {journal.title}
          </h3>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
            {preview || "No content yet..."}
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex justify-between items-center text-[10px] text-zinc-500 font-medium">
          <div className="flex gap-1 items-center">
            <span>{preview.split(" ").length} words</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
