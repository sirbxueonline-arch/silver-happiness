import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { favorite } = body

    const item = await prisma.libraryItem.findUnique({
      where: { id: params.id },
    })

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.libraryItem.update({
      where: { id: params.id },
      data: { favorite },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Favorite error:", error)
    return NextResponse.json(
      { error: "Failed to update favorite" },
      { status: 500 }
    )
  }
}

