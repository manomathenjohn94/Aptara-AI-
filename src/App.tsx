import React, { useState, useEffect } from "react";
import { 
  Globe, Activity, ShieldAlert, Cpu, Bot, Terminal, 
  Wifi, HelpCircle, HardHat, RefreshCw, AlertCircle, Maximize2,
  ArrowRight, Brain, Eye, Compass, GitMerge, Layers, Shield,
  Network, CheckCircle, Flame, Droplets, MapPin, Sparkles, 
  Mail, Users, TrendingUp, Info, Send, MessageSquare, PhoneCall, Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import SectionSensorFusion from "./components/SectionSensorFusion";
import SectionEnvironmental from "./components/SectionEnvironmental";
import SectionInfrastructure from "./components/SectionInfrastructure";
import SectionDisasterManagement from "./components/SectionDisasterManagement";
import AptaraChat from "./components/AptaraChat";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";


// 1. Aptara AI High-Fidelity SVG Logo
export function AptaraLogoSvg({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      
      {/* Background glow and circular layers */}
      <circle cx="50" cy="50" r="45" fill="url(#glowGrad)" />

      {/* Orbit arcs matching the provided layout */}
      <path d="M 22 50 A 28 28 0 1 1 78 50" stroke="url(#ringGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M 15 50 A 35 35 0 1 1 85 50" stroke="url(#ringGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      <path d="M 29 50 A 21 21 0 1 1 71 50" stroke="url(#ringGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

      {/* Pentagon Node lines forming star network connection */}
      <polygon points="50,22 84,46 71,83 29,83 16,46" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" opacity="0.75" />
      
      {/* Cross-link connections for neural topology */}
      <line x1="50" y1="22" x2="71" y2="83" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <line x1="50" y1="22" x2="29" y2="83" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <line x1="16" y1="46" x2="84" y2="46" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <line x1="16" y1="46" x2="71" y2="83" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <line x1="84" y1="46" x2="29" y2="83" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

      {/* White star glowing nodes representing active sensors */}
      <circle cx="50" cy="22" r="3.5" fill="#ffffff" className="animate-pulse" style={{ animationDuration: '2s' }} />
      <circle cx="84" cy="46" r="3.5" fill="#ffffff" />
      <circle cx="71" cy="83" r="3.5" fill="#ffffff" />
      <circle cx="29" cy="83" r="3.5" fill="#ffffff" />
      <circle cx="16" cy="46" r="3.5" fill="#ffffff" />
    </svg>
  );
}

// 2. CIEM Industries Corporate SVG Logo representing the physical letter mark
export function CiemLogoSvg({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <span className="font-heading font-black text-3xl tracking-wide text-slate-900 leading-none" style={{ color: '#005b94' }}>
        CIEM
      </span>
      <span className="font-sans font-extrabold text-[10px] text-slate-400 uppercase tracking-[0.24em] leading-none mt-1">
        INDUSTRIES
      </span>
    </div>
  );
}

// 3. Indian Flag component with high-fidelity authentic representation and 24-spoke Ashoka Chakra
export function IndianFlagSvg({ className = "w-6 h-4" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 90 60" 
      className={`rounded-sm border border-white/10 shadow-xs inline-block aspect-3/2 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Saffron band */}
      <rect width="90" height="20" fill="#FF9933" />
      {/* White band */}
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      {/* Green band */}
      <rect y="40" width="90" height="20" fill="#138808" />
      {/* Ashoka Chakra */}
      <g transform="translate(45, 30)">
        {/* Outer Wheel Ring */}
        <circle r="8" fill="none" stroke="#000080" strokeWidth="0.8" />
        {/* Inner Hub */}
        <circle r="1" fill="#000080" />
        <circle r="0.4" fill="#FFFFFF" />
        {/* 24 precisely calculated spokes */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={8 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={8 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke="#000080"
            strokeWidth="0.25"
          />
        ))}
        {/* Tiny circle accents between spokes to give it realistic detail */}
        {Array.from({ length: 24 }).map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={7.2 * Math.cos(((i * 15 + 7.5) * Math.PI) / 180)}
            cy={7.2 * Math.sin(((i * 15 + 7.5) * Math.PI) / 180)}
            r="0.25"
            fill="#000080"
          />
        ))}
      </g>
    </svg>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState<"platform" | "operations">("platform");
  const [activeTab, setActiveTab] = useState<"fusion" | "environment" | "sod" | "disaster">("fusion");
  const [heroMousePos, setHeroMousePos] = useState({ x: 0, y: 0 });
  
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setHeroMousePos({ x: 0, y: 0 });
  };

  const [currentTime, setCurrentTime] = useState("");
  const [systemAlertsCount, setSystemAlertsCount] = useState(3);
  const [showTragicProfile, setShowTragicProfile] = useState(false);

  // Highlight/Locate on Map tracker
  const [highlightedSector, setHighlightedSector] = useState<string | null>(null);

  // Console logs at footer
  const [consoleLogs, setConsoleLogs] = useState<Array<{ id: string; msg: string; type: "info" | "warning" | "success"; time: string }>>([
    { id: "init1", msg: "Aptara Executive Core booted successfully. Interface release v3.0.0-PRO.", type: "success", time: "06:30:10" },
    { id: "init2", msg: "CIEM Industries server sync complete. Secure SSL handshake active.", type: "info", time: "06:30:11" },
    { id: "init3", msg: "Strategic observer grids and telemetry sensors are 100% operational.", type: "success", time: "06:30:12" },
  ]);

  const pushConsoleLog = React.useCallback((msg: string, type: "info" | "warning" | "success" = "info") => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const newLog = {
      id: Math.random().toString(),
      msg,
      type,
      time: timeStr,
    };
    setConsoleLogs(prev => [newLog, ...prev.slice(0, 14)]);
  }, []);

  const handleLocateOnMap = React.useCallback((sector: string) => {
    setHighlightedSector(sector);
    setActiveTab("fusion");
    pushConsoleLog(`Threat vector located in [${sector}]. Routing viewport to active Sensor Fusion radar grid.`, "success");
  }, [pushConsoleLog]);

  // Interactive Collaboration Modals / State
  const [collabModal, setCollabModal] = useState<"research" | "investor" | "join" | "tech" | null>(null);
  const [collabForm, setCollabForm] = useState({ name: "", organization: "", email: "", notes: "" });
  const [submittingCollab, setSubmittingCollab] = useState(false);

  // Active highlighted node in the ecosystem flow chart
  const [activeEcosystemNode, setActiveEcosystemNode] = useState<number>(0);

  // FAQ Interactive filter and accordion states
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Telemetry stream state for data flow efficiency graph
  const [telemetryData, setTelemetryData] = useState([
    { epoch: "Epoch 01", throughput: 45, latency: 12, fusionRate: 92 },
    { epoch: "Epoch 02", throughput: 68, latency: 10, fusionRate: 95 },
    { epoch: "Epoch 03", throughput: 85, latency: 8, fusionRate: 97 },
    { epoch: "Epoch 04", throughput: 110, latency: 5, fusionRate: 99 },
    { epoch: "Epoch 05", throughput: 95, latency: 7, fusionRate: 98 },
    { epoch: "Epoch 06", throughput: 125, latency: 4, fusionRate: 99.4 },
    { epoch: "Epoch 07", throughput: 115, latency: 6, fusionRate: 99.1 },
    { epoch: "Epoch 08", throughput: 135, latency: 3, fusionRate: 99.8 },
  ]);

  const triggerTelemetryRefresh = React.useCallback(() => {
    setTelemetryData((prevData) => {
      return prevData.map((d) => {
        const throughputVariance = Math.floor(Math.random() * 16) - 8;
        const latencyVariance = Math.floor(Math.random() * 4) - 2;
        const newThroughput = Math.max(30, Math.min(200, d.throughput + throughputVariance));
        const newLatency = Math.max(2, Math.min(20, d.latency + latencyVariance));
        return {
          ...d,
          throughput: newThroughput,
          latency: newLatency,
          fusionRate: Math.max(90, Math.min(100, d.fusionRate + (Math.random() * 0.4 - 0.2)))
        };
      });
    });
    pushConsoleLog("Planetary sensing telemetry handshake synchronized across active sectors.", "success");
  }, [pushConsoleLog]);

  // Clock updating
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("en-US", { timeZone: "UTC", hour12: false }) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerSimulatedQuery = (prompt: string) => {
    pushConsoleLog(`Transmitting cognitive query payload: "${prompt}"`, "info");
  };

  const handleCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCollab(true);
    
    setTimeout(() => {
      pushConsoleLog(`[CIEM COLLABORATION] Handled secure integration request in category: ${collabModal?.toUpperCase()} for ${collabForm.name} (${collabForm.organization || "Independent"})`, "success");
      setSubmittingCollab(false);
      setCollabModal(null);
      setCollabForm({ name: "", organization: "", email: "", notes: "" });
      alert("Demands registered. Thank you for connecting with CIEM Industries and APTARA AI.");
    }, 1200);
  };

  const ecosystemFlow = [
    {
      title: "Smart Observer Device (SOD)",
      sub: "Point-of-Origin Telemetry Capture",
      desc: "Tactical telemetry units placed on drone arrays, infrastructure nodes, and critical target terrain for primary signal acquisition.",
      metrics: "Micro-watt efficiency, real-time edge processing.",
      icon: <Cpu className="w-5 h-5 text-emerald-600" />
    },
    {
      title: "Sensor Fusion Layer",
      sub: "LiDAR + Radar + Infrared + Ultrasonics + Photogrammetry",
      desc: "Combines high-density light surveying, distance waves, thermal imaging, acoustics, and mapping data into a coherent unified matrix.",
      metrics: "Sub-millimeter alignment accuracy, environmental adaptability.",
      icon: <Layers className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Edge AI Processing",
      sub: "NVIDIA Jetson Core Platform Implementation",
      desc: "Processes multi-spectral sensors on site directly. Bypasses bandwidth constraints to filter noise from actual crisis indicators.",
      metrics: "Ultra-low latency inference, rugged IP67 enclosure standards.",
      icon: <Network className="w-5 h-5 text-emerald-600" />
    },
    {
      title: "APTARA AI Intelligence Engine",
      sub: "Consolidated Earth Observation Network Core",
      desc: "Combines environmental inputs, spatial models, and telemetry to manage and coordinate global mitigation networks automatically.",
      metrics: "Trained on massive eco-engineering and architectural records.",
      icon: <Brain className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Prediction & Decision Intelligence",
      sub: "Actionable Risk Minimization Formulas",
      desc: "Predicts catastrophic climate anomalies, structural collapses, or fire patterns before they mature, routing critical rescue resources.",
      metrics: "94.8% predictive precision rating inside testing quadrants.",
      icon: <Activity className="w-5 h-5 text-emerald-600" />
    },
    {
      title: "Tactical Execution Endpoints",
      sub: "Drones, Robotics, and Interactive Dashboards",
      desc: "Commands automated UAV fleets, smart grid lock actuators, solar deflection shields, and interactive web pipelines.",
      metrics: "Instant automated dispatch parameters in <0.9 seconds.",
      icon: <Globe className="w-5 h-5 text-blue-600" />
    }
  ];

  const aiModules = [
    {
      id: "sense",
      title: "Aptara Sense",
      tagline: "Multispectral Environmental Telemetry",
      desc: "Aggregates, filters, and standardizes multi-spectral sensor feeds to keep digital representations in absolute real-time sync.",
      color: "emerald"
    },
    {
      id: "vision",
      title: "Aptara Vision",
      tagline: "High-Resolution Spatial Intelligence",
      desc: "Employs computer vision algorithms and spatial rendering to interpret geography, tracking soil decay, urban concrete stress, and forest depletion.",
      color: "blue"
    },
    {
      id: "predict",
      title: "Aptara Predict",
      tagline: "Anomalous Tectonic & Climate Warning Engine",
      desc: "Applies physics-informed neural networks to forecast severe weather disturbances, structural loads, and seismic fault stresses.",
      color: "emerald"
    },
    {
      id: "nexus",
      title: "Aptara Nexus",
      tagline: "Decentralized Edge Ecosystem Inter-Link",
      desc: "Routes critical alerts and status telemetry securely through remote satellite pathways and ad-hoc mesh drone connections.",
      color: "blue"
    },
    {
      id: "assist",
      title: "Aptara Assist",
      tagline: "Investigative Natural Language Workspace",
      desc: "Provides real-time strategic counsel, generating actionable mitigation plans, incident briefs, and deep system diagnostics.",
      color: "emerald"
    }
  ];

  const techStack = [
    { name: "Sensor Fusion", desc: "Heterogeneous multi-sensor calibration & temporal alignment" },
    { name: "Edge AI", desc: "Real-time, offline-capable deep neural network evaluation" },
    { name: "Computer Vision", desc: "3D density mapping, thermal anomaly profiling, and pixel tracking" },
    { name: "NVIDIA Jetson Platform", desc: "Industrial rugged performance engines powering onsite edge hardware" },
    { name: "Predictive Analytics", desc: "Advanced spatial-temporal forecast architectures" },
    { name: "Robotics Integration", desc: "Direct actuation commands for valves, structural locks, and response drones" },
    { name: "Drone Systems", desc: "Autonomous flight routing, aerosol distribution, and mapping swarms" }
  ];

  return (
    <div id="aptara-deeptech-platform" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none antialiased">
      
      {/* 1. Tactical HUD Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-center shadow-md relative overflow-hidden flex-shrink-0 p-1">
            <AptaraLogoSvg className="w-8 h-8 animate-pulse" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-extrabold tracking-wider text-sm uppercase text-slate-900">APTARA AI</span>
              <span className="font-mono text-[9px] text-blue-700 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded uppercase font-medium">DEEP-TECH STATION</span>
              <span className="font-mono text-[9px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-250 px-1.5 py-0.5 rounded uppercase font-medium">CIEM CORE</span>
            </div>
            <p className="text-[9px] text-slate-500 font-sans tracking-wide uppercase leading-none mt-1.5 flex items-center gap-1.5 flex-wrap">
              <span>driven by Engineers, designed for impact, made in India</span>
              <IndianFlagSvg className="w-3.5 h-2.2 -my-0.5" />
              <span>for the world</span>
            </p>
          </div>
        </div>

        {/* Navigation Toggles (Platform Vs Simulator Operating Center) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setViewMode("platform"); pushConsoleLog("Switched display: Strategic Platform Profile", "info"); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === "platform" 
                ? "bg-emerald-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Strategic Profile
          </button>
          
          <button
            onClick={() => { setViewMode("operations"); pushConsoleLog("Switched display: Operations Command Center & Simulation", "info"); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "operations" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Operations Portal
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden lg:block" />

          {/* Running Clock */}
          <div className="font-mono text-[10px] text-slate-600 bg-slate-550 border border-slate-200 rounded px-2.5 py-1.5 hidden lg:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentTime || "06:30:15 UTC"}</span>
          </div>
        </div>
      </header>

      {/* 2. Main content rendering */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {viewMode === "platform" ? (
            <motion.div
              key="platform-profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 py-8 lg:py-12 space-y-16"
            >
                           {/* SECTION 1: HERO CONTAINER */}
              <div 
                id="platform-hero" 
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                className="relative p-6 lg:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white overflow-hidden shadow-2xl border border-slate-800"
              >
                {/* Background grid details */}
                <motion.div 
                  className="absolute -inset-8 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" 
                  animate={{
                    x: heroMousePos.x * -35,
                    y: heroMousePos.y * -35,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 70,
                    damping: 25
                  }}
                />
                
                 <div className="relative z-10 space-y-8">
                  {/* Strategic Label badges */}
                  <div className="inline-flex flex-wrap items-center gap-2 bg-slate-900/95 border border-slate-700/60 p-1.5 px-4 rounded-full text-[10px] font-mono tracking-wider uppercase text-emerald-400 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Active Global Sensing Deployment</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-blue-400">CIEM AI Mainframe Portal</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Text description (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="space-y-4">
                        <h1 className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-none bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                          APTARA AI
                        </h1>
                        
                        <p className="font-heading text-xl sm:text-2xl text-emerald-400 font-semibold tracking-wide leading-snug">
                          &quot;Intelligence Platform for Sustainable Observation and Planetary Intelligence&quot;
                        </p>

                        <p className="text-sm text-slate-300 leading-relaxed">
                          Building intelligent sensing and AI ecosystems for sustainability, environmental understanding, and responsible planetary intelligence. Designed and operated by <strong className="text-white font-mono font-bold">CIEM Industries (Consortium of Indian Engineers and Mechtronics Industries)</strong>, led by Founder &amp; Inventor <strong className="text-white font-semibold">Mano Mathen John</strong>.
                        </p>
                      </div>

                      {/* Core Attributes Panel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-800/85">
                        <div className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block">Corporate Developer</span>
                          <p className="text-sm font-bold text-white uppercase tracking-wider">CIEM INDUSTRIES</p>
                          <span className="text-xs text-emerald-400 font-medium block">Consortium of Indian Engineers and Mechtronics Industries</span>
                        </div>
                        
                        <div className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block">Founder &amp; Inventor</span>
                          <p className="text-sm font-bold text-white tracking-widest uppercase">Mano Mathen John</p>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">Developing intelligent sensing networks that contribute to sustainability and responsible planetary progression.</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Visual Brand Representation Showcase (5 cols) */}
                    <div className="lg:col-span-5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center space-y-6 shadow-xl relative overflow-hidden">
                      {/* Grid accent inside background block with responsive parallax */}
                      <motion.div 
                        className="absolute -inset-4 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" 
                        animate={{
                          x: heroMousePos.x * -15,
                          y: heroMousePos.y * -15,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 90,
                          damping: 24
                        }}
                      />
                      
                      {/* Aptara AI Logo Sphere Representation with dual-layered motion */}
                      <motion.div
                        className="relative z-10 w-28 h-28"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 4.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <motion.div 
                          className="w-full h-full rounded-full bg-slate-900 border border-emerald-500/30 flex items-center justify-center p-2 shadow-2xl"
                          animate={{
                            x: heroMousePos.x * -25,
                            y: heroMousePos.y * -25,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 85,
                            damping: 22
                          }}
                        >
                          <AptaraLogoSvg className="w-24 h-24 animate-spin-slow" />
                          <div className="absolute -inset-1 rounded-full border border-dashed border-emerald-400/20 animate-spin-slow" style={{ animationDuration: '24s' }} />
                        </motion.div>
                      </motion.div>

                      {/* Brand Info */}
                      <div className="relative z-10 text-center space-y-4 w-full">
                        <div className="space-y-2">
                          {/* Elegant Corporate brand labels */}
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-mono text-[9px] text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded uppercase">APTARA AI</span>
                            <span className="text-slate-600">|</span>
                            <span className="font-mono text-[9px] text-blue-400 font-bold bg-blue-950 border border-blue-900 px-2 py-0.5 rounded uppercase">CIEM</span>
                          </div>
                          
                          {/* Official Tagline */}
                          <p className="text-xs text-slate-205 leading-relaxed italic font-heading font-medium tracking-wide">
                            &quot;driven by Engineers, designed for impact, made in India for the world&quot;
                          </p>
                        </div>

                        {/* Made in India Badge & Tri-color accent */}
                        <div className="inline-flex items-center gap-2.5 bg-slate-900 border border-slate-800/80 px-4 py-2 rounded-full text-[9px] font-mono uppercase tracking-widest text-slate-200 shadow-inner font-bold">
                          <IndianFlagSvg className="w-5 h-3.5 shadow-sm" />
                          <span>MADE IN INDIA FOR THE WORLD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => {
                        const target = document.getElementById("platform-architecture");
                        target?.scrollIntoView({ behavior: "smooth" });
                        pushConsoleLog("Navigated hero: System Flow section", "info");
                      }}
                      className="px-6 py-3 text-xs font-mono font-bold uppercase bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded-xl text-white hover:text-emerald-400 transition-all cursor-pointer shadow-md hover:bg-slate-850"
                    >
                      Explore Technology
                    </button>
                    
                    <button
                      onClick={() => {
                        setViewMode("operations");
                        pushConsoleLog("Triggered simulated core dashboard sandbox", "success");
                        const scrollTarget = document.getElementById("aptara-deeptech-platform");
                        scrollTarget?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-6 py-3 text-xs font-mono font-bold uppercase bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white shadow-lg hover:shadow-emerald-900/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Activity className="w-4 h-4 text-emerald-100 animate-pulse" />
                      Try Aptara AI
                    </button>

                    <button
                      onClick={() => {
                        const target = document.getElementById("platform-collaboration");
                        target?.scrollIntoView({ behavior: "smooth" });
                        pushConsoleLog("Navigated hero: Investor & Collaboration desk", "info");
                      }}
                      className="px-6 py-3 text-xs font-mono font-bold uppercase bg-blue-600 hover:bg-blue-750 rounded-xl text-white shadow-lg hover:shadow-blue-950/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-blue-100" />
                      Join Mission
                    </button>

                    <button
                      onClick={() => {
                        setShowTragicProfile(true);
                        pushConsoleLog("Initiated interactive high-fidelity tragic profile overlay.", "success");
                      }}
                      className="px-6 py-3 text-xs font-mono font-bold uppercase bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border border-red-500/30 hover:border-red-500 rounded-xl text-red-200 hover:text-red-100 transition-all cursor-pointer shadow-md flex items-center gap-2 animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-red-400" />
                      View CIEM Tragic Profile
                    </button>
                  </div>
                </div>

                {/* Decorative radial graphic on desktop */}
                <div className="absolute right-12 bottom-12 hidden lg:block w-80 h-80 border border-slate-800 rounded-full opacity-20 pointer-events-none">
                  <div className="absolute inset-5 border border-dashed border-emerald-400/30 rounded-full animate-spin-slow flex items-center justify-center">
                    <Globe className="w-16 h-16 text-emerald-500 opacity-40 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* DYNAMIC 5-SECONDS EXPLAINER SECTION (Goal 1: Explain within 5 seconds) */}
              <div className="bg-white border border-slate-200 p-6 lg:p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 px-2.5 py-0.5 bg-emerald-50 rounded border border-emerald-250">
                      Vanguard Summary
                    </span>
                    <h3 className="font-heading text-xl font-extrabold text-slate-900 tracking-tight">
                      Aptara AI Explained in 5 Seconds
                    </h3>
                  </div>
                  <p className="text-xs text-slate-550 max-w-sm font-sans leading-normal">
                    A world-class deep-tech intelligence ecosystem designed to protect Earth&apos;s vital signs in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-150 transition-all space-y-2.5 relative">
                    <span className="absolute top-4 right-4 font-mono text-[11px] font-bold text-slate-350">STEP 1</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/50 flex items-center justify-center text-emerald-600">
                      <Cpu className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">ACQUIRE (Smart Obducers)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Physical **Smart Observer Devices (SOD)** on drone swarms, cameras, and terrain nodes capture high-density environmental telemetry.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-150 transition-all space-y-2.5 relative">
                    <span className="absolute top-4 right-4 font-mono text-[11px] font-bold text-slate-350">STEP 2</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/50 flex items-center justify-center text-blue-600">
                      <Layers className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">FUSE (NVIDIA Edge AI)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      On-site **NVIDIA Jetson Cores** dynamically synthesize LiDAR, Radar, Infrared, and seismic streams to discard noise with zero latency.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-150 transition-all space-y-2.5 relative">
                    <span className="absolute top-4 right-4 font-mono text-[11px] font-bold text-slate-350">STEP 3</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/50 flex items-center justify-center text-emerald-600">
                      <Globe className="w-4.5 h-4.5 animate-spin-slow" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">ACTUATE (Planetary AI)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      The core **APTARA AI Engine** predicts critical ecosystem hazards, drives albedo defenses, and guides global sustainability parameters.
                    </p>
                  </div>
                </div>
              </div>


              {/* SECTION 2: SYSTEM ARCHITECTURE FLOW */}
              <div id="platform-architecture" className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-250">
                    System Process Pipeline
                  </span>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-950">
                    Ecosystem Architecture
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    A comprehensive full-stack engineering flow delivering environmental telemetry safely to active robotic and drone arrays.
                  </p>
                </div>

                {/* Visual Intersect Pipeline Flow Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 p-6 lg:p-8 rounded-2xl shadow-sm">
                  
                  {/* Left Side: Pipeline Steps (Horizontal or Vertical clickable list) */}
                  <div className="lg:col-span-7 space-y-3">
                    <p className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                      Pipeline Stages (Click map nodes to analyze)
                    </p>
                    
                    <div className="space-y-2">
                      {ecosystemFlow.map((step, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setActiveEcosystemNode(idx);
                            pushConsoleLog(`Inspected ecosystem flow index: ${step.title}`, "info");
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            activeEcosystemNode === idx
                              ? "bg-emerald-50/50 border-emerald-400/80 shadow-xs"
                              : "bg-slate-50/40 border-slate-200 hover:bg-slate-50 hover:border-slate-350"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              activeEcosystemNode === idx ? "bg-emerald-100 text-emerald-700" : "bg-slate-200/50 text-slate-600"
                            }`}>
                              {step.icon}
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-sm text-slate-900">{step.title}</h4>
                              <p className="text-xs text-slate-500">{step.sub}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-200/40 px-1.5 py-0.5 rounded">
                              NODE 0{idx+1}
                            </span>
                            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${activeEcosystemNode === idx ? "text-emerald-500 translate-x-1" : "text-slate-300"}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Detailed specs of selected node */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-6 h-full min-h-[340px] flex flex-col justify-between border border-slate-800 relative overflow-hidden">
                    {/* Glowing highlight sphere */}
                    <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800/40 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                          Deep Integration Details
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          STAGE 0{activeEcosystemNode+1} of 06
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-heading text-xl font-bold tracking-tight text-white leading-tight">
                          {ecosystemFlow[activeEcosystemNode].title}
                        </h3>
                        <p className="text-xs text-emerald-500 font-mono font-medium">
                          {ecosystemFlow[activeEcosystemNode].sub}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-850">
                        {ecosystemFlow[activeEcosystemNode].desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block">Target Diagnostics</span>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-200 bg-slate-900 border border-slate-850 p-2 rounded-lg">
                        <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{ecosystemFlow[activeEcosystemNode].metrics}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Telemetry Chart Widget: Data Flow Efficiency */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 uppercase">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        <span>Live Telemetry Dynamics</span>
                      </div>
                      <h3 className="font-heading text-lg font-extrabold text-slate-900 tracking-tight">
                        Pipeline Data Flow Efficiency Map
                      </h3>
                      <p className="text-xs text-slate-500">
                        Real-time throughput and edge signal latency between **Smart Observer Device (Origin)** and **Prediction & Decision Intelligence (Core)**.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={triggerTelemetryRefresh}
                        className="px-3.5 py-1.5 text-[11px] font-mono font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>Sync Stream</span>
                      </button>
                    </div>
                  </div>

                  {/* Recharts Area Chart container */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* The Chart itself */}
                    <div className="lg:col-span-8 h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={telemetryData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colThroughput" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                            </linearGradient>
                            <linearGradient id="colLatency" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis 
                            dataKey="epoch" 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "#0f172a", 
                              border: "1px solid #334155", 
                              borderRadius: "8px",
                              color: "#fff",
                              fontSize: "11px",
                              fontFamily: "monospace"
                            }} 
                          />
                          <Legend 
                            verticalAlign="top" 
                            height={36} 
                            iconType="circle"
                            iconSize={6}
                            formatter={(value) => {
                              return <span className="text-[11px] font-mono font-semibold text-slate-650 tracking-wide uppercase">{value}</span>;
                            }}
                          />
                          <Area 
                            name="Throughput (Mbps)"
                            type="monotone" 
                            dataKey="throughput" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colThroughput)" 
                          />
                          <Area 
                            name="Latency (ms)"
                            type="monotone" 
                            dataKey="latency" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colLatency)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Stats sidebar */}
                    <div className="lg:col-span-4 bg-slate-50 border border-slate-150 rounded-xl p-4.5 space-y-4 font-mono">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-widest">Active Link Status</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-xs font-bold text-slate-900">COGNITIVE TUNNEL SECURE</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                        <div className="bg-white border border-slate-150 p-2.5 rounded-lg">
                          <span className="text-[8px] uppercase text-slate-400 block">Avg Throughput</span>
                          <span className="text-sm font-extrabold text-emerald-600 block mt-0.5">{(telemetryData.reduce((acc, d) => acc + d.throughput, 0) / telemetryData.length).toFixed(1)} <span className="text-[9px] font-normal">Mb/s</span></span>
                        </div>
                        <div className="bg-white border border-slate-150 p-2.5 rounded-lg">
                          <span className="text-[8px] uppercase text-slate-400 block">Avg Latency</span>
                          <span className="text-sm font-extrabold text-blue-600 block mt-0.5">{(telemetryData.reduce((acc, d) => acc + d.latency, 0) / telemetryData.length).toFixed(1)} <span className="text-[9px] font-normal">ms</span></span>
                        </div>
                      </div>

                      <div className="bg-slate-900 text-slate-300 p-3 rounded-lg text-[10px] leading-relaxed border border-slate-800">
                        <div className="text-emerald-400 font-bold uppercase mb-1 flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Fusion Efficiency</span>
                        </div>
                        <p className="font-sans text-slate-400">
                          Primary telemetry filtered via on-site NVIDIA cores yields an average accuracy rate of <strong className="text-white font-mono">{(telemetryData.reduce((acc, d) => acc + d.fusionRate, 0) / telemetryData.length).toFixed(2)}%</strong>. Jitter is negligible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>


              {/* SECTION 3: AI MODULES */}
              <div id="platform-modules" className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 px-2 py-0.5 bg-blue-50 rounded border border-blue-200">
                    Product Portfolio Suite
                  </span>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-950">
                    Cognitive AI Modules
                  </h2>
                  <p className="text-sm text-slate-600">
                    Engineered to streamline earth telemetry and automate regional stabilization.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiModules.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-400/50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded ${
                            m.color === "emerald" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            ACTIVE CONSOLE
                          </span>
                          <Bot className="w-4 h-4 text-slate-400" />
                        </div>

                        <h3 className="font-heading text-lg font-bold text-slate-950">{m.title}</h3>
                        <p className="text-xs text-emerald-600 font-mono font-semibold">{m.tagline}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-450 uppercase">Modular Scale Block</span>
                        
                        <button
                          onClick={() => {
                            setViewMode("operations");
                            if (m.id === "assist") {
                              pushConsoleLog("Auto-focusing on Aptara Natural Language Assist", "success");
                            } else {
                              setActiveTab(m.id === "sense" ? "fusion" : m.id === "vision" ? "fusion" : m.id === "predict" ? "environment" : "sod");
                              pushConsoleLog(`Auto-routing sandbox interface to match ${m.title}`, "success");
                            }
                            const scrollTarget = document.getElementById("aptara-deeptech-platform");
                            scrollTarget?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="text-[10px] font-mono text-emerald-600 hover:text-emerald-700 font-bold uppercase flex items-center gap-1 cursor-pointer"
                        >
                          Launch Demo →
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Aesthetic interactive 6th card */}
                  <div className="bg-gradient-to-br from-emerald-50/50 to-blue-50/50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-220 flex items-center justify-center text-emerald-600 shadow-sm">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading font-extrabold text-sm text-slate-900">Custom Deployment Request?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Our research networks can design a tailor-made interface targeting specific regional environmental monitoring hazards.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const target = document.getElementById("platform-collaboration");
                        target?.scrollIntoView({ behavior: "smooth" });
                        setCollabModal("tech");
                        pushConsoleLog("Pre-selecting Technical Collaboration in form", "info");
                      }}
                      className="w-full text-center py-2 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded text-[11px] font-semibold text-slate-700 font-mono cursor-pointer transition-all"
                    >
                      Connect with Engineering Desk
                    </button>
                  </div>
                </div>
              </div>


              {/* SECTION 4 & 5: TECH STACK & USE CASES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Tech Stack Grid */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold text-blue-600 bg-blue-550 border border-blue-200/50 px-2 py-0.5 rounded">
                      CIEM Stack
                    </div>
                    <h3 className="font-heading text-xl font-bold text-slate-950">Technology Stack</h3>
                    <p className="text-xs text-slate-500">Core technologies compiled to scale modern environmental diagnostics.</p>
                  </div>

                  <div className="space-y-2.5">
                    {techStack.map((tech, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-50/50 rounded-xl border border-slate-150">
                        <CheckCircle className="w-4 h-4 text-emerald-550 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900 font-mono">{tech.name}</h4>
                          <p className="text-[11px] text-slate-550 leading-relaxed mt-0.5">{tech.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Use Cases Grid */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded">
                      Deployment Matrix
                    </div>
                    <h3 className="font-heading text-xl font-bold text-slate-950">Field Use Cases</h3>
                    <p className="text-xs text-slate-500">How Aptara AI acts inside global physical engineering domains.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    <div className="p-3 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all space-y-1">
                      <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">Engineering</span>
                      <h4 className="text-xs font-bold text-slate-900">Infrastructure Monitoring</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Continuous structural fatigue profiles & warning triggers.</p>
                    </div>

                    <div className="p-3 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all space-y-1">
                      <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">Biosphere</span>
                      <h4 className="text-xs font-bold text-slate-900">Environmental Intelligence</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Tracking carbon output parameters, PPM status, and biosphere decline.</p>
                    </div>

                    <div className="p-3 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all space-y-1">
                      <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">Build</span>
                      <h4 className="text-xs font-bold text-slate-900">Construction Applications</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Real-time photogrammetric survey profiles and soil load metrics.</p>
                    </div>

                    <div className="p-3 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all space-y-1">
                      <span className="text-[9px] font-mono text-emerald-605 font-bold uppercase">UAV Flight</span>
                      <h4 className="text-xs font-bold text-slate-900">Drone & Robotic Systems</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Autonomous coordinate mapping and high-altitude aerosol routing.</p>
                    </div>

                    <div className="p-3 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">Heritage & Survey</span>
                      <h4 className="text-xs font-bold text-slate-900">Archaeological Survey Applications</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Using sub-surface radar systems and LiDAR imagery to discover, map, and preserve ancient historical heritages and architectural outlines without destructive dig practices.
                      </p>
                    </div>

                    <div className="p-3 border border-emerald-200 bg-emerald-50/20 rounded-xl space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase">Sustainability</span>
                      <h4 className="text-xs font-bold text-slate-900">Sustainability Intelligence</h4>
                      <p className="text-[11px] text-slate-650 leading-relaxed">
                        Deep calculation algorithms tracking planetary boundary levels to ensure agricultural resilience and sustainable industrial output.
                      </p>
                    </div>

                  </div>
                </div>

              </div>


              {/* SECTION 6: FUTURE ROADMAP */}
              <div id="platform-roadmap" className="space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-250">
                    Sensing Evolution Grid
                  </span>
                  <h2 className="font-heading text-3.5xl font-extrabold tracking-tight text-slate-950">
                    Roadmap & Ecosystem Lifecycle
                  </h2>
                  <p className="text-sm text-slate-600">
                    Strategic deployment schedule to scale the boundaries of planetary sensing and geoengineering feedback networks.
                  </p>
                </div>

                {/* Staggered Timeline Checkpoints */}
                <div className="relative border border-slate-200/85 bg-white p-6 sm:p-10 rounded-3xl shadow-xs overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    
                    <div className="space-y-3 bg-slate-50/60 p-5 rounded-2xl border border-slate-150 relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">2026</span>
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded border border-emerald-250 uppercase">DEPLOYED</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-heading">AI Foundation & Synthesis</h4>
                        <p className="text-xs text-slate-655 leading-relaxed">
                          Establishing high-fidelity multispectral pipelines, sensor-calibration models, and initial natural-language mainframe telemetry assist parameters.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">STAGE 01 — RUNNING</span>
                    </div>

                    <div className="space-y-3 bg-slate-50/60 p-5 rounded-2xl border border-blue-150 relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">2027</span>
                          <span className="text-[9px] font-mono font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded border border-blue-250 uppercase">ACTIVE PROTO</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-heading">Prototype & Himalayan Trials</h4>
                        <p className="text-xs text-slate-655 leading-relaxed">
                          Deploying first physical Smart Observer Device (SOD-v1) units across rugged Indian sub-fault zones and seismic tracking quadrants.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">STAGE 02 — IN PROCESS</span>
                    </div>

                    <div className="space-y-3 bg-slate-50/60 p-5 rounded-2xl border border-slate-200 relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">2028</span>
                          <span className="text-[9px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">SCHEDULING</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-heading">Aerosol & Swarm Pilots</h4>
                        <p className="text-xs text-slate-655 leading-relaxed">
                          Field orchestration of coordinated micro-UAV fleets and high-altitude solar-deflection shielding trials within isolated test corridors.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">STAGE 03 — PLANNING</span>
                    </div>

                    <div className="space-y-3 bg-slate-50/60 p-5 rounded-2xl border border-slate-200 relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-extrabold text-slate-550 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">2030</span>
                          <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded uppercase">OBJECTIVE</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-heading">Global Sensing Synthesis</h4>
                        <p className="text-xs text-slate-655 leading-relaxed">
                          Inauguration of a complete decentralised, autonomous feedback network of environmental obducers managed entirely by CIEM Central Control.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">STAGE 04 — SPECULATIVE BOUNDS</span>
                    </div>

                  </div>
                </div>
              </div>


              {/* SECTION 7: SUSTAINABILITY DIRECTION & FOUNDER PROFILE BLOCK */}
              <div id="platform-mission-founder" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* DUAL COLUMN 1: Sustainability & Humanity Mission (Goal 4) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25" />
                  <div className="absolute -right-32 -bottom-32 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/60 p-1 px-3 rounded-full text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Sustainability &amp; Humanity Charter</span>
                    </div>

                    <div className="space-y-4">
                      <span className="text-xs uppercase font-mono tracking-widest text-slate-400 block">Core Mission Statement</span>
                      <blockquote className="text-lg sm:text-xl font-medium tracking-wide italic text-slate-100 leading-relaxed font-heading border-l-2 border-emerald-550 pl-4">
                        &quot;Build intelligent sensing and AI ecosystems that strengthen humanity’s ability to understand environments, improve sustainability, enable responsible technological progress, and support long-term planetary intelligence.&quot;
                      </blockquote>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 pt-4 border-t border-slate-850 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-mono text-xs font-extrabold">C</div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wide">CIEM Planetary Intelligence Directive</span>
                  </div>
                </motion.div>

                {/* DUAL COLUMN 2: Founder & Inventor Profile (Goal 3) */}
                <div 
                  onClick={() => {
                    setShowTragicProfile(true);
                    pushConsoleLog("Activated immersive cinematic tragic profile via regional telemetry hub.", "success");
                  }}
                  className="lg:col-span-5 bg-slate-900 border border-slate-800 text-white hover:border-red-500 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden cursor-pointer group hover:shadow-2xl hover:shadow-red-950/10 transition-all duration-300"
                >
                  {/* Floating Cinematic Mode Indicator badge */}
                  <span className="absolute top-4 right-4 text-[9px] font-mono font-bold uppercase tracking-widest text-[#f87171] bg-red-950/40 border border-red-900/30 py-1 px-2.5 rounded-full group-hover:text-red-100 group-hover:bg-red-900/50 group-hover:border-red-500 transition-all flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
                    Cinematic Mode
                  </span>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      {/* Premium Cybernetic Visionary Avatar Emblem */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 p-0.5 shadow-md border border-emerald-500/30 flex items-center justify-center relative overflow-hidden flex-shrink-0 group">
                        {/* Interactive scanning animation background glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-blue-500/10 animate-pulse pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400 opacity-60 animate-bounce" style={{ animationDuration: "3s" }} />
                        
                        {/* Concentric vector circles */}
                        <div className="absolute w-12 h-12 rounded-full border border-emerald-500/20" />
                        <div className="absolute w-10 h-10 rounded-full border border-dashed border-blue-400/20 animate-spin-slow" />
                        
                        <svg className="w-7 h-7 text-emerald-400 z-10 filter drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.933 0 3.5-1.567 3.5-3.5S13.933 4 12 4 8.5 5.567 8.5 7.5 10.067 11 12 11zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5z" />
                          <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 2" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
                          Executive Architect
                        </div>
                        <h4 className="text-base font-extrabold text-white font-heading group-hover:text-red-300 transition-colors">Mano Mathen John</h4>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 block w-max font-bold font-mono mt-1 uppercase">Founder &amp; Inventor</span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Founder Vision</div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                        &quot;Led by Mano Mathen John, CIEM Industries aims to create intelligent technologies that contribute to sustainability, environmental understanding, responsible innovation, and the long-term future of humanity.&quot;
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col items-start select-none">
                      <span className="font-heading font-black text-2xl tracking-wide text-white leading-none">
                        CIEM
                      </span>
                      <span className="font-sans font-extrabold text-[9px] text-slate-500 uppercase tracking-[0.24em] leading-none mt-1">
                        INDUSTRIES
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">
                        FOUNDATIONAL PRINCIPLE
                      </p>
                      <p className="text-[10px] font-heading font-extrabold italic text-slate-300 leading-snug mt-1 flex items-center justify-start sm:justify-end gap-1.5 flex-wrap">
                        <span>driven by Engineers, designed for impact, made in India</span>
                        <IndianFlagSvg className="w-3.5 h-2.2 -my-0.5" />
                        <span>for the world</span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>


              {/* SECTION 8: COLLABORATION CONNECT & INVESTOR DESK */}
              <div id="platform-collaboration" className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-250">
                    Joint Ventures & Grants
                  </span>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-950">
                    Collaboration Section
                  </h2>
                  <p className="text-sm text-slate-500">
                    Secure access pathways for research partnerships, investment, careers, and technology.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-white border border-slate-200 hover:border-emerald-500 p-5 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <Activity className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">Research Partnership</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Joint engineering trials, data calibration, and university academic integrations.</p>
                    </div>
                    <button
                      onClick={() => { setCollabModal("research"); pushConsoleLog("Opened Research partnership desk", "info"); }}
                      className="w-full text-center py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Connect Research
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 hover:border-blue-500 p-5 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <TrendingUp className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">Investor Connect</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Venture capital bridges, regional deep-tech grants, and strategic project funding.</p>
                    </div>
                    <button
                      onClick={() => { setCollabModal("investor"); pushConsoleLog("Opened Investor connect desk", "info"); }}
                      className="w-full text-center py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Investor Pitch
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 hover:border-emerald-500 p-5 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <Users className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">Join Mission</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Career positions for mechtronics, systems, and deep machine learning consultants.</p>
                    </div>
                    <button
                      onClick={() => { setCollabModal("join"); pushConsoleLog("Opened Careers joint desk", "info"); }}
                      className="w-full text-center py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Register Talent
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 hover:border-blue-500 p-5 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <RefreshCw className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">Technical Collaboration</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Onsite hardware evaluations and NVIDIA Jetson processing core configurations.</p>
                    </div>
                    <button
                      onClick={() => { setCollabModal("tech"); pushConsoleLog("Opened Technical collaboration desk", "info"); }}
                      className="w-full text-center py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Hardware Sync
                    </button>
                  </div>

                </div>
              </div>


              {/* SECTION 9: FREQUENTLY ASKED QUESTIONS & DISCUSSION HUB */}
              <div id="platform-faq" className="space-y-6 pt-6 border-t border-slate-150">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 px-2 py-0.5 bg-blue-50 rounded border border-blue-200">
                    KNOWLEDGE BASE & SUPPORT
                  </span>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-950">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm text-slate-500">
                    Find fast, peer-reviewed technological answers regarding the Aptara network, or discuss telemetry directly with our team.
                  </p>
                </div>

                {/* FAQ Main Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Interactive FAQ Accordion List (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    
                    {/* Interactive FAQ Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter help topics, keywords, or answers..."
                        value={faqSearch}
                        onChange={(e) => {
                          setFaqSearch(e.target.value);
                          pushConsoleLog(`FAQ Index Filter updated: "${e.target.value}"`, "info");
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
                      />
                      {faqSearch && (
                        <button
                          onClick={() => setFaqSearch("")}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-mono"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Accordion List */}
                    <div className="space-y-2">
                      {(() => {
                        const items = [
                          {
                            q: "What is Aptara's core engineering mission?",
                            a: "Developed by CIEM Industries (Consortium of Indian Engineers and Mechtronics Industries), Aptara is a planetary-scale geo-monitoring and climate adaptive solution. Its primary objective is tracking systemic environmental changes, running real-time threat-mitigation algorithms (e.g., active wildfires, volcanic rifts), and optimizing the Smart Observer Device (SOD) aerosol shield.",
                            category: "Mission & Architecture"
                          },
                          {
                            q: "Who is the executive leadership behind CIEM and Aptara?",
                            a: "The entire digital platform and operational suite was designed, developed, and is managed under the leadership of Founder & Executive Director Mano Mathen John and his senior engineering team of telemetry and systems architecture specialists at CIEM Industries.",
                            category: "Leadership"
                          },
                          {
                            q: "How does the 'Sensor Fusion Layer' detect anomalies?",
                            a: "The fusion matrix aggregates highly heterogeneous streams: LiDAR digital photogrammetry, ultrasonic signal triangulation, infra-red satellite imagery, and localized seismic waves. Deep learning models align this telemetry temporally and spatially to identify risks before critical threshold breakout.",
                            category: "Technology"
                          },
                          {
                            q: "What is the Smart Observer Device (SOD) deployment system?",
                            a: "The SOD module utilizes Smart Observer Devices deployed across high-altitude atmospheric cooling drone swarms and local sensing nodes. These devices capture precise telemetry to help stabilize local weather grids, monitor aerosol deployment, and manage regional ozone monitoring.",
                            category: "SOD Shield"
                          },
                          {
                            q: "Are the simulated hazards in the 'Operations Portal' real-time?",
                            a: "Yes, they run using real-time local algorithms that track escalation pathways. Active operators can mobilize responders to trigger digital mitigation sequences. Crucially, operators can click 'Locate on Map' to flash a target ping on the active Sensor Fusion radar screen.",
                            category: "Operations"
                          },
                          {
                            q: "How secure is the platform's connection ledger?",
                            a: "Aptara runs on a dual-mesh redundant network featuring standard military-grade security layers. Any manual threat triage or system state updates are immediately written synchronously to the secure CIEM Ledger visible in the bottom diagnostic ticker.",
                            category: "Security"
                          }
                        ];

                        const filtered = items.filter(
                          (x) =>
                            x.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
                            x.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
                            x.category.toLowerCase().includes(faqSearch.toLowerCase())
                        );

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-8 text-xs text-slate-400 font-mono border border-dashed border-slate-200 rounded-xl">
                              No knowledge-base articles match your query. Try different keywords.
                            </div>
                          );
                        }

                        return filtered.map((item, originalIndex) => {
                          const idx = items.indexOf(item);
                          const isOpen = openFaq === idx;
                          return (
                            <div
                              key={idx}
                              className={`bg-white border rounded-xl transition-all overflow-hidden ${
                                isOpen ? "border-blue-400 shadow-xs" : "border-slate-200 hover:border-slate-300 shadow-2xs"
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setOpenFaq(isOpen ? null : idx);
                                  pushConsoleLog(`Toggled FAQ Accordion topic: "${item.q}"`, "info");
                                }}
                                className="w-full text-left p-4 flex items-center justify-between gap-4 font-heading transition-colors hover:bg-slate-50/50 cursor-pointer animate-none"
                              >
                                <div className="space-y-1">
                                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-blue-500 bg-blue-50/70 border border-blue-100 px-1.5 py-0.5 rounded">
                                    {item.category}
                                  </span>
                                  <h4 className="font-bold text-sm text-slate-900 pr-4">{item.q}</h4>
                                </div>
                                <span className={`text-slate-400 font-mono text-xs font-semibold select-none flex-shrink-0 transition-transform duration-200 transform ${isOpen ? "rotate-90 text-blue-500" : ""}`}>
                                  ▶
                                </span>
                              </button>
                              
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-slate-100 bg-slate-50/30 overflow-hidden"
                                  >
                                    <p className="p-4 text-xs text-slate-600 leading-relaxed font-sans font-medium whitespace-pre-line">
                                      {item.a}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Beautiful Discuss / Consult Direct Contacts Box (4 cols) */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
                      {/* Grid overlay design effect */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                      
                      <div className="relative space-y-4">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <MessageSquare className="w-4.5 h-4.5 animate-pulse" />
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide">Direct Consultation Desk</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Need immediate operational assistance, or want to discuss active sensor arrays and strategic integration plans? Match instantly with an engineering operator.
                          </p>
                        </div>

                        {/* Contacts Action Buttons */}
                        <div className="space-y-3 pt-2">
                          
                          {/* Discuss on WhatsApp Connection */}
                          <button
                            onClick={() => {
                              pushConsoleLog("Redirecting securely to CIEM Team WhatsApp desk thread...", "success");
                              window.open("https://wa.me/919400432966?text=Hello%20Aptara%20Operations%20Team!%20I%20would%20like%20to%20discuss%20the%20Aptara%20Platform%20and%20climate%20remediation%20telemetry.", "_blank");
                            }}
                            className="w-full inline-flex items-center justify-between bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono text-xs font-bold uppercase py-2.5 px-3.5 rounded-xl border border-emerald-500/20 shadow-xs hover:shadow-sm cursor-pointer transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <PhoneCall className="w-3.5 h-3.5 text-white/95" />
                              <span>Discuss on WhatsApp</span>
                            </span>
                            <span className="text-[9px] bg-emerald-700/60 px-2 py-0.5 rounded font-mono font-bold">LIVE</span>
                          </button>

                          {/* Discuss over Secure Email Link */}
                          <button
                            onClick={() => {
                              pushConsoleLog("Opening secure local mail client targeting CIEM Headquarters...", "info");
                              window.open("mailto:johnmano633@gmail.com?subject=Aptara%20Platform%20Engineering%20Query&body=Hello%20Aptara%20Science%20%26%20Engineering%20Team,%0D%0A%0D%0AI%20am%20interested%20in%20discussing%20the%20operational%20telemetry%20of%2520the%2520remediation%252520mesh.%2520Please%2520let%2520me%2520know%2525252520how%2525252520we%2525252520can%2525252520collaborate.%0D%0A%0D%0ARegards,", "_self");
                            }}
                            className="w-full inline-flex items-center justify-between bg-white hover:bg-slate-105 text-slate-900 font-mono text-xs font-bold uppercase py-2.5 px-3.5 rounded-xl border border-slate-200 hover:border-slate-350 shadow-xs cursor-pointer transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-slate-600" />
                              <span>Send Email Inquiry</span>
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 font-bold">johnmano633</span>
                          </button>

                        </div>

                        <div className="pt-2 text-[8px] font-mono text-slate-500 border-t border-slate-800/80 flex items-center justify-between">
                          <span>RESPONSE TIME: &lt; 5MIN</span>
                          <span>STATION: CENTRAL DESK</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Safety Alert box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <span className="font-heading font-extrabold text-xs text-slate-900 block uppercase">Continuous Deployment</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium">
                          These discussion channels coordinate directly with the **CIEM Core Consortium**. Telemetries are logged securely. Standard encryption and network sync rules apply.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>


              {/* INTERACTIVE FORM MODAL BACKDROP (AnimatePresence) */}
              <AnimatePresence>
                {collabModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                      className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5"
                    >
                      <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h3 className="font-heading font-extrabold text-sm uppercase text-slate-900">
                            {collabModal === "research" && "Research Partnership Pathway"}
                            {collabModal === "investor" && "Strategic Investor Desk Linkage"}
                            {collabModal === "join" && "Consortium Personnel Registration"}
                            {collabModal === "tech" && "Hardware & Sensor Integration Synapse"}
                          </h3>
                        </div>
                        <button
                          onClick={() => setCollabModal(null)}
                          className="p-1 px-2 text-xs font-semibold text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-150 font-mono">
                        Securely transmitting metadata to CIEM Executive Office. Operated by CIEM Industries.
                      </p>

                      <form onSubmit={handleCollabSubmit} className="space-y-4 text-xs font-medium">
                        <div className="space-y-1">
                          <label className="text-slate-550 block font-mono">Your Professional Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. John Carter"
                            value={collabForm.name}
                            onChange={(e) => setCollabForm({...collabForm, name: e.target.value})}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-550 block font-mono">Organization / Firm</label>
                          <input
                            type="text"
                            placeholder="e.g. Institute of Planetary Sciences"
                            value={collabForm.organization}
                            onChange={(e) => setCollabForm({...collabForm, organization: e.target.value})}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-550 block font-mono">Secure Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. carter@institution.org"
                            value={collabForm.email}
                            onChange={(e) => setCollabForm({...collabForm, email: e.target.value})}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-550 block font-mono">Brief Synapse of Vision *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Outline target environmental sectors, funding matches, or sensor parameters..."
                            value={collabForm.notes}
                            onChange={(e) => setCollabForm({...collabForm, notes: e.target.value})}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setCollabModal(null)}
                            className="px-4 py-2 font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingCollab}
                            className="px-4 py-2 font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {submittingCollab ? "Synchronizing..." : "Submit Transaction"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          ) : (
            
            // OPERATING CENTER SANDBOX MODULAR SYSTEM (SIMULATIONS)
            <motion.div
              key="operations-command"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:p-5"
            >
              
              {/* Left Side: Modular Dashboard Controls */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                
                {/* Tab selections */}
                <div className="bg-slate-200/60 border border-slate-350/50 p-1.5 rounded-xl flex gap-1 shadow-xs">
                  <button
                    onClick={() => { setActiveTab("fusion"); pushConsoleLog("Switched primary module to: [SENSOR FUSION] monitoring", "info"); }}
                    className={`flex-1 py-2.5 rounded-lg font-heading text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "fusion"
                        ? "bg-white border border-slate-200 shadow-xs text-blue-600"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/40"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sensor Fusion</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("environment"); pushConsoleLog("Switched primary module to: [ENVIRONMENTAI CLIMATE] gauges", "info"); }}
                    className={`flex-1 py-2.5 rounded-lg font-heading text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "environment"
                        ? "bg-white border border-slate-200 shadow-xs text-blue-600"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/40"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Climate Monitor</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("sod"); pushConsoleLog("Switched primary module to: [SOD SHIELD] drone swarms", "info"); }}
                    className={`flex-1 py-1 px-1 rounded-lg font-heading text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "sod"
                        ? "bg-white border border-slate-200 shadow-xs text-blue-600"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/40"
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">SOD Deployments</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("disaster"); pushConsoleLog("Switched primary module to: [DISASTER TRIAGE] crisis indices", "info"); }}
                    className={`flex-1 py-2.5 rounded-lg font-heading text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                      activeTab === "disaster"
                        ? "bg-white border border-slate-200 shadow-xs text-blue-600"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/40"
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tactical Alerts</span>
                    {systemAlertsCount > 0 && activeTab !== "disaster" && (
                      <span className="absolute -top-0.5 -right-0.5 sm:top-1.5 sm:right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Core content rendering viewport */}
                <div className="flex-1 min-h-[460px] lg:min-h-[525px] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.18 }}
                      className="h-full"
                    >
                      {activeTab === "fusion" && (
                        <SectionSensorFusion 
                          onNotifyLog={pushConsoleLog} 
                          highlightedSector={highlightedSector}
                          onClearHighlight={() => setHighlightedSector(null)}
                        />
                      )}
                      {activeTab === "environment" && (
                        <SectionEnvironmental onNotifyLog={pushConsoleLog} />
                      )}
                      {activeTab === "sod" && (
                        <SectionInfrastructure onNotifyLog={pushConsoleLog} />
                      )}
                      {activeTab === "disaster" && (
                        <SectionDisasterManagement 
                          onNotifyLog={pushConsoleLog} 
                          onLocateOnMap={handleLocateOnMap}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Side: Aptara Cognitive Chat interface */}
              <div className="lg:col-span-4 h-[520px] lg:h-auto min-h-[460px]">
                <AptaraChat onTriggerSimulatedQuery={handleTriggerSimulatedQuery} />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Bottom diagnostic ticker log stream */}
      <footer className="bg-white border-t border-slate-200 p-2.5 px-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px] uppercase border-r border-slate-200 pr-4 flex-shrink-0">
          <Terminal className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>CIEM Ledger Sync:</span>
        </div>
        
        {/* Scrolling Log ticker */}
        <div className="flex-1 overflow-hidden h-5 relative">
          <AnimatePresence mode="popLayout">
            {consoleLogs.slice(0, 1).map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full flex items-center gap-2 text-[10px] font-mono whitespace-nowrap"
              >
                <span className="text-slate-400">[{log.time}]</span>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  log.type === "success" ? "bg-emerald-500" : log.type === "warning" ? "bg-red-500 animate-pulse" : "bg-blue-500"
                }`} />
                <span className={
                  log.type === "success" ? "text-emerald-700 font-semibold font-mono" : log.type === "warning" ? "text-red-700 font-semibold font-mono" : "text-slate-600 font-medium font-mono"
                }>
                  {log.msg}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[9px] font-mono text-slate-450 uppercase flex-shrink-0 pl-1">
          <span>OPERATED BY CIEM INDUSTRIES FOUNDED BY MANO MATHEN JOHN</span>
          <span className="text-emerald-600">STATE: ACTIVE</span>
          <span>SECURE_NODE_122</span>
        </div>
      </footer>

      {/* 4. IMMERSIVE BRAND PROFILE OVERLAY: CINEMATIC TRAGIC MODE */}
      <AnimatePresence>
        {showTragicProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] overflow-y-auto bg-slate-950/98 backdrop-blur-md text-white flex flex-col justify-between p-6 md:p-12"
          >
            {/* Background sweeping radar line \& slow ambient particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,#ef4444_0%,transparent_70%)] opacity-20" />
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/30 blur-xs animate-pulse" style={{ animationDuration: "6s" }} />
              
              {/* Floating Ash/Telemetry Embers */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-red-400"
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: -10, 
                    opacity: Math.random() * 0.7 + 0.3,
                    scale: Math.random() * 1.5 + 0.5
                  }}
                  animate={{ 
                    y: "110vh",
                    opacity: [0, 0.8, 0.8, 0],
                    x: `calc(${Math.random() * 100}% + ${Math.sin(i) * 40}px)`
                  }}
                  transition={{ 
                    duration: 8 + Math.random() * 10, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: Math.random() * 5
                  }}
                />
              ))}
            </div>

            {/* Top diagnostic header of tragedy overlay */}
            <div className="relative z-10 flex items-center justify-between border-b border-rose-950/40 pb-4">
              <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                <span className="w-2 h-2 rounded-full bg-red-505 animate-ping" />
                <span>CIEM Tactical Brand Archive • Secure Sync Mode</span>
              </div>
              
              <button
                onClick={() => {
                  setShowTragicProfile(false);
                  pushConsoleLog("Exited tragic profile overlay. Re-entering tactical platform HUD.", "info");
                }}
                className="p-2 px-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-red-950/60 hover:border-red-650 text-xs font-mono font-bold tracking-widest uppercase cursor-pointer transition-all duration-250 hover:text-red-200"
              >
                ✕ Close HUD
              </button>
            </div>

            {/* Core Immersive Content Area */}
            <div className="relative z-10 max-w-5xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10">
              {/* Left Side: Animated Corporate Logo \& Tagline (Tragic Symmetrical Layout) */}
              <div className="lg:col-span-6 flex flex-col items-center lg:items-start justify-center space-y-6 text-center lg:text-left">
                
                {/* CIEM industries lettermark with gold-white glow */}
                <div className="space-y-2 select-none">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="font-heading font-black text-6xl md:text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)] leading-none"
                  >
                    CIEM
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
                    className="font-sans font-extrabold text-[11px] text-slate-505 uppercase tracking-[0.3em] leading-none"
                  >
                    INDUSTRIES
                  </motion.p>
                </div>

                {/* Symmetrical dividing line representing tectonic boundary focus */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.1, delay: 0.4 }}
                  className="h-[1px] bg-gradient-to-r from-red-500/80 via-slate-700 to-transparent w-full"
                />

                {/* Highly dramatic manifesto delivery (Tragic profile) */}
                <div className="space-y-4 max-w-lg">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.6 }}
                    className="font-heading font-extrabold italic text-lg md:text-xl text-red-105 tracking-wide leading-relaxed"
                  >
                    &quot;driven by Engineers. designed for impact. made in India, for the world.&quot;
                  </motion.p>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.4, delay: 0.8 }}
                    className="text-xs text-slate-400 font-sans leading-relaxed"
                  >
                    A corporate directive focused on environmental stewardship, sovereign technology platforms, and severe climate crisis mitigation. Operating at the exact confluence of deep mechatronic engineering and sustainability.
                  </motion.p>
                </div>

                {/* Indian flag in large dramatic showcase */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="flex items-center gap-3 bg-slate-900/80 border border-slate-800/80 p-3.5 px-5 rounded-2xl"
                >
                  <IndianFlagSvg className="w-10 h-7 rounded-sm shadow-md" />
                  <div className="text-left font-mono">
                    <p className="text-[10px] font-bold text-white tracking-wider leading-none">REPUBLIC OF INDIA</p>
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">Sovereign High-Tech Origin</p>
                  </div>
                </motion.div>

              </div>

              {/* Right Side: DIAGNOSTIC WHO \& WHERE STATUS BOARD */}
              <div className="lg:col-span-6 space-y-6">
                
                <motion.div 
                  initial={{ x: 25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.5 }}
                  className="bg-slate-900/60 border border-slate-800/85 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
                  
                  <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                    <Terminal className="w-4 h-4 text-red-400" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      Telemetry Status Check: WHO &amp; WHERE
                    </h3>
                  </div>

                  {/* 1. Who is showing section */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#f87171] bg-red-950/20 border border-red-900/20 px-2 py-0.5 rounded">
                      [DIAGNOSTIC] WHO IS SHOWING?
                    </span>
                    
                    <div className="flex items-start gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                      {/* Premium Leader Emblem */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-950 p-0.5 border border-red-550/30 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                        <span className="text-red-400 font-mono text-sm font-black">MMJ</span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-100 font-heading">Founder: Mano Mathen John</p>
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                          Executive Director &amp; System Architect of CIEM Industries. Managing global threat monitoring parameters since inception.
                        </p>
                        <div className="pt-2 flex items-center gap-2 flex-wrap text-[8px] font-mono text-slate-500">
                          <span>Rank: EXECUTIVE ARCHITECT</span>
                          <span>•</span>
                          <span>ID: CIEM-001</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Where is it showing section */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/20 border border-emerald-900/20 px-2 py-0.5 rounded">
                      [DIAGNOSTIC] WHERE IS THIS SHOWING?
                    </span>
                    
                    <ul className="text-xs space-y-2">
                      <li className="flex items-center gap-3 bg-slate-950/30 p-2.5 rounded-lg border border-slate-850">
                        <span className="w-2 h-2 rounded-full bg-emerald-505" />
                        <div className="font-mono text-[10px]">
                          <span className="text-slate-350 font-bold block">01 / Tactical HUD Header</span>
                          <span className="text-slate-500">Tagline and glowing Ashoka Wheel rendering live on top banner.</span>
                        </div>
                      </li>
                      <li className="flex items-center gap-3 bg-slate-950/30 p-2.5 rounded-lg border border-slate-850">
                        <span className="w-2 h-2 rounded-full bg-emerald-505" />
                        <div className="font-mono text-[10px]">
                          <span className="text-slate-350 font-bold block">02 / Interactive Planet Banner</span>
                          <span className="text-slate-500">Aptara logo rotates beside the primary Indian Sovereign Seal.</span>
                        </div>
                      </li>
                      <li className="flex items-center gap-3 bg-slate-950/30 p-2.5 rounded-lg border border-slate-850">
                        <span className="w-2 h-2 rounded-full bg-emerald-505" />
                        <div className="font-mono text-[10px]">
                          <span className="text-slate-350 font-bold block">03 / Platform Mission Card</span>
                          <span className="text-slate-500">Founder biography, vision quote, and principle display on dashboard.</span>
                        </div>
                      </li>
                      <li className="flex items-center gap-3 bg-slate-950/30 p-2.5 rounded-lg border border-slate-850">
                        <span className="w-2 h-2 rounded-full bg-emerald-505" />
                        <div className="font-mono text-[10px]">
                          <span className="text-slate-350 font-bold block">04 / Sync Ledger Footer</span>
                          <span className="text-slate-500">Digital signature logged under continuous secure cryptographic write-handshake.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                </motion.div>

              </div>
            </div>

            {/* Bottom fine-print of tragedy viewport overlay */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between border-t border-rose-950/40 pt-4 text-[9px] font-mono text-slate-505">
              <span>DESIGNED AND CONFIGURED UNDER THE PERSONAL SANCTION OF EXECUTIVE SECTORS</span>
              <span className="text-red-400 mt-2 sm:mt-0">SECURE DISPATCH AUTHENTICATED • ACTIVE MONITORING</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

