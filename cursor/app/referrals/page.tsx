"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Share2, Users } from "lucide-react"

export default function ReferralsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [referralCode, setReferralCode] = useState("")
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (session?.user?.id) {
      // Generate referral code from user ID
      const code = session.user.id.slice(0, 8).toUpperCase()
      setReferralCode(code)
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/referrals/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch referral stats", error)
    }
  }

  const handleCopy = () => {
    const referralLink = `${window.location.origin}/auth/signup?ref=${referralCode}`
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied",
      description: "Referral link copied to clipboard",
    })
  }

  const handleShare = async () => {
    const referralLink = `${window.location.origin}/auth/signup?ref=${referralCode}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join StudyPilot",
          text: "Check out StudyPilot - AI-powered study tools!",
          url: referralLink,
        })
      } catch (error) {
        // User cancelled or error
      }
    } else {
      handleCopy()
    }
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/signup?ref=${referralCode}`

  return (
    <div className="container p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Referrals</h1>
        <p className="text-muted-foreground mt-2">
          Share StudyPilot with friends and earn rewards
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>
              Share this code with friends to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralCode} readOnly className="font-mono" />
              <Button onClick={handleCopy} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Referral Link
              </Label>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="text-xs" />
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Stats</CardTitle>
            <CardDescription>Track your referral activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Total Referrals</span>
                </div>
                <span className="text-2xl font-bold">
                  {stats?.totalReferrals || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Successful Signups</span>
                <span className="text-2xl font-bold">
                  {stats?.successfulSignups || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Share your referral link with friends</li>
            <li>They sign up using your link</li>
            <li>You both get rewards (coming soon!)</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}

