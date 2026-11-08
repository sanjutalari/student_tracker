export interface TimeSlot {
  id: string;
  title: string;
  startTime: string; // '08:15'
  endTime: string;   // '09:15'
  type: 'class' | 'study' | 'break' | 'assignment';
}

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
}

// Convert 'HH:MM' to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

// Detect overlap between any two time intervals
export function checkIntervalOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

// Detect conflicts between official timetable and student study tasks
export function detectScheduleConflicts(slots: TimeSlot[]): Array<{ slotA: TimeSlot; slotB: TimeSlot }> {
  const conflicts: Array<{ slotA: TimeSlot; slotB: TimeSlot }> = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (checkIntervalOverlap(slots[i].startTime, slots[i].endTime, slots[j].startTime, slots[j].endTime)) {
        conflicts.push({ slotA: slots[i], slotB: slots[j] });
      }
    }
  }

  return conflicts;
}

// Calculate total planned and completed study minutes
export function calculateStudyTotals(tasks: TaskItem[]): {
  totalPlannedMinutes: number;
  completedMinutes: number;
  completionRate: number;
} {
  const totalPlannedMinutes = tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);
  const completedMinutes = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  const completionRate = totalPlannedMinutes > 0 ? Math.round((completedMinutes / totalPlannedMinutes) * 100) : 0;

  return { totalPlannedMinutes, completedMinutes, completionRate };
}

// Order tasks by urgency: incomplete first, then priority (urgent > high > medium > low), then earliest due date
export function prioritizeTasks(tasks: TaskItem[]): TaskItem[] {
  const priorityWeight: Record<string, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const weightDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    if (weightDiff !== 0) return weightDiff;
    return a.dueDate.localeCompare(b.dueDate);
  });
}
