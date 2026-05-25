import React, { useState, useEffect, useRef } from "react";
import { Sliders, Activity, Thermometer, Wind, Eye, FileSpreadsheet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
}

function AnimatedCounter({ value, decimals = 1, prefix = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    const duration = 400; // ms
    const startTime = performance.now();
    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentValue = startValue + (endValue - startValue) * easeProgress;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return (
    <>
      {prefix}
      {displayValue.toFixed(decimals)}
    </>
  );
}

interface SectionEnvironmentalProps {
  onNotifyLog: (msg: string, type: "info" | "warning" | "success") => void;
}

export default function SectionEnvironmental({ onNotifyLog }: SectionEnvironmentalProps) {
  // Simulator Parameters
  const [scrubberLoad, setScrubberLoad] = useState<number>(35); // carbon scrubbing % strength
  const [srmInjection, setSrmInjection] = useState<number>(15); // solar radiation management % strength
  
  // Simulated Vital Indicators
  const [co2Level, setCo2Level] = useState<number>(418.5); // CO2 ppm
  const [tempAnomaly, setTempAnomaly] = useState<number>(1.12); // Thermal shift C
  const [glacialIce, setGlacialIce] = useState<number>(82.4); // Glacial index %
  const [biodiversity, setBiodiversity] = useState<number>(0.741); // Vital index

  // Chart telemetry state (historical trend)
  const [chartData, setChartData] = useState<any[]>([]);

  // Generate initial historic chart data based on default slider variables
  useEffect(() => {
    generateTrendData();
  }, [scrubberLoad, srmInjection]);

  const generateTrendData = () => {
    const historicalDays = 12;
    const data = [];
    
    // Baselines that simulate over time
    let temp = 1.35;
    let co2 = 423.2;
    let ice = 84.8;
    
    // Sliders affect rate of change
    const co2Decel = (scrubberLoad / 100) * 1.25; // High scroll scrub dumps ppm faster
    const tempCooling = (srmInjection / 100) * 0.45 + (scrubberLoad / 100) * 0.15; // High SRM cools faster

    for (let i = historicalDays; i >= 0; i--) {
      const co2Delta = 0.45 - co2Decel; // Net growth offset by scrubber
      const tempDelta = 0.03 - tempCooling * 0.1; // Net thermal creep offset by SRM
      
      co2 = Number((co2 + co2Delta).toFixed(1));
      temp = Number((temp + tempDelta).toFixed(2));
      
      // Ice drops if temp anomaly is high
      const iceMeltdown = Math.max(0, (temp - 0.5) * 0.6);
      ice = Number((ice - iceMeltdown).toFixed(1));

      const dateLabel = `D-${i}`;
      data.push({
        name: i === 0 ? "CURRENT" : dateLabel,
        "CO2 Level (ppm)": co2,
        "Temp Anomaly (°C)": temp,
        "Glacial Ice %": ice,
      });
    }

    setChartData(data);
    
    // Update live indicators for current snapshot
    const current = data[data.length - 1];
    setCo2Level(current["CO2 Level (ppm)"]);
    setTempAnomaly(current["Temp Anomaly (°C)"]);
    setGlacialIce(current["Glacial Ice %"]);
    
    // Biodiversity calculated off temp and CO2 stress
    const bioIndex = Number((0.85 - (temp * 0.1) - (co2 / 10000)).toFixed(3));
    setBiodiversity(bioIndex);
  };

  const handleScrubberChange = (val: number) => {
    setScrubberLoad(val);
    onNotifyLog(`CO2 Scrubber Load altered to ${val}%. Restructuring planetary carbon sink telemetry.`, "info");
  };

  const handleSrmChange = (val: number) => {
    setSrmInjection(val);
    if (val > 60) {
      onNotifyLog(`Solar Radiation Deflection rates elevated to high levels (${val}%). Warning: Solar scattering may reduce crops efficiency.`, "warning");
    } else {
      onNotifyLog(`Albedo SRM parameters adapted to ${val}%. Calibrating planetary cloud deflection.`, "info");
    }
  };  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 h-full">
      {/* Simulation Controls Sidebar */}
      <div className="xl:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-2xl">
        <div>
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-blue-400" />
            Planetary Sandbox Controls
          </h3>
          <p className="text-[11px] text-slate-450 leading-relaxed font-sans mb-5">
            Aptara allows active geoengineering simulations. Drag controls to toggle synthetic scrubbing loads and Solar Radiation Management (SRM) to watch trends balance.
          </p>
          
          <div className="space-y-6">
            {/* Control 1: Scrubber load */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs text-slate-300 font-medium">Carbon Scrubber Arrays</span>
                <span className="font-mono text-xs text-blue-400 font-bold">{scrubberLoad}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scrubberLoad}
                onChange={(e) => handleScrubberChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-500">
                <span>OFFLINE (0%)</span>
                <span>MAX RECAPTURE (100%)</span>
              </div>
            </div>

            {/* Control 2: Aerosol SRM and Dust */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs text-slate-300 font-medium">Reflective Stratosphere Aerosol (SRM)</span>
                <span className="font-mono text-xs text-blue-400 font-bold">{srmInjection}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={srmInjection}
                onChange={(e) => handleSrmChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-500">
                <span>0 Gt DEPOSITED</span>
                <span>120 Gt SOLID GRID DEPOSITIONS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator Summary */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 font-mono text-[10px]">
          <div className="flex justify-between">
            <span className="text-slate-500 uppercase">FEEDBACK PATH</span>
            <span className="text-blue-400 font-bold">SIMULATION ACTIVE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 uppercase">CO2 SCRUB EFFICIENCY</span>
            <span className="text-slate-300 font-semibold">{(scrubberLoad * 0.94).toFixed(1)} Mt/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 uppercase">ALBEDO SHIFT VALUE</span>
            <span className="text-slate-300 font-semibold">+{ (srmInjection * 0.007).toFixed(3) } avg reflectivity</span>
          </div>
        </div>
      </div>

      {/* Main Climate Telemetry Dashboard */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        {/* Vital Snapshot Panels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Card 1: CO2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-lg cyber-glow-blue">
            <span className="font-mono text-[9px] text-slate-450 tracking-wider">ATM ATMOSPHERIC CO2</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-xl font-bold text-slate-100">
                <AnimatedCounter value={co2Level} decimals={1} />
              </span>
              <span className="font-mono text-[10px] text-slate-400">ppm</span>
            </div>
            <span className={`block text-[9px] font-mono mt-1 font-semibold ${co2Level < 420 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {co2Level < 422 ? '▼ ABSORPTION PHASE' : '▲ CONCENTRATION CREEP'}
            </span>
          </div>

          {/* Card 2: Thermal Anomalies */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-lg cyber-glow-blue">
            <span className="font-mono text-[9px] text-slate-450 tracking-wider flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-red-400 animate-pulse" />
              THERMAL SHIFT
            </span>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-xl font-bold text-slate-100">
                <AnimatedCounter value={tempAnomaly} decimals={2} prefix="+" />
              </span>
              <span className="font-mono text-[10px] text-slate-400">°C</span>
            </div>
            <span className={`block text-[9px] font-mono mt-1 font-semibold ${tempAnomaly < 1.10 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {tempAnomaly < 1.15 ? '✔ COOLING VECTOR' : '☕ THERMAL ACCRETION'}
            </span>
          </div>

          {/* Card 3: Glacier Melt */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-lg cyber-glow-blue">
            <span className="font-mono text-[9px] text-slate-450 tracking-wider flex items-center gap-1">
              <Wind className="w-3 h-3 text-blue-400" />
              POLAR ICE COVERAGE
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-xl font-bold text-slate-100">
                <AnimatedCounter value={glacialIce} decimals={1} />
              </span>
              <span className="font-mono text-[10px] text-slate-400">%</span>
            </div>
            <span className="block text-[9px] font-mono text-slate-500 mt-1 font-semibold">Ref Baseline 1990</span>
          </div>

          {/* Card 4: Ecosystem stability */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-lg cyber-glow-blue">
            <span className="font-mono text-[9px] text-slate-450 tracking-wider">ECOSYSTEM HEALTH</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-xl font-bold text-slate-100">
                <AnimatedCounter value={biodiversity} decimals={3} />
              </span>
              <span className="font-mono text-[10px] text-slate-400 font-semibold">index</span>
            </div>
            <span className={`block text-[9px] font-mono mt-1 font-bold ${biodiversity > 0.72 ? 'text-emerald-400' : 'text-red-400'}`}>
              {biodiversity > 0.72 ? '● STABILIZED' : '▲ THREAT METRIC'}
            </span>
          </div>
        </div>

        {/* Dynamic Interactive Recharts Graph */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 h-[240px] md:h-auto flex flex-col justify-between min-h-[220px] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              Planetary Vector Projection (Simulated Climate Trend)
            </h4>
            <div className="flex gap-4 font-mono text-[9px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-blue-500 inline-block rounded-xs" /> CO2
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-amber-500 inline-block rounded-xs" /> TEMP
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-emerald-500 inline-block rounded-xs" /> GLACIAL
              </span>
            </div>
          </div>

          <motion.div 
            className="flex-1 min-h-[160px]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {chartData && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity="0.6" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={8} 
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={8} 
                    fontFamily="monospace"
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '10px', fontFamily: 'monospace', borderRadius: '6px', color: '#f8fafc' }}
                    labelStyle={{ fontFamily: 'monospace', color: '#64748b' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="CO2 Level (ppm)" 
                    stroke="#3b82f6" 
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Temp Anomaly (°C)" 
                    stroke="#f97316" 
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Glacial Ice %" 
                    stroke="#10b981" 
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
