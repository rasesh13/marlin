import { NextResponse } from "next/server"

const mockSpecies = ["Atlantic Cod", "Bluefin Tuna", "Haddock", "Mackerel", "Sardine", "Sea Bass", "Flounder"]

export async function POST(request: Request) {
  try {
    const { sequence } = await request.json()

    if (!sequence || typeof sequence !== "string") {
      return NextResponse.json({ success: false, error: "No DNA sequence provided" }, { status: 400 })
    }

    // Basic validation for DNA sequence format
    if (!/^[ATCG\s\n>]+$/i.test(sequence)) {
      return NextResponse.json({ success: false, error: "Invalid DNA sequence format" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock prediction result
    const species = mockSpecies[Math.floor(Math.random() * mockSpecies.length)]
    const confidence = Math.round((0.7 + Math.random() * 0.29) * 100) / 100

    return NextResponse.json({
      success: true,
      prediction: {
        species,
        confidence,
        timestamp: new Date().toISOString(),
        sequenceLength: sequence.replace(/[^ATCG]/gi, "").length,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process DNA sequence" }, { status: 500 })
  }
}
