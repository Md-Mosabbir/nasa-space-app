"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
  ),
});

interface Location {
  lat: number;
  lon: number;
  name?: string;
}

interface LocationPickerProps {
  onLocationChange?: (location: Location) => void;
}

export function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const [inputMode, setInputMode] = useState<"search" | "map">("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const OPENCAGE_KEY = process.env.NEXT_PUBLIC_OPENCAGE_KEY;

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Geocode search using OpenCage
  async function geocodeSearch(query: string) {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_KEY}&limit=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.results.map((r: any) => ({
        name: r.formatted,
        lat: r.geometry.lat,
        lon: r.geometry.lng,
      }));
    } catch (e) {
      console.error("Geocoding error:", e);
      throw e;
    }
  }

  // Reverse geocode coordinates to location name
  async function reverseGeocode(lat: number, lon: number) {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_KEY}&no_annotations=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return (
        data.results[0]?.formatted || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      );
    } catch (e) {
      console.error("Reverse geocoding error:", e);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }

  // Handle search input
  function handleSearchInput(value: string) {
    setSearchTerm(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.trim().length < 2) {
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await geocodeSearch(value);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }

  // Handle location selection
  function handleLocationSelect(location: Location) {
    setSelectedLocation(location);
    setSearchTerm(
      location.name || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`,
    );
    setShowResults(false);
    onLocationChange?.(location);
  }

  // Get current location
  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const location: Location = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          const name = await reverseGeocode(location.lat, location.lon);
          location.name = name;
          setSearchTerm("Current Location");
          handleLocationSelect(location);
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Unable to retrieve your location. Check browser settings.");
        },
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => setInputMode("search")}
          type="button"
          className={`${
            inputMode === "search"
              ? "bg-[#52B788] hover:bg-[#52B788]/90 text-white"
              : "bg-transparent text-gray-500 hover:bg-gray-100"
          }`}
          size="sm"
        >
          Search
        </Button>
        <Button
          type="button"
          onClick={() => setInputMode("map")}
          className={`${
            inputMode === "map"
              ? "bg-[#52B788] hover:bg-[#52B788]/90 text-white"
              : "bg-transparent text-gray-500 hover:bg-gray-100"
          }`}
          size="sm"
        >
          Map
        </Button>
      </div>

      {inputMode === "search" && (
        <div className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Choose your current location"
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="pl-4 pr-10 py-6 bg-[#585858] border-none text-white placeholder:text-[#d9d9d9]"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52B788]" />
            {isSearching && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg p-2">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(result)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">
                    {result.name?.split(",")[0]}
                  </div>
                  <div className="text-xs text-gray-500">{result.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={getCurrentLocation}
            type="button"
            className="flex items-center gap-2 text-[#52B788] hover:text-[#52B788]/80 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span className="text-sm">Use Current Location</span>
          </button>
        </div>
      )}

      {inputMode === "map" && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400 mb-2">
            Click on the map to select a location
          </div>
          <MapComponent
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            reverseGeocode={reverseGeocode}
          />
        </div>
      )}
    </div>
  );
}
