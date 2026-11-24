import React from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  Assessment,
  AssessmentAttempt,
  InterviewDrive,
  NavTab,
  Question,
  TopicCategory,
  WeeklyActivityPoint,
} from '../types/placement';
import { CompanyMark, ProgressBar } from './ui/Controls';

interface DashboardViewProps {
  questions: Question[];
  solvedIds: string[];
  assessments: Assessment[];
  attempts: Record<string, AssessmentAttempt>;
  drives: InterviewDrive[];
  weeklyActivity: WeeklyActivityPoint[];
  onNavigate: (tab: NavTab) => void;
  onOpenProblem: (questionId: string) => void;
  onStartAssessment: (assessmentId: string) => void;
  onOpenDrive: (driveId: string) => void;
  onFilterTopic: (topic: TopicCategory) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  questions,
  solvedIds,
  assessments,
  attempts,
  drives,
  weeklyActivity,
  onNavigate,
  onOpenProblem,
  onStartAssessment,
  onOpenDrive,
  onFilterTopic,
}) => {
  const solvedCount = solvedIds.length;
  const totalQuestions = questions.length;
  const solvedPct = Math.round((solvedCount / Math.max(1, totalQuestions)) * 100);

  const attemptList = Object.values(attempts);
  const avgAssessmentScore =
    attemptList.length > 0
      ? Math.round(
          attemptList.reduce((acc, item) => acc + item.scorePercent, 0) / attemptList.length
        )
      : 0;

  const totalWeeklyProblems = weeklyActivity.reduce((s, d) => s + d.problemsSolved, 0);
  const maxBar = Math.max(...weeklyActivity.map((d) => d.problemsSolved), 1);

  const topics = Object.values(TopicCategory).map((topic) => {
    const topicQs = questions.filter((q) => q.topic === topic);
    const topicSolved = topicQs.filter((q) => solvedIds.includes(q.id)).length;
    return {
      topic,
      solved: topicSolved,
      total: topicQs.length,
    };
  });

  const nextUnsolved = questions.find((q) => !solvedIds.includes(q.id)) ?? questions[0];
  const recommendedAssessment =
    assessments.find((a) => !attempts[a.id]) ?? assessments[0];

  return (
    <div className="space-y-6">
      {/* Hero / Cycle Focus Strip */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-1.5">
          <p className="text-xs font-semibold tracking-wide text-[#2563EB]">
            Campus Placement Cycle 2027 · Software Engineering Track
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#172554] sm:text-[28px] sm:leading-9 text-balance">
            Focused preparation for your upcoming technical rounds
          </h1>
          <p className="text-sm leading-6 text-[#45464F]">
            You have completed {solvedCount} of {totalQuestions} core problems across{' '}
            {topics.length} technical tracks and have {drives.length} active company drives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenProblem(nextUnsolved.id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            <Code2 className="h-4 w-4" />
            <span>Resume: {nextUnsolved.title}</span>
          </button>
          <button
            type="button"
            onClick={() => onStartAssessment(recommendedAssessment.id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#172554] transition-colors hover:border-[#CBD5E1] hover:bg-[#F8FAFC] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            <span>Take Timed OA</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 4-Column KPI Strip */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-level-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Problems Solved</span>
            <Target className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#172554] tabular-nums">
              {solvedCount}
            </span>
            <span className="text-sm font-medium text-[#64748B] tabular-nums">
              / {totalQuestions} ({solvedPct}%)
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar value={solvedCount} max={totalQuestions} tone="blue" />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-level-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Assessment Average</span>
            <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#172554] tabular-nums">
              {attemptList.length > 0 ? `${avgAssessmentScore}%` : '—'}
            </span>
            <span className="text-sm text-[#64748B] tabular-nums">
              {attemptList.length} of {assessments.length} completed
            </span>
          </div>
          <p className="mt-3 text-xs text-[#64748B]">
            {attemptList.length > 0
              ? 'Timed OA accuracy across DSA & Core CS'
              : 'Complete a timed drill to establish baseline'}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-level-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Active Campus Drives</span>
            <Calendar className="h-4 w-4 text-[#B45309]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#172554] tabular-nums">
              {drives.length}
            </span>
            <span className="text-sm text-[#64748B]">companies in pipeline</span>
          </div>
          <p className="mt-3 text-xs font-medium text-[#B45309]">
            Next round: {drives[0]?.company ?? 'None'} · {drives[0]?.driveDate ?? '—'}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-level-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Weekly Practice Volume</span>
            <Sparkles className="h-4 w-4 text-[#7C3AED]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#172554] tabular-nums">
              {totalWeeklyProblems}
            </span>
            <span className="text-sm text-[#64748B]">drills last 7 days</span>
          </div>
          <p className="mt-3 text-xs text-[#64748B]">
            Consistent daily cadence ahead of Dec drives
          </p>
        </div>
      </section>

      {/* Main 12-Column Grid: Weekly Activity + Topic Mastery */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Topic Mastery */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 lg:col-span-7">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-lg font-semibold text-[#172554]">Topic Readiness Breakdown</h2>
              <p className="text-xs text-[#64748B]">
                Click any curriculum area to open filtered practice problems
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(NavTab.QuestionBank)}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              View All Problems
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {topics.map((item) => {
              const pct = item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0;
              return (
                <div
                  key={item.topic}
                  className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-[#0B1C30]">
                        {item.topic}
                      </span>
                      <span className="text-xs font-medium text-[#64748B] tabular-nums shrink-0">
                        {item.solved}/{item.total} solved · {pct}%
                      </span>
                    </div>
                    <ProgressBar
                      value={item.solved}
                      max={item.total}
                      tone={pct === 100 ? 'green' : 'blue'}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onFilterTopic(item.topic)}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#172554] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] sm:ml-4 whitespace-nowrap shrink-0"
                  >
                    Practice
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Activity + Mock Interview Spotlight */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-lg font-semibold text-[#172554]">7-Day Practice Cadence</h2>
                <p className="text-xs text-[#64748B]">Problems solved per day</p>
              </div>
              <span className="text-xs font-semibold text-[#172554] tabular-nums">
                {totalWeeklyProblems} total
              </span>
            </div>

            <div className="mt-5 grid grid-cols-7 items-end gap-2.5 h-36 pt-4">
              {weeklyActivity.map((point) => {
                const heightPct = Math.max(14, Math.round((point.problemsSolved / maxBar) * 100));
                return (
                  <div key={point.day} className="flex h-full flex-col items-center justify-end gap-2">
                    <span className="text-[11px] font-semibold text-[#64748B] tabular-nums">
                      {point.problemsSolved}
                    </span>
                    <div className="flex w-full flex-1 items-end justify-center">
                      <div
                        className="w-full max-w-[32px] rounded-t-md bg-[#2563EB] transition-all hover:bg-[#1D4ED8]"
                        style={{ height: `${heightPct}%` }}
                        title={`${point.day}: ${point.problemsSolved} problems`}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#64748B]">{point.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#7C3AED]">
                  Mock Interview Studio
                </span>
                <h3 className="text-base font-semibold text-[#172554]">
                  Behavioral STAR & System Design Drills
                </h3>
                <p className="text-xs leading-5 text-[#45464F]">
                  Practice structured 4-minute behavioral stories and 12-minute architecture drills
                  with guided rubrics.
                </p>
              </div>
              <Compass className="h-5 w-5 shrink-0 text-[#7C3AED]" />
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onNavigate(NavTab.Interviews)}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#6D28D9] whitespace-nowrap"
              >
                <span>Open Mock Interview Drill</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Interview Schedule & Prep Packs */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1">
        <div className="flex flex-col gap-2 pb-4 border-b border-[#F1F5F9] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#172554]">Upcoming Campus Drives</h2>
            <p className="text-xs text-[#64748B]">
              Track interview dates, round formats, and company-specific preparation checklists
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(NavTab.Interviews)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
          >
            <span>Manage Pipeline</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {drives.map((drive) => {
            const doneCount = drive.checklist.filter((c) => c.done).length;
            const totalCheck = drive.checklist.length;
            return (
              <div
                key={drive.id}
                className="flex flex-col gap-4 py-4 transition-colors hover:bg-[#F8FAFC] sm:flex-row sm:items-center sm:justify-between sm:px-2 rounded-xl"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <CompanyMark company={drive.company} />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-[#0B1C30]">{drive.company}</span>
                      <span aria-hidden="true" className="text-[#CBD5E1]">
                        ·
                      </span>
                      <span className="text-sm text-[#45464F] truncate">{drive.role}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#64748B]">
                      <span className="font-medium text-[#172554]">{drive.stage}</span>
                      <span aria-hidden="true">·</span>
                      <span>{drive.nextRoundTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Clock className="h-3.5 w-3.5 text-[#B45309]" />
                        {drive.driveDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-28 space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-[#64748B] tabular-nums">
                      <span>Checklist</span>
                      <span>
                        {doneCount}/{totalCheck}
                      </span>
                    </div>
                    <ProgressBar
                      value={doneCount}
                      max={totalCheck}
                      tone={doneCount === totalCheck && totalCheck > 0 ? 'green' : 'blue'}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenDrive(drive.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 text-xs font-semibold text-[#172554] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] whitespace-nowrap shrink-0"
                  >
                    <span>Prep Pack</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
