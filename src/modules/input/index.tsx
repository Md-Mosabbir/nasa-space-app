"use client"

import { useState } from "react"
import { ActivitySelector } from "./components/activity-selector"
import { EventDatePicker } from "./components/date-picker"
import { LocationPicker } from "./components/location-picker"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface LocationValue {
	lat: number
	lon: number
	name?: string
}

function getApiBaseUrl() {
	// Prefer NEXT_PUBLIC_API_BASE_URL, fallback to localhost:8000
	if (typeof process !== "undefined") {
		const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL
		if (fromEnv && fromEnv.length > 0) return fromEnv
	}
	return "http://localhost:8000"
}

export default function InputForm() {
	const [origin, setOrigin] = useState<LocationValue | null>(null)
	const [destination, setDestination] = useState<LocationValue | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const apiBase = getApiBaseUrl()

	async function handleSubmit(formData: FormData) {
		setSubmitting(true)
		try {
			const payload = {
				origin,
				destination,
				from: formData.get("from") || "",
				to: formData.get("to") || "",
				activities: String(formData.get("activities") || "").split(",").filter(Boolean),
			}

			const res = await fetch(`${apiBase}/analysis`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})

			if (!res.ok) {
				throw new Error(`Request failed: ${res.status}`)
			}

			// You can route to results page or show a toast. For now, log.
			console.log("Analysis response", await res.json())
		} catch (err) {
			console.error(err)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<form action={handleSubmit} className="w-full flex justify-center py-8">
			<div className="w-full max-w-5xl rounded-2xl bg-[#1a1a1a] border border-gray-800 p-8 space-y-10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					<div className="space-y-3">
						<label className="text-base font-semibold text-white">Current Location</label>
						<LocationPicker onLocationChange={setOrigin} />
					</div>
					<div className="space-y-3">
						<label className="text-base font-semibold text-white">Event Date</label>
						<EventDatePicker />
					</div>
					<div className="space-y-3">
						<label className="text-base font-semibold text-white">Destination</label>
						<LocationPicker onLocationChange={setDestination} />
					</div>
					<div className="space-y-3">
						<ActivitySelector label="Activity" name="activities" />
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
							<ArrowRight className="w-5 h-5 text-black" />
						</div>
					</Button>
				</div>
			</div>
		</form>
	)
}
