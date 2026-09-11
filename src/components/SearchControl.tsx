import React, { useRef } from 'react';
import { ViewMode } from '../types';

interface SearchControlProps {
  query: string;
  onQueryChange: (val: string) => void;
  onSearch: () => void;
  exactMatch: boolean;
  onExactMatchChange: (val: boolean) => void;
  caseSensitive: boolean;
  onCaseSensitiveChange: (val: boolean) => void;
  resultCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  fileName: string;
  isSticky?: boolean;
}

export const SearchControl: React.FC<SearchControlProps> = ({
  query,
  onQueryChange,
  onSearch,
  exactMatch,
  onExactMatchChange,
  caseSensitive,
  onCaseSensitiveChange,
  resultCount,
  viewMode,
  onViewModeChange,
  fileName,
  isSticky = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onQueryChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={`flex flex-col space-y-3 ${isSticky ? 'sticky top-16 z-40 bg-[#f9f9ff]/95 backdrop-blur-md pb-2 pt-2 -mx-4 px-4 shadow-sm border-b border-[#e7eeff]' : ''}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-white rounded-xl shadow-md p-1.5 transition-all focus-within:shadow-lg border border-[#e7eeff]">
        <div className="pl-3 pr-2 flex items-center pointer-events-none text-[#3f4940]">
          <span className="material-symbols-outlined text-[22px]">search</span>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요 (예: 과목명, 학점, 교수, 셀 주소)"
          className="w-full bg-transparent text-[#111c2d] text-[15px] font-medium focus:outline-none placeholder:text-[#3f4940]/50 pr-8"
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-full text-[#3f4940] hover:bg-[#f0f3ff] transition-colors cursor-pointer mr-1"
            title="검색어 지우기"
          >
            <span className="material-symbols-outlined text-[18px]">cancel</span>
          </button>
        )}

        <button
          type="button"
          onClick={onSearch}
          className="h-10 sm:h-11 px-4 sm:px-5 rounded-lg bg-[#005f30] text-white text-[14px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 hover:bg-[#0d7a41] transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          <span>검색</span>
        </button>
      </div>

      {/* Control bar: Options + View Switcher + Counter */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2.5">
        {/* Checkbox Options */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={exactMatch}
              onChange={(e) => onExactMatchChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-4 h-4 rounded bg-[#d8e3fb] peer-checked:bg-[#005f30] flex items-center justify-center transition-colors">
              <span className={`material-symbols-outlined text-[14px] text-white font-bold transition-transform ${exactMatch ? 'scale-100' : 'scale-0'}`}>
                check
              </span>
            </div>
            <span className="text-[12px] text-[#3f4940] group-hover:text-[#111c2d] transition-colors">
              완전 일치
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => onCaseSensitiveChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-4 h-4 rounded bg-[#d8e3fb] peer-checked:bg-[#005f30] flex items-center justify-center transition-colors">
              <span className={`material-symbols-outlined text-[14px] text-white font-bold transition-transform ${caseSensitive ? 'scale-100' : 'scale-0'}`}>
                check
              </span>
            </div>
            <span className="text-[12px] text-[#3f4940] group-hover:text-[#111c2d] transition-colors">
              대소문자 구분
            </span>
          </label>
        </div>

        {/* View Switcher & Result Badge */}
        <div className="flex items-center gap-2">
          {/* Card / Table View Toggle */}
          <div className="inline-flex p-0.5 bg-[#dee8ff] rounded-full shadow-inner">
            <button
              type="button"
              onClick={() => onViewModeChange('card')}
              className={`px-3 py-1 rounded-full text-[12px] flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-[#005f30] text-white font-bold shadow-sm'
                  : 'text-[#3f4940] hover:text-[#111c2d]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">grid_view</span>
              <span>카드 뷰</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1 rounded-full text-[12px] flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#005f30] text-white font-bold shadow-sm'
                  : 'text-[#3f4940] hover:text-[#111c2d]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">table_chart</span>
              <span>테이블 뷰</span>
            </button>
          </div>

          {/* Result Count Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b3f1c5] text-[#366f4d]">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              insights
            </span>
            <span className="text-[11px] font-bold whitespace-nowrap">
              검색 결과 {resultCount}건
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
