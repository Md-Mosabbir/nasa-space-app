"use client";

import { useState } from "react";
import { ActivitySelector } from "./components/activity-selector";
import { EventDatePicker } from "./components/date-picker";
import { LocationPicker } from "./components/location-picker";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  AnalyseActivityRequest,
  setLastAnalyseRequest,
  setLastAnalyseResponse,
} from "@/lib/analysis-store";
import { useRouter } from "next/navigation";

interface LocationValue {
  lat: number;
  lon: number;
  name?: string;
}

function getApiUrl(path: string) {
  if (process.env.NODE_ENV === "development") {
    // Dev: hit localhost backend directly
    return `http://localhost:8000${path}`;
  }
  // Prod: use environment variable
  console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}${path}`;
}

export default function InputForm() {
  const [origin, setOrigin] = useState<LocationValue | null>(null);
  const [destination, setDestination] = useState<LocationValue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    try {
      const from = String(formData.get("from") || "");
      const to = String(formData.get("to") || "");
      const activities = String(formData.get("activities") || "")
        .split(",")
        .filter(Boolean);

      const payload: AnalyseActivityRequest = {
        date_range: { start: from, end: to },
        activities,
        origin: {
          name: origin?.name || "",
          lat: origin?.lat || 0,
          lon: origin?.lon || 0,
        },
        destination: {
          name: destination?.name || "",
          lat: destination?.lat || 0,
          lon: destination?.lon || 0,
        },
      };

      setLastAnalyseRequest(payload);
      console.log("Payload:", payload);

      const res = await fetch(getApiUrl("/analyse/activity"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const json = await res.json();
      setLastAnalyseResponse(json);
      console.log("/analyse/activity response", json);

      router.push("/data-output");
    } catch (err) {
      console.error("Error submitting analysis:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleSubmit(formData);
      }}
      className="w-full flex justify-center py-8"
    >
      <div className="w-full max-w-5xl rounded-2xl bg-[#1a1a1a] border border-gray-800 p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-base font-semibold text-white mb-2">
              Current Location
            </label>
            <LocationPicker onLocationChange={setOrigin} />
          </div>
          <div className="space-y-4">
            <label className="text-base font-semibold text-white mb-2">
              Event Date
            </label>
            <EventDatePicker />
          </div>
          <div className="space-y-4">
            <label className="text-base font-semibold text-white mb-2">
              Destination
            </label>
            <LocationPicker onLocationChange={setDestination} />
          </div>
          <div className="space-y-4">
            <label className="text-base font-semibold text-white mb-2">
              Activity
            </label>
            <ActivitySelector name="activities" />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-4 bg-black text-white px-8 py-8 rounded-2xl hover:bg-black/90 transition-colors "
          >
            <span className="text-lg font-medium">
              {submitting ? "Analysing..." : "Analyse"}
            </span>
            <div className="flex items-center justify-center w-10 h-10 bg-teal-500 rounded-full">
              {submitting ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 text-black" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
