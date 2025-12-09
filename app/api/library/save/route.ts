import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getMonthKey } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { type, title, subject, tags, payload } = body

    if (!type || !title || !payload) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const userId = session.user.id
    const monthKey = getMonthKey()

    // Transaction: Check usage and create library item
    const result = await prisma.$transaction(async (tx) => {
      // Get or create usage record
      let usage = await tx.usage.findUnique({
        where: {
          userId_monthKey: {
            userId,
            monthKey,
          },
        },
      })

      if (!usage) {
        usage = await tx.usage.create({
          data: {
            userId,
            monthKey,
            resourcesUsed: 0,
            resourceLimit: 20,
          },
        })
      }

      // Check limit
      if (usage.resourcesUsed >= usage.resourceLimit) {
        throw new Error("RESOURCE_LIMIT")
      }

      // Increment usage and create library item
      await tx.usage.update({
        where: { id: usage.id },
        data: {
          resourcesUsed: {
            increment: 1,
          },
        },
      })

      const libraryItem = await tx.libraryItem.create({
        data: {
          userId,
          type,
          title,
          subject: subject || null,
          tags: JSON.stringify(tags || []),
          payload: JSON.stringify(payload),
        },
      })

      return libraryItem
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    if (error.message === "RESOURCE_LIMIT") {
      return NextResponse.json(
        {
          code: "RESOURCE_LIMIT",
          monthKey: getMonthKey(),
          message: "Monthly resource limit reached",
        },
        { status: 403 }
      )
    }

    console.error("Save error:", error)
    return NextResponse.json(
      { error: "Failed to save item" },
      { status: 500 }
    )
  }
}

