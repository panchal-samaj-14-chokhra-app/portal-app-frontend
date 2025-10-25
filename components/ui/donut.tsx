"use client"

import React, { useEffect, useState } from 'react'

type Slice = {
  label: string
  value: number
  color?: string
}

interface DonutProps {
  data: Slice[]
  size?: number
  strokeWidth?: number
  centerLabel?: string
  showCenterPercent?: boolean
}

// Lightweight animated SVG donut with optional percent labels on slices.
// - Animates stroke draw on mount
// - Draws percent labels for slices >= 6%
// - Caller can request center percent for the top slice via showCenterPercent
export default function DonutChart({ data, size = 80, strokeWidth = 14, centerLabel, showCenterPercent }: DonutProps) {
  const radius = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  // compute slices with start rotation + mid-angle for labels
  let acc = 0
  const slices = data.map((d, i) => {
    const val = Math.max(0, d.value)
    const portion = val / total
    const dash = portion * circumference
    const start = acc
    acc += dash
    const end = acc
    const startAngle = (start / circumference) * 2 * Math.PI
    const endAngle = (end / circumference) * 2 * Math.PI
    const midAngle = (startAngle + endAngle) / 2
    return {
      ...d,
      val,
      portion,
      dash,
      strokeDasharray: `${dash} ${Math.max(0, circumference - dash)}`,
      rotation: (start / circumference) * 360,
      midAngle,
      color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }
  })

  const maxVal = Math.max(...data.map(d => Math.max(0, d.value)), 0)
  const maxPercent = Math.round((maxVal / total) * 100)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="donut-chart">
      <g transform={`translate(${cx}, ${cy})`}>
        {slices.map((s, i) => (
          <g key={i} transform={`rotate(${s.rotation})`}>
            <circle
              r={radius}
              cx={0}
              cy={0}
              fill="transparent"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeDasharray={s.strokeDasharray}
              style={{ transition: 'stroke-dashoffset 700ms ease', strokeDashoffset: mounted ? 0 : circumference }}
            />
          </g>
        ))}
        {/* center hole */}
        <circle r={Math.max(0, radius - strokeWidth / 2)} fill="#fff" />

        {/* percent labels for slices (only for slices >= 6% to avoid clutter) */}
        {slices.map((s, i) => {
          const pct = Math.round(s.portion * 100)
          if (pct === 0 || pct < 6) return null
          const labelR = radius - strokeWidth - 6
          const x = Math.cos(s.midAngle - Math.PI / 2) * labelR
          const y = Math.sin(s.midAngle - Math.PI / 2) * labelR
          return (
            <text key={`lbl-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" style={{ fontSize: Math.max(8, size / 8) }} fill="#064e3b" className="font-semibold">
              {pct}%
            </text>
          )
        })}
      </g>
      {centerLabel ? (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="text-xs font-medium" style={{ fontSize: Math.max(10, size / 6) }}>
          {centerLabel}
        </text>
      ) : null}
      {(centerLabel === undefined && (data && data.length) && (maxVal > 0) && showCenterPercent) ? (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="text-sm font-semibold text-gray-700" style={{ fontSize: Math.max(12, size / 6) }}>
          {maxPercent}%
        </text>
      ) : null}
    </svg>
  )
}

export const DEFAULT_COLORS = ['#16a34a', '#0284c7', '#f97316', '#a855f7', '#e11d48', '#f59e0b']
