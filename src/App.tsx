/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  ClipboardCheck,
  Code2,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  RotateCcw,
} from 'lucide-react';
import {
  ASSESSMENTS,
  INITIAL_INTERVIEW_DRIVES,
  MOCK_INTERVIEW_PROMPTS,
  QUESTIONS,
  WEEKLY_ACTIVITY,
} from './data/placementData';
import {
  AssessmentAttempt,
  CodeLanguage,
  InterviewDrive,
  InterviewStage,
  NavTab,
  TopicCategory,
} from './types/placement';
import { DashboardView } from './components/DashboardView';
import { QuestionBankView } from './components/QuestionBankView';
import { CodeWorkspaceView } from './components/CodeWorkspaceView';
import { AssessmentsView } from './components/AssessmentsView';
import { InterviewsView } from './components/InterviewsView';

const STORAGE_KEY = 'placementprep_workspace_v1';

interface PersistedState {
  solvedIds: string[];
  revisitIds: string[];
  codeDrafts: Record<string, Record<CodeLanguage, string>>;
  attempts: Record<string, AssessmentAttempt>;
  drives: InterviewDrive[];
  mockNotes: Record<string, string>;
  mockRubricChecked: Record<string, string[]>;
}

const DEFAULT_STATE: PersistedState = {
  solvedIds: ['q-two-sum', 'q-valid-parentheses', 'q-container-water'],
  revisitIds: ['q-course-schedule', 'q-trapping-rain'],
  codeDrafts: {},
  attempts: {
    'assess-core-cs': {
      assessmentId: 'assess-core-cs',
      scorePercent: 75,
      correctCount: 3,
      totalCount: 4,
      secondsTaken: 342,
      completedAt: 'Nov 20, 2026',
      selectedAnswers: {
        'cs-1': 2,
        'cs-2': 1,
        'cs-3': 1,
        'cs-4': 1,
      },
    },
  },
  drives: INITIAL_INTERVIEW_DRIVES,
  mockNotes: {},
  mockRubricChecked: {},
};

function loadInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      solvedIds: Array.isArray(parsed.solvedIds) ? parsed.solvedIds : DEFAULT_STATE.solvedIds,
      revisitIds: Array.isArray(parsed.revisitIds) ? parsed.revisitIds : DEFAULT_STATE.revisitIds,
      codeDrafts: parsed.codeDrafts ?? {},
      attempts: parsed.attempts ?? DEFAULT_STATE.attempts,
      drives: Array.isArray(parsed.drives) && parsed.drives.length > 0 ? parsed.drives : DEFAULT_STATE.drives,
      mockNotes: parsed.mockNotes ?? {},
      mockRubricChecked: parsed.mockRubricChecked ?? {},
    };
  } catch {
    return DEFAULT_STATE;
  }
}

const NAV_ITEMS: { id: NavTab; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: NavTab.Dashboard, label: 'Overview', shortLabel: 'Home', icon: LayoutDashboard },
  { id: NavTab.QuestionBank, label: 'Question Bank', shortLabel: 'Questions', icon: ListChecks },
  { id: NavTab.Workspace, label: 'Code Workspace', shortLabel: 'Code', icon: Code2 },
  { id: NavTab.Assessments, label: 'Assessments', shortLabel: 'Tests', icon: ClipboardCheck },
  { id: NavTab.Interviews, label: 'Interviews & Packs', shortLabel: 'Interviews', icon: Briefcase },
];

export default function App() {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.Dashboard);
  const [activeQuestionId, setActiveQuestionId] = useState<string>(QUESTIONS[0].id);
  const [topicFilter, setTopicFilter] = useState<TopicCategory | 'All'>('All');
  const [launchAssessmentId, setLaunchAssessmentId] = useState<string | null>(null);
  const [selectedDriveId, setSelectedDriveId] = useState<string>(
    () => state.drives[0]?.id ?? INITIAL_INTERVIEW_DRIVES[0].id
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const handleToggleSolved = (questionId: string) => {
    setState((prev) => {
      const exists = prev.solvedIds.includes(questionId);
      return {
        ...prev,
        solvedIds: exists
          ? prev.solvedIds.filter((id) => id !== questionId)
          : [...prev.solvedIds, questionId],
      };
    });
  };

  const handleMarkSolved = (questionId: string, solved: boolean) => {
    setState((prev) => {
      const exists = prev.solvedIds.includes(questionId);
      if (solved && !exists) {
        return { ...prev, solvedIds: [...prev.solvedIds, questionId] };
      }
      if (!solved && exists) {
        return { ...prev, solvedIds: prev.solvedIds.filter((id) => id !== questionId) };
      }
      return prev;
    });
  };

  const handleToggleRevisit = (questionId: string) => {
    setState((prev) => {
      const exists = prev.revisitIds.includes(questionId);
      return {
        ...prev,
        revisitIds: exists
          ? prev.revisitIds.filter((id) => id !== questionId)
          : [...prev.revisitIds, questionId],
      };
    });
  };

  const handleUpdateDraft = (questionId: string, lang: CodeLanguage, code: string) => {
    setState((prev) => ({
      ...prev,
      codeDrafts: {
        ...prev.codeDrafts,
        [questionId]: {
          ...(prev.codeDrafts[questionId] ?? {
            [CodeLanguage.JavaScript]:
              QUESTIONS.find((q) => q.id === questionId)?.starterCode[CodeLanguage.JavaScript] ?? '',
            [CodeLanguage.Python]:
              QUESTIONS.find((q) => q.id === questionId)?.starterCode[CodeLanguage.Python] ?? '',
            [CodeLanguage.Cpp]:
              QUESTIONS.find((q) => q.id === questionId)?.starterCode[CodeLanguage.Cpp] ?? '',
          }),
          [lang]: code,
        },
      },
    }));
  };

  const handleSaveAttempt = (attempt: AssessmentAttempt) => {
    setState((prev) => ({
      ...prev,
      attempts: {
        ...prev.attempts,
        [attempt.assessmentId]: attempt,
      },
    }));
  };

  const handleUpdateDriveStage = (driveId: string, stage: InterviewStage) => {
    setState((prev) => ({
      ...prev,
      drives: prev.drives.map((d) => (d.id === driveId ? { ...d, stage } : d)),
    }));
  };

  const handleToggleChecklistItem = (driveId: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      drives: prev.drives.map((d) =>
        d.id === driveId
          ? {
              ...d,
              checklist: d.checklist.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : d
      ),
    }));
  };

  const handleAddChecklistItem = (driveId: string, label: string) => {
    setState((prev) => ({
      ...prev,
      drives: prev.drives.map((d) =>
        d.id === driveId
          ? {
              ...d,
              checklist: [
                ...d.checklist,
                { id: `chk-${Date.now()}`, label, done: false },
              ],
            }
          : d
      ),
    }));
  };

  const handleAddDrive = (drive: InterviewDrive) => {
    setState((prev) => ({
      ...prev,
      drives: [drive, ...prev.drives],
    }));
  };

  const handleUpdateMockNote = (promptId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      mockNotes: { ...prev.mockNotes, [promptId]: note },
    }));
  };

  const handleToggleMockRubric = (promptId: string, rubricText: string) => {
    setState((prev) => {
      const existing = prev.mockRubricChecked[promptId] ?? [];
      const updated = existing.includes(rubricText)
        ? existing.filter((r) => r !== rubricText)
        : [...existing, rubricText];
      return {
        ...prev,
        mockRubricChecked: { ...prev.mockRubricChecked, [promptId]: updated },
      };
    });
  };

  const handleOpenProblem = (questionId: string) => {
    setActiveQuestionId(questionId);
    setActiveTab(NavTab.Workspace);
  };

  const handleStartAssessment = (assessmentId: string) => {
    setLaunchAssessmentId(assessmentId);
    setActiveTab(NavTab.Assessments);
  };

  const handleOpenDrive = (driveId: string) => {
    setSelectedDriveId(driveId);
    setActiveTab(NavTab.Interviews);
  };

  const handleFilterTopic = (topic: TopicCategory) => {
    setTopicFilter(topic);
    setActiveTab(NavTab.QuestionBank);
  };

  const handleResetProgress = () => {
    setState(DEFAULT_STATE);
    setSelectedDriveId(DEFAULT_STATE.drives[0].id);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const activeNavLabel = NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? 'Overview';
  const nextUnsolved =
    QUESTIONS.find((q) => !state.solvedIds.includes(q.id)) ?? QUESTIONS[0];

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#0B1C30] flex flex-col lg:flex-row">
      {/* Desktop Sidebar (248px) */}
      <aside className="hidden lg:flex lg:w-[248px] lg:shrink-0 lg:flex-col lg:border-r lg:border-[#E2E8F0] lg:bg-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex h-16 items-center gap-2.5 border-b border-[#E2E8F0] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172554] text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#172554] whitespace-nowrap">
            PlacementPrep
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#45464F] hover:bg-[#F8FAFC] hover:text-[#172554]'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Student Profile Footer */}
        <div className="border-t border-[#E2E8F0] p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#172554] text-xs font-bold text-white">
              VR
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-[#172554]">Varsha R.</div>
              <div className="truncate text-[11px] text-[#64748B]">B.Tech CSE · Batch 2027</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetProgress}
            className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#172554]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Progress</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">
        {/* Top Bar Contract: Breadcrumb on left, 1 primary action on right */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#172554] text-white lg:hidden shrink-0">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="font-bold text-[#172554] lg:hidden whitespace-nowrap">
                PlacementPrep
              </span>
              <span className="hidden font-medium text-[#64748B] lg:inline whitespace-nowrap">
                PlacementPrep
              </span>
              <span aria-hidden="true" className="text-[#CBD5E1]">
                /
              </span>
              <span className="truncate font-semibold text-[#0B1C30]">{activeNavLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenProblem(nextUnsolved.id)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Start Daily Drill</span>
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="mx-auto w-full max-w-[1280px] flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === NavTab.Dashboard && (
            <DashboardView
              questions={QUESTIONS}
              solvedIds={state.solvedIds}
              assessments={ASSESSMENTS}
              attempts={state.attempts}
              drives={state.drives}
              weeklyActivity={WEEKLY_ACTIVITY}
              onNavigate={setActiveTab}
              onOpenProblem={handleOpenProblem}
              onStartAssessment={handleStartAssessment}
              onOpenDrive={handleOpenDrive}
              onFilterTopic={handleFilterTopic}
            />
          )}

          {activeTab === NavTab.QuestionBank && (
            <QuestionBankView
              questions={QUESTIONS}
              solvedIds={state.solvedIds}
              revisitIds={state.revisitIds}
              initialTopicFilter={topicFilter}
              onToggleSolved={handleToggleSolved}
              onToggleRevisit={handleToggleRevisit}
              onOpenProblem={handleOpenProblem}
              onResetTopicFilter={() => setTopicFilter('All')}
            />
          )}

          {activeTab === NavTab.Workspace && (
            <CodeWorkspaceView
              questions={QUESTIONS}
              activeQuestionId={activeQuestionId}
              solvedIds={state.solvedIds}
              codeDrafts={state.codeDrafts}
              onSelectQuestion={setActiveQuestionId}
              onUpdateDraft={handleUpdateDraft}
              onMarkSolved={handleMarkSolved}
              onBackToBank={() => setActiveTab(NavTab.QuestionBank)}
            />
          )}

          {activeTab === NavTab.Assessments && (
            <AssessmentsView
              assessments={ASSESSMENTS}
              attempts={state.attempts}
              activeAssessmentId={launchAssessmentId}
              onSelectActiveAssessment={setLaunchAssessmentId}
              onSaveAttempt={handleSaveAttempt}
            />
          )}

          {activeTab === NavTab.Interviews && (
            <InterviewsView
              drives={state.drives}
              selectedDriveId={selectedDriveId}
              mockPrompts={MOCK_INTERVIEW_PROMPTS}
              mockNotes={state.mockNotes}
              mockRubricChecked={state.mockRubricChecked}
              onSelectDrive={setSelectedDriveId}
              onUpdateDriveStage={handleUpdateDriveStage}
              onToggleChecklistItem={handleToggleChecklistItem}
              onAddChecklistItem={handleAddChecklistItem}
              onAddDrive={handleAddDrive}
              onUpdateMockNote={handleUpdateMockNote}
              onToggleMockRubric={handleToggleMockRubric}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation (<1024px) */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 grid h-14 grid-cols-5 border-t border-[#E2E8F0] bg-white lg:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
                active ? 'text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate max-w-full px-1">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
