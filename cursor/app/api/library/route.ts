import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.libraryItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        title: true,
        subject: true,
        favorite: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Library error:", error)
    return NextResponse.json(
      { error: "Failed to fetch library" },
      { status: 500 }
    )
  }
}

