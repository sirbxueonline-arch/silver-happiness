import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getMonthKey } from "@/lib/utils"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const monthKey = getMonthKey()

    let usage = await prisma.usage.findUnique({
      where: {
        userId_monthKey: {
          userId,
          monthKey,
        },
      },
    })

    if (!usage) {
      usage = await prisma.usage.create({
        data: {
          userId,
          monthKey,
          resourcesUsed: 0,
          resourceLimit: 20,
        },
      })
    }

    return NextResponse.json({
      resourcesUsed: usage.resourcesUsed,
      resourceLimit: usage.resourceLimit,
      monthKey: usage.monthKey,
    })
  } catch (error) {
    console.error("Usage error:", error)
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    )
  }
}

