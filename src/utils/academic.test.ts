import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubjectAttendance,
  calculateOverallAttendance,
  SubjectAttendance,
} from './academic';

test('calculateSubjectAttendance correctly calculates percentages and statuses', () => {
  // Safe attendance (80%)
  const safe = calculateSubjectAttendance(32, 40);
  assert.equal(safe.percentage, 80);
  assert.equal(safe.status, 'safe');
  assert.equal(safe.classesNeededFor75, 0);
  assert.ok(safe.canBunkCount >= 2);

  // Warning attendance (70%)
  const warning = calculateSubjectAttendance(28, 40);
  assert.equal(warning.percentage, 70);
  assert.equal(warning.status, 'warning');
  assert.ok(warning.classesNeededFor75 > 0);
  assert.equal(warning.canBunkCount, 0);

  // Critical attendance (60%)
  const critical = calculateSubjectAttendance(24, 40);
  assert.equal(critical.percentage, 60);
  assert.equal(critical.status, 'critical');
  assert.ok(critical.classesNeededFor75 > 0);
});

test('calculateOverallAttendance computes weighted total across all courses', () => {
  const subjects: SubjectAttendance[] = [
    { subjectCode: 'CS301', subjectName: 'Design & Analysis of Algorithms', attendedHours: 35, totalHours: 40 },
    { subjectCode: 'CS302', subjectName: 'Operating Systems', attendedHours: 28, totalHours: 35 },
    { subjectCode: 'CS303', subjectName: 'Computer Networks', attendedHours: 32, totalHours: 35 },
    { subjectCode: 'CS304', subjectName: 'Database Management Systems', attendedHours: 29, totalHours: 30 },
  ];

  const overall = calculateOverallAttendance(subjects);
  assert.equal(overall.totalAttended, 124);
  assert.equal(overall.totalHours, 140);
  assert.equal(overall.overallPercentage, 89);
  assert.equal(overall.status, 'safe');
});
