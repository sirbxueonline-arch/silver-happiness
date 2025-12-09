"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Copy, Download, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type ToolType = "explain" | "flashcards" | "quiz" | "plan"
type ResultType = any

export default function GeneratePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [tool, setTool] = useState<ToolType>("explain")
  const [inputText, setInputText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<ResultType | null>(null)
  const [language, setLanguage] = useState("en")
  const [explanationStyle, setExplanationStyle] = useState("balanced")
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setResult(null)

    // Create abort controller
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          inputType: "text",
          text: inputText,
          settings: {
            language,
            explanationStyle,
          },
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error("Generation failed")
      }

      const data = await response.json()
      setResult(data.data)
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast({
          title: "Cancelled",
          description: "Generation was cancelled",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to generate content",
          variant: "destructive",
        })
      }
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleSave = async () => {
    if (!result) return

    try {
      const response = await fetch("/api/library/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tool.toUpperCase(),
          title: `Generated ${tool}`,
          payload: result,
        }),
      })

      const data = await response.json()

      if (response.status === 403 && data.code === "RESOURCE_LIMIT") {
        toast({
          title: "Limit Reached",
          description: "You've reached your monthly resource limit (20 items)",
          variant: "destructive",
        })
        return
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to save")
      }

      toast({
        title: "Saved",
        description: "Content saved to My Content",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      })
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const renderResult = () => {
    if (!result) return null

    switch (tool) {
      case "explain":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Explanation</h3>
              <p className="text-muted-foreground">{result.explanation}</p>
            </div>
            {result.keyPoints && result.keyPoints.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Points</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.keyPoints.map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.examples && result.examples.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Examples</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.examples.map((example: string, i: number) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )

      case "flashcards":
        return (
          <div className="space-y-4">
            {result.cards?.map((card: any, i: number) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">Card {i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <strong>Front:</strong> {card.front}
                  </div>
                  <div>
                    <strong>Back:</strong> {card.back}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case "quiz":
        return (
          <div className="space-y-4">
            {result.questions?.map((q: any, i: number) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">Question {i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <strong>Q:</strong> {q.question}
                  </div>
                  <div>
                    <strong>Options:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {q.options?.map((opt: string, j: number) => (
                        <li key={j}>
                          {opt} {j === q.correctAnswer && "✓"}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {q.explanation && (
                    <div>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case "plan":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
              <p className="text-muted-foreground">
                Estimated time: {result.estimatedTime}
              </p>
            </div>
            {result.steps?.map((step: any, i: number) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Step {i + 1}: {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{step.description}</p>
                  {step.duration && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Duration: {step.duration}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )

      default:
        return <pre>{JSON.stringify(result, null, 2)}</pre>
    }
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold mb-8">Generation Studio</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tool">Tool</Label>
                <Select value={tool} onValueChange={(v) => setTool(v as ToolType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="explain">Explain</SelectItem>
                    <SelectItem value="flashcards">Flashcards</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="plan">Study Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tool === "explain" && (
                <div className="space-y-2">
                  <Label htmlFor="style">Explanation Style</Label>
                  <Select
                    value={explanationStyle}
                    onValueChange={setExplanationStyle}
                  >
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
              )}

              <div className="space-y-2">
                <Label htmlFor="text">Text</Label>
                <Textarea
                  id="text"
                  placeholder="Enter your study material here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={10}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !inputText.trim()}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
                {isGenerating && (
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Results</CardTitle>
                {result && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Generating content...</p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {renderResult()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Generated content will appear here
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

