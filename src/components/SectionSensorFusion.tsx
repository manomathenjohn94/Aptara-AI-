import React, { useState, useEffect } from "react";
import { Info, Radio, Network, Flame, ShieldAlert, Check, Smartphone, Compass, Activity, Wifi, Navigation, Eye, RefreshCw, ZoomIn, ZoomOut, Mic, Battery, BatteryCharging, Signal, Brain, Cpu, Play, Pause, Sparkles, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { LocalAlert } from "../types";

interface SensorFeed {
  id: string;
  name: string;
  type: "Seismic" | "Atmospheric" | "Spectrometry" | "Hydric";
  location: string;
  ping: number;
  status: "nominal" | "calibrating" | "warning";
  value: string;
}

interface SectionSensorFusionProps {
  onNotifyLog: (msg: string, type: "info" | "warning" | "success") => void;
  highlightedSector?: string | null;
  onClearHighlight?: () => void;
  alerts?: LocalAlert[];
}

const SECTOR_COORDS: Record<string, { x: number; y: number; name: string }> = {
  "AMAZON-SYNCS": { x: 300, y: 290, name: "Amazon Basin" },
  "ICELAND-RIFT": { x: 400, y: 130, name: "Iceland Rift" },
  "INDO-PAC": { x: 780, y: 240, name: "Indo-Pacific Grid" },
};

const getSectorCoords = (sector: string) => {
  const upper = sector.toUpperCase();
  if (SECTOR_COORDS[upper]) return SECTOR_COORDS[upper];
  
  // Hash fallback so all user-simulated / randomly generated disasters map safely
  let hash = 0;
  for (let i = 0; i < upper.length; i++) {
    hash = upper.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = 150 + Math.abs((hash * 7) % 650); // safe mapping zones
  const y = 80 + Math.abs((hash * 13) % 280);
  return { x, y, name: sector };
};

export default function SectionSensorFusion({ onNotifyLog, highlightedSector, onClearHighlight, alerts = [] }: SectionSensorFusionProps) {
  const [activeLayer, setActiveLayer] = useState<"thermal" | "seismic" | "wind" | "ozone">("thermal");
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [scanSpeed, setScanSpeed] = useState<number>(3); // seconds for radar wipe
  const [zoom, setZoom] = useState<number>(1.0);
  const [sensors, setSensors] = useState<SensorFeed[]>([
    { id: "S1", name: "Arctic Borehole B-12", type: "Seismic", location: "82°N, 15°W", ping: 45, status: "nominal", value: "0.04 Hz" },
    { id: "S2", name: "Amazon canopy O2 indexer", type: "Atmospheric", location: "3°S, 60°W", ping: 120, status: "nominal", value: "20.94%" },
    { id: "S3", name: "Mariana Vent Sonar #4", type: "Hydric", location: "11°N, 142°E", ping: 84, status: "calibrating", value: "840 bar" },
    { id: "S4", name: "Sahara Solar Radiometer", type: "Spectrometry", location: "23°N, 12°E", ping: 95, status: "warning", value: "1140 W/m²" },
    { id: "S5", name: "Iceland Fault Sentinel-7", type: "Seismic", location: "64°N, 18°W", ping: 38, status: "nominal", value: "1.2 Richter" },
  ]);

  // Handheld Mobile Sensor Interlink States
  const [mobileConnected, setMobileConnected] = useState(false);
  const [gyroData, setGyroData] = useState<{ alpha: number; beta: number; gamma: number } | null>(null);
  const [motionData, setMotionData] = useState<{ x: number; y: number; z: number; maxForce: number }>({ x: 0, y: 0, z: 0, maxForce: 0 });
  const [geoData, setGeoData] = useState<{ lat: number; lng: number; accuracy: number; altitude: number | null; speed: number | null; heading: number | null } | null>(null);
  const [mobileCoords, setMobileCoords] = useState({ x: 715, y: 213 }); // Bengaluru default region

  // Dynamic Microphone Audio Level Sensors
  const [decibelDb, setDecibelDb] = useState<number>(35);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioContextDef, setAudioContextDef] = useState<AudioContext | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // Additional Hardware Telemetry info
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState<boolean | null>(null);
  const [networkType, setNetworkType] = useState<string>("Wi-Fi / 5G");
  const [networkSpeed, setNetworkSpeed] = useState<number | null>(null);
  const [networkRtt, setNetworkRtt] = useState<number | null>(null);

  // Desktop sandbox simulation controls when real mobile sensors are absent
  const [simulateVibration, setSimulateVibration] = useState(1.2); // 0-25
  const [simulateRoll, setSimulateRoll] = useState(10); // -180 to 180
  const [simulatePitch, setSimulatePitch] = useState(-5); // -90 to 90
  const [simulateDb, setSimulateDb] = useState(38); // background noise dB
  const [simulateBattery, setSimulateBattery] = useState(84); // simulated battery level
  const [simulateBatteryCharging, setSimulateBatteryCharging] = useState(true); // simulated battery charging state
  const [simulateLatency, setSimulateLatency] = useState(25); // simulated network latency

  // Aptara AI Situational Awareness Learning States
  const [isAiLearning, setIsAiLearning] = useState(false);
  const [learningEpochs, setLearningEpochs] = useState(0);
  const [learningLoss, setLearningLoss] = useState(1.05);
  const [learningLogs, setLearningLogs] = useState<string[]>([
    "APTARA-NEURAL: Neural client synchronized with mobile SOD architecture.",
    "APTARA-NEURAL: Weights initialized at standard uniform configuration."
  ]);
  const [aiClassification, setAiClassification] = useState("NOMINAL BASELINE");
  const [attenuationWeights, setAttenuationWeights] = useState({
    VIB: 0.25,
    TILT: 0.25,
    DB: 0.25,
    RTT: 0.25
  });

  // Dual-threaded reinforcement and self-supervised training heartbeat
  useEffect(() => {
    if (!isAiLearning || !mobileConnected) {
      return;
    }

    const interval = setInterval(() => {
      // Access core mechatronic data refs to bypass rendering triggers
      const forceVal = gyroDataRef.current 
        ? Math.sqrt(motionDataRef.current.x * motionDataRef.current.x + motionDataRef.current.y * motionDataRef.current.y + motionDataRef.current.z * motionDataRef.current.z) 
        : simulateVibration;
      const pitchVal = gyroDataRef.current ? gyroDataRef.current.beta : simulatePitch;
      const rollVal = gyroDataRef.current ? gyroDataRef.current.gamma : simulateRoll;
      const tiltVal = Math.abs(pitchVal) + Math.abs(rollVal);
      const dbVal = decibelDbRef.current || simulateDb;
      const rttVal = networkRttRef.current || simulateLatency;

      // Classify the situational frame
      let classification = "STABLE MAIN DECK NOMINAL";
      let logTrigger = "Normal mechatronics. Drift stable.";

      if (forceVal > 14) {
        classification = "SEISMIC WAVE TREMOR SHOCK";
        logTrigger = `High impact registered: ${forceVal.toFixed(2)} m/s²`;
      } else if (dbVal > 82) {
        classification = "ACOUSTIC ENERGY EXCESS INTRUSION";
        logTrigger = `Sound pressure crossed threshold: ${dbVal} dB`;
      } else if (tiltVal > 45) {
        classification = "CRITICAL ROTATIONAL INCLINE SHIFT";
        logTrigger = `Critical attitude deviation: ${tiltVal.toFixed(1)}° alpha-beta`;
      } else if (rttVal > 100) {
        classification = "COHERENCE INTEGRITY DEGRADED";
        logTrigger = `Signal ping delay high: ${rttVal} ms RTT`;
      }

      setAiClassification(classification);

      // Compute dynamic attention weights using current telemetry priorities
      const wVib = Math.max(0.1, forceVal / 22);
      const wTilt = Math.max(0.1, tiltVal / 120);
      const wDb = Math.max(0.1, (dbVal - 30) / 75);
      const wRtt = Math.max(0.1, rttVal / 120);
      const totalW = wVib + wTilt + wDb + wRtt;

      const nVib = Number((wVib / totalW).toFixed(2));
      const nTilt = Number((wTilt / totalW).toFixed(2));
      const nDb = Number((wDb / totalW).toFixed(2));
      const nRtt = Number((wRtt / totalW).toFixed(2));

      setAttenuationWeights({
        VIB: nVib,
        TILT: nTilt,
        DB: nDb,
        RTT: nRtt
      });

      // Update loss convergence and feed step
      setLearningLoss((prev) => {
        const nextLoss = prev * 0.94 + (Math.random() * 0.015);
        const finalLoss = Math.max(0.011, Number(nextLoss.toFixed(4)));

        setLearningEpochs((prevEpoch) => {
          const nextEpoch = prevEpoch + 1;
          setLearningLogs((pLogs) => {
            const nextLog = `[STEP #${nextEpoch}] Feed injected. Classification: ${classification}. Loss: ${finalLoss.toFixed(4)}. Focus dynamic bias: VIB=${Math.round(nVib*100)}% | TILT=${Math.round(nTilt*100)}% | DB=${Math.round(nDb*100)}% | RTT=${Math.round(nRtt*100)}%`;
            return [nextLog, ...pLogs.slice(0, 7)];
          });
          return nextEpoch;
        });

        return finalLoss;
      });

    }, 1200);

    return () => clearInterval(interval);
  }, [isAiLearning, mobileConnected, simulateVibration, simulatePitch, simulateRoll, simulateDb, simulateLatency]);

  // Aptara AI Situational Prediction and Foresight States
  const [prediction, setPrediction] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [lastPredictionTime, setLastPredictionTime] = useState<string | null>(null);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const loadingPhrases = [
    "COMPUTING PLANETARY THREAT VECTORS...",
    "CROSS-REFERENCING MECHATRONIC DRIFTS...",
    "SYNAPSE RESPONSE CORRELATION LOCK...",
    "COGNITIVE FORECAST GRADIENTS EXPANDING...",
    "FORMULATING CIEM INDUSTRIES DIRECTIVES..."
  ];

  useEffect(() => {
    if (!isPredicting) return;
    const interval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPredicting]);

  const triggerPrediction = async () => {
    setIsPredicting(true);
    onNotifyLog("Initializing Aptara Cognitive Foresight core. Compiling sensor data...", "info");
    try {
      const currentVib = gyroDataRef.current 
        ? Math.sqrt(motionDataRef.current.x * motionDataRef.current.x + motionDataRef.current.y * motionDataRef.current.y + motionDataRef.current.z * motionDataRef.current.z) 
        : simulateVibration;

      const currentTilt = Math.abs(gyroDataRef.current ? gyroDataRef.current.beta : simulatePitch) + Math.abs(gyroDataRef.current ? gyroDataRef.current.gamma : simulateRoll);
      const currentDb = decibelDbRef.current || simulateDb;
      const currentGeo = geoDataRef.current;
      const currentBattery = batteryLevelRef.current || 87;

      const res = await fetch("/api/predict-awareness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alerts: alerts,
          mechatronics: {
            vibration: Number(currentVib.toFixed(2)),
            tilt: Number(currentTilt.toFixed(2)),
            db: Number(currentDb.toFixed(1)),
            latency: networkRttRef.current || simulateLatency,
            battery: currentBattery,
            deviceConnected: !!gyroDataRef.current,
            gps: currentGeo ? {
              latitude: Number(currentGeo.lat.toFixed(5)),
              longitude: Number(currentGeo.lng.toFixed(5)),
              accuracy: currentGeo.accuracy,
              altitude: currentGeo.altitude,
              speed: currentGeo.speed
            } : null
          },
          environmental: {
            co2Level: 418.5
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Mainframe HTTP ${res.status}`);
      }

      const data = await res.json();
      setPrediction(data);
      setLastPredictionTime(new Date().toLocaleTimeString());
      onNotifyLog("Planetary situational awareness forecast compiled successfully!", "success");
    } catch (err: any) {
      console.error(err);
      onNotifyLog("Prognostic core telemetry sync drift: Unable to fetch AI predictions.", "warning");
    } finally {
      setIsPredicting(false);
    }
  };

  // High-performance mechatronic telemetry refs to avoid cascading rendering depth loops
  const gyroDataRef = React.useRef<{ alpha: number; beta: number; gamma: number } | null>(null);
  const motionDataRef = React.useRef<{ x: number; y: number; z: number; maxForce: number }>({ x: 0, y: 0, z: 0, maxForce: 0 });
  const decibelDbRef = React.useRef<number>(35);
  const geoDataRef = React.useRef<{ lat: number; lng: number; accuracy: number; altitude: number | null; speed: number | null; heading: number | null } | null>(null);
  const batteryLevelRef = React.useRef<number | null>(null);
  const networkRttRef = React.useRef<number | null>(null);

  useEffect(() => { gyroDataRef.current = gyroData; }, [gyroData]);
  useEffect(() => { motionDataRef.current = motionData; }, [motionData]);
  useEffect(() => { decibelDbRef.current = decibelDb; }, [decibelDb]);
  useEffect(() => { geoDataRef.current = geoData; }, [geoData]);
  useEffect(() => { batteryLevelRef.current = batteryLevel; }, [batteryLevel]);
  useEffect(() => { networkRttRef.current = networkRtt; }, [networkRtt]);

  useEffect(() => {
    // Periodically update sensor feed stats simulating dynamic planetary telemetry
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          if (s.id === "S-Handheld") return s; // Do not overwrite active mobile streams!
          if (s.status === "calibrating") return s;
          const delta = (Math.random() - 0.5) * 0.1;
          let newValue = s.value;
          
          if (s.type === "Seismic") {
            const richter = (Math.random() * 2).toFixed(1);
            newValue = `${richter} Richter`;
          } else if (s.type === "Atmospheric") {
            const oxygen = (20.8 + Math.random() * 0.3).toFixed(2);
            newValue = `${oxygen}%`;
          } else if (s.type === "Spectrometry") {
            const rad = Math.floor(1100 + Math.random() * 100);
            newValue = `${rad} W/m²`;
          }
          
          return {
            ...s,
            ping: Math.max(30, Math.min(250, Math.floor(s.ping + (Math.random() - 0.5) * 15))),
            value: newValue,
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sync state mapping of S-Handheld coordinate node as an active Aptara SOD Unit
  useEffect(() => {
    if (mobileConnected) {
      setSensors((prev) => {
        if (prev.some((s) => s.id === "S-Handheld")) return prev;
        return [
          ...prev,
          {
            id: "S-Handheld",
            name: "Aptara Mobile SOD Unit v2",
            type: "Seismic",
            location: geoData ? `${geoData.lat.toFixed(4)}°N, ${geoData.lng.toFixed(4)}°E` : "Indian Peninsula SOD",
            ping: networkRtt || simulateLatency,
            status: "nominal",
            value: "Live SOD Telemetry Connected",
          },
        ];
      });
      // Automatically select the handheld node to showcase its metrics live!
      setSelectedSensor("S-Handheld");
    } else {
      setSensors((prev) => prev.filter((s) => s.id !== "S-Handheld"));
      if (selectedSensor === "S-Handheld") {
        setSelectedSensor(null);
      }
    }
  }, [mobileConnected]);

  // Periodic sync of global sensors array with current mobile SOD Unit mechatronic data (800ms telemetry heartbeat)
  useEffect(() => {
    if (!mobileConnected) return;

    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          if (s.id === "S-Handheld") {
            const pitch = gyroDataRef.current ? gyroDataRef.current.beta : simulatePitch;
            const roll = gyroDataRef.current ? gyroDataRef.current.gamma : simulateRoll;
            const force = gyroDataRef.current 
              ? Math.sqrt(motionDataRef.current.x * motionDataRef.current.x + motionDataRef.current.y * motionDataRef.current.y + motionDataRef.current.z * motionDataRef.current.z) 
              : simulateVibration;
            const db = decibelDbRef.current || simulateDb;
            const batt = batteryLevelRef.current !== null ? batteryLevelRef.current : simulateBattery;

            let statusVal: "nominal" | "warning" = "nominal";
            if (force > 15 || Math.abs(pitch) > 40 || Math.abs(roll) > 40 || db > 80) {
              statusVal = "warning";
            }

            return {
              ...s,
              location: geoDataRef.current ? `${geoDataRef.current.lat.toFixed(4)}°N, ${geoDataRef.current.lng.toFixed(4)}°E` : "12.9716°N, 77.5946°E",
              value: `SND: ${db}dB | VIB: ${force.toFixed(1)}m/s² | BAT: ${batt}%`,
              status: statusVal,
              ping: networkRttRef.current || simulateLatency,
            };
          }
          return s;
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, [mobileConnected, simulatePitch, simulateRoll, simulateVibration, simulateDb, simulateBattery, simulateLatency]);

  // Scale lat/lng inputs into maps
  useEffect(() => {
    if (geoData) {
      const mappedX = Math.round(Math.max(90, Math.min(910, ((geoData.lng + 180) / 360) * 1000)));
      const mappedY = Math.round(Math.max(60, Math.min(440, ((90 - geoData.lat) / 180) * 500)));
      setMobileCoords((prev) => {
        if (prev.x === mappedX && prev.y === mappedY) return prev;
        return { x: mappedX, y: mappedY };
      });
    } else {
      setMobileCoords((prev) => {
        if (prev.x === 715 && prev.y === 213) return prev;
        return { x: 715, y: 213 };
      });
    }
  }, [geoData]);

  // Phone listener registry with high-performance 10Hz throttle limits
  useEffect(() => {
    if (!mobileConnected) return;

    let lastGyroTime = 0;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null || e.beta !== null || e.gamma !== null) {
        const alphaVal = Math.round(e.alpha || 0);
        const betaVal = Math.round(e.beta || 0);
        const gammaVal = Math.round(e.gamma || 0);
        
        gyroDataRef.current = { alpha: alphaVal, beta: betaVal, gamma: gammaVal };

        const now = Date.now();
        if (now - lastGyroTime >= 100) { // Throttle React state changes to 10 FPS
          setGyroData({ alpha: alphaVal, beta: betaVal, gamma: gammaVal });
          lastGyroTime = now;
        }
      }
    };

    let lastMotionTime = 0;
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (acc) {
        const xVal = acc.x || 0;
        const yVal = acc.y || 0;
        const zVal = acc.z || 0;
        const totalForce = Math.sqrt(xVal * xVal + yVal * yVal + zVal * zVal);

        const currentMax = motionDataRef.current ? motionDataRef.current.maxForce : 0;
        const nextMax = Math.max(currentMax, totalForce);

        motionDataRef.current = {
          x: Number(xVal.toFixed(2)),
          y: Number(yVal.toFixed(2)),
          z: Number(zVal.toFixed(2)),
          maxForce: Number(nextMax.toFixed(2)),
        };

        const now = Date.now();
        if (now - lastMotionTime >= 100) { // Throttle React state changes to 10 FPS
          setMotionData({
            x: Number(xVal.toFixed(2)),
            y: Number(yVal.toFixed(2)),
            z: Number(zVal.toFixed(2)),
            maxForce: Number(nextMax.toFixed(2)),
          });
          lastMotionTime = now;
        }
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [mobileConnected]);

  // Audio level analysis listener with smooth 12Hz state rendering throttling
  useEffect(() => {
    if (!mobileConnected || !analyserNode) return;

    let animId: number;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let lastAudioTime = 0;
    const updateVolume = () => {
      analyserNode.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      // Map average amplitude to a beautiful dB index (e.g. ambient ~35dB to intense ~110dB)
      const mappedDb = Math.round(35 + (average / 255) * 75);
      
      decibelDbRef.current = mappedDb;

      const now = performance.now();
      if (now - lastAudioTime >= 80) { // Throttle acoustic DB state updates to ~12 FPS
        setDecibelDb(mappedDb);
        lastAudioTime = now;
      }
      
      animId = requestAnimationFrame(updateVolume);
    };

    animId = requestAnimationFrame(updateVolume);
    return () => cancelAnimationFrame(animId);
  }, [mobileConnected, analyserNode]);

  // Request trigger for SOD mechatronic interlink (Acoustics + GPS + Orientation + Motion + Battery + Connection)
  const handleStartMobileInterlink = async () => {
    let orientationGranted = false;
    let motionGranted = false;

    // Request permissions (primarily for iOS Safari guidelines)
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        // @ts-ignore
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        // @ts-ignore
        const orientationRes = await DeviceOrientationEvent.requestPermission();
        orientationGranted = orientationRes === "granted";
      } else {
        orientationGranted = true;
      }

      if (
        typeof DeviceMotionEvent !== "undefined" &&
        // @ts-ignore
        typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        // @ts-ignore
        const motionRes = await DeviceMotionEvent.requestPermission();
        motionGranted = motionRes === "granted";
      } else {
        motionGranted = true;
      }
    } catch (err) {
      console.warn("Mobile sensors triggered permissions warning:", err);
    }

    // Geolocation registration (with extended metrics)
    if (navigator.geolocation) {
      onNotifyLog("Probing mechatronic GPS and planetary coordinates...", "info");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoData({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            speed: pos.coords.speed,
            heading: pos.coords.heading,
          });
          onNotifyLog(
            `Interlinked SOD position at ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (Accuracy: ±${Math.round(pos.coords.accuracy)}m)`,
            "success"
          );
        },
        (error) => {
          onNotifyLog("Defaulting Mobile GPS to Bengaluru operations station.", "warning");
          setGeoData({ lat: 12.9716, lng: 77.5946, accuracy: 120, altitude: 920, speed: 0, heading: null });
        },
        { enableHighAccuracy: true }
      );

      navigator.geolocation.watchPosition((pos) => {
        setGeoData({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
        });
      });
    } else {
      setGeoData({ lat: 12.9716, lng: 77.5946, accuracy: 120, altitude: 920, speed: 0, heading: null });
    }

    // Battery telemetry probe
    if ("getBattery" in navigator) {
      try {
        // @ts-ignore
        const battery = await navigator.getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
        setBatteryCharging(battery.charging);
        
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener("chargingchange", () => {
          setBatteryCharging(battery.charging);
        });
      } catch (e) {
        console.warn("Battery API blocked/unavailable", e);
        setBatteryLevel(87);
        setBatteryCharging(true);
      }
    } else {
      setBatteryLevel(87);
      setBatteryCharging(true);
    }

    // Network connection metrics probe
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      setNetworkType(conn.effectiveType || "Wi-Fi / Direct");
      setNetworkSpeed(conn.downlink || 24.5);
      setNetworkRtt(conn.rtt || 18);
    } else {
      setNetworkType("Cellular LTE / 5G");
      setNetworkSpeed(45.0);
      setNetworkRtt(15);
    }

    // Acoustic Microphone Sensor configuration
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        onNotifyLog("Probing mobile mechatronic acoustic sound pressure levels...", "info");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setAudioStream(stream);

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);

        setAudioContextDef(ctx);
        setAnalyserNode(analyser);
        onNotifyLog("Mechatronic acoustic decibel sensor bound to mobile SOD unit!", "success");
      }
    } catch (err: any) {
      console.warn("Acoustic microphone block permission warning. Operating in simulation background:", err);
      onNotifyLog("Acoustic microphone block using high-fidelity local simulator.", "warning");
    }

    setMobileConnected(true);
    onNotifyLog("Smart Observer Device (SOD) Mobile Station v2 synchronized to global sensor grid!", "success");
  };

  const handleStopMobileInterlink = () => {
    setMobileConnected(false);
    if (audioStream) {
      try {
        audioStream.getTracks().forEach((track) => track.stop());
      } catch (e) {
        console.warn(e);
      }
      setAudioStream(null);
    }
    if (audioContextDef) {
      try {
        audioContextDef.close();
      } catch (e) {
        console.warn(e);
      }
      setAudioContextDef(null);
    }
    setAnalyserNode(null);
    onNotifyLog("Disconnected spatial handheld SOD node v2.", "info");
  };

  const handleLayerChange = (layer: "thermal" | "seismic" | "wind" | "ozone") => {
    setActiveLayer(layer);
    onNotifyLog(`Sensor Fusion view state: switched to [${layer.toUpperCase()}] telemetry mesh`, "info");
  };

  const handleSelectSensor = (s: SensorFeed) => {
    setSelectedSensor(s.id);
    onNotifyLog(`Intercepting direct telemetry stream from [${s.name}]`, "success");
  };

  // Helper colors based on layer
  const getThemeColor = () => {
    switch (activeLayer) {
      case "thermal": return "rgba(239, 68, 68, 0.4)"; // red
      case "seismic": return "rgba(245, 158, 11, 0.4)"; // amber
      case "wind": return "rgba(34, 211, 238, 0.4)"; // cyan
      case "ozone": return "rgba(16, 185, 129, 0.4)"; // emerald
      default: return "rgba(37, 99, 235, 0.4)";
    }
  };

  // Dynamically calculate centering target for regional zoom scale focusing
  let targetCenter = { x: 500, y: 250 };
  if (selectedSensor) {
    const s = sensors.find((x) => x.id === selectedSensor);
    if (s) {
      if (s.id === "S-Handheld") {
        targetCenter = mobileCoords;
      } else {
        const idx = sensors.findIndex((x) => x.id === selectedSensor);
        const coords = [
          { x: 420, y: 110 }, // Arctic Block
          { x: 300, y: 290 }, // Amazon
          { x: 740, y: 160 }, // Mariana
          { x: 490, y: 230 }, // Sahara
          { x: 400, y: 130 }, // Iceland Fault
        ][idx];
        if (coords) targetCenter = coords;
      }
    }
  } else if (highlightedSector) {
    targetCenter = getSectorCoords(highlightedSector);
  }

  const zoomWidth = 1000 / zoom;
  const zoomHeight = 500 / zoom;
  let minX = targetCenter.x - zoomWidth / 2;
  let minY = targetCenter.y - zoomHeight / 2;

  // Constrain coordinates to keep view within boundaries
  minX = Math.max(0, Math.min(1000 - zoomWidth, minX));
  minY = Math.max(0, Math.min(500 - zoomHeight, minY));

  const viewBoxStr = `${minX} ${minY} ${zoomWidth} ${zoomHeight}`;

  return (
    <div className="space-y-5 flex flex-col h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 1. Radar Visual Deck (Main Map Panel) */}
      <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden h-[380px] lg:h-auto shadow-2xl cyber-glow-blue">
        {/* Absolute Background Scan Radar Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.25] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/80 via-slate-950 to-black" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.2] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] cyber-grid" />
        
        {/* Interactive Layer Badge overlay */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 border-l-2 border-l-blue-500 px-3 py-1.5 rounded flex items-center gap-2 shadow-md">
          <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-slate-300 uppercase">MESH: {activeLayer}</span>
        </div>

        {/* Floating Hazard Target Badge overlay */}
        {highlightedSector && (
          <div className="absolute top-4 right-4 z-10 bg-red-950/90 backdrop-blur border border-red-900 border-l-2 border-l-red-500 px-3.5 py-1.5 rounded flex items-center gap-3 shadow-md animate-pulse">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-[9px] font-bold text-red-200 uppercase tracking-wide">Target: {highlightedSector}</span>
            </div>
            {onClearHighlight && (
              <button 
                onClick={onClearHighlight}
                className="text-[9px] font-mono font-bold text-red-400 hover:text-white transition-colors uppercase border border-red-900/60 hover:border-red-500 px-1.5 py-0.5 bg-red-950/40 rounded cursor-pointer"
              >
                Clear Ping
              </button>
            )}
          </div>
        )}

        {/* Dynamic Scan Line Simulation */}
        <motion.div 
          className="absolute inset-y-0 w-[2px] pointer-events-none z-1 bg-gradient-to-r from-transparent via-blue-500/15 to-transparent"
          animate={{ x: ["0%", "100%", "0%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Global Vector Simulation (Stylized World Grid representation via SVG map & dots) */}
        <div className="flex-1 flex items-center justify-center relative py-6">
          <motion.svg 
            viewBox={viewBoxStr} 
            animate={{ viewBox: viewBoxStr }}
            transition={{ type: "spring", stiffness: 85, damping: 16 }}
            className="w-full h-full max-h-[280px] text-slate-800"
          >
            {/* Outline grids */}
            <circle cx="500" cy="250" r="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" fill="none" className="text-slate-800" />
            <circle cx="500" cy="250" r="220" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6 6" fill="none" className="text-slate-800" />
            <line x1="500" y1="20" x2="500" y2="480" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-slate-800" />
            <line x1="20" y1="250" x2="980" y2="250" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-slate-800" />

            {/* Stylized world continents dots layout */}
            {/* North America */}
            <path d="M 120 120 Q 200 130 250 160 T 320 220 Q 220 270 210 320" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-slate-700/50" />
            <circle cx="210" cy="150" r="2" fill="currentColor" className="text-slate-700" />
            <circle cx="240" cy="180" r="2" fill="currentColor" className="text-slate-700" />
            
            {/* South America */}
            <path d="M 280 280 Q 300 350 330 400 T 310 480" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-700/40" />

            {/* Eurasia / Africa */}
            <path d="M 450 100 Q 550 50 700 80 T 850 110" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-slate-700/40" />
            <path d="M 480 200 Q 540 280 600 320 T 560 420" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-700/40" />

            {/* Australia */}
            <path d="M 780 340 Q 840 330 860 380 T 820 420" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-700/40" />

            {/* Active Telemetry Layer Visual Overlays (Thermal, Seismic, Wind, Ozone) */}
            {activeLayer === "thermal" && (
              <>
                <circle cx="480" cy="140" r="45" fill="url(#thermalGlow)" opacity="0.4" />
                <circle cx="340" cy="310" r="60" fill="url(#thermalGlow)" opacity="0.3" />
                <circle cx="750" cy="200" r="70" fill="url(#thermalGlow)" opacity="0.5" />
              </>
            )}

            {activeLayer === "seismic" && (
              <>
                {/* Fault Lines */}
                <path d="M 120 180 L 180 240 L 220 310 L 280 340 L 320 480" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <path d="M 680 80 L 710 160 L 780 220 L 840 310 L 890 410" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
                
                <circle cx="200" cy="280" r="14" fill="none" stroke="#ea580c" strokeWidth="1" className="animate-ping" />
                <circle cx="780" cy="220" r="18" fill="none" stroke="#ea580c" strokeWidth="1" className="animate-ping" />
              </>
            )}

            {activeLayer === "wind" && (
              <>
                {/* Wind currents representation */}
                <path d="M 100 220 C 250 180, 350 250, 500 220 C 650 190, 750 280, 900 220" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="15 5" className="animate-pulse" opacity="0.5" style={{ strokeDashoffset: -5 }} />
                <path d="M 50 350 C 200 320, 400 380, 600 315 C 800 250, 850 340, 950 310" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="20 10" opacity="0.4" />
              </>
            )}

            {activeLayer === "ozone" && (
              <>
                {/* Polar Ozone deficit zones */}
                <circle cx="500" cy="110" r="85" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" />
                <circle cx="340" cy="380" r="50" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" />
                <path d="M 460 110 A 40 40 0 1 1 540 110" fill="none" stroke="#059669" strokeWidth="4" opacity="0.2" strokeLinecap="round" />
                <text x="500" y="80" className="text-[10px] font-mono fill-emerald-600 font-bold" textAnchor="middle" opacity="0.8">OZONE THINNING SECTOR-4</text>
              </>
            )}

            {/* Definitions for glowing effects */}
            <defs>
              <radialGradient id="thermalGlow">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Active Highlighted Sector Locator on Map */}
            {highlightedSector && (() => {
              const coords = getSectorCoords(highlightedSector);
              return (
                <g>
                  {/* Radiating target concentric rings */}
                  <circle cx={coords.x} cy={coords.y} r="32" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping" style={{ animationDuration: "2s" }} />
                  <circle cx={coords.x} cy={coords.y} r="16" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" style={{ animationDuration: "1s" }} />
                  {/* Glowing central pulse */}
                  <circle cx={coords.x} cy={coords.y} r="8" fill="#ef4444" fillOpacity="0.3" className="animate-pulse" />
                  <circle cx={coords.x} cy={coords.y} r="4" fill="#ef4444" />
                  {/* Flag style popup calling out threat */}
                  <g className="animate-bounce" style={{ animationDuration: "2s" }}>
                    <rect x={coords.x - 55} y={coords.y - 32} width="110" height="18" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1" opacity="0.95" />
                    <text x={coords.x} y={coords.y - 20} className="text-[7.5px] font-mono fill-white font-bold" textAnchor="middle">
                      ⚠️ SECTOR: {coords.name}
                    </text>
                  </g>
                </g>
              );
            })()}

            {/* Active critical or high severity active disaster alerts */}
            {alerts
              .filter(al => (al.status === "detected" || al.status === "mitigating") && (al.severity === "high" || al.severity === "critical"))
              .map(al => {
                const coords = getSectorCoords(al.sector);
                const isCritical = al.severity === "critical";
                const markerColor = isCritical ? "#ef4444" : "#f97316";
                return (
                  <g key={`map-alert-${al.id}`}>
                    {/* Concentric outer ring sensor lock */}
                    <circle cx={coords.x} cy={coords.y} r="14" fill="none" stroke={markerColor} strokeWidth="1.25" strokeDasharray="2 1" opacity="0.4" />
                    {/* Ring Pulse */}
                    <circle cx={coords.x} cy={coords.y} r="20" fill="none" stroke={markerColor} strokeWidth="0.75" className="animate-ping" style={{ animationDuration: "1.8s" }} />
                    {/* Core pulsing glowing zone */}
                    <circle cx={coords.x} cy={coords.y} r="5" fill={markerColor} className="animate-pulse" />
                    {/* Inner high contrast bead */}
                    <circle cx={coords.x} cy={coords.y} r="1.5" fill="#ffffff" />
                    
                    {/* Mini dynamic threat tag */}
                    <g transform={`translate(${coords.x - 45}, ${coords.y + 11})`}>
                      <rect x="0" y="0" width="90" height="13" rx="3" fill="#090d16" stroke={markerColor} strokeWidth="0.75" opacity="0.85" />
                      <text x="45" y="9" className="text-[6px] font-mono fill-white font-bold" textAnchor="middle">
                        {isCritical ? "🚨 CRITICAL LOCK" : "⚠️ HIGH THREAT"}
                      </text>
                    </g>
                  </g>
                );
              })}

            {/* Sensor nodes positioned strategically */}
            {sensors.map((s, idx) => {
              let coords = [
                { x: 420, y: 110 }, // Arctic Block
                { x: 300, y: 290 }, // Amazon
                { x: 740, y: 160 }, // Mariana
                { x: 490, y: 230 }, // Sahara
                { x: 400, y: 130 }, // Iceland Fault
              ][idx];

              if (s.id === "S-Handheld") {
                coords = mobileCoords;
              }

              if (!coords) return null;

              const isSelected = selectedSensor === s.id;
              const nodeColor = s.status === "warning" ? "#f59e0b" : s.status === "calibrating" ? "#2563eb" : "#10b981";

              return (
                <g key={s.id} cursor="pointer" onClick={(e) => { e.stopPropagation(); handleSelectSensor(s); }}>
                  {isSelected && (
                    <>
                      {/* Highly calibrated cinematic outward pulse */}
                      <motion.circle
                        cx={coords.x}
                        cy={coords.y}
                        initial={{ r: 6, opacity: 0.8 }}
                        animate={{ r: 28, opacity: 0 }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeOut",
                        }}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="1.5"
                      />
                      {/* Secondary soft concentric wave */}
                      <motion.circle
                        cx={coords.x}
                        cy={coords.y}
                        initial={{ r: 6, opacity: 0.6 }}
                        animate={{ r: 18, opacity: 0 }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: 0.6,
                          ease: "easeOut",
                        }}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="1"
                      />
                      {/* Internal static threshold highlight ring */}
                      <circle cx={coords.x} cy={coords.y} r="11" fill="none" stroke={nodeColor} strokeWidth="1" opacity="0.25" />
                    </>
                  )}
                  {/* Interactive core sensor block with state matching heartbeat pulse */}
                  <motion.circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    animate={isSelected ? { r: [6, 8, 6], strokeWidth: [1.5, 2.5, 1.5] } : { r: 5, strokeWidth: 1.5 }}
                    transition={isSelected ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : undefined}
                    fill={nodeColor} 
                    stroke="#ffffff" 
                    className="hover:scale-125 transition-transform duration-200" 
                  />
                  
                  {/* Subtle Node pulse absolute center core */}
                  <circle cx={coords.x} cy={coords.y} r="1.8" fill="#ffffff" />
                </g>
              );
            })}
          </motion.svg>

          {/* Zoom Level Control Slider Overlay */}
          <div className="absolute bottom-2 right-2 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-2.5 shadow-lg select-none">
            <button 
              type="button"
              onClick={() => setZoom(prev => Math.max(1.0, Number((prev - 0.2).toFixed(1))))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col">
              <span className="text-[7.5px] font-mono text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Scale Zoom</span>
              <input 
                type="range" 
                min="1.0" 
                max="3.0" 
                step="0.1" 
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-20 md:w-24 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 text-blue-500"
              />
            </div>
            <button 
              type="button"
              onClick={() => setZoom(prev => Math.min(3.0, Number((prev + 0.2).toFixed(1))))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[9px] font-bold text-slate-300 min-w-[28px] text-right">
              {zoom === 1.0 ? "GLOBAL" : `${zoom.toFixed(1)}x`}
            </span>
          </div>
        </div>

        {/* Selected Sensor Telemetry Shelf */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[56px] shadow-inner">
          {selectedSensor ? (
            (() => {
              const s = sensors.find((x) => x.id === selectedSensor)!;
              return (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.85)]" />
                    <div>
                      <span className="font-heading text-xs font-semibold text-slate-200 block">{s.name}</span>
                      <span className="font-mono text-[9px] text-slate-400">COORDS: {s.location} | DEV_TYPE: {s.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <span className="text-[9px] font-mono block text-slate-500 uppercase">PING</span>
                      <span className="font-mono text-[11px] text-blue-400 font-semibold">{s.ping}ms</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono block text-slate-500 uppercase">VALUE</span>
                      <span className="font-mono text-xs text-slate-200 font-bold">{s.value}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono block text-slate-500 uppercase">MODE</span>
                      <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                        s.status === "warning" ? "bg-amber-950/65 text-amber-400 border border-amber-900" : s.status === "calibrating" ? "bg-blue-950/65 text-blue-400 border border-blue-900" : "bg-emerald-950/65 text-emerald-400 border border-emerald-900"
                      }`}>{s.status}</span>
                    </div>
                  </div>
                </>
              );
            })()
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono italic">
              <Info className="w-4 h-4 flex-shrink-0 text-slate-600" />
              <span>Select any telemetry hub node on the coordinate map scan vectors above...</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Control & Table Panel */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Layer Selections */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-xl">
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Network className="w-3.5 h-3.5 text-blue-400" />
            Planetary Feed Layers
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans mb-1">
            Toggle atmospheric, deep fault, spectrometer, and fluid arrays to cross-check global system stress.
          </p>
          
          <div className="space-y-2">
            <button
              onClick={() => handleLayerChange("thermal")}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                activeLayer === "thermal" 
                  ? "bg-red-950/40 border-red-800 text-red-100 font-semibold shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                  : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                Thermal Composite
              </span>
              {activeLayer === "thermal" && <Check className="w-3.5 h-3.5 stroke-[3] text-red-400" />}
            </button>
 
            <button
              onClick={() => handleLayerChange("seismic")}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                activeLayer === "seismic" 
                  ? "bg-amber-950/40 border-amber-800 text-amber-400 font-semibold shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                  : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                Tectonic / Seismic Fault
              </span>
              {activeLayer === "seismic" && <Check className="w-3.5 h-3.5 stroke-[3] text-amber-400" />}
            </button>
 
            <button
              onClick={() => handleLayerChange("wind")}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                activeLayer === "wind" 
                  ? "bg-blue-950/40 border-blue-800 text-blue-400 font-semibold shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                  : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                Stratospheric Currents
              </span>
              {activeLayer === "wind" && <Check className="w-3.5 h-3.5 stroke-[3] text-blue-400" />}
            </button>
 
            <button
              onClick={() => handleLayerChange("ozone")}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                activeLayer === "ozone" 
                  ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 font-semibold shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
                  : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-emerald-500" />
                Ozone / SRM Particle
              </span>
              {activeLayer === "ozone" && <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Handheld Spatial Telemetry Interlink Card */}
        <div className="bg-slate-950 border border-slate-800 text-white rounded-xl p-4 flex flex-col gap-3 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Smartphone className={`w-3.5 h-3.5 ${mobileConnected ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
              Smart Observer Device (SOD) Interlink
            </h3>
            {mobileConnected && (
              <span className="flex items-center gap-1 text-[8.5px] font-mono text-emerald-400 uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900 font-bold leading-none">
                <Wifi className="w-2.5 h-2.5 animate-pulse" /> SOD ACTIVE
              </span>
            )}
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed font-sans -mt-1.5 font-medium">
            Turn your phone into a mechatronic observation unit. Fuses gyroscope, accelerometer, acoustic microphone, GPS altitude, battery, and signal latency.
          </p>

          {!mobileConnected ? (
            <div className="space-y-3 py-2">
              <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-900/40 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-slate-400 animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
                <div className="text-[10.5px] font-mono text-slate-350">
                  OPERATIONAL STANDBY (SOD-v2 PROT)
                </div>
                <p className="text-[10px] text-slate-500 px-4 leading-normal">
                  Will prompt for orientation, motion, altitude tracking, and microphone acoustics. Grants deep field diagnostic inputs!
                </p>
              </div>
              <button
                onClick={handleStartMobileInterlink}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-mono font-bold tracking-wider uppercase text-white shadow-md hover:shadow-emerald-900/20 cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-150 animate-pulse" />
                Initialize Mobile SOD Node
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Bento Grid: 6 Operational Telemetry Quadrants of the SOD-v2 Station */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                
                {/* 1. SEISMIC SHOCK VECTOR (IMPACT) */}
                <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">1. IMPACT VECTOR</span>
                  <div className="font-semibold text-[11px] text-white mt-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-teal-400" />
                    <span>
                      {gyroData
                        ? Math.sqrt(motionData.x*motionData.x + motionData.y*motionData.y + motionData.z*motionData.z).toFixed(2)
                        : simulateVibration.toFixed(2)}{" "}
                      m/s²
                    </span>
                  </div>
                  {/* Dynamic Vibration spark length bar */}
                  <div className="w-full bg-slate-950 h-1 rounded overflow-hidden mt-1.5">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        (gyroData ? motionData.maxForce : simulateVibration) > 15 ? "bg-red-500" : "bg-teal-500"
                      }`}
                      style={{
                        width: `${Math.min(100, ((gyroData ? Math.sqrt(motionData.x*motionData.x + motionData.y*motionData.y + motionData.z*motionData.z) : simulateVibration) / 25) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="text-[7.5px] text-slate-500 mt-1 block">X: {gyroData ? motionData.x : (simulateVibration * 0.4).toFixed(1)} | Y: {gyroData ? motionData.y : (simulateVibration * 0.3).toFixed(1)} | Z: {gyroData ? motionData.z : (simulateVibration * 0.8).toFixed(1)}</span>
                </div>

                {/* 2. SPATIAL DECK & ROTATING INCLINOMETER */}
                <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">2. ATTITUDE INC</span>
                  <div className="font-semibold text-[11px] text-white mt-1 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" style={{ animationDuration: '10s' }} />
                    <span>
                      R: {gyroData ? gyroData.gamma : simulateRoll}° | P: {gyroData ? gyroData.beta : simulatePitch}°
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded overflow-hidden mt-1.5">
                    <div 
                      className="h-full bg-blue-500"
                      style={{
                        width: `${Math.min(100, (Math.abs(gyroData ? gyroData.gamma : simulateRoll) / 90) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="text-[7.5px] text-slate-500 mt-1 block">Yaw Heading θ: {gyroData ? gyroData.alpha : 0}°</span>
                </div>

                {/* 3. ACOUSTIC PRESSURE LEVEL (SOUND DB) */}
                <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">3. SOUND PRESSURE</span>
                  <div className="font-semibold text-[11px] text-white mt-1 flex items-center gap-1">
                    <Mic className={`w-3.5 h-3.5 ${analyserNode ? "text-rose-500" : "text-amber-500"}`} />
                    <span>
                      {analyserNode ? decibelDb : simulateDb} dB
                    </span>
                  </div>
                  {/* Real-time jumping soundwave bars */}
                  <div className="flex items-end gap-0.5 h-3 mt-1 px-1">
                    {Array.from({ length: 8 }).map((_, i) => {
                      const isActive = (analyserNode ? decibelDb : simulateDb) > (30 + i * 8);
                      const barHt = isActive ? Math.max(15, Math.min(100, Math.round(((analyserNode ? decibelDb : simulateDb) - 30) * (1.2 + i * 0.1)))) : 15;
                      return (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-t-sm transition-all duration-75 ${
                            isActive 
                              ? (analyserNode ? decibelDb : simulateDb) > 80 ? "bg-rose-500 animate-pulse" : "bg-emerald-500" 
                              : "bg-slate-800"
                          }`}
                          style={{ height: `${barHt}%` }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[7.5px] text-slate-500 mt-1 block">Acoustic Status: {(analyserNode ? decibelDb : simulateDb) > 80 ? "ALERT HIGH" : "NOMINAL AMB"}</span>
                </div>

                {/* 4. GPS RADAR & ELEVATION DECK */}
                <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">4. GPS ELEVATION</span>
                  <div className="font-semibold text-[11px] text-white mt-1 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>
                      ELEV: {geoData?.altitude ? `${Math.round(geoData.altitude)}m` : "920m ASL"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded overflow-hidden mt-1.5">
                    <div className="h-full bg-indigo-500" style={{ width: "65%" }} />
                  </div>
                  <span className="text-[7.5px] text-slate-500 mt-1 block">SPEED: {geoData?.speed ? `${(geoData.speed * 3.6).toFixed(1)} km/h` : "0.0 km/h (Stationary)"}</span>
                </div>

                {/* 5. POWER SYSTEM CELL STATS */}
                <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg flex flex-col justify-between col-span-1">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold font-mono">5. POWER SYSTEMS</span>
                  <div className="font-semibold text-[11px] text-white mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {batteryCharging || (batteryLevel === null && simulateBatteryCharging) ? (
                        <BatteryCharging className="w-3.5 h-3.5 text-lime-400" />
                      ) : (
                        <Battery className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>
                        {batteryLevel !== null ? batteryLevel : simulateBattery}%
                      </span>
                    </div>
                    <span className="text-[7.5px] text-slate-450 uppercase leading-none bg-emerald-950/40 text-emerald-400 px-1 py-0.5 rounded border border-emerald-900/60">
                      {batteryCharging || (batteryLevel === null && simulateBatteryCharging) ? "CHARGING" : "DISCHG"}
                    </span>
                  </div>
                  <span className="text-[7.5px] text-slate-500 mt-2 block font-mono">Cell Volt: 3.82V | Temp: Nominal</span>
                </div>

                {/* 6. COHERENCE RELAY (SIGNAL) */}
                <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg flex flex-col justify-between col-span-1">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">6. COHERENCE LINK</span>
                  <div className="font-semibold text-[11px] text-white mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Signal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{networkRtt || simulateLatency} ms RTT</span>
                    </div>
                    <span className="text-[7.5px] text-slate-450 uppercase leading-none bg-indigo-950/40 text-indigo-400 px-1 py-0.5 rounded border border-indigo-900/60">
                      {networkType}
                    </span>
                  </div>
                  <span className="text-[7.5px] text-slate-500 mt-2 block">Cap Bandwidth: {networkSpeed || 45.0} Mbps downlink</span>
                </div>
              </div>

              {/* Connected Coordinate Diagnostics bar */}
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg space-y-1 text-[9.5px] font-mono leading-relaxed">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1 text-slate-350 font-bold uppercase"><Navigation className="w-3 h-3 text-emerald-400 animate-pulse" /> PLANETARY COORDS:</span>
                  <span className="text-white font-bold">
                    {geoData ? `${geoData.lat.toFixed(5)}°N, ${geoData.lng.toFixed(5)}°E` : "12.97160°N, 77.59460°E"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-450">
                  <span>GPS ACCURACY CRITERIA:</span>
                  <span className="text-white">
                    {geoData ? `±${Math.round(geoData.accuracy)}m (Standard Vector)` : "±12m (Bengaluru Operations Substation)"}
                  </span>
                </div>
              </div>

              {/* Interactive 3D Spatial Attitude Deck Display */}
              <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-lg flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                <span className="text-[8.5px] font-mono text-slate-450 uppercase tracking-widest leading-none self-start">SOD 3D ATTITUDE GAUGE</span>
                
                {/* 3D slant phone shell reflecting live angular tilts */}
                <div className="w-24 h-14 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-md relative flex items-center justify-center shadow-lg transform-gpu transition-transform duration-100 mt-2"
                  style={{
                    transform: `perspective(200px) rotateX(${(gyroData ? gyroData.beta : simulatePitch) * 0.4}deg) rotateY(${(gyroData ? gyroData.gamma : simulateRoll) * -0.4}deg)`
                  }}
                >
                  <div className="absolute inset-x-2 h-[1px] bg-indigo-500/10" />
                  <div className="absolute inset-y-2 w-[1px] bg-indigo-500/10" />
                  <Smartphone className="w-5 h-5 text-indigo-400 relative z-10 animate-bounce" style={{ animationDuration: '3.s' }} />
                  {/* Glowing dynamic center dot */}
                  <span className="absolute w-2 h-2 rounded-full bg-indigo-500/40 animate-ping" />
                </div>
              </div>

              {/* Aptara AI Situational Awareness Learning Console */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 space-y-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className={`w-3.5 h-3.5 ${isAiLearning ? "animate-pulse text-teal-400" : "text-slate-400"}`} />
                    Aptara Situational Learning v2
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAiLearning ? "bg-teal-500 animate-ping" : "bg-slate-500"}`} />
                    <span className="text-[7.5px] font-mono text-slate-400 uppercase font-bold">
                      {isAiLearning ? "ONLINE TRAINING" : "STANDBY"}
                    </span>
                  </div>
                </div>

                {/* Training Stats Block */}
                <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
                  <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-md">
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block font-bold">BATCH STEPS</span>
                    <span className="text-white font-bold block mt-1 text-[11px]">{learningEpochs}</span>
                  </div>
                  
                  <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-md">
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block font-bold">LOSS GD</span>
                    <span className="text-teal-300 font-bold block mt-1 text-[11px]">
                      {isAiLearning ? learningLoss.toFixed(4) : "1.0500"}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-md">
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block font-bold">AI STATUS</span>
                    <span className={`font-bold block mt-1 text-[8.5px] tracking-tight leading-normal truncate ${
                      !isAiLearning 
                        ? "text-slate-400" 
                        : aiClassification.includes("NOMINAL") 
                        ? "text-emerald-400" 
                        : aiClassification.includes("SHOCK") || aiClassification.includes("CRITICAL")
                        ? "text-rose-400 animate-pulse" 
                        : "text-amber-400 animate-pulse"
                    }`}>
                      {isAiLearning ? aiClassification.replace("STABLE ", "").replace("STABILIZED", "") : "CALIBRATED"}
                    </span>
                  </div>
                </div>

                {/* Features Attention Weight Matrix */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                    <span className="uppercase tracking-widest font-bold">DYNAMIC FOCUS MATRIX (FEATURE BIAS)</span>
                    <span className="text-teal-400 font-bold">Σ Weights = 1.00</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[8.5px] font-mono">
                    {/* Weight 1: Seismic Vibration */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>VIB (Shock Impact)</span>
                        <span className="text-white font-bold">{Math.round(attenuationWeights.VIB * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                        <motion.div 
                          className="h-full bg-teal-500" 
                          animate={{ width: `${attenuationWeights.VIB * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Weight 2: Attitudinal Incline Slope */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>TILT (Inclination)</span>
                        <span className="text-white font-bold">{Math.round(attenuationWeights.TILT * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500" 
                          animate={{ width: `${attenuationWeights.TILT * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Weight 3: Acoustic Noise decibels */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>DB (Sound Pressure)</span>
                        <span className="text-white font-bold">{Math.round(attenuationWeights.DB * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                        <motion.div 
                          className="h-full bg-rose-500" 
                          animate={{ width: `${attenuationWeights.DB * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Weight 4: Coherence delay latency */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>RTT (Signal Coherence)</span>
                        <span className="text-white font-bold">{Math.round(attenuationWeights.RTT * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-500" 
                          animate={{ width: `${attenuationWeights.RTT * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini terminal style logging output */}
                <div className="space-y-1">
                  <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1">
                    <Terminal className="w-2.5 h-2.5" />
                    Neural Execution Terminal Logs
                  </span>
                  <div className="bg-slate-950/80 border border-slate-900 rounded p-2 font-mono text-[7.5px] leading-relaxed text-slate-300 h-[64px] overflow-y-auto space-y-1 flex flex-col justify-end select-text">
                    {[...learningLogs].reverse().map((log, lIdx) => (
                      <div key={lIdx} className="truncate">
                        <span className="text-teal-500">❯</span> {log}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div className="pt-0.5 flex gap-2">
                  <button
                    onClick={() => {
                      setIsAiLearning(!isAiLearning);
                      onNotifyLog(
                        isAiLearning
                          ? "Paused Aptara AI situational training model loop."
                          : "Initiated Aptara AI self-supervised reinforcement training loop on live mobile SOD telemetry stream!",
                        isAiLearning ? "info" : "success"
                      );
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-[9.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      isAiLearning
                        ? "bg-amber-950/40 text-amber-400 border border-amber-900/40 hover:bg-amber-900 hover:text-white"
                        : "bg-teal-900/80 text-teal-300 border border-teal-850 hover:bg-teal-600 hover:text-white hover:border-teal-500"
                    }`}
                  >
                    {isAiLearning ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        Pause Calibration Loop
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-teal-400" />
                        Learn Situational Patterns
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setLearningEpochs(0);
                      setLearningLoss(1.05);
                      setLearningLogs([
                        "APTARA-NEURAL: Weights reset to standard uniform template.",
                        "APTARA-NEURAL: Backprop vectors flushed. Awaiting mechatronic frames."
                      ]);
                      setAiClassification("NOMINAL BASELINE");
                      setAttenuationWeights({ VIB: 0.25, TILT: 0.25, DB: 0.25, RTT: 0.25 });
                      onNotifyLog("Flushed Aptara AI mechatronic learning checkpoints. Neural weights refreshed.", "info");
                    }}
                    className="py-2 px-2.5 rounded-lg text-[9px] font-mono font-bold uppercase hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition-all"
                    title="Reset Learner"
                  >
                    Reset Grid
                  </button>
                </div>
              </div>

              {/* UNIVERSAL DESKTOP AND SANDBOX TESTING MODULE */}
              <div className="bg-slate-900/70 border border-indigo-950/80 p-3 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 text-teal-400 animate-spin" style={{ animationDuration: "12s" }} />
                    SOD Calibration Deck
                  </span>
                  <span className="text-[7px] font-mono text-slate-500">(Adjust to calibrate mechatronics)</span>
                </div>
                
                {/* 1. Simulate Vibrations / Acc */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[7.5px] text-slate-400">
                    <span>SEISMIC ENERGY / SHOCK IMPACT</span>
                    <span className="text-teal-400 font-bold">{simulateVibration.toFixed(1)} m/s²</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="22" 
                    step="0.2"
                    value={simulateVibration}
                    onChange={(e) => setSimulateVibration(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>

                {/* 2. Simulate Spatial Roll rotation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[7.5px] text-slate-400">
                    <span>SPATIAL TILT (ROLL DEVIATION)</span>
                    <span className="text-blue-400 font-bold">{simulateRoll}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-90" 
                    max="90" 
                    value={simulateRoll}
                    onChange={(e) => setSimulateRoll(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* 3. Simulate Spatial Pitch rotation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[7.5px] text-slate-400">
                    <span>SPATIAL SLANT (PITCH FORE/AFT)</span>
                    <span className="text-indigo-400 font-bold">{simulatePitch}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-90" 
                    max="90" 
                    value={simulatePitch}
                    onChange={(e) => setSimulatePitch(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* 4. Simulate Microbar Sound Pressure */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[7.5px] text-slate-400">
                    <span>ACOUSTIC SOUND INTENSITY</span>
                    <span className="text-rose-400 font-bold">{simulateDb} dB</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="115" 
                    value={simulateDb}
                    onChange={(e) => setSimulateDb(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                {/* 5. Simulate Battery Status charging */}
                <div className="grid grid-cols-2 gap-3 text-[7.5px] font-mono text-slate-400 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between pb-0.5">
                      <span>BATTERY CHARGE</span>
                      <span className="text-emerald-400">{simulateBattery}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={simulateBattery}
                      onChange={(e) => setSimulateBattery(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-1.5 text-[8.5px] text-slate-300 font-mono select-none cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={simulateBatteryCharging}
                        onChange={(e) => setSimulateBatteryCharging(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 text-teal-600 focus:ring-0 w-3 h-3 cursor-pointer"
                      />
                      <span>Power Interlink (Charging)</span>
                    </label>
                  </div>
                </div>

                {/* 6. Simulate Network Rtt Latency */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[7.5px] text-slate-400 font-mono">
                    <span>LINK DELAY (PROPAGATION LATENCY)</span>
                    <span className="text-indigo-400 font-bold">{simulateLatency} ms</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="150" 
                    value={simulateLatency}
                    onChange={(e) => setSimulateLatency(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleStopMobileInterlink}
                className="w-full py-2 bg-rose-950/20 hover:bg-rose-950 text-rose-400 hover:text-white border border-rose-900/60 hover:border-rose-800 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-center font-bold"
              >
                Disable SOD Interlink
              </button>
            </div>
          )}
        </div>

        {/* Local Telemetry Station Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 flex-grow overflow-y-auto max-h-[300px] lg:max-h-none shadow-xl">
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1">
            Sensor Grid Status
          </h3>
          <div className="space-y-1.5 flex-1">
            {sensors.map((s) => (
              <div 
                key={s.id} 
                onClick={() => handleSelectSensor(s)}
                className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  selectedSensor === s.id 
                    ? "bg-blue-950/40 border-blue-500/50 text-blue-200 shadow-[0_0_8px_rgba(59,130,246,0.15)]" 
                    : "bg-slate-950/40 border-slate-850 hover:bg-slate-900/60 text-slate-300"
                }`}
              >
                <div>
                  <span className={`font-heading text-xs font-medium block ${selectedSensor === s.id ? "text-blue-400 font-bold" : "text-slate-200"}`}>{s.name}</span>
                  <span className="font-mono text-[9px] text-slate-500">{s.location}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-slate-400 font-medium block">{s.value}</span>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                    s.status === "warning" ? "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]" : s.status === "calibrating" ? "bg-blue-500 shadow-[0_0_4px_rgba(37,99,235,0.5)]" : "bg-emerald-400"
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

      {/* Aptara AI Situational Prognostic Core */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 md:p-5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2 rounded bg-teal-950 text-teal-400 font-mono text-[8px] font-bold tracking-widest border border-teal-900/60 uppercase">CIEM INTEL CORE</span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">PROGNOSIS MODULE v3.1</span>
            </div>
            <h3 className="font-heading text-sm md:text-base font-bold text-slate-100 uppercase tracking-widest mt-1 flex items-center gap-2">
              <Brain className="w-5 h-5 text-teal-400 animate-pulse" />
              APTARA AI Situational Prognostic Core
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
              Analyze multi-channel satellite swarms, deep acoustic geological nodes, and SOD mechatronics to predict overall feedback awareness and deploy preemptive mitigations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto">
            <button
              onClick={triggerPrediction}
              disabled={isPredicting}
              className={`flex-1 md:flex-none py-2.5 px-5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isPredicting
                  ? "bg-teal-950/45 text-teal-400 border border-teal-900/60"
                  : "bg-teal-600 hover:bg-teal-500 border border-teal-500 text-white shadow-lg hover:shadow-teal-900/20"
              }`}
            >
              {isPredicting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  Predicting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  ⚡ Compile & Predict Awareness
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading state bar */}
        {isPredicting && (
          <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-3 py-10">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-teal-500/20 border-t-2 border-t-teal-400 animate-spin" />
              <Brain className="w-6 h-6 text-teal-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-xs text-teal-400 font-bold tracking-widest block animate-pulse">
                {loadingPhrases[loadingPhraseIndex]}
              </span>
              <span className="font-mono text-[9px] text-slate-500 block">
                Accessing core Indian Engineers & Mechatronics Industries (CIEM) data nodes...
              </span>
            </div>
          </div>
        )}

        {/* Placeholder state when no prediction compiled yet */}
        {!prediction && !isPredicting && (
          <div className="bg-slate-950/40 border border-slate-850/60 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 py-12">
            <Cpu className="w-8 h-8 text-indigo-400/80 animate-pulse" />
            <div className="max-w-md space-y-1">
              <span className="font-heading text-xs uppercase tracking-wider text-slate-300 font-bold block">Telemetry Standby</span>
              <span className="text-[11px] text-slate-400 block leading-relaxed font-sans">
                Aptara AI has not compiled a situational hazard forecast during this session. Hit compile above to coordinate active alerts and real-time mobile calibration parameters into deep analytical forecasts.
              </span>
            </div>
          </div>
        )}

        {/* Prognosis Result Dashboard */}
        {prediction && !isPredicting && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
            
            {/* Box 1: Overall Risk Gauge & Core Summary statement */}
            <div className="lg:col-span-4 bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase font-bold block">1. DECISION INDEX</span>
                <span className="text-xs uppercase font-heading font-extrabold text-slate-350 tracking-wider block mt-1">PLANETARY HAZARD SCORE</span>
                
                {/* Visual Gauge Bar */}
                <div className="my-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* SVG Radial Progress */}
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" className="stroke-slate-800" strokeWidth="4" fill="transparent" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        className={`transition-all duration-1000 ${
                          prediction.overallRiskScore > 75
                            ? "stroke-rose-500"
                            : prediction.overallRiskScore > 45
                            ? "stroke-orange-500"
                            : "stroke-emerald-400"
                        }`}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 - (175.9 * prediction.overallRiskScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-base font-mono font-bold text-white">{prediction.overallRiskScore}%</span>
                  </div>

                  <div>
                    <span className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                      prediction.threatLevel === "SEVERE THREAT"
                        ? "bg-rose-950/40 text-rose-400 border-rose-900"
                        : prediction.threatLevel === "CRITICAL WARNING"
                        ? "bg-orange-950/40 text-orange-400 border-orange-900"
                        : "bg-emerald-950/40 text-emerald-400 border-emerald-900"
                    }`}>
                      {prediction.threatLevel}
                    </span>
                    <span className="text-[9px] text-slate-500 block mt-1 uppercase font-mono">Feedback Threshold</span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 font-mono leading-relaxed bg-slate-900/40 border border-slate-850/60 p-2.5 rounded text-[10px]">
                  <span className="text-teal-400 font-bold block">❯ SYSTEM COGNITIVE OVERVIEW:</span>
                  <p className="text-slate-300 font-sans text-[11px] leading-normal">{prediction.trendAnalysis}</p>
                </div>
              </div>

              <div className="border-t border-slate-850/80 pt-3.5 mt-4 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>Core: CIEM-INTELLIGENCE v3</span>
                <span>Time: {lastPredictionTime}</span>
              </div>
            </div>

            {/* Box 2: Quadrant Hazard Breakdown Analysis */}
            <div className="lg:col-span-4 bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase font-bold block">2. REGIONAL FORESIGHT</span>
                <span className="text-xs uppercase font-heading font-extrabold text-slate-350 tracking-wider block mt-1">QUADRANT PROGNOSES</span>

                <div className="mt-4 space-y-3">
                  {prediction.sectorBreakdown?.map((quad: any, qIdx: number) => (
                    <div key={qIdx} className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-lg space-y-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-slate-250 font-bold">{quad.sectorKey}</span>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${
                          quad.status === "critical"
                            ? "bg-rose-950/30 text-rose-400 border-rose-900/50"
                            : quad.status === "degraded"
                            ? "bg-amber-950/30 text-amber-500 border-amber-900/50"
                            : "bg-emerald-950/30 text-emerald-400 border-emerald-900/50"
                        }`}>
                          {quad.status}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed pt-0.5">{quad.analysis}</p>
                    </div>
                  ))}
                </div>
              </div>

              {prediction.isSimulated && (
                <div className="text-[8.5px] font-mono text-amber-550/85 bg-amber-950/10 border border-amber-900/15 p-1.5 rounded mt-3 text-center">
                  * Dynamic simulation running locally under offline standards.
                </div>
              )}
            </div>

            {/* Box 3: Strategic Long-Term Foresight & Actions */}
            <div className="lg:col-span-4 bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col justify-between gap-4">
              <div>
                <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase font-bold block">3. PRESCRIPTIVE CORE</span>
                <span className="text-xs uppercase font-heading font-extrabold text-slate-350 tracking-wider block mt-1">DIRECTIVE DRONE COORDS</span>

                {/* Long term forecasting statement list */}
                <div className="mt-3.5 space-y-2 bg-slate-900/30 border border-slate-850/40 p-2.5 rounded-lg font-sans">
                  <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider font-bold block">LONG-RANGE MODULATION MODEL</span>
                  {prediction.longTermForecast?.map((fc: string, fIdx: number) => (
                    <div key={fIdx} className="flex gap-1.5 text-[10px] text-slate-300 leading-normal">
                      <span className="text-teal-400 font-mono mt-0.5">•</span>
                      <span>{fc}</span>
                    </div>
                  ))}
                </div>

                {/* Mitigation Interactive directives */}
                <div className="space-y-2 mt-4">
                  <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider font-bold block">MITIGATION ACTIONS (CIEM FORMULA LOCKS)</span>
                  <div className="space-y-1.5">
                    {prediction.mitigationDirectives?.map((mit: any, mIdx: number) => (
                      <button
                        key={mIdx}
                        onClick={() => {
                          onNotifyLog(`[APTARA EXEC CORE]: Deploying operational formula [${mit.action}] - Dispatching drone swarm vectors... SUCCESS.`, "success");
                        }}
                        className="w-full text-left p-2 rounded-lg border border-slate-850 bg-slate-900/50 hover:bg-slate-800 transition-all flex items-start gap-2 group cursor-pointer"
                      >
                        <span className={`text-[7.5px] font-mono font-bold px-1 py-0.2 rounded border mt-0.5 ${
                          mit.priority === "HIGH"
                            ? "bg-rose-950/40 text-rose-400 border-rose-900"
                            : mit.priority === "MEDIUM"
                            ? "bg-amber-950/40 text-amber-400 border-amber-900"
                            : "bg-teal-950/40 text-teal-400 border-teal-900"
                        }`}>
                          {mit.priority}
                        </span>
                        <div className="flex-1">
                          <span className="text-[10px] font-mono font-bold text-slate-200 block group-hover:text-teal-400 transition-all">{mit.action}</span>
                          <span className="text-[9px] text-slate-400 block leading-tight font-sans mt-0.2">{mit.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[8px] font-mono text-slate-400 italic self-end block text-right mt-1">
                Founder Mano Mathen John's climate defense matrix code locked.
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
