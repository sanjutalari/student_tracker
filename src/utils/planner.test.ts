import test from 'node:test';
import assert from 'node:assert/strict';
import {
  timeToMinutes,
  checkIntervalOverlap,
  detectScheduleConflicts,
  calculateStudyTotals,
  prioritizeTasks,
  TimeSlot,
  TaskItem,
} from './planner';

test('timeToMinutes converts HH:MM strings correctly', () => {
  assert.equal(timeToMinutes('08:15'), 495);
  assert.equal(timeToMinutes('09:15'), 555);
  assert.equal(timeToMinutes('00:00'), 0);
  assert.equal(timeToMinutes('12:30'), 750);
});

test('checkIntervalOverlap detects overlapping and non-overlapping slots', () => {
  // Overlapping
  assert.equal(checkIntervalOverlap('08:15', '09:15', '09:00', '10:00'), true);
  // Contiguous (touching but not overlapping)
  assert.equal(checkIntervalOverlap('08:15', '09:15', '09:15', '10:15'), false);
  // Completely separate
  assert.equal(checkIntervalOverlap('08:15', '09:15', '11:00', '12:00'), false);
  // Contained within
  assert.equal(checkIntervalOverlap('08:00', '11:00', '09:00', '10:00'), true);
});

test('detectScheduleConflicts finds timetable collisions correctly', () => {
  const slots: TimeSlot[] = [
    { id: '1', title: 'College - DAA', startTime: '08:15', endTime: '09:15', type: 'class' },
    { id: '2', title: 'College - OS', startTime: '09:15', endTime: '10:15', type: 'class' },
    { id: '3', title: 'DAA Revision', startTime: '09:00', endTime: '10:00', type: 'study' }, // conflicts with #1 & #2
    { id: '4', title: 'Evening Break', startTime: '17:00', endTime: '17:30', type: 'break' },
  ];

  const conflicts = detectScheduleConflicts(slots);
  assert.equal(conflicts.length, 2);
  assert.equal(conflicts[0].slotA.id, '1');
  assert.equal(conflicts[0].slotB.id, '3');
  assert.equal(conflicts[1].slotA.id, '2');
  assert.equal(conflicts[1].slotB.id, '3');
});

test('calculateStudyTotals computes planned, completed minutes, and completion rate', () => {
  const tasks: TaskItem[] = [
    { id: '1', title: 'Task 1', subject: 'DAA', dueDate: '2026-11-08', estimatedMinutes: 45, priority: 'high', completed: true },
    { id: '2', title: 'Task 2', subject: 'OS', dueDate: '2026-11-09', estimatedMinutes: 60, priority: 'urgent', completed: false },
    { id: '3', title: 'Task 3', subject: 'Java', dueDate: '2026-11-10', estimatedMinutes: 45, priority: 'medium', completed: true },
  ];

  const totals = calculateStudyTotals(tasks);
  assert.equal(totals.totalPlannedMinutes, 150);
  assert.equal(totals.completedMinutes, 90);
  assert.equal(totals.completionRate, 60);
});

test('prioritizeTasks sorts urgent tasks first and keeps incomplete tasks above completed ones', () => {
  const tasks: TaskItem[] = [
    { id: '1', title: 'Low completed', subject: 'Art', dueDate: '2026-11-08', estimatedMinutes: 20, priority: 'low', completed: true },
    { id: '2', title: 'Medium pending', subject: 'OS', dueDate: '2026-11-09', estimatedMinutes: 30, priority: 'medium', completed: false },
    { id: '3', title: 'Urgent pending', subject: 'DAA', dueDate: '2026-11-08', estimatedMinutes: 40, priority: 'urgent', completed: false },
    { id: '4', title: 'High pending', subject: 'Java', dueDate: '2026-11-07', estimatedMinutes: 50, priority: 'high', completed: false },
  ];

  const sorted = prioritizeTasks(tasks);
  assert.equal(sorted[0].id, '3'); // Urgent pending
  assert.equal(sorted[1].id, '4'); // High pending
  assert.equal(sorted[2].id, '2'); // Medium pending
  assert.equal(sorted[3].id, '1'); // Completed last
});
