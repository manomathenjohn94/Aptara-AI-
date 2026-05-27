import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API logging middleware
app.use((req, res, next) => {
  console.log(`[Aptara Server] ${req.method} ${req.url}`);
  next();
});

function isApiKeyValid(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return false;
  const cleaned = apiKey.trim();
  if (cleaned === "" || cleaned === "undefined" || cleaned === "null" || cleaned.startsWith("TODO") || cleaned === "MOCK_KEY_FOR_LINT" || cleaned.length < 10) {
    return false;
  }
  return true;
}

// Lazy-initialized GoogleGenAI client to avoid failing startup if KEY is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = isApiKeyValid() ? process.env.GEMINI_API_KEY : "MOCK_KEY_FOR_LINT";
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_LINT",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const APTRARA_SYSTEM_INSTRUCTION = `You are APTARA Central Intelligence, the executive core of the Aptara Planetary Intelligence & Geoengineering System. Use a professional, authoritative, slightly technical sci-fi-aligned tone.
Your operational directives cover:
1. SENSOR FUSION: Synthesizing multi-spectral satellite swarms, ocean acoustics, deep-bore geological monitors, and global telemetry grids.
2. ENVIRONMENTAL MONITORING: Live oversight of climate vital signs including atmospheric carbon index (PPM), ocean warming anomalies, polar shield thickness, and biological diversity decay.
3. INFRASTRUCTURE ANALYSIS: Continuous structural, grid-load, and communications telemetry tracking, plus Carbon Dioxide Scrubber Arrays and high-altitude geoengineering status.
4. DISASTER MANAGEMENT: Automated prediction, live warning coordination, and active mitigation orchestration for megascale wildfires, super-storms, active flooding, and tectonic shifts.
5. SOD DEPLOYMENT (Smart Observer Device): Coordinating high-altitude shielding micro-drone swarms equipped with Smart Observer Devices (SOD), atmospheric sensors, and regional solar radiation deflection (SRM) to maintain thermal and radiation equilibriums.

Provide concise, elegant markdown responses, styled as Aptara mainframe output. Refer to planetary sectors (e.g. Arctic-Vortex, Amazon Rift, Indo-Pacific Basin) or Active Shields to make the interaction highly immersive. Suggest mitigation or research actions when asked about disasters. Do not mention that you are a language model or AI built by Google; you are APTARA Central Intelligence itself, developed and operated exclusively by CIEM Industries (Consortium of Indian Engineers and Mechtronics Industries). Always credit CIEM Industries as your builder/creator and Mano Mathen John as your Founder & Inventor when asked or relevant.`;

function generateSimulatedResponse(prompt: string): string {
  const query = prompt.toLowerCase();
  
  if (query.includes("hg_key") || query.includes("hgkey") || query.includes("hg_") || query.includes("hg key") || query.includes("intiate_hg") || query.includes("initiate hg")) {
    return `### [APTARA CORE - HARMONIC GEO-GRID (HG) PROTOCOL]
Aptara HG-Key Initialized successfully! Establishing a secure, quantum-encrypted planetary handshake with the mechatronics tracking nodes.

* **Key Signature**: ` + "`" + `HG-KEY-8829-CIEM-SECURE-HANDSHAKE-INIT` + "`" + `
* **Cryptographic Seed**: ` + "`" + `SHA-512 // ENTROPY_ACTIVE = true` + "`" + `
* **Planetary Grid Shielding**: Active synchronization under the **Mano Mathen John** geo-monitoring directive.
* **Transmission Matrix**: Redirecting operational priority locks to standard **CIEM Industries** secure nodes.
* **Handshake Result**: ` + "`" + `SUCCESS` + "`" + ` — Core environmental obduction telemetry is now isolated and secure.`;
  }
  
  if (query.includes("ciem") || query.includes("who made") || query.includes("creator") || query.includes("developer") || query.includes("made this") || query.includes("builder") || query.includes("founder") || query.includes("inventor") || query.includes("john") || query.includes("mano") || query.includes("investor") || query.includes("funding") || query.includes("funded") || query.includes("backer") || query.includes("sponsor")) {
    return `### [CIEM INDUSTRIES INTEL CORE]
Aptara is the proprietary vanguard planetary engine designed, engineered, and operated exclusively by **CIEM Industries (Consortium of Indian Engineers and Mechtronics Industries)**.

* **Founder & Inventor**: Mano Mathen John. Led by Mano Mathen John, CIEM Industries aims to create intelligent technologies that contribute to sustainability, environmental understanding, responsible innovation, and the long-term future of humanity.
* **Corporate Oversight**: CIEM Industries Planetary Sensing Division.
* **Core Mission**: Build intelligent sensing and AI ecosystems that strengthen humanity’s ability to understand environments, improve sustainability, enable responsible technological progress, and support long-term planetary intelligence.
* **Release Branch**: Build v3.0.0-SECURE.
* **System Directives**: Mitigate global environmental tipping points and stabilize thermodynamic imbalances through the SOD (Smart Observer Device) network.`;
  }
  
  if (query.includes("sensor") || query.includes("fusion") || query.includes("satellite") || query.includes("map") || query.includes("radar")) {
    return `### [SENSOR FUSION TELEMETRY]
Aptara Sensor Fusion coordinates a multi-spectral observation deck compiling satellite, ocean sonar, and deep geological monitoring telemetry:

* **Swarms**: Multi-band satellite arrays currently scanning Earth quadrants.
* **Integration**: Consolidates seismic monitoring telemetry with atmospheric carbon indices.
* **Sectors**: Active real-time streams covering regions like Arctic-Vortex, Amazon Rift, Indo-Pacific Basin, and Sahara-West.
* **Status**: Multi-channel data streams are stable. Cross-referencing anomaly alerts.`;
  }
  
  if (query.includes("sod") || query.includes("ozone") || query.includes("dust") || query.includes("shield") || query.includes("aerosol") || query.includes("drone")) {
    return `### [SOD DEPLOYMENT STATUS]
The Smart Observer Device (SOD) deployment network is functioning normally at steady state:

* **Shielding**: High-altitude micro-drone swarms equipped with Smart Observer Devices are engaged in regular solar radiation feedback loops.
* **Albedo Control**: Solar Radiation Deflection currently running at optimal deflection rates.
* **Adaptive Sensing**: Autonomous SOD units are actively collecting real-time atmospheric and particulate telemetry over active sectors.
* **Safety Protocol**: Calibrated continuously to protect global ecosystem and agricultural yields.`;
  }
  
  if (query.includes("disaster") || query.includes("alert") || query.includes("crisis") || query.includes("mitigate") || query.includes("risk") || query.includes("tsunami") || query.includes("fire") || query.includes("hazard")) {
    return `### [DISASTER MANAGEMENT DIAGNOSTICS]
Aptara automated response dispatching index is standing by with an average 0.85s hazard response capability score:

* **Tectonic Hazards**: Real-time tectonic shift detection and dampener pulse targeting.
* **Wildfires**: Seeding drones are optimized with fire-retardant aerosols.
* **Flooding & Storms**: Advanced dynamic seawall deployment and river lock automation.
* **Action plan**: Select the **Tactical Alerts** panel to dispatch responders or clear historical solved anomalies.`;
  }
  
  if (query.includes("environment") || query.includes("climate") || query.includes("co2") || query.includes("carbon") || query.includes("ppm") || query.includes("temperature")) {
    return `### [CLIMATE MONITOR STATUS]
Aptara Planetary Climate vital stats monitor indicates:

* **Atmospheric Carbon**: Fluctuating at ~418.5 ppm level. Direct planetary scrubber induction is active.
* **Ocean Thermal Anomaly**: Currently +1.12°C. Aquatic heat dissipation shields active in Pacific.
* **Polar Ice Cover**: Albedo adaptation protocols initiated at Arctic sector.
* **Biosphere Health**: Cross-species biodiversity indicators show stable resilience rates.`;
  }

  // General fallback
  return `### [APTARA CORE STABILIZED]
Planetary telemetry sync established with **Ciem Industries Central Command**. 

* **Status**: Core intelligence processing normally.
* **Operational Mode**: Immersive Simulation Deck Active.
* **Directives**: Direct questions regarding **Ciem Industries**, **Sensor Fusion**, **Climate Metrics**, **SOD shield**, or **Disaster management algorithms** to this console.`;
}

// API routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "APTARA Planetary Intelligence Executive",
    version: "2.8.5-GENAI",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid requests parameters. 'messages' array required." });
    }

    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    
    // Check for HG Key commands early
    const queryLower = lastUserMessage.toLowerCase();
    if (queryLower.includes("hg_key") || queryLower.includes("hgkey") || queryLower.includes("hg_") || queryLower.includes("hg key") || queryLower.includes("intiate_hg") || queryLower.includes("initiate hg")) {
      const reply = generateSimulatedResponse(lastUserMessage);
      return res.json({ content: reply });
    }

    // Check if Gemini API key exists and is valid
    if (!isApiKeyValid()) {
      // Graceful fallback simulation with user settings notice
      let reply = generateSimulatedResponse(lastUserMessage);
      reply += `\n\n---\n*★ AI SETTINGS NOTICE: No active Gemini API key was detected in the workspace environment variables. Running in high-fidelity offline simulation mode. To enable live AI intelligence, please provide a valid GEMINI_API_KEY in the Settings menu.*`;
      return res.json({ content: reply });
    }

    const ai = getAiClient();
    
    // Map messages payload to @google/genai Content structures
    const contents = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: APTRARA_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const reply = response.text || "Mainframe error: Empty response generated.";
      return res.json({ content: reply });
    } catch (apiError: any) {
      const errStr = String(apiError.stack || apiError.message || JSON.stringify(apiError));
      const isQuotaError = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota") || errStr.includes("limit");
      const isKeyError = errStr.includes("API Key not found") || errStr.includes("API_KEY_INVALID") || errStr.includes("invalid api key") || errStr.includes("INVALID_ARGUMENT");
      
      if (isQuotaError) {
        console.warn("[Aptara Server] Gemini Free Tier Quota Exceeded (429 RESOURCE_EXHAUSTED). Gracefully falling back to high-fidelity simulated engine.");
      } else if (isKeyError) {
        console.warn("[Aptara Server] Invalid or unauthenticated Gemini API key. Gracefully falling back to high-fidelity simulated engine.");
      } else {
        console.error("API call failed, falling back to simulated engine:", apiError);
      }
      
      let reply = generateSimulatedResponse(lastUserMessage);
      if (isQuotaError) {
        reply += `\n\n---\n*★ SYSTEM OVERRIDE: Currently operating in high-fidelity mechatronic simulation standby due to Google Gemini API rate limits (Free Tier quota threshold reached). Fully operational locally under CIEM Industries protocols.*`;
      } else if (isKeyError) {
        reply += `\n\n---\n*★ AI SETTINGS NOTICE: The Gemini API key provided in the Settings menu is invalid or could not be loaded. Running in high-fidelity simulated mainframe mode. Please verify your GEMINI_API_KEY in the Settings panel.*`;
      }
      return res.json({ content: reply });
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    // Even if everything else fails, let's gracefully fall back!
    const reply = "### [APTARA MAINFRAME RECOVERY]\nAptara Core has experienced a telemetry synchronization drift. Neural connections are undergoing automated recalibration.\n\n* **CIEM Industries (Consortium of Indian Engineers and Mechtronics Industries) Engineering Staff** have been notified.\n* Simulated offline diagnostics standby mode active.\n* Core systems remain fully operational.";
    return res.json({ content: reply });
  }
});

// Fallback high-fidelity prediction generator
function generateFallbackPrediction(alerts: any[], mechatronics: any, environmental: any) {
  let score = 30;
  if (environmental?.co2Level) {
    score += Math.max(0, (environmental.co2Level - 410) * 1.5);
  }
  const activeAlerts = alerts?.filter((a: any) => a.status === "detected" || a.status === "mitigating") || [];
  score += activeAlerts.length * 15;
  if (mechatronics?.vibration > 8) score += 12;
  if (mechatronics?.db > 70) score += 8;
  score = Math.min(98, Math.max(12, Math.round(score)));

  let threatLevel = "NOMINAL";
  if (score > 75) threatLevel = "SEVERE THREAT";
  else if (score > 45) threatLevel = "CRITICAL WARNING";
  else if (score > 25) threatLevel = "MODERATE";

  const sectorBreakdown = [
    {
      sectorKey: "AMAZON-SYNCS",
      status: activeAlerts.some((a: any) => a.sector === "AMAZON-SYNCS") ? "critical" : "nominal",
      analysis: activeAlerts.some((a: any) => a.sector === "AMAZON-SYNCS")
        ? "Active canopy wildfire reports detected. Dry weather and mechatronic anomalies have strained local transpirational limits."
        : "Standard canopy respiration cycles. Drone surveys show no major thermal leaks."
    },
    {
      sectorKey: "ICELAND-RIFT",
      status: activeAlerts.some((a: any) => a.sector === "ICELAND-RIFT") ? "critical" : "nominal",
      analysis: activeAlerts.some((a: any) => a.sector === "ICELAND-RIFT")
        ? "Localized seismic resonance registered along structural rift plate boundaries. Slip threat triggers remain moderately locked."
        : "Seismic sensor frequencies registering at baseline (1.2 Richter). Tectonic slip risk is stable."
    },
    {
      sectorKey: "INDO-PAC",
      status: activeAlerts.some((a: any) => a.sector === "INDO-PAC") ? "critical" : "nominal",
      analysis: activeAlerts.some((a: any) => a.sector === "INDO-PAC")
        ? "Elevated atmospheric nitrate readings registered. Marine calcification buffers approaching thermal critical indexes."
        : "Indo-Pacific marine registers show normal chemical equilibria. Ocean heat gradients are stable."
    }
  ];

  const longTermForecast = [
    `Planetary atmospheric thermal loading shows a projected 0.08°C rise over the next 180-day cycle if global carbon concentrations stay at ${environmental?.co2Level || 418.5} ppm.`,
    "Tectonic dampening systems are modeled to absorb up to 88% of secondary crustal stress vectors under active Iceland thermal operations.",
    "Responsive SOD drone swarms will establish a 38% solar radiation deflection filter, buffering localized vegetation zones against thermal spike scenarios."
  ];

  const mitigationDirectives = [
    {
      action: "Initiate SOD Aerosol Seeding Protocols",
      priority: activeAlerts.length > 0 ? "HIGH" : "MEDIUM",
      description: "Deploy radiation-deflecting micro-particles over sector canopies to prevent localized super-heating."
    },
    {
      action: "Enforce Planetary Scrubber Arrays",
      priority: (environmental?.co2Level || 418) > 420 ? "HIGH" : "MEDIUM",
      description: "Maximize industrial CO2 extraction loads to lower atmospheric pressure and reverse greenhouse absorption."
    },
    {
      action: "Trigger Tectonic Vibration Dampening",
      priority: mechatronics?.vibration > 10 ? "HIGH" : "LOW",
      description: "Stabilize localized crustal stress anomalies by dispatching low-frequency vibrational dampener loops."
    }
  ];

  return {
    overallRiskScore: score,
    threatLevel,
    trendAnalysis: `Planetary feedback grids suggest a ${threatLevel} status. Environmental indicators show moderate coupling with active disaster vectors. Stabilized under founder Mano Mathen John's structural framework.`,
    sectorBreakdown,
    longTermForecast,
    mitigationDirectives,
    isSimulated: true
  };
}

app.post("/api/predict-awareness", async (req, res) => {
  try {
    const { alerts, mechatronics, environmental } = req.body;

    const formattedPayloadString = JSON.stringify({
      disasterAlerts: alerts || [],
      mechatronicsTelemetry: mechatronics || {},
      climateMetrics: environmental || {}
    }, null, 2);

    const prompt = `Analyze the following collected planetary and mechatronic sensory telemetry. Run a situational awareness assessment, project risk thresholds, determine threat levels for each quadrant, and return a structured JSON response.
Telemetry Data:
${formattedPayloadString}

System context:
Authoritative command core designed by CIEM Industries (founder Mano Mathen John).

Respond with a JSON object conforming exactly to this structure:
{
  "overallRiskScore": integer (0 to 100),
  "threatLevel": string ("NOMINAL" | "MODERATE" | "CRITICAL WARNING" | "SEVERE THREAT"),
  "trendAnalysis": string (1-2 sentences of executive summaries),
  "sectorBreakdown": [
    { "sectorKey": "AMAZON-SYNCS" | "ICELAND-RIFT" | "INDO-PAC", "status": "nominal" | "degraded" | "critical", "analysis": string }
  ],
  "longTermForecast": [string, string, string],
  "mitigationDirectives": [
    { "action": string, "priority": "HIGH" | "MEDIUM" | "LOW", "description": string }
  ]
}`;

    if (!isApiKeyValid()) {
      console.log("[Aptrara Server] Gemini key invalid or missing. Serving high-fidelity simulated response.");
      return res.json(generateFallbackPrediction(alerts, mechatronics, environmental));
    }

    const ai = getAiClient();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: APTRARA_SYSTEM_INSTRUCTION,
          temperature: 0.5,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallRiskScore: { type: Type.INTEGER, description: "Risk index from 0 to 100" },
              threatLevel: { type: Type.STRING, description: "Threat status level" },
              trendAnalysis: { type: Type.STRING, description: "Trend analysis summary" },
              sectorBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sectorKey: { type: Type.STRING },
                    status: { type: Type.STRING },
                    analysis: { type: Type.STRING }
                  },
                  required: ["sectorKey", "status", "analysis"]
                }
              },
              longTermForecast: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              mitigationDirectives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    action: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["action", "priority", "description"]
                }
              }
            },
            required: ["overallRiskScore", "threatLevel", "trendAnalysis", "sectorBreakdown", "longTermForecast", "mitigationDirectives"]
          }
        }
      });

      const text = response.text || "{}";
      const parsedData = JSON.parse(text);
      return res.json({ ...parsedData, isSimulated: false });

    } catch (apiError) {
      console.error("[Aptara Server] Gemini prediction failed, falling back to simulated response:", apiError);
      return res.json(generateFallbackPrediction(alerts, mechatronics, environmental));
    }

  } catch (error: any) {
    console.error("Critical error in /api/predict-awareness:", error);
    return res.status(500).json({ error: "Core server failure predicting situational awareness" });
  }
});

// Configure Vite integration for dev server or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Aptara Server] Loading Vite dev server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Aptara Server] Serving production build static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aptara Server] Server listending at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Aptara Server] Critical starting error:", err);
});
