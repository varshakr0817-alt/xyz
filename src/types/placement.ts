export enum NavTab {
  Dashboard = 'dashboard',
  QuestionBank = 'questions',
  Workspace = 'workspace',
  Assessments = 'assessments',
  Interviews = 'interviews',
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum TopicCategory {
  ArraysHashing = 'Arrays & Hashing',
  SlidingWindow = 'Two Pointers & Sliding Window',
  TreesGraphs = 'Trees & Graphs',
  DynamicProgramming = 'Dynamic Programming',
  SqlDbms = 'SQL & DBMS',
  OsConcurrency = 'OS & Concurrency',
}

export enum CodeLanguage {
  JavaScript = 'javascript',
  Python = 'python',
  Cpp = 'cpp',
}

export enum InterviewStage {
  Applied = 'Applied',
  OaScheduled = 'OA Scheduled',
  TechnicalRound = 'Technical Round',
  HrRound = 'HR & Hiring Manager',
  Offer = 'Offer Received',
}

export interface TestCase {
  id: string;
  inputDisplay: string;
  args: unknown[];
  expected: unknown;
}

export interface Question {
  id: string;
  number: number;
  title: string;
  topic: TopicCategory;
  difficulty: Difficulty;
  companies: string[];
  frequencyLabel: 'High Freq' | 'Very High' | 'Core';
  estimatedMinutes: number;
  prompt: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints: string[];
  approachSummary: string;
  timeComplexity: string;
  spaceComplexity: string;
  functionName: string;
  starterCode: Record<CodeLanguage, string>;
  referenceSolutionJs: string;
  testCases: TestCase[];
}

export interface AssessmentQuestion {
  id: string;
  topic: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  company: string;
  category: string;
  durationMinutes: number;
  difficulty: Difficulty;
  description: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  assessmentId: string;
  scorePercent: number;
  correctCount: number;
  totalCount: number;
  secondsTaken: number;
  completedAt: string;
  selectedAnswers: Record<string, number>;
}

export interface PrepChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface InterviewDrive {
  id: string;
  company: string;
  role: string;
  ctcRange: string;
  driveDate: string;
  stage: InterviewStage;
  nextRoundTitle: string;
  locationOrMode: string;
  focusTopics: string[];
  roundStructure: string[];
  checklist: PrepChecklistItem[];
}

export interface MockInterviewPrompt {
  id: string;
  type: 'Behavioral (STAR)' | 'System Design';
  title: string;
  companyTag: string;
  prompt: string;
  recommendedMinutes: number;
  rubricItems: string[];
  keyTalkingPoints: string[];
}

export interface WeeklyActivityPoint {
  day: string;
  problemsSolved: number;
  assessmentsCompleted: number;
}
