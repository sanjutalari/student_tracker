import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFocusIndex,
  getFatigueRisk,
  stepWearableSimulation,
  WearableMetrics,
} from './wearable';

test('calculateFocusIndex produces high score for optimal HRV and resting heart rate', () => {
  const score = calculateFocusIndex(80, 68, 70);
  assert.ok(score >= 75, `Expected score >= 75 for optimal state, got ${score}`);
});

test('calculateFocusIndex produces lower score for low HRV and stressed heart rate', () => {
  const highStressScore = calculateFocusIndex(25, 105, 70);
  const calmScore = calculateFocusIndex(75, 68, 70);
  assert.ok(highStressScore < calmScore, 'Stress score should be lower than calm focus score');
});

test('getFatigueRisk escalates as study minutes and stress rise', () => {
  const early = getFatigueRisk(20, 25);
  assert.equal(early.risk, 'low');

  const mid = getFatigueRisk(55, 30);
  assert.equal(mid.risk, 'moderate');

  const longExhausting = getFatigueRisk(95, 40);
  assert.equal(longExhausting.risk, 'high');

  const highStressFatigue = getFatigueRisk(65, 75);
  assert.equal(highStressFatigue.risk, 'high');
});

test('stepWearableSimulation adjusts biometrics towards targeted state', () => {
  const initial: WearableMetrics = {
    heartRate: 75,
    hrvMs: 55,
    focusScore: 60,
    stressScore: 40,
    activeMinutesToday: 120,
    sleepHours: 7.5,
    sleepQualityScore: 85,
    postureStatus: 'good',
    batteryPct: 92,
    isConnected: true,
    deviceName: 'Vignan Pulse Band Pro',
  };

  const nextFocus = stepWearableSimulation(initial, 'deep_focus');
  assert.ok(nextFocus.heartRate <= initial.heartRate + 2);
  assert.ok(nextFocus.hrvMs >= initial.hrvMs - 2);
  assert.ok(nextFocus.stressScore <= initial.stressScore + 2);
});
