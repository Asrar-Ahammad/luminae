import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";

// GET all journals for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const journals = await prisma.journal.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, title: true, mood: true,
      createdAt: true, updatedAt: true,
      content: true,
    },
  });

  return NextResponse.json(journals);
}

// POST create journal
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const journal = await prisma.journal.create({
    data: {
      title: body.title ?? "Untitled",
      content: body.content ?? {},
      mood: (body.mood as Mood) ?? "NEUTRAL",
      userId: session.user.id,
    },
  });

  return NextResponse.json(journal, { status: 201 });
}
