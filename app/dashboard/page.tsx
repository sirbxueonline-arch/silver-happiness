"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUsage } from "@/lib/hooks/use-usage"
import { FileText, BookOpen, HelpCircle, Calendar, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { usage } = useUsage()
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated" && session?.user?.id) {
      fetch("/api/user/check-onboarding")
        .then((res) => res.json())
        .then((data) => {
          if (data.needsOnboarding) {
            router.push("/onboarding")
          } else {
            setCheckingOnboarding(false)
          }
        })
        .catch(() => setCheckingOnboarding(false))
    }
  }, [status, router, session])

  if (status === "loading" || checkingOnboarding) {
    return <div className="container p-8">Loading...</div>
  }

  if (!session) return null

  return (
    <div className="container p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back{session.user?.name ? `, ${session.user.name}` : ""}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your studies today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources Used</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage?.resourcesUsed || 0}/{usage?.resourceLimit || 20}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/generate">
              <Button className="w-full">Generate Content</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <Link href="/generate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Content
              </CardTitle>
              <CardDescription>
                Create explanations, flashcards, quizzes, and study plans
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors">
          <Link href="/content">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                My Content
              </CardTitle>
              <CardDescription>
                View and manage your saved study materials
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors">
          <Link href="/analytics">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                Track your study progress and insights
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}

