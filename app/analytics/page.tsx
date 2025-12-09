"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#7C3AED", "#EC4899", "#22D3EE", "#FBBF24"]

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const chartData = stats?.typeDistribution
    ? Object.entries(stats.typeDistribution).map(([type, count]) => ({
        type,
        count,
      }))
    : []

  const pieData = chartData.map((item) => ({
    name: item.type,
    value: item.count,
  }))

  return (
    <div className="container p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your study progress and insights
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalItems || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.thisMonthItems || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.favoritesCount || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Most Used Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.mostUsedType || "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content by Type</CardTitle>
            <CardDescription>Distribution of your saved content</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#7C3AED" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Type Distribution</CardTitle>
            <CardDescription>Pie chart view</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

