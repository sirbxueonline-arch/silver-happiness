"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Search, Grid, List, Star, Trash2, Download } from "lucide-react"

interface LibraryItem {
  id: string
  type: string
  title: string
  subject?: string
  favorite: boolean
  createdAt: string
}

export default function ContentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [items, setItems] = useState<LibraryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/library")
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/library/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Deleted",
        description: "Item deleted successfully",
      })

      fetchItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const handleToggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const response = await fetch(`/api/library/${id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !currentFavorite }),
      })

      if (!response.ok) throw new Error("Failed to update")

      fetchItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
      })
    }
  }

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="container p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Content</h1>
          <p className="text-muted-foreground mt-2">
            Manage your saved study materials
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "No items match your search" : "No content yet. Start generating!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {item.type} • {new Date(item.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(item.id, item.favorite)}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        item.favorite ? "fill-yellow-400 text-yellow-400" : ""
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

