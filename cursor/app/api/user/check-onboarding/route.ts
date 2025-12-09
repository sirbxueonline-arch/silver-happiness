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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        grade: true,
        subjects: true,
        defaultLanguage: true,
      },
    })

    // Consider onboarding complete if user has set preferences
    const needsOnboarding =
      !user?.grade && (!user?.subjects || user.subjects === "[]")

    return NextResponse.json({ needsOnboarding })
  } catch (error) {
    console.error("Check onboarding error:", error)
    return NextResponse.json(
      { error: "Failed to check onboarding" },
      { status: 500 }
    )
  }
}

