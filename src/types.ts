export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface PlanetarySector {
  id: string;
  name: string;
  status: "nominal" | "degraded" | "critical";
  temperatureAnomaly: number; // in C
  co2Level: number; // in ppm
  ozoneDensity: number; // in Dobson Units (DU), nominal is ~300
  droneDeployment: number; // % deployed
}

export interface InfrastructureNode {
  id: string;
  name: string;
  type: "Carbon Scrubber" | "Geothermal Tap" | "Aerosol Dispenser" | "Sonar Grid";
  sector: string;
  status: "active" | "online" | "maintenance" | "standby";
  efficiency: number; // %
}

export interface DisasterAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  sector: string;
  status: "detected" | "mitigating" | "resolved";
  mitigationProgress: number; // 0 to 100
}

export interface LocalAlert extends DisasterAlert {
  trendHistory: number[];
  detectionTime: string;
  resolvedTime?: string;
}

export interface GlobalHealthMetrics {
  co2Index: number; // ppm
  globalTemp: number; // Anomaly in C
  biodiversityIndex: number; // 0-1 scale
  glacialIceCoverage: number; // % remaining
  srmLevel: number; // Solar radiation management aerosol load %
}
