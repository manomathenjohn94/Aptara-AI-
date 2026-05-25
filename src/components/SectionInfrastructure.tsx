import React, { useState, useEffect } from "react";
import { ShieldCheck, HardHat, PlaneTakeoff, RefreshCw, Zap, Cpu, Compass } from "lucide-react";
import { motion } from "motion/react";

interface SectorSOD {
  id: string;
  name: string;
  code: string;
  ozoneUnit: number; // DU
  drones: number; // % deployed
  stress: "low" | "medium" | "severe";
  activeLaunch: boolean;
  progress: number;
}

interface SectionInfrastructureProps {
  onNotifyLog: (msg: string, type: "info" | "warning" | "success") => void;
}

export default function SectionInfrastructure({ onNotifyLog }: SectionInfrastructureProps) {
  const [sectors, setSectors] = useState<SectorSOD[]>([
    { id: "sec1", name: "Arctic Vortex Corridor", code: "SEC-ARCTIC", ozoneUnit: 220, drones: 15, stress: "severe", activeLaunch: false, progress: 0 },
    { id: "sec2", name: "Amazon Carbon Sync Offset", code: "SEC-AMAZON", ozoneUnit: 285, drones: 45, stress: "medium", activeLaunch: false, progress: 0 },
    { id: "sec3", name: "Sahara Dust Albedo Array", code: "SEC-SAHARA", ozoneUnit: 310, drones: 80, stress: "low", activeLaunch: false, progress: 0 },
    { id: "sec4", name: "Indo-Pacific Marine Basin", code: "SEC-INDOPAC", ozoneUnit: 245, drones: 30, stress: "medium", activeLaunch: false, progress: 0 },
    { id: "sec5", name: "Epsilon Antarctic Drift", code: "SEC-EPSILON", ozoneUnit: 195, drones: 5, stress: "severe", activeLaunch: false, progress: 0 },
  ]);

  const [scrubberGrid, setScrubberGrid] = useState({
    totalCellss: 1420,
    online: 1395,
    maintenance: 25,
    powerDraw: "3.2 GW",
    efficiency: 98.2,
  });

  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([
    "[SOD-SYS] Central deployment matrices standardized.",
    "[SOD-SYS] Standing by for aerosol launch vectors."
  ]);

  const logMessage = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDeploymentLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 8)]);
  };

  const sectorsRef = React.useRef(sectors);
  useEffect(() => {
    sectorsRef.current = sectors;
  }, [sectors]);

  const handleLaunchDrones = (secId: string) => {
    const s = sectors.find(x => x.id === secId);
    if (!s || s.activeLaunch || s.drones >= 100) return;

    onNotifyLog(`Authorized micro-drone and stratospheric dust launch protocol in ${s.name} (${s.code})`, "success");
    logMessage(`LAUNCH INTENT: Initiating flight paths in sector ${s.code}`);

    setSectors(prev => prev.map(item => {
      if (item.id === secId) {
        return { ...item, activeLaunch: true, progress: 0 };
      }
      return item;
    }));
  };

  // Progress logic for micro-drone launches
  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;
      const logsToPush: string[] = [];
      const parentLogsToPush: Array<{msg: string, type: "success" | "info" | "warning"}> = [];
      
      const nextSectors = sectorsRef.current.map(s => {
        if (s.activeLaunch) {
          changed = true;
          const nextProgress = s.progress + 15;
          if (nextProgress >= 100) {
            logsToPush.push(`DEPLOY COMPLETE: Ozone shield stabilized over ${s.code}`);
            parentLogsToPush.push({
              msg: `Smart Observer Device (SOD) monitoring swarms successfully arrived and stabilized over ${s.name}`,
              type: "success"
            });
            return {
              ...s,
              activeLaunch: false,
              progress: 0,
              drones: Math.min(100, s.drones + 35),
              ozoneUnit: Math.min(330, s.ozoneUnit + 55),
              stress: s.ozoneUnit + 55 >= 300 ? "low" : "medium" as any
            };
          }
          
          if (nextProgress === 15) {
            logsToPush.push(`FLIGHT: Aerosol transport drones entering mid-stratosphere in ${s.code}`);
          } else if (nextProgress === 60) {
            logsToPush.push(`DISPERSAL: Commencing microcrystalline dust & ozone seeding sequence`);
          }
          
          return { ...s, progress: nextProgress };
        }
        return s;
      });

      if (changed) {
        setSectors(nextSectors);
        
        if (logsToPush.length > 0) {
          const timestamp = new Date().toLocaleTimeString();
          setDeploymentLogs(prev => {
            const newLogs = logsToPush.map(log => `[${timestamp}] ${log}`);
            return [...newLogs, ...prev].slice(0, 10);
          });
        }
        
        parentLogsToPush.forEach(log => {
          onNotifyLog(log.msg, log.type);
        });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [onNotifyLog]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 h-full">
      {/* 1. Global Infrastructure Asset Stats */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        {/* Core Cells Status Board */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-blue-400" />
            Macro Infrastructure Status
          </h3>
          <p className="text-[11px] text-slate-450 leading-relaxed font-sans mb-4">
            Oversight of continental scrubbers, aerosol release terminals, and oceanic sonar grid nodes.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500">CO2 SCRUB CELL TOTAL</span>
              <span className="font-bold text-slate-100">{scrubberGrid.totalCellss}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-950/40 p-2 border border-emerald-900/50 rounded flex flex-col">
                <span className="text-[10px] text-emerald-400 font-bold">ONLINE</span>
                <span className="font-semibold text-emerald-200">{scrubberGrid.online} cells</span>
              </div>
              <div className="bg-amber-950/40 p-2 border border-amber-900/50 rounded flex flex-col">
                <span className="text-[10px] text-amber-500 font-bold">MAINTENANCE</span>
                <span className="font-semibold text-amber-200">{scrubberGrid.maintenance} cells</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 text-[11px] border-b border-slate-850">
              <span className="text-slate-500">GRID EFFICIENCY RATIO</span>
              <span className="text-emerald-400 font-bold">{scrubberGrid.efficiency}%</span>
            </div>

            <div className="flex justify-between items-center py-1 text-[11px]">
              <span className="text-slate-500">INDISPENSABLE POWER DRAW</span>
              <span className="text-blue-400 font-bold">{scrubberGrid.powerDraw}</span>
            </div>
          </div>
        </div>

        {/* Tactical Air/SOD Deployment Tech Specs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-2">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              SOD Spec Diagnostics
            </h3>
            <p className="text-[11.5px] text-slate-450 font-sans leading-relaxed mb-4">
              Smart Observer Device (SOD) systems operate via solar-powered micro-uav swarm lattices to capture high-altitude environmental telemetry, monitor ozone concentrations, and guide thermal reflection fluxes.
            </p>
          </div>

          <div className="space-y-1.5 font-mono text-[10px] border-t border-slate-800 pt-3">
            <div className="flex justify-between text-slate-500">
              <span>DEPLOYMENT SYSTEM:</span>
              <span className="text-slate-300 font-medium font-bold">AEROSOL ATOMIZER TYPE-7</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>SOLAR ABSORBANCE SCALE:</span>
              <span className="text-slate-300 font-medium">0.034 um particle albedo</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>O3 LIFETIME SPHERE:</span>
              <span className="text-slate-300 font-medium">48-Hour synthetic decay cycle</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stratosphere Sec Area & Swarm Deployments */}
      <div className="xl:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center justify-between mb-4">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              SOD Stratospheric Drone Command Suite
            </span>
            <span className="font-mono text-[10px] text-slate-500 font-normal">Active Shields: 5/5 sectors</span>
          </h3>

          {/* Sector grid */}
          <div className="space-y-3.5">
            {sectors.map((sec) => (
              <div 
                key={sec.id} 
                className="bg-slate-950/60 border border-slate-850 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden text-slate-300"
              >
                {/* Visual stress alert glows */}
                {sec.stress === "severe" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-650" />
                )}
                {sec.stress === "medium" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                )}
                {sec.stress === "low" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                )}

                {/* Left block Info */}
                <div className="md:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs text-slate-200 font-bold">{sec.name}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">{sec.code}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">OZONE: <strong className={sec.ozoneUnit < 230 ? "text-red-400 font-bold" : sec.ozoneUnit < 280 ? "text-amber-500 font-semibold" : "text-emerald-400 font-semibold"}>{sec.ozoneUnit} DU</strong></span>
                    <span>DRONES: <strong className="text-slate-300 font-medium">{sec.drones}%</strong></span>
                  </div>
                </div>

                {/* Central progress visualizer */}
                <div className="flex-1">
                  {sec.activeLaunch ? (
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[9px] text-blue-400 animate-pulse font-semibold uppercase">
                        <span>Deploying SOD aerosol vector...</span>
                        <span>{sec.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden p-0.5 border border-slate-800">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-sm"
                          style={{ width: `${sec.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 bg-slate-900 h-1.5 rounded overflow-hidden p-0.5 border border-slate-800">
                        <div className="h-full bg-slate-700 rounded-sm" style={{ width: `${sec.drones}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">GRID LOAD</span>
                    </div>
                  )}
                </div>

                {/* Launch Action Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleLaunchDrones(sec.id)}
                    disabled={sec.activeLaunch || sec.drones >= 100}
                    className={`px-3 py-1.5 rounded font-mono text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer shadow-md ${
                      sec.drones >= 100 ? "bg-slate-900 text-slate-500 border border-slate-850 cursor-not-allowed" : ""
                    }`}
                  >
                    <PlaneTakeoff className="w-3.5 h-3.5" />
                    {sec.activeLaunch ? "COUNTDOWN..." : sec.drones >= 100 ? "MAX DRONES" : "LAUNCH SOD"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Console Printouts */}
        <div className="mt-5 bg-slate-950/80 border border-slate-850 rounded-lg p-3 shadow-inner">
          <div className="flex items-center justify-between text-slate-500 font-mono text-[9px] uppercase mb-2 border-b border-slate-800 pb-1.5">
            <span>Core Deployment Logs</span>
            <span className="text-blue-400 font-bold">SYSTEM_READY</span>
          </div>
          <div className="space-y-1 max-h-[85px] overflow-y-auto">
            {deploymentLogs.map((log, idx) => (
              <div key={idx} className="font-mono text-[10px] text-slate-500 leading-normal flex items-start gap-2">
                <span className="text-blue-400 flex-shrink-0 font-bold">&gt;&gt;</span>
                <span className="font-mono text-slate-400">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
