export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  attendedHours: number;
  totalHours: number;
}

export function calculateSubjectAttendance(attended: number, total: number): {
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
  classesNeededFor75: number;
  canBunkCount: number;
} {
  if (total === 0) {
    return { percentage: 100, status: 'safe', classesNeededFor75: 0, canBunkCount: 0 };
  }

  const percentage = Math.round((attended / total) * 100);

  let status: 'safe' | 'warning' | 'critical' = 'safe';
  if (percentage < 65) {
    status = 'critical';
  } else if (percentage < 75) {
    status = 'warning';
  }

  // How many consecutive classes needed to reach 75%
  // (attended + x) / (total + x) >= 0.75 => x >= (0.75 * total - attended) / 0.25
  let classesNeededFor75 = 0;
  if (percentage < 75) {
    classesNeededFor75 = Math.ceil(Math.max(0, 3 * total - 4 * attended));
  }

  // How many classes can be safely missed without dropping below 75%
  // attended / (total + y) >= 0.75 => y <= (attended / 0.75) - total
  let canBunkCount = 0;
  if (percentage >= 75) {
    canBunkCount = Math.floor(Math.max(0, (4 * attended - 3 * total) / 3));
  }

  return { percentage, status, classesNeededFor75, canBunkCount };
}

export function calculateOverallAttendance(subjects: SubjectAttendance[]): {
  overallPercentage: number;
  totalAttended: number;
  totalHours: number;
  status: 'safe' | 'warning' | 'critical';
} {
  const totalAttended = subjects.reduce((sum, s) => sum + s.attendedHours, 0);
  const totalHours = subjects.reduce((sum, s) => sum + s.totalHours, 0);

  if (totalHours === 0) {
    return { overallPercentage: 100, totalAttended: 0, totalHours: 0, status: 'safe' };
  }

  const overallPercentage = Math.round((totalAttended / totalHours) * 100);
  let status: 'safe' | 'warning' | 'critical' = 'safe';
  if (overallPercentage < 65) {
    status = 'critical';
  } else if (overallPercentage < 75) {
    status = 'warning';
  }

  return { overallPercentage, totalAttended, totalHours, status };
}
