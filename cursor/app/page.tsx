import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex h-16 items-center justify-between px-4">
        <div className="text-xl font-bold text-primary">StudyPilot</div>
        <div className="flex gap-2">
          <Link href="/auth/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-8 px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            AI-Powered Study Tools
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Transform your study materials into explanations, flashcards, quizzes, and study plans with the power of AI.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/signup">
              <Button size="lg">Start Free</Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="container px-4 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Explain</CardTitle>
                <CardDescription>
                  Get detailed explanations of complex topics
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Flashcards</CardTitle>
                <CardDescription>
                  Create interactive flashcards for memorization
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quiz</CardTitle>
                <CardDescription>
                  Generate practice quizzes to test your knowledge
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Study Plans</CardTitle>
                <CardDescription>
                  Get personalized study plans tailored to your needs
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

