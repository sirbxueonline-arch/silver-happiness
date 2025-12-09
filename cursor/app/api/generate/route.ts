import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAIProvider } from "@/lib/ai-provider"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { tool, inputType, text, settings } = body

    if (!tool || !inputType || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const provider = getAIProvider()
    const options = {
      tool,
      inputType,
      text,
      settings: settings || {},
    }

    let result

    switch (tool) {
      case "explain":
        result = await provider.generateExplain(options)
        break
      case "flashcards":
        result = await provider.generateFlashcards(options)
        break
      case "quiz":
        result = await provider.generateQuiz(options)
        break
      case "plan":
        result = await provider.generatePlan(options)
        break
      default:
        return NextResponse.json(
          { error: "Invalid tool" },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}

