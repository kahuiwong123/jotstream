import { NextResponse } from "next/server";
import prisma from "../../../../db/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? "";
  const userId = searchParams.get("id");

  if (!query) {
    return NextResponse.json({ sections: [], tasks: [] });
  }

  const sections = await prisma.section.findMany({
    where: {
      userId: userId,
      name: { contains: query, mode: "insensitive" },
    },
  });

  const tasks = await prisma.task.findMany({
    where: {
      userId: userId,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
  });

  return NextResponse.json({ sections, tasks });
}
