"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { MOODS, MoodType } from "@/lib/moods";
import { JournalCard } from "./JournalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, User, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Journal {
  id: string;
  title: string;
  content: any;
  mood: MoodType;
  createdAt: string;
  updatedAt: string;
}

interface DashboardClientProps {
  journals: Journal[];
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardClient({ journals, user }: DashboardClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeMood, setActiveMood] = useState<MoodType | "ALL">("ALL");
  const [creating, setCreating] = useState(false);

  const filteredJournals = useMemo(() => {
    return journals.filter((j) => {
      const matchesSearch = 
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        JSON.stringify(j.content).toLowerCase().includes(search.toLowerCase());
      const matchesMood = activeMood === "ALL" || j.mood === activeMood;
      return matchesSearch && matchesMood;
    });
  }, [journals, search, activeMood]);

  const handleCreateNew = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/journals", {
        method: "POST",
        body: JSON.stringify({
          title: "Untitled Entry",
          content: { type: "doc", content: [] },
          mood: "NEUTRAL",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const journal = await res.json();
        router.push(`/journal/${journal.id}`);
      } else {
        toast.error("Failed to create new entry");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-[DM Sans]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold font-[Lora] tracking-tight">Luminae</h1>
          
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <Input
                placeholder="Search your thoughts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-zinc-900/50 border-zinc-800 focus:ring-zinc-700 transition-all rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleCreateNew} 
              disabled={creating}
              className="bg-white text-black hover:bg-zinc-200 rounded-xl gap-2 hidden sm:flex"
            >
              <Plus size={18} />
              <span>New Entry</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger 
                render={
                  <button className="outline-none">
                    <Avatar className="h-9 w-9 border border-zinc-800 transition-all hover:ring-2 hover:ring-zinc-700">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-400 capitalize">
                        {user.name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                } 
              />
              <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200 rounded-2xl p-1" align="end">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                    <p className="text-xs leading-none text-zinc-500 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="p-3 rounded-xl hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer gap-2">
                  <User size={16} />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="p-3 rounded-xl hover:bg-red-900/20 focus:bg-red-900/20 text-red-400 cursor-pointer gap-2"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero / Mobile Search */}
      <div className="md:hidden px-4 py-4 border-b border-zinc-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search your thoughts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:ring-zinc-700 transition-all rounded-xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Mood Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          <Button
            variant={activeMood === "ALL" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveMood("ALL")}
            className={cn(
              "rounded-full px-4 h-8 transition-all shrink-0",
              activeMood === "ALL" ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-200"
            )}
          >
            All
          </Button>
          {(Object.entries(MOODS) as [MoodType, typeof MOODS.HAPPY][]).map(([key, mood]) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => setActiveMood(key)}
              className={cn(
                "rounded-full px-4 h-8 transition-all shrink-0 gap-2",
                activeMood === key ? "" : "text-zinc-500 hover:text-zinc-200"
              )}
              style={activeMood === key ? {
                backgroundColor: mood.bg + '20',
                color: mood.color,
                border: `1px solid ${mood.border}`
              } : {}}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </Button>
          ))}
        </div>

        {/* Grid */}
        {filteredJournals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournals.map((journal, i) => (
              <JournalCard key={journal.id} journal={journal} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
              <Filter className="text-zinc-700" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2 font-[Lora]">No entries found</h3>
            <p className="text-zinc-500 max-w-sm">
              {search || activeMood !== "ALL" 
                ? "Try adjusting your filters or search terms."
                : "Your journey starts here. Create your first journal entry to capture your thoughts."}
            </p>
            {!search && activeMood === "ALL" && (
              <Button 
                onClick={handleCreateNew} 
                className="mt-8 bg-zinc-50 text-black hover:bg-zinc-200 rounded-xl px-8"
              >
                Create your first entry
              </Button>
            )}
          </div>
        )}
      </main>

      {/* FAB for mobile */}
      <button 
        onClick={handleCreateNew}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center sm:hidden active:scale-95 transition-transform z-50"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
