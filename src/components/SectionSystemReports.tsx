import React, { useState, useEffect } from "react";
import { 
  FileText, RefreshCw, Play, Check, Download, Sparkles, 
  TrendingUp, Bot, Calendar, Wifi, Cpu, Layers, Activity, 
  ShieldCheck, Volume2, FileSpreadsheet, Eye, ClipboardCheck,
  Users, Radio, Zap, AlertTriangle, Sliders, Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from "recharts";

interface SystemReport {
  id: string;
  code: string;
  type: "daily" | "weekly" | "monthly" | "snapshot";
  target: "all" | "fusion" | "scrubber" | "swarm";
  timestamp: string;
  coherenceRate: number; // %
  avgLatency: number; // ms
  scrubberEfficiency: number; // %
  powerEfficiency: number; // %
  status: "certified" | "draft" | "auditing";
  executiveSummary: string;
  fusionLogs: string[];
  infraLogs: string[];
  chartData: Array<{ time: string; efficiency: number; loads: number; noise: number }>;
}

interface SectionSystemReportsProps {
  onNotifyLog: (msg: string, type: "info" | "warning" | "success") => void;
}

export default function SectionSystemReports({ onNotifyLog }: SectionSystemReportsProps) {
  // Config state for generating new reports
  const [rptType, setRptType] = useState<"daily" | "weekly" | "monthly" | "snapshot">("daily");
  const [rptTarget, setRptTarget] = useState<"all" | "fusion" | "scrubber" | "swarm">("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  
  // Selection of active report
  const [selectedReportId, setSelectedReportId] = useState<string>("rep-01");

  // Telemetry Pipeline sub views
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "trends" | "live-users" | "optimization">("pipeline");
  const [pulseStage, setPulseStage] = useState<number>(-1);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  // Data Flow Optimization states
  const [optSpaceComp, setOptSpaceComp] = useState<boolean>(false);
  const [optBrokerThreads, setOptBrokerThreads] = useState<boolean>(false);
  const [optAIBatchSize, setOptAIBatchSize] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Simulated live parameters for Auto-Optimization Tuning
  const [simulatedThreads, setSimulatedThreads] = useState<number>(1);
  const [simulatedBufferSize, setSimulatedBufferSize] = useState<number>(128); // in KB
  const [simulatedBatchSize, setSimulatedBatchSize] = useState<number>(1);

  // Live User Engagement Simulator states
  const [apiTokens, setApiTokens] = useState<number>(312450);
  const [activeQueries, setActiveQueries] = useState<number>(42);
  const [userLogs, setUserLogs] = useState<Array<{ time: string; user: string; action: string; location: string }>>([
    { time: "08:19:44", user: "Mano Mathen John (Owner)", action: "Triggered arctic vortex SRM albedo calibration", location: "HQ Main Command" },
    { time: "08:18:12", user: "Dr. Elena Vance (Climate Lead)", action: "Requested daily carbon saturation forecast matrix", location: "Geneva Lab Node" },
    { time: "08:15:30", user: "Aptara Central Daemon", action: "Completed real-time temporal handshake across ocean buoys", location: "Global Ocean Grid" },
    { time: "08:12:05", user: "K. Rasmussen (Ice Research)", action: "Queried geothermal hydrophone seismic baseline", location: "Iceland Rift Site" },
  ]);

  // Historic / Mock reports database
  const [reports, setReports] = useState<SystemReport[]>([
    {
      id: "rep-01",
      code: "REP-DAILY-2026-05-28-SECURE",
      type: "daily",
      target: "all",
      timestamp: "2026-05-28T08:15:00Z",
      coherenceRate: 99.4,
      avgLatency: 4.8,
      scrubberEfficiency: 98.2,
      powerEfficiency: 94.6,
      status: "certified",
      executiveSummary: "Aptara Central Intelligence has compiled the daily system audit for May 28, 2026. Global sensor nodes maintain complete synchronization under the Mano Mathen John strategic directives. High-density LiDAR and acoustic hydrophones show nominal coherence over marine sectors, while regional CO2 Scrubber Array 01 through 09 are performing at peak parameters (98.2% scrubbing efficiency). Solar SRM albedo feedback loops have successfully deferred thermal anomalies in the Arctic Vortex Corridor.",
      fusionLogs: [
        "[08:00:12] [FUSION-CORE] Syncing 1,420 orbital and terrestrial sensing nodes.",
        "[08:02:44] [SAT-SWARM-4] Double-phase microwave calibration complete over Amazon Sector D-12.",
        "[08:05:19] [SEISMIC-ICELAND] Cross-spectral low-pass noise filter updated. Seismic baseline stable.",
        "[08:10:02] [HYDRO-AC] Pacific marine arrays registering acoustic balance. Noise coefficient reduced."
      ],
      infraLogs: [
        "[08:01:05] [SCRUBB-SYS] Active mechatronic cell load: 1,395/1,420 (98.2% operating efficiency).",
        "[08:03:12] [SRM-UAV] Commencing high-altitude smart obducer repositioning over Greenland ice sheets.",
        "[08:07:44] [GRID-ENERGY] Planetary scrubber line consuming 3.2 GW. Power dissipation shields active.",
        "[08:12:30] [INTEGRATION] Quantum handshake established with regional Indian Sensing Hub (99.8% bandwidth)."
      ],
      chartData: [
        { time: "00:00", efficiency: 98.1, loads: 88, noise: 5 },
        { time: "04:00", efficiency: 98.8, loads: 91, noise: 4 },
        { time: "08:00", efficiency: 99.4, loads: 95, noise: 3 },
        { time: "12:00", efficiency: 99.0, loads: 93, noise: 4 },
        { time: "16:00", efficiency: 99.5, loads: 97, noise: 3 },
        { time: "20:00", efficiency: 99.4, loads: 96, noise: 2 }
      ]
    },
    {
      id: "rep-02",
      code: "REP-DAILY-2026-05-27-SECURE",
      type: "daily",
      target: "all",
      timestamp: "2026-05-27T08:00:00Z",
      coherenceRate: 98.9,
      avgLatency: 5.2,
      scrubberEfficiency: 97.5,
      powerEfficiency: 93.1,
      status: "certified",
      executiveSummary: "Strategic system report generated for the complete operational window on May 27, 2026. Environmental indicators stayed overall nominal with isolated degraded values along the Amazon Rift basin canopy. Scrubber load averages 1,380 active nodes under 3.1 GW draw. Tectonic dampeners in the Iceland sector performed standard shock absorptions successfully. Cognitive AI processing loads remain fully optimized locally in offline mechatronic backup mode.",
      fusionLogs: [
        "[07:30:15] [FUSION-CORE] Sensor fusion temporal realignment sequence initialized.",
        "[07:32:01] [SAT-SWARM-3] Satellite transponder tracking offset calibrated successfully.",
        "[07:45:12] [METEO-RAD] Dynamic wind vectoring data integrated with cloud albedo monitors.",
        "[07:55:00] [FUSION-SECURE] Signal-to-noise ratio in marine sonar improved (+2.4dB)."
      ],
      infraLogs: [
        "[07:31:40] [SCRUBB-SYS] Micro-filter scrubbing modules refreshed in Antarctic quadrant.",
        "[07:35:55] [DEPLOY-UAV] Seeding fleet dispatched in Amazon Rift Sector offset.",
        "[07:48:10] [THERMAL-SHIELD] Aquatic heat dissipation screens deployed in South Indo-Pacific Basin.",
        "[07:58:30] [STATION-CORE] Local power grid voltage stabilized across mechatronics nodes."
      ],
      chartData: [
        { time: "00:00", efficiency: 97.4, loads: 84, noise: 7 },
        { time: "04:00", efficiency: 98.2, loads: 88, noise: 6 },
        { time: "08:00", efficiency: 98.9, loads: 92, noise: 5 },
        { time: "12:00", efficiency: 98.5, loads: 90, noise: 6 },
        { time: "16:00", efficiency: 99.1, loads: 94, noise: 4 },
        { time: "20:00", efficiency: 98.9, loads: 93, noise: 5 }
      ]
    },
    {
      id: "rep-03",
      code: "REP-WEEKLY-W21-SECURE",
      type: "weekly",
      target: "fusion",
      timestamp: "2026-05-24T12:00:00Z",
      coherenceRate: 99.6,
      avgLatency: 4.2,
      scrubberEfficiency: 98.0,
      powerEfficiency: 95.8,
      status: "certified",
      executiveSummary: "CIEM Strategic Executive digest compiling Week 21 cumulative planetary observations. Sensor coherence achieved its highest baseline rate of 99.6%, thanks to the temporal alignment algorithms developed by CIEM Industries. The smart observer device (SOD) swarms tracked and mapped localized humidity decreases across equatorial grids perfectly. Infrastructure power delivery was 95.8% efficient, highlighting robust grid resilience against secondary tectonic stresses.",
      fusionLogs: [
        "[W21-MON] [FUSION] Albedo sensor calibrator verified globally.",
        "[W21-TUE] [SAT-ALIGN] Precision ground tracking node handshakes successfully completed.",
        "[W21-WED] [SONAR] Acoustic calibration across 48 marine coordinates finalized.",
        "[W21-FRI] [GEO-SYNC] Completed deep geothermal bore sensor alignment diagnostics."
      ],
      infraLogs: [
        "[W21-MON] [SCRUBBER] Refactored exhaust airflow patterns in Sector 04 & 05.",
        "[W21-WED] [UAV-DEPL] Autonomous drone route algorithms updated for optimized coverage.",
        "[W21-THU] [POWER-CORE] Grid load dynamic rerouting configured for winter vortex scenarios.",
        "[W21-SAT] [CELL-HEALTH] Automated scrub cells maintenance sequences executed on 25 nodes."
      ],
      chartData: [
        { time: "Mon", efficiency: 99.2, loads: 90, noise: 4 },
        { time: "Tue", efficiency: 99.4, loads: 93, noise: 3 },
        { time: "Wed", efficiency: 99.6, loads: 95, noise: 2 },
        { time: "Thu", efficiency: 99.5, loads: 94, noise: 3 },
        { time: "Fri", efficiency: 99.7, loads: 97, noise: 2 },
        { time: "Sat", efficiency: 99.6, loads: 96, noise: 2 },
        { time: "Sun", efficiency: 99.6, loads: 96, noise: 2 }
      ]
    }
  ]);

  // Selected report object
  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Trigger report speech reading out loud
  const handleVocalizeReport = () => {
    if (!window.speechSynthesis) {
      onNotifyLog("Speech synthesis is not supported on this device/sandboxed environment.", "warning");
      return;
    }
    window.speechSynthesis.cancel();
    
    // Construct rich text overview
    const speakText = `System Report ${activeReport.code}. Target focus: ${activeReport.target === "all" ? "All cores" : activeReport.target}. ` +
      `Sensor Fusion coherence rating is ${activeReport.coherenceRate}% with an average latency of ${activeReport.avgLatency} milliseconds. ` +
      `CO2 scrubber efficiency is active at ${activeReport.scrubberEfficiency}%. ` +
      `Executive Summary: ${activeReport.executiveSummary}`;

    const rateVal = parseFloat(localStorage.getItem("aptara-voice-rate") || "1.00");
    const pitchVal = parseFloat(localStorage.getItem("aptara-voice-pitch") || "1.05");
    const gender = localStorage.getItem("aptara-voice-gender") || "male";

    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.rate = rateVal;
    utterance.pitch = pitchVal;

    // Direct voice matching
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => {
      const name = v.name.toLowerCase();
      if (gender === "female") {
        return name.includes("zira") || name.includes("female") || name.includes("google uk english female");
      } else {
        return name.includes("david") || name.includes("male") || name.includes("google uk english male");
      }
    });

    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
    onNotifyLog(`Narrating strategic system report [${activeReport.code}] aloud.`, "success");
  };

  // Trigger real file download of JSON report
  const handleDownloadReportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeReport.code}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onNotifyLog(`Exported telemetry report file [${activeReport.code}.json] successfully.`, "success");
  };

  // Run dynamic generation animation sequence
  const handleGenerateReport = () => {
    setIsGenerating(true);
    onNotifyLog(`Initiating system reports compile request: ${rptType.toUpperCase()} - ${rptTarget.toUpperCase()}`, "info");

    const steps = [
      "Securing encrypted neural handshake with mechatronic nodes...",
      "Extracting raw data feeds from 1,420 orbital and ocean platforms...",
      "Analyzing temporal alignment coherence via NVIDIA Jetson edge platform...",
      "Compiling atmospheric Carbon Scrubber array load parameters...",
      "Formulating prognostic AI trend analysis predictions...",
      "Finalizing cryptographic validation certificate..."
    ];

    let currentStep = 0;
    setGenerationStep(steps[0]);

    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStep(steps[currentStep]);
      } else {
        clearInterval(stepInterval);
        
        // Finalize generating report object
        const epochCode = `REP-${rptType.toUpperCase()}-${new Date().toISOString().slice(0, 10).toUpperCase()}-NEW`;
        const varianceCoherence = +(98.5 + Math.random() * 1.4).toFixed(1);
        const varianceLatency = +(3.8 + Math.random() * 2).toFixed(1);
        const varianceScrubber = +(96.8 + Math.random() * 2.5).toFixed(1);
        const variancePower = +(92.5 + Math.random() * 4).toFixed(1);

        const newRep: SystemReport = {
          id: `rep-${Date.now()}`,
          code: epochCode,
          type: rptType,
          target: rptTarget,
          timestamp: new Date().toISOString(),
          coherenceRate: varianceCoherence,
          avgLatency: varianceLatency,
          scrubberEfficiency: varianceScrubber,
          powerEfficiency: variancePower,
          status: "certified",
          executiveSummary: `Newly compiled ${rptType} diagnostic overview for strategic operations. The planetary sensing deck achieved an outstanding sensor coherence index of ${varianceCoherence}% with processing latencies confined to ${varianceLatency}ms. Mechatronic carbon extraction arrays are operating nominally under standard load guidelines, maintaining ${varianceScrubber}% carbon absorption accuracy. Initiated by on-site automated protocols under CIEM Industries.`,
          fusionLogs: [
            "[NEW-01] Collected real-time edge micro-telemetry packets from all active sectors.",
            "[NEW-02] Verified high-resolution infrared thermal bounds over ocean anomalies.",
            "[NEW-03] Dynamic sensor calibration synchronized with Amazon and iceland rifts."
          ],
          infraLogs: [
            "[NEW-01] Validated active Carbon Scrubber power draws (stable at 3.25 GW).",
            "[NEW-02] Autonomous drone fleet positioning optimized for updated global albedo offsets.",
            "[NEW-03] Verified local electrical mechatronics grid is fully insulated from tectonic noise."
          ],
          chartData: [
            { time: "00:00", efficiency: +(varianceScrubber - 1.2).toFixed(1), loads: 85, noise: 4 },
            { time: "04:00", efficiency: +(varianceScrubber - 0.5).toFixed(1), loads: 89, noise: 3 },
            { time: "08:00", efficiency: varianceScrubber, loads: 92, noise: 2 },
            { time: "12:00", efficiency: +(varianceScrubber - 0.2).toFixed(1), loads: 91, noise: 3 },
            { time: "16:00", efficiency: +(varianceScrubber + 0.3).toFixed(1), loads: 94, noise: 2 },
            { time: "20:00", efficiency: varianceScrubber, loads: 93, noise: 1 }
          ]
        };

        setReports(prev => [newRep, ...prev]);
        setSelectedReportId(newRep.id);
        setIsGenerating(false);
        onNotifyLog(`Successfully generated system report ${epochCode}. Added to operational index.`, "success");
      }
    }, 900);
  };

  useEffect(() => {
    if (pulseStage === -1) return;
    if (pulseStage >= 6) {
      const resetTimeout = setTimeout(() => {
        setPulseStage(-1);
      }, 500);
      return () => clearTimeout(resetTimeout);
    }
    const timer = setTimeout(() => {
      setPulseStage(prev => prev + 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [pulseStage]);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Tick tokens upward
      setApiTokens(prev => prev + Math.floor(Math.random() * 28) + 6);

      // 2. Fluctuate active queries randomly
      setActiveQueries(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const target = prev + delta;
        return target < 25 ? 25 : target > 75 ? 75 : target;
      });

      // 3. Keep logs clean and append new real-time actions
      if (Math.random() < 0.35) {
        const POSSIBLE_ACTS = [
          { user: "Mano Mathen John (Owner)", action: "Requested neural logic graph summary for scrubber cells", location: "HQ Main Command" },
          { user: "Dr. Elena Vance (Climate Lead)", action: "Initiated deep-sea ocean buoy signal realignment", location: "Geneva Lab Node" },
          { user: "K. Rasmussen (Ice Research)", action: "Verified Arctic albedo seeding coordinates alignment", location: "Iceland Rift Site" },
          { user: "Central Drone Autopilot", action: "Broadcasting geo-coordinates of mechatronic array thermal shift", location: "Amazon Rift" },
          { user: "S. Murthy (Integration Desk)", action: "Fetched quantum encryption handshakes for South Asia", location: "Bangalore Hub" },
          { user: "Aptara Central Daemon", action: "Archived certified daily carbon telemetry logs", location: "Mainframe Core" },
          { user: "N. Takahara (Marine Hub)", action: "Analyzed acoustic hydrophone pressure signal balance", location: "Kyoto Marine Port" },
          { user: "Field Inspector (#104)", action: "Inspected Smart Observer HUD sync payload for active swarm", location: "Sector D-12" },
          { user: "Guest Academic (#445)", action: "Queried temporal sensor fusion latency performance chart", location: "Tokyo Observatory" },
          { user: "UN Auditor (#22)", action: "Synthesized daily geo-engineering compliance report logs", location: "New York Hub" }
        ];

        const randomAct = POSSIBLE_ACTS[Math.floor(Math.random() * POSSIBLE_ACTS.length)];
        const timeNow = new Date().toLocaleTimeString();

        setUserLogs(prev => [
          { time: timeNow, ...randomAct },
          ...prev.slice(0, 18)
        ]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 h-full">
      {/* 1. Compile Configuration Sidebar Unit */}
      <motion.div 
        whileHover={{ scale: 1.002, borderColor: "#334155" }}
        transition={{ duration: 0.3 }}
        className="xl:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-2xl transition-all duration-300 h-fit xl:h-full"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              Compile Center
            </h3>
            <span className="font-mono text-[9px] text-emerald-500 font-extrabold px-1.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-900 uppercase">
              DEEP-TECH EXPORT
            </span>
          </div>

          {/* Configuration Forms */}
          <div className="space-y-4">
            {/* Interval */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">
                Periodic Interval Frame
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["daily", "weekly", "monthly", "snapshot"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setRptType(t)}
                    disabled={isGenerating}
                    className={`py-2 px-2.5 rounded-lg text-left font-mono text-xs uppercase tracking-wide border cursor-pointer transition-all ${
                      rptType === t
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-400 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    ● {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Core Module focus */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">
                Primary Core Module Target
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "all", name: "Full Station Status Matrix", icon: <Layers className="w-3.5 h-3.5" /> },
                  { id: "fusion", name: "Sensor Fusion Signal Coherence", icon: <Wifi className="w-3.5 h-3.5" /> },
                  { id: "scrubber", name: "CO2 Scrubber Health & Draw", icon: <Cpu className="w-3.5 h-3.5" /> },
                  { id: "swarm", name: "Smart drone Swarm Albedo Deflection", icon: <Activity className="w-3.5 h-3.5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRptTarget(item.id as any)}
                    disabled={isGenerating}
                    className={`w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-left font-sans text-xs border cursor-pointer transition-all ${
                      rptTarget === item.id
                        ? "bg-blue-950/50 border-blue-500 text-blue-300 font-medium"
                        : "bg-slate-950 border-slate-800 text-slate-350 hover:text-slate-100 hover:border-slate-700"
                    }`}
                  >
                    <span className={rptTarget === item.id ? "text-blue-400" : "text-slate-550"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate / Action Trigger Button with loading state */}
        <div className="pt-6 border-t border-slate-800 mt-6 lg:mt-0">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="generating-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-300">
                    Compiling Telemetry...
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal italic">
                  {generationStep}
                </p>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5.4, ease: "linear" }}
                    className="bg-emerald-500 h-full rounded-full"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="generate-active"
                onClick={handleGenerateReport}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-heading text-xs uppercase font-extrabold text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-100 animate-pulse" />
                Generate Strategic System Report
              </motion.button>
            )}
          </AnimatePresence>
          <span className="block text-[9px] font-mono tracking-wide text-slate-500 text-center mt-2.5 uppercase text-center">
            Secured under mechatronic cryptology standards
          </span>
        </div>
      </motion.div>

      {/* 2. Main Executive Report Panel */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        {/* Horizontal selector of past generated reports */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {reports.map((r) => {
            const isActive = r.id === selectedReportId;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className={`py-2 px-3.5 rounded-xl border flex items-center gap-2 flex-shrink-0 cursor-pointer transition-all ${
                  isActive 
                    ? "bg-slate-900 border-blue-500/50 text-blue-400 shadow-md font-mono" 
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-250 hover:border-slate-800"
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${isActive ? "text-blue-400 animate-pulse" : "text-slate-500"}`} />
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-bold tracking-tight">
                    {r.code.split("-").slice(0, 2).join(" ")}
                  </span>
                  <span className="block text-[8px] opacity-70 tracking-tighter">
                    {new Date(r.timestamp).toLocaleTimeString()} UTC
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Sheet view */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedReportId}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-950 border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden flex-1"
          >
            {/* Ambient cyber lines */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Document Header */}
            <div className="flex justify-between items-start flex-wrap gap-4 pb-4 border-b border-slate-850 relative z-10">
              <div className="space-y-1 pb-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 block">
                  Aptara Mainframe System Audit
                </span>
                <h4 className="font-heading text-lg font-black uppercase text-slate-150 tracking-wide flex items-center gap-2">
                  {activeReport.code}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[9px] text-emerald-450 bg-emerald-950/40 border border-emerald-900/60 px-1.5 py-0.5 rounded uppercase font-bold">
                    🛡 Certified Operational Status
                  </span>
                  <span className="text-slate-600 text-[10px]">•</span>
                  <span className="font-mono text-[9px] text-slate-405 font-medium">
                    Sector: GLOBAL CORE DIRECTIVE
                  </span>
                </div>
              </div>

              {/* Action Toolbar on Document */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleVocalizeReport}
                  className="px-3 py-1.5 text-[10px] font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-305 flex items-center gap-1.5 cursor-pointer hover:bg-slate-850"
                  title="Speak report out loud with synchronized voice rates"
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Listen AI Narration</span>
                </button>

                <button
                  onClick={handleDownloadReportJson}
                  className="px-3 py-1.5 text-[10px] font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-305 flex items-center gap-1.5 cursor-pointer hover:bg-slate-850"
                  title="Download telemetry details as JSON spreadsheet schema"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Micro Metrics Score Indexes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
              <div className="bg-slate-900/40 border border-slate-850/80 p-3 rounded-lg flex flex-col justify-between">
                <span className="font-mono text-[8px] text-slate-450 uppercase tracking-widest block">
                  FUSION COHERENCE
                </span>
                <span className="font-heading font-black text-xl text-emerald-400 mt-1 block">
                  {activeReport.coherenceRate}%
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  Target threshold &gt;95%
                </span>
              </div>

              <div className="bg-slate-900/40 border border-slate-850/80 p-3 rounded-lg flex flex-col justify-between">
                <span className="font-mono text-[8px] text-slate-450 uppercase tracking-widest block">
                  AVG NODE LATENCY
                </span>
                <span className="font-heading font-black text-xl text-blue-400 mt-1 block">
                  {activeReport.avgLatency} ms
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  Avg packet propagation
                </span>
              </div>

              <div className="bg-slate-900/40 border border-slate-850/80 p-3 rounded-lg flex flex-col justify-between">
                <span className="font-mono text-[8px] text-slate-450 uppercase tracking-widest block">
                  SCRUBBER WORKLOAD
                </span>
                <span className="font-heading font-black text-xl text-emerald-450 mt-1 block">
                  {activeReport.scrubberEfficiency}%
                </span>
                <span className="text-[9px] text-slate-505 font-mono">
                  Absorption compliance
                </span>
              </div>

              <div className="bg-slate-900/40 border border-slate-850/80 p-3 rounded-lg flex flex-col justify-between">
                <span className="font-mono text-[8px] text-slate-450 uppercase tracking-widest block">
                  POWER REGISTRATION
                </span>
                <span className="font-heading font-black text-xl text-teal-400 mt-1 block">
                  {activeReport.powerEfficiency}%
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  Dissipation compliance
                </span>
              </div>
            </div>

            {/* AI Executive Summary Block */}
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 space-y-2 relative z-10 shadow-inner">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-850/80">
                <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-205">
                  APTARA MAINFRAME REASONING REPORT
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                {activeReport.executiveSummary}
              </p>
            </div>

            {/* Core Charts and Logs Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10 flex-1">
              {/* Trends / Pipeline flow container */}
              <div className="lg:col-span-7 bg-[#05070d] border border-slate-850 rounded-xl p-3.5 flex flex-col justify-between min-h-[360px] relative overflow-hidden">
                {/* Header with Sub-tabs and Test Pulse Trigger */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-900 mb-2 z-10 relative">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-850/80 rounded-lg flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => setActiveSubTab("pipeline")}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-mono uppercase font-bold tracking-tight transition-all cursor-pointer ${
                        activeSubTab === "pipeline"
                          ? "bg-emerald-950/65 text-emerald-400 border border-emerald-800/50"
                          : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      ● Interlink Path
                    </button>
                    <button
                      onClick={() => setActiveSubTab("trends")}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-mono uppercase font-bold tracking-tight transition-all cursor-pointer ${
                        activeSubTab === "trends"
                          ? "bg-blue-950/65 text-blue-400 border border-blue-800/50"
                          : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      ● Trends
                    </button>
                    <button
                      onClick={() => setActiveSubTab("live-users")}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-mono uppercase font-bold tracking-tight transition-all cursor-pointer ${
                        activeSubTab === "live-users"
                          ? "bg-indigo-950/65 text-indigo-400 border border-indigo-805/50"
                          : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      ● Live Users AI
                    </button>
                    <button
                      onClick={() => setActiveSubTab("optimization")}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-mono uppercase font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1 ${
                        activeSubTab === "optimization"
                          ? "bg-amber-955/65 text-amber-400 border border-amber-850/50"
                          : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      <Zap className="w-2.5 h-2.5" /> Optimize AI Flow
                    </button>
                  </div>

                  <button
                    disabled={pulseStage !== -1}
                    onClick={() => {
                      setPulseStage(0);
                      onNotifyLog("Transmitting simulated telemetry packet across interlink path.", "info");
                    }}
                    className={`px-2.5 py-1 text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      pulseStage !== -1
                        ? "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed"
                        : "bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-700/55 hover:border-blue-600"
                    }`}
                  >
                    <Play className={`w-3 h-3 ${pulseStage !== -1 ? "animate-spin" : ""}`} />
                    <span>{pulseStage !== -1 ? "Packet in Route..." : "Transmit Pulse Test"}</span>
                  </button>
                </div>

                <div className="flex-1 w-full flex flex-col z-10 relative">
                  {activeSubTab === "trends" && (
                    /* Historic data trends chart */
                    <div className="flex-1 w-full min-h-[260px] flex flex-col justify-between pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-450 uppercase font-bold tracking-tight">
                          Macro scrubbing efficiency metrics
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          Period: {activeReport.chartData.length} checkpoints
                        </span>
                      </div>
                      <div className="flex-grow w-full h-[230px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activeReport.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRef" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#111827" vertical={false} />
                            <XAxis dataKey="time" stroke="#4b5563" fontSize={9} />
                            <YAxis stroke="#4b5563" fontSize={9} domain={[90, 100]} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#090d16", borderColor: "#1f2937", borderRadius: "8px" }}
                              labelClassName="text-white font-mono text-[9px]"
                              itemStyle={{ color: "#34d399", fontSize: "10px" }}
                            />
                            <Area type="monotone" dataKey="efficiency" stroke="#14b8a6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorRef)" name="Scrub Efficiency" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {activeSubTab === "pipeline" && (
                    /* Live Interactive Telemetry Flow diagram */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 flex-1 items-stretch min-h-[260px]">
                      {/* Left: 6 flow steps list */}
                      <div className="md:col-span-7 flex flex-col justify-between gap-1 pr-1.5 relative py-1">
                        {/* Connecting track line */}
                        <div className="absolute left-[21px] top-[14px] bottom-[14px] w-[2px] bg-slate-850 z-0">
                          {/* Pulsing traveling particle for general loop */}
                          <motion.div
                            animate={{ 
                              top: ["0%", "100%"],
                              opacity: [0, 1, 1, 0] 
                            }}
                            transition={{ 
                              duration: 5.8, 
                              repeat: Infinity, 
                              ease: "linear" 
                            }}
                            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-450 pointer-events-none shadow-[0_0_8px_#10b981]"
                          />
                          
                          {/* Active test trigger particle */}
                          {pulseStage !== -1 && pulseStage < 6 && (
                            <motion.div
                              style={{ 
                                top: `${(pulseStage / 5) * 100}%` 
                              }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-400 pointer-events-none shadow-[0_0_12px_#3b82f6]"
                            />
                          )}
                        </div>

                        {[
                          { 
                            id: 0, 
                            title: "Satellite Swarm / CubeSats", 
                            status: "BROADCASTING", 
                            icon: <Layers className="w-3.5 h-3.5" />, 
                            pulseColor: "border-indigo-500 shadow-indigo-950/40 text-indigo-300"
                          },
                          { 
                            id: 1, 
                            title: "Ground Station or Cloud APIs", 
                            status: "RECEIVING", 
                            icon: <Wifi className="w-3.5 h-3.5" />, 
                            pulseColor: "border-blue-500 shadow-blue-950/40 text-blue-300"
                          },
                          { 
                            id: 2, 
                            title: "Communication Server", 
                            subtitle: "MQTT / WS / CSP",
                            status: "ROUTING", 
                            icon: <RefreshCw className="w-3.5 h-3.5" />, 
                            pulseColor: "border-amber-500 shadow-amber-950/40 text-amber-350"
                          },
                          { 
                            id: 3, 
                            title: "Aptara AI Core Engine", 
                            status: "MODEL INFERENCE", 
                            icon: <Bot className="w-3.5 h-3.5" />, 
                            pulseColor: "border-emerald-500 shadow-emerald-950/40 text-emerald-300"
                          },
                          { 
                            id: 4, 
                            title: "Prediction & Mapping", 
                            status: "MAPPED LAYERS", 
                            icon: <Eye className="w-3.5 h-3.5" />, 
                            pulseColor: "border-teal-500 shadow-teal-950/40 text-teal-300"
                          },
                          { 
                            id: 5, 
                            title: "Smart Devices & HUDs", 
                            status: "DISPATCHED HUD", 
                            icon: <ClipboardCheck className="w-3.5 h-3.5" />, 
                            pulseColor: "border-yellow-500 shadow-yellow-950/40 text-yellow-350"
                          }
                        ].map((stage) => {
                          const isCurrentlyPulsing = pulseStage === stage.id;
                          const isHovered = hoveredStage === stage.id;
                          const highlight = isCurrentlyPulsing || isHovered;

                          return (
                            <div
                              key={stage.id}
                              onMouseEnter={() => setHoveredStage(stage.id)}
                              onMouseLeave={() => setHoveredStage(null)}
                              className={`z-10 flex items-center gap-2.5 pl-2.5 py-1 px-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                                highlight
                                  ? `${stage.pulseColor} bg-slate-900 border-slate-705 font-bold scale-[1.01]`
                                  : "bg-[#04060b] border-slate-900 text-slate-400"
                              }`}
                            >
                              {/* Left icon wrapper */}
                              <div className={`w-[22px] h-[22px] rounded-md border flex items-center justify-center transition-all ${
                                highlight ? "bg-slate-950 scale-105" : "bg-slate-900"
                              }`}>
                                <span className={highlight ? "text-emerald-450" : "text-slate-500"}>
                                  {stage.icon}
                                </span>
                              </div>

                              {/* Title / Info row */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h6 className={`text-[9px] uppercase font-mono tracking-tight truncate ${
                                    highlight ? "text-slate-100 font-extrabold" : "text-slate-400 font-semibold"
                                  }`}>
                                    {stage.title}
                                  </h6>
                                  {isCurrentlyPulsing && (
                                    <span className="text-[7px] font-mono font-bold animate-ping text-blue-405 uppercase">
                                      ● PULSE
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[8px] font-mono opacity-80 mt-0.5">
                                  <span className="text-[6.5px] bg-slate-950 px-1 py-0.2 rounded font-extrabold text-emerald-500 uppercase">
                                    {stage.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right: Technical Inspector HUD card */}
                      <div className="md:col-span-5 bg-[#030408] border border-slate-900 rounded-xl p-3 flex flex-col justify-between h-auto">
                        {(() => {
                          const inspectIndex = hoveredStage !== null ? hoveredStage : (pulseStage !== -1 && pulseStage < 6 ? pulseStage : 0);
                          const inspectStage = [
                            {
                              title: "Orbital Swarm",
                              sub: "Satellite Swarm / CubeSats",
                              desc: "Global network of CubeSats orbiting in synchronized patterns. Re-transmits atmospheric CO2 drift metrics, solar albedo deflection rates, and tectonic soundwaves down to planetary monitoring bases.",
                              flowInfo: "Space telemetry → Earth direct downlink",
                              speed: "S-Band UHF Radio",
                              engine: "Low Earth Orbit (LEO) Swarm"
                            },
                            {
                              title: "Ground Stations",
                              sub: "Ground Station or Cloud APIs",
                              desc: "Geographically dispersed dishes in Greenland, Iceland, and maritime ports aggregate broadcasts. Synchronous handshake protocols decrypt radio packets and route telemetry payloads into cloud infrastructure.",
                              flowInfo: "Direct UHF Influx → Deep Integration Hubs",
                              speed: "REST API HTTPS, 980 Mbps / channel",
                              engine: "Global Ground Dishes"
                            },
                            {
                              title: "Message broker",
                              sub: "Communication Server / Brokers",
                              desc: "Standardized lightweight communication tier. Adapts MQTT brokers, low-latency WebSocket interfaces, and CSP protocols to enable seamless bi-directional packet stream routing cleanly.",
                              flowInfo: "Broker handshake → Processing queue",
                              speed: "MQTT & WebSockets Protocols",
                              engine: "Dual Redundant Broker Cluster"
                            },
                            {
                              title: "Aptara AI Brain",
                              sub: "Aptara AI Core Engine",
                              desc: "The neural system built under CIEM guidelines. Uses state-of-the-art server-side models to predict scrubber grid decay curves and trigger real-time hazard alerts.",
                              flowInfo: "AI Core → Operational Prognostics",
                              speed: "NVIDIA Tensor Cores",
                              engine: "Gemini 3.5 Server Core Pipeline"
                            },
                            {
                              title: "Prognostic Engine",
                              sub: "Prediction + Analysis + Mapping",
                              desc: "D3/Recharts-compliant geographic cartography layer. Interlocks carbon saturation grids with satellite tracking vectors, rendering direct action targets down to HUD displays.",
                              flowInfo: "Vector GIS Layer Handshakes",
                              speed: "D3 Geo Spatial Sync",
                              engine: "Spatial GIS Vector Engine"
                            },
                            {
                              title: "Operational HUD",
                              sub: "Smart Device / HUD Dispatch",
                              desc: "Terminal consoles, active maps, and field mechatronic handheld devices monitor the stream, enabling on-site personnel to coordinate with localized installations easily.",
                              flowInfo: "Client endpoints → Secure dispatch actions",
                              speed: "Web UI & Voice Narration Engines",
                              engine: "Aptara React Client HUD Matrix"
                            }
                          ][inspectIndex];

                          return (
                            <div className="flex flex-col justify-between h-full space-y-2.5">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-900">
                                  <span className="font-mono text-[8.5px] tracking-widest text-[#34d399] uppercase font-bold">
                                    [Interlink Node Inspector]
                                  </span>
                                  <span className="font-mono text-[8px] text-slate-500">
                                    NODE 0{inspectIndex + 1}
                                  </span>
                                </div>
                                <h5 className="font-heading text-xs font-black uppercase text-slate-200">
                                  {inspectStage.title}
                                </h5>
                                <span className="block font-mono text-[8px] text-slate-450 leading-none">
                                  Module: {inspectStage.sub}
                                </span>
                                <p className="text-[10px] text-slate-400 leading-normal font-sans font-medium">
                                  {inspectStage.desc}
                                </p>
                              </div>

                              <div className="space-y-1.5 pt-2 border-t border-slate-900">
                                <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                                  <span>Data Flow:</span>
                                  <span className="text-slate-350">{inspectStage.flowInfo}</span>
                                </div>
                                <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                                  <span>Protocol:</span>
                                  <span className="text-emerald-400 font-bold">{inspectStage.speed}</span>
                                </div>
                                <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                                  <span>Hardware core:</span>
                                  <span className="text-slate-300">{inspectStage.engine}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {activeSubTab === "live-users" && (
                    <div className="flex flex-col gap-4 flex-1 justify-between min-h-[260px] animate-fadeIn text-slate-200">
                      {/* Top Metric Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        <div className="bg-[#030408] border border-slate-900 p-2.5 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                              ACTIVE COGNATES
                            </span>
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <h4 className="text-sm font-black text-slate-100 mt-1">
                            147 online <span className="text-[9px] font-mono text-emerald-400 font-extrabold ml-1 animate-pulse">●</span>
                          </h4>
                          <p className="text-[7.5px] text-slate-500 font-mono mt-0.5">Assigned researchers & crew</p>
                        </div>

                        <div className="bg-[#030408] border border-slate-900 p-2.5 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                              WORKLOAD FLUX
                            </span>
                            <Activity className="w-3.5 h-3.5 text-emerald-450 animate-pulse" />
                          </div>
                          <h4 className="text-sm font-black text-slate-100 mt-1">
                            {activeQueries} <span className="text-[8px] font-sans font-medium text-slate-450">queries/sec</span>
                          </h4>
                          <p className="text-[7.5px] text-slate-500 font-mono mt-0.5">Direct mechatronic handshakes</p>
                        </div>

                        <div className="bg-[#030408] border border-slate-900 p-2.5 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                              APTARA SIGNALS PER MIN
                            </span>
                            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          </div>
                          <h4 className="text-sm font-black text-slate-150 mt-1 font-mono tracking-tight">
                            {apiTokens.toLocaleString()}
                          </h4>
                          <p className="text-[7.5px] text-slate-505 font-mono mt-0.5">Accumulated AI responses</p>
                        </div>

                        <div className="bg-[#030408] border border-slate-900 p-2.5 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                              COHERENCE SCORE
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                          </div>
                          <h4 className="text-sm font-black text-slate-100 mt-1">
                            99.82% <span className="text-[7.5px] font-mono text-emerald-550 font-bold">CERTIFIED</span>
                          </h4>
                          <p className="text-[7.5px] text-slate-500 font-mono mt-0.5">Security baseline rating</p>
                        </div>
                      </div>

                      {/* Real-time live usage feed & system locations */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        {/* Feed Column */}
                        <div className="md:col-span-7 bg-[#030408]/90 border border-slate-900 rounded-lg p-2.5 flex flex-col justify-between h-[150px] md:h-auto min-h-[140px]">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-950 mb-1.5">
                            <span className="font-mono text-[8.5px] tracking-widest text-[#6366f1] uppercase font-bold flex items-center gap-1">
                              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-ping" />
                              Simulated Live Interaction Feed
                            </span>
                            <span className="font-mono text-[7px] text-slate-500">
                              AUTO-REFRESHING
                            </span>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[120px] scrollbar-thin">
                            <AnimatePresence initial={false}>
                              {userLogs.map((log, idx) => (
                                <motion.div 
                                  key={idx + "-" + log.time}
                                  initial={{ opacity: 0, y: -2 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="bg-[#05070d] p-1.5 border border-slate-900/60 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 hover:border-slate-800 transition-all"
                                >
                                  <div className="flex items-center gap-1">
                                    <span className="font-mono text-[7.5px] text-indigo-400 font-extrabold bg-[#090b11] px-1 py-0.2 rounded border border-indigo-950/40">
                                      {log.time}
                                    </span>
                                    <span className="text-[8.5px] font-bold text-slate-350">
                                      {log.user}
                                    </span>
                                  </div>
                                  <p className="text-[8.5px] text-slate-400 font-medium italic flex-grow text-left sm:text-right">
                                    {log.action}
                                  </p>
                                  <span className="hidden sm:inline font-mono text-[7px] text-slate-500 min-w-[70px] text-right">
                                    {log.location}
                                  </span>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Stations details card */}
                        <div className="md:col-span-5 bg-[#030408]/90 border border-slate-900 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <span className="font-mono text-[8.5px] tracking-widest text-[#14b8a6] uppercase font-bold block">
                              Authorized Terminals
                            </span>
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[8px] border-b border-slate-950 pb-1">
                                <span className="font-sans text-slate-350 font-semibold truncate max-w-[120px]">Aptara HQ Root</span>
                                <span className="font-mono text-[7.5px] text-emerald-450 font-extrabold">ROOT MASTER</span>
                              </div>
                              <div className="flex items-center justify-between text-[8px] border-b border-slate-950 pb-1">
                                <span className="font-sans text-slate-350 truncate max-w-[120px]">Geneva Climate Lab</span>
                                <span className="font-mono text-[7.5px] text-blue-400 font-bold">SCHOLAR SYNC</span>
                              </div>
                              <div className="flex items-center justify-between text-[8px] border-b border-slate-950 pb-1">
                                <span className="font-sans text-slate-350 truncate max-w-[120px]">Greenland Fleet</span>
                                <span className="font-mono text-[7.5px] text-indigo-400 font-bold">DRONE PILOT</span>
                              </div>
                              <div className="flex items-center justify-between text-[8px] border-b border-slate-950 pb-1">
                                <span className="font-sans text-slate-350 truncate max-w-[120px]">Iceland Geothermal Site</span>
                                <span className="font-mono text-[7.5px] text-amber-500 font-bold">SEISMIC STREAM</span>
                              </div>
                              <div className="flex items-center justify-between text-[8px]">
                                <span className="font-sans text-slate-350 truncate max-w-[120px]">Amazon Canopy Group</span>
                                <span className="font-mono text-[7.5px] text-teal-400 font-bold">SCRUBBER CTRL</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-950 mt-1.5">
                            <p className="text-[7.5px] font-mono text-slate-500 leading-tight">
                              Security key hashes are routed via decentralized mechatronic protocols, verifying legitimate manual directives from Mano Mathen John.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSubTab === "optimization" && (() => {
                    const curUplinkLat = Math.max(2, Math.round((48 * Math.sqrt(128 / simulatedBufferSize) * (optSpaceComp ? 0.25 : 1.0)) + (simulatedBufferSize > 4096 ? (simulatedBufferSize - 4096) / 512 : 0)));
                    const curDecoupleLat = 8;
                    const curBrokerLat = Math.max(5, Math.round((195 / Math.sqrt(simulatedThreads)) * (optBrokerThreads ? 0.21 : 1.0)));
                    const curAILat = Math.max(3, Math.round((32 * (1 / Math.sqrt(simulatedBatchSize)) * (optAIBatchSize ? 0.31 : 1.0)) + (simulatedBatchSize > 16 ? (simulatedBatchSize - 16) * 0.5 : 0)));
                    const totalLat = curUplinkLat + curDecoupleLat + curBrokerLat + curAILat;
                    
                    const totalThroughput = Math.round(
                      (180 + (simulatedThreads - 1) * 320 + (Math.log2(simulatedBufferSize / 64) * 80) + (simulatedBatchSize - 1) * 95) * 
                      (optSpaceComp ? 1.5 : 1.0) * 
                      (optBrokerThreads ? 1.6 : 1.0) * 
                      (optAIBatchSize ? 1.4 : 1.0)
                    );

                    let mainBottleneckNode = "None";
                    let bottleneckSeverity = "Minimal"; 

                    if (!optBrokerThreads || simulatedThreads === 1) {
                      mainBottleneckNode = "Node 03: Queue / Message Broker (Single-Thread Lock)";
                      bottleneckSeverity = "Critical";
                    } else if (!optSpaceComp || simulatedBufferSize < 512) {
                      mainBottleneckNode = "Node 01: S-Band Space Uplink spectrum congestion";
                      bottleneckSeverity = "Medium";
                    } else if (!optAIBatchSize || simulatedBatchSize < 8) {
                      mainBottleneckNode = "Node 04: Aptara AI Core processor wait times";
                      bottleneckSeverity = "Low";
                    } else {
                      mainBottleneckNode = "0 Active Bottlenecks Detected. Ideal Flow Constraint.";
                      bottleneckSeverity = "None";
                    }

                    const handleAutoOptimize = () => {
                      if (isOptimizing) return;
                      setIsOptimizing(true);
                      onNotifyLog("Initiating pipeline auto-optimization algorithm series...", "info");
                      
                      // Phase 1: Uplink Buffer
                      setTimeout(() => {
                        onNotifyLog("Evaluating Node 01. Adjusting Uplink Buffer Size constraint to 1024KB...", "info");
                        setSimulatedBufferSize(1024);
                      }, 400);

                      setTimeout(() => {
                        onNotifyLog("Expanding Node 01 constraint to 4096KB. Enabling Run-Length Compression.", "info");
                        setSimulatedBufferSize(4096);
                        setOptSpaceComp(true);
                      }, 900);

                      // Phase 2: Broker Threads
                      setTimeout(() => {
                        onNotifyLog("Evaluating Node 03. Adjusting Message Broker concurrency factor...", "info");
                        setSimulatedThreads(4);
                      }, 1400);

                      setTimeout(() => {
                        onNotifyLog("Thread parallelism expanded. Pinning 12 parallel execution lines. Lock uninhibited.", "info");
                        setSimulatedThreads(12);
                        setOptBrokerThreads(true);
                      }, 1900);

                      // Phase 3: AI Inference batch size
                      setTimeout(() => {
                        onNotifyLog("Evaluating Node 04. Testing micro-batching sizing bounds...", "info");
                        setSimulatedBatchSize(8);
                      }, 2400);

                      setTimeout(() => {
                        onNotifyLog("Recalculating tensor inference queue. Calibrated batch size to optimal 16 count.", "info");
                        setSimulatedBatchSize(16);
                        setOptAIBatchSize(true);
                      }, 2900);

                      setTimeout(() => {
                        setIsOptimizing(false);
                        onNotifyLog("Calibration success. S-Band and AI Inference flows balanced perfectly.", "success");
                      }, 3400);
                    };

                    return (
                      <div className="flex flex-col gap-4 flex-1 justify-between min-h-[300px] animate-fadeIn text-slate-200">
                        {/* KPI Display Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          {/* Latency card */}
                          <div className="bg-[#030408] border border-slate-900 p-2.5 rounded-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                                End-to-End Pipeline Latency
                              </span>
                              <Gauge className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="text-lg font-black text-slate-100 tracking-tight font-mono">
                                {totalLat} ms
                              </span>
                              <span className="text-[8px] font-mono text-slate-500 line-through">
                                283 ms baseline
                              </span>
                            </div>
                            {/* Latency progress bar */}
                            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-900">
                              <motion.div 
                                initial={{ width: "100%" }}
                                animate={{ 
                                  width: `${Math.min(100, (totalLat / 283) * 100)}%`,
                                  backgroundColor: totalLat <= 35 ? "#10b981" : totalLat <= 120 ? "#f59e0b" : "#ef4444"
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                              />
                            </div>
                            <div className="text-[7.5px] font-mono text-slate-500 mt-1 flex justify-between">
                              <span>Target: &lt; 35ms</span>
                              <span className="text-slate-400">Status: {totalLat <= 35 ? "Ideal" : totalLat <= 120 ? "Warning" : "Critical"}</span>
                            </div>
                          </div>

                          {/* Throughput multiplier card */}
                          <div className="bg-[#030408] border border-slate-900 p-2.5 rounded-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                                Effective Throughput
                              </span>
                              <Zap className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2 text-left">
                              <span className="text-lg font-black text-emerald-450 tracking-tight font-mono">
                                {totalThroughput.toLocaleString()} ops/s
                              </span>
                              <span className="text-[8px] font-mono text-slate-500 text-left">
                                +{ Math.floor(((totalThroughput / 180) - 1) * 100) }% flow multiplier
                              </span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-900">
                              <motion.div 
                                initial={{ width: "5%" }}
                                animate={{ 
                                  width: `${Math.min(100, (totalThroughput / 15000) * 100)}%`
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-full bg-blue-500"
                              />
                            </div>
                            <div className="text-[7.5px] font-mono text-slate-500 mt-1 flex justify-between">
                              <span>Max Potential: 15K ops/s</span>
                              <span className="text-indigo-400 font-extrabold">State: {totalThroughput > 5000 ? "High Capacity" : "Throttled"}</span>
                            </div>
                          </div>

                          {/* Dynamic Active Bottleneck card */}
                          <div className="bg-[#030408] border border-slate-900 p-2.5 rounded-lg flex flex-col justify-between text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                                Critical Pipeline Bottleneck
                              </span>
                              <AlertTriangle className={`w-3.5 h-3.5 ${bottleneckSeverity === "Critical" ? "text-red-500 animate-bounce" : bottleneckSeverity === "Medium" ? "text-amber-500 animate-pulse" : bottleneckSeverity === "Low" ? "text-yellow-400" : "text-emerald-400"}`} />
                            </div>
                            <div className="mt-1.5 text-left flex flex-col gap-0.5">
                              <span className={`text-[8px] font-mono uppercase font-black tracking-tight ${bottleneckSeverity === "Critical" ? "text-red-400" : bottleneckSeverity === "Medium" ? "text-amber-400" : bottleneckSeverity === "Low" ? "text-yellow-350" : "text-emerald-450"}`}>
                                {bottleneckSeverity} OVERHEAD
                              </span>
                              <h4 className="text-[10px] font-bold text-slate-100 font-sans leading-tight line-clamp-1">
                                {mainBottleneckNode}
                              </h4>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-950">
                              <button
                                disabled={isOptimizing}
                                onClick={handleAutoOptimize}
                                className={`w-full py-1 text-[8px] font-mono uppercase font-black tracking-widest rounded flex items-center justify-center gap-1 transition-all ${
                                  isOptimizing 
                                    ? "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-850" 
                                    : "bg-amber-955/65 hover:bg-amber-900/50 text-amber-400 border border-amber-800/60 hover:border-amber-600 font-extrabold cursor-pointer"
                                }`}
                              >
                                <Sliders className={`w-2.5 h-2.5 text-amber-455 ${isOptimizing ? "animate-spin" : ""}`} />
                                {isOptimizing ? "Calibrating..." : "Launch Auto-Optimize Core"}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Middle split section */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-grow m-0 p-0">
                          {/* Nodes column */}
                          <div className="lg:col-span-7 bg-[#030408]/90 border border-slate-900 p-2.5 rounded-lg flex flex-col justify-between min-h-[180px]">
                            <div className="flex items-center justify-between pb-1 border-b border-slate-950 mb-1.5">
                              <span className="font-mono text-[8.5px] tracking-widest text-[#f59e0b] uppercase font-bold flex items-center gap-1">
                                Interactive Pipeline Node Monitor
                              </span>
                              <span className="font-mono text-[7px] text-slate-500">
                                REAL-TIME LATENCY SPECTRUM
                              </span>
                            </div>

                            <div className="flex-grow space-y-1.5 overflow-y-auto max-h-[175px] scrollbar-thin pr-1 text-left">
                              {/* Node 1 */}
                              <div className={`p-1.5 rounded border transition-all ${optSpaceComp && simulatedBufferSize >= 1024 ? "bg-slate-950/60 border-slate-900" : "bg-[#05070d] border-red-950/40"}`}>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-start gap-1.5">
                                    <div className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 text-[8px] font-bold ${optSpaceComp && simulatedBufferSize >= 1024 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                                      {optSpaceComp && simulatedBufferSize >= 1024 ? "✓" : "!"}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h5 className="text-[9px] font-bold text-slate-150 uppercase tracking-tight font-mono">Node 01: Uplink Transmission</h5>
                                        <span className={`text-[6.5px] font-semibold font-mono px-1 py-0.2 rounded ${optSpaceComp && simulatedBufferSize >= 1024 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                                          {curUplinkLat} ms
                                        </span>
                                      </div>
                                      <p className="text-[8.5px] text-slate-400 mt-0.5">S-Band spectrum constraint packing factor.</p>
                                      <p className="text-[7.5px] font-mono text-slate-500 mt-0.5">
                                        Buffer: {simulatedBufferSize} KB | Run-Length delta comp: {optSpaceComp ? "ENABLED" : "DISABLED"}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setOptSpaceComp(!optSpaceComp);
                                      onNotifyLog(`Uplink spectral compression toggled to ${!optSpaceComp ? 'ON' : 'OFF'}.`, "info");
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase border cursor-pointer ${optSpaceComp ? "bg-emerald-955/40 border-emerald-800 text-emerald-400" : "bg-red-955/40 border-red-900 text-red-400"}`}
                                  >
                                    {optSpaceComp ? "Comp: ON" : "Comp: OFF"}
                                  </button>
                                </div>
                              </div>

                              {/* Node 2 */}
                              <div className="p-1.5 rounded border border-slate-950 bg-slate-950/60">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-start gap-1.5">
                                    <div className="w-4 h-4 rounded flex items-center justify-center mt-0.5 bg-emerald-950 text-emerald-400 text-[8px] font-bold">
                                      ✓
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="text-[9px] font-bold text-slate-150 uppercase tracking-tight font-mono">Node 02: Ground Decoupler</h5>
                                        <span className="text-[6.5px] font-semibold font-mono px-1 py-0.2 rounded bg-emerald-950 text-emerald-400">
                                          8 ms
                                        </span>
                                      </div>
                                      <p className="text-[8.5px] text-slate-400 mt-0.5">Asynchronous packet separation buffering thread.</p>
                                      <p className="text-[7.5px] font-mono text-slate-500 mt-0.5">Auto-scaled with load metrics.</p>
                                    </div>
                                  </div>
                                  <span className="text-[7px] font-mono text-slate-550 italic uppercase">Auto-Scaled</span>
                                </div>
                              </div>

                              {/* Node 3 */}
                              <div className={`p-1.5 rounded border transition-all ${optBrokerThreads && simulatedThreads >= 8 ? "bg-slate-950/60 border-slate-900" : "bg-[#05070d] border-red-950/40"}`}>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-start gap-1.5">
                                    <div className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 text-[8px] font-bold ${optBrokerThreads && simulatedThreads >= 8 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400 animate-pulse"}`}>
                                      {optBrokerThreads && simulatedThreads >= 8 ? "✓" : "!"}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h5 className="text-[9px] font-bold text-slate-150 uppercase tracking-tight font-mono">Node 03: Queue / Message Broker</h5>
                                        <span className={`text-[6.5px] font-semibold font-mono px-1 py-0.2 rounded ${optBrokerThreads && simulatedThreads >= 8 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-500"}`}>
                                          {curBrokerLat} ms
                                        </span>
                                      </div>
                                      <p className="text-[8.5px] text-slate-400 mt-0.5">Mechatronic handshake queuing sequence latency.</p>
                                      <p className="text-[7.5px] font-mono text-slate-500 mt-0.5">
                                        Thread Allocation: {simulatedThreads} parallel lines | Locks: {optBrokerThreads ? "UNBOUND" : "BOUND"}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setOptBrokerThreads(!optBrokerThreads);
                                      onNotifyLog(`Broker lock concurrency changed to ${!optBrokerThreads ? 'Parallel' : 'Single-thread'}.`, "info");
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase border cursor-pointer ${optBrokerThreads ? "bg-emerald-955/40 border-emerald-800 text-emerald-400" : "bg-red-955/40 border-red-900 text-red-400"}`}
                                  >
                                    {optBrokerThreads ? "Parallel" : "Single-Lock"}
                                  </button>
                                </div>
                              </div>

                              {/* Node 4 */}
                              <div className={`p-1.5 rounded border transition-all ${optAIBatchSize && simulatedBatchSize >= 8 ? "bg-slate-950/60 border-slate-900" : "bg-[#05070d] border-red-950/40"}`}>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-start gap-1.5">
                                    <div className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 text-[8px] font-bold ${optAIBatchSize && simulatedBatchSize >= 8 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400 animate-pulse"}`}>
                                      {optAIBatchSize && simulatedBatchSize >= 8 ? "✓" : "!"}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h5 className="text-[9px] font-bold text-slate-150 uppercase tracking-tight font-mono">Node 04: Aptara AI Core Inference Pool</h5>
                                        <span className={`text-[6.5px] font-semibold font-mono px-1 py-0.2 rounded ${optAIBatchSize && simulatedBatchSize >= 8 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-500"}`}>
                                          {curAILat} ms
                                        </span>
                                      </div>
                                      <p className="text-[8.5px] text-slate-400 mt-0.5">Dynamic batching attention queue weight loading latency.</p>
                                      <p className="text-[7.5px] font-mono text-slate-500 mt-0.5">
                                        Batch size: {simulatedBatchSize} payload(s) | Tensor-pooling: {optAIBatchSize ? "ACTIVE" : "OFFLINE"}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setOptAIBatchSize(!optAIBatchSize);
                                      onNotifyLog(`Dynamic tensor pooling batching toggled to ${!optAIBatchSize ? 'Active' : 'Offline'}.`, "info");
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase border cursor-pointer ${optAIBatchSize ? "bg-emerald-955/40 border-emerald-800 text-emerald-400" : "bg-red-955/40 border-red-900 text-red-400"}`}
                                  >
                                    {optAIBatchSize ? "Dynamic" : "Sequential"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Simulation / Infrastructure tuning sliders column */}
                          <div className="lg:col-span-5 bg-[#030408]/90 border border-slate-900 p-2.5 rounded-lg flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="pb-1 border-b border-slate-950 mb-1 flex items-center justify-between">
                                <span className="font-mono text-[8.5px] tracking-widest text-[#6366f1] uppercase font-bold">
                                  Simulation Parameters
                                </span>
                                <span className="font-mono text-[7px] text-[#10b981] font-black uppercase">
                                  REAL-TIME FEEDBACK
                                </span>
                              </div>

                              {/* Buffer slider */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-left">
                                  <label className="text-[8.5px] font-mono font-semibold text-slate-350">
                                    [Node 01] Uplink Buffer constraints
                                  </label>
                                  <span className="text-[9px] font-mono font-black text-amber-400">
                                    {simulatedBufferSize >= 1024 ? `${(simulatedBufferSize/1024).toFixed(0)} MB` : `${simulatedBufferSize} KB`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="range"
                                    min="64"
                                    max="8192"
                                    step="64"
                                    value={simulatedBufferSize}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setSimulatedBufferSize(val);
                                      if (val >= 1024) {
                                        setOptSpaceComp(true);
                                      }
                                    }}
                                    className="w-full accent-amber-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                                  />
                                </div>
                                <div className="flex justify-between text-[6.5px] text-slate-500 font-mono">
                                  <span>64KB (Unbuffered)</span>
                                  <span>4MB (Sweetspot)</span>
                                  <span>8MB (Blob limit)</span>
                                </div>
                              </div>

                              {/* Thread pool slider */}
                              <div className="space-y-1 pt-1">
                                <div className="flex justify-between items-center text-left">
                                  <label className="text-[8.5px] font-mono font-semibold text-slate-350">
                                    [Node 03] Queue Concurrent Threads
                                  </label>
                                  <span className="text-[9px] font-mono font-black text-indigo-400">
                                    {simulatedThreads} Thread{simulatedThreads > 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="range"
                                    min="1"
                                    max="16"
                                    step="1"
                                    value={simulatedThreads}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setSimulatedThreads(val);
                                      if (val >= 8) {
                                        setOptBrokerThreads(true);
                                      }
                                    }}
                                    className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                                  />
                                </div>
                                <div className="flex justify-between text-[6.5px] text-slate-500 font-mono">
                                  <span>1 (Single)</span>
                                  <span>8 (Parallel)</span>
                                  <span>16 (Max core)</span>
                                </div>
                              </div>

                              {/* Batch Size slider */}
                              <div className="space-y-1 pt-1">
                                <div className="flex justify-between items-center text-left">
                                  <label className="text-[8.5px] font-mono font-semibold text-slate-350">
                                    [Node 04] Inference Batching size
                                  </label>
                                  <span className="text-[9px] font-mono font-black text-[#14b8a6]">
                                    Batch of {simulatedBatchSize} Payload{simulatedBatchSize > 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="range"
                                    min="1"
                                    max="32"
                                    step="1"
                                    value={simulatedBatchSize}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setSimulatedBatchSize(val);
                                      if (val >= 8) {
                                        setOptAIBatchSize(true);
                                      }
                                    }}
                                    className="w-full accent-teal-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                                  />
                                </div>
                                <div className="flex justify-between text-[6.5px] text-slate-500 font-mono">
                                  <span>1 (Sequential)</span>
                                  <span>16 (Optimal)</span>
                                  <span>32 (Overfill)</span>
                                </div>
                              </div>
                            </div>

                            {/* Calibration wizard diagnostic stream */}
                            <div className="mt-2 text-left pt-2 border-t border-slate-950">
                              <span className="text-[7.5px] tracking-widest text-slate-500 font-mono uppercase block mb-1">
                                Optimization diagnostic stream
                              </span>
                              <div className="bg-[#05070d] p-1.5 border border-slate-900 rounded h-[38px] overflow-y-auto font-mono text-[7.5px] text-slate-400 select-all scrollbar-thin">
                                {isOptimizing ? (
                                  <div className="space-y-0.5 text-left">
                                    <div className="text-amber-400 animate-pulse">&gt; RUNNING DYNAMIC BOTTLENECK DIAGNOSTICS...</div>
                                    <div className="text-slate-400">&gt; CURRENT CAPACITY: {totalThroughput} ops/s @ {totalLat}ms</div>
                                  </div>
                                ) : (
                                  <div className="space-y-0.5 text-left">
                                    <span className="text-[#10b981]">&gt; PIPELINE COORDINATOR INITIALIZED</span>
                                    {totalLat <= 35 ? (
                                      <div className="text-[#10b981]">&gt; COMPLETED. SPECTRUM CALIBRATED FOR MANO MATHEN JOHN.</div>
                                    ) : (
                                      <div className="text-red-400">&gt; ALERT: Lacking optimal parameters. Launch optimizer or adjust sliders.</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Logs columns split into sensor fusion + infra health logs */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex flex-col gap-2 flex-grow overflow-y-auto max-h-[120px] lg:max-h-[150px]">
                  <h5 className="font-heading text-[9px] font-semibold uppercase tracking-wider text-slate-350 flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-blue-400" />
                    Sensor Fusion Logs
                  </h5>
                  <div className="font-mono text-[9px] text-slate-400 space-y-1">
                    {activeReport.fusionLogs.map((log, idx) => (
                      <div key={idx} className="leading-snug">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex flex-col gap-2 flex-grow overflow-y-auto max-h-[120px] lg:max-h-[150px]">
                  <h5 className="font-heading text-[9px] font-semibold uppercase tracking-wider text-slate-350 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-teal-400" />
                    Infrastructure Health Logs
                  </h5>
                  <div className="font-mono text-[9px] text-slate-400 space-y-1">
                    {activeReport.infraLogs.map((log, idx) => (
                      <div key={idx} className="leading-snug">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer stamp */}
            <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-3 border-t border-slate-850">
              <span>REPORT AUTH: APTARA CENTRAL INTEL</span>
              <span>INVENTOR DIRECTIVE: MANO MATHEN JOHN</span>
              <span>CIEM SECURITY MATRIX: v3.0.0</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
