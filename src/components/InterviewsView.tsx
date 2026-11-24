import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  InterviewDrive,
  InterviewStage,
  MockInterviewPrompt,
} from '../types/placement';
import { Checkbox, CompanyMark, ProgressBar } from './ui/Controls';

interface InterviewsViewProps {
  drives: InterviewDrive[];
  selectedDriveId: string;
  mockPrompts: MockInterviewPrompt[];
  mockNotes: Record<string, string>;
  mockRubricChecked: Record<string, string[]>;
  onSelectDrive: (id: string) => void;
  onUpdateDriveStage: (driveId: string, stage: InterviewStage) => void;
  onToggleChecklistItem: (driveId: string, itemId: string) => void;
  onAddChecklistItem: (driveId: string, label: string) => void;
  onAddDrive: (drive: InterviewDrive) => void;
  onUpdateMockNote: (promptId: string, note: string) => void;
  onToggleMockRubric: (promptId: string, rubricText: string) => void;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  drives,
  selectedDriveId,
  mockPrompts,
  mockNotes,
  mockRubricChecked,
  onSelectDrive,
  onUpdateDriveStage,
  onToggleChecklistItem,
  onAddChecklistItem,
  onAddDrive,
  onUpdateMockNote,
  onToggleMockRubric,
}) => {
  const [subView, setSubView] = useState<'pipeline' | 'mock'>('pipeline');
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Drive modal state
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDate, setFormDate] = useState('Dec 20, 2026');
  const [formRound, setFormRound] = useState('Online Assessment');
  const [formError, setFormError] = useState('');

  // Mock Interview Drill state
  const [activeMockId, setActiveMockId] = useState(mockPrompts[0]?.id ?? '');
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTalkingPoints, setShowTalkingPoints] = useState(false);

  const selectedDrive =
    drives.find((d) => d.id === selectedDriveId) ?? drives[0];

  const activeMock =
    mockPrompts.find((m) => m.id === activeMockId) ?? mockPrompts[0];

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const handleSelectMock = (promptId: string) => {
    setActiveMockId(promptId);
    setTimerRunning(false);
    setElapsedSeconds(0);
    setShowTalkingPoints(false);
  };

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formRole.trim()) {
      setFormError('Please provide both a company name and target role.');
      return;
    }

    const newDrive: InterviewDrive = {
      id: `drive-${Date.now()}`,
      company: formCompany.trim(),
      role: formRole.trim(),
      ctcRange: 'Competitive Grad Package',
      driveDate: formDate.trim() || 'TBD',
      stage: InterviewStage.Applied,
      nextRoundTitle: formRound.trim() || 'Initial Screening',
      locationOrMode: 'Campus Placement Portal',
      focusTopics: ['Data Structures', 'Core CS', 'Project Deep Dive'],
      roundStructure: [
        'Round 1: Online Coding & Aptitude',
        'Round 2: Technical Problem Solving',
        'Round 3: Hiring Manager',
      ],
      checklist: [
        { id: `chk-${Date.now()}-1`, label: 'Tailor resume highlights to job description', done: false },
        { id: `chk-${Date.now()}-2`, label: 'Complete 1 timed company assessment drill', done: false },
      ],
    };

    onAddDrive(newDrive);
    onSelectDrive(newDrive.id);
    setFormCompany('');
    setFormRole('');
    setFormError('');
    setIsAddModalOpen(false);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrive || !newTaskText.trim()) return;
    onAddChecklistItem(selectedDrive.id, newTaskText.trim());
    setNewTaskText('');
  };

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const formattedTimer = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Header + Segmented View Switch */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#172554]">
            Interviews & Company Prep Packs
          </h1>
          <p className="text-sm text-[#45464F]">
            Manage active campus recruitment rounds or practice timed Behavioral & System Design drills.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1 shrink-0">
          <button
            type="button"
            onClick={() => setSubView('pipeline')}
            className={`h-9 rounded-lg px-3.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              subView === 'pipeline'
                ? 'bg-[#172554] text-white'
                : 'text-[#45464F] hover:text-[#172554]'
            }`}
          >
            Campus Pipeline ({drives.length})
          </button>
          <button
            type="button"
            onClick={() => setSubView('mock')}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              subView === 'mock'
                ? 'bg-[#7C3AED] text-white'
                : 'text-[#45464F] hover:text-[#7C3AED]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mock Interview Drill</span>
          </button>
        </div>
      </div>

      {subView === 'pipeline' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left: Active Drives List */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-level-1 lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h2 className="text-base font-semibold text-[#172554]">Active Drives</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#2563EB] px-3 text-xs font-semibold text-white hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Drive</span>
              </button>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {drives.map((drive) => {
                const isSelected = selectedDrive?.id === drive.id;
                const doneCount = drive.checklist.filter((c) => c.done).length;
                return (
                  <button
                    key={drive.id}
                    type="button"
                    onClick={() => onSelectDrive(drive.id)}
                    className={`flex w-full items-start gap-3.5 rounded-xl p-3.5 text-left transition-colors ${
                      isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <CompanyMark company={drive.company} size="sm" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#172554] truncate">
                          {drive.company}
                        </span>
                        <span className="text-[11px] font-medium text-[#64748B] tabular-nums shrink-0">
                          {drive.driveDate}
                        </span>
                      </div>
                      <div className="text-xs text-[#45464F] truncate">{drive.role}</div>
                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span className="font-semibold text-[#2563EB]">{drive.stage}</span>
                        <span className="tabular-nums">
                          {doneCount}/{drive.checklist.length} tasks
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Company Prep Pack Detail */}
          {selectedDrive && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 lg:col-span-7 space-y-6">
              <div className="flex flex-col gap-4 border-b border-[#F1F5F9] pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <CompanyMark company={selectedDrive.company} />
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-[#172554]">
                      {selectedDrive.company} — Prep Pack
                    </h2>
                    <p className="text-sm text-[#45464F]">{selectedDrive.role}</p>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {selectedDrive.driveDate}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedDrive.locationOrMode}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#0B1C30]">{selectedDrive.ctcRange}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <label htmlFor="drive-stage" className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    id="drive-stage"
                    value={selectedDrive.stage}
                    onChange={(e) =>
                      onUpdateDriveStage(selectedDrive.id, e.target.value as InterviewStage)
                    }
                    className="h-9 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-[#172554] focus:border-[#2563EB] focus:outline-none"
                  >
                    {Object.values(InterviewStage).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Focus Topics & Round Structure */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold tracking-wide text-[#64748B]">
                    Interview Round Format
                  </h3>
                  <ul className="space-y-1.5 text-xs leading-5 text-[#0B1C30]">
                    {selectedDrive.roundStructure.map((round, i) => (
                      <li key={i}>• {round}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold tracking-wide text-[#64748B]">
                    High-Frequency Focus Areas
                  </h3>
                  <div className="text-xs leading-6 text-[#2563EB] font-medium">
                    {selectedDrive.focusTopics.join(' · ')}
                  </div>
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="border-t border-[#F1F5F9] pt-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#172554]">
                    Preparation Checklist
                  </h3>
                  <span className="text-xs font-semibold text-[#64748B] tabular-nums">
                    {selectedDrive.checklist.filter((c) => c.done).length} /{' '}
                    {selectedDrive.checklist.length} done
                  </span>
                </div>

                <ProgressBar
                  value={selectedDrive.checklist.filter((c) => c.done).length}
                  max={selectedDrive.checklist.length}
                  tone="blue"
                />

                <div className="divide-y divide-[#F1F5F9]">
                  {selectedDrive.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onToggleChecklistItem(selectedDrive.id, item.id)}
                      className="flex cursor-pointer items-center gap-3 py-3 transition-colors hover:bg-[#F8FAFC] px-2 rounded-lg"
                    >
                      <Checkbox
                        checked={item.done}
                        onChange={() => onToggleChecklistItem(selectedDrive.id, item.id)}
                        ariaLabel={item.label}
                      />
                      <span
                        className={`text-sm ${
                          item.done ? 'line-through text-[#64748B]' : 'text-[#0B1C30]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddChecklist} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a custom preparation task..."
                    aria-label="New checklist task"
                    className="h-[42px] flex-1 rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0B1C30] placeholder:text-[#64748B] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                  <button
                    type="submit"
                    className="h-[42px] rounded-lg border border-[#E2E8F0] bg-white px-4 text-xs font-semibold text-[#172554] hover:bg-[#F8FAFC] whitespace-nowrap shrink-0"
                  >
                    Add Task
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mock Interview Drill Studio */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Prompt List */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-level-1 lg:col-span-4 space-y-3">
            <h2 className="text-base font-semibold text-[#172554] pb-3 border-b border-[#F1F5F9]">
              Mock Prompts
            </h2>
            <div className="divide-y divide-[#F1F5F9]">
              {mockPrompts.map((mp) => {
                const selected = mp.id === activeMock.id;
                const checkedCount = (mockRubricChecked[mp.id] ?? []).length;
                return (
                  <button
                    key={mp.id}
                    type="button"
                    onClick={() => handleSelectMock(mp.id)}
                    className={`w-full rounded-xl p-3.5 text-left transition-colors space-y-1 ${
                      selected ? 'bg-[#F5F3FF]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-[#7C3AED]">{mp.type}</span>
                      <span className="text-[#64748B] tabular-nums">
                        ~{mp.recommendedMinutes} min
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-[#172554]">{mp.title}</div>
                    <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>{mp.companyTag}</span>
                      <span className="tabular-nums">
                        {checkedCount}/{mp.rubricItems.length} rubric checks
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Mock Drill Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-1 lg:col-span-8 space-y-6">
            <div className="flex flex-col gap-4 border-b border-[#F1F5F9] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#7C3AED]">
                  {activeMock.type} · {activeMock.companyTag}
                </div>
                <h2 className="text-xl font-bold text-[#172554]">{activeMock.title}</h2>
              </div>

              {/* Response Pacing Timer */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-mono text-sm font-semibold text-[#172554] tabular-nums">
                  <Clock className="h-4 w-4 text-[#7C3AED]" />
                  <span>{formattedTimer}</span>
                  <span className="text-xs font-normal text-[#64748B]">
                    / {activeMock.recommendedMinutes}:00
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTimerRunning((r) => !r)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#7C3AED] px-4 text-xs font-semibold text-white hover:bg-[#6D28D9] whitespace-nowrap"
                >
                  {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{timerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setElapsedSeconds(0);
                  }}
                  aria-label="Reset timer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#172554]"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] p-5 border border-[#E2E8F0]">
              <p className="text-base font-medium leading-7 text-[#0B1C30]">
                “{activeMock.prompt}”
              </p>
            </div>

            {/* Structured Outline / Notes */}
            <div className="space-y-2">
              <label
                htmlFor="mock-notes"
                className="block text-xs font-semibold tracking-wide text-[#64748B]"
              >
                Your Structured Response Outline (Auto-Saved)
              </label>
              <textarea
                id="mock-notes"
                rows={4}
                value={mockNotes[activeMock.id] ?? ''}
                onChange={(e) => onUpdateMockNote(activeMock.id, e.target.value)}
                placeholder="Draft your STAR bullet points or system architecture components here..."
                className="w-full rounded-xl border border-[#CBD5E1] bg-white p-3.5 text-sm leading-6 text-[#0B1C30] placeholder:text-[#64748B] focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
              />
            </div>

            {/* Self-Evaluation Rubric */}
            <div className="space-y-3 border-t border-[#F1F5F9] pt-5">
              <h3 className="text-sm font-semibold text-[#172554]">
                Self-Evaluation Rubric
              </h3>
              <div className="divide-y divide-[#F1F5F9]">
                {activeMock.rubricItems.map((rubric) => {
                  const checked = (mockRubricChecked[activeMock.id] ?? []).includes(rubric);
                  return (
                    <div
                      key={rubric}
                      onClick={() => onToggleMockRubric(activeMock.id, rubric)}
                      className="flex cursor-pointer items-center gap-3 py-2.5 hover:bg-[#F8FAFC] px-2 rounded-lg"
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => onToggleMockRubric(activeMock.id, rubric)}
                        ariaLabel={rubric}
                      />
                      <span className="text-sm text-[#0B1C30]">{rubric}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Talking Points Toggle */}
            <div className="border-t border-[#F1F5F9] pt-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowTalkingPoints((s) => !s)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 text-xs font-semibold text-[#7C3AED] hover:bg-[#F5F3FF]"
              >
                {showTalkingPoints ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
                <span>
                  {showTalkingPoints
                    ? 'Hide Sample Key Talking Points'
                    : 'Reveal Sample Key Talking Points'}
                </span>
              </button>

              {showTalkingPoints && (
                <ul className="space-y-2 rounded-xl border border-[#E9D5FF] bg-[#F5F3FF] p-4 text-xs leading-5 text-[#4C1D95]">
                  {activeMock.keyTalkingPoints.map((pt, i) => (
                    <li key={i}>• {pt}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Campus Drive Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172554]/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-drive-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-level-4 space-y-5">
            <div className="flex items-center justify-between">
              <h2 id="add-drive-title" className="text-lg font-bold text-[#172554]">
                Add Campus Drive
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormError('');
                }}
                aria-label="Close modal"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#172554]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-4">
              <div>
                <label
                  htmlFor="drive-company"
                  className="block text-xs font-semibold text-[#172554] mb-1.5"
                >
                  Company Name
                </label>
                <input
                  id="drive-company"
                  type="text"
                  value={formCompany}
                  onChange={(e) => {
                    setFormCompany(e.target.value);
                    setFormError('');
                  }}
                  placeholder="e.g., Atlassian"
                  className={`h-[42px] w-full rounded-lg border bg-white px-3.5 text-sm text-[#0B1C30] placeholder:text-[#64748B] focus:outline-none focus:ring-2 ${
                    formError && !formCompany.trim()
                      ? 'border-[#DC2626] focus:ring-[#DC2626]/20'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="drive-role"
                  className="block text-xs font-semibold text-[#172554] mb-1.5"
                >
                  Target Role
                </label>
                <input
                  id="drive-role"
                  type="text"
                  value={formRole}
                  onChange={(e) => {
                    setFormRole(e.target.value);
                    setFormError('');
                  }}
                  placeholder="e.g., Graduate Software Engineer"
                  className={`h-[42px] w-full rounded-lg border bg-white px-3.5 text-sm text-[#0B1C30] placeholder:text-[#64748B] focus:outline-none focus:ring-2 ${
                    formError && !formRole.trim()
                      ? 'border-[#DC2626] focus:ring-[#DC2626]/20'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="drive-date"
                    className="block text-xs font-semibold text-[#172554] mb-1.5"
                  >
                    Drive Date
                  </label>
                  <input
                    id="drive-date"
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="h-[42px] w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0B1C30] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="drive-next-round"
                    className="block text-xs font-semibold text-[#172554] mb-1.5"
                  >
                    Next Round
                  </label>
                  <input
                    id="drive-next-round"
                    type="text"
                    value={formRound}
                    onChange={(e) => setFormRound(e.target.value)}
                    className="h-[42px] w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 text-sm text-[#0B1C30] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs font-medium text-[#DC2626]">{formError}</p>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormError('');
                  }}
                  className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-4 text-xs font-semibold text-[#45464F] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#2563EB] px-4 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                >
                  Save Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
