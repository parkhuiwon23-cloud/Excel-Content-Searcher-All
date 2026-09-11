import React, { useState } from 'react';
import { SearchResultCard } from '../types';
import { exportResultsToCsv } from '../utils/excelParser';

interface CardViewListProps {
  results: SearchResultCard[];
  onSelectResult: (item: SearchResultCard) => void;
  fileName: string;
}

export const CardViewList: React.FC<CardViewListProps> = ({
  results,
  onSelectResult,
  fileName
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClipboard = async () => {
    if (results.length === 0) return;
    const text = results
      .map(
        (r) =>
          `[${r.sheetName}] ${r.address} (${r.row}행 ${r.colLetter}열): ${r.matchedValue}`
      )
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCsv = () => {
    exportResultsToCsv(results, `${fileName.replace(/\.[^/.]+$/, '')}_검색결과.csv`);
  };

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-[#e7eeff] shadow-sm my-4">
        <span className="material-symbols-outlined text-[48px] text-[#3f4940]/40 mb-2">
          search_off
        </span>
        <h3 className="text-[16px] font-bold text-[#111c2d]">검색 결과가 없습니다</h3>
        <p className="text-[13px] text-[#3f4940] mt-1">
          다른 검색어를 입력하시거나 완전 일치 옵션을 해제해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 pb-6">
      {/* Search Result Cards */}
      {results.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectResult(item)}
          className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-[#e7eeff] transition-all active:scale-[0.99] cursor-pointer"
        >
          {/* Header row: Coordinates & arrow button */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f3ff] text-[#005f30] text-[13px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">pin_drop</span>
              <span>
                [{item.sheetName}] {item.row}행 {item.colLetter}열 ({item.address})
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#3f4940] group-hover:bg-[#005f30] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>

          {/* Matched Cell Content Box */}
          <div className="bg-[#f0f3ff] rounded-lg p-3 mb-2.5 flex items-center flex-wrap gap-1.5">
            {item.prefixText && (
              <span className="text-[#111c2d] text-[14px] font-medium">
                {item.prefixText}
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-[#b3f1c5] text-[#005f30] text-[16px] sm:text-[17px] font-bold leading-relaxed">
              &lt; {item.matchedText} &gt;
            </span>
            {item.suffixText && (
              <span className="text-[#111c2d] text-[14px] font-medium">
                {item.suffixText}
              </span>
            )}
          </div>

          {/* Metadata Chips Row */}
          <div className="flex items-center gap-2 text-[#3f4940] text-[12px] flex-wrap">
            {item.chips.map((chip, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#cfdaf2]">·</span>}
                {chip.isBadge ? (
                  <span className="text-[12px] text-[#3f4940] bg-[#e7eeff] px-1.5 py-0.2 rounded font-semibold">
                    {chip.value}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium">
                    {idx === 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005f30] shrink-0"></span>
                    )}
                    {chip.label}: <strong className="text-[#111c2d]">{chip.value}</strong>
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}

      {/* Quick Export Bar */}
      <div className="p-4 rounded-xl bg-[#e7eeff] flex items-center justify-between mt-2 border border-[#dee8ff]">
        <div className="flex items-center gap-2 text-[#111c2d]">
          <span className="material-symbols-outlined text-[#005f30] text-[20px]">download</span>
          <span className="text-[13px] font-semibold">검색 결과 추출</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="h-8 px-3 rounded-lg bg-white text-[#111c2d] text-[11px] font-bold shadow-sm active:scale-95 hover:bg-[#f0f3ff] transition-all cursor-pointer border border-[#e2e8f0]"
          >
            CSV 저장
          </button>
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="h-8 px-3 rounded-lg bg-[#005f30] text-white text-[11px] font-bold shadow-sm active:scale-95 hover:bg-[#0d7a41] transition-all cursor-pointer"
          >
            {copied ? '복사 완료!' : '클립보드 복사'}
          </button>
        </div>
      </div>
    </div>
  );
};
