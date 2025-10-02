"use client";

import React, { useMemo } from "react";
import data from "@/../seed/analyse.json";
import { trimSeries } from "@/lib/trim";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

export function GraphsSection() {
  const origin = data.graphs.origin;
  const dest = data.graphs.destination;

  const temp = useMemo(() => {
    const a = trimSeries(origin.dates, origin.T2M, { maxPoints: 10 });
    const b = trimSeries(dest.dates, dest.T2M, { maxPoints: 10 });
    return { a, b };
  }, [origin, dest]);

  const hum = useMemo(() => {
    const a = trimSeries(origin.dates, origin.RH2M, { maxPoints: 10 });
    const b = trimSeries(dest.dates, dest.RH2M, { maxPoints: 10 });
    return { a, b };
  }, [origin, dest]);

  const comfort = useMemo(() => {
    const a = trimSeries(origin.dates, origin.DI, { maxPoints: 10 });
    const b = trimSeries(dest.dates, dest.DI, { maxPoints: 10 });
    return { a, b };
  }, [origin, dest]);

  const risks = useMemo(() => {
    const r = data.activities.fishing.risks;
    const labels = ["Hot", "Cold", "Rain", "Wind"];
    const values = [r.hot_risk, r.cold_risk, r.rain_risk, r.wind_risk];
    return labels.map((label, i) => ({ label, value: values[i] }));
  }, []);

  const makeDualSeries = (
    labelsA: string[],
    valuesA: number[],
    labelsB: string[],
    valuesB: number[],
  ) => {
    const len = Math.min(
      labelsA.length,
      valuesA.length,
      labelsB.length,
      valuesB.length,
    );
    return Array.from({ length: len }, (_, i) => ({
      label: labelsA[i] as string,
      origin: valuesA[i],
      destination: valuesB[i],
    }));
  };

  const tempData = makeDualSeries(
    temp.a.labels as string[],
    temp.a.values,
    temp.b.labels as string[],
    temp.b.values,
  );
  const humData = makeDualSeries(
    hum.a.labels as string[],
    hum.a.values,
    hum.b.labels as string[],
    hum.b.values,
  );
  const comfortData = makeDualSeries(
    comfort.a.labels as string[],
    comfort.a.values,
    comfort.b.labels as string[],
    comfort.b.values,
  );

  const chartConfig = {
    origin: {
      label: "Origin",
      color: "#22c55e", // emerald-500
    },
    destination: {
      label: "Destination",
      color: "#86efac", // green-200/emerald-200
    },
  };

  return (
    <section className="dark space-y-6">
      {" "}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {" "}
        {/* Temperature */}{" "}
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>Temperature comparison</CardTitle>{" "}
            <CardDescription>
              {" "}
              Origin vs Destination over sampled dates{" "}
            </CardDescription>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <ChartContainer config={chartConfig}>
              {" "}
              <AreaChart
                accessibilityLayer
                data={tempData}
                margin={{ left: 12, right: 12 }}
              >
                {" "}
                <CartesianGrid vertical={false} strokeDasharray="3 3" />{" "}
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                />{" "}
                <YAxis tickLine={false} axisLine={false} width={28} />{" "}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />{" "}
                <Area
                  dataKey="origin"
                  type="natural"
                  fill="var(--color-origin)"
                  fillOpacity={0.3}
                  stroke="var(--color-origin)"
                  strokeWidth={2}
                />{" "}
                <Area
                  dataKey="destination"
                  type="natural"
                  fill="var(--color-destination)"
                  fillOpacity={0.3}
                  stroke="var(--color-destination)"
                  strokeWidth={2}
                />{" "}
                <ChartLegend content={<ChartLegendContent />} />{" "}
              </AreaChart>{" "}
            </ChartContainer>{" "}
          </CardContent>{" "}
        </Card>{" "}
        {/* Humidity */}{" "}
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>Humidity comparison</CardTitle>{" "}
            <CardDescription>
              {" "}
              Origin vs Destination over sampled dates{" "}
            </CardDescription>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <ChartContainer config={chartConfig}>
              {" "}
              <AreaChart
                accessibilityLayer
                data={humData}
                margin={{ left: 12, right: 12 }}
              >
                {" "}
                <CartesianGrid vertical={false} strokeDasharray="3 3" />{" "}
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                />{" "}
                <YAxis tickLine={false} axisLine={false} width={28} />{" "}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />{" "}
                <Area
                  dataKey="origin"
                  type="natural"
                  fill="var(--color-origin)"
                  fillOpacity={0.3}
                  stroke="var(--color-origin)"
                  strokeWidth={2}
                />{" "}
                <Area
                  dataKey="destination"
                  type="natural"
                  fill="var(--color-destination)"
                  fillOpacity={0.3}
                  stroke="var(--color-destination)"
                  strokeWidth={2}
                />{" "}
                <ChartLegend content={<ChartLegendContent />} />{" "}
              </AreaChart>{" "}
            </ChartContainer>{" "}
          </CardContent>{" "}
        </Card>{" "}
        {/* Comfort */}{" "}
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>Comfort index comparison</CardTitle>{" "}
            <CardDescription>
              {" "}
              Origin vs Destination over sampled dates{" "}
            </CardDescription>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <ChartContainer config={chartConfig}>
              {" "}
              <AreaChart
                accessibilityLayer
                data={comfortData}
                margin={{ left: 12, right: 12 }}
              >
                {" "}
                <CartesianGrid vertical={false} strokeDasharray="3 3" />{" "}
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                />{" "}
                <YAxis tickLine={false} axisLine={false} width={28} />{" "}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />{" "}
                <Area
                  dataKey="origin"
                  type="natural"
                  fill="var(--color-origin)"
                  fillOpacity={0.3}
                  stroke="var(--color-origin)"
                  strokeWidth={2}
                />{" "}
                <Area
                  dataKey="destination"
                  type="natural"
                  fill="var(--color-destination)"
                  fillOpacity={0.3}
                  stroke="var(--color-destination)"
                  strokeWidth={2}
                />{" "}
                <ChartLegend content={<ChartLegendContent />} />{" "}
              </AreaChart>{" "}
            </ChartContainer>{" "}
          </CardContent>{" "}
        </Card>{" "}
        {/* Risks */}{" "}
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>Risk probability</CardTitle>{" "}
            <CardDescription>
              {" "}
              Category probabilities for activity risks{" "}
            </CardDescription>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <ChartContainer
              config={{ value: { label: "Risk", color: "var(--color-value)" } }}
            >
              {" "}
              <BarChart
                accessibilityLayer
                data={risks}
                margin={{ left: 12, right: 12 }}
              >
                {" "}
                <CartesianGrid vertical={false} strokeDasharray="3 3" />{" "}
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />{" "}
                <YAxis tickLine={false} axisLine={false} width={28} />{" "}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="label" />}
                />{" "}
                <Bar dataKey="value" fill="#00c950" radius={6} />{" "}
                <ChartLegend content={<ChartLegendContent />} />{" "}
              </BarChart>{" "}
            </ChartContainer>{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
    </section>
  );
}
