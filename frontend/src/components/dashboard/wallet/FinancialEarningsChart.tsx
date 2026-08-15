"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, QrCode, Banknote, Activity } from "lucide-react";
import { cn, formatWIBDate } from "@/lib/utils";

interface ChartDataPoint {
  date: string;
  total: number;
  qris: number;
  cash: number;
  amount: number;
  method: 'QRIS' | 'CASH';
  title: string;
}

interface FinancialEarningsChartProps {
  data: ChartDataPoint[];
  stats: {
    total_earnings: number;
    qris_earnings: number;
    cash_earnings: number;
    completed_count: number;
  };
}

// Compact rupiah formatter without excessive zeros
function formatCompactRupiah(num: number): string {
  if (!num || num === 0) return "Rp 0";
  if (num >= 1_000_000) {
    const jt = num / 1_000_000;
    return `Rp ${jt % 1 === 0 ? jt.toFixed(0) : jt.toFixed(2).replace(".", ",")} Jt`;
  }
  if (num >= 1_000) {
    const rb = num / 1_000;
    return `Rp ${rb % 1 === 0 ? rb.toFixed(0) : rb.toFixed(1).replace(".", ",")} Rb`;
  }
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export function FinancialEarningsChart({ data = [], stats }: FinancialEarningsChartProps) {
  const [selectedMethod, setSelectedMethod] = useState<'ALL' | 'QRIS' | 'CASH'>('ALL');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7D' | '14D' | '30D' | '3M' | '6M' | '1Y'>('30D');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Timeframe options exactly requested: 7 hari, 14 hari, 30 hari, 3 bulan, 6 bulan, 1 tahun
  const timeframes = [
    { key: '7D', label: '7 Hari', days: 7 },
    { key: '14D', label: '14 Hari', days: 14 },
    { key: '30D', label: '30 Hari', days: 30 },
    { key: '3M', label: '3 Bulan', days: 90 },
    { key: '6M', label: '6 Bulan', days: 180 },
    { key: '1Y', label: '1 Tahun', days: 365 },
  ] as const;

  const currentTf = timeframes.find((t) => t.key === selectedTimeframe) || timeframes[2];

  // Pure real data time-series from Supabase records
  const timeSeries = useMemo(() => {
    const totalDays = currentTf.days;
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const startTime = new Date(now.getTime() - totalDays * 24 * 60 * 60 * 1000);
    startTime.setHours(0, 0, 0, 0);

    // Filter matching data points from Supabase
    const matchingRaw = data.filter((d) => {
      const t = new Date(d.date).getTime();
      const inRange = t >= startTime.getTime() && t <= now.getTime();
      if (!inRange) return false;
      if (selectedMethod === 'ALL') return true;
      return d.method === selectedMethod;
    });

    const numBuckets = currentTf.days <= 14 ? currentTf.days : currentTf.days <= 30 ? 30 : currentTf.days <= 90 ? 15 : currentTf.days <= 180 ? 24 : 12;
    const bucketDurationMs = (now.getTime() - startTime.getTime()) / numBuckets;

    const buckets: Array<{
      dateStr: string;
      label: string;
      value: number;
      amount: number;
      method: string;
      title: string;
    }> = [];

    let cumulative = 0;

    for (let i = 0; i < numBuckets; i++) {
      const bStart = startTime.getTime() + i * bucketDurationMs;
      const bEnd = bStart + bucketDurationMs;
      const ptDate = new Date(bEnd);
      const label = formatWIBDate(ptDate.toISOString());

      // Real transactions in this timeframe bucket
      const bucketItems = matchingRaw.filter((item) => {
        const itemT = new Date(item.date).getTime();
        return itemT >= bStart && itemT < bEnd;
      });

      let bucketTotal = 0;
      let lastTitle = "Saldo";
      let lastMethod = selectedMethod === 'ALL' ? 'QRIS/Cash' : selectedMethod;

      if (bucketItems.length > 0) {
        bucketItems.forEach((it) => {
          bucketTotal += it.amount;
          lastTitle = it.title;
          lastMethod = it.method;
        });
      }

      cumulative += bucketTotal;

      buckets.push({
        dateStr: ptDate.toISOString(),
        label,
        value: cumulative,
        amount: bucketTotal,
        method: lastMethod,
        title: bucketItems.length > 0 ? `${bucketItems.length} Order Selesai` : "Saldo Kumulatif",
      });
    }

    return buckets;
  }, [currentTf, data, selectedMethod]);

  // Compute coordinate geometry with sensitive scaling and clean segments
  const { segments, areaPath, minVal, maxVal, svgPoints } = useMemo(() => {
    if (timeSeries.length === 0) {
      return { segments: [], areaPath: "", minVal: 0, maxVal: 100, svgPoints: [] };
    }

    const values = timeSeries.map((p) => p.value);
    const actualMin = Math.min(...values);
    const actualMax = Math.max(...values);
    const delta = actualMax - actualMin;

    // Sensitive auto-scaling padding
    const padding = delta > 0 ? delta * 0.18 : (actualMax > 0 ? actualMax * 0.08 : 5000);
    const yMin = Math.max(0, actualMin - padding);
    const yMax = actualMax + padding;
    const range = yMax - yMin || 1;

    const coords = timeSeries.map((p, i) => {
      const x = (i / (timeSeries.length - 1)) * 100;
      // Y bounds: 82% (bottom) to 18% (top)
      const y = 82 - ((p.value - yMin) / range) * 64;
      return { x, y, value: p.value, data: p };
    });

    // Build individual path segments: Green on Up, Red on Down
    const segmentList: Array<{ path: string; color: string; isUp: boolean }> = [];

    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const isUp = curr.value >= prev.value;
      const color = isUp ? "#10b981" : "#ef4444"; // Hijau saat naik, Merah saat turun

      const cpX1 = (prev.x + (curr.x - prev.x) * 0.5).toFixed(2);
      const cpY1 = prev.y.toFixed(2);
      const cpX2 = (prev.x + (curr.x - prev.x) * 0.5).toFixed(2);
      const cpY2 = curr.y.toFixed(2);

      const path = `M ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
      segmentList.push({ path, color, isUp });
    }

    // Full area path
    let fullLinePath = "";
    coords.forEach((pt, i) => {
      if (i === 0) fullLinePath = `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
      else {
        const prev = coords[i - 1];
        const cpX1 = (prev.x + (pt.x - prev.x) * 0.5).toFixed(2);
        const cpY1 = prev.y.toFixed(2);
        const cpX2 = (prev.x + (pt.x - prev.x) * 0.5).toFixed(2);
        const cpY2 = pt.y.toFixed(2);
        fullLinePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
      }
    });

    const first = coords[0];
    const last = coords[coords.length - 1];
    const area = `${fullLinePath} L ${last.x.toFixed(2)} 98 L ${first.x.toFixed(2)} 98 Z`;

    return {
      segments: segmentList,
      areaPath: area,
      minVal: actualMin,
      maxVal: actualMax,
      svgPoints: coords,
    };
  }, [timeSeries]);

  const activeTotal = useMemo(() => {
    if (selectedMethod === 'QRIS') return stats.qris_earnings;
    if (selectedMethod === 'CASH') return stats.cash_earnings;
    return stats.total_earnings;
  }, [selectedMethod, stats]);

  const currentHover = hoveredIndex !== null && svgPoints[hoveredIndex] ? svgPoints[hoveredIndex] : null;

  return (
    <div className="bg-card/95 border border-border/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5 overflow-hidden w-full max-w-full min-w-0">
      
      {/* 1. Top Header: Total Balance (Left) + Method Switcher & Puncak Badge Outside Chart (Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Grafik Pendapatan ({currentTf.label})</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {formatCompactRupiah(activeTotal)}
            </h3>
            <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {stats.completed_count} Selesai
            </span>
          </div>
        </div>

        {/* Right side: Method Switcher + Separate Puncak Badge (Detached & Outside Chart) */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          {/* Method Switcher Tabs */}
          <div className="inline-flex p-1 bg-muted/60 rounded-2xl border border-border/50">
            <button
              type="button"
              onClick={() => setSelectedMethod('ALL')}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                selectedMethod === 'ALL' 
                  ? "bg-card text-foreground shadow-2xs border border-border/60" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Wallet className="w-3.5 h-3.5 text-primary" />
              <span>Semua</span>
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedMethod('QRIS')}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                selectedMethod === 'QRIS' 
                  ? "bg-emerald-500 text-white shadow-2xs" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QRIS</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('CASH')}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                selectedMethod === 'CASH' 
                  ? "bg-blue-500 text-white shadow-2xs" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Tunai</span>
            </button>
          </div>

          {/* Puncak Badge (Taruh di luar chart di atas kanan sebelah semua qris tunai) */}
          <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
            Puncak: <span className="font-black text-foreground">{formatCompactRupiah(maxVal)}</span>
          </div>
        </div>
      </div>

      {/* 2. Stock-Style Dark Fintech Chart View (Uniform Razor-Thin Line 1.2px) */}
      <div className="relative w-full h-56 sm:h-64 bg-[#0a0f0d] rounded-2xl p-3 sm:p-4 overflow-hidden border border-emerald-950/40 flex flex-col justify-between select-none">
        
        {/* Dotted Grid Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:16px_16px] pointer-events-none" />

        {/* Horizontal Mid Reference Dash Line */}
        <div className="absolute top-[48%] left-0 right-0 border-b border-dashed border-white/10 pointer-events-none" />
        
        {/* Hover Tooltip Header */}
        <div className="relative z-20 flex justify-between items-start text-xs min-h-[24px]">
          {currentHover ? (
            <motion.div 
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-border/80 shadow-lg text-foreground flex items-center gap-2 flex-wrap"
            >
              <span className={cn(
                "px-1.5 py-0.2 rounded text-[9px] font-black text-white",
                currentHover.data.method === 'QRIS' ? "bg-emerald-500" : currentHover.data.method === 'CASH' ? "bg-blue-500" : "bg-primary"
              )}>
                {currentHover.data.method}
              </span>
              <span className="font-black text-xs text-foreground">
                {formatCompactRupiah(currentHover.value)}
              </span>
              {currentHover.data.amount > 0 && (
                <span className="text-[10px] font-bold text-emerald-500">
                  (+{formatCompactRupiah(currentHover.data.amount)})
                </span>
              )}
              <span className="text-muted-foreground text-[10px]">
                • {currentHover.data.label}
              </span>
            </motion.div>
          ) : (
            <div />
          )}
        </div>

        {/* Dynamic Real Data Canvas */}
        <div className="relative flex-1 w-full my-1 min-h-[110px]">
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="realAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Glowing Area under Curve */}
            {areaPath && (
              <path d={areaPath} fill="url(#realAreaGradient)" />
            )}

            {/* Render Each Segment: Uniform Crisp 1.2px Stroke (Sama-sama tipis, tidak tebal sendiri) */}
            {segments.map((seg, idx) => (
              <path 
                key={idx}
                d={seg.path} 
                fill="none" 
                stroke={seg.color} 
                strokeWidth="1.2" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Active Crosshair Vertical Line */}
            {currentHover && (
              <line
                x1={currentHover.x}
                y1="5"
                x2={currentHover.x}
                y2="95"
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                opacity="0.6"
              />
            )}

            {/* Hitbox Columns for Smooth Hover/Touch */}
            {svgPoints.map((pt, i) => (
              <rect
                key={i}
                x={Math.max(0, pt.x - 100 / (svgPoints.length * 2))}
                y="0"
                width={100 / svgPoints.length}
                height="100"
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredIndex(i)}
                onTouchStart={() => setHoveredIndex(i)}
              />
            ))}
          </svg>

          {/* 100% PERFECTLY ROUND CIRCLE DOT (HTML div) */}
          {currentHover && (
            <div 
              className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_10px_#10b981] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-75"
              style={{
                left: `${currentHover.x}%`,
                top: `${currentHover.y}%`,
              }}
            />
          )}
        </div>

        {/* 3. Bottom Timeframe Filter Tabs: 7 Hari, 14 Hari, 30 Hari, 3 Bulan, 6 Bulan, 1 Tahun */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-2 gap-2 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {timeframes.map((tf) => (
              <button
                key={tf.key}
                type="button"
                onClick={() => {
                  setSelectedTimeframe(tf.key as any);
                  setHoveredIndex(null);
                }}
                className={cn(
                  "px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap",
                  selectedTimeframe === tf.key
                    ? "bg-white/20 text-emerald-400 shadow-xs scale-105"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground/80 shrink-0">
            {timeSeries.length} Titik
          </div>
        </div>

      </div>

    </div>
  );
}
