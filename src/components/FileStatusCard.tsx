import React from 'react';
import { ExcelWorkbook } from '../types';

interface FileStatusCardProps {
  workbook: ExcelWorkbook;
  onSelectAnotherFile: () => void;
}

export const FileStatusCard: React.FC<FileStatusCardProps> = ({
  workbook,
  onSelectAnotherFile
}) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-xl p-4 shadow-sm border border-[#e7eeff] transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#b3f1c5] flex items-center justify-center shrink-0 shadow-sm">
            <span
              className="material-symbols-outlined text-[#366f4d] text-[26px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              table_chart
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] text-[#111c2d] font-bold truncate max-w-[200px] sm:max-w-xs">
                {workbook.name}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#005f30] shrink-0 animate-pulse"></span>
            </div>
            <span className="text-[12px] text-[#3f4940] font-medium">
              {workbook.sizeFormatted} · {workbook.sheetCount}개 시트 로드됨
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSelectAnotherFile}
          className="shrink-0 h-9 px-3 rounded-full bg-[#f0f3ff] text-[#005f30] flex items-center gap-1.5 hover:bg-[#e7eeff] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          <span className="text-[12px] font-semibold whitespace-nowrap">다른 파일 선택</span>
        </button>
      </div>
    </div>
  );
};
