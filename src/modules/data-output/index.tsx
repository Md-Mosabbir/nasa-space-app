"use client";

import { ComfortScore } from "./components/comfort-score";
import { RiskScore } from "./components/risk-score";
import { WeatherComparison } from "./components/weather-comparison";
import { AISummaryButton } from "./components/ai-summary-button";
import { GraphsSection } from "./components/graphs-section";
import { getLastAnalyseResponse } from "@/lib/analysis-store";

// Minimal shapes we need on this page
type ComfortIndex = {
  score: number;
  category?: string;
  color?: string;
  main_factors?: string[];
};
type ActivityRisks = {
  hot_risk?: number;
  cold_risk?: number;
  rain_risk?: number;
  wind_risk?: number;
};
type ActivityEntry = { comfort_index?: ComfortIndex; risks?: ActivityRisks };
type Activities = Record<string, ActivityEntry>;

type Stats = {
  T2M_mean?: number;
  RH2M_mean?: number;
  WS10M_mean?: number;
  wind_mean?: number;
  precip_prob?: number;
};

type Place = { latitude?: number; longitude?: number; statistics?: Stats };

interface AnalysisResponseMinimal {
  origin?: Place;
  destination?: Place;
  activities?: Activities;
}

export default function DataOutput() {
  const data = getLastAnalyseResponse() as AnalysisResponseMinimal | null;

  const activities = (() => {
    const out: Array<{
      name: string;
      comfortScore: number;
      comfortColor: "green" | "yellow" | "red";
      concerns: string[];
      riskFactors: Array<{
        name: string;
        percentage: number;
        color: "red" | "green" | "yellow";
      }>;
    }> = [];

    const colorMap = (c: string | undefined): "green" | "yellow" | "red" => {
      if (c === "green" || c === "yellow" || c === "red") return c;
      const lower = (c || "").toLowerCase();
      if (lower.includes("green") || lower.includes("good")) return "green";
      if (
        lower.includes("yellow") ||
        lower.includes("fair") ||
        lower.includes("moderate")
      )
        return "yellow";
      return "red";
    };

    const riskColor = (p: number): "red" | "green" | "yellow" => {
      if (p >= 66) return "red";
      if (p >= 33) return "yellow";
      return "green";
    };

    if (data?.activities && typeof data.activities === "object") {
      for (const [key, value] of Object.entries(data.activities)) {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        const rawScore = Number(value?.comfort_index?.score ?? 0);
        const score = Math.max(0, Math.min(100, rawScore)); // <-- no *5
        const concerns: string[] = Array.isArray(
          value?.comfort_index?.main_factors,
        )
          ? (value?.comfort_index?.main_factors as string[])
          : [];
        const comfortColor = colorMap(value?.comfort_index?.color);

        const risks = value?.risks || {};
        const hot = Number(risks.hot_risk ?? 0);
        const cold = Number(risks.cold_risk ?? 0);
        const rain = Number(risks.rain_risk ?? 0);
        const wind = Number(risks.wind_risk ?? 0);
        const riskFactors = [
          { name: "Hot", percentage: hot, color: riskColor(hot) },
          { name: "Cold", percentage: cold, color: riskColor(cold) },
          { name: "Rain", percentage: rain, color: riskColor(rain) },
          { name: "Wind", percentage: wind, color: riskColor(wind) },
        ];

        out.push({
          name,
          comfortScore: score,
          comfortColor,
          concerns,
          riskFactors,
        });
      }
    }

    return out;
  })();

  const metrics = (() => {
    const o = data?.origin?.statistics;
    const d = data?.destination?.statistics;

    const fmt = (v: unknown, unit: string) => {
      const n = Number(v);
      if (Number.isFinite(n)) {
        return unit === "%" ? `${Math.round(n)}%` : `${n.toFixed(1)}${unit}`;
      }
      return "-";
    };

    return [
      {
        label: "Temperature",
        originLabel: "Origin",
        destinationLabel: "Destination",
        originValue: fmt(o?.T2M_mean, "°C"),
        destinationValue: fmt(d?.T2M_mean, "°C"),
        destinationEmphasisClass:
          Number(d?.T2M_mean) > Number(o?.T2M_mean)
            ? "text-red-400"
            : "text-sky-400",
      },
      {
        label: "Humidity",
        originLabel: "Origin",
        destinationLabel: "Destination",
        originValue: fmt(o?.RH2M_mean, "%"),
        destinationValue: fmt(d?.RH2M_mean, "%"),
        destinationEmphasisClass:
          Number(d?.RH2M_mean) > Number(o?.RH2M_mean)
            ? "text-fuchsia-400"
            : "text-fuchsia-400",
      },
      {
        label: "Wind Speed",
        originLabel: "Origin",
        destinationLabel: "Destination",
        originValue: fmt(o?.WS10M_mean ?? o?.wind_mean, " m/s"),
        destinationValue: fmt(d?.WS10M_mean ?? d?.wind_mean, " m/s"),
        destinationEmphasisClass: "text-orange-400",
      },
      {
        label: "Precipitation",
        originLabel: "Origin Probability",
        destinationLabel: "Destination Probability",
        originValue: fmt((o?.precip_prob ?? 0) * 100, "%"),
        destinationValue: fmt((d?.precip_prob ?? 0) * 100, "%"),
        destinationEmphasisClass: "text-red-400",
      },
    ];
  })();

  if (!data) {
    return (
      <div className="min-h-screen bg-black">
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="text-zinc-300">
            No analysis found. Please run an analysis from the input page.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-12">
          {activities.map((activity) => (
            <div
              key={activity.name}
              className="border border-zinc-800 rounded-3xl p-8"
            >
              <h2 className="text-white text-3xl font-bold mb-8">
                {activity.name}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <ComfortScore
                  score={activity.comfortScore}
                  concerns={activity.concerns}
                  color={activity.comfortColor}
                />

                <RiskScore factors={activity.riskFactors} />
              </div>
            </div>
          ))}

          <WeatherComparison metrics={metrics} />

          <div className="flex items-center justify-center py-8">
            <AISummaryButton />
          </div>

          <GraphsSection />
        </div>
      </main>
    </div>
  );
}
