import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flag,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { Assessment, AssessmentAttempt } from '../types/placement';
import { CompanyMark, DifficultyText, ProgressBar, RadioButton } from './ui/Controls';

interface AssessmentsViewProps {
  assessments: Assessment[];
  attempts: Record<string, AssessmentAttempt>;
  activeAssessmentId: string | null;
  onSelectActiveAssessment: (id: string | null) => void;
  onSaveAttempt: (attempt: AssessmentAttempt) => void;
}

function formatSeconds(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({
  assessments,
  attempts,
  activeAssessmentId,
  onSelectActiveAssessment,
  onSaveAttempt,
}) => {
  const [runnerMode, setRunnerMode] = useState<'list' | 'taking' | 'review'>('list');
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [reviewAttempt, setReviewAttempt] = useState<AssessmentAttempt | null>(null);

  // Launch assessment when triggered externally (e.g., from Dashboard CTA)
  useEffect(() => {
    if (activeAssessmentId) {
      const target = assessments.find((a) => a.id === activeAssessmentId);
      if (target) {
        startAssessment(target);
      }
      onSelectActiveAssessment(null);
    }
  }, [activeAssessmentId, assessments, onSelectActiveAssessment]);

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedIds([]);
    setSecondsLeft(assessment.durationMinutes * 60);
    setReviewAttempt(null);
    setRunnerMode('taking');
  };

  const openReview = (assessment: Assessment, attempt: AssessmentAttempt) => {
    setCurrentAssessment(assessment);
    setReviewAttempt(attempt);
    setRunnerMode('review');
  };

  const submitAssessment = () => {
    if (!currentAssessment) return;
    const totalCount = currentAssessment.questions.length;
    let correctCount = 0;
    currentAssessment.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    const scorePercent = Math.round((correctCount / Math.max(1, totalCount)) * 100);
    const totalBudget = currentAssessment.durationMinutes * 60;
    const secondsTaken = Math.max(1, totalBudget - secondsLeft);

    const attempt: AssessmentAttempt = {
      assessmentId: currentAssessment.id,
      scorePercent,
      correctCount,
      totalCount,
      secondsTaken,
      completedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      selectedAnswers: { ...selectedAnswers },
    };

    onSaveAttempt(attempt);
    setReviewAttempt(attempt);
    setRunnerMode('review');
  };

  useEffect(() => {
    if (runnerMode !== 'taking') return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [runnerMode]);

  useEffect(() => {
    if (runnerMode === 'taking' && secondsLeft === 0 && currentAssessment) {
      submitAssessment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, runnerMode]);

  const toggleFlag = (qId: string) => {
    setFlaggedIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const completedCount = Object.keys(attempts).length;

  const topicBreakdown = useMemo(() => {
    if (!currentAssessment || !reviewAttempt) return [];
    const map = new Map<string, { correct: number; total: number }>();
    currentAssessment.questions.forEach((q) => {
      const entry = map.get(q.topic) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (reviewAttempt.selectedAnswers[q.id] === q.correctIndex) {
        entry.correct += 1;
      }
      map.set(q.topic, entry);
    });
    return [...map.entries()].map(([topic, stats]) => ({ topic, ...stats }));
  }, [currentAssessment, reviewAttempt]);

  if (runnerMode === 'taking' && currentAssessment) {
    const q = currentAssessment.questions[currentIndex];
    const answeredCount = Object.keys(selectedAnswers).length;
    const isLowTime = secondsLeft <= 120;

    return (
      <div className="space-y-6">
        {/* Assessment Runner Top Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 shadow-level-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CompanyMark company={currentAssessment.company} size="sm" />
            <div>
              <h1 className="text-base font-bold text-[#172554]">
                {currentAssessment.title}
              </h1>
              <p className="text-xs text-[#64748B] tabular-nums">
                Question {currentIndex + 1} of {currentAssessment.questions.length} ·{' '}
                {answeredCount} answered
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-mono font-semibold tabular-nums ${
                isLowTime
                  ? 'border-[#F59E0B] bg-[#FEF3C7] text-[#B45309]'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#172554]'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{formatSeconds(secondsLeft)}</span>
            </div>

            <button
              type="button"
              onClick={submitAssessment}
              className="inline-flex h-9 items-center rounded-lg bg-[#2563EB] px-4 text-xs font-semibold text-white hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              Submit Assessment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Active Question Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
              <div className="text-xs font-semibold text-[#2563EB]">
                Topic: {q.topic}
              </div>
              <button
                type="button"
                onClick={() => toggleFlag(q.id)}
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  flaggedIds.includes(q.id)
                    ? 'bg-[#FEF3C7] text-[#B45309]'
                    : 'border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#172554]'
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                <span>{flaggedIds.includes(q.id) ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>

            <h2 className="text-base font-semibold leading-7 text-[#0B1C30]">{q.prompt}</h2>

            {q.codeSnippet && (
              <pre className="overflow-x-auto rounded-xl bg-[#0B1C30] p-4 font-mono text-xs leading-6 text-[#EAF1FF]">
                {q.codeSnippet}
              </pre>
            )}

            <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
              {q.options.map((opt, idx) => {
                const selected = selectedAnswers[q.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() =>
                      setSelectedAnswers((prev) => ({ ...prev, [q.id]: idx }))
                    }
                    className={`flex w-full items-center gap-3.5 rounded-xl border p-4 text-left text-sm transition-colors ${
                      selected
                        ? 'border-[#2563EB] bg-[#EFF6FF]/60 font-medium text-[#172554]'
                        : 'border-[#E2E8F0] bg-white text-[#0B1C30] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <RadioButton selected={selected} />
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 text-xs font-semibold text-[#172554] disabled:opacity-40 hover:bg-[#F8FAFC]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentIndex < currentAssessment.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(currentAssessment.questions.length - 1, i + 1)
                    )
                  }
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#172554] px-4 text-xs font-semibold text-white hover:bg-[#000F3F]"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitAssessment}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                >
                  <span>Finish & View Diagnostics</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Palette */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-level-1 lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-[#172554]">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {currentAssessment.questions.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = selectedAnswers[item.id] !== undefined;
                const isFlagged = flaggedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                      isCurrent
                        ? 'border-2 border-[#172554] bg-[#EFF6FF] text-[#172554]'
                        : isFlagged
                          ? 'border border-[#F59E0B] bg-[#FEF3C7] text-[#B45309]'
                          : isAnswered
                            ? 'bg-[#2563EB] text-white'
                            : 'border border-[#E2E8F0] bg-white text-[#45464F] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5 border-t border-[#F1F5F9] pt-4 text-xs text-[#64748B]">
              <div className="flex justify-between">
                <span>Answered</span>
                <span className="font-semibold text-[#172554] tabular-nums">
                  {answeredCount} / {currentAssessment.questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Flagged</span>
                <span className="font-semibold text-[#B45309] tabular-nums">
                  {flaggedIds.length}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRunnerMode('list')}
              className="w-full h-9 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172554]"
            >
              Exit Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (runnerMode === 'review' && currentAssessment && reviewAttempt) {
    const passed = reviewAttempt.scorePercent >= 70;
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setRunnerMode('list')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Assessments</span>
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-[#172554]">
              {currentAssessment.title} — Diagnostic Report
            </h1>
            <p className="text-xs text-[#64748B] tabular-nums">
              Completed {reviewAttempt.completedAt} · Time used:{' '}
              {formatSeconds(reviewAttempt.secondsTaken)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-semibold text-[#64748B]">Final Score</div>
              <div
                className={`text-3xl font-bold tabular-nums ${
                  passed ? 'text-[#16A34A]' : 'text-[#B45309]'
                }`}
              >
                {reviewAttempt.scorePercent}%
              </div>
              <div className="text-xs text-[#64748B] tabular-nums">
                {reviewAttempt.correctCount} of {reviewAttempt.totalCount} correct
              </div>
            </div>

            <button
              type="button"
              onClick={() => startAssessment(currentAssessment)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-xs font-semibold text-white hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake Drill</span>
            </button>
          </div>
        </div>

        {/* Topic Accuracy Breakdown */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1">
          <h2 className="text-base font-semibold text-[#172554] pb-3 border-b border-[#F1F5F9]">
            Topic Accuracy Breakdown
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topicBreakdown.map((tb) => {
              const pct = Math.round((tb.correct / tb.total) * 100);
              return (
                <div key={tb.topic} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0B1C30] tabular-nums">
                    <span className="truncate">{tb.topic}</span>
                    <span>
                      {tb.correct}/{tb.total} ({pct}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={tb.correct}
                    max={tb.total}
                    tone={pct >= 70 ? 'green' : 'blue'}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Question-by-Question Explanations */}
        <div className="space-y-4">
          {currentAssessment.questions.map((q, idx) => {
            const chosen = reviewAttempt.selectedAnswers[q.id];
            const isCorrect = chosen === q.correctIndex;
            return (
              <div
                key={q.id}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#64748B]">
                    Question {idx + 1} · {q.topic}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      isCorrect ? 'text-[#16A34A]' : 'text-[#DC2626]'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span>{chosen === undefined ? 'Unanswered' : 'Incorrect'}</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#0B1C30]">{q.prompt}</p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg bg-[#F8FAFC] p-3 border border-[#E2E8F0]">
                    <span className="font-semibold text-[#64748B]">Your answer: </span>
                    <span className="text-[#0B1C30]">
                      {chosen !== undefined ? q.options[chosen] : 'Not answered'}
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#F0FDF4] p-3 border border-[#BBF7D0]">
                    <span className="font-semibold text-[#16A34A]">Correct answer: </span>
                    <span className="text-[#0B1C30]">{q.options[q.correctIndex]}</span>
                  </div>
                </div>

                <p className="text-xs leading-5 text-[#45464F] border-t border-[#F1F5F9] pt-3">
                  <span className="font-semibold text-[#172554]">Explanation: </span>
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#172554]">
            Timed Online Assessments
          </h1>
          <p className="text-sm text-[#45464F]">
            Simulate real campus screening rounds with timed MCQ sections and diagnostic reviews.
          </p>
        </div>
        <div className="text-xs font-semibold text-[#172554] tabular-nums">
          {completedCount} / {assessments.length} assessments completed
        </div>
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {assessments.map((assessment) => {
          const prevAttempt = attempts[assessment.id];
          return (
            <article
              key={assessment.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 transition-shadow hover:shadow-level-2"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CompanyMark company={assessment.company} />
                    <div>
                      <div className="text-xs font-semibold text-[#2563EB]">
                        {assessment.company} · {assessment.category}
                      </div>
                      <h2 className="text-base font-bold text-[#172554]">{assessment.title}</h2>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-6 text-[#45464F]">{assessment.description}</p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B] tabular-nums">
                  <DifficultyText difficulty={assessment.difficulty} />
                  <span aria-hidden="true">·</span>
                  <span>{assessment.questions.length} questions</span>
                  <span aria-hidden="true">·</span>
                  <span>{assessment.durationMinutes} min limit</span>
                </div>
              </div>

              <div className="mt-5 border-t border-[#F1F5F9] pt-4 space-y-3">
                {prevAttempt && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold tabular-nums">
                      <span className="text-[#16A34A]">
                        Last Score: {prevAttempt.scorePercent}% ({prevAttempt.correctCount}/
                        {prevAttempt.totalCount})
                      </span>
                      <span className="text-[#64748B]">{prevAttempt.completedAt}</span>
                    </div>
                    <ProgressBar
                      value={prevAttempt.scorePercent}
                      max={100}
                      tone={prevAttempt.scorePercent >= 70 ? 'green' : 'blue'}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => startAssessment(assessment)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>{prevAttempt ? 'Retake Assessment' : 'Start Assessment'}</span>
                  </button>

                  {prevAttempt && (
                    <button
                      type="button"
                      onClick={() => openReview(assessment, prevAttempt)}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-xs font-semibold text-[#172554] hover:bg-[#F8FAFC] whitespace-nowrap shrink-0"
                    >
                      Review Report
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
