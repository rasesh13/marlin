"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Brain, CheckCircle, AlertCircle } from "lucide-react"

interface PredictionResult {
  species: string
  confidence: number
  timestamp: string
}

export function OtolithClassifier() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/predict-otolith", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.prediction)
      } else {
        setError(data.error || "Failed to classify otolith")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Otolith Classification
        </CardTitle>
        <CardDescription>Upload an otolith image to identify the fish species using AI analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="otolith-image">Otolith Image</Label>
            <Input id="otolith-image" type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">Supported formats: JPG, PNG, GIF (max 10MB)</p>
          </div>

          <Button type="submit" disabled={!file || loading} className="w-full">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Classify Otolith
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Classification Result</h4>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Species:</span> {result.species}
              </p>
              <p className="text-sm">
                <span className="font-medium">Confidence:</span> {Math.round(result.confidence * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">Analyzed at {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
