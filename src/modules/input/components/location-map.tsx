"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface Location {
  lat: number
  lon: number
  name?: string
}

interface LocationMapProps {
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
  reverseGeocode: (lat: number, lon: number) => Promise<string>
}

export default function LocationMap({ selectedLocation, onLocationSelect, reverseGeocode }: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [coordinates, setCoordinates] = useState<string>("")

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Fix Leaflet default icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    })

    // Initialize map
    const map = L.map(containerRef.current).setView([40.7128, -74.006], 10)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    mapRef.current = map

    // Handle map clicks
    map.on("click", async (e) => {
      const lat = e.latlng.lat
      const lon = e.latlng.lng

      // Remove existing marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      // Add new marker
      markerRef.current = L.marker([lat, lon]).addTo(map)
      setCoordinates(`Selected: ${lat.toFixed(6)}, ${lon.toFixed(6)}`)

      // Get location name and notify parent
      const name = await reverseGeocode(lat, lon)
      onLocationSelect({ lat, lon, name })
    })

    // Set initial location if provided
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lon], 13)
      markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lon]).addTo(map)
      setCoordinates(`Selected: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lon.toFixed(6)}`)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current)
    }

    markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lon]).addTo(mapRef.current)
    mapRef.current.setView([selectedLocation.lat, selectedLocation.lon], 13)
    setCoordinates(`Selected: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lon.toFixed(6)}`)
  }, [selectedLocation])

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="w-full h-64 rounded-lg border border-gray-300 z-0" />
      {coordinates && <div className="text-sm text-gray-500">{coordinates}</div>}
    </div>
  )
}
