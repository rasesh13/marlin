"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dna, CheckCircle, AlertCircle } from "lucide-react"

interface PredictionResult {
  species: string
  confidence: number
  timestamp: string
  sequenceLength: number
}

export function DNASequencer() {
  const [sequence, setSequence] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sequence.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict-dna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sequence: sequence.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.prediction)
      } else {
        setError(data.error || "Failed to analyze DNA sequence")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleExampleSequence = () => {
    const exampleSequence = `>Example_Fish_DNA_Sequence
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC
GATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC
GATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC
GATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC`
    setSequence(exampleSequence)
    setResult(null)
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-accent" />
          DNA Sequence Analysis
        </CardTitle>
        <CardDescription>Input a DNA sequence (FASTA format) to find the closest matching fish species</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dna-sequence">DNA Sequence</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleExampleSequence}>
                Load Example
              </Button>
            </div>
            <Textarea
              id="dna-sequence"
              placeholder="Paste your DNA sequence here (FASTA format)..."
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              className="mt-1 min-h-32 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Accepts FASTA format with nucleotide sequences (A, T, C, G)
            </p>
          </div>

          <Button type="submit" disabled={!sequence.trim() || loading} className="w-full">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing Sequence...
              </>
            ) : (
              <>
                <Dna className="w-4 h-4 mr-2" />
                Analyze DNA
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
          <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-foreground">Analysis Result</h4>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Closest Match:</span> {result.species}
              </p>
              <p className="text-sm">
                <span className="font-medium">Confidence:</span> {Math.round(result.confidence * 100)}%
              </p>
              <p className="text-sm">
                <span className="font-medium">Sequence Length:</span> {result.sequenceLength} nucleotides
              </p>
              <p className="text-xs text-muted-foreground">Analyzed at {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
