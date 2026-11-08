import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateDaySpecificStudyPlan,
  parseHomeworkFromVoiceText,
  calculateSkillProgression,
  HomeworkItem,
  SkillTracker,
  ClassSession,
} from './studyPlanner';

test('generateDaySpecificStudyPlan generates study blocks tailored to Monday classes', () => {
  const activeSkill: SkillTracker = {
    id: 'sk-1',
    name: 'Full-Stack React & Node',
    category: 'Web Engineering',
    targetHours: 60,
    completedHours: 32,
    masteryPercentage: 64,
    currentTopic: 'React Server State & TanStack Query',
    topicsCovered: [],
    recentSessions: [],
  };

  const mondayClasses: ClassSession[] = [
    { subjectCode: 'CS301', subjectName: 'Design & Analysis of Algorithms', startTime: '08:15', endTime: '09:15', faculty: 'Dr. K. Sravan' },
    { subjectCode: 'CS302', subjectName: 'Operating Systems', startTime: '09:15', endTime: '10:15', faculty: 'Dr. K. Sravan' },
  ];

  const homework: HomeworkItem[] = [
    {
      id: 'hw-1',
      title: 'DAA Dijkstra Problem Set',
      subject: 'CS301 - DAA',
      assignedByFaculty: 'Dr. K. Sravan',
      dueDate: '2026-11-08',
      estimatedMinutes: 45,
      reminderSet: true,
      completed: false,
    },
  ];

  const plan = generateDaySpecificStudyPlan({
    dayName: 'Monday',
    classesForDay: mondayClasses,
    homeworkList: homework,
    activeSkill,
    studyStartTime: '16:00',
  });

  assert.ok(plan.length >= 4);

  // First should be post-college transition
  assert.equal(plan[0].type, 'break');
  assert.equal(plan[0].startTime, '16:00');

  // Should contain revision for CS301
  const revBlock1 = plan.find((b) => b.subjectCode === 'CS301');
  assert.ok(revBlock1);
  assert.equal(revBlock1?.type, 'class_revision');

  // Should contain skill upscaling block
  const skillBlock = plan.find((b) => b.type === 'skill_time');
  assert.ok(skillBlock);
  assert.equal(skillBlock?.skillName, 'Full-Stack React & Node');

  // Should contain homework block
  const hwBlock = plan.find((b) => b.type === 'homework');
  assert.ok(hwBlock);
});

test('generateDaySpecificStudyPlan changes study blocks for Tuesday classes', () => {
  const activeSkill: SkillTracker = {
    id: 'sk-1',
    name: 'Full-Stack React & Node',
    category: 'Web Engineering',
    targetHours: 60,
    completedHours: 32,
    masteryPercentage: 64,
    currentTopic: 'React Server State',
    topicsCovered: [],
    recentSessions: [],
  };

  const tuesdayClasses: ClassSession[] = [
    { subjectCode: 'CS305', subjectName: 'Web Technologies & Cloud', startTime: '08:15', endTime: '09:15', faculty: 'Prof. Ananya Rao' },
  ];

  const plan = generateDaySpecificStudyPlan({
    dayName: 'Tuesday',
    classesForDay: tuesdayClasses,
    homeworkList: [],
    activeSkill,
    studyStartTime: '16:00',
  });

  const revBlock = plan.find((b) => b.subjectCode === 'CS305');
  assert.ok(revBlock);
  assert.ok(revBlock?.title.includes('CS305'));
});

test('parseHomeworkFromVoiceText extracts homework items correctly', () => {
  const transcript = 'I have DAA Dijkstra assignment and OS lab questions';
  const items = parseHomeworkFromVoiceText(transcript);
  assert.ok(items.length >= 2);
  assert.equal(items[0].subject, 'CS301 - DAA');
  assert.equal(items[1].subject, 'CS302 - OS');
});

test('calculateSkillProgression increments completed hours and updates mastery', () => {
  const skill: SkillTracker = {
    id: 'sk-1',
    name: 'Data Structures in Java',
    category: 'Algorithms',
    targetHours: 50,
    completedHours: 25,
    masteryPercentage: 50,
    currentTopic: 'Binary Search Trees',
    topicsCovered: [],
    recentSessions: [],
  };

  const progress = calculateSkillProgression(skill, 60);
  assert.equal(progress.newCompletedHours, 26);
  assert.equal(progress.newMasteryPercentage, 52);
  assert.equal(progress.gainedPercentage, 2);
});
