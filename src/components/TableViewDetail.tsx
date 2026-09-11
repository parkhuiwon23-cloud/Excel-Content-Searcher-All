import React, { useState } from 'react';
import { SearchResultCard, Sheet } from '../types';
import { exportRowToCsv } from '../utils/excelParser';

interface TableViewDetailProps {
  activeResult: SearchResultCard | null;
  sheet: Sheet;
  onSelectRowNumber: (rowNum: number) => void;
  onOpenZoomModal: (cellInfo: { address: string; value: string; formula?: string; type: string }) => void;
  onOpenJumpModal: () => void;
  isFreezeColumns: boolean;
  onToggleFreezeColumns: () => void;
  query: string;
}

export const TableViewDetail: React.FC<TableViewDetailProps> = ({
  activeResult,
  sheet,
  onSelectRowNumber,
  onOpenZoomModal,
  onOpenJumpModal,
  isFreezeColumns,
  onToggleFreezeColumns,
  query
}) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Determine which row is selected
  const currentRowIndex = activeResult ? activeResult.row : 1;
  const currentCellAddress = activeResult ? activeResult.address : `A${currentRowIndex}`;
  const currentCellValue = activeResult ? activeResult.matchedValue : String(sheet.rows[currentRowIndex - 1]?.[0] ?? '');
  const currentFormula = activeResult?.formula || `"${currentCellValue}"`;

  // Determine rows to display around currentRowIndex (show a window of rows, e.g. 10-15 rows)
  const windowSize = 8;
  const startRow = Math.max(1, currentRowIndex - 3);
  const endRow = Math.min(sheet.rowCount, startRow + windowSize);

  const displayRowIndices: number[] = [];
  for (let r = startRow; r <= endRow; r++) {
    displayRowIndices.push(r);
  }

  // Handle cell copy
  const handleCopyCell = async () => {
    try {
      await navigator.clipboard.writeText(currentCellValue);
      setCopyStatus('복사 완료!');
      setTimeout(() => setCopyStatus(null), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle row CSV export
  const handleExportRowCsv = () => {
    const rowData = sheet.rows[currentRowIndex - 1] || [];
    exportRowToCsv(rowData, sheet.headers, `${sheet.name}_${currentRowIndex}행_추출.csv`);
  };

  // Handle Bookmark toggle
  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handlePrevRow = () => {
    if (currentRowIndex > 1) {
      onSelectRowNumber(currentRowIndex - 1);
    }
  };

  const handleNextRow = () => {
    if (currentRowIndex < sheet.rowCount) {
      onSelectRowNumber(currentRowIndex + 1);
    }
  };

  const highlightMatch = (text: string, searchWord: string) => {
    if (!searchWord || !searchWord.trim()) return text;
    const parts = text.split(new RegExp(`(${searchWord})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchWord.toLowerCase() ? (
        <span
          key={i}
          className="bg-[#b3f1c5] text-[#366f4d] px-1 py-0.5 rounded font-bold"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Matched Cell Spotlight Card */}
      <div className="bg-white rounded-xl p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] border border-[#e7eeff] flex flex-col gap-3">
        {/* Top Badges & Cell Expand */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#b3f1c5] text-[#366f4d] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              검색 결과 {activeResult ? '1건' : '0건'} [{sheet.name}]
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#dee8ff] text-[#3f4940] text-[11px] font-bold font-mono">
              {currentRowIndex}행 {activeResult?.colLetter || 'D'}열 ({currentCellAddress})
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenZoomModal({
                address: currentCellAddress,
                value: currentCellValue,
                formula: currentFormula,
                type: '텍스트형'
              })
            }
            className="flex items-center gap-1 text-[#005f30] hover:text-[#005229] text-[12px] font-semibold active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_full</span>
            <span>셀 확대</span>
          </button>
        </div>

        {/* Matched Cell Content Box */}
        <div className="bg-[#f0f3ff] p-3 rounded-lg flex flex-col gap-1 border border-[#e7eeff]">
          <div className="flex items-center justify-between text-[#3f4940] text-[10px]">
            <span className="font-mono text-[#005f30] font-bold">매칭된 셀 원문</span>
            <span className="font-mono text-[#6f7a6f]">{currentCellAddress} • 텍스트형</span>
          </div>
          <div className="text-[17px] text-[#111c2d] font-semibold leading-snug">
            {highlightMatch(currentCellValue, query)}
          </div>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#d8e3fb] text-[#111c2d] text-[13px] font-mono overflow-x-auto">
          <span className="font-bold text-[#005f30] px-1.5 py-0.5 bg-white rounded shadow-xs text-[11px]">
            fx
          </span>
          <span className="text-[#6f7a6f]">{currentCellAddress} =</span>
          <span className="text-[#111c2d] font-medium truncate">
            {currentFormula}
          </span>
          <button
            type="button"
            onClick={handleCopyCell}
            className="ml-auto flex items-center text-[#6f7a6f] hover:text-[#005f30] active:scale-95 transition-transform cursor-pointer"
            title="수식/값 복사"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
          </button>
        </div>
      </div>

      {/* Row Fields Table Card */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] border border-[#e7eeff] overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-4 pb-3 flex items-center justify-between flex-wrap gap-2 bg-white border-b border-[#e7eeff]">
          <div className="flex items-center gap-2">
            <span className="text-[17px] text-[#111c2d] font-bold">해당 행 전체 필드</span>
            <span className="px-2 py-0.5 rounded-full bg-[#dee8ff] text-[#3f4940] text-[10px] font-semibold font-mono">
              {sheet.colCount}개 칼럼
            </span>
            <span
              className="material-symbols-outlined text-[#6f7a6f] text-[18px] cursor-help"
              title="가로로 스크롤하여 더 많은 데이터를 확인할 수 있습니다"
            >
              info
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleFreezeColumns}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              isFreezeColumns
                ? 'bg-[#b3f1c5] text-[#366f4d]'
                : 'bg-[#f0f3ff] text-[#3f4940] hover:bg-[#dee8ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#005f30]">push_pin</span>
            <span>A, B열 고정 보기</span>
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="relative overflow-x-auto max-w-full">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="bg-[#dee8ff] text-[#3f4940] font-mono text-[10px] uppercase font-bold">
                {/* Row number header */}
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-[#d8e3fb] px-3 py-2.5 text-center w-12 shadow-xs border-r border-[#cfdaf2]"
                >
                  행
                </th>

                {/* Column headers */}
                {sheet.headers.map((header, colIdx) => {
                  const isA = colIdx === 0 && isFreezeColumns;
                  const isB = colIdx === 1 && isFreezeColumns;
                  const stickyClass = isA
                    ? 'sticky left-12 z-20 bg-[#dee8ff] shadow-xs border-r border-[#cfdaf2]'
                    : isB
                    ? 'sticky left-[138px] z-20 bg-[#dee8ff] shadow-xs border-r border-[#cfdaf2]'
                    : '';

                  return (
                    <th
                      key={colIdx}
                      scope="col"
                      className={`px-3 py-2.5 whitespace-nowrap min-w-[100px] ${stickyClass}`}
                    >
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="font-mono text-[#111c2d]">
              {displayRowIndices.map((rowNum) => {
                const isSelectedRow = rowNum === currentRowIndex;
                const rowData = sheet.rows[rowNum - 1] || [];

                return (
                  <tr
                    key={rowNum}
                    onClick={() => onSelectRowNumber(rowNum)}
                    className={`cursor-pointer transition-colors border-b border-[#e7eeff] ${
                      isSelectedRow
                        ? 'bg-[#b3f1c5]/40 hover:bg-[#b3f1c5]/60 shadow-sm'
                        : 'bg-white hover:bg-[#f0f3ff]'
                    }`}
                  >
                    {/* Row Index Cell */}
                    <td
                      className={`sticky left-0 z-10 px-3 py-3 text-center border-r border-[#cfdaf2] font-semibold ${
                        isSelectedRow
                          ? 'bg-[#005f30] text-white font-bold'
                          : 'bg-[#f0f3ff] text-[#6f7a6f]'
                      }`}
                    >
                      {rowNum}
                    </td>

                    {/* Data Cells */}
                    {sheet.headers.map((_, colIdx) => {
                      const isA = colIdx === 0 && isFreezeColumns;
                      const isB = colIdx === 1 && isFreezeColumns;
                      const cellVal = String(rowData[colIdx] ?? '');
                      const isCurrentMatchedCell =
                        isSelectedRow &&
                        activeResult &&
                        colIdx === activeResult.col - 1;

                      const stickyCellClass = isA
                        ? `sticky left-12 z-10 border-r border-[#cfdaf2] ${
                            isSelectedRow ? 'bg-white font-bold text-[#005f30]' : 'bg-white font-medium text-[#6f7a6f]'
                          }`
                        : isB
                        ? `sticky left-[138px] z-10 border-r border-[#cfdaf2] ${
                            isSelectedRow ? 'bg-white font-bold text-[#005f30]' : 'bg-white font-medium text-[#111c2d]'
                          }`
                        : '';

                      return (
                        <td
                          key={colIdx}
                          className={`px-3 py-3 whitespace-nowrap ${stickyCellClass} ${
                            isCurrentMatchedCell
                              ? 'bg-[#b3f1c5]/80 font-bold text-[#005f30]'
                              : isSelectedRow
                              ? 'text-[#111c2d] font-medium'
                              : 'text-[#3f4940]'
                          }`}
                        >
                          {isSelectedRow ? highlightMatch(cellVal, query) : cellVal}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Row Navigation */}
        <div className="p-3 bg-[#f0f3ff] flex items-center justify-between gap-2 border-t border-[#dee8ff]">
          <div className="flex items-center gap-1.5 font-mono text-[12px] text-[#3f4940]">
            <span className="font-bold text-[#005f30]">{currentRowIndex}</span>
            <span className="text-[#6f7a6f]">/</span>
            <span>{sheet.rowCount} 행</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevRow}
              disabled={currentRowIndex <= 1}
              className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#111c2d] active:scale-95 disabled:opacity-40 transition-all cursor-pointer border border-[#e2e8f0]"
              title="이전 행 (위로 이동)"
            >
              <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
            </button>
            <button
              type="button"
              onClick={handleNextRow}
              disabled={currentRowIndex >= sheet.rowCount}
              className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#111c2d] active:scale-95 disabled:opacity-40 transition-all cursor-pointer border border-[#e2e8f0]"
              title="다음 행 (아래로 이동)"
            >
              <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
            </button>
            <button
              type="button"
              onClick={onOpenJumpModal}
              className="h-8 px-2.5 rounded-lg bg-[#dee8ff] text-[12px] text-[#111c2d] font-semibold flex items-center gap-1 active:scale-95 transition-all cursor-pointer hover:bg-[#cfdaf2]"
            >
              <span className="material-symbols-outlined text-[16px]">vertical_align_center</span>
              <span>행 점프</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row Actions Grid & Bookmark Button */}
      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2">
          {/* Action 1: 셀 복사 */}
          <button
            type="button"
            onClick={handleCopyCell}
            className="h-11 rounded-xl bg-white shadow-sm border border-[#e7eeff] flex items-center justify-center gap-1 text-[#111c2d] text-[12px] font-semibold active:bg-[#f0f3ff] transition-all cursor-pointer hover:shadow"
          >
            <span className="material-symbols-outlined text-[16px] text-[#005f30]">content_copy</span>
            <span>{copyStatus || `셀 복사 (${currentCellAddress})`}</span>
          </button>

          {/* Action 2: 행 CSV 추출 */}
          <button
            type="button"
            onClick={handleExportRowCsv}
            className="h-11 rounded-xl bg-white shadow-sm border border-[#e7eeff] flex items-center justify-center gap-1 text-[#111c2d] text-[12px] font-semibold active:bg-[#f0f3ff] transition-all cursor-pointer hover:shadow"
          >
            <span className="material-symbols-outlined text-[16px] text-[#306947]">download</span>
            <span>행 CSV 추출</span>
          </button>

          {/* Action 3: 원문 열기 */}
          <button
            type="button"
            onClick={() =>
              onOpenZoomModal({
                address: currentCellAddress,
                value: currentCellValue,
                formula: currentFormula,
                type: '텍스트형'
              })
            }
            className="h-11 rounded-xl bg-white shadow-sm border border-[#e7eeff] flex items-center justify-center gap-1 text-[#111c2d] text-[12px] font-semibold active:bg-[#f0f3ff] transition-all cursor-pointer hover:shadow"
          >
            <span className="material-symbols-outlined text-[16px] text-[#3f4940]">launch</span>
            <span>원문 열기</span>
          </button>
        </div>

        {/* Big Bookmark Button */}
        <button
          type="button"
          onClick={handleToggleBookmark}
          className={`w-full h-12 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer ${
            isBookmarked
              ? 'bg-[#005f30] text-white shadow-md'
              : 'bg-[#b3f1c5] text-[#366f4d] hover:bg-[#97f7b1]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bookmark
          </span>
          <span>
            {isBookmarked
              ? `북마크에 저장됨 (${currentRowIndex}행 ${String(sheet.rows[currentRowIndex - 1]?.[0] || '')})`
              : '이 데이터 행 북마크 저장'}
          </span>
        </button>
      </div>
    </div>
  );
};
