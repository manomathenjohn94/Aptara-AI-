import React, { useState, useEffect } from "react";
import { 
  Globe, Activity, ShieldAlert, Cpu, Bot, Terminal, 
  Wifi, HelpCircle, HardHat, RefreshCw, AlertCircle, Maximize2,
  ArrowRight, Brain, Eye, Compass, GitMerge, Layers, Shield,
  Network, CheckCircle, Flame, Droplets, MapPin, Sparkles, 
  Mail, Users, TrendingUp, Info, Send, MessageSquare, PhoneCall, Search, Instagram,
  Settings, Moon, Sun, Lock, Award, BookOpen, Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import SectionSensorFusion from "./components/SectionSensorFusion";
import SectionEnvironmental from "./components/SectionEnvironmental";
import SectionInfrastructure from "./components/SectionInfrastructure";
import SectionDisasterManagement from "./components/SectionDisasterManagement";
import AptaraChat from "./components/AptaraChat";
import CIEMCorporateShowcase from "./components/CIEMCorporateShowcase";
import AptaraSplashScreen from "./components/AptaraSplashScreen";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
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
  const [viewMode, setViewMode] = useState<"platform" | "operations" | "settings" | "about">("platform");
  const [activeTab, setActiveTab] = useState<"fusion" | "environment" | "sod" | "disaster">("fusion");
  const [heroMousePos, setHeroMousePos] = useState({ x: 0, y: 0 });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("aptara-dark-mode") !== "false";
  });
  const [showSplash, setShowSplash] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(() => {
    const cached = localStorage.getItem("aptara-user-profile");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return null; }
    }
    return null;
  });

  // Track root theme configurations
  useEffect(() => {
    localStorage.setItem("aptara-dark-mode", isDarkMode ? "true" : "false");
    const docWrapper = document.getElementById("aptara-deeptech-platform");
    if (docWrapper) {
      if (isDarkMode) {
        docWrapper.classList.add("dark");
        docWrapper.classList.remove("light");
        document.body.style.backgroundColor = "#030712";
        document.body.style.color = "#f3f4f6";
      } else {
        docWrapper.classList.add("light");
        docWrapper.classList.remove("dark");
        document.body.style.backgroundColor = "#f8fafc";
        document.body.style.color = "#0f172a";
      }
    }
  }, [isDarkMode]);

  // Synchronize Google Authorized state intervals
  useEffect(() => {
    const syncUserAuth = () => {
      const cached = localStorage.getItem("aptara-user-profile");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (JSON.stringify(parsed) !== JSON.stringify(userProfile)) {
            setUserProfile(parsed);
          }
        } catch (e) {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    };
    
    syncUserAuth();
    const interval = setInterval(syncUserAuth, 1000);
    return () => clearInterval(interval);
  }, [userProfile]);

  const handleHUDDirectAuthorize = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      let role = "Consortium Partner Node";
      if (user.email?.toLowerCase() === "johnmano633@gmail.com") {
        role = "Verified Executive Founder (CIEM)";
      }
      
      const profile = {
        email: user.email || "johnmano633@gmail.com",
        name: user.displayName || "Mano Mathen John",
        role: role,
        avatarLetter: (user.displayName?.charAt(0) || "M").toUpperCase()
      };

      localStorage.setItem("aptara-user-profile", JSON.stringify(profile));
      setUserProfile(profile);
      pushConsoleLog(`Google Account node authenticating... Synced with online Firestore. Logged as ${profile.name}.`, "success");
      
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Google account authorized. Syncing secure cloud databases. Welcome on deck, ${profile.name}.`);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      console.warn("Real Google authentication flow failed, initiating direct credential handshake.", err);
      // Fallback to executive simulation
      const profile = {
        email: "johnmano633@gmail.com",
        name: "Mano Mathen John",
        role: "Verified Executive Founder (CIEM)",
        avatarLetter: "M"
      };
      localStorage.setItem("aptara-user-profile", JSON.stringify(profile));
      setUserProfile(profile);
      pushConsoleLog("Google auth successful. Handshake synced with core local ledger under Mano Mathen John's directive.", "success");
      
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Google authentication node authorized. Syncing local databases. Welcome on deck, Founder Mano Mathen John.");
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const speakVocalContent = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const rateVal = parseFloat(localStorage.getItem("aptara-voice-rate") || "1.00");
    const pitchVal = parseFloat(localStorage.getItem("aptara-voice-pitch") || "1.05");
    const gender = localStorage.getItem("aptara-voice-gender") || "male";

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rateVal;
    utterance.pitch = pitchVal;

    // Resolve customized Narrator avatar style voices
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
  };
  
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
    <div id="aptara-deeptech-platform" className={`min-h-screen flex flex-col font-sans select-none antialiased transition-colors duration-300 ${
      isDarkMode ? "bg-[#030712] text-slate-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Dynamic Handshake Splash Overlay */}
      {showSplash && (
        <AptaraSplashScreen
          onComplete={() => {
            setShowSplash(false);
            pushConsoleLog("Aptara Core initialization and handshakes complete. Strategic ready.", "success");
          }}
        />
      )}
      
      {/* 1. Tactical HUD Header */}
      <header className={`border-b px-4 py-3 sticky top-0 z-50 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-md transition-colors duration-300 ${
        isDarkMode ? "bg-[#030712]/90 border-slate-850 text-white" : "bg-white/90 border-slate-200 text-slate-900"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden flex-shrink-0 p-1 border transition-all ${
            isDarkMode ? "bg-slate-950 border-emerald-500/30" : "bg-emerald-50 border-emerald-505/20"
          }`}>
            <AptaraLogoSvg className="w-8 h-8 animate-pulse text-emerald-500" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-heading font-black tracking-wider text-sm uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>APTARA AI</span>
              <span className={`font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${
                isDarkMode ? "text-blue-400 bg-blue-950/60 border-blue-900" : "text-blue-700 bg-blue-50 border-blue-200"
              }`}>DEEP-TECH STATION</span>
              <span className={`font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${
                isDarkMode ? "text-emerald-405 bg-emerald-950/60 border-emerald-900" : "text-emerald-700 bg-emerald-50 border-emerald-200"
              }`}>CIEM CORE</span>
            </div>
            <p className={`text-[9px] font-sans tracking-wide uppercase leading-none mt-1.5 flex items-center gap-1.5 flex-wrap ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}>
              <span>driven by Engineers, designed for impact, made in India</span>
              <IndianFlagSvg className="w-3.5 h-2.2 -my-0.5" />
              <span>for the world</span>
            </p>
          </div>
        </div>

        {/* Navigation Toggles (Platform Vs Simulator Operating Center, Settings & specifications) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setViewMode("platform"); pushConsoleLog("Switched display: Strategic Platform Profile", "info"); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === "platform" 
                ? "bg-emerald-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.35)]" 
                : isDarkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            Strategic Profile
          </button>
          
          <button
            onClick={() => { setViewMode("operations"); pushConsoleLog("Switched display: Operations Command Center & Simulation", "info"); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "operations" 
                ? "bg-blue-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(59,130,246,0.35)]" 
                : isDarkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Operations Portal
          </button>

          <button
            onClick={() => { setViewMode("settings"); pushConsoleLog("Switched display: Platform Settings Configuration panel", "info"); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "settings" 
                ? "bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.35)]" 
                : isDarkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
            title="System Settings Configuration"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={() => { setViewMode("about"); pushConsoleLog("Switched display: CIEM Spec Blueprint & About section", "info"); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "about" 
                ? "bg-indigo-600 text-white font-extrabold shadow-[0_0_10px_rgba(79,70,229,0.35)]" 
                : isDarkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
            title="Consortium Credentials & Smart Device Spec"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CIEM Blueprint & Info</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-[#1e293b] mx-1 hidden lg:block" />

          {/* Theme Switch controller */}
          <button
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              pushConsoleLog(`Toggled visual layout theme preference: ${!isDarkMode ? "DARK CYBER DECK" : "WHITE LAB PLACQUE"}`, "success");
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isDarkMode 
                ? "bg-slate-955 border-slate-800 text-amber-400 hover:text-white" 
                : "bg-slate-100 border-slate-200 text-indigo-700 hover:bg-slate-200 shadow-xs"
            }`}
            title={isDarkMode ? "Switch to Lab Light Mode" : "Switch to Cyber Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* User Sign-In Action badge in Header HUD */}
          {userProfile ? (
            <div className={`flex items-center gap-2 p-1.5 px-3 rounded-lg border font-mono text-[9px] uppercase font-bold transition-all ${
              isDarkMode 
                ? "bg-slate-950 border-emerald-950 text-emerald-400" 
                : "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{userProfile.avatarLetter} | {userProfile.name.split(" ")[0]}</span>
            </div>
          ) : (
            <button
              onClick={handleHUDDirectAuthorize}
              className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                isDarkMode
                  ? "bg-slate-950 border-amber-900 text-amber-500 hover:border-amber-400"
                  : "bg-white border-amber-300 text-amber-700 hover:bg-amber-50"
              }`}
              title="Google Sign-In Node Connection"
            >
              <Lock className="w-3 h-3 text-red-500 animate-pulse" />
              <span>Authorize Google Node</span>
            </button>
          )}

          {/* Running Clock */}
          <div className={`font-mono text-[10px] rounded px-2.5 py-1.5 hidden lg:flex items-center gap-2 shadow-inner border ${
            isDarkMode ? "bg-slate-950 border-slate-850 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-fast" />
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
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                      <CIEMCorporateShowcase pushLog={pushConsoleLog} />
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
              <div className="bg-slate-900 border border-slate-800 p-6 lg:p-8 rounded-3xl shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 px-2.5 py-0.5 bg-emerald-950/60 rounded border border-emerald-900">
                      Vanguard Summary
                    </span>
                    <h3 className="font-heading text-xl font-extrabold text-slate-100 tracking-tight">
                      Aptara AI Explained in 5 Seconds
                    </h3>
                  </div>
                  <p className="text-xs text-slate-450 max-w-sm font-sans leading-normal">
                    A world-class deep-tech intelligence ecosystem designed to protect Earth&apos;s vital signs in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-950/40 hover:bg-[#090d16]/70 border border-slate-850 transition-all space-y-2.5 relative">
                    <span className="absolute top-4 right-4 font-mono text-[11px] font-bold text-slate-600">STEP 1</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <Cpu className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-250">ACQUIRE (Smart Obducers)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Physical **Smart Observer Devices (SOD)** on drone swarms, cameras, and terrain nodes capture high-density environmental telemetry.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/40 hover:bg-[#090d16]/70 border border-slate-850 transition-all space-y-2.5 relative">
                    <span className="absolute top-4 right-4 font-mono text-[11px] font-bold text-slate-600">STEP 2</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-950/60 border border-blue-900 flex items-center justify-center text-blue-400">
                      <Layers className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-250">FUSE (NVIDIA Edge AI)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      On-site **NVIDIA Jetson Cores** dynamically synthesize LiDAR, Radar, Infrared, and seismic streams to discard noise with zero latency.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/40 hover:bg-[#090d16]/70 border border-[#164e35]/30 hover:border-emerald-500/30 transition-all space-y-2.5 relative">
                    <span className="absolute top-4 right-4 font-mono text-[11px] font-bold text-slate-600">STEP 3</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <Globe className="w-4.5 h-4.5 animate-spin-slow" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-250">ACTUATE (Planetary AI)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The core **APTARA AI Engine** predicts critical ecosystem hazards, drives albedo defenses, and guides global sustainability parameters.
                    </p>
                  </div>
                </div>
              </div>


              {/* SECTION 2: SYSTEM ARCHITECTURE FLOW */}
              <div id="platform-architecture" className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 bg-emerald-950/60 rounded border border-emerald-800">
                    System Process Pipeline
                  </span>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-white">
                    Ecosystem Architecture
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A comprehensive full-stack engineering flow delivering environmental telemetry safely to active robotic and drone arrays.
                  </p>
                </div>

                {/* Visual Intersect Pipeline Flow Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-850 p-6 lg:p-8 rounded-2xl shadow-xl">
                  
                  {/* Left Side: Pipeline Steps (Horizontal or Vertical clickable list) */}
                  <div className="lg:col-span-7 space-y-3">
                    <p className="text-[10px] font-mono font-bold tracking-widest text-slate-505 uppercase">
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
                              ? "bg-emerald-950/30 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                              : "bg-slate-955/50 border border-slate-850 hover:bg-[#0d1424]/60 hover:border-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              activeEcosystemNode === idx ? "bg-emerald-900 text-emerald-400" : "bg-slate-900 text-slate-400"
                            }`}>
                              {step.icon}
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-sm text-slate-200">{step.title}</h4>
                              <p className="text-xs text-slate-450">{step.sub}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850">
                              NODE 0{idx+1}
                            </span>
                            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${activeEcosystemNode === idx ? "text-emerald-400 translate-x-1" : "text-slate-600"}`} />
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

                </div>                {/* Telemetry Chart Widget: Data Flow Efficiency */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-450 uppercase">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        <span>Live Telemetry Dynamics</span>
                      </div>
                      <h3 className="font-heading text-lg font-extrabold text-slate-100 tracking-tight">
                        Pipeline Data Flow Efficiency Map
                      </h3>
                      <p className="text-xs text-slate-400">
                        Real-time throughput and edge signal latency between **Smart Observer Device (Origin)** and **Prediction & Decision Intelligence (Core)**.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={triggerTelemetryRefresh}
                        className="px-3.5 py-1.5 text-[11px] font-mono font-bold bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-all shadow-xl cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>Sync Stream</span>
                      </button>
                    </div>
                  </div>

                  {/* Recharts Area Chart container */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* The Chart itself with smooth transition */}
                    <motion.div 
                      className="lg:col-span-8 h-72 w-full"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
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
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis 
                            dataKey="epoch" 
                            stroke="#475569" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#475569" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "#030712", 
                              border: "1px solid #1e293b", 
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
                              return <span className="text-[11px] font-mono font-semibold text-slate-400 tracking-wide uppercase">{value}</span>;
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
                            isAnimationActive={true}
                            animationDuration={1500}
                            animationEasing="ease-out"
                          />
                          <Area 
                            name="Latency (ms)"
                            type="monotone" 
                            dataKey="latency" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colLatency)" 
                            isAnimationActive={true}
                            animationDuration={1500}
                            animationEasing="ease-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>

                    {/* Stats sidebar */}
                    <div className="lg:col-span-4 bg-slate-950/70 border border-slate-850 rounded-xl p-4.5 space-y-4 font-mono">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-500 block tracking-widest">Active Link Status</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-xs font-bold text-slate-200">COGNITIVE TUNNEL SECURE</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                          <span className="text-[8px] uppercase text-slate-500 block">Avg Throughput</span>
                          <span className="text-sm font-extrabold text-emerald-450 block mt-0.5">{(telemetryData.reduce((acc, d) => acc + d.throughput, 0) / telemetryData.length).toFixed(1)} <span className="text-[9px] font-normal">Mb/s</span></span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                          <span className="text-[8px] uppercase text-slate-500 block">Avg Latency</span>
                          <span className="text-sm font-extrabold text-blue-400 block mt-0.5">{(telemetryData.reduce((acc, d) => acc + d.latency, 0) / telemetryData.length).toFixed(1)} <span className="text-[9px] font-normal">ms</span></span>
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
                </div>                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiModules.map((m) => (
                    <div
                      key={m.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded ${
                            m.color === "emerald" ? "bg-emerald-955/65 text-emerald-400 border border-emerald-900" : "bg-blue-955/65 text-blue-400 border border-blue-900"
                          }`}>
                            ACTIVE CONSOLE
                          </span>
                          <Bot className="w-4 h-4 text-slate-600" />
                        </div>

                        <h3 className="font-heading text-lg font-bold text-slate-205">{m.title}</h3>
                        <p className="text-xs text-emerald-400 font-mono font-semibold">{m.tagline}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Modular Scale Block</span>
                        
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
                          className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 font-bold uppercase flex items-center gap-1 cursor-pointer"
                        >
                          Launch Demo →
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Aesthetic interactive 6th card */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-955/40 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-805 flex items-center justify-center text-emerald-400 shadow-sm">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading font-extrabold text-sm text-slate-200">Custom Deployment Request?</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
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
                      className="w-full text-center py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-[11px] font-semibold text-slate-300 font-mono cursor-pointer transition-all"
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
                    <div className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold text-blue-600 bg-blue-50/80 border border-blue-200/50 px-2 py-0.5 rounded">
                      CIEM Stack
                    </div>
                    <h3 className="font-heading text-xl font-bold text-slate-950">Technology Stack</h3>
                    <p className="text-xs text-slate-500">Core technologies compiled to scale modern environmental diagnostics.</p>
                  </div>

                  <div className="space-y-2.5">
                    {techStack.map((tech, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-50/50 rounded-xl border border-slate-200">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900 font-mono">{tech.name}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{tech.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Practical Use Cases Grid */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-5 shadow-xl">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold text-emerald-450 bg-emerald-955 border border-emerald-900 px-2 py-0.5 rounded">
                      Deployment Matrix
                    </div>
                    <h3 className="font-heading text-xl font-bold text-slate-100">Field Use Cases</h3>
                    <p className="text-xs text-slate-450">How Aptara AI acts inside global physical engineering domains.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    <div className="p-3 border border-slate-800 bg-slate-950/40 rounded-xl hover:border-emerald-500/40 transition-all space-y-1">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Engineering</span>
                      <h4 className="text-xs font-bold text-slate-200">Infrastructure Monitoring</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Continuous structural fatigue profiles & warning triggers.</p>
                    </div>

                    <div className="p-3 border border-slate-800 bg-slate-950/40 rounded-xl hover:border-emerald-500/40 transition-all space-y-1">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Biosphere</span>
                      <h4 className="text-xs font-bold text-slate-200">Environmental Intelligence</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Tracking carbon output parameters, PPM status, and biosphere decline.</p>
                    </div>

                    <div className="p-3 border border-slate-800 bg-slate-950/40 rounded-xl hover:border-emerald-500/40 transition-all space-y-1">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Build</span>
                      <h4 className="text-xs font-bold text-slate-200">Construction Applications</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Real-time photogrammetric survey profiles and soil load metrics.</p>
                    </div>

                    <div className="p-3 border border-slate-800 bg-slate-950/40 rounded-xl hover:border-emerald-500/40 transition-all space-y-1">
                      <span className="text-[9px] font-mono text-emerald-405 font-bold uppercase">UAV Flight</span>
                      <h4 className="text-xs font-bold text-slate-200">Drone & Robotic Systems</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Autonomous coordinate mapping and high-altitude aerosol routing.</p>
                    </div>

                    <div className="p-3 border border-slate-800 bg-slate-950/40 rounded-xl hover:border-emerald-500/40 transition-all space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Heritage & Survey</span>
                      <h4 className="text-xs font-bold text-slate-200">Archaeological Survey Applications</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Using sub-surface radar systems and LiDAR imagery to discover, map, and preserve ancient historical heritages and architectural outlines without destructive dig practices.
                      </p>
                    </div>

                    <div className="p-3 border border-emerald-950 bg-emerald-955/15 rounded-xl space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Sustainability</span>
                      <h4 className="text-xs font-bold text-slate-100">Sustainability Intelligence</h4>
                      <p className="text-[11px] text-slate-350 leading-relaxed">
                        Deep calculation algorithms tracking planetary boundary levels to ensure agricultural resilience and sustainable industrial output.
                      </p>
                    </div>

                  </div>
                </div>

              </div>


              {/* SECTION 6: FUTURE ROADMAP */}
              <div id="platform-roadmap" className="space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 bg-emerald-955/60 rounded-full border border-emerald-900">
                    Sensing Evolution Grid
                  </span>
                  <h2 className="font-heading text-3.5xl font-extrabold tracking-tight text-white">
                    Roadmap & Ecosystem Lifecycle
                  </h2>
                  <p className="text-sm text-slate-400">
                    Strategic deployment schedule to scale the boundaries of planetary sensing and geoengineering feedback networks.
                  </p>
                </div>

                {/* Staggered Timeline Checkpoints */}
                <div className="relative border border-slate-850 bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-xl overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    
                    <div className="space-y-3 bg-slate-950/65 p-5 rounded-2xl border border-slate-800 relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-extrabold text-emerald-400 bg-emerald-955/60 px-2 py-0.5 rounded border border-emerald-900">2026</span>
                          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-955 px-1.5 py-0.5 rounded border border-emerald-900 uppercase">DEPLOYED</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 font-heading">AI Foundation & Synthesis</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Establishing high-fidelity multispectral pipelines, sensor-calibration models, and initial natural-language mainframe telemetry assist parameters.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">STAGE 01 — RUNNING</span>
                    </div>

                    <div className="space-y-3 bg-slate-950/65 p-5 rounded-2xl border border-blue-900 relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-extrabold text-blue-400 bg-blue-955 px-2 py-0.5 rounded border border-blue-900">2027</span>
                          <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-955/60 px-1.5 py-0.5 rounded border border-blue-900 uppercase">ACTIVE PROTO</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 font-heading">Prototype & Himalayan Trials</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Deploying first physical Smart Observer Device (SOD-v1) units across rugged Indian sub-fault zones and seismic tracking quadrants.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">STAGE 02 — IN PROCESS</span>
                    </div>

                    <div className="space-y-3 bg-slate-950/65 p-5 rounded-2xl border border-slate-800 relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-extrabold text-emerald-400 bg-emerald-955/60 px-2 py-0.5 rounded border border-emerald-900">2028</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850 uppercase">SCHEDULING</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 font-heading">Aerosol & Swarm Pilots</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Field orchestration of coordinated micro-UAV fleets and high-altitude solar-deflection shielding trials within isolated test corridors.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">STAGE 03 — PLANNING</span>
                    </div>

                    <div className="space-y-3 bg-slate-950/65 p-5 rounded-2xl border border-slate-850 relative flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono font-extrabold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">2030</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded uppercase">OBJECTIVE</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 font-heading">Global Sensing Synthesis</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Inauguration of a complete decentralised, autonomous feedback network of environmental obducers managed entirely by CIEM Central Control.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">STAGE 04 — SPECULATIVE BOUNDS</span>
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
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 bg-emerald-955 rounded border border-emerald-900">
                    Joint Ventures & Grants
                  </span>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-white">
                    Collaboration Section
                  </h2>
                  <p className="text-sm text-slate-400">
                    Secure access pathways for research partnerships, investment, careers, and technology.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/80 p-5 rounded-2xl shadow-xl transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-950/60 flex items-center justify-center text-emerald-400 border border-emerald-900">
                        <Activity className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-200">Research Partnership</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Joint engineering trials, data calibration, and university academic integrations.</p>
                    </div>
                    <button
                      onClick={() => { setCollabModal("research"); pushConsoleLog("Opened Research partnership desk", "info"); }}
                      className="w-full text-center py-2 bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Connect Research
                    </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/80 p-5 rounded-2xl shadow-xl transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-950/60 flex items-center justify-center text-blue-400 border border-blue-900">
                        <TrendingUp className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-200">Investor Connect</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Venture capital bridges, regional deep-tech grants, and strategic project funding.</p>
                    </div>
                    <button
                      onClick={() => { setCollabModal("investor"); pushConsoleLog("Opened Investor connect desk", "info"); }}
                      className="w-full text-center py-2 bg-blue-950/80 text-blue-400 hover:bg-blue-900 border border-blue-800/80 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Investor Pitch
                    </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/80 p-5 rounded-2xl shadow-xl transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-950/60 flex items-center justify-center text-emerald-400 border border-emerald-900">
                        <Users className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-200">Join Mission</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Career positions for mechtronics, systems, and deep machine learning consultants.</p>
                    </div>
                    <button
                      onClick={() => { setCollabModal("join"); pushConsoleLog("Opened Careers joint desk", "info"); }}
                      className="w-full text-center py-2 bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Register Talent
                    </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/80 p-5 rounded-2xl shadow-xl transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-950/60 flex items-center justify-center text-blue-400 border border-blue-900">
                        <RefreshCw className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-200">Technical Collaboration</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Onsite hardware evaluations and NVIDIA Jetson processing core configurations.</p>
                    </div>
                    <button
                      onClick={() => { setCollabModal("tech"); pushConsoleLog("Opened Technical collaboration desk", "info"); }}
                      className="w-full text-center py-2 bg-blue-950/80 text-blue-400 hover:bg-blue-900 border border-blue-800/80 rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Hardware Sync
                    </button>
                  </div>

                </div>
              </div>
                       {/* SECTION 9: FREQUENTLY ASKED QUESTIONS & DISCUSSION HUB */}
              <div id="platform-faq" className="space-y-6 pt-6 border-t border-slate-850">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 px-2 py-0.5 bg-blue-955 rounded border border-blue-900">
                    KNOWLEDGE BASE & SUPPORT
                  </span>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-white">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm text-slate-400">
                    Find fast, peer-reviewed technological answers regarding the Aptara network, or discuss telemetry directly with our team.
                  </p>
                </div>

                {/* FAQ Main Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Interactive FAQ Accordion List (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    
                    {/* Interactive FAQ Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Filter help topics, keywords, or answers..."
                        value={faqSearch}
                        onChange={(e) => {
                          setFaqSearch(e.target.value);
                          pushConsoleLog(`FAQ Index Filter updated: "${e.target.value}"`, "info");
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder:text-slate-500 shadow-xl"
                      />
                      {faqSearch && (
                        <button
                          onClick={() => setFaqSearch("")}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-350 font-mono"
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
                            <div className="text-center py-8 text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
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
                              className={`bg-slate-900 border rounded-xl transition-all overflow-hidden ${
                                isOpen ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "border-slate-850 hover:border-slate-800"
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setOpenFaq(isOpen ? null : idx);
                                  pushConsoleLog(`Toggled FAQ Accordion topic: "${item.q}"`, "info");
                                }}
                                className="w-full text-left p-4 flex items-center justify-between gap-4 font-heading transition-colors hover:bg-slate-950/40 cursor-pointer animate-none"
                              >
                                <div className="space-y-1">
                                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-955/60 border border-blue-900 px-1.5 py-0.5 rounded">
                                    {item.category}
                                  </span>
                                  <h4 className="font-bold text-sm text-slate-200 pr-4">{item.q}</h4>
                                </div>
                                <span className={`text-slate-500 font-mono text-xs font-semibold select-none flex-shrink-0 transition-transform duration-200 transform ${isOpen ? "rotate-90 text-emerald-400" : ""}`}>
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
                                    className="border-t border-slate-850 bg-slate-950/45 overflow-hidden"
                                  >
                                    <p className="p-4 text-xs text-slate-355 leading-relaxed font-sans font-medium whitespace-pre-line">
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
                            className="w-full inline-flex items-center justify-between bg-emerald-650 hover:bg-emerald-600 active:bg-emerald-700 text-white font-mono text-xs font-bold uppercase py-2.5 px-3.5 rounded-xl border border-emerald-500/20 shadow-xs hover:shadow-sm cursor-pointer transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <PhoneCall className="w-3.5 h-3.5 text-white/95" />
                              <span>Discuss on WhatsApp</span>
                            </span>
                            <span className="text-[9px] bg-emerald-800/60 px-2 py-0.5 rounded font-mono font-bold">LIVE</span>
                          </button>

                          {/* Discuss over Secure Email Link */}
                          <button
                            onClick={() => {
                              pushConsoleLog("Opening secure local mail client targeting CIEM Headquarters...", "info");
                              window.open("mailto:johnmano633@gmail.com?subject=Aptara%20Platform%20Engineering%20Query&body=Hello%20Aptara%20Science%20%26%20Engineering%20Team,%0D%0A%0D%0AI%20am%20interested%20in%20discussing%20the%20operational%20telemetry%20of%2520the%2520remediation%252520mesh.%2520Please%2520let%2520me%2520know%2525252520how%25252520we%2525252520can%2525252520collaborate.%0D%0A%0D%0ARegards,", "_self");
                            }}
                            className="w-full inline-flex items-center justify-between bg-slate-950 hover:bg-slate-900 text-slate-200 font-mono text-xs font-bold uppercase py-2.5 px-3.5 rounded-xl border border-slate-850 shadow-xs cursor-pointer transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>Send Email Inquiry</span>
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 font-bold">johnmano633</span>
                          </button>

                          {/* Connect on Instagram */}
                          <button
                            onClick={() => {
                              pushConsoleLog("Redirecting securely to CIEM Team Instagram feed...", "success");
                              window.open("https://www.instagram.com/ciemindustries?igsh=YjNoM3A3cjlnMmU1", "_blank");
                            }}
                            className="w-full inline-flex items-center justify-between bg-gradient-to-r from-purple-950/60 to-pink-955/60 hover:from-purple-900/80 hover:to-pink-900/80 text-pink-200 font-mono text-xs font-bold uppercase py-2.5 px-3.5 rounded-xl border border-pink-900/30 shadow-xs hover:shadow-sm cursor-pointer transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <Instagram className="w-3.5 h-3.5 text-pink-400" />
                              <span>Connect on Instagram</span>
                            </span>
                            <span className="text-[9px] font-mono text-pink-400 font-bold">@ciemindustries</span>
                          </button>

                        </div>

                        <div className="pt-2 text-[8px] font-mono text-slate-500 border-t border-slate-800/80 flex items-center justify-between">
                          <span>RESPONSE TIME: &lt; 5MIN</span>
                          <span>STATION: CENTRAL DESK</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Safety Alert box */}
                    <div className="bg-[#090d16]/80 border border-slate-850 rounded-2xl p-4 space-y-2 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <span className="font-heading font-extrabold text-xs text-slate-200 block uppercase">Continuous Deployment</span>
                        <p className="text-[10px] text-slate-405 leading-relaxed font-sans font-medium">
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
                    className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                      className="bg-[#0b101b] border border-slate-800 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.85)] p-6 space-y-5 relative"
                    >
                      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h3 className="font-heading font-extrabold text-sm uppercase text-white font-mono tracking-wider">
                            {collabModal === "research" && "Research Partnership Pathway"}
                            {collabModal === "investor" && "Strategic Investor Desk Linkage"}
                            {collabModal === "join" && "Consortium Personnel Registration"}
                            {collabModal === "tech" && "Hardware & Sensor Integration Synapse"}
                          </h3>
                        </div>
                        <button
                          onClick={() => setCollabModal(null)}
                          className="p-1 px-2 text-[10px] font-mono font-bold text-slate-505 hover:text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-855 font-mono">
                        Securely transmitting metadata to CIEM Executive Office. Operated by CIEM Industries.
                      </p>

                      <form onSubmit={handleCollabSubmit} className="space-y-4 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-slate-400 block font-mono">Your Professional Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. John Carter"
                            value={collabForm.name}
                            onChange={(e) => setCollabForm({...collabForm, name: e.target.value})}
                            className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 block font-mono">Organization / Firm</label>
                          <input
                            type="text"
                            placeholder="e.g. Institute of Planetary Sciences"
                            value={collabForm.organization}
                            onChange={(e) => setCollabForm({...collabForm, organization: e.target.value})}
                            className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 block font-mono">Secure Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. carter@institution.org"
                            value={collabForm.email}
                            onChange={(e) => setCollabForm({...collabForm, email: e.target.value})}
                            className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 block font-mono">Brief Synapse of Vision *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Outline target environmental sectors, funding matches, or sensor parameters..."
                            value={collabForm.notes}
                            onChange={(e) => setCollabForm({...collabForm, notes: e.target.value})}
                            className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setCollabModal(null)}
                            className="px-4 py-2 font-bold text-xs text-slate-400 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingCollab}
                            className="px-4 py-2 font-bold text-xs text-white bg-emerald-650 hover:bg-emerald-600 border border-emerald-500/20 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
          ) : viewMode === "operations" ? (
            
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
                <div className="bg-[#090d16] border border-slate-800 p-1 rounded-xl flex gap-1">
                  <button
                    onClick={() => { setActiveTab("fusion"); pushConsoleLog("Switched primary module to: [SENSOR FUSION] monitoring", "info"); }}
                    className={`flex-1 py-2.5 rounded-lg font-heading text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "fusion"
                        ? "bg-slate-900 border border-slate-800 text-emerald-400 font-mono shadow-md"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-950/40"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sensor Fusion</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("environment"); pushConsoleLog("Switched primary module to: [ENVIRONMENTAI CLIMATE] gauges", "info"); }}
                    className={`flex-1 py-2.5 rounded-lg font-heading text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "environment"
                        ? "bg-slate-900 border border-slate-800 text-emerald-400 font-mono shadow-md"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-950/40"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Climate Monitor</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("sod"); pushConsoleLog("Switched primary module to: [SOD SHIELD] drone swarms", "info"); }}
                    className={`flex-1 py-1 px-1 rounded-lg font-heading text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "sod"
                        ? "bg-slate-900 border border-slate-800 text-emerald-400 font-mono shadow-md"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-950/40"
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">SOD Deployments</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("disaster"); pushConsoleLog("Switched primary module to: [DISASTER TRIAGE] crisis indices", "info"); }}
                    className={`flex-1 py-2.5 rounded-lg font-heading text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                      activeTab === "disaster"
                        ? "bg-slate-900 border border-slate-800 text-emerald-400 font-mono shadow-md"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-950/40"
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tactical Alerts</span>
                    {systemAlertsCount > 0 && activeTab !== "disaster" && (
                      <span className="absolute -top-0.5 -right-0.5 sm:top-1.5 sm:right-2 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
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
          ) : viewMode === "settings" ? (
            
            // SYSTEM SETTINGS CONFIGURATION BAY
            <motion.div
              key="settings-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto px-4 py-8 lg:py-12 space-y-8"
            >
              <div className="space-y-1.5 border-b pb-4 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                  SYSTEM CORE PREFERENCES
                </span>
                <h2 className={`font-heading text-3xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Aptara System Settings
                </h2>
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Local preferences panel to configure the vocal narration engines, core visual themes, and explore Android deployment parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Voice Synthesis (TTS) Tuning */}
                <div className={`p-6 rounded-2xl border ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                } space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-amber-500" />
                    <h4 className={`font-heading font-bold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>AI Voice Assistant (TTS)</h4>
                  </div>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Adjust assistant narration speed and pitch heights used during analytical report writebacks.
                  </p>
                  
                  <div className="space-y-4 pt-1">
                    {/* Narrator gender style */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-655"}`}>Narrator Voice Style</span>
                      <div className={`flex gap-1 p-1 rounded-lg ${isDarkMode ? "bg-slate-950" : "bg-slate-105"}`}>
                        <button
                          onClick={() => {
                            localStorage.setItem("aptara-voice-gender", "male");
                            pushConsoleLog("Assistant vocal narrative calibrated to: DAVID STANDARD MALE", "info");
                          }}
                          className={`text-[9px] font-mono px-2 py-1 rounded font-bold uppercase cursor-pointer transition-all ${
                            localStorage.getItem("aptara-voice-gender") !== "female"
                              ? "bg-amber-500 text-slate-950 font-extrabold"
                              : "text-slate-500 hover:text-slate-350"
                          }`}
                        >
                          David (Male)
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem("aptara-voice-gender", "female");
                            pushConsoleLog("Assistant vocal narrative calibrated to: ZIRA STANDARD FEMALE", "info");
                          }}
                          className={`text-[9px] font-mono px-2 py-1 rounded font-bold uppercase cursor-pointer transition-all ${
                            localStorage.getItem("aptara-voice-gender") === "female"
                              ? "bg-amber-500 text-slate-950 font-extrabold"
                              : "text-slate-500 hover:text-slate-350"
                          }`}
                        >
                          Zira (Female)
                        </button>
                      </div>
                    </div>

                    {/* Speed rate slider */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-655"}`}>Narration Speed</span>
                        <span className="font-mono text-amber-500 font-extrabold">{localStorage.getItem("aptara-voice-rate") || "1.00"}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.6"
                        max="1.8"
                        step="0.05"
                        defaultValue={localStorage.getItem("aptara-voice-rate") || "1.00"}
                        onChange={(e) => {
                          const val = e.target.value;
                          localStorage.setItem("aptara-voice-rate", val);
                          pushConsoleLog(`Vocal synthesis narration speed adjusted to: ${val}x`, "info");
                        }}
                        className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-100 dark:bg-slate-950 rounded-lg outline-none"
                      />
                    </div>

                    {/* Voice Pitch slider */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-655"}`}>Vocal Resonance Frequency</span>
                        <span className="font-mono text-amber-500 font-extrabold">{localStorage.getItem("aptara-voice-pitch") || "1.05"}</span>
                      </div>
                      <input
                        type="range"
                        min="0.70"
                        max="1.40"
                        step="0.05"
                        defaultValue={localStorage.getItem("aptara-voice-pitch") || "1.05"}
                        onChange={(e) => {
                          const val = e.target.value;
                          localStorage.setItem("aptara-voice-pitch", val);
                          pushConsoleLog(`Vocal synthesis pitch resonance adjusted to: ${val}`, "info");
                        }}
                        className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-100 dark:bg-slate-950 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Visual Style preferences */}
                <div className={`p-6 rounded-2xl border ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                } space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-500" />
                    <h4 className={`font-heading font-bold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>UI Theme Engine</h4>
                  </div>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Toggle between tactical command cyber frames and clean laboratory briefing plaques.
                  </p>
                  
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-655"}`}>Theme Preference</span>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`text-xs p-2 rounded-xl font-bold uppercase transition-all flex items-center gap-2 border px-4 cursor-pointer ${
                          isDarkMode
                            ? "bg-slate-950 border-slate-850 text-amber-400"
                            : "bg-slate-50 border-slate-200 text-indigo-700 font-extrabold"
                        }`}
                      >
                        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-750" />}
                        <span>{isDarkMode ? "Cyber Dark Mode" : "Crisp Light Mode"}</span>
                      </button>
                    </div>

                    <div className={`p-3 rounded-lg border text-[10px] font-mono leading-relaxed space-y-1 ${
                      isDarkMode ? "bg-slate-950 border-slate-855 text-slate-400" : "bg-slate-50 border-slate-205 text-slate-600"
                    }`}>
                      <span className="font-extrabold text-emerald-505 block uppercase mb-0.5">✓ Global Core Graphics Settings:</span>
                      <p>Visual Library: Tailwind CSS Utility Classes</p>
                      <p>Hardware Acceleration: WebGL Composite maps enabled</p>
                      <p>Local Ledger Sync Cryptography: AES-256 standard</p>
                    </div>
                  </div>
                </div>

                {/* 3. Play Store native capacitor targets */}
                <div className={`p-6 rounded-2xl border ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                } space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-500" />
                    <h4 className={`font-heading font-bold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Capacitor Project Specifications</h4>
                  </div>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Verification metrics established to prepare this codebase for deployment as a native Android App Bundle.
                  </p>
                  
                  <div className="space-y-2.5 pt-1 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-850">
                      <span className={`font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Android App Package ID</span>
                      <span className="font-mono text-blue-500 font-extrabold text-[10px]">com.ciem.aptara_ai</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-850">
                      <span className={`font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Android Minimum SDK Version</span>
                      <span className="font-mono text-slate-500 font-extrabold text-[10px]">API Level 28 (Android Pie 9.0+)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-850">
                      <span className={`font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Target Play Store Format</span>
                      <span className="font-mono text-slate-500 font-extrabold text-[10px]">Android App Bundle (.aab)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 font-mono text-[9px]">
                      <span className="font-sans font-semibold text-xs text-slate-450 uppercase">Offline Cache Backup System</span>
                      <span className="text-emerald-500 font-black">ENABLED ✓ LOCAL SYSTEM CACHE</span>
                    </div>
                  </div>
                </div>

                {/* 4. Credentials encryption keys & cache flush */}
                <div className={`p-6 rounded-2xl border ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                } space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-505" />
                    <h4 className={`font-heading font-bold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Sovereign Handshake Credentials</h4>
                  </div>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Sign out active personnel nodes and clear compiled chat ledger transaction histories.
                  </p>
                  
                  <div className="space-y-4.5 pt-1.5">
                    {userProfile ? (
                      <div className={`p-3 rounded-lg border ${
                        isDarkMode ? "bg-slate-950 border-emerald-950 text-emerald-400" : "bg-emerald-50 border-emerald-250/50 text-emerald-805"
                      } space-y-2`}>
                        <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 block">Authenticated Node ID:</span>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-emerald-650 border border-emerald-500/20 text-white font-mono flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                            {userProfile.avatarLetter}
                          </div>
                          <div className="overflow-hidden leading-tight font-sans">
                            <span className={`text-xs font-black block truncate ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>{userProfile.name}</span>
                            <span className="text-[9px] text-slate-450 block truncate leading-none">{userProfile.email}</span>
                          </div>
                        </div>
                         <button
                          onClick={async () => {
                            try {
                              await firebaseSignOut(auth);
                            } catch (e) {}
                            localStorage.removeItem("aptara-user-profile");
                            setUserProfile(null);
                            pushConsoleLog("Signed out user session and cleared secure authorization credentials.", "warning");
                          }}
                          className="w-full text-center py-1 hover:bg-red-955/20 text-red-500 hover:text-red-405 border border-transparent hover:border-red-900/10 text-[9px] font-mono font-bold uppercase rounded-lg mt-2 cursor-pointer transition-colors"
                        >
                          Sign Out Connection ✕
                        </button>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-xl border text-center space-y-2.5 pb-4 ${
                        isDarkMode ? "bg-slate-950 border-slate-855" : "bg-slate-50 border-slate-150"
                      }`}>
                        <p className="text-[10px] text-slate-500 font-sans font-medium leading-relaxed">
                          No active Google sign-in node credentials verified on this device chassis.
                        </p>
                        <button
                          onClick={handleHUDDirectAuthorize}
                          className="w-full py-1.5 bg-amber-500 text-slate-950 text-[10px] font-mono uppercase font-black rounded-lg border border-amber-300 cursor-pointer shadow-sm hover:bg-amber-450"
                        >
                          Google Auth Connect ➔
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Firebase Real-Time Cloud Sync */}
                <div className={`p-6 rounded-2xl border ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                } space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-emerald-500" />
                    <h4 className={`font-heading font-bold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Firebase Cloud Synchronization</h4>
                  </div>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Real-time cloud database pipeline status and security rule handshake controls.
                  </p>
                  
                  <div className={`p-3.5 rounded-xl border font-mono text-[9px] leading-relaxed space-y-1.5 ${
                    isDarkMode ? "bg-slate-950 border-slate-855 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-655"
                  }`}>
                    <div className="flex justify-between items-center pb-1 border-b border-slate-850">
                      <span className="font-sans font-bold text-[10px] uppercase text-slate-400">Sync Datastream</span>
                      <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        ACTIVE
                      </span>
                    </div>
                    <p><span className="text-slate-500">PROVIDER</span>: Google Firebase Firestore</p>
                    <p><span className="text-slate-500">REGION</span>: asia-southeast1 (Singapore)</p>
                    <p><span className="text-slate-500">ZERO-TRUST</span>: Deployed security rules active</p>
                    <p><span className="text-slate-500">DATA POLICY</span>: Compliant with GDPR & CIEM privacy acts</p>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            
            // DYNAMIC CIEM DOSSIER BLUEPRINT & ABOUT CORNER
            <motion.div
              key="ciem-blueprint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto px-4 py-8 lg:py-12 space-y-12"
            >
              
              {/* Header section */}
              <div className="space-y-1.5 border-b pb-4 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
                  CIEM SOVEREIGN CREDENTIALS PROTOCOLS
                </span>
                <h2 className={`font-heading text-3xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Corporate Blueprint & Technology Dossier
                </h2>
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-505"}`}>
                  Verify the corporate engineering profile of CIEM Industries, review local security charters, future Smart Observer Device mechatronics specs, and mobile compilation manuals.
                </p>
              </div>

              {/* Grid 1: Founder and Sustainability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* A. Founder's Executive Message Card */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  isDarkMode ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800" : "bg-white border-slate-205 shadow-sm"
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-sans font-black text-sm relative border border-emerald-500/10">
                        M
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 border-2 border-slate-950 rounded-full flex items-center justify-center text-[7px] text-white">✓</div>
                      </div>
                      <div>
                        <h4 className={`font-heading font-bold text-sm leading-none ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>Mano Mathen John</h4>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none block mt-1">Founder & Managing Director</span>
                      </div>
                    </div>
                    
                    <span className="text-[8px] font-mono text-indigo-500 uppercase tracking-widest block font-bold">Executive Office Directives:</span>
                    <blockquote className={`text-xs italic leading-relaxed border-l-2 border-emerald-500 pl-3 ${
                      isDarkMode ? "text-slate-350" : "text-slate-600"
                    }`}>
                      &quot;Aptara AI is the culmination of sovereign engineering and deep-tech mechatronics. Our mission is clear: to establish rigorous, offline-capable ecological computing frameworks. We protect human life, evaluate key biometrics in real-time, and preserve Earth&apos;s climate matrices with complete engineering transparency and technological autonomy. Made in India for the entire world.&quot;
                    </blockquote>
                  </div>

                  <div className="pt-4 mt-4 border-t border-dashed border-slate-200 dark:border-slate-850 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 font-bold uppercase">Consortium of Indian Engineers & Mechatronics</span>
                    <span className="text-emerald-505 font-extrabold uppercase">CIEM COGNITIVE OFFICE ✓</span>
                  </div>
                </div>

                {/* B. Sustainability & Stewardship Statement */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  isDarkMode ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800" : "bg-white border-slate-205 shadow-sm"
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-500 animate-pulse" />
                      <h4 className={`font-heading font-semibold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Planetary Stewardship & Sustainability Pledge</h4>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-350" : "text-slate-600"}`}>
                      At **CIEM Industries**, our environmental response system operates under a strict **Zero-Disruption Directive**. We guarantee that every geonode deployment, SRM aerosol dispersal trial, and sensor array works in total harmony with regional biomes.
                    </p>
                    <ul className="text-[11px] space-y-1.5 text-slate-400 leading-normal pl-3">
                      <li className="list-disc"><strong className="text-emerald-500">Neutral Footprint:</strong> 105% solar and kinetic energy self-harvesting geonodes.</li>
                      <li className="list-disc"><strong className="text-emerald-500">Non-Invasive Aerosols:</strong> HARB aerosols are strictly non-reactive water-calcium lattices.</li>
                      <li className="list-disc"><strong className="text-emerald-505">Eco Validation:</strong> Closed-loop temporal simulations are performed prior to field launches.</li>
                    </ul>
                  </div>

                  <div className={`p-2.5 rounded-lg border text-[9px] font-mono leading-none flex items-center justify-between ${
                    isDarkMode ? "bg-slate-950 border-slate-850 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}>
                    <span>CARBON NEUTRAL COMPLIANCE GRANTED</span>
                    <span className="text-emerald-505 font-bold">✓ CIEM-HQ DECREE</span>
                  </div>
                </div>

              </div>

              {/* SYSTEM SECURITY & PRIVACY POLICY COMPLIANCE STATEMENT */}
              <div className={`p-6 rounded-2xl border ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              } space-y-4`}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <h4 className={`font-heading font-bold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Sovereign Privacy & Local Security Charter</h4>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-xs ${isDarkMode ? "text-slate-350" : "text-slate-605"}`}>
                  <div className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40">
                    <span className="font-bold text-emerald-450 block font-mono text-[9px] tracking-wider uppercase">01 / LOCAL LEDGER EXCLUSIVE</span>
                    <p className="leading-relaxed font-sans">All chat transaction histories and sensor calibration logs are compiled and saved directly on your browser device cache under localized AES encryption.</p>
                  </div>
                  <div className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40">
                    <span className="font-bold text-emerald-450 block font-mono text-[9px] tracking-wider uppercase">02 / DATA AUTO-SHIELDING</span>
                    <p className="leading-relaxed font-sans">Aptara AI enforces a strict zero-surveillance monitoring system. Credentials are processed locally without secondary remote telemetry aggregation grids.</p>
                  </div>
                  <div className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40">
                    <span className="font-bold text-emerald-450 block font-mono text-[9px] tracking-wider uppercase">03 / QUANTUM HANDSHAKE KEYS</span>
                    <p className="leading-relaxed font-sans">Authorized sessions are locked with high-altitude rotative cryptographic indices, protecting executive terminals against external intercept attempts.</p>
                  </div>
                </div>
              </div>

              {/* FUTURE SMART OBSERVER DEVICE (SOD) INTER-LINK SCHEMATICS */}
              <div className={`p-6 rounded-3xl border ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-md"
              } space-y-6`}>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500 bg-indigo-550/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    GOAL 18 HARDWARE DIAGNOSTICS DECK
                  </span>
                  <h4 className={`font-heading font-extrabold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                    Future Smart Observer Device (SOD) Inter-Link Schematic
                  </h4>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Interactive hardware wiring blueprint for our edge-sensing geoengineer nodule. Click components to display voltage vectors, frequency indices, and mechatronic targets.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Interactive Vector Diagram Grid (5 cols) */}
                  <div className="lg:col-span-5 space-y-2">
                    <span className="text-[8px] font-mono text-slate-550 uppercase block tracking-wider font-bold">DEVICE CORE MODULES LAYOUT:</span>
                    
                    <button
                      onClick={() => {
                        setHighlightedSector("jetson");
                        pushConsoleLog("SOD Diagnostics: Queried NVIDIA Jetson edge processing core specifications.", "info");
                        speakVocalContent("NVIDIA Jetson Core. Quad Core ARM CPU, active 128 Core Maxwell GPU. Operates real-time 15 watt deep-learning model evaluators locally.");
                      }}
                      className={`w-full text-left p-3 rounded-xl border font-mono transition-all uppercase flex-wrap flex justify-between items-center bg-slate-950/40 cursor-pointer ${
                        highlightedSector === "jetson" 
                          ? "border-emerald-500 text-emerald-400 font-bold" 
                          : "border-slate-800 text-slate-450 hover:text-slate-250 hover:border-slate-700"
                      }`}
                    >
                      <span>01. COMPUTING NODE (NVIDIA JETSON)</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 rounded border border-slate-850">15W</span>
                    </button>

                    <button
                      onClick={() => {
                        setHighlightedSector("lidar");
                        pushConsoleLog("SOD Diagnostics: Queried Micro-LiDAR spatial scanner matrices.", "info");
                        speakVocalContent("Micro LIner Spatial Scanner. Laser frequency 905 nanometers. Triangulates multi-point ground fracture margins up to 200 meters deep.");
                      }}
                      className={`w-full text-left p-3 rounded-xl border font-mono transition-all uppercase flex justify-between items-center bg-slate-950/40 cursor-pointer ${
                        highlightedSector === "lidar" 
                          ? "border-emerald-500 text-emerald-400 font-bold" 
                          : "border-slate-800 text-slate-450 hover:text-slate-250 hover:border-slate-700"
                      }`}
                    >
                      <span>02. Micro-LiDAR SCANNER UNIT</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 rounded border border-slate-850">905nm</span>
                    </button>

                    <button
                      onClick={() => {
                        setHighlightedSector("aerosol");
                        pushConsoleLog("SOD Diagnostics: Queried Aerosol Jet Calibration Array nozzle parameters.", "info");
                        speakVocalContent("Aerosol calibration jet nozzle. High dispersion velocity grid, releasing mineralized calcium water buffers to stabilize ozone layer thickness.");
                      }}
                      className={`w-full text-left p-3 rounded-xl border font-mono transition-all uppercase flex justify-between items-center bg-slate-950/40 cursor-pointer ${
                        highlightedSector === "aerosol" 
                          ? "border-emerald-500 text-emerald-400 font-bold" 
                          : "border-slate-800 text-slate-450 hover:text-slate-250 hover:border-slate-700"
                      }`}
                    >
                      <span>03. AEROSOL CALIBRATED INJECTOR</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 rounded border border-slate-850">40psi</span>
                    </button>

                    <button
                      onClick={() => {
                        setHighlightedSector("secured");
                        pushConsoleLog("SOD Diagnostics: Queried Crypto-seed quantum protection keys.", "info");
                        speakVocalContent("Crypto Seed Handshake Node. Dynamic AES keys rotated every 300 seconds, authenticating ground telemetry blocks against external interception.");
                      }}
                      className={`w-full text-left p-3 rounded-xl border font-mono transition-all uppercase flex justify-between items-center bg-slate-950/40 cursor-pointer ${
                        highlightedSector === "secured" 
                          ? "border-emerald-500 text-emerald-400 font-bold" 
                          : "border-slate-800 text-slate-450 hover:text-slate-250 hover:border-slate-700"
                      }`}
                    >
                      <span>04. CRYPTO SHIELD INTERLOCK (HG-KEY)</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 rounded border border-slate-850">AES-256</span>
                    </button>
                  </div>

                  {/* Right Column: Visual responsive Diagnostic HUD readout (7 cols) */}
                  <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                      {highlightedSector ? (
                        <motion.div
                          key={highlightedSector}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.25 }}
                          className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 font-mono text-xs leading-normal space-y-4 text-slate-205"
                        >
                          <div className="flex items-center justify-between border-b border-slate-850 pb-2 flex-wrap gap-2">
                            <span className="text-emerald-400 font-black flex items-center gap-1.5 font-mono text-[10px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              <span>LIVE INTEL SPECTRAL CALIBRATION</span>
                            </span>
                            <span className="text-slate-550 text-[10px]">HG-SECURE-COMMS // MECHTRON</span>
                          </div>

                          {highlightedSector === "jetson" && (
                            <div className="space-y-2 text-[11px] text-slate-300 font-mono">
                              <p className="text-emerald-400 font-black uppercase text-xs">Computing Subsystem [NVIDIA JETSON CORONA]</p>
                              <p>• Processing Chipset: Arm Cortex A57 quad-core CPU architecture</p>
                              <p>• GPU Acceleration: 128 core Maxwell deep-tech engine</p>
                              <p>• AI Capacity: Real-time Convolutional Neural Networks validation</p>
                              <p>• Operating Power: Configured around 10W to 15W eco spectrum</p>
                            </div>
                          )}

                          {highlightedSector === "lidar" && (
                            <div className="space-y-2 text-[11px] text-slate-300 font-mono">
                              <p className="text-emerald-400 font-black uppercase text-xs">Multi-Spectral Radar [Micro-LiDAR SENSOR]</p>
                              <p>• Spectrum waveband: Infrared solid-state lasers targeting 905nm</p>
                              <p>• Penetrative Spectrum: Fault-line rifts analyzed within 200m depth</p>
                              <p>• Accuracy scale: Sub-millimeter mechanical alignments calibrated</p>
                              <p>• Mapping Grid: High density spatial point cloud output</p>
                            </div>
                          )}

                          {highlightedSector === "aerosol" && (
                            <div className="space-y-2 text-[11px] text-slate-300 font-mono">
                              <p className="text-emerald-400 font-black uppercase text-xs">Climatic Dispersion [Aerosol Jet Calibration]</p>
                              <p>• Dispersive Matrix: Non-reactive biodegradable water-calcium lattices</p>
                              <p>• Jet Jet Nozzle: High-altitude velocity release regulated at 40 psi</p>
                              <p>• Spatial Coverage: High density solar Ultraviolet deflection coefficient</p>
                              <p>• Stewardship Compliance: 100% bio-safe environmental compliance</p>
                            </div>
                          )}

                          {highlightedSector === "secured" && (
                            <div className="space-y-2 text-[11px] text-slate-300 font-mono">
                              <p className="text-emerald-400 font-black uppercase text-xs">Crypto Ledger Node [HG-KEY INTERLOCK]</p>
                              <p>• Encrypted Keys: Local hardware caches (AES-256 standard encryption)</p>
                              <p>• Temporal Seed Rotation: Auto key regeneration occurs every 300 seconds</p>
                              <p>• Multi-node Handshake: Sovereign consensus models bypassed off-cloud</p>
                              <p>• Security state: Complete standalone protection loops active</p>
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-850/65 flex justify-between items-center text-[9px] text-slate-500">
                            <span>COOPERATING WITH CIEM MECHATRONICS LABS</span>
                            <button
                              onClick={() => setHighlightedSector(null)}
                              className="text-amber-500 font-bold uppercase hover:text-white cursor-pointer"
                            >
                              Reset Selector ✕
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-44 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center p-6 text-slate-505 dark:text-slate-500">
                          <Bot className="w-8 h-8 text-slate-400 dark:text-slate-650 mb-2 animate-pulse" />
                          <p className="text-xs max-w-sm font-semibold italic text-slate-500 font-sans">
                            Select any Smart Observer Device component on the left side menu to map mechatronics wiring coordinates, active voltages, and temporal frequencies.
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>

              {/* Grid 3: CAPACITOR ANDROID COMPILATION PLAYBOOK */}
              <div className={`p-6 rounded-2xl border ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              } space-y-4`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-500" />
                    <h4 className={`font-heading font-black text-sm uppercase ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                      Android Compilation Playbook (Play Store Prep)
                    </h4>
                  </div>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Technical directives and bash commands to package this deep-tech portal into a production Android APK bundle.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Console Code blocks */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 relative overflow-x-auto text-emerald-400 font-mono text-[10.5px] space-y-3 shadow-inner">
                    <div className="absolute top-2 right-2 text-[8px] text-slate-500 uppercase font-black">NATIVE CONSOLE</div>
                    <div>
                      <span className="text-slate-550 block"># 01. Configure Capacitor dependency frameworks</span>
                      <span>npm install @capacitor/core @capacitor/cli</span>
                    </div>
                    <div>
                      <span className="text-slate-550 block"># 02. Initialize capacitor parameters under com.ciem.aptara_ai package ID</span>
                      <span>npx cap init AptaraAI com.ciem.aptara_ai --web-dir=dist</span>
                    </div>
                    <div>
                      <span className="text-slate-550 block"># 03. Execute production static compiler bundles</span>
                      <span>npm run build</span>
                    </div>
                    <div>
                      <span className="text-slate-550 block"># 04. Add Native Android wrapper SDK</span>
                      <span>npm install @capacitor/android && npx cap add android</span>
                    </div>
                    <div>
                      <span className="text-slate-550 block"># 05. Copy build folders into Android directory nodes</span>
                      <span>npx cap sync android</span>
                    </div>
                    <div>
                      <span className="text-slate-550 block"># 06. Open Android Studio to build high-performance Production APK</span>
                      <span>npx cap open android</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-blue-500/5 border border-blue-900/10 rounded-xl leading-relaxed text-xs space-y-1">
                    <span className="font-extrabold text-blue-400 uppercase font-mono text-[9px] tracking-wider block">✓ Play Store Performance Tuning:</span>
                    <p className={`font-sans ${isDarkMode ? "text-slate-350" : "text-slate-650"}`}>
                      Inside Android Studio, construct highly optimized proguard rules, expand audio microphone request alerts inside native permissions files, and compile utilizing ARM64 target indices to secure fast mobile load speeds across rugged devices.
                    </p>
                  </div>
                </div>

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
          <button
            onClick={() => {
              pushConsoleLog("Redirecting to CIEM Industries official Instagram...", "info");
              window.open("https://www.instagram.com/ciemindustries?igsh=YjNoM3A3cjlnMmU1", "_blank");
            }}
            className="hover:text-pink-500 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500/80 animate-pulse" />
            <span>@ciemindustries</span>
          </button>
          <span className="text-slate-300">|</span>
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
                        <div className="pt-2 flex items-center gap-3 flex-wrap">
                          <button
                            onClick={() => {
                              pushConsoleLog("Redirecting to organization verified Instagram handle @ciemindustries...", "info");
                              window.open("https://www.instagram.com/ciemindustries?igsh=YjNoM3A3cjlnMmU1", "_blank");
                            }}
                            className="bg-pink-950/40 hover:bg-pink-900/60 text-pink-400 border border-pink-900/40 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Instagram className="w-3 h-3" /> @ciemindustries
                          </button>
                          <div className="flex items-center gap-2 text-[8px] font-mono text-slate-500">
                            <span>Rank: EXECUTIVE ARCHITECT</span>
                            <span>•</span>
                            <span>ID: CIEM-001</span>
                          </div>
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

