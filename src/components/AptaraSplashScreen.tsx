import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Terminal, Shield, RefreshCw } from "lucide-react";
import { AptaraLogoSvg } from "../App";

interface AptaraSplashScreenProps {
  onComplete: () => void;
}

export default function AptaraSplashScreen({ onComplete }: AptaraSplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("");
  const [logIndex, setLogIndex] = useState(0);

  const initLogs = [
    "Initializing APTARA Executive Core...",
    "Securing handshake protocol with CIEM Industries nodes...",
    "Validating quantum cryptoseeds: HG-KEY-8829-CIEM-ACTIVE...",
    "Synchronizing multi-spectral satellite swarms [Arctic-Vortex / Amazon Rift]...",
    "Mapping high-altitude SRM albedo shield arrays...",
    "Calibrating Smart Observer Devices (SOD) mesh network...",
    "Testing Edge AI NVIDIA Jetson consensus rates...",
    "Core cognitive system nominal. Standby for terminal launch..."
  ];

  useEffect(() => {
    // Progress increment
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Log index rotation based on current progress
    const calculatedIndex = Math.min(
      Math.floor((progress / 100) * initLogs.length),
      initLogs.length - 1
    );
    setLogIndex(calculatedIndex);
    setCurrentLog(initLogs[calculatedIndex]);

    if (progress === 100) {
      const waitTimeout = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(waitTimeout);
    }
  }, [progress, onComplete]);

  return (
    <div id="aptara-splash-screen" className="fixed inset-0 z-100 bg-slate-950 flex flex-col items-center justify-center p-6 text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-emerald-950/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-lg text-center space-y-8 z-10">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-emerald-500/30 flex items-center justify-center p-3 relative overflow-hidden shadow-2xl cyber-glow-emerald mx-auto">
            <AptaraLogoSvg className="w-20 h-20 animate-pulse text-emerald-400" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute -inset-4 border border-dashed border-blue-500/30 rounded-full animate-spin-slow pointer-events-none"
            style={{ animationDuration: "12s" }}
          />
        </motion.div>

        {/* Title / Branding */}
        <div className="space-y-2">
          <motion.h1
            initial={{ letterSpacing: "0.1em", opacity: 0 }}
            animate={{ letterSpacing: "0.2em", opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-heading font-black text-2xl tracking-[0.2em] text-white"
          >
            APTARA AI
          </motion.h1>
          <p className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-extrabold flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Planetary Intelligence & Geoengineering Matrix</span>
          </p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-sans font-medium">
            Developed & Engineered by <span className="text-white font-mono">CIEM Industries</span>
          </p>
        </div>

        {/* Dynamic Telemetry Loading Bar */}
        <div className="space-y-4 max-w-xs mx-auto">
          <div className="w-full h-1 bg-slate-900 border border-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>BOOTSTRAP INDEX: {progress}%</span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>STABLE_MODE</span>
            </span>
          </div>
        </div>

        {/* Simulated Diagnostics Log Console */}
        <div className="h-20 bg-slate-900/95 border border-slate-800/80 rounded-xl p-3 text-left font-mono text-[9px] text-emerald-400/90 overflow-hidden shadow-inner flex flex-col justify-end">
          <div className="flex items-center gap-1.5 border-b border-slate-800/60 pb-1.5 mb-1.5 text-slate-500">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>SECURE SYSTEM_BOOT DIAGNOSTICS</span>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={logIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-1 block"
            >
              <p className="text-slate-400 flex items-center gap-1">
                <span>[LOG_{logIndex}]</span>
                <span className="text-white">{currentLog}</span>
              </p>
              <p className="text-[8px] text-slate-600 block leading-none">
                SHA-512 SECURE CHASSIS NODE // OK // STATUS: STEADY_STATE
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Direct Bypass Button */}
        <button
          onClick={onComplete}
          className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-850 text-[10px] font-mono hover:text-emerald-400 transition-all border border-slate-800 uppercase tracking-wider cursor-pointer"
        >
          Skip Boot Core ➔
        </button>
      </div>

      <div className="absolute bottom-6 text-[8px] font-mono text-slate-500 uppercase flex items-center gap-2">
        <span>CIEM-APTARA CORE V4.0 // INDIAN HQ DIGITAL REGISTRY</span>
        <span>•</span>
        <span>SECURE BOOT</span>
      </div>
    </div>
  );
}
