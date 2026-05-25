import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Cpu, Layers, Shield, Globe, Award, Zap, 
  Rotate3d, Info, CheckCircle, Flame, Heart, Play, RefreshCw
} from "lucide-react";

// Standard Indian Flag with 24-spoke Ashoka Chakra rendered elegantly
export function IndianFlagMini({ className = "w-6 h-4" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 90 60" 
      className={`rounded-xs border border-slate-205/10 shadow-xs inline-block aspect-3/2 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="90" height="20" fill="#FF9933" />
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      <rect y="40" width="90" height="20" fill="#138808" />
      <g transform="translate(45, 30)">
        <circle r="8" fill="none" stroke="#000080" strokeWidth="0.8" />
        <circle r="1" fill="#000080" />
        <circle r="0.4" fill="#FFFFFF" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={8 * Math.sin((i * 15 * Math.PI) / 180)}
            y2={-8 * Math.cos((i * 15 * Math.PI) / 180)}
            stroke="#000080"
            strokeWidth="0.22"
          />
        ))}
      </g>
    </svg>
  );
}

interface CIEMCorporateShowcaseProps {
  pushLog?: (msg: string, type: "info" | "success" | "warning" | "error") => void;
}

export default function CIEMCorporateShowcase({ pushLog }: CIEMCorporateShowcaseProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [lightMode, setLightMode] = useState(true); // Default to clean corporate white plaque
  const [pingCount, setPingCount] = useState(0);
  const [hgHandshakeActive, setHgHandshakeActive] = useState(false);
  const [hgProgress, setHgProgress] = useState(0);
  const [hgComplete, setHgComplete] = useState(false);

  const initiateHGKeyHandshake = () => {
    if (hgHandshakeActive) return;
    setHgHandshakeActive(true);
    setHgProgress(0);
    setHgComplete(false);
    if (pushLog) {
      pushLog("[HG_KEY] Protocol handshaking started. Initializing SHA-512 cryptographic seeds...", "info");
    }

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setHgProgress(currentProgress);
      
      if (pushLog) {
        if (currentProgress === 30) {
          pushLog("[HG_KEY] Fetching secure signature tokens from 122 mechatronic nodes...", "info");
        } else if (currentProgress === 60) {
          pushLog("[HG_KEY] Quantum core synchronized. Handshake consensus reached score: 1.0", "success");
        } else if (currentProgress === 90) {
          pushLog("[HG_KEY] Standard cryptographic key validated programmatically.", "success");
        }
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setHgHandshakeActive(false);
        setHgComplete(true);
        if (pushLog) {
          pushLog("[HG_KEY] SUCCESS - Harmonic Geo-Grid Key locked and fully established under Mano Mathen John's directive.", "success");
        }
      }
    }, 250);
  };

  const handlePillarClick = (pillar: string) => {
    setActivePillar(activePillar === pillar ? null : pillar);
    if (pushLog) {
      pushLog(`[CIEM SHOWCASE] Inspected corporate pillar: ${pillar.toUpperCase()}`, "success");
    }
  };

  const triggerDiagnosticPing = () => {
    setPingCount(prev => prev + 1);
    if (pushLog) {
      pushLog(`[CIEM SYSTEM PING] Sent test pulse to CIEM Industries mechatronics matrix. Response: ACTIVE nodes online.`, "info");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 p-1 relative z-10">
      {/* Top Controller Toggles */}
      <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
        <span className="text-slate-400 flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
          CIEM Brand Showcase
        </span>
        <div className="flex items-center gap-3">
          {/* Card Flip Button */}
          <button 
            onClick={() => setIsFlipped(!isFlipped)} 
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
            title="Flip to view corporate blueprints"
          >
            <Rotate3d className="w-3.5 h-3.5 animate-spin-slow" style={{ animationDuration: '6s' }} />
            <span>{isFlipped ? "Logo View" : "Blueprint"}</span>
          </button>
          <span className="text-slate-700">|</span>
          {/* Light/Dark Toggle */}
          <button 
            onClick={() => setLightMode(!lightMode)}
            className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-white inline-block mr-0.5" />
            <span>{lightMode ? "Dark Theme" : "Light Logo"}</span>
          </button>
        </div>
      </div>

      <div className="relative w-full h-[320px] transition-transform duration-700 transform-style-3d">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            /* ==================== FRONT SIDE: CORPORATE EMBLEM ==================== */
            <motion.div
              key="front"
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-between border select-none overflow-hidden transition-all duration-500 pb-5 ${
                lightMode 
                  ? "bg-white border-slate-200 text-slate-900" 
                  : "bg-slate-950 border-slate-800 text-white"
              }`}
            >
              {/* If Handshake is active, display high-fidelity holographic progress screen */}
              {hgHandshakeActive && (
                <div className="absolute inset-0 bg-slate-950 z-40 flex flex-col items-center justify-center p-6 text-emerald-400">
                  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
                  <div className="relative w-16 h-16 mb-3 flex items-center justify-center">
                    <div className="absolute inset-0 border border-dashed border-emerald-500/30 rounded-full animate-spin-slow" />
                    <Cpu className="w-6 h-6 text-emerald-400 animate-pulse" />
                  </div>
                  <span className="font-mono text-[9px] tracking-widest uppercase font-bold text-center block mb-1">
                    HG-KEY HANDSHAKE IN PROGRESS
                  </span>
                  <div className="w-full max-w-[180px] h-1.5 bg-slate-900 border border-slate-850 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-emerald-500 transition-all duration-150" style={{ width: `${hgProgress}%` }} />
                  </div>
                  <span className="font-mono text-[8px] text-slate-400">
                    ESTABLISHING SYNC: {hgProgress}%
                  </span>
                </div>
              )}

              {/* Abstract corporate watermarks / dynamic glare beam */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute -inset-x-20 -top-40 h-80 rotate-12 opacity-15 bg-gradient-to-b from-blue-400/30 to-transparent blur-2xl animate-pulse`} />
                {lightMode && (
                  <div className="absolute inset-0 bg-[radial-gradient(#005b94_1px,transparent_1px)] [background-size:16px_16px] opacity-2" />
                )}
              </div>

              {/* Top Row: Aesthetic Node Sync State */}
              <div className="w-full flex items-center justify-between text-[8px] font-mono text-slate-400 tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                  <span>CIEM OFFICIAL REGISTRY</span>
                </div>
                <span>NODE_REF // IND_HQ_011</span>
              </div>

              {/* Main Brand Lettermark Block */}
              <div className="flex flex-col items-center justify-center my-auto py-4 space-y-3 w-full">
                {/* CIEM */}
                <motion.div 
                  className="flex gap-1"
                  initial="initial"
                  whileHover="hover"
                >
                  {"CIEM".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        initial: { y: 0, scale: 1 },
                        hover: { y: -6, scale: 1.12, transition: { type: "spring", stiffness: 300 } }
                      }}
                      className="font-heading font-black text-6.5xl leading-none tracking-tight inline-block select-none"
                      style={{ color: lightMode ? "#004b87" : "#3b82f6" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>

                {/* INDUSTRIES */}
                <motion.div 
                  className="flex gap-0.5 tracking-[0.22em]"
                  initial="initial"
                  whileHover="hover"
                >
                  {"INDUSTRIES".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.1, color: lightMode ? "#334155" : "#f8fafc" }
                      }}
                      className="font-sans font-extrabold text-[12px] leading-none uppercase select-none inline-block text-slate-500"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Blue Corporate Underline Divider */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 1.2, delay: 0.1 }}
                  className="h-[1.5px] max-w-[260px] my-1"
                  style={{ backgroundColor: lightMode ? "#004b87" : "#3b82f6" }}
                />

                {/* Dynamic Brand Tagline Section with interactive buttons */}
                <div className="text-center pt-2 max-w-[320px]">
                  <p className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-normal leading-relaxed text-slate-500 inline flex-wrap items-center justify-center gap-1">
                    {/* Driven by Engineers */}
                    <span 
                      onClick={() => handlePillarClick("engineers")}
                      className={`cursor-pointer px-1 py-0.5 rounded transition-all hover:bg-blue-105/10 hover:text-blue-600 ${
                        activePillar === "engineers" ? "bg-blue-50 text-blue-700 font-bold" : ""
                      }`}
                    >
                      Driven by Engineers.
                    </span>{" "}
                    
                    {/* Designed for Impact */}
                    <span 
                      onClick={() => handlePillarClick("impact")}
                      className={`cursor-pointer px-1 py-0.5 rounded transition-all hover:bg-emerald-105/10 hover:text-emerald-600 ${
                        activePillar === "impact" ? "bg-emerald-50 text-emerald-700 font-bold" : ""
                      }`}
                    >
                      Designed for Impact.
                    </span>{" "}
                    
                    {/* Made in India, for the World */}
                    <span 
                      onClick={() => handlePillarClick("india")}
                      className={`cursor-pointer px-1 py-0.5 rounded transition-all hover:bg-amber-105/10 hover:text-amber-653 ${
                        activePillar === "india" ? "bg-amber-50 text-amber-700 font-bold animate-pulse" : ""
                      }`}
                    >
                      Made in India, for the World.
                    </span>
                  </p>
                </div>
              </div>

              {/* Bottom Interactive Area / Indicator Popover */}
              <div className="w-full flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {activePillar ? (
                    <motion.div
                      key={activePillar}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`text-[9px] font-mono text-center p-2 rounded-lg border w-full max-w-[340px] shadow-inner mb-2.5 transition-colors ${
                        lightMode 
                          ? "bg-slate-50 border-slate-150 text-slate-600" 
                          : "bg-slate-900 border-slate-800 text-slate-300"
                      }`}
                    >
                      {activePillar === "engineers" && (
                        <span>
                          ⚙️ <strong className="text-blue-600">ENGINEERS</strong>: Supported by a premier Consortium of Indian Engineers & Mechatronics Specialists focused on structural hard-science products.
                        </span>
                      )}
                      {activePillar === "impact" && (
                        <span>
                          🌍 <strong className="text-emerald-600">IMPACT</strong>: Spearheading clean technology matrices, environmental obduction meshes, and climate remediation shields.
                        </span>
                      )}
                      {activePillar === "india" && (
                        <span className="flex items-center justify-center gap-1.5 flex-wrap">
                          <IndianFlagMini className="w-4.5 h-3 shadow-xs -my-1" />
                          <span>
                            🇮🇳 <strong className="text-amber-600">MADE IN INDIA</strong>: Pioneering high-value engineering, developed natively in India to establish sovereign safety nets for the world.
                          </span>
                        </span>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-[8px] font-mono text-slate-400 italic mb-2.5">
                      💡 Click tagline segments above to query key corporate pillars
                    </div>
                  )}
                </AnimatePresence>

                {/* Interaction Footer Bar */}
                <div className="w-full flex items-center justify-between pt-2 border-t border-slate-105/50 mt-1">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={triggerDiagnosticPing}
                      className="flex items-center gap-1 text-[8px] font-mono uppercase bg-slate-900 text-white rounded px-2 py-1 hover:bg-blue-600 transition-all cursor-pointer font-bold shadow-sm"
                    >
                      <Zap className="w-2.5 h-2.5" />
                      <span>Ping matrix {pingCount > 0 && `(${pingCount})`}</span>
                    </button>
                    
                    <button 
                      onClick={initiateHGKeyHandshake}
                      className={`flex items-center gap-1 text-[8px] font-mono uppercase rounded px-2 py-1 transition-all cursor-pointer font-bold shadow-sm ${
                        hgComplete 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-805/60" 
                          : "bg-gradient-to-r from-blue-900 to-indigo-900 text-white hover:opacity-95"
                      }`}
                    >
                      <Shield className="w-2.5 h-2.5" />
                      <span>{hgComplete ? "HG Key: Active ✔" : "Initiate HG Key"}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-400 uppercase font-semibold">
                    <span>Designed for scale</span>
                    <IndianFlagMini className="w-3 h-2" />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ==================== BACK SIDE: SOVEREIGN BLUEPRINT ==================== */
            <motion.div
              key="back"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full rounded-2xl bg-slate-950 border border-blue-900/40 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden text-blue-200 select-none"
            >
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40 pointer-events-none" />
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Blueprint Header */}
              <div className="flex items-center justify-between border-b border-blue-900/40 pb-2 relative z-10 w-full">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" style={{ animationDuration: '8s' }} />
                  <span className="font-mono text-[10px] font-extrabold tracking-widest text-blue-300">
                    CIEM_MECHATRONICS_SPEC
                  </span>
                </div>
                <span className="font-mono text-[8px] bg-blue-950 px-1.5 py-0.5 rounded text-blue-400 font-bold border border-blue-900/30">
                  REV_04
                </span>
              </div>

              {/* Core Schematic content */}
              <div className="space-y-3.5 my-auto py-2 relative z-10">
                {/* Structure details */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/40 font-mono text-xs flex items-center justify-center font-bold text-blue-400 flex-shrink-0 relative overflow-hidden">
                    <Layers className="w-5 h-5 text-blue-400/80" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-blue-400 uppercase tracking-widest block">Consortium Paradigm</span>
                    <h4 className="text-xs uppercase font-extrabold text-blue-100 tracking-wide">
                      Consortium of Indian Engineers and Mechatronics Industries
                    </h4>
                    <p className="text-[9px] text-blue-300 leading-normal">
                      A high-fidelity framework building sovereign telemetry systems, deep sensor arrays, and environmental obduction nodes.
                    </p>
                  </div>
                </div>

                {/* Sub specifications grid */}
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                  <div className="bg-slate-900/60 border border-blue-950 p-2 rounded-lg">
                    <span className="text-slate-450 uppercase block text-[8px] tracking-wider">FOUNDER &amp; INVENTOR</span>
                    <span className="font-bold text-white uppercase tracking-wide">Mano Mathen John</span>
                  </div>
                  <div className="bg-slate-900/60 border border-blue-950 p-2 rounded-lg">
                    <span className="text-slate-450 uppercase block text-[8px] tracking-wider">PRIMARY DIRECTIVE</span>
                    <span className="font-bold text-blue-400 uppercase tracking-wide">Planetary Stewardship</span>
                  </div>
                  <div className="bg-slate-900/60 border border-blue-950 p-2 rounded-lg">
                    <span className="text-slate-450 uppercase block text-[8px] tracking-wider">REMEDIATION SCHEMES</span>
                    <span className="font-bold text-emerald-400 uppercase tracking-wide">APTARA-REMesh [ACTIVE]</span>
                  </div>
                  <div className="bg-slate-900/60 border border-blue-950 p-2 rounded-lg">
                    <span className="text-slate-450 uppercase block text-[8px] tracking-wider">COMPLIANCE CODE</span>
                    <span className="font-bold text-amber-500 uppercase tracking-wide">BI-STD-24-SOUV</span>
                  </div>
                </div>

                {/* Live indicators */}
                <div className="flex items-center gap-4 bg-slate-900/40 p-2 rounded-lg border border-blue-950 text-[8px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LEDGER_LOCK: INTEGRAL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span>NODES_ONLINE: 122/122</span>
                  </div>
                </div>
              </div>

              {/* Blueprint Footer */}
              <div className="flex items-center justify-between border-t border-blue-900/40 pt-2 text-[8px] font-mono text-blue-400 relative z-10">
                <span>INTELLECTUAL COPYRIGHTED SPEC 2026</span>
                <button 
                  onClick={() => setIsFlipped(false)}
                  className="text-white hover:text-blue-300 font-bold uppercase cursor-pointer"
                >
                  Return to Logo ➔
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
