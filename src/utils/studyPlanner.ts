export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  assignedByFaculty: string;
  dueDate: string;
  estimatedMinutes: number;
  dueTime?: string;
  reminderSet: boolean;
  completed: boolean;
  instructions?: string;
}

export interface SkillTracker {
  id: string;
  name: string;
  category: string;
  targetHours: number;
  completedHours: number;
  masteryPercentage: number;
  currentTopic: string;
  topicsCovered: string[];
  recentSessions: Array<{
    id: string;
    date: string;
    minutes: number;
    topic: string;
    notes?: string;
  }>;
}

export interface AfterCollegeScheduleBlock {
  id: string;
  startTime: string;
  endTime: string;
  type: 'class_revision' | 'skill_time' | 'homework' | 'break' | 'review';
  title: string;
  subjectCode?: string;
  description: string;
  skillName?: string;
  isCompleted?: boolean;
}

// Convert 'HH:MM' to minutes
export function toMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Convert minutes to 'HH:MM' formatted string
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export interface ClassSession {
  subjectCode: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  faculty: string;
}

/**
 * Tuition Teacher Study Hour Planner:
 * Dynamically builds an evening study & skill upscaling plan tailored to the specific day's classes!
 * Changes day by day depending on what the student studied in college that day.
 */
export function generateDaySpecificStudyPlan(params: {
  dayName: string;
  classesForDay: ClassSession[];
  homeworkList: HomeworkItem[];
  activeSkill: SkillTracker;
  studyStartTime?: string; // e.g. "16:00"
}): AfterCollegeScheduleBlock[] {
  const schedule: AfterCollegeScheduleBlock[] = [];
  let currentMin = toMinutes(params.studyStartTime || '16:00');

  // 1. Post-college Refreshment & Daily Overview
  const breakEnd = currentMin + 30;
  schedule.push({
    id: `sched-refresh-${params.dayName}`,
    startTime: minutesToTime(currentMin),
    endTime: minutesToTime(breakEnd),
    type: 'break',
    title: 'Post-College Refreshment & Plan Review',
    description: `Review today's ${params.classesForDay.length} college lecture topics and set up materials.`,
  });
  currentMin = breakEnd;

  // 2. Class Revision Blocks (Directly mapped to today's college subjects!)
  if (params.classesForDay.length > 0) {
    for (let i = 0; i < Math.min(2, params.classesForDay.length); i++) {
      const cls = params.classesForDay[i];
      const revDuration = 35; // 35 minutes per core subject revision
      const revEnd = currentMin + revDuration;

      schedule.push({
        id: `sched-rev-${params.dayName}-${i}`,
        startTime: minutesToTime(currentMin),
        endTime: minutesToTime(revEnd),
        type: 'class_revision',
        subjectCode: cls.subjectCode,
        title: `Revision: ${cls.subjectCode} - ${cls.subjectName}`,
        description: `Review notes taken during ${cls.faculty}'s lecture and summarize core formulas.`,
      });
      currentMin = revEnd;
    }
  } else {
    // Weekend / Self-study day
    const selfEnd = currentMin + 60;
    schedule.push({
      id: `sched-self-${params.dayName}`,
      startTime: minutesToTime(currentMin),
      endTime: minutesToTime(selfEnd),
      type: 'class_revision',
      title: 'Weekend Course Consolidation',
      description: 'Synthesize weekly lecture notes and prepare doubts for faculty.',
    });
    currentMin = selfEnd;
  }

  // 3. Short 15-min Break
  const shortBreakEnd = currentMin + 15;
  schedule.push({
    id: `sched-break-${params.dayName}`,
    startTime: minutesToTime(currentMin),
    endTime: minutesToTime(shortBreakEnd),
    type: 'break',
    title: 'Short Rest & Eye Break',
    description: '15-minute mental reset before deep skill upscaling.',
  });
  currentMin = shortBreakEnd;

  // 4. Dedicated Skill Upscaling Time
  const skillDuration = 60; // 1 hour dedicated skill practice
  const skillEnd = currentMin + skillDuration;
  schedule.push({
    id: `sched-skill-${params.dayName}`,
    startTime: minutesToTime(currentMin),
    endTime: minutesToTime(skillEnd),
    type: 'skill_time',
    title: `Skill Upscaling: ${params.activeSkill.name}`,
    description: `Target topic: ${params.activeSkill.currentTopic}. Practical coding and project building.`,
    skillName: params.activeSkill.name,
  });
  currentMin = skillEnd;

  // 5. Homework & Assignment Problem Solving Block
  const pendingHw = params.homeworkList.filter((h) => !h.completed);
  const hwDuration = Math.min(75, Math.max(45, pendingHw.reduce((acc, h) => acc + h.estimatedMinutes, 0)));
  const hwEnd = currentMin + hwDuration;
  schedule.push({
    id: `sched-hw-${params.dayName}`,
    startTime: minutesToTime(currentMin),
    endTime: minutesToTime(hwEnd),
    type: 'homework',
    title: 'Homework & Assignment Work',
    description: pendingHw.length > 0
      ? `Solve: ${pendingHw.map((h) => h.title).slice(0, 2).join('; ')}`
      : 'Complete faculty assignment problem sets and prep for tomorrow.',
  });
  currentMin = hwEnd;

  return schedule;
}

/**
 * Natural language / voice text parser to extract homework items
 */
export function parseHomeworkFromVoiceText(transcript: string): Array<{
  title: string;
  subject: string;
  estimatedMinutes: number;
}> {
  const text = transcript.trim();
  if (!text) return [];

  const items: Array<{ title: string; subject: string; estimatedMinutes: number }> = [];

  const clauses = text
    .split(/\band\b|\balso\b|\bthen\b|,|\./gi)
    .map((c) => c.trim())
    .filter((c) => c.length > 4);

  for (const clause of clauses) {
    let subject = 'General Studies';
    let minutes = 45;

    const lower = clause.toLowerCase();
    if (lower.includes('daa') || lower.includes('algorithm') || lower.includes('dijkstra') || lower.includes('graph')) {
      subject = 'CS301 - DAA';
      minutes = 60;
    } else if (lower.includes('os') || lower.includes('operating') || lower.includes('page') || lower.includes('kernel')) {
      subject = 'CS302 - OS';
      minutes = 45;
    } else if (lower.includes('network') || lower.includes('cn') || lower.includes('tcp')) {
      subject = 'CS303 - CN';
      minutes = 30;
    } else if (lower.includes('dbms') || lower.includes('database') || lower.includes('sql')) {
      subject = 'CS304 - DBMS';
      minutes = 45;
    } else if (lower.includes('skill') || lower.includes('react') || lower.includes('coding') || lower.includes('leetcode')) {
      subject = 'Skill Learning';
      minutes = 60;
    }

    const cleanTitle = clause.charAt(0).toUpperCase() + clause.slice(1);
    items.push({
      title: cleanTitle,
      subject,
      estimatedMinutes: minutes,
    });
  }

  return items.length > 0 ? items : [{
    title: text,
    subject: 'General Assignment',
    estimatedMinutes: 45,
  }];
}

/**
 * Calculates updated skill mastery and progress
 */
export function calculateSkillProgression(
  skill: SkillTracker,
  sessionMinutes: number,
  _focusScore?: number
): {
  newCompletedHours: number;
  newMasteryPercentage: number;
  gainedPercentage: number;
} {
  const addedHours = sessionMinutes / 60;
  const newCompletedHours = Math.round((skill.completedHours + addedHours) * 10) / 10;
  const newMasteryPercentage = Math.min(100, Math.round((newCompletedHours / skill.targetHours) * 100));
  const gainedPercentage = Math.max(1, newMasteryPercentage - skill.masteryPercentage);

  return {
    newCompletedHours,
    newMasteryPercentage,
    gainedPercentage,
  };
}

/**
 * Backward-compatible helper for after-college checkin schedule generation
 */
export function generateAfterCollegeSchedule(params: {
  collegeEndTime?: string;
  classesAttendedToday?: string[];
  homeworkList: HomeworkItem[];
  activeSkill: SkillTracker;
}): AfterCollegeScheduleBlock[] {
  const classesForDay: ClassSession[] = (params.classesAttendedToday || []).map((c, i) => {
    const [code, ...nameParts] = c.split(' - ');
    return {
      subjectCode: code.trim(),
      subjectName: nameParts.join(' - ').trim() || code.trim(),
      startTime: `09:${i}0`,
      endTime: `10:${i}0`,
      faculty: 'Faculty Member',
    };
  });

  return generateDaySpecificStudyPlan({
    dayName: 'Today',
    classesForDay,
    homeworkList: params.homeworkList,
    activeSkill: params.activeSkill,
    studyStartTime: params.collegeEndTime ? minutesToTime(toMinutes(params.collegeEndTime) + 30) : '16:00',
  });
}
