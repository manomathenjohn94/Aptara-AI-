import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, Flame, Loader2, Sparkles, RefreshCw, Layers, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, Line, ResponsiveContainer } from "recharts";
import { DisasterAlert, LocalAlert } from "../types";

const DEFAULT_RESOLVED_HISTORY: LocalAlert[] = [
  {
    id: "hist-1",
    title: "Geothermal Vent Overpressure",
    description: "Slight tectonic rift caused excessive geothermal vent release. Capped successfully using thermal lattices.",
    severity: "medium",
    sector: "ICELAND-RIFT",
    status: "resolved" as any,
    mitigationProgress: 100,
    trendHistory: [30, 25, 10, 2, 0],
    detectionTime: "07:45:10",
    resolvedTime: "08:14:22"
  },
  {
    id: "hist-2",
    title: "Stratospheric Carbon Spurt",
    description: "Brief methane pocket emission over Sector INDO-PAC. Atmospheric seed drone fleet successfully neutralized the cloud.",
    severity: "low",
    sector: "INDO-PAC",
    status: "resolved" as any,
    mitigationProgress: 100,
    trendHistory: [15, 12, 5, 1, 0],
    detectionTime: "04:55:00",
    resolvedTime: "05:10:45"
  }
];

export function getPastTimeString(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function getInitialTrend(severity: "low" | "medium" | "high" | "critical"): number[] {
  switch (severity) {
    case "critical":
      return [90, 94, 91, 95, 93];
    case "high":
      return [72, 79, 74, 80, 77];
    case "medium":
      return [48, 54, 49, 53, 51];
    case "low":
      return [18, 24, 19, 25, 21];
  }
}

interface SectionDisasterManagementProps {
  onNotifyLog: (msg: string, type: "info" | "warning" | "success") => void;
  onLocateOnMap?: (sector: string) => void;
  alerts: LocalAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<LocalAlert[]>>;
}

export default function SectionDisasterManagement({ onNotifyLog, onLocateOnMap, alerts, setAlerts }: SectionDisasterManagementProps) {

  const [isSimulating, setIsSimulating] = useState(false);

  const [resolvedHistory, setResolvedHistory] = React.useState<LocalAlert[]>(() => {
    try {
      const saved = localStorage.getItem("aptara_resolved_history");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading resolved history from localStorage", e);
    }
    return DEFAULT_RESOLVED_HISTORY;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("aptara_resolved_history", JSON.stringify(resolvedHistory));
    } catch (e) {
      console.error("Error saving resolved history to localStorage", e);
    }
  }, [resolvedHistory]);

  const clearAllHistory = () => {
    setResolvedHistory([]);
    onNotifyLog("Cleared historical crisis registry", "info");
  };

  const deleteHistoryItem = (id: string) => {
    setResolvedHistory(prev => prev.filter(x => x.id !== id));
    onNotifyLog("Removed specific crisis outcome log from registry", "info");
  };

  const alertsRef = React.useRef(alerts);
  React.useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  // Unified progression interval for mitigating hazards and updating active sparkline data
  React.useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;
      const completedNotify: Array<{title: string, sector: string}> = [];
      
      const nextAlerts = alertsRef.current.map(a => {
        if (a.status === "mitigating") {
          changed = true;
          const nextProgress = (a.mitigationProgress || 0) + 20;
          
          const initialVal = a.trendHistory[0] ?? (a.severity === "critical" ? 95 : a.severity === "high" ? 78 : a.severity === "medium" ? 52 : 22);
          const nextVal = Math.max(0, initialVal * (1 - nextProgress / 100));
          const newHistory = [...a.trendHistory.slice(-8), nextVal];

          if (nextProgress >= 100) {
            completedNotify.push({ title: a.title, sector: a.sector });
            const resolvedTimeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            const resolvedItem: LocalAlert = {
              ...a,
              status: "resolved" as any,
              mitigationProgress: 100,
              trendHistory: [...a.trendHistory.slice(-8), 0],
              resolvedTime: resolvedTimeStr
            };
            setResolvedHistory(prev => {
              if (prev.some(x => x.id === a.id)) return prev;
              return [resolvedItem, ...prev];
            });
            return resolvedItem;
          }
          return { ...a, mitigationProgress: nextProgress, trendHistory: newHistory };
        } else if (a.status === "detected") {
          changed = true;
          const lastVal = a.trendHistory[a.trendHistory.length - 1] ?? (a.severity === "critical" ? 95 : a.severity === "high" ? 78 : a.severity === "medium" ? 52 : 22);
          const variance = (Math.random() * 4) - 2; // +/- 2
          const base = a.severity === "critical" ? 95 : a.severity === "high" ? 78 : a.severity === "medium" ? 52 : 22;
          const nextVal = Math.max(base * 0.7, Math.min(base * 1.3, lastVal + variance));
          const newHistory = [...a.trendHistory.slice(-8), nextVal];
          return { ...a, trendHistory: newHistory };
        } else if (a.status === "resolved") {
          const lastVal = a.trendHistory[a.trendHistory.length - 1];
          if (lastVal !== 0) {
            changed = true;
            return { ...a, trendHistory: [...a.trendHistory.slice(-8), 0] };
          }
        }
        return a;
      });

      if (changed) {
        setAlerts(nextAlerts);
        completedNotify.forEach(item => {
          onNotifyLog(`Resolved hazard: [${item.title}] successfully mitigated inside Sector ${item.sector}`, "success");
        });
      }
    }, 850);

    return () => clearInterval(interval);
  }, [onNotifyLog, setResolvedHistory]);

  const handleMitigate = (alertId: string) => {
    const targetAlert = alerts.find(a => a.id === alertId);
    if (!targetAlert || targetAlert.status === "mitigating" || targetAlert.status === "resolved") return;

    onNotifyLog(`Dispatched Automated Responders to mitigate [${targetAlert.title}] in Sector ${targetAlert.sector}`, "success");

    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        const lastVal = a.trendHistory[a.trendHistory.length - 1] ?? 50;
        const newTrend = [...a.trendHistory, Math.max(0, lastVal * 0.95)];
        return { ...a, status: "mitigating" as any, mitigationProgress: 5, trendHistory: newTrend };
      }
      return a;
    }));
  };

  const handleTriggerCrisis = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const type = ["Tectonic Cascade", "Nitrogen Anomaly", "Vapor Deficit Wildfire", "Ocean Coral Acid Collapse"][Math.floor(Math.random() * 4)];
      const sectorsList = ["ARCTIC-A", "AFRICA-CORRIDOR", "MARIANA-GRID", "AMAZON-SYNCS"];
      const pickedSector = sectorsList[Math.floor(Math.random() * sectorsList.length)];
      const severityLevels: ("low" | "medium" | "high" | "critical")[] = ["low", "medium", "high", "critical"];
      const pickedSeverity = severityLevels[Math.floor(Math.random() * severityLevels.length)];

      const newAlert: LocalAlert = {
        id: Math.random().toString(),
        title: `Simulated: ${type}`,
        description: `Central sensor grids detected escalating anomalous variance. Mobilization pathways recommended immediately.`,
        severity: pickedSeverity,
        sector: pickedSector,
        status: "detected",
        mitigationProgress: 0,
        trendHistory: getInitialTrend(pickedSeverity),
        detectionTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };

      setAlerts(prev => [newAlert, ...prev]);
      onNotifyLog(`CRITICAL ANOMALY SPARKED: [${newAlert.title}] detected inside sector ${newAlert.sector}`, "warning");
      setIsSimulating(false);
    }, 1000);
  };

  const clearResolved = () => {
    const resolvedActive = alerts.filter(x => x.status === "resolved");
    if (resolvedActive.length > 0) {
      setResolvedHistory(prev => {
        const nextHist = [...prev];
        resolvedActive.forEach(a => {
          if (!nextHist.some(x => x.id === a.id)) {
            const histItem: LocalAlert = {
              ...a,
              resolvedTime: a.resolvedTime || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
            };
            nextHist.unshift(histItem);
          }
        });
        return nextHist;
      });
      setAlerts(prev => prev.filter(x => x.status !== "resolved"));
      onNotifyLog(`Archived ${resolvedActive.length} resolved alerts to the historical registry`, "success");
    } else {
      onNotifyLog("No resolved alerts to archive from active queue", "info");
    }
  };

  // Helper colors for severity
  const getSeverityBadge = (sev: "low" | "medium" | "high" | "critical") => {
    switch (sev) {
      case "low": return "bg-slate-100 border-slate-350 text-slate-600 font-bold";
      case "medium": return "bg-amber-100 border-amber-300 text-amber-800 font-bold";
      case "high": return "bg-orange-100 border-orange-300 text-orange-850 font-bold";
      case "critical": return "bg-red-100 border-red-300 text-red-900 font-extrabold animate-pulse";
    }
  };

  const getPulseColor = (sev: "low" | "medium" | "high" | "critical") => {
    switch (sev) {
      case "critical": return "rgba(220, 38, 38, 0.5)";
      case "high": return "rgba(234, 88, 12, 0.45)";
      case "medium": return "rgba(217, 119, 6, 0.35)";
      case "low": return "rgba(37, 99, 235, 0.3)";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
      {/* Simulation Command Center */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-blue-400" />
            Crisis Mitigation Orchestrator
          </h3>
          <p className="text-[11px] text-slate-450 font-sans leading-relaxed mb-4">
            Aptara continuously processes satellite feed anomalies. Toggle automated drone seeders, seismic dampener pulses, and marine filtration lattices instantly to neutralize environmental tipping points.
          </p>

          <div className="space-y-3 pt-2">
            <button
               onClick={handleTriggerCrisis}
               disabled={isSimulating}
               className="w-full py-2.5 rounded-lg font-mono text-[10px] font-bold bg-rose-650 hover:bg-rose-700 text-white flex items-center justify-center gap-2 border border-rose-700/20 transition-all cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ANALYZING SATELLITE FIELDS...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-white" />
                  INJECT SIMULATED PLANETARY CRISIS
                </>
              )}
            </button>

            <button
              onClick={clearResolved}
              className="w-full py-2.5 rounded-lg font-mono text-[10px] font-bold bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              ARCHIVE RESOLVED ALERTS
            </button>
          </div>
        </div>

        {/* Tactical status readout */}
        <div className="pt-4 border-t border-slate-800 font-mono text-[10px] space-y-1.5 mt-6">
          <div className="flex justify-between">
            <span className="text-slate-500">HAZARD TRIAGE SPEED:</span>
            <span className="text-emerald-400 font-bold">0.85s response index</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">ACTIVE DETECTIONS:</span>
            <span className="text-amber-400 font-bold">{alerts.filter(x => x.status === "detected").length} current</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-505 text-slate-500">MITIGATIONS IN ACTION:</span>
            <span className="text-blue-400 font-bold animate-pulse">{alerts.filter(x => x.status === "mitigating").length} processing</span>
          </div>
        </div>
      </div>

      {/* Operational alert ledger & Resolved History Archive */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Active Hazards Section */}
        <div className="flex flex-col gap-3">
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-200 mb-1 px-1">
            Active Planetary Risk Ledger
          </h4>

          {alerts.length === 0 ? (
            <div className="bg-slate-955/45 border border-slate-850 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-2 opacity-50" />
              <span className="font-mono text-xs text-slate-400">Ledger clear: No active planetary crises detected.</span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {alerts.map((al) => (
                  <motion.div
                     key={al.id}
                     initial={{ opacity: 0, y: -12, scale: 0.95, boxShadow: "0 0 0 0px rgba(0,0,0,0)" }}
                     animate={{ 
                       opacity: 1, 
                       y: 0, 
                       scale: [0.95, 1.04, 0.98, 1],
                       boxShadow: [
                         `0 0 0 0px ${getPulseColor(al.severity)}`,
                         `0 0 0 8px ${getPulseColor(al.severity)}`,
                         `0 0 0 14px rgba(0,0,0,0)`,
                         `0 0 0 0px rgba(0,0,0,0)`
                       ]
                     }}
                     exit={{ opacity: 0, width: 0 }}
                     transition={{ 
                       duration: 0.75, 
                       times: [0, 0.35, 0.75, 1],
                       ease: "easeOut"
                     }}
                     className={`border rounded-xl p-3.5 transition-all relative overflow-hidden ${
                       al.status === "resolved" 
                         ? "bg-emerald-950/40 border-emerald-900 shadow-xl" 
                         : al.status === "mitigating" 
                           ? "bg-blue-950/40 border border-blue-900 shadow-xl" 
                           : "bg-slate-900 border border-slate-800 shadow-lg"
                     }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {al.status === "resolved" ? (
                          <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-red-950 border border-red-900 flex items-center justify-center text-red-400 flex-shrink-0">
                            <Flame className="w-4 h-4" />
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`font-heading text-xs font-bold ${al.status === "resolved" ? "text-slate-500 line-through" : "text-slate-100"}`}>
                              {al.title}
                            </span>
                            <span className={`font-mono text-[8px] px-1.5 rounded uppercase border ${getSeverityBadge(al.severity)}`}>
                              {al.severity}
                            </span>
                            <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">
                              [{al.sector}]
                            </span>
                          </div>
                          <p className={`text-[11px] leading-relaxed font-sans ${al.status === "resolved" ? "text-slate-400 font-normal" : "text-slate-300 font-medium"}`}>
                            {al.description}
                          </p>
                          <div className="flex items-center gap-1.5 pt-1 text-[9.5px] font-mono text-slate-500">
                            <Clock className="w-3 h-3 text-slate-650" />
                            <span>Detection Time: <span className="font-semibold text-slate-400">{al.detectionTime}</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Sparkline & Action controls */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3.5 flex-shrink-0">
                        
                        {/* MINI SPARKLINE CHART */}
                        {(() => {
                          const lastIdx = al.trendHistory.length - 1;
                          const lastVal = al.trendHistory[lastIdx] ?? 50;

                          // Calculate predictive projection points
                          let p1 = 0;
                          let p2 = 0;
                          if (al.status === "detected") {
                            const escalationFactor = al.severity === "critical" ? 1.25 : al.severity === "high" ? 1.18 : 1.1;
                            p1 = Math.min(100, lastVal * escalationFactor);
                            p2 = Math.min(100, p1 * escalationFactor);
                          } else if (al.status === "mitigating") {
                            p1 = Math.max(0, lastVal * 0.4);
                            p2 = Math.max(0, p1 * 0.25);
                          }

                          // Combine historic values and seamless connection for dotted line
                          const sparkChartData = [
                            ...al.trendHistory.map((val, idx) => ({
                              idx,
                              val: val,
                              predVal: idx === lastIdx ? val : undefined
                            })),
                            { idx: lastIdx + 1, val: undefined, predVal: p1 },
                            { idx: lastIdx + 2, val: undefined, predVal: p2 }
                          ];

                          const strokeColor = al.status === "resolved" 
                            ? "#10b981" 
                            : al.status === "mitigating" 
                              ? "#3b82f6" 
                              : al.severity === "critical" 
                                ? "#ef4444" 
                                : al.severity === "high" 
                                  ? "#f97316" 
                                  : "#f59e0b";

                          return (
                            <div className="flex flex-col items-center justify-center font-mono bg-slate-950/40 border border-slate-850 p-1.5 rounded-lg w-24 shadow-xs">
                              <span className="text-[7px] uppercase font-bold text-slate-500 tracking-wider">Risk Index</span>
                              <motion.div 
                                className="w-20 h-6 my-0.5"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={sparkChartData}>
                                    <defs>
                                      <linearGradient id={`sparkGrad-${al.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={al.status === "resolved" ? "#10b981" : al.status === "mitigating" ? "#3b82f6" : al.severity === "critical" ? "#ef4444" : al.severity === "high" ? "#f97316" : "#f59e0b"} stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor={al.status === "resolved" ? "#10b981" : al.status === "mitigating" ? "#3b82f6" : al.severity === "critical" ? "#ef4444" : al.severity === "high" ? "#f97316" : "#f59e0b"} stopOpacity={0.0}/>
                                      </linearGradient>
                                    </defs>
                                    <Area
                                      type="monotone"
                                      dataKey="val"
                                      stroke={strokeColor}
                                      strokeWidth={1.5}
                                      fill={`url(#sparkGrad-${al.id})`}
                                      dot={false}
                                      isAnimationActive={true}
                                      animationDuration={1200}
                                      animationEasing="ease-out"
                                    />
                                    <Line
                                      type="monotone"
                                      dataKey="predVal"
                                      stroke={strokeColor}
                                      strokeWidth={1.5}
                                      strokeDasharray="2.5 2.5"
                                      dot={false}
                                      isAnimationActive={true}
                                      animationDuration={1200}
                                      animationEasing="ease-out"
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </motion.div>
                              <div className="flex flex-col items-center gap-0.5 mt-0.5">
                                <span className={`text-[8.5px] font-bold tracking-tight ${al.status === "resolved" ? "text-emerald-400" : al.status === "mitigating" ? "text-blue-400" : al.severity === "critical" ? "text-red-400 animate-pulse" : "text-amber-400"}`}>
                                  {al.status === "resolved" ? "0.0%" : `${lastVal.toFixed(1)}%`}
                                </span>
                                {al.status !== "resolved" && (
                                  <span className="text-[6.5px] font-semibold text-slate-500/80 leading-none uppercase tracking-wide flex items-center gap-0.5">
                                    <span className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" />
                                    <span>Proj: {p2.toFixed(0)}%</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Action Block */}
                        <div className="flex-shrink-0 min-w-[124px] flex flex-col items-end gap-2">
                          {al.status === "detected" && (
                            <button
                              onClick={() => handleMitigate(al.id)}
                              className="px-2.5 py-1.5 sm:px-3 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 rounded font-mono text-[9.5px] font-bold uppercase transition-all cursor-pointer shadow-sm"
                            >
                              Mobilize Responders
                            </button>
                          )}
                          
                          {al.status === "mitigating" && (
                            <span className="text-[10px] font-mono text-blue-400 font-bold flex items-center justify-end gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              MITIGATING...
                            </span>
                          )}
    
                          {al.status === "resolved" && (
                            <span className="text-[10px] font-mono text-emerald-450 font-bold uppercase flex items-center justify-end gap-1 bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded animate-bounce" style={{ animationDuration: '3s' }}>
                              RESOLVED
                            </span>
                          )}

                          <button
                            onClick={() => onLocateOnMap?.(al.sector)}
                            className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-blue-400 border border-slate-850 rounded font-mono text-[8.5px] font-bold uppercase py-1 px-2.5 transition-all cursor-pointer shadow-xs"
                            title={`Track ${al.sector} coordinates on Sensor Map`}
                          >
                            <MapPin className="w-2.5 h-2.5" />
                            <span>Locate on Map</span>
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Progressive progress bar for active mitigation */}
                    {al.status === "mitigating" && (
                       <div className="mt-3.5 space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-slate-500">
                          <span>Aerosol Seeding and Grid Stabilizers active</span>
                          <span>{al.mitigationProgress}% complete</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 p-0.5 rounded border border-slate-850 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-sm" style={{ width: `${al.mitigationProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Historical Crisis Outcomes Archive Section */}
        <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 mt-2">
          <div className="flex items-center justify-between px-1 mb-1">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Historical Crisis Resolution Registry
            </h4>
            {resolvedHistory.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="font-mono text-[9px] text-slate-500 hover:text-red-400 font-semibold uppercase flex items-center gap-1 transition-colors cursor-pointer"
              >
                Clear Registry ({resolvedHistory.length})
              </button>
            )}
          </div>

          {resolvedHistory.length === 0 ? (
            <div className="bg-slate-950/45 border border-slate-850 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-[10px] text-slate-500">Archive empty: No resolved crisis logs registered.</span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {resolvedHistory.map((hAlert) => (
                  <motion.div
                    key={hAlert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="border border-slate-850 rounded-xl p-3 bg-slate-950/50 hover:bg-slate-900/50 transition-all relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-900 flex items-center justify-center text-emerald-400 flex-shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-heading text-xs font-bold text-slate-200">
                              {hAlert.title}
                            </span>
                            <span className={`font-mono text-[7px] px-1.5 rounded uppercase border ${getSeverityBadge(hAlert.severity)}`}>
                              {hAlert.severity}
                            </span>
                            <span className="font-mono text-[8.5px] text-slate-500 font-bold uppercase">
                              [{hAlert.sector}]
                            </span>
                          </div>
                          <p className="text-[10.5px] leading-relaxed font-sans text-slate-400">
                            {hAlert.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-[9px] font-mono text-slate-500">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5 text-slate-600" />
                              Detected: <span className="font-semibold text-slate-400">{hAlert.detectionTime}</span>
                            </span>
                            <span className="text-slate-850">|</span>
                            <span className="flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-500/80" />
                              Mitigated: <span className="font-semibold text-emerald-400">{hAlert.resolvedTime}</span>
                            </span>
                            {hAlert.sector && onLocateOnMap && (
                              <>
                                <span className="text-slate-850">|</span>
                                <button
                                  onClick={() => onLocateOnMap(hAlert.sector)}
                                  className="text-[9px] font-bold text-slate-400 hover:text-blue-400 uppercase flex items-center gap-0.5 transition-colors cursor-pointer"
                                >
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span>Locate Sector</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-900/60 px-1.5 py-0.5 rounded font-bold uppercase">
                          OUTCOME: SUCCESS
                        </span>
                        <button
                          onClick={() => deleteHistoryItem(hAlert.id)}
                          className="text-[8.5px] font-mono text-slate-500 hover:text-red-400 font-medium uppercase transition-colors py-0.5 cursor-pointer"
                        >
                          Delete log
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
