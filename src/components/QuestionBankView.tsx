import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, RotateCcw, Search } from 'lucide-react';
import { Difficulty, Question, TopicCategory } from '../types/placement';
import { Checkbox, DifficultyText, ProgressBar } from './ui/Controls';

interface QuestionBankViewProps {
  questions: Question[];
  solvedIds: string[];
  revisitIds: string[];
  initialTopicFilter: TopicCategory | 'All';
  onToggleSolved: (id: string) => void;
  onToggleRevisit: (id: string) => void;
  onOpenProblem: (id: string) => void;
  onResetTopicFilter: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  solvedIds,
  revisitIds,
  initialTopicFilter,
  onToggleSolved,
  onToggleRevisit,
  onOpenProblem,
  onResetTopicFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState<TopicCategory | 'All'>(initialTopicFilter);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Todo' | 'Revisit'>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');

  React.useEffect(() => {
    setTopicFilter(initialTopicFilter);
  }, [initialTopicFilter]);

  const companies = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => q.companies.forEach((c) => set.add(c)));
    return ['All', ...Array.from(set).sort()];
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (topicFilter !== 'All' && q.topic !== topicFilter) return false;
      if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false;
      if (companyFilter !== 'All' && !q.companies.includes(companyFilter)) return false;

      const isSolved = solvedIds.includes(q.id);
      const isRevisit = revisitIds.includes(q.id);
      if (statusFilter === 'Solved' && !isSolved) return false;
      if (statusFilter === 'Todo' && isSolved) return false;
      if (statusFilter === 'Revisit' && !isRevisit) return false;

      if (searchQuery.trim() !== '') {
        const needle = searchQuery.trim().toLowerCase();
        const hay = `${q.title} ${q.topic} ${q.companies.join(' ')}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }

      return true;
    });
  }, [
    questions,
    topicFilter,
    difficultyFilter,
    companyFilter,
    statusFilter,
    searchQuery,
    solvedIds,
    revisitIds,
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setTopicFilter('All');
    setDifficultyFilter('All');
    setStatusFilter('All');
    setCompanyFilter('All');
    onResetTopicFilter();
  };

  const solvedCount = solvedIds.length;

  return (
    <div className="space-y-6">
      {/* Header & Progress Summary */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#172554]">
            Curated Question Bank
          </h1>
          <p className="text-sm text-[#45464F]">
            Company-weighted coding and Core CS problems organized by interview frequency.
          </p>
        </div>

        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#172554] tabular-nums">
            <span>Overall Completion</span>
            <span>
              {solvedCount} / {questions.length} solved
            </span>
          </div>
          <ProgressBar value={solvedCount} max={questions.length} tone="blue" />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-level-1 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Standard 42px Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by title, topic, or company..."
              aria-label="Search problems"
              className="h-[42px] w-full rounded-lg border border-[#CBD5E1] bg-white pl-10 pr-4 text-sm text-[#0B1C30] placeholder:text-[#64748B] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Difficulty Filter Chips */}
            <div className="flex items-center gap-1.5" role="group" aria-label="Filter by difficulty">
              {(['All', Difficulty.Easy, Difficulty.Medium, Difficulty.Hard] as const).map(
                (diff) => {
                  const active = difficultyFilter === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficultyFilter(diff)}
                      className={`h-8 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#172554] text-white'
                          : 'border border-[#E2E8F0] bg-white text-[#45464F] hover:bg-[#F8FAFC] hover:text-[#172554]'
                      }`}
                    >
                      {diff}
                    </button>
                  );
                }
              )}
            </div>

            {/* Company Select */}
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              aria-label="Filter by company"
              className="h-8 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#172554] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            >
              {companies.map((comp) => (
                <option key={comp} value={comp}>
                  {comp === 'All' ? 'All Companies' : comp}
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'All' | 'Solved' | 'Todo' | 'Revisit')
              }
              aria-label="Filter by completion status"
              className="h-8 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#172554] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            >
              <option value="All">All Status</option>
              <option value="Todo">Todo Only</option>
              <option value="Solved">Solved Only</option>
              <option value="Revisit">Marked to Revisit</option>
            </select>
          </div>
        </div>

        {/* Topic Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1" role="group" aria-label="Filter by topic">
          {(['All', ...Object.values(TopicCategory)] as const).map((topic) => {
            const active = topicFilter === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setTopicFilter(topic)}
                className={`h-8 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#172554] text-white'
                    : 'border border-[#E2E8F0] bg-white text-[#45464F] hover:bg-[#F8FAFC] hover:text-[#172554]'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Table / List */}
      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-level-1">
        <div className="hidden grid-cols-12 items-center gap-4 border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-3 text-xs font-semibold tracking-wide text-[#64748B] md:grid">
          <div className="col-span-1">Done</div>
          <div className="col-span-5">Problem & Topic</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2">Est. Time</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <p className="text-base font-semibold text-[#172554]">
              No problems match your current filters
            </p>
            <p className="mt-1 text-sm text-[#64748B]">
              Try clearing a topic, difficulty, or company filter to explore more questions.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {filteredQuestions.map((q) => {
              const isSolved = solvedIds.includes(q.id);
              const isRevisit = revisitIds.includes(q.id);
              return (
                <div
                  key={q.id}
                  onClick={() => onOpenProblem(q.id)}
                  className="grid min-h-[60px] cursor-pointer grid-cols-1 items-center gap-3 px-6 py-3.5 transition-colors hover:bg-[#F8FAFC] md:grid-cols-12 md:gap-4"
                >
                  <div className="flex items-center gap-3 md:col-span-1">
                    <Checkbox
                      checked={isSolved}
                      onChange={() => onToggleSolved(q.id)}
                      ariaLabel={`Mark ${q.title} as solved`}
                    />
                    <span className="text-xs font-mono text-[#64748B] tabular-nums md:hidden">
                      #{q.number}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1 md:col-span-5">
                    <div className="flex items-center gap-2">
                      <span className="hidden text-xs font-mono text-[#64748B] tabular-nums md:inline">
                        {String(q.number).padStart(2, '0')}.
                      </span>
                      <span className="truncate text-sm font-semibold text-[#0B1C30]">
                        {q.title}
                      </span>
                      {isSolved && (
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-[#16A34A]"
                          aria-label="Solved"
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#64748B]">
                      <span className="font-medium text-[#2563EB]">{q.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.companies.join(', ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.frequencyLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:col-span-2 md:justify-start">
                    <DifficultyText difficulty={q.difficulty} />
                  </div>

                  <div className="hidden items-center gap-1.5 text-xs font-medium text-[#45464F] tabular-nums md:col-span-2 md:flex">
                    <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                    <span>{q.estimatedMinutes} min</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 md:col-span-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRevisit(q.id);
                      }}
                      className={`h-8 rounded-lg px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        isRevisit
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#172554]'
                      }`}
                    >
                      {isRevisit ? 'Saved' : 'Revisit'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProblem(q.id);
                      }}
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#2563EB] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
                    >
                      <span>Solve</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
