"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Thermometer, Droplets, Fish, Search, Calendar, Layers, TrendingUp } from "lucide-react"
import L from "leaflet"

interface MarineStation {
  id: string
  name: string
  lat: number
  lng: number
  temperature: number
  salinity: number
  chlorophyll: number
  species_count: number
  biodiversity_index: number
  status: "active" | "inactive" | "maintenance"
  last_updated: string
  survey_type: "CMLRE" | "Research" | "Monitoring"
  depth: number
  notes?: string
}

interface DataLayer {
  id: string
  name: string
  enabled: boolean
  color: string
  icon: any
}

const mockStations: MarineStation[] = [
  {
    id: "1",
    name: "Arabian Sea Research Station",
    lat: 19.076,
    lng: 72.8777,
    temperature: 28.5,
    salinity: 35.2,
    chlorophyll: 0.8,
    species_count: 187,
    biodiversity_index: 8.2,
    status: "active",
    last_updated: "2024-01-15T10:30:00Z",
    survey_type: "CMLRE",
    depth: 45,
    notes: "High biodiversity hotspot",
  },
  {
    id: "2",
    name: "Bay of Bengal Monitor",
    lat: 21.2787,
    lng: 81.8661,
    temperature: 29.1,
    salinity: 33.8,
    chlorophyll: 1.2,
    species_count: 234,
    biodiversity_index: 9.1,
    status: "active",
    last_updated: "2024-01-15T09:45:00Z",
    survey_type: "Research",
    depth: 62,
    notes: "Seasonal migration route",
  },
  {
    id: "3",
    name: "Lakshadweep Marine Observatory",
    lat: 10.5667,
    lng: 72.6417,
    temperature: 30.3,
    salinity: 36.1,
    chlorophyll: 0.6,
    species_count: 156,
    biodiversity_index: 7.8,
    status: "maintenance",
    last_updated: "2024-01-14T16:20:00Z",
    survey_type: "CMLRE",
    depth: 28,
    notes: "Coral reef ecosystem",
  },
  {
    id: "4",
    name: "Andaman Sea Station",
    lat: 11.7401,
    lng: 92.6586,
    temperature: 29.8,
    salinity: 34.5,
    chlorophyll: 0.9,
    species_count: 198,
    biodiversity_index: 8.7,
    status: "active",
    last_updated: "2024-01-15T11:15:00Z",
    survey_type: "Monitoring",
    depth: 78,
    notes: "Deep sea monitoring",
  },
  {
    id: "5",
    name: "Kochi Coastal Research Hub",
    lat: 9.9312,
    lng: 76.2673,
    temperature: 27.8,
    salinity: 34.2,
    chlorophyll: 1.1,
    species_count: 143,
    biodiversity_index: 7.2,
    status: "active",
    last_updated: "2024-01-15T14:30:00Z",
    survey_type: "CMLRE",
    depth: 35,
    notes: "Coastal ecosystem study",
  },
  {
    id: "6",
    name: "Chennai Marine Station",
    lat: 13.0827,
    lng: 80.2707,
    temperature: 28.9,
    salinity: 35.1,
    chlorophyll: 0.7,
    species_count: 167,
    biodiversity_index: 7.9,
    status: "active",
    last_updated: "2024-01-15T12:20:00Z",
    survey_type: "Research",
    depth: 52,
    notes: "Urban coastal impact study",
  },
]

export function InteractiveMap() {
  const [selectedStation, setSelectedStation] = useState<MarineStation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [timeSlider, setTimeSlider] = useState([6]) // Months (0-11)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [dataLayers, setDataLayers] = useState<DataLayer[]>([
    { id: "temperature", name: "Ocean Temperature", enabled: true, color: "#EF4444", icon: Thermometer },
    { id: "salinity", name: "Salinity Levels", enabled: false, color: "#3B82F6", icon: Droplets },
    { id: "chlorophyll", name: "Chlorophyll Density", enabled: false, color: "#10B981", icon: Fish },
    { id: "biodiversity", name: "Biodiversity Hotspots", enabled: false, color: "#8B5CF6", icon: TrendingUp },
    { id: "surveys", name: "CMLRE Surveys", enabled: true, color: "#F59E0B", icon: MapPin },
  ])

  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const layersRef = useRef<any[]>([])

  const initializeMap = async () => {
    let map: any

    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    })

    if (mapRef.current && !leafletMapRef.current) {
      map = L.map(mapRef.current, {
        center: [15.0, 77.0], // Center on India
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
        minZoom: 4,
        maxZoom: 12,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map)

      leafletMapRef.current = map
      setMapLoaded(true)

      updateDataLayers()
      updateMarkers()
    }
  }

  const updateDataLayers = () => {
    if (!leafletMapRef.current) return

    layersRef.current.forEach((layer) => {
      leafletMapRef.current.removeLayer(layer)
    })
    layersRef.current = []

    dataLayers.forEach((layer) => {
      if (!layer.enabled) return

      switch (layer.id) {
        case "temperature":
          addTemperatureLayer()
          break
        case "salinity":
          addSalinityLayer()
          break
        case "chlorophyll":
          addChlorophyllLayer()
          break
        case "biodiversity":
          addBiodiversityLayer()
          break
      }
    })
  }

  const addTemperatureLayer = () => {
    mockStations.forEach((station) => {
      const radius = Math.max(20, station.temperature * 2)
      const opacity = 0.3

      let color = "#3B82F6" // Blue for cold
      if (station.temperature > 29)
        color = "#EF4444" // Red for hot
      else if (station.temperature > 27) color = "#F97316" // Orange for warm

      const circle = L.circle([station.lat, station.lng], {
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        radius: radius * 1000, // Convert to meters
        weight: 2,
      }).addTo(leafletMapRef.current)

      layersRef.current.push(circle)
    })
  }

  const addSalinityLayer = () => {
    mockStations.forEach((station) => {
      const radius = Math.max(15, station.salinity * 1.5)

      let color = "#06B6D4" // Cyan for low salinity
      if (station.salinity > 35)
        color = "#8B5CF6" // Purple for high
      else if (station.salinity > 34) color = "#3B82F6" // Blue for medium

      const circle = L.circle([station.lat, station.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        radius: radius * 1000,
        weight: 1,
        dashArray: "5, 5",
      }).addTo(leafletMapRef.current)

      layersRef.current.push(circle)
    })
  }

  const addChlorophyllLayer = () => {
    mockStations.forEach((station) => {
      const radius = Math.max(10, station.chlorophyll * 30)
      const opacity = Math.min(0.6, station.chlorophyll * 0.5)

      const circle = L.circle([station.lat, station.lng], {
        color: "#10B981",
        fillColor: "#10B981",
        fillOpacity: opacity,
        radius: radius * 1000,
        weight: 1,
      }).addTo(leafletMapRef.current)

      layersRef.current.push(circle)
    })
  }

  const addBiodiversityLayer = () => {
    mockStations.forEach((station) => {
      if (station.biodiversity_index > 8) {
        const size = Math.max(15, station.biodiversity_index * 3)

        const circle = L.circle([station.lat, station.lng], {
          color: "#8B5CF6",
          fillColor: "#8B5CF6",
          fillOpacity: 0.4,
          radius: size * 1000,
          weight: 3,
        }).addTo(leafletMapRef.current)

        layersRef.current.push(circle)
      }
    })
  }

  const updateMarkers = () => {
    if (!leafletMapRef.current) return

    markersRef.current.forEach((marker) => {
      leafletMapRef.current.removeLayer(marker)
    })
    markersRef.current = []

    const filteredStations = mockStations.filter(
      (station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.survey_type.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    filteredStations.forEach((station) => {
      const color = getStationColor(station)
      const statusColor = getStatusColor(station.status)

      const markerHtml = `
        <div style="position: relative;">
          <div style="
            width: 24px; 
            height: 24px; 
            background-color: ${color}; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 3px 12px rgba(0,0,0,0.4);
            cursor: pointer;
          "></div>
          <div style="
            position: absolute;
            top: -3px;
            right: -3px;
            width: 10px;
            height: 10px;
            background-color: ${statusColor};
            border: 2px solid white;
            border-radius: 50%;
          "></div>
          ${
            station.survey_type === "CMLRE"
              ? `
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              background: #F59E0B;
              color: white;
              font-size: 8px;
              padding: 1px 3px;
              border-radius: 2px;
              font-weight: bold;
            ">CMLRE</div>
          `
              : ""
          }
          ${
            station.status === "active"
              ? `
            <div style="
              position: absolute;
              top: -4px;
              left: -4px;
              width: 32px;
              height: 32px;
              border: 2px solid ${color};
              border-radius: 50%;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              opacity: 0.3;
            "></div>
          `
              : ""
          }
        </div>
      `

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([station.lat, station.lng], { icon: customIcon })
        .addTo(leafletMapRef.current)
        .on("click", () => {
          setSelectedStation(station)
        })

      marker.bindPopup(`
        <div style="font-family: system-ui; min-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${station.name}</h3>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
            <span style="
              background: ${statusColor}; 
              color: white; 
              padding: 3px 8px; 
              border-radius: 4px; 
              font-size: 11px; 
              text-transform: capitalize;
            ">${station.status}</span>
            <span style="
              background: #F59E0B; 
              color: white; 
              padding: 3px 8px; 
              border-radius: 4px; 
              font-size: 11px;
            ">${station.survey_type}</span>
          </div>
          <div style="font-size: 13px; line-height: 1.5; margin-bottom: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div><strong>Temp:</strong> ${station.temperature}°C</div>
              <div><strong>Salinity:</strong> ${station.salinity} PSU</div>
              <div><strong>Chlorophyll:</strong> ${station.chlorophyll} mg/m³</div>
              <div><strong>Species:</strong> ${station.species_count}</div>
            </div>
          </div>
          <div style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 8px;">
            <div><strong>Depth:</strong> ${station.depth}m</div>
            ${station.notes ? `<div><strong>Notes:</strong> ${station.notes}</div>` : ""}
          </div>
        </div>
      `)

      markersRef.current.push(marker)
    })
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      document.head.appendChild(link)

      const style = document.createElement("style")
      style.textContent = `
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
        }
      `
      document.head.appendChild(style)

      initializeMap()
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapLoaded && leafletMapRef.current) {
      const timer = setTimeout(() => {
        updateDataLayers()
        updateMarkers()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [dataLayers, searchQuery, timeSlider, mapLoaded])

  const getStationColor = (station: MarineStation) => {
    if (station.status === "inactive") return "#9CA3AF"
    if (station.status === "maintenance") return "#EAB308"

    const primaryLayer = dataLayers.find((l) => l.enabled)
    if (!primaryLayer) return "#3B82F6"

    switch (primaryLayer.id) {
      case "temperature":
        if (station.temperature > 29) return "#EF4444"
        if (station.temperature > 27) return "#F97316"
        return "#3B82F6"
      case "salinity":
        if (station.salinity > 35) return "#8B5CF6"
        if (station.salinity > 34) return "#3B82F6"
        return "#06B6D4"
      case "chlorophyll":
        if (station.chlorophyll > 1.0) return "#10B981"
        if (station.chlorophyll > 0.7) return "#EAB308"
        return "#F97316"
      case "biodiversity":
        if (station.biodiversity_index > 8.5) return "#8B5CF6"
        if (station.biodiversity_index > 7.5) return "#3B82F6"
        return "#06B6D4"
      default:
        return "#3B82F6"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10B981"
      case "maintenance":
        return "#EAB308"
      case "inactive":
        return "#EF4444"
      default:
        return "#10B981"
    }
  }

  const toggleLayer = (layerId: string) => {
    setDataLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer)))
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Indian Ocean Marine Monitoring Network
                <Badge variant="outline" className="ml-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Live
                </Badge>
              </CardTitle>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search stations or species..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-3 min-w-[200px]">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time:</span>
                <span className="text-sm text-muted-foreground min-w-[40px]">{monthNames[timeSlider[0]]}</span>
                <Slider value={timeSlider} onValueChange={setTimeSlider} max={11} min={0} step={1} className="flex-1" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full p-0">
            <div className="relative w-full h-full rounded-lg overflow-hidden border">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading Indian Ocean map...</p>
                  </div>
                </div>
              )}

              <div ref={mapRef} className="w-full h-full" style={{ minHeight: "500px" }} />

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20 z-[1000] max-w-[280px]">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Data Layers
                </h4>
                <div className="space-y-3">
                  {dataLayers.map((layer) => {
                    const IconComponent = layer.icon
                    return (
                      <div key={layer.id} className="flex items-center space-x-3">
                        <Checkbox id={layer.id} checked={layer.enabled} onCheckedChange={() => toggleLayer(layer.id)} />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }}></div>
                          <IconComponent className="w-4 h-4" style={{ color: layer.color }} />
                          <label htmlFor={layer.id} className="text-xs font-medium cursor-pointer">
                            {layer.name}
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-mono z-[1000]">
                India EEZ Focus
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Station Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStation ? (
              <div className="space-y-4">
                <div className="pb-3 border-b">
                  <h3 className="font-semibold text-lg mb-2">{selectedStation.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        selectedStation.status === "active"
                          ? "default"
                          : selectedStation.status === "maintenance"
                            ? "secondary"
                            : "destructive"
                      }
                      className="capitalize"
                    >
                      {selectedStation.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedStation.survey_type}
                    </Badge>
                    {selectedStation.status === "active" && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Live Data
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Temperature</p>
                      <p className="text-2xl font-bold text-red-600">{selectedStation.temperature}°C</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Salinity</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedStation.salinity} PSU</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Fish className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Chlorophyll</p>
                      <p className="text-2xl font-bold text-green-600">{selectedStation.chlorophyll} mg/m³</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Biodiversity Index</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedStation.biodiversity_index}/10</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Species Count:</span>
                    <span className="font-medium">{selectedStation.species_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Depth:</span>
                    <span className="font-medium">{selectedStation.depth}m</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{new Date(selectedStation.last_updated).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Coordinates:</span>
                    <span className="font-mono text-xs">
                      {selectedStation.lat.toFixed(4)}, {selectedStation.lng.toFixed(4)}
                    </span>
                  </div>
                  {selectedStation.notes && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground text-sm">Notes:</span>
                      <p className="text-sm mt-1">{selectedStation.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 opacity-50" />
                </div>
                <p className="font-medium mb-1">Select a monitoring station</p>
                <p className="text-sm">Click on any marker to view real-time data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
