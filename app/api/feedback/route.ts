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
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    await prisma.feedbackRequest.create({
      data: {
        userId: session.user.id,
        message,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    )
  }
}

