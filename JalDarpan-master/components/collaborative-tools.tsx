"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Users, MessageSquare, Share2, FileText, Plus } from "lucide-react"

interface Annotation {
  id: string
  author: string
  content: string
  timestamp: string
  location: string
  type: "observation" | "hypothesis" | "concern" | "recommendation"
}

interface SharedReport {
  id: string
  title: string
  author: string
  collaborators: string[]
  lastModified: string
  status: "draft" | "review" | "published"
}

const mockAnnotations: Annotation[] = [
  {
    id: "1",
    author: "Dr. Sarah Chen",
    content: "Unusual temperature patterns observed. Recommend increasing monitoring frequency.",
    timestamp: "2024-01-15T14:30:00Z",
    location: "Pacific Research Station Alpha",
    type: "recommendation",
  },
  {
    id: "2",
    author: "Prof. Michael Torres",
    content: "This correlates with the migration patterns we observed last month. Possible climate impact?",
    timestamp: "2024-01-15T13:45:00Z",
    location: "Arctic Marine Station",
    type: "hypothesis",
  },
]

const mockReports: SharedReport[] = [
  {
    id: "1",
    title: "Q1 2024 Marine Biodiversity Assessment",
    author: "Dr. Sarah Chen",
    collaborators: ["Prof. Michael Torres", "Dr. Lisa Park"],
    lastModified: "2024-01-15T16:20:00Z",
    status: "review",
  },
  {
    id: "2",
    title: "Temperature Anomaly Investigation",
    author: "Prof. Michael Torres",
    collaborators: ["Dr. Sarah Chen"],
    lastModified: "2024-01-15T12:10:00Z",
    status: "draft",
  },
]

export function CollaborativeTools() {
  const [newAnnotation, setNewAnnotation] = useState("")
  const [annotations, setAnnotations] = useState<Annotation[]>(mockAnnotations)

  const addAnnotation = () => {
    if (newAnnotation.trim()) {
      const annotation: Annotation = {
        id: Date.now().toString(),
        author: "Current User",
        content: newAnnotation,
        timestamp: new Date().toISOString(),
        location: "Current View",
        type: "observation",
      }
      setAnnotations([annotation, ...annotations])
      setNewAnnotation("")
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "observation":
        return "bg-blue-100 text-blue-800"
      case "hypothesis":
        return "bg-purple-100 text-purple-800"
      case "concern":
        return "bg-red-100 text-red-800"
      case "recommendation":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Research Annotations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Research Annotations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add new annotation */}
            <div className="space-y-3">
              <Textarea
                placeholder="Add your observation, hypothesis, or recommendation..."
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                className="min-h-20"
              />
              <Button onClick={addAnnotation} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Annotation
              </Button>
            </div>

            {/* Annotations list */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {annotations.map((annotation) => (
                <div key={annotation.id} className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{annotation.author}</span>
                      <Badge className={getTypeColor(annotation.type)}>{annotation.type}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(annotation.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{annotation.content}</p>
                  <p className="text-xs text-muted-foreground">{annotation.location}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shared Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Collaborative Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create New Report
            </Button>

            <div className="space-y-4">
              {mockReports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">by {report.author}</p>
                    </div>
                    <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex gap-1">
                      {report.collaborators.map((collaborator, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {collaborator}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Modified {new Date(report.lastModified).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
