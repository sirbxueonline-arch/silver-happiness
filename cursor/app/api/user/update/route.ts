import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      grade,
      subjects,
      defaultLanguage,
      explanationStyleDefault,
      hintModeDefault,
    } = body

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        grade: grade || null,
        subjects: JSON.stringify(subjects || []),
        defaultLanguage: defaultLanguage || "en",
        explanationStyleDefault: explanationStyleDefault || "balanced",
        hintModeDefault: hintModeDefault || false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

