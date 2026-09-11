import React from 'react';
import { Sheet } from '../types';

interface SheetSelectorProps {
  sheets: Sheet[];
  selectedSheet: string;
  onSelectSheet: (sheetName: string) => void;
  totalMatchCount: number;
  sheetMatchCounts: Record<string, number>;
}

export const SheetSelector: React.FC<SheetSelectorProps> = ({
  sheets,
  selectedSheet,
  onSelectSheet,
  totalMatchCount,
  sheetMatchCounts
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
      {/* All Sheets option */}
      <button
        type="button"
        onClick={() => onSelectSheet('all')}
        className={`h-8 px-4 rounded-full font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 text-[12px] cursor-pointer ${
          selectedSheet === 'all'
            ? 'bg-[#005f30] text-white'
            : 'bg-white text-[#3f4940] hover:bg-[#e7eeff]'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">layers</span>
        <span>전체 시트</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ml-0.5 ${
            selectedSheet === 'all'
              ? 'bg-[#b3f1c5] text-[#366f4d]'
              : 'bg-[#f0f3ff] text-[#3f4940]'
          }`}
        >
          {totalMatchCount}
        </span>
      </button>

      {/* Individual Sheets */}
      {sheets.map((sheet) => {
        const isSelected = selectedSheet === sheet.name;
        const count = sheetMatchCounts[sheet.name] ?? 0;

        return (
          <button
            key={sheet.name}
            type="button"
            onClick={() => onSelectSheet(sheet.name)}
            className={`h-8 px-4 rounded-full font-medium flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 text-[12px] cursor-pointer ${
              isSelected
                ? 'bg-[#005f30] text-white font-semibold'
                : 'bg-white text-[#3f4940] hover:bg-[#e7eeff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">tab</span>
            <span>{sheet.name}</span>
            <span
              className={`text-[10px] ${
                isSelected ? 'text-[#b3f1c5]' : 'text-[#3f4940]/70'
              }`}
            >
              {count}건
            </span>
          </button>
        );
      })}
    </div>
  );
};
