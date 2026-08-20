"use client"

import { TopNavigation } from "@/components/top-navigation"
import { OtolithClassifier } from "@/components/ai/otolith-classifier"
import { DNASequencer } from "@/components/ai/dna-sequencer"

export default function AIPredictionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <div>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">AI Prediction Modules</h1>
              <p className="text-muted-foreground">
                Advanced AI-powered tools for marine species identification and analysis
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <OtolithClassifier />
              <DNASequencer />
            </div>

            {/* Information Section */}
            <div className="mt-12 bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">About AI Predictions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Otolith Classification</h3>
                  <p className="text-sm text-muted-foreground">
                    Otoliths are calcium carbonate structures found in fish inner ears. Their unique shapes and growth
                    patterns can be used to identify species, age, and environmental conditions. Our AI model analyzes
                    otolith images to provide accurate species identification.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">DNA Sequence Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    DNA barcoding uses short genetic sequences to identify species. Our system compares input sequences
                    against a comprehensive database of marine species to find the closest genetic matches, enabling
                    precise taxonomic identification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
