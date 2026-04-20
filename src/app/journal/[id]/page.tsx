import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import JournalEditorPage from "@/components/journal/JournalEditorPage";
import { MoodType } from "@/lib/moods";

export default async function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { id } = await params;

  const journal = await prisma.journal.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!journal) {
    notFound();
  }

  // Serialize and cast types
  const serializedJournal = {
    ...journal,
    mood: journal.mood as MoodType,
    content: journal.content as any,
  };

  return <JournalEditorPage journal={serializedJournal} />;
}
