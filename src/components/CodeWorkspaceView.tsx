import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  Lightbulb,
  Play,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import { CodeLanguage, Question } from '../types/placement';
import { DifficultyText } from './ui/Controls';

interface TestRunResult {
  id: string;
  inputDisplay: string;
  expectedDisplay: string;
  actualDisplay: string;
  passed: boolean;
  error?: string;
}

interface CodeWorkspaceViewProps {
  questions: Question[];
  activeQuestionId: string;
  solvedIds: string[];
  codeDrafts: Record<string, Record<CodeLanguage, string>>;
  onSelectQuestion: (id: string) => void;
  onUpdateDraft: (questionId: string, lang: CodeLanguage, code: string) => void;
  onMarkSolved: (questionId: string, solved: boolean) => void;
  onBackToBank: () => void;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, idx) => deepEqual(item, b[idx]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])
    );
  }
  return false;
}

export const CodeWorkspaceView: React.FC<CodeWorkspaceViewProps> = ({
  questions,
  activeQuestionId,
  solvedIds,
  codeDrafts,
  onSelectQuestion,
  onUpdateDraft,
  onMarkSolved,
  onBackToBank,
}) => {
  const question = useMemo(
    () => questions.find((q) => q.id === activeQuestionId) ?? questions[0],
    [questions, activeQuestionId]
  );

  const [language, setLanguage] = useState<CodeLanguage>(CodeLanguage.JavaScript);
  const [leftTab, setLeftTab] = useState<'description' | 'hints' | 'approach'>('description');
  const [testResults, setTestResults] = useState<TestRunResult[] | null>(null);
  const [runStatus, setRunStatus] = useState<'idle' | 'passed' | 'failed' | 'syntax_error'>('idle');
  const [syntaxErrorMsg, setSyntaxErrorMsg] = useState<string>('');
  const [submittedBanner, setSubmittedBanner] = useState<boolean>(false);

  useEffect(() => {
    setTestResults(null);
    setRunStatus('idle');
    setSyntaxErrorMsg('');
    setSubmittedBanner(false);
    setLeftTab('description');
  }, [question.id]);

  const currentCode =
    codeDrafts[question.id]?.[language] ?? question.starterCode[language];

  const isSolved = solvedIds.includes(question.id);

  const lineCount = Math.max(12, currentCode.split('\n').length);

  const executeJavaScriptTests = (isSubmission: boolean) => {
    setSyntaxErrorMsg('');
    setSubmittedBanner(false);

    if (language !== CodeLanguage.JavaScript) {
      setLanguage(CodeLanguage.JavaScript);
      return;
    }

    const codeToRun = codeDrafts[question.id]?.[CodeLanguage.JavaScript] ?? question.starterCode[CodeLanguage.JavaScript];

    try {
      const factory = new Function(
        `${codeToRun}\n; return typeof ${question.functionName} === 'function' ? ${question.functionName} : null;`
      );
      const userFn = factory();
      if (typeof userFn !== 'function') {
        setRunStatus('syntax_error');
        setSyntaxErrorMsg(
          `Expected function named "${question.functionName}" to be defined.`
        );
        setTestResults(null);
        return;
      }

      const results: TestRunResult[] = question.testCases.map((tc) => {
        try {
          const clonedArgs = structuredClone(tc.args);
          const actual = userFn(...clonedArgs);
          const passed = deepEqual(actual, tc.expected);
          return {
            id: tc.id,
            inputDisplay: tc.inputDisplay,
            expectedDisplay: JSON.stringify(tc.expected),
            actualDisplay: JSON.stringify(actual),
            passed,
          };
        } catch (err) {
          return {
            id: tc.id,
            inputDisplay: tc.inputDisplay,
            expectedDisplay: JSON.stringify(tc.expected),
            actualDisplay: 'Runtime Error',
            passed: false,
            error: err instanceof Error ? err.message : String(err),
          };
        }
      });

      const allPassed = results.every((r) => r.passed);
      setTestResults(results);
      setRunStatus(allPassed ? 'passed' : 'failed');

      if (isSubmission && allPassed) {
        onMarkSolved(question.id, true);
        setSubmittedBanner(true);
      }
    } catch (err) {
      setRunStatus('syntax_error');
      setSyntaxErrorMsg(err instanceof Error ? err.message : String(err));
      setTestResults(null);
    }
  };

  const handleResetCode = () => {
    onUpdateDraft(question.id, language, question.starterCode[language]);
    setTestResults(null);
    setRunStatus('idle');
    setSyntaxErrorMsg('');
    setSubmittedBanner(false);
  };

  return (
    <div className="space-y-4">
      {/* Workspace Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-3.5 shadow-level-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBackToBank}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#172554] hover:bg-[#F8FAFC] whitespace-nowrap shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Question Bank</span>
          </button>

          <select
            value={question.id}
            onChange={(e) => onSelectQuestion(e.target.value)}
            aria-label="Select coding problem"
            className="h-9 max-w-xs rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-[#0B1C30] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {String(q.number).padStart(2, '0')}. {q.title} ({q.difficulty})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isSolved ? (
            <button
              type="button"
              onClick={() => onMarkSolved(question.id, false)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#DCFCE7] px-3 text-xs font-semibold text-[#16A34A] whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Solved</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onMarkSolved(question.id, true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#45464F] hover:bg-[#F8FAFC] hover:text-[#172554] whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark Solved</span>
            </button>
          )}
        </div>
      </div>

      {/* Split-Pane Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* Left Pane: Problem Definition */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-level-1 lg:col-span-5">
          <div className="flex items-center gap-1 border-b border-[#E2E8F0] px-5 pt-3">
            {(
              [
                { key: 'description', label: 'Problem' },
                { key: 'hints', label: `Hints (${question.hints.length})` },
                { key: 'approach', label: 'Approach & Complexity' },
              ] as const
            ).map((tab) => {
              const active = leftTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setLeftTab(tab.key)}
                  className={`border-b-2 px-3 pb-3 pt-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-[#64748B] hover:text-[#172554]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                <DifficultyText difficulty={question.difficulty} />
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#2563EB]">{question.topic}</span>
                <span aria-hidden="true">·</span>
                <span>{question.companies.join(', ')}</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#172554]">
                {question.number}. {question.title}
              </h2>
            </div>

            {leftTab === 'description' && (
              <div className="space-y-5">
                <p className="text-sm leading-6 text-[#0B1C30]">{question.prompt}</p>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold tracking-wide text-[#64748B]">
                    Examples
                  </h3>
                  {question.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#F8FAFC] p-3.5 text-xs font-mono leading-5 text-[#0B1C30] border border-[#E2E8F0]"
                    >
                      <div>
                        <span className="font-semibold text-[#45464F]">Input: </span>
                        {ex.input}
                      </div>
                      <div className="mt-1">
                        <span className="font-semibold text-[#45464F]">Output: </span>
                        {ex.output}
                      </div>
                      {ex.explanation && (
                        <div className="mt-1 font-sans text-[#64748B]">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-[#F1F5F9] pt-4">
                  <h3 className="text-xs font-semibold tracking-wide text-[#64748B]">
                    Constraints
                  </h3>
                  <ul className="space-y-1.5 text-xs font-mono text-[#45464F]">
                    {question.constraints.map((c, idx) => (
                      <li key={idx}>• {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {leftTab === 'hints' && (
              <div className="space-y-3">
                {question.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-4 text-sm leading-6 text-[#92400E]"
                  >
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#B45309]">
                      <Lightbulb className="h-3.5 w-3.5" />
                      <span>Practice Hint {idx + 1}</span>
                    </div>
                    <p>{hint}</p>
                  </div>
                ))}
              </div>
            )}

            {leftTab === 'approach' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-[#64748B]">Optimal Strategy</h3>
                  <p className="text-sm leading-6 text-[#0B1C30]">{question.approachSummary}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-[#F1F5F9] pt-4">
                  <div className="rounded-xl bg-[#F8FAFC] p-3.5 border border-[#E2E8F0]">
                    <div className="text-xs font-medium text-[#64748B]">Time Complexity</div>
                    <div className="mt-1 font-mono text-sm font-semibold text-[#172554]">
                      {question.timeComplexity}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] p-3.5 border border-[#E2E8F0]">
                    <div className="text-xs font-medium text-[#64748B]">Space Complexity</div>
                    <div className="mt-1 font-mono text-sm font-semibold text-[#172554]">
                      {question.spaceComplexity}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Pane: Code Terminal & Test Runner */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-level-1 lg:col-span-7 overflow-hidden">
          {/* Editor Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
            <div className="flex items-center gap-2">
              <label htmlFor="code-lang" className="sr-only">
                Programming Language
              </label>
              <select
                id="code-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
                className="h-8 rounded-lg border border-[#CBD5E1] bg-white px-2.5 text-xs font-semibold text-[#172554] focus:border-[#2563EB] focus:outline-none"
              >
                <option value={CodeLanguage.JavaScript}>JavaScript (Live Runner)</option>
                <option value={CodeLanguage.Python}>Python 3 (Template)</option>
                <option value={CodeLanguage.Cpp}>C++20 (Template)</option>
              </select>

              <button
                type="button"
                onClick={handleResetCode}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs font-medium text-[#45464F] hover:text-[#172554] whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => executeJavaScriptTests(false)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 text-xs font-semibold text-[#172554] transition-colors hover:bg-[#F8FAFC] whitespace-nowrap shrink-0"
              >
                <Play className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>
                  {language === CodeLanguage.JavaScript ? 'Run Sample Tests' : 'Run in JS Sandbox'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => executeJavaScriptTests(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          {language !== CodeLanguage.JavaScript && (
            <div className="border-b border-[#E2E8F0] bg-[#EFF6FF] px-5 py-2 text-xs text-[#1D4ED8]">
              In-browser execution evaluates JavaScript solutions directly. Use Python/C++ as your
              drafting pad, or switch to JavaScript to run live test assertions.
            </div>
          )}

          {/* Code Editor Surface */}
          <div className="flex bg-[#0B1C30] text-[#EAF1FF] font-mono text-[13px] leading-6">
            <div
              aria-hidden="true"
              className="select-none border-r border-[#1E293B] bg-[#071324] px-3 py-4 text-right text-xs leading-6 text-[#64748B] tabular-nums"
            >
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={currentCode}
              onChange={(e) => onUpdateDraft(question.id, language, e.target.value)}
              spellCheck={false}
              aria-label="Code editor"
              className="min-h-[300px] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 text-[#EAF1FF] focus:outline-none"
            />
          </div>

          {/* Test Results Panel */}
          <div className="border-t border-[#E2E8F0] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wide text-[#64748B]">
                Test Case Results ({question.testCases.length} Sample Cases)
              </h3>
              {submittedBanner && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
                  <CheckCircle2 className="h-4 w-4" />
                  All tests passed · Problem marked solved
                </span>
              )}
            </div>

            {runStatus === 'syntax_error' && (
              <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs font-mono text-[#DC2626]">
                Syntax / Function Error: {syntaxErrorMsg}
              </div>
            )}

            {testResults === null && runStatus === 'idle' && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {question.testCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs font-mono text-[#45464F]"
                  >
                    <div className="font-sans font-semibold text-[#172554]">Case {idx + 1}</div>
                    <div className="mt-1 truncate">{tc.inputDisplay}</div>
                    <div className="mt-0.5 text-[#64748B]">
                      Expected: {JSON.stringify(tc.expected)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {testResults && (
              <div className="space-y-2">
                {testResults.map((res, idx) => (
                  <div
                    key={res.id}
                    className={`rounded-xl border p-3.5 text-xs ${
                      res.passed
                        ? 'border-[#BBF7D0] bg-[#F0FDF4]'
                        : 'border-[#FECACA] bg-[#FEF2F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className={res.passed ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                        {res.passed ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            Case {idx + 1} Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <XCircle className="h-4 w-4" />
                            Case {idx + 1} Failed
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[#45464F]">{res.inputDisplay}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-1 font-mono text-[#0B1C30] sm:grid-cols-2">
                      <div>Expected: {res.expectedDisplay}</div>
                      <div>Output: {res.error ? `Error: ${res.error}` : res.actualDisplay}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
