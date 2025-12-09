import { useEffect, useState } from "react"

export interface UsageData {
  resourcesUsed: number
  resourceLimit: number
  monthKey: string
}

export function useUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        setUsage(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  return { usage, isLoading }
}

