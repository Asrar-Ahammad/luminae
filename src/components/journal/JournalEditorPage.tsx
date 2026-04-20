"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Save, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { MoodType, MOODS } from "@/lib/moods";
import { MoodSelector } from "./MoodSelector";
import dynamic from "next/dynamic";
const JournalEditor = dynamic(() => import("@/components/Editor/JournalEditor"), { ssr: false });

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Journal {
  id: string;
  title: string;
  content: any;
  mood: MoodType;
}

export default function JournalEditorPage({ journal }: { journal: Journal }) {
  const router = useRouter();
  const [title, setTitle] = useState(journal.title);
  const [content, setContent] = useState(journal.content);
  const [mood, setMood] = useState<MoodType>(journal.mood);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  const saveJournal = useCallback(async (updatedData: Partial<Journal>) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/journals/${journal.id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setSaveStatus("saved");
      } else {
        toast.error("Failed to save changes");
        setSaveStatus("unsaved");
      }
    } catch (err) {
      setSaveStatus("unsaved");
    }
  }, [journal.id]);

  // Debounced save
  useEffect(() => {
    if (saveStatus === "unsaved") {
      const timer = setTimeout(() => {
        saveJournal({ title, content, mood });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [title, content, mood, saveStatus, saveJournal]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/journals/${journal.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Entry deleted");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to delete entry");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSaveStatus("unsaved");
  };

  const handleContentUpdate = (newContent: any) => {
    setContent(newContent);
    setSaveStatus("unsaved");
  };

  const handleMoodChange = (newMood: MoodType) => {
    setMood(newMood);
    setSaveStatus("unsaved");
  };

  const moodConfig = MOODS[mood];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-[DM Sans]">
      {/* Top Bar */}
      <header 
        className="sticky top-0 z-50 w-full border-b border-zinc-800 transition-colors duration-500"
        style={{ backgroundColor: `${moodConfig.color}10` }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Link href="/dashboard" className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <input
              value={title}
              onChange={handleTitleChange}
              placeholder="Entry Title..."
              className="bg-transparent border-none outline-none text-xl sm:text-2xl font-bold font-[Lora] w-full placeholder:text-zinc-700"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-500">
              {saveStatus === "saving" ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Check size={12} className="text-green-500" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Unsaved changes</span>
              )}
            </div>

            <MoodSelector value={mood} onChange={handleMoodChange} />

            <AlertDialog>
              <AlertDialogTrigger 
                render={
                  <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-full">
                    <Trash2 size={18} />
                  </Button>
                } 
              />
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-[Lora]">Delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    This action cannot be undone. This will permanently delete your journal entry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700 rounded-xl">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <JournalEditor 
          content={content} 
          onUpdate={handleContentUpdate} 
          editable={true} 
        />
      </main>
    </div>
  );
}
