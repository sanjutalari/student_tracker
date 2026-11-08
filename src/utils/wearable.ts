export interface WearableMetrics {
  heartRate: number;        // BPM (e.g. 72)
  hrvMs: number;            // HRV in ms (e.g. 62)
  focusScore: number;       // 0 - 100%
  stressScore: number;      // 0 - 100%
  activeMinutesToday: number;
  sleepHours: number;       // e.g. 7.8
  sleepQualityScore: number;// e.g. 88%
  postureStatus: 'good' | 'slouching' | 'standing' | 'resting';
  batteryPct: number;
  isConnected: boolean;
  deviceName: string;
  lastSyncTime?: string;
}

export type WearableSimulationMode = 'normal' | 'deep_focus' | 'stress_cram' | 'fatigue';

/**
 * Focus Index algorithm:
 * High HRV with steady resting heart rate correlates with parasympathetic calmness and high cognitive focus.
 * Elevated heart rate above baseline with low HRV indicates elevated stress or distraction.
 */
export function calculateFocusIndex(
  hrvMs: number,
  heartRate: number,
  baselineRestingHr: number = 70
): number {
  // Normalize HRV: optimal HRV for cognitive tasks is 50-90 ms
  const clampedHrv = Math.max(20, Math.min(100, hrvMs));
  const hrvFactor = (clampedHrv - 20) / 80; // 0 to 1

  // HR difference: closer to baseline (or slightly below) is steady
  const hrDelta = Math.abs(heartRate - baselineRestingHr);
  const hrStabilityFactor = Math.max(0, 1 - hrDelta / 40); // 0 to 1

  const rawScore = hrvFactor * 55 + hrStabilityFactor * 45;
  return Math.round(Math.max(10, Math.min(98, rawScore)));
}

/**
 * Determine cognitive fatigue risk based on study duration and stress score
 */
export function getFatigueRisk(
  continuousStudyMinutes: number,
  stressScore: number
): { risk: 'low' | 'moderate' | 'high'; message: string } {
  if (continuousStudyMinutes >= 90 || (continuousStudyMinutes >= 60 && stressScore > 65)) {
    return {
      risk: 'high',
      message: 'High cognitive fatigue detected. Take a 10-minute break to restore mental clarity.',
    };
  }

  if (continuousStudyMinutes >= 50 || stressScore > 50) {
    return {
      risk: 'moderate',
      message: 'Approaching fatigue threshold. Hydrate and stretch soon.',
    };
  }

  return {
    risk: 'low',
    message: 'Cognitive state optimal for deep learning.',
  };
}

/**
 * Generate smooth, realistic biometric fluctuation for wearable simulation
 */
export function stepWearableSimulation(
  current: WearableMetrics,
  mode: WearableSimulationMode
): WearableMetrics {
  let targetHr = 72;
  let targetHrv = 65;
  let targetStress = 25;
  let posture: WearableMetrics['postureStatus'] = 'good';

  switch (mode) {
    case 'deep_focus':
      targetHr = 68;
      targetHrv = 78;
      targetStress = 18;
      posture = 'good';
      break;
    case 'stress_cram':
      targetHr = 96;
      targetHrv = 32;
      targetStress = 78;
      posture = 'slouching';
      break;
    case 'fatigue':
      targetHr = 82;
      targetHrv = 42;
      targetStress = 62;
      posture = 'slouching';
      break;
    case 'normal':
    default:
      targetHr = 74;
      targetHrv = 62;
      targetStress = 30;
      posture = 'good';
      break;
  }

  // Jitter
  const hrJitter = (Math.random() - 0.5) * 2;
  const newHr = Math.round(current.heartRate + (targetHr - current.heartRate) * 0.2 + hrJitter);

  const hrvJitter = (Math.random() - 0.5) * 3;
  const newHrv = Math.round(current.hrvMs + (targetHrv - current.hrvMs) * 0.2 + hrvJitter);

  const newStress = Math.round(current.stressScore + (targetStress - current.stressScore) * 0.2);
  const newFocus = calculateFocusIndex(newHrv, newHr, 70);

  return {
    ...current,
    heartRate: Math.max(50, Math.min(130, newHr)),
    hrvMs: Math.max(20, Math.min(110, newHrv)),
    stressScore: Math.max(5, Math.min(95, newStress)),
    focusScore: newFocus,
    postureStatus: posture,
    lastSyncTime: current.lastSyncTime || 'Just now',
  };
}
