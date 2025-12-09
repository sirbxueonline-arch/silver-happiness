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

    const userId = session.user.id

    const [totalReferrals, successfulSignups] = await Promise.all([
      prisma.referralEvent.count({
        where: { userId, type: "INVITE_SENT" },
      }),
      prisma.referralEvent.count({
        where: { userId, type: "SIGNUP" },
      }),
    ])

    return NextResponse.json({
      totalReferrals,
      successfulSignups,
    })
  } catch (error) {
    console.error("Referral stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch referral stats" },
      { status: 500 }
    )
  }
}

