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

    const [totalItems, thisMonthItems, favoritesCount, allItems] =
      await Promise.all([
        prisma.libraryItem.count({
          where: { userId },
        }),
        prisma.libraryItem.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
        prisma.libraryItem.count({
          where: { userId, favorite: true },
        }),
        prisma.libraryItem.findMany({
          where: { userId },
          select: { type: true },
        }),
      ])

    const typeDistribution: Record<string, number> = {}
    allItems.forEach((item) => {
      typeDistribution[item.type] = (typeDistribution[item.type] || 0) + 1
    })

    const mostUsedType =
      Object.entries(typeDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A"

    return NextResponse.json({
      totalItems,
      thisMonthItems,
      favoritesCount,
      typeDistribution,
      mostUsedType,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

