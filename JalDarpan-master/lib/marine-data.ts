export type StationStatus = "active" | "maintenance" | "offline"

export interface MarineStation {
  id: string
  name: string
  location: string
  lat: number
  lng: number
  temperature: number
  salinity: number
  chlorophyll: number
  speciesCount: number
  biodiversityIndex: number
  status: StationStatus
  lastUpdated: string
  surveyType: "CMLRE" | "Research" | "Monitoring"
  depth: number
  note: string
}

export interface OceanReading {
  date: string
  temperature: number
  salinity: number
  chlorophyll: number
}

export interface FishRecord {
  species: string
  abundance: number
  region: string
}

const stations: MarineStation[] = [
  { id: "arabian-sea", name: "Arabian Sea Observatory", location: "Mumbai shelf", lat: 19.076, lng: 72.8777, temperature: 28.5, salinity: 35.2, chlorophyll: 0.8, speciesCount: 187, biodiversityIndex: 8.2, status: "active", lastUpdated: "2026-08-19T10:30:00Z", surveyType: "CMLRE", depth: 45, note: "High biodiversity hotspot" },
  { id: "bay-bengal", name: "Bay of Bengal Monitor", location: "Visakhapatnam basin", lat: 17.6868, lng: 83.2185, temperature: 29.1, salinity: 33.8, chlorophyll: 1.2, speciesCount: 234, biodiversityIndex: 9.1, status: "active", lastUpdated: "2026-08-19T09:45:00Z", surveyType: "Research", depth: 62, note: "Seasonal migration route" },
  { id: "lakshadweep", name: "Lakshadweep Observatory", location: "Kavaratti reef", lat: 10.5667, lng: 72.6417, temperature: 30.3, salinity: 36.1, chlorophyll: 0.6, speciesCount: 156, biodiversityIndex: 7.8, status: "maintenance", lastUpdated: "2026-08-18T16:20:00Z", surveyType: "CMLRE", depth: 28, note: "Coral reef ecosystem" },
  { id: "andaman", name: "Andaman Sea Station", location: "Port Blair trench", lat: 11.7401, lng: 92.6586, temperature: 29.8, salinity: 34.5, chlorophyll: 0.9, speciesCount: 198, biodiversityIndex: 8.7, status: "active", lastUpdated: "2026-08-19T11:15:00Z", surveyType: "Monitoring", depth: 78, note: "Deep sea monitoring" },
  { id: "kochi", name: "Kochi Coastal Hub", location: "Kerala coast", lat: 9.9312, lng: 76.2673, temperature: 27.8, salinity: 34.2, chlorophyll: 1.1, speciesCount: 143, biodiversityIndex: 7.2, status: "active", lastUpdated: "2026-08-19T14:30:00Z", surveyType: "CMLRE", depth: 35, note: "Coastal ecosystem study" },
  { id: "chennai", name: "Chennai Marine Station", location: "Chennai shelf", lat: 13.0827, lng: 80.2707, temperature: 28.9, salinity: 35.1, chlorophyll: 0.7, speciesCount: 167, biodiversityIndex: 7.9, status: "offline", lastUpdated: "2026-08-17T12:20:00Z", surveyType: "Research", depth: 52, note: "Connection lost" },
]

const fish: FishRecord[] = [
  { species: "Indian Mackerel", abundance: 482, region: "Arabian Sea" },
  { species: "Yellowfin Tuna", abundance: 396, region: "Indian Ocean" },
  { species: "Oil Sardine", abundance: 351, region: "Kerala coast" },
  { species: "Skipjack Tuna", abundance: 288, region: "Bay of Bengal" },
  { species: "Anchovy", abundance: 244, region: "Tamil Nadu coast" },
  { species: "Sea Bass", abundance: 198, region: "Andaman Sea" },
  { species: "Ribbonfish", abundance: 164, region: "Konkan coast" },
  { species: "Pomfret", abundance: 137, region: "Gujarat coast" },
]

const predictions = [
  { id: 1, type: "otolith_classification", species: "Indian Mackerel", confidence: 0.94, timestamp: "2026-08-19T11:20:00Z" },
  { id: 2, type: "dna_sequence_match", species: "Yellowfin Tuna", confidence: 0.87, timestamp: "2026-08-19T09:20:00Z" },
  { id: 3, type: "otolith_classification", species: "Oil Sardine", confidence: 0.91, timestamp: "2026-08-19T06:20:00Z" },
]

export function getStations() { return stations }
export function getFishData() { return fish }
export function getBiodiversityData() { return { pelagic: 168, benthic: 126, crustaceans: 84, others: 57 } }
export function getAIPredictions() { return predictions }

export function getOceanData(days = 30): OceanReading[] {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(Date.UTC(2026, 7, 20 - days + index))
    return {
      date: date.toISOString().split("T")[0],
      temperature: Math.round((28.1 + Math.sin(index / 4) * 1.3) * 10) / 10,
      salinity: Math.round((34.8 + Math.cos(index / 5) * 0.6) * 10) / 10,
      chlorophyll: Math.round((0.85 + Math.sin(index / 3) * 0.22) * 100) / 100,
    }
  })
}
