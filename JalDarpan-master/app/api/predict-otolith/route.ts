import { NextResponse } from "next/server"

const mockSpecies = ["Atlantic Cod", "Bluefin Tuna", "Haddock", "Mackerel", "Sardine", "Sea Bass", "Flounder"]

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock prediction result
    const species = mockSpecies[Math.floor(Math.random() * mockSpecies.length)]
    const confidence = Math.round((0.75 + Math.random() * 0.24) * 100) / 100

    return NextResponse.json({
      success: true,
      prediction: {
        species,
        confidence,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process otolith image" }, { status: 500 })
  }
}
