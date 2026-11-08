export type UserRole = 'student' | 'faculty' | 'mentor' | 'admin';

export type WearableSimulationMode = 'normal' | 'deep_focus' | 'stress_cram' | 'fatigue';

export interface StudentProfile {
  regNo: string;
  name: string;
  email: string;
  department: string;
  programme: string;
  year: number;
  semester: number;
  section: string;
  cgpa: number;
  avatarUrl: string;
  mentorName: string;
}

export interface FacultyProfile {
  facultyId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  courses: string[];
  avatarUrl: string;
}

export interface MentorProfile {
  mentorId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  assignedStudents: string[];
}

export interface WearableMetrics {
  heartRate: number;
  hrvMs: number;
  focusScore: number;
  stressScore: number;
  activeMinutesToday: number;
  sleepHours: number;
  sleepQualityScore: number;
  postureStatus: 'good' | 'slouching' | 'standing' | 'resting';
  batteryPct: number;
  isConnected: boolean;
  deviceName: string;
  lastSyncTime?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  faculty: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  category: 'College assignments' | 'Exam preparation' | 'Coding practice' | 'Skill development' | 'Personal learning';
}

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

export interface SkillSessionLog {
  id: string;
  date: string;
  minutes: number;
  topic: string;
  focusScore: number;
  notes?: string;
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
  recentSessions: SkillSessionLog[];
}

export interface AfterCollegeScheduleBlock {
  id: string;
  startTime: string;
  endTime: string;
  type: 'class_revision' | 'skill_time' | 'homework' | 'break' | 'review';
  title: string;
  description: string;
  skillName?: string;
  isCompleted?: boolean;
}

export interface StudyReminder {
  id: string;
  time: string; // '16:30'
  title: string;
  category: 'class_revision' | 'skill_time' | 'homework' | 'break';
  isCompleted: boolean;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  issuedDate: string;
  deadline: string;
  maxMarks: number;
  instructions: string;
  status: 'Pending' | 'Submitted' | 'Evaluated';
  submittedFile?: string;
  submittedAt?: string;
  grade?: string;
  marksObtained?: number;
  feedback?: string;
}

export interface StudySessionRecord {
  id: string;
  subject: string;
  timestamp: string;
  durationMinutes: number;
  avgHeartRate: number;
  avgFocusScore: number;
  notes: string;
  skillName?: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: 'Academic' | 'Skill' | 'Placement' | 'Project';
  targetDate: string;
  progressPct: number;
  milestones: Milestone[];
  evidenceUrl?: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AttendanceItem {
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  attendedHours: number;
  totalHours: number;
  recentSessions: Array<{ date: string; status: 'Present' | 'Absent' | 'Late' }>;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  sender: string;
  content: string;
  isUrgent?: boolean;
}
