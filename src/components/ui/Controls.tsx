import React from 'react';
import { Check } from 'lucide-react';
import { Difficulty } from '../../types/placement';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, ariaLabel }) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
        checked
          ? 'border-[#2563EB] bg-[#2563EB] text-white'
          : 'border-[#CBD5E1] bg-white hover:border-[#2563EB]'
      }`}
    >
      {checked && <Check className="h-3 w-3 stroke-[2.75]" />}
    </button>
  );
};

interface RadioButtonProps {
  selected: boolean;
  label?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ selected }) => {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white transition-colors ${
        selected ? 'border-[#2563EB]' : 'border-[#CBD5E1]'
      }`}
    >
      {selected && <span className="h-2 w-2 rounded-full bg-[#2563EB]" />}
    </span>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: 'blue' | 'green' | 'purple' | 'navy';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  tone = 'blue',
}) => {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const fillColor =
    tone === 'green'
      ? 'bg-[#16A34A]'
      : tone === 'purple'
        ? 'bg-[#7C3AED]'
        : tone === 'navy'
          ? 'bg-[#172554]'
          : 'bg-[#2563EB]';

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${fillColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const COMPANY_COLORS: Record<string, { bg: string; text: string; short: string }> = {
  Google: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', short: 'G' },
  Amazon: { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', short: 'A' },
  Microsoft: { bg: 'bg-[#EEF2FF]', text: 'text-[#172554]', short: 'M' },
  Stripe: { bg: 'bg-[#F3E8FF]', text: 'text-[#6D28D9]', short: 'S' },
  Atlassian: { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', short: 'AT' },
  'Goldman Sachs': { bg: 'bg-[#F1F5F9]', text: 'text-[#0B1C30]', short: 'GS' },
};

export const CompanyMark: React.FC<{ company: string; size?: 'sm' | 'md' }> = ({
  company,
  size = 'md',
}) => {
  const style = COMPANY_COLORS[company] ?? {
    bg: 'bg-[#F1F5F9]',
    text: 'text-[#172554]',
    short: company.slice(0, 2).toUpperCase(),
  };

  const dims = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] font-semibold ${dims} ${style.bg} ${style.text}`}
      aria-hidden="true"
    >
      {style.short}
    </div>
  );
};

export const DifficultyText: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  const color =
    difficulty === Difficulty.Easy
      ? 'text-[#16A34A]'
      : difficulty === Difficulty.Medium
        ? 'text-[#B45309]'
        : 'text-[#DC2626]';

  return <span className={`text-[13px] font-semibold ${color}`}>{difficulty}</span>;
};
