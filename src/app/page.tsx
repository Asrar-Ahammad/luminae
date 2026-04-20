import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  const moodColors = [
    "#F59E0B", "#60A5FA", "#A78BFA", "#10B981",
    "#F87171", "#F472B6", "#FB923C", "#94A3B8"
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 flex flex-col items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {moodColors.map((color, i) => (
          <div
            key={i}
            className="mood-orb absolute rounded-full blur-[100px] opacity-20"
            style={{
              backgroundColor: color,
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              "--duration": `${Math.random() * 4 + 4}s`,
              "--delay": `${Math.random() * 5}s`,
            } as any}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950 pointer-events-none" />

      {/* Content */}
      <main className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-[Lora]">
          Your thoughts, <br />
          <span className="italic text-zinc-400">beautifully kept.</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 mb-10 font-light max-w-2xl mx-auto">
          A private journal for the thoughts that matter. Simple, minimal, and yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/signup" 
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-xl px-8 py-6 text-lg bg-white text-black hover:bg-zinc-200 transition-all font-medium h-auto"
            )}
          >
            Start Writing
          </Link>
          <Link 
            href="/auth/signin" 
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "rounded-xl px-8 py-6 text-lg text-white hover:bg-white/10 transition-all font-medium h-auto"
            )}
          >
            Sign In
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-zinc-600 text-sm">
        © {new Date().getFullYear()} Luminae. Private & Secure.
      </footer>
    </div>
  );
}
