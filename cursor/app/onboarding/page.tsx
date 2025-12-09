"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [grade, setGrade] = useState("")
  const [subjects, setSubjects] = useState<string[]>([])
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [explanationStyle, setExplanationStyle] = useState("balanced")
  const [hintMode, setHintMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const availableSubjects = [
    "Mathematics",
    "Science",
    "History",
    "English",
    "Geography",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
  ]

  const toggleSubject = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subjects,
          defaultLanguage,
          explanationStyleDefault: explanationStyle,
          hintModeDefault: hintMode,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to StudyPilot!</CardTitle>
          <CardDescription>
            Let's set up your profile to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level (Optional)</Label>
              <Input
                id="grade"
                type="text"
                placeholder="e.g., 10th Grade, College Freshman"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Subjects (Select all that apply)</Label>
              <div className="flex flex-wrap gap-2">
                {availableSubjects.map((subject) => (
                  <Button
                    key={subject}
                    type="button"
                    variant={subjects.includes(subject) ? "default" : "outline"}
                    onClick={() => toggleSubject(subject)}
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Explanation Style</Label>
              <Select value={explanationStyle} onValueChange={setExplanationStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

