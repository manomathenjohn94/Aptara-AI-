import React, { useState, useMemo } from "react";
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Gauge, Zap, Calendar, Ban, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface AbsorptionEfficiencyChartProps {
  scrubberLoad: number;
}

export default function AbsorptionEfficiencyChart({ scrubberLoad }: AbsorptionEfficiencyChartProps) {
  const [timeline, setTimeline] = useState<"10" | "30" | "90">("30");

  const metrics = useMemo(() => {
    // 1. Calculate base instantaneous efficiency with typical non-linear saturation curves
    // Peak efficiency is at low-medium loads (~45%). Extreme loads create a high air velocity
    // bypassing the sorbent bed, lowering the instantaneous capture percentage.
    const loadFactor = scrubberLoad / 100;
    let instantaneousEff = 0;
    if (scrubberLoad > 0) {
      instantaneousEff = 98.2 - scrubberLoad * 0.08;
      if (scrubberLoad > 75) {
        // High-velocity bypass choke penalty
        instantaneousEff -= (scrubberLoad - 75) * 0.45;
      }
    }
    instantaneousEff = Math.max(0, Math.min(99.5, Number(instantaneousEff.toFixed(1))));

    // 2. Net day load (Mt CO2/day capture capacity)
    const rawCaptureRate = scrubberLoad * 0.94; // from primary dashboard
    const actualCaptureRate = rawCaptureRate * (instantaneousEff / 100);

    // 3. Parasitic energy overhead (MW) - non-linear power curve
    const parasiticEnergy = scrubberLoad > 0 
      ? Number((scrubberLoad * 1.62 + Math.pow(scrubberLoad, 1.4) * 0.12).toFixed(1))
      : 0;

    // 4. Sorbent Filter Saturation limit estimation (days before swap needed)
    // High scrubber loads exhaust chemical sorbents exponential faster.
    let saturationDays = 0;
    if (scrubberLoad > 0) {
      saturationDays = Math.round(365 / Math.sqrt(scrubberLoad / 10));
    }

    return {
      instantaneousEff,
      actualCaptureRate,
      parasiticEnergy,
      saturationDays,
    };
  }, [scrubberLoad]);

  // Generate historical or projected data points based on scrubber settings and filter wear
  const chartData = useMemo(() => {
    const days = parseInt(timeline);
    const data = [];
    
    const baseEff = metrics.instantaneousEff;
    const captureRate = metrics.actualCaptureRate;

    let totalSequestered = 0;

    for (let day = 1; day <= days; day++) {
      // Sorbent degradation over time based on scrubber stress
      const degradationRate = 0.002 * Math.sqrt(scrubberLoad);
      const currentWearFactor = Math.max(0.4, 1 - (day * degradationRate));
      
      const currentEff = Number((baseEff * currentWearFactor).toFixed(1));
      const dailyContribution = captureRate * currentWearFactor;
      totalSequestered += dailyContribution;

      data.push({
        dayLabel: `Day ${day}`,
        "Efficiency (%)": scrubberLoad === 0 ? 0 : currentEff,
        "Daily Recapture (Mt)": scrubberLoad === 0 ? 0 : Number(dailyContribution.toFixed(2)),
        "Cumulative Sequestered (Mt)": scrubberLoad === 0 ? 0 : Number(totalSequestered.toFixed(1)),
      });
    }

    return data;
  }, [timeline, scrubberLoad, metrics]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden">
      {/* Background cyber accent paths */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5 relative z-10">
        <div>
          <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase font-bold block">
            GEOENGINEERING FORECAST
          </span>
          <h4 className="font-heading text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-emerald-400" />
            CO2 Scrubber Absorption Efficiency Model & Cumulative Yield
          </h4>
          <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-relaxed">
            Plots sorbent chemical saturation curves, parasitic turbine draws, and degradation rates dynamically under active scrubber constraints.
          </p>
        </div>

        {/* Timeline selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-850 self-end sm:self-auto font-mono text-[9px]">
          {(["10", "30", "90"] as const).map((days) => (
            <button
              key={days}
              onClick={() => setTimeline(days)}
              className={`px-2.5 py-1 rounded font-bold uppercase transition-all cursor-pointer ${
                timeline === days
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {days}D Model
            </button>
          ))}
        </div>
      </div>

      {/* Core Operational metrics bento-grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-lg space-y-1">
          <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
            Instantaneous Bed Efficiency
          </span>
          <span className="font-mono text-xs font-bold text-emerald-405 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${scrubberLoad > 0 ? "bg-emerald-400 animate-pulse" : "bg-slate-700"}`} />
            {metrics.instantaneousEff}%
          </span>
          <span className="text-[8.5px] font-sans text-slate-400 block leading-tight">
            Percentage capture of air volume passing through array.
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-lg space-y-1">
          <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
            Parasitic Turbine Demand
          </span>
          <span className="font-mono text-xs font-bold text-blue-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            {metrics.parasiticEnergy} MW
          </span>
          <span className="text-[8.5px] font-sans text-slate-400 block leading-tight">
            Grid power consumed by fans & heat regeneration.
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-lg space-y-1">
          <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
            Sorbent Bed Wear Cycle
          </span>
          <span className="font-mono text-xs font-bold text-amber-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            {scrubberLoad > 0 ? `${metrics.saturationDays} Days` : "INFINITE"}
          </span>
          <span className="text-[8.5px] font-sans text-slate-400 block leading-tight">
            Estimated timeframe before chemical sorbent saturation.
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-lg space-y-1">
          <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
            Projection Total Yield
          </span>
          <span className="font-mono text-xs font-bold text-indigo-400">
            {chartData.length > 0 ? chartData[chartData.length - 1]["Cumulative Sequestered (Mt)"] : 0} Mt
          </span>
          <span className="text-[8.5px] font-sans text-slate-400 block leading-tight">
            Net CO2 permanently captured and sequestered over timeline.
          </span>
        </div>
      </div>

      {/* Main Dual-Axis Area and Line Graph */}
      <div className="flex-1 min-h-[220px] bg-slate-950/50 border border-slate-850/60 rounded-xl p-3 relative">
        {scrubberLoad === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-2.5 p-4 z-10 bg-slate-950/40 backdrop-blur-[1px]">
            <Ban className="w-8 h-8 text-rose-500/80 animate-pulse" />
            <div>
              <span className="font-heading text-xs font-bold tracking-wider text-slate-200 block uppercase">
                Carbon Scrubber Arrays Offline
              </span>
              <span className="text-[10px] text-slate-400 max-w-sm block leading-relaxed font-sans mt-0.5">
                Increase the Carbon Scrubber load control in the left sidebar to calibrate physical variables and model efficiency trends.
              </span>
            </div>
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 15, right: -5, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
            <XAxis
              dataKey="dayLabel"
              stroke="#475569"
              fontSize={8}
              fontFamily="monospace"
              tickLine={false}
            />
            {/* Left Y Axis: Efficiency (%) */}
            <YAxis
              yAxisId="left"
              stroke="#10b981"
              fontSize={8}
              fontFamily="monospace"
              tickLine={false}
              domain={[0, 100]}
              label={{ value: "Efficiency (%)", angle: -90, position: "insideLeft", fill: "#10b981", fontSize: 8, fontFamily: "monospace", offset: 10 }}
            />
            {/* Right Y Axis: Cumulative sequested carbon (Mt) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6366f1"
              fontSize={8}
              fontFamily="monospace"
              tickLine={false}
              label={{ value: "Cumulative Mt CO2", angle: 90, position: "insideRight", fill: "#6366f1", fontSize: 8, fontFamily: "monospace", offset: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderColor: "#1e293b",
                fontSize: "10px",
                fontFamily: "monospace",
                borderRadius: "6px",
                color: "#f8fafc",
              }}
              labelStyle={{ fontFamily: "monospace", color: "#64748b" }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "10px", fontFamily: "monospace" }} />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="Cumulative Sequestered (Mt)"
              stroke="#6366f1"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorCumulative)"
              name="Cumulative Sequestered (Mt)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Efficiency (%)"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Chemical Bed Efficiency (%)"
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic predictive insights */}
      {scrubberLoad > 0 && (
        <div className="bg-slate-950/40 border border-slate-850 p-2.5 rounded-lg flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-355 leading-normal font-sans">
            <span className="font-semibold text-teal-400 font-mono">APTARA PROGNOSTIC MATRIX GUIDELINES:</span> At the currently selected scrubber loading node of{" "}
            <span className="font-semibold font-mono text-slate-200">{scrubberLoad}%</span>, the sorbent filter degrade trajectory calculates to{" "}
            <span className="font-semibold text-blue-400">
              -{(0.2 * Math.sqrt(scrubberLoad)).toFixed(2)}%
            </span>{" "}
            effectiveness per 24 hours. Consider running temporary duty cycles on alternative auxiliary turbines to allow structural filter cooling loops and prevent thermal saturation spikes.
          </p>
        </div>
      )}
    </div>
  );
}
