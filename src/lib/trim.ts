// Smart time-series trimming to a target number of points while preserving shape
// Strategy: stride sampling with guaranteed endpoints + local max preservation for spikes
export type TrimOptions = {
  maxPoints?: number // default 12
}

export function trimSeries<T>(labels: T[], values: number[], options: TrimOptions = {}): { labels: T[]; values: number[] } {
  const maxPoints = options.maxPoints ?? 12
  if (labels.length !== values.length) {
    throw new Error("trimSeries: labels and values must be the same length")
  }
  const n = labels.length
  if (n <= maxPoints) return { labels: [...labels], values: [...values] }

  const stride = Math.ceil(n / maxPoints)
  const outL: T[] = []
  const outV: number[] = []

  for (let i = 0; i < n; i += stride) {
    // take the representative in the window [i, i+stride)
    const end = Math.min(i + stride, n)
    let maxIdx = i
    let maxVal = values[i]
    for (let j = i + 1; j < end; j++) {
      if (values[j] > maxVal) {
        maxVal = values[j]
        maxIdx = j
      }
    }
    outL.push(labels[maxIdx])
    outV.push(values[maxIdx])
  }

  // ensure last sample is included
  if (outL[outL.length - 1] !== labels[n - 1]) {
    outL.push(labels[n - 1])
    outV.push(values[n - 1])
  }

  // If we overshot due to rounding, trim from the middle
  while (outL.length > maxPoints) {
    const mid = Math.floor(outL.length / 2)
    outL.splice(mid, 1)
    outV.splice(mid, 1)
  }

  return { labels: outL, values: outV }
} 